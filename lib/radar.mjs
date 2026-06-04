import crypto from "node:crypto";

export function canonicalizeUrl(value) {
  const url = new URL(value);
  url.hash = "";
  for (const key of [...url.searchParams.keys()]) {
    if (key.startsWith("utm_") || key === "ref") {
      url.searchParams.delete(key);
    }
  }
  return url.toString().replace(/\/$/, "");
}

export function fingerprintTitle(title) {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function hashContent(value) {
  return crypto.createHash("sha256").update(value).digest("hex").slice(0, 16);
}

export function normalizeItem(raw) {
  const canonicalUrl = canonicalizeUrl(raw.url);
  const titleFingerprint = fingerprintTitle(raw.title);
  const contentHash = hashContent(`${titleFingerprint}:${raw.summary}`);
  const score =
    30 +
    raw.topics.length * 8 +
    (raw.type === "official" ? 20 : 0) +
    (raw.has_repo ? 12 : 0) +
    (raw.has_docs ? 10 : 0);

  return {
    id: `${raw.source}:${raw.source_item_id}`,
    source: raw.source,
    type: raw.type,
    source_item_id: raw.source_item_id,
    url: raw.url,
    canonical_url: canonicalUrl,
    title: raw.title,
    summary: raw.summary,
    published_at: raw.published_at,
    topics: raw.topics,
    entities: raw.entities,
    recommended_action: raw.recommended_action ?? "WATCH",
    title_fingerprint: titleFingerprint,
    content_hash: contentHash,
    score
  };
}

export function normalizeItems(rawItems) {
  return rawItems.map(normalizeItem);
}

export function dedupeItems(items) {
  const seen = new Map();
  for (const item of items) {
    const key = item.canonical_url || item.content_hash;
    if (!seen.has(key)) {
      seen.set(key, item);
    }
  }
  return [...seen.values()];
}

export function rankItems(items) {
  return [...items].sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
}
