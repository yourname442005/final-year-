#!/usr/bin/env python3
"""Populate ChromaDB processed_papers collection with papers from SQLite or JSON."""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path

# Paths
scripts_dir = Path(__file__).resolve().parent
backend_dir = scripts_dir.parent
workspace_dir = backend_dir.parent
sys.path.insert(0, str(backend_dir))

from app.core.chroma_service import get_processed_collection, get_embedding_fn


def main():
    json_path = workspace_dir / "AI scientific paper knowledge engine" / "after_cleaning_final_research_data.json"
    if not json_path.exists():
        print(f"Error: {json_path} not found")
        return

    print("Loading papers from dataset...")
    with open(json_path, "r", encoding="utf-8") as f:
        papers = json.load(f)

    collection = get_processed_collection()
    initial_count = collection.count()
    print(f"Initial Chroma papers: {initial_count}")

    # We will index up to 1,000 top papers initially for ultra-fast startup,
    # or all if needed. 1,000 papers provides deep semantic diversity across all categories.
    limit = 1000
    papers_to_index = papers[:limit]
    print(f"Indexing {len(papers_to_index)} papers with ONNX MiniLM embeddings...")

    batch_size = 100
    for i in range(0, len(papers_to_index), batch_size):
        chunk = papers_to_index[i:i + batch_size]
        ids = []
        documents = []
        metadatas = []

        for p in chunk:
            raw_id = p.get("id", "")
            ext_id = raw_id.split("/abs/")[-1] if "/abs/" in raw_id else raw_id
            title = p.get("title", "").strip().replace("\n", " ")
            abstract = p.get("abstract", "").strip()
            keywords = p.get("cleaned_keywords", [])[:8]
            phrases = p.get("important_phrases", [])[:6]
            categories = p.get("categories", ["cs.AI"])

            doc_text = f"{title}. {abstract[:400]}. Keywords: {', '.join(keywords)}. Concepts: {', '.join(phrases)}."
            
            ids.append(ext_id)
            documents.append(doc_text)
            metadatas.append({
                "title": title[:300],
                "abstract": abstract[:500],
                "primary_category": p.get("primary_category", "cs.AI"),
                "categories": json.dumps(categories),
                "cleaned_keywords": json.dumps(keywords),
                "important_phrases": json.dumps(phrases),
                "published": str(p.get("published", "")),
                "url": str(p.get("url", "")),
                "pdf_url": str(p.get("pdf_url", "")),
            })

        # Upsert in Chroma
        collection.upsert(
            ids=ids,
            documents=documents,
            metadatas=metadatas,
        )
        print(f"  Indexed {min(i + batch_size, len(papers_to_index))}/{len(papers_to_index)} papers into ChromaDB...", flush=True)

    print(f"ChromaDB indexing complete! Total processed_papers in Chroma: {collection.count()}", flush=True)


if __name__ == "__main__":
    main()
