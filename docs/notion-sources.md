# Notion Sources

Notion is the editorial admin for AI Radar sources.

Expected fields:

- `name`
- `url`
- `category`
- `subagent`
- `status`
- `reviewed_at`

The generated cache file is `config/sources.json` and is ignored by Git.

Version `config/sources.example.json` when the contract changes.

If Notion is unavailable, the signal skill may use the local cache but must say that it used fallback data.
