"""Populate Polar Nexus with demo content: stations, scientists, expeditions,
datasets, publications, environmental events and one year of sea-ice observations.

Usage:  python scripts/seed_data.py
"""

import os
import sys
from datetime import date, datetime, timedelta, timezone

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import select  # noqa: E402

from app.core.database import Base, SyncSessionLocal, sync_engine  # noqa: E402
from app.core.security import hash_password  # noqa: E402
from app.models.science import (  # noqa: E402
    AccessLevel,
    Dataset,
    EnvironmentalEvent,
    EventSeverity,
    Expedition,
    ExpeditionStatus,
    PolarRegion,
    Publication,
    Scientist,
    Station,
)
from app.models.user import User, UserRole  # noqa: E402
from app.services.daily_update_service import refresh_stations, sync_sea_ice  # noqa: E402

DEMO_USERS = [
    ("researcher@polarnexus.gov.in", "Researcher@2026", "Dr. Ananya Rao", UserRole.RESEARCHER),
    ("educator@polarnexus.gov.in", "Educator@2026", "Prof. Kabir Mehta", UserRole.EDUCATOR),
    ("public@polarnexus.gov.in", "Public@2026", "Riya Sharma", UserRole.PUBLIC),
]

STATIONS = [
    ("Bharati", "IND-BHR", "India", "NCPOR", PolarRegion.ANTARCTIC, -69.4058, 76.1872, 35, 2012),
    ("Maitri", "IND-MTR", "India", "NCPOR", PolarRegion.ANTARCTIC, -70.7660, 11.7314, 130, 1989),
    ("Himadri", "IND-HMD", "India", "NCPOR", PolarRegion.ARCTIC, 78.9230, 11.9220, 40, 2008),
    ("Amundsen-Scott", "USA-ASS", "USA", "NSF", PolarRegion.ANTARCTIC, -90.0, 0.0, 2835, 1957),
    ("McMurdo", "USA-MCM", "USA", "NSF", PolarRegion.ANTARCTIC, -77.8419, 166.6863, 10, 1956),
    ("Rothera", "GBR-ROT", "United Kingdom", "BAS", PolarRegion.ANTARCTIC, -67.5680, -68.1270, 16, 1975),
    ("Ny-Alesund", "NOR-NYA", "Norway", "NPI", PolarRegion.ARCTIC, 78.9250, 11.9300, 8, 1968),
    ("Alert", "CAN-ALT", "Canada", "ECCC", PolarRegion.ARCTIC, 82.5018, -62.3481, 30, 1950),
    ("Vostok", "RUS-VOS", "Russia", "AARI", PolarRegion.ANTARCTIC, -78.4645, 106.8339, 3488, 1957),
    ("Concordia", "ITA-CON", "Italy/France", "PNRA/IPEV", PolarRegion.ANTARCTIC, -75.1000, 123.3500, 3233, 2005),
]

SCIENTISTS = [
    ("Dr. Ananya Rao", "0000-0002-1825-0097", "NCPOR Goa", "India", "Sea ice dynamics", 24, 1820),
    ("Dr. Elena Petrova", "0000-0001-5109-3700", "AARI St. Petersburg", "Russia", "Glaciology", 31, 4210),
    ("Dr. Marcus Lindqvist", "0000-0003-1415-9269", "Norwegian Polar Institute", "Norway", "Ocean circulation", 28, 3105),
    ("Dr. Sarah Whitfield", "0000-0002-7183-4477", "British Antarctic Survey", "United Kingdom", "Ice sheet modelling", 35, 6890),
    ("Dr. Hiroshi Tanaka", "0000-0001-9876-5432", "National Institute of Polar Research", "Japan", "Atmospheric chemistry", 22, 1540),
    ("Dr. Priya Nair", "0000-0002-3344-5566", "IIT Kharagpur", "India", "Permafrost carbon", 19, 980),
]

