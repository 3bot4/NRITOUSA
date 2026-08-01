import { describe, expect, it } from "vitest";
import {
  centsToUsd,
  clampCents,
  clampPercent,
  dollarsToCents,
  isValidDateRange,
  minWithUnlimited,
  pctOfCents,
  sumCents,
} from "./money";

describe("dollarsToCents", () => {
  it("converts a plain dollar amount", () => {
    expect(dollarsToCents(25000)).toBe(2500000);
    expect(dollarsToCents("250.50")).toBe(25050);
  });
  it("rounds to the nearest cent", () => {
    expect(dollarsToCents(19.999)).toBe(2000);
  });
  it("rejects negative input by clamping to 0 (test case 43)", () => {
    expect(dollarsToCents(-500)).toBe(0);
    expect(dollarsToCents("-1")).toBe(0);
  });
  it("treats non-numeric / empty input as 0 rather than NaN", () => {
    expect(dollarsToCents("abc")).toBe(0);
    expect(dollarsToCents("")).toBe(0);
    expect(dollarsToCents(undefined)).toBe(0);
  });
});

describe("centsToUsd", () => {
  it("formats whole-dollar amounts", () => {
    expect(centsToUsd(2500000)).toBe("$25,000");
  });
  it("returns an em dash for non-finite input", () => {
    expect(centsToUsd(NaN)).toBe("—");
  });
});

describe("clampCents / clampPercent (test cases 43-44)", () => {
  it("clamps negative cents to 0", () => {
    expect(clampCents(-100)).toBe(0);
  });
  it("clamps a percentage over 100% down to 100", () => {
    expect(clampPercent(150)).toBe(100);
  });
  it("clamps a negative percentage up to 0", () => {
    expect(clampPercent(-10)).toBe(0);
  });
});

describe("pctOfCents rounding to cents (test case 45)", () => {
  it("rounds fractional cents", () => {
    // 33.33% of $10.01 = 333.6633 cents -> rounds to 334
    expect(pctOfCents(1001, 33.33)).toBe(334);
  });
});

describe("sumCents / minWithUnlimited", () => {
  it("sums a list, treating missing entries as 0", () => {
    expect(sumCents([100, undefined, 200, null])).toBe(300);
  });
  it("treats an undefined limit as unlimited", () => {
    expect(minWithUnlimited(500, undefined)).toBe(500);
    expect(minWithUnlimited(500, 200)).toBe(200);
  });
});

describe("isValidDateRange (test case 42)", () => {
  it("flags an end date before the start date", () => {
    expect(isValidDateRange("2026-08-10", "2026-08-01")).toBe(false);
  });
  it("accepts a valid range", () => {
    expect(isValidDateRange("2026-08-01", "2026-08-10")).toBe(true);
  });
  it("does not fail incomplete input — that is a separate required-field check", () => {
    expect(isValidDateRange(undefined, "2026-08-10")).toBe(true);
  });
});
