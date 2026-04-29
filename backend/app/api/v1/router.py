from fastapi import APIRouter

from app.api.v1.routes.agent_console import router as agent_console_router
from app.api.v1.routes.health import router as health_router
from app.api.v1.routes.planner import router as planner_router

api_router = APIRouter()
api_router.include_router(health_router, prefix="/health", tags=["health"])
api_router.include_router(agent_console_router, prefix="/agent/console", tags=["agent-console"])
api_router.include_router(planner_router, prefix="/agent/planner", tags=["planner"])
