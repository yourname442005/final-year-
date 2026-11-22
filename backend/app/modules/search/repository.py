"""Hybrid retrieval: pgvector ANN + Postgres full-text, fused with Reciprocal Rank Fusion.

All ranking lives here. Dialect-aware: PostgreSQL gets real ANN + tsvector, SQLite
(test suite) degrades to exact cosine in Python and ILIKE — same API, same results
ordering for small corpora.
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field
from typing import Any

import numpy as np
from sqlalchemy import Select, func, or_, select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.paper import Paper
from app.schemas import PaperFilters

RRF_K = 60  # standard constant; keeps fused scores in a stable, comparable range


@dataclass
class RankedPaper:
    paper: Paper
    score: float = 0.0
    cosine: float = 0.0
    arms: list[str] = field(default_factory=list)
    matched_terms: list[str] = field(default_factory=list)
    matched_entities: list[str] = field(default_factory=list)


class SearchRepository:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.dialect = db.get_bind().dialect.name

    # ── public API ──────────────────────────────────────────────────────

    def hybrid(
        self,
        query: str,
        *,
        query_vector: list[float] | None,
        filters: PaperFilters | None,
        mode: str = "hybrid",
        limit: int = 100,
    ) -> list[RankedPaper]:
        candidates: dict[str, RankedPaper] = {}
        arms_used: list[str] = []

        want_vector = mode in ("semantic", "hybrid")
        want_text = mode in ("keyword", "hybrid")

        vector_rank: dict[str, int] = {}
        text_rank: dict[str, int] = {}

        if want_vector:
            rows = self._vector_rank(query, query_vector, filters, limit)
            vector_rank = {pid: i for i, (pid, _) in enumerate(rows)}
            arms_used.append("vector")
            for pid, cosine in rows:
                entry = candidates.setdefault(pid, RankedPaper(paper=None))  # type: ignore[arg-type]
                entry.cosine = cosine
                entry.arms.append("vector")

        if want_text:
            rows = self._text_rank(query, filters, limit)
            text_rank = {pid: i for i, pid in enumerate(rows)}
            arms_used.append("fts")
            for pid in rows:
                entry = candidates.setdefault(pid, RankedPaper(paper=None))  # type: ignore[arg-type]
                if "fts" not in entry.arms:
                    entry.arms.append("fts")

        # ── Reciprocal Rank Fusion ──────────────────────────────────────
        # Scores from cosine and BM25 are not comparable; rank-based fusion
        # sidesteps normalisation entirely.
        fused: dict[str, float] = {}
        for pid in candidates:
            score = 0.0
            if pid in vector_rank:
                score += 1.0 / (RRF_K + vector_rank[pid] + 1)
            if pid in text_rank:
                score += 1.0 / (RRF_K + text_rank[pid] + 1)
            fused[pid] = score

        if not candidates:
            return []

        papers = self._load(candidates.keys())
        out: list[RankedPaper] = []
        terms = [t for t in _terms(query) if t]
        for paper in papers:
            entry = candidates[paper.id]
            entry.paper = paper
            entry.score = fused.get(paper.id, 0.0)
            entry.matched_terms = [t for t in terms if _appears(t, paper)]
            out.append(entry)

        out.sort(key=lambda r: (r.score, r.paper.citation_count), reverse=True)
        for i, r in enumerate(out):
            r.arms = sorted(set(r.arms))
            _ = arms_used, i
        return out[:limit]

    def keyword_only(self, query: str, filters: PaperFilters | None, limit: int) -> list[RankedPaper]:
        ids = self._text_rank(query, filters, limit)
        papers = self._load(ids)
        by_id = {p.id: p for p in papers}
        terms = [t for t in _terms(query) if t]
        out = []
        for i, pid in enumerate(ids):
            if pid not in by_id:
                continue
            paper = by_id[pid]
            out.append(
                RankedPaper(
                    paper=paper,
                    score=1.0 / (RRF_K + i + 1),
                    arms=["fts"],
                    matched_terms=[t for t in terms if _appears(t, paper)],
                )
            )
        return out

    # ── arms ────────────────────────────────────────────────────────────

    def _vector_rank(
        self, query: str, vector: list[float] | None, filters: PaperFilters | None, limit: int
    ) -> list[tuple[str, float]]:
        # 1. Try ChromaDB persistent vector search + hybrid reranker
        try:
            from app.core.chroma_service import search_chroma
            chroma_matches = search_chroma(query, top_k=limit)
            if chroma_matches:
                ext_ids = [c["id"] for c in chroma_matches]
                papers = list(self.db.scalars(select(Paper).where(Paper.external_id.in_(ext_ids))).all())
                by_ext = {p.external_id: p.id for p in papers}
                ranked = []
                for c in chroma_matches:
                    pid = by_ext.get(c["id"])
                    if pid:
                        ranked.append((pid, float(c.get("score", 0.5))))
                if ranked:
                    return ranked
        except Exception:
            pass

        if not vector:
            return []

        stmt = select(Paper.id, Paper.embedding).where(Paper.embedding.is_not(None))
        stmt = _apply_filters(stmt, filters)

        if self.dialect == "postgresql":
            # <=> is pgvector cosine distance; similarity = 1 - distance.
            distance = Paper.embedding.cosine_distance(vector)  # type: ignore[attr-defined]
            stmt = stmt.order_by(distance).limit(limit)
            rows = self.db.execute(stmt).all()
            return [(r[0], max(0.0, 1.0 - float(r[1]))) for r in rows if r[1] is not None]

        # SQLite / no-pgvector: exact cosine over the (small) corpus.
        stmt = _apply_filters(select(Paper).where(Paper.embedding.is_not(None)), filters)
        best: list[tuple[str, float]] = []
        q = np.asarray(vector, dtype=np.float64)
        qn = float(np.linalg.norm(q)) or 1.0
        for paper in self.db.scalars(stmt.limit(5000)).all():
            try:
                e = np.asarray(paper.embedding, dtype=np.float64)
            except (TypeError, ValueError):
                continue
            if e.shape != q.shape or e.size == 0:
                continue
            denom = float(np.linalg.norm(e)) * qn
            if denom == 0:
                continue
            best.append((paper.id, float(np.dot(q, e) / denom)))
        best.sort(key=lambda t: t[1], reverse=True)
        return best[:limit]

    def _text_rank(self, query: str, filters: PaperFilters | None, limit: int) -> list[str]:
        stmt = select(Paper.id)
        stmt = _apply_filters(stmt, filters)
        terms = _terms(query)
        try:
            from app.core.chroma_service import get_abbreviation_expansions
            for exp in get_abbreviation_expansions(query):
                for t in _terms(exp):
                    if t and t not in terms:
                        terms.append(t)
        except Exception:
            pass

        if self.dialect == "postgresql" and terms:
            tsquery = func.plainto_tsquery("english", query)
            stmt = stmt.where(Paper.search_tsv.op("@@")(tsquery))  # type: ignore[operator]
            stmt = stmt.order_by(func.ts_rank(Paper.search_tsv, tsquery).desc())
            return list(self.db.scalars(stmt.limit(limit)).all())

        if not terms:
            return []
        # Portable fallback: every term must appear somewhere (AND semantics).
        for term in terms:
            like = f"%{term}%"
            stmt = stmt.where(
                or_(Paper.title.ilike(like), Paper.abstract.ilike(like), Paper.venue.ilike(like))
            )
        stmt = stmt.order_by(Paper.citation_count.desc())
        return list(self.db.scalars(stmt.limit(limit)).all())

    def _load(self, ids: Any) -> list[Paper]:
        ids = list(ids)
        if not ids:
            return []
        rows = self.db.scalars(select(Paper).where(Paper.id.in_(ids))).all()
        by_id = {p.id: p for p in rows}
        return [by_id[i] for i in ids if i in by_id]

    def count(self, filters: PaperFilters | None) -> int:
        stmt = _apply_filters(select(Paper), filters)
        return int(self.db.scalar(select(func.count()).select_from(stmt.subquery())) or 0)


def _apply_filters(stmt: Select[Any], filters: PaperFilters | None) -> Select[Any]:
    if filters is None:
        return stmt
    if filters.tag:
        from app.models.paper import PaperTag

        stmt = stmt.where(Paper.id.in_(select(PaperTag.paper_id).where(PaperTag.tag == filters.tag)))
    if filters.year is not None:
        stmt = stmt.where(Paper.year == filters.year)
    if filters.openAccess is not None:
        stmt = stmt.where(Paper.open_access.is_(bool(filters.openAccess)))
    if filters.minCitations:
        stmt = stmt.where(Paper.citation_count >= int(filters.minCitations))
    return stmt


def _terms(query: str) -> list[str]:
    stop = {
        "the", "a", "an", "of", "for", "and", "or", "in", "on", "to", "with",
        "is", "are", "using", "use", "via", "by", "from", "that", "this", "how",
    }
    seen: list[str] = []
    for w in query.lower().split():
        w = "".join(ch for ch in w if ch.isalnum() or ch in "-_")
        if len(w) > 2 and w not in stop and w not in seen:
            seen.append(w)
    return seen


def _appears(term: str, paper: Paper) -> bool:
    t = term.lower()
    if t in paper.title.lower() or t in paper.abstract.lower():
        return True
    return any(t in str(tag).lower() for tag in (paper.tags or []))


def rrf_fuse(rankings: dict[str, list[str]], k: int = RRF_K) -> dict[str, float]:
    """Pure RRF over `{arm: [doc_id, ...]}` — exposed for unit testing."""
    scores: dict[str, float] = {}
    for ranking in rankings.values():
        for i, doc_id in enumerate(ranking):
            scores[doc_id] = scores.get(doc_id, 0.0) + 1.0 / (k + i + 1)
    return scores


def citation_prior(year: int, citations: int) -> float:
    """Small, bounded prior so a highly-cited recent paper outranks an obscure old one."""
    recency = 1.0 / (1.0 + max(0, 2026 - year) * 0.15)
    impact = math.log1p(max(0, citations)) / 8.0
    return max(0.0, min(1.0, 0.6 * recency + 0.4 * min(1.0, impact)))
