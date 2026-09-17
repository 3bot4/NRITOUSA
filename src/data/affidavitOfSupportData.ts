/**
 * Form I-864 / I-864P — Affidavit of Support source of truth.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * REFRESH: the poverty-guideline tables change ONCE A YEAR. HHS publishes the
 * new guidelines in the Federal Register in January; USCIS then issues a new
 * Form I-864P edition that takes effect around 1 March. Between the Federal
 * Register notice and the I-864P effective date the OLD table is still the one
 * USCIS applies — so always take the numbers from I-864P itself, never from the
 * HHS notice directly, and never from a law-firm page.
 *
 * Verify at https://www.uscis.gov/i-864p and bump `i864pEffective` +
 * `lastVerified` together. The co-located test asserts every 125% figure is
 * exactly 1.25 × the published 100% figure, so a mistyped row fails the build.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Educational only. Not legal advice.
 */

export const I864_SOURCES = {
  i864p: "https://www.uscis.gov/i-864p",
  i864: "https://www.uscis.gov/i-864",
  i864a: "https://www.uscis.gov/i-864a",
  policyManual: "https://www.uscis.gov/policy-manual/volume-8-part-g-chapter-6",
  hhsGuidelines:
    "https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines",
  federalRegister2026:
    "https://www.federalregister.gov/documents/2026/01/15/2026-00755/annual-update-of-the-hhs-poverty-guidelines",
  cfr213a:
    "https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-213a/section-213a.2",
  affidavitOverview:
    "https://www.uscis.gov/green-card/green-card-processes-and-procedures/affidavit-of-support",
} as const;

/** Edition of Form I-864P these tables come from. */
export const I864P = {
  /** Date this edition of the poverty guidelines took effect for I-864 purposes. */
  effective: "2026-03-01",
  /** Calendar year of the underlying HHS guidelines. */
  guidelineYear: 2026,
  /** Date a human last reopened uscis.gov/i-864p and compared every row. */
  lastVerified: "2026-09-16",
} as const;

export type I864Location = "contiguous" | "alaska" | "hawaii";

export interface LocationTable {
  id: I864Location;
  label: string;
  /** Short label for charts / compact UI. */
  shortLabel: string;
  /**
   * 100% of the Federal Poverty Guidelines by household size, index 0 = size 1.
   * Published by HHS; reproduced on Form I-864P.
   */
  base: number[];
  /** Amount added per person beyond household size 8, at 100%. */
  basePerExtra: number;
}

/**
 * 2026 HHS poverty guidelines as reproduced on Form I-864P (effective
 * 1 March 2026). Household sizes 1–8; sizes above 8 add `basePerExtra`.
 *
 * Form I-864P prints the 125% and 100% tables directly; we store the 100% base
 * and derive, because deriving cannot drift out of sync with itself. The test
 * pins the derived 125% values against the figures printed on I-864P.
 */
export const I864_TABLES: Record<I864Location, LocationTable> = {
  contiguous: {
    id: "contiguous",
    label:
      "48 contiguous states, DC, Puerto Rico, US Virgin Islands, Guam and the Northern Mariana Islands",
    shortLabel: "48 states & DC",
    base: [15_960, 21_640, 27_320, 33_000, 38_680, 44_360, 50_040, 55_720],
    basePerExtra: 5_680,
  },
  alaska: {
    id: "alaska",
    label: "Alaska",
    shortLabel: "Alaska",
    base: [19_950, 27_050, 34_150, 41_250, 48_350, 55_450, 62_550, 69_650],
    basePerExtra: 7_100,
  },
  hawaii: {
    id: "hawaii",
    label: "Hawaii",
    shortLabel: "Hawaii",
    base: [18_360, 24_890, 31_420, 37_950, 44_480, 51_010, 57_540, 64_070],
    basePerExtra: 6_530,
  },
};

export const I864_LOCATIONS: LocationTable[] = [
  I864_TABLES.contiguous,
  I864_TABLES.alaska,
  I864_TABLES.hawaii,
];

/**
 * The 125% figures exactly as printed on Form I-864P for the 48 contiguous
 * states, sizes 2–8. Kept as literals ONLY so the test can pin the derived
 * values against what USCIS actually prints — never render these directly.
 */
export const I864P_PRINTED_125_CONTIGUOUS: Record<number, number> = {
  2: 27_050,
  3: 34_150,
  4: 41_250,
  5: 48_350,
  6: 55_450,
  7: 62_550,
  8: 69_650,
};

