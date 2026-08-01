import { CONFIDENCE_DOT, CONFIDENCE_LABEL_TEXT, MISSING_INPUT_SHORT_LABELS, UNCAPPED_EXPOSURE_NOTE } from "./shared";
import type { ConfidenceLabel } from "@/lib/calc/visitorInsurance/types";

const RING: Record<ConfidenceLabel, string> = {
  higher: "border-emerald-200 bg-emerald-50/60",
  moderate: "border-amber-200 bg-amber-50/60",
  limited: "border-rose-200 bg-rose-50/60",
};
const TEXT: Record<ConfidenceLabel, string> = {
  higher: "text-emerald-900",
  moderate: "text-amber-900",
  limited: "text-rose-900",
};

/**
 * Calculation confidence score — not AI confidence. Green/yellow/red reflects
 * how many entered terms this specific number depends on were actually
 * provided, never a manufactured percentage.
 */
export default function UncertaintyPanel({
  missingInputs,
  confidence,
  uncappedExposureWarning,
}: {
  missingInputs: string[];
  confidence: ConfidenceLabel;
  uncappedExposureWarning: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-4 ${RING[confidence]}`}>
      <div className="flex items-center gap-2">
        <span aria-hidden className={`h-3 w-3 flex-none rounded-full ${CONFIDENCE_DOT[confidence]}`} />
        <p className={`text-sm font-extrabold ${TEXT[confidence]}`}>{CONFIDENCE_LABEL_TEXT[confidence]}</p>
      </div>
      {missingInputs.length > 0 ? (
        <ul className={`mt-2.5 flex flex-wrap gap-1.5`}>
          {missingInputs.map((k) => (
            <li key={k} className={`rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold ${RING[confidence]} ${TEXT[confidence]}`}>
              {MISSING_INPUT_SHORT_LABELS[k] ?? k}
            </li>
          ))}
        </ul>
      ) : (
        <p className={`mt-2 text-sm ${TEXT[confidence]}`}>Every input this calculation depends on was entered.</p>
      )}
      {uncappedExposureWarning && (
        <p className={`mt-3 border-t border-current/20 pt-2 text-sm font-semibold ${TEXT[confidence]}`}>{UNCAPPED_EXPOSURE_NOTE}</p>
      )}
    </div>
  );
}
