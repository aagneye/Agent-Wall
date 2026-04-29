from app.schemas.security import ProposedAction, RiskFinding

RISK_WEIGHTS = {
    "suspicious_approvals": 20,
    "unlimited_token_approvals": 20,
    "malicious_contract_patterns": 20,
    "protocol_trust_score": 15,
    "wallet_drain_patterns": 20,
    "unusual_transaction_size": 15,
    "unknown_address_interactions": 10,
    "approval_scope_risk": 10,
}


class RiskEngine:
    def _finding(self, rule_id: str, severity: str, impact: int, explanation: str) -> RiskFinding:
        return RiskFinding(
            rule_id=rule_id,
            severity=severity,  # type: ignore[arg-type]
            score_impact=impact,
            explanation=explanation,
        )
