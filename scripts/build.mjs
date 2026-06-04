import { mkdir, readFile, rm, writeFile, cp } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(root, "dist");
const signalsPath = resolve(root, "fixtures/signals.sample.json");

const items = JSON.parse(await readFile(signalsPath, "utf8"));

await rm(out, { recursive: true, force: true });
await mkdir(resolve(out, "data"), { recursive: true });
await cp(resolve(root, "app"), out, { recursive: true });
await writeFile(resolve(out, "data/signals.json"), JSON.stringify(items, null, 2));

console.log(`Built ${items.length} radar items into ${out}`);
