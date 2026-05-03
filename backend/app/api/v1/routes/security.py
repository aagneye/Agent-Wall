from fastapi import APIRouter

from app.agents.security import SecurityAgent
from app.schemas.security import (
    ProposedAction,
    SecurityEvaluationFromPlanRequest,
    SecurityEvaluationRequest,
    SecurityEvaluationResponse,
)

router = APIRouter()
agent = SecurityAgent()


def _security_request_from_plan(payload: SecurityEvaluationFromPlanRequest) -> SecurityEvaluationRequest:
    proposed_actions: list[ProposedAction] = []
    for action in payload.plan.actions:
        proposed_actions.append(
            ProposedAction(
                id=action.id,
                type=action.type,
                protocol="planned",
                contract_address="0x0000000000000000000000000000000000000001",
                target_address="0x0000000000000000000000000000000000000002",
                token_symbol="USDC",
                amount_usd=0.0,
                approval_amount_usd=0.0,
                approval_scope="none",
                approval_expires_in_minutes=0,
                wallet_balance_usd=10_000.0,
            )
        )
    return SecurityEvaluationRequest(
        wallet_address="0x0000000000000000000000000000000000000000",
        proposed_actions=proposed_actions,
    )


@router.post("/evaluate", response_model=SecurityEvaluationResponse)
def evaluate_security(payload: SecurityEvaluationFromPlanRequest) -> SecurityEvaluationResponse:
    _ = payload.run_id
    return agent.evaluate(_security_request_from_plan(payload))
