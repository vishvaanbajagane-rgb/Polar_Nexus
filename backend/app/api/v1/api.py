from fastapi import APIRouter

from app.api.v1.endpoints import (
    ai_assistant,
    auth,
    dashboard,
    datasets,
    events,
    expeditions,
    publications,
    scientists,
    stations,
    users,
)

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(datasets.router, prefix="/datasets", tags=["datasets"])
api_router.include_router(publications.router, prefix="/publications", tags=["publications"])
api_router.include_router(scientists.router, prefix="/scientists", tags=["scientists"])
api_router.include_router(expeditions.router, prefix="/expeditions", tags=["expeditions"])
api_router.include_router(stations.router, prefix="/stations", tags=["stations"])
api_router.include_router(events.router, prefix="/events", tags=["events"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(ai_assistant.router, prefix="/ai-assistant", tags=["ai-assistant"])
