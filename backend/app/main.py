from fastapi import FastAPI

from app.api.v1.router import api_router
from app.config.settings import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
)

app.include_router(api_router, prefix=settings.API_V1_PREFIX)
