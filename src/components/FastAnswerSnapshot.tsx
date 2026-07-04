import OfficialSourceNote from "@/components/OfficialSourceNote";

/**
 * "Fast Answer" snapshot shown at the TOP of any page targeting a number intent
 * (fee, processing time, deadline, filing window). It answers the user's
 * question FIRST — a large, verified number — then shows "last verified" +
 * official source + disclaimer, then a CTA down to the personal calculator.
 *
 * Use for fee snapshots, processing-time snapshots, deadline snapshots, and
 * renewal timeline snapshots. Pull the values from
 * src/data/siteWideVerifiedNumbers.ts so they stay editable + audit-tracked.
 *
 * Layout:
 *  - `answer` renders as the single big headline number (optional).
 *  - `rows` render as key-number cards (desktop grid, mobile stacked).
 *  - `lastVerified` + `sourceUrl` + `disclaimer` render below via
 *    OfficialSourceNote.
 */
export interface SnapshotRow {
  /** Short label, e.g. "Online (Form I-90)". */
  label: string;
  /** The number, e.g. "$415" — rendered large. */
  value: string;
  /** Optional sub-note under the value. */
  note?: string;
  /** Tint this card as the recommended / primary option. */
  highlight?: boolean;
}

export default function FastAnswerSnapshot({
  title,
  answer,
  answerLabel,
  rows = [],
  lastVerified,
  sourceName,
  sourceUrl,
  sources,
  disclaimer,
  badges = [],
  ctaText,
  ctaHref,
  accent = "emerald",
}: {
  title: string;
  answer?: string;
  answerLabel?: string;
  rows?: SnapshotRow[];
  lastVerified: string;
  sourceName?: string;
  sourceUrl?: string;
  sources?: { label: string; href: string }[];
  disclaimer?: string;
  badges?: string[];
  ctaText?: string;
  ctaHref?: string;
  accent?: "emerald" | "brand" | "amber" | "sky";
}) {
  const tone = {
    emerald: { ring: "border-emerald-200", bg: "bg-emerald-50/50", big: "text-emerald-700", btn: "bg-emerald-600 hover:bg-emerald-700", chip: "border-emerald-100 bg-emerald-50 text-emerald-700" },
    brand: { ring: "border-brand-200", bg: "bg-brand-50/50", big: "text-brand-700", btn: "bg-brand-600 hover:bg-brand-700", chip: "border-brand-100 bg-brand-50 text-brand-700" },
    amber: { ring: "border-amber-200", bg: "bg-amber-50/50", big: "text-amber-700", btn: "bg-amber-600 hover:bg-amber-700", chip: "border-amber-100 bg-amber-50 text-amber-700" },
    sky: { ring: "border-sky-200", bg: "bg-sky-50/50", big: "text-sky-700", btn: "bg-sky-600 hover:bg-sky-700", chip: "border-sky-100 bg-sky-50 text-sky-700" },
  }[accent];

  return (
    <div className={`mx-auto max-w-3xl rounded-2xl border ${tone.ring} ${tone.bg} p-5 shadow-card sm:p-6`}>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-white/70 px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-wide text-ink-500">
          Fast answer
        </span>
        {badges.map((b) => (
          <span key={b} className={`hidden items-center rounded-full border px-2.5 py-1 text-[0.625rem] font-semibold sm:inline-flex ${tone.chip}`}>
            {b}
          </span>
        ))}
      </div>

      <h2 className="mt-3 text-lg font-bold text-ink-900 sm:text-xl">{title}</h2>

      {answer && (
        <p className="mt-3">
          {answerLabel && <span className="block text-xs font-semibold uppercase tracking-wide text-ink-500">{answerLabel}</span>}
          <span className={`text-3xl font-black sm:text-4xl ${tone.big}`}>{answer}</span>
        </p>
      )}

      {rows.length > 0 && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {rows.map((r) => (
            <div
              key={r.label}
              className={`rounded-xl border p-4 ${r.highlight ? `${tone.ring} bg-white shadow-card` : "border-ink-900/10 bg-white/70"}`}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">{r.label}</p>
              <p className={`mt-1 text-2xl font-black ${tone.big}`}>{r.value}</p>
              {r.note && <p className="mt-1 text-xs leading-relaxed text-ink-600">{r.note}</p>}
            </div>
          ))}
        </div>
      )}

      {ctaText && ctaHref && (
        <div className="mt-5">
          <a href={ctaHref} className={`inline-flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-bold text-white transition ${tone.btn}`}>
            {ctaText} →
          </a>
        </div>
      )}

      <OfficialSourceNote
        className="mt-5"
        lastVerified={lastVerified}
        sources={sources ?? (sourceUrl && sourceName ? [{ label: sourceName, href: sourceUrl }] : [])}
        disclaimer={disclaimer}
      />
    </div>
  );
}
