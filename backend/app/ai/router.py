"""Legacy AI routes — paths and JSON shapes are FROZEN.

The shipped Next.js frontend calls exactly these five endpoints. They are kept
byte-compatible so wiring the frontend later is a URL change and nothing else.
"""

from __future__ import annotations

from time import perf_counter
from typing import Annotated, Any

from fastapi import APIRouter, Body, Request
from pydantic import BaseModel, Field

from app.ai.service import analyze_draft, chat_assistant, generate_insights, summarize_paper
from app.core.config import settings
from app.core.logging import get_logger

log = get_logger(__name__)

router = APIRouter(prefix="/api", tags=["legacy-ai"])


# ── request/response shapes (mirror the prototype exactly) ──────────────────


class LegacySearchBody(BaseModel):
    query: str = ""
    mode: str = "semantic"
    papers: list[dict[str, Any]] | None = None
    isHttpAccelerated: bool = False


class SummarizeBody(BaseModel):
    title: str
    abstract: str
    authors: list[str] | str | None = None
    venue: str | None = None


class InsightsBody(BaseModel):
    title: str
    abstract: str
    authors: list[str] | str | None = None
    tags: list[str] | str | None = None


class DraftBody(BaseModel):
    title: str
    abstract: str = ""
    venue: str | None = None
    tags: list[str] | None = None
    fileName: str | None = None
    draftText: str | None = None


class ChatBody(BaseModel):
    message: str
    projectContext: dict[str, Any] | None = None
    paperContext: dict[str, Any] | None = None
    conversationHistory: list[dict[str, Any]] = Field(default_factory=list)


def _as_list(value: list[str] | str | None) -> list[str]:
    if value is None:
        return []
    if isinstance(value, str):
        return [value]
    return list(value)


# ── 1. POST /api/search ─────────────────────────────────────────────────────


@router.post("/search")
def legacy_search(body: LegacySearchBody, request: Request) -> dict[str, Any]:
    from app.modules.search.service import SearchService
    from app.db.session import get_session_factory

    started = perf_counter()
    if not body.query or not body.query.strip():
        papers = body.papers or []
        return {
            "results": papers,
            "query": "",
            "mode": body.mode,
            "latencyMs": 12,
            "isHttpAccelerated": body.isHttpAccelerated,
        }

    db = get_session_factory()()
    try:
        response = SearchService(db).search(
            body.query,
            mode=body.mode if body.mode in ("semantic", "keyword", "hybrid") else "hybrid",
            limit=min(len(body.papers) if body.papers else 50, 100),
            use_llm=True,
            is_http_accelerated=body.isHttpAccelerated,
            external_papers=body.papers,
        )
        return {
            "results": [r.model_dump(by_alias=False) for r in response.results],
            "query": response.query,
            "mode": response.mode,
            "queryUnderstanding": response.queryUnderstanding,
            "latencyMs": response.latencyMs,
            "isHttpAccelerated": body.isHttpAccelerated,
            "suggestedSearches": response.suggestedSearches,
            "arms": response.arms,
        }
    finally:
        db.close()


# ── 2. POST /api/summarize ──────────────────────────────────────────────────


@router.post("/summarize")
def legacy_summarize(body: SummarizeBody) -> dict[str, Any]:
    if not body.title or not body.abstract:
        return {"error": "Title and abstract are required"}
    summary = summarize_paper(
        title=body.title,
        abstract=body.abstract,
        authors=_as_list(body.authors),
        venue=body.venue or "",
    )
    # CollectionsView reads `executiveSummary`; PaperDetailModal reads `summary`.
    return {"summary": summary, "executiveSummary": summary}


# ── 3. POST /api/generate-insights ──────────────────────────────────────────


@router.post("/generate-insights")
def legacy_insights(body: InsightsBody) -> dict[str, Any]:
    if not body.title or not body.abstract:
        return {"error": "Title and abstract are required"}
    return generate_insights(
        title=body.title,
        abstract=body.abstract,
        authors=_as_list(body.authors),
        tags=_as_list(body.tags),
    )


# ── 4. POST /api/analyze-draft ──────────────────────────────────────────────


@router.post("/analyze-draft")
def legacy_analyze_draft(body: DraftBody) -> dict[str, Any]:
    if not body.title:
        return {"error": "Manuscript title is required"}
    review = analyze_draft(
        title=body.title,
        abstract=body.abstract,
        venue=body.venue or "",
        tags=body.tags or [],
        file_name=body.fileName or "",
        draft_text=body.draftText or "",
    )
    return {"aiReview": review}


# ── 5. POST /api/chat-assistant ─────────────────────────────────────────────


@router.post("/chat-assistant")
def legacy_chat(body: ChatBody) -> dict[str, Any]:
    if not body.message or not body.message.strip():
        return {"error": "Message text is required"}
    reply, sources = chat_assistant(
        message=body.message,
        project_context=body.projectContext,
        paper_context=body.paperContext,
        conversation_history=body.conversationHistory,
        return_sources=True,
    )
    return {"reply": reply, "sources": sources}


__all__ = ["router", "settings"]
