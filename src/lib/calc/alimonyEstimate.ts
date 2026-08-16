/**
 * Spousal support / maintenance guideline estimator — US states vs India.
 *
 * Pure, framework-agnostic and unit-tested. The UI layer
 * (components/tools/AlimonyEstimator.tsx) only formats what this returns.
 *
 * WHAT THIS IS
 * ------------
 * Every US jurisdiction modelled here decides spousal support on statutory
 * FACTORS, not on a formula. What the formulas below reproduce is the
 * *guideline* figure that negotiations and temporary orders typically start
 * from. India has no formula at all — the India column is an explicitly
 * labelled benchmark, not a legal calculation.
 *
 * WHY EACH RULE IS SHAPED THE WAY IT IS
 * -------------------------------------
 *  - CA  Santa Clara / Alameda temporary-support guideline: 40% of the higher
 *        earner's NET monthly income minus 50% of the lower earner's. Net,
 *        not gross — that is the whole point of the local guideline. Duration
 *        under Fam. Code § 4336: marriages under 10 years get roughly half the
 *        length of the marriage; a marriage of 10+ years is one of "long
 *        duration" and the court does not set a presumptive termination date.
 *
 *  - NY  DRL § 236(B)(6). TWO formulas, and which one applies depends on
 *        whether the payor is also the non-custodial parent paying child
 *        support. The award is the LESSER of the two candidate results, and
 *        the formula only reaches the payor's income up to the statutory
 *        income cap (income above the cap is discretionary). Duration follows
 *        the statutory advisory schedule, which is a RANGE, not a point.
 *
 *  - TX  Family Code ch. 8. Texas is unusual: there is a hard ELIGIBILITY GATE
 *        before any number exists. The court may order maintenance only if the
 *        spouse seeking it lacks sufficient property to meet minimum
 *        reasonable needs AND one of the § 8.051 conditions is met — the
 *        common one being a marriage of 10 years or longer. A three-year Texas
 *        marriage does not produce a smaller number; it usually produces no
 *        maintenance at all. Modelling Texas without that gate (as a bare
 *        `min($5,000, 20%)`) reports a confident figure in exactly the cases
 *        where the statute gives zero, so eligibility is returned as a
 *        first-class field and the caller must surface it.
 *
 *  - AAML The American Academy of Matrimonial Lawyers benchmark used as a
 *        stand-in for states with no published formula: 30% of the payor's
 *        GROSS income minus 20% of the payee's, capped so the payee's total
 *        income does not exceed 40% of the couple's combined income. Duration
 *        scales by a bracketed factor of the marriage length rather than a
 *        flat half.
 *
 *  - IN  Kalyan Dey Chowdhury v. Rita Dey Chowdhury (2017) referenced 25% of
 *        the husband's net salary as a "just and proper" benchmark. That is a
 *        reference point the Supreme Court found reasonable on those facts,
 *        NOT a formula binding on any court. Rajnesh v. Neha (2020) requires
 *        both spouses to file an affidavit of assets and income and directs
 *        courts to assess real earning capacity, which is why an NRI's US
 *        income is routinely imputed in full.
 *
 * All monetary inputs are annual gross USD. All returned US figures are
 * monthly USD; all returned India figures are monthly INR (plus a USD
 * equivalent for comparison).
 */

/** Jurisdictions with a distinct modelled guideline. */
export type AlimonyJurisdiction = "CA" | "NY" | "TX" | "AAML";

/**
 * Share of gross income treated as net for the guidelines that are net-based
 * (California) and for the India benchmark (which is expressed on net salary).
 * A single blended stand-in for federal + state + FICA — deliberately crude,
 * and surfaced to the user as an assumption rather than buried.
 */
export const NET_OF_TAX_SHARE = 0.72;

/**
 * NY maintenance payor income cap, DRL § 236(B)(6). Adjusted every two years
 * for CPI-U; rose from $228,000 to $241,000 effective March 1, 2026. Income
 * above the cap is not formula-driven — the court may award more on it after
 * weighing the statutory factors.
 */
export const NY_INCOME_CAP_USD = 241_000;

