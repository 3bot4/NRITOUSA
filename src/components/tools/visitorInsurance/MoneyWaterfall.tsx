import { formatUsd } from "@/lib/format";
import type { MemberLiabilityBreakdown } from "@/lib/calc/visitorInsurance/types";

/**
 * "Where did your money go?" — a step-down flow from the billed charge to
 * the final insurer payment. Consolidated into 3 liability categories (a
 * validated, CVD-safe 3-hue categorical set) plus the reserved emerald for
 * "insurance paid," rather than 7+ raw buckets, so it stays readable at a
 * glance. Only non-zero steps render.
 */
export default function MoneyWaterfall({
  billedChargeCents,
  liability,
  insurerPaymentCents,
}: {
  billedChargeCents: number;
  liability: MemberLiabilityBreakdown;
  insurerPaymentCents: number;
}) {
  const deductibleCopay = liability.deductibleCents + liability.copayCents;
  const coinsurance = liability.coinsuranceCents;
  const balanceAndLimits = liability.balanceBillingCents + liability.nonCoveredCents + liability.aboveSublimitCents + liability.aboveScheduledBenefitCents + liability.abovePolicyMaximumCents;

  const steps = [
    { key: "bill", icon: "🏥", label: "Hospital / medical bill", amount: billedChargeCents, tone: "text-ink-900", bar: "bg-ink-400" },
    ...(deductibleCopay > 0 ? [{ key: "ded", icon: "💳", label: "Deductible & copay", amount: -deductibleCopay, tone: "text-violet-700", bar: "bg-violet-600" }] : []),
    ...(coinsurance > 0 ? [{ key: "coins", icon: "📊", label: "Coinsurance", amount: -coinsurance, tone: "text-teal-700", bar: "bg-teal-600" }] : []),
    ...(balanceAndLimits > 0 ? [{ key: "bal", icon: "⚠️", label: "Balance billing, exclusions & above-limit", amount: -balanceAndLimits, tone: "text-orange-800", bar: "bg-orange-700" }] : []),
    { key: "paid", icon: "✅", label: "Insurance paid", amount: insurerPaymentCents, tone: "text-emerald-700", bar: "bg-emerald-600", final: true },
  ];

  return (
    <ol className="relative space-y-0">
      {steps.map((s, i) => (
        <li key={s.key} className="relative flex items-start gap-3 pb-5 pl-1 last:pb-0">
          {i < steps.length - 1 && <span aria-hidden className="absolute left-[19px] top-9 h-full w-px bg-ink-900/10" />}
          <span aria-hidden className={`z-10 flex h-9 w-9 flex-none items-center justify-center rounded-full text-base ${s.final ? "bg-emerald-100" : "bg-slate-100"}`}>
            {s.icon}
          </span>
          <div className={`flex-1 rounded-xl border-l-4 bg-white px-3 py-2 ${s.bar.replace("bg-", "border-")}`}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-semibold text-ink-800">{s.label}</span>
              <span className={`tabular-nums text-sm font-extrabold ${s.tone}`}>
                {s.amount < 0 ? "− " : ""}
                {formatUsd(Math.abs(s.amount) / 100)}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
