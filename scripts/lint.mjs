import { readdir, readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const required = [
  "app/index.html",
  "app/styles.css",
  "app/main.js",
  "fixtures/signals.sample.json",
  ".env.example",
  "AGENTS.md"
];

const secretKeys = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "OPENAI_API_KEY",
  "GITHUB_TOKEN",
  "HF_TOKEN",
  "PRODUCT_HUNT_TOKEN"
];

const forbidden = [
  /teacher-notes/i,
  /answer-key/i
];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (["node_modules", "dist"].includes(entry.name)) continue;
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

for (const path of required) {
  await stat(resolve(root, path));
}

for (const file of await walk(root)) {
  if (file.endsWith("scripts/lint.mjs")) {
    continue;
  }
  const body = await readFile(file, "utf8").catch(() => "");
  for (const key of secretKeys) {
    const assignment = new RegExp(`${key}=([^\\s"']+)`).exec(body);
    if (assignment && assignment[1].trim().length > 0) {
      throw new Error(`Potential real secret for ${key} in ${file}`);
    }
  }
  for (const pattern of forbidden) {
    if (pattern.test(body)) {
      throw new Error(`Forbidden content matched ${pattern} in ${file}`);
    }
  }
}

console.log("AI Radar starter lint passed");
