"use client";

import {
  NumberField,
  SelectField,
  CalcGrid,
  ResultPanel,
  Stat,
  Row,
  Callout,
  InvalidInputPanel,
  usd,
  pct,
} from "./ui";
import { calculateDtaa } from "@/lib/calc/dtaaFtc";
import Link from "next/link";
import { useEffect } from "react";
import ResultActions from "@/components/ResultActions";
import { useUrlState } from "@/lib/useUrlState";
import { trackToolResultView } from "@/lib/analytics";

/**
 * India–US DTAA / Foreign Tax Credit relief estimator (simplified Form 1116
 * logic). For income taxed in India and again on a US worldwide return, the FTC
 * lets a US resident credit the India tax against the US tax on the SAME income,
 * capped at the US tax attributable to it. Estimates only; not tax advice.
 */

/** Form 1116 separate "baskets" — credits cannot be mixed across categories. */
const INCOME_TYPES: {
  value: string;
  label: string;
  basket: "general" | "passive";
  note: string;
}[] = [
  {
    value: "salary",
    label: "Salary / employment income",
    basket: "general",
    note: "General-category income on Form 1116.",
  },
  {
    value: "rental",
    label: "Rental income (Indian property)",
    basket: "general",
    note: "General-category income on Form 1116.",
  },
  {
    value: "business",
    label: "Business / professional income",
    basket: "general",
    note: "General-category income on Form 1116.",
  },
  {
    value: "interest",
    label: "Interest (NRO / FD / bonds)",
    basket: "passive",
    note: "Passive-category income on Form 1116 — treaty caps India tax on interest at 15%.",
  },
  {
    value: "dividends",
    label: "Dividends (Indian shares / funds)",
    basket: "passive",
    note: "Passive-category income on Form 1116 — treaty caps India tax on dividends at 25% (often 15%).",
  },
  {
    value: "capgains",
    label: "Capital gains",
    basket: "passive",
    note: "Passive-category income on Form 1116. Treaty does not cap India's right to tax gains.",
  },
];

const US_BRACKETS = [
  { value: "10", label: "10% bracket" },
  { value: "12", label: "12% bracket" },
  { value: "22", label: "22% bracket" },
  { value: "24", label: "24% bracket" },
  { value: "32", label: "32% bracket" },
  { value: "35", label: "35% bracket" },
  { value: "37", label: "37% bracket (top)" },
];

