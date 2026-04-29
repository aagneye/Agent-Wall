import uuid

from app.schemas.agent_console import AgentConsoleSubmitResponse


class AgentConsoleService:
    def submit_prompt(self, prompt: str) -> AgentConsoleSubmitResponse:
        return AgentConsoleSubmitResponse(
            runId=str(uuid.uuid4()),
            message=f"Secure run queued for prompt: {prompt}",
        )
