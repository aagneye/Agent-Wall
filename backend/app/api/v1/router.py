from fastapi import APIRouter

from app.api.v1.routes.agent_console import router as agent_console_router
from app.api.v1.routes.execute import router as execute_router
from app.api.v1.routes.explain import router as explain_router
from app.api.v1.routes.health import router as health_router
from app.api.v1.routes.planner import router as planner_router
from app.api.v1.routes.preview import router as preview_router
from app.api.v1.routes.security import router as security_router

api_router = APIRouter()
api_router.include_router(health_router, prefix="/health", tags=["health"])
api_router.include_router(agent_console_router, prefix="/agent/console", tags=["agent-console"])
api_router.include_router(planner_router, prefix="/agent/planner", tags=["planner"])
api_router.include_router(security_router, prefix="/agent/security", tags=["security"])
api_router.include_router(preview_router, prefix="/agent/preview", tags=["preview"])
api_router.include_router(explain_router, prefix="/agent/explain", tags=["explain"])
api_router.include_router(execute_router, prefix="/agent/execute", tags=["execute"])
