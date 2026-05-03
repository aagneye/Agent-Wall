from fastapi import APIRouter

from app.schemas.explain import ExplainRequest, ExplainResponse
from app.services.llm_explainer import explain_transaction

router = APIRouter()


@router.post("", response_model=ExplainResponse)
async def agent_explain(payload: ExplainRequest) -> ExplainResponse:
    text = await explain_transaction(payload.plan, payload.security)
    return ExplainResponse(explanation=text)
