"use client";

import Link from "next/link";
import {
  NumberField,
  SelectField,
  ToggleField,
  CalcGrid,
  ResultPanel,
  Row,
  Callout,
  usd,
  inr,
  num,
} from "@/components/calculators/ui";
import ResultActions from "@/components/ResultActions";
import { useUrlState } from "@/lib/useUrlState";
import {
  computeVolume,
  estimateShippingCosts,
  estimateCategoryDuty,
  combineLandedCost,
} from "@/lib/shippingIndiaDuty";
import {
  originMetros,
  destinationCities,
  bhkPresets,
  boxSizePresets,
  specialCaseNotes,
  SHIPPING_INDIA_DISCLAIMER,
} from "@/data/shippingIndiaRatesData";

export default function ShippingIndiaCalculator() {
  const [s, set] = useUrlState({
    origin: "nyc-nj",
    dest: "delhi-ncr",
    basis: "bhk",
    bhk: "2bhk",
    boxSmall: "0",
    boxMedium: "0",
    boxLarge: "0",
    years: "3",
    checkGoods: "yes",
    valueGoods: "5000",
    checkGold: "no",
  });

  const basis = s.basis === "boxes" ? "boxes" : "bhk";
  const yearsAbroad = num(s.years);

  const volume = computeVolume({
    basis,
    boxCounts: {
      small: num(s.boxSmall),
      medium: num(s.boxMedium),
      large: num(s.boxLarge),
    },
    bhkValue: s.bhk,
  });

  const modes = estimateShippingCosts(volume);

  const goodsChecked = s.checkGoods === "yes";
  const dutyResult = goodsChecked
    ? estimateCategoryDuty({ category: "householdGoods", declaredValueUsd: num(s.valueGoods) }, yearsAbroad)
    : null;

  const dutyTotalUsd = dutyResult?.estimatedDutyUsd ?? 0;
  const landedRows = combineLandedCost(modes, dutyTotalUsd);

  const originMeta = originMetros.find((m) => m.value === s.origin);
  const destMeta = destinationCities.find((c) => c.value === s.dest);
  const goldChecked = s.checkGold === "yes";

  return (
    <CalcGrid
      inputs={
        <>
          <SelectField
            label="Origin US metro"
            value={s.origin}
            onChange={(v) => set("origin", v)}
            options={originMetros.map((m) => ({ value: m.value, label: m.label }))}
            hint={
              originMeta && !originMeta.nearMajorPort
                ? "Inland metro — sea-freight quotes typically add inland trucking to/from the coast, not modeled here yet."
                : undefined
            }
          />
          <SelectField
            label="Destination India city"
            value={s.dest}
            onChange={(v) => set("dest", v)}
            options={destinationCities.map((c) => ({ value: c.value, label: c.label }))}
            hint={
              destMeta?.tier === "tier2"
                ? "Tier-2 destination — confirm last-mile delivery coverage and any extra transit time with your carrier."
                : undefined
            }
          />

          <SelectField
            label="How do you want to estimate your volume?"
            value={basis}
            onChange={(v) => set("basis", v)}
            options={[
              { value: "bhk", label: "Pick a home-size preset" },
              { value: "boxes", label: "Count my boxes" },
            ]}
          />

          {basis === "bhk" ? (
            <SelectField
              label="Approximate home size"
              value={s.bhk}
              onChange={(v) => set("bhk", v)}
              options={bhkPresets.map((p) => ({ value: p.value, label: p.label }))}
              hint="A rule-of-thumb volume estimate, not an official figure — your actual inventory will vary."
            />
          ) : (
            <>
              <NumberField
                label={`${boxSizePresets[0].label} boxes`}
                value={s.boxSmall}
                onChange={(v) => set("boxSmall", v)}
                min={0}
                step={1}
              />
              <NumberField
                label={`${boxSizePresets[1].label} boxes`}
                value={s.boxMedium}
                onChange={(v) => set("boxMedium", v)}
                min={0}
                step={1}
              />
              <NumberField
                label={`${boxSizePresets[2].label} boxes`}
                value={s.boxLarge}
                onChange={(v) => set("boxLarge", v)}
                min={0}
                step={1}
              />
            </>
          )}

          <NumberField
            label="Continuous years lived abroad"
            value={s.years}
            onChange={(v) => set("years", v)}
            suffix="years"
            min={0}
            step={0.5}
            hint="Drives Transfer-of-Residence eligibility on the duty side."
          />

          <ToggleField
            label="Shipping household goods (furniture, small appliances, kitchen items, kids' items)"
            checked={goodsChecked}
            onChange={(v) => set("checkGoods", v ? "yes" : "no")}
          />
          {goodsChecked && (
            <NumberField
              label="Estimated total value of these goods (USD)"
              value={s.valueGoods}
              onChange={(v) => set("valueGoods", v)}
              prefix="$"
              min={0}
              step={100}
              hint="Used-goods resale value is normally far below replacement cost — declare what they're actually worth used, not what you paid new."
            />
          )}

          <Callout tone="note">
            Gold/silver jewellery, a car, and alcohol each follow a completely different process
            from ordinary household goods — check below if any apply.
          </Callout>
          <ToggleField
            label={specialCaseNotes.goldSilver.label}
            checked={goldChecked}
            onChange={(v) => set("checkGold", v ? "yes" : "no")}
          />
        </>
      }
      results={
        <>
          <ResultPanel title="Shipping cost by mode" accent="from-cyan-500 to-teal-600">
            {landedRows.map((row) => (
              <div key={row.mode} className="border-b border-ink-900/5 pb-3 last:border-0 last:pb-0">
                <Row
                  label={row.shortLabel}
                  value={row.verified ? `${usd(row.costLowUsd as number)} – ${usd(row.costHighUsd as number)}` : "Rate not verified"}
                />
                <p className="mt-1 text-xs leading-relaxed text-ink-400">
                  {row.transitDaysLow !== null && row.transitDaysHigh !== null
                    ? `${row.transitDaysLow}–${row.transitDaysHigh} days door to door. `
                    : "Transit time not verified. "}
                  {row.note}
                </p>
                {row.underfilledContainerWarning && (
                  <p className="mt-1 text-xs leading-relaxed text-amber-700">
                    {row.underfilledContainerWarning}
                  </p>
                )}
              </div>
            ))}
          </ResultPanel>

          <ResultPanel title="Customs duty (household goods)" accent="from-amber-500 to-orange-600">
            {!goodsChecked && (
              <p className="text-sm text-ink-500">
                Check &quot;shipping household goods&quot; on the left to see a duty estimate here.
              </p>
            )}
            {dutyResult && (
              <div>
                {dutyResult.tierVerified ? (
                  <>
                    <Row
                      label="Covered by Transfer-of-Residence relief"
                      value={usd(dutyResult.trCoveredValueUsd as number)}
                    />
                    <Row
                      label="Dutiable value (above TR relief)"
                      value={usd(dutyResult.dutiableValueUsd as number)}
                    />
                    <Row
                      label="Estimated duty"
                      value={dutyResult.rateVerified ? usd(dutyResult.estimatedDutyUsd as number) : "Rate not verified"}
                    />
                    <p className="mt-1 text-xs leading-relaxed text-ink-500">
                      {dutyResult.matchedTierMonths !== null
                        ? `At ${yearsAbroad} years abroad, you qualify for the tier requiring ${dutyResult.matchedTierMonths}+ months abroad.`
                        : `At ${yearsAbroad} years abroad, you don't yet qualify for any Transfer-of-Residence tier — the full declared value is treated as dutiable.`}{" "}
                      {!dutyResult.rateVerified && dutyResult.note}
                    </p>
                  </>
                ) : (
                  <p className="text-sm leading-relaxed text-ink-500">{dutyResult.note}</p>
                )}
              </div>
            )}
            {goldChecked && (
              <Callout tone="note">
                <strong>{specialCaseNotes.goldSilver.label}:</strong> {specialCaseNotes.goldSilver.headline}.{" "}
                {specialCaseNotes.goldSilver.body}{" "}
                {specialCaseNotes.goldSilver.crossLinkHref && specialCaseNotes.goldSilver.crossLinkLabel && (
                  <Link
                    href={specialCaseNotes.goldSilver.crossLinkHref}
                    className="font-semibold underline underline-offset-2"
                  >
                    {specialCaseNotes.goldSilver.crossLinkLabel}
                  </Link>
                )}
              </Callout>
            )}
          </ResultPanel>

          <ResultPanel title="Total landed cost (shipping + duty)" accent="from-emerald-500 to-teal-700">
            {landedRows.map((row) => (
              <Row
                key={row.mode}
                label={row.shortLabel}
                value={
                  row.totalLowUsd !== null && row.totalHighUsd !== null
                    ? `${usd(row.totalLowUsd)} – ${usd(row.totalHighUsd)} (${inr(row.totalLowInr as number)} – ${inr(row.totalHighInr as number)})`
                    : "—"
                }
              />
            ))}
            {dutyResult && dutyResult.tierVerified && !dutyResult.rateVerified && (
              <p className="text-xs leading-relaxed text-amber-700">
                Duty total above excludes the household-goods duty rate, which is still unverified
                (see the customs duty panel) — treat these totals as shipping cost only until that
                rate is confirmed.
              </p>
            )}
          </ResultPanel>

          <ResultActions
            title="My USA → India shipping + duty estimate"
            shareText="I estimated the cost to ship my household goods from the USA to India — shipping cost by mode plus customs duty, in one place:"
            fileName="shipping-india-estimate"
            rows={[
              { label: "Volume", value: `${volume.cbf} CBF` },
              { label: "Estimated customs duty", value: dutyTotalUsd > 0 ? usd(dutyTotalUsd) : "—" },
            ]}
          />

          <p className="text-xs leading-relaxed text-ink-400">{SHIPPING_INDIA_DISCLAIMER}</p>
        </>
      }
    />
  );
}
