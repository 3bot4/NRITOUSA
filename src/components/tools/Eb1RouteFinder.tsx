"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import InputCard from "@/components/tools/InputCard";
import ResultCard from "@/components/tools/ResultCard";
import {
  ROUTE_QUESTIONS,
  ROUTES,
  ROUTE_BY_ID,
  type RouteId,
} from "@/data/eb1NiwData";

/**
 * "Which route fits me?" questionnaire.
 *
 * Scores each of the four routes: a "yes" adds support, and a "no" on a
 * question the route REQUIRES rules it out entirely. Ruling out is the more
 * useful half — someone with no permanent academic offer should be told EB-1B
 * is closed to them, not shown it ranked fourth.
 *
 * Runs in the browser; nothing stored or sent. It is a screening aid, not an
 * assessment — every one of these routes turns on an evidentiary record that
 * no questionnaire can weigh.
 */

type Answer = "yes" | "no" | "unsure";

interface Scored {
  id: RouteId;
  score: number;
  ruledOut: boolean;
  missing: string[];
}

export default function Eb1RouteFinder() {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});

  const answered = Object.keys(answers).length;

  const scored: Scored[] = useMemo(() => {
    const out = ROUTES.map<Scored>((r) => ({
      id: r.id,
      score: 0,
      ruledOut: false,
      missing: [],
    }));
    const byId: Record<string, Scored> = {};
    for (const s of out) byId[s.id] = s;

    for (const q of ROUTE_QUESTIONS) {
      const a = answers[q.id];
      if (!a) continue;
      if (a === "yes") {
        for (const id of q.supports) byId[id].score += 1;
      } else if (a === "no" && q.requiredFor) {
        for (const id of q.requiredFor) {
          byId[id].ruledOut = true;
          byId[id].missing.push(q.question);
        }
      }
    }
    return out;
  }, [answers]);

  const viable = scored
    .filter((s) => !s.ruledOut)
    .sort((a, b) => b.score - a.score);
  const ruledOut = scored.filter((s) => s.ruledOut);

  const set = (id: string, value: Answer) =>
    setAnswers((a) => ({ ...a, [id]: value }));

  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid gap-5 lg:grid-cols-2">
        <InputCard eyebrow="Seven questions" title="Which route fits your situation?">
          <p className="-mt-2 text-xs leading-relaxed text-ink-500">
            Answer honestly rather than optimistically. A &ldquo;no&rdquo; on
            something a route requires closes that route, and knowing which doors
            are shut is more useful than a ranking of all four.
          </p>
          {ROUTE_QUESTIONS.map((q) => (
            <fieldset key={q.id} className="rounded-xl border border-ink-900/10 px-3.5 py-3">
              <legend className="px-1 text-xs font-semibold text-ink-800">
                {q.question}
              </legend>
              <p className="mt-1 text-xs leading-relaxed text-ink-500">{q.help}</p>
              <div className="mt-2 flex gap-2">
                {(["yes", "no", "unsure"] as Answer[]).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => set(q.id, v)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold capitalize transition ${
                      answers[q.id] === v
                        ? "border-brand-500 bg-brand-50 text-brand-700"
                        : "border-ink-900/10 bg-white text-ink-600 hover:border-brand-300"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </fieldset>
          ))}
        </InputCard>

        <div className="space-y-5">
          {answered === 0 ? (
            <ResultCard
              tone="neutral"
              eyebrow="Your routes"
              title="Answer the questions to narrow it down"
            >
              <p>
                All four routes skip PERM. What separates them is whether you can
                file for yourself, whether an employer has to offer you a job,
                and what kind of record you can evidence.
              </p>
            </ResultCard>
          ) : (
            <>
              {viable.length > 0 && (
                <ResultCard
                  tone="positive"
                  eyebrow="Worth exploring"
                  title={
                    viable[0].score > 0
                      ? `${ROUTE_BY_ID[viable[0].id].short} looks like the closest fit`
                      : `${viable.length} route${viable.length === 1 ? "" : "s"} not ruled out`
                  }
                  badge={`${answered} of ${ROUTE_QUESTIONS.length} answered`}
                >
                  <ol className="space-y-3">
                    {viable.map((s, i) => {
                      const r = ROUTE_BY_ID[s.id];
                      return (
                        <li
                          key={s.id}
                          className={`rounded-xl border px-4 py-3 ${
                            i === 0 && s.score > 0
                              ? "border-emerald-300 bg-emerald-50/60"
                              : "border-ink-900/5 bg-white"
                          }`}
                        >
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <p className="text-sm font-bold text-ink-900">
                              {r.short} — {r.label}
                            </p>
                            <span className="rounded-full bg-ink-900/5 px-2.5 py-0.5 text-[0.7rem] font-semibold text-ink-600">
                              {r.preference}
                            </span>
                          </div>
                          <p className="mt-1.5 text-xs leading-relaxed text-ink-600">
                            <strong className="text-ink-800">The test:</strong>{" "}
                            {r.test}
                          </p>
                          <p className="mt-1.5 text-xs leading-relaxed text-ink-600">
                            <strong className="text-ink-800">Where it gets hard:</strong>{" "}
                            {r.hard}
                          </p>
                          <p className="mt-1.5 text-[0.7rem] text-ink-400">{r.cite}</p>
                        </li>
                      );
                    })}
                  </ol>
                </ResultCard>
              )}

              {ruledOut.length > 0 && (
                <ResultCard
                  tone="caution"
                  eyebrow="Closed on your answers"
                  title={`${ruledOut.length} route${ruledOut.length === 1 ? " is" : "s are"} not available to you as things stand`}
                >
                  <ul className="space-y-2.5">
                    {ruledOut.map((s) => {
                      const r = ROUTE_BY_ID[s.id];
                      return (
                        <li key={s.id} className="rounded-xl bg-white px-4 py-3">
                          <p className="text-sm font-bold text-ink-900">
                            {r.short} — {r.label}
                          </p>
                          <p className="mt-1 text-xs text-ink-600">
                            Because you answered no to:{" "}
                            {s.missing.map((m) => `"${m}"`).join("; ")}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                  <p className="text-xs">
                    &ldquo;As things stand&rdquo; is doing real work in that
                    sentence. Several of these are answers that can change —
                    a permanent research offer can be negotiated, a year of
                    managerial experience can be accrued, a publication record
                    can be built. A route that is closed this year is not
                    necessarily closed.
                  </p>
                </ResultCard>
              )}

              <p className="text-xs leading-relaxed text-ink-400">
                A screening aid, not an assessment and not legal advice. Every one
                of these routes is decided on an evidentiary record that no
                questionnaire can weigh — and the difference between a strong and
                a weak EB-1A on the same facts is largely how the record is
                assembled.{" "}
                <Link href="/immigration-attorney-lawyer-cost" className="text-brand-600 underline">
                  What an immigration attorney costs
                </Link>{" "}
                is worth reading before you decide to self-file.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
