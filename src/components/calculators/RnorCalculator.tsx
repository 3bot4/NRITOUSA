"use client";

import {
  NumberField,
  SelectField,
  ToggleField,
  CalcGrid,
  ResultPanel,
  Stat,
  Row,
  Callout,
  InvalidInputPanel,
} from "./ui";
import ResultActions from "@/components/ResultActions";
import { useUrlState } from "@/lib/useUrlState";
import {
  calculateRnor,
  type Citizenship,
  type LiableElsewhere,
  type PresenceReason,
} from "@/lib/calc/rnor";

const STATUS_META = {
  NRI: {
    tone: "good" as const,
    accent: "from-emerald-500 to-teal-600",
    full: "Non-Resident Indian",
    tax: "Only your India-source income is taxable in India. Your US salary, 401(k), and US investments are not taxed by India.",
  },
  RNOR: {
    tone: "warn" as const,
    accent: "from-amber-500 to-orange-600",
    full: "Resident but Not Ordinarily Resident",
    tax: "Your foreign (US) income is generally not taxed in India — this is a transitional window. India-source income remains taxable.",
  },
  ROR: {
    tone: "bad" as const,
    accent: "from-rose-500 to-pink-600",
    full: "Resident & Ordinarily Resident",
    tax: "Your worldwide income is taxable in India — including US salary, 401(k)/IRA distributions, and global capital gains, with DTAA credit for US tax paid.",
  },
  REVIEW: {
    tone: "warn" as const,
    accent: "from-slate-500 to-slate-700",
    full: "Professional review required",
    tax: "Your situation turns on a question this calculator cannot resolve from day counts alone.",
  },
} as const;

