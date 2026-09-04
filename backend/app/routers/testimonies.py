from collections import defaultdict, deque
from datetime import datetime, timezone
from pathlib import Path
from time import monotonic
from typing import Deque, List, Optional

from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, HTTPException, Query, Request, UploadFile
from fastapi.responses import FileResponse
from pydantic import ValidationError
from sqlalchemy.orm import Session

from ..core.config import settings
from ..core.security import require_admin
from ..database import get_db
from ..models.testimony import AuditLog, Testimony, TestimonyCategory, TestimonyStatus
from ..schemas.testimony import (
    PublicationConsentEnum,
    TestimonyCreate,
    TestimonyOut,
    TestimonyPublicOut,
    TestimonyUpdate,
)
from ..utils.email_notify import send_new_testimony_notification
from ..utils.storage import save_upload_file

router = APIRouter(prefix="/api/testimonies", tags=["testimonies"])
_submission_attempts: dict[str, Deque[float]] = defaultdict(deque)


def enforce_submission_limit(request: Request) -> None:
    """Small in-process abuse control for the public form.

    PROD: trocar por Redis (INCR + EXPIRE por IP) quando REDIS_URL estiver
    configurado e houver >1 réplica. Ver docs/DEPLOY.md. Mantém in-process
    como fallback para não quebrar single-replica.
    """
    # Se Redis configurado, a política real deve viver no Nginx/edge (limit_req)
    # + Turnstile. Este controlo mantém-se como defesa em profundidade.
    client_ip = request.client.host if request.client else "unknown"
    now = monotonic()
    attempts = _submission_attempts[client_ip]
    while attempts and now - attempts[0] > settings.rate_limit_window_seconds:
        attempts.popleft()
    if len(attempts) >= settings.rate_limit_requests:
        raise HTTPException(
            status_code=429,
            detail="Foram feitas demasiadas tentativas. Tente novamente mais tarde.",
        )
    attempts.append(now)


async def verify_turnstile_if_configured(token: Optional[str]) -> None:
    """Verifica Cloudflare Turnstile apenas se TURNSTILE_SECRET_KEY configurado.

    Em dev (sem secret) é no-op para não quebrar o form local.
    Em prod o frontend deve enviar `cf-turnstile-response` e o backend exige-o.
    """
    if not settings.turnstile_secret_key:
        return
    if not token:
        raise HTTPException(status_code=400, detail="Verificação anti-robô em falta. Tente novamente.")
    # NOTA: validação real via httpx POST a siteverify.cloudflare.com deve ser
    # ativada no deploy (evita dependência externa nos testes). Por agora,
    # aceita tokens com ≥10 chars; endurecer para chamada real em P1.
    # TODO(prod): httpx.post("https://challenges.cloudflare.com/turnstile/v0/siteverify", ...)
    if len(token) < 10:
        raise HTTPException(status_code=400, detail="Verificação anti-robô inválida.")


def public_testimony(testimony: Testimony) -> dict:
    return {
        "id": testimony.id,
        "full_name": testimony.full_name,
        "story": testimony.story,
        "happened_at": testimony.happened_at,
        "category": testimony.category.value,
        "media_url": f"/api/testimonies/{testimony.id}/media" if testimony.media_url else None,
        "media_type": testimony.media_type,
        "created_at": testimony.created_at,
    }


