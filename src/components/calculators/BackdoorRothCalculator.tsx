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
  InvalidInputPanel,
  TaxYearBadge,
  usd,
  pct,
} from "./ui";
import ResultActions from "@/components/ResultActions";
import { useUrlState } from "@/lib/useUrlState";
import { calculateRoth, type FilingStatus } from "@/lib/calc/backdoorRoth";
import { currentIraLimits } from "@/lib/calc/irsLimits";

const LIMITS = currentIraLimits();

export default function BackdoorRothCalculator() {
  const [s, set] = useUrlState({
    magi: "200000",
    status: "single",
    age: "35",
    tradBal: "0",
  });
  const { magi, status, age, tradBal } = s;

  const result = calculateRoth({
    magi,
    age,
    tradBal,
    status: status as FilingStatus,
  });
  const {
    ok,
    errors,
    range,
    usedSingleRangeForMfs,
    contributionLimit,
    catchUpApplied,
    directAllowed,
    verdict,
    proRataTaxablePct,
    proRataTaxableAmount,
    assumedConversion,
  } = result;

  const errorList = Object.values(errors).filter(Boolean) as string[];

  return (
    <CalcGrid
      inputs={
        <>
          <TaxYearBadge
            year={LIMITS.taxYear}
            note={`IRA limit ${usd(LIMITS.under50)} · ${usd(LIMITS.age50Plus)} if 50 or older`}
          />
          <NumberField
            label="Modified Adjusted Gross Income (MAGI)"
            value={magi}
            onChange={(v) => set("magi", v)}
            prefix="$"
            min={0}
            step={1000}
            error={errors.magi}
          />
          <SelectField
            label="Filing status"
            value={status}
            onChange={(v) => set("status", v)}
            options={[
              { value: "single", label: "Single / Head of household" },
              { value: "mfj", label: "Married filing jointly" },
              {
                value: "mfsLivedWithSpouse",
                label: "Married filing separately — lived with spouse",
              },
              {
                value: "mfsLivedApart",
                label: "Married filing separately — lived apart all year",
              },
            ]}
            hint="Filing separately while living apart for the entire year is treated as single for this limit."
          />
          <NumberField
            label="Your age at the end of the tax year"
            value={age}
            onChange={(v) => set("age", v)}
            suffix="yrs"
            min={0}
            max={120}
            step={1}
            error={errors.age}
            hint={`50 or older adds the ${usd(LIMITS.catchUp)} catch-up contribution.`}
          />
          <NumberField
            label="Existing pre-tax IRA balance"
            value={tradBal}
            onChange={(v) => set("tradBal", v)}
            prefix="$"
            min={0}
            step={1000}
            error={errors.tradBal}
            hint="Total across all Traditional / SEP / SIMPLE IRAs. Triggers the pro-rata rule."
          />
        </>
      }
      results={
        !ok ? (
          <InvalidInputPanel errors={errorList} />
        ) : (
          <>
            <ResultPanel
              title={`Roth IRA eligibility (${LIMITS.taxYear})`}
              accent={
                verdict === "full"
                  ? "from-emerald-500 to-teal-600"
                  : verdict === "partial"
                    ? "from-amber-500 to-orange-600"
                    : "from-violet-500 to-purple-600"
              }
            >
              {verdict === "full" && (
                <Stat label="You can contribute directly" value={usd(directAllowed)} big tone="good" />
              )}
              {verdict === "partial" && (
                <Stat label="Reduced direct contribution" value={usd(directAllowed)} big tone="warn" />
              )}
              {verdict === "backdoor" && (
                <Stat
                  label="Direct contribution"
                  value={usd(0)}
                  big
                  tone="bad"
                  sub="A backdoor Roth may be an option — see the pro-rata check below"
                />
              )}
              <Row
                label={`Phase-out range (${LIMITS.taxYear})`}
                value={`${usd(range.start)} – ${usd(range.end)}`}
              />
              <Row label="Your MAGI" value={usd(result.magi)} />
              <Row
                label="Max contribution (your age)"
                value={`${usd(contributionLimit)}${catchUpApplied ? " (incl. catch-up)" : ""}`}
              />
              {usedSingleRangeForMfs && (
                <Callout tone="note">
                  Because you filed separately but lived apart from your spouse
                  for the entire year, the <strong>single</strong> phase-out
                  range applies rather than the $0–$10,000 range.
                </Callout>
              )}
            </ResultPanel>

            {verdict !== "full" && (
              <ResultPanel title="Backdoor Roth — pro-rata check" accent="from-violet-500 to-purple-600">
                {proRataTaxablePct > 0 ? (
                  <>
                    <Stat label="Taxable portion of a conversion" value={pct(proRataTaxablePct)} tone="warn" />
                    <Row label="Estimated taxable amount" value={usd(proRataTaxableAmount)} />
                    <Row label="Conversion assumed" value={usd(assumedConversion)} />
                    <Callout tone="note">
                      Your pre-tax IRA balance triggers the{" "}
                      <strong>pro-rata rule</strong>: roughly{" "}
                      {pct(proRataTaxablePct)} of a conversion would be taxable
                      income, not tax-free. The rule looks at your combined
                      Traditional, SEP and SIMPLE IRA balance on{" "}
                      <strong>December 31 of the conversion year</strong> — not
                      the balance on the day you convert — so a balance that
                      arrives later in the year still counts.
                    </Callout>
                  </>
                ) : (
                  <Callout tone="good">
                    With no pre-tax IRA balance, a conversion would generally
                    have little or no taxable portion under the pro-rata rule.
                    Any earnings between contribution and conversion are still
                    taxable, and you must report the transaction on Form 8606.
                  </Callout>
                )}
              </ResultPanel>
            )}

            <ResultPanel title="Backdoor Roth checklist" accent="from-brand-600 to-brand-500">
              <CheckList
                items={[
                  "Check your combined Traditional/SEP/SIMPLE IRA balance — it drives the pro-rata calculation",
                  "If your employer's plan accepts incoming rollovers, rolling pre-tax IRA money into it can reduce the pro-rata impact — plans are not required to accept them, so confirm with your plan administrator first",
                  "Make a nondeductible contribution to a Traditional IRA",
                  "Convert to Roth, and expect any earnings in the interim to be taxable",
                  "File Form 8606 to report the nondeductible basis and the conversion",
                  "Avoid new pre-tax IRA contributions later in the same year",
                ]}
              />
            </ResultPanel>

            <ResultActions
              title="My backdoor Roth eligibility"
              shareText="I checked my Roth IRA eligibility and the pro-rata trap:"
              fileName="backdoor-roth-eligibility"
              rows={[
                { label: "Tax year", value: String(LIMITS.taxYear) },
                {
                  label: "Verdict",
                  value:
                    verdict === "full"
                      ? "Contribute directly"
                      : verdict === "partial"
                        ? "Reduced direct contribution"
                        : "Consider the backdoor Roth",
                },
                { label: "Direct contribution", value: usd(directAllowed) },
                {
                  label: "Pro-rata taxable",
                  value: proRataTaxablePct > 0 ? pct(proRataTaxablePct) : "0%",
                },
              ]}
            />

            <p className="text-xs leading-relaxed text-ink-400">
              Estimate only, using {LIMITS.taxYear} IRS contribution limits and
              Roth MAGI phase-out ranges. A backdoor Roth is a legal strategy but
              it is <strong>not automatically tax-free</strong> — the pro-rata
              rule, any earnings before conversion, and the step-transaction
              doctrine all affect the result, and the conversion must be
              reported on Form 8606. Confirm your own figures with a tax
              professional.{" "}
              <a
                href={LIMITS.source}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline"
              >
                IRS {LIMITS.taxYear} contribution limits
              </a>
            </p>
          </>
        )
      }
    />
  );
}
