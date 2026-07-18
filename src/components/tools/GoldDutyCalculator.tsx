"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { calcGoldDuty, type GoldForm, type TravelerCategory } from "@/lib/goldDuty";
import { goldDutyConfig as cfg } from "@/data/goldCustomsData";
import { trackEvent } from "@/lib/analytics";

const TOOL_SLUG = "gold-limit-usa-to-india";

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
  const [indianOrigin, setIndianOrigin] = useState<"yes" | "no">("yes");
  const [form, setForm] = useState<GoldForm>("jewellery");
  const [grams, setGrams] = useState("");
  const [valueUsd, setValueUsd] = useState("");
  const started = useRef(false);
  const completed = useRef(false);

  // PRIVACY: analytics events carry only the tool slug and coarse flags —
  // never the weights, values, or traveler details entered by the user.
  const markStarted = () => {
    if (started.current) return;
    started.current = true;
    trackEvent("gold_calculator_started", { tool_slug: TOOL_SLUG });
  };

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

  useEffect(() => {
    if (result && !completed.current) {
      completed.current = true;
      trackEvent("gold_calculator_completed", {
        tool_slug: TOOL_SLUG,
        result_status: result.eligibleConcession ? "concessional" : "standard",
      });
    }
  }, [result]);

  const notIndianOrigin = indianOrigin === "no";

  return (
    <div
      id="gold-duty-calculator"
      onChange={markStarted}
      className="scroll-mt-24 rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50/50 to-white p-5 shadow-sm sm:p-8"
    >
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-amber-700">India Gold Customs Duty Calculator</p>
        <h3 className="mt-1 text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">
          Estimate your customs duty: USA to India
        </h3>
        <p className="mt-1 text-sm text-ink-500">
          Answer the eligibility questions, enter what you plan to carry — the estimate updates instantly. Nothing you
          type leaves your browser.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Is this traveler of Indian origin (or an Indian passport holder)?">
          <select className={selectCls} value={indianOrigin} onChange={(e) => setIndianOrigin(e.target.value as "yes" | "no")}>
            <option value="yes">Yes</option>
            <option value="no">No / not sure</option>
          </select>
        </Field>
        <Field label="How long has this traveler stayed abroad?">
          <select className={selectCls} value={months} onChange={(e) => setMonths(e.target.value)}>
            <option value="3">Under 6 months</option>
            <option value="8">6–12 months (concessional duty route only)</option>
            <option value="12">1–2 years (jewellery allowance + concessional route)</option>
            <option value="36">More than 2 years</option>
          </select>
        </Field>
        <Field label="Passenger category (Rule 6 wording)">
          <select className={selectCls} value={category} onChange={(e) => setCategory(e.target.value as TravelerCategory)}>
            <option value="woman">Female passenger — up to 40 g jewellery if eligible</option>
            <option value="man">Passenger other than female — up to 20 g if eligible</option>
            <option value="girl-child">Child (girl) — verify with CBIC</option>
            <option value="boy-child">Child (boy) — verify with CBIC</option>
          </select>
        </Field>
        <Field label="Type of gold">
          <select className={selectCls} value={form} onChange={(e) => setForm(e.target.value as GoldForm)}>
            <option value="jewellery">Jewellery / ornaments (allowance may apply)</option>
            <option value="coins">Gold coins (no jewellery allowance)</option>
            <option value="bars">Gold bars / biscuits / bullion (no jewellery allowance)</option>
          </select>
        </Field>
        <Field label="Total weight (grams)">
          <input
            type="number"
            inputMode="decimal"
            min="0"
            max="100000"
            placeholder="e.g., 60"
            className={selectCls}
            value={grams}
            onChange={(e) => setGrams(e.target.value)}
          />
        </Field>
        <Field label="Your estimate of the value (USD)">
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

      {notIndianOrigin && (
        <p className="mt-3 rounded-xl bg-amber-50 px-4 py-2.5 text-xs leading-relaxed text-amber-900">
          The Rule 6 jewellery allowance and the concessional passenger-gold route are for residents or tourists of
          Indian origin (or valid Indian passport holders). If that does not describe this traveler, treat every figure
          below as not applicable and confirm the position with Customs before flying.
        </p>
      )}

      {/* Result panel — height reserved so the layout never shifts. */}
      <div className="mt-5 min-h-[300px]">
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

            {/* The calculation, not just the number */}
            <div className="mt-4 rounded-xl border border-ink-900/5 bg-ink-50/50 p-3.5">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-ink-500">How this was calculated</p>
              <ul className="mt-1.5 space-y-1 text-xs leading-relaxed text-ink-600">
                <li>
                  Dutiable value: {usd(result.dutiableValueUsd)} ({result.dutiableGrams} g of {parsedGrams} g after the{" "}
                  {result.freeGrams} g allowance, at your per-gram estimate)
                </li>
                {result.rateComponents.map((c) => (
                  <li key={c.label}>
                    {c.label}: {c.pct}% → {usd(round2((result.dutiableValueUsd * c.pct) / 100))}
                  </li>
                ))}
                <li>
                  Total ≈ {usd(result.dutyUsd)} ≈ {inr(result.dutyInr)} (at an assumed ₹{cfg.approxInrPerUsd}/USD, display only)
                </li>
              </ul>
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

            {result.dutiableGrams > 0 && (
              <p className="mt-3 text-xs">
                <a
                  href="#declaration"
                  onClick={() => trackEvent("red_channel_guidance_clicked", { tool_slug: TOOL_SLUG })}
                  className="font-semibold text-brand-600 underline underline-offset-2"
                >
                  What to do at the Red Channel →
                </a>
              </p>
            )}

            <p className="mt-4 text-xs leading-relaxed text-ink-400">
              This is an estimate, not an assessment. Customs values gold at CBIC-notified tariff values and notified
              exchange rates — this calculator uses your own value estimate instead of a live tariff value, and the
              customs officer&apos;s assessment controls. Figures last verified {cfg.lastVerifiedHuman}; verify current
              rates at cbic.gov.in before travel. Family allowances are per passenger and cannot be pooled.
            </p>
          </div>
        ) : (
          <div className="flex h-full min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-ink-900/10 bg-white/60 p-5">
            <p className="max-w-sm text-center text-sm text-ink-400">
              Enter the weight and your value estimate above to see the duty-free portion, dutiable portion, the duty
              formula, and the estimated duty in ₹ and USD.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const round2 = (n: number) => Math.round(n * 100) / 100;
