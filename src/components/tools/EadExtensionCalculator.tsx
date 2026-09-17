"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import InputCard, { Field, fieldClass } from "@/components/tools/InputCard";
import ResultCard from "@/components/tools/ResultCard";
import {
  evaluateEadExtension,
  earliestFilingDate,
  REPEAL_DATE,
  RENEWAL_WINDOW_DAYS,
} from "@/lib/calc/eadAutoExtension";
import { parseIsoDate } from "@/lib/calc/i751Window";
import {
  eadProcessingData,
  eadAutoExtensionRuleStatus as RULE,
  spouseIncidentToStatus as SPOUSE,
  type EadCategory,
} from "@/data/eadProcessingData";

/**
 * Auto-extension eligibility and end-date calculator.
 *
 * One date decides almost everything — the date USCIS RECEIVED the renewal —
 * so the tool leads with it and says plainly that the posting date is not the
 * same thing. Runs entirely in the browser; nothing is stored or sent.
 */

const longDate = (iso: string | null) => {
  if (!iso) return "—";
  const ts = parseIsoDate(iso);
  if (ts === null) return iso;
  return new Date(ts).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
};

export default function EadExtensionCalculator() {
  const categories = eadProcessingData.categories as EadCategory[];
  const [categoryKey, setCategoryKey] = useState("c26");
  const [filedDate, setFiledDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const result = useMemo(
    () =>
      evaluateEadExtension({
        categoryKey,
        filedDate,
        expiryDate,
        today: Date.now(),
      }),
    [categoryKey, filedDate, expiryDate]
  );

  const earliest = earliestFilingDate(expiryDate);

  const tone =
    !result
      ? "neutral"
      : result.basis === "incident-to-status"
        ? "positive"
        : result.hasExtension
          ? "positive"
          : result.daysUntilCoverEnds < 0
            ? "attention"
            : "caution";

  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid gap-5 lg:grid-cols-2">
        <InputCard eyebrow="Three inputs" title="Your category and two dates">
          <Field
            label="Eligibility category"
            help="Printed on the front of the card, under 'Category' — for example (c)(26) for an H-4 spouse."
          >
            <select
              value={categoryKey}
              onChange={(e) => setCategoryKey(e.target.value)}
              className={fieldClass}
            >
              {categories.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.code} — {c.label}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Date USCIS received your renewal"
            help={`The RECEIPT date on your I-797C, not the day you posted it. This one date decides almost everything: the cut-off is ${REPEAL_DATE}.`}
          >
            <input
              type="date"
              value={filedDate}
              onChange={(e) => setFiledDate(e.target.value)}
              className={fieldClass}
            />
          </Field>

          <Field
            label="Expiry date on your current card"
            help="The 'Card Expires' date on the front."
          >
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className={fieldClass}
            />
          </Field>

          {earliest && (
            <p className="rounded-xl border border-brand-200 bg-brand-50/50 px-3.5 py-3 text-xs leading-relaxed text-ink-700">
              USCIS generally accepts a renewal from{" "}
              <strong>{longDate(earliest)}</strong> — {RENEWAL_WINDOW_DAYS} days
              before that expiry. With no automatic extension to fall back on,
              filing on the first day of that window is the entire buffer you get.
            </p>
          )}

          <p className="rounded-xl bg-ink-900/[0.03] px-3.5 py-3 text-xs leading-relaxed text-ink-500">
            Nothing is stored or sent. These dates stay in your browser.
          </p>
        </InputCard>

        <div className="space-y-5">
          {!result ? (
            <ResultCard
              tone="neutral"
              eyebrow="Your authorisation"
              title="Enter both dates to see where your cover ends"
            >
              <p>
                You will get whether any extension applies, on what legal basis,
                and the exact last day it covers.
              </p>
            </ResultCard>
          ) : (
            <>
              <ResultCard
                tone={tone}
                eyebrow={`${result.category.code} — ${result.category.label}`}
                title={result.headline}
                badge={
                  result.basis === "incident-to-status"
                    ? "No EAD needed"
                    : result.hasExtension
                      ? `+${result.extensionDays} days`
                      : "No extension"
                }
              >
                {result.basis === "incident-to-status" ? (
                  <p>
                    E-1, E-2, E-3 and L-2 dependent spouses have been employment
                    authorised <em>incident to status</em> since{" "}
                    {longDate(SPOUSE.sinceDate)}. An unexpired I-94 bearing the
                    spouse code ({SPOUSE.codes.join(", ")}) is List C evidence for
                    Form I-9, so you may work without a valid EAD at all. The
                    renewal-gap problem that now hits H-4 spouses largely does not
                    apply to you — and paying the I-765 fee for a card you can work
                    without is a choice, not a requirement.
                  </p>
                ) : (
                  <>
                    <dl className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-ink-900/[0.03] px-3 py-2.5">
                        <dt className="text-xs font-semibold text-ink-500">
                          Card expires
                        </dt>
                        <dd className="text-base font-black text-ink-900">
                          {longDate(result.expiryDate)}
                        </dd>
                      </div>
                      <div className="rounded-xl bg-ink-900/[0.03] px-3 py-2.5">
                        <dt className="text-xs font-semibold text-ink-500">
                          Authorisation ends
                        </dt>
                        <dd className="text-base font-black text-ink-900">
                          {longDate(result.extensionEnds ?? result.expiryDate)}
                        </dd>
                        {result.hasExtension && (
                          <p className="mt-0.5 text-[0.7rem] text-ink-400">
                            {result.extensionDays} days past the card
                          </p>
                        )}
                      </div>
                    </dl>

                    <p className="rounded-xl border border-ink-900/5 bg-white px-4 py-3 text-sm">
                      {result.daysUntilCoverEnds >= 0 ? (
                        <>
                          <strong className="text-ink-900">
                            {result.daysUntilCoverEnds.toLocaleString("en-US")} days
                          </strong>{" "}
                          of authorisation left. Your employer must reverify you on
                          or before that date.
                        </>
                      ) : (
                        <>
                          Your authorisation ended{" "}
                          <strong className="text-ink-900">
                            {Math.abs(result.daysUntilCoverEnds).toLocaleString("en-US")} days
                          </strong>{" "}
                          ago. Until the new card arrives, there is nothing for an
                          employer to reverify with, and employment must be
                          suspended.
                        </>
                      )}
                    </p>

                    {result.basis === "none" && (
                      <p className="rounded-xl border border-rose-200 bg-rose-50/60 px-4 py-3 text-xs leading-relaxed text-rose-900">
                        <strong className="font-semibold">
                          An expired card plus a receipt notice is not enough.
                        </strong>{" "}
                        For a renewal received on or after {REPEAL_DATE}, the Form
                        I-797C receipt is not acceptable evidence of continued
                        authorisation, so there is no document combination that
                        keeps you working past the expiry date. Ask HR what their
                        policy is — unpaid leave or termination — before you are in
                        the window, not after.
                      </p>
                    )}

                    {result.basis === "stem-pending" && result.category.pendingAuthCite && (
                      <p className="rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-3 text-xs leading-relaxed text-emerald-900">
                        This comes from {result.category.pendingAuthCite}, which is
                        a different provision from the renewal mechanism the October
                        2025 rule removed — so it was not affected by it. It applies
                        only to a <strong>timely-filed</strong> STEM extension and
                        only while the application is pending.
                      </p>
                    )}

                    {result.basis === "not-timely" && (
                      <p className="rounded-xl border border-rose-200 bg-rose-50/60 px-4 py-3 text-xs leading-relaxed text-rose-900">
                        Nothing extends a card that had already expired when the
                        renewal reached USCIS. Speak to an immigration attorney
                        about your options, and do not work until a new card is in
                        hand.
                      </p>
                    )}
                  </>
                )}
              </ResultCard>

              <p className="text-xs leading-relaxed text-ink-400">
                {RULE.planningAdvice} The removal was issued as an interim final
                rule and is being litigated, but no court has restored the
                automatic extension nationwide.{" "}
                <Link href="/ead-processing-time" className="text-brand-600 underline">
                  Current processing ranges
                </Link>{" "}
                will tell you whether your filing date left enough room.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
