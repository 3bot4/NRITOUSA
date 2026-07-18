"use client";

import { useMemo, useState } from "react";
import { calcGoldDuty, type GoldForm, type TravelerCategory } from "@/lib/goldDuty";
import { goldDutyConfig as cfg } from "@/data/goldCustomsData";

const selectCls =
  "w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-ink-800">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function GoldDutyCalculator() {
  const [category, setCategory] = useState<TravelerCategory>("woman");
  const [months, setMonths] = useState("12");
  const [form, setForm] = useState<GoldForm>("jewellery");
  const [grams, setGrams] = useState("");
  const [valueUsd, setValueUsd] = useState("");

  const parsedGrams = parseFloat(grams);
  const parsedValue = parseFloat(valueUsd);
  const ready = parsedGrams > 0 && parsedValue > 0;

  const result = useMemo(() => {
    if (!ready) return null;
    return calcGoldDuty({
      category,
      monthsAbroad: parseInt(months, 10),
      form,
      grams: parsedGrams,
      valueUsd: parsedValue,
    });
  }, [ready, category, months, form, parsedGrams, parsedValue]);

  return (
    <div
      id="gold-duty-calculator"
      className="scroll-mt-24 rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50/50 to-white p-5 shadow-sm sm:p-8"
    >
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Gold Duty Calculator</p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">
          Estimate your customs duty: USA to India
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          Enter what you plan to carry — the estimate updates instantly. Nothing you type leaves your browser.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Who is carrying the gold?">
          <select className={selectCls} value={category} onChange={(e) => setCategory(e.target.value as TravelerCategory)}>
            <option value="woman">Woman (adult)</option>
            <option value="man">Man (adult)</option>
            <option value="girl-child">Child (girl)</option>
            <option value="boy-child">Child (boy)</option>
          </select>
        </Field>
        <Field label="How long has this traveler stayed abroad?">
          <select className={selectCls} value={months} onChange={(e) => setMonths(e.target.value)}>
            <option value="3">Under 6 months</option>
            <option value="8">6–12 months</option>
            <option value="12">1–2 years</option>
            <option value="36">More than 2 years</option>
          </select>
        </Field>
        <Field label="Type of gold">
          <select className={selectCls} value={form} onChange={(e) => setForm(e.target.value as GoldForm)}>
            <option value="jewellery">Jewellery / ornaments</option>
            <option value="coins">Gold coins</option>
            <option value="bars">Gold bars / biscuits</option>
          </select>
        </Field>
        <Field label="Total weight (grams)">
          <input
            type="number"
            inputMode="decimal"
            min="0"
            placeholder="e.g., 60"
            className={selectCls}
            value={grams}
            onChange={(e) => setGrams(e.target.value)}
          />
        </Field>
        <Field label="Approximate value (USD)">
          <input
            type="number"
            inputMode="decimal"
            min="0"
            placeholder="e.g., 6000"
            className={selectCls}
            value={valueUsd}
            onChange={(e) => setValueUsd(e.target.value)}
          />
        </Field>
      </div>

      {/* Result panel — height reserved so the layout never shifts. */}
      <div className="mt-5 min-h-[260px]">
        {result ? (
          <div className="rounded-2xl border border-ink-900/10 bg-white p-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-emerald-50 p-3">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-emerald-700">Duty-free portion</p>
                <p className="mt-1 text-lg font-extrabold text-ink-900">{result.freeGrams} g</p>
                <p className="text-xs text-ink-500">≈ {usd(result.freeValueUsd)}</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-3">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-amber-700">Dutiable portion</p>
                <p className="mt-1 text-lg font-extrabold text-ink-900">{result.dutiableGrams} g</p>
                <p className="text-xs text-ink-500">
                  ≈ {usd(result.dutiableValueUsd)} at {result.ratePct}%
                </p>
              </div>
              <div className="rounded-xl bg-ink-50 p-3">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-ink-600">Estimated duty</p>
                <p className="mt-1 text-lg font-extrabold text-ink-900">{inr(result.dutyInr)}</p>
                <p className="text-xs text-ink-500">≈ {usd(result.dutyUsd)}</p>
              </div>
            </div>

            {result.warnings.length > 0 && (
              <ul className="mt-4 space-y-1.5">
                {result.warnings.map((w) => (
                  <li key={w} className="flex gap-2 text-xs leading-relaxed text-amber-800">
                    <span aria-hidden>⚠️</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-4 text-xs leading-relaxed text-ink-400">
              Estimates based on CBIC rules as of {cfg.lastVerifiedHuman} (concessional rate {cfg.concessionalRatePct}%,
              standard rate {cfg.standardRatePct}%, ₹ figure at an approximate ₹{cfg.approxInrPerUsd}/USD). Actual
              assessment is at the customs officer&apos;s discretion using CBIC tariff values — verify current rates at
              cbic.gov.in before travel.
            </p>
          </div>
        ) : (
          <div className="flex h-full min-h-[260px] items-center justify-center rounded-2xl border border-dashed border-ink-900/10 bg-white/60 p-5">
            <p className="max-w-sm text-center text-sm text-ink-400">
              Enter the weight and approximate value above to see the duty-free portion, dutiable portion, and estimated
              duty in ₹ and USD.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
