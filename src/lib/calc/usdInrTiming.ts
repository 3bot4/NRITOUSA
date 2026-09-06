/**
 * Send-now-or-wait maths for /calculators/usd-inr-projection-send-now-or-wait.
 *
 * The whole page rests on one comparison. Sending dollars to India today buys
 * rupees that then earn an Indian deposit rate. Waiting keeps the dollars
 * earning a US rate and converts them later at whatever the rate turns out to
 * be. Waiting only wins if the rupee falls by more than the interest you gave
 * up by not being in rupees.
 *
 *   send now:  USD × spot × (1 + iIndia)^t
 *   wait:      USD × (1 + iUs)^t × rate(t)
 *
 * Setting those equal gives a break-even that depends on nothing but the two
 * interest rates — the horizon cancels out entirely:
 *
 *   breakEvenDrift = (1 + iIndia) / (1 + iUs) − 1
 *
 * That is covered interest parity. It is the single most useful number on the
 * page: if you think the rupee will fall faster than that, wait; slower, send.
 *
 * "Bill mode" is a genuinely different problem and has its own break-even. If
 * you owe a fixed number of rupees you are not forgoing any Indian yield, so
 * waiting wins unless the rupee *strengthens* faster than your dollars earn:
 *
 *   breakEvenDriftBill = 1 / (1 + iUs) − 1
 *
 * Expected value is not the whole answer for a dated bill — see the decision
 * tree on the page, which overrides this on deadline risk.
 */

import { validateAll, type FieldSpec } from "./validation";

/* ─────────────────────────── field specs ─────────────────────────── */

export const SEND_AMOUNT: FieldSpec = {
  label: "Amount to send",
  min: 1,
  max: 100_000_000,
  required: true,
};

export const BILL_AMOUNT: FieldSpec = {
  label: "Rupee amount you owe",
  min: 1,
  max: 10_000_000_000,
  required: true,
};

export const SPOT_RATE: FieldSpec = {
  label: "Today's USD/INR rate",
  min: 1,
  max: 500,
  required: true,
};

export const US_RATE: FieldSpec = {
  label: "What your dollars earn (US)",
  min: 0,
  max: 25,
};

export const INDIA_RATE: FieldSpec = {
  label: "What your rupees would earn (India)",
  min: 0,
  max: 25,
};

export const WAIT_MONTHS: FieldSpec = {
  label: "Wait window (months)",
  min: 0,
  max: 36,
  integer: true,
  clamp: true,
};

/* ───────────────────────────── helpers ───────────────────────────── */

/** Guards every exported result against NaN/Infinity leaking into the UI. */
function finite(n: number): number {
  return Number.isFinite(n) ? n : 0;
}

/**
 * Compound annual growth rate between the first and last point of a rate
 * series, as a percentage. Used to derive the historical-drift scenario from
 * real data rather than asserting a round number.
 */
export function driftCagr(
  series: { year: number; rate: number }[]
): number {
  if (series.length < 2) return 0;
  const first = series[0];
  const last = series[series.length - 1];
  const years = last.year - first.year;
  if (years <= 0 || first.rate <= 0 || last.rate <= 0) return 0;
  return finite((Math.pow(last.rate / first.rate, 1 / years) - 1) * 100);
}

/** USD/INR after `months`, compounding `driftPct` per year. */
export function projectRate(
  spot: number,
  driftPct: number,
  months: number
): number {
  if (spot <= 0) return 0;
  return finite(spot * Math.pow(1 + driftPct / 100, months / 12));
}

/**
 * Annual rupee depreciation at which sending now and waiting break even,
 * for someone who would park the rupees in an Indian deposit.
 */
export function breakEvenDriftPct(
  indiaRatePct: number,
  usRatePct: number
): number {
  const us = 1 + usRatePct / 100;
  if (us <= 0) return 0;
  return finite(((1 + indiaRatePct / 100) / us - 1) * 100);
}

/**
 * Break-even for a fixed rupee bill, where no Indian yield is forgone.
 * Almost always negative: waiting wins unless the rupee rallies hard.
 */
export function breakEvenDriftBillPct(usRatePct: number): number {
  const us = 1 + usRatePct / 100;
  if (us <= 0) return 0;
  return finite((1 / us - 1) * 100);
}

