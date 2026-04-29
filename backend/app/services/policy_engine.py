from app.schemas.security import PolicyFinding, ProposedAction

SPENDING_CAP_USD = 25_000
PROTOCOL_ALLOWLIST = {"aave", "compound", "morpho"}


class PolicyEngine:
    def _enforce_protocol_allowlist(self, actions: list[ProposedAction]) -> PolicyFinding:
        unknown_protocols = sorted({item.protocol.lower() for item in actions if item.protocol.lower() not in PROTOCOL_ALLOWLIST})
        passed = len(unknown_protocols) == 0
        return PolicyFinding(
            policy_id="protocol_allowlist",
            passed=passed,
            explanation=(
                "All protocols are allowlisted."
                if passed
                else f"Non-allowlisted protocols detected: {', '.join(unknown_protocols)}."
            ),
        )

    def _enforce_spending_cap(self, actions: list[ProposedAction]) -> PolicyFinding:
        total_spend = sum(item.amount_usd for item in actions)
        passed = total_spend <= SPENDING_CAP_USD
        return PolicyFinding(
            policy_id="transaction_spending_caps",
            passed=passed,
            explanation=(
                f"Total proposed spend ${total_spend:,.0f} is within cap ${SPENDING_CAP_USD:,.0f}."
                if passed
                else f"Total proposed spend ${total_spend:,.0f} exceeds cap ${SPENDING_CAP_USD:,.0f}."
            ),
        )

    def evaluate(self, actions: list[ProposedAction], risk_score: int) -> tuple[list[PolicyFinding], str]:
        findings: list[PolicyFinding] = [
            self._enforce_spending_cap(actions),
            self._enforce_protocol_allowlist(actions),
        ]
        recommendation = "approve" if risk_score < 35 else "needs_human_review"
        return findings, recommendation
