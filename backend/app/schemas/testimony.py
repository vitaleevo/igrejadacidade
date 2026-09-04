from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from datetime import datetime
from enum import Enum


class TestimonyCategoryEnum(str, Enum):
    healing = "Healing"
    answered_prayer = "Answered Prayer"
    employment_finances = "Employment / Finances"
    family_marriage = "Family / Marriage"
    deliverance = "Deliverance"
    conversion_salvation = "Conversion / Salvation"
    miracle = "Miracle"
    other = "Other"


class PublicationConsentEnum(str, Enum):
    publish = "publish"
    internal = "internal"


class TestimonyStatusEnum(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class TestimonyCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=255, description="Nome completo")
    phone: Optional[str] = Field(None, max_length=50)
    email: Optional[EmailStr] = None
    story: str = Field(..., min_length=20, description="Testemunho detalhado")
    happened_at: Optional[str] = Field(None, max_length=100, description="Quando aconteceu")
    category: TestimonyCategoryEnum = TestimonyCategoryEnum.other
    allow_contact: bool = True
    publication_consent: PublicationConsentEnum = PublicationConsentEnum.internal

    @field_validator("full_name", "story")
    @classmethod
    def required_text(cls, v: str):
        if not v.strip():
            raise ValueError("Este campo não pode estar vazio.")
        return v.strip()

    @field_validator("story")
    @classmethod
    def story_min_words(cls, v: str):
        if len(v.strip().split()) < 5:
            raise ValueError("Por favor partilhe o seu testemunho com mais detalhes.")
        return v


class TestimonyUpdate(BaseModel):
    status: Optional[TestimonyStatusEnum] = None
    publication_consent: Optional[PublicationConsentEnum] = None


class TestimonyOut(BaseModel):
    id: int
    full_name: str
    phone: Optional[str]
    email: Optional[str]
    story: str
    happened_at: Optional[str]
    category: str
    media_url: Optional[str]
    media_type: Optional[str]
    allow_contact: bool
    publication_consent: str
    status: str
    moderated_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class TestimonyPublicOut(BaseModel):
    """Versão pública: sem email/telefone se não autorizado ou sem dados sensíveis"""
    id: int
    full_name: str
    story: str
    happened_at: Optional[str]
    category: str
    media_url: Optional[str]
    media_type: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
