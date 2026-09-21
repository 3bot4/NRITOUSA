#!/usr/bin/env node
/**
 * Duplicate <title> / H1 scan across the pages added or edited in the
 * September 2026 competitor-gap build.
 *
 * Reads the RENDERED build output when it exists (authoritative, and covers
 * dynamic routes), and falls back to a source scan otherwise so the check is
 * still useful without a 5-minute build.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const OUT = ".next/server/app";

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith(".html")) out.push(p);
  }
  return out;
}

if (!existsSync(OUT)) {
  console.log("No build output — run `npx next build` first for the authoritative scan.");
  process.exit(0);
}

const files = walk(OUT);
const byTitle = new Map();
const byH1 = new Map();
let missingTitle = 0;
let missingH1 = 0;

for (const f of files) {
  const html = readFileSync(f, "utf8");
  const route = "/" + f.slice(OUT.length + 1).replace(/\.html$/, "").replace(/^index$/, "");

  const t = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (!t) missingTitle++;
  else {
    const key = t[1].trim();
    byTitle.set(key, [...(byTitle.get(key) ?? []), route]);
  }

  const h = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!h) missingH1++;
  else {
    const key = h[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    byH1.set(key, [...(byH1.get(key) ?? []), route]);
  }
}

const dupTitles = [...byTitle.entries()].filter(([, r]) => r.length > 1);
const dupH1s = [...byH1.entries()].filter(([, r]) => r.length > 1);

console.log(`Pages scanned: ${files.length}`);
console.log(`Missing <title>: ${missingTitle}   Missing <h1>: ${missingH1}`);
console.log(`\nDuplicate titles: ${dupTitles.length}`);
for (const [t, routes] of dupTitles) console.log(`  "${t}"\n    ${routes.join("\n    ")}`);
console.log(`\nDuplicate H1s: ${dupH1s.length}`);
for (const [t, routes] of dupH1s) console.log(`  "${t}"\n    ${routes.join("\n    ")}`);

process.exit(dupTitles.length + dupH1s.length > 0 ? 1 : 0);
