// A tiny stand-in for Supabase's REST API, used only by the automated tests.
// Its answers (e2e/fixtures/*.json) are produced by running the real
// migrations and seeds on PostgreSQL (supabase/tests/make-web-fixtures.sh),
// so they match the real shape exactly.
import { createServer } from "node:http";
import { readFileSync } from "node:fs";

const fixture = (name) => readFileSync(new URL(`./fixtures/${name}.json`, import.meta.url), "utf8");
const port = Number(process.env.MOCK_SUPABASE_PORT ?? 54329);

createServer((req, res) => {
  if (req.headers.apikey !== "test-anon-key") {
    res.writeHead(401).end();
    return;
  }
  const send = (body) => res.writeHead(200, { "Content-Type": "application/json" }).end(body);
  const url = req.url ?? "";
  if (url === "/health") return send("{}");
  if (req.method === "GET") {
    for (const table of ["districts", "topics", "audiences"]) {
      if (url.startsWith(`/rest/v1/${table}?`)) return send(fixture(table));
    }
  }
  if (req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const args = body ? JSON.parse(body) : {};
      if (url === "/rest/v1/rpc/get_emergency_contacts") return send(fixture("contacts"));
      if (url === "/rest/v1/rpc/get_awareness_content") {
        return send(fixture(args.p_lang === "ur" ? "awareness-ur" : "awareness-en"));
      }
      res.writeHead(404).end();
    });
    return;
  }
  res.writeHead(404).end();
}).listen(port, () => console.log(`Mock Supabase on ${port}`));
