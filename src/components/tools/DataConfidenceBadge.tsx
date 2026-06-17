/**
 * Small badge indicating the confidence / provenance of a dashboard metric.
 * Keeps the "honest data" promise visible on every stat card.
 */

export type ConfidenceType =
  | "official"
  | "calculated"
  | "estimate"
  | "manually-maintained"
  | "uscis-estimate";

const STYLES: Record<ConfidenceType, { label: string; className: string }> = {
  official: {
    label: "Official",
    className: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  "manually-maintained": {
    label: "Manually maintained",
    className: "bg-amber-50 text-amber-700 border-amber-100",
  },
  calculated: {
    label: "Calculated",
    className: "bg-blue-50 text-blue-700 border-blue-100",
  },
  estimate: {
    label: "Estimate",
    className: "bg-violet-50 text-violet-700 border-violet-100",
  },
  "uscis-estimate": {
    label: "USCIS estimate",
    className: "bg-slate-50 text-slate-600 border-slate-200",
  },
};

export default function DataConfidenceBadge({
  type,
  note,
  className = "",
}: {
  /** One or more confidence types (e.g. ["official", "manually-maintained"]). */
  type: ConfidenceType | ConfidenceType[];
  /** Optional helper text shown as a native tooltip on hover/focus. */
  note?: string;
  className?: string;
}) {
  const types = Array.isArray(type) ? type : [type];
  return (
    <span className={`inline-flex flex-wrap gap-1 ${className}`} title={note}>
      {types.map((t) => {
        const s = STYLES[t];
        return (
          <span
            key={t}
            className={`inline-flex items-center whitespace-nowrap rounded-full border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${s.className}`}
          >
            {s.label}
          </span>
        );
      })}
    </span>
  );
}
