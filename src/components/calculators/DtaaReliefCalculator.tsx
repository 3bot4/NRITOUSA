"use client";

import {
  NumberField,
  SelectField,
  CalcGrid,
  ResultPanel,
  Stat,
  Row,
  Callout,
  usd,
  pct,
  num,
} from "./ui";
import Link from "next/link";
import ResultActions from "@/components/ResultActions";
import { useUrlState } from "@/lib/useUrlState";

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

  const inc = Math.max(0, num(income));
  const paidIndia = Math.max(0, num(indiaTax));
  const rate = Math.max(0, num(usRate));

  // US tax on this slice of foreign income — also the Form 1116 credit ceiling.
  const usTaxOnIncome = inc * (rate / 100);

  // You can credit India tax only up to the US tax on the same income.
  const credit = Math.min(paidIndia, usTaxOnIncome);

  // India tax above the US ceiling isn't refunded — it carries (back 1 / fwd 10).
  const carryover = Math.max(0, paidIndia - usTaxOnIncome);

  // If US tax exceeds India tax, the difference is still owed to the IRS.
  const residualUsTax = Math.max(0, usTaxOnIncome - paidIndia);

  // The credit IS the double tax you avoid paying.
  const doubleTaxAvoided = credit;

  const withoutCredit = paidIndia + usTaxOnIncome;
  const withCredit = paidIndia + residualUsTax; // === max(paidIndia, usTaxOnIncome)

  const rateWithout = inc > 0 ? (withoutCredit / inc) * 100 : 0;
  const rateWith = inc > 0 ? (withCredit / inc) * 100 : 0;

  const indiaHigher = paidIndia >= usTaxOnIncome;

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
            hint="The income (in USD) that India already taxed and you must also report in the US."
          />
          <NumberField
            label="Income tax paid in India on it"
            value={indiaTax}
            onChange={(v) => set("indiaTax", v)}
            prefix="$"
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
        <>
          <ResultPanel
            title="Your DTAA / Foreign Tax Credit relief"
            accent="from-teal-500 to-emerald-600"
          >
            <Stat
              label="Indicative Foreign Tax Credit (Form 1116)"
              value={usd(credit)}
              big
              tone="good"
              sub="Credited against your US tax on this income."
            />
            <Stat
              label="Double taxation avoided"
              value={usd(doubleTaxAvoided)}
              tone="good"
              sub="The tax you'd otherwise have paid twice on the same income."
            />
            <div className="pt-1">
              <Row label="US tax on this income (credit ceiling)" value={usd(usTaxOnIncome)} />
              <Row label="India tax paid" value={usd(paidIndia)} />
              <Row label="Allowable credit" value={usd(credit)} />
              <Row label="US tax still due after credit" value={usd(residualUsTax)} />
              <Row
                label="Excess India tax to carry over"
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
              <strong>India tax fully offsets your US tax here.</strong> The
              credit wipes out the US tax on this income, and the extra{" "}
              {usd(carryover)} of India tax becomes a foreign-tax-credit
              carryover — you can carry it back 1 year or forward up to 10 to
              offset US tax on other foreign income in the same Form 1116 basket
              (this is {meta.basket === "passive" ? "passive" : "general"}{" "}
              category).
            </Callout>
          ) : (
            <Callout tone="note">
              <strong>You still owe the IRS the difference.</strong> Because your
              US rate is higher than the India tax on this income, the credit
              covers {usd(credit)} and {usd(residualUsTax)} of US tax remains due
              on top of what you paid India — but you are never taxed twice on the
              same dollar.
            </Callout>
          )}

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
            filed before your Indian return. See our{" "}
            <Link
              href="/articles/double-taxation-dtaa-india-usa"
              className="text-brand-600 underline"
            >
              DTAA & double-taxation guide
            </Link>
            .
          </Callout>

          <ResultActions
            title="My India–US DTAA relief estimate"
            shareText={`Estimated Foreign Tax Credit relief on my India-taxed income: ${usd(
              credit
            )} credited, ${usd(doubleTaxAvoided)} of double taxation avoided.`}
            fileName="dtaa-relief-estimate"
            rows={[
              { label: "Foreign income", value: usd(inc) },
              { label: "India tax paid", value: usd(paidIndia) },
              { label: "US tax on income", value: usd(usTaxOnIncome) },
              { label: "Foreign Tax Credit", value: usd(credit) },
              { label: "Double tax avoided", value: usd(doubleTaxAvoided) },
              { label: "US tax still due", value: usd(residualUsTax) },
              { label: "Carryover", value: usd(carryover) },
            ]}
          />

          <p className="text-xs leading-relaxed text-ink-400">
            Simplified estimate. The real Form 1116 limitation prorates the credit
            across your total taxable income and separates income into baskets;
            treaty rates, the timing of when each country taxes, and state taxes
            (not creditable) can change your result. Confirm with a qualified
            cross-border tax professional.
          </p>
        </>
      }
    />
  );
}
