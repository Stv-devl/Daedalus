"""SQLAlchemy declarative base and the mixins every table reuses.

The tables themselves are created by Supabase migrations
(``/database:migration``); these classes only map them.
"""

import uuid
from datetime import datetime

from sqlalchemy import DateTime, String, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


def uuid4_str() -> str:
    """Primary-key default, matching Postgres ``gen_random_uuid()``."""
    return str(uuid.uuid4())


class Base(DeclarativeBase):
    """Declarative base for every ORM model."""


class TimestampMixin:
    """``created_at`` / ``updated_at``, filled by the database."""

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class OwnerMixin:
    """The isolation key. Every query on a table carrying it filters on it."""

    user_id: Mapped[str] = mapped_column(String, index=True)
