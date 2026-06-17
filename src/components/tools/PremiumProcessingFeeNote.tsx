/**
 * Renders the current premium-processing fee + "last verified" + source for a
 * given form, reading ONLY from the central premiumProcessing source of truth
 * (src/lib/premiumProcessing.ts). Never hardcode fee amounts in callers.
 */
import { getPremiumFeeByForm, premiumProcessing } from "@/lib/premiumProcessing";

export type PremiumFeeType = "h1bI129" | "i140" | "f1OptI765" | "i539" | "i485";

const FORM_FOR_TYPE: Record<PremiumFeeType, string> = {
  h1bI129: "I-129",
  i140: "I-140",
  f1OptI765: "I-765",
  i539: "I-539",
  i485: "I-485",
};

export default function PremiumProcessingFeeNote({
  feeType,
  className = "",
}: {
  feeType: PremiumFeeType;
  className?: string;
}) {
  const item = getPremiumFeeByForm(FORM_FOR_TYPE[feeType])[0];
  if (!item) return null;

  return (
    <div className={`rounded-lg border border-ink-900/5 bg-ink-50/50 px-3 py-2 text-xs leading-relaxed text-ink-500 ${className}`}>
      <p>
        <span className="font-semibold text-ink-700">
          {item.eligible ? `Premium processing fee: ${item.feeDisplay}` : "Premium processing: not available"}
        </span>{" "}
        — {item.timelineDisplay}. {item.note}
      </p>
      <p className="mt-1">
        Last verified: {premiumProcessing.lastVerified} · Source:{" "}
        <a
          href={premiumProcessing.officialSourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand-600 underline decoration-brand-200 underline-offset-2 hover:text-brand-700"
        >
          {premiumProcessing.officialSourceName}
        </a>
      </p>
    </div>
  );
}
