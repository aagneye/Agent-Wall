from app.schemas.planner import PlannerRequest, PlannerResponse

UNSAFE_PROMPT_PATTERNS = {
    "leverage",
    "flash loan",
    "borrow max",
    "all-in",
    "degen",
    "100x",
}

DEFAULT_INTENT = "safe_capital_optimization"


class PlannerAgent:
    def plan(self, payload: PlannerRequest) -> PlannerResponse:
        return PlannerResponse(
            prompt=payload.prompt,
            intent=DEFAULT_INTENT,
            safety_note="Plan-only mode. No transactions are executed.",
            actions=[],
        )
