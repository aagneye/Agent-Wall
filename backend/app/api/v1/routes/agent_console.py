from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.agent_console import AgentConsoleSubmitRequest, AgentConsoleSubmitResponse
from app.services.agent_console import AgentConsoleService

router = APIRouter()
service = AgentConsoleService()


@router.post("/submit", response_model=AgentConsoleSubmitResponse)
def submit_prompt(
    payload: AgentConsoleSubmitRequest,
    db: Session = Depends(get_db),
) -> AgentConsoleSubmitResponse:
    return service.submit_prompt(db, payload.prompt)
