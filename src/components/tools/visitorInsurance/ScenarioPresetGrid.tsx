"use client";

import { ILLUSTRATIVE_SCENARIOS } from "@/lib/calc/visitorInsurance/scenarios";
import { formatUsd } from "@/lib/format";

/**
 * "My father went to the ER" style preset cards. Clicking one prefills a
 * realistic example claim — always clearly labeled as an editable example,
 * never presented as a real quote, researched pricing, or a location-
 * specific estimate. The range shown is illustrative only (see
 * scenarios.ts) — it exists so a first-time user can picture the scale of
 * a situation, not to claim real cost data.
 */
export default function ScenarioPresetGrid({
  activeKey,
  onSelect,
  max,
  showRange = true,
}: {
  activeKey?: string;
  onSelect: (key: string) => void;
  max?: number;
  showRange?: boolean;
}) {
  const scenarios = max ? ILLUSTRATIVE_SCENARIOS.slice(0, max) : ILLUSTRATIVE_SCENARIOS;
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {scenarios.map((s) => {
        const selected = s.key === activeKey;
        return (
          <button
            key={s.key}
            type="button"
            onClick={() => onSelect(s.key)}
            className={`flex flex-col items-start gap-1 rounded-xl border-2 px-3 py-2.5 text-left transition ${
              selected ? "border-brand-500 bg-brand-50" : "border-ink-900/10 bg-white hover:border-brand-200 hover:bg-brand-50/40"
            }`}
          >
            <span className="flex items-center gap-2">
              <span aria-hidden className="text-lg">{s.icon}</span>
              <span className={`text-xs font-semibold leading-tight ${selected ? "text-brand-800" : "text-ink-700"}`}>{s.label}</span>
            </span>
            {showRange && (
              <span className="text-[0.65rem] text-ink-400">
                ~{formatUsd(s.rangeUsd[0])}–{formatUsd(s.rangeUsd[1])} <span className="italic">(illustrative)</span>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
