/**
 * NRI Global Wealth & Tax Organizer — educational rules engine.
 *
 * Pure functions only. No React, no I/O. Given a profile + asset/income items,
 * it computes wealth totals, screens against FBAR/FATCA/PFIC/FTC/Form 3520
 * topics, and produces an educational checklist of "review needed / may be
 * required" flags, CPA/CA questions, and a document checklist.
 *
 * It NEVER makes a final filing determination. Every flag is phrased as a
 * topic to review with a qualified professional, and carries a disclaimer.
 */

import {
  ASSET_TYPES,
  assetMeta,
  FATCA_THRESHOLDS,
  FBAR_THRESHOLD_USD,
  incomeMeta,
  SOURCES,
  THRESHOLDS_VERIFY_NOTE,
  TOOL_DISCLAIMER,
  type AssetItem,
  type AssetType,
  type ComputedSummary,
  type IncomeItem,
  type IncomeType,
  type RiskScore,
  type RuleOutput,
  type UserProfile,
} from "./types";

const D = TOOL_DISCLAIMER;

const num = (v: number | null | undefined): number =>
  typeof v === "number" && Number.isFinite(v) ? v : 0;

/** FBAR uses the maximum value during the year (fall back to year-end). */
const fbarValue = (a: AssetItem): number => num(a.maximumYearValue) || num(a.yearEndValue);

/** Is this user a U.S. person for the educational screening (FBAR/8938 apply)? */
function isUsPerson(profile: UserProfile): boolean {
  return (
    profile.usStatus === "citizen" ||
    profile.usStatus === "green_card" ||
    profile.usStatus === "h1b_l1_other_resident" ||
    profile.usStatus === "not_sure"
  );
}

// ---------------------------------------------------------------------------
// Totals
// ---------------------------------------------------------------------------

export function computeTotals(
  profile: UserProfile,
  assets: AssetItem[],
  income: IncomeItem[]
): ComputedSummary["totals"] {
  let usAssets = 0;
  let indiaAssets = 0;
  let otherForeignAssets = 0;
  let foreignFinancialAccountsMax = 0;
  let specifiedForeignFinancialAssetsYearEnd = 0;
  let specifiedForeignFinancialAssetsMax = 0;

  for (const a of assets) {
    const meta = assetMeta(a.assetType);
    const ye = num(a.yearEndValue);
    const mx = fbarValue(a);

    if (meta.group === "US" || a.assetType === "CRYPTO_US_PLATFORM") usAssets += ye || mx;
    else if (meta.group === "India") indiaAssets += ye || mx;
    else otherForeignAssets += ye || mx;

    // FBAR base: foreign financial accounts, excluding directly-held real estate
    // /physical assets. Foreign crypto is review-only, so it is NOT auto-counted.
    if (meta.isForeignFinancialAccount && !meta.isRealEstateOrPhysical && !meta.fbarReviewOnly) {
      foreignFinancialAccountsMax += mx;
    }

    // FATCA base: specified foreign financial assets.
    // Directly-held real estate is excluded. Entity-held real estate counts
    // because the reportable item is the foreign entity interest, not the land.
    const isFatcaEligible =
      (meta.isFatcaSpecifiedAsset && !meta.isRealEstateOrPhysical) ||
      (meta.isRealEstateOrPhysical && a.heldDirectlyOrEntity === "entity");
    if (isFatcaEligible) {
      specifiedForeignFinancialAssetsYearEnd += ye;
      specifiedForeignFinancialAssetsMax += mx;
    }
  }

  let indiaSourceIncome = 0;
  let foreignTaxPaidOrTds = 0;
  for (const i of income) {
    if (incomeMeta(i.incomeType).source === "India") indiaSourceIncome += num(i.amount);
    // Form 1116 total: use income-level TDS only, not asset-level,
    // to avoid double-counting when users enter TDS in both places.
    if (incomeMeta(i.incomeType).source !== "US") foreignTaxPaidOrTds += num(i.taxPaidOrTds);
  }

  return {
    usAssets,
    indiaAssets,
    otherForeignAssets,
    foreignFinancialAccountsMax,
    specifiedForeignFinancialAssetsYearEnd,
    specifiedForeignFinancialAssetsMax,
    indiaSourceIncome,
    foreignTaxPaidOrTds,
  };
}

