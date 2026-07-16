/**
 * SEO invariant audit CLI — runs the rules in lib/audit-rules against the
 * rendered production build and writes reports/seo-audit.json.
 *
 * Run: npm run seo:audit             (exits 1 on any ERROR-level finding)
 *      npm run seo:audit -- --warn-only
 *
 * Requires a prior `next build`; the audit reads .next/server/app/**\/*.html.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { REPO_ROOT } from "./lib/inventory";
import { loadRendered } from "./lib/rendered";
import { runAudit, type Finding } from "./lib/audit-rules";

const warnOnly = process.argv.includes("--warn-only");

const pages = loadRendered();
const { findings, indexableCount, pageCount } = runAudit(pages);

const errors = findings.filter((f) => f.level === "error");
const warns = findings.filter((f) => f.level === "warn");

const byCheck = new Map<string, Finding[]>();
for (const f of findings) byCheck.set(f.check, [...(byCheck.get(f.check) ?? []), f]);

console.log("\n═══ SEO Audit ═══");
console.log(`Rendered pages: ${pageCount} · Indexable: ${indexableCount}`);
console.log(`Errors: ${errors.length} · Warnings: ${warns.length}\n`);

for (const [check, fs] of [...byCheck].sort((a, b) => {
  if (a[1][0].level !== b[1][0].level) return a[1][0].level === "error" ? -1 : 1;
  return b[1].length - a[1].length;
})) {
  console.log(`[${fs[0].level === "error" ? "ERROR" : "warn "}] ${check} (${fs.length})`);
  for (const f of fs.slice(0, 6)) console.log(`         ${f.route} — ${f.detail}`);
  if (fs.length > 6) console.log(`         … ${fs.length - 6} more (see reports/seo-audit.json)`);
}

mkdirSync(join(REPO_ROOT, "reports"), { recursive: true });
writeFileSync(
  join(REPO_ROOT, "reports", "seo-audit.json"),
  JSON.stringify(
    { generatedAt: new Date().toISOString(), pageCount, indexableCount, findings },
    null,
    2,
  ) + "\n",
);
console.log("\nWrote reports/seo-audit.json");

if (errors.length > 0 && !warnOnly) {
  console.log(`\n✗ ${errors.length} error-level finding(s).\n`);
  process.exit(1);
}
console.log("");
