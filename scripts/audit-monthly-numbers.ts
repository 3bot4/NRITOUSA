/**
 * Monthly verification audit for src/data/siteWideVerifiedNumbers.ts.
 *
 * Run: `npm run audit:monthly-numbers`
 *      `npm run audit:monthly-numbers -- --fetch`             (live-source check)
 *      `npm run audit:monthly-numbers -- --update-baseline`   (after a real reconciliation)
 *
 * ── Why this script has three checks, not one ────────────────────────────────
 * It used to check only the AGE of each `lastVerified` stamp. That misses the
 * failure mode that actually shipped wrong numbers to readers: a figure sitting
 * behind a *fresh-looking* stamp while being wrong at the source. (The India
 * TCS education/medical rate carried "verified 2026-07-04" for months after the
 * real rate dropped from 5% to 2%.) A date is not evidence.
 *
 * So there are now three independent checks:
 *   1. STALENESS  — is the stamp older than VERIFICATION_STALE_DAYS?
 *   2. DRIFT      — did a value change without its stamp moving (or vice
 *                   versa)? Compared against a committed baseline snapshot.
 *                   A stamp that advances while the value stays byte-identical
 *                   is the signature of a date bumped without a real re-check.
 *   3. LIVE       — (--fetch) actually retrieve the official source and look
 *                   for the value in it. This is the step whose absence let the
 *                   TCS bug through.
 *
 * Regex-parses the data file (no ESM/CJS import friction, no new deps).
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DATA_FILE = path.join(ROOT, "src", "data", "siteWideVerifiedNumbers.ts");
const BASELINE_FILE = path.join(ROOT, "data", "verified-numbers-baseline.json");
const STALE_DAYS = 45;

/**
 * Hosts that reject automated requests (they answer 403 to anything without a
 * browser fingerprint). Fetching these produces false "value not found" noise,
 * so they are reported as manual-check-required instead of being fetched.
 * Keep in sync with the note in CLAUDE.md.
 */
const UNFETCHABLE_HOSTS = [
  "uscis.gov",
  "egov.uscis.gov",
  "travel.state.gov",
  "ceac.state.gov",
  "vfsglobal.com",
  "visa.vfsglobal.com",
];

interface Item {
  label: string;
  value: string;
  lastVerified: string;
  sourceName: string;
  sourceUrl: string;
  ageDays: number;
  needsUpdate: boolean;
}

interface BaselineEntry {
  value: string;
  lastVerified: string;
  /** ISO date the value was last compared against the live official source. */
  liveCheckedOn?: string;
}

type Baseline = Record<string, BaselineEntry>;

function daysSince(iso: string): number {
  const then = new Date(iso + "T00:00:00Z").getTime();
  const now = Date.now();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function field(block: string, name: string): string {
  const m = block.match(new RegExp(name + '\\s*:\\s*"([^"]*)"'));
  return m ? m[1] : "";
}

/**
 * Most entries write `sourceUrl: officialSources.uscisFeeSchedule` rather than
 * a string literal, so a literal-only regex resolves them to "" — which is how
 * this script quietly reported an empty source for nearly every number. Parse
 * the officialSources map first and dereference against it.
 */
function parseOfficialSources(src: string): Record<string, string> {
  const start = src.indexOf("export const officialSources");
  if (start === -1) return {};
  const end = src.indexOf("} as const;", start);
  const block = src.slice(start, end === -1 ? undefined : end);
  const map: Record<string, string> = {};
  const re = /(\w+)\s*:\s*\n?\s*"([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(block)) !== null) map[m[1]] = m[2];
  return map;
}

function sourceUrlOf(block: string, sources: Record<string, string>): string {
  const literal = field(block, "sourceUrl");
  if (literal) return literal;
  const ref = block.match(/sourceUrl\s*:\s*officialSources\.(\w+)/);
  return ref ? sources[ref[1]] ?? "" : "";
}

function parseItems(): Item[] {
  const src = fs.readFileSync(DATA_FILE, "utf8");
  const sources = parseOfficialSources(src);

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
      sourceUrl: sourceUrlOf(block, sources),
      ageDays,
      needsUpdate: ageDays > STALE_DAYS,
    });
  }
  return items;
}

function readBaseline(): Baseline {
  if (!fs.existsSync(BASELINE_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(BASELINE_FILE, "utf8")).numbers ?? {};
  } catch {
    console.warn(`⚠️  Could not parse ${path.relative(ROOT, BASELINE_FILE)} — treating as empty.`);
    return {};
  }
}

