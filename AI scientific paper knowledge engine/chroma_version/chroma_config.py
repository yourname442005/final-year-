import os
from pathlib import Path

import chromadb
from dotenv import load_dotenv


load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
CHROMA_DB_PATH = os.getenv("CHROMA_DB_PATH", "./chroma_db")
CHROMA_RAW_COLLECTION = os.getenv("CHROMA_RAW_COLLECTION", "raw_papers")
CHROMA_PROCESSED_COLLECTION = os.getenv(
    "CHROMA_PROCESSED_COLLECTION",
    "processed_papers",
)
CHROMA_ABBREVIATION_COLLECTION = os.getenv(
    "CHROMA_ABBREVIATION_COLLECTION",
    "abbreviations",
)
EMBEDDING_MODEL = os.getenv(
    "EMBEDDING_MODEL",
    "sentence-transformers/all-MiniLM-L6-v2",
)
EMBEDDING_DIMENSION = 384


def get_chroma_path():
    path = Path(CHROMA_DB_PATH)
    if not path.is_absolute():
        path = BASE_DIR / path
    path.mkdir(parents=True, exist_ok=True)
    return str(path)


def get_client():
    # Prefer CloudClient if cloud credentials are present
    if os.getenv("CHROMA_API_KEY"):
        return chromadb.CloudClient(
            api_key=os.getenv("CHROMA_API_KEY"),
            tenant=os.getenv("CHROMA_TENANT"),
            database=os.getenv("CHROMA_DATABASE"),
        )
    # Fallback to local PersistentClient
    return chromadb.PersistentClient(path=get_chroma_path())


def get_raw_collection():
    return get_client().get_or_create_collection(
        name=CHROMA_RAW_COLLECTION,
        metadata={
            "hnsw:space": "cosine",
            "hnsw:M": 16,
            "hnsw:ef_construction": 100,
            "hnsw:ef_search": 64,
            "schema_version": 1,
        },
    )


def get_processed_collection():
    return get_client().get_or_create_collection(
        name=CHROMA_PROCESSED_COLLECTION,
        metadata={
            "hnsw:space": "cosine",
            "hnsw:M": 16,
            "hnsw:ef_construction": 100,
            "hnsw:ef_search": 64,
            "schema_version": 1,
        },
    )


def get_abbreviation_collection():
    return get_client().get_or_create_collection(
        name=CHROMA_ABBREVIATION_COLLECTION,
        metadata={
            "hnsw:space": "cosine",
            "hnsw:M": 16,
            "hnsw:ef_construction": 100,
            "hnsw:ef_search": 64,
            "schema_version": 1,
        },
    )