@router.post("", response_model=TestimonyOut, status_code=201)
async def create_testimony(
    request: Request,
    background: BackgroundTasks,
    full_name: str = Form(...),
    phone: Optional[str] = Form(None),
    email: Optional[str] = Form(None),
    story: str = Form(...),
    happened_at: Optional[str] = Form(None),
    category: str = Form("Other"),
    allow_contact: bool = Form(True),
    publication_consent: str = Form("internal"),
    cf_turnstile_response: Optional[str] = Form(None, alias="cf-turnstile-response"),
    media: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    enforce_submission_limit(request)
    await verify_turnstile_if_configured(cf_turnstile_response)
    try:
        payload = TestimonyCreate(
            full_name=full_name,
            phone=phone.strip() if phone else None,
            email=email.strip() if email else None,
            story=story,
            happened_at=happened_at.strip() if happened_at else None,
            category=category,
            allow_contact=allow_contact,
            publication_consent=publication_consent,
        )
    except ValidationError as exc:
        raise HTTPException(status_code=422, detail=exc.errors()) from exc

    media_url = None
    media_type = None
    media_sha256 = None
    if media and media.filename:
        media_url, media_type, media_sha256 = await save_upload_file(media)

    testimony = Testimony(
        full_name=payload.full_name,
        phone=payload.phone,
        email=str(payload.email) if payload.email else None,
        story=payload.story,
        happened_at=payload.happened_at,
        category=TestimonyCategory(payload.category.value),
        media_url=media_url,
        media_type=media_type,
        media_sha256=media_sha256,
        allow_contact=payload.allow_contact,
        publication_consent=payload.publication_consent.value,
        status=TestimonyStatus.pending,
    )
    db.add(testimony)
    db.commit()
    db.refresh(testimony)
    # Email best-effort para a equipa (nunca bloqueia). Vai para /admin gerir.
    background.add_task(
        send_new_testimony_notification,
        testimony.id,
        testimony.full_name,
        testimony.category.value if testimony.category else "Other",
    )
    return testimony


@router.get("", response_model=List[TestimonyPublicOut])
def list_testimonies_public(
    category: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    query = db.query(Testimony).filter(
        Testimony.status == TestimonyStatus.approved,
        Testimony.publication_consent == PublicationConsentEnum.publish.value,
    )
    if category:
        try:
            query = query.filter(Testimony.category == TestimonyCategory(category))
        except ValueError as exc:
            raise HTTPException(status_code=422, detail="Categoria inválida.") from exc
    testimonies = query.order_by(Testimony.created_at.desc()).offset(offset).limit(limit).all()
    return [public_testimony(testimony) for testimony in testimonies]


@router.get("/admin", response_model=List[TestimonyOut], dependencies=[Depends(require_admin)])
def list_testimonies_admin(
    status: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    query = db.query(Testimony)
    if status:
        try:
            query = query.filter(Testimony.status == TestimonyStatus(status))
        except ValueError as exc:
            raise HTTPException(status_code=422, detail="Estado inválido.") from exc
    return query.order_by(Testimony.created_at.desc()).offset(offset).limit(limit).all()


@router.get("/admin/audit", dependencies=[Depends(require_admin)])
def list_audit(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    """Gestão do site: quem aprovou/rejeitou o quê (para o /admin)."""
    rows = (
        db.query(AuditLog)
        .order_by(AuditLog.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return [
        {
            "id": r.id,
            "action": r.action,
            "testimony_id": r.testimony_id,
            "actor": r.actor,
            "ip": r.ip,
            "old_value": r.old_value,
            "new_value": r.new_value,
            "created_at": r.created_at,
        }
        for r in rows
    ]


@router.get("/{testimony_id}", response_model=TestimonyPublicOut)
def get_testimony(testimony_id: int, db: Session = Depends(get_db)):
    testimony = db.query(Testimony).filter(Testimony.id == testimony_id).first()
    if not testimony or testimony.status != TestimonyStatus.approved or testimony.publication_consent != PublicationConsentEnum.publish.value:
        raise HTTPException(status_code=404, detail="Testemunho não disponível publicamente.")
    return public_testimony(testimony)


@router.get("/{testimony_id}/media")
def get_testimony_media(testimony_id: int, db: Session = Depends(get_db)):
    testimony = db.query(Testimony).filter(Testimony.id == testimony_id).first()
    if not testimony or testimony.status != TestimonyStatus.approved or testimony.publication_consent != PublicationConsentEnum.publish.value or not testimony.media_url:
        raise HTTPException(status_code=404, detail="Multimédia não disponível publicamente.")
    filename = Path(testimony.media_url).name
    file_path = Path(settings.upload_dir) / "testimonies" / filename
    if not file_path.is_file():
        raise HTTPException(status_code=404, detail="Ficheiro não encontrado.")
    return FileResponse(file_path, filename=filename)


@router.patch("/{testimony_id}", response_model=TestimonyOut, dependencies=[Depends(require_admin)])
def update_testimony_status(
    testimony_id: int,
    payload: TestimonyUpdate,
    request: Request,
    db: Session = Depends(get_db),
):
    testimony = db.query(Testimony).filter(Testimony.id == testimony_id).first()
    if not testimony:
        raise HTTPException(status_code=404, detail="Testemunho não encontrado.")
    old_status = testimony.status.value if testimony.status else None
    old_consent = testimony.publication_consent
    client_ip = request.client.host if request.client else None
    if payload.status is not None:
        testimony.status = TestimonyStatus(payload.status.value)
        testimony.moderated_at = datetime.now(timezone.utc)
        db.add(
            AuditLog(
                action=f"testimony.{payload.status.value}",
                testimony_id=testimony.id,
                actor="admin-key",
                ip=client_ip,
                old_value=old_status,
                new_value=payload.status.value,
            )
        )
    if payload.publication_consent is not None:
        testimony.publication_consent = payload.publication_consent.value
        db.add(
            AuditLog(
                action="testimony.consent_updated",
                testimony_id=testimony.id,
                actor="admin-key",
                ip=client_ip,
                old_value=old_consent,
                new_value=payload.publication_consent.value,
            )
        )
    db.commit()
    db.refresh(testimony)
    return testimony
