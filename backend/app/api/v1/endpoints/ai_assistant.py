from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.science import AssistantAnswer, AssistantQuery
from app.services import ai_assistant_service

router = APIRouter()


@router.post("/ask", response_model=AssistantAnswer)
async def ask(payload: AssistantQuery, db: AsyncSession = Depends(get_db)) -> AssistantAnswer:
    return await ai_assistant_service.answer_question(db, payload.question)


@router.get("/suggestions", response_model=list[str])
async def suggestions() -> list[str]:
    return ai_assistant_service.SUGGESTIONS
