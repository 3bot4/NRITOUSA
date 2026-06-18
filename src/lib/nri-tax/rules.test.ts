/**
 * Unit tests for the NRI Global Wealth & Tax Organizer rules engine.
 * Run with: npm test  (vitest). Pure functions, no DOM needed.
 */

import { describe, it, expect } from "vitest";
import { buildSummary, computeTotals, fatcaThresholdFor, runRules } from "./rules";
import { makeDefaultProfile } from "./storage";
import type { AssetItem, IncomeItem, UserProfile } from "./types";

const YEAR = 2025;

function profile(patch: Partial<UserProfile> = {}): UserProfile {
  return {
    ...makeDefaultProfile(YEAR),
    usStatus: "green_card",
    filingStatus: "single",
    livingLocationForTax: "us",
    indiaTaxStatus: "nri",
    ...patch,
  };
}

let seq = 0;
function asset(patch: Partial<AssetItem> & Pick<AssetItem, "assetType">): AssetItem {
  seq += 1;
  return {
    id: `a${seq}`,
    userId: "u",
    taxYear: YEAR,
    country: "India",
    institutionOrAssetNickname: `nick-${seq}`,
    currency: "INR",
    yearEndValue: null,
    maximumYearValue: null,
    incomeGenerated: null,
    taxPaidOrTds: null,
    ownershipType: "self",
    heldDirectlyOrEntity: "direct",
    notes: "",
    createdAt: "",
    updatedAt: "",
    ...patch,
  };
}

function income(patch: Partial<IncomeItem> & Pick<IncomeItem, "incomeType">): IncomeItem {
  seq += 1;
  return {
    id: `i${seq}`,
    userId: "u",
    taxYear: YEAR,
    countrySource: "India",
    amount: null,
    currency: "USD",
    taxPaidOrTds: null,
    notes: "",
    createdAt: "",
    updatedAt: "",
    ...patch,
  };
}

const ruleFor = (rules: ReturnType<typeof runRules>, form: string) =>
  rules.find((r) => r.form.startsWith(form));

describe("FBAR screening", () => {
  it("flags 'May be required' when foreign accounts exceed $10,000", () => {
    const assets = [
      asset({ assetType: "INDIA_NRE_ACCOUNT", maximumYearValue: 8000 }),
      asset({ assetType: "INDIA_NRO_ACCOUNT", maximumYearValue: 5000 }),
    ];
    const rules = runRules(profile(), assets, []);
    expect(ruleFor(rules, "FBAR (FinCEN")?.status).toBe("May be required");
  });

  it("stays at or below the line (Review needed) when under $10,000", () => {
    const assets = [asset({ assetType: "INDIA_NRO_ACCOUNT", maximumYearValue: 4000 })];
    const rules = runRules(profile(), assets, []);
    expect(ruleFor(rules, "FBAR (FinCEN")?.status).toBe("Review needed");
  });

  it("excludes directly-held India real estate / gold from the FBAR count", () => {
    const assets = [
      asset({ assetType: "INDIA_REAL_ESTATE_PERSONAL", maximumYearValue: 200000 }),
      asset({ assetType: "GOLD_JEWELRY_COLLECTIBLES", maximumYearValue: 50000 }),
    ];
    const totals = computeTotals(profile(), assets, []);
    expect(totals.foreignFinancialAccountsMax).toBe(0);
    expect(totals.specifiedForeignFinancialAssetsYearEnd).toBe(0);
  });

  it("excludes U.S. 401(k) from FBAR & FATCA foreign-asset counts", () => {
    const assets = [
      asset({ assetType: "US_401K", country: "USA", currency: "USD", yearEndValue: 150000, maximumYearValue: 150000 }),
    ];
    const totals = computeTotals(profile(), assets, []);
    expect(totals.foreignFinancialAccountsMax).toBe(0);
    expect(totals.specifiedForeignFinancialAssetsYearEnd).toBe(0);
    expect(totals.usAssets).toBe(150000);
  });

  it("includes signature-authority-only accounts", () => {
    const assets = [
      asset({
        assetType: "INDIA_NRO_ACCOUNT",
        maximumYearValue: 15000,
        ownershipType: "signature_authority_only",
      }),
    ];
    const totals = computeTotals(profile(), assets, []);
    expect(totals.foreignFinancialAccountsMax).toBe(15000);
  });
});

