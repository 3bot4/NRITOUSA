import type { SponsorRow, WageLevels } from "@/lib/h1b/sponsors";
import { formatUsd } from "@/lib/format";

/* Pure presentational card — no directive, no hooks — so it renders inside both
   the client finder and the server-rendered SEO route. */

const ROMAN: (keyof WageLevels)[] = ["I", "II", "III", "IV"];

const LEVEL_COLOR: Record<keyof WageLevels, string> = {
  I: "#c7d2fe",
  II: "#818cf8",
  III: "#4f46e5",
  IV: "#3730a3",
};

const LEVEL_HINT: Record<keyof WageLevels, string> = {
  I: "Entry",
  II: "Qualified",
  III: "Experienced",
  IV: "Senior",
};

function TrendBadge({ trend }: { trend: SponsorRow["trend"] }) {
  if (trend === "up")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[0.6875rem] font-bold text-emerald-700">
        <span aria-hidden>↑</span> Rising
      </span>
    );
  if (trend === "down")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[0.6875rem] font-bold text-rose-600">
        <span aria-hidden>↓</span> Cooling
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-ink-900/5 px-2 py-0.5 text-[0.6875rem] font-bold text-ink-500">
      <span aria-hidden>→</span> Flat
    </span>
  );
}

/** Segmented I–IV bar showing the mix of DOL wage levels in the filings. */
function WageLevelBar({ levels }: { levels: WageLevels }) {
  const total = ROMAN.reduce((s, k) => s + (levels[k] ?? 0), 0);
  if (!total)
    return (
      <p className="text-xs text-ink-400">Wage-level mix not disclosed.</p>
    );
  return (
    <div>
      <div
        className="flex h-2.5 w-full overflow-hidden rounded-full bg-ink-900/5"
        role="img"
        aria-label={ROMAN.filter((k) => levels[k])
          .map((k) => `Level ${k}: ${levels[k]}`)
          .join(", ")}
      >
        {ROMAN.map((k) =>
          levels[k] ? (
            <div
              key={k}
              style={{
                width: `${((levels[k] as number) / total) * 100}%`,
                background: LEVEL_COLOR[k],
              }}
            />
          ) : null
        )}
      </div>
      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
        {ROMAN.filter((k) => levels[k]).map((k) => (
          <span key={k} className="inline-flex items-center gap-1 text-[0.6875rem] text-ink-500">
            <span
              aria-hidden
              className="inline-block h-2 w-2 rounded-sm"
              style={{ background: LEVEL_COLOR[k] }}
            />
            <span className="font-semibold text-ink-700">{k}</span>
            <span className="text-ink-400">{LEVEL_HINT[k]}</span>
            <span className="tabular-nums">· {levels[k]}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function formatLastFiled(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function SponsorCard({
  sponsor,
  rank,
}: {
  sponsor: SponsorRow;
  rank?: number;
}) {
  const lastFiled = formatLastFiled(sponsor.last_filed);
  return (
    <article className="rounded-2xl border border-ink-900/5 bg-white p-4 shadow-card sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          {rank != null && (
            <span
              aria-hidden
              className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-lg bg-brand-50 text-xs font-bold text-brand-700"
            >
              {rank}
            </span>
          )}
          <h3 className="min-w-0 break-words text-base font-bold leading-snug text-ink-900">
            {sponsor.employer}
          </h3>
        </div>
        {/* Only show a trend once there's a prior-year window to compare against.
            With a single disclosure file prev_year_count is 0 for every row, so
            the "trend" would be a meaningless all-"up" — hide it until a prior
            fiscal-year file is loaded. */}
        {sponsor.prev_year_count > 0 && <TrendBadge trend={sponsor.trend} />}
      </div>

      <p className="mt-1.5 text-sm text-ink-600">
        <strong className="font-semibold text-ink-900 tabular-nums">
          {sponsor.lca_count.toLocaleString()}
        </strong>{" "}
        certified H-1B LCA{sponsor.lca_count === 1 ? "" : "s"} · last 12 mo
        {sponsor.worker_positions > sponsor.lca_count && (
          <span className="text-ink-400">
            {" "}
            · {sponsor.worker_positions.toLocaleString()} worker positions
          </span>
        )}
      </p>

      <div className="mt-3 grid gap-3 sm:grid-cols-[auto,1fr] sm:items-center">
        <div className="rounded-xl bg-slate-50 px-3 py-2">
          <p className="text-[0.625rem] font-semibold uppercase tracking-wider text-ink-400">
            Median annual wage
          </p>
          <p className="text-lg font-extrabold tracking-tight text-ink-900 tabular-nums">
            {sponsor.median_wage != null ? formatUsd(sponsor.median_wage) : "—"}
          </p>
        </div>
        <div>
          <p className="mb-1 text-[0.625rem] font-semibold uppercase tracking-wider text-ink-400">
            Wage levels (I–IV)
          </p>
          <WageLevelBar levels={sponsor.wage_levels} />
        </div>
      </div>

      {lastFiled && (
        <p className="mt-3 text-xs text-ink-400">
          Most recent certified filing: {lastFiled}
        </p>
      )}
    </article>
  );
}