// ---------------------------------------------------------------------------
// FATCA threshold selection
// ---------------------------------------------------------------------------

export function fatcaThresholdFor(profile: UserProfile): {
  key: keyof typeof FATCA_THRESHOLDS;
  year_end: number;
  anytime: number;
} {
  const abroad = profile.livingLocationForTax === "abroad";
  const mfj = profile.filingStatus === "married_joint";
  const key: keyof typeof FATCA_THRESHOLDS = abroad
    ? mfj
      ? "abroad_mfj"
      : "abroad_single_or_mfs_or_hoh"
    : mfj
      ? "us_mfj"
      : "us_single_or_mfs_or_hoh";
  return { key, ...FATCA_THRESHOLDS[key] };
}

// ---------------------------------------------------------------------------
// Rules engine
// ---------------------------------------------------------------------------

export function runRules(
  profile: UserProfile,
  assets: AssetItem[],
  income: IncomeItem[]
): RuleOutput[] {
  const out: RuleOutput[] = [];
  const totals = computeTotals(profile, assets, income);
  const usPerson = isUsPerson(profile);

  const nick = (a: AssetItem) => a.institutionOrAssetNickname || assetMeta(a.assetType).label;
  const incLabel = (i: IncomeItem) => incomeMeta(i.incomeType).label;

  const assetsOfTypes = (types: AssetType[]) =>
    assets.filter((a) => types.includes(a.assetType));
  const incomeOfTypes = (types: IncomeType[]) =>
    income.filter((i) => types.includes(i.incomeType));

  // --- A. FBAR screening -----------------------------------------------------
  {
    const ffaAssets = assets.filter((a) => {
      const meta = assetMeta(a.assetType);
      return meta.isForeignFinancialAccount && !meta.isRealEstateOrPhysical && !meta.fbarReviewOnly;
    });
    const sigAuthOnly = ffaAssets.filter((a) => a.ownershipType === "signature_authority_only");
    const related = ffaAssets.map(nick);

    if (!usPerson) {
      out.push({
        form: "FBAR (FinCEN Form 114)",
        category: "US Reporting",
        status: "Not enough information",
        reason:
          "FBAR generally applies to U.S. persons. Your U.S. status is set to nonresident, so confirm whether you are a U.S. person for the year before screening.",
        sourceUrl: SOURCES.fbar,
        severity: "low",
        relatedAssets: related,
        relatedIncome: [],
        disclaimer: D,
      });
    } else if (ffaAssets.length === 0) {
      out.push({
        form: "FBAR (FinCEN Form 114)",
        category: "US Reporting",
        status: "Likely not applicable",
        reason:
          "No foreign financial accounts entered yet. FBAR screening counts foreign bank, brokerage, and similar accounts — not directly-held real estate, land, or gold/jewelry.",
        sourceUrl: SOURCES.fbar,
        severity: "low",
        relatedAssets: [],
        relatedIncome: [],
        disclaimer: D,
      });
    } else if (totals.foreignFinancialAccountsMax > FBAR_THRESHOLD_USD) {
      out.push({
        form: "FBAR (FinCEN Form 114)",
        category: "US Reporting",
        status: "May be required",
        reason: `Your foreign financial accounts have a combined maximum of about $${fmt(
          totals.foreignFinancialAccountsMax
        )} during the year, which is above the $10,000 aggregate screening line. Account income does not determine FBAR — the maximum balance does.${
          sigAuthOnly.length
            ? " Accounts where you only have signature authority are still included for the FBAR review."
            : ""
        }`,
        sourceUrl: SOURCES.fbar,
        severity: "high",
        relatedAssets: related,
        relatedIncome: [],
        disclaimer: D,
      });
    } else if (totals.foreignFinancialAccountsMax === FBAR_THRESHOLD_USD) {
      out.push({
        form: "FBAR (FinCEN Form 114)",
        category: "US Reporting",
        status: "Review needed",
        reason: `Your foreign financial accounts combine to exactly $${fmt(
          FBAR_THRESHOLD_USD
        )} maximum — right at the $10,000 screening line. FBAR is required only when the total exceeds $10,000, not when it equals $10,000 exactly. Review values with your CPA to confirm accuracy, especially if any accounts are approximate.`,
        sourceUrl: SOURCES.fbar,
        severity: "medium",
        relatedAssets: related,
        relatedIncome: [],
        disclaimer: D,
      });
    } else {
      out.push({
        form: "FBAR (FinCEN Form 114)",
        category: "US Reporting",
        status: "Review needed",
        reason: `Your foreign financial accounts combine to about $${fmt(
          totals.foreignFinancialAccountsMax
        )} maximum during the year, which is below the $10,000 screening line. Because the maximum (not year-end) value matters and small accounts add up, confirm the total with your CPA.`,
        sourceUrl: SOURCES.fbar,
        severity: "medium",
        relatedAssets: related,
        relatedIncome: [],
        disclaimer: D,
      });
    }

    // Foreign crypto is review-only, never auto-counted.
    const foreignCrypto = assetsOfTypes(["CRYPTO_FOREIGN_PLATFORM"]);
    if (foreignCrypto.length) {
      out.push({
        form: "FBAR — foreign crypto",
        category: "US Reporting",
        status: "Review needed",
        reason:
          "You hold crypto on a foreign platform. Whether foreign-held crypto counts as a reportable foreign financial account is an evolving area — review it specifically with your CPA rather than assuming it is or isn't included.",
        sourceUrl: SOURCES.fbar,
        severity: "medium",
        relatedAssets: foreignCrypto.map(nick),
        relatedIncome: [],
        disclaimer: D,
      });
    }
  }

  // --- B. FATCA / Form 8938 screening ---------------------------------------
  {
    const fatcaAssets = assets.filter((a) => {
      const meta = assetMeta(a.assetType);
      return meta.isFatcaSpecifiedAsset && !meta.isRealEstateOrPhysical;
    });
    const related = fatcaAssets.map(nick);
    const thr = fatcaThresholdFor(profile);
    const overYearEnd = totals.specifiedForeignFinancialAssetsYearEnd > thr.year_end;
    const overAnytime = totals.specifiedForeignFinancialAssetsMax > thr.anytime;
    const atYearEnd = totals.specifiedForeignFinancialAssetsYearEnd === thr.year_end;
    const atAnytime = totals.specifiedForeignFinancialAssetsMax === thr.anytime;
    const isAbroadThreshold = profile.livingLocationForTax === "abroad";
    const abroadNote = isAbroadThreshold
      ? " Higher abroad thresholds should be used only if you meet IRS living-abroad / presence-abroad rules."
      : "";

    if (!usPerson) {
      out.push({
        form: "FATCA / Form 8938",
        category: "US Reporting",
        status: "Not enough information",
        reason:
          "Form 8938 applies to specified persons. Confirm your U.S. tax-resident status before applying thresholds.",
        sourceUrl: SOURCES.form8938DoINeed,
        severity: "low",
        relatedAssets: related,
        relatedIncome: [],
        disclaimer: D,
      });
    } else if (fatcaAssets.length === 0) {
      out.push({
        form: "FATCA / Form 8938",
        category: "US Reporting",
        status: "Likely not applicable",
        reason:
          "No specified foreign financial assets entered yet. Directly-held foreign real estate is generally not a specified foreign financial asset for Form 8938.",
        sourceUrl: SOURCES.form8938About,
        severity: "low",
        relatedAssets: [],
        relatedIncome: [],
        disclaimer: D,
      });
    } else if (profile.filingStatus === "not_sure" || profile.livingLocationForTax === "not_sure") {
      out.push({
        form: "FATCA / Form 8938",
        category: "US Reporting",
        status: "Not enough information",
        reason: `Form 8938 thresholds depend on filing status and whether you live in the U.S. or abroad. Complete those profile fields for an educational estimate. ${THRESHOLDS_VERIFY_NOTE}`,
        sourceUrl: SOURCES.form8938DoINeed,
        severity: "medium",
        relatedAssets: related,
        relatedIncome: [],
        disclaimer: D,
      });
    } else if (overYearEnd || overAnytime) {
      out.push({
        form: "FATCA / Form 8938",
        category: "US Reporting",
        status: "May be required",
        reason: `Your specified foreign financial assets (about $${fmt(
          totals.specifiedForeignFinancialAssetsYearEnd
        )} at year-end / $${fmt(
          totals.specifiedForeignFinancialAssetsMax
        )} maximum) appear above the educational Form 8938 threshold for your situation ($${fmt(
          thr.year_end
        )} year-end / $${fmt(thr.anytime)} anytime).${abroadNote} ${THRESHOLDS_VERIFY_NOTE}`,
        sourceUrl: SOURCES.form8938Qa,
        severity: "high",
        relatedAssets: related,
        relatedIncome: [],
        disclaimer: D,
      });
    } else if (atYearEnd || atAnytime) {
      out.push({
        form: "FATCA / Form 8938",
        category: "US Reporting",
        status: "Review needed",
        reason: `Your specified foreign financial assets are about $${fmt(
          totals.specifiedForeignFinancialAssetsYearEnd
        )} at year-end / $${fmt(
          totals.specifiedForeignFinancialAssetsMax
        )} maximum — exactly at the Form 8938 threshold for your situation ($${fmt(
          thr.year_end
        )} year-end / $${fmt(thr.anytime)} anytime). Form 8938 triggers only when values exceed (not equal) the threshold, so this does not appear required based on entered numbers. Review values with your CPA to confirm accuracy.${abroadNote} ${THRESHOLDS_VERIFY_NOTE}`,
        sourceUrl: SOURCES.form8938DoINeed,
        severity: "medium",
        relatedAssets: related,
        relatedIncome: [],
        disclaimer: D,
      });
    } else {
      out.push({
        form: "FATCA / Form 8938",
        category: "US Reporting",
        status: "Review needed",
        reason: `Your specified foreign financial assets are about $${fmt(
          totals.specifiedForeignFinancialAssetsYearEnd
        )} at year-end / $${fmt(
          totals.specifiedForeignFinancialAssetsMax
        )} maximum during the year. Based on entered values, this appears below the educational Form 8938 threshold for your situation ($${fmt(
          thr.year_end
        )} year-end / $${fmt(thr.anytime)} anytime). Confirm with your CPA, especially if values are approximate.${abroadNote} ${THRESHOLDS_VERIFY_NOTE}`,
        sourceUrl: SOURCES.form8938DoINeed,
        severity: "low",
        relatedAssets: related,
        relatedIncome: [],
        disclaimer: D,
      });
    }

    // Real estate clarification flag.
    const foreignRe = assets.filter(
      (a) => assetMeta(a.assetType).group === "India" && assetMeta(a.assetType).isRealEstateOrPhysical
    );
    if (foreignRe.length) {
      out.push({
        form: "Foreign real estate (Form 8938 note)",
        category: "US Reporting",
        status: "Review needed",
        reason:
          "Directly-held foreign real estate is generally NOT reported directly on Form 8938. The real estate itself may not be separately reported on Form 8938, but if the property is held through a foreign corporation, partnership, LLP, trust, estate, or other entity, the foreign entity interest may be reportable on Form 8938 (and may trigger Forms 5471/8865/8858) — its value may include the underlying real estate. Rental income and a property sale can also create U.S. tax and reporting obligations.",
        sourceUrl: SOURCES.form8938Qa,
        severity: "medium",
        relatedAssets: foreignRe.map(nick),
        relatedIncome: [],
        disclaimer: D,
      });
    }
  }

  // --- C. PFIC / Form 8621 ---------------------------------------------------
  {
    const pficAssets = assets.filter((a) => assetMeta(a.assetType).isPficRisk);
    if (pficAssets.length) {
      out.push({
        form: "PFIC / Form 8621",
        category: "US Reporting",
        status: "Review needed",
        reason:
          "You hold foreign mutual funds / ETFs / pooled investments, which are commonly Passive Foreign Investment Companies (PFICs). PFIC classification and the related Form 8621 reporting and elections are complex — this is a possible PFIC/Form 8621 review, not a final classification. Review with a qualified U.S. tax professional.",
        sourceUrl: SOURCES.form8621,
        severity: "high",
        relatedAssets: pficAssets.map(nick),
        relatedIncome: [],
        disclaimer: D,
      });
    }
  }

  // --- D. Foreign tax credit / Form 1116 ------------------------------------
  {
    const ftcIncome = income.filter(
      (i) => incomeMeta(i.incomeType).source !== "US" && num(i.taxPaidOrTds) > 0
    );
    const ftcAssets = assets.filter(
      (a) => assetMeta(a.assetType).group !== "US" && num(a.taxPaidOrTds) > 0
    );
    if (usPerson && (ftcIncome.length || ftcAssets.length)) {
      out.push({
        form: "Foreign tax credit / Form 1116",
        category: "US Tax",
        status: "Review needed",
        reason: `You reported foreign tax / TDS of about $${fmt(
          totals.foreignTaxPaidOrTds
        )} on income that may also be taxed in the U.S. A foreign tax credit (Form 1116) discussion may apply so the same income isn't double-taxed. Your CPA can confirm eligibility and limits.`,
        sourceUrl: SOURCES.form1116,
        severity: "medium",
        relatedAssets: ftcAssets.map(nick),
        relatedIncome: ftcIncome.map(incLabel),
        disclaimer: D,
      });
    }
  }

  // --- E. India ITR / TDS ----------------------------------------------------
  {
    const indiaIncome = income.filter((i) => incomeMeta(i.incomeType).source === "India");
    const caReviewTypes: IncomeType[] = [
      "INDIA_NRO_INTEREST",
      "INDIA_RENTAL_INCOME",
      "INDIA_CAPITAL_GAINS",
      "INDIA_PROPERTY_SALE",
      "INDIA_BUSINESS_INCOME",
      "INDIA_DIVIDENDS",
    ];
    const caReview = incomeOfTypes(caReviewTypes);
    const onlyNreInterest =
      indiaIncome.length > 0 && indiaIncome.every((i) => i.incomeType === "INDIA_NRE_INTEREST");

    if (indiaIncome.length === 0) {
      // no flag
    } else if (onlyNreInterest) {
      out.push({
        form: "India ITR — NRE interest",
        category: "India Tax",
        status: "Review needed",
        reason:
          "NRE interest is generally tax-free in India for NRIs, but India treatment does not automatically make it tax-free in the U.S. Verify your NRI status and confirm U.S. taxability of NRE interest with your CPA.",
        severity: "medium",
        relatedAssets: [],
        relatedIncome: indiaIncome.map(incLabel),
        disclaimer: D,
      });
    } else {
      out.push({
        form: "India ITR / TDS",
        category: "India Tax",
        status: "Review needed",
        reason: `You have India-source income${
          caReview.length
            ? " including NRO interest / rent / capital gains / property sale / business / dividends"
            : ""
        }. An India income-tax return (ITR) and TDS reconciliation may be needed. Review with an Indian CA, and confirm how the same income is treated on your U.S. return.`,
        severity: caReview.length ? "high" : "medium",
        relatedAssets: [],
        relatedIncome: indiaIncome.map(incLabel),
        disclaimer: D,
      });
    }
  }

  // --- F. India property -----------------------------------------------------
  {
    const propertySale = incomeOfTypes(["INDIA_PROPERTY_SALE"]);
    if (propertySale.length) {
      out.push({
        form: "India property sale",
        category: "Planning",
        status: "Review needed",
        reason:
          "You reported an India property sale. Topics to review before/at filing: India capital gains, India TDS on the sale, U.S. capital gains on the same sale, foreign tax credit (Form 1116) for India tax paid, and repatriation documentation (Form 15CA/15CB with your CA).",
        severity: "high",
        relatedAssets: [],
        relatedIncome: propertySale.map(incLabel),
        disclaimer: D,
      });
    }
    const indiaRental =
      incomeOfTypes(["INDIA_RENTAL_INCOME"]).length > 0 ||
      assetsOfTypes(["INDIA_REAL_ESTATE_RENTAL"]).length > 0;
    if (indiaRental) {
      out.push({
        form: "India rental property",
        category: "Planning",
        status: "Review needed",
        reason:
          "You have India rental property/income. Topics to review: India rental income & TDS/ITR with your CA, U.S. rental income reporting, and depreciation/expenses treatment with your CPA (U.S. and India rules differ).",
        severity: "medium",
        relatedAssets: assetsOfTypes(["INDIA_REAL_ESTATE_RENTAL"]).map(nick),
        relatedIncome: incomeOfTypes(["INDIA_RENTAL_INCOME"]).map(incLabel),
        disclaimer: D,
      });
    }
  }

  // --- G. Form 3520 ----------------------------------------------------------
  {
    const giftInh = incomeOfTypes(["GIFT_OR_INHERITANCE"]);
    if (giftInh.length) {
      out.push({
        form: "Form 3520",
        category: "US Reporting",
        status: "Review needed",
        reason:
          "You reported a foreign gift or inheritance (or a foreign trust connection). Large foreign gifts/inheritances and foreign trust distributions can require Form 3520 review. Exact thresholds aren't applied here — confirm with your CPA using current IRS instructions.",
        sourceUrl: SOURCES.form3520,
        severity: "medium",
        relatedAssets: [],
        relatedIncome: giftInh.map(incLabel),
        disclaimer: D,
      });
    }
  }

  // --- H. Foreign entity interests ------------------------------------------
  {
    const entityAssets = assets.filter(
      (a) => assetMeta(a.assetType).isForeignEntity || a.heldDirectlyOrEntity === "entity"
    );
    if (entityAssets.length) {
      out.push({
        form: "Foreign entity (Form 5471 / 8865 / 8858 / 8938)",
        category: "US Reporting",
        status: "Review needed",
        reason:
          "You hold an interest in a foreign company, LLP, or asset held through a foreign entity. Foreign entity ownership can trigger Form 5471 (corporations), 8865 (partnerships), 8858 (disregarded entities), and additional Form 8938 reporting. A specialist CPA is recommended.",
        sourceUrl: SOURCES.form8938About,
        severity: "high",
        relatedAssets: entityAssets.map(nick),
        relatedIncome: [],
        disclaimer: D,
      });
    }
  }

  // --- I. Return-to-India planning ------------------------------------------
  {
    const highDays = num(profile.daysInIndia) >= 120;
    const planningStatus =
      profile.indiaTaxStatus === "rnor" ||
      profile.indiaTaxStatus === "resident" ||
      profile.indiaTaxStatus === "not_sure";
    if (planningStatus || highDays) {
      out.push({
        form: "Return-to-India planning",
        category: "Planning",
        status: "Review needed",
        reason:
          "Your India tax status and/or days in India suggest you should review return-to-India planning: India residency / RNOR status, U.S. retirement account planning, 401(k)/IRA distribution timing, Social Security while abroad, and currency planning. These interact and are best reviewed together with your CPA and CA.",
        severity: "medium",
        relatedAssets: [],
        relatedIncome: [],
        disclaimer: D,
      });
    }
  }

  return out;
}

