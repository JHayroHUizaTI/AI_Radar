#!/usr/bin/env python3
"""Read AI Radar signal JSON and return a small filtered JSON payload."""

from __future__ import annotations

import argparse
import json
from pathlib import Path


STATUS_ORDER = {"verified": 0, "pending": 1, "rejected": 2}


def load_signals(path: Path) -> list[dict]:
    with path.open("r", encoding="utf-8") as handle:
        data = json.load(handle)
    if not isinstance(data, list):
        raise SystemExit(f"{path} must contain a JSON array")
    return data


def sort_signals(signals: list[dict], order: str) -> list[dict]:
    if order == "status":
        return sorted(signals, key=lambda item: (STATUS_ORDER.get(str(item.get("status")), 99), item.get("title", "")))
    if order == "source":
        return sorted(signals, key=lambda item: (item.get("source", ""), item.get("title", "")))
    return sorted(signals, key=lambda item: (item.get("published_at", ""), item.get("title", "")), reverse=True)


def main() -> None:
    parser = argparse.ArgumentParser(description="Parse AI Radar signal JSON without spending model context.")
    parser.add_argument("--file", default="fixtures/signals.sample.json", help="JSON file with AI Radar signals")
    parser.add_argument("--limit", type=int, default=2, help="Number of signals to return")
    parser.add_argument("--order", choices=["date", "status", "source"], default="date")
    parser.add_argument("--status", choices=["verified", "pending", "rejected"], help="Optional status filter")
    args = parser.parse_args()

    path = Path(args.file)
    signals = load_signals(path)
    if args.status:
        signals = [item for item in signals if item.get("status") == args.status]

    result = {
        "source_file": str(path),
        "count": min(args.limit, len(signals)),
        "signals": sort_signals(signals, args.order)[: args.limit],
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
