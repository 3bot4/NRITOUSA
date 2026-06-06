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
  inr,
  usd,
  num,
} from "./ui";

const REPAT_LIMIT_USD = 1_000_000; // USD 1M / financial year from NRO
const EC_CAP = 5_000_000; // Section 54EC cap ₹50 lakh
const LTCG_RATE = 0.125; // 12.5% (post-July-2024 regime, no indexation)
const STCG_RATE = 0.3; // slab approximation
const CESS = 0.04;

export default function PropertyGainsCalculator() {
  const [buy, setBuy] = useState("5000000");
  const [sell, setSell] = useState("12000000");
  const [term, setTerm] = useState("long");
  const [ec, setEc] = useState("0");
  const [rate, setRate] = useState("86");
  const [already, setAlready] = useState("0");

  const purchase = num(buy);
  const sale = num(sell);
  const isLong = term === "long";
  const fx = num(rate) || 1;

  const gain = Math.max(0, sale - purchase);
  const ecExemption = isLong ? Math.min(num(ec), EC_CAP, gain) : 0;
  const taxableGain = Math.max(0, gain - ecExemption);
  const taxRate = isLong ? LTCG_RATE : STCG_RATE;
  const baseTax = taxableGain * taxRate;
  const cess = baseTax * CESS;
  const totalTax = baseTax + cess;

  const netInr = Math.max(0, sale - totalTax);
  const netUsd = netInr / fx;
  const headroomUsd = Math.max(0, REPAT_LIMIT_USD - num(already));
  const repatriableUsd = Math.min(netUsd, headroomUsd);
  const overLimit = netUsd > headroomUsd;

  return (
    <CalcGrid
      inputs={
        <>
          <NumberField
            label="Original purchase price"
            value={buy}
            onChange={setBuy}
            prefix="₹"
            hint="Cost of acquisition (or fair value if inherited)."
          />
          <NumberField label="Sale price" value={sell} onChange={setSell} prefix="₹" />
          <SelectField
            label="Holding period"
            value={term}
            onChange={setTerm}
            options={[
              { value: "long", label: "Long-term (held over 24 months)" },
              { value: "short", label: "Short-term (24 months or less)" },
            ]}
            hint="Long-term property gains are taxed at 12.5%; short-term at your slab rate."
          />
          <NumberField
            label="Planned Section 54EC bond investment"
            value={ec}
            onChange={setEc}
            prefix="₹"
            hint="LTCG only. Capped at ₹50 lakh; invest within 6 months to exempt gains."
          />
          <NumberField
            label="USD/INR exchange rate"
            value={rate}
            onChange={setRate}
            prefix="₹"
            suffix="/ $1"
          />
          <NumberField
            label="Already repatriated this financial year"
            value={already}
            onChange={setAlready}
            prefix="$"
            hint="Counts against the USD 1M/year NRO limit."
          />
        </>
      }
      results={
        <>
          <ResultPanel title="Capital gains & tax" accent="from-amber-500 to-orange-600">
            <Stat label="Capital gain" value={inr(gain)} big />
            <div className="pt-1">
              <Row label="Section 54EC exemption" value={inr(ecExemption)} />
              <Row label="Taxable gain" value={inr(taxableGain)} />
              <Row label={`Tax @ ${(taxRate * 100).toFixed(1)}%`} value={inr(baseTax)} />
              <Row label="Health & education cess (4%)" value={inr(cess)} />
              <Row label="Estimated total tax / TDS" value={inr(totalTax)} />
            </div>
          </ResultPanel>

          <ResultPanel title="Repatriation to the US" accent="from-cyan-500 to-teal-600">
            <Stat label="Net proceeds after tax" value={inr(netInr)} sub={`≈ ${usd(netUsd)}`} />
            <Row label="Repatriation limit (per FY)" value={usd(REPAT_LIMIT_USD)} />
            <Row label="Remaining headroom" value={usd(headroomUsd)} />
            <Stat
              label="Repatriable now"
              value={usd(repatriableUsd)}
              tone={overLimit ? "warn" : "good"}
            />
            {overLimit && (
              <Callout tone="note">
                Your net proceeds exceed this year&apos;s USD 1M limit. Split the
                transfer across financial years, or have your bank advise on
                options.
              </Callout>
            )}
          </ResultPanel>

          <ResultPanel title="Compliance checklist" accent="from-rose-500 to-pink-600">
            <CheckList
              items={[
                "PAN for both seller and buyer",
                "Form 13 for a lower/nil TDS certificate (avoid TDS on the full sale value)",
                "Form 15CA (self-declaration) before remittance",
                "Form 15CB (Chartered Accountant certificate) for the transfer",
                "Sale deed and proof of source of funds",
                "Funds routed through your NRO account for repatriation",
              ]}
            />
          </ResultPanel>

          <p className="text-xs leading-relaxed text-ink-400">
            Estimate only. Surcharge, indexation options for pre-July-2024
            purchases, and exact TDS mechanics vary. NRIs face TDS on the sale
            value unless a lower-deduction certificate is obtained. Also report
            the gain on your US return (DTAA credit may apply). Consult a CA and
            a US tax professional.
          </p>
        </>
      }
    />
  );
}
