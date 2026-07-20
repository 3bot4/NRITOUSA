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
  num,
  InvalidInputPanel,
} from "./ui";
import ResultActions from "@/components/ResultActions";
import { useUrlState } from "@/lib/useUrlState";
import { validateAll, PERCENT, GROWTH_RATE } from "@/lib/calc/validation";

/**
 * Rent-vs-buy comparison anchored to a visa horizon (how long you can be sure
 * you'll stay), which is what determines whether you recover transaction costs.
 */
export default function RentVsBuyCalculator() {
  const [s, set] = useUrlState({
    price: "500000",
    down: "20",
    rate: "6.5",
    rent: "2500",
    appr: "3",
    rentInc: "3",
    horizon: "3",
    invReturn: "6",
  });
  const { price, down, rate, rent, appr, rentInc, horizon, invReturn } = s;
  const setPrice = (v: string) => set("price", v);
  const setDown = (v: string) => set("down", v);
  const setRate = (v: string) => set("rate", v);
  const setRent = (v: string) => set("rent", v);
  const setAppr = (v: string) => set("appr", v);
  const setRentInc = (v: string) => set("rentInc", v);
  const setHorizon = (v: string) => set("horizon", v);
  const setInvReturn = (v: string) => set("invReturn", v);

  const val = validateAll(
    { price, down, rate, rent, appr, rentInc, invReturn },
    {
      price: { label: "Home price", min: 0, max: 100_000_000, required: true },
      down: { label: "Down payment", ...PERCENT, required: true },
      rate: { label: "Mortgage rate", min: 0, max: 50, required: true },
      rent: { label: "Comparable monthly rent", min: 0, max: 1_000_000, required: true },
      appr: { label: "Home appreciation", min: -50, max: 50, required: true },
      rentInc: { label: "Rent increase", min: -50, max: 50, required: true },
      invReturn: { label: "Investment return", ...GROWTH_RATE, required: true },
    },
  );
  const fieldErrors = Object.values(val.errors).filter(Boolean) as string[];

  const P = val.values.price;
  const dpPct = val.values.down / 100;
  const i = val.values.rate / 100 / 12;
  const N = Math.max(1, num(horizon));
  const apprR = val.values.appr / 100;
  const rentR = val.values.rentInc / 100;
  const invR = val.values.invReturn / 100;

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
  let monthlyRent = val.values.rent;
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
          <NumberField label="Home price" value={price} onChange={setPrice} prefix="$" min={0} max={100000000} step={5000} error={val.errors.price} />
          <NumberField label="Down payment" value={down} onChange={setDown} suffix="%" min={0} max={100} step={1} error={val.errors.down} />
          <NumberField label="Mortgage rate" value={rate} onChange={setRate} suffix="%" min={0} max={50} step={0.125} error={val.errors.rate} />
          <NumberField label="Comparable monthly rent" value={rent} onChange={setRent} prefix="$" min={0} max={1000000} step={50} error={val.errors.rent} />
          <NumberField label="Home appreciation / year" value={appr} onChange={setAppr} suffix="%" min={-50} max={50} step={0.25} error={val.errors.appr} />
          <NumberField label="Rent increase / year" value={rentInc} onChange={setRentInc} suffix="%" min={-50} max={50} step={0.25} error={val.errors.rentInc} />
          <NumberField
            label="Investment return if you rent & invest"
            value={invReturn}
            onChange={setInvReturn}
            suffix="%"
            min={-100}
            max={100}
            step={0.25}
            error={val.errors.invReturn}
            hint="Return on the down payment you'd otherwise tie up."
          />
        </>
      }
      results={
        !val.ok ? (
          <InvalidInputPanel errors={fieldErrors} />
        ) : (
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

          <ResultActions
            title="Rent vs Buy on a visa timeline"
            shareText={`Over my ${N}-year US timeline, this calculator says ${buyBetter ? "buying" : "renting"} wins:`}
            fileName="rent-vs-buy-visa"
            rows={[
              { label: "Timeline", value: `${N} years` },
              { label: buyBetter ? "Buying wins by" : "Renting wins by", value: usd(diff) },
              { label: "Net cost of buying", value: usd(buyCost) },
              { label: "Net cost of renting", value: usd(rentCost) },
            ]}
          />

          <p className="text-xs leading-relaxed text-ink-400">
            Estimate only. Assumes 30-yr mortgage, 3% closing, 7% selling, ~1.1%
            property tax and ~1.5% upkeep per year. Excludes mortgage-interest
            tax deductions and local market variation. Consult a financial
            professional.
          </p>
        </>
        )
      }
    />
  );
}
