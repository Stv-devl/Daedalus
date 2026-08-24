"""Async SQLAlchemy session over the Supabase Postgres instance.

Supabase owns the schema (``06-database.md``): this service reads and writes,
it never migrates. There is no Alembic in this repo.
"""

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import get_settings

_settings = get_settings()

engine = create_async_engine(_settings.database_url, pool_pre_ping=True)

session_factory = async_sessionmaker(engine, expire_on_commit=False)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency yielding one session per request."""
    async with session_factory() as db:
        yield db
