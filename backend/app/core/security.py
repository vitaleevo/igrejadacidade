import secrets

from fastapi import Depends, HTTPException, status
from fastapi.security import APIKeyHeader

from .config import settings

admin_key_header = APIKeyHeader(name="X-Admin-Key", auto_error=False)


def require_admin(api_key: str | None = Depends(admin_key_header)) -> None:
    """Protect staff-only testimony moderation routes."""
    if not settings.admin_api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="A moderação não está configurada.",
        )
    if not api_key or not secrets.compare_digest(api_key, settings.admin_api_key):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais de administrador inválidas.",
        )
