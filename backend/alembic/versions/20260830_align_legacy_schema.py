"""Align legacy tables with the current ORM models.

Revision ID: 20260830_align_legacy_schema
Revises:
"""

from alembic import op
import sqlalchemy as sa


revision = "20260830_align_legacy_schema"
down_revision = None
branch_labels = None
depends_on = None


def _add_column(table: str, column: str, definition: str) -> None:
    op.execute(
        sa.text(
            f"ALTER TABLE {table} ADD COLUMN IF NOT EXISTS {column} {definition}"
        )
    )


def upgrade() -> None:
    _add_column("datasets", "title", "VARCHAR(500)")
    _add_column("datasets", "category", "VARCHAR(120)")
    _add_column("datasets", "region", "polar_region DEFAULT 'global'")
    _add_column("datasets", "source", "VARCHAR(120)")
    _add_column("datasets", "source_url", "TEXT")
    _add_column("datasets", "file_format", "VARCHAR(32)")
    _add_column("datasets", "size_mb", "DOUBLE PRECISION")
    _add_column("datasets", "variables", "TEXT[]")
    _add_column("datasets", "access_level", "access_level DEFAULT 'public'")
    _add_column("datasets", "temporal_start", "DATE")
    _add_column("datasets", "temporal_end", "DATE")
    _add_column("datasets", "download_count", "INTEGER NOT NULL DEFAULT 0")
    _add_column("datasets", "is_live", "BOOLEAN NOT NULL DEFAULT FALSE")
    _add_column("datasets", "last_synced_at", "TIMESTAMPTZ")
    _add_column("datasets", "uploaded_by", "UUID")
    op.execute("UPDATE datasets SET title = COALESCE(title, name) WHERE title IS NULL")
    op.execute("UPDATE datasets SET category = COALESCE(category, data_type) WHERE category IS NULL")
    op.execute("UPDATE datasets SET size_mb = COALESCE(size_mb, file_size_mb::double precision) WHERE size_mb IS NULL")
    op.execute("UPDATE datasets SET source_url = COALESCE(source_url, url) WHERE source_url IS NULL")

    _add_column("publications", "authors", "TEXT[]")
    _add_column("publications", "keywords", "TEXT[]")
    _add_column("publications", "region", "polar_region DEFAULT 'global'")
    _add_column("publications", "published_on", "DATE")
    _add_column("publications", "citation_count", "INTEGER NOT NULL DEFAULT 0")
    _add_column("publications", "source", "VARCHAR(64)")
    _add_column("publications", "is_open_access", "BOOLEAN NOT NULL DEFAULT TRUE")
    op.execute("UPDATE publications SET published_on = COALESCE(published_on, published_date, make_date(year, 1, 1)) WHERE published_on IS NULL")

    _add_column("stations", "code", "VARCHAR(32)")
    _add_column("stations", "elevation_m", "DOUBLE PRECISION")
    _add_column("stations", "established_year", "INTEGER")
    _add_column("stations", "last_reading_at", "TIMESTAMPTZ")
    _add_column("stations", "description", "TEXT")
    op.execute("UPDATE stations SET elevation_m = COALESCE(elevation_m, altitude::double precision) WHERE elevation_m IS NULL")
    op.execute("UPDATE stations SET code = CONCAT('STN-', LEFT(id::text, 8)) WHERE code IS NULL")
    op.execute("CREATE UNIQUE INDEX IF NOT EXISTS uq_stations_code ON stations (code)")

    _add_column("expeditions", "code", "VARCHAR(64)")
    _add_column("expeditions", "objective", "TEXT")
    _add_column("expeditions", "vessel", "VARCHAR(255)")
    _add_column("expeditions", "team_size", "INTEGER")
    _add_column("expeditions", "route", "JSONB")
    _add_column("expeditions", "station_id", "UUID")


def downgrade() -> None:
    # Legacy columns are retained intentionally; this migration is additive.
    pass