/** Texas Family Code § 8.055 — monthly ceiling on court-ordered maintenance. */
export const TX_MONTHLY_CAP_USD = 5_000;
/** Texas Family Code § 8.055 — share of the payor's average monthly gross. */
export const TX_GROSS_SHARE = 0.2;
/** Texas Family Code § 8.051(2)(B) — the common eligibility threshold. */
export const TX_MIN_YEARS_MARRIED = 10;

/** Kalyan Dey Chowdhury benchmark share of net income. */
export const INDIA_BENCHMARK_SHARE = 0.25;

/** Lump-sum ("one-time settlement") multiples of the monthly benchmark. */
export const INDIA_LUMP_SUM_MONTHS = { low: 36, high: 84 } as const;

export interface AlimonyInputs {
  /** Annual gross USD of whichever spouse earns more (order is normalized). */
  higherGrossAnnualUsd: number;
  /** Annual gross USD of the lower earner. */
  lowerGrossAnnualUsd: number;
  yearsMarried: number;
  jurisdiction: AlimonyJurisdiction;
  /**
   * NY only: true when the maintenance payor is ALSO the non-custodial parent
   * paying child support, which switches DRL § 236(B)(6) to its second
   * formula (20%/25% instead of 30%/20%). Ignored elsewhere.
   */
  payorPaysChildSupport: boolean;
  /** USD→INR rate for the India comparison. Must be > 0. */
  usdInr: number;
}

/**
 * Whether the jurisdiction's own threshold test is met before any figure is
 * meaningful. Only Texas has a hard statutory gate; the others are
 * discretionary everywhere, so they report `discretionary`.
 */
export type EligibilityStatus = "guideline" | "screened-out" | "discretionary";

export interface AlimonyResult {
  /** Guideline monthly spousal support in USD. Never negative, never NaN. */
  usMonthlyUsd: number;
  /** Which guideline produced the figure (shown next to it). */
  usFormulaLabel: string;
  /** Duration the jurisdiction's own schedule points to. */
  usDurationLabel: string;
  usEligibility: EligibilityStatus;
  /** Plain-language explanation of the eligibility status. Always set. */
  usEligibilityNote: string;
  /** Monthly India maintenance benchmark, INR. */
  indiaMonthlyInr: number;
  /** The same benchmark converted back to USD for a like-for-like read. */
  indiaMonthlyUsd: number;
  indiaLumpSumLowInr: number;
  indiaLumpSumHighInr: number;
  /** Which forum produces the larger number on these inputs. */
  comparison: "us-higher" | "india-higher" | "similar" | "neither";
  /** US figure ÷ India figure, both in INR. Null when either side is zero. */
  ratio: number | null;
}

