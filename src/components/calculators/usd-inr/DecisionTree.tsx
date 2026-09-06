"use client";

import React, { useState } from "react";

/**
 * The send-now-or-wait decision tree.
 *
 * Built as buttons and list items rather than an SVG: it has to be operable by
 * keyboard and screen reader, reflow on a 360px phone, and read out in order.
 * An SVG would have needed all of that bolted back on.
 *
 * The tree deliberately overrides the calculator on one point. The calculator
 * answers "which choice has the better expected value"; Q2 answers "is this
 * money allowed to be wrong". A tuition bill due in eight weeks fails Q2 no
 * matter how attractive waiting looks in expectation, because the downside is
 * a missed deadline rather than a slightly worse rate.
 */

export type Outcome = "now" | "half" | "thirds" | "limit";

type NodeId = "q1" | "q2" | "q3" | "q4";

interface QuestionDef {
  id: NodeId;
  step: string;
  question: string;
  detail: string;
  yesLabel: string;
  noLabel: string;
  yes: NodeId | Outcome;
  no: NodeId | Outcome;
}

const OUTCOMES: Record<Outcome, { title: string; tone: string; body: string; plan: string }> = {
  now: {
    title: "Send it now",
    tone: "rose",
    body: "You owe a fixed rupee amount on a near deadline. Over a window this short the expected drift is a fraction of a percent, while the plausible swing is several percent — you would be carrying real risk for a reward that rounds to nothing. Convert, pay the bill, move on.",
    plan: "One transfer, today",
  },
  half: {
    title: "Split it 50-50",
    tone: "amber",
    body: "Your dollars are sitting idle, so waiting costs you the interest you are not earning anywhere. But dumping the whole balance on one day's print is its own bet. Send half today, half in about 90 days, and stop watching the rate.",
    plan: "50% today · 50% in 3 months",
  },
  thirds: {
    title: "Split it into 3 tranches",
    tone: "sky",
    body: "You are earning a real return on dollars, but today's rate is already inside the band the banks expect — so there is no edge either way. Average in across a few months. You will not get the best rate, and you will not get the worst one.",
    plan: "~⅓ today · ⅓ in 2 months · ⅓ in 4 months",
  },
  limit: {
    title: "Wait — with a limit order and a backstop date",
    tone: "emerald",
    body: "You are being paid to hold dollars and the published forecasts point your way. Waiting is defensible here — but only with rails. Set a target rate with your provider, and a hard date on which you convert regardless. A wait without a deadline is not a plan.",
    plan: "Target rate + a date you convert anyway",
  },
};

const TONE: Record<string, { chip: string; card: string; head: string }> = {
  rose: {
    chip: "bg-rose-100 text-rose-700",
    card: "border-rose-200 bg-rose-50/60",
    head: "text-rose-900",
  },
  amber: {
    chip: "bg-amber-100 text-amber-800",
    card: "border-amber-200 bg-amber-50/60",
    head: "text-amber-900",
  },
  sky: {
    chip: "bg-sky-100 text-sky-700",
    card: "border-sky-200 bg-sky-50/60",
    head: "text-sky-900",
  },
  emerald: {
    chip: "bg-emerald-100 text-emerald-700",
    card: "border-emerald-200 bg-emerald-50/60",
    head: "text-emerald-900",
  },
};

function isOutcome(v: string): v is Outcome {
  return v === "now" || v === "half" || v === "thirds" || v === "limit";
}

