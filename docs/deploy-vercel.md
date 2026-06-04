# Vercel Preview

AI Radar can be published as a static Vercel Preview after running the local build.

Build command:

```bash
node scripts/build.mjs
```

Output directory:

```text
dist
```

## Variables

Public:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Server-only:

- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET`

Never expose server-only variables to frontend code or logs.

## Smoke Test

After deploy, verify:

- home loads;
- `/data/signals.json` loads;
- mobile viewport is readable;
- no server-only secret appears in HTML, JS, or console logs.

Do not commit Vercel logs, preview screenshots, or build output.
