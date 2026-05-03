from typing import Any

from pydantic import BaseModel, Field


class AgentExecuteRequest(BaseModel):
    run_id: str = Field(min_length=1)
    plan: dict[str, Any]
    user_address: str = Field(min_length=1)


class AgentExecuteResponse(BaseModel):
    job_id: str
    status: str
    audit_trail_id: str
