/**
 * India capital-gains and Section 195 withholding rates for immovable property
 * sold by a non-resident.
 *
 * IMPORTANT — read before changing any figure here:
 *
 *  - Capital-gains tax and TDS are DIFFERENT calculations. Final tax is charged
 *    on the capital GAIN. Section 195 TDS is withheld by the buyer on the GROSS
 *    SALE CONSIDERATION unless the seller obtains a lower/nil deduction
 *    certificate under section 197. They are not interchangeable and must never
 *    be presented as one number.
 *
 *  - Short-term gains on immovable property have NO special rate. They are
 *    taxed at the seller's applicable slab rate. There is no 30% statutory
 *    STCG rate for property — the 30% figure sometimes quoted is the maximum
 *    marginal slab rate that buyers commonly withhold at, which is a
 *    withholding convention, not the tax rate.
 *
 * Sources: Income-tax Act 1961 ss. 2(42A), 48, 54, 54EC, 111A, 112, 195, 197;
 * Finance Act 2024 (amendment of s.112 effective for transfers on or after
 * 23 July 2024); Finance Act 2022 (surcharge cap on long-term capital gains).
 */

/** Immovable property is long-term when held for MORE than this many months. */
export const LTCG_HOLDING_MONTHS = 24;

/**
 * Long-term capital gains rate on immovable property for transfers on or after
 * 23 July 2024, computed without indexation (Finance Act 2024).
 */
export const LTCG_RATE_POST_JUL_2024 = 0.125;

/** The date from which the 12.5%-without-indexation regime applies. */
export const LTCG_REGIME_CHANGE_DATE = "2024-07-23";

/** Health and education cess, applied on tax plus surcharge. */
export const CESS_RATE = 0.04;

/** Section 54EC bond investment ceiling. */
export const SEC_54EC_CAP = 5_000_000;

/** Window (months from transfer) to invest in Section 54EC bonds. */
export const SEC_54EC_WINDOW_MONTHS = 6;

/** USD 1 million per financial year facility for NRO remittances. */
export const REPATRIATION_LIMIT_USD = 1_000_000;

export interface SurchargeBand {
  /** Upper bound of the band, inclusive. */
  upTo: number;
  rate: number;
}

/**
 * Surcharge bands for an individual under the default (new) regime.
 * Applied to the income-tax amount, not to income.
 */
export const SURCHARGE_BANDS: SurchargeBand[] = [
  { upTo: 5_000_000, rate: 0 },
  { upTo: 10_000_000, rate: 0.1 },
  { upTo: 20_000_000, rate: 0.15 },
  { upTo: Infinity, rate: 0.25 },
];

/**
 * Finance Act 2022 caps the surcharge on long-term capital gains at 15%,
 * regardless of the band the income falls in.
 */
export const LTCG_SURCHARGE_CAP = 0.15;

/**
 * Resolve the surcharge rate for a given income amount.
 *
 * @param amount   The amount used to place the taxpayer in a band.
 * @param isLongTerm Applies the long-term surcharge cap when true.
 */
export function surchargeRate(amount: number, isLongTerm: boolean): number {
  const band = SURCHARGE_BANDS.find((b) => amount <= b.upTo) ?? SURCHARGE_BANDS[0];
  return isLongTerm ? Math.min(band.rate, LTCG_SURCHARGE_CAP) : band.rate;
}

/**
 * The rate a buyer commonly withholds at for a short-term sale by a
 * non-resident: the maximum marginal slab rate. This is a WITHHOLDING
 * convention, not the seller's actual tax rate — the seller's real liability
 * is computed at their own slab rate and reconciled on their return.
 */
export const STCG_WITHHOLDING_CONVENTION_RATE = 0.3;

export const OFFICIAL_SOURCES = {
  incomeTaxDept: "https://www.incometax.gov.in/iec/foportal/",
  section195:
    "https://incometaxindia.gov.in/Pages/acts/income-tax-act.aspx",
  rbiFemaRemittance:
    "https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx",
} as const;
