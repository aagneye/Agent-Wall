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

PROTOCOL_TRUST_SCORES = {
    "aave": 90,
    "compound": 88,
    "morpho": 80,
    "unknown": 35,
}


class RiskEngine:
    def _check_unusual_transaction_size(self, actions: list[ProposedAction]) -> list[RiskFinding]:
        findings: list[RiskFinding] = []
        for action in actions:
            if action.amount_usd >= 50_000:
                findings.append(
                    self._finding(
                        "unusual_transaction_size",
                        "medium",
                        RISK_WEIGHTS["unusual_transaction_size"],
                        f"Action {action.id} has an unusually large transaction size (${action.amount_usd:,.0f}).",
                    )
                )
        return findings

    def _check_wallet_drain_patterns(self, actions: list[ProposedAction]) -> list[RiskFinding]:
        findings: list[RiskFinding] = []
        for action in actions:
            if action.wallet_balance_usd <= 0:
                continue
            ratio = action.amount_usd / action.wallet_balance_usd
            if ratio >= 0.75:
                findings.append(
                    self._finding(
                        "wallet_drain_patterns",
                        "high",
                        RISK_WEIGHTS["wallet_drain_patterns"],
                        f"Action {action.id} spends {ratio:.0%} of wallet balance, indicating drain risk.",
                    )
                )
        return findings

    def _check_protocol_trust_score(self, actions: list[ProposedAction]) -> list[RiskFinding]:
        findings: list[RiskFinding] = []
        for action in actions:
            trust_score = PROTOCOL_TRUST_SCORES.get(action.protocol.lower(), PROTOCOL_TRUST_SCORES["unknown"])
            if trust_score < 60:
                findings.append(
                    self._finding(
                        "protocol_trust_score",
                        "medium",
                        RISK_WEIGHTS["protocol_trust_score"],
                        f"Action {action.id} targets protocol with low trust score ({trust_score}/100).",
                    )
                )
        return findings

    def _check_malicious_contract_patterns(self, actions: list[ProposedAction]) -> list[RiskFinding]:
        findings: list[RiskFinding] = []
        suspicious_markers = ("dead", "beef", "bad", "rug")
        for action in actions:
            normalized = action.contract_address.lower()
            if any(marker in normalized for marker in suspicious_markers):
                findings.append(
                    self._finding(
                        "malicious_contract_patterns",
                        "high",
                        RISK_WEIGHTS["malicious_contract_patterns"],
                        f"Action {action.id} contract pattern is flagged as potentially malicious.",
                    )
                )
        return findings

    def _check_unlimited_approvals(self, actions: list[ProposedAction]) -> list[RiskFinding]:
        findings: list[RiskFinding] = []
        for action in actions:
            if action.approval_scope == "unlimited":
                findings.append(
                    self._finding(
                        "unlimited_token_approvals",
                        "high",
                        RISK_WEIGHTS["unlimited_token_approvals"],
                        f"Action {action.id} requests unlimited token approval scope.",
                    )
                )
        return findings

    def _check_suspicious_approvals(self, actions: list[ProposedAction]) -> list[RiskFinding]:
        findings: list[RiskFinding] = []
        for action in actions:
            if action.approval_amount_usd > action.amount_usd * 5 and action.amount_usd > 0:
                findings.append(
                    self._finding(
                        "suspicious_approvals",
                        "high",
                        RISK_WEIGHTS["suspicious_approvals"],
                        f"Action {action.id} approval is disproportionately large compared to transaction size.",
                    )
                )
        return findings

    def _finding(self, rule_id: str, severity: str, impact: int, explanation: str) -> RiskFinding:
        return RiskFinding(
            rule_id=rule_id,
            severity=severity,  # type: ignore[arg-type]
            score_impact=impact,
            explanation=explanation,
        )

    def evaluate(self, actions: list[ProposedAction]) -> tuple[int, list[RiskFinding], str]:
        findings: list[RiskFinding] = []
        findings.extend(self._check_suspicious_approvals(actions))
        findings.extend(self._check_unlimited_approvals(actions))
        findings.extend(self._check_malicious_contract_patterns(actions))
        findings.extend(self._check_protocol_trust_score(actions))
        findings.extend(self._check_wallet_drain_patterns(actions))
        findings.extend(self._check_unusual_transaction_size(actions))
        total_score = sum(item.score_impact for item in findings)
        risk_score = min(100, total_score)
        explanation = "Risk engine found no high-risk patterns in the proposed actions."
        return risk_score, findings, explanation
