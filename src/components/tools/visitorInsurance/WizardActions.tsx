"use client";

/**
 * Back/Continue action row for a wizard step. Sticky to the bottom of the
 * viewport on mobile (a real "sticky Calculate button"), inline on desktop.
 */
export default function WizardActions({
  onBack,
  onNext,
  nextLabel = "Continue →",
  nextDisabled = false,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
}) {
  return (
    <div className="sticky bottom-0 -mx-4 mt-2 flex items-center justify-between gap-2 border-t border-ink-900/10 bg-white/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
      {onBack ? (
        <button type="button" onClick={onBack} className="rounded-xl border border-ink-900/15 bg-white px-6 py-3 text-sm font-bold text-ink-700 hover:bg-ink-50">
          ← Back
        </button>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {nextLabel}
      </button>
    </div>
  );
}
