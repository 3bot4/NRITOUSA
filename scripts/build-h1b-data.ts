/**
 * Pre-aggregate official DOL LCA disclosure data into the compact summary
 * JSON consumed by /tools/h1b-salaries. Raw LCA rows NEVER ship to the
 * browser — only (title, metro, wage level, year) percentile aggregates.
 *
 * Input: the quarterly "LCA Disclosure Data" file from
 *   https://www.dol.gov/agencies/eta/foreign-labor/performance
 * The DOL publishes .xlsx — export/convert it to CSV first (File → Save As
 * in Excel, or `in2csv` / `npx xlsx-cli`), then run:
 *
 *   npx tsx scripts/build-h1b-data.ts LCA_Disclosure_Data_FY2026_Q2.csv [more.csv ...]
 *
 * Output: public/data/h1b/summary.json (replaces the seeded SAMPLE file).
 * Update cadence: quarterly — see docs/DATA-UPDATE-PLAYBOOK.md.
 */
import { createReadStream, writeFileSync } from "node:fs";
import { createInterface } from "node:readline";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "data",
  "h1b",
  "summary.json"
);

/** Minimum certified LCAs per (title, metro, level, year) cell to publish. */
const MIN_GROUP_SIZE = 10;
/** Cap the summary at the most common cells so the JSON stays small. */
const MAX_ROWS = 6000;

/* --------------------------- CSV line parsing --------------------------- */

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

/* ------------------------- field normalization -------------------------- */

const TITLE_RULES: [RegExp, string][] = [
  [/^(SR\.?|SENIOR|STAFF|PRINCIPAL|LEAD)\s+SOFTWARE/, "Senior Software Engineer"],
  [/SOFTWARE\s+(DEVELOPMENT\s+)?ENGINEER|SOFTWARE\s+DEVELOPER|SDE\b/, "Software Engineer"],
  [/MACHINE\s+LEARNING|ML\s+ENGINEER/, "Machine Learning Engineer"],
  [/DATA\s+SCIEN/, "Data Scientist"],
  [/DATA\s+ENGINEER/, "Data Engineer"],
  [/DATA\s+ANALYST/, "Data Analyst"],
  [/DEVOPS|SITE\s+RELIABILITY|SRE\b/, "DevOps Engineer"],
  [/(QA|QUALITY\s+ASSURANCE|TEST)\s+(ENGINEER|ANALYST)/, "QA Engineer"],
  [/PRODUCT\s+MANAGER/, "Product Manager"],
  [/PROJECT\s+MANAGER/, "Project Manager"],
  [/PROGRAM\s+MANAGER/, "Program Manager"],
  [/BUSINESS\s+ANALYST/, "Business Analyst"],
  [/FINANCIAL\s+ANALYST/, "Financial Analyst"],
  [/SOLUTIONS?\s+ARCHITECT/, "Solutions Architect"],
  [/CLOUD\s+(ENGINEER|ARCHITECT)/, "Cloud Engineer"],
  [/SECURITY\s+(ENGINEER|ANALYST)/, "Security Engineer"],
  [/NETWORK\s+ENGINEER/, "Network Engineer"],
  [/DATABASE\s+ADMIN/, "Database Administrator"],
  [/SYSTEMS?\s+(ENGINEER|ANALYST|ADMIN)/, "Systems Engineer"],
  [/FULL\s*STACK/, "Software Engineer"],
  [/FRONT\s*END|UI\s+(ENGINEER|DEVELOPER)/, "Frontend Engineer"],
  [/BACK\s*END/, "Backend Engineer"],
  [/MECHANICAL\s+ENGINEER/, "Mechanical Engineer"],
  [/ELECTRICAL\s+ENGINEER/, "Electrical Engineer"],
  [/CIVIL\s+ENGINEER/, "Civil Engineer"],
  [/PHYSICIAN|HOSPITALIST|INTERNAL\s+MEDICINE/, "Physician"],
  [/PHARMACIST/, "Pharmacist"],
  [/ACCOUNTANT|AUDITOR/, "Accountant / Auditor"],
  [/PROFESSOR|LECTURER|POSTDOC/, "Professor / Researcher"],
  [/CONSULTANT/, "Consultant"],
];

