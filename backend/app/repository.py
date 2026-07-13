from __future__ import annotations

import os
from dataclasses import dataclass
from datetime import datetime
from typing import Protocol
from uuid import UUID

import httpx

from .models import AccessLevel, ChatMessage, Citation, ConversationDetail, ConversationSummary


@dataclass(frozen=True)
class EvidenceNote:
    id: UUID
    title: str
    content: str
    excerpt: str


class ChatRepository(Protocol):
    async def member_id(self, token: str) -> UUID: ...
    async def course_access(self, member_id: UUID, course_id: UUID, token: str) -> AccessLevel | None: ...
    async def list_conversations(self, member_id: UUID, course_id: UUID, token: str) -> list[ConversationSummary]: ...
    async def create_conversation(self, member_id: UUID, course_id: UUID, title: str, token: str) -> ConversationDetail: ...
    async def get_conversation(self, member_id: UUID, conversation_id: UUID, token: str) -> ConversationDetail | None: ...
    async def search_notes(self, course_id: UUID, question: str, token: str) -> list[EvidenceNote]: ...
    async def source_citations(self, note_ids: list[UUID], token: str) -> dict[UUID, tuple[str, str, str | None]]: ...
    async def save_exchange(self, conversation_id: UUID, question: str, answer: str, kind: str, citations: list[Citation], token: str) -> tuple[ChatMessage, ChatMessage]: ...


class SupabaseChatRepository:
    """PostgREST adapter that always executes using the member's JWT and RLS."""

    def __init__(self, base_url: str | None = None, anon_key: str | None = None, service_role_key: str | None = None):
        self.base_url = (base_url or os.environ.get("SUPABASE_URL", "")).rstrip("/")
        self.anon_key = anon_key or os.environ.get("SUPABASE_ANON_KEY", "")
        self.service_role_key = service_role_key or os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
        if not self.base_url or not self.anon_key:
            raise RuntimeError("SUPABASE_URL and SUPABASE_ANON_KEY are required.")

    def _headers(self, token: str, prefer: str | None = None) -> dict[str, str]:
        headers = {"apikey": self.anon_key, "Authorization": f"Bearer {token}", "Content-Type": "application/json"}
        if prefer:
            headers["Prefer"] = prefer
        return headers

    def _service_headers(self, prefer: str | None = None) -> dict[str, str]:
        if not self.service_role_key:
            raise RuntimeError("SUPABASE_SERVICE_ROLE_KEY is required to persist Agent responses.")
        headers = {"apikey": self.service_role_key, "Authorization": f"Bearer {self.service_role_key}", "Content-Type": "application/json"}
        if prefer:
            headers["Prefer"] = prefer
        return headers

    async def _request(self, method: str, path: str, token: str, *, service: bool = False, **kwargs):
        async with httpx.AsyncClient(base_url=self.base_url, timeout=15) as client:
            prefer = kwargs.pop("prefer", None)
            response = await client.request(method, path, headers=self._service_headers(prefer) if service else self._headers(token, prefer), **kwargs)
        response.raise_for_status()
        return response.json() if response.content else None

    async def member_id(self, token: str) -> UUID:
        payload = await self._request("GET", "/auth/v1/user", token)
        return UUID(payload["id"])

    async def course_access(self, member_id: UUID, course_id: UUID, token: str) -> AccessLevel | None:
        rows = await self._request("GET", f"/rest/v1/course_enrollments?member_id=eq.{member_id}&course_id=eq.{course_id}&select=access_level", token)
        if not rows or rows[0]["access_level"] not in {level.value for level in AccessLevel}:
            return None
        return AccessLevel(rows[0]["access_level"])

    async def list_conversations(self, member_id: UUID, course_id: UUID, token: str) -> list[ConversationSummary]:
        rows = await self._request("GET", f"/rest/v1/chat_conversations?member_id=eq.{member_id}&course_id=eq.{course_id}&select=id,course_id,title,created_at,updated_at&order=updated_at.desc", token)
        return [ConversationSummary.model_validate(row) for row in rows]

    async def create_conversation(self, member_id: UUID, course_id: UUID, title: str, token: str) -> ConversationDetail:
        rows = await self._request("POST", "/rest/v1/chat_conversations", token, json={"member_id": str(member_id), "course_id": str(course_id), "title": title}, prefer="return=representation")
        return ConversationDetail.model_validate(rows[0])

    async def get_conversation(self, member_id: UUID, conversation_id: UUID, token: str) -> ConversationDetail | None:
        rows = await self._request("GET", f"/rest/v1/chat_conversations?id=eq.{conversation_id}&member_id=eq.{member_id}&select=id,course_id,title,created_at,updated_at", token)
        if not rows:
            return None
        conversation = ConversationDetail.model_validate(rows[0])
        messages = await self._request("GET", f"/rest/v1/chat_messages?conversation_id=eq.{conversation_id}&select=id,role,kind,content,created_at&order=created_at.asc", token)
        for message in messages:
            citation_rows = await self._request("GET", f"/rest/v1/chat_message_citations?message_id=eq.{message['id']}&select=note_id,note_title,excerpt,source_label,source_url,anchor&order=position.asc", token)
            message["citations"] = citation_rows
        conversation.messages = [ChatMessage.model_validate(message) for message in messages]
        return conversation

    async def search_notes(self, course_id: UUID, question: str, token: str) -> list[EvidenceNote]:
        rows = await self._request("POST", "/rest/v1/rpc/search_published_wiki_notes", token, json={"p_course_id": str(course_id), "p_query": question})
        return [EvidenceNote(id=UUID(row["id"]), title=row["title"], content=row["content"], excerpt=row["excerpt"]) for row in rows]

    async def source_citations(self, note_ids: list[UUID], token: str) -> dict[UUID, tuple[str, str, str | None]]:
        if not note_ids:
            return {}
        joined_ids = ",".join(str(note_id) for note_id in note_ids)
        rows = await self._request("GET", f"/rest/v1/note_citations?note_id=in.({joined_ids})&select=note_id,anchor,source_files(file_name,storage_path)", token)
        citations = {}
        for row in rows:
            source = row.get("source_files") or {}
            if source.get("file_name"):
                citations[UUID(row["note_id"])] = (source["file_name"], source.get("storage_path", ""), row.get("anchor"))
        return citations

    async def save_exchange(self, conversation_id: UUID, question: str, answer: str, kind: str, citations: list[Citation], token: str) -> tuple[ChatMessage, ChatMessage]:
        user_rows = await self._request("POST", "/rest/v1/chat_messages", token, json={"conversation_id": str(conversation_id), "role": "member", "content": question}, prefer="return=representation")
        agent_rows = await self._request("POST", "/rest/v1/chat_messages", token, json={"conversation_id": str(conversation_id), "role": "agent", "kind": kind, "content": answer}, prefer="return=representation", service=True)
        user, agent = user_rows[0], agent_rows[0]
        if citations:
            payload = [{"message_id": agent["id"], "position": index, **citation.model_dump(mode="json")} for index, citation in enumerate(citations)]
            await self._request("POST", "/rest/v1/chat_message_citations", token, json=payload, prefer="return=minimal", service=True)
        return ChatMessage.model_validate(user), ChatMessage.model_validate({**agent, "citations": citations})
