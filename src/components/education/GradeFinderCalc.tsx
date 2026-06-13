"use client";

import { useMemo, useState } from "react";
import {
  CalcGrid,
  ResultPanel,
  Stat,
  Row,
  Callout,
  SelectField,
} from "@/components/calculators/ui";
import { findGrade, stateCutoffs } from "@/lib/education-data";

const todayIso = () => new Date().toISOString().slice(0, 10);

export default function GradeFinderCalc() {
  const [dob, setDob] = useState("2018-06-15");
  const [stateName, setStateName] = useState("California");

  const cutoff =
    stateCutoffs.find((s) => s.state === stateName) ?? stateCutoffs[0];

  const result = useMemo(() => {
    const d = new Date(dob + "T00:00:00");
    if (isNaN(d.getTime())) return null;
    return findGrade(d, new Date(todayIso() + "T00:00:00"), cutoff);
  }, [dob, cutoff]);

  return (
    <div className="mx-auto max-w-5xl">
      <CalcGrid
        inputs={
          <>
            <label className="block">
              <span className="text-sm font-semibold text-ink-800">
                Child&apos;s date of birth
              </span>
              <input
                type="date"
                value={dob}
                max={todayIso()}
                onChange={(e) => setDob(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
            </label>

            <SelectField
              label="State you'll enroll in"
              value={stateName}
              onChange={setStateName}
              options={stateCutoffs.map((s) => ({
                value: s.state,
                label: s.state,
              }))}
              hint={`Kindergarten cutoff: ${cutoff.label}`}
            />

            {cutoff.note && (
              <Callout tone="note">{cutoff.note}</Callout>
            )}
          </>
        }
        results={
          <>
            <ResultPanel
              title="Estimated US grade level"
              accent="from-sky-600 to-blue-600"
            >
              {result ? (
                <>
                  <Stat
                    label="Your child would be placed in"
                    value={result.grade}
                    sub={result.stage}
                    big
                  />
                  <Row
                    label="Current age"
                    value={`${result.ageYears} yrs ${result.ageMonths} mo`}
                  />
                  <Row label="School stage" value={result.stage} />
                  <Row
                    label={`${cutoff.state} kindergarten cutoff`}
                    value={result.cutoffLabel}
                  />
                  <Callout
                    tone={result.meetsCutoff ? "good" : "note"}
                  >
                    {result.note}
                  </Callout>
                </>
              ) : (
                <p className="text-sm text-ink-500">
                  Enter a valid date of birth to see the estimated grade.
                </p>
              )}
            </ResultPanel>
            <p className="px-1 text-xs leading-relaxed text-ink-400">
              Placement is an estimate. US districts assess newly arrived
              students individually and may place a child a grade up or down
              based on prior schooling, English-language level, and birthdate.
              Confirm with your local school district.
            </p>
          </>
        }
      />
    </div>
  );
}
