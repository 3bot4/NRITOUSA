/**
 * Shared validation layer for every /calculators page.
 *
 * Why this exists: the calculators previously parsed inputs with a helper that
 * returned 0 for anything unparseable, so a purchase price of -1, an empty
 * field, "abc" and Infinity all silently became a number and produced a
 * confident-looking result. Validation now happens in calculation code (HTML
 * min/max attributes alone are trivially bypassed via the URL-state query
 * string, which every calculator here supports).
 *
 * Design rules:
 *  - Never coerce an invalid value into a plausible one. Return an error.
 *  - Never return NaN or Infinity to a caller.
 *  - Clamp only where silent clamping cannot mislead (see `clamp` on FieldSpec).
 */

export interface FieldSpec {
  /** Human label, used verbatim in error messages. */
  label: string;
  min?: number;
  max?: number;
  /** Reject non-integer values (day counts, ages in whole years, terms). */
  integer?: boolean;
  /** Treat empty string as an error rather than as the default. */
  required?: boolean;
  /**
   * Silently clamp to [min, max] instead of erroring. Only safe when the
   * clamped value cannot mislead the user about their own inputs — e.g. a
   * display-only percentage. Defaults to false (error).
   */
  clamp?: boolean;
  /** Value used when the field is blank and not required. */
  fallback?: number;
}

export interface FieldResult {
  /** Always finite. Equals `fallback ?? 0` when `error` is set. */
  value: number;
  /** Null when valid; otherwise a user-facing message. */
  error: string | null;
}

/** Formats a bound for an error message without locale noise. */
const bound = (n: number): string =>
  Number.isInteger(n) ? n.toLocaleString("en-US") : String(n);

/**
 * Parse and validate a single raw input string against a spec.
 *
 * Distinguishes empty / malformed / non-finite from a legitimate zero, which
 * the old `num()` helper could not do.
 */
export function validateField(raw: string, spec: FieldSpec): FieldResult {
  const fallback = spec.fallback ?? 0;
  const fail = (error: string): FieldResult => ({ value: fallback, error });

  const trimmed = String(raw ?? "").replace(/[, ]/g, "").trim();

  if (trimmed === "") {
    return spec.required
      ? fail(`${spec.label} is required.`)
      : { value: fallback, error: null };
  }

  // Number() rather than parseFloat(): parseFloat("12abc") returns 12, which
  // would let malformed text through as a plausible figure.
  const n = Number(trimmed);

  if (Number.isNaN(n)) return fail(`${spec.label} must be a number.`);
  if (!Number.isFinite(n)) return fail(`${spec.label} must be a finite number.`);
  if (spec.integer && !Number.isInteger(n))
    return fail(`${spec.label} must be a whole number.`);

  if (spec.min !== undefined && n < spec.min) {
    if (spec.clamp) return { value: spec.min, error: null };
    return fail(`${spec.label} cannot be less than ${bound(spec.min)}.`);
  }

  if (spec.max !== undefined && n > spec.max) {
    if (spec.clamp) return { value: spec.max, error: null };
    return fail(`${spec.label} cannot be more than ${bound(spec.max)}.`);
  }

  return { value: n, error: null };
}

export type FieldErrors<K extends string> = Partial<Record<K, string>>;

export interface ValidatedInputs<K extends string> {
  values: Record<K, number>;
  errors: FieldErrors<K>;
  /** True when every field passed. Calculators must not compute when false. */
  ok: boolean;
}

/**
 * Validate a whole input set. Callers gate their entire calculation on `ok` so
 * that a single bad field cannot yield a partial, misleading result.
 */
export function validateAll<K extends string>(
  raw: Record<K, string>,
  specs: Record<K, FieldSpec>,
): ValidatedInputs<K> {
  const values = {} as Record<K, number>;
  const errors: FieldErrors<K> = {};

  for (const key of Object.keys(specs) as K[]) {
    const { value, error } = validateField(raw[key], specs[key]);
    values[key] = value;
    if (error) errors[key] = error;
  }

  return { values, errors, ok: Object.keys(errors).length === 0 };
}

/* ------------------------------------------------------------------ *
 * Reusable bounds
 *
 * Maximums are deliberately generous: they exist to catch typos and junk,
 * not to block legitimate high-value cross-border cases.
 * ------------------------------------------------------------------ */

/** USD amounts. Ceiling accommodates large one-off transactions. */
export const USD_AMOUNT = { min: 0, max: 1_000_000_000 } as const;

/** INR amounts. Ceiling ~₹1,000 crore. */
export const INR_AMOUNT = { min: 0, max: 100_000_000_000 } as const;

/** A percentage that is genuinely bounded at 100 (tax rates, shares). */
export const PERCENT = { min: 0, max: 100 } as const;

/** Growth/appreciation rates, which may legitimately be negative. */
export const GROWTH_RATE = { min: -100, max: 100 } as const;

/** Human age in whole years. */
export const AGE = { min: 0, max: 120, integer: true } as const;

/** Days within a single financial year. */
export const DAYS_IN_YEAR = { min: 0, max: 366, integer: true } as const;

/** USD/INR. Never zero — it is a divisor in several calculators. */
export const FX_USD_INR = { min: 1, max: 1_000 } as const;

/** Projection horizon in whole years. */
export const TERM_YEARS = { min: 0, max: 100, integer: true } as const;
