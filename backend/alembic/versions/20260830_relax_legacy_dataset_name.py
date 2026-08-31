"""Allow current dataset model inserts alongside the legacy name column.

Revision ID: 20260830_relax_dataset_name
Revises: 20260830_align_legacy_schema
"""

from alembic import op


revision = "20260830_relax_dataset_name"
down_revision = "20260830_align_legacy_schema"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("ALTER TABLE datasets ALTER COLUMN name DROP NOT NULL")


def downgrade() -> None:
    op.execute("ALTER TABLE datasets ALTER COLUMN name SET NOT NULL")
