"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import InputCard, { Field, fieldClass } from "@/components/tools/InputCard";
import ResultCard from "@/components/tools/ResultCard";
import { trackToolUsed } from "@/lib/analytics";
import {
  TIMELINE_STAGES,
  TIMELINE_TOTAL,
  totalWeeksLabel,
  OCI_DATA_AS_OF,
  OCI_TOOLS,
} from "@/lib/oci/config";

function addDays(d: Date, days: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + days);
  return r;
}

function fmt(d: Date): string {
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function OciTimelineCalculator() {
  const [startIso, setStartIso] = useState<string>(todayIso());

  const schedule = useMemo(() => {
    const start = new Date(`${startIso}T00:00:00`);
    if (isNaN(start.getTime())) return null;
    let minCursor = 0;
    let maxCursor = 0;
    const rows = TIMELINE_STAGES.map((s) => {
      minCursor += s.minDays;
      maxCursor += s.maxDays;
      return {
        stage: s,
        earliest: addDays(start, minCursor),
        latest: addDays(start, maxCursor),
      };
    });
    return {
      start,
      rows,
      earliest: addDays(start, TIMELINE_TOTAL.minDays),
      latest: addDays(start, TIMELINE_TOTAL.maxDays),
    };
  }, [startIso]);

  const tracked = useRef(false);
  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackToolUsed({
      tool_name: "oci-timeline-calculator",
      result_type: "estimate_shown",
      category: "oci",
      page_slug: OCI_TOOLS.timeline.path,
    });
  }, []);

  return (
    <ToolLayout
      inputs={
        <InputCard eyebrow="Your plan" title="When will you submit?">
          <Field
            label="Application / VFS submission date"
            help="Use the date you expect VFS to receive your documents."
          >
            <input
              type="date"
              className={fieldClass}
              value={startIso}
              onChange={(e) => setStartIso(e.target.value)}
            />
          </Field>
          <p className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-xs text-ink-600">
            OCI involves a two-stage government clearance (consulate + Ministry
            of Home Affairs in India), so totals run longer than a passport
            re-issue. Estimates summarised as of{" "}
            <time dateTime={OCI_DATA_AS_OF}>{OCI_DATA_AS_OF}</time>; individual
            cases vary widely.
          </p>
        </InputCard>
      }
      results={
        <div className="space-y-6">
          <ResultCard
            tone="info"
            eyebrow="Estimated total processing"
            title={totalWeeksLabel()}
            badge={schedule ? `By ${fmt(schedule.latest)}` : undefined}
          >
            {schedule ? (
              <p>
                If VFS receives your documents on{" "}
                <strong className="text-ink-700">{fmt(schedule.start)}</strong>,
                expect your OCI back between{" "}
                <strong className="text-ink-700">{fmt(schedule.earliest)}</strong>{" "}
                and{" "}
                <strong className="text-ink-700">{fmt(schedule.latest)}</strong>{" "}
                in a typical case.
              </p>
            ) : (
              <p>Pick a valid submission date to see your timeline.</p>
            )}
          </ResultCard>

          {schedule && (
            <ResultCard tone="neutral" eyebrow="Stage by stage" title="Your timeline">
              <ol className="space-y-4">
                {schedule.rows.map((r, i) => (
                  <li key={r.stage.id} className="flex gap-3">
                    <span
                      aria-hidden
                      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700"
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink-800">
                        {r.stage.label}
                      </p>
                      <p className="text-xs text-ink-400">{r.stage.description}</p>
                      <p className="mt-1 text-xs font-medium text-brand-700">
                        Reached ~{fmt(r.earliest)} – {fmt(r.latest)}
                        <span className="text-ink-400">
                          {" "}
                          ({r.stage.minDays}–{r.stage.maxDays} days)
                        </span>
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </ResultCard>
          )}
        </div>
      }
    />
  );
}
