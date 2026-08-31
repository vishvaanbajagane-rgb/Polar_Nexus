import math
from typing import Any, Sequence

from sqlalchemy import Select, func, select
from sqlalchemy.ext.asyncio import AsyncSession


async def paginate(db: AsyncSession, stmt: Select, page: int, size: int) -> dict[str, Any]:
    total = (await db.execute(select(func.count()).select_from(stmt.subquery()))).scalar_one()
    rows: Sequence[Any] = (
        (await db.execute(stmt.offset((page - 1) * size).limit(size))).scalars().all()
    )
    return {
        "items": rows,
        "total": total,
        "page": page,
        "size": size,
        "pages": max(math.ceil(total / size), 1) if total else 0,
    }
