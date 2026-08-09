/**
 * Year-keyed IRS retirement limits.
 *
 * Single source of truth: calculators, page copy, FAQ text and schema all read
 * from here so a tax-year rollover is one edit, not a search-and-replace.
 *
 * Every figure below is quoted from the official IRS release for that year.
 * Do not add a year without a verified source URL.
 */

export interface RothPhaseOut {
  /** MAGI at which the allowed contribution begins to reduce. */
  start: number;
  /** MAGI at or above which no direct Roth contribution is allowed. */
  end: number;
}

export interface IraLimits {
  taxYear: number;
  /** Base annual IRA contribution limit. */
  under50: number;
  /** Base limit plus the age-50 catch-up. */
  age50Plus: number;
  /** The catch-up component on its own, for display. */
  catchUp: number;
  phaseOut: {
    single: RothPhaseOut;
    mfj: RothPhaseOut;
    /**
     * Applies to a married-filing-separately taxpayer who lived with their
     * spouse at any time during the year. One who lived apart for the entire
     * year is treated as single for this purpose — see `mfsLivedApartIsSingle`.
     */
    mfsLivedWithSpouse: RothPhaseOut;
  };
  /** True where MFS-lived-apart uses the single range. */
  mfsLivedApartIsSingle: boolean;
  source: string;
}

/**
 * 2026 figures.
 * Source: IRS, "401(k) limit increases to $24,500 for 2026; IRA limit increases
 * to $7,500" — verified against irs.gov.
 */
export const IRA_LIMITS_2026: IraLimits = {
  taxYear: 2026,
  under50: 7_500,
  age50Plus: 8_600,
  catchUp: 1_100,
  phaseOut: {
    single: { start: 153_000, end: 168_000 },
    mfj: { start: 242_000, end: 252_000 },
    mfsLivedWithSpouse: { start: 0, end: 10_000 },
  },
  mfsLivedApartIsSingle: true,
  source:
    "https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500",
};

export const IRA_LIMITS_BY_YEAR: Record<number, IraLimits> = {
  2026: IRA_LIMITS_2026,
};

/* ───────────────── Employer-plan (401k/403b/457/TSP) deferrals ──────────── */

export interface ElectiveDeferralLimits {
  taxYear: number;
  /** Employee elective deferral limit, before any catch-up. */
  electiveDeferral: number;
  /** Age-50+ catch-up, on top of the elective deferral limit. */
  catchUp50: number;
  /**
   * SECURE 2.0 "super catch-up" for employees who turn 60, 61, 62 or 63 during
   * the year. It REPLACES catchUp50 for those ages — it is not additive.
   */
  catchUp60to63: number;
  /** Elective deferral + the age-50 catch-up. */
  total50Plus: number;
  /** Elective deferral + the age 60–63 super catch-up. */
  total60to63: number;
  source: string;
}

/**
 * 2026 employer-plan deferral limits.
 * Source: IRS Notice 2025-67 / IRS newsroom release. Previously these figures
 * existed only inside a source-URL string and article prose, so nothing could
 * read them — hence the drift risk. Quote them from here.
 */
export const ELECTIVE_DEFERRAL_LIMITS_2026: ElectiveDeferralLimits = {
  taxYear: 2026,
  electiveDeferral: 24_500,
  catchUp50: 8_000,
  catchUp60to63: 11_250,
  total50Plus: 32_500,
  total60to63: 35_750,
  source:
    "https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500",
};

export const ELECTIVE_DEFERRAL_LIMITS_BY_YEAR: Record<number, ElectiveDeferralLimits> = {
  2026: ELECTIVE_DEFERRAL_LIMITS_2026,
};

/** The tax year the calculators currently present. */
export const CURRENT_IRA_TAX_YEAR = 2026;

export const currentIraLimits = (): IraLimits =>
  IRA_LIMITS_BY_YEAR[CURRENT_IRA_TAX_YEAR];

export const currentElectiveDeferralLimits = (): ElectiveDeferralLimits =>
  ELECTIVE_DEFERRAL_LIMITS_BY_YEAR[CURRENT_IRA_TAX_YEAR];
