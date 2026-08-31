import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import require_min_role
from app.core.pagination import paginate
from app.models.science import Expedition, ExpeditionStatus, PolarRegion
from app.models.user import User, UserRole
from app.schemas.science import ExpeditionCreate, ExpeditionRead, Page

router = APIRouter()


@router.get("", response_model=Page[ExpeditionRead])
async def list_expeditions(
    region: Optional[PolarRegion] = None,
    expedition_status: Optional[ExpeditionStatus] = Query(None, alias="status"),
    page: int = Query(1, ge=1),
    size: int = Query(12, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Expedition)
    if region:
        stmt = stmt.where(Expedition.region == region)
    if expedition_status:
        stmt = stmt.where(Expedition.status == expedition_status)
    stmt = stmt.order_by(Expedition.start_date.desc().nullslast())
    return await paginate(db, stmt, page, size)


@router.get("/{expedition_id}", response_model=ExpeditionRead)
async def get_expedition(expedition_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    expedition = await db.get(Expedition, expedition_id)
    if not expedition:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expedition not found")
    return expedition


@router.post("", response_model=ExpeditionRead, status_code=status.HTTP_201_CREATED)
async def create_expedition(
    payload: ExpeditionCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_min_role(UserRole.RESEARCHER)),
):
    expedition = Expedition(**payload.model_dump())
    db.add(expedition)
    await db.flush()
    await db.refresh(expedition)
    return expedition
