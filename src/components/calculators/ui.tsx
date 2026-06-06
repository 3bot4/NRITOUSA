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

/** Parse a possibly-formatted numeric string into a number (0 on blank). */
export const num = (s: string) => {
  const n = parseFloat(String(s).replace(/[, ]/g, ""));
  return isNaN(n) ? 0 : n;
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  hint?: string;
  step?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink-800">{label}</span>
      <div className="mt-1.5 flex items-stretch overflow-hidden rounded-xl border border-ink-900/10 bg-white focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20">
        {prefix && (
          <span className="flex items-center bg-slate-50 px-3 text-sm font-medium text-ink-500">
            {prefix}
          </span>
        )}
        <input
          type="number"
          inputMode="decimal"
          step={step}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent px-3 py-2.5 text-ink-900 outline-none placeholder:text-ink-400"
        />
        {suffix && (
          <span className="flex items-center bg-slate-50 px-3 text-sm font-medium text-ink-500">
            {suffix}
          </span>
        )}
      </div>
      {hint && <span className="mt-1 block text-xs text-ink-400">{hint}</span>}
    </label>
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
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card sm:p-7">
        <p className="mb-5 text-xs font-bold uppercase tracking-wider text-ink-400">
          Your details
        </p>
        <div className="space-y-4">{inputs}</div>
      </div>
      <div className="space-y-4">{results}</div>
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
