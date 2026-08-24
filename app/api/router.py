"""Root APIRouter. Every domain router registers here, and only here."""

from fastapi import APIRouter

from app.api import health

api_router = APIRouter()
api_router.include_router(health.router)
