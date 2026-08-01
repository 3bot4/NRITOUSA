import { formatUsd } from "@/lib/format";
import ResultCard from "@/components/tools/ResultCard";
import type { HouseholdResult } from "@/lib/calc/visitorInsurance/types";

const PROVISION_LABEL: Record<HouseholdResult["sharedProvisionsApplied"][number], string> = {
  deductible: "shared/embedded family deductible",
  outOfPocketMaximum: "shared family out-of-pocket maximum",
  policyMaximum: "shared policy maximum",
};

/**
 * Household aggregate summary. Per spec §E: always show individual results
 * first (the caller renders those via ClaimResultPanel per traveler), this
 * is the aggregate second, and it never calls the sum a "family maximum"
 * unless a shared provision was explicitly entered. Same color language as
 * BigResultHeadline (green = insurer, blue = you, gray = premium,
 * highlighted = total) so the household card doesn't look like a different
 * product from the per-traveler results next to it.
 */
export default function FamilyBreakdown({ household, travelerLabels }: { household: HouseholdResult; travelerLabels: Record<string, string> }) {
  return (
    <ResultCard tone="neutral" eyebrow="Household total" title="Combined across every traveler">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
          <p className="text-[0.625rem] font-bold uppercase tracking-wide text-emerald-700">Insurance pays</p>
          <p className="mt-1 text-xl font-extrabold tabular-nums text-emerald-700">{formatUsd(household.aggregateInsurerPaymentCents / 100)}</p>
        </div>
        <div className="rounded-xl border border-brand-100 bg-brand-50/60 p-3">
          <p className="text-[0.625rem] font-bold uppercase tracking-wide text-brand-700">You pay</p>
          <p className="mt-1 text-xl font-extrabold tabular-nums text-brand-700">{formatUsd(household.aggregateMedicalLiabilityCents / 100)}</p>
        </div>
        <div className="rounded-xl border border-ink-900/10 bg-slate-50 p-3">
          <p className="text-[0.625rem] font-bold uppercase tracking-wide text-ink-500">Total premium</p>
          <p className="mt-1 text-lg font-extrabold tabular-nums text-ink-600">{formatUsd(household.aggregatePremiumCents / 100)}</p>
        </div>
        <div className="rounded-xl border-2 border-ink-900 bg-ink-900 p-3">
          <p className="text-[0.625rem] font-bold uppercase tracking-wide text-white/70">Total financial cost</p>
          <p className="mt-1 text-lg font-extrabold tabular-nums text-white">{formatUsd(household.aggregateTotalCostCents / 100)}</p>
        </div>
      </div>
      {household.sharedProvisionsApplied.length > 0 ? (
        <p className="text-xs text-ink-500">
          This household total reflects a{" "}
          {household.sharedProvisionsApplied.map((p) => PROVISION_LABEL[p]).join(", ")} because you entered that provision explicitly. Every other
          benefit was calculated independently per traveler.
        </p>
      ) : (
        <p className="text-xs text-ink-500">
          Each traveler ({Object.values(travelerLabels).join(", ")}) was calculated independently and then added together — this is a household sum,
          not a family maximum, unless your certificate states one.
        </p>
      )}
      {household.uncappedExposureWarning && <p className="text-xs font-semibold text-amber-800">Your total exposure may exceed this estimate.</p>}
    </ResultCard>
  );
}
