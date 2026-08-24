"""Supabase JWT verification.

Supabase Auth issues the token; this service only verifies it and reads the
claims. Authorization claims are read from ``app_metadata`` — never from
``user_metadata``, which the user can edit (``06-database.md``).
"""

from dataclasses import dataclass

import jwt
from jwt import PyJWKClient

from app.core.config import get_settings
from app.core.exceptions import UnauthorizedError

Claims = dict[str, object]


@dataclass(frozen=True)
class AuthenticatedUser:
    """The caller, as proved by a verified Supabase access token."""

    id: str
    email: str | None
    claims: Claims


def _jwks_client() -> PyJWKClient:
    settings = get_settings()
    return PyJWKClient(f"{settings.supabase_url}/auth/v1/.well-known/jwks.json")


def verify_token(token: str) -> AuthenticatedUser:
    """Verifies a Supabase access token and returns its subject.

    Raises:
        UnauthorizedError: the token is missing, expired, or not signed by the
            project's key.
    """
    settings = get_settings()
    try:
        signing_key = _jwks_client().get_signing_key_from_jwt(token)
        claims: Claims = jwt.decode(
            token,
            signing_key.key,
            algorithms=["ES256", "RS256"],
            audience="authenticated",
            issuer=settings.supabase_jwt_issuer or f"{settings.supabase_url}/auth/v1",
        )
    except jwt.PyJWTError as error:
        raise UnauthorizedError("Invalid or expired Supabase access token") from error

    subject = claims.get("sub")
    if not isinstance(subject, str):
        raise UnauthorizedError("Token carries no subject claim")

    email = claims.get("email")
    return AuthenticatedUser(
        id=subject,
        email=email if isinstance(email, str) else None,
        claims=claims,
    )
