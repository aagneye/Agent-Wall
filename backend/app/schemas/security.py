from typing import Literal

from pydantic import BaseModel, Field, field_validator

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


class RiskFinding(BaseModel):
    rule_id: str
    severity: Literal["low", "medium", "high"]
    score_impact: int = Field(ge=0, le=100)
    explanation: str


class PolicyFinding(BaseModel):
    policy_id: str
    passed: bool
    explanation: str


class SecurityEvaluationResponse(BaseModel):
    deterministic: bool = True
    risk_score: int = Field(ge=0, le=100)
    risk_explanation: str = Field(min_length=20, max_length=400)
    approval_recommendation: Literal["approve", "needs_human_review", "reject"]
    risk_findings: list[RiskFinding]
    policy_findings: list[PolicyFinding]

    @field_validator("risk_findings", "policy_findings")
    @classmethod
    def ensure_non_empty_findings(cls, value: list[BaseModel]) -> list[BaseModel]:
        if len(value) == 0:
            raise ValueError("At least one finding is required for explainability.")
        return value
