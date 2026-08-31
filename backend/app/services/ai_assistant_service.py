"""Grounded assistant for the portal.

The assistant answers with facts that are read live from PostgreSQL, so it never
invents numbers. Intent detection is keyword based, which keeps the prototype
fully offline and deterministic.
"""

from typing import List, Tuple

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.science import (
    Dataset,
    EnvironmentalEvent,
    Expedition,
    ExpeditionStatus,
    Observation,
    PolarRegion,
    Publication,
    Scientist,
    Station,
)
from app.schemas.science import AssistantAnswer

SUGGESTIONS = [
    "What is the latest Arctic sea ice extent?",
    "How many datasets are available for Antarctica?",
    "Show recent environmental events",
    "Which expeditions are ongoing?",
    "Who are the top polar scientists on the portal?",
]


def _region_from_question(question: str) -> PolarRegion:
    lowered = question.lower()
    if "antarctic" in lowered or "southern ocean" in lowered:
        return PolarRegion.ANTARCTIC
    if "himalaya" in lowered:
        return PolarRegion.HIMALAYA
    return PolarRegion.ARCTIC


async def answer_question(db: AsyncSession, question: str) -> AssistantAnswer:
    lowered = question.lower()
    sources: List[str] = []

    if any(word in lowered for word in ("sea ice", "ice extent", "ice cover")):
        region = _region_from_question(question)
        row = (
            await db.execute(
                select(Observation)
                .where(Observation.region == region, Observation.variable == "sea_ice_extent")
                .order_by(Observation.observed_on.desc())
                .limit(1)
            )
        ).scalar_one_or_none()
        if row:
            sources.append("NSIDC Sea Ice Index (synced daily)")
            return AssistantAnswer(
                answer=(
                    f"The most recent {region.value} sea ice extent recorded in Polar Nexus is "
                    f"{row.value} {row.unit} on {row.observed_on:%d %b %Y}."
                ),
                sources=sources,
                suggestions=SUGGESTIONS,
            )
        return AssistantAnswer(
            answer="No sea ice observations have been synced yet. Run the daily update task first.",
            suggestions=SUGGESTIONS,
        )

    if "dataset" in lowered:
        region = _region_from_question(question) if "arctic" in lowered or "antarctic" in lowered else None
        stmt = select(func.count(Dataset.id))
        if region:
            stmt = stmt.where(Dataset.region == region)
        total = (await db.execute(stmt)).scalar_one()
        scope = f"for the {region.value} region" if region else "across all regions"
        return AssistantAnswer(
            answer=f"Polar Nexus currently catalogues {total} datasets {scope}.",
            sources=["Polar Nexus dataset catalogue"],
            suggestions=SUGGESTIONS,
        )

    if "publication" in lowered or "paper" in lowered or "research" in lowered:
        total = (await db.execute(select(func.count(Publication.id)))).scalar_one()
        latest = (
            await db.execute(
                select(Publication).order_by(Publication.published_on.desc().nullslast()).limit(3)
            )
        ).scalars().all()
        titles = "; ".join(p.title[:90] for p in latest) or "none yet"
        return AssistantAnswer(
            answer=f"There are {total} indexed publications. Most recent: {titles}.",
            sources=["Crossref", "Semantic Scholar"],
            suggestions=SUGGESTIONS,
        )

    if "expedition" in lowered or "mission" in lowered:
        rows = (
            await db.execute(
                select(Expedition).where(Expedition.status == ExpeditionStatus.ONGOING).limit(5)
            )
        ).scalars().all()
        if rows:
            names = ", ".join(f"{e.name} ({e.region.value})" for e in rows)
            return AssistantAnswer(
                answer=f"{len(rows)} expedition(s) are currently ongoing: {names}.",
                sources=["Polar Nexus expedition registry"],
                suggestions=SUGGESTIONS,
            )
        return AssistantAnswer(
            answer="No expeditions are marked as ongoing right now.", suggestions=SUGGESTIONS
        )

    if "event" in lowered or "alert" in lowered or "anomaly" in lowered:
        rows = (
            await db.execute(
                select(EnvironmentalEvent).order_by(EnvironmentalEvent.occurred_on.desc().nullslast()).limit(3)
            )
        ).scalars().all()
        if rows:
            listed = "; ".join(f"{e.title} [{e.severity.value}]" for e in rows)
            return AssistantAnswer(
                answer=f"Latest environmental events: {listed}.",
                sources=["Polar Nexus analytics engine"],
                suggestions=SUGGESTIONS,
            )
        return AssistantAnswer(answer="No environmental events recorded yet.", suggestions=SUGGESTIONS)

    if "scientist" in lowered or "researcher" in lowered or "who" in lowered:
        rows = (
            await db.execute(select(Scientist).order_by(Scientist.citation_count.desc()).limit(5))
        ).scalars().all()
        if rows:
            listed = "; ".join(f"{s.full_name} ({s.institution or 'independent'})" for s in rows)
            return AssistantAnswer(
                answer=f"Most cited scientists on the portal: {listed}.",
                sources=["ORCID", "Polar Nexus scientist directory"],
                suggestions=SUGGESTIONS,
            )

    if "station" in lowered or "base" in lowered:
        rows: List[Tuple[Station, ...]] = (
            await db.execute(select(Station).where(Station.is_operational.is_(True)).limit(8))
        ).scalars().all()
        listed = ", ".join(f"{s.name} ({s.country})" for s in rows) or "none registered"
        return AssistantAnswer(
            answer=f"Operational research stations: {listed}.",
            sources=["Polar Nexus station registry"],
            suggestions=SUGGESTIONS,
        )

    return AssistantAnswer(
        answer=(
            "I can answer questions about sea ice, datasets, publications, expeditions, "
            "research stations, scientists and environmental alerts held in Polar Nexus."
        ),
        suggestions=SUGGESTIONS,
    )
