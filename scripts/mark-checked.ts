/**
 * Record that a person re-checked the numbers on specific pages.
 *
 *   npm run mark-checked -- /tools/green-card-tracker /articles/fbar-nre-nro-accounts
 *   npm run mark-checked -- --date 2026-10-09 https://www.nritousa.com/oci/renewal
 *
 * Writes ONLY the pages named, into data/page-checks.json, with today's date
 * (the day you ran your audit) or --date. That date shows up as "Numbers
 * checked" on the page and on the homepage "Latest updates and checks" list.
 *
 * It refuses — and writes nothing — if any path isn't a page the homepage
 * list knows about, the date is in the future, or the date is malformed. A
 * date earlier than the one already recorded is skipped, never moved back.
 *
 * Only run it for pages you actually re-verified. If you changed the page's
 * content, bump that page's `updated` field instead — a check is not an update.
 */
import fs from "node:fs";
import path from "node:path";
import { pageDatesCatalog } from "@/lib/latestUpdates";

const FILE = path.join(process.cwd(), "data/page-checks.json");
const ISO = /^\d{4}-\d{2}-\d{2}$/;

function localToday(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function fail(msg: string): never {
  console.error(`\n✗ ${msg}\nNothing was written.\n`);
  process.exit(1);
}

const args = process.argv.slice(2);
let date = localToday();
const paths: string[] = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--date") date = args[++i] ?? "";
  else if (args[i].startsWith("--date=")) date = args[i].slice(7);
  else paths.push(args[i]);
}

if (!paths.length) {
  fail(
    "Name at least one page, e.g.\n  npm run mark-checked -- /tools/green-card-tracker /oci/renewal",
  );
}
if (!ISO.test(date) || Number.isNaN(Date.parse(date))) {
  fail(`--date must look like 2026-10-13 (got "${date}").`);
}
if (date > localToday()) fail(`${date} is in the future.`);

const known = new Map(pageDatesCatalog().map((p) => [p.path, p]));
const normalized = paths.map((p) =>
  p
    .trim()
    .replace(/^https?:\/\/(www\.)?nritousa\.com/i, "")
    .replace(/[?#].*$/, "")
    .replace(/(.)\/$/, "$1"),
);
const unknown = normalized.filter((p) => !known.has(p));
if (unknown.length) {
  fail(
    `Not a page the homepage list tracks:\n  ${unknown.join("\n  ")}\n` +
      "Check the spelling (paths start with /, e.g. /tools/processing-times).",
  );
}

const json = JSON.parse(fs.readFileSync(FILE, "utf8")) as {
  _about: string;
  checks: Record<string, string>;
};

const written: string[] = [];
const skipped: string[] = [];
for (const p of Array.from(new Set(normalized))) {
  const prev = json.checks[p];
  if (prev && prev >= date) {
    skipped.push(`${p} (already ${prev})`);
    continue;
  }
  json.checks[p] = date;
  written.push(`${p}  ${prev ? `${prev} → ` : ""}${date}  — ${known.get(p)!.title}`);
}

json.checks = Object.fromEntries(
  Object.entries(json.checks).sort(([a], [b]) => a.localeCompare(b)),
);
fs.writeFileSync(FILE, JSON.stringify(json, null, 2) + "\n");

console.log(`\nNumbers checked on ${date}:`);
written.forEach((w) => console.log(`  ✓ ${w}`));
skipped.forEach((s) => console.log(`  – skipped ${s}`));
console.log(
  "\nNext: commit data/page-checks.json and push to main — the homepage and each page update on the next deploy.\n",
);
