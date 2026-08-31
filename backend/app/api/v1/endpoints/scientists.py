import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import require_min_role
from app.core.pagination import paginate
from app.models.science import Publication, Scientist
from app.models.user import User, UserRole
from app.schemas.science import Page, PublicationRead, ScientistCreate, ScientistRead

router = APIRouter()


@router.get("", response_model=Page[ScientistRead])
async def list_scientists(
    search: Optional[str] = None,
    country: Optional[str] = None,
    page: int = Query(1, ge=1),
    size: int = Query(12, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Scientist).where(Scientist.is_active.is_(True))
    if country:
        stmt = stmt.where(Scientist.country == country)
    if search:
        pattern = f"%{search.lower()}%"
        stmt = stmt.where(
            or_(
                Scientist.full_name.ilike(pattern),
                Scientist.institution.ilike(pattern),
                Scientist.specialization.ilike(pattern),
            )
        )
    stmt = stmt.order_by(Scientist.citation_count.desc(), Scientist.full_name)
    return await paginate(db, stmt, page, size)


@router.get("/{scientist_id}", response_model=ScientistRead)
async def get_scientist(scientist_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    scientist = await db.get(Scientist, scientist_id)
    if not scientist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scientist not found")
    return scientist


@router.get("/{scientist_id}/publications", response_model=list[PublicationRead])
async def scientist_publications(scientist_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    rows = (
        await db.execute(
            select(Publication)
            .where(Publication.lead_scientist_id == scientist_id)
            .order_by(Publication.published_on.desc().nullslast())
        )
    ).scalars().all()
    return rows


@router.post("", response_model=ScientistRead, status_code=status.HTTP_201_CREATED)
async def create_scientist(
    payload: ScientistCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_min_role(UserRole.RESEARCHER)),
):
    scientist = Scientist(**payload.model_dump())
    db.add(scientist)
    await db.flush()
    await db.refresh(scientist)
    return scientist
