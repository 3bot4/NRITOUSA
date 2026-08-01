/**
 * Pre-existing-condition / acute-onset policy-LANGUAGE analyzer.
 *
 * This is deliberately NOT a medical coverage checker. AnalyzerOutcome is a
 * closed enum of five strings (spec §F) — the return type cannot express
 * "covered", "not covered", or a diagnosis name, which is a structural
 * guard against scope creep, not just a copy convention. The function never
 * sees a diagnosis; callers must not pass one in.
 */

export type AnalyzerOutcome =
  | "may-be-considered"
  | "appears-excluded"
  | "more-information-required"
  | "certificate-must-be-reviewed"
  | "cannot-be-determined";

export const ANALYZER_OUTCOME_TEXT: Record<AnalyzerOutcome, string> = {
  "may-be-considered": "The entered policy language indicates this category may be considered.",
  "appears-excluded": "The entered policy language appears to exclude this category.",
  "more-information-required": "More information is required.",
  "certificate-must-be-reviewed": "The policy certificate must be reviewed.",
  "cannot-be-determined": "Coverage cannot be determined from these inputs.",
};

export interface PreExistingAnalyzerInput {
  hasExclusion?: boolean;
  mentionsAcuteOnset?: boolean;
  acuteOnsetMaximumCents?: number;
  insuredAge?: number;
  ageCutoff?: number;
  describedAsSuddenAndUnexpected?: boolean;
  treatmentRecommendedOrScheduledBeforeCoverage?: boolean;
  medicationChangedRecently?: boolean;
  conditionWasUnstable?: boolean;
  serviceIsEmergencyCare?: boolean;
  ongoingOrRoutineCareExcluded?: boolean;
  evacuationIncludedUnderAcuteOnset?: boolean;
  termUndefinedOrAmbiguous?: boolean;
  /** The exact certificate wording the user entered — always shown beside the result, never edited by the analyzer. */
  quotedProvision?: string;
}

export interface PreExistingAnalyzerResult {
  outcome: AnalyzerOutcome;
  outcomeText: string;
  reasons: string[];
  quotedProvision?: string;
}

/**
 * Rule-based, not diagnostic. Missing/ambiguous inputs push toward
 * "more information required" or "certificate must be reviewed" rather than
 * guessing in either direction.
 */
export function analyzePreExistingLanguage(input: PreExistingAnalyzerInput): PreExistingAnalyzerResult {
  const reasons: string[] = [];

  if (input.termUndefinedOrAmbiguous) {
    reasons.push("The certificate's wording for this provision was flagged as undefined or ambiguous.");
    return {
      outcome: "certificate-must-be-reviewed",
      outcomeText: ANALYZER_OUTCOME_TEXT["certificate-must-be-reviewed"],
      reasons,
      quotedProvision: input.quotedProvision,
    };
  }

  if (input.hasExclusion === undefined) {
    reasons.push("Whether the certificate excludes pre-existing conditions was not entered.");
    return {
      outcome: "more-information-required",
      outcomeText: ANALYZER_OUTCOME_TEXT["more-information-required"],
      reasons,
      quotedProvision: input.quotedProvision,
    };
  }

  if (!input.hasExclusion) {
    reasons.push("The entered certificate does not indicate a pre-existing-condition exclusion for this scenario.");
    return {
      outcome: "may-be-considered",
      outcomeText: ANALYZER_OUTCOME_TEXT["may-be-considered"],
      reasons,
      quotedProvision: input.quotedProvision,
    };
  }

  // An exclusion exists — the only path to "may be considered" is a described acute-onset provision.
  if (!input.mentionsAcuteOnset) {
    reasons.push("The certificate excludes pre-existing conditions and does not mention an acute-onset provision.");
    return {
      outcome: "appears-excluded",
      outcomeText: ANALYZER_OUTCOME_TEXT["appears-excluded"],
      reasons,
      quotedProvision: input.quotedProvision,
    };
  }

  if (input.ageCutoff !== undefined && input.insuredAge !== undefined && input.insuredAge > input.ageCutoff) {
    reasons.push(`The certificate's acute-onset age cutoff is ${input.ageCutoff}; the entered age (${input.insuredAge}) is above it.`);
    return {
      outcome: "appears-excluded",
      outcomeText: ANALYZER_OUTCOME_TEXT["appears-excluded"],
      reasons,
      quotedProvision: input.quotedProvision,
    };
  }

  if (input.ongoingOrRoutineCareExcluded && input.serviceIsEmergencyCare === false) {
    reasons.push("The certificate excludes ongoing or routine care under the acute-onset provision, and this scenario was entered as non-emergency care.");
    return {
      outcome: "appears-excluded",
      outcomeText: ANALYZER_OUTCOME_TEXT["appears-excluded"],
      reasons,
      quotedProvision: input.quotedProvision,
    };
  }

  if (input.treatmentRecommendedOrScheduledBeforeCoverage) {
    reasons.push("Treatment was recommended or scheduled before the coverage period began — many acute-onset provisions exclude this fact pattern, but the certificate's exact wording controls.");
    return {
      outcome: "certificate-must-be-reviewed",
      outcomeText: ANALYZER_OUTCOME_TEXT["certificate-must-be-reviewed"],
      reasons,
      quotedProvision: input.quotedProvision,
    };
  }

  const missing: string[] = [];
  if (input.describedAsSuddenAndUnexpected === undefined) missing.push("whether the event is described as sudden and unexpected");
  if (input.conditionWasUnstable === undefined) missing.push("whether the condition was stable or unstable before the event");
  if (input.medicationChangedRecently === undefined) missing.push("whether medication changed recently");
  if (input.serviceIsEmergencyCare === undefined) missing.push("whether the service being claimed is emergency care");

  if (missing.length > 0) {
    reasons.push(`Additional information would sharpen this result: ${missing.join("; ")}.`);
    return {
      outcome: "more-information-required",
      outcomeText: ANALYZER_OUTCOME_TEXT["more-information-required"],
      reasons,
      quotedProvision: input.quotedProvision,
    };
  }

  if (input.describedAsSuddenAndUnexpected && !input.conditionWasUnstable && !input.medicationChangedRecently && input.serviceIsEmergencyCare) {
    reasons.push("The certificate mentions an acute-onset provision, the event was entered as sudden and unexpected, the condition was entered as stable, and the service is emergency care.");
    if (input.acuteOnsetMaximumCents !== undefined) {
      reasons.push(`The entered acute-onset benefit maximum is ${(input.acuteOnsetMaximumCents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })} — this is a contractual ceiling, not a guarantee the claim will be paid up to that amount.`);
    }
    return {
      outcome: "may-be-considered",
      outcomeText: ANALYZER_OUTCOME_TEXT["may-be-considered"],
      reasons,
      quotedProvision: input.quotedProvision,
    };
  }

  reasons.push("The entered facts do not clearly match the certificate's acute-onset description.");
  return {
    outcome: "certificate-must-be-reviewed",
    outcomeText: ANALYZER_OUTCOME_TEXT["certificate-must-be-reviewed"],
    reasons,
    quotedProvision: input.quotedProvision,
  };
}
