import test from "node:test";
import assert from "node:assert/strict";
import { canonicalizeUrl, dedupeItems, fingerprintTitle, normalizeItems, rankItems } from "../lib/radar.mjs";

test("canonicalizeUrl removes tracking params and fragments", () => {
  assert.equal(
    canonicalizeUrl("https://example.com/post/?utm_source=x&ref=y#a"),
    "https://example.com/post"
  );
});

test("fingerprintTitle normalizes noisy titles", () => {
  assert.equal(fingerprintTitle("  AI Agents: New Tools! "), "ai agents new tools");
});

test("normalize, dedupe and rank starter items", () => {
  const raw = [
    {
      source: "example",
      source_item_id: "a",
      type: "official",
      url: "https://example.com/a?utm_source=news",
      title: "Agent release",
      summary: "Official release with docs.",
      published_at: "2026-05-17T00:00:00Z",
      topics: ["tools"],
      entities: ["Example"],
      has_docs: true,
      has_repo: false,
      recommended_action: "BUILD"
    },
    {
      source: "mirror",
      source_item_id: "b",
      type: "social",
      url: "https://example.com/a",
      title: "Agent release",
      summary: "Duplicate discussion.",
      published_at: "2026-05-17T01:00:00Z",
      topics: ["tools"],
      entities: ["Example"],
      has_docs: false,
      has_repo: false,
      recommended_action: "WATCH"
    }
  ];
  const ranked = rankItems(dedupeItems(normalizeItems(raw)));
  assert.equal(ranked.length, 1);
  assert.equal(ranked[0].recommended_action, "BUILD");
});
