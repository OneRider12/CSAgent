---
title: Wiki Schema
created: 2026-06-10
updated: 2026-06-10
type: concept
status: active
tags: [schema, wiki]
links: [index, overview]
---

# Wiki Schema

This wiki tracks implementation knowledge for [[overview]] and keeps raw evidence separate from synthesized project knowledge.

## Page Types

- `source`: raw input, artifact, spec, transcript, or reference.
- `entity`: service, module, repository, file, API, stakeholder, or environment.
- `concept`: architecture, workflow, standard, pattern, or decision.
- `query`: open question, investigation, or synthesized answer.
- `error`: recurring error, defect, incident, or failure case.
- `solution`: fix playbook, validation approach, or prevention guidance.

## Status Values

- General pages: `active`, `draft`, `blocked`, `resolved`, `archived`.
- Error pages: `open`, `investigating`, `mitigated`, `resolved`, `wont-fix`.
- Solution pages: `draft`, `validated`, `adopted`, `superseded`.

## Tags

- `source`
- `design`
- `architecture`
- `planning`
- `frontend`
- `backend`
- `ai`
- `storage`
- `database`
- `linting`
- `wiki`
- `schema`

## Quality Rules

- Preserve source evidence under `raw stuff/`; do not rewrite it during wiki maintenance.
- Add every substantive page to [[index]].
- Log every meaningful action at the top of [[log]].
- Prefer at least two outbound wikilinks for substantive pages.
- Keep filenames lowercase and hyphen-separated.
- Keep `updated` current when a page changes.
