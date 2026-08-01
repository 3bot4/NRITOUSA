import ResultCard from "@/components/tools/ResultCard";
import type { ClaimResult, PolicyTerms } from "@/lib/calc/visitorInsurance/types";
import { computeDecisionSuggestions } from "@/lib/calc/visitorInsurance/decisionSuggestions";
import BigResultHeadline from "./BigResultHeadline";
import CostBreakdownBars from "./CostBreakdownBars";
import MoneyWaterfall from "./MoneyWaterfall";
import PaymentTimeline from "./PaymentTimeline";
import WhoPaysWhat from "./WhoPaysWhat";
import RemainingBenefitsPanel from "./RemainingBenefitsPanel";
import UncertaintyPanel from "./UncertaintyPanel";
import NextQuestionsChecklist from "./NextQuestionsChecklist";
import DecisionSuggestions from "./DecisionSuggestions";
import { EDUCATIONAL_ESTIMATE_NOTE, RESULT_DOES_NOT_GUARANTEE, UNCAPPED_EXPOSURE_NOTE } from "./shared";

/**
 * The result screen for one claim — a Stripe-dashboard-style readout, not a
 * form summary. Big color-coded headline numbers, a proportional bar
 * comparison, a "where did your money go" waterfall, and a visible
 * confidence score are always on screen; the line-by-line timeline,
 * who-pays-what table, remaining benefits, and next-questions checklist
 * live inside one "See full breakdown" toggle so the glanceable summary
 * never gets buried under 5-7 stacked cards.
 */
export default function ClaimResultPanel({
  result,
  policy,
  premiumCents,
  billedChargeCents,
}: {
  result: ClaimResult;
  /** Enables the "reduce your financial risk" suggestions, which re-run the engine on hypothetical terms. */
  policy?: PolicyTerms;
  premiumCents?: number;
  billedChargeCents: number;
}) {
  const suggestions = policy ? computeDecisionSuggestions(policy, { id: result.claimantId }, result.claim, result) : [];
  return (
    <ResultCard tone="neutral" eyebrow="Estimated result" title="What this claim could mean for you" badge={result.uncappedExposureWarning ? "Exposure may exceed this" : undefined}>
      <BigResultHeadline insurerPaymentCents={result.insurerPaymentCents} memberLiabilityCents={result.memberLiability.totalCents} premiumCents={premiumCents} />

      <CostBreakdownBars billedChargeCents={billedChargeCents} insurerPaymentCents={result.insurerPaymentCents} memberLiabilityCents={result.memberLiability.totalCents} />

      {result.uncappedExposureWarning && <p className="text-xs font-semibold text-amber-800">{UNCAPPED_EXPOSURE_NOTE}</p>}

      <div>
        <p className="mb-2 text-sm font-bold text-ink-900">Where did your money go?</p>
        <MoneyWaterfall billedChargeCents={billedChargeCents} liability={result.memberLiability} insurerPaymentCents={result.insurerPaymentCents} />
      </div>

      <UncertaintyPanel missingInputs={result.missingInputs} confidence={result.confidence} uncappedExposureWarning={false} />

      <DecisionSuggestions suggestions={suggestions} />

      <details className="rounded-xl border border-ink-900/10 bg-white">
        <summary className="cursor-pointer px-4 py-2.5 text-xs font-bold text-brand-700">See full breakdown (step-by-step timeline, who pays what, remaining benefits, next questions)</summary>
        <div className="space-y-4 border-t border-ink-900/5 px-4 py-4">
          <div>
            <p className="mb-1.5 text-[0.625rem] font-bold uppercase tracking-wide text-ink-400">Step-by-step calculation</p>
            <PaymentTimeline ledger={result.ledger} />
          </div>

          <div>
            <p className="mb-1.5 text-[0.625rem] font-bold uppercase tracking-wide text-ink-400">Who pays what</p>
            <WhoPaysWhat premiumCents={premiumCents} insurerPaymentCents={result.insurerPaymentCents} liability={result.memberLiability} />
          </div>

          <div>
            <p className="mb-1.5 text-[0.625rem] font-bold uppercase tracking-wide text-ink-400">Remaining benefits</p>
            <RemainingBenefitsPanel remaining={result.remaining} />
          </div>

          <div>
            <p className="mb-1.5 text-[0.625rem] font-bold uppercase tracking-wide text-ink-400">Questions to ask your insurer</p>
            <NextQuestionsChecklist missingInputs={result.missingInputs} />
          </div>

          <div>
            <p className="mb-1.5 text-[0.625rem] font-bold uppercase tracking-wide text-ink-400">What this result does not guarantee</p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-ink-600">
              {RESULT_DOES_NOT_GUARANTEE.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      </details>

      <p className="text-xs leading-relaxed text-ink-500">{EDUCATIONAL_ESTIMATE_NOTE}</p>
    </ResultCard>
  );
}
