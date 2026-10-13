/**
 * Visuals for /uscis/i-94. Inline SVG, no library.
 *
 * The sample travel history used by the day-count chart is INVENTED and is
 * labelled as such in the caption. Its shape is chosen to make the two things
 * the page is about visible at once: a weighted substantial-presence total that
 * straddles the 183 line, and a single absence that crosses the six-month
 * continuous-residence threshold. Do not replace it with anyone's real history.
 */

import {
  countI94Days,
  SPT_THRESHOLD,
  type TripSegment,
} from "@/lib/calc/i94DayCount";
import { DS_NOTATION, HISTORY_LIMITS, I94_VERIFIED } from "@/data/i94Data";

const num = (n: number) => n.toLocaleString("en-US");

/**
 * An invented travel history. 2024 is a near-full year, 2025 has a long trip
 * to India in the middle of it, and 2026 is partial — which puts the weighted
 * total close to the line and gives the absence chart something real to show.
 */
export const SAMPLE_TRIPS: TripSegment[] = [
  { arrival: "2024-01-08", departure: "2024-06-20" },
  { arrival: "2024-07-15", departure: "2024-12-18" },
  { arrival: "2025-01-06", departure: "2025-03-28" },
  // A seven-month absence: parents' care in India. Crosses the 180-day line.
  { arrival: "2025-11-02", departure: "2025-12-20" },
  { arrival: "2026-01-12", departure: "2026-08-14" },
  { arrival: "2026-09-02" },
];

export const SAMPLE_AS_OF = "2026-10-13";

/* ═══════════════ 1. Days present per calendar year ════════════════════ */

