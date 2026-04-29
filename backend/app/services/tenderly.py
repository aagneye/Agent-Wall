from app.schemas.tenderly import (
    TenderlySimulationRequest,
    TenderlySimulationResponse,
    TokenMovementPreview,
)


class TenderlyService:
    def simulate(self, payload: TenderlySimulationRequest) -> TenderlySimulationResponse:
        return TenderlySimulationResponse(
            token_movements=[
                TokenMovementPreview(
                    token=payload.token_symbol,
                    direction="out",
                    amount_usd=payload.amount_usd,
                )
            ],
            gas_estimate_usd=0,
            approval_size_usd=0,
            transaction_failure_risk="low",
            suspicious_behavior_detected=False,
            human_explanation="Simulation placeholder active. Human-readable explanation will be generated.",
        )