export default function DecisionTree({
  spot,
  bandLow,
  bandHigh,
  onApply,
}: {
  spot: number;
  bandLow: number;
  bandHigh: number;
  /** Pre-fills the calculator above with the recommendation. */
  onApply: (outcome: Outcome, billMode: boolean) => void;
}) {
  const QUESTIONS: QuestionDef[] = [
    {
      id: "q1",
      step: "Step 1",
      question: "Is the amount you owe fixed in rupees?",
      detail:
        "Tuition, a home-loan EMI, a property payment or a family commitment quoted in rupees — versus simply moving savings across with no set figure to hit.",
      yesLabel: "Yes — I owe a set rupee amount",
      noLabel: "No — I'm just moving savings",
      yes: "q2",
      no: "q3",
    },
    {
      id: "q2",
      step: "Step 2",
      question: "Is the deadline within 3 months?",
      detail:
        "A dated obligation changes the problem. Missing it costs far more than a rupee or two on the rate.",
      yesLabel: "Yes — due within 3 months",
      noLabel: "No — more than 3 months away",
      yes: "now",
      no: "q3",
    },
    {
      id: "q3",
      step: "Step 3",
      question: "Are your dollars earning 4% or more?",
      detail:
        "A high-yield savings account, T-bills or a money-market fund count. A checking account paying nothing does not.",
      yesLabel: "Yes — they're earning 4%+",
      noLabel: "No — sitting in checking",
      yes: "q4",
      no: "half",
    },
    {
      id: "q4",
      step: "Step 4",
      question: `Is today's rate below what banks forecast for your horizon?`,
      detail: `Today is ₹${spot.toFixed(
        2
      )}. The published bank forecasts in the table below span roughly ₹${bandLow} to ₹${bandHigh}. Below that band means forecasters expect more rupees per dollar later than you can get now.`,
      yesLabel: `Yes — today is under ₹${bandLow}`,
      noLabel: `No — today is inside or above the band`,
      yes: "limit",
      no: "thirds",
    },
  ];

  const [answers, setAnswers] = useState<Partial<Record<NodeId, boolean>>>({});

  // Walk the tree from the answers given. This is the single source of truth
  // for both which questions render and which path is highlighted, so the two
  // can never disagree.
  const visited: NodeId[] = [];
  let cursor: NodeId | Outcome = "q1";
  let guard = 0;
  while (!isOutcome(cursor) && guard < 10) {
    guard++;
    const node = cursor as NodeId;
    visited.push(node);
    const answer = answers[node];
    if (answer === undefined) break;
    const def = QUESTIONS.filter((q) => q.id === node)[0];
    cursor = answer ? def.yes : def.no;
  }
  const outcome: Outcome | null = isOutcome(cursor) ? cursor : null;

  function answer(id: NodeId, value: boolean) {
    setAnswers((prev) => {
      // Answering an earlier question invalidates everything downstream of it.
      const idx = visited.indexOf(id);
      const kept: Partial<Record<NodeId, boolean>> = {};
      for (let i = 0; i < idx; i++) kept[visited[i]] = prev[visited[i]];
      kept[id] = value;
      return kept;
    });
  }

  const billMode = answers.q1 === true;

  return (
    <div>
      <ol className="space-y-3">
        {visited.map((id) => {
          const q = QUESTIONS.filter((x) => x.id === id)[0];
          const given = answers[id];
          const answered = given !== undefined;
          return (
            <li
              key={id}
              className={`rounded-2xl border p-4 transition-colors sm:p-5 ${
                answered
                  ? "border-brand-200 bg-brand-50/40"
                  : "border-ink-900/10 bg-white shadow-card"
              }`}
            >
              <p className="text-[0.6875rem] font-bold uppercase tracking-widest text-brand-600">
                {q.step}
              </p>
              <h3 className="mt-1 text-base font-bold leading-snug text-ink-900 sm:text-lg">
                {q.question}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{q.detail}</p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                {[
                  { label: q.yesLabel, value: true },
                  { label: q.noLabel, value: false },
                ].map((opt) => {
                  const on = given === opt.value;
                  return (
                    <button
                      key={String(opt.value)}
                      type="button"
                      aria-pressed={on}
                      onClick={() => answer(id, opt.value)}
                      className={`min-h-[44px] flex-1 rounded-xl border px-4 py-2.5 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 motion-safe:transition-colors ${
                        on
                          ? "border-brand-600 bg-brand-600 text-white"
                          : "border-ink-900/15 bg-white text-ink-700 hover:border-brand-400 hover:bg-brand-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ol>

      {outcome && (
        <div
          className={`mt-4 rounded-2xl border p-5 sm:p-6 ${TONE[OUTCOMES[outcome].tone].card}`}
          role="status"
        >
          <span
            className={`inline-block rounded-full px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-wider ${
              TONE[OUTCOMES[outcome].tone].chip
            }`}
          >
            Your answer
          </span>
          <h3
            className={`mt-2.5 text-xl font-extrabold tracking-tight sm:text-2xl ${
              TONE[OUTCOMES[outcome].tone].head
            }`}
          >
            {OUTCOMES[outcome].title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-700">
            {OUTCOMES[outcome].body}
          </p>
          <p className="mt-3 rounded-lg bg-white/70 px-3 py-2 text-sm font-semibold text-ink-800">
            Plan: {OUTCOMES[outcome].plan}
          </p>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => onApply(outcome, billMode)}
              className="min-h-[44px] rounded-xl bg-ink-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-ink-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 motion-safe:transition-colors"
            >
              Put this into the calculator ↑
            </button>
            <button
              type="button"
              onClick={() => setAnswers({})}
              className="min-h-[44px] rounded-xl border border-ink-900/15 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 motion-safe:transition-colors"
            >
              Start over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
