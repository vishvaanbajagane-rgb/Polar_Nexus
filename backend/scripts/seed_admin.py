"""Create (or reset) the Polar Nexus administrator account.

Usage:  python scripts/seed_admin.py
"""

import os
import sys
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import select, text  # noqa: E402

from app.core.config import settings  # noqa: E402
from app.core.database import Base, SyncSessionLocal, sync_engine  # noqa: E402
from app.core.security import hash_password  # noqa: E402
from app.models.user import User, UserRole  # noqa: E402


def ensure_legacy_user_columns() -> None:
    """Support older manual DB schemas created before the auth fields existed."""
    with sync_engine.begin() as conn:
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS hashed_password VARCHAR(255)"))
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(255)"))
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS organization VARCHAR(255)"))
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS country VARCHAR(120)"))
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS orcid_id VARCHAR(32)"))
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT"))
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE"))
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE"))
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ"))
        conn.execute(text("UPDATE users SET hashed_password = password_hash WHERE hashed_password IS NULL AND password_hash IS NOT NULL"))
        conn.execute(text("UPDATE users SET full_name = 'Polar Nexus Administrator' WHERE full_name IS NULL"))
        conn.execute(text("UPDATE users SET is_active = TRUE WHERE is_active IS NULL"))
        conn.execute(text("UPDATE users SET is_verified = FALSE WHERE is_verified IS NULL"))
        conn.execute(text("UPDATE users SET created_at = NOW() WHERE created_at IS NULL"))
        conn.execute(text("UPDATE users SET updated_at = NOW() WHERE updated_at IS NULL"))


def main() -> None:
    Base.metadata.create_all(bind=sync_engine)
    ensure_legacy_user_columns()

    with SyncSessionLocal() as session:
        admin = session.execute(
            select(User).where(User.email == settings.ADMIN_EMAIL.lower())
        ).scalar_one_or_none()

        if admin:
            admin.hashed_password = hash_password(settings.ADMIN_PASSWORD)
            admin.role = UserRole.ADMIN
            admin.is_active = True
            admin.is_verified = True
            admin.full_name = settings.ADMIN_FULL_NAME
            admin.organization = "Ministry of Earth Sciences"
            admin.country = "India"
            admin.updated_at = datetime.utcnow()
            action = "updated"
        else:
            admin = User(
                email=settings.ADMIN_EMAIL.lower(),
                hashed_password=hash_password(settings.ADMIN_PASSWORD),
                full_name=settings.ADMIN_FULL_NAME,
                role=UserRole.ADMIN,
                organization="Ministry of Earth Sciences",
                country="India",
                is_active=True,
                is_verified=True,
            )
            session.add(admin)
            action = "created"

        session.commit()

    print(f"Admin account {action}: {settings.ADMIN_EMAIL}")
    print("Sign in at http://localhost:3000/login")


if __name__ == "__main__":
    main()
