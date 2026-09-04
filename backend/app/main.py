import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse, RedirectResponse

from .core.config import settings
from .database import Base, check_db_connection, engine
from .routers import testimonies

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Fail-fast em produção se segredos fracos / SQLite / S3 mal configurado
    prod_errors = settings.validate_production()
    if prod_errors:
        for err in prod_errors:
            logger.error("PROD CONFIG ERROR: %s", err)
        raise RuntimeError("Invalid production configuration: " + "; ".join(prod_errors))
    # Em dev/teste cria tabelas automaticamente; em prod usar `alembic upgrade head`
    if not settings.is_production:
        Base.metadata.create_all(bind=engine)
    else:
        # Não criar schema automaticamente em prod — Alembic é obrigatório
        if not check_db_connection():
            raise RuntimeError("Database unreachable in production (check DATABASE_URL).")
        logger.info("Production startup: DB reachable, schema managed by Alembic.")
    yield


app = FastAPI(
    title=settings.app_name,
    description="API da Igreja da Cidade Luanda - RCCG | Gestão de Testemunhos, Eventos, Membros",
    version="1.0.0",
    docs_url="/api/docs" if not settings.is_production else None,
    redoc_url="/api/redoc" if not settings.is_production else None,
    openapi_url="/api/openapi.json" if not settings.is_production else None,
    lifespan=lifespan,
)

# Trusted hosts (anti Host-header poisoning) — alargar via env em prod
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.trusted_hosts + ["*.igrejadacidadeluanda.org", "*.holyconexao.chatgpt.site"],
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def guard_request_size_and_headers(request: Request, call_next):
    # Limite anti-abuso (Nginx também deve ter client_max_body_size 55m)
    cl = request.headers.get("content-length")
    if cl and cl.isdigit() and int(cl) > settings.max_request_body_kb * 1024:
        return JSONResponse(status_code=413, content={"detail": "Pedido demasiado grande."})
    response = await call_next(request)
    # Headers de segurança (defesa em profundidade; Nginx/CDN repetem em prod)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    if settings.is_production:
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

# Routers
app.include_router(testimonies.router)


@app.get("/api/health")
def health():
    db_ok = check_db_connection()
    return {"status": "ok" if db_ok else "degraded", "service": settings.app_name, "db": "up" if db_ok else "down"}


@app.get("/api")
def root():
    return {
        "message": "Bem-vindo à API da Igreja da Cidade Luanda",
        "docs": "/api/docs" if not settings.is_production else None,
        "health": "/api/health",
    }


# Compatibilidade: docs também em /docs e /
@app.get("/docs", include_in_schema=False)
def docs_redirect():
    if settings.is_production:
        return JSONResponse(status_code=404, content={"detail": "Not found"})
    return RedirectResponse(url="/api/docs")


@app.get("/redoc", include_in_schema=False)
def redoc_redirect():
    if settings.is_production:
        return JSONResponse(status_code=404, content={"detail": "Not found"})
    return RedirectResponse(url="/api/redoc")


@app.get("/openapi.json", include_in_schema=False)
def openapi_redirect():
    if settings.is_production:
        return JSONResponse(status_code=404, content={"detail": "Not found"})
    return RedirectResponse(url="/api/openapi.json")


# Para compatibilidade com Vercel / Railway healthcheck na raiz
@app.get("/")
def root_alt():
    return {"status": "ok", "docs": "/api/docs" if not settings.is_production else None, "health": "/api/health"}
