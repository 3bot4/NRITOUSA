/**
 * Sample data for the "Download Sample Report" / "Load sample data" buttons.
 * A realistic permanent-NRI family situation that exercises most rules: FBAR
 * over the line, Form 8938, PFIC (India mutual funds), foreign tax credit
 * (NRO TDS), India ITR, India property sale, and return-to-India planning.
 *
 * All values are illustrative USD-equivalents with nicknames only — no real
 * account numbers, addresses, or personal identifiers (matching the tool's
 * privacy rules).
 */

import type { AssetItem, IncomeItem, UserProfile } from "./types";
import { currentTaxYear } from "./storage";

const YEAR = currentTaxYear();
const ts = "2026-01-01T00:00:00.000Z";

export function sampleProfile(taxYear: number = YEAR): UserProfile {
  return {
    userId: "sample",
    taxYear,
    usStatus: "green_card",
    filingStatus: "married_joint",
    livingLocationForTax: "us",
    state: "NJ",
    indiaTaxStatus: "nri",
    daysInIndia: 35,
    hasSpouse: true,
    spouseUsPersonStatus: "green_card",
    createdAt: ts,
    updatedAt: ts,
  };
}

function asset(
  partial: Partial<AssetItem> & Pick<AssetItem, "assetType" | "institutionOrAssetNickname">
): AssetItem {
  return {
    id: `sample-${partial.assetType}-${partial.institutionOrAssetNickname}`,
    userId: "sample",
    taxYear: YEAR,
    country: partial.country ?? "India",
    currency: partial.currency ?? "INR",
    yearEndValue: partial.yearEndValue ?? null,
    maximumYearValue: partial.maximumYearValue ?? null,
    incomeGenerated: partial.incomeGenerated ?? null,
    taxPaidOrTds: partial.taxPaidOrTds ?? null,
    ownershipType: partial.ownershipType ?? "self",
    heldDirectlyOrEntity: partial.heldDirectlyOrEntity ?? "direct",
    notes: partial.notes ?? "",
    createdAt: ts,
    updatedAt: ts,
    ...partial,
  };
}

export function sampleAssets(taxYear: number = YEAR): AssetItem[] {
  return [
    asset({
      assetType: "INDIA_NRE_ACCOUNT",
      institutionOrAssetNickname: "HDFC NRE",
      yearEndValue: 18000,
      maximumYearValue: 22000,
    }),
    asset({
      assetType: "INDIA_NRO_ACCOUNT",
      institutionOrAssetNickname: "ICICI NRO",
      yearEndValue: 9000,
      maximumYearValue: 12000,
      incomeGenerated: 600,
      taxPaidOrTds: 180,
    }),
    asset({
      assetType: "INDIA_FIXED_DEPOSIT",
      institutionOrAssetNickname: "SBI FD",
      yearEndValue: 25000,
      maximumYearValue: 25000,
      incomeGenerated: 1500,
      taxPaidOrTds: 450,
    }),
    asset({
      assetType: "INDIA_MUTUAL_FUNDS",
      institutionOrAssetNickname: "Mumbai MF folio",
      yearEndValue: 30000,
      maximumYearValue: 34000,
    }),
    asset({
      assetType: "INDIA_REAL_ESTATE_PERSONAL",
      institutionOrAssetNickname: "Pune apartment",
      country: "India",
      yearEndValue: 120000,
      maximumYearValue: 120000,
    }),
    asset({
      assetType: "US_401K",
      institutionOrAssetNickname: "Fidelity 401(k)",
      country: "USA",
      currency: "USD",
      yearEndValue: 145000,
      maximumYearValue: 150000,
    }),
    asset({
      assetType: "US_BROKERAGE",
      institutionOrAssetNickname: "Vanguard brokerage",
      country: "USA",
      currency: "USD",
      yearEndValue: 80000,
      maximumYearValue: 88000,
    }),
  ].map((a) => ({ ...a, taxYear }));
}

export function sampleIncome(taxYear: number = YEAR): IncomeItem[] {
  const base = (
    p: Partial<IncomeItem> & Pick<IncomeItem, "incomeType" | "countrySource">
  ): IncomeItem => ({
    id: `sample-inc-${p.incomeType}`,
    userId: "sample",
    taxYear,
    amount: p.amount ?? null,
    currency: p.currency ?? (p.countrySource === "India" ? "INR" : "USD"),
    taxPaidOrTds: p.taxPaidOrTds ?? null,
    notes: p.notes ?? "",
    createdAt: ts,
    updatedAt: ts,
    ...p,
  });
  return [
    base({ incomeType: "US_WAGES", countrySource: "USA", amount: 180000, currency: "USD" }),
    base({ incomeType: "INDIA_NRO_INTEREST", countrySource: "India", amount: 600, taxPaidOrTds: 180 }),
    base({ incomeType: "INDIA_FD_INTEREST", countrySource: "India", amount: 1500, taxPaidOrTds: 450 }),
    base({ incomeType: "INDIA_RENTAL_INCOME", countrySource: "India", amount: 4000, taxPaidOrTds: 400 }),
  ];
}
