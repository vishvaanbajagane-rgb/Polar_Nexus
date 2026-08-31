import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user
from app.core.security import REFRESH_TOKEN_TYPE, decode_token
from app.models.user import User, UserRole
from app.schemas.user import (
    LoginRequest,
    RefreshRequest,
    ResearcherApplicationCreate,
    ResearcherApplicationRead,
    RoleSelectionRequest,
    Token,
    UserCreate,
    UserRead,
)
from app.services import auth_service

router = APIRouter()


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(payload: UserCreate, db: AsyncSession = Depends(get_db)) -> Token:
    user = await auth_service.register_user(db, payload)
    return auth_service.build_token_response(user)


@router.post("/login", response_model=Token)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)) -> Token:
    user = await auth_service.authenticate(db, payload.email, payload.password)
    return auth_service.build_token_response(user)


@router.post("/token", response_model=Token, include_in_schema=False)
async def login_oauth2(
    form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)
) -> Token:
    """OAuth2 password-flow endpoint so the Swagger 'Authorize' button works."""
    user = await auth_service.authenticate(db, form_data.username, form_data.password)
    return auth_service.build_token_response(user)


@router.post("/refresh", response_model=Token)
async def refresh(payload: RefreshRequest, db: AsyncSession = Depends(get_db)) -> Token:
    decoded = decode_token(payload.refresh_token)
    if not decoded or decoded.get("type") != REFRESH_TOKEN_TYPE:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    user = await db.get(User, uuid.UUID(str(decoded["sub"])))
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    return auth_service.build_token_response(user)


@router.get("/me", response_model=UserRead)
async def read_me(current_user: User = Depends(get_current_user)) -> User:
    return current_user


@router.post("/role-selection", response_model=UserRead)
async def select_role(
    payload: RoleSelectionRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Public and educator roles are self-service; researcher needs an application."""
    if payload.role in (UserRole.ADMIN, UserRole.RESEARCHER):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Researcher and admin access must be granted by an administrator",
        )
    if current_user.role == UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Administrators cannot change their own role"
        )
    current_user.role = payload.role
    await db.flush()
    await db.refresh(current_user)
    return current_user


@router.post(
    "/researcher-application",
    response_model=ResearcherApplicationRead,
    status_code=status.HTTP_201_CREATED,
)
async def apply_as_researcher(
    payload: ResearcherApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if current_user.role in (UserRole.RESEARCHER, UserRole.ADMIN):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="You already have researcher access"
        )
    return await auth_service.submit_researcher_application(
        db,
        current_user,
        institution=payload.institution,
        designation=payload.designation,
        research_area=payload.research_area,
        orcid_id=payload.orcid_id,
        motivation=payload.motivation,
        supporting_document_url=payload.supporting_document_url,
    )
