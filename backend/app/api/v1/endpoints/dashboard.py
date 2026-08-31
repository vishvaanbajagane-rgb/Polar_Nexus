import asyncio

from fastapi import APIRouter, BackgroundTasks, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import require_admin
from app.models.science import (
    DailyUpdateLog,
    Dataset,
    EnvironmentalEvent,
    Expedition,
    ExpeditionStatus,
    Observation,
    PolarRegion,
    Publication,
    Scientist,
    Station,
)
from app.models.user import ApplicationStatus, ResearcherApplication, User
from app.schemas.science import DailyUpdateLogRead, DashboardStats

router = APIRouter()


@router.get("/stats", response_model=DashboardStats)
async def stats(db: AsyncSession = Depends(get_db)) -> DashboardStats:
    async def count(model, *conditions) -> int:
        stmt = select(func.count(model.id))
        for condition in conditions:
            stmt = stmt.where(condition)
        return (await db.execute(stmt)).scalar_one()

    sea_ice_rows = (
        await db.execute(
            select(Observation)
            .where(
                Observation.variable == "sea_ice_extent",
                Observation.region == PolarRegion.ARCTIC,
            )
            .order_by(Observation.observed_on.desc())
            .limit(90)
        )
    ).scalars().all()

    recent_events = (
        await db.execute(
            select(EnvironmentalEvent)
            .order_by(EnvironmentalEvent.occurred_on.desc().nullslast())
            .limit(5)
        )
    ).scalars().all()

    last_update = (
        await db.execute(select(func.max(DailyUpdateLog.finished_at)))
    ).scalar_one_or_none()

    return DashboardStats(
        total_datasets=await count(Dataset),
        total_publications=await count(Publication),
        total_scientists=await count(Scientist),
        total_stations=await count(Station),
        active_expeditions=await count(Expedition, Expedition.status == ExpeditionStatus.ONGOING),
        pending_applications=await count(
            ResearcherApplication, ResearcherApplication.status == ApplicationStatus.PENDING
        ),
        latest_sea_ice_extent_mkm2=sea_ice_rows[0].value if sea_ice_rows else None,
        sea_ice_trend=list(reversed(sea_ice_rows)),
        recent_events=recent_events,
        last_daily_update=last_update,
    )


@router.get("/update-logs", response_model=list[DailyUpdateLogRead])
async def update_logs(
    limit: int = Query(25, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    rows = (
        await db.execute(
            select(DailyUpdateLog).order_by(DailyUpdateLog.started_at.desc()).limit(limit)
        )
    ).scalars().all()
    return rows


@router.post("/trigger-daily-update")
async def trigger_daily_update(
    background_tasks: BackgroundTasks,
    days: int = Query(1, ge=1, le=90),
    _: User = Depends(require_admin),
):
    """Try Celery first but never block the request on a missing broker.

    Redis/Celery is optional for local development; when it is unavailable the
    endpoint should fall back immediately to a background worker thread instead of
    hanging until the broker connection times out.
    """
    try:
        from app.tasks.daily_updates import run_daily_update as celery_task

        async_result = await asyncio.wait_for(
            asyncio.to_thread(celery_task.delay, days),
            timeout=2.0,
        )
        return {"queued": True, "runner": "celery", "task_id": str(async_result.id)}
    except Exception:
        from app.services.daily_update_service import run_daily_update

        background_tasks.add_task(run_daily_update, days)
        return {"queued": True, "runner": "background-task", "task_id": None}
