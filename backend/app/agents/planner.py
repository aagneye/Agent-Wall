from app.schemas.planner import PlannerRequest, PlannerResponse


class PlannerAgent:
    def plan(self, payload: PlannerRequest) -> PlannerResponse:
        return PlannerResponse(
            prompt=payload.prompt,
            intent="safe_capital_optimization",
            safety_note="Plan-only mode. No transactions are executed.",
            actions=[],
        )
