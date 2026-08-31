from __future__ import annotations

import enum
import uuid
from datetime import date, datetime
from typing import List, Optional

from sqlalchemy import (
    ARRAY,
    Boolean,
    Date,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import TimestampMixin, UUIDMixin


class PolarRegion(str, enum.Enum):
    ARCTIC = "arctic"
    ANTARCTIC = "antarctic"
    HIMALAYA = "himalaya"
    SOUTHERN_OCEAN = "southern_ocean"
    GLOBAL = "global"


class AccessLevel(str, enum.Enum):
    PUBLIC = "public"
    EDUCATOR = "educator"
    RESEARCHER = "researcher"
    RESTRICTED = "restricted"


class ExpeditionStatus(str, enum.Enum):
    PLANNED = "planned"
    ONGOING = "ongoing"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class EventSeverity(str, enum.Enum):
    LOW = "low"
    MODERATE = "moderate"
    HIGH = "high"
    CRITICAL = "critical"


POLAR_REGION_ENUM = Enum(
    PolarRegion, name="polar_region", values_callable=lambda e: [m.value for m in e]
)
ACCESS_LEVEL_ENUM = Enum(
    AccessLevel, name="access_level", values_callable=lambda e: [m.value for m in e]
)
EXPEDITION_STATUS_ENUM = Enum(
    ExpeditionStatus, name="expedition_status", values_callable=lambda e: [m.value for m in e]
)
EVENT_SEVERITY_ENUM = Enum(
    EventSeverity, name="event_severity", values_callable=lambda e: [m.value for m in e]
)


class Scientist(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "scientists"

    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL")
    )
    full_name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    orcid_id: Mapped[Optional[str]] = mapped_column(String(32), unique=True)
    email: Mapped[Optional[str]] = mapped_column(String(255))
    institution: Mapped[Optional[str]] = mapped_column(String(255))
    country: Mapped[Optional[str]] = mapped_column(String(120))
    specialization: Mapped[Optional[str]] = mapped_column(String(255))
    bio: Mapped[Optional[str]] = mapped_column(Text)
    photo_url: Mapped[Optional[str]] = mapped_column(Text)
    h_index: Mapped[int] = mapped_column(Integer, default=0)
    citation_count: Mapped[int] = mapped_column(Integer, default=0)
    publication_count: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    publications: Mapped[List["Publication"]] = relationship(back_populates="lead_scientist")
    expeditions: Mapped[List["Expedition"]] = relationship(back_populates="lead_scientist")


class Publication(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "publications"

    title: Mapped[str] = mapped_column(Text, nullable=False, index=True)
    abstract: Mapped[Optional[str]] = mapped_column(Text)
    doi: Mapped[Optional[str]] = mapped_column(String(255), unique=True, index=True)
    journal: Mapped[Optional[str]] = mapped_column(String(255))
    authors: Mapped[Optional[List[str]]] = mapped_column(ARRAY(String))
    keywords: Mapped[Optional[List[str]]] = mapped_column(ARRAY(String))
    region: Mapped[PolarRegion] = mapped_column(
        POLAR_REGION_ENUM,
        default=PolarRegion.GLOBAL,
    )
    published_on: Mapped[Optional[date]] = mapped_column(Date)
    citation_count: Mapped[int] = mapped_column(Integer, default=0)
    source: Mapped[Optional[str]] = mapped_column(String(64))
    url: Mapped[Optional[str]] = mapped_column(Text)
    is_open_access: Mapped[bool] = mapped_column(Boolean, default=True)
    lead_scientist_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("scientists.id", ondelete="SET NULL")
    )

    lead_scientist: Mapped[Optional["Scientist"]] = relationship(back_populates="publications")


class Dataset(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "datasets"

    title: Mapped[str] = mapped_column(String(500), nullable=False, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text)
    category: Mapped[Optional[str]] = mapped_column(String(120), index=True)
    region: Mapped[PolarRegion] = mapped_column(
        POLAR_REGION_ENUM,
        default=PolarRegion.GLOBAL,
    )
    source: Mapped[Optional[str]] = mapped_column(String(120))
    source_url: Mapped[Optional[str]] = mapped_column(Text)
    file_format: Mapped[Optional[str]] = mapped_column(String(32))
    size_mb: Mapped[Optional[float]] = mapped_column(Float)
    variables: Mapped[Optional[List[str]]] = mapped_column(ARRAY(String))
    access_level: Mapped[AccessLevel] = mapped_column(
        ACCESS_LEVEL_ENUM,
        default=AccessLevel.PUBLIC,
    )
    temporal_start: Mapped[Optional[date]] = mapped_column(Date)
    temporal_end: Mapped[Optional[date]] = mapped_column(Date)
    download_count: Mapped[int] = mapped_column(Integer, default=0)
    is_live: Mapped[bool] = mapped_column(Boolean, default=False)
    last_synced_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    uploaded_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL")
    )

    observations: Mapped[List["Observation"]] = relationship(
        back_populates="dataset", cascade="all, delete-orphan"
    )


class Station(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "stations"

    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    code: Mapped[Optional[str]] = mapped_column(String(32), unique=True)
    country: Mapped[Optional[str]] = mapped_column(String(120))
    operator: Mapped[Optional[str]] = mapped_column(String(255))
    region: Mapped[PolarRegion] = mapped_column(
        POLAR_REGION_ENUM,
        default=PolarRegion.ANTARCTIC,
    )
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    elevation_m: Mapped[Optional[float]] = mapped_column(Float)
    established_year: Mapped[Optional[int]] = mapped_column(Integer)
    is_operational: Mapped[bool] = mapped_column(Boolean, default=True)
    current_temperature_c: Mapped[Optional[float]] = mapped_column(Float)
    current_wind_kph: Mapped[Optional[float]] = mapped_column(Float)
    last_reading_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    description: Mapped[Optional[str]] = mapped_column(Text)

    expeditions: Mapped[List["Expedition"]] = relationship(back_populates="station")


class Expedition(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "expeditions"

    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    code: Mapped[Optional[str]] = mapped_column(String(64), unique=True)
    objective: Mapped[Optional[str]] = mapped_column(Text)
    region: Mapped[PolarRegion] = mapped_column(
        POLAR_REGION_ENUM,
        default=PolarRegion.ANTARCTIC,
    )
    status: Mapped[ExpeditionStatus] = mapped_column(
        EXPEDITION_STATUS_ENUM,
        default=ExpeditionStatus.PLANNED,
    )
    start_date: Mapped[Optional[date]] = mapped_column(Date)
    end_date: Mapped[Optional[date]] = mapped_column(Date)
    vessel: Mapped[Optional[str]] = mapped_column(String(255))
    team_size: Mapped[Optional[int]] = mapped_column(Integer)
    route: Mapped[Optional[dict]] = mapped_column(JSONB)
    station_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("stations.id", ondelete="SET NULL")
    )
    lead_scientist_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("scientists.id", ondelete="SET NULL")
    )

    station: Mapped[Optional["Station"]] = relationship(back_populates="expeditions")
    lead_scientist: Mapped[Optional["Scientist"]] = relationship(back_populates="expeditions")


class EnvironmentalEvent(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "environmental_events"

    title: Mapped[str] = mapped_column(String(500), nullable=False)
    event_type: Mapped[str] = mapped_column(String(120), index=True)
    description: Mapped[Optional[str]] = mapped_column(Text)
    region: Mapped[PolarRegion] = mapped_column(
        POLAR_REGION_ENUM,
        default=PolarRegion.GLOBAL,
    )
    severity: Mapped[EventSeverity] = mapped_column(
        EVENT_SEVERITY_ENUM,
        default=EventSeverity.MODERATE,
    )
    latitude: Mapped[Optional[float]] = mapped_column(Float)
    longitude: Mapped[Optional[float]] = mapped_column(Float)
    metric_value: Mapped[Optional[float]] = mapped_column(Float)
    metric_unit: Mapped[Optional[str]] = mapped_column(String(32))
    occurred_on: Mapped[Optional[date]] = mapped_column(Date, index=True)
    source: Mapped[Optional[str]] = mapped_column(String(120))
    source_url: Mapped[Optional[str]] = mapped_column(Text)


class Observation(UUIDMixin, Base):
    __tablename__ = "observations"

    dataset_id: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("datasets.id", ondelete="CASCADE"), nullable=False, index=True
    )
    station_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("stations.id", ondelete="SET NULL")
    )
    variable: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    value: Mapped[float] = mapped_column(Float, nullable=False)
    unit: Mapped[Optional[str]] = mapped_column(String(32))
    region: Mapped[PolarRegion] = mapped_column(
        POLAR_REGION_ENUM,
        default=PolarRegion.GLOBAL,
    )
    observed_on: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )

    dataset: Mapped["Dataset"] = relationship(back_populates="observations")


class DailyUpdateLog(UUIDMixin, Base):
    __tablename__ = "daily_update_logs"

    task_name: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    source: Mapped[Optional[str]] = mapped_column(String(120))
    status: Mapped[str] = mapped_column(String(32), default="success")
    records_created: Mapped[int] = mapped_column(Integer, default=0)
    records_updated: Mapped[int] = mapped_column(Integer, default=0)
    message: Mapped[Optional[str]] = mapped_column(Text)
    duration_seconds: Mapped[Optional[float]] = mapped_column(Float)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    finished_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
