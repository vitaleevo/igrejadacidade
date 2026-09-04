from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from .core.config import settings

# SQLite precisa de check_same_thread=False
connect_args = {}
engine_kwargs: dict = {"pool_pre_ping": True}
if settings.database_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
else:
    # Postgres prod: pool contido para 1-2 réplicas pequenas
    engine_kwargs.update(
        {
            "pool_size": 5,
            "max_overflow": 5,
            "pool_timeout": 30,
            "pool_recycle": 1800,
        }
    )

engine = create_engine(
    settings.database_url,
    connect_args=connect_args,
    **engine_kwargs,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def check_db_connection() -> bool:
    """Usado por /api/health e lifespan. Não lança em caso de falha."""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception:
        return False
