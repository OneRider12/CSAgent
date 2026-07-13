from __future__ import annotations

from datetime import datetime
from enum import StrEnum
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class AccessLevel(StrEnum):
    ACCESSIBLE = "Accessible"
    FULL_ACCESS = "Full Access"


class AnswerKind(StrEnum):
    ANSWER = "answer"
    SOURCE_NON_DISCLOSURE = "source_non_disclosure"
    REFUSAL = "refusal"


class Citation(BaseModel):
    note_id: UUID
    note_title: str
    excerpt: str
    source_label: str | None = None
    source_url: str | None = None
    anchor: str | None = None


class ConversationSummary(BaseModel):
    id: UUID
    course_id: UUID
    title: str
    created_at: datetime
    updated_at: datetime


class ChatMessage(BaseModel):
    id: UUID
    role: str
    kind: AnswerKind | None = None
    content: str
    created_at: datetime
    citations: list[Citation] = Field(default_factory=list)


class ConversationDetail(ConversationSummary):
    messages: list[ChatMessage] = Field(default_factory=list)


class CreateConversationRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    course_id: UUID
    title: str | None = Field(default=None, max_length=120)


class AskRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    question: str = Field(min_length=1, max_length=2_000)


class AskResponse(BaseModel):
    user_message: ChatMessage
    agent_message: ChatMessage