/* ────────────────────────── main comparison ────────────────────────── */

export type TimingMode = "send" | "bill";

export interface TimingInput {
  mode: TimingMode;
  /** USD you plan to send. Used in "send" mode. */
  amountUsd: number;
  /** INR you owe. Used in "bill" mode. */
  billInr: number;
  spot: number;
  driftPct: number;
  waitMonths: number;
  usRatePct: number;
  indiaRatePct: number;
}

export interface TimingResult {
  mode: TimingMode;
  years: number;
  /** Projected USD/INR at the end of the wait window. */
  rateAtWait: number;
  /** Rate at which the two choices tie, at this horizon. */
  breakEvenRate: number;
  /** Annual drift at which the two choices tie, at any horizon. */
  breakEvenDrift: number;

  /** "send" mode: rupees you end up with. Zero in bill mode. */
  sendNowInr: number;
  waitInr: number;

  /** "bill" mode: dollars the bill costs you today. Zero in send mode. */
  sendNowUsd: number;
  waitUsd: number;

  /** Positive = waiting is better. INR in send mode, USD in bill mode. */
  advantage: number;
  /** `advantage` as a share of the send-now outcome, in percent. */
  advantagePct: number;
  verdict: "send" | "wait" | "tossup";
}

/** Below this, the gap is noise and the honest answer is "it doesn't matter". */
const TOSSUP_PCT = 0.5;

export function compareTiming(input: TimingInput): TimingResult {
  const {
    mode,
    amountUsd,
    billInr,
    spot,
    driftPct,
    waitMonths,
    usRatePct,
    indiaRatePct,
  } = input;

  const years = Math.max(0, waitMonths) / 12;
  const rateAtWait = projectRate(spot, driftPct, waitMonths);
  const usGrowth = Math.pow(1 + usRatePct / 100, years);
  const inGrowth = Math.pow(1 + indiaRatePct / 100, years);

  const breakEvenDrift =
    mode === "bill"
      ? breakEvenDriftBillPct(usRatePct)
      : breakEvenDriftPct(indiaRatePct, usRatePct);

  // The rate at the horizon that makes the two paths tie.
  const breakEvenRate =
    mode === "bill"
      ? finite(spot / usGrowth)
      : finite((spot * inGrowth) / usGrowth);

  let sendNowInr = 0;
  let waitInr = 0;
  let sendNowUsd = 0;
  let waitUsd = 0;
  let advantage = 0;
  let base = 0;

  if (mode === "bill") {
    // Present-value dollar cost of each path.
    sendNowUsd = spot > 0 ? finite(billInr / spot) : 0;
    waitUsd =
      rateAtWait > 0 && usGrowth > 0
        ? finite(billInr / rateAtWait / usGrowth)
        : 0;
    // Cheaper is better, so the advantage of waiting is the cost avoided.
    advantage = finite(sendNowUsd - waitUsd);
    base = sendNowUsd;
  } else {
    sendNowInr = finite(amountUsd * spot * inGrowth);
    waitInr = finite(amountUsd * usGrowth * rateAtWait);
    advantage = finite(waitInr - sendNowInr);
    base = sendNowInr;
  }

  const advantagePct = base > 0 ? finite((advantage / base) * 100) : 0;
  const verdict: TimingResult["verdict"] =
    Math.abs(advantagePct) < TOSSUP_PCT
      ? "tossup"
      : advantage > 0
        ? "wait"
        : "send";

  return {
    mode,
    years,
    rateAtWait,
    breakEvenRate,
    breakEvenDrift,
    sendNowInr,
    waitInr,
    sendNowUsd,
    waitUsd,
    advantage,
    advantagePct,
    verdict,
  };
}

/* ──────────────────────── "wrong by 2 rupees" ──────────────────────── */

export interface SensitivityRow {
  /** Label such as "₹2 weaker than you assumed". */
  label: string;
  rate: number;
  advantage: number;
  verdict: TimingResult["verdict"];
}

/**
 * What happens if the projected rate is wrong by ±`delta` rupees. This is the
 * page's honesty check: for most inputs a 2-rupee miss flips the answer, which
 * tells the reader the forecast was never the load-bearing part.
 */
