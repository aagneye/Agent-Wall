from fastapi import APIRouter

from app.agents.security import SecurityAgent
from app.schemas.security import SecurityEvaluationRequest, SecurityEvaluationResponse

router = APIRouter()
agent = SecurityAgent()


@router.post("/evaluate", response_model=SecurityEvaluationResponse)
def evaluate_security(payload: SecurityEvaluationRequest) -> SecurityEvaluationResponse:
    return agent.evaluate(payload)
