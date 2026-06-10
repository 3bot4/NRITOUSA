/**
 * IUL vs 401(k) vs taxable brokerage projection model.
 *
 * Honesty rules baked into this model (do not "fix" these):
 *  - IUL cash value is NOT invested in the market. It is credited index-linked
 *    interest on a PRICE index (no dividends), subject to a cap, participation
 *    rate, and floor — so the 401(k)/taxable legs earn the full total return
 *    (price + dividends) while the IUL leg earns clamp(price-only return).
 *  - IUL charges keep accruing in down years even though the floor is 0%, so
 *    IUL cash value can fall in a flat/down year.
 *  - No leg is given a hidden advantage. All defaults live in
 *    data/iul-comparison.json with sources and TODOs for the site owner.
 *
 * Simplifications (stated in the article): IUL costs are modeled as a premium
 * load plus a flat % of cash value, while real cost-of-insurance is per-$1000
 * of net amount at risk and rises with age (real early-year drag is usually
 * worse than a flat %). Death benefit = max(face, cash value × corridor).
 */

import defaults from "../../data/iul-comparison.json";

export const ASSUMPTIONS = defaults;
export const LAST_UPDATED: string = defaults.lastUpdated;

/* ------------------------------------------------------------------ *
 * Inputs
 * ------------------------------------------------------------------ */

export interface ComparisonInputs {
  /** Contributed at the start of each year, all three accounts equally. */
  annualContribution: number;
  years: number;
  /** Expected market TOTAL return (price + dividends), %/yr. */
  expectedTotalReturnPct: number;
  /** Portion of total return paid as dividends, %/yr. */
  dividendYieldPct: number;
  /** Use the fixed 2000s-style bad sequence instead of a steady return. */
  badSequence: boolean;
  iul: {
    capRatePct: number;
    participationRatePct: number;
    floorPct: number;
    premiumLoadPct: number;
    annualPolicyCostPct: number;
  };
  k401: {
    employerMatchPct: number;
    annualFeePct: number;
    retirementTaxRatePct: number;
  };
  taxable: {
    fundFeePct: number;
    dividendTaxPct: number;
    capGainsPct: number;
  };
}

export function defaultInputs(): ComparisonInputs {
  return {
    annualContribution: 10000,
    years: 30,
    expectedTotalReturnPct: defaults.market.expectedTotalReturnPct,
    dividendYieldPct: defaults.market.dividendYieldPct,
    badSequence: false,
    iul: {
      capRatePct: defaults.iul.capRatePct,
      participationRatePct: defaults.iul.participationRatePct,
      floorPct: defaults.iul.floorPct,
      premiumLoadPct: defaults.iul.premiumLoadPct,
      annualPolicyCostPct: defaults.iul.annualPolicyCostPct,
    },
    k401: {
      employerMatchPct: defaults.k401.employerMatchPct,
      annualFeePct: defaults.k401.annualFeePct,
      retirementTaxRatePct: defaults.k401.retirementTaxRatePct,
    },
    taxable: {
      fundFeePct: defaults.taxable.fundFeePct,
      dividendTaxPct: defaults.taxable.dividendTaxPct,
      capGainsPct: defaults.taxable.capGainsPct,
    },
  };
}

/* ------------------------------------------------------------------ *
 * Outputs
 * ------------------------------------------------------------------ */

export interface YearPoint {
  year: number;
  iulCashValue: number;
  iulDeathBenefit: number;
  k401Balance: number;
  taxableBalance: number;
}

export interface LegResult {
  endingBalance: number;
  totalFees: number;
  afterTaxValue: number;
  totalContributed: number;
}

export interface ComparisonResult {
  series: YearPoint[];
  iul: LegResult & { deathBenefit: number };
  k401: LegResult & { employerContributed: number };
  taxable: LegResult;
  /** How often the IUL crediting hit its cap / floor — fuels the sensitivity note. */
  cappedYears: number;
  flooredYears: number;
  /** The yearly total returns actually used (for display/debug). */
  returnsUsedPct: number[];
}

