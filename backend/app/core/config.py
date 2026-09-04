from pydantic_settings import BaseSettings
from typing import List, Optional
import os


class Settings(BaseSettings):
    app_name: str = "Igreja da Cidade Luanda API"
    app_env: str = "development"  # development | staging | production
    debug: bool = False
    # Em dev usa SQLite, em prod Postgres (obrigatório via env)
    database_url: str = "sqlite:///./rccg.db"
    secret_key: str = "change-me-in-production-super-secret-key"
    admin_api_key: Optional[str] = None
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # CORS - inclui portas de dev alternativas (8002, 3002 etc)
    cors_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://localhost:8002",
        "http://testimonies.localhost:3000",
        "http://testimonies.localhost:3002",
        "https://igrejadacidadeluanda.org",
        "https://testimonies.igrejadacidadeluanda.org",
        "https://www.igrejadacidadeluanda.org",
    ]

    # Uploads — local em dev, S3/R2 em prod (ver docs/DEPLOY.md)
    upload_dir: str = "uploads"
    max_upload_size_mb: int = 10
    max_upload_size_mb_video: int = 50
    allowed_image_types: List[str] = ["image/jpeg", "image/png", "image/webp"]
    allowed_video_types: List[str] = ["video/mp4", "video/quicktime", "video/webm"]
    rate_limit_requests: int = 5
    rate_limit_window_seconds: int = 3600

    # Prod hardening (opcionais em dev, obrigatórios em prod via validação em main.py)
    storage_backend: str = "local"  # local | s3
    s3_bucket: Optional[str] = None
    s3_endpoint_url: Optional[str] = None
    s3_region: Optional[str] = None
    redis_url: Optional[str] = None
    turnstile_secret_key: Optional[str] = None
    trusted_hosts: List[str] = ["localhost", "127.0.0.1", "backend", "db", "testserver"]
    max_request_body_kb: int = 55 * 1024  # ~55MB (50MB vídeo + overhead multipart)

    # Email SMTP (cPanel: ws101.angoweb.net:465 SSL). Segredos SÓ via env no servidor.
    smtp_host: Optional[str] = None
    smtp_port: int = 465
    smtp_user: Optional[str] = None
    smtp_password: Optional[str] = None
    smtp_from: Optional[str] = None
    notify_email: Optional[str] = None  # ex: testimonies@igrejadacidadeluanda.org
    frontend_admin_url: Optional[str] = None  # ex: https://igrejadacidadeluanda.org/admin

    @property
    def is_production(self) -> bool:
        return self.app_env.lower() == "production"

    def validate_production(self) -> List[str]:
        """Retorna lista de erros bloqueantes em produção."""
        if not self.is_production:
            return []
        errors: List[str] = []
        weak_defaults = {
            "change-me-in-production-super-secret-key",
            "change-me-super-secret",
            "secret",
            "changeme",
        }
        if not self.secret_key or self.secret_key in weak_defaults or len(self.secret_key) < 32:
            errors.append("SECRET_KEY deve ter ≥32 chars aleatórios em produção.")
        if not self.admin_api_key or len(self.admin_api_key) < 32:
            errors.append("ADMIN_API_KEY deve ter ≥32 chars aleatórios em produção.")
        if self.database_url.startswith("sqlite"):
            errors.append("DATABASE_URL não pode ser SQLite em produção (use Postgres).")
        if self.storage_backend == "s3" and not self.s3_bucket:
            errors.append("S3_BUCKET obrigatório quando STORAGE_BACKEND=s3.")
        # Aviso não-bloqueante: sem Redis o rate-limit é in-process (1 réplica OK, N réplicas não)
        return errors

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
