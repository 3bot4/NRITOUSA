import { formatUsd } from "@/lib/format";
import type { MemberLiabilityBreakdown } from "@/lib/calc/visitorInsurance/types";

const ROWS: { key: keyof MemberLiabilityBreakdown; label: string }[] = [
  { key: "deductibleCents", label: "Deductible" },
  { key: "copayCents", label: "Copay" },
  { key: "coinsuranceCents", label: "Coinsurance" },
  { key: "balanceBillingCents", label: "Balance billing" },
  { key: "nonCoveredCents", label: "Non-covered amount" },
  { key: "aboveSublimitCents", label: "Amount above a service sublimit" },
  { key: "aboveScheduledBenefitCents", label: "Amount above the scheduled benefit" },
  { key: "abovePolicyMaximumCents", label: "Amount above the policy/incident maximum" },
];

/** Visual "who pays what" breakdown: premium + every member-liability bucket + insurer payment. */
export default function WhoPaysWhat({
  premiumCents,
  insurerPaymentCents,
  liability,
}: {
  premiumCents?: number;
  insurerPaymentCents: number;
  liability: MemberLiabilityBreakdown;
}) {
  const rows = ROWS.filter((r) => liability[r.key] > 0);
  return (
    <div className="space-y-1.5">
      {premiumCents !== undefined && (
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-ink-600">Premium (paid regardless of claims)</span>
          <span className="tabular-nums font-medium text-ink-800">{formatUsd(premiumCents / 100)}</span>
        </div>
      )}
      {rows.length === 0 && (
        <p className="text-sm text-ink-500">No member cost-sharing on this claim at the entered terms.</p>
      )}
      {rows.map((r) => (
        <div key={r.key} className="flex items-center justify-between gap-3 text-sm">
          <span className="text-ink-600">{r.label}</span>
          <span className="tabular-nums font-medium text-rose-700">{formatUsd(liability[r.key] / 100)}</span>
        </div>
      ))}
      <div className="flex items-center justify-between gap-3 border-t border-ink-900/10 pt-1.5 text-sm">
        <span className="font-semibold text-ink-900">Insurer payment</span>
        <span className="tabular-nums font-bold text-emerald-700">{formatUsd(insurerPaymentCents / 100)}</span>
      </div>
      <div className="flex items-center justify-between gap-3 rounded-xl bg-ink-900/5 px-3 py-2 text-sm">
        <span className="font-bold text-ink-900">Total member liability (medical only)</span>
        <span className="tabular-nums text-lg font-extrabold text-ink-900">{formatUsd(liability.totalCents / 100)}</span>
      </div>
    </div>
  );
}
