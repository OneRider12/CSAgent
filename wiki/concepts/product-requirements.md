---
title: Product Requirements
created: 2026-06-10
updated: 2026-06-10
type: concept
status: active
tags: [planning, wiki, ai, linting]
links: [overview, raw-prd, system-design, implementation-plan]
---

# Product Requirements

## Problem Statement

University classmates collect useful learning material across lecture slides, PDFs, DOCX files, photos, handwritten notes, and informal summaries. That material is hard to search, inconsistent in quality, and often scattered across chats, drives, and personal notebooks. Students need a shared class knowledge hub that turns raw course material into clean, reviewed, linkable notes without losing access to the original files.

## Solution

Build the LLM Class Wiki: a collaborative web application where invited classmates upload course materials, AI extracts and summarizes them, an automated linting pipeline standardizes the generated Markdown, and human reviewers approve the result before publication. Published notes become a browsable wiki with backlinks, graph view, RAG-powered chat, and an Obsidian export for offline study.

## User Stories

1. As a contributor, I want to upload lecture slides, so that classmates can access official class material in one place.
2. As a contributor, I want to upload PDF files, so that documents can become searchable wiki notes.
3. As a contributor, I want to upload DOCX files, so that typed notes can be processed alongside PDFs.
4. As a contributor, I want to upload PNG and JPG images, so that handwritten notes and board photos can be included.
5. As a contributor, I want uploads to support files up to 20MB, so that common class documents do not fail unexpectedly.
6. As a contributor, I want to categorize uploads by subject, so that classmates can find the right course material.
7. As a contributor, I want to categorize uploads by lecture or week, so that notes follow the class timeline.
8. As a contributor, I want raw files to remain downloadable, so that classmates can verify the original source.
9. As a reviewer, I want every processed note to start as a draft, so that AI output is not published without human review.
10. As a reviewer, I want to see the raw file beside the generated Markdown, so that I can compare the source and draft quickly.
11. As a reviewer, I want to edit generated Markdown directly, so that I can correct AI mistakes before publishing.
12. As a reviewer, I want lint warnings to be visible during review, so that formatting and syntax problems are easy to fix.
13. As a reviewer, I want an Approve and Publish action, so that a cleaned draft can become part of the wiki.
14. As a consumer, I want to browse published notes on the web, so that I can study without installing another tool.
15. As a consumer, I want Markdown tables to render correctly, so that structured course material remains readable.
16. As a consumer, I want code blocks to render correctly, so that programming examples are usable.
17. As a consumer, I want math formulas to render correctly, so that technical course content is not corrupted.
18. As a consumer, I want related concepts to be linked automatically, so that I can move between connected topics.
19. As a consumer, I want a graph view of notes and concepts, so that I can see how course topics relate.
20. As a consumer, I want to ask a chatbot questions about class material, so that I can find answers faster.
21. As a consumer, I want chatbot answers to cite source notes, so that I can verify the answer.
22. As a consumer, I want to export the wiki as an Obsidian vault, so that I can study offline in my own environment.
23. As a class admin, I want access restricted to invited users, so that class materials stay private.
24. As a class admin, I want scalable storage for 100+ files, so that the system remains useful across a semester.
25. As a class admin, I want processing to run asynchronously, so that uploads do not freeze the user interface.

## Implementation Decisions

- Use a decoupled architecture with a Next.js frontend and FastAPI backend.
- Use the frontend for upload flows, dashboard views, review workspace, wiki browsing, graph exploration, chat entry points, and export controls.
- Use the backend for file parsing, OCR orchestration, LLM calls, linting, link verification, draft generation, and export packaging.
- Store raw files in object storage such as Cloudflare R2 or Supabase Storage.
- Store structured application data in Supabase PostgreSQL.
- Use pgvector for embeddings needed by RAG search and chat.
- Restrict authentication to invited classmates through email domains, invite codes, or an equivalent invite-only mechanism.
- Model uploaded files separately from processed notes, so raw evidence can remain available after Markdown notes are generated.
- Process uploaded material through a state machine: uploaded, extracted, summarized, linted, draft, published.
- Require all AI-generated notes to pass through draft review before publication.
- Enforce structured LLM output with a schema containing metadata, summary, and Markdown content.
- Run pre-LLM cleanup to reduce OCR artifacts, broken line wraps, junk characters, and extraction noise.
- Run post-LLM Markdown linting to enforce heading hierarchy, whitespace rules, list style, and readable formatting.
- Run math linting to detect unclosed inline and block math delimiters and to normalize common mathematical symbols.
- Run link linting to detect generated wiki links and flag missing or orphan concepts.
- Support web rendering for tables, code blocks, and math.
- Generate graph data from note and concept links.
- Export published Markdown, attachments, and source files into an Obsidian-compatible vault structure.

## Testing Decisions

- Test external behavior at the highest useful seams rather than implementation details.
- Upload processing should be tested from accepted file input through stored raw file and draft creation.
- The processing pipeline should be tested through visible state transitions, especially draft creation after extraction, summarization, and linting.
- Linting should be tested with representative Markdown, OCR noise, broken headings, inconsistent lists, and malformed math.
- Review workflow should be tested from draft display through Markdown editing and publish approval.
- Wiki rendering should be tested with notes containing headings, tables, code blocks, math, and wiki links.
- Link verification should be tested with existing concepts, missing concepts, and orphan links.
- Graph generation should be tested through published notes with known links and expected node-edge relationships.
- RAG chat should be tested by asking questions whose answers must cite the relevant published notes.
- Obsidian export should be tested by inspecting the generated archive contents, folder structure, Markdown files, and attachments.
- Authentication should be tested at route/API boundaries to ensure non-invited users cannot upload, review, publish, or export restricted materials.
- Asynchronous processing should be tested by verifying uploads return quickly and background work updates note status independently.

## Out of Scope

- Public access for users outside the invited class cohort.
- Unreviewed automatic publication of AI-generated notes.
- Real-time collaborative Markdown editing.
- Mobile-native apps.
- Full learning management system features such as grading, attendance, or assignment submission.
- A generic public knowledge base unrelated to class materials.

## Further Notes

- `raw stuff/raw-prd.md` is the source PRD input for this synthesized page.
- `raw stuff/SystemDesign.md` provides the architecture basis.
- `raw stuff/PLAN.md` provides the phased implementation direction.
- The repository currently contains planning/wiki materials only; no application code has been scaffolded yet.
