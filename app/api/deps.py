"""Shared FastAPI dependencies. HTTP lives here, never in ``services/``."""

from typing import Annotated

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import AuthenticatedUser, verify_token
from app.core.database import get_db
from app.core.exceptions import UnauthorizedError

DbSession = Annotated[AsyncSession, Depends(get_db)]


def get_current_user(
    authorization: Annotated[str | None, Header()] = None,
) -> AuthenticatedUser:
    """Resolves the caller from the ``Authorization: Bearer <token>`` header."""
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "unauthorized", "message": "Missing bearer token"},
        )

    try:
        return verify_token(authorization.split(" ", 1)[1])
    except UnauthorizedError as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": error.code, "message": error.message},
        ) from error


CurrentUser = Annotated[AuthenticatedUser, Depends(get_current_user)]
