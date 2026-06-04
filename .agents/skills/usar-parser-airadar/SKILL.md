---
name: usar-parser-airadar
description: Use the local AI Radar parser tool when the user asks for the latest, first, filtered, counted, or ordered signals from an existing JSON file.
---

# Usar Parser AI Radar

Use this skill when the user asks to read existing AI Radar signals.

Prefer the deterministic tool instead of rereading large JSON files into model context.

## Tool

```bash
python3 tools/airadar_parse_search.py --file fixtures/signals.sample.json --limit 2 --order date
```

Options:

- `--file`: path to a JSON array of AI Radar signals.
- `--limit`: number of signals to return.
- `--order`: `date`, `status`, or `source`.
- `--status`: optional `verified`, `pending`, or `rejected`.

## Rule

Use the tool output as evidence. Do not claim a signal is verified unless the JSON status says `verified`.
