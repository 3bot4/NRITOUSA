export type ResultTone = "neutral" | "positive" | "info" | "caution" | "attention";

const TONE_STYLES: Record<ResultTone, { border: string; badge: string }> = {
  neutral: { border: "border-ink-900/5", badge: "bg-ink-900/5 text-ink-700" },
  positive: { border: "border-emerald-200", badge: "bg-emerald-50 text-emerald-700" },
  info: { border: "border-sky-200", badge: "bg-sky-50 text-sky-700" },
  caution: { border: "border-amber-200", badge: "bg-amber-50 text-amber-700" },
  attention: { border: "border-rose-200", badge: "bg-rose-50 text-rose-700" },
};

/**
 * Result panel card with a tone-colored border and optional status badge.
 * Tones map to severity: positive (good news), info, caution, attention.
 */
export default function ResultCard({
  tone = "neutral",
  eyebrow,
  title,
  badge,
  children,
}: {
  tone?: ResultTone;
  eyebrow?: string;
  title: string;
  badge?: string;
  children: React.ReactNode;
}) {
  const styles = TONE_STYLES[tone];
  return (
    <div className={`rounded-2xl border bg-white p-6 shadow-card ${styles.border}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          {eyebrow && (
            <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
              {eyebrow}
            </p>
          )}
          <h3 className="mt-0.5 text-lg font-bold tracking-tight text-ink-900">
            {title}
          </h3>
        </div>
        {badge && (
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${styles.badge}`}
          >
            {badge}
          </span>
        )}
      </div>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-500">
        {children}
      </div>
    </div>
  );
}
