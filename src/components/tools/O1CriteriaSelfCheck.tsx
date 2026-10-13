"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import InputCard from "@/components/tools/InputCard";
import ResultCard from "@/components/tools/ResultCard";
import { O1A_CRITERIA, O1A_MAJOR_AWARD, O1A_COMPARABLE_EVIDENCE } from "@/data/o1VisaData";
import {
  scoreO1Criteria,
  O1A_REQUIRED,
  O1A_TOTAL,
  type CriterionAnswer,
} from "@/lib/calc/o1Criteria";

/**
 * O-1A criteria self-check.
 *
 * Runs in the browser. Nothing is stored, nothing is sent — there is no network
 * call in this component and no persistence, deliberately: the inputs are a
 * description of someone's professional record and there is no reason for them
 * to leave the page.
 *
 * The three answer states matter. "Partial" is counted separately and never
 * toward the three the regulation requires, because the failure mode of a
 * self-assessment tool is optimism and a criterion you can describe but not
 * evidence is worth nothing in a petition. See src/lib/calc/o1Criteria.ts.
 */

const ANSWERS: { value: CriterionAnswer; label: string; help: string }[] = [
  { value: "have", label: "Documented", help: "I could put documents in front of an officer today" },
  { value: "partial", label: "Partly", help: "Something is there, but it is not documented or not strong yet" },
  { value: "none", label: "No", help: "Nothing" },
];

