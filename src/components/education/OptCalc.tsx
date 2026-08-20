"use client";

import { useMemo, useState } from "react";
import InputCard, { Field, fieldClass } from "@/components/tools/InputCard";
import {
  buildIcs,
  buildOptTimeline,
  type OptPhase,
} from "@/lib/calc/optTimeline";
import {
  optDenialRules,
  optRules,
  unlawfulPresence,
} from "@/data/studentClusterData";

/**
 * OPT timeline + unemployment counter.
 *
 * The unemployment meter is the reason this tool exists: it applies the
 * aggregate 150-day cap rather than the widespread and wrong "STEM resets you
 * to 150" model. See lib/calc/optTimeline.ts.
 *
 * The .ics export writes real calendar entries for each deadline, which is
 * the thing students actually need — these dates are unforgiving and easy to
 * lose track of across a two-to-three year window.
 */

const LEVEL_STYLE: Record<
  string,
  { bar: string; text: string; ring: string; label: string }
> = {
  ok: {
    bar: "bg-emerald-500",
    text: "text-emerald-700",
    ring: "border-emerald-200 bg-emerald-50/50",
    label: "Comfortable",
  },
  caution: {
    bar: "bg-amber-500",
    text: "text-amber-800",
    ring: "border-amber-200 bg-amber-50/50",
    label: "Watch it",
  },
  warning: {
    bar: "bg-orange-500",
    text: "text-orange-800",
    ring: "border-orange-200 bg-orange-50/50",
    label: "Act now",
  },
  critical: {
    bar: "bg-rose-500",
    text: "text-rose-700",
    ring: "border-rose-200 bg-rose-50/50",
    label: "Critical",
  },
  exceeded: {
    bar: "bg-rose-700",
    text: "text-rose-800",
    ring: "border-rose-300 bg-rose-50",
    label: "Over the limit",
  },
};

const KIND_ICON: Record<string, string> = {
  window: "🟢",
  deadline: "🚨",
  start: "▶️",
  end: "⏹️",
  grace: "🕓",
};

