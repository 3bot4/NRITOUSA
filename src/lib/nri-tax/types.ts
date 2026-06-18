/**
 * NRI Global Wealth & Tax Organizer — data model, enums, and centralized
 * constants. This file is the single source of truth for asset/income types,
 * their reporting characteristics (is it a foreign financial account? real
 * estate? PFIC-risk?), and the FBAR/FATCA threshold numbers used by the
 * educational rules engine in ./rules.ts.
 *
 * EDUCATIONAL ONLY. Nothing here determines a filing obligation. Threshold
 * constants are intentionally centralized so they are easy to verify against
 * the latest official IRS instructions and update in one place.
 */

// ---------------------------------------------------------------------------
// Official source links (used in educational copy and rule `sourceUrl`).
// ---------------------------------------------------------------------------

export const SOURCES = {
  form8938About: "https://www.irs.gov/forms-pubs/about-form-8938",
  form8938Qa:
    "https://www.irs.gov/businesses/corporations/basic-questions-and-answers-on-form-8938",
  form8938DoINeed:
    "https://www.irs.gov/businesses/corporations/do-i-need-to-file-form-8938-statement-of-specified-foreign-financial-assets",
  fbar: "https://www.irs.gov/fbar",
  fincenBsa: "https://bsaefiling.fincen.treas.gov/main.html",
  form8621: "https://www.irs.gov/forms-pubs/about-form-8621",
  form1116: "https://www.irs.gov/forms-pubs/about-form-1116",
  form3520: "https://www.irs.gov/forms-pubs/about-form-3520",
} as const;

// ---------------------------------------------------------------------------
// Profile enums
// ---------------------------------------------------------------------------

export type UsStatus =
  | "citizen"
  | "green_card"
  | "h1b_l1_other_resident"
  | "nonresident"
  | "not_sure";

export type FilingStatus =
  | "single"
  | "married_joint"
  | "married_separate"
  | "head_of_household"
  | "not_sure";

export type LivingLocationForTax = "us" | "abroad" | "both" | "not_sure";

export type IndiaTaxStatus = "nri" | "rnor" | "resident" | "not_sure";

export type OwnershipType =
  | "self"
  | "spouse"
  | "joint"
  | "child"
  | "parent"
  | "entity"
  | "signature_authority_only"
  | "not_sure";

export type HeldDirectlyOrEntity = "direct" | "entity" | "not_sure";

