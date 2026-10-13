import { describe, expect, it } from "vitest";
import {
  identifyNumber,
  maskNumber,
  normalizeNumber,
  DOCUMENT_CHOICES,
} from "./numberIdentify";

describe("normalisation", () => {
  it("strips the formatting people type", () => {
    expect(normalizeNumber("a 012-345-678")).toBe("A012345678");
    expect(normalizeNumber("lin 1234567890")).toBe("LIN1234567890");
    expect(normalizeNumber("  ")).toBe("");
  });
});

describe("masking", () => {
  it("shows only the last three characters", () => {
    expect(maskNumber("A012345678")).toBe("•••••••678");
    expect(maskNumber("12")).toBe("12");
  });

  it("never lengthens or shortens the value", () => {
    const v = "LIN1234567890";
    expect(maskNumber(v)).toHaveLength(v.length);
  });
});

describe("identification", () => {
  it("identifies an A-number by its prefix", () => {
    const r = identifyNumber("A012345678");
    expect(r.matches[0].type.id).toBe("a-number");
    expect(r.matches[0].confidence).toBe("exact");
  });

  it("identifies a receipt number by its service-centre prefix", () => {
    const r = identifyNumber("LIN2412345678");
    expect(r.matches[0].type.id).toBe("receipt-number");
    expect(r.matches[0].confidence).toBe("exact");
  });

  it("identifies an IOE receipt number", () => {
    expect(identifyNumber("IOE0912345678").matches[0].type.id).toBe("receipt-number");
  });

  it("identifies a SEVIS ID by its N prefix", () => {
    const r = identifyNumber("N0012345678");
    expect(r.matches[0].type.id).toBe("sevis-id");
  });

  it("identifies an 11-digit I-94 number", () => {
    const ids = identifyNumber("12345678901").matches.map((m) => m.type.id);
    expect(ids).toContain("i94-number");
  });

  it("identifies a 12-digit online account number", () => {
    const ids = identifyNumber("123456789012").matches.map((m) => m.type.id);
    expect(ids).toContain("online-account");
  });

  // Ambiguity is a result, not a failure.
  it("reports overlap rather than guessing on a bare 8-digit number", () => {
    const r = identifyNumber("12345678");
    const ids = r.matches.map((m) => m.type.id);
    expect(ids).toContain("visa-control");
    expect(ids).toContain("a-number");
    expect(r.guidance).toContain("look at the label");
  });

  it("marks a prefix-less match as possible rather than exact", () => {
    const r = identifyNumber("123456789");
    expect(r.matches.every((m) => m.confidence === "possible")).toBe(true);
  });

  it("returns nothing for a shape that fits none of them", () => {
    const r = identifyNumber("XYZ-42");
    expect(r.matches).toEqual([]);
    expect(r.guidance).toContain("does not match");
  });

  it("names the Indian identifiers that are not US numbers", () => {
    expect(identifyNumber("A1234567").guidance + identifyNumber("ZZ99").guidance)
      .toMatch(/OCI/);
  });

  it("handles empty input without throwing", () => {
    const r = identifyNumber("");
    expect(r.matches).toEqual([]);
    expect(r.guidance).toContain("leaves your browser");
  });
});

describe("document cross-check", () => {
  it("offers a document list the tool can check against", () => {
    expect(DOCUMENT_CHOICES.length).toBeGreaterThanOrEqual(8);
    expect(DOCUMENT_CHOICES).toContain("Green card (Form I-551)");
    expect(DOCUMENT_CHOICES).toContain("Nonimmigrant visa foil");
  });

  it("flags a receipt number typed under a green card", () => {
    const r = identifyNumber("LIN2412345678", "Green card (Form I-551)");
    expect(r.mismatch).toBeDefined();
    expect(r.mismatch).toContain("A-Number");
  });

  it("does not flag a correct pairing", () => {
    expect(identifyNumber("A012345678", "Green card (Form I-551)").mismatch).toBeUndefined();
    expect(identifyNumber("N0012345678", "Form I-20 or DS-2019").mismatch).toBeUndefined();
  });

  it("knows a nonimmigrant visa foil carries a control number, not an A-number", () => {
    const r = identifyNumber("12345678", "Nonimmigrant visa foil");
    expect(r.mismatch).toBeUndefined();
    expect(r.matches.map((m) => m.type.id)).toContain("visa-control");
  });
});

describe("privacy", () => {
  it("echoes a masked value, never the raw digits", () => {
    const r = identifyNumber("A012345678");
    expect(r.masked).not.toContain("012345");
    expect(r.masked.endsWith("678")).toBe(true);
  });
});
