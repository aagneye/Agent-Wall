from app.schemas.planner import PlannerAction, PlannerRequest, PlannerResponse

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
    def _normalize_prompt(self, prompt: str) -> str:
        return " ".join(prompt.lower().split())

    def _is_unsafe_prompt(self, prompt: str) -> bool:
        lowered = self._normalize_prompt(prompt)
        return any(pattern in lowered for pattern in UNSAFE_PROMPT_PATTERNS)

    def _safe_fallback_actions(self) -> list[str]:
        return ["check_protocol_options"]

    def _build_action(self, action_type: str, index: int) -> PlannerAction:
        descriptions = {
            "check_protocol_options": "Compare vetted protocol options for safety, liquidity, and reliability.",
            "swap_assets": "Swap into required asset allocation using conservative slippage assumptions.",
            "deposit_funds": "Deposit assets into selected venue with exposure limits enabled.",
            "stake_tokens": "Stake eligible tokens only if rewards and lockup risks are acceptable.",
            "bridge_assets": "Bridge assets only through approved routes with confirmation checks.",
        }
        reasons = {
            "check_protocol_options": "Prevents blind allocation and prioritizes known, lower-risk venues.",
            "swap_assets": "Aligns holdings with target allocation before deploying capital.",
            "deposit_funds": "Moves idle capital into yield strategy after validation steps.",
            "stake_tokens": "Enables additional yield when lockup and smart contract risk remain bounded.",
            "bridge_assets": "Ensures cross-chain movement is intentional and constrained.",
        }

        return PlannerAction(
            id=f"ACT-{index:02d}",
            type=action_type,  # type: ignore[arg-type]
            description=descriptions[action_type],
            reason=reasons[action_type],
            risk_level="low",
        )

    def _extract_requested_actions(self, prompt: str) -> list[str]:
        lowered = self._normalize_prompt(prompt)
        requested: list[str] = []
        for action_type in DEFAULT_ACTION_ORDER:
            action_hint = action_type.replace("_", " ")
            if action_hint in lowered:
                requested.append(action_type)

        if not requested:
            requested = ["check_protocol_options", "deposit_funds"]

        # Keep deterministic order and remove accidental duplicates.
        return list(dict.fromkeys(requested))

    def plan(self, payload: PlannerRequest) -> PlannerResponse:
        if self._is_unsafe_prompt(payload.prompt):
            actions = self._safe_fallback_actions()
            safety_note = (
                "Prompt contained unsafe language. Planner returned a minimal analysis-only safe plan."
            )
        else:
            actions = self._extract_requested_actions(payload.prompt)
            safety_note = "Plan-only mode. No transactions are executed."

        return PlannerResponse(
            prompt=payload.prompt,
            intent=DEFAULT_INTENT,
            safety_note=safety_note,
            actions=[self._build_action(action_type, idx + 1) for idx, action_type in enumerate(actions)],
        )
