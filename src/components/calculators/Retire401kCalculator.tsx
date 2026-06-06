"use client";

import { useState } from "react";
import {
  NumberField,
  CalcGrid,
  ResultPanel,
  Stat,
  Row,
  Callout,
  usd,
  num,
} from "./ui";

/**
 * Compares cashing out a 401(k) on leaving the US (penalty + withholding)
 * vs leaving it to compound and withdrawing in retirement. Estimate only.
 */
export default function Retire401kCalculator() {
  const [balance, setBalance] = useState("100000");
  const [age, setAge] = useState("35");
  const [bracket, setBracket] = useState("30");
  const [years, setYears] = useState("20");
  const [ret, setRet] = useState("7");

  const bal = num(balance);
  const a = num(age);
  const taxRate = Math.min(100, Math.max(0, num(bracket))) / 100;
  const yrs = Math.max(0, num(years));
  const r = num(ret) / 100;

  // Option A — cash out now
  const penaltyRate = a < 59.5 ? 0.1 : 0;
  const penalty = bal * penaltyRate;
  const taxNow = bal * taxRate;
  const netNow = Math.max(0, bal - penalty - taxNow);
  const lostNow = penalty + taxNow;

  // Option B — leave to compound, withdraw later
  const futureGross = bal * Math.pow(1 + r, yrs);
  const futureAfterTax = futureGross * (1 - taxRate);
  // What the cashed-out amount would grow to if reinvested elsewhere at same return
  const netNowGrown = netNow * Math.pow(1 + r, yrs);
  const advantage = futureAfterTax - netNowGrown;

  return (
    <CalcGrid
      inputs={
        <>
          <NumberField label="Current 401(k) balance" value={balance} onChange={setBalance} prefix="$" />
          <NumberField
            label="Your age today"
            value={age}
            onChange={setAge}
            suffix="yrs"
            hint="Under 59½ triggers the 10% early-withdrawal penalty."
          />
          <NumberField
            label="Tax / withholding rate"
            value={bracket}
            onChange={setBracket}
            suffix="%"
            hint="~30% is the standard non-resident withholding; use your bracket if you'll still be a US resident."
          />
          <NumberField
            label="Years until you withdraw / retire"
            value={years}
            onChange={setYears}
            suffix="yrs"
          />
          <NumberField
            label="Expected annual return"
            value={ret}
            onChange={setRet}
            suffix="%"
            hint="Long-run US equity returns are often modeled at 6–8%."
          />
        </>
      }
      results={
        <>
          <ResultPanel title="Option A — cash out now" accent="from-rose-500 to-pink-600">
            <Stat label="Net cash in hand today" value={usd(netNow)} big tone="bad" />
            <Row label="10% early-withdrawal penalty" value={usd(penalty)} />
            <Row label={`Tax / withholding (${(taxRate * 100).toFixed(0)}%)`} value={usd(taxNow)} />
            <Row label="Total lost to penalty + tax" value={usd(lostNow)} />
          </ResultPanel>

          <ResultPanel title="Option B — leave it to compound" accent="from-indigo-500 to-blue-700">
            <Stat
              label={`Projected balance in ${yrs} years`}
              value={usd(futureGross)}
              big
              tone="good"
            />
            <Row label="After estimated tax at withdrawal" value={usd(futureAfterTax)} />
            <Row label="If you cashed out & reinvested instead" value={usd(netNowGrown)} />
            <Stat
              label="Advantage of keeping it invested"
              value={usd(Math.max(0, advantage))}
              tone={advantage > 0 ? "good" : "warn"}
            />
          </ResultPanel>

          <Callout tone={advantage > 0 ? "good" : "note"}>
            {advantage > 0 ? (
              <>
                <strong>Keeping it invested looks far better.</strong> Cashing
                out forfeits {usd(lostNow)} immediately. Under the India–US DTAA,
                you can usually keep the account and manage withdrawals
                tax-efficiently after you leave.
              </>
            ) : (
              <>Run both scenarios with your real bracket and timeline — and confirm DTAA treatment before deciding.</>
            )}
          </Callout>

          <p className="text-xs leading-relaxed text-ink-400">
            Estimate only. Actual tax depends on residency, DTAA treaty
            positions, state tax, and distribution type. The 10% penalty applies
            to most withdrawals before age 59½. Consult a cross-border tax
            professional.
          </p>
        </>
      }
    />
  );
}
