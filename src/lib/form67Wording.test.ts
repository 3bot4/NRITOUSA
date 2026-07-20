/**
 * Guards the Form 67 deadline wording on the DTAA calculator.
 *
 * The current official rule (incometaxindia.gov.in "Double taxation relief"):
 * Form 67 is generally furnished by the END OF THE ASSESSMENT YEAR; for foreign
 * income included via an updated return under 139(8A), by the date the updated
 * return is filed. The old "by the original return due date" statement must not
 * reappear.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getCalculatorContent } from "./calculatorContent";

// Collect all Form-67 wording that ships: the DTAA hub content plus the
// calculator component source (the visible on-page text).
const dtaa = getCalculatorContent("dtaa-foreign-tax-credit")!;
const contentText = JSON.stringify(dtaa);
const componentText = readFileSync(
  join(__dirname, "..", "components", "calculators", "DtaaReliefCalculator.tsx"),
  "utf8",
).replace(/\s+/g, " "); // normalize JSX line-wrapping so phrases match

describe("Form 67 — assessment-year deadline for original/belated returns", () => {
  it("hub content states the end-of-assessment-year rule", () => {
    expect(contentText).toContain("end of the assessment year");
  });

  it("the calculator page states the end-of-assessment-year rule", () => {
    expect(componentText).toContain("end of the assessment year");
  });
});

describe("Form 67 — updated-return copy uses the updated-return filing date", () => {
  it("hub content ties 139(8A) to the updated-return filing date", () => {
    expect(contentText).toContain("139(8A)");
    expect(contentText).toContain("date the updated return is filed");
  });

  it("the calculator page ties 139(8A) to the updated-return filing date", () => {
    expect(componentText).toContain("139(8A)");
    expect(componentText).toContain("date the updated return is filed");
  });
});

describe("Form 67 — the old original-return-due-date claim is gone", () => {
  const forbidden = [
    /before your Indian return/i,
    /by the original return due date/i,
    /by your income-tax return deadline/i,
    /must always be filed by/i,
  ];

  it.each(forbidden)("hub content does not contain %s", (re) => {
    expect(contentText).not.toMatch(re);
  });

  it.each(forbidden)("calculator page does not contain %s", (re) => {
    expect(componentText).not.toMatch(re);
  });
});
