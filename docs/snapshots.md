# Snapshots

Snapshots are time-bounded evidence files.

The course can generate:

- `snapshots/weekly/<date>.json`
- `data/reports/snapshots-last-week.md`

Those files are useful during recording and review, but they are generated outputs and stay out of Git.

Versioned files:

- `data/contracts/weekly-snapshot.schema.json`
- `docs/templates/snapshots-last-week.md`

## Required Evidence

Each accepted signal needs:

- source;
- date;
- evidence;
- status;
- dedupe key;
- decision reason.
