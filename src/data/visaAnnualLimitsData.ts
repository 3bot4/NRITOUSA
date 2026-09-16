/**
 * Statutory annual-limit math for immigrant visa numbers — the supply side of
 * the Visa Bulletin.
 *
 * Source of truth for every allocation figure quoted in the visa-bulletin
 * cluster. The percentages and floors are set by statute (INA §201, §202, §203)
 * and change only when Congress acts, which is why they are safe to commit;
 * the per-year POOL is not statutory and is republished by DOS each fiscal
 * year, so it lives in `fiscalYears` with an explicit source and status.
 *
 * Everything derivable is DERIVED here rather than typed, so a change to the
 * floor or a share cannot leave a stale number behind in page copy. Content
 * must interpolate from this module — never hardcode an allocation figure.
 *
 * What deliberately is NOT here: actual visas ISSUED per country per category.
 * Those come from the annual Report of the Visa Office, which lags the fiscal
 * year by months. Asserting an issuance total for a year that has not been
 * reported is unsourceable, and a test on the October predictions page already
 * blocks one such claim.
 */

/** Minimum worldwide employment-based level, INA §201(d)(1)(A). */
export const EB_WORLDWIDE_FLOOR = 140_000;

/** Minimum worldwide family-sponsored level, INA §201(c)(1)(B)(ii). */
export const FAMILY_WORLDWIDE_FLOOR = 226_000;

/** Per-country ceiling, INA §202(a)(2) — 7% of the year's total. */
export const PER_COUNTRY_SHARE = 0.07;

export interface EbCategoryAllocation {
  key: "eb1" | "eb2" | "eb3" | "eb4" | "eb5";
  label: string;
  /** Statutory share of the worldwide employment-based level, INA §203(b). */
  share: number;
  /** Where this category's spillover comes from, in plain words. */
  spillover: string;
  statute: string;
}

/**
 * INA §203(b). The three professional categories take 28.6% each; EB-4 and
 * EB-5 take 7.1% each. Shares sum to 100%.
 */
export const EB_ALLOCATIONS: EbCategoryAllocation[] = [
  {
    key: "eb1",
    label: "EB-1 (priority workers)",
    share: 0.286,
    spillover: "Receives family-sponsored numbers unused in the prior year.",
    statute: "INA §203(b)(1)",
  },
  {
    key: "eb2",
    label: "EB-2 (advanced degree / exceptional ability)",
    share: 0.286,
    spillover: "Receives EB-1 numbers left unused in the same year.",
    statute: "INA §203(b)(2)",
  },
  {
    key: "eb3",
    label: "EB-3 (skilled workers / professionals)",
    share: 0.286,
    spillover: "Receives EB-1 and EB-2 numbers left unused in the same year.",
    statute: "INA §203(b)(3)",
  },
  {
    key: "eb4",
    label: "EB-4 (special immigrants)",
    share: 0.071,
    spillover: "No downward spillover into EB-4.",
    statute: "INA §203(b)(4)",
  },
  {
    key: "eb5",
    label: "EB-5 (investors)",
    share: 0.071,
    spillover:
      "Unused reserved set-aside numbers roll into the following year's same set-aside before falling to unreserved.",
    statute: "INA §203(b)(5)",
  },
];

/** EB-5 reserved set-asides created by the EB-5 Reform and Integrity Act (2022). */
export const EB5_SET_ASIDES = [
  { key: "rural", label: "Rural", share: 0.2 },
  { key: "highUnemployment", label: "High Unemployment", share: 0.1 },
  { key: "infrastructure", label: "Infrastructure", share: 0.02 },
] as const;

export interface FiscalYearPool {
  fiscalYear: number;
  /** Total employment-based numbers available, or null when DOS has not published it. */
  ebPool: number | null;
  /** How the pool was arrived at, in plain words. */
  basis: string;
  status: "published" | "awaiting-dos";
  source: string;
  sourceLabel: string;
}

/**
 * The employment-based pool actually available each year = the 140,000 floor
 * plus family-sponsored numbers unused in the PRIOR year. That fall-up is what
 * makes the real number move, and it is not knowable in advance — which is why
 * no forecast can promise a specific cutoff date.
 */
export const fiscalYears: FiscalYearPool[] = [
  {
    fiscalYear: 2026,
    ebPool: 186_000,
    basis: "140,000 statutory floor plus roughly 46,000 in unused family-sponsored numbers falling up from FY2025.",
    status: "published",
    source: "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html",
    sourceLabel: "U.S. Department of State Visa Bulletin",
  },
  {
    fiscalYear: 2027,
    ebPool: null,
    basis:
      "Not yet published. DOS states the year's employment-based limit in the Visa Bulletin after the fiscal year opens on October 1; until then the 140,000 floor is the only figure with statutory backing.",
    status: "awaiting-dos",
    source: "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html",
    sourceLabel: "U.S. Department of State Visa Bulletin",
  },
];

/* ----------------------------- derived math ------------------------------ */

export const getFiscalYear = (fy: number): FiscalYearPool | undefined =>
  fiscalYears.find((f) => f.fiscalYear === fy);

/** Worldwide numbers for one category out of a given pool. */
export const categoryAllocation = (share: number, pool: number): number =>
  Math.round(share * pool);

/**
 * The per-country floor for one category: 7% of that category's worldwide
 * allocation.
 *
 * Read this as a FLOOR, not a quota. INA §202(a)(5) lets numbers that would
 * otherwise go unused be issued to nationals of oversubscribed countries, so
 * India routinely receives well above its 7% share — which is precisely why the
 * cutoff dates move at all.
 */
export const perCountryFloor = (share: number, pool: number): number =>
  // Floored, not rounded: a floor that rounds up overstates the entitlement,
  // and it keeps this in step with the figure the cluster already publishes
  // (7% of EB-2's 40,040 → 2,802).
  Math.floor(PER_COUNTRY_SHARE * categoryAllocation(share, pool));

/** Formats a count the way the bulletin copy does: "40,040". */
export const fmt = (n: number): string => n.toLocaleString("en-US");

/** "28.6%" from 0.286, without floating-point noise. */
export const pct = (share: number): string =>
  `${Number((share * 100).toFixed(1))}%`;

/** Last human re-verification of the statutory figures above. */
export const ANNUAL_LIMITS_LAST_VERIFIED = "2026-09-16";
