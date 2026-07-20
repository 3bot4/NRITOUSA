/**
 * India TCS on LRS foreign remittances — Section 206C(1G).
 *
 * Verified to primary/official sources (July 2026):
 *  - LRS applies to RESIDENT INDIVIDUALS only, USD 250,000 per financial year.
 *    NRI/NRO repatriation is a separate FEMA facility, NOT LRS.
 *    (RBI LRS FAQ — rbi.org.in.)
 *  - The TCS aggregate threshold is ₹10,00,000 per financial year (raised from
 *    ₹7,00,000). (PIB / incometaxindia — Finance Act 2025.)
 *  - Remittances for overseas education funded by a loan under Section
 *    80E(3)(b) are EXEMPT from TCS collection. (PIB / incometaxindia.)
 *
 * NOT independently re-verified for the current financial year and therefore
 * carried as dated assumptions (a proposal to cut education/medical from 5% to
 * 2% was seen but its enactment could not be confirmed against a primary CBDT
 * source, so it is NOT applied):
 *  - Education not funded by a qualifying loan: 5% above the threshold.
 *  - Medical treatment: 5% above the threshold.
 *  - Other purposes (family maintenance, investment, gift): 20% above threshold.
 *
 * The UI must show these rates with their checked date and a "verify current
 * year" note, and must never present the education/medical rate as settled.
 */

export const TCS_THRESHOLD_INR = 1_000_000; // ₹10 lakh aggregate per FY
export const TCS_RATES_CHECKED = "2026-07-20";
export const TCS_RATES_SOURCE =
  "https://www.incometaxindia.gov.in/w/tcs-rates";

export type RemitterStatus = "resident" | "nri";

export type LrsPurpose =
  | "family"
  | "investment"
  | "education_loan"
  | "education_self"
  | "medical";

/** Rate on the portion above the aggregate threshold. Decimal. */
export interface PurposeRate {
  rate: number;
  label: string;
  /** True when the rate is verified to a primary source for the current year. */
  verified: boolean;
  note?: string;
}

export const TCS_PURPOSE_RATES: Record<LrsPurpose, PurposeRate> = {
  education_loan: {
    rate: 0,
    label: "Overseas education funded by a qualifying loan (Sec 80E(3)(b))",
    verified: true,
    note: "Exempt from TCS collection under the Finance Act 2025 amendment.",
  },
  education_self: {
    rate: 0.05,
    label: "Overseas education (not funded by a qualifying loan)",
    verified: false,
    note: "Rate shown is the last confirmed figure; verify the current-year rate before relying on it.",
  },
  medical: {
    rate: 0.05,
    label: "Medical treatment abroad",
    verified: false,
    note: "Rate shown is the last confirmed figure; verify the current-year rate before relying on it.",
  },
  family: {
    rate: 0.2,
    label: "Family maintenance / gift / other",
    verified: false,
    note: "General LRS rate above the threshold; verify the current-year rate.",
  },
  investment: {
    rate: 0.2,
    label: "Investment abroad",
    verified: false,
    note: "General LRS rate above the threshold; verify the current-year rate.",
  },
};

export interface TcsInputs {
  remitterStatus: RemitterStatus;
  purpose: LrsPurpose;
  /** Prior LRS remittances already made this Indian financial year, in INR. */
  priorRemittedInrFY: number;
  /** The proposed remittance now, in INR. */
  currentRemittanceInr: number;
}

export interface TcsStep {
  label: string;
  value: string;
}

export interface TcsResult {
  /** True only for resident individuals — LRS does not apply to NRIs. */
  lrsApplies: boolean;
  /** When lrsApplies is false, the reason to show instead of a calculation. */
  notApplicableReason?: string;
  rate: number;
  rateVerified: boolean;
  rateNote?: string;
  aggregateBefore: number;
  aggregateAfter: number;
  /** Portion of THIS remittance that sits above the ₹10L aggregate threshold. */
  taxableBase: number;
  tcs: number;
  /** Human-readable, ordered calculation steps for display. */
  steps: TcsStep[];
}

const inr = (n: number) =>
  "₹" + Math.round(n).toLocaleString("en-IN");

export function calculateTcs(input: TcsInputs): TcsResult {
  const prior = Math.max(0, input.priorRemittedInrFY);
  const current = Math.max(0, input.currentRemittanceInr);

  // LRS is resident-only. An NRI's NRO repatriation is a different flow.
  if (input.remitterStatus === "nri") {
    return {
      lrsApplies: false,
      notApplicableReason:
        "The Liberalised Remittance Scheme (LRS) — and the Section 206C(1G) TCS that rides on it — applies to resident individuals only. As an NRI, sending money out of your NRO/NRE account is a separate FEMA repatriation flow with its own limits and paperwork (up to USD 1 million per financial year from NRO balances, subject to taxes, Form 15CA/15CB where required, and your bank's review). It is not an LRS remittance and no LRS TCS is computed here.",
      rate: 0,
      rateVerified: true,
      aggregateBefore: prior,
      aggregateAfter: prior + current,
      taxableBase: 0,
      tcs: 0,
      steps: [],
    };
  }

  const pr = TCS_PURPOSE_RATES[input.purpose];
  const aggregateAfter = prior + current;

  // TCS applies only to the portion crossing the aggregate threshold, net of
  // whatever prior remittances already consumed it.
  const usedAboveBefore = Math.max(0, prior - TCS_THRESHOLD_INR);
  const usedAboveAfter = Math.max(0, aggregateAfter - TCS_THRESHOLD_INR);
  const taxableBase = Math.max(0, usedAboveAfter - usedAboveBefore);
  const tcs = taxableBase * pr.rate;

  const steps: TcsStep[] = [
    { label: "Prior LRS remittances this financial year", value: inr(prior) },
    { label: "This remittance", value: inr(current) },
    { label: "Aggregate this financial year", value: inr(aggregateAfter) },
    { label: "Annual TCS threshold", value: inr(TCS_THRESHOLD_INR) },
    {
      label: "Portion of this remittance above the threshold",
      value: inr(taxableBase),
    },
    {
      label: `TCS rate (${pr.label})`,
      value: `${(pr.rate * 100).toFixed(pr.rate === 0 ? 0 : 1)}%`,
    },
    { label: "TCS collected", value: inr(tcs) },
  ];

  return {
    lrsApplies: true,
    rate: pr.rate,
    rateVerified: pr.verified,
    rateNote: pr.note,
    aggregateBefore: prior,
    aggregateAfter,
    taxableBase,
    tcs,
    steps,
  };
}
