import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const checks = [
  ["package.json", "Project package manifest"],
  ["pnpm-lock.yaml", "Locked dependency graph"],
  ["app/index.html", "Dashboard entrypoint"],
  ["fixtures/signals.sample.json", "Signal fixture"],
  [".env.example", "Environment template"],
  ["AGENTS.md", "Agent instructions"]
];

let failed = false;

for (const [path, label] of checks) {
  try {
    await access(resolve(path));
    console.log(`OK ${label}: ${path}`);
  } catch {
    failed = true;
    console.error(`MISSING ${label}: ${path}`);
  }
}

const envExample = await readFile(".env.example", "utf8");
const filledSecret = /(SUPABASE_SECRET_KEY|SUPABASE_SERVICE_ROLE_KEY|OPENAI_API_KEY|GITHUB_TOKEN|HF_TOKEN|PRODUCT_HUNT_TOKEN)=[^\s"']{8,}/.exec(envExample);
if (filledSecret) {
  failed = true;
  console.error(`SECRET-LIKE VALUE in .env.example: ${filledSecret[1]}`);
} else {
  console.log("OK .env.example has no real secrets");
}

if (failed) {
  process.exit(1);
}

console.log("AI Radar doctor passed");
