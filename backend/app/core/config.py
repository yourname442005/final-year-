"""Application configuration.

Every tunable lives here so there are no magic constants scattered through the codebase.
Values come from environment / `.env` with the defaults documented in `.env.example`.
"""

from __future__ import annotations

import os
from functools import lru_cache
from typing import Literal

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

EncoderName = Literal["specter2", "scibert", "pubmedbert"]
LLMProviderName = Literal["gemini", "openai", "fallback"]
ScorerName = Literal["distmult", "transe", "dot", "mlp"]
SearchMode = Literal["semantic", "keyword", "hybrid"]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    # ── core ────────────────────────────────────────────────────────────
    app_name: str = "AI Scientific Paper Knowledge Engine"
    app_env: Literal["dev", "staging", "prod"] = "dev"
    app_debug: bool = True
    app_base_url: str = "http://localhost:8000"
    cors_origins: list[str] = Field(default=["http://localhost:3000", "http://127.0.0.1:3000"])

    # ── database ────────────────────────────────────────────────────────
    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/ckgai"
    database_url_readonly: str = ""
    db_pool_size: int = 10
    db_max_overflow: int = 20
    db_echo: bool = False

    # ── vector search ───────────────────────────────────────────────────
    embedding_dim: int = 768
    paper_encoder: EncoderName = "specter2"
    passage_encoder: EncoderName = "scibert"
    search_default_mode: SearchMode = "hybrid"
    search_top_k: int = 100
    search_page_size: int = 20
    hnsw_m: int = 16
    hnsw_ef_construction: int = 64
    hnsw_ef_search: int = 100

    # ── graph ───────────────────────────────────────────────────────────
    neo4j_enabled: bool = False
    neo4j_uri: str = "bolt://localhost:7687"
    neo4j_user: str = "neo4j"
    neo4j_password: str = ""
    neo4j_database: str = "neo4j"
    graph_projector_batch: int = 1000

    # ── cache / queue ───────────────────────────────────────────────────
    redis_url: str = "redis://localhost:6379/0"
    cache_enabled: bool = True
    cache_ttl_search: int = 300
    cache_ttl_feed: int = 60
    cache_ttl_query_embedding: int = 86400
    queue_enabled: bool = True

    # ── auth ────────────────────────────────────────────────────────────
    jwt_secret: str = "change-me-in-prod"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    refresh_token_expire_days: int = 30
    dev_auto_login: bool = True

    # ── llm ─────────────────────────────────────────────────────────────
    llm_provider: LLMProviderName = "gemini"
    gemini_api_key: str = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY") or ""
    gemini_model: str = os.environ.get("GEMINI_MODEL") or "gemini-2.5-flash"
    openai_api_key: str = os.environ.get("OPENAI_API_KEY") or ""
    openai_model: str = os.environ.get("OPENAI_MODEL") or "gpt-4o-mini"
    llm_timeout_seconds: int = 30
    llm_max_output_tokens: int = 2048

    # ── ml plane ────────────────────────────────────────────────────────
    ml_enabled: bool = True
    ml_device: Literal["auto", "cpu", "cuda"] = "auto"
    ml_checkpoint_dir: str = "./models/checkpoints"
    ml_ner_model: str = "allenai/scibert_scivocab_uncased"
    ml_relation_model: str = "allenai/scibert_scivocab_uncased"
    ml_entity_resolution_threshold: float = 0.92

    # ── gnn / discovery (spec appendix) ─────────────────────────────────
    gnn_layers: int = 3
    gnn_hidden_dim: int = 256
    gnn_rgc_bases: int = 30
    gnn_gat_heads: int = 8
    gnn_dropout: float = 0.1
    gnn_learning_rate: float = 1e-3
    gnn_batch_size: int = 1024
    gnn_negative_samples: int = 5
    gnn_margin: float = 1.0
    discovery_scorer: ScorerName = "distmult"
    discovery_cross_domain_boost: float = 1.3
    discovery_top_k: int = 100

    # ── ingestion ───────────────────────────────────────────────────────
    arxiv_enabled: bool = True
    pubmed_enabled: bool = True
    semantic_scholar_enabled: bool = True
    semantic_scholar_api_key: str = ""
    ingest_rate_limit_seconds: float = 3.0
    object_storage_url: str = ""

    # ── uploads (manuscript PDFs) ───────────────────────────────────────
    upload_dir: str = "./var/uploads"
    max_upload_bytes: int = 25 * 1024 * 1024

    # ── observability ───────────────────────────────────────────────────
    log_level: str = "INFO"
    log_format: Literal["json", "console"] = "console"
    otel_enabled: bool = False

    @field_validator("cors_origins", mode="before")
    @classmethod
    def _split_origins(cls, v: object) -> object:
        if isinstance(v, str):
            return [o.strip() for o in v.strip("[]").split(",") if o.strip()]
        return v

    @property
    def is_production(self) -> bool:
        return self.app_env == "prod"

    @property
    def readonly_url(self) -> str:
        return self.database_url_readonly or self.database_url

    @property
    def vector_enabled(self) -> bool:
        return "psycopg" in self.database_url or "pgvector" in self.database_url


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
