from celery.utils.log import get_task_logger

from app.core.celery_app import celery_app
from app.services import daily_update_service

logger = get_task_logger(__name__)


@celery_app.task(name="app.tasks.daily_updates.run_daily_update", bind=True, max_retries=3)
def run_daily_update(self, days: int = 1):
    """Full nightly refresh: sea ice, publications, stations and event detection."""
    try:
        summary = daily_update_service.run_daily_update(days=days)
        logger.info("Daily update finished: %s", summary)
        return summary
    except Exception as exc:
        logger.exception("Daily update failed")
        raise self.retry(exc=exc, countdown=300)
