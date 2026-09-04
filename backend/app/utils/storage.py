import hashlib
import os
import uuid
import aiofiles
from fastapi import UploadFile, HTTPException

from ..core.config import settings

ALLOWED_TYPES = set(settings.allowed_image_types + settings.allowed_video_types)
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".mp4", ".mov", ".webm"}

# Magic bytes mínimos (não substitui ClamAV em prod, mas bloqueia renomeações .exe -> .jpg)
MAGIC_SIGNATURES: dict[bytes, str] = {
    b"\xff\xd8\xff": "image/jpeg",
    b"\x89PNG\r\n\x1a\n": "image/png",
    b"RIFF": "image/webp",  # WEBP: RIFF....WEBP (verificação alargada abaixo)
    b"\x00\x00\x00\x18ftyp": "video/mp4",
    b"\x00\x00\x00\x20ftyp": "video/mp4",
    b"\x00\x00\x00\x1cftyp": "video/quicktime",
}


def ensure_upload_dir():
    os.makedirs(settings.upload_dir, exist_ok=True)
    os.makedirs(os.path.join(settings.upload_dir, "testimonies"), exist_ok=True)


def _sniff_content_type(content: bytes, declared: str | None, filename: str) -> str | None:
    """Valida magic bytes contra o tipo declarado. Retorna erro ou None."""
    if not content:
        return "Ficheiro vazio."
    head = content[:12]
    # JPEG / PNG diretos
    if head.startswith(b"\xff\xd8\xff") and declared in ("image/jpeg",):
        return None
    if head.startswith(b"\x89PNG\r\n\x1a\n") and declared in ("image/png",):
        return None
    # WEBP: RIFF xxxx WEBP
    if head.startswith(b"RIFF") and content[8:12] == b"WEBP" and declared in ("image/webp",):
        return None
    # MP4/MOV: ....ftyp (mp42, isom, qt, m4v...)
    if head[4:8] == b"ftyp" and declared in ("video/mp4", "video/quicktime", "video/webm"):
        return None
    # WEBM: 1A 45 DF A3 (EBML)
    if content[:4] == b"\x1aE\xdf\xa3" and declared in ("video/webm",):
        return None
    return f"Conteúdo do ficheiro não corresponde ao tipo declarado ({declared})."


async def save_upload_file(file: UploadFile) -> tuple[str, str, str]:
    """Guarda ficheiro e retorna (storage_ref, media_type, sha256).

    Em prod com STORAGE_BACKEND=s3, este ponto é onde trocar para boto3
    com upload privado + URL assinada (ver docs/DEPLOY.md). Por agora
    mantém storage local privado servido só via rota /media após aprovação.
    """
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail=f"Tipo de ficheiro não permitido: {file.content_type}")

    # verifica tamanho (stream simples: lê uma vez; 50MB cabe em RAM de container 512MB,
    # mas em prod preferir streaming + limite no Nginx client_max_body_size)
    content = await file.read()
    is_video = file.content_type in settings.allowed_video_types
    max_bytes = (settings.max_upload_size_mb_video if is_video else settings.max_upload_size_mb) * 1024 * 1024
    if len(content) > max_bytes:
        limit = settings.max_upload_size_mb_video if is_video else settings.max_upload_size_mb
        raise HTTPException(status_code=400, detail=f"Ficheiro demasiado grande. Máximo {limit} MB")

    sniff_error = _sniff_content_type(content, file.content_type, file.filename or "file")
    if sniff_error:
        raise HTTPException(status_code=400, detail=sniff_error)

    ext = os.path.splitext(file.filename or "file")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Extensão de ficheiro não permitida.")
    # Coerência extensão <-> MIME
    ext_to_mime = {
        ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
        ".webp": "image/webp", ".mp4": "video/mp4", ".mov": "video/quicktime",
        ".webm": "video/webm",
    }
    # .mov pode vir como video/quicktime; aceitar mp4 declarado como mov? Não — estrito
    if ext in ext_to_mime and file.content_type != ext_to_mime[ext] and not (
        ext == ".mov" and file.content_type in ("video/quicktime", "video/mp4")
    ):
        raise HTTPException(status_code=400, detail="Extensão não corresponde ao tipo do ficheiro.")

    sha256 = hashlib.sha256(content).hexdigest()
    filename = f"{uuid.uuid4().hex}{ext}"
    ensure_upload_dir()
    dest = os.path.join(settings.upload_dir, "testimonies", filename)

    async with aiofiles.open(dest, "wb") as out:
        await out.write(content)

    media_type = "image" if file.content_type in settings.allowed_image_types else "video"
    # Referência interna; a API expõe ficheiros apenas após aprovação pública.
    storage_ref = f"uploads/testimonies/{filename}"
    return storage_ref, media_type, sha256
