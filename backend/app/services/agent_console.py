import uuid

from sqlalchemy.orm import Session

from app.models.agent_run import AgentRun
from app.schemas.agent_console import AgentConsoleSubmitResponse


class AgentConsoleService:
    def submit_prompt(self, db: Session, prompt: str) -> AgentConsoleSubmitResponse:
        run_id = str(uuid.uuid4())
        row = AgentRun(run_id=run_id, prompt=prompt, status="pending")
        db.add(row)
        db.commit()
        db.refresh(row)
        return AgentConsoleSubmitResponse(
            runId=run_id,
            message=f"Secure run queued for prompt: {prompt}",
        )