function normalizeTitle(raw: string): string | null {
  const t = raw.toUpperCase().trim();
  if (!t) return null;
  for (const [re, label] of TITLE_RULES) if (re.test(t)) return label;
  // Title-case fallback so the long tail still groups exact duplicates.
  return t
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .slice(0, 60);
}

/** Group major tech cities into the metro labels used in the UI. */
const METRO_RULES: [RegExp, string, string][] = [
  [/SAN FRANCISCO|SAN JOSE|SUNNYVALE|MOUNTAIN VIEW|PALO ALTO|MENLO PARK|CUPERTINO|SANTA CLARA|OAKLAND|FREMONT|REDWOOD/, "CA", "San Francisco Bay Area, CA"],
  [/SEATTLE|BELLEVUE|REDMOND|KIRKLAND/, "WA", "Seattle-Bellevue, WA"],
  [/NEW YORK|BROOKLYN|QUEENS|JERSEY CITY|NEWARK/, "NY|NJ", "New York City, NY"],
  [/AUSTIN|ROUND ROCK/, "TX", "Austin, TX"],
  [/DALLAS|PLANO|IRVING|FORT WORTH|FRISCO|RICHARDSON/, "TX", "Dallas-Fort Worth, TX"],
  [/HOUSTON/, "TX", "Houston, TX"],
  [/CHICAGO|NAPERVILLE|SCHAUMBURG/, "IL", "Chicago, IL"],
  [/BOSTON|CAMBRIDGE|WALTHAM/, "MA", "Boston, MA"],
  [/ATLANTA|ALPHARETTA/, "GA", "Atlanta, GA"],
  [/CHARLOTTE/, "NC", "Charlotte, NC"],
  [/PHOENIX|TEMPE|SCOTTSDALE|CHANDLER/, "AZ", "Phoenix, AZ"],
  [/LOS ANGELES|SANTA MONICA|IRVINE|PASADENA/, "CA", "Los Angeles, CA"],
  [/SAN DIEGO/, "CA", "San Diego, CA"],
  [/DENVER|BOULDER/, "CO", "Denver, CO"],
  [/WASHINGTON|ARLINGTON|RESTON|MCLEAN|HERNDON/, "DC|VA|MD", "Washington DC Metro"],
  [/DETROIT|DEARBORN|TROY/, "MI", "Detroit, MI"],
  [/MINNEAPOLIS|ST\.? PAUL/, "MN", "Minneapolis, MN"],
  [/PHILADELPHIA/, "PA", "Philadelphia, PA"],
  [/PORTLAND|HILLSBORO/, "OR", "Portland, OR"],
  [/RALEIGH|DURHAM|CARY/, "NC", "Raleigh-Durham, NC"],
];

function normalizeMetro(city: string, state: string): string {
  const c = city.toUpperCase().trim();
  const s = state.toUpperCase().trim();
  for (const [re, states, label] of METRO_RULES) {
    if (re.test(c) && states.split("|").includes(s)) return label;
  }
  const cityTc = c.toLowerCase().replace(/\b\w/g, (ch) => ch.toUpperCase());
  return `${cityTc}, ${s}`;
}

const WAGE_MULTIPLIER: Record<string, number> = {
  YEAR: 1,
  MONTH: 12,
  "BI-WEEKLY": 26,
  WEEK: 52,
  HOUR: 2080,
};

const LEVELS: Record<string, number> = { I: 1, II: 2, III: 3, IV: 4 };

function percentile(sorted: number[], p: number): number {
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  const v = sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
  return Math.round(v / 1000) * 1000;
}

/* -------------------------------- main ---------------------------------- */

