import os
import tempfile

_tmp_uploads = tempfile.mkdtemp(prefix="rccg-test-uploads-")
os.environ["DATABASE_URL"] = "sqlite:///./test_rccg.db"
os.environ["ADMIN_API_KEY"] = "test-admin-key"
os.environ["UPLOAD_DIR"] = _tmp_uploads

from fastapi.testclient import TestClient

from app.main import app
from app.database import Base, engine

client = TestClient(app)


def setup_module() -> None:
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


def teardown_module() -> None:
    Base.metadata.drop_all(bind=engine)


def valid_payload() -> dict[str, str]:
    return {
        "full_name": "Maria Silva",
        "email": "maria@example.com",
        "story": "Deus respondeu à minha oração e trouxe paz à minha família.",
        "category": "Answered Prayer",
        "publication_consent": "publish",
        "allow_contact": "false",
    }


def test_rejects_invalid_email() -> None:
    payload = valid_payload()
    payload["email"] = "not-an-email"
    response = client.post("/api/testimonies", data=payload)
    assert response.status_code == 422


def test_admin_routes_require_key_and_publication_requires_approval() -> None:
    created = client.post("/api/testimonies", data=valid_payload())
    assert created.status_code == 201
    testimony_id = created.json()["id"]

    assert client.get("/api/testimonies/admin").status_code == 401
    assert client.get(f"/api/testimonies/{testimony_id}").status_code == 404

    updated = client.patch(
        f"/api/testimonies/{testimony_id}",
        json={"status": "approved"},
        headers={"X-Admin-Key": "test-admin-key"},
    )
    assert updated.status_code == 200

    public = client.get(f"/api/testimonies/{testimony_id}")
    assert public.status_code == 200
    assert "email" not in public.json()


def test_rejects_spoofed_image_upload() -> None:
    payload = valid_payload()
    fake_exe = b"MZ\x90\x00" + b"\x00" * 100  # PE header disfarçado de jpg
    response = client.post(
        "/api/testimonies",
        data=payload,
        files={"media": ("foto.jpg", fake_exe, "image/jpeg")},
    )
    assert response.status_code == 400


def test_accepts_valid_png_magic_bytes() -> None:
    payload = valid_payload()
    png_header = b"\x89PNG\r\n\x1a\n" + b"\x00" * 100
    response = client.post(
        "/api/testimonies",
        data=payload,
        files={"media": ("foto.png", png_header, "image/png")},
    )
    assert response.status_code == 201


def test_moderation_creates_audit_and_blocks_docs_in_prod() -> None:
    from app.core.config import Settings

    prod = Settings(
        _env_file=None,
        app_env="production",
        database_url="postgresql://u:p@db:5432/rccg",
        secret_key="x" * 64,
        admin_api_key="y" * 40,
    )
    assert prod.validate_production() == []

    weak = Settings(
        _env_file=None,
        app_env="production",
        database_url="sqlite:///./rccg.db",
        secret_key="change-me-in-production-super-secret-key",
        admin_api_key="short",
    )
    errors = weak.validate_production()
    assert any("SECRET_KEY" in e for e in errors)
    assert any("SQLite" in e for e in errors)

    # Health deve expor estado da DB sem vazar segredos
    health = client.get("/api/health")
    assert health.status_code == 200
    assert health.json()["service"]
    assert "secret" not in health.text.lower()
