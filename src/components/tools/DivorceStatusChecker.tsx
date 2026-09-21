"use client";

import { useState } from "react";
import Link from "next/link";
import InputCard, { Field, fieldClass } from "@/components/tools/InputCard";
import ResultCard from "@/components/tools/ResultCard";
import {
  statusImpactRows,
  divorceStages,
  SHORT_DISCLAIMER,
} from "@/data/divorceImmigrationData";

/**
 * "What happens to my status" checker.
 *
 * Both dimensions come from src/data/divorceImmigrationData.ts — the status
 * rows and the stage definitions — so the wording that appears here is the same
 * wording the page's tables carry, and there is no second place to update when
 * a rule changes.
 *
 * Deliberately conservative: where the honest answer is "take advice before
 * anyone files", it says that rather than producing a confident-looking plan.
 * Nothing is stored or sent.
 */

const URGENCY_TONE: Record<string, "attention" | "caution" | "positive" | "neutral"> = {
  High: "attention",
  "Low for you": "caution",
  Low: "positive",
  None: "positive",
};

export default function DivorceStatusChecker() {
  const [statusIndex, setStatusIndex] = useState("");
  const [stageId, setStageId] = useState(divorceStages[0].id);

  const row = statusIndex === "" ? null : statusImpactRows[Number(statusIndex)];
  const stage = divorceStages.filter((s) => s.id === stageId)[0];
  const tone = row ? URGENCY_TONE[row.urgency] ?? "neutral" : "neutral";

  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid gap-5 lg:grid-cols-2">
        <InputCard eyebrow="Two questions" title="Your status, and where the divorce has got to">
          <Field
            label="What immigration status do you hold?"
            help="Your own status, not your spouse's."
          >
            <select
              value={statusIndex}
              onChange={(e) => setStatusIndex(e.target.value)}
              className={fieldClass}
            >
              <option value="">Choose your status…</option>
              {statusImpactRows.map((r, i) => (
                <option key={r.status} value={String(i)}>
                  {r.status}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Where has the divorce got to?"
            help="This matters more than people expect — several options close the moment a decree is final."
          >
            <select
              value={stageId}
              onChange={(e) => setStageId(e.target.value)}
              className={fieldClass}
            >
              {divorceStages.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>

          <p className="rounded-xl bg-ink-900/[0.03] px-3.5 py-3 text-xs leading-relaxed text-ink-500">
            Nothing is stored or sent. This is a general orientation, not advice
            on your own facts — and this is an area where the facts change the
            answer.
          </p>
        </InputCard>

        <div className="space-y-5">
          {!row ? (
            <ResultCard
              tone="neutral"
              eyebrow="What happens to your status"
              title="Choose your status to see the general position"
            >
              <p>
                You will get the general effect of a divorce on that status, how
                time-sensitive it is, and what typically comes next.
              </p>
            </ResultCard>
          ) : (
            <>
              <ResultCard
                tone={tone}
                eyebrow={`${row.status} · ${stage.short}`}
                title={
                  row.urgency === "High"
                    ? "Time-sensitive — take advice now"
                    : row.urgency === "None"
                      ? "Your status is not affected"
                      : "Generally stable, with things to check"
                }
                badge={`Urgency: ${row.urgency}`}
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                    What a divorce generally does to this status
                  </p>
                  <p className="mt-1 text-sm text-ink-700">{row.effect}</p>
                </div>

                <div className="rounded-xl border border-ink-900/5 bg-white px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                    At this stage — {stage.short.toLowerCase()}
                  </p>
                  <p className="mt-1 text-sm text-ink-700">{stage.window}</p>
                </div>

                <div className="rounded-xl border border-brand-200 bg-brand-50/50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                    Next step to consider
                  </p>
                  <p className="mt-1 text-sm text-ink-700">{row.next}</p>
                </div>
              </ResultCard>

              {row.status.indexOf("Conditional") === 0 && (
                <ResultCard
                  tone="info"
                  eyebrow="Your route"
                  title="Form I-751 with a waiver of the joint filing requirement"
                >
                  <p>
                    You file the same form, alone, asking USCIS to waive the
                    requirement that both spouses sign. The test is whether the
                    marriage was entered into in good faith — not whether it
                    lasted.
                  </p>
                  <p>
                    The detail that matters most here:{" "}
                    <strong>
                      the 90-day filing window does not apply to a waiver filing
                    </strong>
                    . You are not shut out by a date that has passed, and you do
                    not have to wait for one that has not arrived.{" "}
                    <Link href="/uscis/forms/i-751" className="text-brand-600 underline">
                      The I-751 guide
                    </Link>{" "}
                    covers the waiver grounds, the evidence and the window
                    calculator.
                  </p>
                </ResultCard>
              )}

              <p className="text-xs leading-relaxed text-ink-400">{SHORT_DISCLAIMER}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
