/**
 * N-400 naturalization readiness logic.
 *
 * 100% client-side. Reads dated facts (fees, civics-test rule, residency
 * thresholds, pain points, checklist content) from data/citizenship-checklist.json
 * — the single source of truth the site owner refreshes. This module turns a
 * user's intake answers into: an earliest filing date + countdown, which
 * civics test applies, derived risk flags, and which checklist items / pain
 * points to surface.
 *
 * Educational only — not legal advice. Thresholds are TODO-flagged in the JSON
 * for verification against uscis.gov.
 */

import data from "../../data/citizenship-checklist.json";

export const CITIZENSHIP_DATA = data;
export const LAST_UPDATED: string = data.lastUpdated;

/* ------------------------------------------------------------------ *
 * Intake types
 * ------------------------------------------------------------------ */

export type BasisId = "5-year" | "3-year-spouse" | "military";
export type YesNoUnsure = "yes" | "no" | "unsure";
export type Sex = "male" | "female" | "prefer-not";

export interface Intake {
  basis: BasisId;
  /** Date became a permanent resident (green card "resident since"), ISO yyyy-mm-dd. */
  residentSince: string;
  marriedToUsc: boolean;
  sex: Sex;
  age: number | null;
  /** Already filed? Their filing date decides which civics test applies. */
  filingDate: string;
  // Risk questions
  longTripOver6mo: YesNoUnsure;
  arrestsEver: YesNoUnsure;
  allTaxesFiled: YesNoUnsure;
  filedAsNonResident: YesNoUnsure;
  childSupportCurrent: "yes" | "no" | "na";
}

export function defaultIntake(): Intake {
  return {
    basis: "5-year",
    residentSince: "",
    marriedToUsc: false,
    sex: "prefer-not",
    age: null,
    filingDate: "",
    longTripOver6mo: "no",
    arrestsEver: "no",
    allTaxesFiled: "yes",
    filedAsNonResident: "no",
    childSupportCurrent: "na",
  };
}

/* ------------------------------------------------------------------ *
 * Basis helpers
 * ------------------------------------------------------------------ */

type Basis = (typeof data.bases)[number];

export function getBasis(id: BasisId): Basis {
  return data.bases.find((b) => b.id === id) ?? data.bases[0];
}

/* ------------------------------------------------------------------ *
 * Date math
 * ------------------------------------------------------------------ */

const DAY_MS = 24 * 60 * 60 * 1000;