/* ------------------------------------------------------------------ *
 * Engine
 * ------------------------------------------------------------------ */

function yearlyReturns(i: ComparisonInputs): number[] {
  if (!i.badSequence) {
    return Array.from({ length: i.years }, () => i.expectedTotalReturnPct);
  }
  const seq = defaults.market.badSequenceReturnsPct;
  return Array.from({ length: i.years }, (_, k) => seq[k % seq.length]);
}

export function runComparison(i: ComparisonInputs): ComparisonResult {
  const returns = yearlyReturns(i);
  const c = Math.max(0, i.annualContribution);
  const years = Math.max(1, Math.min(60, Math.round(i.years)));

  // IUL face amount: simplified as a multiple of the annual premium.
  const face = c * defaults.iul.faceAmountMultiple;
  const corridor = defaults.iul.corridorFactor;

  let k401Bal = 0;
  let k401Fees = 0;
  let taxBal = 0;
  let taxBasis = 0;
  let taxFees = 0;
  let iulCv = 0;
  let iulFees = 0;
  let cappedYears = 0;
  let flooredYears = 0;

  const series: YearPoint[] = [
    { year: 0, iulCashValue: 0, iulDeathBenefit: face, k401Balance: 0, taxableBalance: 0 },
  ];

  for (let y = 0; y < years; y++) {
    const totalReturn = returns[y];
    // Dividends are paid even in down years; price return is the remainder.
    const dividend = i.dividendYieldPct;
    const priceReturn = totalReturn - dividend;

    /* ---- 401(k): full total return, employer match, % fee ---- */
    const match = (c * i.k401.employerMatchPct) / 100;
    k401Bal = (k401Bal + c + match) * (1 + totalReturn / 100);
    const k401Fee = (k401Bal * i.k401.annualFeePct) / 100;
    k401Bal -= k401Fee;
    k401Fees += k401Fee;

    /* ---- Taxable: total return, dividends taxed yearly, % fee ---- */
    taxBal += c;
    taxBasis += c;
    taxBal *= 1 + priceReturn / 100;
    const grossDividends = (taxBal * dividend) / 100;
    const dividendTax = (grossDividends * i.taxable.dividendTaxPct) / 100;
    const reinvested = grossDividends - dividendTax;
    taxBal += reinvested;
    taxBasis += reinvested; // reinvested after-tax dividends add to basis
    const taxFee = (taxBal * i.taxable.fundFeePct) / 100;
    taxBal -= taxFee;
    taxFees += taxFee;

    /* ---- IUL: price-only return clamped to [floor, cap], charges ---- */
    const load = (c * i.iul.premiumLoadPct) / 100;
    iulCv += c - load;
    iulFees += load;
    const participated = (priceReturn * i.iul.participationRatePct) / 100;
    let credited = participated;
    if (credited > i.iul.capRatePct) {
      credited = i.iul.capRatePct;
      cappedYears += 1;
    }
    if (credited < i.iul.floorPct) {
      credited = i.iul.floorPct;
      flooredYears += 1;
    }
    iulCv *= 1 + credited / 100;
    const policyCost = (iulCv * i.iul.annualPolicyCostPct) / 100;
    iulCv -= policyCost;
    iulFees += policyCost;
    if (iulCv < 0) iulCv = 0;

    series.push({
      year: y + 1,
      iulCashValue: iulCv,
      iulDeathBenefit: Math.max(face, iulCv * corridor),
      k401Balance: k401Bal,
      taxableBalance: taxBal,
    });
  }

  const contributed = c * years;
  const employerContributed = (c * i.k401.employerMatchPct * years) / 100;
  const unrealizedGain = Math.max(0, taxBal - taxBasis);

  return {
    series,
    iul: {
      endingBalance: iulCv,
      totalFees: iulFees,
      // Cash value access via withdrawals-to-basis and policy loans can be
      // income-tax-free IF the policy stays in force; shown as-is with that
      // caveat in the UI. A lapsed policy with loans can trigger a tax bill.
      afterTaxValue: iulCv,
      totalContributed: contributed,
      deathBenefit: Math.max(face, iulCv * corridor),
    },
    k401: {
      endingBalance: k401Bal,
      totalFees: k401Fees,
      afterTaxValue: k401Bal * (1 - i.k401.retirementTaxRatePct / 100),
      totalContributed: contributed,
      employerContributed,
    },
    taxable: {
      endingBalance: taxBal,
      totalFees: taxFees,
      afterTaxValue: taxBal - (unrealizedGain * i.taxable.capGainsPct) / 100,
      totalContributed: contributed,
    },
    cappedYears,
    flooredYears,
    returnsUsedPct: returns,
  };
}

