from __future__ import annotations

import os
from uuid import UUID

from fastapi import Depends, FastAPI, Header, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware

from .models import AskRequest, AskResponse, ConversationDetail, ConversationSummary, CreateConversationRequest
from .repository import ChatRepository, SupabaseChatRepository
from .service import ChatService

app = FastAPI(title="CSAgent Chat API", version="v1")
app.add_middleware(CORSMiddleware, allow_origins=[origin for origin in os.environ.get("CSAGENT_CORS_ORIGINS", "http://127.0.0.1:5173").split(",") if origin], allow_credentials=False, allow_methods=["GET", "POST"], allow_headers=["Authorization", "Content-Type"])


def repository(request: Request) -> ChatRepository:
    return getattr(request.app.state, "repository", None) or SupabaseChatRepository()


async def identity(authorization: str | None = Header(default=None), repo: ChatRepository = Depends(repository)) -> tuple[UUID, str]:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication is required.")
    token = authorization.removeprefix("Bearer ").strip()
    if not token or token == "temporary-login-bypass":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="A verified Supabase session is required.")
    try:
        return await repo.member_id(token), token
    except Exception as error:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication is required.") from error


async def require_access(course_id: UUID, repo: ChatRepository, actor: tuple[UUID, str]):
    access = await repo.course_access(actor[0], course_id, actor[1])
    if access is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found.")
    return access


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/v1/courses/{course_id}/conversations", response_model=list[ConversationSummary])
async def list_conversations(course_id: UUID, repo: ChatRepository = Depends(repository), actor: tuple[UUID, str] = Depends(identity)):
    await require_access(course_id, repo, actor)
    return await repo.list_conversations(actor[0], course_id, actor[1])


@app.post("/v1/conversations", response_model=ConversationDetail, status_code=status.HTTP_201_CREATED)
async def create_conversation(payload: CreateConversationRequest, repo: ChatRepository = Depends(repository), actor: tuple[UUID, str] = Depends(identity)):
    await require_access(payload.course_id, repo, actor)
    title = payload.title or "New Course question"
    return await repo.create_conversation(actor[0], payload.course_id, title, actor[1])


@app.get("/v1/conversations/{conversation_id}", response_model=ConversationDetail)
async def get_conversation(conversation_id: UUID, repo: ChatRepository = Depends(repository), actor: tuple[UUID, str] = Depends(identity)):
    conversation = await repo.get_conversation(actor[0], conversation_id, actor[1])
    if not conversation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found.")
    await require_access(conversation.course_id, repo, actor)
    return conversation


@app.post("/v1/conversations/{conversation_id}/messages", response_model=AskResponse)
async def ask(conversation_id: UUID, payload: AskRequest, repo: ChatRepository = Depends(repository), actor: tuple[UUID, str] = Depends(identity)):
    conversation = await repo.get_conversation(actor[0], conversation_id, actor[1])
    if not conversation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found.")
    access = await require_access(conversation.course_id, repo, actor)
    notes = await repo.search_notes(conversation.course_id, payload.question, actor[1])
    sources = await repo.source_citations([note.id for note in notes], actor[1]) if access.value == "Full Access" else {}
    kind, answer, citations = ChatService(repo).engine.compose(notes, access, sources)
    user_message, agent_message = await repo.save_exchange(conversation.id, payload.question, answer, kind.value, citations, actor[1])
    return AskResponse(user_message=user_message, agent_message=agent_message)
