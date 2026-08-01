/**
 * Shared types for the visitor-insurance calculation engine. All monetary
 * fields are integer cents (see money.ts). Nothing in this file invents a
 * default benefit — every optional field that is left undefined must be
 * treated by the engine as "not entered", never silently assumed to be zero,
 * unlimited, or absent. See docs/visitor-insurance/architecture.md §2.
 */

export type ServiceCategory =
  | "physician"
  | "specialist"
  | "urgent-care"
  | "er"
  | "ambulance"
  | "hospital-admission"
  | "icu"
  | "surgery"
  | "imaging"
  | "lab"
  | "prescription"
  | "emergency-dental"
  | "physical-therapy"
  | "evacuation"
  | "repatriation"
  | "other";

export const SERVICE_CATEGORIES: { value: ServiceCategory; label: string }[] = [
  { value: "physician", label: "Primary-care / physician visit" },
  { value: "specialist", label: "Specialist visit" },
  { value: "urgent-care", label: "Urgent care" },
  { value: "er", label: "Emergency room" },
  { value: "ambulance", label: "Ambulance" },
  { value: "hospital-admission", label: "Hospital admission" },
  { value: "icu", label: "ICU" },
  { value: "surgery", label: "Surgery" },
  { value: "imaging", label: "Diagnostic imaging" },
  { value: "lab", label: "Laboratory services" },
  { value: "prescription", label: "Prescription medication" },
  { value: "emergency-dental", label: "Emergency dental" },
  { value: "physical-therapy", label: "Physical therapy" },
  { value: "evacuation", label: "Medical evacuation" },
  { value: "repatriation", label: "Repatriation" },
  { value: "other", label: "Other" },
];

export type PlanType = "comprehensive" | "fixed-benefit" | "hybrid";

export type NetworkStatus = "in-network" | "out-of-network" | "unknown";
export type CoverageEligibility = "covered" | "excluded" | "unknown";

/** Order in which a comprehensive plan applies cost-sharing steps. Configurable — never assumed. */
export type CostSharingStep = "copay" | "serviceDeductible" | "generalDeductible" | "coinsurance";

export type DeductibleFrequency = "policy" | "incident" | "service";
export type DeductibleScope = "individual" | "shared-family" | "embedded-individual";
export type MaximumScope = "individual" | "shared";

export interface DeductibleTerms {
  /** Individual (or embedded-individual) deductible amount, in cents. */
  amountCents: number;
  /** Required only when scope is "shared-family" or "embedded-individual" — the shared pool amount. */
  familyAmountCents?: number;
  frequency: DeductibleFrequency;
  scope: DeductibleScope;
}

export interface CoinsuranceTerms {
  inNetworkMemberPct: number;
  outOfNetworkMemberPct?: number;
  /** Cents of eligible charge above which the plan pays 100% (member coinsurance stops). */
  thresholdCents?: number;
  /** Maximum cents the member can owe in coinsurance before the plan covers 100%. */
  capCents?: number;
}

export interface CopayTerms {
  amountCents: number;
  appliesBeforeDeductible: boolean;
  /** Empty/undefined = applies to every service category. */
  services?: ServiceCategory[];
}

export interface ErRule {
  copayCents?: number;
  deductibleCents?: number;
  waivedIfAdmitted?: boolean;
}

export interface OutOfPocketMaximumTerms {
  amountCents: number;
  scope: "individual" | "shared-family";
  countsToward: {
    deductible: boolean;
    copay: boolean;
    coinsurance: boolean;
    outOfNetwork: boolean;
    nonCovered: boolean;
  };
}

export interface PolicyMaximumTerms {
  scope: MaximumScope;
  amountCents: number;
}

export interface PreExistingTerms {
  hasExclusion?: boolean;
  mentionsAcuteOnset?: boolean;
  acuteOnsetMaximumCents?: number;
  ageLimitation?: number;
  evacuationIncludedUnderAcuteOnset?: boolean;
  /** The exact certificate wording the user pasted in, shown beside the analyzer's result. */
  quotedProvision?: string;
}