DATASETS = [
    ("Antarctic Ice Sheet Elevation Change 1992-2025", "cryosphere", PolarRegion.ANTARCTIC, "ESA CryoSat", AccessLevel.PUBLIC, "NetCDF", 842.5, ["elevation", "mass_balance"]),
    ("Arctic Ocean Temperature Profiles", "oceanography", PolarRegion.ARCTIC, "NOAA", AccessLevel.PUBLIC, "CSV", 210.0, ["temperature", "salinity", "depth"]),
    ("Southern Ocean Chlorophyll Concentration", "biology", PolarRegion.SOUTHERN_OCEAN, "NASA OceanColor", AccessLevel.EDUCATOR, "GeoTIFF", 1520.0, ["chlorophyll_a"]),
    ("Permafrost Active Layer Thickness", "geology", PolarRegion.ARCTIC, "GTN-P", AccessLevel.RESEARCHER, "CSV", 46.2, ["active_layer_thickness", "ground_temperature"]),
    ("Antarctic Katabatic Wind Records", "meteorology", PolarRegion.ANTARCTIC, "NCPOR", AccessLevel.PUBLIC, "CSV", 88.4, ["wind_speed", "wind_direction"]),
    ("Himalayan Glacier Mass Balance", "cryosphere", PolarRegion.HIMALAYA, "WGMS", AccessLevel.PUBLIC, "CSV", 12.8, ["mass_balance", "snow_line"]),
    ("Krill Population Survey (Southern Ocean)", "biology", PolarRegion.SOUTHERN_OCEAN, "CCAMLR", AccessLevel.RESEARCHER, "XLSX", 33.1, ["biomass", "density"]),
    ("Polar Aerosol Optical Depth", "atmosphere", PolarRegion.ARCTIC, "AERONET", AccessLevel.EDUCATOR, "NetCDF", 402.7, ["aod_500nm", "angstrom_exponent"]),
]

PUBLICATIONS = [
    ("Accelerated basal melt of Antarctic ice shelves under warming Southern Ocean", "Nature Geoscience", PolarRegion.ANTARCTIC, 412),
    ("Arctic sea ice minimum trends and their atmospheric drivers", "The Cryosphere", PolarRegion.ARCTIC, 268),
    ("Carbon feedback from thawing permafrost in the Eurasian Arctic", "Nature Climate Change", PolarRegion.ARCTIC, 731),
    ("Katabatic wind variability at Indian Antarctic stations", "Polar Science", PolarRegion.ANTARCTIC, 54),
    ("Third Pole glacier retreat and downstream water security", "Science Advances", PolarRegion.HIMALAYA, 189),
    ("Phytoplankton bloom dynamics in the Southern Ocean marginal ice zone", "Global Change Biology", PolarRegion.SOUTHERN_OCEAN, 143),
]

EXPEDITIONS = [
    ("Indian Scientific Expedition to Antarctica 43", "ISEA-43", ExpeditionStatus.ONGOING, PolarRegion.ANTARCTIC, "MV Vasiliy Golovnin", 48),
    ("Indian Arctic Expedition 2026", "IARC-26", ExpeditionStatus.ONGOING, PolarRegion.ARCTIC, None, 22),
    ("Southern Ocean Carbon Survey", "SOCS-12", ExpeditionStatus.PLANNED, PolarRegion.SOUTHERN_OCEAN, "ORV Sagar Nidhi", 30),
    ("Weddell Sea Ice Shelf Traverse", "WSIST-07", ExpeditionStatus.COMPLETED, PolarRegion.ANTARCTIC, None, 16),
]

EVENTS = [
    ("Record low Antarctic sea ice maximum", "sea_ice_anomaly", PolarRegion.ANTARCTIC, EventSeverity.CRITICAL, 16.96, "million km2"),
    ("Greenland ice sheet melt spike", "melt_event", PolarRegion.ARCTIC, EventSeverity.HIGH, 12.5, "Gt/day"),
    ("Marine heatwave in the Barents Sea", "marine_heatwave", PolarRegion.ARCTIC, EventSeverity.MODERATE, 3.2, "degC anomaly"),
    ("Iceberg A-83 calving from Brunt Ice Shelf", "calving", PolarRegion.ANTARCTIC, EventSeverity.HIGH, 380.0, "km2"),
]


