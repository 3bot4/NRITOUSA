"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  NumberField,
  SelectField,
  CalcGrid,
  Callout,
  num,
  usd,
  pct,
} from "./ui";
import ResultActions from "@/components/ResultActions";
import { useUrlState } from "@/lib/useUrlState";

/* ─────────────────── helpers ─────────────────── */

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function buildYearSeries(
  principal: number,
  afterTaxRate: number,
  years: number
): number[] {
  const pts: number[] = [principal];
  for (let y = 1; y <= years; y++) {
    pts.push(principal * Math.pow(1 + afterTaxRate, y));
  }
  return pts;
}

/* ─────────────────── inline SVG chart ─────────────────── */

function CompoundingChart({
  fcnrSeries,
  hysaSeries,
  tenure,
}: {
  fcnrSeries: number[];
  hysaSeries: number[];
  tenure: number;
}) {
  const W = 720;
  const H = 300;
  const m = { top: 24, right: 20, bottom: 36, left: 76 };

  const allVals = [...fcnrSeries, ...hysaSeries];
  const yMin = Math.min(...allVals);
  const yMax = Math.max(...allVals);
  const ySpan = yMax - yMin || 1;

  const x = (year: number) =>
    m.left + (year / 10) * (W - m.left - m.right);
  const y = (val: number) =>
    H - m.bottom - ((val - yMin) / ySpan) * (H - m.top - m.bottom);

  const polyPts = (series: number[]) =>
    series.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => yMin + f * ySpan);

  const fcnrAt5 = fcnrSeries[5];
  const hysaAt5 = hysaSeries[5];
  const fcnrAt10 = fcnrSeries[10];
  const hysaAt10 = hysaSeries[10];
  const diff5 = Math.abs(fcnrAt5 - hysaAt5);
  const diff10 = Math.abs(fcnrAt10 - hysaAt10);
  const fcnrWins5 = fcnrAt5 >= hysaAt5;
  const fcnrWins10 = fcnrAt10 >= hysaAt10;

  // Lock-in band: x range for years 1–5 on FCNR
  const bandX1 = x(1);
  const bandX2 = x(Math.min(5, 10));
  const bandTop = m.top;
  const bandBot = H - m.bottom;

  return (
    <div className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card sm:p-6">
      <p className="mb-4 text-sm font-bold uppercase tracking-wider text-ink-400">
        10-Year Compounding Growth
      </p>
      <div className="relative overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="FCNR vs HYSA 10-year compounding chart"
          className="h-auto w-full min-w-[320px]"
        >
          {/* lock-in band */}
          <rect
            x={bandX1}
            y={bandTop}
            width={bandX2 - bandX1}
            height={bandBot - bandTop}
            fill="#0d9488"
            fillOpacity="0.06"
          />
          <text
            x={(bandX1 + bandX2) / 2}
            y={bandTop + 13}
            textAnchor="middle"
            fontSize="10"
            fill="#0d9488"
            fontWeight="600"
          >
            FCNR locked in
          </text>
          {/* renewal band */}
          {10 > 5 && (
            <>
              <rect
                x={x(5)}
                y={bandTop}
                width={x(10) - x(5)}
                height={bandBot - bandTop}
                fill="#0d9488"
                fillOpacity="0.03"
              />
              <text
                x={(x(5) + x(10)) / 2}
                y={bandTop + 13}
                textAnchor="middle"
                fontSize="10"
                fill="#6b7280"
                fontWeight="600"
              >
                Est. renewal
              </text>
            </>
          )}
          {/* grid lines */}
          {yTicks.map((t) => (
            <g key={t}>
              <line
                x1={m.left}
                x2={W - m.right}
                y1={y(t)}
                y2={y(t)}
                stroke="#0b1120"
                strokeOpacity="0.06"
              />
              <text
                x={m.left - 6}
                y={y(t) + 4}
                textAnchor="end"
                fontSize="10"
                fill="#6b7280"
              >
                {usd(t, 0)}
              </text>
            </g>
          ))}
          {/* x axis labels */}
          {[0, 2, 4, 6, 8, 10].map((yr) => (
            <text
              key={yr}
              x={x(yr)}
              y={H - 8}
              textAnchor="middle"
              fontSize="10"
              fill="#6b7280"
            >
              Yr {yr}
            </text>
          ))}
          {/* tenure marker */}
          {tenure < 10 && (
            <line
              x1={x(tenure)}
              x2={x(tenure)}
              y1={m.top}
              y2={H - m.bottom}
              stroke="#6b7280"
              strokeWidth="1"
              strokeDasharray="4 3"
              strokeOpacity="0.5"
            />
          )}
          {/* HYSA line */}
          <polyline
            points={polyPts(hysaSeries)}
            fill="none"
            stroke="#64748b"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* FCNR line */}
          <polyline
            points={polyPts(fcnrSeries)}
            fill="none"
            stroke="#0d9488"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* yr 5 callout */}
          {diff5 > 0 && (
            <g>
              <circle cx={x(5)} cy={y(fcnrAt5)} r="4" fill="#0d9488" />
              <circle cx={x(5)} cy={y(hysaAt5)} r="3.5" fill="#64748b" />
              <text
                x={x(5) + 6}
                y={y(fcnrWins5 ? fcnrAt5 : hysaAt5) - 8}
                fontSize="10"
                fill={fcnrWins5 ? "#0d9488" : "#64748b"}
                fontWeight="600"
              >
                Δ {usd(diff5, 0)} yr 5
              </text>
            </g>
          )}
          {/* yr 10 callout */}
          {diff10 > 0 && (
            <g>
              <circle cx={x(10)} cy={y(fcnrAt10)} r="4" fill="#0d9488" />
              <circle cx={x(10)} cy={y(hysaAt10)} r="3.5" fill="#64748b" />
              <text
                x={x(10) - 8}
                y={y(fcnrWins10 ? fcnrAt10 : hysaAt10) - 8}
                textAnchor="end"
                fontSize="10"
                fill={fcnrWins10 ? "#0d9488" : "#64748b"}
                fontWeight="600"
              >
                Δ {usd(diff10, 0)} yr 10
              </text>
            </g>
          )}
        </svg>
      </div>
      {/* legend */}
      <div className="mt-3 flex flex-wrap items-center gap-5 text-xs text-ink-500">
        <span className="inline-flex items-center gap-2">
          <span className="h-0.5 w-6 rounded bg-teal-600" />
          FCNR (Indian bank USD deposit)
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-0.5 w-6 rounded bg-slate-400" />
          HYSA / CD (US account)
        </span>
      </div>
    </div>
  );
}

