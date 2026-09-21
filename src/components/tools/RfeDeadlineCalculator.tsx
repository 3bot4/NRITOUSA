"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import InputCard, { Field, fieldClass } from "@/components/tools/InputCard";
import ResultCard from "@/components/tools/ResultCard";
import { computeRfeDeadline, type ServiceMethod } from "@/lib/calc/rfeDeadline";
import { parseIsoDate } from "@/lib/calc/i751Window";
import { RFE_RULES, RFE_STATUS_SEQUENCE, RFE_SOURCES } from "@/data/rfeData";

/**
 * RFE deadline and next-step calculator.
 *
 * Runs entirely in the browser. Nothing about a pending case is stored or sent
 * — receipt numbers are never asked for, only a date and a number of days.
 */

const longDate = (iso: string) => {
  const ts = parseIsoDate(iso);
  if (ts === null) return iso;
  return new Date(ts).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
};

export default function RfeDeadlineCalculator() {
  const [noticeDate, setNoticeDate] = useState("");
  const [responseDays, setResponseDays] = useState(String(RFE_RULES.maxDays));
  const [serviceMethod, setServiceMethod] = useState<ServiceMethod>("mail");
  const [sent, setSent] = useState(false);

  const result = useMemo(
    () =>
      computeRfeDeadline({
        noticeDate,
        responseDays: Number(responseDays),
        serviceMethod,
        today: Date.now(),
      }),
    [noticeDate, responseDays, serviceMethod]
  );

  const tone =
    result?.status === "passed"
      ? "attention"
      : result?.status === "urgent" || result?.status === "due-today"
        ? "caution"
        : "positive";

  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid gap-5 lg:grid-cols-2">
        <InputCard eyebrow="From your notice" title="Two things printed on the RFE">
          <Field
            label="Date on the notice"
            help="Top right of the first page, next to the receipt number. Use the notice date, not the date it arrived — the clock has been running since then."
          >
            <input
              type="date"
              value={noticeDate}
              onChange={(e) => setNoticeDate(e.target.value)}
              className={fieldClass}
            />
          </Field>

          <Field
            label="Response period printed on the notice (days)"
            help={`Usually near the end, in the form "you must respond within X days". ${RFE_RULES.maxLabel} is the maximum USCIS policy allows; Form ${RFE_RULES.shortForms.join(" and Form ")} are capped at ${RFE_RULES.shortFormDays} days.`}
          >
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={120}
              value={responseDays}
              onChange={(e) => setResponseDays(e.target.value)}
              className={fieldClass}
            />
          </Field>

          <Field
            label="How was it served?"
            help={`Mailed service adds ${RFE_RULES.mailGraceDays} days to the period. Service through your online account or in person does not.`}
          >
            <select
              value={serviceMethod}
              onChange={(e) => setServiceMethod(e.target.value as ServiceMethod)}
              className={fieldClass}
            >
              <option value="mail">By mail</option>
              <option value="electronic">Through my USCIS online account</option>
            </select>
          </Field>

          <label className="flex items-center gap-3 rounded-xl border border-ink-900/10 px-3.5 py-3">
            <input
              type="checkbox"
              checked={sent}
              onChange={(e) => setSent(e.target.checked)}
              className="h-4 w-4 rounded border-ink-900/20 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-xs leading-relaxed text-ink-700">
              I have already sent my response — show me what happens next.
            </span>
          </label>

          <p className="rounded-xl bg-ink-900/[0.03] px-3.5 py-3 text-xs leading-relaxed text-ink-500">
            We never ask for your receipt number, and nothing you type here
            leaves your browser.
          </p>
        </InputCard>

        <div className="space-y-5">
          {!result ? (
            <ResultCard
              tone="neutral"
              eyebrow="Your deadline"
              title="Enter the notice date to see your deadline"
            >
              <p>
                You will get the last day USCIS will accept the response, a
                countdown, and a last-safe-post date if you are mailing it.
              </p>
            </ResultCard>
          ) : (
            <>
              <ResultCard
                tone={tone}
                eyebrow="Your deadline"
                title={
                  result.status === "passed"
                    ? "This deadline has passed"
                    : result.status === "due-today"
                      ? "Due today"
                      : `${result.daysRemaining.toLocaleString("en-US")} days left`
                }
                badge={longDate(result.deadline)}
              >
                <dl className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-ink-900/[0.03] px-3 py-2.5">
                    <dt className="text-xs font-semibold text-ink-500">
                      Last day USCIS will accept it
                    </dt>
                    <dd className="text-base font-black text-ink-900">
                      {longDate(result.deadline)}
                    </dd>
                    <p className="mt-0.5 text-[0.7rem] text-ink-400">
                      {result.responseDays} days
                      {result.graceDays > 0 &&
                        ` + ${result.graceDays} days for mailed service`}
                    </p>
                  </div>
                  <div className="rounded-xl bg-ink-900/[0.03] px-3 py-2.5">
                    <dt className="text-xs font-semibold text-ink-500">
                      Post by, if mailing
                    </dt>
                    <dd className="text-base font-black text-ink-900">
                      {longDate(result.mailBy)}
                    </dd>
                    <p className="mt-0.5 text-[0.7rem] text-ink-400">
                      USCIS counts receipt, not postmark
                    </p>
                  </div>
                </dl>

                {result.exceedsPolicyMax && (
                  <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
                    <strong className="font-semibold">Check that number again.</strong>{" "}
                    USCIS policy caps an RFE response period at{" "}
                    {RFE_RULES.maxLabel}. A longer period on a notice is unusual
                    — re-read the notice, and if it really does say that, work to
                    the shorter of the two.
                  </p>
                )}

                <p className="rounded-xl border border-rose-200 bg-rose-50/60 px-4 py-3 text-xs leading-relaxed text-rose-900">
                  <strong className="font-semibold">There is no extension.</strong>{" "}
                  Regulations prohibit officers from granting more time, so this
                  date is not negotiable and there is nobody to ask. If a
                  document will not arrive in time, send what you have by the
                  deadline with an explanation rather than sending nothing.
                </p>

                {result.status === "passed" && (
                  <p className="text-sm">
                    USCIS may now deny the case as abandoned, deny it on the
                    record as it stands, or both. Send the response anyway — a
                    late response is sometimes still considered if a decision has
                    not yet issued — and speak to an immigration attorney today.{" "}
                    <Link
                      href="/immigration-attorney-lawyer-cost"
                      className="text-brand-600 underline"
                    >
                      What that typically costs
                    </Link>
                    .
                  </p>
                )}
              </ResultCard>

              {sent && (
                <ResultCard
                  tone="info"
                  eyebrow="After you respond"
                  title="The status messages you should expect, in order"
                >
                  <ol className="space-y-2.5">
                    {RFE_STATUS_SEQUENCE.map((s) => (
                      <li
                        key={s.status}
                        className="rounded-xl border border-ink-900/5 bg-white px-4 py-3"
                      >
                        <p className="text-sm font-semibold text-ink-900">
                          &ldquo;{s.status}&rdquo;
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-ink-500">
                          {s.meaning}
                        </p>
                      </li>
                    ))}
                  </ol>
                  <p className="text-xs">
                    Decode any message on your own case with{" "}
                    <Link href="/uscis/case-status" className="text-brand-600 underline">
                      the USCIS case status guide
                    </Link>{" "}
                    or{" "}
                    <Link
                      href="/tools/uscis-case-status-meaning"
                      className="text-brand-600 underline"
                    >
                      the status meaning tool
                    </Link>
                    . If the case then sits past normal processing time, an{" "}
                    <a
                      href={RFE_SOURCES.eRequest}
                      target="_blank"
                      rel="nofollow noopener"
                      className="text-brand-600 underline"
                    >
                      outside-normal-processing-time inquiry
                    </a>{" "}
                    is the next step.
                  </p>
                </ResultCard>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
