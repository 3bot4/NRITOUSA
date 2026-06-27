"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ToolLayout from "@/components/tools/ToolLayout";
import InputCard, { Field } from "@/components/tools/InputCard";
import ResultCard from "@/components/tools/ResultCard";
import { trackToolUsed } from "@/lib/analytics";
import {
  EMPTY_ELIGIBILITY,
  evaluateEligibility,
  type EligibilityInputs,
  type YesNoUnsure,
} from "@/lib/oci/eligibility";
import { OCI_TOOLS } from "@/lib/oci/config";

/* Privacy by design: every answer lives only in React state in the browser.
   No backend call, no storage — analytics receives only a coarse verdict. */

const YN: { value: YesNoUnsure; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "unsure", label: "Not sure" },
];

function Segmented({
  label,
  help,
  value,
  options = YN,
  onChange,
}: {
  label: string;
  help?: string;
  value: YesNoUnsure;
  options?: { value: YesNoUnsure; label: string }[];
  onChange: (v: YesNoUnsure) => void;
}) {
  return (
    <Field label={label} help={help}>
      <div
        className={`grid gap-2 ${
          options.length === 2 ? "grid-cols-2" : "grid-cols-3"
        }`}
      >
        {options.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              aria-pressed={active}
              className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                active
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-ink-900/10 bg-white text-ink-600 hover:border-brand-300"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </Field>
  );
}

export default function OciEligibilityChecker() {
  const [inputs, setInputs] = useState<EligibilityInputs>(EMPTY_ELIGIBILITY);
  const result = useMemo(() => evaluateEligibility(inputs), [inputs]);

  const lastTracked = useRef<string>("");
  useEffect(() => {
    if (!result.ready) return;
    if (lastTracked.current === result.verdict) return;
    lastTracked.current = result.verdict;
    trackToolUsed({
      tool_name: "oci-eligibility-checker",
      result_type: result.verdict,
      category: "oci",
      page_slug: OCI_TOOLS.eligibility.path,
    });
  }, [result.ready, result.verdict]);

  const set = <K extends keyof EligibilityInputs>(
    key: K,
    value: EligibilityInputs[K]
  ) => setInputs((prev) => ({ ...prev, [key]: value }));

  const showMarriageFollowup = inputs.spouseOci === "yes";

  return (
    <ToolLayout
      inputs={
        <InputCard eyebrow="Your situation" title="A few questions about you">
          <Segmented
            label="Are you currently a citizen of a country other than India?"
            help="OCI is only for foreign nationals (e.g. US, UK, Canada, Australia citizens)."
            value={inputs.foreignCitizen}
            onChange={(v) => set("foreignCitizen", v)}
          />
          <Segmented
            label="Are you currently an Indian citizen / hold an Indian passport?"
            help="You cannot hold OCI and Indian citizenship at the same time."
            value={inputs.indianCitizen}
            onChange={(v) => set("indianCitizen", v)}
          />
          <Segmented
            label="Were you born in India?"
            value={inputs.bornInIndia}
            onChange={(v) => set("bornInIndia", v)}
          />
          <Segmented
            label="Is/was either of your parents an Indian citizen?"
            value={inputs.parentIndian}
            onChange={(v) => set("parentIndian", v)}
          />
          <Segmented
            label="Is/was any of your grandparents an Indian citizen?"
            value={inputs.grandparentIndian}
            onChange={(v) => set("grandparentIndian", v)}
          />
          <Segmented
            label="Is/was any of your great-grandparents an Indian citizen?"
            help="OCI ancestry can extend to great-grandchildren of Indian citizens."
            value={inputs.greatGrandparentIndian}
            onChange={(v) => set("greatGrandparentIndian", v)}
          />
          <Segmented
            label="Is your spouse an Indian citizen or OCI holder?"
            value={inputs.spouseOci}
            onChange={(v) => set("spouseOci", v)}
          />
          {showMarriageFollowup && (
            <Segmented
              label="Has the marriage lasted at least 2 years?"
              help="Spouse-based OCI generally needs a registered marriage of 2+ years, still subsisting."
              value={inputs.marriageYears}
              options={[
                { value: "yes", label: "2+ years" },
                { value: "no", label: "Under 2 years" },
              ]}
              onChange={(v) => set("marriageYears", v)}
            />
          )}
          <Segmented
            label="Are you (or your parents/grandparents) a current or former citizen of Pakistan or Bangladesh?"
            value={inputs.pakBangladesh}
            onChange={(v) => set("pakBangladesh", v)}
          />
          <Segmented
            label="Are you currently or recently in foreign military, police, or government service?"
            help="This doesn't automatically disqualify you, but it can require extra disclosure or clearance."
            value={inputs.govService}
            onChange={(v) => set("govService", v)}
          />
          <Segmented
            label="Is the applicant a minor (under 18)?"
            value={inputs.minor}
            options={[
              { value: "no", label: "Adult" },
              { value: "yes", label: "Minor" },
            ]}
            onChange={(v) => set("minor", v)}
          />

          <button
            type="button"
            onClick={() => setInputs(EMPTY_ELIGIBILITY)}
            className="text-xs font-semibold text-ink-400 underline hover:text-ink-600"
          >
            Reset
          </button>
        </InputCard>
      }
      results={
        <div className="space-y-6">
          <ResultCard
            tone={result.tone}
            eyebrow="Your eligibility"
            title={result.title}
            badge={result.badge}
          >
            {result.explanation.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </ResultCard>

          {result.ready && result.basis.length > 0 && (
            <ResultCard tone="info" eyebrow="Why" title="Your qualifying basis">
              <ul className="space-y-1.5">
                {result.basis.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span aria-hidden className="text-brand-500">
                      ✓
                    </span>
                    <span className="text-ink-600">{b}</span>
                  </li>
                ))}
              </ul>
            </ResultCard>
          )}

          {result.ready && result.nextSteps.length > 0 && (
            <ResultCard tone="neutral" eyebrow="Do this next" title="Your next steps">
              <ul className="space-y-1.5">
                {result.nextSteps.map((s) => (
                  <li key={s} className="flex gap-2">
                    <span aria-hidden className="text-brand-500">
                      →
                    </span>
                    <span className="text-ink-600">{s}</span>
                  </li>
                ))}
              </ul>
            </ResultCard>
          )}

          {result.verdict === "eligible" && (
            <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-5 text-sm">
              <strong className="font-semibold text-ink-900">
                Ready to apply?
              </strong>{" "}
              <span className="text-ink-600">
                Build your exact paperwork with the{" "}
                <Link
                  href={OCI_TOOLS.checklist.path}
                  className="font-semibold text-brand-700 underline"
                >
                  Document Checklist Generator
                </Link>
                , then estimate the{" "}
                <Link
                  href={OCI_TOOLS.cost.path}
                  className="font-semibold text-brand-700 underline"
                >
                  cost
                </Link>{" "}
                and{" "}
                <Link
                  href={OCI_TOOLS.timeline.path}
                  className="font-semibold text-brand-700 underline"
                >
                  timeline
                </Link>
                .
              </span>
            </div>
          )}
        </div>
      }
    />
  );
}
