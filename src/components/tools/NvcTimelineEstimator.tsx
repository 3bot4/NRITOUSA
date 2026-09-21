"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import InputCard, { Field, fieldClass } from "@/components/tools/InputCard";
import ResultCard from "@/components/tools/ResultCard";
import EmailMyResult from "@/components/tools/EmailMyResult";
import { estimateNvcTimeline, monthsBetween } from "@/lib/calc/nvcTimeline";
import { parseIsoDate } from "@/lib/calc/i751Window";
import { nvcLinks, nvcPublishedTimeframes as PT } from "@/data/nvcData";

/**
 * NVC timeline estimator: an I-130 approval date in, dated stage ranges out.
 *
 * Every output is a RANGE and is labelled as an estimate. The only two dated
 * facts in this area are the published timeframes, and those are shown above
 * the tool as facts rather than folded into the estimate. Runs entirely in the
 * browser; nothing is stored or sent.
 */

const longDate = (iso: string | null) => {
  if (!iso) return null;
  const ts = parseIsoDate(iso);
  if (ts === null) return iso;
  return new Date(ts).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
};

export default function NvcTimelineEstimator() {
  const [approval, setApproval] = useState("");
  const [submitted, setSubmitted] = useState("");

  const estimate = useMemo(
    () => estimateNvcTimeline(approval, submitted || undefined),
    [approval, submitted]
  );

  const todayIso = new Date().toISOString().slice(0, 10);
  const monthsToInterview = estimate
    ? monthsBetween(todayIso, estimate.interviewEarliest)
    : null;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-5">
          <InputCard eyebrow="Your case" title="Two dates, both off paperwork you already have">
            <Field
              label="Date USCIS approved the petition (I-797 approval notice)"
              help="The date on the approval notice, not the date you received it."
            >
              <input
                type="date"
                value={approval}
                onChange={(e) => setApproval(e.target.value)}
                className={fieldClass}
              />
            </Field>

            <Field
              label="Date you submitted your documents to NVC (optional)"
              help="If you have already uploaded the DS-260, civil documents and the affidavit of support, add the date — the estimate then runs from what actually happened instead of from an assumption about how fast you would be."
            >
              <input
                type="date"
                value={submitted}
                onChange={(e) => setSubmitted(e.target.value)}
                className={fieldClass}
              />
            </Field>

            <p className="rounded-xl bg-ink-900/[0.03] px-3.5 py-3 text-xs leading-relaxed text-ink-500">
              Nothing is stored or sent. These dates stay in your browser.
            </p>
          </InputCard>

          <div className="rounded-2xl border border-sky-200 bg-sky-50/50 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-sky-900">
              The two facts NVC actually publishes
            </p>
            <dl className="mt-3 space-y-3">
              {[PT.caseCreation, PT.documentReview].map((t) => (
                <div key={t.label}>
                  <dt className="text-xs font-semibold text-ink-600">{t.label}</dt>
                  <dd className="text-sm font-bold text-ink-900">
                    Working on {longDate(t.workingOn)}
                    <span className="ml-1 font-normal text-ink-400">
                      (as of {longDate(t.asOf)})
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs leading-relaxed text-ink-500">
              These are not estimates — they say which day&apos;s work NVC has
              reached. If your own date is later than the one shown, your case is
              in the queue and is not delayed.{" "}
              <a
                href={nvcLinks.nvcTimeframes}
                target="_blank"
                rel="nofollow noopener"
                className="text-brand-600 underline"
              >
                Check the current figures
              </a>
              .
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {!estimate ? (
            <ResultCard
              tone="neutral"
              eyebrow="Your estimated timeline"
              title="Enter the approval date to see the stages"
            >
              <p>
                You will get a dated range for each stage between petition
                approval and the consular interview, built from the planning
                ranges on this page.
              </p>
            </ResultCard>
          ) : (
            <>
              <ResultCard
                tone="info"
                eyebrow="Estimated timeline"
                title="Each stage, as a range"
                badge="Estimates, not a schedule"
              >
                <ol className="space-y-3">
                  {estimate.stages.map((s, i) => (
                    <li
                      key={s.id}
                      className="rounded-xl border border-ink-900/5 bg-white px-4 py-3"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-sm font-bold text-ink-900">
                          {i + 1}. {s.label}
                        </p>
                        <p className="text-xs font-semibold text-ink-700">
                          {s.selfPaced && !s.earliest ? (
                            <span className="text-emerald-700">Already done</span>
                          ) : s.earliest && s.latest ? (
                            <>
                              {longDate(s.earliest)} – {longDate(s.latest)}
                            </>
                          ) : (
                            "—"
                          )}
                        </p>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-ink-500">
                        {s.detail}
                        {s.selfPaced && s.earliest && (
                          <>
                            {" "}
                            <strong className="text-ink-700">
                              This one is on you, not on NVC.
                            </strong>
                          </>
                        )}
                      </p>
                    </li>
                  ))}
                </ol>
              </ResultCard>

              <ResultCard
                tone="caution"
                eyebrow="What this does not know"
                title="Read the range, not the midpoint"
              >
                <ul className="list-disc space-y-1.5 pl-5">
                  <li>
                    It does not know your priority date. In a preference
                    category, an interview cannot be scheduled until your date is
                    current whatever NVC does —{" "}
                    <Link href="/tools/priority-date-checker" className="text-brand-600 underline">
                      check yours
                    </Link>
                    .
                  </li>
                  <li>
                    It does not know your post&apos;s appointment capacity. Use
                    the{" "}
                    <Link href="/tools/iv-scheduling-status" className="text-brand-600 underline">
                      IV scheduling status tool
                    </Link>{" "}
                    for how far ahead your consulate is booking.
                  </li>
                  <li>
                    It assumes one clean document submission. A missing civil
                    document sends the package back and the review queue starts
                    again.
                  </li>
                  {monthsToInterview !== null && (
                    <li>
                      On these ranges the earliest plausible interview is roughly{" "}
                      <strong className="text-ink-900">
                        {monthsToInterview} month{monthsToInterview === 1 ? "" : "s"}
                      </strong>{" "}
                      away. Plan around the late end, not this one.
                    </li>
                  )}
                </ul>
              </ResultCard>

              <EmailMyResult
                subject="My estimated NVC timeline"
                intro="Estimated NVC stages, based on general planning ranges — not a schedule and not a guarantee."
                lines={[
                  { label: "Petition approved", value: longDate(estimate.approvalDate) ?? "—" },
                  ...estimate.stages
                    .filter((s) => s.earliest && s.latest)
                    .map((s) => ({
                      label: s.label,
                      value: `${longDate(s.earliest)} – ${longDate(s.latest)}`,
                    })),
                  {
                    label: `NVC case creation (published, as of ${longDate(PT.caseCreation.asOf)})`,
                    value: `Working on cases received ${longDate(PT.caseCreation.workingOn)}`,
                  },
                  {
                    label: `NVC document review (published, as of ${longDate(PT.documentReview.asOf)})`,
                    value: `Reviewing documents submitted ${longDate(PT.documentReview.workingOn)}`,
                  },
                ]}
                footnote={`Verify the current published timeframes: ${nvcLinks.nvcTimeframes}`}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
