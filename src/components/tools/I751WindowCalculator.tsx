"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import InputCard, { Field, fieldClass } from "@/components/tools/InputCard";
import ResultCard from "@/components/tools/ResultCard";
import EmailMyResult from "@/components/tools/EmailMyResult";
import {
  computeI751Window,
  buildIcs,
  parseIsoDate,
  type I751Window,
} from "@/lib/calc/i751Window";
import { I751_FACTS, I751_SOURCES, I751_BASES } from "@/data/i751Data";

/**
 * I-751 filing-window calculator.
 *
 * Runs entirely in the browser; the .ics reminder is generated from a string
 * and handed to a Blob URL, so no file ever touches a server. All the date
 * arithmetic lives in src/lib/calc/i751Window.ts and is unit-tested — this
 * component only collects inputs and renders.
 */

/** Today as a UTC-midnight timestamp, matching the calc layer's convention. */
function todayUtc(): number {
  const now = new Date();
  return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
}

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

const TONE: Record<
  I751Window["status"],
  { tone: "positive" | "caution" | "attention" | "info"; badge: string; title: string }
> = {
  "too-early": {
    tone: "info",
    badge: "Not yet",
    title: "Too early to file — but now is when the evidence gets built",
  },
  open: { tone: "positive", badge: "Open now", title: "Your filing window is open" },
  closing: {
    tone: "caution",
    badge: "Closing",
    title: "Your window is closing — file now",
  },
  expired: {
    tone: "attention",
    badge: "Passed",
    title: "The card has already expired",
  },
};

