#!/usr/bin/env node
/*
 * Capture a ledger item without hand-editing data/content-ledger.json.
 *
 * The ledger is only useful if adding to it is trivial — a one-line note the
 * moment something is spotted, not a form to fill in. Everything except the
 * title is optional; the renderer omits what is missing rather than printing
 * placeholders. Flesh an item out later by editing the JSON directly.
 *
 * Hand-editing the JSON works fine too — this exists so a stray comma cannot
 * take the ledger out, and so ids/dates stay consistent across sessions.
 *
 *   npm run ledger:add -- "Visa bulletin category prose reads stale"
 *   npm run ledger:add -- "OCI fee table needs a re-check" --area=numbers --sev=high
 *   npm run ledger:add -- "..." --area=meta --sev=low --next="trim to 57 chars" --ev="npm run ledger"
 *   npm run ledger:add -- --done=meta-title-length          # mark an item resolved
 *
 * Flags: --area (content|meta|links|numbers|other) --sev (high|medium|low)
 *        --next --ev --detail --id --done=<id>
 */

const { readFileSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");

const FILE = join(__dirname, "..", "..", "data", "content-ledger.json");
const AREAS = ["content", "meta", "links", "numbers", "other"];
const SEVS = ["high", "medium", "low"];

const argv = process.argv.slice(2);
const flags = {};
const positional = [];
for (const a of argv) {
  const m = a.match(/^--([a-zA-Z]+)(?:=([\s\S]*))?$/);
  if (m) flags[m[1].toLowerCase()] = m[2] === undefined ? true : m[2];
  else positional.push(a);
}

const today = new Date().toISOString().slice(0, 10);
const ledger = JSON.parse(readFileSync(FILE, "utf8"));

/* ── resolve an existing item ─────────────────────────────────────────────── */
if (flags.done && flags.done !== true) {
  const item = ledger.items.find((i) => i.id === flags.done);
  if (!item) {
    console.error(`No ledger item with id "${flags.done}".`);
    console.error(`Open ids: ${ledger.items.filter((i) => i.status !== "done").map((i) => i.id).join(", ")}`);
    process.exit(1);
  }
  item.status = "done";
  item.resolved = today;
  ledger.updated = today;
  writeFileSync(FILE, JSON.stringify(ledger, null, 2) + "\n");
  console.log(`✅ Resolved "${item.title}" (${item.id}) on ${today}.`);
  console.log(`   Regenerate with: npm run ledger`);
  process.exit(0);
}

/* ── add a new item ───────────────────────────────────────────────────────── */
const title = positional.join(" ").trim();
if (!title) {
  console.error('Usage: npm run ledger:add -- "one line describing the work" [--area=] [--sev=] [--next=] [--ev=]');
  console.error('       npm run ledger:add -- --done=<item-id>');
  process.exit(1);
}

const slug = (flags.id && flags.id !== true ? flags.id : title)
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "")
  .split("-")
  .slice(0, 6)
  .join("-");

let id = slug;
for (let n = 2; ledger.items.some((i) => i.id === id); n++) id = `${slug}-${n}`;

const area = AREAS.includes(flags.area) ? flags.area : "other";
const severity = SEVS.includes(flags.sev) ? flags.sev : "medium";

const item = { id, title, area, severity, status: "open", opened: today };
if (flags.detail && flags.detail !== true) item.detail = flags.detail;
if (flags.next && flags.next !== true) item.nextStep = flags.next;
if (flags.ev && flags.ev !== true) item.evidence = flags.ev;

// Newest first among open items so a fresh capture is visible immediately.
const firstDone = ledger.items.findIndex((i) => i.status === "done");
if (firstDone === -1) ledger.items.push(item);
else ledger.items.splice(firstDone, 0, item);

ledger.updated = today;
writeFileSync(FILE, JSON.stringify(ledger, null, 2) + "\n");

console.log(`✅ Added "${title}"`);
console.log(`   id ${id} · ${area} · ${severity} · opened ${today}`);
if (!flags.area) console.log(`   (no --area given, filed as "other")`);
console.log(`   Regenerate with: npm run ledger`);
