/**
 * Shared display helpers for every visitor-insurance calculator UI. Keeps
 * copy consistent across six+ calculator pages instead of restating it per
 * component. See docs/visitor-insurance/architecture.md §2.
 */
import type { ConfidenceLabel, ServiceCategory } from "@/lib/calc/visitorInsurance/types";

export const SERVICE_CATEGORY_ICONS: Record<ServiceCategory, string> = {
  physician: "🩺",
  specialist: "🧑‍⚕️",
  "urgent-care": "⛑️",
  er: "🚨",
  ambulance: "🚑",
  "hospital-admission": "🛏️",
  icu: "🫀",
  surgery: "⚕️",
  imaging: "🩻",
  lab: "🧪",
  prescription: "💊",
  "emergency-dental": "🦷",
  "physical-therapy": "🩹",
  evacuation: "✈️",
  repatriation: "🛬",
  other: "➕",
};

export const CONFIDENCE_LABEL_TEXT: Record<ConfidenceLabel, string> = {
  higher: "Higher-confidence estimate",
  moderate: "Moderate-confidence estimate",
  limited: "Limited estimate",
};

export const CONFIDENCE_TONE: Record<ConfidenceLabel, "positive" | "caution" | "attention"> = {
  higher: "positive",
  moderate: "caution",
  limited: "attention",
};

/** Human question to ask the insurer/administrator for each engine "missingInputs" key. */
export const MISSING_INPUT_QUESTIONS: Record<string, string> = {
  allowedCharge: "What is the allowed (negotiated) amount for this service, not just the billed charge?",
  networkStatus: "Is this specific provider in-network or out-of-network under my plan?",
  coverageEligibility: "Is this specific service covered, excluded, or subject to a waiting period under my certificate?",
  costSharingOrder: "In what order does the certificate apply copay, deductible, and coinsurance?",
  coinsurance: "What is the exact in-network and out-of-network coinsurance percentage, and is there a coinsurance cap?",
  deductible: "What is the exact deductible amount, and does it apply per policy, per incident, or per service?",
  policyMaximum: "What is the total policy maximum, and is it per person or shared across the policy?",
  outOfPocketMaximum: "Does this policy have a true out-of-pocket maximum, and which expenses count toward it?",
  scheduledBenefit: "What is the scheduled (fixed) benefit amount this plan pays for this specific service?",
};

/** Short "why" labels for the confidence-score badge (distinct from the longer NextQuestionsChecklist phrasing). */
export const MISSING_INPUT_SHORT_LABELS: Record<string, string> = {
  allowedCharge: "Allowed amount unknown",
  networkStatus: "Network status unknown",
  coverageEligibility: "Coverage eligibility unclear",
  costSharingOrder: "Cost-sharing order unclear",
  coinsurance: "Coinsurance terms missing",
  deductible: "Deductible terms missing",
  policyMaximum: "No policy maximum entered",
  outOfPocketMaximum: "No out-of-pocket maximum entered",
  scheduledBenefit: "Scheduled benefit missing",
};

/** Natural-language quick-pick bands for Basic Mode — replace typing an exact figure. */
export const DEDUCTIBLE_BANDS = [
  { label: "$0", value: "0" },
  { label: "~$100", value: "100" },
  { label: "~$250", value: "250" },
  { label: "~$500", value: "500" },
  { label: "~$1,000", value: "1000" },
  { label: "$2,000+", value: "2000" },
];

export const COINSURANCE_BANDS = [
  { label: "Insurance pays it all", sublabel: "100% after deductible", value: "0" },
  { label: "Insurance pays most", sublabel: "~90/10 or 80/20", value: "15" },
  { label: "Roughly 70/30", value: "30" },
  { label: "About 50/50", value: "50" },
];

export const POLICY_MAX_BANDS = [
  { label: "$25,000", value: "25000" },
  { label: "$50,000", value: "50000" },
  { label: "$100,000", value: "100000" },
  { label: "$250,000", value: "250000" },
  { label: "$500,000+", value: "500000" },
];

export const CONFIDENCE_DOT: Record<ConfidenceLabel, string> = {
  higher: "bg-emerald-500",
  moderate: "bg-amber-500",
  limited: "bg-rose-500",
};

export const EDUCATIONAL_ESTIMATE_NOTE =
  "This tool provides educational estimates based on the information you enter. The policy certificate controls, and the insurer or claims administrator makes the final benefit determination.";

export const UNCAPPED_EXPOSURE_NOTE = "Your total exposure may exceed this estimate.";

export const RESULT_DOES_NOT_GUARANTEE = [
  "Medical necessity determination",
  "Claim approval",
  "Network participation",
  "The allowed (negotiated) charge",
  "Balance billing by any specific provider",
  "How the insurer or administrator will interpret the policy",
  "The final insurer reimbursement amount",
];
