from typing import Literal

from pydantic import BaseModel, Field


class TenderlySimulationRequest(BaseModel):
    action_label: str = Field(min_length=4, max_length=120)
    protocol: str = Field(min_length=2, max_length=64)
    token_symbol: str = Field(min_length=2, max_length=12)
    amount_usd: float = Field(gt=0, le=5_000_000)
    approval_scope: Literal["none", "limited", "unlimited"] = "none"
    approval_duration_hours: int = Field(ge=0, le=168)
    target: str = Field(min_length=2, max_length=64)


class TokenMovementPreview(BaseModel):
    token: str
    direction: Literal["in", "out"]
    amount_usd: float = Field(ge=0)


class TenderlySimulationResponse(BaseModel):
    deterministic: bool = True
    token_movements: list[TokenMovementPreview]
    gas_estimate_usd: float = Field(ge=0)
    approval_size_usd: float = Field(ge=0)
    transaction_failure_risk: Literal["low", "medium", "high"]
    suspicious_behavior_detected: bool
    human_explanation: str = Field(min_length=20, max_length=320)
