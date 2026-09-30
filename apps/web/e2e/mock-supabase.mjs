// A tiny stand-in for Supabase's REST API, used only by the automated tests.
// Its answers (e2e/fixtures/*.json) were produced by running the real
// migrations and seed on PostgreSQL, so they match the real shape exactly.
import { createServer } from "node:http";
import { readFileSync } from "node:fs";

const contacts = readFileSync(new URL("./fixtures/contacts.json", import.meta.url), "utf8");
const districts = readFileSync(new URL("./fixtures/districts.json", import.meta.url), "utf8");
const port = Number(process.env.MOCK_SUPABASE_PORT ?? 54329);

createServer((req, res) => {
  if (req.headers.apikey !== "test-anon-key") {
    res.writeHead(401).end();
    return;
  }
  const send = (body) => res.writeHead(200, { "Content-Type": "application/json" }).end(body);
  if (req.method === "POST" && req.url === "/rest/v1/rpc/get_emergency_contacts") return send(contacts);
  if (req.method === "GET" && req.url?.startsWith("/rest/v1/districts?")) return send(districts);
  if (req.url === "/health") return send("{}");
  res.writeHead(404).end();
}).listen(port, () => console.log(`Mock Supabase on ${port}`));
