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
  inr,
  num,
  InvalidInputPanel,
} from "./ui";
import ResultActions from "@/components/ResultActions";
import { useUrlState } from "@/lib/useUrlState";
import { validateAll, FX_USD_INR } from "@/lib/calc/validation";

const TCS_THRESHOLD = 1000000; // ₹10 lakh per FY under LRS (raised from ₹7 lakh, FY 2025-26)
const TCS_RATES: Record<string, number> = {
  family: 0.2,
  investment: 0.2,
  education: 0.05,
  "education-loan": 0.005,
  medical: 0.05,
};

export default function RemittanceCalculator() {
  const [s, set] = useUrlState({
    amount: "10000",
    direction: "us-india",
    purpose: "family",
    rate: "86",
    margin: "0.8",
    fee: "5",
    cash: "no",
  });
  const { amount, direction, purpose, rate, margin, fee, cash } = s;
  const setAmount = (v: string) => set("amount", v);
  const setDirection = (v: string) => set("direction", v);
  const setPurpose = (v: string) => set("purpose", v);
  const setRate = (v: string) => set("rate", v);
  const setMargin = (v: string) => set("margin", v);
  const setFee = (v: string) => set("fee", v);
  const setCash = (v: string) => set("cash", v);

  const v = validateAll(
    { amount, rate, margin, fee },
    {
      amount: { label: "Transfer amount", min: 0, max: 1_000_000_000, required: true },
      rate: { label: "Mid-market rate", ...FX_USD_INR, required: true },
      margin: { label: "Provider margin", min: 0, max: 100, required: true },
      fee: { label: "Flat transfer fee", min: 0, max: 1_000_000, required: true },
    },
  );
  const fieldErrors = Object.values(v.errors).filter(Boolean) as string[];

  const amt = v.values.amount;
  const R = v.values.rate; // INR per USD; validated to be >= 1
  const mgn = v.values.margin / 100;
  const flat = v.values.fee;
  const usIndia = direction === "us-india";

  let recv = 0; // in destination currency
  let spreadLoss = 0; // in source currency
  let regFee = 0; // US 1% fee or India TCS, in source currency
  let totalCost = 0; // in source currency
  let effRateLabel = "";

  if (usIndia) {
    // Source USD → INR
    regFee = cash === "yes" ? amt * 0.01 : 0; // US 1% remittance fee (cash/physical)
    const converted = Math.max(0, amt - flat - regFee);
    const effRate = R * (1 - mgn);
    recv = converted * effRate; // INR received
    spreadLoss = (converted * R * mgn) / R; // back to USD
    totalCost = flat + regFee + spreadLoss;
    effRateLabel = `₹${effRate.toFixed(2)} / $1`;
  } else {
    // Source INR → USD
    const rateUsed = TCS_RATES[purpose] ?? 0.2;
    regFee = Math.max(0, amt - TCS_THRESHOLD) * rateUsed; // TCS in INR
    const converted = Math.max(0, amt - flat);
    const effRate = (1 / R) * (1 - mgn); // USD per INR
    recv = converted * effRate; // USD received
    spreadLoss = converted * (1 / R) * mgn * R; // back to INR
    totalCost = flat + spreadLoss + regFee;
    effRateLabel = `₹${(1 / effRate).toFixed(2)} / $1`;
  }

  const srcFmt = usIndia ? usd : inr;
  const dstFmt = usIndia ? inr : usd;

  return (
    <CalcGrid
      inputs={
        <>
          <SelectField
            label="Direction"
            value={direction}
            onChange={setDirection}
            options={[
              { value: "us-india", label: "USA → India" },
              { value: "india-us", label: "India → USA" },
            ]}
          />
          <NumberField
            label={`Transfer amount (${usIndia ? "USD" : "INR"})`}
            value={amount}
            onChange={setAmount}
            prefix={usIndia ? "$" : "₹"}
            min={0}
            step={100}
            error={v.errors.amount}
          />
          <NumberField
            label="Mid-market rate (USD/INR)"
            value={rate}
            onChange={setRate}
            prefix="₹"
            suffix="/ $1"
            min={1}
            step={0.5}
            error={v.errors.rate}
            hint="The true rate before any provider margin."
          />
          <NumberField
            label="Provider exchange-rate margin"
            value={margin}
            onChange={setMargin}
            suffix="%"
            min={0}
            max={100}
            step={0.1}
            error={v.errors.margin}
            hint="The hidden spread (banks ~2–4%, fintechs ~0.3–1%)."
          />
          <NumberField
            label={`Flat transfer fee (${usIndia ? "USD" : "INR"})`}
            value={fee}
            onChange={setFee}
            prefix={usIndia ? "$" : "₹"}
            min={0}
            step={1}
            error={v.errors.fee}
          />
          {usIndia ? (
            <SelectField
              label="Paying by cash / money order?"
              value={cash}
              onChange={setCash}
              options={[
                { value: "no", label: "No — bank/card/ACH (no 1% fee)" },
                { value: "yes", label: "Yes — cash/physical (1% US fee)" },
              ]}
              hint="The US remittance fee targets cash/physical instruments."
            />
          ) : (
            <SelectField
              label="Purpose (sets TCS rate)"
              value={purpose}
              onChange={setPurpose}
              options={[
                { value: "family", label: "Family maintenance (20%)" },
                { value: "investment", label: "Investment (20%)" },
                { value: "education", label: "Education (5%)" },
                { value: "education-loan", label: "Education via loan (0.5%)" },
                { value: "medical", label: "Medical (5%)" },
              ]}
              hint="TCS applies above ₹10 lakh per financial year."
            />
          )}
        </>
      }
      results={
        !v.ok ? (
          <InvalidInputPanel errors={fieldErrors} />
        ) : (
        <>
          <ResultPanel title="What actually arrives" accent="from-cyan-500 to-teal-600">
            <Stat label="Net amount received" value={dstFmt(recv)} big tone="good" />
            <Row label="Effective exchange rate" value={effRateLabel} />
          </ResultPanel>

          <ResultPanel title="Cost breakdown" accent="from-rose-500 to-pink-600">
            <Row label="Flat transfer fee" value={srcFmt(flat)} />
            <Row label="Exchange-rate margin loss" value={srcFmt(spreadLoss)} />
            <Row
              label={usIndia ? "US 1% remittance fee" : "India TCS (refundable)"}
              value={srcFmt(regFee)}
            />
            <Stat label="Total cost of this transfer" value={srcFmt(totalCost)} tone="bad" />
          </ResultPanel>

          {!usIndia && regFee > 0 && (
            <Callout tone="note">
              TCS of {inr(regFee)} is collected upfront but is{" "}
              <strong>adjustable/refundable</strong> against your Indian income
              tax — it&apos;s a cash-flow cost, not a permanent loss.
            </Callout>
          )}
          {usIndia && (
            <Callout tone="good">
              Most bank, card, and ACH transfers avoid the US 1% fee. The biggest
              real cost is usually the exchange-rate margin — compare providers
              on the spread, not just the flat fee.
            </Callout>
          )}

          <ResultActions
            title="India ↔ USA transfer cost"
            shareText="I checked the true cost of an India–USA money transfer (fees + spread + TCS):"
            fileName="remittance-cost"
            rows={[
              { label: "Sending", value: srcFmt(amt) },
              { label: "Net received", value: dstFmt(recv) },
              { label: "Effective rate", value: effRateLabel },
              { label: "Total cost", value: srcFmt(totalCost) },
            ]}
          />

          <p className="text-xs leading-relaxed text-ink-400">
            Estimate only. TCS assumes this is your transfer above the ₹10 lakh
            annual threshold for the chosen purpose; rules and the US remittance
            fee change. Verify current rates with your provider and a tax
            professional.
          </p>
        </>
        )
      }
    />
  );
}
