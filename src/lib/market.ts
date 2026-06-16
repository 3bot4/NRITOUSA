/**
 * Typed access for the homepage data-dense layout (ticker strip + USD/INR
 * sidebar card + "next visa bulletin" countdown).
 *
 * The four MARKET items (USD/INR, NIFTY 50, S&P 500, Gold) come from the static
 * /data/market.json file, which the daily Phase-2 pipeline overwrites. The fifth
 * ticker item — the EB-2 India Final Action Date — is derived here from the SAME
 * visa-bulletin data the green-card estimator uses (lib/visa-bulletin), so there
 * is exactly one parser for bulletin data. Nothing in this module calls a network
 * API; it reads committed JSON only.
 */

import marketData from "../../data/market.json";
import config from "../../data/homepage-config.json";
import i485Inventory from "../../data/i485-inventory/current.json";
import processingTimes from "../../data/processing-times.json";
import h1bTimeline from "../../data/h1b-lottery-timeline.json";
import {
  getCutoffs,
  getSeries,
  formatCutoff,
  monthIndex,
  bulletin,
} from "@/lib/visa-bulletin";

/* ------------------------------- market items ------------------------------ */

export interface MarketItem {
  key: string;
  label: string;
  value: number;
  previous: number;
  changePct: number;
  unit: string;
  decimals: number;
  source: string;
  fetchedAt: string;
  stale?: boolean;
}

const marketItems = marketData.items as MarketItem[];

export const marketAsOfLabel: string = marketData.asOfLabel;

/** Sources backing the four market items, de-duplicated, for the attribution line. */
export const marketSources: string[] = Array.from(
  new Set(marketItems.map((i) => i.source))
);

/** Format a market value with its unit + decimals (e.g. ₹85.62, 24,850). */
export function formatMarketValue(item: MarketItem): string {
  const num = item.value.toLocaleString("en-US", {
    minimumFractionDigits: item.decimals,
    maximumFractionDigits: item.decimals,
  });
  return `${item.unit}${num}`;
}

/* ------------------------ ticker (5 items, ordered) ------------------------ */

export type TickerKind = "market" | "differentiator";

export interface TickerItem {
  key: string;
  label: string;
  /** Pre-formatted display value (e.g. "₹85.62" or "Sep 2013"). */
  display: string;
  /** Pre-formatted change badge text (e.g. "+0.16%" or "+1 mo this bulletin"). */
  change: string;
  /** Direction drives the green/red/neutral styling. */
  direction: "up" | "down" | "flat";
  kind: TickerKind;
  /** Destination the ticker cell links to (rendered as an anchor). */
  href: string;
  stale?: boolean;
}

/** Where each ticker item links to, keyed by its `key`. */
const tickerHref: Record<string, string> = {
  usdinr: "/calculators/remittance-tcs",
  // The investing guide lives at /topics/investing (there is no /guides route).
  nifty50: "/topics/investing",
  sp500: "/topics/investing",
  gold: "/topics/investing",
  eb1india: "/tools/priority-date-checker",
  eb2india: "/tools/priority-date-checker",
  eb3india: "/tools/priority-date-checker",
};

/** EB-2 India Final Action Date, derived from the visa-bulletin data. */
export function eb2IndiaFad(): { fad: string; display: string } {
  const { fad } = getCutoffs("eb2", "india");
  return { fad, display: formatCutoff(fad) };
}

function ebIndiaLastMove(category: "eb1" | "eb2" | "eb3"): number | null {
  const series = getSeries(category, "india");
  if (!series || series.fad.length < 2) return null;
  const pts = series.fad;
  const [, last] = pts[pts.length - 1];
  const [, prev] = pts[pts.length - 2];
  if (last === "C" || prev === "C") return null;
  return monthIndex(last) - monthIndex(prev);
}

function ebIndiaTickerItem(
  category: "eb1" | "eb2" | "eb3",
  key: string,
  label: string
): TickerItem {
  const { fad } = getCutoffs(category, "india");
  const display = formatCutoff(fad);
  const move = ebIndiaLastMove(category);
  let change = "FAD";
  let direction: TickerItem["direction"] = "flat";
  if (fad === "C") {
    change = "Current";
    direction = "up";
  } else if (move !== null) {
    if (move > 0.5) {
      direction = "up";
      change = `+${Math.round(move)} mo`;
    } else if (move < -0.5) {
      direction = "down";
      change = `${Math.round(move)} mo`;
    } else {
      change = "No change";
    }
  }
  return {
    key,
    label,
    display,
    change,
    direction,
    kind: "differentiator",
    href: tickerHref[key] ?? "/tools/priority-date-checker",
  };
}