export default function O1CriteriaSelfCheck() {
  const [answers, setAnswers] = useState<Record<string, CriterionAnswer>>({});
  const [majorAward, setMajorAward] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  const result = useMemo(
    () => scoreO1Criteria({ answers, majorAward }),
    [answers, majorAward],
  );

  const set = (id: string, value: CriterionAnswer) =>
    setAnswers((a) => ({ ...a, [id]: value }));

  const reset = () => {
    setAnswers({});
    setMajorAward(false);
  };

  const answeredCount = Object.keys(answers).length;

  const tone =
    result.tone === "threshold"
      ? "positive"
      : result.tone === "close"
        ? "info"
        : result.tone === "award"
          ? "caution"
          : "neutral";

  return (
    <div className="mx-auto max-w-5xl">
      {/* min-w-0: a `1fr` track is minmax(auto,1fr), so a long unbroken
          string in a result card widens it past a 390px viewport. */}
      <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr] [&>*]:min-w-0">
        <InputCard
          eyebrow={`${O1A_TOTAL} criteria · 8 CFR 214.2(o)(3)(iii)(B)`}
          title="Which of these can you evidence?"
        >
          <p className="-mt-2 text-xs leading-relaxed text-ink-500">
            Answer on documents, not on self-description. The regulation needs{" "}
            <strong>{O1A_REQUIRED} of {O1A_TOTAL}</strong> — and &ldquo;partly&rdquo;
            counts toward none of them, because a criterion you can describe but
            not evidence is worth nothing in a petition. Nothing you enter here
            is stored or sent anywhere.
          </p>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/60 px-3.5 py-3">
            <input
              type="checkbox"
              checked={majorAward}
              onChange={(e) => setMajorAward(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-amber-600"
            />
            <span className="text-xs leading-relaxed text-ink-700">
              <strong className="text-ink-900">
                I hold a major, internationally recognised award
              </strong>
              <span className="mt-0.5 block text-ink-500">
                {O1A_MAJOR_AWARD.text} — {O1A_MAJOR_AWARD.cite}. This replaces the
                list entirely rather than counting as one of the three.
              </span>
            </span>
          </label>

          <div className="space-y-2.5">
            {O1A_CRITERIA.map((c) => {
              const current = answers[c.id];
              const isOpen = open === c.id;
              return (
                <fieldset
                  key={c.id}
                  className="rounded-xl border border-ink-900/10 px-3.5 py-3"
                >
                  <legend className="flex items-baseline gap-2 px-1">
                    <span className="text-[0.7rem] font-bold text-brand-600">
                      {c.ref}
                    </span>
                    <span className="text-xs font-semibold text-ink-800">
                      {c.plain}
                    </span>
                  </legend>

                  <div className="mt-2 flex gap-1.5">
                    {ANSWERS.map((a) => (
                      <button
                        key={a.value}
                        type="button"
                        onClick={() => set(c.id, a.value)}
                        aria-pressed={current === a.value}
                        title={a.help}
                        className={`flex-1 rounded-lg border px-2 py-2 text-xs font-semibold transition ${
                          current === a.value
                            ? a.value === "have"
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                              : a.value === "partial"
                                ? "border-amber-500 bg-amber-50 text-amber-700"
                                : "border-ink-400 bg-ink-900/5 text-ink-600"
                            : "border-ink-900/10 bg-white text-ink-600 hover:border-brand-300"
                        }`}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : c.id)}
                    className="mt-2 text-[0.7rem] font-semibold text-brand-600 hover:text-brand-700"
                    aria-expanded={isOpen}
                  >
                    {isOpen ? "Hide" : "What the regulation says, and what counts"}
                  </button>

                  {isOpen && (
                    <div className="mt-2 space-y-2 rounded-lg bg-ink-900/[0.03] p-3">
                      <p className="text-[0.7rem] italic leading-relaxed text-ink-600">
                        &ldquo;{c.text}&rdquo;
                      </p>
                      <p className="text-[0.7rem] leading-relaxed text-ink-600">
                        <strong className="text-ink-800">In an Indian career: </strong>
                        {c.indiaExample}
                      </p>
                    </div>
                  )}
                </fieldset>
              );
            })}
          </div>

          {answeredCount > 0 && (
            <button
              type="button"
              onClick={reset}
              className="text-xs font-semibold text-ink-400 underline hover:text-ink-600"
            >
              Clear all answers
            </button>
          )}
        </InputCard>

        <div className="space-y-5">
          <ResultCard
            tone={tone}
            eyebrow="Where you stand"
            title={result.headline}
            badge={
              result.majorAwardRoute
                ? "Award route"
                : `${result.met} of ${O1A_TOTAL}`
            }
          >
            <p>{result.verdict}</p>

            {!result.majorAwardRoute && (
              <div className="mt-3 flex items-end gap-1.5" aria-hidden>
                {O1A_CRITERIA.map((c, i) => {
                  const a = answers[c.id] ?? "none";
                  return (
                    <span
                      key={c.id}
                      className={`h-9 flex-1 rounded ${
                        a === "have"
                          ? "bg-emerald-500"
                          : a === "partial"
                            ? "bg-amber-300"
                            : "bg-ink-900/10"
                      }`}
                      style={{ height: a === "have" ? 36 : a === "partial" ? 22 : 10 }}
                      title={`${c.ref} ${a}`}
                    />
                  );
                })}
              </div>
            )}
            {!result.majorAwardRoute && (
              <p className="mt-1.5 text-[0.7rem] text-ink-400">
                Tall bars are documented criteria. Short amber bars count toward
                nothing until they are documented.
              </p>
            )}
          </ResultCard>

          {result.closest.length > 0 && (
            <ResultCard
              tone="caution"
              eyebrow="Closest gaps"
              title={`${result.closest.length} partial claim${result.closest.length === 1 ? "" : "s"} to document`}
            >
              <ul className="space-y-2">
                {result.closest.map((c) => (
                  <li key={c.id} className="flex gap-2">
                    <span className="text-[0.7rem] font-bold text-amber-600">
                      {c.ref}
                    </span>
                    <span>{c.plain}</span>
                  </li>
                ))}
              </ul>
            </ResultCard>
          )}

          {result.buildable.length > 0 && (
            <ResultCard
              tone="info"
              eyebrow="Reachable deliberately"
              title="Criteria people in ordinary roles can build"
            >
              <ul className="space-y-2">
                {result.buildable.map((c) => (
                  <li key={c.id} className="flex gap-2">
                    <span className="text-[0.7rem] font-bold text-sky-600">
                      {c.ref}
                    </span>
                    <span>{c.plain}</span>
                  </li>
                ))}
              </ul>
            </ResultCard>
          )}

          <ResultCard tone="neutral" eyebrow="What this check cannot do" title="Next steps">
            <ul className="list-disc space-y-1.5 pl-5">
              {result.nextSteps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <p className="mt-3 border-t border-ink-900/5 pt-3 text-xs">
              If a listed criterion does not fit your occupation at all, the
              comparable-evidence route in{" "}
              <strong>{O1A_COMPARABLE_EVIDENCE.cite}</strong> exists for exactly
              that — see the section on it below. For the green card routes an
              O-1 record often also supports, compare{" "}
              <Link href="/green-card/eb1a-vs-eb1b-vs-eb1c-vs-niw" className="text-brand-600 underline">
                EB-1A, EB-1B, EB-1C and NIW
              </Link>
              .
            </p>
          </ResultCard>
        </div>
      </div>
    </div>
  );
}
