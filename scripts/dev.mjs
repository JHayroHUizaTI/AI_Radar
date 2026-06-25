import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PORT || 4173);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

async function loadRadarItems() {
  return JSON.parse(await readFile(resolve(root, "fixtures/signals.sample.json"), "utf8"));
}

async function loadSupabaseItems() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serverKey =
    process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serverKey) {
    return loadRadarItems();
  }

  const endpoint = new URL("/rest/v1/signals", supabaseUrl);
  endpoint.searchParams.set(
    "select",
    "title,source,canonical_url,published_at,evidence,impact,action,status,fingerprint"
  );
  endpoint.searchParams.set("status", "eq.verified");
  endpoint.searchParams.set("order", "published_at.desc");
  endpoint.searchParams.set("limit", "50");

  const response = await fetch(endpoint, {
    headers: {
      apikey: serverKey,
      authorization: `Bearer ${serverKey}`
    }
  });

  if (!response.ok) {
    throw new Error(`Supabase query failed (${response.status})`);
  }

  return (await response.json()).map((item) => ({
    ...item,
    url: item.canonical_url,
    dedupe_key: item.fingerprint
  }));
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", `http://localhost:${port}`);
    if (url.pathname === "/api/signals" || url.pathname === "/data/signals.json") {
      const items = await loadSupabaseItems();
      res.writeHead(200, { "content-type": contentTypes[".json"] });
      res.end(JSON.stringify(items, null, 2));
      return;
    }

    const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
    const filePath = resolve(root, "app", pathname.replace(/^\//, ""));
    const body = await readFile(filePath);
    res.writeHead(200, { "content-type": contentTypes[extname(filePath)] ?? "text/plain; charset=utf-8" });
    res.end(body);
  } catch (error) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end(error instanceof Error ? error.message : "Not found");
  }
});

server.listen(port, () => {
  console.log(`AI Radar starter running at http://localhost:${port}`);
});
