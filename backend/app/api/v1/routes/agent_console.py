from fastapi import APIRouter

from app.schemas.agent_console import AgentConsoleSubmitRequest, AgentConsoleSubmitResponse
from app.services.agent_console import AgentConsoleService

router = APIRouter()
service = AgentConsoleService()


@router.post("/submit", response_model=AgentConsoleSubmitResponse)
def submit_prompt(payload: AgentConsoleSubmitRequest) -> AgentConsoleSubmitResponse:
    return service.submit_prompt(payload.prompt)
