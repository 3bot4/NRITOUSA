"use client";

import { useMemo, useState } from "react";
import { optRules } from "@/data/studentClusterData";

/**
 * Five-question "which applies to you" quiz.
 *
 * Deliberately not a lead-capture form — no email gate, no results-by-email.
 * The whole ranking argument for this page is that it is the one result in
 * the SERP with nothing to sell, so the tool has to behave that way too.
 */

interface Question {
  id: string;
  prompt: string;
  help?: string;
  options: { value: string; label: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: "enrolled",
    prompt: "Where are you in your program?",
    options: [
      { value: "not-started", label: "Have not started yet" },
      { value: "first-year", label: "In my first academic year" },
      { value: "after-year", label: "Completed at least one academic year" },
      { value: "finishing", label: "About to complete the program" },
    ],
  },
  {
    id: "goal",
    prompt: "What do you actually need the work authorisation for?",
    options: [
      { value: "required", label: "A required course, co-op or internship credit" },
      { value: "experience", label: "Experience and income during the program" },
      { value: "career", label: "A full-time job after I graduate" },
      { value: "stay", label: "Mainly to stay in the US and keep working" },
    ],
  },
  {
    id: "cpt-used",
    prompt: "How much full-time CPT have you already used?",
    help: "Full-time means more than 20 hours a week. Part-time CPT does not carry the same consequence.",
    options: [
      { value: "none", label: "None" },
      { value: "under-12", label: "Less than 12 months" },
      { value: "12-plus", label: "12 months or more" },
      { value: "unsure", label: "I am not sure" },
    ],
  },
  {
    id: "stem",
    prompt: "Is your degree on the STEM designated list?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "unsure", label: "I need to check" },
    ],
  },
  {
    id: "program-type",
    prompt: "How does your program deliver classes?",
    help: "This is the question that separates an ordinary program from a high-risk one.",
    options: [
      { value: "normal", label: "Regular in-person classes on a campus" },
      { value: "hybrid", label: "Mostly in person with some online" },
      {
        value: "day1",
        label: "Mostly online, occasional weekend residency, CPT from term one",
      },
    ],
  },
];

interface Verdict {
  tone: "good" | "warn" | "bad";
  headline: string;
  body: string;
  actions: string[];
}

function evaluate(a: Record<string, string>): Verdict | null {
  if (Object.keys(a).length < QUESTIONS.length) return null;

  // Hard stop first: full-time CPT has already destroyed OPT eligibility.
  if (a["cpt-used"] === "12-plus") {
    return {
      tone: "bad",
      headline: "You have likely lost post-completion OPT eligibility",
      body: `${optRules.cptFullTimeMonthsThatKillOpt} months or more of full-time CPT eliminates post-completion OPT entirely. This is a bright-line rule, not a discretionary judgement, and it does not reverse. If you are close to but not over the line, stopping now preserves your OPT.`,
      actions: [
        "Get your exact full-time CPT total from your DSO in writing — count months of authorisation, not months you actually worked.",
        "If you are genuinely at or over 12 months, plan around H-1B sponsorship, a change of status, or a new program rather than OPT.",
        "Speak to an immigration attorney before making further study or work commitments — this decision compounds.",
      ],
    };
  }

  if (a["program-type"] === "day1") {
    return {
      tone: "bad",
      headline: "This is the highest-risk profile in the entire CPT landscape",
      body: "Mostly-online delivery with CPT authorised from the first term is precisely the pattern that attracts scrutiny. The risk is rarely immediate — it usually lands years later, at the H-1B or green card stage, when an officer reviews whether your F-1 status was properly maintained throughout. By then the money is spent and the years are gone.",
      actions: [
        "Ask the school, in writing, how many of its students have had H-1B petitions approved after using its Day-1 CPT — and treat a vague answer as an answer.",
        "Verify the school's regional accreditation independently, not from its own marketing.",
        "Pay an immigration attorney for an opinion before you enrol. This is the cheapest part of the decision you will ever make.",
        "Read the Day-1 CPT section below in full before committing money.",
      ],
    };
  }

  if (a["cpt-used"] === "unsure") {
    return {
      tone: "warn",
      headline: "Find out your exact full-time CPT total before anything else",
      body: `Everything downstream depends on this number. At ${optRules.cptFullTimeMonthsThatKillOpt} months of full-time CPT you lose post-completion OPT permanently, and students routinely underestimate their total because they count months worked rather than months authorised.`,
      actions: [
        "Email your DSO and ask for your total authorised full-time CPT in months.",
        "Ask separately for your part-time CPT total — it does not carry the same consequence, but you want the full picture.",
        "Come back to this decision once you have the number.",
      ],
    };
  }

  if (a.enrolled === "finishing" || a.goal === "career") {
    const stem = a.stem === "yes";
    return {
      tone: "good",
      headline: "OPT is your route — and timing is the whole game",
      body: `Post-completion OPT gives you ${optRules.postCompletionMonths} months of work authorisation${
        stem
          ? `, plus a ${optRules.stemMonths}-month STEM extension, for ${optRules.postCompletionMonths + optRules.stemMonths} months total`
          : ""
      }. The filing window opens ${optRules.filingWindowDaysBefore} days before your program end date and closes ${optRules.filingWindowDaysAfter} days after. Filing on the first available day is the highest-value action available to you, because USCIS processing time comes straight out of your job-search runway.`,
      actions: [
        `File Form I-765 on the first day of your window — ${optRules.filingWindowDaysBefore} days before your program end date.`,
        "Request the OPT recommendation from your DSO before that, so the updated I-20 is ready.",
        stem
          ? "Confirm your CIP code is on the STEM list and that your employer is enrolled in E-Verify — the STEM extension needs both."
          : "Since your degree is not STEM-designated, plan the H-1B conversation with employers early — you have one 12-month window.",
        "Model your unemployment allowance before you start, not after.",
      ],
    };
  }

  if (a.enrolled === "first-year" || a.enrolled === "not-started") {
    return {
      tone: "warn",
      headline: "You are not CPT-eligible yet — and that is normal",
      body: `CPT generally requires ${optRules.cptAcademicYearMonths} months of full-time study first, with narrow exceptions for graduate programs where immediate participation is an integral part of the curriculum. Use this period to protect your later options rather than to find a workaround.`,
      actions: [
        "Confirm your program's actual CPT eligibility date with your DSO.",
        "Keep any CPT you do eventually take part-time where possible — it avoids the 12-month rule entirely.",
        "Treat unauthorised work as unrecoverable. It is one of the most common causes of SEVIS termination.",
      ],
    };
  }

  return {
    tone: "good",
    headline: "CPT is available to you — keep it part-time if you can",
    body: `You have completed the academic year requirement, so CPT is on the table for work that is an integral part of your curriculum. The rule to plan around: part-time CPT carries no OPT consequence at all, while full-time CPT accumulates toward the ${optRules.cptFullTimeMonthsThatKillOpt}-month threshold that eliminates OPT.`,
    actions: [
      "Prefer part-time CPT (20 hours or fewer) whenever the role allows it.",
      "Track your cumulative full-time CPT months yourself — do not rely on anyone else to warn you.",
      "Get every CPT authorisation on an updated I-20 before your first day. Working before authorisation is a status violation.",
    ],
  };
}

