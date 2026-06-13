"use client";

import { useMemo, useState } from "react";
import {
  ResultPanel,
  Stat,
  Row,
  Callout,
} from "@/components/calculators/ui";
import {
  computeGpa,
  gradeScale,
  type Course,
  type CourseLevel,
} from "@/lib/education-data";

let nextId = 100;
const mkId = () => String(nextId++);

const LEVELS: { value: CourseLevel; label: string }[] = [
  { value: "regular", label: "Regular" },
  { value: "honors", label: "Honors (+0.5)" },
  { value: "ap-ib", label: "AP / IB (+1.0)" },
];

const seed: Course[] = [
  { id: "1", name: "English", grade: "A", credits: 1, level: "regular" },
  { id: "2", name: "AP Calculus", grade: "B+", credits: 1, level: "ap-ib" },
  { id: "3", name: "Honors Chemistry", grade: "A−", credits: 1, level: "honors" },
  { id: "4", name: "World History", grade: "B", credits: 1, level: "regular" },
];

const bandTone = {
  excellent: "good",
  good: "good",
  fair: "warn",
  low: "bad",
} as const;

const bandLabel = {
  excellent: "Excellent — 3.5+",
  good: "Good — 3.0 to 3.5",
  fair: "Fair — 2.0 to 2.9",
  low: "Below 2.0 — at risk",
} as const;

export default function GpaCalc() {
  const [courses, setCourses] = useState<Course[]>(seed);

  const result = useMemo(() => computeGpa(courses), [courses]);

  const update = (id: string, patch: Partial<Course>) =>
    setCourses((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const remove = (id: string) =>
    setCourses((cs) => cs.filter((c) => c.id !== id));
  const add = () =>
    setCourses((cs) => [
      ...cs,
      { id: mkId(), name: "", grade: "A", credits: 1, level: "regular" },
    ]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Course table */}
        <div className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
              Your courses
            </p>
            <button
              type="button"
              onClick={add}
              className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
            >
              + Add course
            </button>
          </div>

          <div className="space-y-3">
            {courses.map((c) => (
              <div
                key={c.id}
                className="grid grid-cols-[1fr_auto] gap-2 rounded-xl border border-ink-900/5 bg-slate-50/60 p-3 sm:grid-cols-[1fr_5rem_5rem_auto] sm:items-center"
              >
                <input
                  value={c.name}
                  placeholder="Course name"
                  onChange={(e) => update(c.id, { name: e.target.value })}
                  className="col-span-2 rounded-lg border border-ink-900/10 bg-white px-2.5 py-2 text-sm text-ink-900 outline-none focus:border-brand-500 sm:col-span-1"
                />
                <select
                  value={c.grade}
                  onChange={(e) => update(c.id, { grade: e.target.value })}
                  className="rounded-lg border border-ink-900/10 bg-white px-2 py-2 text-sm text-ink-900 outline-none focus:border-brand-500"
                  aria-label="Letter grade"
                >
                  {gradeScale.map((g) => (
                    <option key={g.letter} value={g.letter}>
                      {g.letter}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={c.credits}
                  onChange={(e) =>
                    update(c.id, { credits: parseFloat(e.target.value) || 0 })
                  }
                  className="rounded-lg border border-ink-900/10 bg-white px-2 py-2 text-sm text-ink-900 outline-none focus:border-brand-500"
                  aria-label="Credit hours"
                />
                <div className="col-span-2 flex items-center gap-2 sm:col-span-1">
                  <select
                    value={c.level}
                    onChange={(e) =>
                      update(c.id, { level: e.target.value as CourseLevel })
                    }
                    className="w-full rounded-lg border border-ink-900/10 bg-white px-2 py-2 text-xs text-ink-900 outline-none focus:border-brand-500"
                    aria-label="Course level"
                  >
                    {LEVELS.map((l) => (
                      <option key={l.value} value={l.value}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => remove(c.id)}
                    aria-label="Remove course"
                    className="flex h-8 w-8 flex-none items-center justify-center rounded-lg text-ink-400 hover:bg-rose-50 hover:text-rose-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
            {courses.length === 0 && (
              <p className="py-6 text-center text-sm text-ink-400">
                Add a course to get started.
              </p>
            )}
          </div>
          <p className="mt-3 text-xs text-ink-400">
            Grade columns: letter · credit hours · course level. Honors adds
            +0.5 and AP/IB adds +1.0 to the weighted GPA only.
          </p>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <ResultPanel
            title="Your GPA"
            accent="from-violet-600 to-purple-600"
          >
            <div className="grid grid-cols-2 gap-4">
              <Stat
                label="Unweighted"
                value={result.totalCredits ? result.unweighted.toFixed(2) : "—"}
                sub="4.0 scale"
                big
                tone={bandTone[result.band]}
              />
              <Stat
                label="Weighted"
                value={result.totalCredits ? result.weighted.toFixed(2) : "—"}
                sub="with AP/Honors"
                big
              />
            </div>
            <Row label="Total credit hours" value={String(result.totalCredits)} />
            <Callout
              tone={
                result.band === "low"
                  ? "bad"
                  : result.band === "fair"
                    ? "note"
                    : "good"
              }
            >
              {bandLabel[result.band]}
            </Callout>
          </ResultPanel>
        </div>
      </div>
    </div>
  );
}
