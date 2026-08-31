import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_optional_user, require_admin, require_min_role
from app.core.pagination import paginate
from app.models.science import AccessLevel, Dataset, Observation, PolarRegion
from app.models.user import User, UserRole
from app.schemas.science import (
    DatasetCreate,
    DatasetRead,
    DatasetUpdate,
    ObservationPoint,
    Page,
)

router = APIRouter()

VISIBLE_LEVELS = {
    None: [AccessLevel.PUBLIC],
    UserRole.PUBLIC: [AccessLevel.PUBLIC],
    UserRole.EDUCATOR: [AccessLevel.PUBLIC, AccessLevel.EDUCATOR],
    UserRole.RESEARCHER: [AccessLevel.PUBLIC, AccessLevel.EDUCATOR, AccessLevel.RESEARCHER],
    UserRole.ADMIN: list(AccessLevel),
}


def _visible_levels(user: Optional[User]) -> list[AccessLevel]:
    return VISIBLE_LEVELS[user.role if user else None]


@router.get("", response_model=Page[DatasetRead])
async def list_datasets(
    search: Optional[str] = None,
    region: Optional[PolarRegion] = None,
    category: Optional[str] = None,
    page: int = Query(1, ge=1),
    size: int = Query(12, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
):
    stmt = select(Dataset).where(Dataset.access_level.in_(_visible_levels(current_user)))
    if region:
        stmt = stmt.where(Dataset.region == region)
    if category:
        stmt = stmt.where(Dataset.category == category)
    if search:
        pattern = f"%{search.lower()}%"
        stmt = stmt.where(
            or_(Dataset.title.ilike(pattern), Dataset.description.ilike(pattern))
        )
    stmt = stmt.order_by(Dataset.created_at.desc())
    return await paginate(db, stmt, page, size)


@router.get("/categories", response_model=list[str])
async def list_categories(db: AsyncSession = Depends(get_db)):
    rows = (await db.execute(select(Dataset.category).distinct())).scalars().all()
    return sorted([row for row in rows if row])


@router.get("/{dataset_id}", response_model=DatasetRead)
async def get_dataset(
    dataset_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
):
    dataset = await db.get(Dataset, dataset_id)
    if not dataset or dataset.access_level not in _visible_levels(current_user):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dataset not found")
    return dataset


@router.get("/{dataset_id}/observations", response_model=list[ObservationPoint])
async def get_observations(
    dataset_id: uuid.UUID,
    limit: int = Query(365, ge=1, le=3650),
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
):
    dataset = await db.get(Dataset, dataset_id)
    if not dataset or dataset.access_level not in _visible_levels(current_user):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dataset not found")
    rows = (
        await db.execute(
            select(Observation)
            .where(Observation.dataset_id == dataset_id)
            .order_by(Observation.observed_on.desc())
            .limit(limit)
        )
    ).scalars().all()
    return list(reversed(rows))


@router.post("/{dataset_id}/download", response_model=DatasetRead)
async def register_download(
    dataset_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_role(UserRole.PUBLIC)),
):
    dataset = await db.get(Dataset, dataset_id)
    if not dataset or dataset.access_level not in _visible_levels(current_user):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dataset not found")
    dataset.download_count += 1
    await db.flush()
    await db.refresh(dataset)
    return dataset


@router.post("", response_model=DatasetRead, status_code=status.HTTP_201_CREATED)
async def create_dataset(
    payload: DatasetCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_role(UserRole.RESEARCHER)),
):
    dataset = Dataset(**payload.model_dump(), uploaded_by=current_user.id)
    db.add(dataset)
    await db.flush()
    await db.refresh(dataset)
    return dataset


@router.patch("/{dataset_id}", response_model=DatasetRead)
async def update_dataset(
    dataset_id: uuid.UUID,
    payload: DatasetUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_role(UserRole.RESEARCHER)),
):
    dataset = await db.get(Dataset, dataset_id)
    if not dataset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dataset not found")
    if current_user.role != UserRole.ADMIN and dataset.uploaded_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="You can only edit datasets you uploaded"
        )
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(dataset, field, value)
    await db.flush()
    await db.refresh(dataset)
    return dataset


@router.delete("/{dataset_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_dataset(
    dataset_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    dataset = await db.get(Dataset, dataset_id)
    if not dataset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dataset not found")
    await db.delete(dataset)
