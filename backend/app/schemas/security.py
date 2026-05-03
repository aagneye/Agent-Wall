from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.schemas.planner import PlannerResponse

SecurityActionType = Literal[
    "check_protocol_options",
    "swap_assets",
    "deposit_funds",
    "stake_tokens",
    "bridge_assets",
]


class ProposedAction(BaseModel):
    id: str = Field(min_length=1, max_length=32)
    type: SecurityActionType
    protocol: str = Field(min_length=1, max_length=64)
    contract_address: str = Field(min_length=6, max_length=64)
    target_address: str = Field(min_length=6, max_length=64)
    token_symbol: str = Field(min_length=2, max_length=12)
    amount_usd: float = Field(ge=0, le=10_000_000)
    approval_amount_usd: float = Field(ge=0, le=10_000_000)
    approval_scope: Literal["none", "limited", "unlimited"] = "none"
    approval_expires_in_minutes: int = Field(ge=0, le=43_200)
    wallet_balance_usd: float = Field(ge=0, le=100_000_000)


class SecurityEvaluationRequest(BaseModel):
    wallet_address: str = Field(min_length=6, max_length=64)
    proposed_actions: list[ProposedAction] = Field(min_length=1, max_length=10)

    @field_validator("wallet_address")
    @classmethod
    def normalize_wallet_address(cls, value: str) -> str:
        return value.strip().lower()


class SecurityEvaluationFromPlanRequest(BaseModel):
    """Evaluate security from a planner output (console workflow)."""

    model_config = ConfigDict(populate_by_name=True)

    plan: PlannerResponse
    run_id: str = Field(alias="runId", min_length=1)


class RiskFinding(BaseModel):
    rule_id: str
    severity: Literal["low", "medium", "high"]
    score_impact: int = Field(ge=0, le=100)
    explanation: str


class PolicyFinding(BaseModel):
    policy_id: str
    passed: bool
    explanation: str


RiskSeverityUi = Literal["low", "medium", "high", "critical"]


class RiskRow(BaseModel):
    """Single row in the evaluate response `risks` list (API shape)."""

    type: str = Field(description="Identifier for the risk, typically the rule id")
    description: str
    severity: RiskSeverityUi


class PolicyResult(BaseModel):
    allowed: bool
    reason: str = Field(min_length=1, max_length=800)


class SecurityEvaluationResponse(BaseModel):
    deterministic: bool = True
    risk_score: int = Field(ge=0, le=100)
    risk_level: Literal["low", "medium", "high", "critical"]
    risks: list[RiskRow]
    policy_result: PolicyResult

    @field_validator("risks")
    @classmethod
    def ensure_non_empty_risks(cls, value: list[RiskRow]) -> list[RiskRow]:
        if len(value) == 0:
            raise ValueError("At least one risk row is required for explainability.")
        return value
