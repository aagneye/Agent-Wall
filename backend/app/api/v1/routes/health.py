from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def healthcheck_get() -> dict[str, str]:
    return {"status": "ok"}


@router.post("/")
def healthcheck_post() -> dict[str, str]:
    return {"status": "ok"}
