import { formatUsd } from "@/lib/format";

interface Row {
  label: string;
  valueCents: number;
  colorClass: string;
}

/**
 * Simple proportional bar comparison — one shared scale (the billed
 * charge), thin rounded-end bars, direct value labels. Not a chart library;
 * plain divs sized by percentage, so it costs nothing at runtime.
 */
export default function CostBreakdownBars({ billedChargeCents, insurerPaymentCents, memberLiabilityCents }: { billedChargeCents: number; insurerPaymentCents: number; memberLiabilityCents: number }) {
  const max = Math.max(billedChargeCents, 1);
  const rows: Row[] = [
    { label: "Hospital bill", valueCents: billedChargeCents, colorClass: "bg-ink-400" },
    { label: "Insurance pays", valueCents: insurerPaymentCents, colorClass: "bg-emerald-500" },
    { label: "You pay", valueCents: memberLiabilityCents, colorClass: "bg-brand-500" },
  ];
  return (
    <div className="space-y-3">
      {rows.map((r) => {
        const pct = Math.max(2, Math.min(100, (r.valueCents / max) * 100));
        return (
          <div key={r.label}>
            <div className="mb-1 flex items-baseline justify-between text-xs">
              <span className="font-semibold text-ink-700">{r.label}</span>
              <span className="tabular-nums font-bold text-ink-900">{formatUsd(r.valueCents / 100)}</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-ink-900/5">
              <div className={`h-full rounded-full ${r.colorClass} transition-[width] duration-500 ease-out motion-reduce:transition-none`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
