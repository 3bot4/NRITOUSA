"use client";

import { useEffect, useMemo, useState } from "react";
import { ResultPanel, Stat, Row, Callout } from "@/components/calculators/ui";
import { satPercentile, satFit } from "@/lib/education-data";
import { trackToolResultView } from "@/lib/analytics";

function ScoreSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-ink-800">{label}</span>
        <span className="text-lg font-extrabold tabular-nums text-brand-600">
          {value}
        </span>
      </div>
      <input
        type="range"
        min={200}
        max={800}
        step={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-brand-600"
      />
      <div className="mt-1 flex justify-between text-[11px] text-ink-400">
        <span>200</span>
        <span>800</span>
      </div>
    </label>
  );
}

const bandTone = {
  reach: "good",
  strong: "good",
  solid: "good",
  broad: "note",
  transfer: "note",
} as const;

export default function SatScoreCalc() {
  const [math, setMath] = useState(650);
  const [rw, setRw] = useState(640);

  const total = math + rw;
  const { pct, fit } = useMemo(
    () => ({ pct: satPercentile(total), fit: satFit(total) }),
    [total]
  );

  // Send only the coarse college-fit band — never the entered scores.
  useEffect(() => {
    const t = setTimeout(
      () =>
        trackToolResultView({
          tool_slug: "sat-guide",
          route: "/education/sat-guide",
          result_status: fit.band,
        }),
      1500
    );
    return () => clearTimeout(t);
  }, [fit.band]);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card sm:p-7">
          <p className="mb-5 text-xs font-bold uppercase tracking-wider text-ink-400">
            Move the sliders
          </p>
          <div className="space-y-7">
            <ScoreSlider label="Math" value={math} onChange={setMath} />
            <ScoreSlider
              label="Reading & Writing"
              value={rw}
              onChange={setRw}
            />
          </div>
          <p className="mt-6 text-xs leading-relaxed text-ink-400">
            The digital SAT (2024+) has two sections — Reading &amp; Writing and
            Math — each scored 200–800, for a 400–1600 total. Percentiles are
            approximate national figures from College Board 2024 data.
          </p>
        </div>

        <div className="space-y-4">
          <ResultPanel
            title="Your SAT result"
            accent="from-rose-600 to-pink-600"
          >
            <Stat
              label="Total score"
              value={String(total)}
              sub="out of 1600"
              big
            />
            <Row label="National percentile" value={`${pct}th`} />
            <Row
              label="Meaning"
              value={`Higher than ~${pct}% of test-takers`}
            />
            <div className="pt-1">
              <p className="text-sm text-ink-500">College fit</p>
              <p className="text-lg font-extrabold tracking-tight text-ink-900">
                {fit.tier}
              </p>
            </div>
            <Callout tone={bandTone[fit.band]}>{fit.blurb}</Callout>
            <Row label="Example schools" value={fit.examples} />
          </ResultPanel>
          <p className="px-1 text-xs leading-relaxed text-ink-400">
            Test scores are one factor. GPA, course rigor, essays, and
            extracurriculars all matter — and many top schools are now
            test-optional. Use this as a directional guide, not a verdict.
          </p>
        </div>
      </div>
    </div>
  );
}