// ---------------------------------------------------------------------------
// Risk score
// ---------------------------------------------------------------------------

export function computeRiskScore(rules: RuleOutput[]): RiskScore {
  const high = rules.filter((r) => r.severity === "high" && r.status !== "Likely not applicable");
  const medium = rules.filter(
    (r) => r.severity === "medium" && r.status !== "Likely not applicable"
  );
  if (high.length >= 1) return "High";
  if (medium.length >= 2) return "Medium";
  if (medium.length === 1) return "Medium";
  return "Low";
}

// ---------------------------------------------------------------------------
// Missing info checklist
// ---------------------------------------------------------------------------

export function computeMissingInfo(
  profile: UserProfile,
  assets: AssetItem[],
  income: IncomeItem[]
): string[] {
  const missing: string[] = [];
  if (profile.usStatus === "not_sure") missing.push("Set your U.S. tax status in your profile.");
  if (profile.filingStatus === "not_sure")
    missing.push("Set your filing status — it drives the Form 8938 threshold estimate.");
  if (profile.livingLocationForTax === "not_sure")
    missing.push("Set whether you live in the U.S. or abroad — it drives the Form 8938 threshold.");
  if (profile.indiaTaxStatus === "not_sure")
    missing.push("Set your India tax status (NRI / RNOR / Resident).");
  if (assets.length === 0) missing.push("Add your assets (India accounts, investments, property, U.S. accounts).");
  if (income.length === 0) missing.push("Add your income and any India TDS for the year.");

  const foreignAccts = assets.filter(
    (a) => assetMeta(a.assetType).isForeignFinancialAccount && !assetMeta(a.assetType).isRealEstateOrPhysical
  );
  if (foreignAccts.some((a) => a.maximumYearValue == null))
    missing.push("Add the maximum-during-year value for each foreign account (FBAR uses the max, not year-end).");
  if (
    income.some((i) => incomeMeta(i.incomeType).source === "India" && (i.taxPaidOrTds == null))
  )
    missing.push("Add India TDS/tax paid on India income (needed for the foreign tax credit discussion).");
  return missing;
}

