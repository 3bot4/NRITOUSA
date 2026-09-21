"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PrintButton from "@/components/PrintButton";
import {
  QUESTION_CATEGORIES,
  TOTAL_QUESTIONS,
  type QuestionCategory,
} from "@/data/marriageInterviewData";

/**
 * Couple practice mode.
 *
 * Both partners use the SAME phone, one after the other, and the tool shows
 * only where the two answers disagree. That is the whole idea: the interview
 * does not test whether you know the right answer, it tests whether you give
 * the same answer as the person you married.
 *
 * Nothing is stored — no localStorage, no network. Answers live in React state
 * and are gone on reload, which is deliberate for a page where the inputs are
 * "which side of the bed do you sleep on".
 */

type Phase = "setup" | "partner-a" | "handover" | "partner-b" | "compare";

interface Pair {
  question: string;
  category: string;
  a: string;
  b: string;
}

/** Loose match: same answer allowing for case, spacing and trailing punctuation. */
function agrees(a: string, b: string): boolean {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  const x = norm(a);
  const y = norm(b);
  if (!x || !y) return false;
  if (x === y) return true;
  // One answer containing the other counts as agreement — "HDFC" vs "HDFC Bank".
  return x.length > 2 && y.length > 2 && (x.includes(y) || y.includes(x));
}

