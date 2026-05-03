from typing import Literal

from app.schemas.security import (
    PolicyFinding,
    PolicyResult,
    RiskFinding,
    RiskRow,
    SecurityEvaluationRequest,
    SecurityEvaluationResponse,
)
from app.services.policy_engine import PolicyEngine
from app.services.risk_engine import RiskEngine


def _risk_level_from_score(score: int) -> Literal["low", "medium", "high", "critical"]:
    if score < 40:
        return "low"
    if score <= 70:
        return "medium"
    if score <= 85:
        return "high"
    return "critical"


def _risk_rows_from_findings(findings: list[RiskFinding]) -> list[RiskRow]:
    rows: list[RiskRow] = []
    for finding in findings:
        severity_ui: Literal["low", "medium", "high", "critical"]
        if finding.severity == "high":
            severity_ui = "critical" if finding.score_impact >= 18 else "high"
        else:
            severity_ui = finding.severity
        rows.append(
            RiskRow(
                type=finding.rule_id,
                description=finding.explanation,
                severity=severity_ui,
            )
        )
    return rows


def _policy_result_from_findings(findings: list[PolicyFinding]) -> PolicyResult:
    failed = [item for item in findings if not item.passed]
    if not failed:
        return PolicyResult(allowed=True, reason="All policy checks passed.")
    reason = "; ".join(f"{item.policy_id}: {item.explanation}" for item in failed)
    if len(reason) > 800:
        reason = reason[:797] + "..."
    return PolicyResult(allowed=False, reason=reason)


class SecurityAgent:
    def __init__(self) -> None:
        self._risk_engine = RiskEngine()
        self._policy_engine = PolicyEngine()

    def evaluate(self, payload: SecurityEvaluationRequest) -> SecurityEvaluationResponse:
        risk_score, risk_findings, _risk_explanation = self._risk_engine.evaluate(payload.proposed_actions)
        policy_findings, _approval_recommendation = self._policy_engine.evaluate(
            payload.proposed_actions,
            risk_score,
        )
        return SecurityEvaluationResponse(
            risk_score=risk_score,
            risk_level=_risk_level_from_score(risk_score),
            risks=_risk_rows_from_findings(risk_findings),
            policy_result=_policy_result_from_findings(policy_findings),
        )
