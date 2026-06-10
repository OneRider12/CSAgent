---
title: Raw PRD
created: 2026-06-10
updated: 2026-06-10
type: source
status: active
tags: [source, planning]
links: [overview, index, product-requirements]
---

# Raw PRD

Source: `raw stuff/raw-prd.md`

This source file contains the initial Product Requirements Document for the LLM Class Wiki.

## Key Points

- The product is a collaborative web-based knowledge hub for university or college classmates.
- Users upload slides, PDFs, DOCX files, handwritten notes, and images.
- AI extracts, summarizes, and formats uploaded materials into standardized Markdown.
- Automated linting cleans Markdown, validates heading hierarchy, fixes LaTeX/math syntax, removes whitespace noise, and handles broken formatting.
- Human reviewers compare raw files and generated Markdown before approving publication.
- Published notes become a web wiki with auto-linking, graph view, RAG-powered chat, and Obsidian export.
- Authentication is restricted to invited users.
- Processing should run asynchronously so uploads do not freeze the UI.

See [[product-requirements]] for the synthesized PRD.