export interface UserProfile {
  userId: string;
  taxYear: number;
  usStatus: UsStatus;
  filingStatus: FilingStatus;
  livingLocationForTax: LivingLocationForTax;
  state: string;
  indiaTaxStatus: IndiaTaxStatus;
  daysInIndia: number | null;
  hasSpouse: boolean;
  spouseUsPersonStatus: UsStatus | "na";
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Asset model
// ---------------------------------------------------------------------------

export type AssetType =
  | "US_CHECKING_SAVINGS"
  | "US_BROKERAGE"
  | "US_STOCKS_ETFS"
  | "US_MUTUAL_FUNDS"
  | "US_401K"
  | "US_IRA"
  | "US_ROTH_IRA"
  | "US_HSA"
  | "US_REAL_ESTATE_PRIMARY"
  | "US_REAL_ESTATE_RENTAL"
  | "INDIA_NRE_ACCOUNT"
  | "INDIA_NRO_ACCOUNT"
  | "INDIA_FCNR"
  | "INDIA_RESIDENT_BANK"
  | "INDIA_FIXED_DEPOSIT"
  | "INDIA_BROKERAGE"
  | "INDIA_STOCKS"
  | "INDIA_MUTUAL_FUNDS"
  | "INDIA_ETF"
  | "INDIA_PPF_EPF_NPS"
  | "INDIA_REAL_ESTATE_PERSONAL"
  | "INDIA_REAL_ESTATE_RENTAL"
  | "INDIA_LAND"
  | "INDIA_PRIVATE_COMPANY"
  | "INDIA_PARTNERSHIP_LLP"
  | "FOREIGN_BANK_OTHER"
  | "FOREIGN_BROKERAGE_OTHER"
  | "FOREIGN_MUTUAL_FUND_ETF_OTHER"
  | "FOREIGN_PENSION_OTHER"
  | "CRYPTO_US_PLATFORM"
  | "CRYPTO_FOREIGN_PLATFORM"
  | "GOLD_JEWELRY_COLLECTIBLES"
  | "OTHER";

export interface AssetItem {
  id: string;
  userId: string;
  taxYear: number;
  assetType: AssetType;
  country: string;
  institutionOrAssetNickname: string;
  currency: string;
  /** Approximate USD-equivalent value at year end. */
  yearEndValue: number | null;
  /** Approximate USD-equivalent maximum value during the year. */
  maximumYearValue: number | null;
  incomeGenerated: number | null;
  taxPaidOrTds: number | null;
  ownershipType: OwnershipType;
  heldDirectlyOrEntity: HeldDirectlyOrEntity;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Income model
// ---------------------------------------------------------------------------

export type IncomeType =
  | "US_WAGES"
  | "US_INTEREST"
  | "US_DIVIDENDS"
  | "US_CAPITAL_GAINS"
  | "US_RENTAL_INCOME"
  | "US_BUSINESS_INCOME"
  | "US_RETIREMENT_DISTRIBUTION"
  | "INDIA_NRE_INTEREST"
  | "INDIA_NRO_INTEREST"
  | "INDIA_FD_INTEREST"
  | "INDIA_DIVIDENDS"
  | "INDIA_CAPITAL_GAINS"
  | "INDIA_RENTAL_INCOME"
  | "INDIA_PROPERTY_SALE"
  | "INDIA_BUSINESS_INCOME"
  | "INDIA_PENSION"
  | "FOREIGN_INTEREST_OTHER"
  | "FOREIGN_DIVIDENDS_OTHER"
  | "FOREIGN_CAPITAL_GAINS_OTHER"
  | "FOREIGN_RENTAL_INCOME_OTHER"
  | "FOREIGN_PENSION_OTHER"
  | "GIFT_OR_INHERITANCE"
  | "OTHER";

export interface IncomeItem {
  id: string;
  userId: string;
  taxYear: number;
  incomeType: IncomeType;
  countrySource: string;
  amount: number | null;
  currency: string;
  taxPaidOrTds: number | null;
  relatedAssetId?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Report model + rule output
// ---------------------------------------------------------------------------

export type RuleCategory = "US Tax" | "US Reporting" | "India Tax" | "Planning";

export type RuleStatus =
  | "Likely not applicable"
  | "Review needed"
  | "May be required"
  | "Not enough information";

export type Severity = "low" | "medium" | "high";

export interface RuleOutput {
  form: string;
  category: RuleCategory;
  status: RuleStatus;
  reason: string;
  sourceUrl?: string;
  severity: Severity;
  relatedAssets: string[];
  relatedIncome: string[];
  disclaimer: string;
}

export type RiskScore = "Low" | "Medium" | "High";

export interface ComputedSummary {
  taxYear: number;
  totals: {
    usAssets: number;
    indiaAssets: number;
    otherForeignAssets: number;
    foreignFinancialAccountsMax: number; // FBAR screening base
    specifiedForeignFinancialAssetsYearEnd: number; // FATCA screening base
    specifiedForeignFinancialAssetsMax: number;
    indiaSourceIncome: number;
    foreignTaxPaidOrTds: number;
  };
  riskScore: RiskScore;
  rules: RuleOutput[];
  cpaQuestions: string[];
  documentChecklist: string[];
  missingInfo: string[];
  nextYearReminders: string[];
}

export interface AnnualReport {
  id: string;
  userId: string;
  taxYear: number;
  computedSummaryJson: ComputedSummary;
  riskScore: RiskScore;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Centralized educational thresholds — VERIFY against latest IRS instructions.
// ---------------------------------------------------------------------------

/** FBAR aggregate trigger (FinCEN Form 114): > $10,000 at any time in the year. */
export const FBAR_THRESHOLD_USD = 10000;

/**
 * FATCA / Form 8938 reporting thresholds (specified persons). These are
 * educational estimates only and should be verified against the latest IRS
 * Form 8938 instructions every year.
 */
export const FATCA_THRESHOLDS = {
  us_single_or_mfs: { year_end: 50000, anytime: 75000 },
  us_mfj: { year_end: 100000, anytime: 150000 },
  abroad_single_or_mfs: { year_end: 200000, anytime: 300000 },
  abroad_mfj: { year_end: 400000, anytime: 600000 },
} as const;

export const THRESHOLDS_VERIFY_NOTE =
  "Thresholds should be verified against the latest IRS instructions.";

// ---------------------------------------------------------------------------
// Asset-type metadata: drives totals and rule screening.
// ---------------------------------------------------------------------------

export interface AssetTypeMeta {
  value: AssetType;
  label: string;
  /** Grouping for UI wizard steps. */
  group: "US" | "India" | "Other Foreign" | "Crypto" | "Other";
  /** Counts toward FBAR foreign financial account screening. */
  isForeignFinancialAccount: boolean;
  /** Counts toward FATCA specified foreign financial asset screening. */
  isFatcaSpecifiedAsset: boolean;
  /** Directly held real estate / physical asset (excluded from FBAR & 8938 financial-asset counts). */
  isRealEstateOrPhysical: boolean;
  /** Possible PFIC / Form 8621 review trigger. */
  isPficRisk: boolean;
  /** Foreign entity interest (Form 5471/8865/8858 + 8938 considerations). */
  isForeignEntity: boolean;
  /** FBAR inclusion needs human review rather than automatic (e.g. foreign crypto). */
  fbarReviewOnly?: boolean;
  defaultCountry: string;
  defaultCurrency: string;
}

export const ASSET_TYPES: AssetTypeMeta[] = [
  // --- US assets (part of wealth map, NOT foreign financial accounts) ---
  m("US_CHECKING_SAVINGS", "US checking / savings", "US", { country: "USA", currency: "USD" }),
  m("US_BROKERAGE", "US brokerage", "US", { country: "USA", currency: "USD" }),
  m("US_STOCKS_ETFS", "US stocks / ETFs", "US", { country: "USA", currency: "USD" }),
  m("US_MUTUAL_FUNDS", "US mutual funds", "US", { country: "USA", currency: "USD" }),
  m("US_401K", "US 401(k)", "US", { country: "USA", currency: "USD" }),
  m("US_IRA", "US IRA (traditional)", "US", { country: "USA", currency: "USD" }),
  m("US_ROTH_IRA", "US Roth IRA", "US", { country: "USA", currency: "USD" }),
  m("US_HSA", "US HSA", "US", { country: "USA", currency: "USD" }),
  m("US_REAL_ESTATE_PRIMARY", "US real estate — primary home", "US", {
    country: "USA",
    currency: "USD",
    realEstate: true,
  }),
  m("US_REAL_ESTATE_RENTAL", "US real estate — rental", "US", {
    country: "USA",
    currency: "USD",
    realEstate: true,
  }),

  // --- India financial accounts ---
  m("INDIA_NRE_ACCOUNT", "India NRE account", "India", { ffa: true, fatca: true }),
  m("INDIA_NRO_ACCOUNT", "India NRO account", "India", { ffa: true, fatca: true }),
  m("INDIA_FCNR", "India FCNR deposit", "India", { ffa: true, fatca: true }),
  m("INDIA_RESIDENT_BANK", "India resident bank account", "India", { ffa: true, fatca: true }),
  m("INDIA_FIXED_DEPOSIT", "India fixed deposit (FD)", "India", { ffa: true, fatca: true }),
  m("INDIA_BROKERAGE", "India brokerage / demat", "India", { ffa: true, fatca: true }),
  m("INDIA_STOCKS", "India stocks (direct)", "India", { fatca: true }),
  m("INDIA_MUTUAL_FUNDS", "India mutual funds", "India", { ffa: true, fatca: true, pfic: true }),
  m("INDIA_ETF", "India ETFs", "India", { ffa: true, fatca: true, pfic: true }),
  m("INDIA_PPF_EPF_NPS", "India PPF / EPF / NPS", "India", { ffa: true, fatca: true }),
  m("INDIA_REAL_ESTATE_PERSONAL", "India real estate — personal", "India", { realEstate: true }),
  m("INDIA_REAL_ESTATE_RENTAL", "India real estate — rental", "India", { realEstate: true }),
  m("INDIA_LAND", "India land", "India", { realEstate: true }),
  m("INDIA_PRIVATE_COMPANY", "India private company shares", "India", { fatca: true, entity: true }),
  m("INDIA_PARTNERSHIP_LLP", "India partnership / LLP", "India", { fatca: true, entity: true }),

  // --- Other foreign ---
  m("FOREIGN_BANK_OTHER", "Other foreign bank account", "Other Foreign", { ffa: true, fatca: true }),
  m("FOREIGN_BROKERAGE_OTHER", "Other foreign brokerage", "Other Foreign", { ffa: true, fatca: true }),
  m("FOREIGN_MUTUAL_FUND_ETF_OTHER", "Other foreign mutual fund / ETF", "Other Foreign", {
    ffa: true,
    fatca: true,
    pfic: true,
  }),
  m("FOREIGN_PENSION_OTHER", "Other foreign pension", "Other Foreign", { ffa: true, fatca: true }),

  // --- Crypto ---
  m("CRYPTO_US_PLATFORM", "Crypto — US platform", "Crypto", { country: "USA", currency: "USD" }),
  m("CRYPTO_FOREIGN_PLATFORM", "Crypto — foreign platform", "Crypto", {
    fatca: true,
    fbarReviewOnly: true,
  }),

  // --- Other ---
  m("GOLD_JEWELRY_COLLECTIBLES", "Gold / jewelry / collectibles", "Other", { realEstate: true }),
  m("OTHER", "Other asset", "Other", {}),
];

/** Compact constructor so the table above stays readable. */
function m(
  value: AssetType,
  label: string,
  group: AssetTypeMeta["group"],
  opts: {
    ffa?: boolean;
    fatca?: boolean;
    realEstate?: boolean;
    pfic?: boolean;
    entity?: boolean;
    fbarReviewOnly?: boolean;
    country?: string;
    currency?: string;
  } = {}
): AssetTypeMeta {
  const isIndia = group === "India";
  return {
    value,
    label,
    group,
    isForeignFinancialAccount: Boolean(opts.ffa),
    isFatcaSpecifiedAsset: Boolean(opts.fatca),
    isRealEstateOrPhysical: Boolean(opts.realEstate),
    isPficRisk: Boolean(opts.pfic),
    isForeignEntity: Boolean(opts.entity),
    fbarReviewOnly: opts.fbarReviewOnly,
    defaultCountry: opts.country ?? (isIndia ? "India" : group === "US" ? "USA" : ""),
    defaultCurrency: opts.currency ?? (isIndia ? "INR" : "USD"),
  };
}

const ASSET_META_BY_TYPE = new Map(ASSET_TYPES.map((a) => [a.value, a]));
export const assetMeta = (t: AssetType): AssetTypeMeta =>
  ASSET_META_BY_TYPE.get(t) ?? ASSET_META_BY_TYPE.get("OTHER")!;

// ---------------------------------------------------------------------------
// Income-type metadata.
// ---------------------------------------------------------------------------

export interface IncomeTypeMeta {
  value: IncomeType;
  label: string;
  source: "US" | "India" | "Other Foreign" | "Other";
}

export const INCOME_TYPES: IncomeTypeMeta[] = [
  inc("US_WAGES", "US wages", "US"),
  inc("US_INTEREST", "US interest", "US"),
  inc("US_DIVIDENDS", "US dividends", "US"),
  inc("US_CAPITAL_GAINS", "US capital gains", "US"),
  inc("US_RENTAL_INCOME", "US rental income", "US"),
  inc("US_BUSINESS_INCOME", "US business income", "US"),
  inc("US_RETIREMENT_DISTRIBUTION", "US retirement distribution", "US"),
  inc("INDIA_NRE_INTEREST", "India NRE interest", "India"),
  inc("INDIA_NRO_INTEREST", "India NRO interest", "India"),
  inc("INDIA_FD_INTEREST", "India FD interest", "India"),
  inc("INDIA_DIVIDENDS", "India dividends", "India"),
  inc("INDIA_CAPITAL_GAINS", "India capital gains", "India"),
  inc("INDIA_RENTAL_INCOME", "India rental income", "India"),
  inc("INDIA_PROPERTY_SALE", "India property sale", "India"),
  inc("INDIA_BUSINESS_INCOME", "India business income", "India"),
  inc("INDIA_PENSION", "India pension", "India"),
  inc("FOREIGN_INTEREST_OTHER", "Other foreign interest", "Other Foreign"),
  inc("FOREIGN_DIVIDENDS_OTHER", "Other foreign dividends", "Other Foreign"),
  inc("FOREIGN_CAPITAL_GAINS_OTHER", "Other foreign capital gains", "Other Foreign"),
  inc("FOREIGN_RENTAL_INCOME_OTHER", "Other foreign rental income", "Other Foreign"),
  inc("FOREIGN_PENSION_OTHER", "Other foreign pension", "Other Foreign"),
  inc("GIFT_OR_INHERITANCE", "Gift or inheritance", "Other"),
  inc("OTHER", "Other income", "Other"),
];

function inc(value: IncomeType, label: string, source: IncomeTypeMeta["source"]): IncomeTypeMeta {
  return { value, label, source };
}

const INCOME_META_BY_TYPE = new Map(INCOME_TYPES.map((i) => [i.value, i]));
export const incomeMeta = (t: IncomeType): IncomeTypeMeta =>
  INCOME_META_BY_TYPE.get(t) ?? INCOME_META_BY_TYPE.get("OTHER")!;

// ---------------------------------------------------------------------------
// Shared option lists for selects.
// ---------------------------------------------------------------------------

export const US_STATUS_OPTIONS: { value: UsStatus; label: string }[] = [
  { value: "citizen", label: "U.S. citizen" },
  { value: "green_card", label: "Green card holder" },
  { value: "h1b_l1_other_resident", label: "H-1B / L-1 / other resident for tax" },
  { value: "nonresident", label: "Nonresident" },
  { value: "not_sure", label: "Not sure" },
];

export const FILING_STATUS_OPTIONS: { value: FilingStatus; label: string }[] = [
  { value: "single", label: "Single" },
  { value: "married_joint", label: "Married filing jointly" },
  { value: "married_separate", label: "Married filing separately" },
  { value: "head_of_household", label: "Head of household" },
  { value: "not_sure", label: "Not sure" },
];

export const LIVING_LOCATION_OPTIONS: { value: LivingLocationForTax; label: string }[] = [
  { value: "us", label: "Living in the U.S." },
  { value: "abroad", label: "Living abroad" },
  { value: "both", label: "Both / split year" },
  { value: "not_sure", label: "Not sure" },
];

export const INDIA_TAX_STATUS_OPTIONS: { value: IndiaTaxStatus; label: string }[] = [
  { value: "nri", label: "NRI" },
  { value: "rnor", label: "RNOR" },
  { value: "resident", label: "Resident" },
  { value: "not_sure", label: "Not sure" },
];

export const OWNERSHIP_OPTIONS: { value: OwnershipType; label: string }[] = [
  { value: "self", label: "Self" },
  { value: "spouse", label: "Spouse" },
  { value: "joint", label: "Joint" },
  { value: "child", label: "Child" },
  { value: "parent", label: "Parent" },
  { value: "entity", label: "Entity" },
  { value: "signature_authority_only", label: "Signature authority only" },
  { value: "not_sure", label: "Not sure" },
];

export const HELD_OPTIONS: { value: HeldDirectlyOrEntity; label: string }[] = [
  { value: "direct", label: "Held directly" },
  { value: "entity", label: "Held through an entity" },
  { value: "not_sure", label: "Not sure" },
];

/** The single educational disclaimer reused across rules, screens, and PDF. */
export const TOOL_DISCLAIMER =
  "This report is for educational and organizational purposes only. It is not tax, legal, financial, or investment advice. NRItoUSA does not prepare tax returns or determine filing obligations. U.S. and India tax rules are complex and change over time. Review this report with a qualified U.S. CPA, Enrolled Agent, Indian CA, attorney, or financial professional before making decisions or filing forms.";