function writeBaseline(items: Item[], liveChecked: Record<string, string>) {
  const prev = readBaseline();
  const numbers: Baseline = {};
  for (const i of items) {
    numbers[i.label] = {
      value: i.value,
      lastVerified: i.lastVerified,
      liveCheckedOn: liveChecked[i.label] ?? prev[i.label]?.liveCheckedOn,
    };
  }
  fs.writeFileSync(
    BASELINE_FILE,
    JSON.stringify(
      {
        note: "Snapshot of every tracked verified number at its last reconciliation. Regenerate with `npm run audit:monthly-numbers -- --update-baseline` ONLY after actually re-checking the values against their official sources.",
        updatedAt: today(),
        numbers,
      },
      null,
      2,
    ) + "\n",
  );
}

/* ─────────────────────────── Drift detection ───────────────────────────── */

interface Drift {
  label: string;
  kind: "value-changed-silently" | "stamp-only-bump" | "new";
  detail: string;
}

function detectDrift(items: Item[], baseline: Baseline): Drift[] {
  const drifts: Drift[] = [];
  for (const i of items) {
    const base = baseline[i.label];
    if (!base) {
      drifts.push({ label: i.label, kind: "new", detail: `not in baseline (value "${i.value}")` });
      continue;
    }
    const valueChanged = base.value !== i.value;
    const stampMoved = base.lastVerified !== i.lastVerified;

    if (valueChanged && !stampMoved) {
      drifts.push({
        label: i.label,
        kind: "value-changed-silently",
        detail: `"${base.value}" → "${i.value}" but lastVerified is still ${i.lastVerified}`,
      });
    } else if (!valueChanged && stampMoved) {
      drifts.push({
        label: i.label,
        kind: "stamp-only-bump",
        detail: `lastVerified ${base.lastVerified} → ${i.lastVerified}, value unchanged ("${i.value}")`,
      });
    }
  }
  return drifts;
}

/* ───────────────────────── Live-source checking ────────────────────────── */

type LiveVerdict = "match" | "not-found" | "unfetchable" | "error" | "not-scalar";

interface LiveResult {
  label: string;
  verdict: LiveVerdict;
  detail: string;
}

/**
 * Only a scalar value (a dollar amount, a plain number, a percentage) can be
 * looked for verbatim in a government page. Ranges and prose ("8–14 months",
 * "Months to 2+ years") never appear literally and would produce nothing but
 * false alarms, so they are reported as needing human eyes instead.
 */
