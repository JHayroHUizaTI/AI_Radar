# Tools

AI Radar uses tools for deterministic operations that should not spend model context.

## `tools/airadar_parse_search.py`

Reads an existing signal JSON file and returns a small filtered payload.

Example:

```bash
python3 tools/airadar_parse_search.py --file fixtures/signals.sample.json --limit 2 --order date
```

Generated search files under `data/searches/` can be parsed locally, but they remain outside Git.
