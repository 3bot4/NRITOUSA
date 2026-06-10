"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Callout,
  NumberField,
  num,
  usd,
} from "@/components/calculators/ui";
import ResultActions from "@/components/ResultActions";
import { trackToolUsed } from "@/lib/analytics";
import {
  decodeInputs,
  defaultInputs,
  encodeInputs,
  LAST_UPDATED,
  runComparison,
  winnerLabel,
  type ComparisonInputs,
} from "@/lib/iul-comparison";

/* ------------------------------------------------------------------ *
 * Form state: strings for friendly typing, parsed into ComparisonInputs
 * ------------------------------------------------------------------ */

type FormState = {
  c: string;
  y: string;
  r: string;
  dy: string;
  cap: string;
  par: string;
  load: string;
  coi: string;
  m: string;
  kf: string;
  kt: string;
  tf: string;
  td: string;
  tg: string;
  seq: boolean;
};

function toForm(i: ComparisonInputs): FormState {
  return {
    c: String(i.annualContribution),
    y: String(i.years),
    r: String(i.expectedTotalReturnPct),
    dy: String(i.dividendYieldPct),
    cap: String(i.iul.capRatePct),
    par: String(i.iul.participationRatePct),
    load: String(i.iul.premiumLoadPct),
    coi: String(i.iul.annualPolicyCostPct),
    m: String(i.k401.employerMatchPct),
    kf: String(i.k401.annualFeePct),
    kt: String(i.k401.retirementTaxRatePct),
    tf: String(i.taxable.fundFeePct),
    td: String(i.taxable.dividendTaxPct),
    tg: String(i.taxable.capGainsPct),
    seq: i.badSequence,
  };
}

function toInputs(f: FormState): ComparisonInputs {
  const d = defaultInputs();
  return {
    annualContribution: num(f.c) || d.annualContribution,
    years: Math.max(1, Math.min(60, Math.round(num(f.y) || d.years))),
    expectedTotalReturnPct: num(f.r),
    dividendYieldPct: num(f.dy),
    badSequence: f.seq,
    iul: {
      capRatePct: num(f.cap),
      participationRatePct: num(f.par),
      floorPct: d.iul.floorPct,
      premiumLoadPct: num(f.load),
      annualPolicyCostPct: num(f.coi),
    },
    k401: {
      employerMatchPct: num(f.m),
      annualFeePct: num(f.kf),
      retirementTaxRatePct: num(f.kt),
    },
    taxable: {
      fundFeePct: num(f.tf),
      dividendTaxPct: num(f.td),
      capGainsPct: num(f.tg),
    },
  };
}

/* ------------------------------------------------------------------ *
 * Chart
 * ------------------------------------------------------------------ */

const SERIES_STYLE = [
  { key: "k401Balance", label: "401(k) (pre-tax)", color: "#1e40f5", dash: "" },
  { key: "taxableBalance", label: "Taxable brokerage", color: "#10b981", dash: "" },
  { key: "iulCashValue", label: "IUL cash value", color: "#f59e0b", dash: "" },
  { key: "iulDeathBenefit", label: "IUL death benefit", color: "#f43f5e", dash: "6 5" },
] as const;

