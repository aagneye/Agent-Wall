from app.schemas.security import PolicyFinding, ProposedAction


class PolicyEngine:
    def evaluate(self, actions: list[ProposedAction], risk_score: int) -> tuple[list[PolicyFinding], str]:
        findings: list[PolicyFinding] = []
        recommendation = "approve" if risk_score < 35 else "needs_human_review"
        return findings, recommendation
