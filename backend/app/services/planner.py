from app.agents.planner import PlannerAgent
from app.schemas.planner import PlannerRequest, PlannerResponse


class PlannerService:
    def __init__(self) -> None:
        self._agent = PlannerAgent()

    def create_plan(self, payload: PlannerRequest) -> PlannerResponse:
        return self._agent.plan(payload)