export interface PolicyTerms {
  id?: string;
  /** Label shown in comparisons, e.g. "Plan A". */
  label?: string;
  planType: PlanType;
  /** Comprehensive (and the comprehensive side of a hybrid) only. Absent => engine cannot run comprehensive math and must say so. */
  costSharingOrder?: CostSharingStep[];
  premiumCents: number;
  premiumScope: "per-traveler" | "per-policy";
  policyMaximum?: PolicyMaximumTerms;
  perIncidentMaximumCents?: number;
  deductible?: DeductibleTerms;
  coinsurance?: CoinsuranceTerms;
  copay?: CopayTerms;
  erRule?: ErRule;
  outOfPocketMaximum?: OutOfPocketMaximumTerms;
  serviceSublimits?: Partial<Record<ServiceCategory, number>>;
  /** Fixed-benefit / hybrid only: flat plan payment for the service, in cents. */
  scheduledBenefits?: Partial<Record<ServiceCategory, number>>;
  preExisting?: PreExistingTerms;
  evacuationMaximumCents?: number;
  repatriationMaximumCents?: number;
  networkType?: "PPO" | "none-stated" | "unknown";
  /**
   * If true, when allowedChargeCents is missing on a claim the engine will
   * fall back to billedChargeCents as the calculation base, clearly flagged.
   * If false, missing allowed charge blocks network-cost-sharing math for
   * that claim instead of silently guessing.
   */
  allowSimplifiedAllowedCharge?: boolean;
}

export interface Claimant {
  id: string;
  label?: string;
  age?: number;
}

export interface Claim {
  claimantId: string;
  /** Claims sharing an incidentId share one per-incident maximum / per-incident deductible. */
  incidentId?: string;
  date?: string;
  serviceCategory: ServiceCategory;
  billedChargeCents: number;
  allowedChargeCents?: number;
  networkStatus: NetworkStatus;
  coverageEligibility: CoverageEligibility;
  /** Only meaningful when serviceCategory is "er" — drives erRule.waivedIfAdmitted. */
  erAdmitted?: boolean;
  notes?: string;
}

export interface LedgerLine {
  step: string;
  label: string;
  amountCents: number;
}

export interface MemberLiabilityBreakdown {
  deductibleCents: number;
  copayCents: number;
  coinsuranceCents: number;
  balanceBillingCents: number;
  nonCoveredCents: number;
  aboveSublimitCents: number;
  aboveScheduledBenefitCents: number;
  abovePolicyMaximumCents: number;
  totalCents: number;
}

export type ConfidenceLabel = "higher" | "moderate" | "limited";

export interface ClaimResult {
  claimantId: string;
  claim: Claim;
  ledger: LedgerLine[];
  insurerPaymentCents: number;
  memberLiability: MemberLiabilityBreakdown;
  remaining: {
    deductibleCents?: number;
    policyMaximumCents?: number;
    sublimitCents?: number;
    outOfPocketMaximumCents?: number;
    perIncidentMaximumCents?: number;
  };
  missingInputs: string[];
  confidence: ConfidenceLabel;
  /** Drives "Your total exposure may exceed this estimate." */
  uncappedExposureWarning: boolean;
}

export interface HouseholdMemberInput {
  claimant: Claimant;
  policy: PolicyTerms;
  claims: Claim[];
}

export interface HouseholdResult {
  perClaimant: Record<string, ClaimResult[]>;
  claimantOrder: string[];
  aggregatePremiumCents: number;
  aggregateMedicalLiabilityCents: number;
  aggregateInsurerPaymentCents: number;
  aggregateTotalCostCents: number;
  sharedProvisionsApplied: ("deductible" | "outOfPocketMaximum" | "policyMaximum")[];
  uncappedExposureWarning: boolean;
}
