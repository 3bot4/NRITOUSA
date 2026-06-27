"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import InputCard, { Field, fieldClass } from "@/components/tools/InputCard";
import ResultCard from "@/components/tools/ResultCard";
import { formatUsd } from "@/lib/format";
import { trackToolUsed } from "@/lib/analytics";
import {
  DEFAULT_COST_INPUTS,
  SERVICE_TYPE_OPTIONS,
  computeCost,
  type CostInputs,
} from "@/lib/oci/cost";
import { VFS_FEES, OCI_DATA_AS_OF, OCI_TOOLS } from "@/lib/oci/config";

function Toggle({
  label,
  note,
  amount,
  checked,
  onChange,
}: {
  label: string;
  note?: string;
  amount: number;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-ink-900/10 bg-white p-3 hover:border-brand-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 accent-brand-600"
      />
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-ink-800">{label}</span>
          <span className="text-sm font-semibold text-ink-600">
            +{formatUsd(amount)}
          </span>
        </span>
        {note && <span className="mt-0.5 block text-xs text-ink-400">{note}</span>}
      </span>
    </label>
  );
}

export default function OciCostCalculator() {
  const [inputs, setInputs] = useState<CostInputs>(DEFAULT_COST_INPUTS);
  const result = useMemo(() => computeCost(inputs), [inputs]);

  const tracked = useRef(false);
  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackToolUsed({
      tool_name: "oci-cost-calculator",
      result_type: "estimate_shown",
      category: "oci",
      page_slug: OCI_TOOLS.cost.path,
    });
  }, []);

  const set = <K extends keyof CostInputs>(key: K, value: CostInputs[K]) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  return (
    <ToolLayout
      inputs={
        <InputCard eyebrow="Your application" title="Build your estimate">
          <Field label="Service type">
            <select
              className={fieldClass}
              value={inputs.serviceType}
              onChange={(e) =>
                set("serviceType", e.target.value as CostInputs["serviceType"])
              }
            >
              {SERVICE_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Number of applicants" help="Applying as a family? Count everyone.">
            <input
              type="number"
              min={1}
              max={10}
              className={fieldClass}
              value={inputs.applicants}
              onChange={(e) =>
                set("applicants", Math.max(1, Number(e.target.value) || 1))
              }
            />
          </Field>

          <p className="pt-2 text-xs font-bold uppercase tracking-wider text-ink-400">
            Optional add-ons
          </p>
          <Toggle
            label={VFS_FEES.courierReturn.label}
            note={VFS_FEES.courierReturn.note}
            amount={VFS_FEES.courierReturn.amount}
            checked={inputs.returnCourier}
            onChange={(v) => set("returnCourier", v)}
          />
          <Toggle
            label={VFS_FEES.sms.label}
            note={VFS_FEES.sms.note}
            amount={VFS_FEES.sms.amount}
            checked={inputs.sms}
            onChange={(v) => set("sms", v)}
          />
          <Toggle
            label={VFS_FEES.premiumLounge.label}
            note={VFS_FEES.premiumLounge.note}
            amount={VFS_FEES.premiumLounge.amount}
            checked={inputs.premiumLounge}
            onChange={(v) => set("premiumLounge", v)}
          />

          <button
            type="button"
            onClick={() => setInputs(DEFAULT_COST_INPUTS)}
            className="text-xs font-semibold text-ink-400 underline hover:text-ink-600"
          >
            Reset
          </button>
        </InputCard>
      }
      results={
        <div className="space-y-6">
          <ResultCard
            tone="positive"
            eyebrow="Estimated total"
            title={formatUsd(result.total)}
            badge={
              result.applicants > 1 ? `${result.applicants} applicants` : "Per applicant"
            }
          >
            <p>
              {result.applicants > 1 ? (
                <>
                  {formatUsd(result.perApplicant)} per applicant ×{" "}
                  {result.applicants} applicants.
                </>
              ) : (
                <>This is a per-applicant estimate.</>
              )}{" "}
              All amounts are educational estimates summarised as of{" "}
              <time dateTime={OCI_DATA_AS_OF}>{OCI_DATA_AS_OF}</time> — confirm
              live fees on VFS before you pay.
            </p>
          </ResultCard>

          <ResultCard tone="info" eyebrow="Line by line" title="Per-applicant breakdown">
            <ul className="divide-y divide-ink-900/5">
              {result.lines.map((l) => (
                <li key={l.id} className="flex items-baseline justify-between gap-3 py-2">
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-ink-700">
                      {l.label}
                      {l.optional && (
                        <span className="ml-1.5 rounded bg-ink-900/5 px-1.5 py-0.5 text-[0.625rem] font-bold uppercase text-ink-500">
                          optional
                        </span>
                      )}
                    </span>
                    {l.note && (
                      <span className="block text-xs text-ink-400">{l.note}</span>
                    )}
                  </span>
                  <span className="shrink-0 text-sm font-semibold text-ink-800">
                    {formatUsd(l.amount)}
                  </span>
                </li>
              ))}
              <li className="flex items-baseline justify-between gap-3 py-2.5">
                <span className="text-sm font-bold text-ink-900">
                  Per applicant
                </span>
                <span className="text-sm font-bold text-ink-900">
                  {formatUsd(result.perApplicant)}
                </span>
              </li>
            </ul>
          </ResultCard>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-sm text-ink-600">
            <strong className="font-semibold text-ink-900">
              Fees can change.
            </strong>{" "}
            Always verify with the latest VFS fee table before mailing your
            application. The government fee, ICWF, and VFS service charge are
            shown as separate lines above and were summarised as of{" "}
            <time dateTime={OCI_DATA_AS_OF}>{OCI_DATA_AS_OF}</time>.
          </div>
        </div>
      }
    />
  );
}
