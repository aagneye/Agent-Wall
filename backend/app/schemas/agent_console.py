from pydantic import BaseModel, Field


class AgentConsoleSubmitRequest(BaseModel):
    prompt: str = Field(min_length=8, max_length=240)
    user_address: str | None = Field(default=None, min_length=6, max_length=64)


class AgentConsoleSubmitResponse(BaseModel):
    runId: str
    message: str
