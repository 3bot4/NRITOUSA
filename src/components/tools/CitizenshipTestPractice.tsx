"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CIVICS,
  QUESTIONS,
  drawTest,
  listCategories,
  makeRng,
  questionsInCategory,
  scoreByCategory,
  scoreTest,
  specFor,
  type CivicsQuestion,
  type Grade,
  type ScoredAnswer,
} from "@/lib/citizenshipTest";
import { CategoryScoreChart } from "@/components/tools/citizenship/charts";

/**
 * Practice test for the 2025-version USCIS civics test.
 *
 * The real test is ORAL: an officer asks, you answer out loud, the officer
 * decides. There is no multiple choice. So this tool is self-graded — you say
 * the answer, reveal the official one, and mark yourself. Multiple-choice
 * practice would be easier and would teach the wrong skill, because
 * recognising an answer in a list is not the thing being tested.
 *
 * Everything runs in the browser. Nothing is stored, nothing is sent; reload
 * and the session is gone.
 */

type Mode = "mock" | "senior" | "category" | "review";

const MODE_LABELS: { id: Mode; label: string; blurb: string }[] = [
  {
    id: "mock",
    label: "Timed mock test",
    blurb: `${CIVICS.format.questionsAsked} questions drawn from all ${CIVICS.format.poolSize}, in the official format.`,
  },
  {
    id: "senior",
    label: "65/20 set",
    blurb: `${CIVICS.format.senior.questionsAsked} from the ${CIVICS.format.senior.poolSize} starred questions. ${CIVICS.format.senior.eligibility}.`,
  },
  {
    id: "category",
    label: "Study by topic",
    blurb: "Work through one topic at a time, no timer, no scoring pressure.",
  },
  {
    id: "review",
    label: "Review my wrong answers",
    blurb: "Only the questions you missed this session.",
  },
];