export default function OptCalc() {
  const [programEndDate, setProgramEndDate] = useState("2026-05-15");
  const [phase, setPhase] = useState<OptPhase>("not-applied");
  const [optStartDate, setOptStartDate] = useState("");
  // Defaults to false deliberately. Defaulting to true showed every visitor a
  // STEM timeline and a 150-day cap they may have no claim to.
  const [stemEligible, setStemEligible] = useState(false);
  const [stemApproved, setStemApproved] = useState(false);
  const [unemploymentDaysUsed, setUnemploymentDaysUsed] = useState(0);

  const result = useMemo(
    () =>
      buildOptTimeline({
        programEndDate,
        phase,
        optStartDate: optStartDate || undefined,
        stemEligible,
        stemApproved,
        unemploymentDaysUsed,
      }),
    [
      programEndDate,
      phase,
      optStartDate,
      stemEligible,
      stemApproved,
      unemploymentDaysUsed,
    ]
  );

  const u = result.unemployment;
  const style = LEVEL_STYLE[u.level];

  const downloadIcs = () => {
    const ics = buildIcs(result.milestones, { calendarName: "My OPT deadlines" });
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "opt-deadlines.ics";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <InputCard eyebrow="Your dates" title="Where are you in the OPT process?">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Program end date"
            help="The completion date printed on your I-20 — not your graduation ceremony."
          >
            <input
              type="date"
              className={fieldClass}
              value={programEndDate}
              onChange={(e) => setProgramEndDate(e.target.value)}
            />
          </Field>
          <Field label="Your current stage">
            <select
              className={fieldClass}
              value={phase}
              onChange={(e) => setPhase(e.target.value as OptPhase)}
            >
              <option value="not-applied">Have not applied yet</option>
              <option value="pending">Application pending with USCIS</option>
              <option value="on-opt">On post-completion OPT</option>
              <option value="on-stem">On the STEM extension</option>
            </select>
          </Field>

          {(phase === "on-opt" || phase === "on-stem") && (
            <Field
              label="OPT start date"
              help="The 'Card Valid From' date on your EAD."
            >
              <input
                type="date"
                className={fieldClass}
                value={optStartDate}
                onChange={(e) => setOptStartDate(e.target.value)}
              />
            </Field>
          )}

          <Field
            label={`Unemployment days used so far: ${unemploymentDaysUsed}`}
            help={
              stemApproved
                ? "Total days with no qualifying employment across post-completion OPT AND the STEM extension combined — not just the days since STEM began."
                : "Days since your OPT start date with no qualifying employment. Weekends and holidays count; the counter runs on calendar days."
            }
          >
            <input
              type="range"
              min={0}
              max={optRules.aggregateUnemploymentDaysWithStem}
              step={1}
              value={unemploymentDaysUsed}
              onChange={(e) => setUnemploymentDaysUsed(Number(e.target.value))}
              className="w-full accent-brand-600"
            />
          </Field>
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-700">
            <input
              type="checkbox"
              checked={stemEligible}
              onChange={(e) => setStemEligible(e.target.checked)}
              className="h-4 w-4 accent-brand-600"
            />
            My degree&apos;s CIP code is on the DHS STEM list
          </label>
          {stemEligible && (
            <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-700">
              <input
                type="checkbox"
                checked={stemApproved}
                onChange={(e) => setStemApproved(e.target.checked)}
                className="h-4 w-4 accent-brand-600"
              />
              STEM extension already approved
            </label>
          )}
        </div>

        {stemEligible && (
          <p className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-xs leading-relaxed text-amber-900">
            <strong>A STEM-listed degree is necessary but not sufficient.</strong>{" "}
            The extension also requires an employer enrolled in E-Verify, a
            completed Form I-983 training plan signed by you and your employer,
            a paid role of at least {optRules.stemMinWeeklyHours} hours a week,
            and a degree from an accredited, SEVP-certified school. Check your
            CIP code against the current DHS STEM list with your DSO — the list
            changes, and eligibility turns on the code on your I-20 rather than
            on what the program is called.
          </p>
        )}

        <button
          type="button"
          onClick={() => {
            setProgramEndDate("2026-05-15");
            setPhase("not-applied");
            setOptStartDate("");
            setStemEligible(false);
            setStemApproved(false);
            setUnemploymentDaysUsed(0);
          }}
          className="text-xs font-semibold text-ink-400 underline transition-colors hover:text-ink-700"
        >
          Reset all fields
        </button>
      </InputCard>

      {/* ─────────────────── Unemployment meter ─────────────────── */}
      <div className={`rounded-2xl border p-5 shadow-card sm:p-6 ${style.ring}`}>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
            Unemployment counter
          </p>
          <span
            className={`rounded-full bg-white px-2.5 py-0.5 text-xs font-bold ${style.text}`}
          >
            {style.label}
          </span>
        </div>

        <p className={`mt-2 text-2xl font-extrabold tracking-tight ${style.text}`}>
          {u.headline}
        </p>

        <div
          className="mt-3 h-3 w-full overflow-hidden rounded-full bg-white"
          role="meter"
          aria-valuenow={u.used}
          aria-valuemin={0}
          aria-valuemax={u.cap}
          aria-label="Unemployment days used"
        >
          <div
            className={`h-full rounded-full transition-all ${style.bar}`}
            style={{ width: `${Math.min(100, u.percentUsed)}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[0.625rem] font-semibold text-ink-400">
          <span>0</span>
          <span>{optRules.initialUnemploymentDays} (initial OPT cap)</span>
          {u.cap > optRules.initialUnemploymentDays && (
            <span>{u.cap} (with STEM)</span>
          )}
        </div>

        <p className="mt-3 text-sm leading-relaxed text-ink-700">{u.detail}</p>

        <div className="mt-4 rounded-xl bg-white/70 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-400">
            What stops the counter
          </p>
          <ul className="mt-1.5 space-y-1 text-xs leading-relaxed text-ink-600">
            <li>
              • Paid work of at least {optRules.initialMinWeeklyHours} hours a
              week, related to your field of study
            </li>
            <li>
              • Multiple part-time jobs that add up to{" "}
              {optRules.initialMinWeeklyHours}+ hours a week
            </li>
            <li>• A documented unpaid internship or volunteer role in your field</li>
            <li>• Self-employment, with the right business documentation</li>
            <li>
              • Reporting it in the SEVP Portal — days accrue constantly simply
              because qualifying work was never reported
            </li>
          </ul>
        </div>
      </div>

      {/* ─────────────────── Warnings ─────────────────── */}
      {result.warnings.length > 0 && (
        <div className="space-y-2">
          {result.warnings.map((w) => (
            <p
              key={w}
              className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-sm leading-relaxed text-amber-900"
            >
              {w}
            </p>
          ))}
        </div>
      )}

      {/* ─────────────────── Timeline ─────────────────── */}
      {result.milestones.length > 0 && (
        <div className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-bold tracking-tight text-ink-900">
              Your OPT dates
            </h3>
            <button
              type="button"
              onClick={downloadIcs}
              className="rounded-xl bg-brand-600 px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-brand-700"
            >
              📅 Add all to calendar (.ics)
            </button>
          </div>

          <ol className="mt-5 space-y-4">
            {result.milestones.map((m) => (
              <li key={m.id} className="flex gap-3">
                <span aria-hidden className="flex-none text-lg leading-none">
                  {KIND_ICON[m.kind]}
                </span>
                <div className="min-w-0 flex-1 border-b border-ink-900/5 pb-4 last:border-0">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <p className="text-sm font-bold text-ink-900">{m.label}</p>
                    {m.critical && (
                      <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-rose-700">
                        Cannot be missed
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 font-mono text-sm font-semibold text-brand-600">
                    {m.date}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-500">
                    {m.meaning}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* ─────────────────── Grace period ─────────────────── */}
      <div
        id="grace-period"
        className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card sm:p-6"
      >
        <h3 className="text-lg font-bold tracking-tight text-ink-900">
          The 60-day grace period — every case
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          The grace period is for departure and transition. You cannot work
          during it, and it is not available in every situation — which is the
          part that catches people out.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-ink-900/10 bg-ink-50/60">
                <th className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-ink-500">
                  What happened
                </th>
                <th className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-ink-500">
                  Grace period
                </th>
                <th className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-ink-500">
                  Counted from
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "Completed your program, no OPT",
                  `${optRules.gracePeriodDays} days`,
                  "Program end date on the I-20",
                ],
                [
                  "OPT ended normally",
                  `${optRules.gracePeriodDays} days`,
                  "EAD end date",
                ],
                [
                  "STEM OPT ended normally",
                  `${optRules.gracePeriodDays} days`,
                  "STEM EAD end date",
                ],
                [
                  "Post-completion OPT denied",
                  `${optRules.gracePeriodDays} days`,
                  "Program end date OR the denial date — whichever is LATER",
                ],
                [
                  "…but denied for failing to maintain status",
                  "None",
                  "USCIS expects immediate departure",
                ],
                [
                  "STEM extension denied after the OPT EAD expired",
                  `${optRules.gracePeriodDays} days`,
                  "The denial date",
                ],
                [
                  "You withdrew or dropped below full-time without authorisation",
                  "None",
                  "You are out of status immediately",
                ],
                [
                  "SEVIS record terminated for a status violation",
                  "None",
                  "Status ends at once; unlawful presence usually needs a formal finding first",
                ],
              ].map((r) => (
                <tr key={r[0]} className="border-b border-ink-900/5 last:border-0">
                  <td className="px-3 py-2.5 font-semibold text-ink-900">{r[0]}</td>
                  <td
                    className={`whitespace-nowrap px-3 py-2.5 font-bold ${
                      r[1] === "None" ? "text-rose-700" : "text-emerald-700"
                    }`}
                  >
                    {r[1]}
                  </td>
                  <td className="px-3 py-2.5 text-ink-600">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-ink-400">
          <strong className="text-ink-600">On a denial:</strong>{" "}
          {optDenialRules.postCompletion} {optDenialRules.postCompletionException}{" "}
          {optDenialRules.stemExtension} {optDenialRules.caveat}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-ink-400">
          These {optRules.gracePeriodDays}-day figures are for a student
          admitted for duration of status. A DHS final rule effective September
          15, 2026 replaces that with a dated admission plus{" "}
          {optRules.gracePeriodDaysUnderFixedAdmission} days; students already
          admitted for D/S generally keep{" "}
          {optRules.gracePeriodDays} days until they travel abroad and re-enter.
          The rule is being challenged in court. Check your latest I-94.
        </p>
        <p className="mt-2 text-xs leading-relaxed text-ink-400">
          {unlawfulPresence.whyItMatters}{" "}
          {unlawfulPresence.currentRule}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-ink-400">
          If your record was terminated, the grace period generally does not
          apply — see the{" "}
          <a
            href="/education/sevis-termination-guide"
            className="font-semibold text-brand-600 underline"
          >
            SEVIS termination guide
          </a>{" "}
          for what to do instead.
        </p>
      </div>
    </div>
  );
}
