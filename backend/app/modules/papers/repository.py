"""SQL-only data access for the paper catalog.

Rule: this layer never imports FastAPI or knows about HTTP. It also never
commits — transaction ownership belongs to the service.
"""

from __future__ import annotations

from collections.abc import Sequence
from typing import Any

from sqlalchemy import Select, and_, func, or_, select
from sqlalchemy.orm import Session

from app.core.pagination import Cursor, PageParams
from app.models.paper import Paper, PaperTag, RelatedPaper, SavedPaper
from app.schemas import PaperFilters


def _apply_filters(stmt: Select[Any], f: PaperFilters) -> Select[Any]:
    if f.tag:
        stmt = stmt.where(
            Paper.id.in_(select(PaperTag.paper_id).where(PaperTag.tag == f.tag))
        )
    if f.year is not None:
        stmt = stmt.where(Paper.year == f.year)
    if f.openAccess is not None:
        stmt = stmt.where(Paper.open_access.is_(bool(f.openAccess)))
    if f.minCitations:
        stmt = stmt.where(Paper.citation_count >= int(f.minCitations))
    if f.q:
        like = f"%{f.q.strip()}%"
        stmt = stmt.where(
            or_(
                Paper.title.ilike(like),
                Paper.abstract.ilike(like),
                Paper.venue.ilike(like),
                Paper.doi.ilike(like),
            )
        )
    return stmt


def _apply_sort(stmt: Select[Any], sort: str) -> Select[Any]:
    if sort == "citations":
        return stmt.order_by(Paper.citation_count.desc(), Paper.id.desc())
    if sort == "newest":
        return stmt.order_by(Paper.year.desc(), Paper.created_at.desc(), Paper.id.desc())
    if sort == "year":
        return stmt.order_by(Paper.year.desc(), Paper.citation_count.desc(), Paper.id.desc())
    # relevance default = citation prior + recency (deterministic without a query)
    return stmt.order_by(
        Paper.citation_count.desc(), Paper.year.desc(), Paper.id.desc()
    )


def _keyset(stmt: Select[Any], cursor: Cursor | None) -> Select[Any]:
    """Offset-free pagination: `(sort_key, id) > (cursor.k, cursor.i)`."""
    if cursor is None or cursor.i is None:
        return stmt
    return stmt.where(
        or_(
            Paper.citation_count < int(cursor.k or 0),
            and_(Paper.citation_count == int(cursor.k or 0), Paper.id > cursor.i),
        )
    )


class PaperRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    # ── reads ───────────────────────────────────────────────────────────

    def list_papers(self, filters: PaperFilters, page: PageParams) -> tuple[list[Paper], int]:
        total = self.db.scalar(
            select(func.count()).select_from(
                _apply_filters(select(Paper), filters).subquery()
            )
        ) or 0

        stmt = _apply_filters(select(Paper), filters)
        stmt = _apply_sort(stmt, filters.sort)
        if filters.sort in ("relevance", "citations"):
            stmt = _keyset(stmt, page.cursor)
        elif page.cursor and page.cursor.i:
            stmt = stmt.where(Paper.id > page.cursor.i)

        rows = list(self.db.scalars(stmt.limit(page.limit + 1)).all())
        return rows, int(total)

    def get(self, paper_id: str) -> Paper | None:
        return self.db.get(Paper, paper_id)

    def get_many(self, paper_ids: Sequence[str]) -> list[Paper]:
        if not paper_ids:
            return []
        rows = self.db.scalars(select(Paper).where(Paper.id.in_(list(paper_ids)))).all()
        by_id = {p.id: p for p in rows}
        return [by_id[pid] for pid in paper_ids if pid in by_id]

    def related(self, paper_id: str, limit: int = 3) -> list[Paper]:
        """SPECTER2 / ChromaDB neighbours, with domain/category fallback."""
        stmt = (
            select(Paper)
            .join(RelatedPaper, RelatedPaper.related_to_id == Paper.id)
            .where(RelatedPaper.paper_id == paper_id)
            .order_by(RelatedPaper.score.desc())
            .limit(limit)
        )
        rows = list(self.db.scalars(stmt).all())
        if rows:
            return rows

        seed = self.db.get(Paper, paper_id)
        if seed is None:
            return []

        # 1. Try ChromaDB semantic similarity search
        try:
            from app.core.chroma_service import find_chroma_related
            lookup_id = seed.external_id or seed.id
            query_text = f"{seed.title}. {seed.abstract}" if seed.title else None
            chroma_matches = find_chroma_related(lookup_id, query_text=query_text, top_k=limit)
            if chroma_matches:
                papers = list(self.db.scalars(
                    select(Paper).where(Paper.external_id.in_(chroma_matches))
                ).all())
                if papers:
                    return papers[:limit]
        except Exception:
            pass

        # 2. SQLite / dialect-safe domain & category overlap fallback
        if seed.domain:
            domain_matches = list(self.db.scalars(
                select(Paper)
                .where(Paper.id != paper_id, Paper.domain == seed.domain)
                .order_by(Paper.citation_count.desc())
                .limit(limit)
            ).all())
            if domain_matches:
                return domain_matches

        # 3. Fallback to top cited papers
        return list(
            self.db.scalars(
                select(Paper)
                .where(Paper.id != paper_id)
                .order_by(Paper.citation_count.desc())
                .limit(limit)
            ).all()
        )

    def all_tags(self) -> list[str]:
        rows = self.db.scalars(select(PaperTag.tag).distinct()).all()
        return sorted({r for r in rows if r})

    # ── saved library ───────────────────────────────────────────────────

    def is_saved(self, user_id: str, paper_id: str) -> bool:
        return (
            self.db.scalar(
                select(SavedPaper.id).where(
                    SavedPaper.user_id == user_id, SavedPaper.paper_id == paper_id
                )
            )
            is not None
        )

    def saved_ids(self, user_id: str) -> list[str]:
        return list(
            self.db.scalars(
                select(SavedPaper.paper_id).where(SavedPaper.user_id == user_id)
            ).all()
        )

    def save(self, user_id: str, paper_id: str) -> bool:
        """Idempotent. Returns True when a new row was created."""
        if self.is_saved(user_id, paper_id):
            return False
        self.db.add(SavedPaper(user_id=user_id, paper_id=paper_id))
        return True

    def unsave(self, user_id: str, paper_id: str) -> bool:
        row = self.db.scalar(
            select(SavedPaper).where(
                SavedPaper.user_id == user_id, SavedPaper.paper_id == paper_id
            )
        )
        if row is None:
            return False
        self.db.delete(row)
        return True

    def list_saved(
        self, user_id: str, query: str | None, page: PageParams
    ) -> tuple[list[Paper], int]:
        base = select(Paper).join(SavedPaper, SavedPaper.paper_id == Paper.id).where(
            SavedPaper.user_id == user_id
        )
        if query:
            like = f"%{query.strip()}%"
            base = base.where(
                or_(
                    Paper.title.ilike(like),
                    Paper.abstract.ilike(like),
                    Paper.venue.ilike(like),
                )
            )
        total = self.db.scalar(
            select(func.count()).select_from(base.subquery())
        ) or 0

        stmt = base.order_by(SavedPaper.created_at.desc(), Paper.id.desc())
        if page.cursor and page.cursor.i:
            stmt = stmt.where(Paper.id < page.cursor.i)
        rows = list(self.db.scalars(stmt.limit(page.limit + 1)).all())
        return rows, int(total)

    # ── writes ──────────────────────────────────────────────────────────

    def set_ai_fields(self, paper: Paper, **fields: Any) -> None:
        for key, value in fields.items():
            setattr(paper, key, value)
