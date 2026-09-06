import { describe, expect, it } from "vitest";
import {
  blendedRate,
  breakEvenDriftBillPct,
  breakEvenDriftPct,
  compareTiming,
  driftCagr,
  projectRate,
  sensitivity,
  SPLIT_PLANS,
  validateTiming,
  waitingCostGrid,
  type TimingInput,
} from "./usdInrTiming";
import {
  FX_SCENARIOS,
  USD_INR_YEAR_END,
} from "@/data/usdInrForecastData";

const base: TimingInput = {
  mode: "send",
  amountUsd: 10_000,
  billInr: 1_000_000,
  spot: 94.66,
  driftPct: 3.9,
  waitMonths: 12,
  usRatePct: 4,
  indiaRatePct: 7.25,
};

describe("projectRate", () => {
  it("compounds annually and returns spot at month 0", () => {
    expect(projectRate(94.66, 3.9, 0)).toBe(94.66);
    expect(projectRate(94.66, 3.9, 12)).toBeCloseTo(98.35, 2);
  });

  it("handles a strengthening rupee", () => {
    expect(projectRate(94.66, -2.5, 12)).toBeCloseTo(92.29, 2);
  });

  it("never returns NaN or Infinity for junk input", () => {
    expect(projectRate(0, 5, 12)).toBe(0);
    expect(Number.isFinite(projectRate(94.66, -100, 12))).toBe(true);
  });
});

describe("breakEvenDriftPct", () => {
  it("is covered interest parity, independent of horizon", () => {
    // (1.0725 / 1.04) - 1 = 3.125%
    expect(breakEvenDriftPct(7.25, 4)).toBeCloseTo(3.125, 3);
  });

  it("is zero when both sides pay the same", () => {
    expect(breakEvenDriftPct(5, 5)).toBeCloseTo(0, 10);
  });

  it("goes negative when US rates beat Indian rates", () => {
    expect(breakEvenDriftPct(3, 6)).toBeLessThan(0);
  });
});

describe("breakEvenDriftBillPct", () => {
  it("is negative — waiting on a rupee bill wins unless the rupee rallies", () => {
    expect(breakEvenDriftBillPct(4)).toBeCloseTo(-3.846, 3);
  });
});

describe("compareTiming — send mode", () => {
  it("ties exactly at the break-even drift, at any horizon", () => {
    const drift = breakEvenDriftPct(base.indiaRatePct, base.usRatePct);
    for (const waitMonths of [3, 12, 24]) {
      const r = compareTiming({ ...base, driftPct: drift, waitMonths });
      expect(r.advantage).toBeCloseTo(0, 6);
      expect(r.verdict).toBe("tossup");
    }
  });

  it("says send when the rupee holds", () => {
    const r = compareTiming({ ...base, driftPct: 0 });
    expect(r.verdict).toBe("send");
    expect(r.advantage).toBeLessThan(0);
  });

  it("says wait when the rupee slides faster than break-even", () => {
    const r = compareTiming({ ...base, driftPct: 6.5 });
    expect(r.verdict).toBe("wait");
    expect(r.advantage).toBeGreaterThan(0);
  });

  it("is a no-op at a zero-month wait", () => {
    const r = compareTiming({ ...base, waitMonths: 0 });
    expect(r.sendNowInr).toBeCloseTo(r.waitInr, 6);
    expect(r.rateAtWait).toBe(base.spot);
    expect(r.verdict).toBe("tossup");
  });

  it("break-even rate is the rate that makes the two paths tie", () => {
    const r = compareTiming(base);
    const tied = compareTiming({
      ...base,
      driftPct: (Math.pow(r.breakEvenRate / base.spot, 1 / r.years) - 1) * 100,
    });
    expect(tied.advantage).toBeCloseTo(0, 6);
  });

  it("scales linearly with the amount sent", () => {
    const a = compareTiming(base);
    const b = compareTiming({ ...base, amountUsd: base.amountUsd * 3 });
    expect(b.advantage).toBeCloseTo(a.advantage * 3, 6);
    expect(b.advantagePct).toBeCloseTo(a.advantagePct, 8);
  });
});

describe("compareTiming — bill mode", () => {
  const bill: TimingInput = { ...base, mode: "bill" };

  it("prices the bill at spot today", () => {
    const r = compareTiming({ ...bill, waitMonths: 0 });
    expect(r.sendNowUsd).toBeCloseTo(1_000_000 / 94.66, 6);
  });

  it("ignores the Indian deposit rate entirely", () => {
    const a = compareTiming({ ...bill, indiaRatePct: 0 });
    const b = compareTiming({ ...bill, indiaRatePct: 15 });
    expect(a.advantage).toBeCloseTo(b.advantage, 10);
  });

  it("favours waiting even when the rupee is flat, because dollars earn", () => {
    const r = compareTiming({ ...bill, driftPct: 0 });
    expect(r.verdict).toBe("wait");
  });

  it("flips to send only when the rupee rallies past the bill break-even", () => {
    const be = breakEvenDriftBillPct(bill.usRatePct);
    expect(compareTiming({ ...bill, driftPct: be - 2 }).verdict).toBe("send");
    expect(compareTiming({ ...bill, driftPct: be }).advantage).toBeCloseTo(0, 6);
  });
});

