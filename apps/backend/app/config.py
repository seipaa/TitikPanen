"""Application configuration from environment variables."""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # App
    app_name: str = "AgroMesh AI"
    app_version: str = "1.0.0"
    debug: bool = True

    # Security
    secret_key: str = "your-super-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440  # 24 hours

    # Database
    database_url: str = "sqlite:///./agromesh.db"

    # MinIO / S3 Storage
    minio_endpoint: str = "localhost:9000"
    minio_access_key: str = "minioadmin"
    minio_secret_key: str = "minioadmin"
    minio_bucket: str = "agromesh-images"
    minio_secure: bool = False

    # AI Service
    ai_api_url: str = "http://localhost:8001/predict"
    ai_api_key: str = ""

    # BMKG API
    bmkg_api_url: str = "https://api.bmkg.go.id"

    # CORS
    cors_origins: str = "http://localhost:3000"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.cors_origins.split(",")]

    class Config:
        env_file = ".env"
        extra = "allow"


settings = Settings()