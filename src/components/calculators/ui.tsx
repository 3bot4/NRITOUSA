"use client";

import React from "react";

/* ----------------------------- formatters ----------------------------- */

export const usd = (n: number, digits = 0) =>
  isFinite(n)
    ? n.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: digits,
      })
    : "—";

export const inr = (n: number, digits = 0) =>
  isFinite(n)
    ? n.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: digits,
      })
    : "—";

export const pct = (n: number, digits = 1) =>
  isFinite(n) ? `${n.toFixed(digits)}%` : "—";

/**
 * Parse a possibly-formatted numeric string into a FINITE number (0 on blank
 * or unusable input).
 *
 * Note the isFinite guard: parseFloat("Infinity") returns Infinity, which is
 * not NaN, so the previous isNaN-only check let it through and it propagated
 * into results as "Infinity" or NaN.
 *
 * Prefer `validateField` from @/lib/calc/validation for new code — it reports
 * WHY an input was rejected instead of silently substituting zero.
 */
export const num = (s: string) => {
  const n = parseFloat(String(s).replace(/[, ]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

/* ------------------------------ inputs -------------------------------- */

export function NumberField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  placeholder,
  hint,
  step,
  min,
  max,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  hint?: string;
  step?: string | number;
  min?: number;
  max?: number;
  /** Field-level message from the shared validator. Blocks the result. */
  error?: string | null;
}) {
  const id = React.useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const invalid = Boolean(error);

  // HTML min/max are a usability aid only — the same values are enforced in
  // calculation code, because URL-state lets any value reach the calculator.
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className="block">
      <label
        htmlFor={id}
        className="text-sm font-semibold text-ink-800"
      >
        {label}
      </label>
      <div
        className={`mt-1.5 flex items-stretch overflow-hidden rounded-xl border bg-white ${
          invalid
            ? "border-rose-500 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20"
            : "border-ink-900/10 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20"
        }`}
      >
        {prefix && (
          <span className="flex items-center bg-slate-50 px-3 text-sm font-medium text-ink-500">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          step={step}
          min={min}
          max={max}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className="w-full bg-transparent px-3 py-2.5 text-ink-900 outline-none placeholder:text-ink-400"
        />
        {suffix && (
          <span className="flex items-center bg-slate-50 px-3 text-sm font-medium text-ink-500">
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <span
          id={errorId}
          role="alert"
          className="mt-1 block text-xs font-semibold text-rose-600"
        >
          {error}
        </span>
      )}
      {hint && (
        <span id={hintId} className="mt-1 block text-xs text-ink-400">
          {hint}
        </span>
      )}
    </div>
  );
}

/**
 * Shown in place of results when any input is invalid, so the calculator never
 * displays a number derived from bad data.
 */
export function InvalidInputPanel({ errors }: { errors: string[] }) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-rose-200 bg-rose-50/70 p-6 shadow-card"
    >
      <p className="text-sm font-bold text-rose-900">
        Check your inputs to see a result
      </p>
      <ul className="mt-2 space-y-1">
        {errors.map((e, i) => (
          <li key={i} className="text-sm leading-relaxed text-rose-800">
            • {e}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Prominent tax-year marker placed next to calculator inputs. */
export function TaxYearBadge({ year, note }: { year: number; note?: string }) {
  return (
    <div className="mb-1 flex flex-wrap items-center gap-2 rounded-xl bg-brand-50 px-3 py-2">
      <span className="rounded-lg bg-brand-600 px-2 py-0.5 text-xs font-bold text-white">
        Tax year {year}
      </span>
      {note && <span className="text-xs text-ink-600">{note}</span>}
    </div>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink-800">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && <span className="mt-1 block text-xs text-ink-400">{hint}</span>}
    </label>
  );
}

export function DateField({
  label,
  value,
  onChange,
  hint,
  error,
  max,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  error?: string | null;
  max?: string;
}) {
  const id = React.useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const invalid = Boolean(error);

  return (
    <div className="block">
      <label htmlFor={id} className="text-sm font-semibold text-ink-800">
        {label}
      </label>
      <input
        id={id}
        type="date"
        value={value}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid || undefined}
        aria-describedby={
          [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") ||
          undefined
        }
        className={`mt-1.5 w-full rounded-xl border bg-white px-3 py-2.5 text-ink-900 outline-none ${
          invalid
            ? "border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
            : "border-ink-900/10 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        }`}
      />
      {error && (
        <span id={errorId} role="alert" className="mt-1 block text-xs font-semibold text-rose-600">
          {error}
        </span>
      )}
      {hint && (
        <span id={hintId} className="mt-1 block text-xs text-ink-400">
          {hint}
        </span>
      )}
    </div>
  );
}

export function ToggleField({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) {
  const id = React.useId();
  const hintId = `${id}-hint`;
  return (
    <div>
      {/* The whole row is the label, so the tap target is the full width and at
          least 44px tall rather than just the 20px checkbox itself. */}
      <label
        htmlFor={id}
        className="flex min-h-[44px] cursor-pointer items-center gap-3 py-1"
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-describedby={hint ? hintId : undefined}
          className="h-6 w-6 flex-none rounded border-ink-900/20 text-brand-600 focus:ring-2 focus:ring-brand-500/30"
        />
        <span className="text-sm font-semibold text-ink-800">{label}</span>
      </label>
      {hint && (
        <span id={hintId} className="mt-0.5 block pl-9 text-xs text-ink-400">
          {hint}
        </span>
      )}
    </div>
  );
}

/* ------------------------------ layout -------------------------------- */

/** Two-column calculator layout: inputs (left) and results (right). */
export function CalcGrid({
  inputs,
  results,
}: {
  inputs: React.ReactNode;
  results: React.ReactNode;
}) {
  return (
    // min-w-0 on both columns: grid items default to min-width:auto, so any
    // wide descendant (a chart with a min-width, a long unbroken number) would
    // stretch the track and scroll the whole page sideways on phones rather
    // than scrolling inside its own container.
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="min-w-0 rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card sm:p-7">
        <p className="mb-5 text-xs font-bold uppercase tracking-wider text-ink-400">
          Your details
        </p>
        <div className="space-y-4">{inputs}</div>
      </div>
      <div className="min-w-0 space-y-4">{results}</div>
    </div>
  );
}

export function ResultPanel({
  title,
  accent = "from-brand-600 to-brand-500",
  children,
}: {
  title: string;
  accent?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink-900/5 bg-white shadow-card">
      <div
        className={`bg-gradient-to-r ${accent} px-6 py-3 text-sm font-bold uppercase tracking-wider text-white`}
      >
        {title}
      </div>
      <div className="space-y-4 p-6">{children}</div>
    </div>
  );
}

export function Stat({
  label,
  value,
  sub,
  big,
  tone = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  big?: boolean;
  tone?: "default" | "good" | "bad" | "warn";
}) {
  const toneClass =
    tone === "good"
      ? "text-emerald-600"
      : tone === "bad"
        ? "text-rose-600"
        : tone === "warn"
          ? "text-amber-600"
          : "text-ink-900";
  return (
    <div>
      <p className="text-sm text-ink-500">{label}</p>
      <p
        className={`font-extrabold tracking-tight ${toneClass} ${
          big ? "text-3xl sm:text-4xl" : "text-xl"
        }`}
      >
        {value}
      </p>
      {sub && <p className="mt-0.5 text-xs text-ink-400">{sub}</p>}
    </div>
  );
}

export function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-ink-900/5 py-2 text-sm last:border-0">
      <span className="text-ink-500">{label}</span>
      <span className="font-semibold text-ink-900">{value}</span>
    </div>
  );
}

export function Callout({
  tone = "note",
  children,
}: {
  tone?: "note" | "good" | "bad";
  children: React.ReactNode;
}) {
  const map = {
    note: "border-amber-400 bg-amber-50/70",
    good: "border-emerald-400 bg-emerald-50/70",
    bad: "border-rose-400 bg-rose-50/70",
  } as const;
  return (
    <div
      className={`rounded-xl border-l-4 ${map[tone]} px-5 py-3 text-sm leading-relaxed text-ink-700`}
    >
      {children}
    </div>
  );
}

export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 text-sm text-ink-700">
          <span
            aria-hidden
            className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700"
          >
            ✓
          </span>
          <span className="leading-relaxed">{it}</span>
        </li>
      ))}
    </ul>
  );
}
