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

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", `http://localhost:${port}`);
    if (url.pathname === "/data/signals.json") {
      const items = await loadRadarItems();
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
