/**
 * Site-wide audit: find pages that target a "number intent" (processing time,
 * fee, deadline, renewal, case status, calculator, etc.) and report which ones
 * are MISSING a top Fast Answer block, a numeric estimate/fee, a last-verified
 * date, an official source link, FAQ schema, or an Article dateModified.
 *
 * Run: `npm run audit:intent-numbers`  (Node strips the TS types natively).
 *
 * Pure filesystem scan — no imports, no build step, no new deps.
 */

const fs = require("fs");
const path = require("path");

const APP_DIR = path.join(__dirname, "..", "src", "app");

const INTENT_KEYWORDS: string[] = [
  "processing time", "timeline", "wait time", "how long", "fee", "cost",
  "filing fee", "renewal", "replacement", "case status", "deadline",
  "filing window", "eligibility date", "calculator", "checklist",
];

// Routes that contain intent keywords in prose but are NOT number-answer pages.
const EXCLUDE = [
  "/about", "/contact", "/disclaimer", "/privacy-policy", "/terms",
  "/community", "/resources", "/free-immigrant-wealth-guide",
  "/education/articles", "/education/college-rankings",
];

type Priority = "High" | "Medium" | "Low";

interface Row {
  page: string;
  intents: string[];
  missingFastAnswer: boolean;
  missingEstimate: boolean;
  missingLastVerified: boolean;
  missingSource: boolean;
  missingFaqSchema: boolean;
  missingDateModified: boolean;
  priority: Priority;
}

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.name === "page.tsx" || entry.name === "page.ts") out.push(full);
  }
  return out;
}

/** Route path from a page file, e.g. .../app/green-card-renewal-fee/page.tsx → /green-card-renewal-fee */
function routeOf(file: string): string {
  const rel = path.relative(APP_DIR, path.dirname(file));
  const r = "/" + rel.split(path.sep).filter((s) => !s.startsWith("(")).join("/");
  return r === "/" ? "/" : r.replace(/\/$/, "");
}

function analyze(file: string): Row | null {
  const src = fs.readFileSync(file, "utf8");
  const lower = src.toLowerCase();

  const route = routeOf(file);
  if (EXCLUDE.some((p) => route === p || route.startsWith(p + "/"))) return null;

  const intents = INTENT_KEYWORDS.filter((k) => lower.includes(k));
  if (intents.length === 0) return null;

  const hasFastAnswer =
    /FastAnswerSnapshot|EstimatedTimelineTable|EstimatedTimelineAnswer|Quick Answer|Fast answer|FormSnapshot|Snapshot/.test(src);
  // A dollar amount, a "N–N months/weeks/days" range, a percent, or "N business days".
  const hasEstimate =
    /\$\s?\d/.test(src) ||
    /\d+\s?[–-]\s?\d+\s?(months?|weeks?|days?|years?)/i.test(src) ||
    /\d+\s?(business days?|percent|%)/i.test(src) ||
    /\d+\s?(months?|weeks?|days?|years?)\b/i.test(src);
  const hasLastVerified = /last verified|lastVerified|last updated|lastUpdated|dateModified|GC_RENEWAL_UPDATED/i.test(src);
  const hasSource =
    /uscis\.gov|dol\.gov|travel\.state\.gov|irs\.gov|fincen|passportindia|vfsglobal|incometax\.gov|rbi\.org|collegeboard|studentaid|OfficialSourceBox|OfficialSourceNote|officialSources|sourceLinks|SourceLinks/i.test(src);
  const hasFaqSchema = /faqJsonLd|FAQPage|ToolFaq|faqs\b/i.test(src);
  const hasDateModified = /dateModified/i.test(src);

  const missingFastAnswer = !hasFastAnswer;
  const missingEstimate = !hasEstimate;
  const missingLastVerified = !hasLastVerified;
  const missingSource = !hasSource;
  const missingFaqSchema = !hasFaqSchema;
  const missingDateModified = !hasDateModified;

  // Priority: fee/processing/deadline pages missing the actual number are High.
  const isMoneyOrTime = intents.some((i) =>
    ["fee", "cost", "filing fee", "processing time", "how long", "wait time", "deadline", "renewal"].includes(i),
  );
  let priority: Priority = "Low";
  if (isMoneyOrTime && (missingEstimate || missingFastAnswer)) priority = "High";
  else if (missingLastVerified || missingSource || missingFastAnswer) priority = "Medium";

  return {
    page: routeOf(file),
    intents,
    missingFastAnswer,
    missingEstimate,
    missingLastVerified,
    missingSource,
    missingFaqSchema,
    missingDateModified,
    priority,
  };
}

function main() {
  const files = walk(APP_DIR);
  const rows: Row[] = [];
  for (const f of files) {
    const r = analyze(f);
    if (r) rows.push(r);
  }

  const order: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 };
  rows.sort((a, b) => order[a.priority] - order[b.priority] || a.page.localeCompare(b.page));

  const flag = (b: boolean) => (b ? "❌" : "✅");
  const counts = { High: 0, Medium: 0, Low: 0 } as Record<Priority, number>;
  for (const r of rows) counts[r.priority]++;

  console.log("\n═══ User-Intent Numbers Audit ═══");
  console.log(`Scanned ${files.length} routes · ${rows.length} match a number intent`);
  console.log(`Priority → High: ${counts.High}  Medium: ${counts.Medium}  Low: ${counts.Low}\n`);
  console.log(
    ["PRI", "FAST", "EST", "VERIF", "SRC", "FAQ", "MOD", "PAGE"].join("\t"),
  );
  for (const r of rows) {
    console.log(
      [
        r.priority,
        flag(r.missingFastAnswer),
        flag(r.missingEstimate),
        flag(r.missingLastVerified),
        flag(r.missingSource),
        flag(r.missingFaqSchema),
        flag(r.missingDateModified),
        r.page,
      ].join("\t"),
    );
  }
  console.log("\nLegend: ❌ = missing, ✅ = present.");
  console.log("Columns: FAST=Fast Answer block · EST=numeric estimate/fee · VERIF=last verified · SRC=official source · FAQ=FAQ schema · MOD=Article dateModified\n");

  if (process.argv.includes("--json")) {
    fs.writeFileSync(
      path.join(__dirname, "..", "intent-audit.json"),
      JSON.stringify(rows, null, 2),
    );
    console.log("Wrote intent-audit.json\n");
  }
}

main();
