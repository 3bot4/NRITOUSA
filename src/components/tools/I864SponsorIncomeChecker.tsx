"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import InputCard, { Field, fieldClass } from "@/components/tools/InputCard";
import ResultCard from "@/components/tools/ResultCard";
import EmailMyResult from "@/components/tools/EmailMyResult";
import {
  IncomeVsRequirementChart,
  ThresholdBySizeChart,
} from "@/components/tools/i864/charts";
import {
  evaluateSponsor,
  householdSize,
  EMPTY_HOUSEHOLD,
  type HouseholdCounts,
} from "@/lib/calc/i864Income";
import {
  I864_LOCATIONS,
  I864_TABLES,
  ASSET_RULE_LIST,
  ASSET_RULES,
  I864P,
  I864_SOURCES,
  HOUSEHOLD_COMPONENTS,
  type AssetCase,
  type I864Location,
} from "@/data/affidavitOfSupportData";

/**
 * Sponsor income checker for Form I-864.
 *
 * Runs entirely in the browser — nothing is stored, nothing is sent. The
 * arithmetic lives in src/lib/calc/i864Income.ts and is unit-tested against
 * the figures printed on Form I-864P; this component only collects inputs and
 * renders.
 */

const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

/** Number inputs are strings so the field can legitimately be empty. */
type CountKey = keyof HouseholdCounts;

const COUNT_FIELDS: {
  key: CountKey;
  label: string;
  help: string;
  min: number;
  max: number;
}[] = [
  {
    key: "spouse",
    label: "Your spouse",
    help: "1 if you are married, 0 if not — whether or not they earn anything, and whether or not they are the person you are sponsoring.",
    min: 0,
    max: 1,
  },
  {
    key: "children",
    label: "Your unmarried children under 21",
    help: "Count them even if they live elsewhere.",
    min: 0,
    max: 12,
  },
  {
    key: "dependents",
    label: "Other dependents on your last tax return",
    help: "A parent, an adult child at college — anyone you claimed and have not already counted above.",
    min: 0,
    max: 12,
  },
  {
    key: "immigrants",
    label: "People you are sponsoring on this affidavit",
    help: "The principal immigrant plus any spouse or children immigrating with them. This is the number people forget.",
    min: 1,
    max: 12,
  },
  {
    key: "priorObligations",
    label: "People still covered by an earlier I-864 you signed",
    help: "An old affidavit keeps counting until that person naturalises, is credited with 40 qualifying quarters, permanently leaves the US, or dies.",
    min: 0,
    max: 12,
  },
];

