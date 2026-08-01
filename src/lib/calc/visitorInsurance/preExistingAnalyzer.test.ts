import { describe, expect, it } from "vitest";
import { analyzePreExistingLanguage } from "./preExistingAnalyzer";

describe("analyzePreExistingLanguage", () => {
  it("never returns a coverage/diagnosis verdict — output is a closed enum", () => {
    const outcomes = [
      analyzePreExistingLanguage({}).outcome,
      analyzePreExistingLanguage({ hasExclusion: false }).outcome,
      analyzePreExistingLanguage({ hasExclusion: true, mentionsAcuteOnset: false }).outcome,
    ];
    for (const o of outcomes) {
      expect(["may-be-considered", "appears-excluded", "more-information-required", "certificate-must-be-reviewed", "cannot-be-determined"]).toContain(o);
    }
  });

  it("flags ambiguous/undefined wording for certificate review first", () => {
    const r = analyzePreExistingLanguage({ termUndefinedOrAmbiguous: true });
    expect(r.outcome).toBe("certificate-must-be-reviewed");
  });

  it("asks for more information when exclusion status was not entered", () => {
    const r = analyzePreExistingLanguage({});
    expect(r.outcome).toBe("more-information-required");
  });

  it("no exclusion entered => may be considered", () => {
    const r = analyzePreExistingLanguage({ hasExclusion: false });
    expect(r.outcome).toBe("may-be-considered");
  });

  it("exclusion with no acute-onset mention => appears excluded", () => {
    const r = analyzePreExistingLanguage({ hasExclusion: true, mentionsAcuteOnset: false });
    expect(r.outcome).toBe("appears-excluded");
  });

  it("age limitation: age above the acute-onset cutoff => appears excluded (test case: age limitation)", () => {
    const r = analyzePreExistingLanguage({
      hasExclusion: true,
      mentionsAcuteOnset: true,
      ageCutoff: 70,
      insuredAge: 81,
    });
    expect(r.outcome).toBe("appears-excluded");
    expect(r.reasons.join(" ")).toMatch(/age cutoff/i);
  });

  it("treatment scheduled before coverage began => certificate must be reviewed", () => {
    const r = analyzePreExistingLanguage({
      hasExclusion: true,
      mentionsAcuteOnset: true,
      treatmentRecommendedOrScheduledBeforeCoverage: true,
    });
    expect(r.outcome).toBe("certificate-must-be-reviewed");
  });

  it("missing sudden/unstable/emergency facts => more information required", () => {
    const r = analyzePreExistingLanguage({ hasExclusion: true, mentionsAcuteOnset: true });
    expect(r.outcome).toBe("more-information-required");
  });

  it("full acute-onset fact pattern => may be considered, and surfaces the entered benefit maximum (test case: acute-onset benefit maximum)", () => {
    const r = analyzePreExistingLanguage({
      hasExclusion: true,
      mentionsAcuteOnset: true,
      describedAsSuddenAndUnexpected: true,
      conditionWasUnstable: false,
      medicationChangedRecently: false,
      serviceIsEmergencyCare: true,
      acuteOnsetMaximumCents: 2000000,
    });
    expect(r.outcome).toBe("may-be-considered");
    expect(r.reasons.join(" ")).toMatch(/\$20,000/);
  });

  it("always echoes the user-entered provision text beside the result", () => {
    const r = analyzePreExistingLanguage({ hasExclusion: false, quotedProvision: "We do not cover pre-existing conditions except..." });
    expect(r.quotedProvision).toBe("We do not cover pre-existing conditions except...");
  });

  it("never outputs a diagnosis-based verdict string", () => {
    const r = analyzePreExistingLanguage({
      hasExclusion: true,
      mentionsAcuteOnset: true,
      describedAsSuddenAndUnexpected: true,
      conditionWasUnstable: false,
      medicationChangedRecently: false,
      serviceIsEmergencyCare: true,
    });
    expect(r.outcomeText).not.toMatch(/covered|approved|heart attack|diabetes/i);
  });
});
