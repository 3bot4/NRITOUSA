#!/usr/bin/env node
/**
 * JSON-LD validation across a named set of routes, read from the production
 * build output.
 *
 * Asserts Article + BreadcrumbList + FAQPage on every page, WebApplication on
 * the tool pages, and a minimum FAQ count. Written for the September 2026
 * gap build's QA step, but takes routes as arguments so it is reusable.
 *
 * NOTE: the blocks are already valid JSON — do NOT "unescape" them first.
 * Replacing \" with " corrupts every properly-escaped quote inside a string
 * and produces false parse failures, which is exactly what happened the first
 * time this check was run by hand.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const OUT = ".next/server/app";

/**
 * Minimum FAQ entities. Defaults to the no-thin-page bar of 6, which applies to
 * pages this build created or upgraded. Pass --min=N to check a page that is
 * only expected to have valid FAQ schema, not a full set — repairing a page
 * from "no FAQPage at all" to a correct one with three entries is a real fix,
 * and reporting it as a failure would be misleading.
 */
const args = process.argv.slice(2);
const minArg = args.filter((a) => a.startsWith("--min="))[0];
const MIN_FAQ = minArg ? Number(minArg.split("=")[1]) : 6;
const routes = args.filter((a) => !a.startsWith("--"));

if (routes.length === 0) {
  console.error("usage: node scripts/audit/schema-scan.mjs [--min=N] <route> [route...]");
  process.exit(2);
}
if (!existsSync(OUT)) {
  console.error("No build output. Run `npx next build` first.");
  process.exit(2);
}

let failures = 0;

for (const route of routes) {
  const file = join(OUT, `${route.replace(/^\//, "")}.html`);
  if (!existsSync(file)) {
    console.log(`FAIL ${route} — no build output`);
    failures++;
    continue;
  }
  const html = readFileSync(file, "utf8");
  const blocks = [
    ...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g),
  ].map((m) => m[1]);

  const types = new Set();
  const parseErrors = [];
  let faqCount = 0;

  for (const block of blocks) {
    let data;
    try {
      data = JSON.parse(block);
    } catch (e) {
      parseErrors.push(e.message.slice(0, 60));
      continue;
    }
    const nodes = Array.isArray(data) ? data : data["@graph"] ?? [data];
    for (const node of nodes) {
      const t = node?.["@type"];
      if (Array.isArray(t)) t.forEach((x) => types.add(x));
      else if (t) types.add(t);
      if (t === "FAQPage") {
        faqCount = Math.max(faqCount, (node.mainEntity ?? []).length);
      }
    }
  }

  const required = ["Article", "BreadcrumbList", "FAQPage"];
  const missing = required.filter((t) => !types.has(t));
  const thinFaq = faqCount < MIN_FAQ;
  const ok = missing.length === 0 && parseErrors.length === 0 && !thinFaq;
  if (!ok) failures++;

  const notes = [
    missing.length ? `missing ${missing.join(",")}` : "",
    thinFaq ? `only ${faqCount} FAQs (need ${MIN_FAQ})` : "",
    parseErrors.length ? `parse: ${parseErrors.join("; ")}` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  console.log(
    `${ok ? "OK  " : "FAIL"} ${route.padEnd(46)} faq=${String(faqCount).padEnd(3)} ` +
      `${types.has("WebApplication") ? "WebApplication" : "".padEnd(14)} ${notes}`
  );
}

console.log(`\n${routes.length - failures}/${routes.length} passed`);
process.exit(failures > 0 ? 1 : 0);
