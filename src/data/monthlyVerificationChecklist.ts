/**
 * Monthly verification checklist. Drives `npm run audit:monthly-numbers`, which
 * reads the live values from siteWideVerifiedNumbers.ts and flags anything whose
 * `lastVerified` date is older than VERIFICATION_STALE_DAYS.
 *
 * Each category maps to the official source(s) to re-check every month.
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
}

export const monthlyVerificationChecklist: ChecklistCategory[] = [
  {
    id: "uscis-fees",
    title: "USCIS fees (G-1055)",
    numbersKey: "greenCardRenewal",
    sources: [
      { label: "USCIS Fee Schedule (G-1055)", href: officialSources.uscisFeeSchedule },
      { label: "USCIS Fee Calculator", href: officialSources.uscisFeeCalculator },
    ],
  },
  {
    id: "uscis-processing",
    title: "USCIS processing times",
    numbersKey: "i485",
    sources: [{ label: "USCIS Processing Times", href: officialSources.uscisProcessingTimes }],
  },
  {
    id: "dol-flag",
    title: "DOL FLAG PERM/PWD processing times",
    numbersKey: "perm",
    sources: [{ label: "DOL FLAG Processing Times", href: officialSources.dolFlagProcessing }],
  },
  {
    id: "visa-bulletin",
    title: "Department of State Visa Bulletin",
    sources: [{ label: "Visa Bulletin", href: officialSources.visaBulletin }],
    manualCheck: "Check current-month final action + dates for filing charts for EB/FB India.",
  },
  {
    id: "nvc",
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
    manualCheck: "Confirm current ITR due dates, TDS rates on property/rent, and LRS/repatriation limits.",
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
