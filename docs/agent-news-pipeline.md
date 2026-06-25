# AI Agent News Pipeline

## Flow

The generated dataset is stored at `data/searches/ai-agents-2026-06-25.json`.
Each record follows `data/contracts/signal.schema.json`: one article per row,
ISO timestamp, canonical URL, concise evidence, builder impact/action, status,
and a stable deduplication key.

Apply both migrations in order:

```bash
supabase db push
```

Validate locally without database writes:

```bash
pnpm ingest -- data/searches/ai-agents-2026-06-25.json
```

Persist from a trusted server or CI environment:

```bash
pnpm ingest -- data/searches/ai-agents-2026-06-25.json --commit
```

Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in that environment's
secret manager before running the command.

The service-role key must never be used in browser code. The ingestion RPC
performs one network request, deduplicates by canonical URL and fingerprint,
updates changed records, and records the run summary.

## SQL-oriented schema

`published_at` is `timestamptz` for ordering and date filtering. URLs and
fingerprints are independently unique. Composite indexes support the common
dashboard query: status plus newest publication date. Long editorial fields
remain `text`; ingestion summaries use `jsonb`.

## Dashboard query

The local development server exposes `/api/signals`. It queries Supabase
server-side with the private key, selects explicit columns, returns only
verified records, and never sends credentials to the browser:

```js
const response = await fetch("/api/signals?status=verified&limit=50");
const signals = await response.json();

cards.innerHTML = signals.map((signal) => `
  <article class="card">
    <p>${signal.source} · ${new Date(signal.published_at).toLocaleDateString()}</p>
    <h3>${signal.title}</h3>
    <p>${signal.impact}</p>
    <a href="${signal.canonical_url}" target="_blank" rel="noreferrer">Fuente</a>
  </article>
`).join("");
```

The endpoint should select explicit columns, filter `status = 'verified'`,
order by `published_at desc`, enforce a maximum limit, and cache short-lived
public responses.
