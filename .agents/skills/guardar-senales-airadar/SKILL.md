---
name: guardar-senales-airadar
description: Validate, deduplicate, and persist normalized AI Radar signals through the approved Supabase server-side path.
---

# Guardar Senales AI Radar

Use this skill when candidates are already normalized and need to be persisted or dry-run validated.

## Inputs

Candidates must include:

- `title`
- `url` or `canonical_url`
- `source`
- `fingerprint` or `dedupe_key`
- `evidence`
- `impact`
- `action`
- `status`

## Rules

- Do not write directly from the search skill.
- Deduplicate by `fingerprint` and `canonical_url`.
- Create or update `signals`.
- Create an `ingestion_runs` record for each run.
- Return counts for inserted, updated, duplicated, rejected, and pending.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to browser code, logs, or generated reports.

## Dry Run

If credentials, project, or permissions are unavailable, return a dry-run summary and the exact blocking condition.
