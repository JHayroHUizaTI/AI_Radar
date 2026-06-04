# Supabase Persistence

Supabase stores accepted AI Radar signals and ingestion runs.

Versioned source:

- `.env.example`
- `supabase/migrations/001_ai_radar_persistence.sql`
- `.agents/skills/guardar-senales-airadar/SKILL.md`

Do not commit:

- real credentials;
- local database files;
- ingestion outputs;
- service role keys;
- Supabase CLI caches.

The search skill normalizes candidates. The persistence skill owns validation, deduplication, and storage.