describe("FATCA / Form 8938 thresholds", () => {
  it("selects the right threshold per filing status & location", () => {
    expect(fatcaThresholdFor(profile({ filingStatus: "single", livingLocationForTax: "us" })).year_end).toBe(50000);
    expect(fatcaThresholdFor(profile({ filingStatus: "married_joint", livingLocationForTax: "us" })).year_end).toBe(100000);
    expect(fatcaThresholdFor(profile({ filingStatus: "single", livingLocationForTax: "abroad" })).year_end).toBe(200000);
    expect(fatcaThresholdFor(profile({ filingStatus: "married_joint", livingLocationForTax: "abroad" })).year_end).toBe(400000);
  });

  it("flags 'May be required' over the single-US threshold", () => {
    const assets = [asset({ assetType: "INDIA_FIXED_DEPOSIT", yearEndValue: 60000, maximumYearValue: 60000 })];
    const rules = runRules(profile({ filingStatus: "single", livingLocationForTax: "us" }), assets, []);
    expect(ruleFor(rules, "FATCA / Form 8938")?.status).toBe("May be required");
  });

  it("stays 'Review needed' under the married-joint-US threshold", () => {
    const assets = [asset({ assetType: "INDIA_FIXED_DEPOSIT", yearEndValue: 60000, maximumYearValue: 60000 })];
    const rules = runRules(profile({ filingStatus: "married_joint", livingLocationForTax: "us" }), assets, []);
    expect(ruleFor(rules, "FATCA / Form 8938")?.status).toBe("Review needed");
  });
});

describe("PFIC / Form 8621", () => {
  it("flags India mutual funds for PFIC review", () => {
    const assets = [asset({ assetType: "INDIA_MUTUAL_FUNDS", yearEndValue: 30000, maximumYearValue: 34000 })];
    const rules = runRules(profile(), assets, []);
    expect(ruleFor(rules, "PFIC / Form 8621")?.status).toBe("Review needed");
  });

  it("does not flag PFIC for India direct stocks", () => {
    const assets = [asset({ assetType: "INDIA_STOCKS", yearEndValue: 30000 })];
    const rules = runRules(profile(), assets, []);
    expect(ruleFor(rules, "PFIC / Form 8621")).toBeUndefined();
  });
});

describe("Foreign entity & real estate", () => {
  it("flags India private company shares for foreign-entity review", () => {
    const assets = [asset({ assetType: "INDIA_PRIVATE_COMPANY", yearEndValue: 50000, maximumYearValue: 50000 })];
    const rules = runRules(profile(), assets, []);
    expect(ruleFor(rules, "Foreign entity")?.status).toBe("Review needed");
  });

  it("keeps directly-held India real estate out of FBAR/FATCA but flags a property note", () => {
    const assets = [asset({ assetType: "INDIA_REAL_ESTATE_PERSONAL", yearEndValue: 200000, maximumYearValue: 200000 })];
    const totals = computeTotals(profile(), assets, []);
    expect(totals.foreignFinancialAccountsMax).toBe(0);
    const rules = runRules(profile(), assets, []);
    expect(ruleFor(rules, "Foreign real estate")?.status).toBe("Review needed");
  });
});

describe("Foreign tax credit & India ITR", () => {
  it("flags Form 1116 when India TDS is paid", () => {
    const inc = [income({ incomeType: "INDIA_NRO_INTEREST", amount: 600, taxPaidOrTds: 180 })];
    const rules = runRules(profile(), [], inc);
    expect(ruleFor(rules, "Foreign tax credit")?.status).toBe("Review needed");
  });

  it("treats NRE-interest-only as a U.S. taxability review", () => {
    const inc = [income({ incomeType: "INDIA_NRE_INTEREST", amount: 500 })];
    const rules = runRules(profile(), [], inc);
    expect(ruleFor(rules, "India ITR — NRE interest")?.status).toBe("Review needed");
  });

  it("flags India property sale planning", () => {
    const inc = [income({ incomeType: "INDIA_PROPERTY_SALE", amount: 100000, taxPaidOrTds: 5000 })];
    const rules = runRules(profile(), [], inc);
    expect(ruleFor(rules, "India property sale")?.severity).toBe("high");
  });
});

describe("risk score & summary", () => {
  it("returns High when a high-severity flag is present", () => {
    const assets = [asset({ assetType: "INDIA_MUTUAL_FUNDS", yearEndValue: 40000, maximumYearValue: 40000 })];
    const summary = buildSummary(profile(), assets, []);
    expect(summary.riskScore).toBe("High");
    expect(summary.cpaQuestions.length).toBeGreaterThan(0);
    expect(summary.documentChecklist.length).toBeGreaterThan(0);
  });

  it("is Low for an empty profile", () => {
    const summary = buildSummary(profile(), [], []);
    expect(summary.riskScore).toBe("Low");
  });
});
