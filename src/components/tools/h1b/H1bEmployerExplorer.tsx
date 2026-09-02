"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type {
  EmployerRow,
  EmployerSort,
  ExplorerResult,
  SortDir,
} from "@/lib/h1b/explorer";
import type { WageLevels } from "@/lib/h1b/sponsors";
import SponsorCaveat from "@/components/tools/h1b/SponsorCaveat";
import H1bCrossSell from "@/components/tools/h1b/H1bCrossSell";
import { socSlug } from "@/lib/h1b/socSlug";
import { US_STATES, stateName } from "@/lib/h1b/states";

/* --------------------------------- config -------------------------------- */

const fieldClass =
  "w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";
const labelClass =
  "block text-[0.6875rem] font-semibold uppercase tracking-wider text-ink-400";

/** Wage bands mirror how candidates think about offers, not DOL percentiles. */
const WAGE_BANDS: { id: string; label: string; min?: number; max?: number }[] = [
  { id: "", label: "Any wage" },
  { id: "u50", label: "Under $50k", max: 49999 },
  { id: "50-100", label: "$50k – $100k", min: 50000, max: 99999 },
  { id: "100-150", label: "$100k – $150k", min: 100000, max: 149999 },
  { id: "150-200", label: "$150k – $200k", min: 150000, max: 199999 },
  { id: "200+", label: "$200k+", min: 200000 },
];

const MIN_FILING_OPTIONS = [
  { value: 0, label: "Any volume" },
  { value: 5, label: "5+ filings" },
  { value: 25, label: "25+ filings" },
  { value: 100, label: "100+ filings" },
  { value: 500, label: "500+ filings" },
];

const PAGE_SIZE_OPTIONS = [25, 50, 100];

/** Mirrors MAX_EXPORT_ROWS in lib/h1b/explorer — the export is capped, and the
    button says so rather than handing over a silently truncated file. */
const EXPORT_ROW_CAP = 2000;

interface Filters {
  q: string;
  state: string;
  role: string;
  wage: string;
  minFilings: number;
  sort: EmployerSort;
  dir: SortDir;
  page: number;
  pageSize: number;
}

const DEFAULTS: Filters = {
  q: "",
  state: "",
  role: "",
  wage: "",
  minFilings: 0,
  sort: "filings",
  dir: "desc",
  page: 1,
  pageSize: 25,
};

/* -------------------------------- helpers -------------------------------- */

const nf = (n: number) => n.toLocaleString("en-US");

const usd0 = (n: number | null) =>
  n == null
    ? "—"
    : n.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      });

/** $135,900 -> $136k — the table has to fit a phone. */
const usdCompact = (n: number | null) =>
  n == null ? "—" : `$${Math.round(n / 1000)}k`;

function buildQuery(f: Filters): string {
  const band = WAGE_BANDS.find((b) => b.id === f.wage);
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.state) p.set("state", f.state);
  if (f.role) p.set("role", f.role);
  if (band?.min != null) p.set("wageMin", String(band.min));
  if (band?.max != null) p.set("wageMax", String(band.max));
  if (f.minFilings) p.set("minFilings", String(f.minFilings));
  if (f.sort !== DEFAULTS.sort) p.set("sort", f.sort);
  if (f.dir !== DEFAULTS.dir) p.set("dir", f.dir);
  if (f.page > 1) p.set("page", String(f.page));
  if (f.pageSize !== DEFAULTS.pageSize) p.set("pageSize", String(f.pageSize));
  return p.toString();
}

/** Only the params that change the row set — used to keep the shareable URL clean. */
function readQuery(search: string): Partial<Filters> {
  const p = new URLSearchParams(search);
  const out: Partial<Filters> = {};
  const q = p.get("q");
  const state = p.get("state");
  // `role` is the explorer's filter; `?role=`+`?state=` are also the params the
  // previous role+state finder emitted, so old shared links still land right.
  const role = p.get("role");
  const wage = p.get("wage");
  const sort = p.get("sort") as EmployerSort | null;
  const dir = p.get("dir");
  const minFilings = p.get("minFilings");
  const page = p.get("page");
  const pageSize = p.get("pageSize");
  if (q) out.q = q;
  if (state && /^[A-Za-z]{2}$/.test(state)) out.state = state.toUpperCase();
  if (role) out.role = role;
  if (wage && WAGE_BANDS.some((b) => b.id === wage)) out.wage = wage;
  if (sort && ["filings", "positions", "wage", "employer"].includes(sort))
    out.sort = sort;
  if (dir === "asc" || dir === "desc") out.dir = dir;
  if (minFilings && Number.isFinite(Number(minFilings)))
    out.minFilings = Number(minFilings);
  if (page && Number(page) > 1) out.page = Number(page);
  if (pageSize && PAGE_SIZE_OPTIONS.includes(Number(pageSize)))
    out.pageSize = Number(pageSize);
  return out;
}