export default function RnorCalculator() {
  const [s, set] = useUrlState({
    curr: "90",
    last4: "300",
    last7: "500",
    nriYears: "9",
    citizenship: "indianCitizen",
    reason: "visiting",
    highIncome: "no",
    liable: "yes",
    dual: "no",
  });

  const r = calculateRnor({
    daysCurrentFy: s.curr,
    daysPrior4Fy: s.last4,
    daysPrior7Fy: s.last7,
    nonResidentYears: s.nriYears,
    citizenship: s.citizenship as Citizenship,
    presenceReason: s.reason as PresenceReason,
    incomeOver15Lakh: s.highIncome === "yes",
    liableToTaxElsewhere: s.liable as LiableElsewhere,
    possibleDualResidence: s.dual === "yes",
  });

  const meta = STATUS_META[r.status];
  const errorList = Object.values(r.errors).filter(Boolean) as string[];

  return (
    <CalcGrid
      inputs={
        <>
          <Callout tone="note">
            India&apos;s financial year runs <strong>1 April – 31 March</strong>.
            Residency is decided on that year, not the US calendar year — count
            your days accordingly.
          </Callout>

          <NumberField
            label="Days in India — current financial year"
            value={s.curr}
            onChange={(v) => set("curr", v)}
            suffix="days"
            min={0}
            max={366}
            step={1}
            error={r.errors.daysCurrentFy}
          />
          <NumberField
            label="Days in India — previous 4 financial years (total)"
            value={s.last4}
            onChange={(v) => set("last4", v)}
            suffix="days"
            min={0}
            max={1464}
            step={1}
            error={r.errors.daysPrior4Fy}
            hint="Used for the 365-day limb of the second residency test."
          />
          <NumberField
            label="Days in India — previous 7 financial years (total)"
            value={s.last7}
            onChange={(v) => set("last7", v)}
            suffix="days"
            min={0}
            max={2562}
            step={1}
            error={r.errors.daysPrior7Fy}
            hint="729 days or fewer keeps you RNOR under section 6(6)(b)."
          />
          <NumberField
            label="Years you were a non-resident in the last 10"
            value={s.nriYears}
            onChange={(v) => set("nriYears", v)}
            suffix="/ 10"
            min={0}
            max={10}
            step={1}
            error={r.errors.nonResidentYears}
            hint="Non-resident in 9 or more keeps you RNOR under section 6(6)(a)."
          />
          <SelectField
            label="Your citizenship / origin status"
            value={s.citizenship}
            onChange={(v) => set("citizenship", v)}
            options={[
              { value: "indianCitizen", label: "Indian citizen" },
              { value: "pio", label: "Person of Indian Origin (not an Indian citizen)" },
              { value: "other", label: "Neither" },
            ]}
          />
          <SelectField
            label="Which describes your year?"
            value={s.reason}
            onChange={(v) => set("reason", v)}
            options={[
              { value: "visiting", label: "Living abroad, visiting India" },
              {
                value: "leavingForEmployment",
                label: "Left India this year for employment abroad / as crew of an Indian ship",
              },
              { value: "other", label: "Neither — e.g. living in India" },
            ]}
            hint="Each category gets a different day threshold under Explanation 1 to section 6(1)."
          />
          <SelectField
            label="Income other than from foreign sources over ₹15 lakh?"
            value={s.highIncome}
            onChange={(v) => set("highIncome", v)}
            options={[
              { value: "no", label: "No — ₹15 lakh or less" },
              { value: "yes", label: "Yes — over ₹15 lakh" },
            ]}
            hint="Drives both the 120-day rule for visitors and the deemed-residency rule."
          />
          {s.citizenship === "indianCitizen" && s.highIncome === "yes" && (
            <SelectField
              label="Are you liable to tax in another country?"
              value={s.liable}
              onChange={(v) => set("liable", v)}
              options={[
                { value: "yes", label: "Yes — liable to tax elsewhere" },
                { value: "no", label: "No — not liable to tax in any other country" },
                { value: "unsure", label: "I'm not sure" },
              ]}
              hint="Decides whether the deemed-residency rule in section 6(1A) applies to you."
            />
          )}
          <ToggleField
            label="I may also be treated as a tax resident of another country"
            checked={s.dual === "yes"}
            onChange={(v) => set("dual", v ? "yes" : "no")}
            hint="If both countries treat you as resident, the DTAA tie-breaker decides — not day counts."
          />
        </>
      }
      results={
        !r.ok ? (
          <InvalidInputPanel errors={errorList} />
        ) : (
          <>
            <ResultPanel title="Your India tax status" accent={meta.accent}>
              <Stat
                label={meta.full}
                value={r.status === "REVIEW" ? "Review needed" : r.status}
                big
                tone={meta.tone}
              />
              <Callout
                tone={
                  meta.tone === "bad" ? "bad" : meta.tone === "good" ? "good" : "note"
                }
              >
                {meta.tax}
              </Callout>

              {r.status === "REVIEW" ? (
                <div className="space-y-3">
                  {r.reviewReasons.map((reason, i) => (
                    <p key={i} className="text-sm leading-relaxed text-ink-600">
                      {reason}
                    </p>
                  ))}
                  <p className="text-sm font-semibold text-ink-800">
                    Take this to a cross-border tax professional rather than
                    relying on a day-count answer.
                  </p>
                </div>
              ) : (
                <>
                  <ul className="space-y-2 pt-1">
                    {r.reasons.map((reason, i) => (
                      <li key={i} className="text-sm leading-relaxed text-ink-600">
                        • {reason}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-1">
                    <Row
                      label="182-day test"
                      value={r.meets182DayTest ? "Met" : "Not met"}
                    />
                    <Row
                      label={`Second test (${r.secondLimbThreshold} days + 365 days)`}
                      value={r.meetsSecondLimbTest ? "Met" : "Not met"}
                    />
                    <Row
                      label="Deemed resident (s.6(1A))"
                      value={r.isDeemedResident ? "Yes" : "No"}
                    />
                    <Row
                      label="Not-ordinarily-resident tests"
                      value={
                        !r.isResident
                          ? "n/a"
                          : r.rnorByHistory || r.rnorBy120DayCategory
                            ? "Met"
                            : "Not met"
                      }
                    />
                  </div>
                </>
              )}
            </ResultPanel>

            {r.status === "RNOR" && (
              <Callout tone="good">
                <strong>RNOR is a transitional status.</strong> While it lasts,
                your foreign income is generally outside India&apos;s net, which
                is why timing 401(k)/IRA withdrawals, RSU sales and US capital
                gains matters. How many years it lasts depends entirely on your
                own day counts and history under the section 6(6) tests — it is
                not a fixed number of years, and it must be re-tested every
                financial year.
              </Callout>
            )}

            <ResultActions
              title="My India tax residency status"
              shareText={
                r.status === "REVIEW"
                  ? "This calculator flagged my India tax residency as needing professional review:"
                  : `This calculator says my India tax status is ${r.status} (${meta.full}):`
              }
              fileName="india-tax-residency"
              rows={[
                { label: "Status", value: `${r.status} — ${meta.full}` },
                { label: "182-day test", value: r.meets182DayTest ? "Met" : "Not met" },
                {
                  label: `${r.secondLimbThreshold}+365-day test`,
                  value: r.meetsSecondLimbTest ? "Met" : "Not met",
                },
                { label: "Deemed resident", value: r.isDeemedResident ? "Yes" : "No" },
              ]}
            />

            <p className="text-xs leading-relaxed text-ink-400">
              Estimate only, based on section 6 of the Income-tax Act 1961 and
              measured on the Indian financial year (1 April – 31 March). This
              tool does not model dual-status years, the DTAA tie-breaker,
              income characterisation, or whether you are &ldquo;liable to
              tax&rdquo; in another country as that term is used in section
              6(1A). Confirm with a qualified cross-border tax professional
              before acting on your status.
            </p>
          </>
        )
      }
    />
  );
}
