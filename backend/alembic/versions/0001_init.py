"""Initial schema: testimonies + audit_logs (prod baseline).

Revision ID: 0001_init
Revises:
Create Date: 2026-09-04
"""
from alembic import op
import sqlalchemy as sa

revision = "0001_init"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "testimonies",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("phone", sa.String(50), nullable=True),
        sa.Column("email", sa.String(255), nullable=True),
        sa.Column("story", sa.Text(), nullable=False),
        sa.Column("happened_at", sa.String(100), nullable=True),
        sa.Column("category", sa.Enum("Healing", "Answered Prayer", "Employment / Finances", "Family / Marriage", "Deliverance", "Conversion / Salvation", "Miracle", "Other", name="testimonycategory"), nullable=False, server_default="Other"),
        sa.Column("media_url", sa.String(512), nullable=True),
        sa.Column("media_type", sa.String(50), nullable=True),
        sa.Column("media_sha256", sa.String(64), nullable=True),
        sa.Column("allow_contact", sa.Boolean(), server_default=sa.true(), nullable=True),
        sa.Column("publication_consent", sa.String(50), server_default="internal", nullable=False),
        sa.Column("status", sa.Enum("pending", "approved", "rejected", name="testimonystatus"), server_default="pending", nullable=True),
        sa.Column("moderated_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("moderation_note", sa.String(500), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_testimonies_id", "testimonies", ["id"])
    op.create_index("ix_testimonies_full_name", "testimonies", ["full_name"])
    op.create_index("ix_testimonies_email", "testimonies", ["email"])
    op.create_index("ix_testimonies_status", "testimonies", ["status"])
    op.create_index("ix_testimonies_public_list", "testimonies", ["status", "publication_consent", "created_at"])
    op.create_index("ix_testimonies_category_created", "testimonies", ["category", "created_at"])

    op.create_table(
        "audit_logs",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("action", sa.String(50), nullable=False),
        sa.Column("testimony_id", sa.Integer(), nullable=True),
        sa.Column("actor", sa.String(100), server_default="admin-key", nullable=False),
        sa.Column("ip", sa.String(64), nullable=True),
        sa.Column("old_value", sa.String(100), nullable=True),
        sa.Column("new_value", sa.String(100), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_audit_logs_id", "audit_logs", ["id"])
    op.create_index("ix_audit_logs_action", "audit_logs", ["action"])
    op.create_index("ix_audit_logs_testimony", "audit_logs", ["testimony_id"])


def downgrade() -> None:
    op.drop_table("audit_logs")
    op.drop_table("testimonies")
    op.execute("DROP TYPE IF EXISTS testimonystatus")
    op.execute("DROP TYPE IF EXISTS testimonycategory")
