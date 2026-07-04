/**
 * Monthly verification audit: reads every verified number in
 * src/data/siteWideVerifiedNumbers.ts and flags anything whose `lastVerified`
 * date is older than 45 days ("Needs monthly verification").
 *
 * Run: `npm run audit:monthly-numbers`.
 *
 * Regex-parses the data file (no ESM/CJS import friction, no new deps).
 */

const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "..", "src", "data", "siteWideVerifiedNumbers.ts");
const STALE_DAYS = 45;

interface Item {
  label: string;
  value: string;
  lastVerified: string;
  sourceName: string;
  sourceUrl: string;
  ageDays: number;
  needsUpdate: boolean;
}

function daysSince(iso: string): number {
  const then = new Date(iso + "T00:00:00Z").getTime();
  const now = Date.now();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

function field(block: string, name: string): string {
  const m = block.match(new RegExp(name + '\\s*:\\s*"([^"]*)"'));
  return m ? m[1] : "";
}

function main() {
  const src = fs.readFileSync(DATA_FILE, "utf8");

  // Each verified number is an object literal containing a label + lastVerified.
  const blocks = src.split(/\{\s*\n\s*label:/).slice(1);
  const items: Item[] = [];
  for (const raw of blocks) {
    const block = "label:" + raw.split(/\n\s*\}/)[0];
    const label = field(block, "label");
    const lastVerified = field(block, "lastVerified");
    if (!label || !lastVerified) continue;
    const ageDays = daysSince(lastVerified);
    items.push({
      label,
      value: field(block, "value"),
      lastVerified,
      sourceName: field(block, "sourceName"),
      sourceUrl: field(block, "sourceUrl"),
      ageDays,
      needsUpdate: ageDays > STALE_DAYS,
    });
  }

  items.sort((a, b) => b.ageDays - a.ageDays);
  const stale = items.filter((i) => i.needsUpdate).length;

  console.log("\n═══ Monthly Verified-Numbers Audit ═══");
  console.log(`Tracked values: ${items.length} · Stale (>${STALE_DAYS} days): ${stale}\n`);
  console.log(["NEEDS", "AGE", "VALUE", "VERIFIED", "ITEM"].join("\t"));
  for (const i of items) {
    console.log(
      [
        i.needsUpdate ? "⚠️  YES" : "ok",
        i.ageDays + "d",
        i.value,
        i.lastVerified,
        i.label,
      ].join("\t"),
    );
  }
  if (stale > 0) {
    console.log(`\n⚠️  ${stale} value(s) older than ${STALE_DAYS} days — Needs monthly verification.`);
    console.log("Re-check each against its official source, then bump lastVerified in src/data/siteWideVerifiedNumbers.ts.\n");
  } else {
    console.log("\n✅ All tracked values verified within the last 45 days.\n");
  }
}

main();
