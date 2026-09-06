/**
 * Source-of-truth data for /calculators/usd-inr-projection-send-now-or-wait.
 *
 * Three kinds of numbers live here and they age differently:
 *
 *  1. FX_USDINR — today's spot rate. Hand-set (see the TODO below).
 *  2. USD_INR_YEAR_END — settled history. Only ever appended to.
 *  3. BANK_FORECASTS — published third-party forecasts. These go stale fast
 *     and every row carries its own source + date so a reader can check it.
 *
 * Nothing in the page component may hardcode a rate, a forecast or a date —
 * import it from here (see CLAUDE.md, "Verified-numbers system").
 */

/* ────────────────────────── spot rate ────────────────────────── */

/**
 * TODO(fx-feed): replace this constant with a read from `data/market.json`
 * via `usdInrCard()` in src/lib/market.ts, which the homepage ticker already
 * uses. Until that's wired, this hand-set value and the homepage can disagree
 * — market.json carried 94.95 (fetched 2026-09-02) when this was set.
 *
 * The hero figure, the calculator's default rate, the chart start point and
 * the "today" marker on every chart all read from this one constant.
 */
export const FX_USDINR = 94.66;

/** ISO date FX_USDINR was taken. Rendered wherever the rate is shown. */
export const FX_USDINR_AS_OF = "2026-09-06";

/* ──────────────────────── 20-year history ──────────────────────── */

export interface YearEndRate {
  year: number;
  rate: number;
  /** Set on the current, incomplete year so the chart can label it. */
  partial?: boolean;
}

/**
 * Year-end USD/INR, 2006–2025, from the Federal Reserve H.10 release
 * (FRED series DEXINUS — the same series scripts/pipeline/sources/usdinr.mjs
 * uses as a fallback). Each value is the last published rate of that calendar
 * year; where 31 December was a holiday the last trading day is used
 * (2010 → 30 Dec, 2021 → 30 Dec).
 *
 * 2026 is the live spot rate, not a year-end close — flagged `partial`.
 */
export const USD_INR_YEAR_END: YearEndRate[] = [
  { year: 2006, rate: 44.11 },
  { year: 2007, rate: 39.41 },
  { year: 2008, rate: 48.58 },
  { year: 2009, rate: 46.4 },
  { year: 2010, rate: 44.8 },
  { year: 2011, rate: 53.01 },
  { year: 2012, rate: 54.86 },
  { year: 2013, rate: 61.92 },
  { year: 2014, rate: 63.04 },
  { year: 2015, rate: 66.19 },
  { year: 2016, rate: 67.92 },
  { year: 2017, rate: 63.83 },
  { year: 2018, rate: 69.58 },
  { year: 2019, rate: 71.36 },
  { year: 2020, rate: 73.01 },
  { year: 2021, rate: 74.39 },
  { year: 2022, rate: 82.72 },
  { year: 2023, rate: 83.19 },
  { year: 2024, rate: 85.55 },
  { year: 2025, rate: 89.84 },
  { year: 2026, rate: FX_USDINR, partial: true },
];

export const HISTORY_SOURCE =
  "Federal Reserve H.10 / FRED series DEXINUS (year-end closes)";

export const HISTORY_SOURCE_URL = "https://fred.stlouisfed.org/series/DEXINUS";

/* ───────────────────────── scenarios ───────────────────────── */

export interface FxScenario {
  key: string;
  label: string;
  /** Annual USD/INR drift. Positive = rupee weakens (more rupees per dollar). */
  driftPct: number;
  blurb: string;
  /** Tailwind stroke/text colour token used across all four charts. */
  color: string;
}

/**
 * Four paths, deliberately spanning the full spread of published views rather
 * than clustering around one house call. `driftPct` for "historical" is the
 * measured 2006→2026 CAGR, not a round number — see driftCagr() in
 * src/lib/calc/usdInrTiming.ts, which recomputes it from USD_INR_YEAR_END and
 * is checked against this value by a test.
 */
