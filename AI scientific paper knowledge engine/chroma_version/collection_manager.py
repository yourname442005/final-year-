import hashlib
import json
import re
from datetime import datetime, timezone

from chroma_config import (
    CHROMA_ABBREVIATION_COLLECTION,
    CHROMA_PROCESSED_COLLECTION,
    CHROMA_RAW_COLLECTION,
    EMBEDDING_DIMENSION,
    EMBEDDING_MODEL,
    get_abbreviation_collection,
    get_client,
    get_processed_collection,
    get_raw_collection,
)
from embedding_service import embed_texts, zero_embedding


LIST_FIELDS = {"authors", "categories", "cleaned_keywords", "important_phrases"}


def utc_now():
    return datetime.now(timezone.utc).isoformat()


def extract_paper_id(paper):
    for key in ("id", "paper_id", "url"):
        value = paper.get(key)
        if value:
            match = re.search(r"arxiv\.org/(?:abs|pdf)/([^?#]+)", str(value))
            if match:
                return match.group(1).replace(".pdf", "")
            return str(value).strip()
    digest = hashlib.sha256(
        f"{paper.get('title', '')}|{paper.get('published', '')}".encode("utf-8")
    ).hexdigest()
    return f"paper-{digest[:16]}"


def json_dumps(value):
    return json.dumps(value, ensure_ascii=True, sort_keys=True)


def json_loads(value, default):
    if value in (None, ""):
        return default
    try:
        return json.loads(value)
    except (TypeError, json.JSONDecodeError):
        return default


# Chroma Cloud free tier limits each metadata value to ~8,182 bytes
CHROMA_MAX_METADATA_BYTES = 8000


def _truncate_value(value):
    """Truncate a string metadata value to fit within Chroma Cloud quota."""
    if isinstance(value, str) and len(value.encode("utf-8")) > CHROMA_MAX_METADATA_BYTES:
        encoded = value.encode("utf-8")[:CHROMA_MAX_METADATA_BYTES]
        return encoded.decode("utf-8", errors="ignore").rstrip()
    return value


def metadata_value(value):
    if value is None:
        return ""
    if isinstance(value, (list, dict)):
        return _truncate_value(json_dumps(value))
    if isinstance(value, (str, int, float, bool)):
        return _truncate_value(value) if isinstance(value, str) else value
    return _truncate_value(str(value))


def sanitize_metadata(paper, processed=False):
    metadata = {}
    for key, value in paper.items():
        if key.startswith("_"):
            continue
        metadata[key] = metadata_value(value)

    paper_id = extract_paper_id(paper)
    metadata["paper_id"] = paper_id
    metadata["schema_version"] = 1

    if processed:
        metadata["embedding_model"] = EMBEDDING_MODEL
        metadata["embedding_dim"] = EMBEDDING_DIMENSION
        metadata["processed_at"] = metadata.get("processed_at") or utc_now()
        metadata["embedding_text_hash"] = hashlib.sha256(
            build_processed_document(paper).encode("utf-8")
        ).hexdigest()
    else:
        metadata["ingested_at"] = metadata.get("ingested_at") or utc_now()

    return metadata


def hydrate_metadata(metadata):
    hydrated = dict(metadata or {})
    for field in LIST_FIELDS:
        hydrated[field] = json_loads(hydrated.get(field), [])
    return hydrated


def build_raw_document(paper):
    return "\n\n".join(
        [
            f"Title: {paper.get('title', '')}",
            f"Abstract: {paper.get('abstract', '')}",
            f"URL: {paper.get('url', '')}",
        ]
    ).strip()


def build_processed_document(paper):
    keywords = paper.get("cleaned_keywords", [])
    phrases = paper.get("important_phrases", [])
    if isinstance(keywords, str):
        keywords = json_loads(keywords, [])
    if isinstance(phrases, str):
        phrases = json_loads(phrases, [])

    return "\n\n".join(
        [
            f"Title: {paper.get('title', '')}",
            f"Abstract: {paper.get('abstract', '')}",
            f"Keywords: {', '.join(keywords)}",
            f"Important phrases: {', '.join(phrases)}",
            f"Categories: {paper.get('categories', '')}",
        ]
    ).strip()