const TONE_STYLE = {
  good: "border-emerald-200 bg-emerald-50/50",
  warn: "border-amber-200 bg-amber-50/50",
  bad: "border-rose-200 bg-rose-50/50",
};

const TONE_TEXT = {
  good: "text-emerald-700",
  warn: "text-amber-800",
  bad: "text-rose-700",
};

export default function CptOptQuiz() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const verdict = useMemo(() => evaluate(answers), [answers]);
  const answered = Object.keys(answers).length;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-bold tracking-tight text-ink-900">
            Which one applies to you?
          </h2>
          <span className="text-xs font-semibold text-ink-400">
            {answered} of {QUESTIONS.length} answered
          </span>
        </div>
        <p className="mt-1 text-sm text-ink-500">
          Five questions. No email, no signup, nothing stored.
        </p>

        <div className="mt-5 space-y-6">
          {QUESTIONS.map((q, i) => (
            <fieldset key={q.id}>
              <legend className="text-sm font-bold text-ink-900">
                {i + 1}. {q.prompt}
              </legend>
              {q.help && (
                <p className="mt-1 text-xs leading-relaxed text-ink-400">
                  {q.help}
                </p>
              )}
              <div className="mt-2.5 grid gap-2">
                {q.options.map((o) => {
                  const selected = answers[q.id] === o.value;
                  return (
                    <label
                      key={o.value}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                        selected
                          ? "border-brand-500 bg-brand-50/60 font-semibold text-ink-900"
                          : "border-ink-900/10 text-ink-600 hover:border-ink-900/25"
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={o.value}
                        checked={selected}
                        onChange={() =>
                          setAnswers((prev) => ({ ...prev, [q.id]: o.value }))
                        }
                        className="h-4 w-4 flex-none accent-brand-600"
                      />
                      {o.label}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>
      </div>

      {verdict ? (
        <div
          className={`mt-5 rounded-2xl border p-5 shadow-card sm:p-6 ${TONE_STYLE[verdict.tone]}`}
        >
          <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
            Your situation
          </p>
          <h3
            className={`mt-1 text-lg font-extrabold tracking-tight ${TONE_TEXT[verdict.tone]}`}
          >
            {verdict.headline}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-700">
            {verdict.body}
          </p>
          <p className="mt-4 text-xs font-bold uppercase tracking-wide text-ink-400">
            What to do
          </p>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-ink-700 marker:font-bold marker:text-ink-400">
            {verdict.actions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ol>
          <button
            type="button"
            onClick={() => setAnswers({})}
            className="mt-4 text-xs font-semibold text-brand-600 underline"
          >
            Start over
          </button>
        </div>
      ) : (
        <p className="mt-4 rounded-2xl border border-dashed border-ink-900/15 p-4 text-center text-sm text-ink-400">
          Answer all {QUESTIONS.length} questions to see what applies to you.
        </p>
      )}
    </div>
  );
}