export default function CouplePracticeMode() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [selected, setSelected] = useState<string[]>(
    QUESTION_CATEGORIES.map((c) => c.id)
  );
  const [index, setIndex] = useState(0);
  const [answersA, setAnswersA] = useState<string[]>([]);
  const [answersB, setAnswersB] = useState<string[]>([]);
  const [draft, setDraft] = useState("");

  const questions = useMemo(() => {
    const out: { question: string; category: string }[] = [];
    for (const c of QUESTION_CATEGORIES) {
      if (selected.indexOf(c.id) === -1) continue;
      for (const q of c.questions) out.push({ question: q, category: c.label });
    }
    return out;
  }, [selected]);

  const toggle = (id: string) =>
    setSelected((s) => (s.indexOf(id) === -1 ? [...s, id] : s.filter((x) => x !== id)));

  const start = () => {
    setAnswersA([]);
    setAnswersB([]);
    setIndex(0);
    setDraft("");
    setPhase("partner-a");
  };

  const submit = () => {
    const isA = phase === "partner-a";
    const next = [...(isA ? answersA : answersB), draft];
    if (isA) setAnswersA(next);
    else setAnswersB(next);
    setDraft("");

    if (index + 1 >= questions.length) {
      setIndex(0);
      setPhase(isA ? "handover" : "compare");
    } else {
      setIndex(index + 1);
    }
  };

  const pairs: Pair[] = questions.map((q, i) => ({
    question: q.question,
    category: q.category,
    a: answersA[i] ?? "",
    b: answersB[i] ?? "",
  }));
  const mismatches = pairs.filter((p) => !agrees(p.a, p.b));

  const privacyLine = (
    <p className="mt-3 rounded-xl bg-ink-900/[0.03] px-3.5 py-3 text-xs leading-relaxed text-ink-500">
      Nothing is saved. Your answers live only in this browser tab and disappear
      the moment you reload or close it — no account, no storage, nothing sent
      anywhere.
    </p>
  );

  /* ── Setup ─────────────────────────────────────────────────────── */
  if (phase === "setup") {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card sm:p-7">
        <h3 className="text-lg font-bold text-ink-900">Practise as a couple</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
          One phone, two turns. One of you answers every question, hands the
          phone over without showing your answers, and the other answers the same
          questions. At the end you see <strong>only the ones where you
          disagreed</strong> — which is the entire point, because the officer is
          not testing whether you know the right answer, but whether you give the
          same answer as the person you married.
        </p>

        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 text-xs leading-relaxed text-amber-900">
          <strong className="font-semibold">
            These are example questions we wrote, not an official USCIS list.
          </strong>{" "}
          USCIS does not publish the questions an officer will ask, and any site
          claiming to have &ldquo;the&rdquo; list has invented one. Use these to
          find the gaps in what you know about each other, not to memorise
          answers.
        </p>

        <fieldset className="mt-5">
          <legend className="text-xs font-semibold text-ink-800">
            Which topics? ({questions.length} of {TOTAL_QUESTIONS} questions selected)
          </legend>
          <div className="mt-2 grid gap-2">
            {QUESTION_CATEGORIES.map((c: QuestionCategory) => (
              <label
                key={c.id}
                className="flex items-start gap-3 rounded-xl border border-ink-900/10 px-3.5 py-3"
              >
                <input
                  type="checkbox"
                  checked={selected.indexOf(c.id) !== -1}
                  onChange={() => toggle(c.id)}
                  className="mt-0.5 h-4 w-4 rounded border-ink-900/20 text-brand-600 focus:ring-brand-500"
                />
                <span>
                  <span className="block text-sm font-semibold text-ink-900">
                    {c.label}{" "}
                    <span className="font-normal text-ink-400">
                      ({c.questions.length})
                    </span>
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-ink-500">
                    {c.testing}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <button
          type="button"
          onClick={start}
          disabled={questions.length === 0}
          className="mt-5 w-full rounded-xl bg-brand-600 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {questions.length === 0
            ? "Pick at least one topic"
            : `Start — partner 1 answers ${questions.length} questions`}
        </button>
        {privacyLine}
      </div>
    );
  }

  /* ── Handover ──────────────────────────────────────────────────── */
  if (phase === "handover") {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-brand-200 bg-brand-50/50 p-6 text-center shadow-card sm:p-8">
        <p className="text-3xl" aria-hidden>
          🤝
        </p>
        <h3 className="mt-2 text-lg font-bold text-ink-900">
          Now hand the phone to your partner
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-600">
          Partner 1 is done. Their answers are hidden. Partner 2 answers the same{" "}
          {questions.length} questions, and only then do you both see where you
          disagreed.
        </p>
        <button
          type="button"
          onClick={() => setPhase("partner-b")}
          className="mt-5 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          I&apos;m partner 2 — start my turn
        </button>
      </div>
    );
  }

  /* ── Compare ───────────────────────────────────────────────────── */
  if (phase === "compare") {
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <div
          className={`rounded-2xl border p-6 shadow-card sm:p-7 ${
            mismatches.length === 0
              ? "border-emerald-200 bg-emerald-50/50"
              : "border-amber-200 bg-amber-50/50"
          }`}
        >
          <p className="text-xs font-bold uppercase tracking-wider text-ink-500">
            Where you disagreed
          </p>
          <p
            className={`mt-1 text-4xl font-black ${
              mismatches.length === 0 ? "text-emerald-700" : "text-amber-700"
            }`}
          >
            {mismatches.length} of {pairs.length}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-700">
            {mismatches.length === 0 ? (
              <>
                You matched on everything you practised. Worth repeating with the
                topics you skipped — the questions couples miss are almost always
                the boring ones about the house and the money, not the romantic
                ones.
              </>
            ) : (
              <>
                A mismatch is not a problem, it is information. Some are simply
                different wording for the same thing. The ones worth talking
                through are where you genuinely remember something differently —
                because at the interview you will each answer from memory, under
                oath, without the chance to compare notes first.
              </>
            )}
          </p>
        </div>

        {mismatches.length > 0 && (
          <div className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card sm:p-6">
            <h3 className="text-base font-bold text-ink-900">
              Talk these through
            </h3>
            <ul className="mt-3 space-y-3">
              {mismatches.map((p) => (
                <li key={p.question} className="rounded-xl bg-ink-900/[0.02] px-4 py-3">
                  <p className="text-sm font-semibold text-ink-900">{p.question}</p>
                  <p className="mt-0.5 text-[0.7rem] uppercase tracking-wide text-ink-400">
                    {p.category}
                  </p>
                  <dl className="mt-2 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-lg border border-ink-900/5 bg-white px-3 py-2">
                      <dt className="text-[0.7rem] font-semibold text-ink-500">Partner 1</dt>
                      <dd className="text-sm text-ink-800">{p.a || <em>no answer</em>}</dd>
                    </div>
                    <div className="rounded-lg border border-ink-900/5 bg-white px-3 py-2">
                      <dt className="text-[0.7rem] font-semibold text-ink-500">Partner 2</dt>
                      <dd className="text-sm text-ink-800">{p.b || <em>no answer</em>}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={start}
            className="flex-1 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Run it again
          </button>
          <button
            type="button"
            onClick={() => setPhase("setup")}
            className="flex-1 rounded-xl border border-ink-900/10 bg-white px-5 py-3 text-sm font-semibold text-ink-700 transition hover:border-brand-300"
          >
            Change topics
          </button>
          <PrintButton label="Print the questions" className="flex-1 justify-center" />
        </div>

        <p className="text-xs leading-relaxed text-ink-400">
          Nothing was saved. Reload this page and every answer above is gone. If
          the marriage is under two years old at approval, the{" "}
          <Link href="/uscis/forms/i-751" className="text-brand-600 underline">
            I-751 to remove conditions
          </Link>{" "}
          is the next time you will be asked to prove all of this.
        </p>
      </div>
    );
  }

  /* ── Answering ─────────────────────────────────────────────────── */
  const isA = phase === "partner-a";
  const q = questions[index];

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
          Partner {isA ? "1" : "2"} · question {index + 1} of {questions.length}
        </p>
        <p className="rounded-full bg-ink-900/5 px-3 py-1 text-[0.7rem] font-semibold text-ink-600">
          {q.category}
        </p>
      </div>

      <div
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-900/5"
        role="progressbar"
        aria-valuenow={index + 1}
        aria-valuemin={1}
        aria-valuemax={questions.length}
        aria-label="Progress"
      >
        <div
          className="h-full rounded-full bg-brand-500 transition-all"
          style={{ width: `${((index + 1) / questions.length) * 100}%` }}
        />
      </div>

      <p className="mt-5 text-lg font-bold leading-snug text-ink-900 sm:text-xl">
        {q.question}
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <label className="sr-only" htmlFor="practice-answer">
          Your answer
        </label>
        <input
          id="practice-answer"
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          autoComplete="off"
          placeholder="Answer in a few words"
          className="mt-4 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-3 text-base text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        />
        <button
          type="submit"
          className="mt-3 w-full rounded-xl bg-brand-600 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          {index + 1 >= questions.length
            ? isA
              ? "Done — hide my answers"
              : "See where we disagreed"
            : "Next question"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setPhase("setup")}
        className="mt-3 text-xs font-semibold text-ink-500 underline hover:text-ink-700"
      >
        Start over
      </button>
    </div>
  );
}

/** Printable list of every practice question, grouped by topic. */
export function PrintableQuestionList() {
  return (
    <div className="print-clean">
      <h2 className="text-lg font-black text-ink-900">
        {TOTAL_QUESTIONS} practice questions for a marriage green card interview
      </h2>
      <p className="mt-1 text-xs text-ink-500">
        Example questions written by NRI to USA — not an official USCIS list.
        USCIS does not publish the questions an officer will ask.
      </p>
      {QUESTION_CATEGORIES.map((c) => (
        <section key={c.id} className="mt-5 break-inside-avoid">
          <h3 className="text-sm font-bold text-ink-900">{c.label}</h3>
          <p className="text-xs text-ink-500">{c.testing}</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-ink-700">
            {c.questions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
