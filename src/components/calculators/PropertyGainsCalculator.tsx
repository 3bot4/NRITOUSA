"use client";

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
import ResultActions from "@/components/ResultActions";
import { useUrlState } from "@/lib/useUrlState";

const REPAT_LIMIT_USD = 1_000_000; // USD 1M / financial year from NRO
const EC_CAP = 5_000_000; // Section 54EC cap ₹50 lakh
const LTCG_RATE = 0.125; // 12.5% (post-July-2024 regime, no indexation)
const STCG_RATE = 0.3; // slab approximation
const CESS = 0.04;

export default function PropertyGainsCalculator() {
  const [s, set] = useUrlState({
    buy: "5000000",
    sell: "12000000",
    term: "long",
    ec: "0",
    rate: "86",
    already: "0",
  });
  const { buy, sell, term, ec, rate, already } = s;
  const setBuy = (v: string) => set("buy", v);
  const setSell = (v: string) => set("sell", v);
  const setTerm = (v: string) => set("term", v);
  const setEc = (v: string) => set("ec", v);
  const setRate = (v: string) => set("rate", v);
  const setAlready = (v: string) => set("already", v);

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

          <ResultActions
            title="India property sale — tax & repatriation"
            shareText="I estimated the tax and US repatriation on selling property in India:"
            fileName="india-property-gains"
            rows={[
              { label: "Capital gain", value: inr(gain) },
              { label: "Estimated tax / TDS", value: inr(totalTax) },
              { label: "Net proceeds", value: `${inr(netInr)} (≈ ${usd(netUsd)})` },
              { label: "Repatriable now", value: usd(repatriableUsd) },
            ]}
          />

          <p className="text-xs leading-relaxed text-ink-400">
            Estimate only. For long-term India property sold on or after{" "}
            <strong>July 23, 2024</strong>, the simplified long-term capital
            gains rate is generally <strong>12.5% without indexation</strong>{" "}
            (this calculator uses that rate). For property acquired{" "}
            <strong>before July 23, 2024</strong>, some old-rate/indexation
            comparison rules may apply depending on taxpayer status, property
            type, and current Indian tax guidance — don&apos;t assume the older
            20%-with-indexation rate automatically applies. Surcharge, cess, and
            exact TDS mechanics vary; NRIs face TDS on the sale value unless a
            lower-deduction certificate is obtained. Confirm eligibility with an
            Indian CA before relying on an indexed estimate, and also report the
            gain on your US return (DTAA credit may apply).
          </p>
        </>
      }
    />
  );
}
