"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import DataStamp from "@/components/tools/DataStamp";
import ResultActions from "@/components/ResultActions";

/* ------------------------------ data shapes ----------------------------- */

interface Stat {
  n: number;
  min: number;
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  max: number;
  medPW?: number;
  hist?: { b: number; c: number }[];
}

interface RoleData {
  count: number;
  medAll: number;
  byMetro: Record<string, Stat>;
  byMetroLevel: Record<string, Stat>;
  byState: Record<string, Stat>;
  byLevel: Record<string, Stat>;
  employers: { name: string; n: number; p50: number }[];
}

interface Explorer {
  lastUpdated: string;
  source: string;
  sourceUrl: string;
  period: string;
  visaClass: string;
  recordsProcessed: number;
  recordsKept: number;
  withdrawnCount: number;
  filters: {
    roles: { key: string; count: number }[];
    metros: { key: string; count: number }[];
    states: { key: string; count: number }[];
    levels: { level: number; count: number }[];
  };
  roles: Record<string, RoleData>;
}

/* -------------------------------- helpers ------------------------------- */

const LEVEL_LABELS: Record<number, string> = {
  1: "I · Entry",
  2: "II · Junior/Mid",
  3: "III · Senior",
  4: "IV · Expert/Lead",
};
const ROMAN: Record<number, string> = { 1: "I", 2: "II", 3: "III", 4: "IV" };

const usd = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
const usdK = (n: number) => `$${Math.round(n / 1000)}k`;

const stateOf = (metro: string) => metro.split(",").pop()!.trim();

/** Piecewise-linear percentile of a salary against a stat's anchor points. */
function percentileOf(salary: number, s: Stat): number {
  const anchors: [number, number][] = [
    [s.min, 1],
    [s.p10, 10],
    [s.p25, 25],
    [s.p50, 50],
    [s.p75, 75],
    [s.p90, 90],
    [s.max, 99],
  ];
  if (salary <= anchors[0][0]) return 1;
  if (salary >= anchors[anchors.length - 1][0]) return 99;
  for (let i = 1; i < anchors.length; i++) {
    const [x0, y0] = anchors[i - 1];
    const [x1, y1] = anchors[i];
    if (salary <= x1) {
      if (x1 === x0) return y1;
      return Math.round(y0 + ((y1 - y0) * (salary - x0)) / (x1 - x0));
    }
  }
  return 50;
}

const ordinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const MIN_SAMPLE = 10;

/* ------------------------------- charts --------------------------------- */

/** Salary distribution histogram with p25/median/p75 + optional markers. */
function Distribution({
  hist,
  median,
  p25,
  p75,
  userSalary,
  compareMedian,
  accent = "#1e40f5",
}: {
  hist: { b: number; c: number }[];
  median: number;
  p25: number;
  p75: number;
  userSalary?: number | null;
  compareMedian?: number | null;
  accent?: string;
}) {
  if (!hist.length)
    return (
      <p className="py-8 text-center text-sm text-ink-400">
        No distribution available for this selection.
      </p>
    );
  const W = 720;
  const H = 240;
  const padB = 34;
  const padT = 14;
  const maxC = Math.max(...hist.map((h) => h.c));
  const minB = hist[0].b;
  const bucket = hist.length > 1 ? hist[1].b - hist[0].b : 20000;
  const maxB = hist[hist.length - 1].b + bucket;
  const span = maxB - minB || bucket;
  const x = (v: number) => ((v - minB) / span) * W;
  const barW = (W / hist.length) * 0.84;

  const marker = (v: number, color: string, label: string, dashed = false) => {
    const px = Math.max(0, Math.min(W, x(v)));
    return (
      <g>
        <line
          x1={px}
          x2={px}
          y1={padT}
          y2={H - padB}
          stroke={color}
          strokeWidth={2}
          strokeDasharray={dashed ? "5 4" : undefined}
        />
        <text
          x={px}
          y={padT + 2}
          fontSize="11"
          fontWeight="700"
          fill={color}
          textAnchor={px > W - 70 ? "end" : "start"}
          dx={px > W - 70 ? -4 : 4}
        >
          {label}
        </text>
      </g>
    );
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Salary distribution"
    >
      {hist.map((h, i) => {
        const bh = ((H - padB - padT) * h.c) / maxC;
        const inIqr = h.b + bucket / 2 >= p25 && h.b + bucket / 2 <= p75;
        return (
          <rect
            key={i}
            x={x(h.b) + (W / hist.length - barW) / 2}
            y={H - padB - bh}
            width={barW}
            height={bh}
            rx={2}
            fill={inIqr ? accent : "#c7d2fe"}
            opacity={inIqr ? 0.9 : 0.7}
          />
        );
      })}
      {/* axis baseline */}
      <line x1={0} x2={W} y1={H - padB} y2={H - padB} stroke="#e5e7eb" />
      {/* x labels: a few buckets */}
      {hist
        .filter((_, i) => i % Math.ceil(hist.length / 6) === 0)
        .map((h) => (
          <text
            key={`l${h.b}`}
            x={x(h.b) + W / hist.length / 2}
            y={H - padB + 16}
            fontSize="10"
            fill="#6b7280"
            textAnchor="middle"
          >
            {usdK(h.b)}
          </text>
        ))}
      {marker(median, accent, `Median ${usdK(median)}`)}
      {compareMedian != null && marker(compareMedian, "#6d28d9", `B ${usdK(compareMedian)}`, true)}
      {userSalary != null &&
        userSalary > 0 &&
        marker(userSalary, "#047857", `You ${usdK(userSalary)}`)}
    </svg>
  );
}

