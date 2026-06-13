"use client";

import { useMemo, useState } from "react";
import {
  CalcGrid,
  ResultPanel,
  Stat,
  Row,
  Callout,
  SelectField,
  NumberField,
  usd,
  num,
} from "@/components/calculators/ui";
import {
  collegeTypes,
  projectTuition,
  FED_LOAN_RATE,
} from "@/lib/education-data";

export default function TuitionCalc() {
  const [typeKey, setTypeKey] = useState("public-in");
  const [years, setYears] = useState("4");
  const [inflation, setInflation] = useState("4");
  const [aid, setAid] = useState("0");
  const [term, setTerm] = useState("10");

  const result = useMemo(
    () =>
      projectTuition({
        typeKey,
        years: num(years) || 4,
        inflation: (num(inflation) || 0) / 100,
        aidPerYear: num(aid),
        loanTermYears: num(term) || 10,
      }),
    [typeKey, years, inflation, aid, term]
  );

  return (
    <div className="mx-auto max-w-5xl">
      <CalcGrid
        inputs={
          <>
            <SelectField
              label="College type"
              value={typeKey}
              onChange={setTypeKey}
              options={collegeTypes.map((t) => ({
                value: t.key,
                label: `${t.label} — ${usd(t.tuition)}/yr`,
              }))}
            />
            <SelectField
              label="Years of study"
              value={years}
              onChange={setYears}
              options={["2", "3", "4", "5", "6"].map((y) => ({
                value: y,
                label: `${y} years`,
              }))}
            />
            <NumberField
              label="Annual tuition inflation"
              value={inflation}
              onChange={setInflation}
              suffix="%"
              hint="College costs have risen ~3–5%/yr historically. Default 4%."
            />
            <NumberField
              label="Financial aid / scholarships per year"
              value={aid}
              onChange={setAid}
              prefix="$"
              hint="Grants and scholarships you don't repay (optional)."
            />
            <NumberField
              label="Loan repayment term"
              value={term}
              onChange={setTerm}
              suffix="yrs"
              hint={`Monthly payment assumes the ${(
                FED_LOAN_RATE * 100
              ).toFixed(1)}% federal undergrad rate.`}
            />
          </>
        }
        results={
          <>
            <ResultPanel
              title="Total cost projection"
              accent="from-emerald-600 to-teal-600"
            >
              <Stat
                label="Total cost after aid"
                value={usd(result.netTotal)}
                sub={`${years}-year estimate`}
                big
                tone={result.netTotal > 150000 ? "bad" : "default"}
              />
              <Row label="Tuition (all years)" value={usd(result.totalTuition)} />
              <Row
                label="Room & board (all years)"
                value={
                  result.totalRoomBoard > 0
                    ? usd(result.totalRoomBoard)
                    : "Commuter / N/A"
                }
              />
              <Row label="Books & fees (all years)" value={usd(result.totalBooks)} />
              <Row label="Gross total (before aid)" value={usd(result.grossTotal)} />
              <Row label="Financial aid applied" value={`− ${usd(result.totalAid)}`} />
            </ResultPanel>

            <ResultPanel
              title="If you borrow the full net cost"
              accent="from-amber-600 to-orange-600"
            >
              <Stat
                label="Estimated monthly loan payment"
                value={usd(result.monthlyLoanPayment)}
                sub={`over ${term} years at ${(FED_LOAN_RATE * 100).toFixed(1)}%`}
                big
                tone="warn"
              />
              <Callout tone="note">
                Most families don&apos;t borrow the full amount — savings, 529
                plans, work-study, and merit aid reduce it. Federal undergrad
                loans are also capped at $5,500–$7,500/year, so large balances
                usually require parent (PLUS) or private loans.
              </Callout>
            </ResultPanel>
          </>
        }
      />
    </div>
  );
}
