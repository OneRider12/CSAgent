from __future__ import annotations

from datetime import UTC, datetime
from uuid import UUID, uuid4

from fastapi.testclient import TestClient

from app.main import app
from app.models import AccessLevel, ChatMessage, Citation, ConversationDetail, ConversationSummary
from app.repository import EvidenceNote


MEMBER = uuid4()
COURSE = uuid4()
OTHER_COURSE = uuid4()
CONVERSATION = uuid4()


class FakeRepository:
    def __init__(self, access=AccessLevel.FULL_ACCESS, notes=None):
        self.access = access
        self.notes = notes if notes is not None else [EvidenceNote(uuid4(), "Stack Frames", "A stack frame stores local values.", "A stack frame stores local values.")]
        now = datetime.now(UTC)
        self.conversation = ConversationDetail(id=CONVERSATION, course_id=COURSE, title="Recursion", created_at=now, updated_at=now)
        self.saved = []

    async def member_id(self, token):
        if token != "valid-token":
            raise ValueError("bad token")
        return MEMBER

    async def course_access(self, member_id, course_id, token):
        return self.access if member_id == MEMBER and course_id == COURSE else None

    async def list_conversations(self, member_id, course_id, token):
        return [ConversationSummary(**self.conversation.model_dump(exclude={"messages"}))]

    async def create_conversation(self, member_id, course_id, title, token):
        self.conversation.title = title
        return self.conversation

    async def get_conversation(self, member_id, conversation_id, token):
        return self.conversation if member_id == MEMBER and conversation_id == CONVERSATION else None

    async def search_notes(self, course_id, question, token):
        return self.notes

    async def source_citations(self, note_ids, token):
        return {note_ids[0]: ("week-03-recursion.pdf", "/courses/cs101/week-03-recursion.pdf", "p. 4")} if note_ids else {}

    async def save_exchange(self, conversation_id, question, answer, kind, citations, token):
        now = datetime.now(UTC)
        user = ChatMessage(id=uuid4(), role="member", content=question, created_at=now)
        agent = ChatMessage(id=uuid4(), role="agent", kind=kind, content=answer, created_at=now, citations=citations)
        self.saved.append((user, agent))
        return user, agent


def client(repo):
    app.state.repository = repo
    return TestClient(app)


def headers(token="valid-token"):
    return {"Authorization": f"Bearer {token}"}


def test_rejects_missing_or_temporary_authentication():
    repo = FakeRepository()
    assert client(repo).get(f"/v1/courses/{COURSE}/conversations").status_code == 401
    assert client(repo).get(f"/v1/courses/{COURSE}/conversations", headers=headers("temporary-login-bypass")).status_code == 401


def test_hides_unknown_or_unauthorized_course():
    response = client(FakeRepository()).get(f"/v1/courses/{OTHER_COURSE}/conversations", headers=headers())
    assert response.status_code == 404
    assert response.json()["detail"] == "Course not found."


def test_full_access_returns_evidence_answer_and_citation():
    response = client(FakeRepository()).post(f"/v1/conversations/{CONVERSATION}/messages", headers=headers(), json={"question": "What is a stack frame?"})
    assert response.status_code == 200
    answer = response.json()["agent_message"]
    assert answer["kind"] == "answer"
    assert answer["citations"][0]["note_title"] == "Stack Frames"
    assert answer["citations"][0]["source_label"] == "week-03-recursion.pdf"


def test_accessible_returns_non_disclosure_without_source_details():
    response = client(FakeRepository(access=AccessLevel.ACCESSIBLE)).post(f"/v1/conversations/{CONVERSATION}/messages", headers=headers(), json={"question": "Show the source"})
    answer = response.json()["agent_message"]
    assert answer["kind"] == "source_non_disclosure"
    assert "restricted" in answer["content"]
    assert answer["citations"][0]["source_label"] is None


def test_no_evidence_refuses_without_model_knowledge():
    response = client(FakeRepository(notes=[])).post(f"/v1/conversations/{CONVERSATION}/messages", headers=headers(), json={"question": "What is on the final?"})
    answer = response.json()["agent_message"]
    assert answer["kind"] == "refusal"
    assert answer["citations"] == []


def test_conversation_ownership_and_input_validation():
    assert client(FakeRepository()).get(f"/v1/conversations/{uuid4()}", headers=headers()).status_code == 404
    assert client(FakeRepository()).post(f"/v1/conversations/{CONVERSATION}/messages", headers=headers(), json={"question": " "}).status_code == 422
    assert client(FakeRepository()).post(f"/v1/conversations/{CONVERSATION}/messages", headers=headers(), json={"question": "x" * 2001}).status_code == 422
