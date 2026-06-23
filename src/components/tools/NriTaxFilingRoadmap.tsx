"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ResultCard, { type ResultTone } from "@/components/tools/ResultCard";
import { trackToolResultView, trackToolUsed } from "@/lib/analytics";
import {
  buildRoadmap,
  EMPTY_ANSWERS,
  hasEnoughAnswers,
  QUESTIONS,
  ROADMAP_PATH,
  type QuestionId,
  type RoadmapAnswers,
  type SectionTone,
} from "@/lib/nriTaxRoadmap";

/* Privacy by design: every answer below lives only in React state in the
   user's browser. There is no backend call, no storage, and analytics only
   ever receives a coarse "result shown" label — never the answers. */

const TONE: Record<SectionTone, ResultTone> = {
  review: "caution",
  consider: "info",
  low: "positive",
};

const OPTION_BASE =
  "flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors";
const OPTION_ON = "border-brand-500 bg-brand-50 text-brand-700";
const OPTION_OFF =
  "border-ink-900/10 bg-white text-ink-600 hover:border-ink-900/20";

export default function NriTaxFilingRoadmap() {
  const [answers, setAnswers] = useState<RoadmapAnswers>(EMPTY_ANSWERS);
  const ready = hasEnoughAnswers(answers);
  const sections = useMemo(() => buildRoadmap(answers), [answers]);

  const setSingle = (id: QuestionId, value: string) =>
    setAnswers((prev) => ({ ...prev, [id]: value }));

  const toggleMulti = (id: QuestionId, value: string) =>
    setAnswers((prev) => {
      const cur = prev[id] as string[];
      // "none" / "not-sure" are mutually exclusive with specific income types.
      if (value === "none" || value === "not-sure") {
        return { ...prev, [id]: cur.includes(value) ? [] : [value] };
      }
      const without = cur.filter((v) => v !== "none" && v !== "not-sure");
      return {
        ...prev,
        [id]: without.includes(value)
          ? without.filter((v) => v !== value)
          : [...without, value],
      };
    });

  // Track only that a roadmap was shown, debounced — never the answers.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!ready) return;
    const t = setTimeout(() => {
      trackToolUsed({
        tool_name: "nri_tax_filing_roadmap",
        result_type: "roadmap_shown",
        category: "money",
        page_slug: ROADMAP_PATH,
      });
      trackToolResultView({
        tool_slug: "nri-tax-filing-roadmap",
        route: ROADMAP_PATH,
        result_status: "shown",
      });
    }, 1500);
    return () => clearTimeout(t);
  }, [ready]);

  const reset = () => setAnswers(EMPTY_ANSWERS);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start">
      {/* Questions */}
      <div className="min-w-0 space-y-4">
        {QUESTIONS.map((q, i) => (
          <fieldset
            key={q.id}
            className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card"
          >
            <legend className="px-1">
              <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-brand-600">
                Question {i + 1} of {QUESTIONS.length}
              </span>
            </legend>
            <p className="mt-1 text-sm font-semibold text-ink-900">
              {q.question}
            </p>
            {q.help && (
              <p className="mt-1 text-xs leading-relaxed text-ink-400">
                {q.help}
              </p>
            )}
            <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {q.options.map((o) => {
                const selected =
                  q.type === "multi"
                    ? (answers[q.id] as string[]).includes(o.value)
                    : answers[q.id] === o.value;
                return (
                  <label
                    key={o.value}
                    className={`${OPTION_BASE} ${
                      selected ? OPTION_ON : OPTION_OFF
                    }`}
                  >
                    <input
                      type={q.type === "multi" ? "checkbox" : "radio"}
                      name={q.id}
                      checked={selected}
                      onChange={() =>
                        q.type === "multi"
                          ? toggleMulti(q.id, o.value)
                          : setSingle(q.id, o.value)
                      }
                      className="h-4 w-4 border-ink-900/20 text-brand-600 focus:ring-brand-500/30"
                    />
                    {o.label}
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}

        <p className="border-t border-ink-900/5 pt-3 text-xs leading-relaxed text-ink-400">
          🔒 Everything stays in your browser. No account numbers, SSN, PAN,
          Aadhaar, passport numbers, or property addresses — this is an
          educational checklist only.
        </p>
      </div>

      {/* Roadmap */}
      <div className="min-w-0 space-y-4">
        {!ready ? (
          <div className="rounded-2xl border border-dashed border-ink-900/15 bg-slate-50/60 p-8 text-center">
            <p className="text-base font-semibold text-ink-700">
              Your filing roadmap appears here
            </p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-ink-500">
              Answer a few questions on the left and we&apos;ll map which U.S.
              and India reviews, documents, and NRItoUSA tools may apply — soft,
              educational guidance only.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold tracking-tight text-ink-900">
                Your filing roadmap
              </h2>
              <button
                type="button"
                onClick={reset}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                Reset
              </button>
            </div>

            {sections.map((s) => (
              <ResultCard
                key={s.id}
                tone={TONE[s.tone]}
                eyebrow={s.eyebrow}
                title={s.title}
                badge={s.badge}
              >
                <p>{s.summary}</p>
                <ul className="space-y-2">
                  {s.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span aria-hidden className="mt-0.5 text-brand-600">
                        ☐
                      </span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2 border-t border-ink-900/5 pt-3">
                  {s.ctas.map((c) =>
                    c.external ? (
                      <a
                        key={c.href + c.label}
                        href={c.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={
                          c.primary
                            ? "rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                            : "rounded-xl border border-ink-900/10 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:border-ink-900/20"
                        }
                      >
                        {c.label}
                      </a>
                    ) : (
                      <Link
                        key={c.href + c.label}
                        href={c.href}
                        className={
                          c.primary
                            ? "rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                            : "rounded-xl border border-ink-900/10 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:border-ink-900/20"
                        }
                      >
                        {c.label}
                      </Link>
                    )
                  )}
                </div>
              </ResultCard>
            ))}

            <p className="text-xs leading-relaxed text-ink-400">
              <strong className="font-semibold text-ink-500">
                Educational only — not tax advice.
              </strong>{" "}
              This roadmap maps which reviews and documents <em>may</em> apply so
              you can prepare. It does not determine your filing obligations,
              prepare or file any form, or compute any tax. Verify current-year
              rules with the IRS, FinCEN, the Income Tax Department of India, and
              a qualified CPA/CA.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
