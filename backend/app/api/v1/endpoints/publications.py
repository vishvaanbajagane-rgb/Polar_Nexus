import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import require_admin, require_min_role
from app.core.pagination import paginate
from app.models.science import PolarRegion, Publication
from app.models.user import User, UserRole
from app.schemas.science import Page, PublicationCreate, PublicationRead

router = APIRouter()


@router.get("", response_model=Page[PublicationRead])
async def list_publications(
    search: Optional[str] = None,
    region: Optional[PolarRegion] = None,
    open_access: Optional[bool] = None,
    page: int = Query(1, ge=1),
    size: int = Query(12, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Publication)
    if region:
        stmt = stmt.where(Publication.region == region)
    if open_access is not None:
        stmt = stmt.where(Publication.is_open_access.is_(open_access))
    if search:
        pattern = f"%{search.lower()}%"
        stmt = stmt.where(
            or_(
                Publication.title.ilike(pattern),
                Publication.abstract.ilike(pattern),
                Publication.journal.ilike(pattern),
            )
        )
    stmt = stmt.order_by(Publication.published_on.desc().nullslast(), Publication.created_at.desc())
    return await paginate(db, stmt, page, size)


@router.get("/{publication_id}", response_model=PublicationRead)
async def get_publication(publication_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    publication = await db.get(Publication, publication_id)
    if not publication:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Publication not found")
    return publication


@router.post("", response_model=PublicationRead, status_code=status.HTTP_201_CREATED)
async def create_publication(
    payload: PublicationCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_min_role(UserRole.RESEARCHER)),
):
    publication = Publication(**payload.model_dump(), source="manual")
    db.add(publication)
    await db.flush()
    await db.refresh(publication)
    return publication


@router.delete("/{publication_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_publication(
    publication_id: uuid.UUID, db: AsyncSession = Depends(get_db), _: User = Depends(require_admin)
):
    publication = await db.get(Publication, publication_id)
    if not publication:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Publication not found")
    await db.delete(publication)