/** Multiplier applied to the poverty guideline for a standard sponsor. */
export const STANDARD_MULTIPLIER = 1.25;
/**
 * Active-duty sponsors petitioning their own spouse or child are held to 100%
 * rather than 125% (INA 213A(f)(3)). It does NOT apply to a joint sponsor who
 * happens to be in the military, or to an active-duty sponsor petitioning a
 * parent or sibling.
 */
export const MILITARY_MULTIPLIER = 1.0;

/**
 * Net-asset multiples from 8 CFR 213a.2(c)(2)(iii)(B). Assets must cover the
 * shortfall this many times over.
 */
export type AssetCase = "spouse-or-child-of-usc" | "orphan" | "other";

export interface AssetRule {
  id: AssetCase;
  multiple: number;
  label: string;
  detail: string;
}

export const ASSET_RULES: Record<AssetCase, AssetRule> = {
  "spouse-or-child-of-usc": {
    id: "spouse-or-child-of-usc",
    multiple: 3,
    label: "Spouse or child of a US citizen",
    detail:
      "Where the intending immigrant is the spouse, or a child aged 18 or over, of a US citizen, the net value of the assets only has to be three times the shortfall.",
  },
  orphan: {
    id: "orphan",
    multiple: 1,
    label: "Orphan adopted abroad who acquires citizenship on entry",
    detail:
      "For an orphan adopted abroad who will acquire US citizenship on entry, the assets only have to equal the shortfall itself.",
  },
  other: {
    id: "other",
    multiple: 5,
    label: "Every other case",
    detail:
      "In every other case — a parent, a sibling, an adult married child, or any case where the sponsor is a permanent resident rather than a citizen — the net value of the assets must be five times the shortfall.",
  },
};

export const ASSET_RULE_LIST: AssetRule[] = [
  ASSET_RULES["spouse-or-child-of-usc"],
  ASSET_RULES.orphan,
  ASSET_RULES.other,
];

/* ── Household-size components, in the order the tool asks for them ──────── */

export interface HouseholdComponent {
  id: string;
  label: string;
  help: string;
  /** Always counted, cannot be switched off. */
  fixed?: boolean;
}

export const HOUSEHOLD_COMPONENTS: HouseholdComponent[] = [
  {
    id: "self",
    label: "You, the sponsor",
    help: "You always count yourself, even if someone else in the house earns more.",
    fixed: true,
  },
  {
    id: "spouse",
    label: "Your spouse",
    help: "Count your spouse if you are married, whether or not they have any income and whether or not they are the person you are sponsoring.",
  },
  {
    id: "children",
    label: "Your unmarried children under 21",
    help: "Count them even if they do not live with you, unless they have reached 21 or married.",
  },
  {
    id: "dependents",
    label: "Anyone else you claimed as a dependent on your last tax return",
    help: "A parent, an adult child in college, any dependent on the return — but do not double-count anyone you have already added above.",
  },
  {
    id: "immigrants",
    label: "Everyone you are sponsoring on this affidavit",
    help: "The principal immigrant plus any spouse or children immigrating with them. This is the number most people forget.",
  },
  {
    id: "priorObligations",
    label: "Anyone still covered by an I-864 you signed before",
    help: "An earlier affidavit keeps counting until that person naturalises, is credited with 40 qualifying quarters of work, permanently leaves the US, or dies.",
  },
];

/* ── Dated facts used in copy, so no number is written inline in JSX ─────── */

export const I864_FACTS = {
  /** USCIS charges nothing to file the I-864 itself. */
  uscisFilingFee: "$0",
  uscisFilingFeeNote:
    "USCIS charges no filing fee for Form I-864 — it is submitted with the immigrant's application. The Department of State does charge a separate affidavit-of-support review fee when the case runs through the National Visa Center.",
  /** DOS affidavit of support review fee — mirrors src/data/nvcData.ts. */
  nvcReviewFee: "$120",
  /** 8 CFR 213a.2(c)(2)(i)(A) — most recent taxable year is mandatory. */
  taxYearsRequired: "the most recent tax year",
  taxYearsOptional: "the three most recent tax years",
  /** How long the obligation lasts. */
  quartersToEnd: 40,
  feeSourceUrl: I864_SOURCES.i864p,
  lastVerified: I864P.lastVerified,
} as const;
