/**
 * Monthly maintenance required: update Visa Bulletin, I-485 inventory, H1B lottery data,
 * and USCIS processing-time values from official sources. Do not update numbers without
 * source URL and lastUpdated date.
 *
 * Current values are pulled from the existing /data JSON files (current.json,
 * processing-times.json, i485-inventory/current.json). The fields marked
 * MANUALLY MAINTAINED must be updated each month alongside those files.
 */

import currentBulletin from "../../data/visa-bulletin/current.json";
import processingTimesRaw from "../../data/processing-times.json";
import inventoryRaw from "../../data/i485-inventory/current.json";
import { getH1bPremiumFee, getPremiumFeeByForm, premiumProcessing } from "@/lib/premiumProcessing";

// Premium processing fees come from the central source of truth in
// src/lib/premiumProcessing.ts — never hardcode fee amounts on the tracker.
const _h1bFee = getH1bPremiumFee();
const _i140Fee = getPremiumFeeByForm("I-140")[0];

// ─── Visa Bulletin India ──────────────────────────────────────────────────────

const _eb1 = currentBulletin.categories.eb1.india;
const _eb2 = currentBulletin.categories.eb2.india;
const _eb3 = currentBulletin.categories.eb3.india;

/**
 * Movement labels are MANUALLY MAINTAINED and must reflect the verified
 * difference vs. the previous official bulletin. We never compute or invent a
 * movement amount unless previousFinalActionDate / previousDatesForFiling are
 * present AND verified. When previous data is null, movementDirection is
 * "unavailable" and the label tells the user to verify against the prior
 * bulletin. June 2026: EB-1 and EB-2 India retrogressed; previous-month cutoffs
 * are not independently verified in this file, so we do not show a month count.
 */
export type MovementDirection = "forward" | "retrogressed" | "unchanged" | "unavailable";

export const visaBulletinIndia = {
  month: currentBulletin.bulletinMonth,
  year: currentBulletin.bulletinMonth.split("-")[0],
  lastUpdated: currentBulletin.lastUpdated,
  lastVerified: "June 2026",
  officialSourceName: "U.S. Department of State Visa Bulletin",
  officialSourceUrl: currentBulletin.source,
  sourceNote:
    "June 2026 Department of State Visa Bulletin data. Verify all dates against the official DOS Visa Bulletin before filing or making immigration decisions.",
  retrogressionNote:
    "June 2026 note: The Department of State Visa Bulletin reflected retrogression pressure for India employment-based categories, especially EB-1 and EB-2. Always verify the latest bulletin before making filing or travel decisions.",

  categories: {
    EB1: {
      currentFinalActionDate: _eb1.fad,
      currentDatesForFiling: _eb1.dff,
      // Previous-month cutoffs not independently verified — do not compute movement.
      previousFinalActionDate: null,
      previousDatesForFiling: null,
      movementDirection: "retrogressed" as MovementDirection,
      finalActionMovementLabel: "Retrogressed",
      datesForFilingMovementLabel: "Verify vs. last bulletin",
    },
    EB2: {
      currentFinalActionDate: _eb2.fad,
      currentDatesForFiling: _eb2.dff,
      previousFinalActionDate: null,
      previousDatesForFiling: null,
      movementDirection: "retrogressed" as MovementDirection,
      finalActionMovementLabel: "Retrogressed",
      datesForFilingMovementLabel: "Verify vs. last bulletin",
    },
    EB3: {
      currentFinalActionDate: _eb3.fad,
      currentDatesForFiling: _eb3.dff,
      previousFinalActionDate: null,
      previousDatesForFiling: null,
      movementDirection: "unavailable" as MovementDirection,
      finalActionMovementLabel: "Movement pending verification",
      datesForFilingMovementLabel: "Verify vs. last bulletin",
    },
  },
} as const;

// ─── Green Card / I-485 Backlog ───────────────────────────────────────────────

// India I-485 pending totals computed from i485-inventory/current.json
// EB-1: 4,141 + 13,062 + 5,132 = 22,335
// EB-2: 436 + 387 + 9,233 + 16,928 = 26,984
// EB-3: 612 + 3,963 + 12,461 = 17,036
const _indiaTotal = 22335 + 26984 + 17036; // 66,355

export const greenCardBacklog = {
  label: "India I-485 Pending (USCIS snapshot)",
  valueDisplay: `~${_indiaTotal.toLocaleString()}`,
  overallTotalDisplay: `~${inventoryRaw.overallTotal.toLocaleString()}`,
  indiaShareDisplay: `~${Math.round((_indiaTotal / inventoryRaw.overallTotal) * 100)}% of all pending I-485s`,
  // MANUALLY MAINTAINED — update when new USCIS inventory is published
  previousValueDisplay: "~65,000",
  changeDisplay: "+1,355 vs. prior snapshot",
  lastUpdated: inventoryRaw.lastUpdated,
  snapshotDate: inventoryRaw.snapshotDate,
  officialSourceName: inventoryRaw.sourceLabel,
  officialSourceUrl: inventoryRaw.source,
  note: "Counts only I-485 (in-US) filers. Does not include consular-processing cases abroad or eligible applicants who haven't filed yet.",
  breakdown: {
    EB1: 22335,
    EB2: 26984,
    EB3: 17036,
  },
} as const;