async function processFile(
  path: string,
  groups: Map<string, number[]>,
  years: Set<number>
) {
  const rl = createInterface({
    input: createReadStream(path),
    crlfDelay: Infinity,
  });

  let header: string[] | null = null;
  let col: Record<string, number> = {};
  let pending = ""; // accumulates rows whose quoted fields span lines
  let count = 0;

  const need = (name: string, ...alts: string[]) => {
    for (const n of [name, ...alts]) {
      const i = header!.findIndex((h) => h.trim().toUpperCase() === n);
      if (i >= 0) return i;
    }
    throw new Error(`Column ${name} not found in ${path}`);
  };

  for await (const rawLine of rl) {
    pending = pending ? pending + "\n" + rawLine : rawLine;
    // A complete CSV record has an even number of quotes.
    if ((pending.match(/"/g)?.length ?? 0) % 2 !== 0) continue;
    const line = pending;
    pending = "";

    if (!header) {
      header = parseCsvLine(line);
      col = {
        status: need("CASE_STATUS"),
        title: need("JOB_TITLE"),
        city: need("WORKSITE_CITY"),
        state: need("WORKSITE_STATE"),
        wage: need("WAGE_RATE_OF_PAY_FROM"),
        unit: need("WAGE_UNIT_OF_PAY"),
        level: need("PW_WAGE_LEVEL"),
        fullTime: need("FULL_TIME_POSITION"),
        date: need("DECISION_DATE", "RECEIVED_DATE"),
      };
      continue;
    }

    const f = parseCsvLine(line);
    if (f.length < header.length - 2) continue;
    if (!/^certified/i.test(f[col.status] ?? "")) continue;
    if (!/^y/i.test(f[col.fullTime] ?? "")) continue;

    const level = LEVELS[(f[col.level] ?? "").trim().toUpperCase()];
    if (!level) continue;

    const unit = (f[col.unit] ?? "").trim().toUpperCase();
    const mult = WAGE_MULTIPLIER[unit];
    if (!mult) continue;
    const wage =
      parseFloat((f[col.wage] ?? "").replace(/[$,]/g, "")) * mult;
    if (!isFinite(wage) || wage < 20000 || wage > 1500000) continue;

    const year = new Date(f[col.date] ?? "").getFullYear();
    if (!year || year < 2000) continue;

    const title = normalizeTitle(f[col.title] ?? "");
    if (!title) continue;
    const metro = normalizeMetro(f[col.city] ?? "", f[col.state] ?? "");

    years.add(year);
    const key = JSON.stringify([title, metro, level, year]);
    (groups.get(key) ?? groups.set(key, []).get(key)!).push(wage);
    count++;
  }
  console.log(`${path}: ${count} certified full-time rows ingested`);
}

async function main() {
  const files = process.argv.slice(2);
  if (!files.length) {
    console.error(
      "Usage: npx tsx scripts/build-h1b-data.ts <lca-disclosure.csv> [...]"
    );
    process.exit(1);
  }

  const groups = new Map<string, number[]>();
  const years = new Set<number>();
  for (const f of files) await processFile(f, groups, years);

  const rows = Array.from(groups.entries())
    .filter(([, wages]) => wages.length >= MIN_GROUP_SIZE)
    .map(([key, wages]) => {
      const [title, metro, level, year] = JSON.parse(key) as [
        string,
        string,
        number,
        number,
      ];
      const sorted = wages.sort((a, b) => a - b);
      return {
        title,
        metro,
        level,
        year,
        p25: percentile(sorted, 0.25),
        p50: percentile(sorted, 0.5),
        p75: percentile(sorted, 0.75),
        n: wages.length,
      };
    })
    .sort((a, b) => b.n - a.n)
    .slice(0, MAX_ROWS);

  const summary = {
    lastUpdated: new Date().toISOString().slice(0, 10),
    source: "https://www.dol.gov/agencies/eta/foreign-labor/performance",
    sourceLabel: "US DOL OFLC LCA Disclosure Data (quarterly)",
    sample: false,
    notes:
      "Aggregated from certified full-time LCA filings. Salaries are annual base pay in USD. Wage level I-IV is a rough experience proxy. Cells with fewer than 10 filings are omitted.",
    years: Array.from(years).sort((a, b) => a - b),
    rows,
  };

  writeFileSync(OUT, JSON.stringify(summary, null, 1) + "\n");
  console.log(`Wrote ${rows.length} aggregate rows → ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
