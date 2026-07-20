"use client";

import {
  NumberField,
  ToggleField,
  CalcGrid,
  ResultPanel,
  Stat,
  Row,
  Callout,
  InvalidInputPanel,
  usd,
} from "./ui";
import ResultActions from "@/components/ResultActions";
import { useUrlState } from "@/lib/useUrlState";
import {
  calculateRetire401k,
  IRS_FOREIGN_WITHHOLDING_SOURCE,
} from "@/lib/calc/retire401k";

export default function Retire401kCalculator() {
  const [s, set] = useUrlState({
    balance: "100000",
    age: "35",
    taxRate: "24",
    withholding: "30",
    years: "20",
    ret: "7",
    futureRate: "24",
    exception: "no",
  });

  const hasException = s.exception === "yes";

  const r = calculateRetire401k({
    balance: s.balance,
    age: s.age,
    effectiveTaxRate: s.taxRate,
    withholdingRate: s.withholding,
    years: s.years,
    expectedReturn: s.ret,
    futureTaxRate: s.futureRate,
    hasEarlyDistributionException: hasException,
  });

  const errorList = Object.values(r.errors).filter(Boolean) as string[];

  return (
    <CalcGrid
      inputs={
        <>
          <NumberField
            label="Current 401(k) balance"
            value={s.balance}
            onChange={(v) => set("balance", v)}
            prefix="$"
            min={0}
            step={1000}
            error={r.errors.balance}
          />
          <NumberField
            label="Your age today"
            value={s.age}
            onChange={(v) => set("age", v)}
            suffix="yrs"
            min={0}
            max={120}
            step={1}
            error={r.errors.age}
            hint="Under 59½ can trigger a 10% additional tax — unless an exception applies."
          />
          <ToggleField
            label="An exception to the 10% additional tax applies to me"
            checked={hasException}
            onChange={(v) => set("exception", v ? "yes" : "no")}
            hint="Recognised exceptions include separation from service at 55 or later, substantially equal periodic payments, disability and certain medical costs. Confirm your situation qualifies before relying on this."
          />
          <NumberField
            label="Estimated effective US tax rate on the distribution"
            value={s.taxRate}
            onChange={(v) => set("taxRate", v)}
            suffix="%"
            min={0}
            max={100}
            step={1}
            error={r.errors.effectiveTaxRate}
            hint="Your own rate, based on total income for the year and filing status. Not the withholding rate."
          />
          <NumberField
            label="Withholding rate applied by the plan"
            value={s.withholding}
            onChange={(v) => set("withholding", v)}
            suffix="%"
            min={0}
            max={100}
            step={1}
            error={r.errors.withholdingRate}
            hint="Distributions to foreign payees are generally withheld at 30% unless valid documentation establishes a lower treaty rate."
          />
          <NumberField
            label="Years until you withdraw / retire"
            value={s.years}
            onChange={(v) => set("years", v)}
            suffix="yrs"
            min={0}
            max={100}
            step={1}
            error={r.errors.years}
          />
          <NumberField
            label="Expected annual return"
            value={s.ret}
            onChange={(v) => set("ret", v)}
            suffix="%"
            min={-100}
            max={100}
            step={0.5}
            error={r.errors.expectedReturn}
            hint="Long-run US equity returns are often modelled at 6–8%."
          />
          <NumberField
            label="Estimated tax rate at future withdrawal"
            value={s.futureRate}
            onChange={(v) => set("futureRate", v)}
            suffix="%"
            min={0}
            max={100}
            step={1}
            error={r.errors.futureTaxRate}
            hint="May differ from today's rate, and may depend on your India residency status by then."
          />
        </>
      }
      results={
        !r.ok ? (
          <InvalidInputPanel errors={errorList} />
        ) : (
          <>
            <Callout tone="note">
              <strong>These are five different actions, not one.</strong> Leaving
              the balance in the employer plan, a direct trustee-to-trustee
              rollover to a Traditional IRA, a taxable cash distribution,
              periodic future distributions, and a Roth conversion each have
              different tax consequences. This calculator compares only a{" "}
              <strong>taxable cash distribution now</strong> against{" "}
              <strong>leaving the balance invested</strong>. A rollover is not a
              withdrawal and is not modelled here.
            </Callout>

            <ResultPanel
              title="Option A — taxable cash distribution now"
              accent="from-rose-500 to-pink-600"
            >
              <Stat
                label="Cash received initially (after withholding)"
                value={usd(r.cashReceivedInitially)}
                big
                tone="warn"
                sub="What lands in your account on day one"
              />
              <div className="pt-1">
                <Row label="Gross distribution" value={usd(r.grossDistribution)} />
                <Row label="Estimated income tax on the distribution" value={usd(r.estimatedIncomeTax)} />
                <Row
                  label="Additional tax on early distribution"
                  value={
                    r.earlyDistributionApplies
                      ? usd(r.earlyDistributionTax)
                      : "Not applicable"
                  }
                />
                <Row label="Estimated total tax liability" value={usd(r.totalTaxLiability)} />
                <Row label="Upfront withholding (a prepayment)" value={usd(r.upfrontWithholding)} />
                <Row
                  label={
                    r.withholdingReconciliation >= 0
                      ? "Estimated refund when you file"
                      : "Estimated further tax payable when you file"
                  }
                  value={usd(Math.abs(r.withholdingReconciliation))}
                />
              </div>
              <Stat
                label="Estimated eventual after-tax value"
                value={usd(r.netAfterTaxValue)}
                tone="default"
                sub="After the refund or balancing payment settles"
              />
              <Callout tone="note">
                Withholding is a <strong>prepayment</strong> against your tax
                bill, not an extra tax. It reduces the cash you see on day one;
                it is not subtracted a second time from your eventual value.
                Withholding is also not necessarily your final liability — that
                is settled when you file.
              </Callout>
            </ResultPanel>

            <ResultPanel
              title="Option B — leave it invested and withdraw later"
              accent="from-indigo-500 to-blue-700"
            >
              <Stat
                label={`Projected balance in ${s.years} years`}
                value={usd(r.projectedFutureBalance)}
                big
                tone="good"
              />
              <Row label="After estimated tax at withdrawal" value={usd(r.futureAfterTaxValue)} />
              <Row
                label="Option A's net proceeds, reinvested"
                value={usd(r.distributionReinvestedValue)}
              />
              <Stat
                label="Advantage of keeping it invested"
                value={usd(Math.abs(r.advantageOfKeeping))}
                tone={r.advantageOfKeeping > 0 ? "good" : "warn"}
                sub={r.advantageOfKeeping > 0 ? undefined : "Cashing out compares favourably on these assumptions"}
              />
            </ResultPanel>

            <ResultPanel title="Assumptions behind this result" accent="from-slate-500 to-slate-700">
              <ul className="space-y-2">
                {r.assumptions.map((a, i) => (
                  <li key={i} className="text-sm leading-relaxed text-ink-600">
                    • {a}
                  </li>
                ))}
              </ul>
            </ResultPanel>

            <ResultActions
              title="401(k): cash distribution vs keeping it invested"
              shareText="I compared taking a taxable 401(k) distribution on leaving the US against leaving it invested:"
              fileName="401k-distribution-vs-keep"
              rows={[
                { label: "Cash received initially", value: usd(r.cashReceivedInitially) },
                { label: "Estimated total tax liability", value: usd(r.totalTaxLiability) },
                { label: "Eventual after-tax value", value: usd(r.netAfterTaxValue) },
                { label: `Keep ${s.years}y, after-tax`, value: usd(r.futureAfterTaxValue) },
              ]}
            />

            <p className="text-xs leading-relaxed text-ink-400">
              Estimate only. Distributions to foreign payees are generally
              subject to 30% withholding unless valid documentation establishes
              eligibility for a lower treaty rate — submitting a Form W-8BEN
              does not by itself guarantee any particular rate, and plans and
              custodians differ in what documentation they require and whether
              they will apply a treaty rate at all. Actual tax depends on
              residency, treaty position, state tax and the type of
              distribution, and India may also tax the same money depending on
              your residency status there. Consult a cross-border tax
              professional.{" "}
              <a
                href={IRS_FOREIGN_WITHHOLDING_SOURCE}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline"
              >
                IRS: plan distributions to foreign persons
              </a>
            </p>
          </>
        )
      }
    />
  );
}
