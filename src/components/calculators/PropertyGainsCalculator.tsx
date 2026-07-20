"use client";

import {
  NumberField,
  SelectField,
  DateField,
  ToggleField,
  CalcGrid,
  ResultPanel,
  Stat,
  Row,
  Callout,
  CheckList,
  InvalidInputPanel,
  inr,
  usd,
  pct,
} from "./ui";
import ResultActions from "@/components/ResultActions";
import { useUrlState } from "@/lib/useUrlState";
import { calculateProperty } from "@/lib/calc/indiaPropertyGains";
import {
  REPATRIATION_LIMIT_USD,
  SEC_54EC_CAP,
} from "@/lib/calc/indiaPropertyRates";

export default function PropertyGainsCalculator() {
  const [s, set] = useUrlState({
    buy: "5000000",
    sell: "12000000",
    expenses: "0",
    improvements: "0",
    term: "long",
    acqDate: "",
    saleDate: "",
    sec54: "0",
    ec: "0",
    slab: "",
    cert: "no",
    certRate: "",
    rate: "86",
    already: "0",
    inherited: "no",
  });

  const hasCert = s.cert === "yes";
  const isInherited = s.inherited === "yes";
  const isShort = s.term === "short";
  const usingDates = s.term === "dates";

  const r = calculateProperty({
    purchasePrice: s.buy,
    salePrice: s.sell,
    sellingExpenses: s.expenses,
    improvementCosts: s.improvements,
    sec54Exemption: s.sec54,
    sec54ec: s.ec,
    stcgSlabRate: s.slab,
    approvedTdsRate: hasCert ? s.certRate : "",
    fxRate: s.rate,
    alreadyRepatriated: s.already,
    termMode: s.term as "long" | "short" | "dates",
    acquisitionDate: s.acqDate,
    saleDate: s.saleDate,
    hasLowerTdsCertificate: hasCert,
    isInherited,
  });

  const errorList = Object.values(r.errors).filter(Boolean) as string[];
  const shortTermNeedsRate = !r.isLongTerm && !r.taxCalculable;

  return (
    <CalcGrid
      inputs={
        <>
          <NumberField
            label="Original purchase price (cost of acquisition)"
            value={s.buy}
            onChange={(v) => set("buy", v)}
            prefix="₹"
            min={0}
            step={100000}
            error={r.errors.purchasePrice}
            hint="What the property originally cost. For inherited property, see the toggle below."
          />
          <NumberField
            label="Sale price (gross consideration)"
            value={s.sell}
            onChange={(v) => set("sell", v)}
            prefix="₹"
            min={0}
            step={100000}
            error={r.errors.salePrice}
          />
          <NumberField
            label="Selling expenses"
            value={s.expenses}
            onChange={(v) => set("expenses", v)}
            prefix="₹"
            min={0}
            step={10000}
            error={r.errors.sellingExpenses}
            hint="Brokerage, legal fees and other costs of transfer."
          />
          <NumberField
            label="Eligible improvement costs"
            value={s.improvements}
            onChange={(v) => set("improvements", v)}
            prefix="₹"
            min={0}
            step={10000}
            error={r.errors.improvementCosts}
            hint="Capital improvements only — not repairs or maintenance."
          />

          <SelectField
            label="Holding period"
            value={s.term}
            onChange={(v) => set("term", v)}
            options={[
              { value: "long", label: "Long-term (held more than 24 months)" },
              { value: "short", label: "Short-term (24 months or less)" },
              { value: "dates", label: "Work it out from my dates" },
            ]}
            hint="Immovable property is long-term when held for more than 24 months."
          />

          {usingDates && (
            <>
              <DateField
                label="Date of acquisition"
                value={s.acqDate}
                onChange={(v) => set("acqDate", v)}
                error={r.errors.dates}
              />
              <DateField
                label="Date of sale"
                value={s.saleDate}
                onChange={(v) => set("saleDate", v)}
                hint={
                  r.holdingMonths !== null
                    ? `Holding period: ${r.holdingMonths} months → ${r.isLongTerm ? "long-term" : "short-term"}.`
                    : undefined
                }
              />
            </>
          )}

          {(isShort || (usingDates && !r.isLongTerm)) && (
            <NumberField
              label="Estimated applicable marginal / slab rate"
              value={s.slab}
              onChange={(v) => set("slab", v)}
              suffix="%"
              min={0}
              max={100}
              step={1}
              error={r.errors.stcgSlabRate}
              hint="Short-term property gains are taxed at your slab rate, not a fixed rate. Without this we cannot estimate your liability."
            />
          )}

          {r.isLongTerm && (
            <>
              <NumberField
                label="Section 54 exemption claimed"
                value={s.sec54}
                onChange={(v) => set("sec54", v)}
                prefix="₹"
                min={0}
                step={100000}
                error={r.errors.sec54Exemption}
                hint="Reinvestment in a residential house, where you qualify."
              />
              <NumberField
                label="Planned Section 54EC bond investment"
                value={s.ec}
                onChange={(v) => set("ec", v)}
                prefix="₹"
                min={0}
                max={SEC_54EC_CAP}
                step={100000}
                error={r.errors.sec54ec}
                hint="Capped at ₹50 lakh, invested within 6 months of transfer."
              />
            </>
          )}

          <ToggleField
            label="I have a lower / nil TDS certificate (Section 197)"
            checked={hasCert}
            onChange={(v) => set("cert", v ? "yes" : "no")}
            hint="Obtained via Form 13. The buyer follows the certificate rather than the generic rate."
          />

          {hasCert && (
            <NumberField
              label="Approved withholding rate on the certificate"
              value={s.certRate}
              onChange={(v) => set("certRate", v)}
              suffix="%"
              min={0}
              max={100}
              step={0.1}
              error={r.errors.approvedTdsRate}
              hint="Enter the rate the Assessing Officer approved."
            />
          )}

          <ToggleField
            label="This property was inherited"
            checked={isInherited}
            onChange={(v) => set("inherited", v ? "yes" : "no")}
            hint="Inherited property uses a different cost-basis rule — see the note in the results."
          />

          <NumberField
            label="USD/INR exchange rate"
            value={s.rate}
            onChange={(v) => set("rate", v)}
            prefix="₹"
            suffix="/ $1"
            min={1}
            step={0.5}
            error={r.errors.fxRate}
          />
          <NumberField
            label="Already repatriated this financial year"
            value={s.already}
            onChange={(v) => set("already", v)}
            prefix="$"
            min={0}
            max={REPATRIATION_LIMIT_USD}
            step={10000}
            error={r.errors.alreadyRepatriated}
            hint="Counts against the USD 1 million per financial year facility."
          />
        </>
      }
      results={
        !r.ok ? (
          <InvalidInputPanel errors={errorList} />
        ) : (
          <>
            {r.needsMoreInfo.map((m, i) => (
              <Callout key={i} tone="note">
                {m}
              </Callout>
            ))}

            {/* Outputs 1–4 — the gain */}
            <ResultPanel title="1. Capital gain" accent="from-amber-500 to-orange-600">
              <Row label="Gross sale consideration" value={inr(r.grossSaleConsideration)} />
              <Row label="Adjusted cost base" value={inr(r.adjustedCostBase)} />
              <Stat
                label={r.isCapitalLoss ? "Capital loss" : "Calculated capital gain"}
                value={inr(Math.abs(r.capitalGain))}
                big
                tone={r.isCapitalLoss ? "warn" : "default"}
                sub={r.isLongTerm ? "Long-term" : "Short-term"}
              />
              <Row label="Section 54 / 54EC exemption used" value={inr(r.exemptionUsed)} />
              <Row label="Taxable capital gain" value={inr(r.taxableGain)} />
            </ResultPanel>

            {/* Outputs 5–8 — final tax liability, charged on the GAIN */}
            <ResultPanel
              title="2. Estimated final tax liability (charged on the gain)"
              accent="from-rose-500 to-pink-600"
            >
              {shortTermNeedsRate ? (
                <Callout tone="note">
                  <strong>More information required.</strong> Short-term gains on
                  immovable property are taxed at your applicable slab rate, which
                  depends on your total Indian income for the year. Enter your
                  estimated marginal slab rate to see an estimate. This calculator
                  will not guess a rate for you.
                </Callout>
              ) : (
                <>
                  <Row label="Estimated base capital-gains tax" value={inr(r.baseTax)} />
                  <Row
                    label="Surcharge"
                    value={r.surchargeCalculated ? inr(r.surcharge) : "Not applicable"}
                  />
                  <Row label="Health & education cess (4%)" value={inr(r.cess)} />
                  <Stat
                    label="Estimated final tax liability"
                    value={inr(r.finalTaxLiability)}
                    big
                    tone="warn"
                  />
                </>
              )}
            </ResultPanel>

            {/* Outputs 9–10 — withholding, charged on GROSS CONSIDERATION */}
            <ResultPanel
              title="3. Estimated buyer TDS withholding (Section 195)"
              accent="from-violet-500 to-purple-600"
            >
              <Stat
                label="Estimated TDS withheld by the buyer"
                value={inr(r.estimatedTds)}
                big
                sub={`Effective rate ${pct(r.tdsRateApplied * 100, 2)} of the sale price`}
              />
              {r.tdsBasis === "certificate" ? (
                <Callout tone="good">
                  Calculated from the rate on your Section 197 certificate. The
                  buyer is required to follow the certificate rather than the
                  generic estimate — give them a copy before completion.
                </Callout>
              ) : (
                <Callout tone="note">
                  <strong>TDS is not your tax bill.</strong> Under Section 195 the
                  buyer withholds on the <strong>full sale consideration</strong>,
                  not on your gain, so this figure is usually much larger than the
                  tax you actually owe. This is a simplified estimate of the
                  statutory withholding — the buyer&apos;s actual deduction can
                  differ. A lower/nil deduction certificate is the normal way to
                  reduce it.
                </Callout>
              )}
              <Row
                label={
                  r.excessTdsRefundable >= 0
                    ? "Estimated excess TDS / refund due"
                    : "Estimated additional tax payable"
                }
                value={inr(Math.abs(r.excessTdsRefundable))}
              />
            </ResultPanel>

            {/* Outputs 11–14 — cash and repatriation */}
            <ResultPanel title="4. Cash & repatriation" accent="from-cyan-500 to-teal-600">
              <Stat
                label="Immediate cash received after TDS"
                value={inr(r.immediateCashAfterTds)}
                sub="What actually reaches you at completion"
              />
              <Row
                label="Net proceeds after estimated final tax"
                value={shortTermNeedsRate ? "—" : inr(r.netProceedsAfterFinalTax)}
              />
              <Row
                label="Estimated repatriable amount"
                value={usd(r.estimatedRepatriableUsd)}
              />
              <Row
                label="Remaining annual repatriation headroom"
                value={usd(r.remainingHeadroomUsd)}
              />
              {r.exceedsRepatriationLimit && (
                <Callout tone="note">
                  Your proceeds exceed the remaining headroom under the USD 1
                  million per financial year facility. Splitting the transfer
                  across financial years is common — your authorised dealer bank
                  will advise.
                </Callout>
              )}
            </ResultPanel>

            {r.warnings.map((w, i) => (
              <Callout key={i} tone="note">
                {w}
              </Callout>
            ))}

            <ResultPanel title="Compliance checklist" accent="from-brand-600 to-brand-500">
              <CheckList
                items={[
                  "PAN for both seller and buyer",
                  "Form 13 application for a lower/nil TDS certificate — the main way to avoid withholding on the full sale value",
                  "Buyer's TDS deposited and Form 16A issued to you",
                  "Form 15CA, and Form 15CB from a Chartered Accountant where the remittance requires one — this depends on the nature, taxability and amount of the remittance, so confirm which applies to your transfer",
                  "Indian income-tax return filed to claim any refund of excess TDS",
                  "Sale deed and proof of source of funds",
                  "Funds routed through your NRO account for repatriation",
                ]}
              />
            </ResultPanel>

            <ResultActions
              title="India property sale — tax, TDS & repatriation"
              shareText="I estimated the capital-gains tax, the separate Section 195 TDS, and US repatriation on selling property in India:"
              fileName="india-property-gains"
              rows={[
                { label: "Capital gain", value: inr(r.capitalGain) },
                { label: "Taxable gain", value: inr(r.taxableGain) },
                {
                  label: "Estimated final tax",
                  value: shortTermNeedsRate ? "Slab rate required" : inr(r.finalTaxLiability),
                },
                { label: "Estimated TDS withheld", value: inr(r.estimatedTds) },
                { label: "Immediate cash after TDS", value: inr(r.immediateCashAfterTds) },
                { label: "Repatriable now", value: usd(r.estimatedRepatriableUsd) },
              ]}
            />

            <Callout tone="bad">
              <strong>Have this reviewed before you transact.</strong> An NRI
              property sale combines Indian capital-gains tax, Section 195
              withholding, FEMA repatriation rules and US reporting of the same
              gain. The figures above are a simplified estimate, not a
              computation you should rely on. Engage an Indian Chartered
              Accountant and a US tax professional before completion.
            </Callout>

            <p className="text-xs leading-relaxed text-ink-400">
              Estimate only. Long-term gains on immovable property transferred on
              or after 23 July 2024 are computed at 12.5% without indexation.
              Property acquired before that date may raise transitional questions
              that this calculator does not model — confirm with an Indian CA.
              Short-term gains are taxed at your applicable slab rate. The USD 1
              million per financial year repatriation facility is subject to
              RBI/FEMA conditions, eligible balances, payment of applicable
              taxes, documentation, and your authorised dealer bank&apos;s
              review — it is not automatic. You must also report the gain on your
              US return, where a foreign tax credit may apply.
            </p>
          </>
        )
      }
    />
  );
}
