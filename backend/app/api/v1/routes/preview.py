from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.schemas.preview import PreviewSimulateRequest

router = APIRouter()


@router.post("/simulate")
def simulate_preview(_payload: PreviewSimulateRequest) -> JSONResponse:
    """Placeholder until preview/simulation is implemented. Response body is JSON null."""
    return JSONResponse(content=None)