export default function DtaaReliefCalculator() {
  const [s, set] = useUrlState({
    type: "interest",
    income: "10000",
    indiaTax: "2000",
    usRate: "24",
  });
  const { type, income, indiaTax, usRate } = s;

  const meta = INCOME_TYPES.find((t) => t.value === type) ?? INCOME_TYPES[0];

  const r = calculateDtaa({
    income,
    indiaTax,
    usRate,
    basket: meta.basket,
  });

  const inc = r.income;
  const paidIndia = r.indiaTaxPaid;
  const usTaxOnIncome = r.simplifiedUsLimitation;
  const credit = r.screeningCredit;
  const carryover = r.excessAboveLimitation;
  const residualUsTax = r.residualUsTax;
  const withoutCredit = r.totalTaxWithoutCredit;
  const withCredit = r.totalTaxWithCredit;
  const rateWithout = r.effectiveRateWithoutCredit;
  const rateWith = r.effectiveRateWithCredit;
  const indiaHigher = r.exceedsLimitation || paidIndia >= usTaxOnIncome;
  const errorList = Object.values(r.errors).filter(Boolean) as string[];

  // Coarse, non-identifying outcome label only — never the entered amounts.
  const resultStatus =
    !r.ok || inc <= 0
      ? "empty"
      : carryover > 0
        ? "carryover"
        : residualUsTax > 0
          ? "residual_us_tax"
          : "fully_offset";
  useEffect(() => {
    if (resultStatus === "empty") return;
    const t = setTimeout(
      () =>
        trackToolResultView({
          tool_slug: "dtaa-foreign-tax-credit",
          route: "/calculators/dtaa-foreign-tax-credit",
          result_status: resultStatus,
        }),
      1500
    );
    return () => clearTimeout(t);
  }, [resultStatus]);

  return (
    <CalcGrid
      inputs={
        <>
          <SelectField
            label="Type of income taxed in India"
            value={type}
            onChange={(v) => set("type", v)}
            options={INCOME_TYPES.map((t) => ({ value: t.value, label: t.label }))}
            hint={meta.note}
          />
          <NumberField
            label="Foreign (India) income — gross"
            value={income}
            onChange={(v) => set("income", v)}
            prefix="$"
            min={0}
            step={500}
            error={r.errors.income}
            hint="The income (in USD) that India already taxed and you must also report in the US."
          />
          <NumberField
            label="Income tax paid in India on it"
            value={indiaTax}
            onChange={(v) => set("indiaTax", v)}
            prefix="$"
            min={0}
            step={100}
            error={r.errors.indiaTax}
            hint="Actual Indian tax/TDS borne, net of any India refund. Surcharge & cess count; not interest/penalties."
          />
          <SelectField
            label="Your US marginal tax bracket"
            value={usRate}
            onChange={(v) => set("usRate", v)}
            options={US_BRACKETS}
            hint="The federal rate this income stacks at. State tax isn't creditable under the treaty."
          />
        </>
      }
      results={
        !r.ok ? (
          <InvalidInputPanel errors={errorList} />
        ) : (
        <>
          <Callout tone="note">
            <strong>Read this before the number below.</strong> This is a
            screening estimate, not a Form 1116 computation. Your actual
            allowable credit can depend on your foreign-source taxable income,
            your worldwide taxable income, your US tax before credits, the
            separate Form 1116 income baskets, source rules, timing differences
            between when each country taxes the income, currency conversion,
            carryback and carryforward rules, treaty resourcing, and state
            taxes. The figure here will not necessarily be the figure on your
            Form 1116 or your Indian Form 67.
          </Callout>

          {r.warnings.map((w, i) => (
            <Callout key={i} tone="bad">
              {w}
            </Callout>
          ))}

          <ResultPanel
            title="Simplified foreign-tax-credit screening estimate"
            accent="from-teal-500 to-emerald-600"
          >
            <Stat
              label="Indian tax likely absorbed by US tax on this income"
              value={usd(credit)}
              big
              tone="good"
              sub="Screening estimate — not the amount that will appear on Form 1116."
            />
            <div className="pt-1">
              <Row label="Simplified US limitation on this income" value={usd(usTaxOnIncome)} />
              <Row label="India tax paid" value={usd(paidIndia)} />
              <Row label="Indian tax absorbed (screening estimate)" value={usd(credit)} />
              <Row label="US tax still due on this income" value={usd(residualUsTax)} />
              <Row
                label="India tax above the simplified limitation"
                value={usd(carryover)}
              />
            </div>
          </ResultPanel>

          <ResultPanel title="With vs without the credit" accent="from-slate-600 to-slate-700">
            <Row label="Total tax WITHOUT FTC (India + US)" value={usd(withoutCredit)} />
            <Row label="Total tax WITH FTC" value={usd(withCredit)} />
            <Row label="Effective rate without credit" value={pct(rateWithout)} />
            <Row label="Effective rate with credit" value={pct(rateWith)} />
          </ResultPanel>

          {indiaHigher ? (
            <Callout tone="good">
              <strong>
                On this simplified basis, Indian tax covers the US tax on this
                income.
              </strong>{" "}
              The {usd(carryover)} of Indian tax above the simplified limitation
              would generally become a foreign-tax-credit carryover — carried
              back one year or forward up to ten, against US tax on other
              foreign income in the same Form 1116 basket (this income is{" "}
              {meta.basket === "passive" ? "passive" : "general"} category).
              Whether that excess actually arises depends on the real
              limitation across your whole return, not on this estimate.
            </Callout>
          ) : (
            <Callout tone="note">
              <strong>US tax on this income is likely to exceed the Indian tax.</strong>{" "}
              On this simplified basis the Indian tax absorbs {usd(credit)} and{" "}
              {usd(residualUsTax)} of US tax would remain due on top of what you
              paid India. The credit is not restricted to this isolated
              calculation — it is computed across your whole return, so your
              actual position may differ.
            </Callout>
          )}

          <ResultPanel title="Assumptions behind this estimate" accent="from-slate-500 to-slate-700">
            <ul className="space-y-2">
              {r.assumptions.map((a, i) => (
                <li key={i} className="text-sm leading-relaxed text-ink-600">
                  • {a}
                </li>
              ))}
            </ul>
          </ResultPanel>

          <Callout tone="note">
            <strong>How to claim it:</strong> In the US, claim the credit on{" "}
            <a
              href="https://www.irs.gov/forms-pubs/about-form-1116"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 underline"
            >
              IRS Form 1116
            </a>{" "}
            (Foreign Tax Credit), filed with your 1040. If you also need India to
            grant treaty relief on US-taxed income, India requires{" "}
            <a
              href="https://www.incometax.gov.in/iec/foportal/help/statutory-forms/popular-form/form67-um"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 underline"
            >
              Form 67
            </a>{" "}
            and supporting documents are generally furnished on or before the
            end of the assessment year relevant to the previous year in which
            the income is offered or assessed to tax in India; when foreign
            income is included through an updated return under section 139(8A),
            they must be furnished on or before the date the updated return is
            filed. Verify the current instructions before filing. See our{" "}
            <Link
              href="/articles/double-taxation-dtaa-india-usa"
              className="text-brand-600 underline"
            >
              DTAA & double-taxation guide
            </Link>
            .
          </Callout>

          <ResultActions
            title="My India–US foreign-tax-credit screening estimate"
            shareText={`A simplified screening estimate of foreign-tax-credit relief on my India-taxed income: ${usd(
              credit
            )} of Indian tax likely absorbed.`}
            fileName="dtaa-ftc-screening-estimate"
            rows={[
              { label: "Foreign income", value: usd(inc) },
              { label: "India tax paid", value: usd(paidIndia) },
              { label: "Simplified US limitation", value: usd(usTaxOnIncome) },
              { label: "Indian tax absorbed (estimate)", value: usd(credit) },
              { label: "US tax still due", value: usd(residualUsTax) },
              { label: "Above simplified limitation", value: usd(carryover) },
            ]}
          />

          <p className="text-xs leading-relaxed text-ink-400">
            Simplified screening estimate — not a Form 1116 or Form 67
            computation, and not the figure that will appear on either. The real
            limitation prorates the credit across your total taxable income and
            separates income into baskets; source rules, timing, currency
            conversion, treaty resourcing, existing carryovers and state taxes
            (not creditable) all change the result. Confirm with a qualified
            cross-border tax professional before filing.
          </p>
        </>
        )
      }
    />
  );
}
