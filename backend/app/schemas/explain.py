from typing import Any

from pydantic import BaseModel, Field


class ExplainRequest(BaseModel):
    plan: dict[str, Any]
    security: dict[str, Any]


class ExplainResponse(BaseModel):
    explanation: str = Field(description="Plain-language summary from the LLM explainer.")
