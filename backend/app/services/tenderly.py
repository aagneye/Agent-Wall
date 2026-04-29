from app.schemas.tenderly import (
    TenderlySimulationRequest,
    TenderlySimulationResponse,
    TokenMovementPreview,
)


class TenderlyService:
    def _human_explanation(self, payload: TenderlySimulationRequest, approval_size: float) -> str:
        if payload.approval_scope == "none":
            return (
                f"This simulates a {payload.token_symbol} action worth about ${payload.amount_usd:,.0f} on "
                f"{payload.protocol}, with no token approval granted."
            )
        if payload.approval_scope == "unlimited":
            return (
                f"This grants unlimited {payload.token_symbol} approval to {payload.target}. "
                "This is high-risk and should be avoided."
            )
        return (
            f"This allows spending up to ${approval_size:,.0f} {payload.token_symbol} for {payload.target} "
            f"only for {payload.approval_duration_hours} hours."
        )

    def _estimate_gas_usd(self, payload: TenderlySimulationRequest) -> float:
        base = 1.8
        complexity = 0.9 if payload.approval_scope == "none" else 1.6
        return round(base + complexity + payload.amount_usd * 0.00004, 2)

    def _estimate_failure_risk(self, payload: TenderlySimulationRequest) -> str:
        if payload.approval_scope == "unlimited":
            return "high"
        if payload.amount_usd > 25_000:
            return "medium"
        return "low"

    def _detect_suspicious_behavior(self, payload: TenderlySimulationRequest) -> bool:
        if payload.approval_scope == "unlimited":
            return True
        if payload.amount_usd > 100_000:
            return True
        return False

    def simulate(self, payload: TenderlySimulationRequest) -> TenderlySimulationResponse:
        gas_estimate = self._estimate_gas_usd(payload)
        failure_risk = self._estimate_failure_risk(payload)
        suspicious_behavior = self._detect_suspicious_behavior(payload)
        approval_size = payload.approval_scope == "none" and 0 or payload.amount_usd
        return TenderlySimulationResponse(
            token_movements=[
                TokenMovementPreview(
                    token=payload.token_symbol,
                    direction="out",
                    amount_usd=payload.amount_usd,
                )
            ],
            gas_estimate_usd=gas_estimate,
            approval_size_usd=approval_size,
            transaction_failure_risk=failure_risk,  # type: ignore[arg-type]
            suspicious_behavior_detected=suspicious_behavior,
            human_explanation=self._human_explanation(payload, approval_size),
        )
