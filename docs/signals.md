# Signals

AI Radar stores news, papers, tools, repos, and launches as signals.

The class output is the signal contract, not a permanent daily search result. Daily searches live under `data/searches/` and stay out of Git.

Versioned files:

- `data/contracts/signal.schema.json`: stable contract.
- `fixtures/signals.sample.json`: small reproducible example.

Generated files:

- `data/searches/*.json`
- `data/reports/*.md`
- `snapshots/weekly/*.json`

Generated files are evidence for recording and review, but they are not course source code.
