import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const commit = args.includes("--commit");
const inputArg = args.find((arg) => !arg.startsWith("--"));
const inputPath = resolve(inputArg ?? "data/searches/ai-agents-2026-06-25.json");

function canonicalizeUrl(value) {
  const url = new URL(value);
  url.hash = "";
  for (const key of [...url.searchParams.keys()]) {
    if (key.startsWith("utm_") || ["ref", "source"].includes(key)) {
      url.searchParams.delete(key);
    }
  }
  return url.toString().replace(/\/$/, "");
}

function validateSignal(item, index) {
  const required = [
    "title",
    "source",
    "url",
    "published_at",
    "evidence",
    "impact",
    "action",
    "status",
    "dedupe_key"
  ];

  for (const field of required) {
    if (typeof item[field] !== "string" || item[field].trim() === "") {
      throw new Error(`Item ${index}: invalid or missing ${field}`);
    }
  }

  if (!["verified", "pending", "rejected"].includes(item.status)) {
    throw new Error(`Item ${index}: unsupported status ${item.status}`);
  }

  canonicalizeUrl(item.url);
  if (Number.isNaN(Date.parse(item.published_at))) {
    throw new Error(`Item ${index}: invalid published_at`);
  }
}

const parsed = JSON.parse(await readFile(inputPath, "utf8"));
if (!Array.isArray(parsed)) {
  throw new Error("Input must be a JSON array");
}

const payload = [];
const seenUrls = new Set();
const seenFingerprints = new Set();
for (const [index, item] of parsed.entries()) {
  validateSignal(item, index);
  const normalized = {
    ...item,
    url: canonicalizeUrl(item.url),
    published_at: new Date(item.published_at).toISOString()
  };
  if (seenUrls.has(normalized.url) || seenFingerprints.has(normalized.dedupe_key)) {
    continue;
  }
  seenUrls.add(normalized.url);
  seenFingerprints.add(normalized.dedupe_key);
  payload.push(normalized);
}

const summary = {
  input: inputPath,
  received: parsed.length,
  valid: payload.length,
  local_duplicates: parsed.length - payload.length,
  mode: commit ? "commit" : "dry-run"
};

if (!commit) {
  console.log(JSON.stringify(summary, null, 2));
  console.log("Dry run only. Add --commit to write through the Supabase RPC.");
  process.exit(0);
}

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serverKey =
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serverKey) {
  throw new Error(
    "Commit blocked: set SUPABASE_URL and SUPABASE_SECRET_KEY (or legacy SUPABASE_SERVICE_ROLE_KEY)"
  );
}

const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/rpc/ingest_signals`, {
  method: "POST",
  headers: {
    apikey: serverKey,
    authorization: `Bearer ${serverKey}`,
    "content-type": "application/json"
  },
  body: JSON.stringify({ payload })
});

if (!response.ok) {
  throw new Error(`Supabase ingestion failed (${response.status}): ${await response.text()}`);
}

console.log(JSON.stringify({ ...summary, database: await response.json() }, null, 2));