function marketTickerItem(item: MarketItem): TickerItem {
  const direction =
    item.changePct > 0.005 ? "up" : item.changePct < -0.005 ? "down" : "flat";
  const sign = item.changePct > 0 ? "+" : "";
  return {
    key: item.key,
    label: item.label,
    display: formatMarketValue(item),
    change: `${sign}${item.changePct.toFixed(2)}%`,
    direction,
    kind: "market",
    href: tickerHref[item.key] ?? "/tools",
    stale: item.stale,
  };
}

/* -------------------- immigration-specific ticker items ------------------- */

/** Days until the next Visa Bulletin — "Next Bulletin: 29 days · Jul 15". */
function nextBulletinTickerItem(): TickerItem | null {
  const nb = nextBulletin();
  if (!nb) return null;
  return {
    key: "nextbulletin",
    label: "Next Bulletin",
    display: nb.days === 0 ? "Today!" : `${nb.days}d · ${nb.label}`,
    change: nb.days <= 3 ? "releasing soon" : "State Dept",
    direction: nb.days <= 7 ? "up" : "flat",
    kind: "differentiator",
    href: "/visa-bulletin",
  };
}

/** Total I-485 employment-based pending cases. */
function i485BacklogTickerItem(): TickerItem {
  const total = (i485Inventory as { overallTotal: number }).overallTotal;
  const display = total >= 1_000_000
    ? `${(total / 1_000_000).toFixed(1)}M`
    : `${Math.round(total / 1000)}K`;
  return {
    key: "i485backlog",
    label: "I-485 Backlog",
    display,
    change: "pending cases",
    direction: "down",
    kind: "differentiator",
    href: "/tools/green-card-tracker",
  };
}

/**
 * EB-2 India date gap: years between today and the current FAD.
 * E.g. FAD = Sep 2013, today = Jun 2026 → "13 yrs behind".
 */
function eb2GapTickerItem(): TickerItem {
  const { fad } = getCutoffs("eb2", "india");
  let display = "Current";
  let change = "no backlog";
  let direction: TickerItem["direction"] = "up";
  if (fad !== "C") {
    const fadYear = parseInt(fad.slice(0, 4), 10);
    const todayYear = new Date().getFullYear();
    const gap = todayYear - fadYear;
    display = `${gap} yr gap`;
    change = "EB-2 India behind";
    direction = "down";
  }
  return {
    key: "eb2gap",
    label: "EB-2 India",
    display,
    change,
    direction,
    kind: "differentiator",
    href: "/tools/green-card-tracker",
  };
}

/** H-1B lottery odds from the most recent cycle with real data. */
function h1bOddsTickerItem(): TickerItem {
  type Cycle = { fiscalYear: number; registrations: number | null; selected: number | null };
  const cycles = (h1bTimeline as { cycles: Cycle[] }).cycles;
  const latest = cycles.find((c) => c.registrations && c.selected);
  if (!latest?.registrations || !latest?.selected) {
    return {
      key: "h1bodds",
      label: "H-1B Lottery",
      display: "~85K cap",
      change: "annual",
      direction: "flat",
      kind: "market",
      href: "/tools/h1b-lottery-timeline",
    };
  }
  const pct = Math.round((latest.selected / latest.registrations) * 100);
  return {
    key: "h1bodds",
    label: "H-1B Lottery",
    display: `~${pct}% odds`,
    change: `FY ${latest.fiscalYear}`,
    direction: pct < 30 ? "down" : pct > 50 ? "up" : "flat",
    kind: "market",
    href: "/tools/h1b-lottery-timeline",
  };
}

/** One processing-time ticker item pulled from processing-times.json by form prefix. */
function processingTimeTickerItem(
  formPrefix: string,
  key: string,
  label: string,
  href: string
): TickerItem | null {
  type PTItem = { item: string; typical: string };
  type Group = { items: PTItem[] };
  const groups = (processingTimes as { groups: Group[] }).groups;
  for (const g of groups) {
    const row = g.items.find((r) => r.item.startsWith(formPrefix));
    if (row) {
      return {
        key,
        label,
        display: row.typical,
        change: "processing time",
        direction: "flat",
        kind: "market",
        href,
      };
    }
  }
  return null;
}

