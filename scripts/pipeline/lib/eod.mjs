/**
 * Generic end-of-day price fetcher for index/commodity items. Tries Stooq first
 * (the spec's named free, key-less EOD source) and falls back to Yahoo's public
 * chart endpoint. Returns only the latest value — day-over-day change is derived
 * by the orchestrator from the previous committed snapshot, so single-value
 * sources work fine. Throws only if EVERY source fails (caller marks it stale).
 */
import { fetchText, fetchJson, firstOk } from "./http.mjs";

/** Stooq light CSV: "Symbol,Date,Time,Open,High,Low,Close,Volume" (one row). */
async function fromStooq(symbol) {
  const url = `https://stooq.com/q/l/?s=${encodeURIComponent(
    symbol
  )}&f=sd2t2ohlcv&h&e=csv`;
  const csv = await fetchText(url);
  const rows = csv.trim().split(/\r?\n/);
  if (rows.length < 2) throw new Error("stooq: no data row");
  const close = rows[1].split(",")[6];
  const v = Number(close);
  if (!Number.isFinite(v) || v <= 0) throw new Error(`stooq: bad close "${close}"`);
  return { value: v, source: "Stooq EOD close" };
}

/**
 * Pull the latest price + the prior session's close out of a Yahoo chart JSON
 * payload. Returning `previous` lets the orchestrator show a true day-over-day
 * change instead of comparing against our last committed (possibly stale)
 * snapshot.
 */
function parseYahoo(j) {
  const r = j?.chart?.result?.[0];
  const closes = (r?.indicators?.quote?.[0]?.close ?? []).filter((x) =>
    Number.isFinite(x)
  );
  let v = r?.meta?.regularMarketPrice;
  if (!Number.isFinite(v)) v = closes.at(-1);
  if (!Number.isFinite(v)) throw new Error("yahoo: no price in response");
  // Prior close: Yahoo's own chartPreviousClose, else the second-to-last close.
  let previous = r?.meta?.chartPreviousClose;
  if (!Number.isFinite(previous)) previous = closes.length > 1 ? closes.at(-2) : undefined;
  return { value: v, previous };
}

const yahooChartUrl = (symbol) =>
  `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    symbol
  )}?interval=1d&range=5d`;

/** Yahoo chart endpoint — direct. meta.regularMarketPrice is the latest price. */
async function fromYahoo(symbol) {
  const { value, previous } = parseYahoo(await fetchJson(yahooChartUrl(symbol)));
  return { value, previous, source: "Yahoo Finance EOD" };
}

/**
 * Yahoo chart via the r.jina.ai read relay. Yahoo aggressively rate-limits
 * datacenter IPs (HTTP 429 from GitHub Actions / cloud), which previously froze
 * NIFTY 50 at a stale baseline. The keyless relay fetches from a non-blocked IP
 * and returns the page body; we slice out the embedded JSON object and parse it.
 */
async function fromYahooRelay(symbol) {
  const text = await fetchText(`https://r.jina.ai/${yahooChartUrl(symbol)}`, {
    timeoutMs: 25_000,
  });
  const a = text.indexOf("{");
  const b = text.lastIndexOf("}");
  if (a < 0 || b <= a) throw new Error("yahoo-relay: no JSON in response");
  const { value, previous } = parseYahoo(JSON.parse(text.slice(a, b + 1)));
  return { value, previous, source: "Yahoo Finance EOD" };
}

/** Try Stooq, then Yahoo direct, then Yahoo via the relay. */
export function fetchEod({ stooq, yahoo }) {
  return firstOk([
    { name: "Stooq", run: () => fromStooq(stooq) },
    { name: "Yahoo", run: () => fromYahoo(yahoo) },
    { name: "Yahoo-relay", run: () => fromYahooRelay(yahoo) },
  ]);
}
