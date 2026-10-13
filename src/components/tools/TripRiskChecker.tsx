"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import InputCard, { Field, fieldClass } from "@/components/tools/InputCard";
import ResultCard from "@/components/tools/ResultCard";
import { assessTripRisk, type TripRiskInput } from "@/lib/calc/gcTripRisk";
import { FIND_A_LAWYER, LAWYER_TIMING } from "@/data/greenCardTravelData";

/**
 * Trip risk checker for a green card holder.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE CRIMINAL-HISTORY INPUT IS A YES/NO AND NOTHING MORE.
 *
 * No detail is collected, no free text, nothing is stored and nothing is
 * transmitted — there is no fetch in this file. The only thing a "yes" does is
 * raise the tier and tell the reader to speak to a lawyer before booking, which
 * is the honest output: whether an old offence matters turns on how it maps onto
 * INA 212(a)(2), and that is not a question a screen can answer or a user can
 * answer about themselves from how it was handled in state court.
 *
 * Do not add a field asking what the offence was.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const TODAY = "2026-10-13";

const TONE_MAP = {
  routine: "positive",
  attention: "caution",
  serious: "caution",
  critical: "attention",
} as const;

export default function TripRiskChecker() {
  const [form, setForm] = useState<TripRiskInput>({
    departure: "",
    plannedReturn: "",
    hasReentryPermit: false,
    priorLongTrips: false,
    pendingApplication: "none",
    anyCriminalHistory: false,
    cardValidThroughReturn: true,
  });

  const result = useMemo(() => assessTripRisk(form), [form]);
  const started = form.departure !== "" && form.plannedReturn !== "";

  const set = <K extends keyof TripRiskInput>(key: K, value: TripRiskInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid gap-5 lg:grid-cols-2">
        <InputCard eyebrow="Nothing stored, nothing sent" title="The trip you are planning">
          <p className="-mt-2 text-xs leading-relaxed text-ink-500">
            Seven questions. The useful output is not a score — it is which of
            the three regimes your trip touches, because they have different
            thresholds and the one everyone forgets is the naturalisation clock.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Departure from the US">
              <input
                type="date"
                className={fieldClass}
                value={form.departure}
                onChange={(e) => set("departure", e.target.value)}
              />
            </Field>
            <Field label="Planned return">
              <input
                type="date"
                className={fieldClass}
                value={form.plannedReturn}
                min={form.departure || undefined}
                onChange={(e) => set("plannedReturn", e.target.value)}
              />
            </Field>
          </div>

          <Field
            label="Any application pending?"
            help="A pending I-485 changes the rules completely — you are not yet a permanent resident."
          >
            <select
              className={fieldClass}
              value={form.pendingApplication}
              onChange={(e) =>
                set("pendingApplication", e.target.value as TripRiskInput["pendingApplication"])
              }
            >
              <option value="none">None</option>
              <option value="i-485">I-485 — adjustment of status</option>
              <option value="i-751">I-751 — removing conditions</option>
              <option value="n-400">N-400 — naturalisation</option>
            </select>
          </Field>

          <div className="space-y-2.5 rounded-xl border border-ink-900/10 bg-ink-900/[0.02] p-3.5">
            {([
              {
                key: "cardValidThroughReturn" as const,
                label: "My green card is valid through my return date",
                help: "An expired card is not the entry document 8 CFR 211.1(a)(2) describes, and it is not something to fix from abroad.",
                invert: false,
              },
              {
                key: "hasReentryPermit" as const,
                label: "I hold a valid reentry permit (Form I-327)",
                help: "Only relevant for an absence of a year or more. It must be filed from inside the US.",
                invert: false,
              },
              {
                key: "priorLongTrips" as const,
                label: "I have taken other trips over six months before",
                help: "Abandonment is an intent question drawn from the facts of your life, and a pattern is part of those facts.",
                invert: false,
              },
            ]).map((c) => (
              <label key={c.key} className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={form[c.key]}
                  onChange={(e) => set(c.key, e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-brand-600"
                />
                <span className="text-xs leading-relaxed text-ink-700">
                  <strong className="text-ink-900">{c.label}</strong>
                  <span className="mt-0.5 block text-ink-500">{c.help}</span>
                </span>
              </label>
            ))}
          </div>

          <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3.5">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={form.anyCriminalHistory}
                onChange={(e) => set("anyCriminalHistory", e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-rose-600"
              />
              <span className="text-xs leading-relaxed text-ink-700">
                <strong className="text-ink-900">
                  I have an arrest or criminal charge in my history — anywhere, at
                  any time
                </strong>
                <span className="mt-0.5 block text-ink-500">
                  Yes or no only. We do not ask what it was and there is nowhere
                  to type it. INA 101(a)(13)(C)(v) has no time limit, and whether
                  an offence matters turns on how it maps onto INA 212(a)(2) —
                  which is not the same as how it was disposed of in court.
                </span>
              </span>
            </label>
          </div>
        </InputCard>

        <div className="space-y-5">
          {!started ? (
            <ResultCard tone="neutral" eyebrow="Waiting" title="Enter your dates">
              <p>
                By default a returning permanent resident is not an applicant for
                admission at all. Whether that stays true for your trip is what
                this check works out.
              </p>
            </ResultCard>
          ) : !result.valid ? (
            <ResultCard tone="caution" eyebrow="Check the dates" title="Those dates do not work">
              <p>{result.error}</p>
            </ResultCard>
          ) : (
            <>
              <ResultCard
                tone={TONE_MAP[result.tier]}
                eyebrow="Overall"
                title={result.headline}
                badge={
                  result.tier === "routine"
                    ? "Routine"
                    : result.tier === "attention"
                      ? "Prepare"
                      : result.tier === "serious"
                        ? "Get advice"
                        : "Do not book yet"
                }
              >
                <p>{result.seekingAdmission.text}</p>
                {result.seekingAdmission.reasons.length > 0 && (
                  <ul className="mt-2.5 space-y-1.5 text-xs">
                    {result.seekingAdmission.reasons.map((r) => (
                      <li key={r.slice(0, 30)} className="flex gap-2">
                        <span aria-hidden className="text-rose-500">
                          ▸
                        </span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </ResultCard>

              <ResultCard
                tone={result.entryDocument.ok ? "positive" : "attention"}
                eyebrow="Regime 1 — your entry document"
                title={result.entryDocument.ok ? "Covered" : "Not covered"}
              >
                <p>{result.entryDocument.text}</p>
              </ResultCard>

              <ResultCard
                tone={
                  result.continuousResidence.level === "intact"
                    ? "positive"
                    : result.continuousResidence.level === "rebuttable"
                      ? "caution"
                      : "attention"
                }
                eyebrow="Regime 2 — continuous residence for naturalisation"
                title={
                  result.continuousResidence.level === "intact"
                    ? "Intact"
                    : result.continuousResidence.level === "rebuttable"
                      ? "Disrupted unless you rebut it"
                      : "Broken"
                }
              >
                <p>{result.continuousResidence.text}</p>
              </ResultCard>

              <ResultCard tone="info" eyebrow="Carry these" title="Documents for this trip">
                <ul className="space-y-1.5">
                  {result.documents.map((d) => (
                    <li key={d} className="flex gap-2">
                      <span aria-hidden className="text-sky-600">
                        ✓
                      </span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2.5 text-xs">
                  Keep them in hand luggage, not checked baggage.
                </p>
              </ResultCard>

              <ResultCard tone="neutral" eyebrow="Before you go" title="What to do">
                <ul className="list-disc space-y-2 pl-5">
                  {result.actions.map((a) => (
                    <li key={a.slice(0, 40)}>{a}</li>
                  ))}
                </ul>
              </ResultCard>

              {result.lawyerBeforeBooking && (
                <ResultCard
                  tone="attention"
                  eyebrow="Before you book"
                  title="Speak to an immigration lawyer first"
                  badge="Not optional"
                >
                  <p>{result.lawyerReason}</p>
                  <p className="mt-2.5">{LAWYER_TIMING}</p>
                  <ul className="mt-3 space-y-2">
                    {FIND_A_LAWYER.map((l) => (
                      <li key={l.href}>
                        <a
                          href={l.href}
                          target="_blank"
                          rel="nofollow noopener"
                          className="text-xs font-semibold text-brand-600 underline"
                        >
                          {l.label}
                        </a>
                        <span className="block text-[0.7rem] text-ink-400">{l.note}</span>
                      </li>
                    ))}
                  </ul>
                </ResultCard>
              )}

              <ResultCard tone="neutral" eyebrow="This is a screen" title="What it cannot tell you">
                <p>
                  This check reads dates and three yes/no answers. It cannot
                  weigh the facts of your life, which is what an abandonment
                  question actually turns on, and it cannot assess a criminal
                  record against INA 212(a)(2). Nothing here is legal advice, and
                  a &ldquo;routine&rdquo; result is not a prediction about what
                  will happen at any particular inspection.
                </p>
                <p className="mt-2.5 text-xs">
                  If the trip is part of a permanent move,{" "}
                  <Link href="/return-to-india" className="text-brand-600 underline">
                    the return-to-India guide
                  </Link>{" "}
                  covers keeping the card versus ending it and the exit-tax
                  consequences. For an H-1B family member travelling with you,{" "}
                  <Link href="/h1b/travel-to-india" className="text-brand-600 underline">
                    H-1B travel to India
                  </Link>{" "}
                  has the separate rules that apply to them.
                </p>
              </ResultCard>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
