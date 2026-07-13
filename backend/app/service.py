from __future__ import annotations

import re
from uuid import UUID

from .models import AccessLevel, AnswerKind, Citation
from .repository import ChatRepository, EvidenceNote


class DeterministicAnswerEngine:
    """Citation-first response composer; replaceable by a future provider adapter."""

    def compose(self, notes: list[EvidenceNote], access: AccessLevel, sources: dict[UUID, tuple[str, str, str | None]] | None = None) -> tuple[AnswerKind, str, list[Citation]]:
        if not notes:
            return AnswerKind.REFUSAL, "I do not have enough visible Course evidence to answer that. Please add or publish Course evidence, then try again.", []
        citations = []
        excerpts = []
        for note in notes[:3]:
            excerpt = re.sub(r"\s+", " ", note.excerpt or note.content).strip()[:420]
            excerpts.append(excerpt)
            source = (sources or {}).get(note.id)
            citations.append(Citation(note_id=note.id, note_title=note.title, excerpt=excerpt, source_label=source[0] if source else None, source_url=source[1] if source else None, anchor=source[2] if source else None))
        if access is AccessLevel.ACCESSIBLE:
            return AnswerKind.SOURCE_NON_DISCLOSURE, "Based on the visible Published Wiki Notes: " + " ".join(excerpts) + " Original Source Files are restricted for your current Course access.", citations
        return AnswerKind.ANSWER, "Based on the Course evidence: " + " ".join(excerpts), citations


class ChatService:
    def __init__(self, repository: ChatRepository, engine: DeterministicAnswerEngine | None = None):
        self.repository = repository
        self.engine = engine or DeterministicAnswerEngine()

    async def access_or_none(self, member_id: UUID, course_id: UUID, token: str) -> AccessLevel | None:
        return await self.repository.course_access(member_id, course_id, token)