// Source clarification for the India I-485 backlog numbers shown on the tracker.
// These are a manually maintained snapshot, NOT a live USCIS feed.
export const i485BacklogIndia = {
  totalDisplay: `~${_indiaTotal.toLocaleString()}`,
  eb1Display: "22,335",
  eb2Display: "26,984",
  eb3Display: "17,036",
  sourceDatasetName: "USCIS Employment-Based I-485 Inventory snapshot used by NRItoUSA",
  // TODO: Add exact USCIS I-485 inventory report filename/date used for these numbers.
  // Best known: USCIS Pending EB I-485 Inventory, snapshot ${inventoryRaw.snapshotDate},
  // published ${inventoryRaw.publishedDate}. Confirm the exact India/China/All-Other
  // workbook filename from the USCIS data page before citing.
  sourceFileOrReportName: `USCIS Pending EB I-485 Inventory — snapshot ${inventoryRaw.snapshotDate} (published ${inventoryRaw.publishedDate}); exact workbook filename TODO`,
  snapshotDate: inventoryRaw.snapshotDate,
  publishedDate: inventoryRaw.publishedDate,
  lastVerified: "June 2026",
  officialSourceName: "USCIS Immigration and Citizenship Data",
  officialSourceUrl:
    "https://www.uscis.gov/tools/reports-and-studies/immigration-and-citizenship-data",
  note: "Inventory numbers can differ by report date, category filters, and USCIS dataset version. Verify against the exact USCIS inventory file before citing.",
  cardLabel: "Dataset: USCIS EB I-485 inventory snapshot used by NRItoUSA. Last manually verified: June 2026.",
} as const;

// ─── H1B Lottery ─────────────────────────────────────────────────────────────

export const h1bLottery = {
  // MANUALLY MAINTAINED — update after each USCIS H-1B selection announcement
  fiscalYear: "FY 2026",
  oddsDisplay: "~28%",
  selectedRegistrations: 114017,
  eligibleRegistrations: 409153,
  calculationNote:
    "Approximate odds = selected ÷ eligible unique registrations. USCIS rounds/adjusts counts; treat as an estimate. Actual odds vary by cap type (regular 65k vs. advanced-degree 20k exemption).",
  previousYearOddsDisplay: "~24% (FY 2025)",
  changeDisplay: "+4 pp vs. FY 2025",
  lastUpdated: "2025-04-05",
  officialSourceName: "USCIS H-1B Electronic Registration Data",
  officialSourceUrl:
    "https://www.uscis.gov/working-in-the-united-states/h-1b-specialty-occupation/h-1b-electronic-registration-process",
  historicalData: [
    { year: "FY 2024", oddsDisplay: "~35%", selected: 188400, eligible: 540000 },
    { year: "FY 2025", oddsDisplay: "~24%", selected: 110791, eligible: 470342 },
    { year: "FY 2026", oddsDisplay: "~28%", selected: 114017, eligible: 409153 },
  ],
} as const;

// ─── Processing Times ─────────────────────────────────────────────────────────

// Pull directly from the existing processing-times.json (first group = USCIS petitions)
const _uscisGroup = processingTimesRaw.groups[0];

function _findItem(keyword: string) {
  return _uscisGroup.items.find((i) => i.item.startsWith(keyword));
}

const _i129 = _findItem("I-129");
const _i140 = _findItem("I-140");
const _i485 = _findItem("I-485");
const _i765 = _findItem("I-765");
const _i131 = _findItem("I-131");

