import uuid
from datetime import date, datetime
from typing import Generic, List, Optional, TypeVar

from pydantic import BaseModel, ConfigDict, Field

from app.models.science import (
    AccessLevel,
    EventSeverity,
    ExpeditionStatus,
    PolarRegion,
)

T = TypeVar("T")


class Page(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    size: int
    pages: int


class DatasetBase(BaseModel):
    title: str = Field(min_length=3, max_length=500)
    description: Optional[str] = None
    category: Optional[str] = None
    region: PolarRegion = PolarRegion.GLOBAL
    source: Optional[str] = None
    source_url: Optional[str] = None
    file_format: Optional[str] = None
    size_mb: Optional[float] = None
    variables: Optional[List[str]] = None
    access_level: AccessLevel = AccessLevel.PUBLIC
    temporal_start: Optional[date] = None
    temporal_end: Optional[date] = None


class DatasetCreate(DatasetBase):
    pass


class DatasetUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    region: Optional[PolarRegion] = None
    access_level: Optional[AccessLevel] = None
    source_url: Optional[str] = None


class DatasetRead(DatasetBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    download_count: int
    is_live: bool
    last_synced_at: Optional[datetime] = None
    created_at: datetime


class PublicationBase(BaseModel):
    title: str
    abstract: Optional[str] = None
    doi: Optional[str] = None
    journal: Optional[str] = None
    authors: Optional[List[str]] = None
    keywords: Optional[List[str]] = None
    region: PolarRegion = PolarRegion.GLOBAL
    published_on: Optional[date] = None
    url: Optional[str] = None
    is_open_access: bool = True


class PublicationCreate(PublicationBase):
    lead_scientist_id: Optional[uuid.UUID] = None


class PublicationRead(PublicationBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    citation_count: int
    source: Optional[str] = None
    lead_scientist_id: Optional[uuid.UUID] = None
    created_at: datetime


class ScientistBase(BaseModel):
    full_name: str
    orcid_id: Optional[str] = None
    email: Optional[str] = None
    institution: Optional[str] = None
    country: Optional[str] = None
    specialization: Optional[str] = None
    bio: Optional[str] = None
    photo_url: Optional[str] = None


class ScientistCreate(ScientistBase):
    pass


class ScientistRead(ScientistBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    h_index: int
    citation_count: int
    publication_count: int
    is_active: bool


class StationBase(BaseModel):
    name: str
    code: Optional[str] = None
    country: Optional[str] = None
    operator: Optional[str] = None
    region: PolarRegion = PolarRegion.ANTARCTIC
    latitude: float
    longitude: float
    elevation_m: Optional[float] = None
    established_year: Optional[int] = None
    description: Optional[str] = None


class StationCreate(StationBase):
    pass


class StationRead(StationBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    is_operational: bool
    current_temperature_c: Optional[float] = None
    current_wind_kph: Optional[float] = None
    last_reading_at: Optional[datetime] = None


class ExpeditionBase(BaseModel):
    name: str
    code: Optional[str] = None
    objective: Optional[str] = None
    region: PolarRegion = PolarRegion.ANTARCTIC
    status: ExpeditionStatus = ExpeditionStatus.PLANNED
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    vessel: Optional[str] = None
    team_size: Optional[int] = None
    station_id: Optional[uuid.UUID] = None
    lead_scientist_id: Optional[uuid.UUID] = None


class ExpeditionCreate(ExpeditionBase):
    pass


class ExpeditionRead(ExpeditionBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    created_at: datetime


class EventRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    event_type: str
    description: Optional[str] = None
    region: PolarRegion
    severity: EventSeverity
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    metric_value: Optional[float] = None
    metric_unit: Optional[str] = None
    occurred_on: Optional[date] = None
    source: Optional[str] = None
    source_url: Optional[str] = None


class EventCreate(BaseModel):
    title: str
    event_type: str
    description: Optional[str] = None
    region: PolarRegion = PolarRegion.GLOBAL
    severity: EventSeverity = EventSeverity.MODERATE
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    metric_value: Optional[float] = None
    metric_unit: Optional[str] = None
    occurred_on: Optional[date] = None
    source: Optional[str] = None
    source_url: Optional[str] = None


class ObservationPoint(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    observed_on: date
    value: float
    unit: Optional[str] = None
    variable: str
    region: PolarRegion


class RegionSummary(BaseModel):
    region: PolarRegion
    label: str
    color: str
    sea_ice_extent_mkm2: Optional[float] = None
    temperature_anomaly_c: Optional[float] = None
    station_count: int = 0
    dataset_count: int = 0
    active_expeditions: int = 0


class DashboardStats(BaseModel):
    total_datasets: int
    total_publications: int
    total_scientists: int
    total_stations: int
    active_expeditions: int
    pending_applications: int
    latest_sea_ice_extent_mkm2: Optional[float] = None
    sea_ice_trend: List[ObservationPoint] = []
    recent_events: List[EventRead] = []
    last_daily_update: Optional[datetime] = None


class DailyUpdateLogRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    task_name: str
    source: Optional[str] = None
    status: str
    records_created: int
    records_updated: int
    message: Optional[str] = None
    duration_seconds: Optional[float] = None
    started_at: datetime
    finished_at: Optional[datetime] = None


class AssistantQuery(BaseModel):
    question: str = Field(min_length=3, max_length=1000)


class AssistantAnswer(BaseModel):
    answer: str
    sources: List[str] = []
    suggestions: List[str] = []