export default function I864SponsorIncomeChecker() {
  const [counts, setCounts] = useState<Record<CountKey, string>>({
    spouse: "0",
    children: "0",
    dependents: "0",
    immigrants: "1",
    priorObligations: "0",
  });
  const [location, setLocation] = useState<I864Location>("contiguous");
  const [military, setMilitary] = useState(false);
  const [income, setIncome] = useState("");
  const [assetCase, setAssetCase] = useState<AssetCase>("other");

  const numeric: HouseholdCounts = useMemo(
    () => ({
      spouse: Number(counts.spouse) || 0,
      children: Number(counts.children) || 0,
      dependents: Number(counts.dependents) || 0,
      immigrants: Number(counts.immigrants) || 0,
      priorObligations: Number(counts.priorObligations) || 0,
    }),
    [counts]
  );

  const size = householdSize(numeric);
  const incomeValue = Number(String(income).replace(/[$, ]/g, ""));
  const entered = income.trim() !== "" && Number.isFinite(incomeValue);

  const result = useMemo(
    () =>
      evaluateSponsor({
        counts: numeric,
        location,
        military,
        income: entered ? incomeValue : 0,
        assetCase,
      }),
    [numeric, location, military, incomeValue, entered, assetCase]
  );

  const set = (key: CountKey, value: string) =>
    setCounts((c) => ({ ...c, [key]: value }));

  const rule = ASSET_RULES[assetCase];
  const locationLabel = I864_TABLES[location].shortLabel;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid gap-5 lg:grid-cols-2">
        {/* ── Inputs ─────────────────────────────────────────────── */}
        <div className="space-y-5">
          <InputCard eyebrow="Step 1" title="Build your household size">
            <p className="-mt-2 text-xs leading-relaxed text-ink-500">
              You always count as 1. Add each group below — this is the number
              that decides which row of Form I-864P applies to you.
            </p>
            {COUNT_FIELDS.map((f) => (
              <Field key={f.key} label={f.label} help={f.help}>
                <input
                  type="number"
                  inputMode="numeric"
                  min={f.min}
                  max={f.max}
                  step={1}
                  value={counts[f.key]}
                  onChange={(e) => set(f.key, e.target.value)}
                  className={fieldClass}
                />
              </Field>
            ))}
            <div className="rounded-xl border border-brand-200 bg-brand-50/60 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Household size
              </p>
              <p className="text-2xl font-black text-brand-700">{size}</p>
            </div>
          </InputCard>

          <InputCard eyebrow="Step 2" title="Where you live, and your income">
            <Field
              label="Where do you live?"
              help="Alaska and Hawaii have their own, higher poverty guidelines."
            >
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value as I864Location)}
                className={fieldClass}
              >
                {I864_LOCATIONS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.shortLabel}
                  </option>
                ))}
              </select>
            </Field>

            <label className="flex items-start gap-3 rounded-xl border border-ink-900/10 bg-white px-3 py-3">
              <input
                type="checkbox"
                checked={military}
                onChange={(e) => setMilitary(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-ink-900/20 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-xs leading-relaxed text-ink-700">
                <strong className="font-semibold text-ink-900">
                  I am on active duty in the US armed forces and I am sponsoring
                  my own spouse or child.
                </strong>{" "}
                This is the only situation where the 100% threshold applies
                instead of 125%. It does not apply to a joint sponsor who happens
                to serve, or to sponsoring a parent or sibling.
              </span>
            </label>

            <Field
              label="Total income from your most recent federal tax return"
              help="The total income line, not your take-home pay and not the household's combined figure."
            >
              <input
                type="text"
                inputMode="decimal"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="e.g. 52000"
                className={fieldClass}
              />
            </Field>

            <Field
              label="If you need to use assets, which describes the immigrant?"
              help="The multiple of the shortfall that assets must cover depends on this — 8 CFR 213a.2."
            >
              <select
                value={assetCase}
                onChange={(e) => setAssetCase(e.target.value as AssetCase)}
                className={fieldClass}
              >
                {ASSET_RULE_LIST.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label} — {r.multiple}× the shortfall
                  </option>
                ))}
              </select>
            </Field>
          </InputCard>
        </div>

        {/* ── Results ────────────────────────────────────────────── */}
        <div className="space-y-5">
          <ResultCard
            tone={!entered ? "neutral" : result.meets ? "positive" : "attention"}
            eyebrow="Your result"
            title={
              !entered
                ? "Enter your income to see the answer"
                : result.meets
                  ? "Your income meets the requirement"
                  : "Your income is below the requirement"
            }
            badge={
              !entered ? undefined : result.meets ? "Meets" : `Short ${usd(result.shortfall)}`
            }
          >
            <dl className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-ink-900/[0.03] px-3 py-2.5">
                <dt className="text-xs font-semibold text-ink-500">
                  Minimum income required
                </dt>
                <dd className="text-xl font-black text-ink-900">
                  {usd(result.required)}
                </dd>
                <p className="mt-0.5 text-[0.7rem] text-ink-400">
                  {military ? "100%" : "125%"} of the guideline · household of{" "}
                  {size} · {locationLabel}
                </p>
              </div>
              <div className="rounded-xl bg-ink-900/[0.03] px-3 py-2.5">
                <dt className="text-xs font-semibold text-ink-500">
                  {entered ? "Your income" : "Your income (not entered)"}
                </dt>
                <dd className="text-xl font-black text-ink-900">
                  {entered ? usd(result.income) : "—"}
                </dd>
                {entered && (
                  <p className="mt-0.5 text-[0.7rem] text-ink-400">
                    {result.meets
                      ? `${usd(result.surplus)} above the line`
                      : `${usd(result.shortfall)} below the line`}
                  </p>
                )}
              </div>
            </dl>

            {entered && (
              <IncomeVsRequirementChart
                income={result.income}
                required={result.required}
                meets={result.meets}
              />
            )}
          </ResultCard>

          {entered && !result.meets && (
            <ResultCard
              tone="caution"
              eyebrow="Three ways to close a gap"
              title={`You are ${usd(result.shortfall)} short — here is what each route asks for`}
            >
              <ol className="space-y-3">
                <li className="rounded-xl border border-ink-900/5 bg-white px-4 py-3">
                  <p className="text-sm font-bold text-ink-900">
                    1. A household member&apos;s income — Form I-864A
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-500">
                    Someone who already counts in your household of {size} — an
                    earning spouse, an adult child living with you — signs Form
                    I-864A and their income is added to yours. They need to bring
                    at least <strong>{usd(result.shortfall)}</strong> for the two
                    of you to clear {usd(result.required)} together. This does not
                    change your household size, because they were already in it.
                  </p>
                </li>
                <li className="rounded-xl border border-ink-900/5 bg-white px-4 py-3">
                  <p className="text-sm font-bold text-ink-900">
                    2. Assets — {rule.multiple}× the shortfall
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-500">
                    {rule.detail} For your case that means net assets of{" "}
                    <strong>{usd(result.assetsNeeded)}</strong> — the value after
                    subtracting any debt against them, and only assets that could
                    actually be converted to cash within a year without hardship.
                  </p>
                </li>
                <li className="rounded-xl border border-ink-900/5 bg-white px-4 py-3">
                  <p className="text-sm font-bold text-ink-900">3. A joint sponsor</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-500">
                    A second sponsor files their own complete I-864 and must meet
                    the requirement for <em>their</em> own household on their own
                    income — not the gap, the whole amount. They do not have to be
                    related to anyone. They are taking on the same enforceable
                    obligation you are.
                  </p>
                </li>
              </ol>
            </ResultCard>
          )}

          {entered && (
            <EmailMyResult
              subject="My I-864 sponsor income check"
              intro={`Affidavit of support income check, based on Form I-864P effective ${I864P.effective}.`}
              lines={[
                { label: "Household size", value: String(size) },
                { label: "Location", value: locationLabel },
                {
                  label: "Threshold applied",
                  value: military ? "100% (active-duty rule)" : "125%",
                },
                { label: "Minimum income required", value: usd(result.required) },
                { label: "Income entered", value: usd(result.income) },
                {
                  label: "Result",
                  value: result.meets
                    ? `Meets the requirement by ${usd(result.surplus)}`
                    : `Short by ${usd(result.shortfall)}`,
                },
                ...(result.meets
                  ? []
                  : [
                      {
                        label: `Assets that would close the gap (${rule.multiple}x)`,
                        value: usd(result.assetsNeeded),
                      },
                    ]),
              ]}
              footnote={`Verify against the current Form I-864P: ${I864_SOURCES.i864p}`}
            />
          )}
        </div>
      </div>

      {/* ── Threshold chart across household sizes ─────────────────── */}
      <div className="mt-8 rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card sm:p-6">
        <h3 className="text-base font-bold text-ink-900">
          What the requirement looks like across household sizes
        </h3>
        <p className="mt-1 text-sm text-ink-500">
          {I864_TABLES[location].shortLabel}, {military ? "100%" : "125%"} of the
          Federal Poverty Guidelines. Your household of {size} is highlighted.
          Each extra person you are sponsoring moves you one bar to the right.
        </p>
        <div className="overflow-x-auto">
          <div className="min-w-[340px]">
            <ThresholdBySizeChart
              location={location}
              military={military}
              highlightSize={size}
            />
          </div>
        </div>
        <p className="mt-3 text-xs text-ink-400">
          Educational tool. It does not decide your case and it is not legal
          advice — confirm your own figures against{" "}
          <a
            href={I864_SOURCES.i864p}
            target="_blank"
            rel="nofollow noopener"
            className="text-brand-600 underline"
          >
            Form I-864P
          </a>{" "}
          before you file. Sponsoring a parent from India?{" "}
          <Link href="/nvc-document-checklist-india" className="text-brand-600 underline">
            See the NVC document checklist
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
