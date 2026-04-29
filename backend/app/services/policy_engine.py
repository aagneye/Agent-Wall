from app.schemas.security import PolicyFinding, ProposedAction

SPENDING_CAP_USD = 25_000
PROTOCOL_ALLOWLIST = {"aave", "compound", "morpho"}
HUMAN_APPROVAL_THRESHOLD = 55
APPROVAL_MAX_MINUTES = 1_440


class PolicyEngine:
    def _enforce_human_approval_threshold(self, risk_score: int) -> PolicyFinding:
        passed = risk_score < HUMAN_APPROVAL_THRESHOLD
        return PolicyFinding(
            policy_id="human_approval_threshold",
            passed=passed,
            explanation=(
                f"Risk score {risk_score} is below human-approval threshold {HUMAN_APPROVAL_THRESHOLD}."
                if passed
                else f"Risk score {risk_score} requires explicit human approval."
            ),
        )

    def _enforce_approval_expiration(self, actions: list[ProposedAction]) -> PolicyFinding:
        violating_ids = [
            action.id
            for action in actions
            if action.approval_scope != "none" and action.approval_expires_in_minutes > APPROVAL_MAX_MINUTES
        ]
        passed = len(violating_ids) == 0
        return PolicyFinding(
            policy_id="approval_expiration_rules",
            passed=passed,
            explanation=(
                "All approvals expire within policy limits."
                if passed
                else f"Actions with excessive approval expiry: {', '.join(violating_ids)}."
            ),
        )

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
            self._enforce_human_approval_threshold(risk_score),
            self._enforce_approval_expiration(actions),
        ]
        recommendation = "approve" if risk_score < 35 else "needs_human_review"
        return findings, recommendation
