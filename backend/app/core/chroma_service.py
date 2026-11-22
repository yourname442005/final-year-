"""ChromaDB Vector & Hybrid Reranking Service for ResearchIQ.

Connects to the persistent ChromaDB vector store, handles query embedding
via ONNX MiniLM (384-d), expands abbreviations, and applies hybrid reranking.
"""

from __future__ import annotations

import json
import os
import re
from functools import lru_cache
from pathlib import Path
from typing import Any

import chromadb
from chromadb.utils.embedding_functions import DefaultEmbeddingFunction

# Path resolution: find the chroma_db directory
_CURRENT_DIR = Path(__file__).resolve().parent
_WORKSPACE_ROOT = _CURRENT_DIR.parent.parent.parent
_DEFAULT_CHROMA_PATH = _WORKSPACE_ROOT / "AI scientific paper knowledge engine" / "chroma_version" / "chroma_db"

CHROMA_PATH = Path(os.getenv("CHROMA_DB_PATH", str(_DEFAULT_CHROMA_PATH))).resolve()


@lru_cache(maxsize=1)
def get_chroma_client() -> chromadb.PersistentClient:
    CHROMA_PATH.mkdir(parents=True, exist_ok=True)
    return chromadb.PersistentClient(path=str(CHROMA_PATH))


@lru_cache(maxsize=1)
def get_embedding_fn() -> DefaultEmbeddingFunction:
    return DefaultEmbeddingFunction()


def get_processed_collection() -> Any:
    client = get_chroma_client()
    return client.get_or_create_collection(
        name="processed_papers",
        embedding_function=get_embedding_fn(),
        metadata={"hnsw:space": "cosine"}
    )


def get_abbreviation_collection() -> Any:
    client = get_chroma_client()
    return client.get_or_create_collection(
        name="abbreviations",
        embedding_function=get_embedding_fn(),
    )


def normalize(text: str) -> str:
    if not text:
        return ""
    text = text.lower().strip()
    return re.sub(r"s\b", "", text)


def parse_list(value: Any) -> list[str]:
    if isinstance(value, list):
        return value
    if not value:
        return []
    try:
        loaded = json.loads(value)
        return loaded if isinstance(loaded, list) else []
    except Exception:
        return []


def get_abbreviation_expansions(query: str) -> list[str]:
    """Check known abbreviations (e.g. LLM -> Large Language Models)."""
    upper_query = query.upper().strip()
    if not upper_query or len(upper_query) < 2 or len(upper_query) > 6:
        return []

    # Fast built-in lookup for immediate response
    BUILTIN_ABBRS = {
        "LLM": ["Large Language Models", "Language Models"],
        "LLMS": ["Large Language Models"],
        "GNN": ["Graph Neural Networks"],
        "GNNS": ["Graph Neural Networks"],
        "NLP": ["Natural Language Processing", "Computational Linguistics"],
        "CV": ["Computer Vision", "3D Scene Understanding"],
        "RL": ["Reinforcement Learning"],
        "RLHF": ["Reinforcement Learning from Human Feedback"],
        "NERF": ["Neural Radiance Fields"],
        "SLAM": ["Simultaneous Localization and Mapping"],
        "VLM": ["Vision-Language Models"],
        "VLMS": ["Vision-Language Models"],
        "DIFFUSION": ["Diffusion Models", "Score-based Generative Models"],
        "TRANSFORMER": ["Transformer Architecture", "Self-Attention"],
    }
    if upper_query in BUILTIN_ABBRS:
        return BUILTIN_ABBRS[upper_query]

    try:
        coll = get_abbreviation_collection()
        res = coll.get(ids=[upper_query], include=["metadatas"])
        metadatas = res.get("metadatas", [])
        if metadatas and metadatas[0]:
            return parse_list(metadatas[0].get("expansions"))
    except Exception:
        pass
    return []


def vector_score_from_distance(distance: float | None) -> float:
    if distance is None:
        return 0.0
    return max(0.0, 1.0 - float(distance))


