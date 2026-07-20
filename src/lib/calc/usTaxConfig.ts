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
  const fmtK = (n: number) => `$${Math.round(n / 1000)}k`;
  // Build "single X–Y / married X–Y" labels for the 22%+ bands.
  const rows: { value: string; label: string }[] = [];
  for (let i = 2; i < s.length; i++) {
    const rate = s[i].rate;
    const sHi = i + 1 < s.length ? `–${fmtK(s[i + 1].from)}` : "+";
    const mHi = i + 1 < m.length ? `–${fmtK(m[i + 1].from)}` : "+";
    const pct = `${Math.round(rate * 100)}%`;
    rows.push({
      value: String(Math.round(rate * 100)),
      label: `${pct} (single ${fmtK(s[i].from)}${sHi} / married ${fmtK(m[i].from)}${mHi})`,
    });
  }
  return rows;
}

/**
 * OBBB state-and-local-tax deduction cap.
 *
 * The $10,000 TCJA cap was replaced by the One Big Beautiful Bill Act with a
 * higher cap that phases down for high earners. The exact 2026 figure could not
 * be confirmed against a primary IRS/Treasury page at the time of writing
 * (irs.gov and congress.gov reads were unavailable), so this is marked
 * unverified and callers must NOT present a tax benefit as fact on the strength
 * of it. The rent-vs-buy tool defaults its tax benefit to zero and only uses
 * this cap once the user explicitly opts into itemizing and supplies their own
 * figures — so an approximate cap never silently drives a result.
 */
export const SALT_CAP_2026 = {
  amount: 40_000,
  verified: false,
  note: "OBBB raised the SALT cap above the former $10,000. The exact 2026 amount and high-income phasedown should be verified before relying on any benefit figure.",
} as const;