export function DaysByYearChart() {
  const result = countI94Days(SAMPLE_TRIPS, { asOf: SAMPLE_AS_OF, taxYear: 2026 });
  const data = result.byYear;

  const W = 700;
  const H = 290;
  const m = { top: 24, right: 20, bottom: 58, left: 50 };
  const plotW = W - m.left - m.right;
  const plotH = H - m.top - m.bottom;
  const top = 366;
  const barW = plotW / Math.max(1, data.length);

  const y = (v: number) => m.top + plotH - (v / top) * plotH;
  const x = (i: number) => m.left + i * barW;

  const weights: Record<number, string> = { 2026: "× 1", 2025: "× 1/3", 2024: "× 1/6" };

  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Bar chart of days physically present in the United States per calendar year, from a sample travel history. ${data
          .map((d) => `${d.year}: ${d.days} days`)
          .join("; ")}. A dashed line marks 183 days, the substantial presence test threshold.`}
        className="h-auto w-full"
      >
        {[0, 91, 183, 274, 366].map((v) => (
          <g key={v}>
            <line
              x1={m.left}
              y1={y(v)}
              x2={W - m.right}
              y2={y(v)}
              stroke={v === SPT_THRESHOLD ? "#b45309" : "#e2e8f0"}
              strokeWidth={v === SPT_THRESHOLD ? 1.6 : 1}
              strokeDasharray={v === SPT_THRESHOLD ? "6 4" : undefined}
            />
            <text x={m.left - 8} y={y(v) + 4} textAnchor="end" fontSize="11.5" fill={v === SPT_THRESHOLD ? "#b45309" : "#64748b"}>
              {v}
            </text>
          </g>
        ))}
        <text x={W - m.right} y={y(SPT_THRESHOLD) - 7} textAnchor="end" fontSize="11" fontWeight="700" fill="#b45309">
          183 days
        </text>
        {data.map((d, i) => (
          <g key={d.year}>
            <rect
              x={x(i) + barW * 0.22}
              y={y(d.days)}
              width={barW * 0.56}
              height={Math.max(2, m.top + plotH - y(d.days))}
              rx="4"
              fill={d.year === 2026 ? "#4338ca" : "#94a3b8"}
            />
            <text x={x(i) + barW / 2} y={y(d.days) - 7} textAnchor="middle" fontSize="12" fontWeight="700" fill="#0f172a">
              {d.days}
            </text>
            <text x={x(i) + barW / 2} y={H - m.bottom + 19} textAnchor="middle" fontSize="12" fontWeight="600" fill="#334155">
              {d.year}
            </text>
            {weights[d.year] && (
              <text x={x(i) + barW / 2} y={H - m.bottom + 35} textAnchor="middle" fontSize="10.5" fill="#64748b">
                weight {weights[d.year]}
              </text>
            )}
          </g>
        ))}
      </svg>
      <figcaption className="mt-2 text-xs leading-relaxed text-ink-400">
        An <strong>invented</strong> travel history, not anyone&rsquo;s real one.
        Weighted total for a 2026 tax year:{" "}
        <strong>{Math.floor(result.spt?.weightedDays ?? 0)} days</strong> against
        the 183 needed — {result.spt?.meetsOnDaysAlone ? "over" : "under"} the
        line on these days alone. Both the arrival day and the departure day
        count as days of presence, which is the IRS convention. A day count is
        not a residency determination.
      </figcaption>
    </figure>
  );
}

/* ═══════════════ 2. The absence timeline ══════════════════════════════ */

/**
 * The same sample history drawn as time abroad rather than time present,
 * because that is the measurement the 8 CFR 316.5 thresholds use — and
 * conflating the two is the commonest error in this topic.
 */
export function AbsenceTimelineChart() {
  const result = countI94Days(SAMPLE_TRIPS, { asOf: SAMPLE_AS_OF });

  const W = 740;
  const H = 210;
  const m = { top: 56, right: 24, bottom: 54, left: 24 };
  const plotW = W - m.left - m.right;

  const start = Date.UTC(2024, 0, 1);
  const end = Date.UTC(2026, 9, 13);
  const span = end - start;
  const px = (iso: string) => {
    const [y, mo, d] = iso.split("-").map(Number);
    return m.left + ((Date.UTC(y, mo - 1, d) - start) / span) * plotW;
  };

  const present = SAMPLE_TRIPS.filter((t) => t.arrival).map((t) => ({
    from: t.arrival!,
    to: t.departure ?? SAMPLE_AS_OF,
  }));

  const yearTicks = ["2024-01-01", "2025-01-01", "2026-01-01"];

  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Timeline of presence in and absence from the United States across a sample travel history. Blocks show time present. One gap is flagged: ${result.absenceFlags
          .map((f) => `${f.days} days abroad from ${f.from} to ${f.to}`)
          .join("; ") || "no absence reaches six months"}.`}
        className="h-auto w-full"
      >
        <rect x={m.left} y={m.top} width={plotW} height={34} rx="6" fill="#fef2f2" />
        {present.map((p) => (
          <rect
            key={p.from}
            x={px(p.from)}
            y={m.top}
            width={Math.max(2, px(p.to) - px(p.from))}
            height={34}
            rx="4"
            fill="#4338ca"
          />
        ))}

        {result.absenceFlags.map((f) => {
          const x1 = px(f.from);
          const x2 = px(f.to);
          const mid = (x1 + x2) / 2;
          const warn = f.level === "breaks";
          return (
            <g key={f.from}>
              <line x1={x1} y1={m.top - 10} x2={x2} y2={m.top - 10} stroke={warn ? "#e11d48" : "#b45309"} strokeWidth="2.5" />
              <line x1={x1} y1={m.top - 16} x2={x1} y2={m.top - 4} stroke={warn ? "#e11d48" : "#b45309"} strokeWidth="2.5" />
              <line x1={x2} y1={m.top - 16} x2={x2} y2={m.top - 4} stroke={warn ? "#e11d48" : "#b45309"} strokeWidth="2.5" />
              <text x={mid} y={m.top - 24} textAnchor="middle" fontSize="12" fontWeight="800" fill={warn ? "#e11d48" : "#b45309"}>
                {f.days} days abroad
              </text>
              <text x={mid} y={m.top - 38} textAnchor="middle" fontSize="10.5" fill={warn ? "#e11d48" : "#b45309"}>
                {warn ? "breaks continuous residence" : "over six months — rebuttable"}
              </text>
            </g>
          );
        })}

        {yearTicks.map((t) => (
          <g key={t}>
            <line x1={px(t)} y1={m.top + 34} x2={px(t)} y2={m.top + 44} stroke="#94a3b8" />
            <text x={px(t)} y={m.top + 60} textAnchor="middle" fontSize="12" fill="#475569">
              {t.slice(0, 4)}
            </text>
          </g>
        ))}

        <rect x={m.left} y={H - 24} width={11} height={11} rx="2" fill="#4338ca" />
        <text x={m.left + 17} y={H - 15} fontSize="11" fill="#475569">
          Present in the United States
        </text>
        <rect x={m.left + 200} y={H - 24} width={11} height={11} rx="2" fill="#fef2f2" stroke="#fca5a5" />
        <text x={m.left + 217} y={H - 15} fontSize="11" fill="#475569">
          Abroad
        </text>
      </svg>
      <figcaption className="mt-2 text-xs leading-relaxed text-ink-400">
        The same <strong>invented</strong> history, measured the other way round.
        Presence is what the substantial presence test counts; a continuous
        ABSENCE is what the 8 CFR 316.5(c)(1) thresholds measure, and the two
        answers come from the same dates read in opposite directions. Most
        land-border crossings are missing from a real CBP history, so an
        unrecorded departure can invent an absence like this one — or hide it.
      </figcaption>
    </figure>
  );
}

