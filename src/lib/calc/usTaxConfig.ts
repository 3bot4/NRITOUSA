/**
 * US federal tax-year constants — single sourced module.
 *
 * Every figure here is quoted from an official IRS release for the stated tax
 * year. Do not scatter these values into components, and do not add a figure
 * without a source URL and a checked date. If a value cannot be verified to a
 * primary source, leave it out rather than guessing — a missing value must make
 * the caller degrade gracefully, never invent.
 */

export interface TaxBracket {
  /** Marginal rate as a decimal (0.22 = 22%). */
  rate: number;
  /** Taxable income at which this rate starts (the previous bracket's ceiling). */
  from: number;
}

export interface FilingStatusBrackets {
  /** Ordered low→high. Verified from the IRS release named in `source`. */
  brackets: TaxBracket[];
  standardDeduction: number;
}

export interface UsTaxYear {
  year: number;
  source: string;
  checkedDate: string;
  /**
   * Bracket thresholds are provided by the IRS 2026 release for SINGLE and MFJ
   * only. MFS and HOH carry the verified standard deduction but NO bracket
   * table, because inventing thresholds the release does not publish would
   * violate the sourcing rule. Callers that need MFS/HOH marginal brackets must
   * handle their absence.
   */
  single: FilingStatusBrackets;
  marriedJoint: FilingStatusBrackets;
  marriedSeparate: { standardDeduction: number; brackets: TaxBracket[] | null };
  headOfHousehold: { standardDeduction: number; brackets: TaxBracket[] | null };
}

/**
 * Tax year 2026.
 * Source: IRS, "IRS releases tax inflation adjustments for tax year 2026,
 * including amendments from the One, Big, Beautiful Bill" — verified against
 * irs.gov. Bracket thresholds published for Single and MFJ; standard deductions
 * published for all four statuses.
 */
export const US_TAX_2026: UsTaxYear = {
  year: 2026,
  source:
    "https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill",
  checkedDate: "2026-07-20",
  single: {
    standardDeduction: 16_100,
    brackets: [
      { rate: 0.1, from: 0 },
      { rate: 0.12, from: 12_400 },
      { rate: 0.22, from: 50_400 },
      { rate: 0.24, from: 105_700 },
      { rate: 0.32, from: 201_775 },
      { rate: 0.35, from: 256_225 },
      { rate: 0.37, from: 640_600 },
    ],
  },
  marriedJoint: {
    standardDeduction: 32_200,
    brackets: [
      { rate: 0.1, from: 0 },
      { rate: 0.12, from: 24_800 },
      { rate: 0.22, from: 100_800 },
      { rate: 0.24, from: 211_400 },
      { rate: 0.32, from: 403_550 },
      { rate: 0.35, from: 512_450 },
      { rate: 0.37, from: 768_700 },
    ],
  },
  // Standard deductions verified; bracket tables not published in the release.
  marriedSeparate: { standardDeduction: 16_100, brackets: null },
  headOfHousehold: { standardDeduction: 24_150, brackets: null },
};

export const CURRENT_US_TAX_YEAR = 2026;
export const currentUsTax = (): UsTaxYear => US_TAX_2026;

export type FilingStatus = "single" | "mfj" | "mfs" | "hoh";

export function standardDeduction(status: FilingStatus, ty: UsTaxYear = currentUsTax()): number {
  switch (status) {
    case "single":
      return ty.single.standardDeduction;
    case "mfj":
      return ty.marriedJoint.standardDeduction;
    case "mfs":
      return ty.marriedSeparate.standardDeduction;
    case "hoh":
      return ty.headOfHousehold.standardDeduction;
  }
}

/**
 * The marginal-rate options offered by the FCNR calculator, labelled with the
 * verified 2026 Single and MFJ ranges. Only the four statuses' Single/MFJ bands
 * are shown because those are the ranges the IRS release publishes.
 */
