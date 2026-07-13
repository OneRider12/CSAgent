# CSAgent

CSAgent is a study platform for classmates who want one shared place to collect course materials, turn them into structured study knowledge, and ask an agent questions that stay grounded in the original sources.

The product direction is simple: students upload slides, notes, documents, images, and other course materials; CSAgent processes them into an agent-managed Course Wiki; humans review important generated knowledge before it is published; and Members can browse, search, cite, chat, and export what the class has built together.

## Current Product State

CSAgent is in the prototype stage.

The repository currently contains a committed normal-user static app shell under `.app/` and a FastAPI service branch named `backend`. It is not a production deployment yet.

The current prototype focuses on making the product shape testable:

- identified Member experience instead of anonymous study sessions
- Course selection and Course access states
- Course Wiki reading surfaces
- Source File and processing-status concepts
- Draft Wiki Note and Publish Review concepts
- cited Agent chat behavior
- FastAPI-backed, evidence-grounded Agent Chat with persisted conversations and access-aware citations
- Private Group concepts
- local prototype verification through Node tests where prototype tests exist

## Product Vision

CSAgent should become a private class knowledge hub where a real group of classmates can build and maintain a shared study database over time.

The long-term product should help with three connected jobs:

1. **Collect evidence**: preserve original Source Files such as PDFs, slides, DOCX notes, images, and handwritten captures.
2. **Create knowledge**: extract, summarize, lint, link, and organize course material into a clean Course Wiki.
3. **Use knowledge**: let Members read published notes, ask cited questions, inspect sources, see relationships, and export the wiki for offline study.

AI is part of the system, but it is not treated as the source of truth. Original course materials, citations, review history, access boundaries, and human decisions remain first-class product concepts.

## Core Concepts

**Class Space** is the private workspace for one real group of classmates or friends.

**Member** is an identified person in a Class Space. CSAgent is designed around accountable access, attribution, and review history, not anonymous use.

**Course** is one official Course ID with its own content channel, Source Files, Wiki Notes, Agent context, permissions, and publishing lifecycle.

**Source File** is an uploaded original material, such as a slide deck, PDF, DOCX note, image, or handwritten note capture.

**Course Wiki** is the student-facing knowledge base generated from course materials. It is separate from this repository's internal Project Wiki.

**Draft Wiki Note** is generated or edited knowledge that has not passed human Publish Review.

**Published Wiki Note** is reviewed course knowledge available to Members who have the right Course access.

**Agent** answers questions, summarizes material, helps maintain the wiki, and cites visible evidence rather than answering from unsupported model knowledge.

## Feature Pillars

### Course Material Library

Members should be able to upload and organize course materials by Course. The first product path focuses on common study formats:

- PDF
- PPTX
- DOCX
- PNG
- JPG/JPEG

The product preserves raw files because generated notes must remain traceable to the original evidence.

### Agent-Managed Course Wiki

CSAgent turns uploaded material into structured wiki knowledge. The planned processing path includes:

- file extraction
- ordered extraction that preserves source order
- concept merge
- citation checks
- contradiction checks
- Markdown/math/link linting
- Draft Wiki Note generation
- human Publish Review

The Course Wiki should support tables, code blocks, math, backlinks, graph relationships, and course-specific indexing.

### Human Publish Review

AI-generated knowledge should not silently become official course material. Draft Wiki Notes go through review before publication.

Reviewers should be able to compare generated Markdown with its source context, edit the note, see lint warnings, and approve publication into the Course Wiki.

### Cited Agent Chat

The Agent should answer from visible course knowledge and cite the notes or Source Files that support the answer.

If a Member does not have access to a Source File, the Agent must respect that boundary. If there is no visible evidence, the Agent should say so instead of inventing an answer.

### Course Access and Identity

CSAgent is designed for private class use. Course visibility depends on identified Members, Class Spaces, Course Enrollment, and Course Access Levels.

The planned Course Access Levels are:

- **Full Private**: the Course is invisible and inaccessible.
- **Discoverable**: the Course can be previewed but its notes, sources, and Agent context are not available.
- **Accessible**: published notes and Agent answers remain available, but direct Source File access is restricted.
- **Full Access**: the Member can use the Course Wiki, Agent, and Source Files.

For early pilot testing, Google login is enough. A later all-CS release requires stronger Chulalongkorn identity verification.

### Private Groups

Private Groups let Members create smaller study spaces attached to a Course.

The product direction includes three group modes:

- **Clean**: starts without inheriting current public Course content.
- **Inherited**: forks selected Course content at creation time.
- **Updates**: keeps a private study space while receiving public Course updates where possible.

### Export and Portability

Long term, a Course should be exportable as a portable wiki bundle shaped around:

- raw source files
- published Markdown
- attachments
- schema/index metadata

The goal is to make class knowledge useful outside the app as well, including Obsidian-style study workflows.

## Current Prototype Capabilities

The public repo currently includes:

- a normal-user app shell under `.app/`
- split app assets for HTML, JavaScript, Tailwind input, and generated CSS
- a FastAPI Agent Chat backend on the `backend` branch
- tests for app shell structure and expected prototype boundaries
- local-only Project Wiki tooling via ignored `REPO.md` and `wiki/`

The prototype is meant to validate product shape, user flows, and domain language before the production architecture is finalized.

## Not Production-Ready Yet

The following are not complete production features yet:

- real file upload and object storage
- production OCR/extraction
- persistent Draft Wiki Note review workflow
- production Publish Review
- provider-backed RAG generation (the initial Agent Chat uses PostgreSQL full-text retrieval and deterministic cited extracts)
- graph view implementation
- Course export packaging
- production Chula identity verification
- full private beta hardening
- deployment infrastructure

Prototype screens and adapters should be treated as product exploration unless a feature is explicitly implemented and verified.

## Long-Term Goals

CSAgent should eventually support:

- reliable class-scale upload and processing for many Source Files
- citation-preserving Course Wiki generation
- contradiction detection and decision history
- source versioning when new files update old material
- batch processing and bounded Agent worker concurrency
- local and provider-based model options
- graph exploration of course concepts
- cited Agent answers grounded in allowed course evidence
- private group study workflows
- portable Course export
- operator visibility into processing, publishing, repair, and access events
- privacy-preserving access control for real class material

The long-term system should be useful for real study, not just a demo. It should make the class's knowledge easier to trust, maintain, and reuse.

## Tracking

Last tracker sync: 2026-07-13.

Current implementation tracking is mirrored between:

- Linear: `WAT-11`, `Working prototype demo`
- Linear: `WAT-13`, `Initialize FastAPI product API`
- GitHub: [Issue #1: Deliver runnable pilot prototype demo](https://github.com/OneRider12/CSAgent/issues/1)

Active branches:

- `main`: stable/public branch
- `development`: integration branch before `main`
- `codex/app-tailwind-stage`: app shell working branch
- `backend`: FastAPI service branch

Linear remains the detailed product planning source. GitHub tracks repo-facing implementation work.

## Stage Sync Rule

Whenever the current stage changes in Linear or GitHub issues, update this README's **Current Product State** and **Tracking** sections in the same change. The public repository should describe the same stage that project tracking describes.

## Access and Content Note

CSAgent is intended for private course material. Do not commit private class files, credentials, local Supabase config, or raw internal resources to the public repository.