// ---------------------------------------------------------------------------
// CPA / CA questions
// ---------------------------------------------------------------------------

export function generateCpaQuestions(
  profile: UserProfile,
  assets: AssetItem[],
  income: IncomeItem[]
): string[] {
  const q: string[] = [];
  const has = (fn: (a: AssetItem) => boolean) => assets.some(fn);
  const hasInc = (types: IncomeType[]) => income.some((i) => types.includes(i.incomeType));
  const foreignAccts = has(
    (a) => assetMeta(a.assetType).isForeignFinancialAccount && !assetMeta(a.assetType).isRealEstateOrPhysical
  );

  if (foreignAccts) q.push("Do my India / foreign accounts trigger FBAR (FinCEN Form 114) reporting?");
  if (foreignAccts) q.push("Do my specified foreign financial assets trigger Form 8938 (FATCA)?");
  if (has((a) => assetMeta(a.assetType).isPficRisk))
    q.push("Are my Indian mutual funds or ETFs PFICs that require Form 8621 review?");
  if (income.some((i) => incomeMeta(i.incomeType).source !== "US" && num(i.taxPaidOrTds) > 0))
    q.push("How should my India TDS be handled for the U.S. foreign tax credit (Form 1116)?");
  if (hasInc(["INDIA_NRE_INTEREST"]) || has((a) => a.assetType === "INDIA_NRE_ACCOUNT"))
    q.push("Is my NRE interest taxable on my U.S. return?");
  if (hasInc(["INDIA_NRO_INTEREST", "INDIA_RENTAL_INCOME", "INDIA_CAPITAL_GAINS", "INDIA_PROPERTY_SALE"]))
    q.push("Do I need to file an India ITR for my NRO interest, rental income, capital gains, or property sale?");
  if (hasInc(["INDIA_RENTAL_INCOME"]) || has((a) => a.assetType === "INDIA_REAL_ESTATE_RENTAL"))
    q.push("How should I report my India rental income on my U.S. return?");
  if (hasInc(["INDIA_PROPERTY_SALE"]))
    q.push("What documentation do I need for the India property sale and to repatriate the proceeds?");
  if (hasInc(["GIFT_OR_INHERITANCE"]))
    q.push("Do my foreign gifts, inheritance, or trust connections require Form 3520 review?");
  if (has((a) => assetMeta(a.assetType).isForeignEntity || a.heldDirectlyOrEntity === "entity"))
    q.push("Do my foreign company / LLP interests trigger additional U.S. reporting (Form 5471/8865/8858)?");
  if (
    profile.indiaTaxStatus === "rnor" ||
    profile.indiaTaxStatus === "resident" ||
    num(profile.daysInIndia) >= 120
  )
    q.push("Given my India residency/RNOR status, how should I time 401(k)/IRA withdrawals and plan currency?");

  // Always include the baseline question.
  if (q.length === 0)
    q.push("Based on my situation, what U.S. and India reporting should I be aware of this year?");
  return q;
}

