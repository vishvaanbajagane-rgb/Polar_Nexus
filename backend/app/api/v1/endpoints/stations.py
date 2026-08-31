import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.core.deps import require_min_role
from app.models.science import Dataset, Expedition, ExpeditionStatus, Observation, PolarRegion, Station
from app.models.user import User, UserRole
from app.schemas.science import RegionSummary, StationCreate, StationRead

router = APIRouter()

REGION_STYLE = {
    PolarRegion.ARCTIC: ("Arctic", "#38bdf8"),
    PolarRegion.ANTARCTIC: ("Antarctic", "#a78bfa"),
    PolarRegion.SOUTHERN_OCEAN: ("Southern Ocean", "#22d3ee"),
    PolarRegion.HIMALAYA: ("Third Pole (Himalaya)", "#f472b6"),
    PolarRegion.GLOBAL: ("Global", "#94a3b8"),
}


@router.get("", response_model=list[StationRead])
async def list_stations(
    region: Optional[PolarRegion] = None,
    operational: Optional[bool] = None,
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Station)
    if region:
        stmt = stmt.where(Station.region == region)
    if operational is not None:
        stmt = stmt.where(Station.is_operational.is_(operational))
    return (await db.execute(stmt.order_by(Station.name))).scalars().all()


@router.get("/map-config")
async def map_config():
    """MapTiler configuration consumed by the Leaflet client."""
    return {
        "maptiler_api_key": settings.MAPTILER_API_KEY,
        "styles": {
            "basemap": f"https://api.maptiler.com/maps/basic-v2/{{z}}/{{x}}/{{y}}.png?key={settings.MAPTILER_API_KEY}",
            "satellite": f"https://api.maptiler.com/maps/satellite/{{z}}/{{x}}/{{y}}.jpg?key={settings.MAPTILER_API_KEY}",
        },
        "attribution": "\u00a9 MapTiler \u00a9 OpenStreetMap contributors",
        "regions": [
            {
                "region": region.value,
                "label": label,
                "color": color,
            }
            for region, (label, color) in REGION_STYLE.items()
            if region != PolarRegion.GLOBAL
        ],
    }


@router.get("/region-summary", response_model=list[RegionSummary])
async def region_summary(db: AsyncSession = Depends(get_db)):
    summaries: list[RegionSummary] = []
    for region, (label, color) in REGION_STYLE.items():
        if region == PolarRegion.GLOBAL:
            continue
        station_count = (
            await db.execute(select(func.count(Station.id)).where(Station.region == region))
        ).scalar_one()
        dataset_count = (
            await db.execute(select(func.count(Dataset.id)).where(Dataset.region == region))
        ).scalar_one()
        active_expeditions = (
            await db.execute(
                select(func.count(Expedition.id)).where(
                    Expedition.region == region, Expedition.status == ExpeditionStatus.ONGOING
                )
            )
        ).scalar_one()
        latest_ice = (
            await db.execute(
                select(Observation.value)
                .where(Observation.region == region, Observation.variable == "sea_ice_extent")
                .order_by(Observation.observed_on.desc())
                .limit(1)
            )
        ).scalar_one_or_none()
        avg_temp = (
            await db.execute(
                select(func.avg(Station.current_temperature_c)).where(Station.region == region)
            )
        ).scalar_one_or_none()

        summaries.append(
            RegionSummary(
                region=region,
                label=label,
                color=color,
                sea_ice_extent_mkm2=latest_ice,
                temperature_anomaly_c=round(float(avg_temp), 2) if avg_temp is not None else None,
                station_count=station_count,
                dataset_count=dataset_count,
                active_expeditions=active_expeditions,
            )
        )
    return summaries


@router.get("/{station_id}", response_model=StationRead)
async def get_station(station_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    station = await db.get(Station, station_id)
    if not station:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Station not found")
    return station


@router.post("", response_model=StationRead, status_code=status.HTTP_201_CREATED)
async def create_station(
    payload: StationCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_min_role(UserRole.RESEARCHER)),
):
    station = Station(**payload.model_dump())
    db.add(station)
    await db.flush()
    await db.refresh(station)
    return station
