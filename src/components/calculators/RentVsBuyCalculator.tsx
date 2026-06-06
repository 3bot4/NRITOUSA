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
  usd,
  num,
} from "./ui";

/**
 * Rent-vs-buy comparison anchored to a visa horizon (how long you can be sure
 * you'll stay), which is what determines whether you recover transaction costs.
 */
export default function RentVsBuyCalculator() {
  const [price, setPrice] = useState("500000");
  const [down, setDown] = useState("20");
  const [rate, setRate] = useState("6.5");
  const [rent, setRent] = useState("2500");
  const [appr, setAppr] = useState("3");
  const [rentInc, setRentInc] = useState("3");
  const [horizon, setHorizon] = useState("3");
  const [invReturn, setInvReturn] = useState("6");

  const P = num(price);
  const dpPct = num(down) / 100;
  const i = num(rate) / 100 / 12;
  const N = Math.max(1, num(horizon));
  const apprR = num(appr) / 100;
  const rentR = num(rentInc) / 100;
  const invR = num(invReturn) / 100;

  // Fixed assumptions (typical US averages)
  const TERM = 30;
  const CLOSING = 0.03;
  const SELLING = 0.07;
  const PROP_TAX = 0.011;
  const MAINT = 0.015;

  const downPayment = P * dpPct;
  const loan = P - downPayment;
  const n = TERM * 12;
  const m = Math.round(N * 12);

  const payment =
    i === 0 ? loan / n : (loan * i) / (1 - Math.pow(1 + i, -n));
  const totalMortgage = payment * m;
  const remaining =
    i === 0
      ? loan - (loan / n) * m
      : loan * ((Math.pow(1 + i, n) - Math.pow(1 + i, m)) / (Math.pow(1 + i, n) - 1));

  // Year-by-year property tax, maintenance, and rent
  let propTax = 0;
  let maint = 0;
  let totalRent = 0;
  let homeValue = P;
  let monthlyRent = num(rent);
  for (let y = 0; y < N; y++) {
    propTax += homeValue * PROP_TAX;
    maint += homeValue * MAINT;
    totalRent += monthlyRent * 12;
    homeValue *= 1 + apprR;
    monthlyRent *= 1 + rentR;
  }

  const closing = P * CLOSING;
  const endValue = P * Math.pow(1 + apprR, N);
  const sellingCost = endValue * SELLING;
  const equityAtSale = endValue - remaining - sellingCost;

  const buyCost =
    downPayment + closing + totalMortgage + propTax + maint - equityAtSale;

  // Renter invests what the buyer sank upfront; only the gain offsets rent.
  const invested = downPayment + closing;
  const investGain = invested * Math.pow(1 + invR, N) - invested;
  const rentCost = totalRent - investGain;

  const buyBetter = buyCost < rentCost;
  const diff = Math.abs(buyCost - rentCost);

  return (
    <CalcGrid
      inputs={
        <>
          <SelectField
            label="Your secure US timeline"
            value={horizon}
            onChange={setHorizon}
            options={[
              { value: "3", label: "~3 years (H-1B term)" },
              { value: "6", label: "~6 years (H-1B max)" },
              { value: "10", label: "~10 years (Green Card / settled)" },
              { value: "15", label: "15+ years (long-term)" },
            ]}
            hint="How long you can be confident you'll stay — the key variable."
          />
          <NumberField label="Home price" value={price} onChange={setPrice} prefix="$" />
          <NumberField label="Down payment" value={down} onChange={setDown} suffix="%" />
          <NumberField label="Mortgage rate" value={rate} onChange={setRate} suffix="%" />
          <NumberField label="Comparable monthly rent" value={rent} onChange={setRent} prefix="$" />
          <NumberField label="Home appreciation / year" value={appr} onChange={setAppr} suffix="%" />
          <NumberField label="Rent increase / year" value={rentInc} onChange={setRentInc} suffix="%" />
          <NumberField
            label="Investment return if you rent & invest"
            value={invReturn}
            onChange={setInvReturn}
            suffix="%"
            hint="Return on the down payment you'd otherwise tie up."
          />
        </>
      }
      results={
        <>
          <ResultPanel
            title={`Over your ${N}-year timeline`}
            accent={buyBetter ? "from-emerald-500 to-teal-600" : "from-sky-500 to-blue-600"}
          >
            <Stat
              label={buyBetter ? "Buying wins by" : "Renting wins by"}
              value={usd(diff)}
              big
              tone={buyBetter ? "good" : "default"}
            />
            <Row label="Net cost of buying" value={usd(buyCost)} />
            <Row label="Net cost of renting" value={usd(rentCost)} />
          </ResultPanel>

          <ResultPanel title="Buying breakdown" accent="from-amber-500 to-orange-600">
            <Row label="Down payment" value={usd(downPayment)} />
            <Row label="Closing costs (3%)" value={usd(closing)} />
            <Row label="Mortgage paid" value={usd(totalMortgage)} />
            <Row label="Property tax + upkeep" value={usd(propTax + maint)} />
            <Row label="Home value at sale" value={usd(endValue)} />
            <Row label="Selling costs (7%)" value={usd(sellingCost)} />
            <Row label="Equity recovered at sale" value={usd(equityAtSale)} />
          </ResultPanel>

          <Callout tone={buyBetter ? "good" : "note"}>
            {buyBetter ? (
              <>
                <strong>Buying pays off over {N} years.</strong> You stay long
                enough to recover the ~10% in closing and selling costs through
                equity and appreciation.
              </>
            ) : (
              <>
                <strong>On a {N}-year horizon, renting likely wins.</strong> A
                short visa timeline often means you sell before recouping the
                heavy buy/sell transaction costs. The longer your secure
                timeline, the better buying looks — try 6 or 10 years.
              </>
            )}
          </Callout>

          <p className="text-xs leading-relaxed text-ink-400">
            Estimate only. Assumes 30-yr mortgage, 3% closing, 7% selling, ~1.1%
            property tax and ~1.5% upkeep per year. Excludes mortgage-interest
            tax deductions and local market variation. Consult a financial
            professional.
          </p>
        </>
      }
    />
  );
}
