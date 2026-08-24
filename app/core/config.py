"""Application settings, read once from the environment."""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Every value this service needs to boot. No default carries a secret."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    environment: str = "development"
    cors_origins: list[str] = ["http://localhost:5173"]

    supabase_url: str
    supabase_secret_key: str
    supabase_jwt_issuer: str = ""

    database_url: str

    anthropic_api_key: str = ""
    anthropic_model: str = "claude-sonnet-5"


@lru_cache
def get_settings() -> Settings:
    """Cached accessor so the environment is parsed once per process."""
    return Settings()