function compactUsd(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}k`;
  return `$${Math.round(n)}`;
}

function ProjectionChart({
  series,
}: {
  series: ReturnType<typeof runComparison>["series"];
}) {
  const W = 600;
  const H = 320;
  const PAD = { left: 56, right: 12, top: 14, bottom: 30 };

  const maxY =
    Math.max(
      1,
      ...series.map((p) =>
        Math.max(p.k401Balance, p.taxableBalance, p.iulCashValue, p.iulDeathBenefit)
      )
    ) * 1.05;
  const maxX = Math.max(1, series.length - 1);

  const x = (year: number) =>
    PAD.left + (year / maxX) * (W - PAD.left - PAD.right);
  const y = (v: number) =>
    H - PAD.bottom - (v / maxY) * (H - PAD.top - PAD.bottom);

  const path = (key: (typeof SERIES_STYLE)[number]["key"]) =>
    series
      .map((p, idx) => `${idx === 0 ? "M" : "L"}${x(p.year).toFixed(1)},${y(p[key]).toFixed(1)}`)
      .join(" ");

  const yTicks = [0.25, 0.5, 0.75, 1].map((f) => f * maxY);
  const xStep = maxX <= 12 ? 2 : maxX <= 30 ? 5 : 10;
  const xTicks: number[] = [];
  for (let t = xStep; t <= maxX; t += xStep) xTicks.push(t);

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="Projected balances over time for 401(k), taxable brokerage, and IUL"
      >
        {/* gridlines + y labels */}
        {yTicks.map((v) => (
          <g key={v}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(v)}
              y2={y(v)}
              stroke="rgba(11,17,32,0.07)"
            />
            <text
              x={PAD.left - 6}
              y={y(v) + 4}
              textAnchor="end"
              fontSize="11"
              fill="#6b7280"
            >
              {compactUsd(v)}
            </text>
          </g>
        ))}
        {/* x labels */}
        {xTicks.map((t) => (
          <text
            key={t}
            x={x(t)}
            y={H - 10}
            textAnchor="middle"
            fontSize="11"
            fill="#6b7280"
          >
            {t}y
          </text>
        ))}
        <line
          x1={PAD.left}
          x2={W - PAD.right}
          y1={H - PAD.bottom}
          y2={H - PAD.bottom}
          stroke="rgba(11,17,32,0.2)"
        />
        {SERIES_STYLE.map((s) => (
          <path
            key={s.key}
            d={path(s.key)}
            fill="none"
            stroke={s.color}
            strokeWidth="2.5"
            strokeDasharray={s.dash}
            strokeLinejoin="round"
          />
        ))}
      </svg>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
        {SERIES_STYLE.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5 text-xs text-ink-500">
            <span
              aria-hidden
              className="inline-block h-0.5 w-5 rounded"
              style={{
                backgroundColor: s.color,
                ...(s.dash ? { backgroundImage: `repeating-linear-gradient(90deg, ${s.color} 0 4px, transparent 4px 7px)`, backgroundColor: "transparent", height: "2px" } : {}),
              }}
            />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Main component
 * ------------------------------------------------------------------ */

const GROUP_LABEL = "text-xs font-bold uppercase tracking-wider text-ink-400";

export default function IulComparisonCalculator() {
  const [form, setForm] = useState<FormState>(() => toForm(defaultInputs()));

  // Hydrate from the URL once on mount, so shared links reopen the scenario.
  useEffect(() => {
    if (window.location.search) {
      setForm(toForm(decodeInputs(window.location.search)));
    }
  }, []);

  const inputs = useMemo(() => toInputs(form), [form]);
  const result = useMemo(() => runComparison(inputs), [inputs]);
  const winner = winnerLabel(result);

  // Keep the URL in sync (debounced) so Copy link / shares reopen this state.
  const firstUrlSync = useRef(true);
  useEffect(() => {
    if (firstUrlSync.current) {
      firstUrlSync.current = false;
      return;
    }
    const t = setTimeout(() => {
      const qs = encodeInputs(inputs);
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${qs}${window.location.hash}`
      );
    }, 400);
    return () => clearTimeout(t);
  }, [inputs]);

  // Broad analytics only: which leg leads — never amounts.
  const firstTrack = useRef(true);
  useEffect(() => {
    if (firstTrack.current) {
      firstTrack.current = false;
      return;
    }
    const t = setTimeout(() => {
      trackToolUsed({
        tool_name: "iul_vs_401k_comparison",
        result_type: winner,
        category: "investing",
        page_slug: "/articles/iul-vs-401k-honest-comparison",
      });
    }, 1500);
    return () => clearTimeout(t);
  }, [winner]);

  const set = (key: keyof FormState) => (v: string) =>
    setForm((f) => ({ ...f, [key]: v }));

  const legs = [
    { name: "401(k)", r: result.k401 },
    { name: "Taxable", r: result.taxable },
    { name: "IUL", r: result.iul },
  ];

  const winnerName =
    winner === "k401_leads" ? "the 401(k)" : winner === "taxable_leads" ? "the taxable brokerage" : "the IUL";

  return (
    <div id="calculator" className="scroll-mt-24">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start">
        {/* ---------------- Inputs ---------------- */}
        <div className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card sm:p-7">
          <p className={GROUP_LABEL}>Your plan</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <NumberField
              label="Annual contribution"
              prefix="$"
              value={form.c}
              onChange={set("c")}
              hint="Same amount into each option"
            />
            <NumberField
              label="Time horizon"
              suffix="years"
              value={form.y}
              onChange={set("y")}
            />
            <NumberField
              label="Expected market return"
              suffix="%/yr"
              step="0.5"
              value={form.r}
              onChange={set("r")}
              hint="Total return incl. dividends"
            />
            <NumberField
              label="Dividend yield"
              suffix="%/yr"
              step="0.1"
              value={form.dy}
              onChange={set("dy")}
              hint="IUL crediting excludes this part"
            />
          </div>

          <p className={`mt-6 ${GROUP_LABEL}`}>Market scenario</p>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {[
              { seq: false, label: "Steady average", sub: "Same return every year" },
              { seq: true, label: "Bad sequence", sub: "2000s replay: crashes early (2000–02, 2008)" },
            ].map((o) => (
              <button
                key={String(o.seq)}
                type="button"
                onClick={() => setForm((f) => ({ ...f, seq: o.seq }))}
                aria-pressed={form.seq === o.seq}
                className={`rounded-xl border px-3 py-2.5 text-left transition-colors ${
                  form.seq === o.seq
                    ? "border-brand-500 bg-brand-50"
                    : "border-ink-900/10 bg-white hover:border-ink-900/20"
                }`}
              >
                <span className={`block text-sm font-semibold ${form.seq === o.seq ? "text-brand-700" : "text-ink-700"}`}>
                  {o.label}
                </span>
                <span className="block text-xs text-ink-400">{o.sub}</span>
              </button>
            ))}
          </div>

          <p className={`mt-6 ${GROUP_LABEL}`}>IUL policy terms</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <NumberField
              label="Cap rate"
              suffix="%"
              step="0.5"
              value={form.cap}
              onChange={set("cap")}
              hint="Max credited in any year"
            />
            <NumberField
              label="Participation rate"
              suffix="%"
              value={form.par}
              onChange={set("par")}
              hint="Share of index gain credited"
            />
            <NumberField
              label="Annual policy cost"
              suffix="% of CV"
              step="0.1"
              value={form.coi}
              onChange={set("coi")}
              hint="COI + admin, simplified flat %"
            />
            <NumberField
              label="Premium load"
              suffix="%"
              step="0.5"
              value={form.load}
              onChange={set("load")}
              hint="Charge on each premium paid"
            />
          </div>

          <p className={`mt-6 ${GROUP_LABEL}`}>401(k) terms</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <NumberField
              label="Employer match"
              suffix="%"
              value={form.m}
              onChange={set("m")}
              hint="Added per $1 you put in"
            />
            <NumberField
              label="Plan fee"
              suffix="%/yr"
              step="0.1"
              value={form.kf}
              onChange={set("kf")}
            />
            <NumberField
              label="Tax at withdrawal"
              suffix="%"
              value={form.kt}
              onChange={set("kt")}
              hint="Your retirement bracket"
            />
          </div>

          <p className={`mt-6 ${GROUP_LABEL}`}>Taxable account terms</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <NumberField
              label="Fund fee"
              suffix="%/yr"
              step="0.05"
              value={form.tf}
              onChange={set("tf")}
            />
            <NumberField
              label="Dividend tax"
              suffix="%"
              value={form.td}
              onChange={set("td")}
            />
            <NumberField
              label="Capital gains tax"
              suffix="%"
              value={form.tg}
              onChange={set("tg")}
            />
          </div>

          <p className="mt-5 border-t border-ink-900/5 pt-3 text-xs leading-relaxed text-ink-400">
            Defaults are broad educational assumptions (sources and caveats in
            the article) — replace them with numbers from your own plan and a
            real in-force illustration. Nothing you enter is stored.
          </p>
        </div>

        {/* ---------------- Results ---------------- */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card">
            <p className={GROUP_LABEL}>
              Projection · {inputs.years} years · {form.seq ? "bad-sequence scenario" : "steady-average scenario"}
            </p>
            <div className="mt-3">
              <ProjectionChart series={result.series} />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-ink-900/5 bg-white shadow-card">
            <table className="w-full min-w-[460px] text-sm">
              <thead>
                <tr className="border-b border-ink-900/5 bg-[#fafafa] text-left text-xs font-bold uppercase tracking-wider text-ink-400">
                  <th className="px-4 py-3" />
                  <th className="px-4 py-3">401(k)</th>
                  <th className="px-4 py-3">Taxable</th>
                  <th className="px-4 py-3">IUL</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-ink-900/5">
                  <td className="px-4 py-3 font-semibold text-ink-700">
                    Ending balance
                    <span className="block text-[11px] font-normal text-ink-400">
                      IUL = cash value
                    </span>
                  </td>
                  {legs.map((l) => (
                    <td key={l.name} className="px-4 py-3 font-bold text-ink-900">
                      {usd(l.r.endingBalance)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-ink-900/5">
                  <td className="px-4 py-3 font-semibold text-ink-700">
                    Total fees paid
                  </td>
                  {legs.map((l) => (
                    <td key={l.name} className="px-4 py-3 text-rose-600">
                      {usd(l.r.totalFees)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-ink-900/5">
                  <td className="px-4 py-3 font-semibold text-ink-700">
                    After-tax value
                    <span className="block text-[11px] font-normal text-ink-400">
                      401(k) taxed at withdrawal; taxable after cap-gains; IUL
                      cash value assuming tax-free access holds*
                    </span>
                  </td>
                  {legs.map((l) => (
                    <td
                      key={l.name}
                      className={`px-4 py-3 font-bold ${
                        l.r.afterTaxValue === Math.max(...legs.map((x) => x.r.afterTaxValue))
                          ? "text-emerald-600"
                          : "text-ink-900"
                      }`}
                    >
                      {usd(l.r.afterTaxValue)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-ink-900/5">
                  <td className="px-4 py-3 font-semibold text-ink-700">
                    Your contributions
                  </td>
                  {legs.map((l) => (
                    <td key={l.name} className="px-4 py-3 text-ink-500">
                      {usd(l.r.totalContributed)}
                      {l.name === "401(k)" && result.k401.employerContributed > 0 && (
                        <span className="block text-[11px] text-emerald-600">
                          + {usd(result.k401.employerContributed)} employer
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-ink-700">
                    Death benefit today → year {inputs.years}
                    <span className="block text-[11px] font-normal text-ink-400">
                      Income-tax-free to beneficiaries
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-400" colSpan={2}>
                    Account balance passes to heirs (taxable account gets a
                    stepped-up basis under current law)
                  </td>
                  <td className="px-4 py-3 font-bold text-ink-900">
                    {usd(result.iul.deathBenefit)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <Callout tone="note">
            In this scenario, <strong>{winnerName}</strong> ends with the
            highest after-tax value — but that flips easily.{" "}
            <strong>Sensitivity warning:</strong> the IUL hit its{" "}
            {inputs.iul.capRatePct}% cap in {result.cappedYears} of{" "}
            {inputs.years} years and used its 0% floor in {result.flooredYears}.
            Small changes to the cap, participation rate, or policy costs —
            all of which the insurer can change within policy limits — swing
            IUL outcomes far more than the same change swings the other two.
          </Callout>

          {form.seq ? (
            <Callout tone="good">
              <strong>What the bad sequence shows:</strong> the IUL&apos;s 0%
              floor avoids the crash years (2000–02, 2008), which is its
              honest strength — while the cap gives away most of the big
              rebound years (2003, 2009), and policy charges still accrue in
              the flat years. Toggle back to compare.
            </Callout>
          ) : (
            <Callout tone="bad">
              <strong>What the steady scenario hides:</strong> real markets are
              lumpy. A smooth {inputs.expectedTotalReturnPct}% average never
              tests the 0% floor and hides how the cap surrenders big rebound
              years (markets gain 20%+ roughly one year in three). Try the
              &ldquo;bad sequence&rdquo; toggle to see both effects honestly.
            </Callout>
          )}

          <ResultActions
            title={`IUL vs 401(k) vs Taxable — ${inputs.years}-year projection`}
            shareText={`IUL vs 401(k) vs taxable brokerage over ${inputs.years} years — see the honest comparison:`}
            fileName="iul-vs-401k-comparison"
            rows={[
              { label: "401(k) after-tax value", value: usd(result.k401.afterTaxValue) },
              { label: "Taxable after-tax value", value: usd(result.taxable.afterTaxValue) },
              { label: "IUL cash value", value: usd(result.iul.afterTaxValue) },
              { label: "IUL death benefit", value: usd(result.iul.deathBenefit) },
              { label: "Total fees — 401(k) / taxable / IUL", value: `${usd(result.k401.totalFees)} / ${usd(result.taxable.totalFees)} / ${usd(result.iul.totalFees)}` },
              { label: "Horizon / scenario", value: `${inputs.years} yrs · ${form.seq ? "bad sequence" : "steady"}` },
            ]}
          />

          <p className="text-xs leading-relaxed text-ink-400">
            *IUL &ldquo;tax-free access&rdquo; depends on the policy staying in
            force for life; a lapsed policy with outstanding loans can trigger
            a large income-tax bill. This calculator is an educational model —
            illustrations are not guarantees, and real policy charges (which
            rise with age) are simplified here. Assumptions last updated{" "}
            <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time>. Not investment,
            tax, or insurance advice.
          </p>
        </div>
      </div>
    </div>
  );
}
