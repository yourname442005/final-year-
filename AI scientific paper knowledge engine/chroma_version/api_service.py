from pathlib import Path

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from chroma_config import get_chroma_path, get_processed_collection, get_raw_collection
from collection_manager import collection_status
from nountotokenclean_chroma import import_processed_json, process_raw_papers
from paper_chroma import fetch_arxiv_abstracts, import_raw_json
from ranking_service import rebuild_abbreviations_from_processed_collection
from search_engine_chroma import get_paper, list_papers, related_papers, search_papers


app = FastAPI(
    title="AI Scientific Paper Knowledge Engine - ChromaDB Backend",
    version="1.0.0",
)


class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1)
    top_k: int = Field(default=5, ge=1, le=50)
    candidate_k: int = Field(default=50, ge=1, le=500)


class IngestRequest(BaseModel):
    source: str = Field(default="arxiv", pattern="^(arxiv|local_json)$")
    total_records: int = Field(default=5000, ge=1, le=50000)
    raw_json_path: str | None = None
    processed_json_path: str | None = None
    reset: bool = True
    process_after_ingest: bool = True


@app.get("/health")
def health():
    return {
        "status": "ok",
        "storage": "chromadb",
        "persistent_path": get_chroma_path(),
    }


@app.get("/collection-status")
def get_collection_status():
    return collection_status()


@app.get("/stats")
def stats():
    return {
        "raw_papers": get_raw_collection().count(),
        "processed_papers": get_processed_collection().count(),
        "storage": "chromadb",
    }


@app.post("/search")
def search(request: SearchRequest):
    return {
        "query": request.query,
        "results": search_papers(
            request.query,
            top_k=request.top_k,
            candidate_k=request.candidate_k,
        ),
    }


@app.get("/paper/{paper_id}")
def paper(paper_id: str):
    record = get_paper(paper_id)
    if not record:
        raise HTTPException(status_code=404, detail="Paper not found")
    return record


@app.get("/papers")
def papers(limit: int = 20, offset: int = 0):
    if limit < 1 or limit > 200:
        raise HTTPException(status_code=400, detail="limit must be between 1 and 200")
    if offset < 0:
        raise HTTPException(status_code=400, detail="offset must be non-negative")
    return {"items": list_papers(limit=limit, offset=offset)}


@app.get("/related/{paper_id}")
def related(paper_id: str, top_k: int = 5):
    if top_k < 1 or top_k > 50:
        raise HTTPException(status_code=400, detail="top_k must be between 1 and 50")
    results = related_papers(paper_id, top_k=top_k)
    if not results:
        raise HTTPException(status_code=404, detail="Paper not found or no related papers")
    return {"paper_id": paper_id, "results": results}


@app.post("/ingest")
def ingest(request: IngestRequest):
    if request.source == "arxiv":
        raw_papers = fetch_arxiv_abstracts(
            total_records=request.total_records,
            reset=request.reset,
        )
        processed_count = 0
        if request.process_after_ingest:
            processed_count = len(process_raw_papers(reset=request.reset))
    else:
        if not request.raw_json_path and not request.processed_json_path:
            raise HTTPException(
                status_code=400,
                detail="local_json ingest requires raw_json_path or processed_json_path",
            )
        raw_count = 0
        processed_count = 0
        if request.raw_json_path:
            raw_count = len(import_raw_json(Path(request.raw_json_path), reset=request.reset))
        if request.processed_json_path:
            processed_count = len(
                import_processed_json(
                    Path(request.processed_json_path),
                    reset=request.reset,
                )
            )
        elif request.process_after_ingest:
            processed_count = len(process_raw_papers(reset=request.reset))
        raw_papers = [None] * raw_count

    abbreviation_count = rebuild_abbreviations_from_processed_collection(
        get_processed_collection()
    )
    return {
        "raw_count": len(raw_papers),
        "processed_count": processed_count,
        "abbreviation_count": abbreviation_count,
        "collections": collection_status(),
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("api_service:app", host="127.0.0.1", port=8000, reload=False)
