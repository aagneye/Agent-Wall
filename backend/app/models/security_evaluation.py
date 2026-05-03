from datetime import datetime, timezone
from sqlalchemy import String, Text, Integer, Boolean, DateTime, Float, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class SecurityEvaluation(Base):
    __tablename__ = "security_evaluations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    run_id: Mapped[str] = mapped_column(String(64), ForeignKey("agent_runs.run_id"), nullable=False, index=True)
    wallet_address: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    risk_score: Mapped[int] = mapped_column(Integer, nullable=False)
    risk_explanation: Mapped[str] = mapped_column(Text, nullable=False)
    approval_recommendation: Mapped[str] = mapped_column(String(32), nullable=False)
    deterministic: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    risk_findings: Mapped[dict] = mapped_column(JSON, nullable=False)
    policy_findings: Mapped[dict] = mapped_column(JSON, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )


class ProposedAction(Base):
    __tablename__ = "proposed_actions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    evaluation_id: Mapped[int] = mapped_column(Integer, ForeignKey("security_evaluations.id"), nullable=False, index=True)
    action_id: Mapped[str] = mapped_column(String(32), nullable=False)
    action_type: Mapped[str] = mapped_column(String(64), nullable=False)
    protocol: Mapped[str] = mapped_column(String(64), nullable=False)
    contract_address: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    target_address: Mapped[str] = mapped_column(String(64), nullable=False)
    token_symbol: Mapped[str] = mapped_column(String(12), nullable=False)
    amount_usd: Mapped[float] = mapped_column(Float, nullable=False)
    approval_amount_usd: Mapped[float] = mapped_column(Float, nullable=False)
    approval_scope: Mapped[str] = mapped_column(String(16), nullable=False)
    approval_expires_in_minutes: Mapped[int] = mapped_column(Integer, nullable=False)
    wallet_balance_usd: Mapped[float] = mapped_column(Float, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )
