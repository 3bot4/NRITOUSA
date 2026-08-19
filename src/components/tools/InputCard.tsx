/**
 * White card that wraps a tool's input controls, with the standard
 * eyebrow heading used across calculators.
 */
export default function InputCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card sm:p-7">
      {eyebrow && (
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-ink-400">
          {eyebrow}
        </p>
      )}
      {title && (
        <h2 className="mb-4 text-lg font-bold tracking-tight text-ink-900">
          {title}
        </h2>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
}

/** Shared input/select styling so tool forms match the existing estimators. */
// text-base (16px) on phones is deliberate: iOS Safari — and the Facebook /
// Instagram in-app browsers that wrap it — auto-zoom the page when a focused
// form control renders below 16px, and never zoom back out. Drop to text-sm
// only from `sm:` up, where no touch keyboard is involved.
export const fieldClass =
  "w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-base text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 sm:text-sm";

/** Label + optional help text wrapper for a single field. */
export function Field({
  label,
  help,
  children,
}: {
  label: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-ink-800">{label}</span>
      <div className="mt-1">{children}</div>
      {help && <span className="mt-1 block text-xs text-ink-400">{help}</span>}
    </label>
  );
}
