from fastapi import APIRouter

from app.schemas.planner import PlannerRequest, PlannerResponse
from app.services.planner import PlannerService

router = APIRouter()
service = PlannerService()


@router.post("/plan", response_model=PlannerResponse)
def create_plan(payload: PlannerRequest) -> PlannerResponse:
    return service.create_plan(payload)
