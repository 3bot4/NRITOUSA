import { describe, it, expect } from "vitest";
import {
  EMPTY_INPUTS,
  evaluate,
  type Form3520Inputs,
} from "@/lib/form3520Checker";
import { form3520Rules } from "@/data/foreignGiftRules";

/**
 * Unit tests for the Form 3520 India gift checker logic. Covers the boundary
 * cases and category rules the cluster consolidation must guarantee (Phase 10).
 */

const base: Form3520Inputs = {
  ...EMPTY_INPUTS,
  taxYear: 2026,
  usPerson: "yes",
  transactionType: "gift",
  sourceCategory: "nonresident-individual",
  relationship: "parents",
  amountKnown: true,
  aggregateUsd: 50_000,
  relatedDonors: "no",
  assetType: "cash",
  heldWhere: "usa",
  generatedIncome: "no",
};

const withInputs = (o: Partial<Form3520Inputs>): Form3520Inputs => ({
  ...base,
  ...o,
});

describe("readiness gating", () => {
  it("is not ready with empty inputs", () => {
    expect(evaluate(EMPTY_INPUTS).ready).toBe(false);
  });

  it("is ready once required inputs are present", () => {
    expect(evaluate(base).ready).toBe(true);
  });
});

describe("individual / estate $100,000 boundary", () => {
  it("exactly $100,000 does NOT produce an 'exceeds' result", () => {
    const r = evaluate(withInputs({ aggregateUsd: 100_000 }));
    expect(r.primary.badge).toBe("Below the threshold");
    expect(r.primary.tone).toBe("positive");
    // Must not claim it exceeds the threshold.
    const text = r.primary.lines.join(" ").toLowerCase();
    expect(text).not.toContain("above that line");
  });

  it("above $100,000 produces a Part IV review flag", () => {
    const r = evaluate(withInputs({ aggregateUsd: 100_001 }));
    expect(r.primary.badge).toBe("Likely Part IV review");
    expect(r.primary.tone).toBe("attention");
    expect(r.primary.thresholdUsed).toContain("$100,000");
  });

  it("a foreign estate uses the same $100,000 test", () => {
    const r = evaluate(
      withInputs({ sourceCategory: "foreign-estate", aggregateUsd: 250_000 })
    );
    expect(r.primary.badge).toBe("Likely Part IV review");
    expect(r.primary.thresholdUsed).toContain("$100,000");
  });
});

describe("related-donor aggregation", () => {
  it("tells the user to combine related donors when they said yes", () => {
    const r = evaluate(withInputs({ relatedDonors: "yes" }));
    expect(r.relatedDonorTreatment.toLowerCase()).toContain("combine");
  });

  it("prompts to re-run with the combined total when they said no", () => {
    const r = evaluate(withInputs({ relatedDonors: "no" }));
    expect(r.relatedDonorTreatment.toLowerCase()).toContain("combined total");
  });
});

describe("annually-indexed entity threshold", () => {
  it("2025 uses $20,116", () => {
    const under = evaluate(
      withInputs({
        taxYear: 2025,
        sourceCategory: "foreign-corporation",
        aggregateUsd: 20_116,
      })
    );
    expect(under.primary.badge).toBe("Below the threshold");
    expect(under.primary.thresholdUsed).toContain("$20,116");

    const over = evaluate(
      withInputs({
        taxYear: 2025,
        sourceCategory: "foreign-corporation",
        aggregateUsd: 20_117,
      })
    );
    expect(over.primary.badge).toBe("Likely Part IV review");
    expect(over.primary.taxYearUsed).toBe(2025);
  });

  it("2026 uses $20,573", () => {
    const over = evaluate(
      withInputs({
        taxYear: 2026,
        sourceCategory: "foreign-partnership",
        aggregateUsd: 20_574,
      })
    );
    expect(over.primary.badge).toBe("Likely Part IV review");
    expect(over.primary.thresholdUsed).toContain("$20,573");
    expect(over.primary.taxYearUsed).toBe(2026);
  });

  it("an unconfigured tax year does NOT guess a number", () => {
    const r = evaluate(
      withInputs({
        taxYear: 2099,
        sourceCategory: "foreign-corporation",
        aggregateUsd: 50_000,
      })
    );
    expect(r.primary.badge).toBe("Verify the threshold");
    expect(r.primary.thresholdUsed.toLowerCase()).toContain("verify");
    // No configured dollar figure should be asserted for an unknown year.
    expect(r.primary.lines.join(" ")).not.toMatch(/\$20,\d{3}/);
  });
});

describe("foreign trust bypasses the ordinary gift threshold", () => {
  it("routes a foreign-trust source to a Part III review, ignoring the amount", () => {
    const r = evaluate(
      withInputs({ sourceCategory: "foreign-trust", aggregateUsd: 5_000_000 })
    );
    expect(r.primary.badge).toBe("Foreign-trust review");
    expect(r.primary.thresholdUsed.toLowerCase()).not.toContain("$100,000");
    expect(r.primary.lines.join(" ")).toContain("Part III");
  });

  it("a trust-distribution transaction also bypasses the $100k test", () => {
    const r = evaluate(
      withInputs({
        transactionType: "trust-distribution",
        sourceCategory: "nonresident-individual",
        aggregateUsd: 5_000_000,
      })
    );
    expect(r.primary.badge).toBe("Foreign-trust review");
  });
});

describe("US-person paths", () => {
  it("non-US person → Form 3520 likely N/A", () => {
    const r = evaluate(withInputs({ usPerson: "no" }));
    expect(r.ready).toBe(true);
    expect(r.primary.badge).toBe("Likely N/A");
  });

  it("unknown status → determine residency first", () => {
    const r = evaluate(withInputs({ usPerson: "not-sure" }));
    expect(r.ready).toBe(true);
    expect(r.primary.badge).toBe("Determine residency first");
  });
});

describe("additional reporting flags", () => {
  it("Indian financial account raises an FBAR/FATCA flag without asserting a filing is required", () => {
    const r = evaluate(withInputs({ heldWhere: "india", assetType: "cash" }));
    const fbar = r.flags.find((f) => f.key === "fbar");
    expect(fbar?.tone).toBe("attention");
    expect(fbar?.lines.join(" ").toLowerCase()).toContain(
      "not automatically required"
    );
  });

  it("Indian mutual funds raise a PFIC flag", () => {
    const r = evaluate(withInputs({ assetType: "mutual-fund" }));
    const pfic = r.flags.find((f) => f.key === "pfic");
    expect(pfic?.tone).toBe("attention");
    expect(pfic?.lines.join(" ")).toContain("PFIC");
  });

  it("non-cash assets raise a basis/valuation flag", () => {
    const r = evaluate(withInputs({ assetType: "property" }));
    expect(r.flags.some((f) => f.key === "basis")).toBe(true);
  });

  it("income generated raises a worldwide-income flag", () => {
    const r = evaluate(withInputs({ generatedIncome: "yes" }));
    expect(r.flags.some((f) => f.key === "income")).toBe(true);
  });
});

describe("analytics privacy", () => {
  it("never puts the entered amount in the analytics resultType", () => {
    const r = evaluate(withInputs({ aggregateUsd: 123456789 }));
    expect(r.ready).toBe(true);
    expect(r.resultType).not.toContain("123456789");
    expect(r.resultType).not.toMatch(/\d{6,}/);
  });
});

describe("result surfaces the centralized last-verified date", () => {
  it("exposes form3520Rules.lastVerified", () => {
    expect(evaluate(base).lastVerified).toBe(form3520Rules.lastVerified);
  });
});
