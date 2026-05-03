"""In-memory gate: execution requires a prior security evaluate with policy allowed.

Replace with persisted audit trail once DB-backed evaluate exists."""

from typing import Literal

_run_evaluated_allowed: dict[str, bool] = {}


def record_security_evaluation(run_id: str, policy_allowed: bool) -> None:
    """Record the outcome of POST /agent/security/evaluate for this run."""
    _run_evaluated_allowed[run_id] = policy_allowed


def execution_gate_status(run_id: str) -> Literal["missing", "denied", "allowed"]:
    """Whether this run_id may call POST /agent/execute."""
    if run_id not in _run_evaluated_allowed:
        return "missing"
    return "allowed" if _run_evaluated_allowed[run_id] else "denied"