/* ------------------------------ presentation ----------------------------- */

const ROMAN: (keyof WageLevels)[] = ["I", "II", "III", "IV"];
const LEVEL_COLOR: Record<keyof WageLevels, string> = {
  I: "#c7d2fe",
  II: "#818cf8",
  III: "#4f46e5",
  IV: "#3730a3",
};

/** Compact I–IV mix bar; the legend lives in the table footnote, not per row. */
function LevelBar({ levels }: { levels: WageLevels }) {
  const total = ROMAN.reduce((s, k) => s + (levels[k] ?? 0), 0);
  if (!total) return <span className="text-xs text-ink-300">—</span>;
  const label = ROMAN.filter((k) => levels[k])
    .map((k) => `Level ${k}: ${levels[k]}`)
    .join(", ");
  return (
    <div
      className="flex h-2 w-full min-w-[56px] overflow-hidden rounded-full bg-ink-900/5"
      role="img"
      aria-label={`Wage level mix — ${label}`}
      title={label}
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
  );
}

function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-ink-900/5 bg-white px-4 py-3 shadow-card">
      <p className="text-[0.625rem] font-semibold uppercase tracking-wider text-ink-400">
        {label}
      </p>
      <p className="mt-0.5 truncate text-xl font-extrabold tracking-tight text-ink-900 tabular-nums sm:text-2xl">
        {value}
      </p>
      {hint && <p className="mt-0.5 truncate text-[0.6875rem] text-ink-400">{hint}</p>}
    </div>
  );
}

/* ------------------------------ role typeahead --------------------------- */

function RoleFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    const q = value.trim();
    if (q.length < 2) {
      setOptions([]);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      fetch(`/api/roles?titles=1&q=${encodeURIComponent(q)}`, {
        signal: ctrl.signal,
      })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((d: { titles?: string[] }) => setOptions(d.titles ?? []))
        .catch(() => {
          /* aborted or offline — keep the prior suggestions */
        });
    }, 200);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
  }, [value]);

  return (
    <div className="relative" ref={ref}>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
        placeholder="Any job title"
        autoComplete="off"
        aria-label="Filter by job title or occupation"
        className={fieldClass}
      />
      {open && options.length > 0 && (
        <ul className="absolute z-30 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-ink-900/10 bg-white py-1 shadow-card-hover">
          {options.map((t) => (
            <li key={t}>
              <button
                type="button"
                onClick={() => {
                  onChange(t);
                  setOpen(false);
                }}
                className="block w-full truncate px-3 py-2 text-left text-sm text-ink-700 hover:bg-brand-50 hover:text-brand-700"
              >
                {t}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* --------------------------------- table --------------------------------- */

const COLUMNS: {
  key: EmployerSort | null;
  label: string;
  className: string;
  numeric?: boolean;
}[] = [
  { key: null, label: "#", className: "w-10 text-right" },
  { key: "employer", label: "Company", className: "min-w-[190px]" },
  { key: "filings", label: "Certified LCAs", className: "w-28 text-right", numeric: true },
  { key: "positions", label: "Positions", className: "w-24 text-right", numeric: true },
  { key: "wage", label: "Median wage", className: "w-28 text-right", numeric: true },
  { key: null, label: "Wage levels", className: "w-24" },
  { key: null, label: "Top occupation", className: "min-w-[170px]" },
  { key: null, label: "Where", className: "min-w-[110px]" },
];

function SortArrow({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <span className="ml-1 text-ink-300" aria-hidden>↕</span>;
  return (
    <span className="ml-1 text-brand-600" aria-hidden>
      {dir === "desc" ? "↓" : "↑"}
    </span>
  );
}

/* ------------------------------ main component --------------------------- */

export default function H1bEmployerExplorer({
  initial,
  asOf,
}: {
  initial: ExplorerResult;
  asOf: string;
}) {
  const [filters, setFilters] = useState<Filters>(DEFAULTS);
  const [data, setData] = useState<ExplorerResult>(initial);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [copied, setCopied] = useState(false);
  const mounted = useRef(false);
  const reqId = useRef(0);
  const resultsRef = useRef<HTMLDivElement>(null);

  /* Hydrate filters from the URL once, so shared links reproduce the view. */
  useEffect(() => {
    const fromUrl = readQuery(window.location.search);
    // Leave `mounted` alone — the fetch effect below flips it on its first
    // pass and skips fetching while the query is still empty, so the untouched
    // default view never re-requests what the server already rendered.
    if (Object.keys(fromUrl).length) {
      setFilters((f) => ({ ...f, ...fromUrl }));
    }
  }, []);

  const query = useMemo(() => buildQuery(filters), [filters]);

  /* Fetch on every filter change after the first paint. The initial render is
     server-rendered so the leaderboard — company names included — is in the
     HTML before any JavaScript runs. */
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      if (!query) return; // untouched default view === `initial`
    }
    const id = ++reqId.current;
    const ctrl = new AbortController();
    setLoading(true);
    setFailed(false);
    const t = setTimeout(() => {
      fetch(`/api/h1b-employers${query ? `?${query}` : ""}`, {
        signal: ctrl.signal,
      })
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
        .then((d: ExplorerResult) => {
          if (id !== reqId.current) return;
          setData(d);
          setLoading(false);
        })
        .catch((e: unknown) => {
          if ((e as Error)?.name === "AbortError" || id !== reqId.current) return;
          setFailed(true);
          setLoading(false);
        });
      const url = query
        ? `${window.location.pathname}?${query}`
        : window.location.pathname;
      window.history.replaceState(null, "", url);
    }, 250);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
  }, [query]);

  /* Any filter change resets to page 1; paging keeps the current filters. */
  const update = useCallback((patch: Partial<Filters>) => {
    setFilters((f) => ({ ...f, page: 1, ...patch }));
  }, []);

  const goToPage = useCallback((page: number) => {
    setFilters((f) => ({ ...f, page }));
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const toggleSort = useCallback((key: EmployerSort) => {
    setFilters((f) =>
      f.sort === key
        ? { ...f, dir: f.dir === "desc" ? "asc" : "desc", page: 1 }
        : { ...f, sort: key, dir: key === "employer" ? "asc" : "desc", page: 1 }
    );
  }, []);

  const isFiltered =
    Boolean(filters.q || filters.state || filters.role || filters.wage) ||
    filters.minFilings > 0;

  const { rows, summary, total, page, pageCount, topRoles, topStates } = data;

  const scopeLabel = [
    filters.role || "All occupations",
    filters.state ? stateName(filters.state) : "All states",
  ].join(" · ");

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — the URL bar already shows the shareable link */
    }
  };

  /* The prerendered role×state page is the one deep link worth offering, and
     only when both halves of it are actually set. */
  const deepLink =
    filters.state &&
    rows.length &&
    topRoles.some((t) => t.soc_title === filters.role)
      ? `/h1b-sponsors/${socSlug(filters.role)}/${filters.state.toLowerCase()}`
      : null;

  const rankOffset = (page - 1) * data.pageSize;

  return (
    <div className="space-y-5">
      {/* ── SUMMARY ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          label="Certified LCAs"
          value={nf(summary.filings)}
          hint={`${nf(summary.positions)} worker positions`}
        />
        <StatTile
          label="Sponsoring companies"
          value={nf(summary.employers)}
          hint={isFiltered ? "matching your filters" : "across the US"}
        />
        <StatTile
          label="Median wage"
          value={usd0(summary.medianWage)}
          hint="annualized, per filing"
        />
        <StatTile
          label="Occupations"
          value={nf(summary.occupations)}
          hint={`in ${nf(summary.states)} states`}
        />
      </div>

      {/* ── FILTERS ─────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-ink-900/5 bg-white p-4 shadow-card sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <label className="block min-w-0 lg:col-span-2">
            <span className={labelClass}>Company name</span>
            <input
              type="text"
              value={filters.q}
              onChange={(e) => update({ q: e.target.value })}
              placeholder="e.g. Amazon, Infosys, Deloitte"
              autoComplete="off"
              className={`mt-1 ${fieldClass}`}
            />
          </label>
          <label className="block min-w-0">
            <span className={labelClass}>Job title</span>
            <div className="mt-1">
              <RoleFilter value={filters.role} onChange={(role) => update({ role })} />
            </div>
          </label>
          <label className="block min-w-0">
            <span className={labelClass}>Work state</span>
            <select
              value={filters.state}
              onChange={(e) => update({ state: e.target.value })}
              className={`mt-1 ${fieldClass}`}
            >
              <option value="">All states</option>
              {US_STATES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <div className="grid min-w-0 grid-cols-2 gap-3">
            <label className="block min-w-0">
              <span className={labelClass}>Wage</span>
              <select
                value={filters.wage}
                onChange={(e) => update({ wage: e.target.value })}
                className={`mt-1 ${fieldClass}`}
              >
                {WAGE_BANDS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block min-w-0">
              <span className={labelClass}>Volume</span>
              <select
                value={filters.minFilings}
                onChange={(e) => update({ minFilings: Number(e.target.value) })}
                className={`mt-1 ${fieldClass}`}
              >
                {MIN_FILING_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
          <p className="mr-auto text-xs text-ink-400">
            Every filter is optional — the table starts on the busiest H-1B
            sponsors nationally.
          </p>
          {isFiltered && (
            <button
              type="button"
              onClick={() => setFilters(DEFAULTS)}
              className="text-xs font-bold text-brand-600 underline underline-offset-2 hover:text-brand-700"
            >
              Reset filters
            </button>
          )}
          <button
            type="button"
            onClick={copyLink}
            className="rounded-lg border border-ink-900/10 px-2.5 py-1.5 text-xs font-semibold text-ink-700 hover:bg-slate-50"
          >
            {copied ? "Link copied" : "Copy link"}
          </button>
          <a
            href={`/api/h1b-employers?${query ? `${query}&` : ""}format=csv`}
            title={
              total > EXPORT_ROW_CAP
                ? `Downloads the top ${nf(EXPORT_ROW_CAP)} of ${nf(total)} companies — filter further to export the rest.`
                : `Downloads all ${nf(total)} companies in this view.`
            }
            className="rounded-lg border border-ink-900/10 px-2.5 py-1.5 text-xs font-semibold text-ink-700 hover:bg-slate-50"
          >
            Export CSV
            {total > EXPORT_ROW_CAP && (
              <span className="ml-1 font-normal text-ink-400">
                (top {nf(EXPORT_ROW_CAP)})
              </span>
            )}
          </a>
        </div>
      </div>

      {/* ── RESULTS ─────────────────────────────────────────────────────── */}
      <div ref={resultsRef} className="scroll-mt-24 space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h2 className="text-base font-bold text-ink-900 sm:text-lg">
            {isFiltered ? "Matching H-1B sponsors" : "Top H-1B sponsors in the US"}
          </h2>
          <p className="text-xs text-ink-400">
            {nf(total)} compan{total === 1 ? "y" : "ies"} · {scopeLabel}
          </p>
        </div>

        {failed && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-6 text-sm text-ink-700">
            Something went wrong loading employer data. Change a filter to retry.
          </div>
        )}

        {!failed && total === 0 && (
          <div className="rounded-2xl border border-ink-900/5 bg-white p-8 text-center shadow-card">
            <p className="text-sm font-semibold text-ink-900">
              No employers match those filters.
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-500">
              Try a broader job title, a different state, or a lower filing
              volume. The dataset only covers certified H-1B LCAs in the period
              above.
            </p>
          </div>
        )}

        {!failed && total > 0 && (
          <div
            className={`transition-opacity ${loading ? "opacity-50" : "opacity-100"}`}
            aria-busy={loading}
          >
            {/* Desktop: one dense sortable table. */}
            <div className="hidden overflow-x-auto rounded-2xl border border-ink-900/5 bg-white shadow-card sm:block">
              <table className="w-full min-w-[860px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-ink-900/10 bg-slate-50/80">
                    {COLUMNS.map((c) => (
                      <th
                        key={c.label}
                        scope="col"
                        className={`px-3 py-2.5 text-[0.6875rem] font-bold uppercase tracking-wider text-ink-500 ${c.className} ${
                          c.numeric ? "text-right" : "text-left"
                        }`}
                      >
                        {c.key ? (
                          <button
                            type="button"
                            onClick={() => toggleSort(c.key as EmployerSort)}
                            className="inline-flex items-center whitespace-nowrap font-bold uppercase tracking-wider hover:text-brand-600"
                            aria-label={`Sort by ${c.label}`}
                          >
                            {c.label}
                            <SortArrow
                              active={filters.sort === c.key}
                              dir={filters.dir}
                            />
                          </button>
                        ) : (
                          <span className="whitespace-nowrap">{c.label}</span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr
                      key={r.employer}
                      className="border-b border-ink-900/5 last:border-0 hover:bg-brand-50/40"
                    >
                      <td className="px-3 py-2.5 text-right text-xs font-bold tabular-nums text-ink-400">
                        {rankOffset + i + 1}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="font-bold text-ink-900">{r.employer}</span>
                        {r.last_filed && (
                          <span className="ml-2 whitespace-nowrap text-[0.6875rem] text-ink-300">
                            last filed {r.last_filed.slice(0, 7)}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold tabular-nums text-ink-900">
                        {nf(r.lca_count)}
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-ink-500">
                        {nf(r.worker_positions)}
                      </td>
                      <td className="px-3 py-2.5 text-right font-semibold tabular-nums text-ink-900">
                        {usd0(r.median_wage)}
                      </td>
                      <td className="px-3 py-2.5">
                        <LevelBar levels={r.wage_levels} />
                      </td>
                      <td className="px-3 py-2.5">
                        <button
                          type="button"
                          onClick={() => update({ role: r.top_role })}
                          className="text-left text-xs font-semibold text-brand-600 hover:underline"
                        >
                          {r.top_role || "—"}
                        </button>
                        {r.role_count > 1 && (
                          <span className="ml-1 text-[0.6875rem] text-ink-400">
                            +{r.role_count - 1} more
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {r.states.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => update({ state: s })}
                              className="rounded bg-ink-900/5 px-1.5 py-0.5 text-[0.6875rem] font-semibold text-ink-600 hover:bg-brand-100 hover:text-brand-700"
                            >
                              {s}
                            </button>
                          ))}
                          {r.state_count > r.states.length && (
                            <span className="text-[0.6875rem] text-ink-400">
                              +{r.state_count - r.states.length}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: the same rows as cards — a 860px table can't be read on a phone. */}
            <ul className="space-y-2.5 sm:hidden">
              {rows.map((r, i) => (
                <li
                  key={r.employer}
                  className="rounded-2xl border border-ink-900/5 bg-white p-4 shadow-card"
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      aria-hidden
                      className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-lg bg-brand-50 text-xs font-bold tabular-nums text-brand-700"
                    >
                      {rankOffset + i + 1}
                    </span>
                    <h3 className="min-w-0 text-sm font-bold leading-snug text-ink-900">
                      {r.employer}
                    </h3>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <div className="min-w-0 rounded-lg bg-slate-50 px-2 py-1.5">
                      <p className="text-[0.5625rem] font-semibold uppercase tracking-wider text-ink-400">
                        LCAs
                      </p>
                      <p className="text-sm font-extrabold tabular-nums text-ink-900">
                        {nf(r.lca_count)}
                      </p>
                    </div>
                    <div className="min-w-0 rounded-lg bg-slate-50 px-2 py-1.5">
                      <p className="text-[0.5625rem] font-semibold uppercase tracking-wider text-ink-400">
                        Positions
                      </p>
                      <p className="text-sm font-extrabold tabular-nums text-ink-900">
                        {nf(r.worker_positions)}
                      </p>
                    </div>
                    <div className="min-w-0 rounded-lg bg-slate-50 px-2 py-1.5">
                      <p className="text-[0.5625rem] font-semibold uppercase tracking-wider text-ink-400">
                        Median
                      </p>
                      <p className="text-sm font-extrabold tabular-nums text-ink-900">
                        {usdCompact(r.median_wage)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2.5">
                    <LevelBar levels={r.wage_levels} />
                  </div>
                  <p className="mt-2.5 text-xs text-ink-500">
                    <button
                      type="button"
                      onClick={() => update({ role: r.top_role })}
                      className="font-semibold text-brand-600"
                    >
                      {r.top_role || "—"}
                    </button>
                    {r.role_count > 1 && (
                      <span className="text-ink-400"> +{r.role_count - 1} more</span>
                    )}
                    <span className="text-ink-300"> · </span>
                    {r.states.join(", ")}
                    {r.state_count > r.states.length && (
                      <span className="text-ink-400">
                        {" "}
                        +{r.state_count - r.states.length}
                      </span>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Legend + pagination */}
        {!failed && total > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 pt-1">
            <p className="text-[0.6875rem] text-ink-400">
              Wage levels{" "}
              {ROMAN.map((k, i) => (
                <span key={k} className="whitespace-nowrap">
                  {i > 0 && " "}
                  <span
                    aria-hidden
                    className="mr-0.5 inline-block h-2 w-2 rounded-sm align-middle"
                    style={{ background: LEVEL_COLOR[k] }}
                  />
                  {k}
                </span>
              ))}{" "}
              — entry to senior, as filed with DOL.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-1.5 text-xs text-ink-400">
                <span className="hidden sm:inline">Rows</span>
                <select
                  value={filters.pageSize}
                  onChange={(e) =>
                    update({ pageSize: Number(e.target.value) })
                  }
                  className="rounded-lg border border-ink-900/10 bg-white px-2 py-1 text-xs text-ink-700"
                  aria-label="Rows per page"
                >
                  {PAGE_SIZE_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="rounded-lg border border-ink-900/10 px-2.5 py-1.5 text-xs font-semibold text-ink-700 disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:bg-slate-50"
              >
                ← Prev
              </button>
              <span className="text-xs tabular-nums text-ink-500">
                {nf(page)} / {nf(pageCount)}
              </span>
              <button
                type="button"
                onClick={() => goToPage(page + 1)}
                disabled={page >= pageCount}
                className="rounded-lg border border-ink-900/10 px-2.5 py-1.5 text-xs font-semibold text-ink-700 disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:bg-slate-50"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {deepLink && (
          <p className="text-center text-xs text-ink-400">
            <Link
              href={deepLink}
              className="font-semibold text-brand-600 underline underline-offset-2"
            >
              Open the shareable page for {filters.role} in{" "}
              {stateName(filters.state)} →
            </Link>
          </p>
        )}
      </div>

      {/* ── FACETS ──────────────────────────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="min-w-0 rounded-2xl border border-ink-900/5 bg-white p-4 shadow-card sm:p-5">
          <h3 className="text-sm font-bold text-ink-900">
            Most-sponsored job titles
          </h3>
          <p className="mt-0.5 text-xs text-ink-400">
            Tap one to filter the table above.
          </p>
          <ul className="mt-3 space-y-1.5">
            {topRoles.map((r) => (
              <li key={r.soc_title}>
                <button
                  type="button"
                  onClick={() => update({ role: r.soc_title })}
                  className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-brand-50 ${
                    filters.role === r.soc_title ? "bg-brand-50" : ""
                  }`}
                >
                  <span className="min-w-0 flex-1 truncate text-xs font-semibold text-ink-800">
                    {r.soc_title}
                  </span>
                  <span className="flex-none text-[0.6875rem] tabular-nums text-ink-400">
                    {usdCompact(r.median_wage)}
                  </span>
                  <span className="flex-none w-16 text-right text-xs font-bold tabular-nums text-ink-900">
                    {nf(r.lca_count)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0 rounded-2xl border border-ink-900/5 bg-white p-4 shadow-card sm:p-5">
          <h3 className="text-sm font-bold text-ink-900">
            Where the filings are
          </h3>
          <p className="mt-0.5 text-xs text-ink-400">
            Certified H-1B LCAs by worksite state.
          </p>
          <ul className="mt-3 space-y-1.5">
            {topStates.map((s) => {
              const max = topStates[0]?.lca_count || 1;
              return (
                <li key={s.code}>
                  <button
                    type="button"
                    onClick={() => update({ state: s.code })}
                    className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-brand-50 ${
                      filters.state === s.code ? "bg-brand-50" : ""
                    }`}
                  >
                    <span className="w-24 flex-none truncate text-xs font-semibold text-ink-800">
                      {s.name}
                    </span>
                    <span className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-ink-900/5">
                      <span
                        className="block h-full rounded-full bg-brand-500"
                        style={{ width: `${(s.lca_count / max) * 100}%` }}
                      />
                    </span>
                    <span className="w-16 flex-none text-right text-xs font-bold tabular-nums text-ink-900">
                      {nf(s.lca_count)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <p className="text-center text-xs text-ink-400">
        Source: US Department of Labor OFLC LCA disclosure data, {asOf}.
      </p>

      <SponsorCaveat />

      <div className="pt-2">
        <H1bCrossSell />
      </div>
    </div>
  );
}
