from fastapi import APIRouter

router = APIRouter(prefix="/health")


@router.get("/ping", tags=["health"])
def ping() -> dict:
    return {"message": "pong"}