/* ═══════════════ 3. Three documents, three jobs ═══════════════════════ */

export function ThreeDocumentsDiagram() {
  const W = 760;
  const H = 300;

  const cols = [
    {
      x: 16,
      t: "Visa foil",
      who: "Department of State",
      job: "Lets you travel to a port of entry and ASK to be admitted",
      expiry: "Expires while you are in the US → you may stay, you cannot re-enter",
      fill: "#fefce8",
      stroke: "#fde047",
    },
    {
      x: 262,
      t: "Form I-94",
      who: "CBP, at the border",
      job: "Records the admission you were actually GIVEN. This is the document that governs your stay",
      expiry: "Expires while you are in the US → your authorised stay has ended",
      fill: "#eef2ff",
      stroke: "#a5b4fc",
      lead: true,
    },
    {
      x: 508,
      t: "Form I-797",
      who: "USCIS",
      job: "Says a petition was APPROVED and for what period. Caps the I-94; is not the I-94",
      expiry: "Expires → your employer's authority under that petition ends",
      fill: "#f0fdf4",
      stroke: "#86efac",
    },
  ];

  const colW = 236;

  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Diagram of three documents and what each one does. The visa lets you travel to a port of entry and ask to be admitted. The Form I-94 records the admission you were given and governs how long you may stay. The Form I-797 records that a petition was approved and for what period, which caps the I-94 but is not the same document."
        className="h-auto w-full"
      >
        {cols.map((c) => (
          <g key={c.t}>
            <rect
              x={c.x}
              y={c.lead ? 10 : 22}
              width={colW}
              height={c.lead ? 236 : 212}
              rx="12"
              fill={c.fill}
              stroke={c.stroke}
              strokeWidth={c.lead ? 2.5 : 1.5}
            />
            {c.lead && (
              <text x={c.x + colW / 2} y={-2} textAnchor="middle" fontSize="0" fill="none">
                lead
              </text>
            )}
            <text x={c.x + 16} y={c.lead ? 38 : 48} fontSize="15" fontWeight="800" fill="#0f172a">
              {c.t}
            </text>
            <text x={c.x + 16} y={c.lead ? 55 : 65} fontSize="10.5" fill="#64748b">
              Issued by {c.who}
            </text>
            <foreignObject x={c.x + 14} y={c.lead ? 68 : 78} width={colW - 28} height={80}>
              <div
                // @ts-expect-error — xmlns is valid inside foreignObject
                xmlns="http://www.w3.org/1999/xhtml"
                style={{ fontSize: "11.5px", lineHeight: 1.4, color: "#334155", fontFamily: "inherit" }}
              >
                {c.job}
              </div>
            </foreignObject>
            <line x1={c.x + 14} y1={c.lead ? 156 : 164} x2={c.x + colW - 14} y2={c.lead ? 156 : 164} stroke={c.stroke} />
            <text x={c.x + 16} y={c.lead ? 174 : 182} fontSize="10" fontWeight="800" fill="#64748b">
              WHEN IT EXPIRES
            </text>
            <foreignObject x={c.x + 14} y={c.lead ? 180 : 188} width={colW - 28} height={60}>
              <div
                // @ts-expect-error — xmlns is valid inside foreignObject
                xmlns="http://www.w3.org/1999/xhtml"
                style={{ fontSize: "10.5px", lineHeight: 1.35, color: "#64748b", fontFamily: "inherit" }}
              >
                {c.expiry}
              </div>
            </foreignObject>
          </g>
        ))}
        <text x={16} y={H - 8} fontSize="11" fill="#94a3b8">
          Only the middle one controls how long you may stay. It is also the one most people never look at.
        </text>
      </svg>
      <figcaption className="mt-2 text-xs leading-relaxed text-ink-400">
        The combination NRI travellers hit most often is a valid I-94 with an
        expired visa: you may stay for the whole I-94 period, and you cannot
        leave and return without a new visa and a consular appointment in India.
        As of {I94_VERIFIED}.
      </figcaption>
    </figure>
  );
}

