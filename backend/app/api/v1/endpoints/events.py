from typing import Optional

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import require_min_role
from app.models.science import EnvironmentalEvent, EventSeverity, PolarRegion
from app.models.user import User, UserRole
from app.schemas.science import EventCreate, EventRead

router = APIRouter()


@router.get("", response_model=list[EventRead])
async def list_events(
    region: Optional[PolarRegion] = None,
    severity: Optional[EventSeverity] = None,
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(EnvironmentalEvent)
    if region:
        stmt = stmt.where(EnvironmentalEvent.region == region)
    if severity:
        stmt = stmt.where(EnvironmentalEvent.severity == severity)
    stmt = stmt.order_by(EnvironmentalEvent.occurred_on.desc().nullslast()).limit(limit)
    return (await db.execute(stmt)).scalars().all()


@router.post("", response_model=EventRead, status_code=status.HTTP_201_CREATED)
async def create_event(
    payload: EventCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_min_role(UserRole.RESEARCHER)),
):
    event = EnvironmentalEvent(**payload.model_dump())
    db.add(event)
    await db.flush()
    await db.refresh(event)
    return event
