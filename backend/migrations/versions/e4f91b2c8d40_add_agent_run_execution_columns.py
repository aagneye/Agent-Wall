"""add keeper_job_id and audit_trail_id to agent_runs

Revision ID: e4f91b2c8d40
Revises: ab409d1ccf8f
Create Date: 2026-05-03

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "e4f91b2c8d40"
down_revision: Union[str, None] = "ab409d1ccf8f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("agent_runs", sa.Column("keeper_job_id", sa.String(length=128), nullable=True))
    op.add_column("agent_runs", sa.Column("audit_trail_id", sa.String(length=256), nullable=True))


def downgrade() -> None:
    op.drop_column("agent_runs", "audit_trail_id")
    op.drop_column("agent_runs", "keeper_job_id")
