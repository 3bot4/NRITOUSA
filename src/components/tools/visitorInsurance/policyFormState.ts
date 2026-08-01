/**
 * String-based form state for one policy's Detailed Policy Mode terms, plus
 * the pure converter into the engine's PolicyTerms. Shared by every
 * visitor-insurance calculator so the same ~30 certificate fields are
 * gathered and converted identically everywhere. See
 * docs/visitor-insurance/architecture.md §2.
 */
import { dollarsToCents } from "@/lib/calc/visitorInsurance/money";
import type { CostSharingStep, PlanType, PolicyTerms, ServiceCategory } from "@/lib/calc/visitorInsurance/types";

export type CostSharingPreset =
  | "copay-deductible-coinsurance"
  | "deductible-copay-coinsurance"
  | "deductible-coinsurance"
  | "copay-only"
  | "first-dollar"
  | "unknown";

export const COST_SHARING_PRESETS: { value: CostSharingPreset; label: string; order?: CostSharingStep[] }[] = [
  { value: "unknown", label: "I don't know / not stated in the certificate" },
  { value: "copay-deductible-coinsurance", label: "Copay → deductible → coinsurance", order: ["copay", "generalDeductible", "coinsurance"] },
  { value: "deductible-copay-coinsurance", label: "Deductible → copay → coinsurance", order: ["generalDeductible", "copay", "coinsurance"] },
  { value: "deductible-coinsurance", label: "Deductible → coinsurance (no copay)", order: ["generalDeductible", "coinsurance"] },
  { value: "copay-only", label: "Copay only (insurer pays the rest)", order: ["copay"] },
  { value: "first-dollar", label: "First-dollar coverage (no cost-sharing steps)", order: [] },
];

export interface PolicyFormState {
  label: string;
  planType: PlanType;
  premium: string;
  premiumScope: "per-traveler" | "per-policy";
  policyMaxAmount: string;
  policyMaxScope: "individual" | "shared";
  perIncidentMax: string;
  deductibleAmount: string;
  deductibleFamilyAmount: string;
  deductibleFrequency: "policy" | "incident" | "service";
  deductibleScope: "individual" | "shared-family" | "embedded-individual";
  costSharingPreset: CostSharingPreset;
  coinsuranceInNetworkPct: string;
  coinsuranceOutOfNetworkPct: string;
  coinsuranceThreshold: string;
  coinsuranceCap: string;
  copayAmount: string;
  erCopay: string;
  erDeductible: string;
  erWaivedIfAdmitted: boolean;
  oopMaxEnabled: boolean;
  oopMaxAmount: string;
  oopMaxScope: "individual" | "shared-family";
  oopCountsDeductible: boolean;
  oopCountsCopay: boolean;
  oopCountsCoinsurance: boolean;
  oopCountsOutOfNetwork: boolean;
  oopCountsNonCovered: boolean;
  networkType: "PPO" | "none-stated" | "unknown";
  evacuationMax: string;
  repatriationMax: string;
  scheduledPhysician: string;
  scheduledUrgentCare: string;
  scheduledEr: string;
  scheduledHospitalAdmission: string;
}

export const BLANK_POLICY_FORM: PolicyFormState = {
  label: "Plan A",
  planType: "comprehensive",
  premium: "",
  premiumScope: "per-traveler",
  policyMaxAmount: "",
  policyMaxScope: "individual",
  perIncidentMax: "",
  deductibleAmount: "",
  deductibleFamilyAmount: "",
  deductibleFrequency: "policy",
  deductibleScope: "individual",
  costSharingPreset: "unknown",
  coinsuranceInNetworkPct: "",
  coinsuranceOutOfNetworkPct: "",
  coinsuranceThreshold: "",
  coinsuranceCap: "",
  copayAmount: "",
  erCopay: "",
  erDeductible: "",
  erWaivedIfAdmitted: false,
  oopMaxEnabled: false,
  oopMaxAmount: "",
  oopMaxScope: "individual",
  oopCountsDeductible: true,
  oopCountsCopay: true,
  oopCountsCoinsurance: true,
  oopCountsOutOfNetwork: false,
  oopCountsNonCovered: false,
  networkType: "unknown",
  evacuationMax: "",
  repatriationMax: "",
  scheduledPhysician: "",
  scheduledUrgentCare: "",
  scheduledEr: "",
  scheduledHospitalAdmission: "",
};

