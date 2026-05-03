from pydantic import BaseModel, Field


class PreviewSimulateRequest(BaseModel):
    prompt: str = Field(default="", max_length=480)
