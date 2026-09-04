"""Notificação email fire-and-forget para novos testemunhos.

Segredos via env no servidor (SMTP_HOST/USER/PASSWORD). Sem secrets no repo.
Falha de email NUNCA bloqueia a criação do testemunho (fail-open com log).
"""
import logging
import smtplib
import ssl
from email.message import EmailMessage

from ..core.config import settings

logger = logging.getLogger(__name__)


def send_new_testimony_notification(testimony_id: int, full_name: str, category: str) -> None:
    if not (settings.smtp_host and settings.smtp_user and settings.smtp_password and settings.notify_email):
        return  # email não configurado (dev) — silencioso
    try:
        msg = EmailMessage()
        msg["Subject"] = f"Novo testemunho #{testimony_id} — {full_name}"
        msg["From"] = settings.smtp_from or settings.smtp_user
        msg["To"] = settings.notify_email
        admin_url = settings.frontend_admin_url or "https://igrejadacidadeluanda.org/admin"
        msg.set_content(
            "Novo testemunho recebido e pendente de moderação.\n\n"
            f"ID: {testimony_id}\nNome: {full_name}\nCategoria: {category}\n\n"
            f"Moderar em: {admin_url}\n\n"
            "Não responda a este email automático."
        )
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port, context=context, timeout=15) as server:
            server.login(settings.smtp_user, settings.smtp_password)
            server.send_message(msg)
        logger.info("notify email sent testimony_id=%s", testimony_id)
    except Exception as exc:  # noqa: BLE001 — email é best-effort
        logger.warning("notify email failed testimony_id=%s err=%s", testimony_id, exc)