function isScalar(value: string): boolean {
  return /^\$?\d[\d,]*(\.\d+)?%?$/.test(value.trim());
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function isUnfetchable(url: string): boolean {
  const host = hostOf(url);
  return UNFETCHABLE_HOSTS.some((h) => host === h || host.endsWith("." + h));
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");
}

async function checkLive(item: Item): Promise<LiveResult> {
  if (!item.sourceUrl) {
    return {
      label: item.label,
      verdict: "error",
      detail: "no sourceUrl recorded — this number cannot be verified against anything",
    };
  }
  if (!isScalar(item.value)) {
    return {
      label: item.label,
      verdict: "not-scalar",
      detail: `"${item.value}" is a range/prose value — compare it by hand at ${item.sourceUrl}`,
    };
  }
  if (isUnfetchable(item.sourceUrl)) {
    return {
      label: item.label,
      verdict: "unfetchable",
      detail: `${hostOf(item.sourceUrl)} blocks automated requests — check by hand at ${item.sourceUrl}`,
    };
  }

  try {
    const res = await fetch(item.sourceUrl, {
      headers: { "user-agent": "nritousa-number-audit/1.0 (+https://www.nritousa.com)" },
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) {
      return {
        label: item.label,
        verdict: "error",
        detail: `HTTP ${res.status} from ${item.sourceUrl}`,
      };
    }
    const text = stripHtml(await res.text());
    // Match with and without thousands separators — pages format both ways.
    const needles = [item.value, item.value.replace(/,/g, "")];
    const found = needles.some((n) => text.includes(n));
    return {
      label: item.label,
      verdict: found ? "match" : "not-found",
      detail: found
        ? `found "${item.value}" on ${hostOf(item.sourceUrl)}`
        : `"${item.value}" NOT present on ${item.sourceUrl} — confirm by hand`,
    };
  } catch (err: any) {
    return {
      label: item.label,
      verdict: "error",
      detail: `fetch failed: ${err?.message ?? err}`,
    };
  }
}

/* ──────────────────────────────── Report ───────────────────────────────── */

async function main() {
  const argv = process.argv.slice(2);
  const doFetch = argv.includes("--fetch");
  const doUpdateBaseline = argv.includes("--update-baseline");

  const items = parseItems();
  items.sort((a, b) => b.ageDays - a.ageDays);
  const stale = items.filter((i) => i.needsUpdate).length;

  console.log("\n═══ Monthly Verified-Numbers Audit ═══");
  console.log(`Tracked values: ${items.length} · Stale (>${STALE_DAYS} days): ${stale}\n`);

  console.log("── 1. Staleness ──");
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

  const baseline = readBaseline();
  const baselineExists = Object.keys(baseline).length > 0;
  const drifts = baselineExists ? detectDrift(items, baseline) : [];

  console.log("\n── 2. Drift vs. last reconciliation ──");
  if (!baselineExists) {
    console.log("No baseline recorded yet. Run with --update-baseline after you have");
    console.log("re-checked the values against their official sources.");
  } else {
    const silent = drifts.filter((d) => d.kind === "value-changed-silently");
    const stampOnly = drifts.filter((d) => d.kind === "stamp-only-bump");
    const fresh = drifts.filter((d) => d.kind === "new");

    for (const d of silent) console.log(`❌ VALUE CHANGED, STAMP DID NOT: ${d.label} — ${d.detail}`);
    for (const d of stampOnly) console.log(`… stamp bumped, value unchanged: ${d.label} — ${d.detail}`);
    for (const d of fresh) console.log(`+ new tracked value: ${d.label} — ${d.detail}`);
    if (drifts.length === 0) console.log("✅ No drift against the recorded baseline.");
    if (stampOnly.length > 0) {
      console.log(
        `\nNote: ${stampOnly.length} value(s) had their date advanced without the number moving.`,
      );
      console.log("That is normal when a figure genuinely did not change — but it is also what");
      console.log("a date bumped without a real check looks like. Run --fetch to tell them apart.");
    }
  }

  const liveChecked: Record<string, string> = {};
  let liveFailures = 0;

  console.log("\n── 3. Live-source check ──");
  if (!doFetch) {
    const scalars = items.filter((i) => isScalar(i.value)).length;
    console.log(`Skipped (pass --fetch to run it). ${scalars} of ${items.length} values are`);
    console.log("scalars that can be checked against their source automatically.");
  } else {
    const results: LiveResult[] = [];
    for (const item of items) {
      const r = await checkLive(item);
      results.push(r);
      if (r.verdict === "match") liveChecked[item.label] = today();
    }
    for (const r of results.filter((r) => r.verdict === "match")) {
      console.log(`✅ ${r.label} — ${r.detail}`);
    }
    for (const r of results.filter((r) => r.verdict === "not-found")) {
      liveFailures++;
      console.log(`❌ ${r.label} — ${r.detail}`);
    }
    for (const r of results.filter((r) => r.verdict === "error")) {
      console.log(`⚠️  ${r.label} — ${r.detail}`);
    }
    const manual = results.filter(
      (r) => r.verdict === "unfetchable" || r.verdict === "not-scalar",
    );
    console.log(`\n${manual.length} value(s) need a manual comparison:`);
    for (const r of manual) console.log(`   • ${r.label} — ${r.detail}`);
  }

  /* ─────────────────────────────── Summary ─────────────────────────────── */

  const silentDrift = drifts.filter((d) => d.kind === "value-changed-silently").length;

  console.log("\n═══ Summary ═══");
  console.log(`Stale stamps (>${STALE_DAYS}d): ${stale}`);
  console.log(`Values changed without a re-verification stamp: ${silentDrift}`);
  console.log(`Live-source mismatches: ${doFetch ? liveFailures : "not checked (--fetch)"}`);

  if (doUpdateBaseline) {
    writeBaseline(items, liveChecked);
    console.log(`\n📌 Baseline written to ${path.relative(ROOT, BASELINE_FILE)}.`);
    console.log("Commit it — it is what the next run diffs against.");
  }

  if (stale > 0) {
    console.log(`\n⚠️  ${stale} value(s) older than ${STALE_DAYS} days — Needs monthly verification.`);
    console.log("Re-check each against its official source, then bump lastVerified in src/data/siteWideVerifiedNumbers.ts.");
  }
  if (silentDrift > 0 || liveFailures > 0) {
    console.log("\n❌ Audit found correctness problems (see above). Fix them before shipping.");
    process.exitCode = 1;
    return;
  }
  if (stale === 0) {
    console.log("\n✅ All tracked values verified within the last 45 days.\n");
  }
}

main();
