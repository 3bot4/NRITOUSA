"use client";

import { useState } from "react";
import {
  NumberField,
  SelectField,
  CalcGrid,
  ResultPanel,
  Stat,
  Row,
  Callout,
  CheckList,
  usd,
  pct,
  num,
} from "./ui";

// 2025 IRS Roth IRA MAGI phase-out ranges and contribution limits.
const RANGES: Record<string, [number, number]> = {
  single: [150000, 165000],
  mfj: [236000, 246000],
  mfs: [0, 10000],
};
const LIMIT_UNDER_50 = 7000;
const LIMIT_50_PLUS = 8000;

export default function BackdoorRothCalculator() {
  const [magi, setMagi] = useState("200000");
  const [status, setStatus] = useState("single");
  const [age, setAge] = useState("35");
  const [tradBal, setTradBal] = useState("0");

  const income = num(magi);
  const [low, high] = RANGES[status];
  const limit = num(age) >= 50 ? LIMIT_50_PLUS : LIMIT_UNDER_50;
  const preTax = num(tradBal);

  let directAllowed = 0;
  let verdict: "full" | "partial" | "backdoor" = "full";
  if (income <= low) {
    directAllowed = limit;
    verdict = "full";
  } else if (income >= high) {
    directAllowed = 0;
    verdict = "backdoor";
  } else {
    const reduction = limit * ((income - low) / (high - low));
    directAllowed = Math.max(0, Math.round((limit - reduction) / 10) * 10);
    verdict = "partial";
  }

  // Pro-rata rule: nondeductible contribution converted alongside pre-tax IRA $
  const conversion = limit; // assume contributing the full nondeductible amount
  const taxablePct = preTax > 0 ? (preTax / (preTax + conversion)) * 100 : 0;
  const taxableOnConversion = conversion * (taxablePct / 100);

  return (
    <CalcGrid
      inputs={
        <>
          <NumberField
            label="Modified Adjusted Gross Income (MAGI)"
            value={magi}
            onChange={setMagi}
            prefix="$"
          />
          <SelectField
            label="Filing status"
            value={status}
            onChange={setStatus}
            options={[
              { value: "single", label: "Single / Head of household" },
              { value: "mfj", label: "Married filing jointly" },
              { value: "mfs", label: "Married filing separately" },
            ]}
          />
          <NumberField
            label="Your age"
            value={age}
            onChange={setAge}
            suffix="yrs"
            hint="50+ gets a higher contribution limit."
          />
          <NumberField
            label="Existing pre-tax IRA balance"
            value={tradBal}
            onChange={setTradBal}
            prefix="$"
            hint="Traditional / SEP / SIMPLE IRA totals. Triggers the pro-rata rule."
          />
        </>
      }
      results={
        <>
          <ResultPanel
            title="Roth IRA eligibility"
            accent={
              verdict === "full"
                ? "from-emerald-500 to-teal-600"
                : verdict === "partial"
                  ? "from-amber-500 to-orange-600"
                  : "from-violet-500 to-purple-600"
            }
          >
            {verdict === "full" && (
              <Stat label="You can contribute directly" value={usd(directAllowed)} big tone="good" />
            )}
            {verdict === "partial" && (
              <Stat label="Reduced direct contribution" value={usd(directAllowed)} big tone="warn" />
            )}
            {verdict === "backdoor" && (
              <Stat label="Direct contribution" value={usd(0)} big tone="bad" sub="Use the backdoor Roth instead" />
            )}
            <Row label="Phase-out range (2025)" value={`${usd(low)} – ${usd(high)}`} />
            <Row label="Your MAGI" value={usd(income)} />
            <Row label="Max contribution (your age)" value={usd(limit)} />
          </ResultPanel>

          {verdict !== "full" && (
            <ResultPanel title="Backdoor Roth — pro-rata check" accent="from-violet-500 to-purple-600">
              {preTax > 0 ? (
                <>
                  <Stat label="Taxable portion of conversion" value={pct(taxablePct)} tone="warn" />
                  <Row label="Estimated taxable amount" value={usd(taxableOnConversion)} />
                  <Callout tone="note">
                    Your ${preTax.toLocaleString()} pre-tax IRA balance triggers
                    the <strong>pro-rata rule</strong> — {pct(taxablePct)} of your
                    conversion would be taxable. Consider rolling pre-tax IRA
                    funds into a 401(k) first to clear it.
                  </Callout>
                </>
              ) : (
                <Callout tone="good">
                  No pre-tax IRA balance — you can do a <strong>clean</strong>{" "}
                  backdoor Roth with no pro-rata tax.
                </Callout>
              )}
            </ResultPanel>
          )}

          <ResultPanel title="Clean backdoor Roth checklist" accent="from-brand-600 to-brand-500">
            <CheckList
              items={[
                "Clear any pre-tax Traditional/SEP/SIMPLE IRA (roll into a 401(k))",
                "Contribute (nondeductible) to a Traditional IRA",
                "Convert to Roth soon after — keep the gap small",
                "File Form 8606 to report the nondeductible basis",
                "Avoid contributing to pre-tax IRAs later in the year",
              ]}
            />
          </ResultPanel>

          <p className="text-xs leading-relaxed text-ink-400">
            Uses 2025 IRS limits; 2026 figures adjust for inflation. The
            backdoor Roth is a legal strategy but the pro-rata rule and the
            step-transaction doctrine matter. Confirm with a tax professional.
          </p>
        </>
      }
    />
  );
}