/** Broad winner label for analytics — never includes amounts. */
export function winnerLabel(r: ComparisonResult): string {
  const entries: [string, number][] = [
    ["k401_leads", r.k401.afterTaxValue],
    ["taxable_leads", r.taxable.afterTaxValue],
    ["iul_leads", r.iul.afterTaxValue],
  ];
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}

/* ------------------------------------------------------------------ *
 * URL state (share links reopen the same scenario)
 * ------------------------------------------------------------------ */

const URL_KEYS: [string, (i: ComparisonInputs) => number, (i: ComparisonInputs, v: number) => void][] = [
  ["c", (i) => i.annualContribution, (i, v) => (i.annualContribution = v)],
  ["y", (i) => i.years, (i, v) => (i.years = v)],
  ["r", (i) => i.expectedTotalReturnPct, (i, v) => (i.expectedTotalReturnPct = v)],
  ["dy", (i) => i.dividendYieldPct, (i, v) => (i.dividendYieldPct = v)],
  ["cap", (i) => i.iul.capRatePct, (i, v) => (i.iul.capRatePct = v)],
  ["par", (i) => i.iul.participationRatePct, (i, v) => (i.iul.participationRatePct = v)],
  ["load", (i) => i.iul.premiumLoadPct, (i, v) => (i.iul.premiumLoadPct = v)],
  ["coi", (i) => i.iul.annualPolicyCostPct, (i, v) => (i.iul.annualPolicyCostPct = v)],
  ["m", (i) => i.k401.employerMatchPct, (i, v) => (i.k401.employerMatchPct = v)],
  ["kf", (i) => i.k401.annualFeePct, (i, v) => (i.k401.annualFeePct = v)],
  ["kt", (i) => i.k401.retirementTaxRatePct, (i, v) => (i.k401.retirementTaxRatePct = v)],
  ["tf", (i) => i.taxable.fundFeePct, (i, v) => (i.taxable.fundFeePct = v)],
  ["td", (i) => i.taxable.dividendTaxPct, (i, v) => (i.taxable.dividendTaxPct = v)],
  ["tg", (i) => i.taxable.capGainsPct, (i, v) => (i.taxable.capGainsPct = v)],
];

/** Encode the inputs that differ from defaults into a query string. */
export function encodeInputs(i: ComparisonInputs): string {
  const d = defaultInputs();
  const params = new URLSearchParams();
  for (const [key, get] of URL_KEYS) {
    if (get(i) !== get(d)) params.set(key, String(get(i)));
  }
  if (i.badSequence) params.set("seq", "1");
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

/** Apply query-string overrides onto the defaults (invalid values ignored). */
export function decodeInputs(search: string): ComparisonInputs {
  const i = defaultInputs();
  const params = new URLSearchParams(search);
  for (const [key, , set] of URL_KEYS) {
    const raw = params.get(key);
    if (raw === null) continue;
    const v = Number(raw);
    if (Number.isFinite(v) && v >= 0 && v <= 1_000_000) set(i, v);
  }
  i.badSequence = params.get("seq") === "1";
  return i;
}