// ---------------------------------------------------------------------------
// Document checklist
// ---------------------------------------------------------------------------

export function generateDocumentChecklist(
  assets: AssetItem[],
  income: IncomeItem[]
): string[] {
  const docs = new Set<string>();
  const hasAsset = (types: AssetType[]) => assets.some((a) => types.includes(a.assetType));
  const hasInc = (types: IncomeType[]) => income.some((i) => types.includes(i.incomeType));

  if (hasInc(["US_WAGES"])) docs.add("U.S. W-2 / 1099 forms");
  if (hasAsset(["US_BROKERAGE", "US_STOCKS_ETFS", "US_MUTUAL_FUNDS"]) || hasInc(["US_DIVIDENDS", "US_CAPITAL_GAINS"]))
    docs.add("U.S. brokerage 1099 (B / DIV / INT)");
  if (hasAsset(["US_401K", "US_IRA", "US_ROTH_IRA"]) || hasInc(["US_RETIREMENT_DISTRIBUTION"]))
    docs.add("401(k) / IRA statements (and 1099-R if distributions)");
  if (hasAsset(["INDIA_NRE_ACCOUNT", "INDIA_NRO_ACCOUNT", "INDIA_FCNR", "INDIA_RESIDENT_BANK"]))
    docs.add("India bank interest certificates");
  if (hasAsset(["INDIA_NRE_ACCOUNT", "INDIA_NRO_ACCOUNT", "INDIA_FCNR"]))
    docs.add("NRE / NRO / FCNR annual statements");
  if (hasAsset(["INDIA_FIXED_DEPOSIT"])) docs.add("India FD statements");
  if (income.some((i) => incomeMeta(i.incomeType).source === "India"))
    docs.add("India AIS / TIS / Form 26AS");
  if (income.some((i) => incomeMeta(i.incomeType).source === "India" && num(i.taxPaidOrTds) > 0))
    docs.add("India TDS certificates (Form 16A)");
  if (hasAsset(["INDIA_MUTUAL_FUNDS", "INDIA_ETF"]) || hasInc(["INDIA_CAPITAL_GAINS"]))
    docs.add("Mutual fund capital gains statements");
  if (hasAsset(["INDIA_BROKERAGE", "INDIA_STOCKS"]))
    docs.add("Stock broker P&L / capital gains statements");
  if (hasInc(["INDIA_RENTAL_INCOME", "US_RENTAL_INCOME"]) || hasAsset(["INDIA_REAL_ESTATE_RENTAL", "US_REAL_ESTATE_RENTAL"]))
    docs.add("Rental income & expense records");
  if (hasAsset(["INDIA_REAL_ESTATE_PERSONAL", "INDIA_REAL_ESTATE_RENTAL", "INDIA_LAND"]))
    docs.add("Property purchase deed");
  if (hasInc(["INDIA_PROPERTY_SALE"])) {
    docs.add("Property sale deed");
    docs.add("TDS documents for the property sale");
    docs.add("Remittance / repatriation documents (Form 15CA/15CB)");
  }
  if (hasInc(["GIFT_OR_INHERITANCE"])) docs.add("Gift / inheritance documents");
  docs.add("Prior-year FBAR / Form 8938 / Form 8621, if any were filed");
  return Array.from(docs);
}

