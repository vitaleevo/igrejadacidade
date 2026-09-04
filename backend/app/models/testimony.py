from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Enum, Index
from sqlalchemy.sql import func
import enum
from ..database import Base


class TestimonyCategory(str, enum.Enum):
    healing = "Healing"
    answered_prayer = "Answered Prayer"
    employment_finances = "Employment / Finances"
    family_marriage = "Family / Marriage"
    deliverance = "Deliverance"
    conversion_salvation = "Conversion / Salvation"
    miracle = "Miracle"
    other = "Other"


class TestimonyStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class Testimony(Base):
    __tablename__ = "testimonies"
    __table_args__ = (
        # Listagem pública: WHERE status + consent ORDER BY created_at DESC
        Index("ix_testimonies_public_list", "status", "publication_consent", "created_at"),
        Index("ix_testimonies_category_created", "category", "created_at"),
    )

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False, index=True)
    phone = Column(String(50), nullable=True)
    email = Column(String(255), nullable=True, index=True)
    story = Column(Text, nullable=False)
    happened_at = Column(String(100), nullable=True)  # livre: "Janeiro 2024", "Há 2 semanas"
    category = Column(Enum(TestimonyCategory), nullable=False, default=TestimonyCategory.other)
    media_url = Column(String(512), nullable=True)  # caminho/url do ficheiro
    media_type = Column(String(50), nullable=True)  # image / video
    media_sha256 = Column(String(64), nullable=True)  # dedup + integridade (prod)
    allow_contact = Column(Boolean, default=True)
    publication_consent = Column(String(50), nullable=False, default="internal")  # publish | internal
    # Se marcou publish, pode ser publicado; se internal, só uso interno
    status = Column(Enum(TestimonyStatus), default=TestimonyStatus.pending, index=True)
    moderated_at = Column(DateTime(timezone=True), nullable=True)
    moderation_note = Column(String(500), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())


class AuditLog(Base):
    """Trilha append-only: quem moderou o quê, quando. Nunca UPDATE/DELETE por API."""

    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    action = Column(String(50), nullable=False, index=True)  # testimony.approved | testimony.rejected | testimony.consent_updated
    testimony_id = Column(Integer, nullable=True, index=True)
    actor = Column(String(100), nullable=False, default="admin-key")  # futuro: user id / SSO
    ip = Column(String(64), nullable=True)
    old_value = Column(String(100), nullable=True)
    new_value = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
