"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import InputCard, { Field, fieldClass } from "@/components/tools/InputCard";
import ResultCard from "@/components/tools/ResultCard";
import {
  EXPEDITE_CRITERIA,
  EXPEDITE_CHANNELS,
  EXPEDITE_FACTS,
  EXPEDITE_SOURCES,
  PREMIUM_AVAILABILITY,
} from "@/data/expediteData";

/**
 * Expedite eligibility checker.
 *
 * Asks the premium-processing question FIRST, because it decides most cases
 * before any criterion is reached: USCIS will not consider an expedite request
 * where premium processing is available, unless the petitioner is an
 * IRS-designated nonprofit. A checker that walked the five criteria first would
 * tell a lot of H-1B petitioners they qualify for something they cannot ask for.
 *
 * Runs entirely in the browser. No receipt numbers, nothing stored, nothing sent.
 */

export default function ExpediteEligibilityChecker() {
  const [filingIndex, setFilingIndex] = useState("");
  const [isNonprofit, setIsNonprofit] = useState(false);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  const filing =
    filingIndex === "" ? null : PREMIUM_AVAILABILITY[Number(filingIndex)];

  const blockedByPremium = Boolean(
    filing && filing.premiumAvailable && !isNonprofit
  );

  const matched = useMemo(
    () => EXPEDITE_CRITERIA.filter((c) => answers[c.id]),
    [answers]
  );

  const toggle = (id: string) =>
    setAnswers((a) => ({ ...a, [id]: !a[id] }));

  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-5">
          <InputCard eyebrow="Step 1" title="Which filing is it?">
            <Field
              label="Form and category"
              help="This is asked first on purpose — for some forms the question is settled before the criteria matter at all."
            >
              <select
                value={filingIndex}
                onChange={(e) => setFilingIndex(e.target.value)}
                className={fieldClass}
              >
                <option value="">Choose a filing…</option>
                {PREMIUM_AVAILABILITY.map((f, i) => (
                  <option key={`${f.form}-${i}`} value={String(i)}>
                    {f.form} — {f.label}
                  </option>
                ))}
              </select>
            </Field>

            <label className="flex items-start gap-3 rounded-xl border border-ink-900/10 px-3.5 py-3">
              <input
                type="checkbox"
                checked={isNonprofit}
                onChange={(e) => setIsNonprofit(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-ink-900/20 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-xs leading-relaxed text-ink-700">
                The petitioner is an <strong>IRS-designated nonprofit</strong>.
                This is the only exception to the premium-processing bar, and it
                does not apply to an individual applicant.
              </span>
            </label>
          </InputCard>

          <InputCard eyebrow="Step 2" title="Does a criterion apply?">
            <p className="-mt-2 text-xs leading-relaxed text-ink-500">
              Tick only what you can actually document. USCIS decides on the
              evidence, not on the description, and an unsupported request is
              simply declined without explanation.
            </p>
            {EXPEDITE_CRITERIA.map((c) => (
              <label
                key={c.id}
                className="flex items-start gap-3 rounded-xl border border-ink-900/10 px-3.5 py-3"
              >
                <input
                  type="checkbox"
                  checked={Boolean(answers[c.id])}
                  onChange={() => toggle(c.id)}
                  className="mt-0.5 h-4 w-4 rounded border-ink-900/20 text-brand-600 focus:ring-brand-500"
                />
                <span>
                  <span className="block text-sm font-semibold text-ink-900">
                    {c.question}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-ink-500">
                    {c.meaning}
                  </span>
                </span>
              </label>
            ))}
          </InputCard>
        </div>

        <div className="space-y-5">
          {!filing ? (
            <ResultCard tone="neutral" eyebrow="Your result" title="Pick your filing to start">
              <p>
                For several common forms the premium-processing rule decides the
                answer before any criterion is considered.
              </p>
            </ResultCard>
          ) : blockedByPremium ? (
            <ResultCard
              tone="caution"
              eyebrow="Premium processing is available"
              title="USCIS will not consider an expedite request for this filing"
              badge="Use premium instead"
            >
              <p>{EXPEDITE_FACTS.premiumBar}</p>
              <p>
                For <strong>{filing.form}</strong> ({filing.label}), premium
                processing exists
                {filing.fee ? (
                  <>
                    {" "}
                    at <strong>{filing.fee}</strong>
                  </>
                ) : null}
                , so that is the route — not an expedite request. {filing.note}
              </p>
              <p className="text-xs">
                Confirm the current fee and that premium is still open for your
                category on the{" "}
                <a
                  href={EXPEDITE_SOURCES.premiumProcessing}
                  target="_blank"
                  rel="nofollow noopener"
                  className="text-brand-600 underline"
                >
                  official Form I-907 page
                </a>{" "}
                — USCIS suspends categories from time to time.
              </p>
            </ResultCard>
          ) : matched.length === 0 ? (
            <ResultCard
              tone="info"
              eyebrow="Your result"
              title="No criterion ticked yet"
              badge={filing.premiumAvailable ? "Nonprofit exception" : "Expedite available"}
            >
              <p>
                {filing.premiumAvailable
                  ? "As an IRS-designated nonprofit you are not barred by the premium-processing rule, so the criteria are open to you."
                  : `There is no premium processing option for ${filing.form} (${filing.label}), so an expedite request is available on the criteria.`}{" "}
                Tick whichever of the five actually applies and can be documented.
              </p>
              <p className="text-xs">
                If none of them does, an expedite request is not the tool. Where
                a case is simply slow, check whether it is genuinely outside
                normal processing time first —{" "}
                <Link
                  href="/tools/uscis-processing-delay-checker"
                  className="text-brand-600 underline"
                >
                  the delay checker
                </Link>{" "}
                does that, and an outside-normal-processing-time inquiry is a
                different and more appropriate request.
              </p>
            </ResultCard>
          ) : (
            <>
              <ResultCard
                tone="positive"
                eyebrow="Your result"
                title={`${matched.length} criteri${matched.length === 1 ? "on" : "a"} may apply`}
                badge="Gather the evidence"
              >
                <p>
                  Nothing here decides your request — USCIS does, on the evidence,
                  and {EXPEDITE_FACTS.noPublishedTimeframe.toLowerCase()}
                </p>
                <ul className="space-y-3">
                  {matched.map((c) => (
                    <li key={c.id} className="rounded-xl border border-ink-900/5 bg-white px-4 py-3">
                      <p className="text-sm font-bold text-ink-900">{c.label}</p>
                      <p className="mt-1 text-xs leading-relaxed text-ink-500">{c.meaning}</p>
                      <p className="mt-2 text-xs font-semibold text-ink-700">
                        Evidence to gather:
                      </p>
                      <ul className="mt-1 list-disc space-y-0.5 pl-5 text-xs text-ink-600">
                        {c.evidence.map((e) => (
                          <li key={e}>{e}</li>
                        ))}
                      </ul>
                      {!c.realistic && (
                        <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
                          In practice this criterion is rarely available to an
                          individual applicant — check the wording carefully
                          before relying on it.
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </ResultCard>

              <ResultCard tone="info" eyebrow="How to submit" title="Four channels, one of them clearly best">
                <ul className="space-y-2">
                  {EXPEDITE_CHANNELS.map((c, i) => (
                    <li key={c.channel} className="rounded-xl border border-ink-900/5 bg-white px-4 py-3">
                      <p className="text-sm font-semibold text-ink-900">
                        {i + 1}. {c.channel}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-ink-500">{c.detail}</p>
                    </li>
                  ))}
                </ul>
                <p className="text-xs">
                  Whichever route you use, attach the document that proves the
                  urgency rather than describing it. A single hospital letter or
                  death certificate does more than three paragraphs of
                  explanation.{" "}
                  <a
                    href={EXPEDITE_SOURCES.expeditePage}
                    target="_blank"
                    rel="nofollow noopener"
                    className="text-brand-600 underline"
                  >
                    USCIS&apos;s own expedite page
                  </a>{" "}
                  lists what it expects.
                </p>
              </ResultCard>
            </>
          )}

          <p className="text-xs leading-relaxed text-ink-400">
            Educational screening only, not legal advice and not a decision. The
            criteria are read from the USCIS Expedite Requests page and Policy
            Manual Vol. 1, Pt. A, Ch. 5 as at {EXPEDITE_FACTS.lastVerified}.
          </p>
        </div>
      </div>
    </div>
  );
}
