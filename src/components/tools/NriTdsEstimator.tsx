"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { estimateNriPropertyTds, type SellerType, type TdsEstimatorInput } from "@/lib/nriPropertyTds";
import { nriTdsConfig as cfg } from "@/data/nriPropertySaleTdsData";
import { trackEvent } from "@/lib/analytics";

const TOOL_SLUG = "nri-selling-property-in-india-tds";

const inputCls =
  "w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20";

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-ink-800">{label}</span>
      <div className="mt-1">{children}</div>
      {hint && <span className="mt-0.5 block text-[0.6875rem] text-ink-400">{hint}</span>}
    </label>
  );
}

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const inrRange = (r: { low: number; high: number }) =>
  r.low === r.high ? inr(r.low) : `${inr(r.low)} – ${inr(r.high)}`;

export default function NriTdsEstimator() {
  const [f, setF] = useState({
    saleConsideration: "",
    numSellers: "1",
    ownershipPct: "100",
    sellerType: "individual" as SellerType,
    nonResidentConfirmed: "yes" as "yes" | "no",
    purchaseDate: "",
    saleDate: "",
    purchaseCost: "",
    improvementCost: "",
    transferExpenses: "",
    exemption54: "",
    exemption54EC: "",
    hasCertificate: "no" as "yes" | "no",
    certificateRatePct: "",
    incomeKnown: "unknown" as "unknown" | "known",
    otherIncomeInr: "",
    panAvailable: "yes" as "yes" | "no",
  });
  const started = useRef(false);
  const completed = useRef(false);
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((p) => ({ ...p, [k]: v }));

  // PRIVACY: only the tool slug and coarse status flags go to analytics —
  // never sale values, dates, or any other entered figure.
  const markStarted = () => {
    if (started.current) return;
    started.current = true;
    trackEvent("property_tds_calculator_started", { tool_slug: TOOL_SLUG });
  };

  const num = (s: string) => (s.trim() === "" ? 0 : parseFloat(s));
  const ready = num(f.saleConsideration) > 0 && f.purchaseDate !== "" && f.saleDate !== "";

  const result = useMemo(() => {
    if (!ready) return null;
    const input: TdsEstimatorInput = {
      saleConsideration: num(f.saleConsideration),
      ownershipPct: num(f.ownershipPct),
      sellerType: f.sellerType,
      purchaseDate: f.purchaseDate,
      saleDate: f.saleDate,
      purchaseCost: num(f.purchaseCost),
      improvementCost: num(f.improvementCost),
      transferExpenses: num(f.transferExpenses),
      exemption54: num(f.exemption54),
      exemption54EC: num(f.exemption54EC),
      hasCertificate: f.hasCertificate === "yes",
      certificateRatePct: num(f.certificateRatePct),
      otherIncomeKnown: f.incomeKnown === "known",
      otherIncomeInr: num(f.otherIncomeInr),
      panAvailable: f.panAvailable === "yes",
    };
    return estimateNriPropertyTds(input);
  }, [ready, f]);

  useEffect(() => {
    if (result?.valid && !completed.current) {
      completed.current = true;
      trackEvent("property_tds_calculator_completed", {
        tool_slug: TOOL_SLUG,
        result_status: result.isLongTerm ? "long_term" : "short_term",
      });
    }
  }, [result]);

  return (
    <div
      id="tds-estimator"
      onChange={markStarted}
      className="scroll-mt-24 rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white p-5 shadow-sm sm:p-8"
    >
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Educational Estimator</p>
        <h3 className="mt-1 text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">
          NRI property sale: TDS &amp; capital gains estimator
        </h3>
        <p className="mt-1 text-sm text-ink-500">
          Separates the three numbers people conflate — your estimated gain, your estimated final tax, and the likely
          withholding. Per seller. Nothing you type leaves your browser, and this files nothing.
        </p>
      </div>

      {f.nonResidentConfirmed === "no" && (
        <p className="mb-3 rounded-xl bg-amber-50 px-4 py-2.5 text-xs leading-relaxed text-amber-900">
          This estimator models a <strong>nonresident</strong> seller. If the seller is an Indian tax resident for the
          year, the resident TDS process applies instead and these figures do not apply.
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Is the seller a nonresident for this year?">
          <select className={inputCls} value={f.nonResidentConfirmed} onChange={(e) => set("nonResidentConfirmed", e.target.value as "yes" | "no")}>
            <option value="yes">Yes — NRI / nonresident</option>
            <option value="no">No / not sure</option>
          </select>
        </Field>
        <Field label="Seller type">
          <select className={inputCls} value={f.sellerType} onChange={(e) => set("sellerType", e.target.value as SellerType)}>
            <option value="individual">Individual</option>
            <option value="company">Foreign company</option>
            <option value="other">Trust / firm / other entity</option>
          </select>
        </Field>
        <Field label="Total sale consideration (₹)">
          <input type="number" inputMode="numeric" min="0" placeholder="e.g., 20000000" className={inputCls} value={f.saleConsideration} onChange={(e) => set("saleConsideration", e.target.value)} />
        </Field>
        <Field label="Number of sellers" hint="Run the estimator once per seller.">
          <select className={inputCls} value={f.numSellers} onChange={(e) => { set("numSellers", e.target.value); if (e.target.value === "1") set("ownershipPct", "100"); }}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3+</option>
          </select>
        </Field>
        <Field label="This seller's ownership (%)">
          <input type="number" inputMode="numeric" min="1" max="100" className={inputCls} value={f.ownershipPct} onChange={(e) => set("ownershipPct", e.target.value)} />
        </Field>
        <Field label="PAN available?">
          <select className={inputCls} value={f.panAvailable} onChange={(e) => set("panAvailable", e.target.value as "yes" | "no")}>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </Field>
        <Field label="Purchase date">
          <input type="date" className={inputCls} value={f.purchaseDate} onChange={(e) => set("purchaseDate", e.target.value)} />
        </Field>
        <Field label="Proposed sale date">
          <input type="date" className={inputCls} value={f.saleDate} onChange={(e) => set("saleDate", e.target.value)} />
        </Field>
        <Field label="Purchase cost (₹, whole property)">
          <input type="number" inputMode="numeric" min="0" placeholder="e.g., 12000000" className={inputCls} value={f.purchaseCost} onChange={(e) => set("purchaseCost", e.target.value)} />
        </Field>
        <Field label="Improvement cost (₹)" hint="Documented capital improvements.">
          <input type="number" inputMode="numeric" min="0" placeholder="0" className={inputCls} value={f.improvementCost} onChange={(e) => set("improvementCost", e.target.value)} />
        </Field>
        <Field label="Transfer expenses (₹)" hint="Brokerage, legal fees on sale.">
          <input type="number" inputMode="numeric" min="0" placeholder="0" className={inputCls} value={f.transferExpenses} onChange={(e) => set("transferExpenses", e.target.value)} />
        </Field>
        <Field label="Lower/nil TDS certificate?">
          <select className={inputCls} value={f.hasCertificate} onChange={(e) => set("hasCertificate", e.target.value as "yes" | "no")}>
            <option value="no">No / not yet</option>
            <option value="yes">Yes — certificate issued</option>
          </select>
        </Field>
        {f.hasCertificate === "yes" && (
          <Field label="Certificate rate (%)">
            <input type="number" inputMode="decimal" min="0" max="40" placeholder="e.g., 5" className={inputCls} value={f.certificateRatePct} onChange={(e) => set("certificateRatePct", e.target.value)} />
          </Field>
        )}
        <Field label="Other Indian taxable income this year">
          <select className={inputCls} value={f.incomeKnown} onChange={(e) => set("incomeKnown", e.target.value as "unknown" | "known")}>
            <option value="unknown">Unknown — show a range</option>
            <option value="known">I can estimate it</option>
          </select>
        </Field>
        {f.incomeKnown === "known" && (
          <Field label="Estimated other income (₹)">
            <input type="number" inputMode="numeric" min="0" placeholder="e.g., 500000" className={inputCls} value={f.otherIncomeInr} onChange={(e) => set("otherIncomeInr", e.target.value)} />
          </Field>
        )}
        <Field label="Section 54 reinvestment estimate (₹)" hint="Residential-house reinvestment, if planned.">
          <input type="number" inputMode="numeric" min="0" placeholder="0" className={inputCls} value={f.exemption54} onChange={(e) => set("exemption54", e.target.value)} />
        </Field>
        <Field label="Section 54EC bonds estimate (₹)" hint="Capital-gains bonds, statutory cap applies.">
          <input type="number" inputMode="numeric" min="0" placeholder="0" className={inputCls} value={f.exemption54EC} onChange={(e) => set("exemption54EC", e.target.value)} />
        </Field>
      </div>

      {/* Results — height reserved so the layout never shifts. */}
      <div className="mt-5 min-h-[320px]">
        {result && result.valid ? (
          <div className="rounded-2xl border border-ink-900/10 bg-white p-5">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl bg-ink-50 p-3">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-ink-600">This seller&apos;s share</p>
                <p className="mt-1 text-lg font-extrabold text-ink-900">{inr(result.shareConsideration)}</p>
                <p className="text-xs text-ink-500">Holding: {result.holdingMonths} months → {result.isLongTerm ? "long-term" : "short-term"}</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-emerald-700">Estimated capital gain</p>
                <p className="mt-1 text-lg font-extrabold text-ink-900">{inr(result.estimatedGain)}</p>
                <p className="text-xs text-ink-500">After costs and claimed exemption estimates</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-emerald-700">Estimated final Indian tax</p>
                <p className="mt-1 text-lg font-extrabold text-ink-900">{inrRange(result.finalTax)}</p>
                <p className="text-xs text-ink-500">{result.isLongTerm ? `${cfg.ltcgBasePct}% + surcharge + cess` : "Slab-taxed — planning band"}</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-3">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-amber-700">Illustrative withholding (no certificate)</p>
                <p className="mt-1 text-lg font-extrabold text-ink-900">{inr(result.withholdingNoCert)}</p>
                <p className="text-xs text-ink-500">Common practice: gross payment × rate</p>
              </div>
              {result.withholdingWithCert !== null && (
                <div className="rounded-xl bg-sky-50 p-3">
                  <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-sky-700">Withholding at certificate rate</p>
                  <p className="mt-1 text-lg font-extrabold text-ink-900">{inr(result.withholdingWithCert)}</p>
                  <p className="text-xs text-ink-500">Per the entered certificate rate</p>
                </div>
              )}
              <div className="rounded-xl bg-rose-50 p-3">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-rose-700">Potential excess withholding</p>
                <p className="mt-1 text-lg font-extrabold text-ink-900">{inrRange(result.potentialExcess)}</p>
                <p className="text-xs text-ink-500">Money parked until your Indian return/refund</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-ink-900/5 bg-ink-50/50 p-3.5">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-ink-500">Assumptions &amp; items needing professional review</p>
              <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs leading-relaxed text-ink-600">
                {result.assumptions.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : result && !result.valid ? (
          <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-5" role="alert">
            <p className="text-sm font-bold text-ink-900">Check these inputs:</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-rose-800">
              {result.errors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex h-full min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-ink-900/10 bg-white/60 p-5">
            <p className="max-w-sm text-center text-sm text-ink-400">
              Enter the sale consideration and both dates to see the gain, the estimated final tax, the illustrative
              withholding, and the potential excess — with every assumption listed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
