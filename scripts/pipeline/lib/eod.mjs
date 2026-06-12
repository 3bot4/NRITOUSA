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

/** Yahoo chart endpoint — meta.regularMarketPrice is the latest close/price. */
async function fromYahoo(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    symbol
  )}?interval=1d&range=5d`;
  const j = await fetchJson(url);
  const r = j?.chart?.result?.[0];
  let v = r?.meta?.regularMarketPrice;
  if (!Number.isFinite(v)) {
    const closes = (r?.indicators?.quote?.[0]?.close ?? []).filter((x) =>
      Number.isFinite(x)
    );
    v = closes.at(-1);
  }
  if (!Number.isFinite(v)) throw new Error("yahoo: no price in response");
  return { value: v, source: "Yahoo Finance EOD" };
}

/** Try Stooq then Yahoo for a symbol pair. */
export function fetchEod({ stooq, yahoo }) {
  return firstOk([
    { name: "Stooq", run: () => fromStooq(stooq) },
    { name: "Yahoo", run: () => fromYahoo(yahoo) },
  ]);
}
