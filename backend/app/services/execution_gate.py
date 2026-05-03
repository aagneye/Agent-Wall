"""In-memory gate: execution requires a prior security evaluate with policy allowed.

Replace with persisted audit trail once DB-backed evaluate exists."""

from dataclasses import dataclass
from typing import Literal

_RUN_SECURITY: dict[str, _RunSecurityRecord] = {}


@dataclass(frozen=True)
class _RunSecurityRecord:
    policy_allowed: bool
    risk_score: int


def record_security_evaluation(run_id: str, policy_allowed: bool, risk_score: int) -> None:
    """Record the outcome of POST /agent/security/evaluate for this run."""
    _RUN_SECURITY[run_id] = _RunSecurityRecord(policy_allowed=policy_allowed, risk_score=risk_score)


def execution_gate_status(run_id: str) -> Literal["missing", "denied", "allowed"]:
    """Whether this run_id may call POST /agent/execute."""
    record = _RUN_SECURITY.get(run_id)
    if record is None:
        return "missing"
    return "allowed" if record.policy_allowed else "denied"


def last_recorded_risk_score(run_id: str) -> int | None:
    """Risk score from the latest evaluate for this run, if any."""
    record = _RUN_SECURITY.get(run_id)
    return None if record is None else record.risk_score
