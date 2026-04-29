from app.schemas.security import PolicyFinding, ProposedAction

SPENDING_CAP_USD = 25_000


class PolicyEngine:
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
        findings: list[PolicyFinding] = [self._enforce_spending_cap(actions)]
        recommendation = "approve" if risk_score < 35 else "needs_human_review"
        return findings, recommendation