/** All ticker items in display order. */
export function tickerItems(): TickerItem[] {
  const items: TickerItem[] = [
    // Market prices
    ...marketItems.map(marketTickerItem),
    // EB priority dates
    ebIndiaTickerItem("eb1", "eb1india", "EB-1 India"),
    ebIndiaTickerItem("eb2", "eb2india", "EB-2 India"),
    ebIndiaTickerItem("eb3", "eb3india", "EB-3 India"),
    // Immigration intelligence
    eb2GapTickerItem(),
    i485BacklogTickerItem(),
    h1bOddsTickerItem(),
  ];

  // Next bulletin (null if schedule exhausted)
  const nb = nextBulletinTickerItem();
  if (nb) items.push(nb);

  // Processing times
  const pt = [
    processingTimeTickerItem("I-485", "pt-i485", "I-485", "/tools/processing-times"),
    processingTimeTickerItem("I-140", "pt-i140", "I-140", "/tools/processing-times"),
    processingTimeTickerItem("I-765", "pt-ead",  "EAD",   "/tools/processing-times"),
    processingTimeTickerItem("I-131", "pt-ap",   "Adv. Parole", "/tools/processing-times"),
  ];
  for (const p of pt) if (p) items.push(p);

  return items;
}

/* --------------------------- USD/INR sidebar card -------------------------- */

interface HistoryPoint {
  date: string;
  value: number;
}

export interface UsdInrCard {
  rate: number;
  changePct: number;
  direction: "up" | "down" | "flat";
  /** {month,value} points shaped for the shared <Sparkline> component. */
  spark: { month: string; value: number | null }[];
  high: number;
  low: number;
  rangeLabel: string;
  stale?: boolean;
}

export function usdInrCard(): UsdInrCard {
  const item = marketItems.find((i) => i.key === "usdinr")!;
  const history = (marketData.usdinrHistory as HistoryPoint[]) ?? [];

  // Use the trailing 30 calendar days of history; show whatever range exists.
  const values = history.map((p) => p.value);
  const high = values.length ? Math.max(...values) : item.value;
  const low = values.length ? Math.min(...values) : item.value;

  const spanDays = history.length
    ? Math.round(
        (Date.parse(history[history.length - 1].date) -
          Date.parse(history[0].date)) /
          86_400_000
      )
    : 0;
  const rangeLabel = spanDays >= 28 ? "30-day range" : `${spanDays}-day range`;

  return {
    rate: item.value,
    changePct: item.changePct,
    direction:
      item.changePct > 0.005 ? "up" : item.changePct < -0.005 ? "down" : "flat",
    spark: history.map((p) => ({ month: p.date, value: p.value })),
    high,
    low,
    rangeLabel,
    stale: item.stale,
  };
}

/* ------------------------------ NRE FD config ------------------------------ */

export interface NreFd {
  rate: number;
  bank: string;
  tenor: string;
  updated: string;
  source: string;
}

export const nreFd = config.nreFd as NreFd;

/* --------------------------- next visa bulletin ---------------------------- */

/**
 * Days until the next Visa Bulletin release, computed from the manually-kept
 * schedule in homepage-config.json. Picks the first scheduled date strictly
 * after `today` (defaults to now). Returns null if the schedule is exhausted —
 * the UI then falls back to a generic prompt rather than a stale number.
 */
export function nextBulletin(
  today: Date = new Date()
): { date: string; label: string; days: number } | null {
  const releases = (config.bulletinReleases as string[]) ?? [];
  const t = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate()
  );
  for (const iso of releases) {
    const [y, m, d] = iso.split("-").map(Number);
    const rel = Date.UTC(y, m - 1, d);
    if (rel >= t) {
      const days = Math.round((rel - t) / 86_400_000);
      return {
        date: iso,
        label: new Date(rel).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        }),
        days,
      };
    }
  }
  return null;
}

/** Current bulletin month label, e.g. "June 2026", for context lines. */
export function currentBulletinLabel(): string {
  const [y, m] = bulletin.month.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
