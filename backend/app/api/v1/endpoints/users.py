import uuid
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.core.deps import get_current_user, require_admin
from app.core.pagination import paginate
from app.models.user import ApplicationStatus, ResearcherApplication, User, UserRole
from app.schemas.user import (
    ResearcherApplicationRead,
    ResearcherApplicationReview,
    UserAdminUpdate,
    UserRead,
    UserUpdate,
)
from app.schemas.science import Page

router = APIRouter()


@router.patch("/me", response_model=UserRead)
async def update_me(
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)
    await db.flush()
    await db.refresh(current_user)
    return current_user


@router.get("/me/applications", response_model=list[ResearcherApplicationRead])
async def my_applications(
    current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    rows = (
        await db.execute(
            select(ResearcherApplication)
            .where(ResearcherApplication.user_id == current_user.id)
            .order_by(ResearcherApplication.created_at.desc())
        )
    ).scalars().all()
    return rows


@router.get("", response_model=Page[UserRead])
async def list_users(
    role: Optional[UserRole] = None,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    stmt = select(User)
    if role:
        stmt = stmt.where(User.role == role)
    return await paginate(db, stmt.order_by(User.created_at.desc()), page, size)


@router.patch("/{user_id}", response_model=UserRead)
async def admin_update_user(
    user_id: uuid.UUID,
    payload: UserAdminUpdate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if user.id == admin.id and payload.role and payload.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot demote your own admin account"
        )
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    await db.flush()
    await db.refresh(user)
    return user


@router.get("/applications/all", response_model=list[ResearcherApplicationRead])
async def list_applications(
    application_status: Optional[ApplicationStatus] = Query(None, alias="status"),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    stmt = select(ResearcherApplication).options(selectinload(ResearcherApplication.user))
    if application_status:
        stmt = stmt.where(ResearcherApplication.status == application_status)
    stmt = stmt.order_by(ResearcherApplication.created_at.desc())
    return (await db.execute(stmt)).scalars().all()


@router.post("/applications/{application_id}/review", response_model=ResearcherApplicationRead)
async def review_application(
    application_id: uuid.UUID,
    payload: ResearcherApplicationReview,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    application = (
        await db.execute(
            select(ResearcherApplication)
            .options(selectinload(ResearcherApplication.user))
            .where(ResearcherApplication.id == application_id)
        )
    ).scalar_one_or_none()
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    if application.status != ApplicationStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="This application has already been reviewed"
        )

    application.status = payload.status
    application.review_notes = payload.review_notes
    application.reviewed_by = admin.id
    application.reviewed_at = datetime.now(timezone.utc)

    if payload.status == ApplicationStatus.APPROVED:
        application.user.role = UserRole.RESEARCHER
        application.user.is_verified = True

    await db.flush()
    await db.refresh(application)
    return application
