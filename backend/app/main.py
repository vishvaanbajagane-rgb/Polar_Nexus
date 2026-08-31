import logging
from contextlib import asynccontextmanager

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text

from app.api.v1.api import api_router
from app.core.config import settings
from app.core.database import engine, init_models
from app.services.daily_update_service import run_daily_update

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(name)s | %(message)s")
logger = logging.getLogger("polar-nexus")

scheduler = AsyncIOScheduler(timezone="UTC")


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await init_models()
        logger.info("Database schema verified")
    except Exception as exc:
        logger.error("Could not initialise database schema: %s", exc)

    if settings.ENABLE_SCHEDULER:
        scheduler.add_job(
            run_daily_update,
            CronTrigger(hour=settings.DAILY_UPDATE_HOUR, minute=settings.DAILY_UPDATE_MINUTE),
            id="daily_update",
            replace_existing=True,
            misfire_grace_time=3600,
        )
        scheduler.start()
        logger.info(
            "APScheduler started - daily update at %02d:%02d UTC",
            settings.DAILY_UPDATE_HOUR,
            settings.DAILY_UPDATE_MINUTE,
        )

    yield

    if scheduler.running:
        scheduler.shutdown(wait=False)
    await engine.dispose()


app = FastAPI(
    title=settings.PROJECT_NAME,
    description=(
        "Unified API for polar datasets, publications, expeditions, research stations and "
        "environmental alerts. Built for Smart India Hackathon 2026."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/", tags=["meta"])
async def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": "1.0.0",
        "docs": "/docs",
        "api": settings.API_V1_PREFIX,
    }


@app.get("/health", tags=["meta"])
async def health():
    database = "up"
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
    except Exception as exc:
        database = f"down: {exc}"
    status_code = 200 if database == "up" else 503
    return JSONResponse(
        status_code=status_code,
        content={"status": "ok" if status_code == 200 else "degraded", "database": database},
    )
