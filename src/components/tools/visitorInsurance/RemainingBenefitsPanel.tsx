import { formatUsd } from "@/lib/format";
import type { ClaimResult } from "@/lib/calc/visitorInsurance/types";

const ROWS: { key: keyof ClaimResult["remaining"]; label: string }[] = [
  { key: "deductibleCents", label: "Deductible remaining" },
  { key: "policyMaximumCents", label: "Policy maximum remaining" },
  { key: "sublimitCents", label: "Service sublimit remaining" },
  { key: "perIncidentMaximumCents", label: "Per-incident maximum remaining" },
  { key: "outOfPocketMaximumCents", label: "Out-of-pocket maximum remaining" },
];

export default function RemainingBenefitsPanel({ remaining }: { remaining: ClaimResult["remaining"] }) {
  const rows = ROWS.filter((r) => remaining[r.key] !== undefined);
  if (rows.length === 0) return null;
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {rows.map((r) => (
        <div key={r.key} className="rounded-xl border border-ink-900/10 bg-slate-50/70 p-3">
          <p className="text-[0.625rem] font-bold uppercase tracking-wide text-ink-400">{r.label}</p>
          <p className="mt-1 text-sm font-extrabold tabular-nums text-ink-900">{formatUsd((remaining[r.key] ?? 0) / 100)}</p>
        </div>
      ))}
    </div>
  );
}
