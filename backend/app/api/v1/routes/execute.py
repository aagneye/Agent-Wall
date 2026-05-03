import json
from datetime import UTC, datetime
from typing import Any

from fastapi import APIRouter, HTTPException

from app.schemas.execute import AgentExecuteRequest, AgentExecuteResponse
from app.services.execution_gate import execution_gate_status, last_recorded_risk_score
from app.services.keeperhub import execute_transaction
from app.services.zerog_storage import log_audit_event

router = APIRouter()


def _plan_summary(plan: dict[str, Any]) -> str:
    intent = plan.get("intent")
    actions = plan.get("actions")
    if isinstance(actions, list):
        return f"{intent!s}: {len(actions)} action(s)"
    return json.dumps(plan, ensure_ascii=False, sort_keys=True)[:280]


@router.post("", response_model=AgentExecuteResponse)
async def agent_execute(payload: AgentExecuteRequest) -> AgentExecuteResponse:
    """Relay execution to KeeperHub only when policy allowed evaluate exists for this run."""
    gate = execution_gate_status(payload.run_id)
    if gate == "missing":
        raise HTTPException(
            status_code=403,
            detail="Security evaluation has not been recorded for this run_id.",
        )
    if gate == "denied":
        raise HTTPException(
            status_code=403,
            detail="Execution blocked: policy_result.allowed was false for this run_id.",
        )

    raw = await execute_transaction(payload.plan, payload.user_address)
    keeper_job_id = raw["keeper_job_id"]
    risk = last_recorded_risk_score(payload.run_id)

    await log_audit_event(
        payload.run_id,
        {
            "run_id": payload.run_id,
            "plan_summary": _plan_summary(payload.plan),
            "security_score": risk if risk is not None else -1,
            "keeper_job_id": keeper_job_id,
            "timestamp": datetime.now(UTC).isoformat(),
            "user_address": payload.user_address,
        },
    )

    return AgentExecuteResponse(
        job_id=keeper_job_id,
        status=raw["status"],
        audit_trail_id=raw["audit_trail_id"],
    )