/* ═══════════════ 4. D/S versus a date ════════════════════════════════ */

export function DsVsDateDiagram() {
  const W = 740;
  const H = 240;

  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Diagram contrasting an I-94 admitted until a fixed date with one admitted D/S, duration of status. A dated admission gives a deadline and unlawful presence generally starts the day after it. A D/S admission has no date, so nothing warns you when the underlying condition stops being met, and unlawful presence generally starts only on a formal finding. Classes admitted D/S include ${DS_NOTATION.whoGets
          .map((g) => g.cls)
          .join(", ")}. Classes given a date include ${DS_NOTATION.whoDoesNot.join(", ")}.`}
        className="h-auto w-full"
      >
        {/* Dated */}
        <rect x={16} y={16} width={344} height={196} rx="12" fill="#eef2ff" stroke="#a5b4fc" strokeWidth="1.5" />
        <text x={34} y={42} fontSize="14" fontWeight="800" fill="#312e81">
          Admit Until: a date
        </text>
        <text x={34} y={60} fontSize="10.5" fill="#64748b">
          {DS_NOTATION.whoDoesNot.join(" · ")}
        </text>
        <line x1={34} y1={92} x2={326} y2={92} stroke="#4338ca" strokeWidth="3" />
        <circle cx={326} cy={92} r="6" fill="#e11d48" />
        <text x={326} y={80} textAnchor="end" fontSize="11" fontWeight="700" fill="#e11d48">
          the date
        </text>
        <text x={34} y={118} fontSize="11" fill="#334155">
          You have a deadline you can diary.
        </text>
        <text x={34} y={138} fontSize="11" fill="#334155">
          Unlawful presence generally starts the
        </text>
        <text x={34} y={154} fontSize="11" fill="#334155">
          day after it.
        </text>
        <text x={34} y={184} fontSize="10.5" fontWeight="700" fill="#4338ca">
          Capped by your passport&rsquo;s expiry, which is
        </text>
        <text x={34} y={198} fontSize="10.5" fontWeight="700" fill="#4338ca">
          why the date may be earlier than the petition.
        </text>

        {/* D/S */}
        <rect x={380} y={16} width={344} height={196} rx="12" fill="#fffbeb" stroke="#fcd34d" strokeWidth="1.5" />
        <text x={398} y={42} fontSize="14" fontWeight="800" fill="#92400e">
          Admit Until: D/S
        </text>
        <text x={398} y={60} fontSize="10.5" fill="#64748b">
          {DS_NOTATION.whoGets.map((g) => g.cls).join(" · ")}
        </text>
        <line x1={398} y1={92} x2={690} y2={92} stroke="#b45309" strokeWidth="3" strokeDasharray="8 5" />
        <text x={690} y={80} textAnchor="end" fontSize="11" fontWeight="700" fill="#b45309">
          no date at all
        </text>
        <text x={398} y={118} fontSize="11" fill="#334155">
          Nothing warns you when the underlying
        </text>
        <text x={398} y={134} fontSize="11" fill="#334155">
          condition stops being met. You can be out
        </text>
        <text x={398} y={150} fontSize="11" fill="#334155">
          of status with no document expired.
        </text>
        <text x={398} y={184} fontSize="10.5" fontWeight="700" fill="#b45309">
          Unlawful presence generally starts only on a
        </text>
        <text x={398} y={198} fontSize="10.5" fontWeight="700" fill="#b45309">
          formal finding — which cuts both ways.
        </text>
      </svg>
      <figcaption className="mt-2 text-xs leading-relaxed text-ink-400">
        D/S is not a longer permission. It is a different kind of permission, and
        in one respect a riskier one. As of {I94_VERIFIED}.
      </figcaption>
    </figure>
  );
}

/* ═══════════════ 5. What the travel history leaves out ═══════════════ */

export function HistoryLimitsChart() {
  const W = 740;
  const rowH = 74;
  const H = 44 + HISTORY_LIMITS.length * rowH;

  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Four limits on a CBP travel history. ${HISTORY_LIMITS.map(
          (l) => `${l.limit}: ${l.consequence}`,
        ).join(" ")}`}
        className="h-auto w-full"
      >
        {HISTORY_LIMITS.map((l, i) => {
          const yTop = 16 + i * rowH;
          const severe = i === 3;
          return (
            <g key={l.limit}>
              <rect
                x={16}
                y={yTop}
                width={W - 32}
                height={rowH - 12}
                rx="10"
                fill={severe ? "#fff1f2" : "#f8fafc"}
                stroke={severe ? "#fda4af" : "#e2e8f0"}
                strokeWidth="1.5"
              />
              <circle cx={44} cy={yTop + 31} r="15" fill={severe ? "#e11d48" : "#64748b"} />
              <text x={44} y={yTop + 36} textAnchor="middle" fontSize="14" fontWeight="800" fill="#ffffff">
                {i + 1}
              </text>
              <text x={72} y={yTop + 24} fontSize="12.5" fontWeight="800" fill="#0f172a">
                {l.limit}
              </text>
              <foreignObject x={70} y={yTop + 30} width={W - 110} height={rowH - 40}>
                <div
                  // @ts-expect-error — xmlns is valid inside foreignObject
                  xmlns="http://www.w3.org/1999/xhtml"
                  style={{ fontSize: "10.5px", lineHeight: 1.35, color: "#475569", fontFamily: "inherit" }}
                >
                  {l.consequence}
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-2 text-xs leading-relaxed text-ink-400">
        Source: CBP, i94.cbp.dhs.gov FAQ and cbp.gov&rsquo;s Arrival/Departure
        Forms: I-94 page; DHS/CBP/PIA-016(a) for the change from five years of
        history to ten. As of {I94_VERIFIED}. The fourth limit is highlighted
        because the reader with the strongest need for a long trip log — a
        permanent resident preparing an N-400 — is the one reader the tool will
        not serve, and FOIA takes months.
      </figcaption>
    </figure>
  );
}

export const SAMPLE_SUMMARY = (() => {
  const r = countI94Days(SAMPLE_TRIPS, { asOf: SAMPLE_AS_OF, taxYear: 2026 });
  return {
    totalDays: num(r.totalDays),
    weighted: Math.floor(r.spt?.weightedDays ?? 0),
    meets: r.spt?.meetsOnDaysAlone ?? false,
    longestAbsence: r.longestAbsenceDays,
  };
})();
