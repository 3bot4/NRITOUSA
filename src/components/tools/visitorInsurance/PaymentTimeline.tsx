import { formatUsd } from "@/lib/format";
import type { LedgerLine } from "@/lib/calc/visitorInsurance/types";

const STEP_ICON: Record<string, string> = {
  billed: "🏥",
  exclusion: "🚫",
  allowed: "🔖",
  balanceBilling: "⚠️",
  blocked: "❔",
  firstDollar: "✅",
  copay: "🧾",
  serviceDeductible: "💳",
  generalDeductible: "💳",
  coinsurance: "📊",
  insurerBeforeLimits: "➡️",
  scheduledBenefit: "📋",
  aboveScheduledBenefit: "⚠️",
  sublimit: "🚧",
  evacuationMax: "✈️",
  repatriationMax: "🛬",
  perIncidentMax: "🚧",
  policyMax: "🚧",
  oopMaxRelease: "🎉",
  insurerFinal: "✅",
  memberFinal: "🧍",
};

/**
 * The detailed, step-by-step version of "explain every dollar" — every
 * ledger line the engine actually computed, as a connected visual timeline
 * with icons, replacing a plain numbered list. Sourced directly from
 * ClaimResult.ledger, so it can never drift from the real calculation.
 */
export default function PaymentTimeline({ ledger }: { ledger: LedgerLine[] }) {
  if (ledger.length === 0) return null;
  return (
    <ol className="relative space-y-0">
      {ledger.map((line, i) => (
        <li key={`${line.step}-${i}`} className="relative flex items-start gap-3 pb-4 last:pb-0">
          {i < ledger.length - 1 && <span aria-hidden className="absolute left-[15px] top-8 h-full w-px bg-ink-900/10" />}
          <span aria-hidden className="z-10 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-slate-100 text-sm">
            {STEP_ICON[line.step] ?? "•"}
          </span>
          <div className="flex flex-1 items-baseline justify-between gap-3 pt-1">
            <span className="text-sm text-ink-700">{line.label}</span>
            <span className="flex-none tabular-nums text-sm font-bold text-ink-900">{formatUsd(line.amountCents / 100)}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}