describe("sensitivity", () => {
  it("brackets the projection and keeps the middle row on the projected rate", () => {
    const rows = sensitivity(base, 2);
    const centre = compareTiming(base);
    expect(rows).toHaveLength(3);
    expect(rows[1].rate).toBeCloseTo(centre.rateAtWait, 6);
    expect(rows[0].rate).toBeCloseTo(centre.rateAtWait - 2, 6);
    expect(rows[2].rate).toBeCloseTo(centre.rateAtWait + 2, 6);
  });

  it("a weaker rupee always helps the waiter", () => {
    const rows = sensitivity(base, 2);
    expect(rows[2].advantage).toBeGreaterThan(rows[0].advantage);
  });

  it("never produces a negative projected rate", () => {
    const rows = sensitivity({ ...base, spot: 1, driftPct: -90 }, 2);
    for (const r of rows) expect(r.rate).toBeGreaterThan(0);
  });
});

describe("waitingCostGrid", () => {
  it("returns one series per scenario and one cell per horizon", () => {
    const grid = waitingCostGrid(base, FX_SCENARIOS, [3, 6, 12, 24]);
    expect(grid).toHaveLength(FX_SCENARIOS.length);
    for (const s of grid) {
      expect(s.cells.map((c) => c.months)).toEqual([3, 6, 12, 24]);
      for (const c of s.cells) expect(Number.isFinite(c.advantage)).toBe(true);
    }
  });

  it("the faster the slide, the better waiting looks at every horizon", () => {
    const grid = waitingCostGrid(base, [
      { key: "slow", driftPct: 0 },
      { key: "fast", driftPct: 8 },
    ]);
    for (let i = 0; i < grid[0].cells.length; i++) {
      expect(grid[1].cells[i].advantage).toBeGreaterThan(
        grid[0].cells[i].advantage
      );
    }
  });
});

describe("blendedRate", () => {
  it("equals spot for a send-it-all-now plan", () => {
    expect(blendedRate(94.66, 3.9, SPLIT_PLANS.now)).toBeCloseTo(94.66, 6);
  });

  it("sits between the first and last tranche rate when the rupee slides", () => {
    const r = blendedRate(94.66, 3.9, SPLIT_PLANS.thirds);
    expect(r).toBeGreaterThan(94.66);
    expect(r).toBeLessThan(projectRate(94.66, 3.9, 4));
  });

  it("averages down when the rupee is strengthening", () => {
    expect(blendedRate(94.66, -3, SPLIT_PLANS.half)).toBeLessThan(94.66);
  });
});

describe("driftCagr", () => {
  it("matches the historical scenario's published drift", () => {
    const measured = driftCagr(USD_INR_YEAR_END);
    const scenario = FX_SCENARIOS.filter((s) => s.key === "historical")[0];
    // Guards against the data file and the scenario silently diverging.
    expect(measured).toBeCloseTo(scenario.driftPct, 1);
  });

  it("is zero for a flat or single-point series", () => {
    expect(driftCagr([{ year: 2020, rate: 70 }])).toBe(0);
    expect(
      driftCagr([
        { year: 2020, rate: 70 },
        { year: 2030, rate: 70 },
      ])
    ).toBeCloseTo(0, 10);
  });
});

describe("USD_INR_YEAR_END data integrity", () => {
  it("covers 2006 through the current year with no gaps", () => {
    const years = USD_INR_YEAR_END.map((p) => p.year);
    expect(years[0]).toBe(2006);
    for (let i = 1; i < years.length; i++) {
      expect(years[i]).toBe(years[i - 1] + 1);
    }
  });

  it("holds plausible, positive rates", () => {
    for (const p of USD_INR_YEAR_END) {
      expect(p.rate).toBeGreaterThan(30);
      expect(p.rate).toBeLessThan(200);
    }
  });

  it("marks exactly one point as partial — the live year", () => {
    const partial = USD_INR_YEAR_END.filter((p) => p.partial);
    expect(partial).toHaveLength(1);
    expect(partial[0].year).toBe(USD_INR_YEAR_END[USD_INR_YEAR_END.length - 1].year);
  });
});

describe("validateTiming", () => {
  const raw = {
    amountUsd: "10000",
    billInr: "1000000",
    spot: "94.66",
    usRate: "4",
    indiaRate: "7.25",
    waitMonths: "12",
  };

  it("accepts a well-formed set in both modes", () => {
    expect(validateTiming(raw, "send").ok).toBe(true);
    expect(validateTiming(raw, "bill").ok).toBe(true);
  });

  it("rejects a negative or zero send amount", () => {
    expect(validateTiming({ ...raw, amountUsd: "0" }, "send").ok).toBe(false);
    expect(validateTiming({ ...raw, amountUsd: "-5" }, "send").ok).toBe(false);
  });

  it("rejects junk in the rate field", () => {
    expect(validateTiming({ ...raw, spot: "abc" }, "send").ok).toBe(false);
    expect(validateTiming({ ...raw, spot: "" }, "send").ok).toBe(false);
  });

  it("does not let the hidden mode's fields block a result", () => {
    // A blank send amount must not stop bill mode from calculating.
    expect(validateTiming({ ...raw, amountUsd: "" }, "bill").ok).toBe(true);
    // ...and a blank bill must not stop send mode.
    expect(validateTiming({ ...raw, billInr: "" }, "send").ok).toBe(true);
    // The India rate is meaningless for a bill, so junk there is ignored too.
    expect(validateTiming({ ...raw, indiaRate: "" }, "bill").ok).toBe(true);
  });
});