export const EXAMPLE_POLICY_FORM: PolicyFormState = {
  ...BLANK_POLICY_FORM,
  label: "Plan A (example)",
  premium: "1250",
  policyMaxAmount: "100000",
  deductibleAmount: "250",
  deductibleFrequency: "policy",
  deductibleScope: "individual",
  costSharingPreset: "deductible-coinsurance",
  coinsuranceInNetworkPct: "20",
  coinsuranceOutOfNetworkPct: "40",
  networkType: "PPO",
  oopMaxEnabled: false,
};

function presetOrder(preset: CostSharingPreset): CostSharingStep[] | undefined {
  return COST_SHARING_PRESETS.find((p) => p.value === preset)?.order;
}

/** Pure conversion from form strings to the engine's PolicyTerms. Never invents a value the user left blank. */
export function toPolicyTerms(f: PolicyFormState): PolicyTerms {
  const scheduledBenefits: Partial<Record<ServiceCategory, number>> = {};
  if (f.scheduledPhysician) scheduledBenefits.physician = dollarsToCents(f.scheduledPhysician);
  if (f.scheduledUrgentCare) scheduledBenefits["urgent-care"] = dollarsToCents(f.scheduledUrgentCare);
  if (f.scheduledEr) scheduledBenefits.er = dollarsToCents(f.scheduledEr);
  if (f.scheduledHospitalAdmission) scheduledBenefits["hospital-admission"] = dollarsToCents(f.scheduledHospitalAdmission);

  return {
    label: f.label,
    planType: f.planType,
    costSharingOrder: f.costSharingPreset === "unknown" ? undefined : presetOrder(f.costSharingPreset),
    premiumCents: dollarsToCents(f.premium),
    premiumScope: f.premiumScope,
    policyMaximum: f.policyMaxAmount ? { scope: f.policyMaxScope, amountCents: dollarsToCents(f.policyMaxAmount) } : undefined,
    perIncidentMaximumCents: f.perIncidentMax ? dollarsToCents(f.perIncidentMax) : undefined,
    deductible: f.deductibleAmount
      ? {
          amountCents: dollarsToCents(f.deductibleAmount),
          familyAmountCents: f.deductibleFamilyAmount ? dollarsToCents(f.deductibleFamilyAmount) : undefined,
          frequency: f.deductibleFrequency,
          scope: f.deductibleScope,
        }
      : undefined,
    coinsurance: f.coinsuranceInNetworkPct
      ? {
          inNetworkMemberPct: Number(f.coinsuranceInNetworkPct) || 0,
          outOfNetworkMemberPct: f.coinsuranceOutOfNetworkPct ? Number(f.coinsuranceOutOfNetworkPct) || 0 : undefined,
          thresholdCents: f.coinsuranceThreshold ? dollarsToCents(f.coinsuranceThreshold) : undefined,
          capCents: f.coinsuranceCap ? dollarsToCents(f.coinsuranceCap) : undefined,
        }
      : undefined,
    copay: f.copayAmount ? { amountCents: dollarsToCents(f.copayAmount), appliesBeforeDeductible: f.costSharingPreset === "copay-deductible-coinsurance" || f.costSharingPreset === "copay-only" } : undefined,
    erRule:
      f.erCopay || f.erDeductible
        ? {
            copayCents: f.erCopay ? dollarsToCents(f.erCopay) : undefined,
            deductibleCents: f.erDeductible ? dollarsToCents(f.erDeductible) : undefined,
            waivedIfAdmitted: f.erWaivedIfAdmitted,
          }
        : undefined,
    outOfPocketMaximum: f.oopMaxEnabled && f.oopMaxAmount
      ? {
          amountCents: dollarsToCents(f.oopMaxAmount),
          scope: f.oopMaxScope,
          countsToward: {
            deductible: f.oopCountsDeductible,
            copay: f.oopCountsCopay,
            coinsurance: f.oopCountsCoinsurance,
            outOfNetwork: f.oopCountsOutOfNetwork,
            nonCovered: f.oopCountsNonCovered,
          },
        }
      : undefined,
    scheduledBenefits: Object.keys(scheduledBenefits).length > 0 ? scheduledBenefits : undefined,
    evacuationMaximumCents: f.evacuationMax ? dollarsToCents(f.evacuationMax) : undefined,
    repatriationMaximumCents: f.repatriationMax ? dollarsToCents(f.repatriationMax) : undefined,
    networkType: f.networkType,
  };
}