def lexical_scores(query_terms: list[str], metadata: dict[str, Any]) -> tuple[float, float, float]:
    title_norm = normalize(metadata.get("title", ""))
    keywords = [normalize(v) for v in parse_list(metadata.get("cleaned_keywords"))]
    phrases = [normalize(v) for v in parse_list(metadata.get("important_phrases"))]

    title_score = 0.0
    keyword_score = 0.0
    phrase_score = 0.0

    for term in query_terms:
        q = normalize(term)
        if not q:
            continue
        if q == title_norm:
            title_score = max(title_score, 1.0)
        elif q in title_norm:
            title_score = max(title_score, 0.5)

        if any(q == kw for kw in keywords):
            keyword_score = max(keyword_score, 1.0)

        if any(q == phrase for phrase in phrases):
            phrase_score = max(phrase_score, 1.0)
        elif any(q in phrase for phrase in phrases):
            phrase_score = max(phrase_score, 0.4)

    return title_score, keyword_score, phrase_score


def recency_score(metadata: dict[str, Any]) -> float:
    published = str(metadata.get("published", ""))
    match = re.match(r"(\d{4})", published)
    if not match:
        return 0.5
    year = int(match.group(1))
    return max(0.0, min(1.0, (year - 1990) / 40.0))


def search_chroma(query: str, top_k: int = 20, candidate_k: int = 100) -> list[dict[str, Any]]:
    """Hybrid semantic search using ChromaDB and Reciprocal Rank Fusion / reranking."""
    query = (query or "").strip()
    if not query:
        return []

    collection = get_processed_collection()
    total_papers = collection.count()
    if total_papers == 0:
        return []

    expansions = get_abbreviation_expansions(query)
    expanded_query = " ".join([query] + expansions)

    # 1. Vector similarity search
    embed_fn = get_embedding_fn()
    query_vector = embed_fn([expanded_query])[0]

    n_results = min(candidate_k, total_papers)
    results = collection.query(
        query_embeddings=[query_vector],
        n_results=n_results,
        include=["documents", "metadatas", "distances"],
    )

    # 2. Format candidates
    candidates = []
    ids = results.get("ids", [[]])[0]
    docs = results.get("documents", [[]])[0]
    metas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]

    for i, pid in enumerate(ids):
        candidates.append({
            "id": pid,
            "document": docs[i] if i < len(docs) else "",
            "metadata": metas[i] if i < len(metas) else {},
            "distance": distances[i] if i < len(distances) else 1.0,
        })

    # 3. Hybrid reranking
    query_terms = [query] + expansions
    reranked = []
    for cand in candidates:
        meta = cand["metadata"]
        vec_score = vector_score_from_distance(cand.get("distance"))
        title_sc, kw_sc, phrase_sc = lexical_scores(query_terms, meta)
        freshness = recency_score(meta)

        final_score = (
            0.60 * vec_score
            + 0.15 * title_sc
            + 0.15 * phrase_sc
            + 0.05 * kw_sc
            + 0.05 * freshness
        )
        cand["score"] = round(final_score, 4)
        cand["arms"] = ["vector", "hybrid"]
        reranked.append(cand)

    reranked.sort(key=lambda x: x["score"], reverse=True)
    return reranked[:top_k]


def find_chroma_related(paper_id: str, query_text: str | None = None, top_k: int = 5) -> list[str]:
    """Find semantically related papers using Chroma embeddings."""
    collection = get_processed_collection()
    if collection.count() == 0:
        return []

    try:
        emb = None
        source = collection.get(ids=[paper_id], include=["embeddings"])
        embeddings = source.get("embeddings")
        if embeddings is not None and len(embeddings) > 0 and embeddings[0] is not None:
            emb = embeddings[0]
        elif query_text:
            embed_fn = get_embedding_fn()
            emb = embed_fn([query_text])[0]

        if emb is None:
            return []

        results = collection.query(
            query_embeddings=[emb],
            n_results=top_k + 2,
            include=["documents", "distances"],
        )
        found_ids = results.get("ids", [[]])[0]
        return [pid for pid in found_ids if pid != paper_id][:top_k]
    except Exception:
        return []
