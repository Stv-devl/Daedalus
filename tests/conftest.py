"""Shared pytest fixtures.

``tests/`` mirrors ``app/`` (``patterns/pytest-backend.md``), and
``tests/services/`` is the frozen, test-first half — ruff's ``extend-exclude``
keeps a shell-side reformat away from it.
"""

import os
from collections.abc import Iterator

import pytest

os.environ.setdefault("SUPABASE_URL", "http://127.0.0.1:54321")
os.environ.setdefault("SUPABASE_SECRET_KEY", "test-secret-key")
os.environ.setdefault("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@127.0.0.1:54322/postgres")


@pytest.fixture
def anyio_backend() -> str:
    return "asyncio"


@pytest.fixture(autouse=True)
def _clear_settings_cache() -> Iterator[None]:
    from app.core.config import get_settings

    get_settings.cache_clear()
    yield
    get_settings.cache_clear()