/** Generic horizontal bar chart (city compare / employers). */
function HBars({
  rows,
  highlight,
  accent = "#1e40f5",
}: {
  rows: { label: string; value: number; sub?: string }[];
  highlight?: string;
  accent?: string;
}) {
  if (!rows.length)
    return <p className="py-6 text-center text-sm text-ink-400">No data.</p>;
  const max = Math.max(...rows.map((r) => r.value));
  return (
    <div className="space-y-2">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-3">
          <div className="w-28 flex-none truncate text-right text-xs text-ink-600 sm:w-40">
            {r.label}
          </div>
          <div className="relative h-7 flex-1 rounded-md bg-ink-900/5">
            <div
              className="absolute inset-y-0 left-0 rounded-md"
              style={{
                width: `${(r.value / max) * 100}%`,
                background: r.label === highlight ? "#047857" : accent,
                opacity: r.label === highlight ? 1 : 0.85,
              }}
            />
            <span className="absolute inset-y-0 right-2 flex items-center text-xs font-bold text-ink-900">
              {usdK(r.value)}
            </span>
          </div>
          {r.sub && (
            <span className="w-12 flex-none text-[10px] text-ink-400">
              {r.sub}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/** Vertical bar chart for the level/experience curve. */
function LevelCurve({
  data,
  accent = "#1e40f5",
}: {
  data: { level: number; value: number; n: number }[];
  accent?: string;
}) {
  if (!data.length)
    return (
      <p className="py-6 text-center text-sm text-ink-400">
        Not enough level data for this selection.
      </p>
    );
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="flex items-end justify-around gap-3 pt-4" style={{ height: 200 }}>
      {data.map((d) => (
        <div key={d.level} className="flex flex-1 flex-col items-center justify-end">
          <span className="mb-1 text-xs font-bold text-ink-900">
            {usdK(d.value)}
          </span>
          <div
            className="w-full max-w-[64px] rounded-t-md"
            style={{ height: `${(d.value / max) * 140}px`, background: accent, opacity: 0.85 }}
          />
          <span className="mt-1.5 text-xs font-semibold text-ink-700">
            {ROMAN[d.level]}
          </span>
          <span className="text-[10px] text-ink-400">n={d.n.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

/* --------------------------- searchable select -------------------------- */

function RoleSelect({
  roles,
  value,
  onChange,
}: {
  roles: { key: string; count: number }[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const matches = useMemo(() => {
    const s = q.trim().toLowerCase();
    return roles
      .filter((r) => !s || r.key.toLowerCase().includes(s))
      .slice(0, 40);
  }, [roles, q]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-left text-sm text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
      >
        <span className="truncate font-semibold">{value}</span>
        <span aria-hidden className="ml-2 flex-none text-ink-400">
          ▾
        </span>
      </button>
      {open && (
        <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-xl border border-ink-900/10 bg-white shadow-card-hover">
          <input
            autoFocus
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search positions…"
            className="w-full border-b border-ink-900/5 px-3 py-2.5 text-sm outline-none"
          />
          <ul className="max-h-64 overflow-y-auto">
            {matches.map((r) => (
              <li key={r.key}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(r.key);
                    setOpen(false);
                    setQ("");
                  }}
                  className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-brand-50 ${
                    r.key === value ? "bg-brand-50 font-semibold text-brand-700" : "text-ink-700"
                  }`}
                >
                  <span className="truncate">{r.key}</span>
                  <span className="flex-none text-[10px] text-ink-400">
                    {r.count.toLocaleString()}
                  </span>
                </button>
              </li>
            ))}
            {!matches.length && (
              <li className="px-3 py-3 text-sm text-ink-400">No matches.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

const fieldClass =
  "w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";
const labelClass = "text-xs font-semibold text-ink-800";

/* ------------------------------- main ----------------------------------- */

export default function H1bSalaryExplorer() {
  const [data, setData] = useState<Explorer | null>(null);
  const [error, setError] = useState(false);

  // primary controls
  const [role, setRole] = useState("Software Developers");
  const [metro, setMetro] = useState("");
  const [level, setLevel] = useState<number | "all">("all");
  const [employer, setEmployer] = useState("all");
  // where do I stand
  const [salary, setSalary] = useState("");
  // city compare
  const [cmpMetros, setCmpMetros] = useState<string[]>([]);
  // scenario B
  const [bOpen, setBOpen] = useState(false);
  const [bRole, setBRole] = useState("");
  const [bMetro, setBMetro] = useState("");
  const [bLevel, setBLevel] = useState<number | "all">("all");
  // mobile controls sheet
  const [controlsOpen, setControlsOpen] = useState(false);

  const hydrated = useRef(false);

  useEffect(() => {
    fetch("/data/h1b/explorer.json")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: Explorer) => setData(d))
      .catch(() => setError(true));
  }, []);

  // hydrate from URL once data is in
  useEffect(() => {
    if (!data || hydrated.current) return;
    hydrated.current = true;
    const sp = new URLSearchParams(window.location.search);
    const r = sp.get("r");
    if (r && data.roles[r]) setRole(r);
    const m = sp.get("m");
    if (m) setMetro(m);
    const l = sp.get("l");
    if (l && ["1", "2", "3", "4"].includes(l)) setLevel(Number(l));
    const sal = sp.get("sal");
    if (sal && /^\d+$/.test(sal)) setSalary(sal);
    const cmp = sp.get("cmp");
    if (cmp) setCmpMetros(cmp.split("~").filter(Boolean));
    const br = sp.get("br");
    if (br && data.roles[br]) {
      setBRole(br);
      setBOpen(true);
      const bm = sp.get("bm");
      if (bm) setBMetro(bm);
      const bl = sp.get("bl");
      if (bl && ["1", "2", "3", "4"].includes(bl)) setBLevel(Number(bl));
    }
    const emp = sp.get("emp");
    if (emp) setEmployer(emp);
  }, [data]);

  const roleData = data?.roles[role];
  const bRoleData = bRole ? data?.roles[bRole] : undefined;

  // default metro = the role's most-filed metro
  useEffect(() => {
    if (!roleData) return;
    const metros = Object.keys(roleData.byMetro);
    if (!metros.length) return;
    if (!metro || !roleData.byMetro[metro]) setMetro(metros[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleData]);

  useEffect(() => {
    if (bRoleData && (!bMetro || !bRoleData.byMetro[bMetro])) {
      setBMetro(Object.keys(bRoleData.byMetro)[0] ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bRoleData]);

  // default city-compare list = top metros for the role (incl. selected).
  // Re-defaults when the list is empty OR none of its cities exist in the
  // current role (e.g. after switching roles).
  useEffect(() => {
    if (!roleData || !metro) return;
    if (cmpMetros.length && cmpMetros.some((m) => roleData.byMetro[m])) return;
    const top = Object.entries(roleData.byMetro)
      .sort((a, b) => b[1].n - a[1].n)
      .slice(0, 6)
      .map(([m]) => m);
    setCmpMetros(Array.from(new Set([metro, ...top])).slice(0, 6));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleData, metro]);

  // mirror to URL
  useEffect(() => {
    if (!hydrated.current) return;
    const t = setTimeout(() => {
      const sp = new URLSearchParams();
      if (role !== "Software Developers") sp.set("r", role);
      if (metro) sp.set("m", metro);
      if (level !== "all") sp.set("l", String(level));
      if (salary) sp.set("sal", salary);
      if (employer !== "all") sp.set("emp", employer);
      if (cmpMetros.length) sp.set("cmp", cmpMetros.join("~"));
      if (bOpen && bRole) {
        sp.set("br", bRole);
        if (bMetro) sp.set("bm", bMetro);
        if (bLevel !== "all") sp.set("bl", String(bLevel));
      }
      const qs = sp.toString();
      window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
    }, 350);
    return () => clearTimeout(t);
  }, [role, metro, level, salary, employer, cmpMetros, bOpen, bRole, bMetro, bLevel]);

  /** Best available stat for a (role, metro, level), with fallback chain. */
  function bestStat(
    rd: RoleData,
    m: string,
    lvl: number | "all"
  ): { stat: Stat; scope: string; thin: boolean } | null {
    const tryKeys: [Stat | undefined, string][] = [];
    if (lvl !== "all") tryKeys.push([rd.byMetroLevel[`${m}|${lvl}`], `${m} · Level ${ROMAN[lvl]}`]);
    tryKeys.push([rd.byMetro[m], m]);
    if (m) tryKeys.push([rd.byState[stateOf(m)], `${stateOf(m)} (state)`]);
    if (lvl !== "all") tryKeys.push([rd.byLevel[String(lvl)], `Level ${ROMAN[lvl]} (all metros)`]);
    const first = tryKeys.find(([s]) => s && s.n >= MIN_SAMPLE);
    const any = tryKeys.find(([s]) => s);
    const chosen = first ?? any;
    if (!chosen || !chosen[0]) return null;
    return { stat: chosen[0], scope: chosen[1], thin: chosen[0].n < MIN_SAMPLE };
  }

  if (error)
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-6 text-sm text-ink-700">
        Could not load the salary data file. Please refresh the page.
      </div>
    );
  if (!data || !roleData)
    return (
      <div className="rounded-2xl border border-ink-900/5 bg-white p-10 text-center text-sm text-ink-400 shadow-card">
        Loading the H-1B salary explorer…
      </div>
    );

  const metros = Object.keys(roleData.byMetro);
  const current = metro ? bestStat(roleData, metro, level) : null;
  const histStat = metro ? roleData.byMetro[metro] : undefined;

  const salaryNum = salary ? Number(salary) : null;
  const pct =
    salaryNum && current ? percentileOf(salaryNum, current.stat) : null;

  // city comparison rows
  const cityRows = cmpMetros
    .map((m) => ({ m, s: roleData.byMetro[m] }))
    .filter((x) => x.s)
    .map((x) => ({ label: x.m, value: x.s.p50, sub: `n=${x.s.n}` }))
    .sort((a, b) => b.value - a.value);

  // level curve rows
  const levelRows = [1, 2, 3, 4]
    .map((l) => {
      const s =
        (metro && roleData.byMetroLevel[`${metro}|${l}`]) || roleData.byLevel[String(l)];
      return s ? { level: l, value: s.p50, n: s.n } : null;
    })
    .filter(Boolean) as { level: number; value: number; n: number }[];

  // employers
  const empRows = roleData.employers.map((e) => ({
    label: e.name,
    value: e.p50,
    sub: `n=${e.n}`,
  }));

  // scenario B
  const bStat =
    bRoleData && bMetro ? bestStat(bRoleData, bMetro, bLevel) : null;

  const levelButtons: (number | "all")[] = ["all", 1, 2, 3, 4];

  return (
    <div className="space-y-6">
      {/* provenance banner */}
      <div className="rounded-2xl border border-ink-900/5 bg-white p-4 shadow-card sm:p-5">
        <p className="text-sm leading-relaxed text-ink-600">
          <strong className="font-semibold text-ink-900">
            Real base salaries from certified H-1B LCA filings — DOL OFLC,{" "}
            {data.period}.
          </strong>{" "}
          The wage the employer attested to pay, not guaranteed take-home, and
          skewed toward large H-1B sponsors. Experience is shown via the DOL
          wage level I–IV.
        </p>
        <p className="mt-1 text-xs text-ink-400">
          {data.recordsKept.toLocaleString()} certified filings ·{" "}
          {data.withdrawnCount.toLocaleString()} later withdrawn · visa class{" "}
          {data.visaClass}
        </p>
      </div>

      {/* CONTROLS */}
      <div className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card sm:p-6">
        <button
          type="button"
          onClick={() => setControlsOpen((o) => !o)}
          className="mb-3 flex w-full items-center justify-between text-sm font-bold text-ink-900 sm:hidden"
        >
          Filters
          <span aria-hidden>{controlsOpen ? "▴" : "▾"}</span>
        </button>
        <div className={`${controlsOpen ? "block" : "hidden"} sm:block`}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block">
              <span className={labelClass}>Position</span>
              <div className="mt-1">
                <RoleSelect roles={data.filters.roles} value={role} onChange={setRole} />
              </div>
            </label>
            <label className="block">
              <span className={labelClass}>City / metro</span>
              <select
                value={metro}
                onChange={(e) => setMetro(e.target.value)}
                className={`mt-1 ${fieldClass}`}
              >
                {metros.map((m) => (
                  <option key={m} value={m}>
                    {m} ({roleData.byMetro[m].n})
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={labelClass}>Employer (optional)</span>
              <select
                value={employer}
                onChange={(e) => setEmployer(e.target.value)}
                className={`mt-1 ${fieldClass}`}
              >
                <option value="all">All employers</option>
                {roleData.employers.map((e) => (
                  <option key={e.name} value={e.name}>
                    {e.name} ({e.n})
                  </option>
                ))}
              </select>
            </label>
            <div className="block">
              <span className={labelClass}>Experience (wage level)</span>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {levelButtons.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLevel(l)}
                    className={`rounded-lg px-2.5 py-2 text-xs font-semibold transition-colors ${
                      level === l
                        ? "bg-brand-600 text-white"
                        : "bg-ink-900/5 text-ink-700 hover:bg-ink-900/10"
                    }`}
                  >
                    {l === "all" ? "All" : ROMAN[l as number]}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {level !== "all" && (
            <p className="mt-2 text-xs text-ink-400">
              Level {ROMAN[level as number]} — {LEVEL_LABELS[level as number].split("·")[1]}
            </p>
          )}
        </div>
      </div>

      {/* HEADLINE STAT */}
      {current && histStat && (
        <div className="rounded-2xl border border-brand-200 bg-brand-50/40 p-5 shadow-card sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
                Median base salary · {role} · {metro}
                {level !== "all" ? ` · Level ${ROMAN[level as number]}` : ""}
              </p>
              <p className="mt-1 text-4xl font-extrabold tracking-tight text-brand-700 sm:text-5xl">
                {usd(current.stat.p50)}
              </p>
              <p className="mt-1 text-sm text-ink-600">
                {usd(current.stat.p25)} – {usd(current.stat.p75)} middle 50% ·{" "}
                {current.stat.n.toLocaleString()} filings
                {current.stat.medPW
                  ? ` · prevailing-wage floor ~${usd(current.stat.medPW)}`
                  : ""}
              </p>
            </div>
          </div>
          {current.thin && (
            <p className="mt-3 rounded-xl border-l-4 border-amber-400 bg-amber-50/70 px-4 py-2 text-xs text-ink-700">
              Small sample for this exact selection — showing the broader{" "}
              <strong>{current.scope}</strong> aggregate ({current.stat.n}{" "}
              filings) instead.
            </p>
          )}
        </div>
      )}

      {/* DISTRIBUTION */}
      {histStat && (
        <div className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card sm:p-6">
          <h3 className="text-sm font-bold text-ink-900">
            Salary distribution — {role} in {metro}
          </h3>
          <p className="mb-2 text-xs text-ink-400">
            Each bar is a $20k band; the darker bars are the middle 50% (p25–p75).
          </p>
          <Distribution
            hist={histStat.hist ?? []}
            median={histStat.p50}
            p25={histStat.p25}
            p75={histStat.p75}
            userSalary={salaryNum}
            compareMedian={bStat ? bStat.stat.p50 : null}
          />
        </div>
      )}

      {/* WHERE DO I STAND */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-card sm:p-6">
        <h3 className="text-sm font-bold text-ink-900">Where do I stand?</h3>
        <p className="mb-3 text-xs text-ink-500">
          Enter your current or offered base salary for the selection above.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="number"
            inputMode="numeric"
            value={salary}
            onChange={(e) => setSalary(e.target.value.replace(/[^\d]/g, ""))}
            placeholder="e.g. 145000"
            className={`max-w-[220px] ${fieldClass}`}
          />
          {salaryNum && current && pct != null && (
            <button
              type="button"
              onClick={() => setSalary("")}
              className="text-xs font-semibold text-ink-400 hover:text-ink-700"
            >
              clear
            </button>
          )}
        </div>
        {salaryNum && current && pct != null && (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-4">
              <p className="text-xs text-ink-400">Your percentile</p>
              <p className="text-2xl font-extrabold text-emerald-700">
                ~{ordinal(pct)}
              </p>
              <p className="text-xs text-ink-500">
                for {role} in {metro}
                {level !== "all" ? ` · L${ROMAN[level as number]}` : ""}
              </p>
            </div>
            <div className="rounded-xl bg-white p-4">
              <p className="text-xs text-ink-400">Gap to median</p>
              <p
                className={`text-2xl font-extrabold ${
                  salaryNum >= current.stat.p50 ? "text-emerald-700" : "text-rose-600"
                }`}
              >
                {salaryNum >= current.stat.p50 ? "+" : "−"}
                {usd(Math.abs(salaryNum - current.stat.p50))}
              </p>
              <p className="text-xs text-ink-500">
                median {usd(current.stat.p50)}
              </p>
            </div>
            <div className="rounded-xl bg-white p-4">
              <p className="text-xs text-ink-400">Prevailing-wage floor</p>
              {current.stat.medPW ? (
                <>
                  <p
                    className={`text-2xl font-extrabold ${
                      salaryNum >= current.stat.medPW ? "text-emerald-700" : "text-amber-600"
                    }`}
                  >
                    {salaryNum >= current.stat.medPW ? "Above" : "Below"}
                  </p>
                  <p className="text-xs text-ink-500">
                    ~{usd(current.stat.medPW)} median floor
                  </p>
                </>
              ) : (
                <p className="text-sm text-ink-400">n/a</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CITY COMPARISON */}
      <div className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card sm:p-6">
        <h3 className="text-sm font-bold text-ink-900">
          Median {role} salary by city
        </h3>
        <p className="mb-3 text-xs text-ink-400">
          Pick cities to compare. Your selected city is highlighted.
        </p>
        <details className="mb-3">
          <summary className="cursor-pointer text-xs font-semibold text-brand-600">
            Choose cities ({cmpMetros.length})
          </summary>
          <div className="mt-2 max-h-40 overflow-y-auto rounded-xl border border-ink-900/5 p-2">
            {metros.slice(0, 60).map((m) => (
              <label key={m} className="flex items-center gap-2 px-1 py-1 text-xs text-ink-700">
                <input
                  type="checkbox"
                  checked={cmpMetros.includes(m)}
                  onChange={(e) =>
                    setCmpMetros((prev) =>
                      e.target.checked
                        ? [...prev, m].slice(0, 8)
                        : prev.filter((x) => x !== m)
                    )
                  }
                />
                {m} ({roleData.byMetro[m].n})
              </label>
            ))}
          </div>
        </details>
        <HBars rows={cityRows} highlight={metro} />
      </div>

      {/* LEVEL CURVE + EMPLOYERS */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card sm:p-6">
          <h3 className="text-sm font-bold text-ink-900">
            Experience curve (wage level)
          </h3>
          <p className="mb-1 text-xs text-ink-400">
            Median by level for {role}
            {metro ? ` in ${metro}` : ""} — the I→IV pay ramp.
          </p>
          <LevelCurve data={levelRows} />
        </div>
        <div className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card sm:p-6">
          <h3 className="text-sm font-bold text-ink-900">
            Top employers — {role}
          </h3>
          <p className="mb-3 text-xs text-ink-400">
            Median base by sponsor (most filings first).
          </p>
          <div className="max-h-[260px] overflow-y-auto pr-1">
            <HBars rows={empRows} highlight={employer !== "all" ? employer : undefined} />
          </div>
        </div>
      </div>

      {/* SCENARIO COMPARE */}
      <div className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink-900">
            Compare two scenarios
          </h3>
          <button
            type="button"
            onClick={() => {
              setBOpen((o) => !o);
              if (!bRole) setBRole(role);
            }}
            className="rounded-lg bg-ink-900/5 px-3 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ink-900/10"
          >
            {bOpen ? "Hide" : "+ Add scenario B"}
          </button>
        </div>
        {bOpen && (
          <>
            <p className="mt-1 text-xs text-ink-400">
              Should I move to Seattle? What&apos;s the jump from Level II to III?
              Set scenario B and compare.
            </p>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              <label className="block">
                <span className={labelClass}>B · Position</span>
                <div className="mt-1">
                  <RoleSelect
                    roles={data.filters.roles}
                    value={bRole || role}
                    onChange={setBRole}
                  />
                </div>
              </label>
              <label className="block">
                <span className={labelClass}>B · City</span>
                <select
                  value={bMetro}
                  onChange={(e) => setBMetro(e.target.value)}
                  className={`mt-1 ${fieldClass}`}
                >
                  {(bRoleData ? Object.keys(bRoleData.byMetro) : []).map((m) => (
                    <option key={m} value={m}>
                      {m} ({bRoleData!.byMetro[m].n})
                    </option>
                  ))}
                </select>
              </label>
              <div className="block">
                <span className={labelClass}>B · Level</span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {levelButtons.map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setBLevel(l)}
                      className={`rounded-lg px-2.5 py-2 text-xs font-semibold ${
                        bLevel === l
                          ? "bg-[#6d28d9] text-white"
                          : "bg-ink-900/5 text-ink-700 hover:bg-ink-900/10"
                      }`}
                    >
                      {l === "all" ? "All" : ROMAN[l as number]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {current && bStat && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <ScenarioCard
                  tag="A"
                  color="#1e40f5"
                  title={`${role} · ${metro}${level !== "all" ? ` · L${ROMAN[level as number]}` : ""}`}
                  stat={current.stat}
                />
                <ScenarioCard
                  tag="B"
                  color="#6d28d9"
                  title={`${bRole} · ${bMetro}${bLevel !== "all" ? ` · L${ROMAN[bLevel as number]}` : ""}`}
                  stat={bStat.stat}
                />
                <div className="sm:col-span-2 rounded-xl bg-ink-900/5 px-4 py-3 text-sm text-ink-700">
                  <strong className="font-semibold text-ink-900">
                    Difference (median):
                  </strong>{" "}
                  {bStat.stat.p50 >= current.stat.p50 ? "B pays " : "A pays "}
                  {usd(Math.abs(bStat.stat.p50 - current.stat.p50))} more (
                  {Math.round(
                    (Math.abs(bStat.stat.p50 - current.stat.p50) /
                      Math.min(current.stat.p50, bStat.stat.p50)) *
                      100
                  )}
                  %).
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* SHARE */}
      <ResultActions
        title={`H-1B salary — ${role} in ${metro}`}
        shareText={
          salaryNum && pct != null
            ? `${role} in ${metro} median ${usdK(current!.stat.p50)} — I'm at the ~${ordinal(pct)} percentile (H-1B LCA data):`
            : `${role} in ${metro}: median H-1B base salary ${current ? usdK(current.stat.p50) : ""} (DOL LCA data):`
        }
        fileName={`h1b-salary-${role.toLowerCase().replace(/[^a-z]+/g, "-")}`}
        footnote={`H-1B LCA base wages · DOL OFLC ${data.period} · nritousa.com`}
        rows={[
          { label: "Position", value: role },
          { label: "City", value: metro },
          {
            label: "Experience",
            value: level === "all" ? "All levels" : `Level ${ROMAN[level as number]}`,
          },
          ...(current
            ? [{ label: "Median base", value: usd(current.stat.p50) }]
            : []),
          ...(salaryNum && pct != null
            ? [
                { label: "Your salary", value: usd(salaryNum) },
                { label: "Your percentile", value: `~${ordinal(pct)}` },
              ]
            : []),
        ]}
      />

      <DataStamp
        lastUpdated={data.lastUpdated}
        source={data.sourceUrl}
        sourceLabel={`${data.source} · ${data.period}`}
      />
    </div>
  );
}

function ScenarioCard({
  tag,
  color,
  title,
  stat,
}: {
  tag: string;
  color: string;
  title: string;
  stat: Stat;
}) {
  return (
    <div className="rounded-xl border border-ink-900/5 bg-white p-4">
      <div className="flex items-center gap-2">
        <span
          className="flex h-5 w-5 items-center justify-center rounded text-[11px] font-bold text-white"
          style={{ background: color }}
        >
          {tag}
        </span>
        <span className="truncate text-xs font-semibold text-ink-700">{title}</span>
      </div>
      <p className="mt-2 text-2xl font-extrabold tracking-tight" style={{ color }}>
        {usd(stat.p50)}
      </p>
      <p className="text-xs text-ink-500">
        {usd(stat.p25)} – {usd(stat.p75)} · n={stat.n.toLocaleString()}
      </p>
    </div>
  );
}