export default function I751WindowCalculator() {
  const [mode, setMode] = useState<"resident" | "expiry">("resident");
  const [residentSince, setResidentSince] = useState("");
  const [expiry, setExpiry] = useState("");
  const [basis, setBasis] = useState<"joint" | "waiver">("joint");

  const today = useMemo(todayUtc, []);
  const result = useMemo(
    () =>
      computeI751Window(
        mode === "resident" ? { residentSince, today } : { expiry, today }
      ),
    [mode, residentSince, expiry, today]
  );

  const waiver = basis === "waiver";

  const downloadIcs = () => {
    if (!result) return;
    const ics = buildIcs({
      start: result.opens,
      summary: "Form I-751 filing window opens",
      description: `The 90-day window to file Form I-751 opens today. Your conditional green card expires ${result.deadline}. Filing fee: ${I751_FACTS.onlineFee} online or ${I751_FACTS.paperFee} on paper. Details: ${I751_SOURCES.form}`,
      uid: `i751-${result.opens}-${result.deadline}@nritousa.com`,
    });
    if (!ics) return;
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "i-751-filing-window.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid gap-5 lg:grid-cols-2">
        <InputCard eyebrow="Your card" title="Read one date off your green card">
          <Field
            label="Which date is easier for you to find?"
            help='Both are printed on the front of a conditional card. "Resident Since" is the date your two years started.'
          >
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as "resident" | "expiry")}
              className={fieldClass}
            >
              <option value="resident">Resident Since date</option>
              <option value="expiry">Card Expires date</option>
            </select>
          </Field>

          {mode === "resident" ? (
            <Field
              label='"Resident Since" date on the card'
              help={`Your conditional status runs ${I751_FACTS.conditionalYears} years from this date.`}
            >
              <input
                type="date"
                value={residentSince}
                onChange={(e) => setResidentSince(e.target.value)}
                className={fieldClass}
              />
            </Field>
          ) : (
            <Field label='"Card Expires" date' help="The date printed on the front of the card.">
              <input
                type="date"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className={fieldClass}
              />
            </Field>
          )}

          <Field
            label="How will you be filing?"
            help="This changes whether the 90-day window restricts you at all."
          >
            <select
              value={basis}
              onChange={(e) => setBasis(e.target.value as "joint" | "waiver")}
              className={fieldClass}
            >
              {I751_BASES.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.label}
                </option>
              ))}
            </select>
          </Field>

          <p className="rounded-xl bg-ink-900/[0.03] px-3.5 py-3 text-xs leading-relaxed text-ink-500">
            Nothing here is stored or sent. The dates stay in your browser, and
            the calendar reminder is generated on your own device.
          </p>
        </InputCard>

        <div className="space-y-5">
          {!result ? (
            <ResultCard
              tone="neutral"
              eyebrow="Your window"
              title="Enter the date from your card"
            >
              <p>
                We will work out the first day USCIS will accept your petition,
                the last day before your status lapses, and how long a receipt
                notice would carry your status.
              </p>
            </ResultCard>
          ) : waiver ? (
            <ResultCard
              tone="info"
              eyebrow="Waiver filing"
              title="The 90-day window does not apply to you"
              badge="File any time"
            >
              <p>
                Because you are requesting a waiver of the joint filing
                requirement, you are not restricted to the 90 days before the
                card expires. USCIS accepts a waiver request at any time after
                you became a conditional resident and up until a final removal
                order is issued.
              </p>
              <p>
                Your card still expires on{" "}
                <strong className="text-ink-900">{longDate(result.deadline)}</strong>
                , and filing still produces a receipt notice that extends your
                status and work authorisation for {result.extensionMonths} months
                — to roughly {longDate(result.extensionEnds)}. Do not wait for a
                window that does not bind you.
              </p>
              <p>
                If the divorce is not final yet, that is the usual reason a
                waiver cannot be filed today — see{" "}
                <Link href="/divorce-immigration-status" className="text-brand-600 underline">
                  divorce and your immigration status
                </Link>
                .
              </p>
            </ResultCard>
          ) : (
            <>
              <ResultCard
                tone={TONE[result.status].tone}
                eyebrow="Your joint-filing window"
                title={TONE[result.status].title}
                badge={TONE[result.status].badge}
              >
                <dl className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-ink-900/[0.03] px-3 py-2.5">
                    <dt className="text-xs font-semibold text-ink-500">Window opens</dt>
                    <dd className="text-base font-black text-ink-900">
                      {longDate(result.opens)}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-ink-900/[0.03] px-3 py-2.5">
                    <dt className="text-xs font-semibold text-ink-500">
                      Last day — card expires
                    </dt>
                    <dd className="text-base font-black text-ink-900">
                      {longDate(result.deadline)}
                    </dd>
                  </div>
                </dl>

                <div className="rounded-xl border border-ink-900/5 bg-white px-4 py-3">
                  {result.status === "too-early" && (
                    <p className="text-sm text-ink-700">
                      <strong className="text-ink-900">
                        {result.daysUntilOpen.toLocaleString("en-US")} days
                      </strong>{" "}
                      until you can file. A petition sent before that date is
                      rejected and returned, so the useful work right now is
                      collecting the joint documents for these two years, not
                      filling in the form.
                    </p>
                  )}
                  {(result.status === "open" || result.status === "closing") && (
                    <p className="text-sm text-ink-700">
                      <strong className="text-ink-900">
                        {result.daysUntilDeadline.toLocaleString("en-US")} days
                      </strong>{" "}
                      left before the card expires.{" "}
                      {result.status === "closing"
                        ? "That is tight. File first and supplement the evidence later if you must — a late petition terminates your status, an imperfect one does not."
                        : "File once the joint evidence is assembled; there is no advantage in using the whole window."}
                    </p>
                  )}
                  {result.status === "expired" && (
                    <p className="text-sm text-ink-700">
                      The card expired{" "}
                      <strong className="text-ink-900">
                        {Math.abs(result.daysUntilDeadline).toLocaleString("en-US")} days
                      </strong>{" "}
                      ago. Conditional status terminates automatically when the
                      window closes, and USCIS may issue a Notice to Appear. A
                      late petition is still accepted if you include a written
                      explanation and USCIS finds good cause — this is the point
                      at which talking to an immigration attorney stops being
                      optional.
                    </p>
                  )}
                </div>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                    If you file and get a receipt notice
                  </p>
                  <p className="mt-1 text-sm text-ink-700">
                    Form I-797C extends your conditional resident status and your
                    work authorisation by{" "}
                    <strong className="text-ink-900">
                      {result.extensionMonths} months
                    </strong>
                    , to about{" "}
                    <strong className="text-ink-900">
                      {longDate(result.extensionEnds)}
                    </strong>
                    . The receipt notice plus your expired card is what you show
                    an employer or a border officer.
                  </p>
                </div>

                {result.status !== "expired" && (
                  <button
                    type="button"
                    onClick={downloadIcs}
                    className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                  >
                    Add the window-opens date to my calendar (.ics)
                  </button>
                )}
              </ResultCard>

              <EmailMyResult
                subject="My I-751 filing window"
                intro="Form I-751 window, worked out from the date on my conditional green card."
                lines={[
                  { label: "Card expires", value: longDate(result.deadline) },
                  { label: "Filing window opens", value: longDate(result.opens) },
                  { label: "Last day to file", value: longDate(result.deadline) },
                  {
                    label: "Receipt notice extends status to",
                    value: `${longDate(result.extensionEnds)} (${result.extensionMonths} months)`,
                  },
                  {
                    label: "Filing fee",
                    value: `${I751_FACTS.onlineFee} online / ${I751_FACTS.paperFee} paper`,
                  },
                ]}
                footnote={`Confirm on the official page before filing: ${I751_SOURCES.form}`}
              />
            </>
          )}

          <p className="text-xs leading-relaxed text-ink-400">
            Educational tool, not legal advice. USCIS publishes its own{" "}
            <a
              href={I751_SOURCES.whenToFile}
              target="_blank"
              rel="nofollow noopener"
              className="text-brand-600 underline"
            >
              filing-date calculator
            </a>{" "}
            — check yours against it before you send anything. For how long
            adjudication is currently taking, use the{" "}
            <a
              href={I751_SOURCES.processingTimes}
              target="_blank"
              rel="nofollow noopener"
              className="text-brand-600 underline"
            >
              official processing-times tool
            </a>{" "}
            for your office, or our{" "}
            <Link href="/tools/uscis-processing-delay-checker" className="text-brand-600 underline">
              delay checker
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
