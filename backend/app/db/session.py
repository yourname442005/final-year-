"""Engine, session factory and FastAPI dependency.

Scaling note: Neon/pgbouncer run in *transaction* pooling, so the app keeps a small
pool per process. Read-heavy endpoints can take a session from `get_read_db`.
"""

from __future__ import annotations

from collections.abc import AsyncIterator, Iterator
from contextlib import asynccontextmanager

from sqlalchemy import Engine, create_engine, event
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import QueuePool

from app.core.config import settings
from app.core.logging import get_logger

log = get_logger(__name__)

_engine: Engine | None = None
_read_engine: Engine | None = None
_SessionFactory: sessionmaker[Session] | None = None
_ReadSessionFactory: sessionmaker[Session] | None = None


def _build_engine(url: str, *, is_readonly: bool = False) -> Engine:
    if url.startswith("sqlite"):
        from pathlib import Path
        backend_db = Path(__file__).resolve().parent.parent.parent / "ckgai_dev.db"
        if "ckgai_dev.db" in url and backend_db.exists():
            url = f"sqlite:///{backend_db.resolve().as_posix()}"

    kwargs: dict[str, object] = {
        "pool_pre_ping": True,
        "pool_recycle": 1800,
        "echo": settings.db_echo and not is_readonly,
    }
    if url.startswith("sqlite"):
        kwargs["connect_args"] = {"check_same_thread": False}
    else:
        kwargs["poolclass"] = QueuePool
        kwargs["pool_size"] = settings.db_pool_size
        kwargs["max_overflow"] = settings.db_max_overflow

    engine = create_engine(url, **kwargs)

    if url.startswith("sqlite"):  # FK enforcement for the test suite
        @event.listens_for(engine, "connect")
        def _fk_on(dbapi_conn: object, _record: object) -> None:
            cursor = dbapi_conn.cursor()  # type: ignore[attr-defined]
            cursor.execute("PRAGMA foreign_keys=ON")
            cursor.close()

    return engine


def get_engine() -> Engine:
    global _engine, _SessionFactory
    if _engine is None:
        _engine = _build_engine(settings.database_url)
        _SessionFactory = sessionmaker(bind=_engine, autoflush=False, expire_on_commit=False)
    return _engine


def get_read_engine() -> Engine:
    global _read_engine, _ReadSessionFactory
    if _read_engine is None:
        _read_engine = _build_engine(settings.readonly_url, is_readonly=True)
        _ReadSessionFactory = sessionmaker(
            bind=_read_engine, autoflush=False, expire_on_commit=False
        )
    return _read_engine


def get_session_factory() -> sessionmaker[Session]:
    get_engine()
    assert _SessionFactory is not None
    return _SessionFactory


def get_read_session_factory() -> sessionmaker[Session]:
    get_read_engine()
    assert _ReadSessionFactory is not None
    return _ReadSessionFactory


def get_db() -> Iterator[Session]:
    """Write/read-write dependency. Commit is explicit in services, not implicit."""
    session = get_session_factory()()
    try:
        yield session
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def get_read_db() -> Iterator[Session]:
    session = get_read_session_factory()()
    try:
        yield session
    finally:
        session.close()


@asynccontextmanager
async def session_scope() -> AsyncIterator[Session]:
    """Context manager for workers/scripts that need a session outside a request."""
    session = get_session_factory()()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def dispose_engines() -> None:
    global _engine, _read_engine, _SessionFactory, _ReadSessionFactory
    for eng in (_engine, _read_engine):
        if eng is not None:
            eng.dispose()
    _engine = _read_engine = None
    _SessionFactory = _ReadSessionFactory = None
