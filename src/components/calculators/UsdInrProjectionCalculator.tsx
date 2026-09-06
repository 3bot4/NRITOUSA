"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalcGrid,
  Callout,
  InvalidInputPanel,
  NumberField,
  SelectField,
  inr,
  usd,
} from "./ui";
import ResultActions from "@/components/ResultActions";
import { author } from "@/lib/author";
import { site } from "@/lib/site";
import { useUrlState } from "@/lib/useUrlState";
import {
  blendedRate,
  breakEvenDriftPct,
  compareTiming,
  driftCagr,
  projectRate,
  sensitivity,
  SPLIT_PLANS,
  validateTiming,
  waitingCostGrid,
  type TimingInput,
  type TimingMode,
} from "@/lib/calc/usdInrTiming";
import {
  BANK_FORECASTS,
  DEFAULT_SCENARIO,
  FAILED_FORECAST,
  FORECAST_UPDATED,
  FX_SCENARIOS,
  FX_USDINR,
  FX_USDINR_AS_OF,
  HISTORY_SOURCE,
  HISTORY_SOURCE_URL,
  RUPEE_DRIVERS,
  USD_INR_YEAR_END,
  WESTPAC_2028,
} from "@/data/usdInrForecastData";
import DecisionTree, { type Outcome } from "./usd-inr/DecisionTree";
import {
  BankForecastChart,
  HistoryChart,
  RupeeDriversDiagram,
  ScenarioProjectionChart,
  WaitingCostChart,
} from "./usd-inr/charts";

/* ───────────────────────────── constants ───────────────────────────── */

/** Default US cash yield — a mainstream HYSA/T-bill number, user-editable. */
const DEFAULT_US_RATE = "4";
/** Default Indian deposit rate. Editable, because NRE FD rates move. */
const DEFAULT_INDIA_RATE = "7.25";

/**
 * Every value the decision tree can apply must exist here — a `wait` the
 * <select> has no option for leaves the dropdown showing the wrong horizon
 * while the maths quietly uses the applied one. Four months is the "three
 * tranches" outcome's end date.
 */
const WAIT_OPTIONS = [
  { value: "0", label: "Send today (no wait)" },
  { value: "3", label: "Wait 3 months" },
  { value: "4", label: "Wait 4 months" },
  { value: "6", label: "Wait 6 months" },
  { value: "12", label: "Wait 12 months" },
  { value: "24", label: "Wait 24 months" },
];

const HISTORICAL_CAGR = driftCagr(USD_INR_YEAR_END);

/** Near-horizon bank band — what a 3-to-12-month waiter actually cares about. */
const END_2026 = BANK_FORECASTS.map((f) => f.end2026).filter(
  (v): v is number => v !== null
);
const BAND_LOW = Math.min.apply(null, END_2026);
const BAND_HIGH = Math.max.apply(null, END_2026);

/** ISO date this page first went live — mirrored in calculatorContent. */
const PUBLISHED = "2026-09-06";
const CANONICAL_URL = `${site.url}/calculators/usd-inr-projection-send-now-or-wait`;

/** Drift over the trailing decade, for the "10 vs 20 years" comparison. */
const TEN_YEAR_CAGR = driftCagr(USD_INR_YEAR_END.slice(-11));

/**
 * Break-even at the calculator's *default* rates, not the visitor's edited
 * ones — a citable figure must not move when someone changes an input.
 */
const DEFAULT_BREAKEVEN = breakEvenDriftPct(
  Number(DEFAULT_INDIA_RATE),
  Number(DEFAULT_US_RATE)
);

/** The most rupee-positive 2027 target published in BANK_FORECASTS. */
const END_2027 = BANK_FORECASTS.map((f) => f.end2027).filter(
  (v): v is number => v !== null
);
const BULL_2027 = Math.min.apply(null, END_2027);

const EXCHANGE_RATES_UK_SURVEY = BANK_FORECASTS.filter(
  (f) => f.bank === "Barclays"
)[0];

/**
 * The quotable set. Each figure carries its own source and date so a
 * journalist can attribute a single number without reading the whole page.
 */
const KEY_FIGURES: {
  figure: string;
  label: string;
  source: string;
  sourceUrl?: string;
  asOf?: string;
}[] = [
  {
    figure: `₹${FX_USDINR.toFixed(2)}`,
    label: "USD/INR spot rate used throughout this page",
    source: "Entered by hand from market data; no live feed",
    asOf: FX_USDINR_AS_OF,
  },
  {
    figure: `${HISTORICAL_CAGR.toFixed(1)}% a year`,
    label: `Average rupee depreciation, ${USD_INR_YEAR_END[0].year}–${USD_INR_YEAR_END[USD_INR_YEAR_END.length - 1].year}`,
    source: HISTORY_SOURCE,
    sourceUrl: HISTORY_SOURCE_URL,
    asOf: "20-year CAGR",
  },
  {
    figure: `${TEN_YEAR_CAGR.toFixed(1)}% a year`,
    label: "The same measure over the last 10 years — the slide has been slowing",
    source: HISTORY_SOURCE,
    sourceUrl: HISTORY_SOURCE_URL,
    asOf: "10-year CAGR",
  },
  {
    figure: `₹${BAND_LOW.toFixed(2)}–₹${BAND_HIGH.toFixed(2)}`,
    label: "Range of published bank forecasts for end-2026",
    source: "Exchange Rates UK forecast survey coverage",
    sourceUrl: EXCHANGE_RATES_UK_SURVEY ? EXCHANGE_RATES_UK_SURVEY.sourceUrl : undefined,
    asOf: FORECAST_UPDATED,
  },
  {
    figure: `₹${BULL_2027}`,
    label: "The most rupee-positive end-2027 target in that survey — several banks expect a recovery, not a fall",
    source: "Exchange Rates UK forecast survey coverage",
    sourceUrl: EXCHANGE_RATES_UK_SURVEY ? EXCHANGE_RATES_UK_SURVEY.sourceUrl : undefined,
    asOf: FORECAST_UPDATED,
  },
  {
    figure: `${(((FAILED_FORECAST.actual - FAILED_FORECAST.predicted) / FAILED_FORECAST.predicted) * 100).toFixed(1)}%`,
    label: `How far a ${FAILED_FORECAST.pollDate} Reuters poll of ${FAILED_FORECAST.strategists} strategists missed the ${FAILED_FORECAST.predictedFor} rate`,
    source: `Forecast ₹${FAILED_FORECAST.predicted}; actual ≈ ₹${FAILED_FORECAST.actual}`,
    asOf: FAILED_FORECAST.predictedFor,
  },
  {
    figure: `${DEFAULT_BREAKEVEN.toFixed(2)}% a year`,
    label: `Depreciation needed before waiting beats sending, at a ${DEFAULT_INDIA_RATE}% NRE FD against ${DEFAULT_US_RATE}% US cash`,
    source: "This page's calculation (covered interest parity)",
    asOf: FORECAST_UPDATED,
  },
];

function fmtDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${Number(d)} ${months[Number(m) - 1]} ${y}`;
}

/** Section wrapper so every H2 on the page gets the same rhythm and anchor. */
function Block({
  id,
  eyebrow,
  title,
  lede,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  lede?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-14 scroll-mt-24 sm:mt-16">
      <p className="text-[0.6875rem] font-bold uppercase tracking-widest text-brand-600">
        {eyebrow}
      </p>
      <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
        {title}
      </h2>
      {lede && (
        <p className="mt-2.5 max-w-3xl text-base leading-relaxed text-ink-600">
          {lede}
        </p>
      )}
      {children}
    </section>
  );
}

/* ───────────────────────────── component ───────────────────────────── */

export default function UsdInrProjectionCalculator() {
  const [s, set] = useUrlState({
    mode: "send",
    amount: "10000",
    bill: "1000000",
    spot: String(FX_USDINR),
    usRate: DEFAULT_US_RATE,
    indiaRate: DEFAULT_INDIA_RATE,
    wait: "12",
    scenario: DEFAULT_SCENARIO,
  });

  const [plan, setPlan] = useState<keyof typeof SPLIT_PLANS>("now");

  const mode: TimingMode = s.mode === "bill" ? "bill" : "send";
  const scenario =
    FX_SCENARIOS.filter((x) => x.key === s.scenario)[0] || FX_SCENARIOS[1];

  const val = validateTiming(
    {
      amountUsd: s.amount,
      billInr: s.bill,
      spot: s.spot,
      usRate: s.usRate,
      indiaRate: s.indiaRate,
      waitMonths: s.wait,
    },
    mode
  );

  const input: TimingInput = {
    mode,
    amountUsd: val.values.amountUsd,
    billInr: val.values.billInr,
    spot: val.values.spot,
    driftPct: scenario.driftPct,
    waitMonths: val.values.waitMonths,
    usRatePct: val.values.usRate,
    indiaRatePct: val.values.indiaRate,
  };

  const result = useMemo(() => compareTiming(input), [
    input.mode, input.amountUsd, input.billInr, input.spot,
    input.driftPct, input.waitMonths, input.usRatePct, input.indiaRatePct,
  ]);

  const swings = useMemo(() => sensitivity(input, 2), [
    input.mode, input.amountUsd, input.billInr, input.spot,
    input.driftPct, input.waitMonths, input.usRatePct, input.indiaRatePct,
  ]);

  const grid = useMemo(
    () => waitingCostGrid(input, FX_SCENARIOS, [3, 6, 12, 24]),
    [
      input.mode, input.amountUsd, input.billInr, input.spot,
      input.waitMonths, input.usRatePct, input.indiaRatePct,
    ]
  );

  const spot = val.ok ? input.spot : FX_USDINR;
  const currency: "INR" | "USD" = mode === "bill" ? "USD" : "INR";
  const money = (v: number) =>
    currency === "USD" ? usd(Math.abs(v)) : inr(Math.abs(v));

  /** Applies a decision-tree outcome to the calculator inputs. */
  function applyOutcome(outcome: Outcome, billMode: boolean) {
    set("mode", billMode ? "bill" : "send");
    if (outcome === "now") {
      set("wait", "0");
      setPlan("now");
    } else if (outcome === "half") {
      set("wait", "3");
      setPlan("half");
    } else if (outcome === "thirds") {
      set("wait", "4");
      setPlan("thirds");
    } else {
      set("wait", "12");
      setPlan("now");
    }
    if (typeof document !== "undefined") {
      const el = document.getElementById("calculator");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  const verdictCopy =
    result.verdict === "tossup"
      ? "It's a coin flip"
      : result.verdict === "wait"
        ? "Waiting comes out ahead"
        : "Sending today comes out ahead";

  const verdictTone =
    result.verdict === "tossup"
      ? "border-ink-900/10 bg-slate-50"
      : result.verdict === "wait"
        ? "border-emerald-200 bg-emerald-50/70"
        : "border-brand-200 bg-brand-50/70";

  return (
    <div>

      {/* ─────────────── 1. Today's rate ─────────────── */}
      <div className="rounded-2xl border border-ink-900/5 bg-gradient-to-br from-ink-900 to-brand-800 p-6 text-white shadow-card sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.6875rem] font-bold uppercase tracking-widest text-brand-200">
              1 US dollar buys, today
            </p>
            <p className="mt-1 text-5xl font-extrabold tracking-tight sm:text-6xl">
              ₹{FX_USDINR.toFixed(2)}
            </p>
            <p className="mt-1.5 text-sm text-brand-100">
              As of {fmtDate(FX_USDINR_AS_OF)}. Rate entered by hand, not a live
              feed — check your provider&rsquo;s rate before you transfer.
            </p>
          </div>
          <div className="text-sm text-brand-100">
            <p>
              <span className="font-bold text-white">
                +{HISTORICAL_CAGR.toFixed(1)}% a year
              </span>{" "}
              — the rupee&rsquo;s average slide since 2006
            </p>
            <p className="mt-1">
              <span className="font-bold text-white">
                {result.breakEvenDrift.toFixed(2)}% a year
              </span>{" "}
              — the slide you need to justify waiting
            </p>
          </div>
        </div>
      </div>

      {/* ─────────────── 2. Key figures (citation) ─────────────── */}
      <section id="key-figures" className="mt-12 scroll-mt-24 sm:mt-14">
        <p className="text-[0.6875rem] font-bold uppercase tracking-widest text-brand-600">
          For citation
        </p>
        <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
          Key figures at a glance
        </h2>
        <p className="mt-2.5 max-w-3xl text-base leading-relaxed text-ink-600">
          Every number on this page is dated and sourced. Figures are quotable
          with attribution — see{" "}
          <a href="#how-to-cite" className="font-semibold text-brand-600 hover:text-brand-700">
            how to cite this page
          </a>
          .
        </p>

        <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {KEY_FIGURES.map((f) => (
            <div
              key={f.label}
              className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card"
            >
              <dt className="text-2xl font-extrabold tracking-tight text-ink-900">
                {f.figure}
              </dt>
              <dd className="mt-1 text-sm font-semibold leading-snug text-ink-700">
                {f.label}
              </dd>
              <dd className="mt-2 border-t border-ink-900/5 pt-2 text-xs leading-relaxed text-ink-400">
                {f.sourceUrl ? (
                  <a
                    href={f.sourceUrl}
                    className="underline decoration-ink-900/20 underline-offset-2 hover:text-brand-600"
                    rel="noopener nofollow"
                  >
                    {f.source}
                  </a>
                ) : (
                  f.source
                )}
                {f.asOf ? ` · ${/^\d{4}-\d{2}-\d{2}$/.test(f.asOf) ? fmtDate(f.asOf) : f.asOf}` : ""}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ─────────────── 3. Scenario projection ─────────────── */}
      <Block
        id="forecast"
        eyebrow="Four paths, not one number"
        title="USD to INR forecast 2026–2028: four scenarios"
        lede="Nobody knows where the rate lands. What you can do is see how much the answer changes across the plausible range — and notice how little of the decision actually depends on it."
      >
        <div className="mt-4 flex flex-wrap gap-2">
          {FX_SCENARIOS.map((x) => (
            <button
              key={x.key}
              type="button"
              aria-pressed={s.scenario === x.key}
              onClick={() => set("scenario", x.key)}
              className={`min-h-[40px] rounded-full border px-4 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 motion-safe:transition-colors ${
                s.scenario === x.key
                  ? "border-transparent text-white"
                  : "border-ink-900/15 bg-white text-ink-600 hover:bg-slate-50"
              }`}
              style={
                s.scenario === x.key ? { backgroundColor: x.color } : undefined
              }
            >
              {x.label}
            </button>
          ))}
        </div>

        <ScenarioProjectionChart
          spot={spot}
          scenarios={FX_SCENARIOS}
          activeKey={scenario.key}
          waitMonths={val.ok ? input.waitMonths : 12}
        />

        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-600">
          {scenario.blurb}
        </p>

        <h3 className="mt-8 text-lg font-bold tracking-tight text-ink-900">
          USD to INR prediction: what a model can and cannot tell you
        </h3>
        <p className="mt-2 max-w-3xl text-base leading-relaxed text-ink-600">
          A currency projection is not a forecast of a price — it is an
          assumption about a <em>rate of change</em>, compounded. That is why
          this page gives you four of them instead of one confident number. The
          honest version of &ldquo;where will USD/INR be in 2027&rdquo; is a
          range several rupees wide, and anyone quoting you two decimal places
          three years out is selling something.
        </p>

        <h3 className="mt-6 text-lg font-bold tracking-tight text-ink-900">
          USD to INR prediction next week
        </h3>
        <p className="mt-2 max-w-3xl text-base leading-relaxed text-ink-600">
          Skip it. Over a week the rate is essentially a random walk around
          wherever it is now, and the drift that this whole page is built on —
          call it {HISTORICAL_CAGR.toFixed(1)}% a year — works out to under
          0.1% over seven days. That is far smaller than the spread your
          remittance provider charges you. If your transfer is next week, the
          rate is not your problem; your provider&rsquo;s margin is. Our{" "}
          <Link
            href="/calculators/remittance-tcs-cost"
            className="font-semibold text-brand-600 hover:text-brand-700"
          >
            remittance and TCS cost calculator
          </Link>{" "}
          is the tool for that job.
        </p>
      </Block>

      {/* ─────────────── 4. History ─────────────── */}
      <Block
        id="history"
        eyebrow="Two decades of context"
        title="USD to INR history: 20 years of the rupee"
        lede={
          <>
            The rupee has gone from ₹{USD_INR_YEAR_END[0].rate} to ₹
            {FX_USDINR.toFixed(2)} per dollar since {USD_INR_YEAR_END[0].year} —
            an average of {HISTORICAL_CAGR.toFixed(1)}% a year. The striking
            thing is not the slide. It is how uneven it was.
          </>
        }
      >
        <HistoryChart data={USD_INR_YEAR_END} cagrPct={HISTORICAL_CAGR} />

        <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink-600">
          The dashed line is what a steady {HISTORICAL_CAGR.toFixed(1)}% a year
          would have looked like. The real path spent years nowhere near it: the
          rupee <em>gained</em> ground in 2007 and again in 2017, then lost more
          in the single year of 2013 than in the four before it. Someone who
          &ldquo;waited for a better rate&rdquo; in 2017 waited five years and
          ₹19 for it.
        </p>

        <h3 className="mt-8 text-lg font-bold tracking-tight text-ink-900">
          USD to INR chart: 10 years versus 20 years
        </h3>
        <p className="mt-2 max-w-3xl text-base leading-relaxed text-ink-600">
          Which window you pick changes the number you walk away with. Over the
          full 20 years the drift is {HISTORICAL_CAGR.toFixed(1)}% a year. Over
          the last 10 it is closer to{" "}
          {driftCagr(USD_INR_YEAR_END.slice(-11)).toFixed(1)}% — the pace has
          been slowing, not accelerating, as India&rsquo;s services surplus and
          the RBI&rsquo;s reserves have grown. Both numbers are above the{" "}
          {compareTiming(input).breakEvenDrift.toFixed(2)}% you need to justify
          waiting, but not by enough to bet a deadline on.
        </p>

        <p className="mt-4 text-xs text-ink-400">
          Source: {HISTORY_SOURCE}.
        </p>
      </Block>

      {/* ─────────────── 5. Bank forecasts ─────────────── */}
      <Block
        id="bank-forecasts"
        eyebrow={`Updated ${fmtDate(FORECAST_UPDATED)}`}
        title="Rupee forecast: what the banks actually say"
        lede="Published targets from the banks that make a business of this. Note how wide the disagreement is — and that several of them expect the rupee to strengthen, not weaken, from here."
      >
        <BankForecastChart forecasts={BANK_FORECASTS} spot={spot} />

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <caption className="sr-only">
              Published bank forecasts for USD/INR at end-2026, mid-2027 and
              end-2027
            </caption>
            <thead>
              <tr className="border-b border-ink-900/10 text-xs uppercase tracking-wide text-ink-500">
                <th scope="col" className="py-2.5 pr-4 font-semibold">Bank</th>
                <th scope="col" className="py-2.5 pr-4 font-semibold">End 2026</th>
                <th scope="col" className="py-2.5 pr-4 font-semibold">Mid 2027</th>
                <th scope="col" className="py-2.5 pr-4 font-semibold">End 2027</th>
                <th scope="col" className="py-2.5 font-semibold">The call</th>
              </tr>
            </thead>
            <tbody>
              {BANK_FORECASTS.map((f) => (
                <tr key={f.bank} className="border-b border-ink-900/5 align-top last:border-0">
                  <th scope="row" className="py-3 pr-4 font-bold text-ink-900">
                    {f.bank}
                  </th>
                  <td className="py-3 pr-4 tabular-nums text-ink-700">
                    {f.end2026 === null ? "—" : `₹${f.end2026}`}
                  </td>
                  <td className="py-3 pr-4 tabular-nums text-ink-700">
                    {f.mid2027 === null ? "—" : `₹${f.mid2027}`}
                  </td>
                  <td className="py-3 pr-4 tabular-nums text-ink-700">
                    {f.end2027 === null ? "—" : `₹${f.end2027}`}
                  </td>
                  <td className="py-3 text-ink-600">{f.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-600">
          One view sits outside this table&rsquo;s horizon: {WESTPAC_2028.bank},
          the most rupee-positive forecaster in the same survey, sees the pair
          below ₹{WESTPAC_2028.level} by {WESTPAC_2028.horizon} on aggressive
          Fed easing — a {WESTPAC_2028.horizon} call, not a 2027 one.
        </p>

        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-500">
          These figures are attributed to each bank by Exchange Rates UK&rsquo;s
          forecast survey coverage, not read from the banks&rsquo; own research
          notes — every row links to the report it came from in the sources at
          the foot of this page. Bank FX targets are revised constantly; treat
          anything more than a quarter old as history.
        </p>

        <div className="mt-6 rounded-2xl border border-ink-900/10 bg-slate-50 p-5 sm:p-6">
          <h3 className="text-lg font-bold tracking-tight text-ink-900">
            Why you should discount all of it
          </h3>
          <p className="mt-2 text-base leading-relaxed text-ink-600">
            In {FAILED_FORECAST.pollDate}, a Reuters poll of{" "}
            {FAILED_FORECAST.strategists} currency strategists put the rupee at ₹
            {FAILED_FORECAST.predicted} per dollar by {FAILED_FORECAST.predictedFor}.
            It actually traded near ₹{FAILED_FORECAST.actual} — a miss of about{" "}
            {(
              ((FAILED_FORECAST.actual - FAILED_FORECAST.predicted) /
                FAILED_FORECAST.predicted) *
              100
            ).toFixed(1)}
            % in under six months, by the consensus of professionals who do this
            full time. Build a plan that survives being wrong, rather than one
            that needs to be right.
          </p>
        </div>
      </Block>

      {/* ─────────────── 6. Drivers ─────────────── */}
      <Block
        id="why-rupee-falls"
        eyebrow="The mechanism"
        title="Why is the rupee falling?"
        lede="Every headline about the rupee reduces to one thing: whether more people want dollars than rupees on a given day. Five forces do most of the work."
      >
        <RupeeDriversDiagram drivers={RUPEE_DRIVERS} />

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          {RUPEE_DRIVERS.map((d) => (
            <div
              key={d.key}
              className={`rounded-xl border p-4 ${
                d.effect === "weakens"
                  ? "border-rose-200 bg-rose-50/50"
                  : "border-emerald-200 bg-emerald-50/50"
              }`}
            >
              <dt className="flex items-center gap-2 text-sm font-bold text-ink-900">
                {d.label}
                <span
                  className={`rounded-full px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide ${
                    d.effect === "weakens"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {d.effect === "weakens" ? "Rupee down" : "Rupee up"}
                </span>
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-ink-600">
                {d.detail}
              </dd>
            </div>
          ))}
        </dl>

        <h3 className="mt-8 text-lg font-bold tracking-tight text-ink-900">
          Will the rupee fall further?
        </h3>
        <p className="mt-2 max-w-3xl text-base leading-relaxed text-ink-600">
          Over a long enough horizon, most likely yes — India runs higher
          inflation than the US, and over decades that gap shows up in the
          exchange rate. That is the {HISTORICAL_CAGR.toFixed(1)}% a year in the
          chart above, and it is closer to arithmetic than to prophecy. Over the
          next year or two, genuinely nobody knows: several of the banks in the
          table above expect the rupee to <em>recover</em> toward ₹92 through
          2027. The useful question is not whether it falls, but whether it
          falls faster than the {result.breakEvenDrift.toFixed(2)}% a year your
          own numbers require.
        </p>
      </Block>

      {/* ─────────────── 7. NRI playbook ─────────────── */}
      <Block
        id="playbook"
        eyebrow="What to actually do"
        title="The NRI playbook: how to move the money"
        lede="Once you have decided when, these are the things that cost more than the timing does."
      >
        <ol className="mt-5 space-y-4">
          {[
            {
              h: "Fix the spread before you fix the date",
              b: "The gap between your provider's rate and the mid-market rate is typically 0.4–1.5%. On a $20,000 transfer that is $80–$300, taken today, with certainty. Most of the rate-timing arguments people have are smaller than the spread they are ignoring.",
            },
            {
              h: "Use the right account on the India side",
              b: "Money you may want to bring back to the US belongs in an NRE account, which is freely repatriable. An NRO account is not, and unwinding that later is a paperwork problem you can avoid by choosing correctly once.",
            },
            {
              h: "Don't convert what you'll need back in dollars",
              b: "Round-tripping money through the rupee costs you the spread twice plus whatever the rate did in between. If there is a real chance you'll need it in the US within two years, leave it in dollars.",
            },
            {
              h: "Set a rule, not a watchlist",
              b: "A limit order at a target rate with a hard backstop date takes the decision away from your mood. People who check the rate daily do not, on average, get better rates — they get later ones.",
            },
          ].map((step, i) => (
            <li key={step.h} className="flex gap-4">
              <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                {i + 1}
              </span>
              <div>
                <h3 className="text-base font-bold text-ink-900">{step.h}</h3>
                <p className="mt-1 text-base leading-relaxed text-ink-600">{step.b}</p>
              </div>
            </li>
          ))}
        </ol>

        <h3 className="mt-8 text-lg font-bold tracking-tight text-ink-900">
          NRE FD rates and why they change the maths
        </h3>
        <p className="mt-2 max-w-3xl text-base leading-relaxed text-ink-600">
          The single input that moves your answer most is not the exchange rate
          — it is the gap between what your dollars earn and what your rupees
          would. NRE fixed deposits have recently paid meaningfully more than US
          savings accounts, and that difference is exactly what the break-even
          formula prices. Raise the Indian rate in the calculator and waiting
          gets harder to justify; raise the US rate and it gets easier.
        </p>
        <Callout tone="note">
          <strong className="font-bold text-ink-900">
            The tax trap in that number.
          </strong>{" "}
          NRE FD interest is tax-free in India. It is <strong>not</strong>{" "}
          tax-free to you if you are a US tax resident — the IRS taxes your
          worldwide income, so that interest is ordinary income on your US
          return. Enter the after-US-tax rate in the calculator, not the
          headline rate. A 7.25% NRE FD is closer to 5% in the hand for someone
          in the 32% bracket, which moves the break-even by roughly two
          percentage points.
        </Callout>

        <h3 className="mt-8 text-lg font-bold tracking-tight text-ink-900">
          The best time to send money to India
        </h3>
        <p className="mt-2 max-w-3xl text-base leading-relaxed text-ink-600">
          There is no seasonal edge worth trading. What there is: a spread you
          can shop, a provider fee you can compare, a TCS threshold you can plan
          around, and an interest-rate gap you can measure. Those four are
          knowable today. The rate in six months is not. Sort the knowable ones
          and the timing question shrinks to something you can settle in an
          afternoon with{" "}
          <Link
            href="/calculators/remittance-tcs-cost"
            className="font-semibold text-brand-600 hover:text-brand-700"
          >
            the true-cost remittance calculator
          </Link>
          .
        </p>
      </Block>

      {/* ─────────────── 8. Students ─────────────── */}
      <Block
        id="students"
        eyebrow="If the deadline is not yours to move"
        title="Paying tuition in rupees? Read this first"
        lede="Students and parents funding an Indian university place are the clearest case where the calculator's answer should be overruled."
      >
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink-600">
          A fee deadline is not a date you negotiate. If the money must land by
          a fixed day, the variance matters far more than the expected value: a
          3% better rate is pleasant, and a missed semester is not. Convert when
          you have the money and the invoice, not when the chart looks good.
        </p>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink-600">
          Two things worth doing regardless of timing. First, check whether your
          remittance falls under India&rsquo;s TCS rules for education — a
          transfer funded by a qualifying education loan is treated differently
          from one funded out of savings. Second, if you are paying in
          instalments across a year, that is a tranche plan whether you meant it
          or not, and it is already doing most of the averaging-in work this
          page recommends.
        </p>
      </Block>

      {/* ─────────────── 9. Calculator ─────────────── */}
      <section id="calculator" className="mt-10 scroll-mt-24">
        <h2 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
          Should you send money to India now — or wait?
        </h2>
        <p className="mt-2.5 max-w-3xl text-base leading-relaxed text-ink-600">
          Everything below runs in your browser. Nothing you type is stored,
          sent to us, or shared with anyone.
        </p>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          {[
            { key: "send", label: "I have dollars to send" },
            { key: "bill", label: "I owe a fixed rupee amount" },
          ].map((m) => (
            <button
              key={m.key}
              type="button"
              aria-pressed={mode === m.key}
              onClick={() => set("mode", m.key)}
              className={`min-h-[44px] flex-1 rounded-xl border px-4 py-2.5 text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 motion-safe:transition-colors ${
                mode === m.key
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-ink-900/15 bg-white text-ink-700 hover:border-brand-400 hover:bg-brand-50"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="mt-5">
          <CalcGrid
            inputs={
              <>
                {mode === "send" ? (
                  <NumberField
                    label="Amount you want to send"
                    value={s.amount}
                    onChange={(v) => set("amount", v)}
                    prefix="$"
                    min={1}
                    step="500"
                    error={val.errors.amountUsd}
                    hint="The dollars you're deciding what to do with."
                  />
                ) : (
                  <NumberField
                    label="Rupee amount you owe"
                    value={s.bill}
                    onChange={(v) => set("bill", v)}
                    prefix="₹"
                    min={1}
                    step="10000"
                    error={val.errors.billInr}
                    hint="Tuition, an EMI, a property payment — the fixed rupee figure you must hit."
                  />
                )}

                <NumberField
                  label="Today's USD/INR rate"
                  value={s.spot}
                  onChange={(v) => set("spot", v)}
                  prefix="₹"
                  step="0.01"
                  min={1}
                  error={val.errors.spot}
                  hint="Use the rate your provider actually offers, not the mid-market headline."
                />

                <SelectField
                  label="How long would you wait?"
                  value={s.wait}
                  onChange={(v) => set("wait", v)}
                  options={WAIT_OPTIONS}
                />

                <SelectField
                  label="Which way does the rupee go?"
                  value={s.scenario}
                  onChange={(v) => set("scenario", v)}
                  options={FX_SCENARIOS.map((x) => ({
                    value: x.key,
                    label: x.label,
                  }))}
                  hint={scenario.blurb}
                />

                <NumberField
                  label="What your dollars earn in the US"
                  value={s.usRate}
                  onChange={(v) => set("usRate", v)}
                  suffix="% / yr"
                  step="0.25"
                  min={0}
                  error={val.errors.usRate}
                  hint="Your HYSA, T-bill or money-market yield. Zero if it sits in checking."
                />

                {mode === "send" && (
                  <NumberField
                    label="What the rupees would earn in India"
                    value={s.indiaRate}
                    onChange={(v) => set("indiaRate", v)}
                    suffix="% / yr"
                    step="0.25"
                    min={0}
                    error={val.errors.indiaRate}
                    hint="NRE fixed-deposit rate. If you're a US tax resident, enter the rate after US tax — that interest is tax-free in India but taxable to you in the US."
                  />
                )}
              </>
            }
            results={
              !val.ok ? (
                <InvalidInputPanel
                  errors={Object.keys(val.errors).map(
                    (k) => (val.errors as Record<string, string>)[k]
                  )}
                />
              ) : (
                <>
                  <div className={`rounded-2xl border p-6 shadow-card ${verdictTone}`}>
                    <p className="text-[0.6875rem] font-bold uppercase tracking-widest text-ink-500">
                      The verdict
                    </p>
                    <p className="mt-1.5 text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
                      {verdictCopy}
                    </p>

                    {result.verdict === "tossup" ? (
                      <p className="mt-2 text-sm leading-relaxed text-ink-700">
                        Under this scenario the two choices land within half a
                        percent of each other. That is not a signal — it is
                        noise. Pick the one that lets you stop thinking about it.
                      </p>
                    ) : (
                      <p className="mt-2 text-sm leading-relaxed text-ink-700">
                        Waiting {input.waitMonths} months{" "}
                        {result.advantage > 0 ? "gains you" : "costs you"}{" "}
                        <strong className="font-bold">{money(result.advantage)}</strong>{" "}
                        ({Math.abs(result.advantagePct).toFixed(1)}%) versus
                        sending today — if the rupee follows the{" "}
                        &ldquo;{scenario.label}&rdquo; path.
                      </p>
                    )}

                    <dl className="mt-4 grid gap-3 border-t border-ink-900/10 pt-4 sm:grid-cols-2">
                      {mode === "send" ? (
                        <>
                          <div>
                            <dt className="text-xs font-semibold text-ink-500">
                              Send today, in an NRE FD
                            </dt>
                            <dd className="mt-0.5 text-lg font-bold text-ink-900">
                              {inr(result.sendNowInr)}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xs font-semibold text-ink-500">
                              Wait {input.waitMonths} months, then send
                            </dt>
                            <dd className="mt-0.5 text-lg font-bold text-ink-900">
                              {inr(result.waitInr)}
                            </dd>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <dt className="text-xs font-semibold text-ink-500">
                              Cost of paying it today
                            </dt>
                            <dd className="mt-0.5 text-lg font-bold text-ink-900">
                              {usd(result.sendNowUsd)}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xs font-semibold text-ink-500">
                              Cost of paying it in {input.waitMonths} months
                            </dt>
                            <dd className="mt-0.5 text-lg font-bold text-ink-900">
                              {usd(result.waitUsd)}
                            </dd>
                          </div>
                        </>
                      )}
                    </dl>
                  </div>

                  {/* Break-even — the load-bearing number on the page. */}
                  <div className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-ink-700">
                      Your break-even
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-600">
                      {mode === "send" ? (
                        <>
                          Because rupees would earn{" "}
                          {input.indiaRatePct.toFixed(2)}% in India while your
                          dollars earn {input.usRatePct.toFixed(2)}% here, the
                          rupee has to fall by more than{" "}
                          <strong className="font-bold text-ink-900">
                            {result.breakEvenDrift.toFixed(2)}% a year
                          </strong>{" "}
                          before waiting is worth it. Below that, sending today
                          and earning the Indian rate wins.
                        </>
                      ) : (
                        <>
                          You are not giving up any Indian interest — you are
                          paying a bill. So waiting wins unless the rupee{" "}
                          <em>strengthens</em> by more than{" "}
                          <strong className="font-bold text-ink-900">
                            {Math.abs(result.breakEvenDrift).toFixed(2)}% a year
                          </strong>
                          , which is what your dollars earn while you hold them.
                        </>
                      )}
                    </p>
                    <div className="mt-3 grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold text-ink-500">
                          Rate that makes it a tie in {input.waitMonths} months
                        </p>
                        <p className="mt-0.5 text-xl font-extrabold text-ink-900">
                          ₹{result.breakEvenRate.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-ink-500">
                          This scenario projects
                        </p>
                        <p className="mt-0.5 text-xl font-extrabold text-ink-900">
                          ₹{result.rateAtWait.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-ink-500">
                      This is covered interest parity: the horizon cancels out,
                      so the break-even rate of change is the same whether you
                      wait three months or three years.
                    </p>
                  </div>

                  <ResultActions
                    title="Send now or wait? USD/INR"
                    shareText={`At ₹${input.spot.toFixed(2)}, my break-even is ${result.breakEvenDrift.toFixed(2)}%/yr — here's the send-now-or-wait calculator:`}
                    rows={[
                      { label: "Today's rate", value: `₹${input.spot.toFixed(2)}` },
                      { label: "Wait window", value: `${input.waitMonths} months` },
                      { label: "Scenario", value: scenario.label },
                      {
                        label: "Break-even drift",
                        value: `${result.breakEvenDrift.toFixed(2)}% / yr`,
                      },
                      {
                        label: "Verdict",
                        value: verdictCopy,
                      },
                    ]}
                    fileName="usd-inr-send-now-or-wait"
                  />
                </>
              )
            }
          />
        </div>

        {/* Wrong by 2 rupees */}
        {val.ok && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/60 p-5 sm:p-6">
            <h3 className="text-lg font-bold tracking-tight text-ink-900">
              What if the forecast is wrong by 2 rupees?
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
              Two rupees is a small miss by historical standards. Here is what it
              does to your answer.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead>
                  <tr className="border-b border-amber-300/60 text-xs uppercase tracking-wide text-ink-500">
                    <th scope="col" className="py-2 pr-3 font-semibold">If the rate lands at</th>
                    <th scope="col" className="py-2 pr-3 font-semibold">Rate</th>
                    <th scope="col" className="py-2 pr-3 font-semibold">Waiting is worth</th>
                    <th scope="col" className="py-2 font-semibold">Answer</th>
                  </tr>
                </thead>
                <tbody>
                  {swings.map((row) => (
                    <tr key={row.label} className="border-b border-amber-200/60 last:border-0">
                      <td className="py-2.5 pr-3 text-ink-700">{row.label}</td>
                      <td className="py-2.5 pr-3 font-semibold tabular-nums text-ink-900">
                        ₹{row.rate.toFixed(2)}
                      </td>
                      <td
                        className={`py-2.5 pr-3 font-semibold tabular-nums ${
                          row.advantage >= 0 ? "text-emerald-700" : "text-rose-700"
                        }`}
                      >
                        {row.advantage >= 0 ? "+" : "−"}
                        {money(row.advantage)}
                      </td>
                      <td className="py-2.5 font-semibold text-ink-900">
                        {row.verdict === "wait"
                          ? "Wait"
                          : row.verdict === "send"
                            ? "Send now"
                            : "Coin flip"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              If a two-rupee miss flips your answer, the forecast was never the
              thing holding the decision up. Size and timing were.
            </p>
          </div>
        )}

        {/* Split it */}
        {val.ok && (
          <div className="mt-6 rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card sm:p-6">
            <h3 className="text-lg font-bold tracking-tight text-ink-900">
              Or split it, and stop guessing
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
              Averaging in gives up the best possible rate in exchange for never
              getting the worst one. Under the &ldquo;{scenario.label}&rdquo;
              path, here is the blended rate each plan lands:
            </p>
            {/* Without this, the send-today figure here reads as contradicting
                the verdict above — that one compounds an Indian deposit rate,
                this one is the raw conversion. */}
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink-400">
              Blended rate at conversion, before any interest
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {(
                [
                  { key: "now", label: "Send it all today" },
                  { key: "half", label: "50% now, 50% in 3 months" },
                  { key: "thirds", label: "Three tranches over 4 months" },
                ] as { key: keyof typeof SPLIT_PLANS; label: string }[]
              ).map((p) => {
                const rate = blendedRate(input.spot, scenario.driftPct, SPLIT_PLANS[p.key]);
                const on = plan === p.key;
                return (
                  <button
                    key={p.key}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setPlan(p.key)}
                    className={`rounded-xl border p-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 motion-safe:transition-colors ${
                      on
                        ? "border-brand-600 bg-brand-50"
                        : "border-ink-900/10 bg-white hover:border-brand-300"
                    }`}
                  >
                    <p className="text-sm font-semibold text-ink-700">{p.label}</p>
                    <p className="mt-1.5 text-2xl font-extrabold tracking-tight text-ink-900">
                      ₹{rate.toFixed(2)}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-500">
                      blended rate
                      {mode === "send" && (
                        <> · {inr(input.amountUsd * rate)}</>
                      )}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* ─────────────── 10. Decision tree ─────────────── */}
      <Block
        id="decision-tree"
        eyebrow="Decide in four questions"
        title="Your send-now-or-wait decision tree"
        lede="The calculator tells you which choice has the better expected value. This tells you which choice you can live with — they are not always the same answer."
      >
        <div className="mt-5">
          <DecisionTree
            spot={spot}
            bandLow={BAND_LOW}
            bandHigh={BAND_HIGH}
            onApply={applyOutcome}
          />
        </div>
      </Block>

      {/* ─────────────── 11. What waiting costs ─────────────── */}
      <Block
        id="waiting-cost"
        eyebrow="Your numbers, every scenario"
        title="What waiting actually costs you"
        lede={
          mode === "send"
            ? `For the ${usd(input.amountUsd)} you entered — rupees gained or lost by waiting, at four horizons, under all four scenarios.`
            : `For the ${inr(input.billInr)} bill you entered — dollars saved or wasted by waiting, at four horizons, under all four scenarios.`
        }
      >
        {val.ok ? (
          <>
            <WaitingCostChart
              grid={grid}
              scenarios={FX_SCENARIOS}
              activeKey={scenario.key}
              currency={currency}
            />
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink-600">
              The bars fan out as the horizon lengthens — which is the real
              lesson. Over three months, every scenario clusters near zero: the
              decision barely matters. Over twenty-four, the gap between the
              best and worst case is large enough to care about, but you have
              also had two years for something nobody modelled to happen.
            </p>
          </>
        ) : (
          <p className="mt-4 text-sm text-ink-500">
            Fix the highlighted inputs above to see this chart.
          </p>
        )}
      </Block>

      {/* ─────────────── 12. How to cite ─────────────── */}
      <section id="how-to-cite" className="mt-14 scroll-mt-24 sm:mt-16">
        <p className="text-[0.6875rem] font-bold uppercase tracking-widest text-brand-600">
          For journalists and researchers
        </p>
        <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
          How to cite this page
        </h2>
        <p className="mt-2.5 max-w-3xl text-base leading-relaxed text-ink-600">
          You are welcome to quote these figures and reproduce the charts with
          attribution. Please cite the page rather than the underlying data
          alone — the drift and break-even calculations are ours, and the dates
          matter.
        </p>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
            <h3 className="text-sm font-bold uppercase tracking-wide text-ink-700">
              Suggested citation
            </h3>
            <p className="mt-3 rounded-xl bg-slate-50 p-4 font-mono text-xs leading-relaxed text-ink-700">
              {author.byline}. &ldquo;USD to INR Forecast 2026&ndash;2028: Dollar
              to Rupee Forecast.&rdquo; {site.name}, {site.owner}. Published{" "}
              {fmtDate(PUBLISHED)}; updated {fmtDate(FORECAST_UPDATED)}.{" "}
              {CANONICAL_URL}
            </p>
          </div>

          <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
            <h3 className="text-sm font-bold uppercase tracking-wide text-ink-700">
              Page details
            </h3>
            <dl className="mt-3 space-y-2 text-sm">
              {[
                ["Author", author.byline],
                ["Publisher", `${site.name} (${site.owner})`],
                ["Published", fmtDate(PUBLISHED)],
                ["Last updated", fmtDate(FORECAST_UPDATED)],
                ["Spot rate quoted", `₹${FX_USDINR.toFixed(2)}, ${fmtDate(FX_USDINR_AS_OF)}`],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-3">
                  <dt className="w-32 flex-none font-semibold text-ink-500">{k}</dt>
                  <dd className="min-w-0 text-ink-800">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs leading-relaxed text-ink-500">
              Press enquiries and interview requests:{" "}
              <Link href="/press" className="font-semibold text-brand-600 hover:text-brand-700">
                press page
              </Link>{" "}
              ·{" "}
              <Link href={author.url} className="font-semibold text-brand-600 hover:text-brand-700">
                author profile
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-5 text-sm leading-relaxed text-ink-700">
          <strong className="font-bold text-ink-900">
            Two things before you quote us.
          </strong>{" "}
          The spot rate on this page is entered by hand on the date shown, not
          pulled from a live feed, so confirm the current rate before printing
          it. And the bank targets are figures attributed to those banks by
          Exchange Rates UK&rsquo;s survey coverage, not read from the
          banks&rsquo; own research notes — each row links to the report it came
          from.
        </div>
      </section>

      {/* ─────────────── 13. Sources ─────────────── */}
      <div className="mx-auto mt-8 max-w-[720px] rounded-2xl border border-ink-900/10 bg-slate-50/70 p-5 text-sm">
        <h2 className="text-xs font-bold uppercase tracking-widest text-ink-500">
          Sources
        </h2>
        <ul className="mt-3 space-y-2 text-ink-600">
          <li>
            Historical rates:{" "}
            <a
              href={HISTORY_SOURCE_URL}
              className="font-semibold text-brand-600 underline hover:text-brand-700"
              rel="noopener"
            >
              Federal Reserve H.10 / FRED series DEXINUS
            </a>
          </li>
          {BANK_FORECASTS.map((f) => (
            <li key={f.bank}>
              {f.bank} forecast, via{" "}
              <a
                href={f.sourceUrl}
                className="font-semibold text-brand-600 underline hover:text-brand-700"
                rel="noopener nofollow"
              >
                {f.source}
              </a>{" "}
              ({fmtDate(f.reportedOn)})
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-ink-500">
          Exchange rate of ₹{FX_USDINR.toFixed(2)} entered manually on{" "}
          {fmtDate(FX_USDINR_AS_OF)}. This page has no live market feed — always
          confirm the current rate with your provider before transferring.
          Nothing here is financial, tax or investment advice.
        </p>
      </div>
    </div>
  );
}