export const processingTimes = {
  lastUpdated: processingTimesRaw.lastUpdated,
  officialSourceName: processingTimesRaw.sourceLabel,
  officialSourceUrl: processingTimesRaw.source,
  items: [
    {
      form: "I-485",
      category: "Adjustment of Status (employment-based)",
      valueDisplay: _i485?.typical ?? "Check official source",
      // MANUALLY MAINTAINED
      previousValueDisplay: "9–19 months",
      changeDisplay: "+1 month",
      lastUpdated: _i485?.lastUpdated ?? processingTimesRaw.lastUpdated,
      officialSourceUrl: _i485?.source ?? processingTimesRaw.source,
      officialSourceName: _i485?.sourceLabel ?? processingTimesRaw.sourceLabel,
      note: "Varies by service center and case type. Premium processing is not available for I-485.",
      learnMoreHref: "/uscis/processing-times",
    },
    {
      form: "I-140",
      category: "Immigrant Petition (EB-1/EB-2/EB-3)",
      valueDisplay: _i140?.typical ?? "Check official source",
      previousValueDisplay: "4–8 months",
      changeDisplay: "+1 month",
      lastUpdated: _i140?.lastUpdated ?? processingTimesRaw.lastUpdated,
      officialSourceUrl: _i140?.source ?? processingTimesRaw.source,
      officialSourceName: _i140?.sourceLabel ?? processingTimesRaw.sourceLabel,
      // Fee pulled from central premiumProcessing — see PremiumProcessingFeeNote on the card.
      note: `I-140 premium processing may be available for many eligible categories. Current common fee shown in our data: ${_i140Fee.feeDisplay}. Last verified: ${premiumProcessing.lastVerified}. Premium processing does not move your priority date or visa bulletin availability.`,
      learnMoreHref: "/green-card",
      premiumFeeForm: "I-140" as const,
    },
    {
      form: "I-765 (EAD)",
      category: "Employment Authorization Document",
      valueDisplay: _i765?.typical ?? "Check official source",
      previousValueDisplay: "3–7 months",
      changeDisplay: "+1 month",
      lastUpdated: _i765?.lastUpdated ?? processingTimesRaw.lastUpdated,
      officialSourceUrl: _i765?.source ?? processingTimesRaw.source,
      officialSourceName: _i765?.sourceLabel ?? processingTimesRaw.sourceLabel,
      note: "Filed with I-485 or as standalone renewal. I-485 co-filers may get combo card.",
      learnMoreHref: "/uscis",
    },
    {
      form: "I-131 (Advance Parole)",
      category: "Travel Document",
      valueDisplay: _i131?.typical ?? "Check official source",
      previousValueDisplay: "4–10 months",
      changeDisplay: "+1 month",
      lastUpdated: _i131?.lastUpdated ?? processingTimesRaw.lastUpdated,
      officialSourceUrl: _i131?.source ?? processingTimesRaw.source,
      officialSourceName: _i131?.sourceLabel ?? processingTimesRaw.sourceLabel,
      note: "For many I-485 applicants, leaving the U.S. without Advance Parole can risk abandonment of the I-485. Some H/L visa holders may have exceptions if they maintain valid status and re-enter properly. Travel rules are fact-specific, so confirm with an immigration attorney before traveling.",
      learnMoreHref: "/uscis",
    },
    {
      form: "H-1B I-129",
      category: "H-1B Extension / Transfer (regular)",
      valueDisplay: _i129?.typical ?? "Check official source",
      previousValueDisplay: "2–3 months",
      changeDisplay: "+1 month",
      lastUpdated: _i129?.lastUpdated ?? processingTimesRaw.lastUpdated,
      officialSourceUrl: _i129?.source ?? processingTimesRaw.source,
      officialSourceName: _i129?.sourceLabel ?? processingTimesRaw.sourceLabel,
      // Fee pulled from central premiumProcessing — never the stale value in processing-times.json.
      note: `${_h1bFee.timelineDisplay} with premium processing for many eligible H-1B/I-129 cases. Current common fee shown in our data: ${_h1bFee.feeDisplay}. Last verified: ${premiumProcessing.lastVerified}. Always verify the latest fee on the official USCIS Form I-907 page before filing.`,
      learnMoreHref: "/h1b",
      premiumFeeForm: "I-129" as const,
    },
  ],
} as const;

// ─── Countdowns ───────────────────────────────────────────────────────────────

export const countdowns = {
  // MANUALLY MAINTAINED — update after each bulletin release
  nextVisaBulletinEstimatedDate: "2026-07-14",
  nextVisaBulletinCountdownLabel: "~28 days",
  currentBulletinMonth: currentBulletin.bulletinMonth,
  note: "Visa Bulletins typically release mid-month. Estimated timing only — no guarantee.",
} as const;

// ─── Disclaimers ──────────────────────────────────────────────────────────────

export const dashboardDisclaimers = {
  standardDisclaimer:
    "NRItoUSA is not USCIS, not a law firm, and does not provide legal advice. Immigration fees, dates, backlogs, and processing times can change. Always verify with official USCIS and Department of State sources.",
  processingTimeDisclaimer:
    "USCIS processing times are estimates. Actual times vary by service center, case complexity, and USCIS workload. Always check the official USCIS processing times tool for the most current data.",
  visaBulletinDisclaimer:
    "Visa Bulletin dates are set monthly by the U.S. Department of State and can move forward, stay the same, or retrogress. Past movement is not a predictor of future movement.",
  sourceVerificationDisclaimer:
    "Every data field on this page shows its source and last-updated date. We update this page when official sources publish new data, but always verify directly with the official source before making any immigration decision.",
  adLandingDisclaimer:
    "Because immigration data changes often, this tracker shows manually maintained snapshots and estimates where noted. Always verify official USCIS and Department of State sources before filing, traveling, paying fees, or making legal decisions.",
} as const;

// ─── Type exports ─────────────────────────────────────────────────────────────

export type VisaBulletinCategory = keyof typeof visaBulletinIndia.categories;
export type ProcessingTimeItem = (typeof processingTimes.items)[number];