function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function CitizenshipTestPractice() {
  const categories = useMemo(listCategories, []);

  const [mode, setMode] = useState<Mode>("mock");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [timed, setTimed] = useState(true);

  const [queue, setQueue] = useState<CivicsQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<ScoredAnswer[]>([]);
  const [missed, setMissed] = useState<CivicsQuestion[]>([]);
  const [started, setStarted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);

  const spec = specFor(mode === "senior" ? "senior" : "standard");
  const isQuiz = mode === "mock" || mode === "senior" || mode === "review";

  /* Timer — only while a timed quiz is actually in progress. */
  useEffect(() => {
    if (!started || !timed || !isQuiz || finishedAt !== null) return;
    const id = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => window.clearInterval(id);
  }, [started, timed, isQuiz, finishedAt]);

  const begin = useCallback(() => {
    const rng = makeRng(Date.now() % 2_147_483_647);
    let next: CivicsQuestion[];
    if (mode === "category") next = questionsInCategory(categoryId);
    else if (mode === "review") next = drawTest("standard", rng, missed);
    else next = drawTest(mode === "senior" ? "senior" : "standard", rng);

    setQueue(next);
    setIndex(0);
    setRevealed(false);
    setAnswers([]);
    setElapsed(0);
    setFinishedAt(null);
    setStarted(true);
  }, [mode, categoryId, missed]);

  const current = queue[index];

  const grade = (g: Grade) => {
    if (!current) return;
    const nextAnswers = [...answers, { n: current.n, grade: g }];
    setAnswers(nextAnswers);
    if (g === "incorrect") {
      setMissed((m) => (m.some((q) => q.n === current.n) ? m : [...m, current]));
    }

    // The real test stops early: 12 correct or 9 incorrect ends it.
    const correct = nextAnswers.filter((a) => a.grade === "correct").length;
    const incorrect = nextAnswers.filter((a) => a.grade === "incorrect").length;
    const decided =
      isQuiz && (correct >= spec.toPass || incorrect >= spec.toFail);

    if (decided || index + 1 >= queue.length) {
      setFinishedAt(Date.now());
      setRevealed(false);
      return;
    }
    setIndex(index + 1);
    setRevealed(false);
  };

  const score = scoreTest(answers, spec);
  const byCategory = scoreByCategory(answers, queue);
  const done = finishedAt !== null;

  /* ── Setup screen ─────────────────────────────────────────────── */
  if (!started) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card sm:p-7">
        <h3 className="text-lg font-bold text-ink-900">Choose how you want to practise</h3>
        <p className="mt-1 text-sm leading-relaxed text-ink-500">
          The real test is spoken, not multiple choice — an officer asks, you
          answer out loud. So this one is self-graded: say your answer, reveal
          the official one, mark yourself honestly. That is the skill being
          tested.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {MODE_LABELS.map((m) => {
            const disabled = m.id === "review" && missed.length === 0;
            const active = mode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                disabled={disabled}
                onClick={() => setMode(m.id)}
                className={`rounded-xl border p-4 text-left transition ${
                  active
                    ? "border-brand-500 bg-brand-50/60 ring-2 ring-brand-500/20"
                    : "border-ink-900/10 bg-white hover:border-brand-300"
                } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
              >
                <span className="block text-sm font-bold text-ink-900">{m.label}</span>
                <span className="mt-1 block text-xs leading-relaxed text-ink-500">
                  {disabled
                    ? "Nothing missed yet — take a test first."
                    : m.blurb}
                </span>
              </button>
            );
          })}
        </div>

        {mode === "category" && (
          <label className="mt-5 block">
            <span className="text-xs font-semibold text-ink-800">Which topic?</span>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-base text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 sm:text-sm"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.section} — {c.label} ({c.count} questions)
                </option>
              ))}
            </select>
          </label>
        )}

        {isQuiz && (
          <label className="mt-4 flex items-center gap-3 rounded-xl border border-ink-900/10 px-3.5 py-3">
            <input
              type="checkbox"
              checked={timed}
              onChange={(e) => setTimed(e.target.checked)}
              className="h-4 w-4 rounded border-ink-900/20 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-xs leading-relaxed text-ink-700">
              Show a timer. The civics test itself is not timed — this is just to
              stop you deliberating for a minute on each answer, which you will
              not do in the room.
            </span>
          </label>
        )}

        <button
          type="button"
          onClick={begin}
          className="mt-5 w-full rounded-xl bg-brand-600 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Start
        </button>

        <p className="mt-3 text-xs leading-relaxed text-ink-400">
          {CIVICS.format.stopRule}
        </p>
      </div>
    );
  }

  /* ── Results screen ───────────────────────────────────────────── */
  if (done) {
    const passed = score.passed;
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <div
          className={`rounded-2xl border p-6 shadow-card sm:p-7 ${
            passed ? "border-emerald-200 bg-emerald-50/50" : "border-amber-200 bg-amber-50/50"
          }`}
        >
          <p className="text-xs font-bold uppercase tracking-wider text-ink-500">
            {isQuiz ? "Practice result" : "Topic finished"}
          </p>
          <p
            className={`mt-1 text-4xl font-black ${
              passed ? "text-emerald-700" : "text-amber-700"
            }`}
          >
            {score.correct} / {score.asked}
          </p>
          {isQuiz && (
            <p className="mt-2 text-sm leading-relaxed text-ink-700">
              {passed ? (
                <>
                  That is a pass on this practice run — you reached{" "}
                  {spec.toPass} correct, which is where a real officer stops
                  asking.
                </>
              ) : (
                <>
                  Not a pass this time. You needed {spec.toPass} correct
                  {score.incorrect >= spec.toFail && (
                    <> and reached {spec.toFail} wrong, which is where a real officer stops</>
                  )}
                  . That is what practice is for.
                </>
              )}
              {score.selfCheck > 0 && (
                <>
                  {" "}
                  {score.selfCheck} question{score.selfCheck === 1 ? "" : "s"} needed a
                  look-up and {score.selfCheck === 1 ? "was" : "were"} not counted
                  as correct — the real test gives no credit for those either.
                </>
              )}
            </p>
          )}
          {timed && isQuiz && (
            <p className="mt-2 text-xs text-ink-500">
              Time taken: {formatClock(elapsed)}
            </p>
          )}
        </div>

        {byCategory.length > 0 && (
          <div className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card sm:p-6">
            <h3 className="text-base font-bold text-ink-900">Where you lost marks</h3>
            <CategoryScoreChart rows={byCategory} />
          </div>
        )}

        {missed.length > 0 && (
          <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-card sm:p-6">
            <h3 className="text-base font-bold text-ink-900">
              The {missed.length} you missed
            </h3>
            <ul className="mt-3 space-y-3">
              {missed.map((q) => (
                <li key={q.n} className="rounded-xl bg-ink-900/[0.02] px-4 py-3">
                  <p className="text-sm font-semibold text-ink-900">
                    {q.n}. {q.question}
                  </p>
                  {q.answers.length > 0 ? (
                    <p className="mt-1 text-sm text-ink-600">
                      {q.answers.join(" · ")}
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-ink-600">{q.note}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={begin}
            className="flex-1 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Take another
          </button>
          {missed.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setMode("review");
                setStarted(false);
              }}
              className="flex-1 rounded-xl border border-ink-900/10 bg-white px-5 py-3 text-sm font-semibold text-ink-700 transition hover:border-brand-300"
            >
              Drill the {missed.length} I missed
            </button>
          )}
          <button
            type="button"
            onClick={() => setStarted(false)}
            className="flex-1 rounded-xl border border-ink-900/10 bg-white px-5 py-3 text-sm font-semibold text-ink-700 transition hover:border-brand-300"
          >
            Change mode
          </button>
        </div>
      </div>
    );
  }

  /* ── Question screen ──────────────────────────────────────────── */
  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
            Question {index + 1} of {queue.length}
            {isQuiz && ` · ${score.correct} right, ${score.incorrect} wrong`}
          </p>
          {timed && isQuiz && (
            <p className="rounded-full bg-ink-900/5 px-3 py-1 text-xs font-semibold text-ink-600">
              {formatClock(elapsed)}
            </p>
          )}
        </div>

        <div
          className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-900/5"
          role="progressbar"
          aria-valuenow={index + 1}
          aria-valuemin={1}
          aria-valuemax={queue.length}
          aria-label="Progress through this set"
        >
          <div
            className="h-full rounded-full bg-brand-500 transition-all"
            style={{ width: `${((index + 1) / Math.max(1, queue.length)) * 100}%` }}
          />
        </div>

        <p className="mt-5 text-lg font-bold leading-snug text-ink-900 sm:text-xl">
          {current?.question}
        </p>
        <p className="mt-1.5 text-xs text-ink-400">
          Official question {current?.n} · {current?.category}
          {current?.star && " · in the 65/20 set"}
        </p>

        {!revealed ? (
          <>
            <p className="mt-5 rounded-xl bg-ink-900/[0.02] px-4 py-3 text-sm text-ink-500">
              Say your answer out loud first — that is how the real test works —
              then reveal.
            </p>
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="mt-4 w-full rounded-xl bg-brand-600 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              Show the official answer
            </button>
          </>
        ) : (
          <>
            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-4">
              {current && current.answers.length > 0 ? (
                <>
                  <p className="text-xs font-bold uppercase tracking-wide text-emerald-800">
                    {current.answers.length === 1
                      ? "Official answer"
                      : "Any one of these is accepted"}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {current.answers.map((a) => (
                      <li key={a} className="text-sm font-semibold text-ink-900">
                        {a}
                      </li>
                    ))}
                  </ul>
                  {current.note && (
                    <p className="mt-2 text-xs text-ink-500">{current.note}</p>
                  )}
                </>
              ) : (
                <>
                  <p className="text-xs font-bold uppercase tracking-wide text-emerald-800">
                    This answer changes — look it up
                  </p>
                  <p className="mt-2 text-sm text-ink-700">{current?.note}</p>
                  <a
                    href={CIVICS.testUpdatesUrl}
                    target="_blank"
                    rel="nofollow noopener"
                    className="mt-2 inline-block text-sm font-semibold text-brand-700 underline"
                  >
                    Check the current answer on uscis.gov ↗
                  </a>
                </>
              )}
            </div>

            <p className="mt-4 text-xs font-semibold text-ink-600">
              Did you get it?
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => grade("correct")}
                className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                I got it right
              </button>
              <button
                type="button"
                onClick={() => grade("incorrect")}
                className="rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
              >
                I got it wrong
              </button>
              <button
                type="button"
                onClick={() => grade("self-check")}
                className="rounded-xl border border-ink-900/10 bg-white px-4 py-3 text-sm font-semibold text-ink-700 transition hover:border-brand-300"
              >
                Need to look it up
              </button>
            </div>
          </>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setStarted(false)}
          className="text-xs font-semibold text-ink-500 underline hover:text-ink-700"
        >
          End this set
        </button>
        <p className="text-xs text-ink-400">
          Nothing is saved.{" "}
          <Link href="/tools/citizenship-checklist" className="text-brand-600 underline">
            Check your N-400 readiness
          </Link>{" "}
          separately.
        </p>
      </div>
    </div>
  );
}

/** Printable list of all 128 questions and answers, from the same data file. */
export function CivicsPrintableList() {
  return (
    <div className="print-clean mx-auto max-w-[720px]">
      <h2 className="text-lg font-black text-ink-900">
        All {CIVICS.format.poolSize} civics questions and answers ({CIVICS.version} version)
      </h2>
      <p className="mt-1 text-xs text-ink-500">
        Source: USCIS {CIVICS.sourceEdition}. Answers marked &ldquo;look this
        up&rdquo; change with elections and appointments — check{" "}
        {CIVICS.testUpdatesUrl}. Questions with a star are in the 65/20 set.
      </p>
      <ol className="mt-5 space-y-3">
        {QUESTIONS.map((q) => (
          <li key={q.n} className="break-inside-avoid border-b border-ink-900/5 pb-3">
            <p className="text-sm font-semibold text-ink-900">
              {q.n}. {q.question}
              {q.star && <span className="ml-1 text-amber-600">★</span>}
            </p>
            <p className="mt-0.5 text-sm text-ink-600">
              {q.answers.length > 0 ? q.answers.join(" · ") : q.note}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
