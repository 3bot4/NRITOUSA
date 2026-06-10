"use client";

import {
  NumberField,
  SelectField,
  CalcGrid,
  ResultPanel,
  Stat,
  Row,
  Callout,
} from "./ui";
import ResultActions from "@/components/ResultActions";
import { useUrlState } from "@/lib/useUrlState";

/**
 * India tax-residency classifier (Income-tax Act, section 6) — simplified.
 * Determines NRI / RNOR / ROR from days of presence, and flags when global
 * income becomes taxable in India. Estimates only; not tax advice.
 */
export default function RnorCalculator() {
  const [s, set] = useUrlState({
    curr: "90",
    last4: "300",
    last7: "500",
    nriYears: "9",
    visiting: "yes",
    highIncome: "no",
  });
  const { curr, last4, last7, nriYears, visiting, highIncome } = s;
  const setCurr = (v: string) => set("curr", v);
  const setLast4 = (v: string) => set("last4", v);
  const setLast7 = (v: string) => set("last7", v);
  const setNriYears = (v: string) => set("nriYears", v);
  const setVisiting = (v: string) => set("visiting", v);
  const setHighIncome = (v: string) => set("highIncome", v);

  const c = Math.max(0, parseFloat(curr) || 0);
  const d4 = Math.max(0, parseFloat(last4) || 0);
  const d7 = Math.max(0, parseFloat(last7) || 0);
  const nri = Math.max(0, Math.min(10, parseFloat(nriYears) || 0));
  const isVisiting = visiting === "yes";
  const over15 = highIncome === "yes";

  // Second-condition threshold (the "60-day + 365-day in prior 4 yrs" test).
  // For an Indian citizen/PIO visiting India, 60 is relaxed to 182 — or to 120
  // if their India-source income exceeds ₹15 lakh.
  const secondThreshold = isVisiting ? (over15 ? 120 : 182) : 60;

  const cond1 = c >= 182;
  const cond2 = c >= secondThreshold && d4 >= 365;
  const isResident = cond1 || cond2;

  // The 120-day category is always RNOR by law.
  const residentVia120 = isVisiting && over15 && !cond1 && c >= 120 && c < 182 && d4 >= 365;

  const rnorByHistory = nri >= 9 || d7 <= 729;
  const isRNOR = isResident && (rnorByHistory || residentVia120);
  const isROR = isResident && !isRNOR;

  const status = !isResident ? "NRI" : isRNOR ? "RNOR" : "ROR";

  const statusMeta =
    status === "NRI"
      ? {
          tone: "good" as const,
          full: "Non-Resident Indian",
          tax: "Only your India-source income is taxable in India. Your US salary, 401(k), and US investments are not taxed by India.",
        }
      : status === "RNOR"
        ? {
            tone: "warn" as const,
            full: "Resident but Not Ordinarily Resident",
            tax: "Your foreign (US) income is generally NOT taxed in India — this is your transitional window. India income is taxable. Use this period before you become ROR.",
          }
        : {
            tone: "bad" as const,
            full: "Resident & Ordinarily Resident",
            tax: "Your WORLDWIDE income is taxable in India — including US salary, 401(k)/IRA distributions, and global capital gains (with DTAA credit for US tax paid).",
          };

  return (
    <CalcGrid
      inputs={
        <>
          <NumberField
            label="Days in India — current financial year"
            value={curr}
            onChange={setCurr}
            suffix="days"
            hint="India's FY runs 1 April – 31 March."
          />
          <NumberField
            label="Days in India — previous 4 financial years (total)"
            value={last4}
            onChange={setLast4}
            suffix="days"
            hint="Used for the 60/120/182-day + 365-day resident test."
          />
          <NumberField
            label="Days in India — previous 7 financial years (total)"
            value={last7}
            onChange={setLast7}
            suffix="days"
            hint="≤ 729 days here keeps you RNOR."
          />
          <NumberField
            label="Years you were an NRI in the last 10"
            value={nriYears}
            onChange={setNriYears}
            suffix="/ 10"
            hint="NRI in ≥ 9 of the last 10 years keeps you RNOR."
          />
          <SelectField
            label="Are you an Indian citizen / PIO visiting India?"
            value={visiting}
            onChange={setVisiting}
            options={[
              { value: "yes", label: "Yes — citizen/PIO on a visit" },
              { value: "no", label: "No — other" },
            ]}
            hint="Visitors get a relaxed day threshold."
          />
          <SelectField
            label="India-source income over ₹15 lakh this year?"
            value={highIncome}
            onChange={setHighIncome}
            options={[
              { value: "no", label: "No — ₹15 lakh or less" },
              { value: "yes", label: "Yes — over ₹15 lakh" },
            ]}
            hint="Triggers the 120-day rule for visitors."
          />
        </>
      }
      results={
        <>
          <ResultPanel
            title="Your India tax status"
            accent={
              status === "NRI"
                ? "from-emerald-500 to-teal-600"
                : status === "RNOR"
                  ? "from-amber-500 to-orange-600"
                  : "from-rose-500 to-pink-600"
            }
          >
            <Stat label={statusMeta.full} value={status} big tone={statusMeta.tone} />
            <Callout tone={statusMeta.tone === "bad" ? "bad" : statusMeta.tone === "good" ? "good" : "note"}>
              {statusMeta.tax}
            </Callout>
            <div className="pt-1">
              <Row label="Resident test (182 days)" value={cond1 ? "Met" : "Not met"} />
              <Row
                label={`Resident test (${secondThreshold} + 365 days)`}
                value={cond2 ? "Met" : "Not met"}
              />
              <Row label="RNOR by history" value={isResident ? (rnorByHistory || residentVia120 ? "Yes" : "No") : "n/a"} />
            </div>
          </ResultPanel>

          {status === "RNOR" && (
            <Callout tone="good">
              <strong>Plan around this window.</strong> Once you no longer
              qualify as RNOR (typically after ~2–3 years back in India), you
              become ROR and your global US assets become taxable in India.
              Consider timing 401(k)/IRA withdrawals, RSU sales, and US gains
              while still RNOR.
            </Callout>
          )}

          <ResultActions
            title="My India tax residency status"
            shareText={`This calculator says my India tax status is ${status} (${statusMeta.full}):`}
            fileName="india-tax-residency"
            rows={[
              { label: "Status", value: `${status} — ${statusMeta.full}` },
              { label: "182-day test", value: cond1 ? "Met" : "Not met" },
              { label: `${secondThreshold}+365-day test`, value: cond2 ? "Met" : "Not met" },
            ]}
          />

          <p className="text-xs leading-relaxed text-ink-400">
            Estimate only. The deemed-residency rule, dual-status years, and
            DTAA tie-breakers can change your result. Confirm with a qualified
            cross-border tax professional.
          </p>
        </>
      }
    />
  );
}