/* ─────────────────── result card ─────────────────── */

function ResultCard({
  title,
  subtitle,
  grossRate,
  afterTaxRate,
  netGain,
  totalValue,
  totalTax,
  grossEarned,
  isWinner,
  winnerAdv,
}: {
  title: string;
  subtitle: string;
  grossRate: number;
  afterTaxRate: number;
  netGain: number;
  totalValue: number;
  totalTax: number;
  grossEarned: number;
  isWinner: boolean;
  winnerAdv: number;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border-2 bg-white shadow-card transition-all ${
        isWinner ? "border-teal-400" : "border-ink-900/5"
      }`}
    >
      <div
        className={`px-5 py-3 text-sm font-bold uppercase tracking-wider text-white ${
          isWinner
            ? "bg-gradient-to-r from-teal-500 to-cyan-600"
            : "bg-gradient-to-r from-slate-500 to-slate-600"
        }`}
      >
        <span>{title}</span>
        {isWinner && (
          <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-[0.65rem]">
            ★ Better choice by {usd(winnerAdv, 0)}
          </span>
        )}
      </div>
      <div className="space-y-0 p-5">
        <p className="mb-4 text-xs text-ink-400">{subtitle}</p>
        <div className="border-b border-ink-900/5 pb-3">
          <p className="text-xs text-ink-500">Total value at maturity</p>
          <p
            className={`text-3xl font-extrabold tracking-tight ${
              isWinner ? "text-teal-600" : "text-ink-900"
            }`}
          >
            {usd(totalValue, 0)}
          </p>
        </div>
        <div className="space-y-1 pt-3 text-sm">
          <div className="flex justify-between border-b border-ink-900/5 py-1.5">
            <span className="text-ink-500">Gross rate</span>
            <span className="font-semibold">{pct(grossRate)}</span>
          </div>
          <div className="flex justify-between border-b border-ink-900/5 py-1.5">
            <span className="text-ink-500">After-tax effective rate</span>
            <span className="font-semibold">{pct(afterTaxRate)}</span>
          </div>
          <div className="flex justify-between border-b border-ink-900/5 py-1.5">
            <span className="text-ink-500">Gross interest earned</span>
            <span className="font-semibold">{usd(grossEarned, 0)}</span>
          </div>
          <div className="flex justify-between border-b border-ink-900/5 py-1.5">
            <span className="text-ink-500">US tax paid (total)</span>
            <span className="font-semibold text-rose-600">
              −{usd(totalTax, 0)}
            </span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="font-semibold text-ink-700">Net after-tax gain</span>
            <span className="font-bold text-emerald-600">
              +{usd(netGain, 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── main calculator ─────────────────── */

const TAX_BRACKETS = [
  { value: "22", label: "22% (single $47k–$100k / married $94k–$201k)" },
  { value: "24", label: "24% (single $100k–$191k / married $201k–$383k)" },
  { value: "32", label: "32% (single $191k–$243k / married $383k–$487k)" },
  { value: "35", label: "35% (single $243k–$609k / married $487k–$731k)" },
  { value: "37", label: "37% (over $609k single / $731k married)" },
];

export default function FcnrVsHysaCalculator() {
  const [s, set] = useUrlState({
    amount: "25000",
    tenure: "5",
    fcnrRate: "5.50",
    hysaRate: "4.50",
    federalTax: "24",
    stateTax: "0",
  });

  const principal = num(s.amount);
  const tenure = Math.max(1, Math.min(10, Math.round(num(s.tenure))));
  const fcnrGross = num(s.fcnrRate) / 100;
  const hysaGross = num(s.hysaRate) / 100;
  const fedRate = num(s.federalTax) / 100;
  const stateRate = num(s.stateTax) / 100;
  const totalTaxRate = fedRate + stateRate;

  const fcnrAfterTax = fcnrGross * (1 - totalTaxRate);
  const hysaAfterTax = hysaGross * (1 - totalTaxRate);

  const calc = useMemo(() => {
    const fcnrFinal = principal * Math.pow(1 + fcnrAfterTax, tenure);
    const hysaFinal = principal * Math.pow(1 + hysaAfterTax, tenure);

    const fcnrGrossEarned = principal * fcnrGross * tenure;
    const hysaGrossEarned = principal * hysaGross * tenure;
    const fcnrTax = fcnrGrossEarned * totalTaxRate;
    const hysaTax = hysaGrossEarned * totalTaxRate;
    const fcnrNetGain = fcnrFinal - principal;
    const hysaNetGain = hysaFinal - principal;

    const fcnrWins = fcnrFinal >= hysaFinal;
    const advantage = Math.abs(fcnrFinal - hysaFinal);

    const fcnrSeries = buildYearSeries(principal, fcnrAfterTax, 10);
    const hysaSeries = buildYearSeries(principal, hysaAfterTax, 10);

    return {
      fcnrFinal: round2(fcnrFinal),
      hysaFinal: round2(hysaFinal),
      fcnrNetGain: round2(fcnrNetGain),
      hysaNetGain: round2(hysaNetGain),
      fcnrGrossEarned: round2(fcnrGrossEarned),
      hysaGrossEarned: round2(hysaGrossEarned),
      fcnrTax: round2(fcnrTax),
      hysaTax: round2(hysaTax),
      fcnrWins,
      advantage: round2(advantage),
      fcnrSeries,
      hysaSeries,
    };
  }, [principal, fcnrAfterTax, hysaAfterTax, tenure, fcnrGross, hysaGross, totalTaxRate]);

  const advantagePct =
    calc.advantage > 0 && Math.min(calc.fcnrFinal, calc.hysaFinal) > 0
      ? (calc.advantage / Math.min(calc.fcnrFinal, calc.hysaFinal)) * 100
      : 0;

  const winnerName = calc.fcnrWins ? "FCNR" : "HYSA/CD";
  const loserName = calc.fcnrWins ? "HYSA/CD" : "FCNR";

  return (
    <div className="space-y-6">
      {/* inputs + result cards */}
      <CalcGrid
        inputs={
          <>
            <NumberField
              label="Investment amount (USD)"
              value={s.amount}
              onChange={(v) => set("amount", v)}
              prefix="$"
              hint="Range: $1,000–$500,000"
            />

            {/* tenure slider */}
            <label className="block">
              <span className="text-sm font-semibold text-ink-800">
                Investment tenure:{" "}
                <span className="text-brand-600">{tenure} year{tenure > 1 ? "s" : ""}</span>
              </span>
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={tenure}
                onChange={(e) => set("tenure", e.target.value)}
                className="mt-2 w-full accent-teal-600"
                aria-label="Investment tenure in years"
              />
              <div className="mt-1 flex justify-between text-xs text-ink-400">
                <span>1 yr</span>
                <span>5 yr</span>
                <span>10 yr</span>
              </div>
              {tenure <= 5 && (
                <span className="mt-1 block text-xs text-teal-600">
                  🔒 FCNR locks in for {tenure} year{tenure > 1 ? "s" : ""}
                  {tenure < 5 ? ", then renews at market rate" : ""}
                </span>
              )}
              {tenure > 5 && (
                <span className="mt-1 block text-xs text-ink-400">
                  Years 6–{tenure} assume FCNR auto-renews at the same rate
                </span>
              )}
            </label>

            <NumberField
              label="FCNR interest rate (% p.a.)"
              value={s.fcnrRate}
              onChange={(v) => set("fcnrRate", v)}
              suffix="%"
              hint="SBI 5.50% · HDFC 5.50% · ICICI 5.40% · Axis 5.60% — as of Jun 2026"
            />

            <NumberField
              label="US HYSA / CD rate (% p.a.)"
              value={s.hysaRate}
              onChange={(v) => set("hysaRate", v)}
              suffix="%"
              hint="Typical HYSA: 4.3–4.8% · 1-yr CD: 4.5–5.0%"
            />

            <SelectField
              label="US federal tax bracket"
              value={s.federalTax}
              onChange={(v) => set("federalTax", v)}
              options={TAX_BRACKETS}
              hint="Both FCNR and HYSA interest are taxed as ordinary income in the USA at your marginal rate."
            />

            <NumberField
              label="State income tax rate (%)"
              value={s.stateTax}
              onChange={(v) => set("stateTax", v)}
              suffix="%"
              hint="No state tax: TX, FL, WA, NV, SD, WY, TN, NH · CA: 9.3%+ · NY: 6.85%+"
            />
          </>
        }
        results={
          <>
            <ResultCard
              title="FCNR (Indian bank USD deposit)"
              subtitle={`Fixed deposit at an Indian bank in USD · ${pct(num(s.fcnrRate))} gross · no India tax under FEMA`}
              grossRate={fcnrGross * 100}
              afterTaxRate={fcnrAfterTax * 100}
              netGain={calc.fcnrNetGain}
              totalValue={calc.fcnrFinal}
              totalTax={calc.fcnrTax}
              grossEarned={calc.fcnrGrossEarned}
              isWinner={calc.fcnrWins}
              winnerAdv={calc.advantage}
            />

            <ResultCard
              title="HYSA / CD (US account)"
              subtitle={`High-yield savings or CD at a US bank · ${pct(num(s.hysaRate))} gross`}
              grossRate={hysaGross * 100}
              afterTaxRate={hysaAfterTax * 100}
              netGain={calc.hysaNetGain}
              totalValue={calc.hysaFinal}
              totalTax={calc.hysaTax}
              grossEarned={calc.hysaGrossEarned}
              isWinner={!calc.fcnrWins}
              winnerAdv={calc.advantage}
            />

            {/* plain-English summary */}
            <div className="rounded-xl bg-slate-50 px-5 py-4 text-sm leading-relaxed text-ink-700">
              {calc.advantage < 1 ? (
                <span>
                  At your inputs, FCNR and HYSA/CD return almost identical
                  after-tax gains over {tenure} year{tenure > 1 ? "s" : ""}.
                </span>
              ) : (
                <span>
                  <strong>{winnerName}</strong> earns you{" "}
                  <strong>{usd(calc.advantage, 0)} more</strong> after US taxes
                  over {tenure} year{tenure > 1 ? "s" : ""} — a{" "}
                  <strong>{advantagePct.toFixed(1)}% advantage</strong> at your{" "}
                  {s.federalTax}%
                  {num(s.stateTax) > 0 ? ` + ${s.stateTax}%` : ""} tax
                  bracket. {loserName} trails by that margin despite identical
                  tax treatment.
                </span>
              )}
            </div>

            <ResultActions
              title="FCNR vs HYSA comparison"
              shareText="I compared FCNR vs HYSA after-tax returns for NRIs:"
              fileName="fcnr-vs-hysa"
              rows={[
                { label: "Principal", value: usd(principal, 0) },
                { label: "Tenure", value: `${tenure} years` },
                { label: "FCNR after-tax gain", value: usd(calc.fcnrNetGain, 0) },
                { label: "HYSA after-tax gain", value: usd(calc.hysaNetGain, 0) },
                { label: "Winner advantage", value: usd(calc.advantage, 0) },
              ]}
            />
          </>
        }
      />

      {/* chart */}
      <CompoundingChart
        fcnrSeries={calc.fcnrSeries}
        hysaSeries={calc.hysaSeries}
        tenure={tenure}
      />

      {/* important notices */}
      <div className="space-y-3">
        <Callout tone="note">
          <strong>FBAR filing required:</strong> If your total Indian bank
          account balances exceed $10,000 at any point during the year, you must
          file FinCEN Form 114 annually by April 15. Failure to file carries
          steep penalties.{" "}
          <Link href="/tools/fbar-fatca-checker" className="underline">
            → Check your FBAR obligation
          </Link>
        </Callout>

        <Callout tone="bad">
          <strong>FCNR early closure:</strong> If you close the deposit before 1
          year, you earn zero interest. After 1 year, a 1% penalty applies on
          the contracted rate.
        </Callout>

        <Callout tone="note">
          <strong>Deposit insurance gap:</strong> Indian deposit insurance (DICGC) covers
          up to ₹5 lakhs (~$6,000 at current rates) per depositor per bank —
          much less than the $250,000 FDIC coverage on US accounts. For large
          amounts, split across banks.
        </Callout>

        <Callout tone="note">
          <strong>Rate disclaimer:</strong> Rates shown are indicative. Verify
          current rates directly with your bank before opening a deposit. FCNR
          rates change monthly.
        </Callout>
      </div>

      {/* internal links */}
      <div className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-400">
          Learn more
        </p>
        <ul className="space-y-2 text-sm">
          <li>
            <Link
              href="/articles/fcnr-deposit-usd-yield"
              className="text-brand-600 underline hover:text-brand-700"
            >
              What is an FCNR account? →
            </Link>
          </li>
          <li>
            <Link
              href="/articles/nre-nro-accounts-explained"
              className="text-brand-600 underline hover:text-brand-700"
            >
              NRE vs NRO vs FCNR guide →
            </Link>
          </li>
          <li>
            <Link
              href="/tools/fbar-fatca-checker"
              className="text-brand-600 underline hover:text-brand-700"
            >
              FBAR / FATCA checker →
            </Link>
          </li>
          <li>
            <Link
              href="/calculators/remittance-tcs-cost"
              className="text-brand-600 underline hover:text-brand-700"
            >
              Remittance & TCS calculator →
            </Link>
          </li>
          <li>
            <Link
              href="/calculators/rnor-tax-residency"
              className="text-brand-600 underline hover:text-brand-700"
            >
              RNOR tax residency calculator (if moving back) →
            </Link>
          </li>
        </ul>
      </div>

      {/* FAQ schema block (hidden, for SEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Is FCNR interest taxable in the USA?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. FCNR interest earned by a US resident or citizen is taxable as ordinary income in the USA at your marginal federal rate, plus any applicable state income tax. It is exempt from Indian tax under FEMA.",
                },
              },
              {
                "@type": "Question",
                name: "Is FCNR better than a US high-yield savings account?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "It depends on the current rate differential and your tax bracket. When FCNR rates exceed HYSA rates, FCNR wins on after-tax yield. Use this calculator to compare your specific numbers.",
                },
              },
              {
                "@type": "Question",
                name: "What is the current FCNR interest rate for USD?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "As of mid-2026, major Indian banks offer around 5.40–5.60% p.a. on USD FCNR deposits. SBI and HDFC are at 5.50%, Axis at 5.60%, ICICI at 5.40%. Rates change monthly — verify directly with your bank.",
                },
              },
              {
                "@type": "Question",
                name: "Do I need to file FBAR for an FCNR account?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. An FCNR account at an Indian bank is a foreign financial account. If your total foreign account balances exceed $10,000 at any point during the year, you must file FinCEN Form 114 (FBAR) annually by April 15.",
                },
              },
              {
                "@type": "Question",
                name: "What happens if I withdraw FCNR before maturity?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "If you close an FCNR deposit before one year, you earn zero interest. After one year but before maturity, a 1% penalty is applied to the contracted interest rate.",
                },
              },
            ],
          }),
        }}
      />
    </div>
  );
}
