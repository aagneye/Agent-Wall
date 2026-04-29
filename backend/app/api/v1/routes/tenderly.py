from fastapi import APIRouter

from app.schemas.tenderly import TenderlySimulationRequest, TenderlySimulationResponse
from app.services.tenderly import TenderlyService

router = APIRouter()
service = TenderlyService()


@router.post("/simulate", response_model=TenderlySimulationResponse)
def simulate_transaction(payload: TenderlySimulationRequest) -> TenderlySimulationResponse:
    return service.simulate(payload)
