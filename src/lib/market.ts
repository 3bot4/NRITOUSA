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
  eb2india: "/tools/green-card-tracker",
};

/** EB-2 India Final Action Date, derived from the visa-bulletin data. */
export function eb2IndiaFad(): { fad: string; display: string } {
  const { fad } = getCutoffs("eb2", "india");
  return { fad, display: formatCutoff(fad) };
}

/**
 * Movement of the EB-2 India FAD at the most recent bulletin, in cutoff-months
 * (positive = advanced forward, negative = retrogressed, 0 = held). Null when
 * there isn't enough history.
 */
function eb2IndiaLastMove(): number | null {
  const series = getSeries("eb2", "india");
  if (!series || series.fad.length < 2) return null;
  const pts = series.fad;
  const [, last] = pts[pts.length - 1];
  const [, prev] = pts[pts.length - 2];
  if (last === "C" || prev === "C") return null;
  return monthIndex(last) - monthIndex(prev);
}

function eb2TickerItem(): TickerItem {
  const { display } = eb2IndiaFad();
  const move = eb2IndiaLastMove();
  let change = "Final Action Date";
  let direction: TickerItem["direction"] = "flat";
  if (move !== null) {
    if (move > 0.5) {
      direction = "up";
      change = `+${Math.round(move)} mo this bulletin`;
    } else if (move < -0.5) {
      direction = "down";
      change = `${Math.round(move)} mo (retrogressed)`;
    } else {
      change = "No change this bulletin";
    }
  }
  return {
    key: "eb2india",
    label: "EB-2 India",
    display,
    change,
    direction,
    kind: "differentiator",
    href: tickerHref.eb2india,
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

/** The exactly-five ticker items, in display order. */
export function tickerItems(): TickerItem[] {
  return [...marketItems.map(marketTickerItem), eb2TickerItem()];
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
