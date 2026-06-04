---
name: ai-radar-signals
description: Convert recent AI news, papers, repos, launches, or tool updates into structured AI Radar signals with source evidence, status, dedupe key, impact, and action.
---

# AI Radar Signals

Use this skill when the user asks to search, structure, save, or review AI news as AI Radar signals.

## Output Contract

Return or save an array of objects matching `data/contracts/signal.schema.json`.

Required fields:

- `title`
- `source`
- `url`
- `published_at`
- `evidence`
- `impact`
- `action`
- `status`
- `dedupe_key`

## Rules

- If editorial sources are available through Notion, read them first.
- If Notion is unavailable, use `config/sources.json` as a fallback only when it exists and state that fallback was used.
- Prefer primary sources over secondary summaries.
- Separate evidence by source lane when a task asks for parallel research:
  - `fuente_oficial`
  - `repo_tecnico`
  - `comunidad`
  - `medio_secundario`
- Mark a signal as `verified` only when the source supports the claim.
- Mark uncertain items as `pending`.
- Do not invent URLs, dates, sources, or evidence.
- Use Spanish for summaries and actions.
- Keep the action practical for a builder.
- Create a stable `dedupe_key` from source, product/project, and core claim.

## Saving

Daily searches are generated evidence and should be written under `data/searches/` when needed. They are ignored by Git.

If the user asks for a durable example, update `fixtures/signals.sample.json` with a small non-secret sample instead.
