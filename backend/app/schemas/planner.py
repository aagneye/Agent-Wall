from typing import Literal

from pydantic import BaseModel, Field, field_validator

PlannerActionType = Literal[
    "check_protocol_options",
    "swap_assets",
    "deposit_funds",
    "stake_tokens",
    "bridge_assets",
]

PlannerRiskLevel = Literal["low", "medium"]


class PlannerRequest(BaseModel):
    prompt: str = Field(min_length=8, max_length=240)

    @field_validator("prompt")
    @classmethod
    def validate_prompt(cls, value: str) -> str:
        normalized = " ".join(value.split()).strip()
        if not normalized:
            raise ValueError("Prompt cannot be empty.")
        return normalized


class PlannerAction(BaseModel):
    id: str = Field(pattern=r"^ACT-[0-9]{2}$")
    type: PlannerActionType
    description: str = Field(min_length=12, max_length=180)
    reason: str = Field(min_length=12, max_length=180)
    risk_level: PlannerRiskLevel = "low"


class PlannerResponse(BaseModel):
    prompt: str
    intent: str
    safety_note: str
    deterministic: bool = True
    actions: list[PlannerAction] = Field(min_length=1, max_length=5)
