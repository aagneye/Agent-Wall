from fastapi import APIRouter

from app.schemas.explain import ExplainRequest, ExplainResponse
from app.services.llm_explainer import explain_transaction

router = APIRouter()


@router.post(
    "",
    response_model=ExplainResponse,
    summary="Explain transaction plan and security assessment",
)
async def agent_explain(payload: ExplainRequest) -> ExplainResponse:
    """Produce a plain-language explanation for the given plan and security payload."""
    text = await explain_transaction(payload.plan, payload.security)
    return ExplainResponse(explanation=text)