export function marginalRateOptions(
  ty: UsTaxYear = currentUsTax(),
): { value: string; label: string }[] {
  const s = ty.single.brackets;
  const m = ty.marriedJoint.brackets;
  const dollars = (n: number) => `$${n.toLocaleString("en-US")}`;
  // Official "over" structure, formatted from the numeric thresholds — never
  // hand-adjusted $12,399 / $50,399 endpoints. The first band is "≤ next.from",
  // middle bands are "> from to ≤ next.from", the top band is "> from".
  const band = (arr: TaxBracket[], i: number) => {
    if (i === 0) return `≤ ${dollars(arr[i + 1].from)}`;
    if (i + 1 < arr.length)
      return `> ${dollars(arr[i].from)} to ≤ ${dollars(arr[i + 1].from)}`;
    return `> ${dollars(arr[i].from)}`;
  };
  const rows: { value: string; label: string }[] = [];
  for (let i = 0; i < s.length; i++) {
    const pct = `${Math.round(s[i].rate * 100)}%`;
    rows.push({
      value: String(Math.round(s[i].rate * 100)),
      label: `${pct} — Single: ${band(s, i)} · MFJ: ${band(m, i)}`,
    });
  }
  return rows;
}

/**
 * The marginal bracket rate (decimal) for a given taxable income and status,
 * using the official "over" boundaries: a bracket applies to income OVER its
 * `from` threshold, so income exactly at a threshold stays in the lower bracket.
 * MFS/HOH fall back to Single when they carry no published bracket table.
 */
export function bracketRateFor(income: number, status: FilingStatus, ty: UsTaxYear = currentUsTax()): number {
  const brackets =
    status === "mfj"
      ? ty.marriedJoint.brackets
      : status === "mfs"
        ? ty.marriedSeparate.brackets ?? ty.single.brackets
        : status === "hoh"
          ? ty.headOfHousehold.brackets ?? ty.single.brackets
          : ty.single.brackets;
  const x = Number.isFinite(income) ? income : 0;
  for (let i = brackets.length - 1; i >= 1; i--) {
    if (x > brackets[i].from) return brackets[i].rate;
  }
  return brackets[0].rate;
}

/**
 * OBBB state-and-local-tax (SALT) deduction cap for 2026.
 *
 * Verified figures — base cap, MFS cap, phase-down MAGI thresholds and floors —
 * from the IRS correction to the 2026 Form 1040-ES (see `saltSource`). The
 * phase-down MECHANISM (the cap is reduced by 30% of the amount by which MAGI
 * exceeds the threshold, never below the floor) is the OBBB statutory rule;
 * it reconciles exactly with the IRS figures — $40,400 − 0.30 × ($606,333 −
 * $505,000) = $10,000, the point at which the general cap reaches its floor.
 */
export const SALT_2026 = {
  saltSource:
    "https://www.irs.gov/forms-pubs/correction-to-state-and-local-income-tax-deduction-amount-in-the-2026-form-1040-es",
  checkedDate: "2026-07-20",
  /** Per-filing-status base cap, phase-down threshold and floor. */
  general: { baseCap: 40_400, magiThreshold: 505_000, floor: 10_000 },
  mfs: { baseCap: 20_200, magiThreshold: 252_500, floor: 5_000 },
  /** Reduction rate applied to MAGI above the threshold. */
  phasedownRate: 0.3,
} as const;

/**
 * The SALT cap applicable to a filing status at a given MAGI, after the OBBB
 * high-income phase-down. MFS uses its own base, threshold and floor; all other
 * statuses use the general figures.
 *
 * cap = max(floor, baseCap − 0.30 × max(0, MAGI − threshold))
 */
export function saltCapFor(status: FilingStatus, magi: number): number {
  const band = status === "mfs" ? SALT_2026.mfs : SALT_2026.general;
  const excess = Math.max(0, (Number.isFinite(magi) ? magi : 0) - band.magiThreshold);
  const reduced = band.baseCap - SALT_2026.phasedownRate * excess;
  return Math.max(band.floor, reduced);
}
