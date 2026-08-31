import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.user import ApplicationStatus, UserRole


class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=2, max_length=255)
    organization: Optional[str] = None
    country: Optional[str] = None
    orcid_id: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=128)
    role: UserRole = UserRole.PUBLIC


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    organization: Optional[str] = None
    country: Optional[str] = None
    orcid_id: Optional[str] = None
    avatar_url: Optional[str] = None


class UserRead(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    role: UserRole
    is_active: bool
    is_verified: bool
    avatar_url: Optional[str] = None
    last_login_at: Optional[datetime] = None
    created_at: datetime


class UserAdminUpdate(BaseModel):
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserRead


class RefreshRequest(BaseModel):
    refresh_token: str


class RoleSelectionRequest(BaseModel):
    role: UserRole


class ResearcherApplicationCreate(BaseModel):
    institution: str = Field(min_length=2, max_length=255)
    designation: Optional[str] = None
    research_area: Optional[str] = None
    orcid_id: Optional[str] = None
    motivation: Optional[str] = None
    supporting_document_url: Optional[str] = None


class ResearcherApplicationReview(BaseModel):
    status: ApplicationStatus
    review_notes: Optional[str] = None


class ResearcherApplicationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    institution: str
    designation: Optional[str] = None
    research_area: Optional[str] = None
    orcid_id: Optional[str] = None
    motivation: Optional[str] = None
    supporting_document_url: Optional[str] = None
    status: ApplicationStatus
    review_notes: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    created_at: datetime
    user: Optional[UserRead] = None
