from celery.utils.log import get_task_logger

from app.core.celery_app import celery_app
from app.core.database import SyncSessionLocal
from app.services import daily_update_service

logger = get_task_logger(__name__)


@celery_app.task(name="app.tasks.data_sync.refresh_station_readings")
def refresh_station_readings():
    with SyncSessionLocal() as session:
        result = daily_update_service.refresh_stations(session)
        session.commit()
    logger.info("Station readings refreshed: %s", result)
    return result


@celery_app.task(name="app.tasks.data_sync.sync_publications")
def sync_publications(rows_per_query: int = 10):
    with SyncSessionLocal() as session:
        result = daily_update_service.sync_publications(session, rows_per_query=rows_per_query)
        session.commit()
    logger.info("Publications synced: %s", result)
    return result


@celery_app.task(name="app.tasks.data_sync.backfill_sea_ice")
def backfill_sea_ice(days: int = 365):
    with SyncSessionLocal() as session:
        result = daily_update_service.sync_sea_ice(session, days=days)
        session.commit()
    logger.info("Sea ice backfilled: %s", result)
    return result
