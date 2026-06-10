# REPO.md - Project Implementation Wiki Operating Schema

> This file is the authoritative operating schema for the agent maintaining this project wiki scaffold.
> Read it at the start of every session. Update it as conventions evolve.

---

## Vault Configuration (Windows)
- Project Root: `C:\Coding\Projects\CSAgent`
- Source Directory (raw): `C:\Coding\Projects\CSAgent\raw stuff`
- Output Directory (wiki): `C:\Coding\Projects\CSAgent\wiki`
- Archive Directory (ingested): `C:\Coding\Projects\CSAgent\ingested`
- Lint Scope Rule: Only perform project-wiki maintenance inside `C:\Coding\Projects\CSAgent` and focus on the `wiki` directory for structured knowledge.

---

## Purpose
This scaffold is for real project implementation tracking, not general knowledge capture.
Use it to track:
- project sources and decisions
- implemented entities and system components
- concepts, patterns, and architectural choices
- active questions and follow-up queries
- recurring errors, debugging evidence, and root causes
- reusable solutions, validation steps, and prevention methods

---

## Directory Structure
```
raw/                   ← Immutable project inputs, notes, specs, logs, transcripts, exports.
ingested/              ← Archived or processed source material.

wiki/                  ← Agent-owned structured implementation layer.
wiki/SCHEMA.md         ← Domain definitions, page types, taxonomy, and quality rules.
wiki/index.md          ← Categorized catalog. Update on EVERY substantive change.
wiki/log.md            ← Append-only activity log (newest at top).
wiki/overview.md       ← High-level current project status and implementation summary.
wiki/sources/          ← One page per project source, artifact, or reference.
wiki/entities/         ← Services, modules, repos, files, APIs, stakeholders, environments.
wiki/concepts/         ← Designs, workflows, standards, patterns, decisions.
wiki/queries/          ← Open questions, investigations, and synthesized answers.
wiki/errors/           ← Error cases with symptoms, root cause, repro, and status.
wiki/solutions/        ← Fix playbooks with validation and prevention guidance.
```

---

## Naming & Formatting Conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| File names | lowercase, hyphen-separated | `build-pipeline.md` |
| Wikilinks | `[[filename-without-extension]]` | `[[build-pipeline]]` |
| Dates | ISO 8601 (YYYY-MM-DD) | `2026-06-10` |
| Log Headers | `## [YYYY-MM-DD] action \| Subject` | `## [2026-06-10] initialize \| project-template` |
| Tags | Lowercase, from `wiki/SCHEMA.md` taxonomy | `#backend #incident` |

---

## Core Workflows

### 1. Capture / Ingest
1. Place raw project materials in `raw/`.
2. Create or update a source page in `wiki/sources/`.
3. Extract implementation-relevant entities, concepts, errors, and solutions into their folders.
4. Update `wiki/index.md`, `wiki/overview.md`, and the top of `wiki/log.md`.
5. Move completed source material to `ingested/` when appropriate.

### 2. Implementation Tracking
1. Record major components in `wiki/entities/`.
2. Record architecture, requirements, and decisions in `wiki/concepts/`.
3. Track open work, unresolved ambiguity, or research tasks in `wiki/queries/`.
4. Keep status and cross-links current as work progresses.

### 3. Error Recognition & Resolution
1. Capture each distinct issue in `wiki/errors/`.
2. Document symptoms, impact, repro steps, root cause, current status, and links.
3. Create or update a matching solution page in `wiki/solutions/` when a fix path is known.
4. Validate the fix, document prevention measures, and cross-link related error pages.

### 4. Maintenance / Lint
- Ensure every page is represented in `wiki/index.md`.
- Prefer at least 2 outbound wikilinks per substantive page.
- Keep `updated` dates current.
- Mark stale or superseded pages clearly rather than deleting history.

---

## Page Formats (YAML Frontmatter)

### General Wiki Pages
```yaml
---
title: Page Title
created: YYYY-MM-DD
updated: YYYY-MM-DD
type: source | entity | concept | query | error | solution
status: active | draft | blocked | resolved | archived
tags: []
links: []
---
```

### Error Pages
```yaml
---
title: Error Title
created: YYYY-MM-DD
updated: YYYY-MM-DD
type: error
status: open | investigating | mitigated | resolved | wont-fix
severity: low | medium | high | critical
systems: []
related_solutions: []
related_sources: []
---
```

### Solution Pages
```yaml
---
title: Solution Title
created: YYYY-MM-DD
updated: YYYY-MM-DD
type: solution
status: draft | validated | adopted | superseded
solves: []
related_errors: []
related_sources: []
---
```

---

## Invariants
1. Never rewrite source evidence in `raw/`; preserve originals.
2. Every substantive page must appear in `wiki/index.md`.
3. Log every meaningful action at the top of `wiki/log.md`.
4. Error pages must include symptoms, root cause, status, repro, and links.
5. Solution pages must include fix steps, validation, prevention, and related errors.
6. Keep filenames lowercase and hyphenated.

---

## Evolution Log
| Date | Change |
|------|--------|
| 2026-06-10 | Updated vault configuration to local CSAgent workspace and initialized wiki directory. |
| 2026-06-10 | Initialized reusable project implementation wiki scaffold. |
| (init) | Scaffold created. |
