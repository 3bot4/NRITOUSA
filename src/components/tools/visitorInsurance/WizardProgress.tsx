"use client";

export interface WizardStep {
  key: string;
  label: string;
}

/**
 * Step progress indicator — ✓ done / ● current / ○ upcoming. Clicking a
 * completed or current step jumps to it; upcoming steps are visible but not
 * clickable, so users always see the whole journey ahead of them.
 */
export default function WizardProgress({ steps, currentIndex, onJump }: { steps: WizardStep[]; currentIndex: number; onJump: (i: number) => void }) {
  return (
    <nav aria-label="Progress" className="mb-5">
      <ol className="flex items-center">
        {steps.map((s, i) => {
          const done = i < currentIndex;
          const current = i === currentIndex;
          return (
            <li key={s.key} className={`flex items-center ${i < steps.length - 1 ? "flex-1" : ""}`}>
              <button
                type="button"
                disabled={i > currentIndex}
                onClick={() => onJump(i)}
                className={`flex items-center gap-2 rounded-full py-1 pr-2 text-left ${i > currentIndex ? "cursor-default" : "cursor-pointer"}`}
              >
                <span
                  aria-hidden
                  className={`flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-bold ${
                    done ? "bg-emerald-500 text-white" : current ? "bg-brand-600 text-white" : "border-2 border-ink-900/15 bg-white text-ink-400"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span className={`hidden text-xs font-bold sm:inline ${current ? "text-brand-700" : done ? "text-emerald-700" : "text-ink-400"}`}>{s.label}</span>
              </button>
              {i < steps.length - 1 && <span aria-hidden className={`mx-1 h-0.5 flex-1 rounded ${done ? "bg-emerald-400" : "bg-ink-900/10"}`} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