def main() -> None:
    Base.metadata.create_all(bind=sync_engine)
    today = datetime.now(timezone.utc).date()

    with SyncSessionLocal() as session:
        for email, password, name, role in DEMO_USERS:
            if not session.execute(select(User).where(User.email == email)).scalar_one_or_none():
                session.add(
                    User(
                        email=email,
                        hashed_password=hash_password(password),
                        full_name=name,
                        role=role,
                        organization="Polar Nexus Demo",
                        country="India",
                        is_verified=True,
                    )
                )

        for name, code, country, operator, region, lat, lon, elev, year in STATIONS:
            if not session.execute(select(Station).where(Station.code == code)).scalar_one_or_none():
                session.add(
                    Station(
                        name=name,
                        code=code,
                        country=country,
                        operator=operator,
                        region=region,
                        latitude=lat,
                        longitude=lon,
                        elevation_m=elev,
                        established_year=year,
                        description=f"{name} research station operated by {operator}.",
                    )
                )

        for full_name, orcid, institution, country, specialization, h_index, citations in SCIENTISTS:
            if not session.execute(select(Scientist).where(Scientist.orcid_id == orcid)).scalar_one_or_none():
                session.add(
                    Scientist(
                        full_name=full_name,
                        orcid_id=orcid,
                        institution=institution,
                        country=country,
                        specialization=specialization,
                        h_index=h_index,
                        citation_count=citations,
                        bio=f"{full_name} works on {specialization.lower()} at {institution}.",
                    )
                )

        for title, category, region, source, access, fmt, size, variables in DATASETS:
            if not session.execute(select(Dataset).where(Dataset.title == title)).scalar_one_or_none():
                session.add(
                    Dataset(
                        title=title,
                        description=f"Curated {category} dataset for the {region.value} region, provided by {source}.",
                        category=category,
                        region=region,
                        source=source,
                        source_url="https://nsidc.org/data",
                        file_format=fmt,
                        size_mb=size,
                        variables=variables,
                        access_level=access,
                        temporal_start=date(1992, 1, 1),
                        temporal_end=today,
                    )
                )
        session.commit()

        scientists = session.execute(select(Scientist)).scalars().all()
        stations = session.execute(select(Station)).scalars().all()

        for index, (title, journal, region, citations) in enumerate(PUBLICATIONS):
            if not session.execute(select(Publication).where(Publication.title == title)).scalar_one_or_none():
                lead = scientists[index % len(scientists)] if scientists else None
                session.add(
                    Publication(
                        title=title,
                        abstract=f"This study examines {title.lower()} using multi-decadal observations and model reanalysis.",
                        doi=f"10.1000/polarnexus.{2026}.{index + 1:03d}",
                        journal=journal,
                        authors=[lead.full_name] if lead else None,
                        keywords=[region.value, journal.split()[0].lower()],
                        region=region,
                        published_on=today - timedelta(days=45 * (index + 1)),
                        citation_count=citations,
                        source="seed",
                        url="https://doi.org/10.1000/polarnexus",
                        lead_scientist_id=lead.id if lead else None,
                    )
                )

        for index, (name, code, exp_status, region, vessel, team) in enumerate(EXPEDITIONS):
            if not session.execute(select(Expedition).where(Expedition.code == code)).scalar_one_or_none():
                lead = scientists[index % len(scientists)] if scientists else None
                station = next((s for s in stations if s.region == region), None)
                start = today - timedelta(days=60 - index * 20)
                session.add(
                    Expedition(
                        name=name,
                        code=code,
                        objective=f"Multi-disciplinary campaign across the {region.value} region.",
                        region=region,
                        status=exp_status,
                        start_date=start,
                        end_date=start + timedelta(days=120),
                        vessel=vessel,
                        team_size=team,
                        route={
                            "waypoints": [
                                {"lat": station.latitude if station else -70, "lon": station.longitude if station else 10},
                                {"lat": (station.latitude if station else -70) + 2, "lon": (station.longitude if station else 10) + 3},
                            ]
                        },
                        station_id=station.id if station else None,
                        lead_scientist_id=lead.id if lead else None,
                    )
                )

        for index, (title, event_type, region, severity, value, unit) in enumerate(EVENTS):
            if not session.execute(
                select(EnvironmentalEvent).where(EnvironmentalEvent.title == title)
            ).scalar_one_or_none():
                session.add(
                    EnvironmentalEvent(
                        title=title,
                        event_type=event_type,
                        description=f"Automated detection flagged '{title}' from the daily synchronisation pipeline.",
                        region=region,
                        severity=severity,
                        latitude=-70.0 if region == PolarRegion.ANTARCTIC else 78.0,
                        longitude=15.0,
                        metric_value=value,
                        metric_unit=unit,
                        occurred_on=today - timedelta(days=index * 9 + 3),
                        source="polar-nexus-analytics",
                    )
                )
        session.commit()

        print("Backfilling 365 days of sea ice observations...")
        result = sync_sea_ice(session, days=365)
        refresh_stations(session)
        session.commit()
        print(f"Observations created: {result['created']}")

    print("Demo data seeded. Login with any of:")
    for email, password, _, role in DEMO_USERS:
        print(f"  {role.value:11s} {email} / {password}")


if __name__ == "__main__":
    main()
