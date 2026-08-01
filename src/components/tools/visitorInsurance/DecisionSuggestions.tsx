import { formatUsd } from "@/lib/format";
import type { DecisionSuggestion } from "@/lib/calc/visitorInsurance/decisionSuggestions";

/**
 * "Suggestions to reduce financial risk" — concepts, never products. Every
 * dollar figure shown here comes from actually re-running the engine
 * (see decisionSuggestions.ts), so "why" is a real number, not a canned line.
 */
export default function DecisionSuggestions({ suggestions }: { suggestions: DecisionSuggestion[] }) {
  if (suggestions.length === 0) return null;
  return (
    <div className="rounded-2xl border border-sky-100 bg-sky-50/50 p-4">
      <p className="mb-2 text-sm font-bold text-sky-900">💡 Ways to reduce your financial risk</p>
      <div className="space-y-3">
        {suggestions.map((s) => (
          <div key={s.id} className="rounded-xl bg-white p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-ink-900">{s.title}</p>
              {s.deltaCents !== undefined && s.deltaCents > 0 && (
                <span className="flex-none rounded-full bg-emerald-50 px-2 py-0.5 text-[0.65rem] font-bold text-emerald-700">
                  could save ~{formatUsd(s.deltaCents / 100)}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs leading-relaxed text-ink-500">{s.why}</p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[0.65rem] text-ink-400">
        These are educational concepts to ask about, not product recommendations. Every plan&rsquo;s actual terms and pricing vary — confirm with the insurer.
      </p>
    </div>
  );
}
