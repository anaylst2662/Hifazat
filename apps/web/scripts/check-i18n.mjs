// Checks that every language file has exactly the same keys and placeholders as en.json.
// Run with: npm run check:i18n
import { readFileSync, readdirSync } from "node:fs";

const dir = new URL("../../../shared/i18n/", import.meta.url);
const load = (file) => JSON.parse(readFileSync(new URL(file, dir), "utf8"));
const placeholders = (text) => [...String(text).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",");

const reference = load("en.json");
let problems = 0;
for (const file of readdirSync(dir).filter((f) => f.endsWith(".json") && f !== "en.json")) {
  const other = load(file);
  for (const key of Object.keys(reference)) {
    if (key.startsWith("@")) continue;
    if (!(key in other)) { console.error(`${file}: missing "${key}"`); problems++; }
    else if (placeholders(reference[key]) !== placeholders(other[key])) {
      console.error(`${file}: "${key}" has different {placeholders} than en.json`); problems++;
    }
    else if (!String(other[key]).trim()) { console.error(`${file}: "${key}" is empty`); problems++; }
  }
  for (const key of Object.keys(other)) {
    if (!key.startsWith("@") && !(key in reference)) { console.error(`${file}: extra key "${key}" not in en.json`); problems++; }
  }
}
if (problems) { console.error(`\n${problems} translation problem(s) found.`); process.exit(1); }
console.log("Translations OK: all languages have the same keys and placeholders.");
