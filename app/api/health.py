"""Liveness endpoint. No auth, no database, no business logic."""

from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health")
async def health() -> dict[str, str]:
    """Returns the service status, for the platform's health check."""
    return {"status": "ok"}