// ---------------------------------------------------------------------------
// Next-year reminders
// ---------------------------------------------------------------------------

export function generateNextYearReminders(profile: UserProfile, assets: AssetItem[]): string[] {
  const r: string[] = [];
  r.push("Update each account's maximum-during-year and year-end values for the new tax year.");
  if (assets.some((a) => assetMeta(a.assetType).isForeignFinancialAccount))
    r.push("Re-screen FBAR — the maximum balance can cross $10,000 even if year-end is low.");
  if (assets.some((a) => assetMeta(a.assetType).isPficRisk))
    r.push("Track Indian mutual fund / ETF buys & sells for PFIC / Form 8621 review.");
  r.push("Collect India interest certificates, AIS/TIS, and TDS certificates early.");
  if (profile.indiaTaxStatus !== "nri")
    r.push("Re-check your India residency / RNOR status for the new year.");
  return r;
}

// ---------------------------------------------------------------------------
// Top-level summary builder
// ---------------------------------------------------------------------------

export function buildSummary(
  profile: UserProfile,
  assets: AssetItem[],
  income: IncomeItem[]
): ComputedSummary {
  const totals = computeTotals(profile, assets, income);
  const rules = runRules(profile, assets, income);
  return {
    taxYear: profile.taxYear,
    totals,
    riskScore: computeRiskScore(rules),
    rules,
    cpaQuestions: generateCpaQuestions(profile, assets, income),
    documentChecklist: generateDocumentChecklist(assets, income),
    missingInfo: computeMissingInfo(profile, assets, income),
    nextYearReminders: generateNextYearReminders(profile, assets),
  };
}

// ---------------------------------------------------------------------------
// Small formatting helper (USD, no decimals).
// ---------------------------------------------------------------------------

function fmt(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

/** Re-export so consumers can list all asset types without importing types twice. */
export { ASSET_TYPES };
