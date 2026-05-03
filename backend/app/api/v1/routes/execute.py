from fastapi import APIRouter, HTTPException

from app.schemas.execute import AgentExecuteRequest, AgentExecuteResponse
from app.services.execution_gate import execution_gate_status
from app.services.keeperhub import execute_transaction

router = APIRouter()


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
    return AgentExecuteResponse(
        job_id=raw["keeper_job_id"],
        status=raw["status"],
        audit_trail_id=raw["audit_trail_id"],
    )
