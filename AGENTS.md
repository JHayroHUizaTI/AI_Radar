# AI Radar Agent Guide

AI Radar is the course project for learning Codex with a real product surface.

The current repository state is intentionally small. Treat the README as product direction, not as proof that the full system already exists.

## Current State

- The project currently has a README and repository rules.
- The implementation is built class by class.
- Do not assume app files, scripts, databases, skills, deploy config, or automations exist until they are present in the repo.

## Product Direction

AI Radar will collect AI news, papers, repos, tools, and launches, then turn them into verifiable signals for builders.

The final system should support:

- source evidence;
- normalized signals;
- duplicate detection;
- ranking;
- practical action guides;
- an operator view;
- deploy and automation.

## Working Rules

- Inspect the repo before editing.
- Keep changes scoped to the current class objective.
- Prefer small, reproducible files over chat-only state.
- Do not commit secrets, local caches, generated weekly snapshots, build output, videos, screenshots, or temporary reports.
- When a class creates a reusable process, prefer a skill.
- When a class creates deterministic work, prefer a tool or script.
- When adding data examples, use fixtures or contracts unless the class explicitly requires a durable seed.

## Validation

For each class branch, leave a clear state:

- what was added;
- how to verify it;
- what remains intentionally missing.

If commands do not exist yet, do not invent them in docs as if they already work.
