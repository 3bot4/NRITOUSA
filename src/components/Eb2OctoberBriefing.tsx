import {
  getCutoffs,
  formatCutoff,
  formatBulletinMonth,
  bulletin,
} from "@/lib/visa-bulletin";

/**
 * The visual briefing that opens /visa-bulletin/october-2026-predictions:
 * headline stat tiles, the per-category prediction cards, and the
 * employment-based supply history.
 *
 * These replace what were four cramped markdown tables. A 4-column table
 * squeezed into the 720px article column wrapped "Confidence" to "Confi/denc/e";
 * cards and bars carry the same data and stay readable at any width.
 *
 * Live values (the current EB-2 India cutoff, the bulletin month) resolve from
 * data/visa-bulletin so they refresh with the monthly data drop. The
 * forward-looking values are the constants below — each is rendered with an
 * explicit "predicted" affordance, never as a published figure.
 */

const PREDICTED_FAD = "2014-07-15";
const LAST_OCTOBER_FAD = "2013-04-01"; // Oct 2025 bulletin (FY2026 start)
const MOVEMENT_MONTHS = "+15.5";

type Confidence = "High" | "Medium-high" | "Medium";

const CONF_STYLE: Record<Confidence, string> = {
  High: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "Medium-high": "bg-blue-50 text-blue-700 ring-blue-600/20",
  Medium: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

const PREDICTIONS: {
  category: string;
  outlook: string;
  confidence: Confidence;
  basis: string;
}[] = [
  {
    category: "EB-2",
    outlook: "Returns to at least July 15, 2014",
    confidence: "High",
    basis:
      "The only row with an on-the-record DOS statement — it named a specific prior bulletin, while conditioning the outcome on India EB-2 demand and the FY2027 limit.",
  },
  {
    category: "EB-1",
    outlook: "Recovers toward April 1, 2023",
    confidence: "Medium",
    basis:
      "EB-1 India lost about 5.5 months across June–July 2026 to the same cap exhaustion. October resets have historically restored pre-summer dates — but that is a pattern, not guidance.",
  },
  {
    category: "EB-3",
    outlook: "Modest advancement from its current cutoff",
    confidence: "Medium",
    basis:
      "Fresh-year numbers historically buy weeks to months. EB-3 India demand is inflated by downgrades from EB-2, which caps how far it can run.",
  },
  {
    category: "Dates for Filing",
    outlook: "Little to no movement",
    confidence: "Medium-high",
    basis:
      "The filing chart barely moved after April 2026. DOS uses it to manage demand, not to reflect supply, so a supply reset need not move it at all.",
  },
];

/** Total employment-based limit by fiscal year (DOS annual numerical limits). */
const SUPPLY: { fy: string; total: number; note?: string; highlight?: boolean }[] =
  [
    { fy: "FY2021", total: 262288 },
    { fy: "FY2022", total: 281507, note: "all-time high" },
    { fy: "FY2023", total: 197091 },
    { fy: "FY2024", total: 160791 },
    { fy: "FY2025", total: 150000 },
    { fy: "FY2026", total: 186000, note: "+24% — 140k floor + ~46k spillover", highlight: true },
  ];

const SUPPLY_MAX = Math.max(...SUPPLY.map((s) => s.total));

function Tile({
  value,
  label,
  tone = "ink",
  foot,
}: {
  value: string;
  label: string;
  tone?: "ink" | "brand" | "amber";
  foot?: string;
}) {
  const valueTone =
    tone === "brand"
      ? "text-brand-600"
      : tone === "amber"
        ? "text-amber-600"
        : "text-ink-900";
  return (
    <div className="rounded-xl border border-ink-900/10 bg-white p-4 shadow-sm">
      <div className={`text-[1.6rem] font-extrabold leading-none tracking-tight ${valueTone}`}>
        {value}
      </div>
      <div className="mt-2 text-[0.8rem] font-medium leading-snug text-ink-600">
        {label}
      </div>
      {foot && (
        <div className="mt-1.5 text-[0.6875rem] leading-snug text-ink-400">{foot}</div>
      )}
    </div>
  );
}

export default function Eb2OctoberBriefing({
  className = "",
}: {
  className?: string;
}) {
  const now = getCutoffs("eb2", "india");
  const currentFad = now ? formatCutoff(now.fad) : "—";

  return (
    <section className={`mx-auto max-w-[860px] ${className}`}>
      {/* ── headline numbers ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tile
          value={currentFad}
          label="EB-2 India Final Action Date today"
          tone="amber"
          foot={`${formatBulletinMonth(bulletin.month)} bulletin`}
        />
        <Tile
          value={formatCutoff(PREDICTED_FAD)}
          label="Where October should land"
          tone="brand"
          foot="Predicted — not published"
        />
        <Tile
          value={`${MOVEMENT_MONTHS} mo`}
          label={`Jump vs. last October (${formatCutoff(LAST_OCTOBER_FAD)})`}
          tone="brand"
          foot="Largest October move in four years"
        />
        <Tile
          value="~9,300"
          label="EB-2 numbers India actually received in FY2026"
          foot="~3× its 7% statutory floor — and still ran out"
        />
      </div>

      {/* ── per-category predictions ─────────────────────────────────────── */}
      <div className="mt-8">
        <h3 className="text-sm font-bold uppercase tracking-wide text-ink-500">
          Our October 2026 outlook, by category
        </h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {PREDICTIONS.map((p) => (
            <div
              key={p.category}
              className="flex flex-col rounded-xl border border-ink-900/10 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-sm font-extrabold text-ink-900">
                  {p.category} <span className="font-medium text-ink-400">India</span>
                </span>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[0.6875rem] font-bold ring-1 ring-inset ${CONF_STYLE[p.confidence]}`}
                >
                  {p.confidence} confidence
                </span>
              </div>
              <p className="mt-2 text-[0.95rem] font-semibold leading-snug text-brand-700">
                {p.outlook}
              </p>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-500">
                {p.basis}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-ink-400">
          Confidence reflects the strength of the evidence, not our enthusiasm.
          Only the EB-2 row rests on a Department of State statement; the rest is
          inference from how past October resets behaved.
        </p>
      </div>

      {/* ── supply history ───────────────────────────────────────────────── */}
      <div className="mt-8 rounded-2xl border border-ink-900/10 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold text-ink-900">
          Total employment-based green cards, by fiscal year
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-ink-400">
          The 140,000 floor plus the prior year&rsquo;s unused family numbers.
          Supply swings hard — it has not simply shrunk every year.
        </p>
        <div className="mt-4 space-y-2.5">
          {SUPPLY.map((s) => (
            <div key={s.fy} className="flex items-center gap-3">
              <span className="w-[3.75rem] shrink-0 text-xs font-semibold tabular-nums text-ink-600">
                {s.fy}
              </span>
              <div className="relative h-6 min-w-0 flex-1 overflow-hidden rounded-md bg-ink-900/[0.04]">
                <div
                  className={`h-full rounded-md ${s.highlight ? "bg-brand-600" : "bg-brand-600/35"}`}
                  style={{ width: `${(s.total / SUPPLY_MAX) * 100}%` }}
                />
              </div>
              <span className="w-[4.25rem] shrink-0 text-right text-xs font-bold tabular-nums text-ink-900">
                {s.total.toLocaleString("en-US")}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[0.6875rem] text-ink-400">
          {SUPPLY.filter((s) => s.note).map((s) => (
            <span key={s.fy}>
              <strong className="font-semibold text-ink-600">{s.fy}</strong> — {s.note}
            </span>
          ))}
        </div>
        <p className="mt-3 border-t border-ink-900/5 pt-3 text-xs leading-relaxed text-ink-500">
          <strong className="font-semibold text-ink-700">FY2027 is the open question.</strong>{" "}
          Its total is announced with the October bulletin. If spillover comes in
          well below FY2026&rsquo;s ~46,000, India&rsquo;s share shrinks with it —
          which is precisely the condition DOS attached to its guidance.
        </p>
      </div>
    </section>
  );
}
