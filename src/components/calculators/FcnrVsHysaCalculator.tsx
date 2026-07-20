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
  InvalidInputPanel,
} from "./ui";
import ResultActions from "@/components/ResultActions";
import { useUrlState } from "@/lib/useUrlState";
import { validateAll, USD_AMOUNT, PERCENT } from "@/lib/calc/validation";
import { runFcnrModel, type Compounding, type IndiaStatus } from "@/lib/calc/fcnrHysa";
import { marginalRateOptions } from "@/lib/calc/usTaxConfig";

/* ─────────────────── helpers ─────────────────── */

function round2(n: number) {
  return Math.round(n * 100) / 100;
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
  netGain,
  totalValue,
  usFederalTax,
  usStateTax,
  indianTaxBeforeFtc,
  foreignTaxCredit,
  combinedNetTax,
  grossEarned,
  isWinner,
  winnerAdv,
  showWinner,
}: {
  title: string;
  subtitle: string;
  grossRate: number;
  netGain: number;
  totalValue: number;
  usFederalTax: number;
  usStateTax: number;
  indianTaxBeforeFtc: number;
  foreignTaxCredit: number;
  combinedNetTax: number;
  grossEarned: number;
  isWinner: boolean;
  winnerAdv: number;
  showWinner: boolean;
}) {
  const highlight = isWinner && showWinner;
  return (
    <div
      className={`overflow-hidden rounded-2xl border-2 bg-white shadow-card transition-all ${
        highlight ? "border-teal-400" : "border-ink-900/5"
      }`}
    >
      <div
        className={`px-5 py-3 text-sm font-bold uppercase tracking-wider text-white ${
          highlight
            ? "bg-gradient-to-r from-teal-500 to-cyan-600"
            : "bg-gradient-to-r from-slate-500 to-slate-600"
        }`}
      >
        <span>{title}</span>
        {highlight && (
          <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-[0.65rem]">
            ★ Better choice by {usd(winnerAdv, 0)}
          </span>
        )}
      </div>
      <div className="space-y-0 p-5">
        <p className="mb-4 text-xs text-ink-400">{subtitle}</p>
        <div className="border-b border-ink-900/5 pb-3">
          <p className="text-xs text-ink-500">Estimated value at maturity</p>
          <p
            className={`text-3xl font-extrabold tracking-tight ${
              highlight ? "text-teal-600" : "text-ink-900"
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
            <span className="text-ink-500">Gross interest earned</span>
            <span className="font-semibold">{usd(grossEarned, 0)}</span>
          </div>
          {/* Each tax on its own line — never merged. */}
          <div className="flex justify-between border-b border-ink-900/5 py-1.5">
            <span className="text-ink-500">US federal tax</span>
            <span className="font-semibold text-rose-600">−{usd(usFederalTax, 0)}</span>
          </div>
          <div className="flex justify-between border-b border-ink-900/5 py-1.5">
            <span className="text-ink-500">US state tax</span>
            <span className="font-semibold text-rose-600">−{usd(usStateTax, 0)}</span>
          </div>
          {indianTaxBeforeFtc > 0 && (
            <>
              <div className="flex justify-between border-b border-ink-900/5 py-1.5">
                <span className="text-ink-500">Estimated Indian tax (before FTC)</span>
                <span className="font-semibold text-rose-600">−{usd(indianTaxBeforeFtc, 0)}</span>
              </div>
              <div className="flex justify-between border-b border-ink-900/5 py-1.5">
                <span className="text-ink-500">Foreign tax credit</span>
                <span className="font-semibold text-emerald-600">
                  {foreignTaxCredit > 0 ? `+${usd(foreignTaxCredit, 0)}` : "Not modeled"}
                </span>
              </div>
            </>
          )}
          <div className="flex justify-between border-b border-ink-900/5 py-1.5">
            <span className="text-ink-600">Combined net tax</span>
            <span className="font-semibold text-rose-600">−{usd(combinedNetTax, 0)}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="font-semibold text-ink-700">Net after-tax gain</span>
            <span className="font-bold text-emerald-600">+{usd(netGain, 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── main calculator ─────────────────── */

// 2026 marginal-rate ranges, generated from the sourced IRS 2026 config
// (Single + MFJ thresholds, the ranges the IRS release publishes).
const TAX_BRACKETS = marginalRateOptions();

export default function FcnrVsHysaCalculator() {
  const [s, set] = useUrlState({
    amount: "25000",
    tenure: "5",
    fcnrRate: "",
    hysaRate: "",
    federalTax: "24",
    stateTax: "0",
    indiaStatus: "nri",
    compounding: "annual",
    indiaRate: "",
    ftc: "not_modeled",
  });

  const val = validateAll(
    {
      amount: s.amount,
      fcnrRate: s.fcnrRate,
      hysaRate: s.hysaRate,
      federalTax: s.federalTax,
      stateTax: s.stateTax,
      indiaRate: s.indiaRate,
    },
    {
      amount: { label: "Investment amount", ...USD_AMOUNT, required: true },
      // Rates are NOT required: blank is allowed and suppresses the comparison
      // until both are entered (item 1F), rather than erroring.
      fcnrRate: { label: "FCNR interest rate", min: 0, max: 100 },
      hysaRate: { label: "US HYSA / CD rate", min: 0, max: 100 },
      federalTax: { label: "Federal tax rate", ...PERCENT, required: true },
      stateTax: { label: "State income tax rate", ...PERCENT, required: true },
      indiaRate: { label: "Indian marginal tax rate", ...PERCENT },
    },
  );
  const fieldErrors = Object.values(val.errors).filter(Boolean) as string[];

  const principal = val.values.amount;
  const tenure = Math.max(1, Math.min(10, Math.round(num(s.tenure))));
  const fcnrGross = val.values.fcnrRate / 100;
  const hysaGross = val.values.hysaRate / 100;
  const fedRate = val.values.federalTax / 100;
  const stateRate = val.values.stateTax / 100;
  const indiaStatus = s.indiaStatus as IndiaStatus;
  const compounding = s.compounding as Compounding;
  const ftcTreatment = (s.ftc === "estimate" ? "estimate" : "not_modeled") as
    | "estimate"
    | "not_modeled";

  // Gating (items 1C / 1F).
  const bothRatesEntered = s.fcnrRate.trim() !== "" && s.hysaRate.trim() !== "";
  const isRor = indiaStatus === "ror";
  const indiaRateEntered = s.indiaRate.trim() !== "";
  const rorAssumptionsMissing = isRor && !indiaRateEntered;
  // Indian tax is included only when ROR AND a rate is supplied — never a
  // silent 30%.
  const indiaRateForModel = isRor && indiaRateEntered ? val.values.indiaRate / 100 : 0;
  const showWinner = bothRatesEntered && !rorAssumptionsMissing;

  const calc = useMemo(() => {
    const common = {
      years: tenure,
      compounding,
      indiaStatus,
      indiaRate: indiaRateForModel,
      usFederalRate: fedRate,
      stateRate,
      ftcTreatment,
    };
    const fcnr = runFcnrModel({
      ...common,
      principal,
      annualRate: fcnrGross,
      indianSource: true, // FCNR is Indian-source: Indian tax applies once ROR
    });
    const hysa = runFcnrModel({
      ...common,
      principal,
      annualRate: hysaGross,
      indianSource: false, // US-source interest: no Indian tax here
    });

    const fcnrFinal = fcnr.final.endingBalance;
    const hysaFinal = hysa.final.endingBalance;
    const fcnrWins = fcnrFinal >= hysaFinal;
    const advantage = Math.abs(fcnrFinal - hysaFinal);

    // 10-year chart series from the SAME model, so the picture matches the
    // headline figures (endingBalance at each year boundary).
    const yearly = (rate: number, indianSource: boolean) => {
      const pts: number[] = [principal];
      for (let y = 1; y <= 10; y++) {
        pts.push(
          runFcnrModel({ ...common, years: y, principal, annualRate: rate, indianSource })
            .final.endingBalance,
        );
      }
      return pts;
    };

    return {
      fcnrFinal: round2(fcnrFinal),
      hysaFinal: round2(hysaFinal),
      fcnrNetGain: fcnr.final.netGain,
      hysaNetGain: hysa.final.netGain,
      fcnrGrossEarned: fcnr.final.cumulativeGrossInterest,
      hysaGrossEarned: hysa.final.cumulativeGrossInterest,
      fcnrFederal: fcnr.final.usFederalTax,
      fcnrState: fcnr.final.stateTax,
      fcnrIndianBeforeFtc: fcnr.final.indianTaxBeforeFtc,
      fcnrFtc: fcnr.final.foreignTaxCredit,
      fcnrCombinedTax: fcnr.final.cumulativeTax,
      hysaFederal: hysa.final.usFederalTax,
      hysaState: hysa.final.stateTax,
      hysaCombinedTax: hysa.final.cumulativeTax,
      fcnrWins,
      advantage: round2(advantage),
      fcnrSeries: yearly(fcnrGross, true),
      hysaSeries: yearly(hysaGross, false),
      reconciles: fcnr.reconciles && hysa.reconciles,
    };
  }, [principal, tenure, fcnrGross, hysaGross, fedRate, stateRate, indiaStatus, compounding, indiaRateForModel, ftcTreatment]);

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
              min={0}
              step={1000}
              error={val.errors.amount}
              hint="Typical range: $1,000–$500,000"
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
              min={0}
              max={100}
              step={0.05}
              placeholder="e.g. 5.50"
              error={val.errors.fcnrRate}
              hint="Enter the rate your bank quotes for your currency and term — check its official FCNR rate page. Rates vary by bank, term and currency and change often."
            />

            <NumberField
              label="US HYSA / CD rate (% p.a.)"
              value={s.hysaRate}
              onChange={(v) => set("hysaRate", v)}
              suffix="%"
              min={0}
              max={100}
              step={0.05}
              placeholder="e.g. 4.50"
              error={val.errors.hysaRate}
              hint="Enter your bank's current advertised APY."
            />

            <SelectField
              label="Compounding frequency"
              value={s.compounding}
              onChange={(v) => set("compounding", v)}
              options={[
                { value: "annual", label: "Annual" },
                { value: "semiannual", label: "Semi-annual" },
                { value: "quarterly", label: "Quarterly" },
              ]}
              hint="Assumption for this estimate. FCNR interest is compounded on the schedule set by the bank under RBI rules — confirm your deposit's actual frequency."
            />

            <SelectField
              label="Your India residency status"
              value={s.indiaStatus}
              onChange={(v) => set("indiaStatus", v)}
              options={[
                { value: "nri", label: "NRI — Non-Resident" },
                { value: "rnor", label: "RNOR — Resident, Not Ordinarily Resident" },
                { value: "ror", label: "ROR — Resident & Ordinarily Resident" },
              ]}
              hint="FCNR interest is generally Indian-tax exempt while the depositor qualifies as NRI or RNOR and generally becomes taxable after becoming ROR, subject to current law and individual circumstances."
            />

            {isRor && (
              <>
                <NumberField
                  label="Estimated Indian marginal tax rate"
                  value={s.indiaRate}
                  onChange={(v) => set("indiaRate", v)}
                  suffix="%"
                  min={0}
                  max={100}
                  step={0.5}
                  placeholder="required for ROR"
                  error={val.errors.indiaRate}
                  hint="Your Indian slab rate on this interest as ROR. Left blank, Indian tax is not included — the tool never assumes a rate."
                />
                <SelectField
                  label="Foreign tax credit treatment"
                  value={s.ftc}
                  onChange={(v) => set("ftc", v)}
                  options={[
                    { value: "not_modeled", label: "Not modeled (adds US + Indian tax)" },
                    { value: "estimate", label: "Estimate (simplified lower-of credit)" },
                  ]}
                  hint="The FTC can offset Indian tax against US tax on the same income. Left as 'Not modeled', the combined figure may overstate your true tax."
                />
              </>
            )}

            <SelectField
              label="US federal marginal rate (2026)"
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
              min={0}
              max={100}
              step={0.05}
              error={val.errors.stateTax}
              hint="No state tax: TX, FL, WA, NV, SD, WY, TN, NH · CA: 9.3%+ · NY: 6.85%+"
            />
          </>
        }
        results={
          !val.ok ? (
            <InvalidInputPanel errors={fieldErrors} />
          ) : (
          <>
            {!bothRatesEntered && (
              <Callout tone="note">
                <strong>Enter both rates to compare.</strong> Fill in the FCNR
                and the HYSA/CD rate above — the calculator does not pick a
                &ldquo;better choice&rdquo; until you provide both current rates.
              </Callout>
            )}
            {bothRatesEntered && rorAssumptionsMissing && (
              <Callout tone="bad">
                <strong>Indian tax exposure not included.</strong> You selected
                ROR, where FCNR interest is taxable in India — but no Indian
                marginal rate is entered, so the figures below reflect US tax
                only and no &ldquo;better choice&rdquo; is shown. Add your
                estimated Indian marginal rate (and choose an FTC treatment) to
                include it.
              </Callout>
            )}

            <ResultCard
              title="FCNR (Indian bank foreign-currency deposit)"
              subtitle={`Fixed deposit at an Indian bank · ${
                s.fcnrRate.trim() === "" ? "rate not entered" : pct(num(s.fcnrRate)) + " gross"
              } · ${
                isRor
                  ? indiaRateEntered
                    ? "Indian tax applies (ROR)"
                    : "ROR — Indian tax not yet included"
                  : "Indian-tax exempt while NRI/RNOR"
              }`}
              grossRate={fcnrGross * 100}
              netGain={calc.fcnrNetGain}
              totalValue={calc.fcnrFinal}
              usFederalTax={calc.fcnrFederal}
              usStateTax={calc.fcnrState}
              indianTaxBeforeFtc={calc.fcnrIndianBeforeFtc}
              foreignTaxCredit={calc.fcnrFtc}
              combinedNetTax={calc.fcnrCombinedTax}
              grossEarned={calc.fcnrGrossEarned}
              isWinner={calc.fcnrWins}
              winnerAdv={calc.advantage}
              showWinner={showWinner}
            />

            <ResultCard
              title="HYSA / CD (US account)"
              subtitle={`High-yield savings or CD at a US bank · ${
                s.hysaRate.trim() === "" ? "rate not entered" : pct(num(s.hysaRate)) + " gross"
              }`}
              grossRate={hysaGross * 100}
              netGain={calc.hysaNetGain}
              totalValue={calc.hysaFinal}
              usFederalTax={calc.hysaFederal}
              usStateTax={calc.hysaState}
              indianTaxBeforeFtc={0}
              foreignTaxCredit={0}
              combinedNetTax={calc.hysaCombinedTax}
              grossEarned={calc.hysaGrossEarned}
              isWinner={!calc.fcnrWins}
              winnerAdv={calc.advantage}
              showWinner={showWinner}
            />

            {isRor && indiaRateEntered && ftcTreatment === "estimate" && (
              <Callout tone="note">
                The foreign tax credit shown is a <strong>simplified lower-of
                estimate</strong> — the Indian tax on this interest, capped at
                the US federal tax on the same interest. It is not a Form 1116
                computation; the real credit depends on your whole return,
                separate income baskets, and currency timing.
              </Callout>
            )}

            {/* plain-English summary — only when a definitive comparison is valid */}
            {showWinner && (
              <div className="rounded-xl bg-slate-50 px-5 py-4 text-sm leading-relaxed text-ink-700">
                {calc.advantage < 1 ? (
                  <span>
                    At your inputs, FCNR and HYSA/CD return almost identical
                    after-tax gains over {tenure} year{tenure > 1 ? "s" : ""}.
                  </span>
                ) : (
                  <span>
                    <strong>{winnerName}</strong> earns you{" "}
                    <strong>{usd(calc.advantage, 0)} more</strong> after tax over{" "}
                    {tenure} year{tenure > 1 ? "s" : ""} — a{" "}
                    <strong>{advantagePct.toFixed(1)}% advantage</strong>.{" "}
                    {loserName} trails by that margin.
                  </span>
                )}
              </div>
            )}

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
          )
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
          <strong>FCNR early closure:</strong> FCNR deposits generally earn no
          interest if closed before 12 months. If closed after 12 months but
          before maturity, banks typically pay interest for the period held and
          may apply a penalty on the contracted rate. The exact rule —
          including any penalty percentage — is <strong>bank-specific</strong>,
          so check your own bank&apos;s FCNR terms rather than assuming a single
          universal figure.
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

      {/* No FAQPage schema is emitted here.
       *
       * This component previously injected a second, hidden FAQPage block —
       * five questions that appeared nowhere in the rendered page. Google
       * requires FAQPage content to be visible to the user, so hidden markup
       * risks losing the rich result or drawing a manual action, and the page
       * was also emitting two competing FAQPage nodes at once.
       *
       * The page's real FAQ lives in calculatorContent.ts ("fcnr-vs-hysa"),
       * is rendered by CalculatorDeepDive, and is serialized to schema by
       * calculators/[slug]/page.tsx — visible and machine-readable stay in
       * sync by construction. Add new FAQs there, never here.
       */}
    </div>
  );
}
