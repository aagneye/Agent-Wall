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
DEFAULT_ACTION_ORDER = [
    "check_protocol_options",
    "swap_assets",
    "deposit_funds",
    "stake_tokens",
    "bridge_assets",
]


class PlannerAgent:
    def _extract_requested_actions(self, prompt: str) -> list[str]:
        lowered = prompt.lower()
        requested: list[str] = []
        for action_type in DEFAULT_ACTION_ORDER:
            action_hint = action_type.replace("_", " ")
            if action_hint in lowered:
                requested.append(action_type)

        if not requested:
            requested = ["check_protocol_options", "deposit_funds"]

        return requested

    def plan(self, payload: PlannerRequest) -> PlannerResponse:
        return PlannerResponse(
            prompt=payload.prompt,
            intent=DEFAULT_INTENT,
            safety_note="Plan-only mode. No transactions are executed.",
            actions=[],
        )
