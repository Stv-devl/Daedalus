"""FastAPI application: middlewares, exception handlers, router registration."""

import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.router import api_router
from app.core.config import get_settings
from app.core.exceptions import ServiceError

logger = logging.getLogger(__name__)

settings = get_settings()

app = FastAPI(title="Daedalus Agents", version="0.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(ServiceError)
async def service_error_handler(_: Request, error: ServiceError) -> JSONResponse:
    """Converts a business failure into the wire shape the front end expects.

    The body carries the machine-readable ``code`` and the technical English
    ``message``; the user-facing French copy is picked from the code by
    ``src/lib/userMessages.ts``.
    """
    logger.error("[%s] %s", error.code, error.message)
    return JSONResponse(
        status_code=error.status_code,
        content={"code": error.code, "message": error.message},
    )


app.include_router(api_router)