export const FX_SCENARIOS: FxScenario[] = [
  {
    key: "hold",
    label: "RBI holds the line",
    driftPct: 0,
    blurb:
      "The Reserve Bank keeps selling dollars in the spot and forward markets and the rate goes essentially sideways. The RBI spent more than $15bn defending the rupee in 2026 and has intervened almost daily.",
    color: "#0ea5e9",
  },
  {
    key: "historical",
    label: "Historical drift (3.9%/yr)",
    driftPct: 3.9,
    blurb:
      "The rupee keeps sliding at exactly the pace it has averaged since 2006. Note this is more bearish for the rupee than any current bank forecast — history has been a harsher judge than today's analysts.",
    color: "#1e40f5",
  },
  {
    key: "oilshock",
    label: "Oil shock / faster slide",
    driftPct: 6.5,
    blurb:
      "Crude stays high, foreign investors keep pulling money out, and the Fed stays restrictive. India imports roughly 89% of its crude, so an oil spike goes almost straight through to the rupee.",
    color: "#e11d48",
  },
  {
    key: "recovery",
    label: "Rupee recovers",
    driftPct: -2.5,
    blurb:
      "Oil moderates, the Fed cuts, and capital flows back into Indian assets. This is roughly the path Crédit Agricole publishes: 96 by end-2026, then down to 92 through 2027.",
    color: "#059669",
  },
];

/** Scenario selected on first paint — the measured historical drift. */
export const DEFAULT_SCENARIO = "historical";

/* ─────────────────────── bank forecasts ─────────────────────── */

export interface BankForecast {
  bank: string;
  /** USD/INR forecast, or null where the bank has not published that horizon. */
  end2026: number | null;
  mid2027: number | null;
  end2027: number | null;
  note: string;
  /** Where the figure was reported, and when. */
  source: string;
  sourceUrl: string;
  reportedOn: string;
}

/**
 * Published bank targets, as reported by Exchange Rates UK's forecast survey
 * coverage. These are second-hand: the figures are attributed to the banks by
 * that publication, not read off each bank's own research note — the table
 * says so in the page copy, and every row links to the report it came from.
 *
 * TODO(forecast-refresh): re-check every row each quarter; bank FX targets are
 * revised constantly and a stale table is worse than no table. Bump
 * FORECAST_UPDATED when you do.
 */
export const BANK_FORECASTS: BankForecast[] = [
  {
    bank: "Crédit Agricole",
    end2026: 96,
    mid2027: 94,
    end2027: 92,
    note: "Sees a near-term dollar rebound, then a delayed rupee recovery through 2027 — the most bullish major-bank path for the rupee.",
    source: "Exchange Rates UK",
    sourceUrl:
      "https://www.exchangerates.org.uk/news/47106/2026-09-05-us-dollar-to-rupee-forecast-2027-bank-targets-inr-recovery-to-92.html",
    reportedOn: "2026-09-05",
  },
  {
    bank: "MUFG",
    end2026: 95.5,
    mid2027: 95,
    end2027: 96,
    note: "Expects RBI-supported stability into 2027, then the pair turning higher again if oil or US yields regain momentum.",
    source: "Exchange Rates UK",
    sourceUrl:
      "https://www.exchangerates.org.uk/news/46566/2026-07-20-mufg-us-dollar-to-indian-rupee-forecast-usd-inr-seen-at-95-00-by-mid-2027.html",
    reportedOn: "2026-07-20",
  },
  {
    bank: "Barclays",
    end2026: 96.8,
    mid2027: null,
    end2027: null,
    note: "The most bearish end-2026 call in the survey, citing the rupee's exposure to oil shocks and balance-of-payments pressure.",
    source: "Exchange Rates UK forecast survey",
    sourceUrl:
      "https://www.exchangerates.org.uk/news/46256/2026-06-21-us-dollar-to-rupee-forecast-2026-2028-latest-survey-signals-stable-near-term-outlook.html",
    reportedOn: "2026-06-21",
  },
  {
    bank: "Goldman Sachs",
    end2026: 96,
    mid2027: 96,
    end2027: null,
    note: "Sits in the middle of the pack, seeing the pair holding close to current levels in a 95–97 range.",
    source: "Exchange Rates UK forecast survey",
    sourceUrl:
      "https://www.exchangerates.org.uk/news/46256/2026-06-21-us-dollar-to-rupee-forecast-2026-2028-latest-survey-signals-stable-near-term-outlook.html",
    reportedOn: "2026-06-21",
  },
  {
    bank: "SEB",
    end2026: null,
    mid2027: null,
    end2027: 92,
    note: "One of the rupee bulls in the survey, with projections falling into the low 90s.",
    source: "Exchange Rates UK forecast survey",
    sourceUrl:
      "https://www.exchangerates.org.uk/news/46256/2026-06-21-us-dollar-to-rupee-forecast-2026-2028-latest-survey-signals-stable-near-term-outlook.html",
    reportedOn: "2026-06-21",
  },
];

