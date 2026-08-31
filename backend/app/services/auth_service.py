from datetime import datetime, timezone
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import create_access_token, create_refresh_token, hash_password, verify_password
from app.models.user import ApplicationStatus, ResearcherApplication, User, UserRole
from app.schemas.user import Token, UserCreate, UserRead


async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    result = await db.execute(select(User).where(User.email == email.lower()))
    return result.scalar_one_or_none()


async def register_user(db: AsyncSession, payload: UserCreate) -> User:
    if await get_user_by_email(db, payload.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="An account with this email already exists"
        )

    # Researcher access is never granted at signup - it requires admin approval.
    requested_role = payload.role
    initial_role = UserRole.PUBLIC if requested_role == UserRole.RESEARCHER else requested_role
    if requested_role == UserRole.ADMIN:
        initial_role = UserRole.PUBLIC

    user = User(
        email=payload.email.lower(),
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name,
        role=initial_role,
        organization=payload.organization,
        country=payload.country,
        orcid_id=payload.orcid_id,
        is_verified=initial_role in (UserRole.PUBLIC, UserRole.EDUCATOR),
    )
    db.add(user)
    await db.flush()
    await db.refresh(user)
    return user


async def authenticate(db: AsyncSession, email: str, password: str) -> User:
    user = await get_user_by_email(db, email)
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password"
        )
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is disabled")
    user.last_login_at = datetime.now(timezone.utc)
    await db.flush()
    return user


def build_token_response(user: User) -> Token:
    claims = {"role": user.role.value, "email": user.email}
    return Token(
        access_token=create_access_token(str(user.id), claims),
        refresh_token=create_refresh_token(str(user.id)),
        user=UserRead.model_validate(user),
    )


async def submit_researcher_application(
    db: AsyncSession, user: User, institution: str, **fields
) -> ResearcherApplication:
    existing = await db.execute(
        select(ResearcherApplication).where(
            ResearcherApplication.user_id == user.id,
            ResearcherApplication.status == ApplicationStatus.PENDING,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You already have a pending researcher application",
        )

    application = ResearcherApplication(user_id=user.id, institution=institution, **fields)
    db.add(application)
    await db.flush()
    await db.refresh(application)
    return application
