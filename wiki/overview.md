---
title: Overview
created: 2026-06-10
updated: 2026-06-10
type: concept
status: active
tags: [wiki, planning]
links: [index, implementation-plan, system-design, product-requirements]
---

# Overview

This repository is the base scaffold for an LLM Class Wiki: a peer-to-peer knowledge hub where classmates can upload course materials, process them with AI and linting, review drafts, publish wiki notes, query them with chat, and export an Obsidian-compatible vault.

## Current State

- The project currently contains raw planning and design materials in `raw stuff/`.
- The wiki layer has been initialized under `wiki/`.
- No application source code has been scaffolded yet.
- `raw stuff/raw-prd.md` now contains the initial PRD source and has been synthesized into [[product-requirements]].

## Implementation Direction

The planned system uses a decoupled web architecture:

- Frontend: Next.js, React, Tailwind CSS, and markdown rendering.
- Backend: FastAPI for file processing, OCR, linting, and LLM orchestration.
- Data: Supabase PostgreSQL with pgvector for search and RAG.
- Storage: Cloudflare R2 or Supabase Storage for raw files.
- AI: OpenAI or Anthropic APIs for extraction, OCR, summarization, and chat.

See [[product-requirements]], [[system-design]], and [[implementation-plan]] for source-derived details.
