import { formatUsd } from "@/lib/format";

/**
 * The primary result readout — large, color-coded numbers instead of a
 * dense stat-tile grid. Insurance Pays = green, You Pay = blue (a deliberate
 * anti-anxiety choice — what you owe is informational, not a "danger" red),
 * Premium = neutral gray (a sunk cost, not part of the medical liability
 * math), Total = a single highlighted card that adds the two together.
 */
export default function BigResultHeadline({
  insurerPaymentCents,
  memberLiabilityCents,
  premiumCents,
}: {
  insurerPaymentCents: number;
  memberLiabilityCents: number;
  premiumCents?: number;
}) {
  const total = memberLiabilityCents + (premiumCents ?? 0);
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Insurance pays</p>
        <p className="mt-1 text-3xl font-extrabold tabular-nums text-emerald-700 sm:text-4xl">{formatUsd(insurerPaymentCents / 100)}</p>
      </div>
      <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-brand-700">You pay</p>
        <p className="mt-1 text-3xl font-extrabold tabular-nums text-brand-700 sm:text-4xl">{formatUsd(memberLiabilityCents / 100)}</p>
      </div>
      {premiumCents !== undefined && (
        <div className="rounded-2xl border border-ink-900/10 bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Trip premium</p>
          <p className="mt-1 text-2xl font-extrabold tabular-nums text-ink-600 sm:text-3xl">{formatUsd(premiumCents / 100)}</p>
        </div>
      )}
      <div className={`rounded-2xl border-2 border-ink-900 bg-ink-900 p-4 ${premiumCents === undefined ? "sm:col-span-2" : ""}`}>
        <p className="text-xs font-bold uppercase tracking-wide text-white/70">Total financial cost</p>
        <p className="mt-1 text-2xl font-extrabold tabular-nums text-white sm:text-3xl">{formatUsd((premiumCents !== undefined ? total : memberLiabilityCents) / 100)}</p>
      </div>
    </div>
  );
}
