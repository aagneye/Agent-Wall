from app.schemas.security import SecurityEvaluationRequest, SecurityEvaluationResponse
from app.services.policy_engine import PolicyEngine
from app.services.risk_engine import RiskEngine


class SecurityAgent:
    def __init__(self) -> None:
        self._risk_engine = RiskEngine()
        self._policy_engine = PolicyEngine()

    def evaluate(self, payload: SecurityEvaluationRequest) -> SecurityEvaluationResponse:
        risk_score, risk_findings, risk_explanation = self._risk_engine.evaluate(payload.proposed_actions)
        policy_findings, approval_recommendation = self._policy_engine.evaluate(
            payload.proposed_actions,
            risk_score,
        )
        return SecurityEvaluationResponse(
            risk_score=risk_score,
            risk_explanation=risk_explanation,
            approval_recommendation=approval_recommendation,  # type: ignore[arg-type]
            risk_findings=risk_findings,
            policy_findings=policy_findings,
        )
