import { describe, expect, it } from "vitest";
import {
  AGE,
  DAYS_IN_YEAR,
  FX_USD_INR,
  PERCENT,
  USD_AMOUNT,
  validateAll,
  validateField,
  type FieldSpec,
} from "./validation";

/**
 * The shared matrix every calculator input must survive: valid normal case,
 * zero, negative, very large, decimal, empty, invalid text, boundary below,
 * exact boundary, and boundary above.
 */
describe("validateField — shared input matrix", () => {
  const spec: FieldSpec = { label: "Amount", min: 0, max: 1000 };

  it("accepts a valid normal value", () => {
    expect(validateField("500", spec)).toEqual({ value: 500, error: null });
  });

  it("accepts zero as a real value, not as a fallback", () => {
    expect(validateField("0", spec)).toEqual({ value: 0, error: null });
  });

  it("rejects a negative value", () => {
    const r = validateField("-1", spec);
    expect(r.error).toBe("Amount cannot be less than 0.");
  });

  it("rejects a very large value above max", () => {
    expect(validateField("1e12", spec).error).toContain("cannot be more than");
  });

  it("accepts a decimal", () => {
    expect(validateField("123.45", spec)).toEqual({ value: 123.45, error: null });
  });

  it("treats empty as the fallback when the field is optional", () => {
    expect(validateField("", spec)).toEqual({ value: 0, error: null });
  });

  it("errors on empty when the field is required", () => {
    expect(validateField("", { ...spec, required: true }).error).toBe(
      "Amount is required.",
    );
  });

  it("rejects invalid text", () => {
    expect(validateField("abc", spec).error).toBe("Amount must be a number.");
  });

  it("rejects text with a leading number rather than silently truncating it", () => {
    // parseFloat("12abc") === 12; Number("12abc") === NaN. We want the latter.
    expect(validateField("12abc", spec).error).toBe("Amount must be a number.");
  });

  it("rejects Infinity", () => {
    expect(validateField("Infinity", spec).error).toBe(
      "Amount must be a finite number.",
    );
  });

  it("rejects the boundary below min", () => {
    expect(validateField("-0.01", spec).error).toContain("cannot be less than");
  });

  it("accepts the exact lower boundary", () => {
    expect(validateField("0", spec).error).toBeNull();
  });

  it("accepts the exact upper boundary", () => {
    expect(validateField("1000", spec).error).toBeNull();
  });

  it("rejects the boundary above max", () => {
    expect(validateField("1000.01", spec).error).toContain("cannot be more than");
  });

  it("strips thousands separators", () => {
    expect(validateField("1,000", spec)).toEqual({ value: 1000, error: null });
  });

  it("never returns a non-finite value even when erroring", () => {
    for (const bad of ["abc", "Infinity", "-Infinity", "NaN", "-1", "1e30"]) {
      expect(Number.isFinite(validateField(bad, spec).value)).toBe(true);
    }
  });
});

describe("validateField — integers", () => {
  it("rejects a fractional day count", () => {
    expect(validateField("90.5", { label: "Days", ...DAYS_IN_YEAR }).error).toBe(
      "Days must be a whole number.",
    );
  });

  it("accepts a whole day count", () => {
    expect(validateField("90", { label: "Days", ...DAYS_IN_YEAR }).error).toBeNull();
  });

  it("rejects more days than exist in a financial year", () => {
    expect(validateField("400", { label: "Days", ...DAYS_IN_YEAR }).error).toContain(
      "cannot be more than 366",
    );
  });
});

describe("validateField — clamping", () => {
  const spec: FieldSpec = { label: "Rate", ...PERCENT, clamp: true };

  it("clamps below min without an error when clamping is explicitly safe", () => {
    expect(validateField("-5", spec)).toEqual({ value: 0, error: null });
  });

  it("clamps above max without an error", () => {
    expect(validateField("150", spec)).toEqual({ value: 100, error: null });
  });

  it("does not clamp by default", () => {
    expect(validateField("150", { label: "Rate", ...PERCENT }).error).toContain(
      "cannot be more than 100",
    );
  });
});

describe("validateField — shared bounds", () => {
  it("rejects a zero exchange rate, which would divide by zero", () => {
    expect(validateField("0", { label: "USD/INR", ...FX_USD_INR }).error).toContain(
      "cannot be less than 1",
    );
  });

  it("rejects an impossible age", () => {
    expect(validateField("150", { label: "Age", ...AGE }).error).toContain(
      "cannot be more than 120",
    );
  });

  it("allows a legitimately large USD amount", () => {
    expect(validateField("25000000", { label: "Balance", ...USD_AMOUNT }).error)
      .toBeNull();
  });
});

describe("validateAll", () => {
  const specs = {
    price: { label: "Sale price", ...USD_AMOUNT },
    rate: { label: "USD/INR", ...FX_USD_INR },
  };

  it("reports ok with every field valid", () => {
    const r = validateAll({ price: "100000", rate: "86" }, specs);
    expect(r.ok).toBe(true);
    expect(r.errors).toEqual({});
    expect(r.values).toEqual({ price: 100000, rate: 86 });
  });

  it("collects field-level errors and blocks calculation", () => {
    const r = validateAll({ price: "-1", rate: "0" }, specs);
    expect(r.ok).toBe(false);
    expect(r.errors.price).toContain("cannot be less than");
    expect(r.errors.rate).toContain("cannot be less than");
  });

  it("fails the whole set when only one field is bad", () => {
    const r = validateAll({ price: "100000", rate: "abc" }, specs);
    expect(r.ok).toBe(false);
    expect(r.errors.price).toBeUndefined();
    expect(r.errors.rate).toBe("USD/INR must be a number.");
  });
});
