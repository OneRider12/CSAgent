---
title: System Design
created: 2026-06-10
updated: 2026-06-10
type: source
status: active
tags: [source, architecture, frontend, backend, database, storage, ai, linting]
links: [overview, implementation-plan]
---

# System Design

Source: `raw stuff/SystemDesign.md`

The project is designed as a decoupled LLM Class Wiki application.

## Architecture

- Frontend: Next.js, React, Tailwind CSS, React Markdown.
- Backend: FastAPI for document processing and LLM orchestration.
- Database: Supabase PostgreSQL with pgvector.
- Blob storage: Cloudflare R2 or equivalent S3-compatible storage.
- AI providers: OpenAI or local multimodal models.

## Pipeline

The processing state machine is:

`UPLOADED -> EXTRACTED -> SUMMARIZED -> LINTED -> DRAFT -> PUBLISHED`

The linting layer standardizes markdown, checks math syntax, and verifies generated wikilinks against known concepts.

## Main UI Areas

- Dashboard
- Upload Portal
- Review Workspace
- Wiki Viewer
- Graph and Chat
