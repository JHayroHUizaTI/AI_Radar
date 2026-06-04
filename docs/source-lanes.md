# Source Lanes

AI Radar separates source discovery into lanes so different evidence types do not get mixed.

Versioned lane config:

- `config/source-lanes.example.json`

Generated outputs from a parallel search should stay under ignored paths such as `data/searches/` or `data/reports/`.

## Lanes

- `fuente_oficial`: primary announcements and documentation.
- `repo_tecnico`: code, releases, commits, issues, and examples.
- `comunidad`: early signals that need confirmation.
- `medio_secundario`: press or curated summaries.

The lane config is a course source file. Search results are not.