def reset_collection(collection_name):
    client = get_client()
    existing = {collection.name for collection in client.list_collections()}
    if collection_name in existing:
        client.delete_collection(collection_name)
    if collection_name == CHROMA_RAW_COLLECTION:
        return get_raw_collection()
    if collection_name == CHROMA_PROCESSED_COLLECTION:
        return get_processed_collection()
    if collection_name == CHROMA_ABBREVIATION_COLLECTION:
        return get_abbreviation_collection()
    return client.get_or_create_collection(
        name=collection_name,
        metadata={"hnsw:space": "cosine", "schema_version": 1},
    )


def batched(items, batch_size):
    for index in range(0, len(items), batch_size):
        yield items[index : index + batch_size]


def upsert_raw_papers(papers, reset=False, batch_size=128):
    collection = reset_collection(CHROMA_RAW_COLLECTION) if reset else get_raw_collection()
    total = 0
    for batch in batched(papers, batch_size):
        ids = [extract_paper_id(paper) for paper in batch]
        documents = [build_raw_document(paper) for paper in batch]
        metadatas = [sanitize_metadata(paper, processed=False) for paper in batch]
        embeddings = [zero_embedding() for _ in batch]
        collection.upsert(
            ids=ids,
            documents=documents,
            metadatas=metadatas,
            embeddings=embeddings,
        )
        total += len(batch)
    return total


def upsert_processed_papers(papers, reset=False, batch_size=64):
    collection = (
        reset_collection(CHROMA_PROCESSED_COLLECTION)
        if reset
        else get_processed_collection()
    )
    total = 0
    for batch in batched(papers, batch_size):
        ids = [extract_paper_id(paper) for paper in batch]
        documents = [build_processed_document(paper) for paper in batch]
        metadatas = [sanitize_metadata(paper, processed=True) for paper in batch]
        embeddings = embed_texts(documents, batch_size=batch_size)
        collection.upsert(
            ids=ids,
            documents=documents,
            metadatas=metadatas,
            embeddings=embeddings,
        )
        total += len(batch)
    return total


def get_all_records(collection, include_embeddings=False, batch_size=200):
    count = collection.count()
    include = ["documents", "metadatas"]
    if include_embeddings:
        include.append("embeddings")

    records = []
    for offset in range(0, count, batch_size):
        result = collection.get(
            limit=batch_size,
            offset=offset,
            include=include,
        )
        for index, record_id in enumerate(result.get("ids", [])):
            record = {
                "id": record_id,
                "document": result.get("documents", [None])[index],
                "metadata": hydrate_metadata(result.get("metadatas", [{}])[index]),
            }
            if include_embeddings:
                record["embedding"] = result.get("embeddings", [None])[index]
            records.append(record)
    return records


def format_chroma_result(result, include_embeddings=False):
    ids = result.get("ids", [])
    if ids and isinstance(ids[0], list):
        ids = ids[0]
        documents = result.get("documents", [[]])[0]
        metadatas = result.get("metadatas", [[]])[0]
        distances = result.get("distances", [[]])[0]
        embeddings = result.get("embeddings", [[]])[0] if include_embeddings else []
    else:
        documents = result.get("documents", [])
        metadatas = result.get("metadatas", [])
        distances = result.get("distances", [])
        embeddings = result.get("embeddings", []) if include_embeddings else []

    records = []
    for index, record_id in enumerate(ids):
        record = {
            "id": record_id,
            "document": documents[index] if index < len(documents) else "",
            "metadata": hydrate_metadata(metadatas[index] if index < len(metadatas) else {}),
            "distance": distances[index] if index < len(distances) else None,
        }
        if include_embeddings:
            record["embedding"] = embeddings[index] if index < len(embeddings) else None
        records.append(record)
    return records


def collection_status():
    client = get_client()
    names = {collection.name for collection in client.list_collections()}
    status = {}
    for name, getter in (
        (CHROMA_RAW_COLLECTION, get_raw_collection),
        (CHROMA_PROCESSED_COLLECTION, get_processed_collection),
        (CHROMA_ABBREVIATION_COLLECTION, get_abbreviation_collection),
    ):
        status[name] = getter().count() if name in names else 0
    return status
