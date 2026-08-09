/**
 * Monthly verification checklist. Companion to `npm run audit:monthly-numbers`,
 * which reads the stored values from siteWideVerifiedNumbers.ts and runs three
 * checks: stamp staleness, value drift against the committed baseline, and
 * (with --fetch) a live comparison against the official source.
 *
 * Each category maps to the official source(s) to re-check every month.
 *
 * Sources on `manualOnly` categories reject automated fetches (uscis.gov,
 * travel.state.gov, VFS) or publish figures the script cannot match verbatim
 * (ranges, prose). Those genuinely need a human to open the page — the audit
 * lists them explicitly rather than passing them silently.
 */

import { allVerifiedNumbers, officialSources } from "./siteWideVerifiedNumbers";

export interface ChecklistCategory {
  id: string;
  title: string;
  /** Key into allVerifiedNumbers whose items this category covers. */
  numbersKey?: keyof typeof allVerifiedNumbers;
  sources: { label: string; href: string }[];
  /** Some items require a manual eyeball rather than a stored figure. */
  manualCheck?: string;
  /**
   * True when this category's sources cannot be auto-checked by
   * `audit:monthly-numbers --fetch` — the host blocks automated requests, or
   * the figures are ranges/prose that never appear verbatim. A human must open
   * the page. Marked so "the audit passed" is never mistaken for "everything
   * was compared against its source".
   */
  manualOnly?: boolean;
}

export const monthlyVerificationChecklist: ChecklistCategory[] = [
  {
    id: "uscis-fees",
    manualOnly: true,
    title: "USCIS fees (G-1055)",
    numbersKey: "greenCardRenewal",
    sources: [
      { label: "USCIS Fee Schedule (G-1055)", href: officialSources.uscisFeeSchedule },
      { label: "USCIS Fee Calculator", href: officialSources.uscisFeeCalculator },
    ],
  },
  {
    id: "uscis-processing",
    manualOnly: true,
    title: "USCIS processing times",
    numbersKey: "i485",
    sources: [{ label: "USCIS Processing Times", href: officialSources.uscisProcessingTimes }],
  },
  {
    id: "dol-flag",
    manualOnly: true,
    title: "DOL FLAG PERM/PWD processing times",
    numbersKey: "perm",
    sources: [{ label: "DOL FLAG Processing Times", href: officialSources.dolFlagProcessing }],
  },
  {
    id: "visa-bulletin",
    manualOnly: true,
    title: "Department of State Visa Bulletin",
    sources: [{ label: "Visa Bulletin", href: officialSources.visaBulletin }],
    manualCheck: "Check current-month final action + dates for filing charts for EB/FB India.",
  },
  {
    id: "nvc",
    manualOnly: true,
    title: "NVC timeframes and fees",
    numbersKey: "nvc",
    sources: [
      { label: "NVC Timeframes", href: officialSources.nvcTimeframes },
      { label: "DOS Visa Fees", href: officialSources.stateVisaFees },
      { label: "CEAC", href: officialSources.ceac },
    ],
  },
  {
    id: "passport-vfs",
    manualOnly: true,
    title: "Passport/VFS fees and processing times",
    numbersKey: "passport",
    sources: [
      { label: "VFS Global (India, USA)", href: officialSources.vfsIndiaUsa },
      { label: "Passport Seva", href: officialSources.passportSeva },
    ],
  },
  {
    id: "irs-fincen",
    title: "IRS/FinCEN thresholds and deadlines",
    numbersKey: "tax",
    sources: [
      { label: "IRS FBAR", href: officialSources.irsFbar },
      { label: "IRS Form 8938", href: officialSources.irsForm8938 },
      { label: "FinCEN BSA", href: officialSources.fincenBsa },
    ],
  },
  {
    id: "india-rbi",
    title: "India tax/TDS/RBI limits",
    sources: [
      { label: "Income Tax India", href: officialSources.incomeTaxIndia },
      { label: "RBI", href: officialSources.rbiRemittance },
    ],
    manualCheck:
      "Confirm current ITR due dates (ITR-2 and ITR-3 are NOT the same date), TDS rates on property/rent, LRS/repatriation limits, and the s.394(1) TCS rates in src/lib/calc/remittanceTcs.ts. The TCS rates are the ones that went stale unnoticed — education/medical dropped 5% → 2% on 1 Apr 2026 while the file still said 5%. Indian rates change with each Finance Act, so re-check them every April at minimum.",
  },
  {
    id: "education",
    title: "Education fees/dates",
    numbersKey: "education",
    sources: [
      { label: "College Board (SAT)", href: officialSources.collegeBoardSat },
      { label: "FAFSA", href: officialSources.fafsa },
    ],
  },
];