/** Coerce any caller input to a finite, non-negative number. */
function safe(n: number): number {
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/** Round to whole currency units — no fractional rupees or cents on screen. */
function whole(n: number): number {
  return Math.max(0, Math.round(n));
}

/** One decimal place, for "N× the other forum" phrasing. */
function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/* ------------------------------------------------------------------ *
 * Per-jurisdiction guideline
 * ------------------------------------------------------------------ */

interface UsGuideline {
  monthly: number;
  formulaLabel: string;
  durationLabel: string;
  eligibility: EligibilityStatus;
  eligibilityNote: string;
}

function californiaGuideline(
  higherNetMonthly: number,
  lowerNetMonthly: number,
  yearsMarried: number,
): UsGuideline {
  const monthly = 0.4 * higherNetMonthly - 0.5 * lowerNetMonthly;
  const longDuration = yearsMarried >= 10;
  return {
    monthly,
    formulaLabel: "Santa Clara guideline (temporary support)",
    durationLabel: longDuration
      ? "No presumptive end date (Fam. Code § 4336)"
      : `About ${round1(yearsMarried / 2)} years`,
    eligibility: "discretionary",
    eligibilityNote: longDuration
      ? "A marriage of 10 years or more is a marriage of long duration in California, so the court does not set a termination date at judgment and retains jurisdiction. This local guideline governs temporary support while the case is pending; the final award is decided on the Family Code § 4320 factors and often differs."
      : "This local guideline governs temporary support while the case is pending. The final award is decided on the Family Code § 4320 factors and often differs.",
  };
}

function newYorkGuideline(
  higherGrossAnnual: number,
  higherGrossMonthly: number,
  lowerGrossMonthly: number,
  yearsMarried: number,
  payorPaysChildSupport: boolean,
): UsGuideline {
  // The formula reaches the payor's income only up to the statutory cap.
  const cappedPayorMonthly = Math.min(higherGrossAnnual, NY_INCOME_CAP_USD) / 12;

  // Two candidate results; the award is the lesser of them.
  const primary = payorPaysChildSupport
    ? 0.2 * cappedPayorMonthly - 0.25 * lowerGrossMonthly
    : 0.3 * cappedPayorMonthly - 0.2 * lowerGrossMonthly;
  const incomeShareCap = 0.4 * (cappedPayorMonthly + lowerGrossMonthly) - lowerGrossMonthly;
  const monthly = Math.min(primary, incomeShareCap);

  // Statutory advisory duration schedule — a range, not a point.
  const [lowShare, highShare] =
    yearsMarried <= 15 ? [0.15, 0.3] : yearsMarried <= 20 ? [0.3, 0.4] : [0.35, 0.5];

  const overCap = higherGrossMonthly * 12 > NY_INCOME_CAP_USD;
  return {
    monthly,
    formulaLabel: payorPaysChildSupport
      ? "DRL § 236(B)(6) — payor also pays child support"
      : "DRL § 236(B)(6)",
    durationLabel: `${round1(yearsMarried * lowShare)}–${round1(yearsMarried * highShare)} years`,
    eligibility: "guideline",
    eligibilityNote: overCap
      ? `Income above the $${NY_INCOME_CAP_USD.toLocaleString("en-US")} statutory cap is excluded from the formula. The court may award more on that excess after weighing the statutory factors, so a high earner's real exposure can exceed this figure.`
      : "The full income is inside the statutory cap, so the guideline formula applies to all of it. The court may still adjust the result after weighing the statutory factors.",
  };
}

function texasGuideline(higherGrossMonthly: number, yearsMarried: number): UsGuideline {
  const monthly = Math.min(TX_MONTHLY_CAP_USD, TX_GROSS_SHARE * higherGrossMonthly);
  const eligibleOnLength = yearsMarried >= TX_MIN_YEARS_MARRIED;
  const durationYears = yearsMarried >= 30 ? 10 : yearsMarried >= 20 ? 7 : 5;

  return {
    monthly,
    formulaLabel: "Texas statutory cap (Fam. Code § 8.055)",
    durationLabel: `Up to ${durationYears} years`,
    eligibility: eligibleOnLength ? "guideline" : "screened-out",
    eligibilityNote: eligibleOnLength
      ? "Texas caps maintenance at the lesser of $5,000 a month or 20% of the payor's average monthly gross income, and the spouse seeking it must still show they lack the property and earning ability to meet their minimum reasonable needs."
      : `Texas has an eligibility gate before any figure applies. With a marriage under ${TX_MIN_YEARS_MARRIED} years, a court can order maintenance only under a § 8.051 exception — family violence within two years of filing, or a disability of the spouse or a child in their care. Without an exception the likely Texas outcome is no court-ordered maintenance at all, whatever the incomes are. The figure shown is what the cap would allow IF an exception applies.`,
  };
}

function aamlGuideline(
  higherGrossMonthly: number,
  lowerGrossMonthly: number,
  yearsMarried: number,
): UsGuideline {
  const primary = 0.3 * higherGrossMonthly - 0.2 * lowerGrossMonthly;
  // The payee's total income must not exceed 40% of the combined income.
  const incomeShareCap = 0.4 * (higherGrossMonthly + lowerGrossMonthly) - lowerGrossMonthly;
  const monthly = Math.min(primary, incomeShareCap);

  // AAML duration factor brackets, rather than a flat half of the marriage.
  const factor =
    yearsMarried < 3 ? 0.3 : yearsMarried < 10 ? 0.5 : yearsMarried < 20 ? 0.75 : null;

  return {
    monthly,
    formulaLabel: "AAML benchmark",
    durationLabel:
      factor === null
        ? "Often indefinite (20+ year marriage)"
        : `About ${round1(yearsMarried * factor)} years`,
    eligibility: "discretionary",
    eligibilityNote:
      "Most states publish no formula at all. This is the AAML benchmark, widely used as a negotiating starting point — your state's statute, and the judge, control the actual award.",
  };
}

/* ------------------------------------------------------------------ *
 * Main entry point
 * ------------------------------------------------------------------ */

export function estimateAlimony(inputs: AlimonyInputs): AlimonyResult {
  // Normalize: whoever earns more is the payor, whatever order they were typed.
  const a = safe(inputs.higherGrossAnnualUsd);
  const b = safe(inputs.lowerGrossAnnualUsd);
  const higherGrossAnnual = Math.max(a, b);
  const lowerGrossAnnual = Math.min(a, b);

  const yearsMarried = Math.max(0, Number.isFinite(inputs.yearsMarried) ? inputs.yearsMarried : 0);
  // A zero or negative rate would divide by zero in the USD read-back.
  const usdInr = Number.isFinite(inputs.usdInr) && inputs.usdInr > 0 ? inputs.usdInr : 1;

  const higherGrossMonthly = higherGrossAnnual / 12;
  const lowerGrossMonthly = lowerGrossAnnual / 12;
  const higherNetMonthly = higherGrossMonthly * NET_OF_TAX_SHARE;
  const lowerNetMonthly = lowerGrossMonthly * NET_OF_TAX_SHARE;

  let g: UsGuideline;
  switch (inputs.jurisdiction) {
    case "CA":
      g = californiaGuideline(higherNetMonthly, lowerNetMonthly, yearsMarried);
      break;
    case "NY":
      g = newYorkGuideline(
        higherGrossAnnual,
        higherGrossMonthly,
        lowerGrossMonthly,
        yearsMarried,
        inputs.payorPaysChildSupport,
      );
      break;
    case "TX":
      g = texasGuideline(higherGrossMonthly, yearsMarried);
      break;
    default:
      g = aamlGuideline(higherGrossMonthly, lowerGrossMonthly, yearsMarried);
  }

  const usMonthlyUsd = whole(g.monthly);

  /* ---- India benchmark ---- */
  // Kalyan Dey Chowdhury is expressed on NET salary, so convert to net first,
  // then to rupees. The lower earner's own income offsets the benchmark
  // proportionally: equal incomes → no maintenance.
  const higherNetMonthlyInr = higherNetMonthly * usdInr;
  const lowerNetMonthlyInr = lowerNetMonthly * usdInr;
  const offset =
    higherNetMonthlyInr > 0 ? Math.min(1, lowerNetMonthlyInr / higherNetMonthlyInr) : 0;
  const indiaMonthlyInr = whole(higherNetMonthlyInr * INDIA_BENCHMARK_SHARE * (1 - offset));

  /* ---- Which forum is larger ---- */
  const usMonthlyInr = usMonthlyUsd * usdInr;
  let comparison: AlimonyResult["comparison"];
  let ratio: number | null = null;
  if (usMonthlyUsd === 0 && indiaMonthlyInr === 0) {
    comparison = "neither";
  } else if (indiaMonthlyInr === 0) {
    comparison = "us-higher";
  } else if (usMonthlyInr === 0) {
    comparison = "india-higher";
  } else {
    ratio = round1(usMonthlyInr / indiaMonthlyInr);
    comparison =
      usMonthlyInr > indiaMonthlyInr * 1.25
        ? "us-higher"
        : indiaMonthlyInr > usMonthlyInr * 1.25
          ? "india-higher"
          : "similar";
  }

  return {
    usMonthlyUsd,
    usFormulaLabel: g.formulaLabel,
    usDurationLabel: g.durationLabel,
    usEligibility: g.eligibility,
    usEligibilityNote: g.eligibilityNote,
    indiaMonthlyInr,
    indiaMonthlyUsd: whole(indiaMonthlyInr / usdInr),
    indiaLumpSumLowInr: whole(indiaMonthlyInr * INDIA_LUMP_SUM_MONTHS.low),
    indiaLumpSumHighInr: whole(indiaMonthlyInr * INDIA_LUMP_SUM_MONTHS.high),
    comparison,
    ratio,
  };
}
