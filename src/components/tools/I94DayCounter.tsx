"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import InputCard, { Field, fieldClass } from "@/components/tools/InputCard";
import ResultCard from "@/components/tools/ResultCard";
import {
  countI94Days,
  parseTravelHistory,
  SPT_THRESHOLD,
  SPT_MIN_CURRENT_YEAR,
  type TripSegment,
} from "@/lib/calc/i94DayCount";

/**
 * I-94 travel-history day counter.
 *
 * Browser-only. Nothing stored, nothing sent — a decade of someone's travel
 * dates is exactly the kind of thing that should not leave the page.
 *
 * Two input modes because people arrive with the data in two shapes: a pasted
 * CBP travel history (rows of crossings) or their own memory of trips (pairs).
 * Lines the parser cannot read are REPORTED rather than dropped — a day counter
 * that silently ignores half its input is worse than one that refuses.
 */

const TODAY = "2026-10-13";

type Mode = "rows" | "paste";

interface Row {
  id: number;
  arrival: string;
  departure: string;
}

let nextId = 1;
const blankRow = (): Row => ({ id: nextId++, arrival: "", departure: "" });

export default function I94DayCounter() {
  const [mode, setMode] = useState<Mode>("rows");
  const [rows, setRows] = useState<Row[]>([blankRow(), blankRow(), blankRow()]);
  const [pasted, setPasted] = useState("");
  const [taxYear, setTaxYear] = useState("2026");

  const parsed = useMemo(() => parseTravelHistory(pasted), [pasted]);

  const segments: TripSegment[] = useMemo(() => {
    if (mode === "paste") return parsed.segments;
    return rows
      .filter((r) => r.arrival || r.departure)
      .map((r) => ({
        arrival: r.arrival || undefined,
        departure: r.departure || undefined,
      }));
  }, [mode, rows, parsed.segments]);

  const result = useMemo(
    () =>
      countI94Days(segments, {
        asOf: TODAY,
        taxYear: Number(taxYear) || 2026,
      }),
    [segments, taxYear],
  );

  const setRow = (id: number, key: "arrival" | "departure", value: string) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [key]: value } : r)));

  const maxDays = Math.max(
    1,
    ...result.byYear.map((y) => y.days),
  );

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid gap-5 lg:grid-cols-[1fr_1.05fr]">
        <InputCard eyebrow="Nothing leaves your browser" title="Your trips">
          <p className="-mt-2 text-xs leading-relaxed text-ink-500">
            Enter arrival and departure dates, or paste your CBP travel history
            straight in. Nothing is stored or sent. Before you rely on the
            answer, read what the travel history leaves out — ten years only,
            most land crossings missing, and not an official record.
          </p>

          <div className="flex gap-1.5 rounded-xl bg-ink-900/5 p-1">
            {([
              { v: "rows" as Mode, label: "Enter trips" },
              { v: "paste" as Mode, label: "Paste history" },
            ]).map((t) => (
              <button
                key={t.v}
                type="button"
                onClick={() => setMode(t.v)}
                aria-pressed={mode === t.v}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  mode === t.v
                    ? "bg-white text-ink-900 shadow-sm"
                    : "text-ink-500 hover:text-ink-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {mode === "rows" ? (
            <div className="space-y-2.5">
              <div className="hidden grid-cols-2 gap-2 text-[0.7rem] font-bold uppercase tracking-wide text-ink-400 sm:grid">
                <span>Arrived in the US</span>
                <span>Departed the US</span>
              </div>
              {rows.map((r) => (
                <div key={r.id} className="grid gap-2 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-[0.7rem] font-semibold text-ink-500 sm:hidden">
                      Arrived
                    </span>
                    <input
                      type="date"
                      className={fieldClass}
                      value={r.arrival}
                      max={TODAY}
                      onChange={(e) => setRow(r.id, "arrival", e.target.value)}
                    />
                  </label>
                  <label className="block">
                    <span className="text-[0.7rem] font-semibold text-ink-500 sm:hidden">
                      Departed
                    </span>
                    <input
                      type="date"
                      className={fieldClass}
                      value={r.departure}
                      max={TODAY}
                      onChange={(e) => setRow(r.id, "departure", e.target.value)}
                    />
                  </label>
                </div>
              ))}
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setRows((rs) => [...rs, blankRow()])}
                  className="rounded-lg border border-ink-900/10 px-3 py-2 text-xs font-semibold text-brand-600 hover:border-brand-300"
                >
                  + Add a trip
                </button>
                {rows.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setRows((rs) => rs.slice(0, -1))}
                    className="text-xs font-semibold text-ink-400 underline hover:text-ink-600"
                  >
                    Remove the last row
                  </button>
                )}
              </div>
              <p className="text-[0.7rem] leading-relaxed text-ink-400">
                Leave the departure blank on your current stay — it will be
                counted through today.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              <Field
                label="Paste the rows from View Travel History"
                help="One crossing per line, with a date and the word Arrival or Departure. Formats like 2026-01-05, 5 Jan 2026 and 01/05/2026 all work."
              >
                <textarea
                  className={`${fieldClass} min-h-[180px] font-mono text-xs`}
                  value={pasted}
                  onChange={(e) => setPasted(e.target.value)}
                  placeholder={"2026-01-05  Arrival   JFK\n2026-02-10  Departure  JFK\n2026-05-01  Arrival   SFO"}
                  spellCheck={false}
                />
              </Field>
              {pasted.trim().length > 0 && (
                <div className="rounded-xl border border-ink-900/10 bg-ink-900/[0.02] px-3.5 py-3 text-xs">
                  <p className="font-semibold text-ink-700">
                    Read {parsed.segments.length} stay
                    {parsed.segments.length === 1 ? "" : "s"}
                    {parsed.skipped.length > 0
                      ? `, skipped ${parsed.skipped.length} line${parsed.skipped.length === 1 ? "" : "s"}`
                      : ""}
                    .
                  </p>
                  {parsed.skipped.length > 0 && (
                    <>
                      <p className="mt-1.5 text-ink-500">
                        These lines had no readable date, or did not say whether
                        they were an arrival or a departure. Check none of them
                        is a real crossing:
                      </p>
                      <ul className="mt-1.5 max-h-28 overflow-y-auto font-mono text-[0.68rem] text-ink-400">
                        {parsed.skipped.slice(0, 12).map((l, i) => (
                          <li key={i}>{l.slice(0, 70)}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          <Field
            label="Tax year for the substantial presence estimate"
            help="The test looks at this year plus the two before it."
          >
            <select
              className={fieldClass}
              value={taxYear}
              onChange={(e) => setTaxYear(e.target.value)}
            >
              {[2026, 2025, 2024, 2023].map((y) => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
            </select>
          </Field>
        </InputCard>

        <div className="space-y-5">
          {!result.valid ? (
            <ResultCard tone="neutral" eyebrow="Waiting" title="Add some dates">
              <p>{result.error ?? "Enter at least one arrival or departure."}</p>
            </ResultCard>
          ) : (
            <>
              <ResultCard
                tone="info"
                eyebrow="Days present in the US"
                title={`${result.totalDays.toLocaleString("en-US")} days across ${result.byYear.length} calendar year${result.byYear.length === 1 ? "" : "s"}`}
              >
                <div className="space-y-1.5">
                  {result.byYear.map((y) => (
                    <div key={y.year} className="flex items-center gap-2.5">
                      <span className="w-11 shrink-0 text-xs font-bold text-ink-700">
                        {y.year}
                      </span>
                      <span className="h-5 flex-1 overflow-hidden rounded bg-ink-900/5">
                        <span
                          className="flex h-full items-center justify-end rounded bg-brand-500 pr-1.5 text-[0.65rem] font-bold text-white"
                          style={{ width: `${Math.max(8, (y.days / maxDays) * 100)}%` }}
                        >
                          {y.days}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs">
                  Both the arrival day and the departure day count as days of
                  presence, which is the IRS convention.
                </p>
              </ResultCard>

              {result.spt && (
                <ResultCard
                  tone={result.spt.meetsOnDaysAlone ? "caution" : "neutral"}
                  eyebrow={`Substantial presence test, ${result.spt.taxYear}`}
                  title={`${Math.floor(result.spt.weightedDays)} weighted days against ${SPT_THRESHOLD}`}
                  badge={result.spt.meetsOnDaysAlone ? "Met on days" : "Not met on days"}
                >
                  <table className="w-full text-xs">
                    <caption className="sr-only">
                      The weighted day count behind the substantial presence
                      estimate
                    </caption>
                    <tbody>
                      <tr className="border-b border-ink-900/5">
                        <td className="py-1.5">{result.spt.taxYear}</td>
                        <td className="py-1.5 text-right">{result.spt.currentYearDays} days</td>
                        <td className="py-1.5 pl-3 text-ink-400">&times; 1</td>
                        <td className="py-1.5 text-right font-semibold">
                          {result.spt.currentYearDays}
                        </td>
                      </tr>
                      <tr className="border-b border-ink-900/5">
                        <td className="py-1.5">{result.spt.taxYear - 1}</td>
                        <td className="py-1.5 text-right">{result.spt.priorYearDays} days</td>
                        <td className="py-1.5 pl-3 text-ink-400">&times; 1/3</td>
                        <td className="py-1.5 text-right font-semibold">
                          {(result.spt.priorYearDays / 3).toFixed(1)}
                        </td>
                      </tr>
                      <tr className="border-b border-ink-900/5">
                        <td className="py-1.5">{result.spt.taxYear - 2}</td>
                        <td className="py-1.5 text-right">{result.spt.secondPriorYearDays} days</td>
                        <td className="py-1.5 pl-3 text-ink-400">&times; 1/6</td>
                        <td className="py-1.5 text-right font-semibold">
                          {(result.spt.secondPriorYearDays / 6).toFixed(1)}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold text-ink-900" colSpan={3}>
                          Weighted total
                        </td>
                        <td className="py-1.5 text-right font-bold text-ink-900">
                          {result.spt.weightedDays.toFixed(1)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="mt-2.5">{result.spt.verdict}</p>
                  <p className="mt-2 text-xs">
                    Both conditions are required: at least{" "}
                    {SPT_MIN_CURRENT_YEAR} days in the tax year itself{" "}
                    <strong>{result.spt.meets31Day ? "— met" : "— not met"}</strong>, and
                    at least {SPT_THRESHOLD} weighted days{" "}
                    <strong>{result.spt.meets183Day ? "— met" : "— not met"}</strong>.
                  </p>
                  <p className="mt-2 text-xs">
                    Exempt-individual years for F and J holders, the
                    closer-connection exception and the India&ndash;US treaty all
                    change this answer and none of them is a day count. The{" "}
                    <Link href="/articles/substantial-presence-test-explained" className="text-brand-600 underline">
                      substantial presence test guide
                    </Link>{" "}
                    covers the mechanics, and the{" "}
                    <Link href="/education/f1-tax-calculator" className="text-brand-600 underline">
                      F-1 tax calculator
                    </Link>{" "}
                    models the exempt years.
                  </p>
                </ResultCard>
              )}

              <ResultCard
                tone={
                  result.absenceFlags.some((f) => f.level === "breaks")
                    ? "attention"
                    : result.absenceFlags.length > 0
                      ? "caution"
                      : "positive"
                }
                eyebrow="Continuous residence for naturalisation"
                title={
                  result.absenceFlags.length === 0
                    ? "No single absence reaches six months"
                    : `${result.absenceFlags.length} absence${result.absenceFlags.length === 1 ? "" : "s"} over six months`
                }
              >
                {result.absenceFlags.length === 0 ? (
                  <p>
                    On these dates no continuous absence crosses the six-month
                    line in 8 CFR 316.5(c)(1). Most land-border crossings are
                    missing from a CBP travel history, so an unrecorded
                    departure can hide an absence — or invent one.
                  </p>
                ) : (
                  <ul className="space-y-2.5">
                    {result.absenceFlags.map((f) => (
                      <li
                        key={f.from}
                        className={`rounded-lg border p-3 text-xs ${
                          f.level === "breaks"
                            ? "border-rose-200 bg-rose-50/60"
                            : "border-amber-200 bg-amber-50/60"
                        }`}
                      >
                        <p className="font-bold text-ink-900">{f.label}</p>
                        <p className="mt-0.5 text-ink-500">
                          Departed {f.from}, returned {f.to}
                        </p>
                        <p className="mt-1.5 text-ink-600">
                          {f.level === "breaks"
                            ? "One year or more breaks continuous residence under 8 CFR 316.5(c)(1)(ii). A five-year applicant may file four years and one day after returning to resume permanent residence."
                            : "Between six months and one year disrupts continuous residence unless you establish otherwise to USCIS. The regulation names the evidence: continuing US employment, family who stayed, retained access to a US home, and no employment taken abroad."}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-3 text-xs">
                  An absence is measured as time <strong>abroad</strong> —
                  departure to the next arrival — which is the opposite
                  measurement from presence above. What the thresholds mean, and
                  the N-470 route past them, are on{" "}
                  <Link href="/green-card/travel-rules" className="text-brand-600 underline">
                    green card travel rules
                  </Link>
                  , and the naturalisation checklist is at{" "}
                  <Link href="/tools/citizenship-checklist" className="text-brand-600 underline">
                    the citizenship checklist
                  </Link>
                  .
                </p>
              </ResultCard>

              <ResultCard tone="neutral" eyebrow="How this was counted" title="Conventions and limits">
                <ul className="list-disc space-y-1.5 pl-5">
                  {result.notes.map((n) => (
                    <li key={n.slice(0, 40)}>{n}</li>
                  ))}
                  <li>
                    A CBP travel history goes back ten years only, omits most
                    land-border crossings, and is expressly not an official
                    record for legal purposes. Reconcile it against your passport
                    stamps before you rely on a count.
                  </li>
                </ul>
              </ResultCard>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
