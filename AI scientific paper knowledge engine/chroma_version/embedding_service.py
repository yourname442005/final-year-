import os
from functools import lru_cache

import requests
from sentence_transformers import SentenceTransformer

from chroma_config import EMBEDDING_DIMENSION, EMBEDDING_MODEL


@lru_cache(maxsize=1)
def get_embedding_model():
    return SentenceTransformer(EMBEDDING_MODEL)


def embed_texts_hf_api(texts, model=EMBEDDING_MODEL):
    """Embed texts using Hugging Face Inference API"""
    hf_token = os.getenv("HF_TOKEN")
    if not hf_token:
        raise ValueError("HF_TOKEN environment variable is required for HF API")
    
    api_url = f"https://api-inference.huggingface.co/pipeline/feature-extraction/{model}"
    headers = {"Authorization": f"Bearer {hf_token}"}
    
    clean_texts = [text if text and text.strip() else "empty document" for text in texts]
    response = requests.post(
        api_url,
        headers=headers,
        json={"inputs": clean_texts, "options": {"wait_for_model": True}},
        timeout=60,
    )
    response.raise_for_status()
    embeddings = response.json()
    
    # Normalize embeddings
    normalized = []
    for emb in embeddings:
        norm = sum(x**2 for x in emb) ** 0.5
        normalized.append([x / norm for x in emb])
    
    return normalized


def embed_texts(texts, batch_size=64, use_hf_api=False):
    if use_hf_api:
        return embed_texts_hf_api(texts)
    
    clean_texts = [text if text and text.strip() else "empty document" for text in texts]
    model = get_embedding_model()
    embeddings = model.encode(
        clean_texts,
        batch_size=batch_size,
        normalize_embeddings=True,
        show_progress_bar=False,
    )
    return embeddings.astype("float32").tolist()


def embed_query(query, use_hf_api=False):
    return embed_texts([query], batch_size=1, use_hf_api=use_hf_api)[0]


def zero_embedding():
    return [0.0] * EMBEDDING_DIMENSION
