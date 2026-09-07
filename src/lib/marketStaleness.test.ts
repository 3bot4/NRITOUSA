import { describe, it, expect } from "vitest";
import marketData from "../../data/market.json";
import { marketDataAgeDays, marketDataStale, tickerItems, usdInrCard } from "@/lib/market";

/**
 * The homepage ticker went 44 days stale on 2026-09-02 while every item still
 * reported stale=false, so it presented gold 8.4% below spot as a current
 * figure. Per-item `stale` is set by the pipeline only when THAT source fails
 * to fetch; it cannot describe a snapshot nobody refreshed. These tests pin the
 * whole-file guard that closes that gap.
 */
describe("market snapshot staleness", () => {
  const asOf = new Date(marketData.asOf);

  it("measures age against asOf, not the file mtime", () => {
    const twoDaysOn = new Date(asOf.getTime() + 2 * 86_400_000);
    expect(marketDataAgeDays(twoDaysOn)).toBeCloseTo(2, 5);
  });

  it("treats a fresh snapshot as current", () => {
    const sameDay = new Date(asOf.getTime() + 6 * 3_600_000);
    expect(marketDataStale(sameDay)).toBe(false);
  });

  it("flags a snapshot nobody refreshed", () => {
    const fourDaysOn = new Date(asOf.getTime() + 4 * 86_400_000);
    expect(marketDataStale(fourDaysOn)).toBe(true);

    // The exact scenario that shipped: 44 days with no refresh.
    const fortyFourDaysOn = new Date(asOf.getTime() + 44 * 86_400_000);
    expect(marketDataStale(fortyFourDaysOn)).toBe(true);
  });

  it("does not freeze at import time", () => {
    // The trap this guard exists to avoid: an age computed once at module
    // scope would be identical for every clock we hand it, and the homepage is
    // statically rendered, so it would report the data fresh forever.
    const early = marketDataAgeDays(new Date(asOf.getTime() + 86_400_000));
    const late = marketDataAgeDays(new Date(asOf.getTime() + 30 * 86_400_000));
    expect(late).toBeGreaterThan(early);
  });

  it("keeps the committed snapshot inside its own threshold", () => {
    // Guards the data, not the code: if this fails, market.json needs a refresh
    // (`node scripts/pipeline/fetch-market.mjs`), not a wider threshold.
    expect(marketDataAgeDays()).toBeLessThan(30);
  });

  it("only USD/INR from market.json actually reaches a page", () => {
    // Documents a trap found on 2026-09-02: marketTickerItem() is defined but
    // never called, and tickerItems() is entirely immigration data. gold,
    // nifty50 and sp500 sit in market.json and render NOWHERE. If this ever
    // fails because a ticker gained a market key, the staleness guard needs to
    // cover that surface too.
    const ticker = tickerItems();
    for (const key of ["gold", "nifty50", "sp500"]) {
      expect(ticker.find((t) => t.key === key)).toBeUndefined();
    }
  });

  it("marks the USD/INR card stale once the snapshot ages out", () => {
    // usdInrCard() is the ONE surface that puts market.json in front of a
    // reader, so it is the one the guard has to reach.
    const card = usdInrCard();
    expect(card.rate).toBeGreaterThan(0);

    const usdinr = marketData.items.find((i) => i.key === "usdinr");
    expect(usdinr).toBeDefined();
    // Fresh data + no per-item failure => not stale today.
    expect(card.stale).toBe(usdinr!.stale || marketDataStale());
  });
});