/**
 * The most rupee-positive view in the same survey is Westpac's, which sees
 * USD/INR below 90 by 2028 — beyond this table's furthest column, so it is
 * quoted in the section prose rather than given a misattributed 2027 row.
 * Source: https://www.exchangerates.org.uk/news/46012/2026-05-26-us-dollar-to-indian-rupee-forecast-survey-2026-2028-usd-inr-to-fall-despite-record-highs.html
 */
export const WESTPAC_2028 = {
  bank: "Westpac",
  level: 90,
  horizon: "2028",
  sourceUrl:
    "https://www.exchangerates.org.uk/news/46012/2026-05-26-us-dollar-to-indian-rupee-forecast-survey-2026-2028-usd-inr-to-fall-despite-record-highs.html",
  reportedOn: "2026-05-26",
};

/** Shown as the "updated" stamp above the bank forecast table. */
export const FORECAST_UPDATED = "2026-09-06";

/**
 * A cautionary data point, not a forecast: a Reuters poll of 27 strategists in
 * early February 2026 put the rupee at 90.63 by end-July 2026. It actually
 * traded near 95.4. Used in the "can anyone predict this?" section — the whole
 * point of the page is that a consensus of professionals missed by ~5%.
 */
export const FAILED_FORECAST = {
  pollDate: "February 2026",
  strategists: 27,
  predictedFor: "end-July 2026",
  predicted: 90.63,
  actual: 95.4,
};

/* ─────────────────────── rupee drivers ─────────────────────── */

export interface RupeeDriver {
  key: string;
  label: string;
  /** "weakens" pushes USD/INR up; "supports" pulls it down. */
  effect: "weakens" | "supports";
  detail: string;
}

/** Feeds the "Why is the rupee falling?" SVG diagram and the prose beneath it. */
export const RUPEE_DRIVERS: RupeeDriver[] = [
  {
    key: "oil",
    label: "Oil imports",
    effect: "weakens",
    detail:
      "India imports close to 89% of the crude it burns. Every rise in the oil price widens the import bill, which means Indian buyers must sell rupees to buy the dollars that pay for it.",
  },
  {
    key: "rates",
    label: "Fed vs RBI rates",
    effect: "weakens",
    detail:
      "When US rates stay high relative to India's, holding dollars pays better relative to the risk, and global money parks in Treasuries instead of Indian assets.",
  },
  {
    key: "flows",
    label: "Foreign investor flows",
    effect: "weakens",
    detail:
      "Foreign investors pulled roughly ₹2.29 lakh crore out of Indian equities in 2026 — already more than the ₹1.66 lakh crore they withdrew in all of 2025. Selling Indian shares means selling rupees.",
  },
  {
    key: "services",
    label: "Services exports & remittances",
    effect: "supports",
    detail:
      "India's IT and services surplus plus money sent home by NRIs keeps the current account deficit near 1% of GDP. This is the quiet force stopping the rupee from falling much faster.",
  },
  {
    key: "rbi",
    label: "RBI intervention",
    effect: "supports",
    detail:
      "The Reserve Bank sells dollars from its reserves to slow the fall — over $15bn in 2026, almost daily, across spot and forward markets. Traders read it as managing the pace, not defending a fixed line.",
  },
];

/* ─────────────────────── citation badges ─────────────────────── */

const END_2026_VALUES = BANK_FORECASTS.map((f) => f.end2026).filter(
  (v): v is number => v !== null
);

const HISTORICAL_DRIFT = FX_SCENARIOS.filter((s) => s.key === "historical")[0];

/**
 * Header badges for the page. The tool template's default set is generic
 * marketing copy ("60-second check", "No signup"); this page is written to be
 * cited, so the badges carry dated facts instead. Built from the constants
 * above so they can never drift from the page body.
 */
const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** "2026-09-06" → "6 Sep 2026". Badges are too narrow for an ISO date. */
function shortDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${Number(d)} ${MONTHS_SHORT[Number(m) - 1]} ${y}`;
}

export const CITATION_BADGES: string[] = [
  `₹${FX_USDINR.toFixed(2)} · ${shortDate(FX_USDINR_AS_OF)}`,
  `${HISTORICAL_DRIFT ? HISTORICAL_DRIFT.driftPct.toFixed(1) : "—"}%/yr since ${USD_INR_YEAR_END[0].year}`,
  `Banks: ₹${Math.min.apply(null, END_2026_VALUES).toFixed(2)}–₹${Math.max
    .apply(null, END_2026_VALUES)
    .toFixed(2)} end-2026`,
  "Every figure dated & sourced",
];