export function sensitivity(
  input: TimingInput,
  delta = 2
): SensitivityRow[] {
  const centre = compareTiming(input);
  const offsets: { label: string; d: number }[] = [
    { label: `₹${delta} stronger rupee than projected`, d: -delta },
    { label: "Exactly as projected", d: 0 },
    { label: `₹${delta} weaker rupee than projected`, d: delta },
  ];

  return offsets.map((o) => {
    const rate = Math.max(0.01, centre.rateAtWait + o.d);
    // Re-express the shifted end rate as the drift that produces it, so the
    // whole comparison stays in one code path.
    const drift =
      centre.years > 0 && input.spot > 0
        ? (Math.pow(rate / input.spot, 1 / centre.years) - 1) * 100
        : input.driftPct;
    const r = compareTiming({ ...input, driftPct: drift });
    return {
      label: o.label,
      rate,
      advantage: r.advantage,
      verdict: r.verdict,
    };
  });
}

/* ─────────────────────── "what waiting costs" grid ─────────────────────── */

export interface WaitingCostCell {
  months: number;
  advantage: number;
}

export interface WaitingCostSeries {
  scenarioKey: string;
  cells: WaitingCostCell[];
}

/** Advantage of waiting at each horizon, for every scenario. Drives chart (d). */
export function waitingCostGrid(
  input: TimingInput,
  scenarios: { key: string; driftPct: number }[],
  horizons: number[] = [3, 6, 12, 24]
): WaitingCostSeries[] {
  return scenarios.map((s) => ({
    scenarioKey: s.key,
    cells: horizons.map((months) => ({
      months,
      advantage: compareTiming({
        ...input,
        driftPct: s.driftPct,
        waitMonths: months,
      }).advantage,
    })),
  }));
}

/* ──────────────────────────── split plans ──────────────────────────── */

export interface Tranche {
  label: string;
  monthOffset: number;
  sharePct: number;
}

/**
 * The three plans the decision tree can recommend. "Send now" is a single
 * tranche at month 0, so it needs no special case downstream.
 */
export const SPLIT_PLANS: Record<string, Tranche[]> = {
  now: [{ label: "All of it, today", monthOffset: 0, sharePct: 100 }],
  half: [
    { label: "Half today", monthOffset: 0, sharePct: 50 },
    { label: "Half in 3 months", monthOffset: 3, sharePct: 50 },
  ],
  thirds: [
    { label: "A third today", monthOffset: 0, sharePct: 34 },
    { label: "A third in 2 months", monthOffset: 2, sharePct: 33 },
    { label: "A third in 4 months", monthOffset: 4, sharePct: 33 },
  ],
};

/**
 * Blended rate a tranche plan achieves under one scenario — the number that
 * makes "averaging in" concrete rather than a slogan.
 */
export function blendedRate(
  spot: number,
  driftPct: number,
  plan: Tranche[]
): number {
  let weighted = 0;
  let shares = 0;
  for (let i = 0; i < plan.length; i++) {
    const t = plan[i];
    weighted += projectRate(spot, driftPct, t.monthOffset) * t.sharePct;
    shares += t.sharePct;
  }
  return shares > 0 ? finite(weighted / shares) : spot;
}

/* ──────────────────────────── validation ──────────────────────────── */

export interface RawTimingInputs {
  amountUsd: string;
  billInr: string;
  spot: string;
  usRate: string;
  indiaRate: string;
  waitMonths: string;
}

/**
 * Validates the raw form strings for the active mode only — the hidden mode's
 * amount field must not be able to block a result.
 */
export function validateTiming(raw: RawTimingInputs, mode: TimingMode) {
  // The India rate is irrelevant to a fixed rupee bill, and the send amount is
  // hidden in bill mode — validating either would let an untouched field block
  // a result the user can't see how to fix.
  return validateAll(
    {
      amountUsd: mode === "bill" ? "1" : raw.amountUsd,
      billInr: mode === "bill" ? raw.billInr : "1",
      spot: raw.spot,
      usRate: raw.usRate,
      indiaRate: mode === "bill" ? "0" : raw.indiaRate,
      waitMonths: raw.waitMonths,
    },
    {
      amountUsd: SEND_AMOUNT,
      billInr: BILL_AMOUNT,
      spot: SPOT_RATE,
      usRate: US_RATE,
      indiaRate: INDIA_RATE,
      waitMonths: WAIT_MONTHS,
    }
  );
}
