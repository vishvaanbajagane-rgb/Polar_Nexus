from functools import lru_cache
from typing import List
from urllib.parse import quote_plus

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    PROJECT_NAME: str = "Polar Nexus Integrated Science Portal"
    API_V1_PREFIX: str = "/api/v1"
    ENVIRONMENT: str = "development"

    # Database
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "polar_nexus"
    DB_USER: str = "postgres"
    DB_PASSWORD: str = "postgres"

    # Security
    SECRET_KEY: str = "change-me-super-secret-key-min-32-characters-long"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    # CORS (comma separated list of origins)
    BACKEND_CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

    # MapTiler
    MAPTILER_API_KEY: str = "lBIA21m3wp6Pjwj3WrDX"

    # Bootstrap admin
    ADMIN_EMAIL: str = "admin@polarnexus.gov.in"
    ADMIN_PASSWORD: str = "PolarNexus@Admin2026!SecureKey#9876"
    ADMIN_FULL_NAME: str = "Polar Nexus Administrator"

    # Redis / Celery
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"
    REDIS_CACHE_URL: str = "redis://localhost:6379/1"
    CACHE_TTL_SECONDS: int = 300

    # Scheduling
    ENABLE_SCHEDULER: bool = True
    DAILY_UPDATE_HOUR: int = 2
    DAILY_UPDATE_MINUTE: int = 30

    # External data sources
    NSIDC_API_URL: str = "https://nsidc.org/api"
    NOAA_API_URL: str = "https://www.ncei.noaa.gov/access/services/data/v1"
    ORCID_API_URL: str = "https://pub.orcid.org/v3.0"
    CROSSREF_API_URL: str = "https://api.crossref.org"
    SEMANTIC_SCHOLAR_API_URL: str = "https://api.semanticscholar.org/graph/v1"
    EXTERNAL_HTTP_TIMEOUT: int = 20

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.BACKEND_CORS_ORIGINS.split(",") if origin.strip()]

    def _database_url(self, driver: str) -> str:
        return (
            f"postgresql+{driver}://{quote_plus(self.DB_USER)}:{quote_plus(self.DB_PASSWORD)}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )

    @property
    def async_database_url(self) -> str:
        return self._database_url("asyncpg")

    @property
    def sync_database_url(self) -> str:
        return self._database_url("psycopg2")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
