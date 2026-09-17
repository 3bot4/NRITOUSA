/**
 * EAD automatic-extension eligibility and end date.
 *
 * The whole question turns on ONE date: when USCIS received the renewal.
 *
 *   • received BEFORE 2025-10-30 → the old 8 CFR 274a.13(d) extension applies,
 *     up to 540 days past the card's expiry;
 *   • received ON OR AFTER 2025-10-30 → § 274a.13(e) applies and a renewal
 *     request no longer extends anything.
 *
 * Two things survive that repeal and are handled separately, because conflating
 * them costs people real money:
 *   • a timely-filed STEM OPT extension authorises work for up to 180 days past
 *     expiry under 8 CFR 274a.12(b)(6)(iv) — a different provision the rule did
 *     not touch;
 *   • E and L dependent spouses are employment-authorised incident to status
 *     and do not need an EAD at all.
 *
 * UTC-only dates, as elsewhere in src/lib/calc.
 */

import {
  eadProcessingData,
  spouseIncidentToStatus,
  type EadCategory,
} from "@/data/eadProcessingData";
import { parseIsoDate, addDays, toIso, daysBetween } from "@/lib/calc/i751Window";

/** The day § 274a.13(e) took effect. */
export const REPEAL_DATE = "2025-10-30";
/** Maximum extension under the pre-repeal § 274a.13(d). */
export const OLD_EXTENSION_DAYS = 540;
/** How early USCIS generally accepts an EAD renewal. */
export const RENEWAL_WINDOW_DAYS = eadProcessingData.renewalFilingWindowDays;

export type ExtensionBasis =
  | "old-rule"
  | "stem-pending"
  | "incident-to-status"
  | "none"
  | "not-timely";

export interface EadExtensionInput {
  /** Eligibility category key, from eadProcessingData.categories. */
  categoryKey: string;
  /** Date USCIS received the renewal (the receipt date, not the day you posted it). */
  filedDate: string;
  /** Expiry date printed on the current card. */
  expiryDate: string;
  /** Today, UTC midnight or any timestamp — normalised internally. */
  today: number;
}

export interface EadExtensionResult {
  category: EadCategory;
  filedDate: string;
  expiryDate: string;
  basis: ExtensionBasis;
  /** True when any authorisation runs past the card's expiry. */
  hasExtension: boolean;
  /** Last day the extension covers, ISO. Null when there is none. */
  extensionEnds: string | null;
  /** Days of cover past the card expiry. 0 when there is none. */
  extensionDays: number;
  /** Was the renewal filed before the card expired? */
  filedBeforeExpiry: boolean;
  /** Negative once the gap has started. */
  daysUntilCoverEnds: number;
  /** Plain-English headline for the UI. */
  headline: string;
}

function utcMidnight(ts: number): number {
  return Number.isFinite(ts) ? Math.floor(ts / 86_400_000) * 86_400_000 : NaN;
}

export function getCategory(key: string): EadCategory | null {
  const all = eadProcessingData.categories as EadCategory[];
  return all.filter((c) => c.key === key)[0] ?? null;
}

/** E/L dependent-spouse categories that do not need an EAD at all. */
const INCIDENT_TO_STATUS_KEYS = ["a18"];

export function evaluateEadExtension(
  input: EadExtensionInput
): EadExtensionResult | null {
  const category = getCategory(input.categoryKey);
  const filed = parseIsoDate(input.filedDate);
  const expiry = parseIsoDate(input.expiryDate);
  const today = utcMidnight(input.today);
  if (!category || filed === null || expiry === null || !Number.isFinite(today)) {
    return null;
  }

  const filedBeforeExpiry = filed <= expiry;
  const repeal = parseIsoDate(REPEAL_DATE)!;
  const underOldRule = filed < repeal;

  let basis: ExtensionBasis = "none";
  let endTs: number | null = null;

  if (INCIDENT_TO_STATUS_KEYS.indexOf(category.key) !== -1) {
    // L-2 (and E-1S/E-2S/E-3S) spouses are authorised incident to status, so
    // the card's expiry is not what governs their right to work at all.
    basis = "incident-to-status";
  } else if (!filedBeforeExpiry) {
    // Nothing extends a card that had already expired when the renewal landed.
    basis = "not-timely";
  } else if (underOldRule && category.autoExtensionPreRule) {
    basis = "old-rule";
    endTs = addDays(expiry, OLD_EXTENSION_DAYS);
  } else if (category.pendingAuthDays !== null) {
    // STEM OPT: a separate provision the repeal did not touch.
    basis = "stem-pending";
    endTs = addDays(expiry, category.pendingAuthDays);
  }

  const hasExtension = endTs !== null;
  const coverEnds = endTs ?? expiry;

  const headline =
    basis === "incident-to-status"
      ? "You are employment-authorised incident to status — the card's expiry is not what governs your right to work"
      : basis === "old-rule"
        ? `Your renewal was received before ${REPEAL_DATE}, so the old automatic extension still applies`
        : basis === "stem-pending"
          ? `A timely-filed STEM OPT extension authorises work for up to ${category.pendingAuthDays} days past your card's expiry`
          : basis === "not-timely"
            ? "The renewal reached USCIS after the card had already expired, so nothing extends it"
            : `Renewals received on or after ${REPEAL_DATE} get no automatic extension — your authorisation ends on the card's expiry date`;

  return {
    category,
    filedDate: toIso(filed),
    expiryDate: toIso(expiry),
    basis,
    hasExtension,
    extensionEnds: endTs === null ? null : toIso(endTs),
    extensionDays: endTs === null ? 0 : daysBetween(expiry, endTs),
    filedBeforeExpiry,
    daysUntilCoverEnds: daysBetween(today, coverEnds),
    headline,
  };
}

/**
 * The earliest date USCIS generally accepts a renewal, given a card expiry.
 * With no automatic extension to fall back on, filing on the first day of the
 * window is the entire buffer available — so the tool surfaces it.
 */
export function earliestFilingDate(expiryDateIso: string): string | null {
  const expiry = parseIsoDate(expiryDateIso);
  if (expiry === null) return null;
  return toIso(addDays(expiry, -RENEWAL_WINDOW_DAYS));
}

export const SPOUSE_INCIDENT_CODES = spouseIncidentToStatus.codes;