function parseDate(iso: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function addYears(d: Date, years: number): Date {
  const n = new Date(d);
  n.setFullYear(n.getFullYear() + years);
  return n;
}

function addDays(d: Date, days: number): Date {
  return new Date(d.getTime() + days * DAY_MS);
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/* ------------------------------------------------------------------ *
 * Eligibility computation
 * ------------------------------------------------------------------ */

export interface EligibilityResult {
  hasDate: boolean;
  /** Military basis short-circuits the standard clock. */
  militaryNote: string | null;
  anniversary: Date | null;
  earliestFilingDate: Date | null;
  /** Whole days until earliest filing (negative = already eligible). */
  daysUntilEligible: number | null;
  eligibleNow: boolean;
  physicalPresenceMonths: number;
  physicalPresenceDays: number;
  stateMonths: number;
}

export function computeEligibility(intake: Intake, today = new Date()): EligibilityResult {
  const basis = getBasis(intake.basis);
  const start = parseDate(intake.residentSince);

  if (intake.basis === "military") {
    return {
      hasDate: Boolean(start),
      militaryNote: basis.note ?? null,
      anniversary: null,
      earliestFilingDate: null,
      daysUntilEligible: null,
      eligibleNow: false,
      physicalPresenceMonths: 0,
      physicalPresenceDays: 0,
      stateMonths: data.requirements.stateResidenceMonths,
    };
  }

  if (!start) {
    return {
      hasDate: false,
      militaryNote: null,
      anniversary: null,
      earliestFilingDate: null,
      daysUntilEligible: null,
      eligibleNow: false,
      physicalPresenceMonths: basis.physicalPresenceMonths,
      physicalPresenceDays: basis.physicalPresenceDays,
      stateMonths: data.requirements.stateResidenceMonths,
    };
  }

  const anniversary = addYears(start, basis.yearsResidence);
  const earliest = addDays(anniversary, -basis.fileEarlyDays);
  const midnightToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const daysUntil = Math.ceil((earliest.getTime() - midnightToday.getTime()) / DAY_MS);

  return {
    hasDate: true,
    militaryNote: null,
    anniversary,
    earliestFilingDate: earliest,
    daysUntilEligible: daysUntil,
    eligibleNow: daysUntil <= 0,
    physicalPresenceMonths: basis.physicalPresenceMonths,
    physicalPresenceDays: basis.physicalPresenceDays,
    stateMonths: data.requirements.stateResidenceMonths,
  };
}

/* ------------------------------------------------------------------ *
 * Which civics test applies
 * ------------------------------------------------------------------ */

export interface CivicsResult {
  /** True once a filing date is known. */
  known: boolean;
  version: "2025" | "2008";
  label: string;
  poolSize: number;
  asked: number;
  toPass: number;
  /** "on or after the Oct 20 2025 cutoff" vs "before". */
  explanation: string;
}

export function computeCivicsTest(filingDate: string): CivicsResult {
  const { newTest, oldTest, newTestCutoffDate } = data.civicsTest;
  const filed = parseDate(filingDate);
  const cutoff = parseDate(newTestCutoffDate)!;

  // Unknown filing date → assume the current (new) test, since anyone filing
  // now is past the cutoff. Flag as not-yet-known so the UI can nuance it.
  if (!filed) {
    return {
      known: false,
      version: "2025",
      label: newTest.label,
      poolSize: newTest.poolSize,
      asked: newTest.asked,
      toPass: newTest.toPass,
      explanation: `Anyone filing today is on or after the ${formatDate(cutoff)} cutoff, so plan for the ${newTest.label}. Enter your filing date to confirm.`,
    };
  }

  const isNew = filed.getTime() >= cutoff.getTime();
  const t = isNew ? newTest : oldTest;
  return {
    known: true,
    version: isNew ? "2025" : "2008",
    label: t.label,
    poolSize: t.poolSize,
    asked: t.asked,
    toPass: t.toPass,
    explanation: isNew
      ? `You filed on or after ${formatDate(cutoff)}, so you take the ${t.label}: ${t.poolSize}-question pool, ${t.asked} asked, ${t.toPass} correct to pass.`
      : `You filed before ${formatDate(cutoff)}, so you keep the ${t.label}: ${t.poolSize}-question pool, ${t.asked} asked, ${t.toPass} correct to pass.`,
  };
}

/* ------------------------------------------------------------------ *
 * Derived risk flags (drive which items + pain points to surface)
 * ------------------------------------------------------------------ */

export type RiskTag =
  | "longTrip"
  | "arrests"
  | "tax"
  | "nriTaxResidency"
  | "selectiveService"
  | "spouseTrack"
  | "childSupport"
  | "oci";

export interface DerivedFlags {
  tags: Set<RiskTag>;
  /** Ordered, user-facing warnings keyed to pain-point ids where relevant. */
  warnings: { id: string; title: string; body: string; severity: "high" | "medium" }[];
}

export function deriveFlags(intake: Intake): DerivedFlags {
  const tags = new Set<RiskTag>();
  const warnings: DerivedFlags["warnings"] = [];

  // OCI applies to everyone in this (India-focused) audience naturalizing.
  tags.add("oci");

  if (intake.basis === "3-year-spouse" || intake.marriedToUsc) tags.add("spouseTrack");

  if (intake.longTripOver6mo === "yes" || intake.longTripOver6mo === "unsure") {
    tags.add("longTrip");
    warnings.push({
      id: "long-trips-continuous-residence",
      severity: "medium",
      title: "A long trip abroad may affect your residency clock",
      body: "You flagged a trip abroad of 6+ months. A single 6-month trip raises a rebuttable presumption that continuous residence was broken; 1 year or more breaks it automatically. Build a complete travel log and consider legal advice before filing.",
    });
  }

  if (intake.arrestsEver === "yes" || intake.arrestsEver === "unsure") {
    tags.add("arrests");
    warnings.push({
      id: "disclosure-trap",
      severity: "high",
      title: "Disclose every arrest or citation — with documents",
      body: "You indicated a possible arrest, citation, or charge. Disclose every incident (even dismissed or expunged) and bring the certified court disposition for each. USCIS sees your FBI record; non-disclosure is a leading cause of denial.",
    });
  }

  if (intake.allTaxesFiled === "no" || intake.allTaxesFiled === "unsure") {
    tags.add("tax");
    warnings.push({
      id: "expanded-vetting",
      severity: "high",
      title: "Resolve any unfiled or unpaid taxes first",
      body: "You indicated tax returns may not all be filed. Good moral character review weighs tax compliance. File any missing returns and, if you owe, set up an IRS payment plan and bring proof before filing N-400.",
    });
  }

  if (intake.filedAsNonResident === "yes" || intake.filedAsNonResident === "unsure") {
    tags.add("nriTaxResidency");
    tags.add("tax");
    warnings.push({
      id: "nri-tax-residency-trap",
      severity: "high",
      title: "Non-resident tax filing after getting your green card is a serious red flag",
      body: "Filing US taxes as a non-resident (or claiming non-resident treaty benefits) after becoming an LPR — while telling USCIS you kept US residence — is treated as a near-fatal inconsistency. Talk to a cross-border tax professional and an immigration attorney before filing N-400.",
    });
  }

  if (intake.childSupportCurrent === "no") {
    tags.add("childSupport");
    warnings.push({
      id: "child-support",
      severity: "high",
      title: "Get current on child support before filing",
      body: "Falling behind on court-ordered child support weighs against good moral character. Bring your payment records or a court order showing you're current.",
    });
  }

  // Selective Service: males who lived in the US between 18 and 25.
  if (intake.sex === "male") {
    tags.add("selectiveService");
  }

  return { tags, warnings };
}

/* ------------------------------------------------------------------ *
 * Checklist filtering
 * ------------------------------------------------------------------ */

export interface ChecklistItem {
  id: string;
  label: string;
  detail?: string;
  riskTag?: string;
}
export interface ChecklistSection {
  id: string;
  title: string;
  items: ChecklistItem[];
}

/**
 * Which conditional items to show. Items with a riskTag only appear when the
 * tag is active; items without one always appear. spouseTrack/selectiveService
 * /oci items are gated on the matching derived tag.
 */
export function visibleSections(intake: Intake, flags: DerivedFlags): ChecklistSection[] {
  const gated: Record<string, RiskTag> = {
    spouseTrack: "spouseTrack",
    selectiveService: "selectiveService",
    childSupport: "childSupport",
    oci: "oci",
  };

  return (data.sections as ChecklistSection[]).map((section) => ({
    ...section,
    items: section.items.filter((item) => {
      const tag = item.riskTag;
      if (!tag) return true;
      // Risk-surfacing tags (longTrip, arrests, tax) are always shown as
      // reminders, but emphasized when active; gated tags are hidden unless active.
      if (tag in gated) return flags.tags.has(gated[tag]);
      return true;
    }),
  }));
}

export function countItems(sections: ChecklistSection[]): number {
  return sections.reduce((n, s) => n + s.items.length, 0);
}

/** Broad readiness label for analytics — never includes personal answers. */
export function readinessBand(percent: number): string {
  if (percent >= 80) return "ready_high";
  if (percent >= 40) return "ready_mid";
  return "ready_early";
}
