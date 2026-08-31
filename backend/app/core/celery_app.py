from celery import Celery
from celery.schedules import crontab

from app.core.config import settings

celery_app = Celery(
    "polar_nexus",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=["app.tasks.daily_updates", "app.tasks.data_sync"],
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,
    worker_max_tasks_per_child=200,
)

celery_app.conf.beat_schedule = {
    "daily-full-refresh": {
        "task": "app.tasks.daily_updates.run_daily_update",
        "schedule": crontab(
            hour=settings.DAILY_UPDATE_HOUR, minute=settings.DAILY_UPDATE_MINUTE
        ),
    },
    "hourly-station-readings": {
        "task": "app.tasks.data_sync.refresh_station_readings",
        "schedule": crontab(minute=0),
    },
}
