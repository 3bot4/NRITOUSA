import { describe, expect, it } from "vitest";
import {
  usEstateNumbers,
  indiaEstateNumbers,
  ESTATE_DATA_VERIFIED,
} from "./estatePlanningData";

/**
 * The ledger carried a standing instruction to re-verify this file every
 * January because "US transfer-tax figures reset each year". That is true of
 * the inflation-indexed amounts and false of the reporting thresholds, and the
 * conflation is dangerous in one direction: a January sweep that "updates" the
 * fixed thresholds would invent numbers that do not exist.
 *
 * The four that must never be bumped for inflation:
 *   • $60,000 — US-situs assets threshold for Form 706-NA. The IRS states
 *     expressly that it is not indexed for inflation.
 *   • $10,000 — FBAR aggregate threshold, unchanged since the BSA regulations.
 *   • Form 8938 thresholds ($50k/$75k, $100k/$150k, $200k/$300k, $400k/$600k).
 *   • Form 3520 foreign-gift threshold ($100,000) and its penalty percentages.
 */

const FIXED_VALUES: Record<string, string> = {
  nrncFilingThreshold: "$60,000",
  fbarThreshold: "$10,000",
  form8938DomesticSingle: "$50,000",
  form8938DomesticJoint: "$100,000",
  form8938AbroadSingle: "$200,000",
  form8938AbroadJoint: "$400,000",
  form3520ForeignGift: "$100,000",
  form3520PenaltyCap: "25%",
  form3520Penalty: "5%",
};

const FIXED_ANY_TIME: Record<string, string> = {
  form8938DomesticSingle: "$75,000",
  form8938DomesticJoint: "$150,000",
  form8938AbroadSingle: "$300,000",
  form8938AbroadJoint: "$600,000",
};

describe("every figure declares which class it is in", () => {
  it("tags all US and India figures", () => {
    for (const [key, n] of Object.entries({
      ...usEstateNumbers,
      ...indiaEstateNumbers,
    })) {
      expect(
        ["annual-inflation", "fixed-statutory"],
        `${key} has no indexation class`,
      ).toContain(n.indexation);
    }
  });

  it("has figures in both classes, so the split is real", () => {
    const all = Object.values(usEstateNumbers);
    expect(all.some((n) => n.indexation === "annual-inflation")).toBe(true);
    expect(all.some((n) => n.indexation === "fixed-statutory")).toBe(true);
  });
});

describe("fixed thresholds are never treated as annual inflation adjustments", () => {
  it("classifies each of the four fixed families as fixed-statutory", () => {
    for (const key of Object.keys(FIXED_VALUES)) {
      const n = usEstateNumbers[key as keyof typeof usEstateNumbers];
      expect(n, `${key} missing`).toBeDefined();
      expect(
        n.indexation,
        `${key} is marked inflation-indexed — a January sweep would invent a number`,
      ).toBe("fixed-statutory");
    }
  });

  it("pins each fixed value so a sweep cannot quietly move it", () => {
    for (const [key, value] of Object.entries(FIXED_VALUES)) {
      const n = usEstateNumbers[key as keyof typeof usEstateNumbers];
      expect(n.value, `${key} changed from its statutory value`).toBe(value);
    }
    for (const [key, anyTime] of Object.entries(FIXED_ANY_TIME)) {
      const n = usEstateNumbers[key as keyof typeof usEstateNumbers] as {
        anyTimeValue?: string;
      };
      expect(n.anyTimeValue, `${key} any-time value changed`).toBe(anyTime);
    }
  });

  it("says out loud that the $60,000 threshold is not indexed", () => {
    // This is the one the IRS is explicit about, and the one most likely to be
    // "corrected" by someone assuming every estate figure moves.
    const n = usEstateNumbers.nrncFilingThreshold;
    expect(n.note).toMatch(/not indexed for inflation/i);
    expect(n.indexation).toBe("fixed-statutory");
  });

  it("does not carry a year label on a fixed threshold", () => {
    // A "(2026)" on a fixed figure implies next year brings a new one.
    for (const key of Object.keys(FIXED_VALUES)) {
      const n = usEstateNumbers[key as keyof typeof usEstateNumbers];
      expect(
        /\((19|20)\d{2}\)|\b(for )?tax year (19|20)\d{2}\b/i.test(n.label),
        `${key} is fixed but its label implies an annual vintage: "${n.label}"`,
      ).toBe(false);
    }
  });

  it("keeps a year label on the inflation-indexed amounts", () => {
    // The mirror image: an indexed amount without a year is unreadable a year
    // later, because you cannot tell which vintage it belongs to.
    const indexed = Object.entries(usEstateNumbers).filter(
      ([, n]) => n.indexation === "annual-inflation",
    );
    expect(indexed.length).toBeGreaterThan(0);
    for (const [key, n] of indexed) {
      expect(
        /(19|20)\d{2}/.test(`${n.label} ${n.note ?? ""}`),
        `${key} is inflation-indexed but names no year`,
      ).toBe(true);
    }
  });
});

describe("the India figures", () => {
  it("are all fixed-statutory, not on any inflation cycle", () => {
    for (const [key, n] of Object.entries(indiaEstateNumbers)) {
      expect(n.indexation, `${key} should be fixed-statutory`).toBe(
        "fixed-statutory",
      );
    }
  });
});

describe("verification stamps", () => {
  it("uses one ISO stamp across the file", () => {
    expect(ESTATE_DATA_VERIFIED).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    for (const [key, n] of Object.entries({
      ...usEstateNumbers,
      ...indiaEstateNumbers,
    })) {
      expect(n.lastVerified, `${key} has its own stamp`).toBe(
        ESTATE_DATA_VERIFIED,
      );
    }
  });
});
