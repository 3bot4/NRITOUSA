"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { RoleOption, SponsorRow } from "@/lib/h1b/sponsors";
import SponsorCard from "@/components/tools/h1b/SponsorCard";
import SponsorCaveat from "@/components/tools/h1b/SponsorCaveat";
import H1bCrossSell from "@/components/tools/h1b/H1bCrossSell";
import { socSlug } from "@/lib/h1b/socSlug";
import { US_STATES } from "@/lib/h1b/states";

/* --------------------------------- data --------------------------------- */

const fieldClass =
  "w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";
const labelClass = "text-xs font-semibold text-ink-800";

type Status = "idle" | "loading" | "ok" | "error";

/* ------------------------------ role search ----------------------------- */

function RoleAutocomplete({
  value,
  onChange,
  onPick,
}: {
  value: string;
  onChange: (v: string) => void;
  onPick: (role: RoleOption) => void;
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<RoleOption[]>([]);
  const [highlight, setHighlight] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // Debounced fetch against /api/roles.
  useEffect(() => {
    const q = value.trim();
    if (q.length < 2) {
      setOptions([]);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      fetch(`/api/roles?q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((d: { roles: RoleOption[] }) => {
          setOptions(d.roles ?? []);
          setHighlight(-1);
        })
        .catch(() => {
          /* aborted or failed — leave prior options */
        });
    }, 200);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
  }, [value]);

  const pick = (opt: RoleOption) => {
    onPick(opt);
    setOpen(false);
  };

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
          if (!open || !options.length) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlight((h) => Math.min(h + 1, options.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlight((h) => Math.max(h - 1, 0));
          } else if (e.key === "Enter" && highlight >= 0) {
            e.preventDefault();
            pick(options[highlight]);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
        placeholder="e.g. software developer, data scientist, accountant"
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        className={fieldClass}
      />
      {open && options.length > 0 && (
        <ul className="absolute z-30 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-ink-900/10 bg-white py-1 shadow-card-hover">
          {options.map((opt, i) => (
            <li key={`${opt.soc_code}-${i}`}>
              <button
                type="button"
                onMouseEnter={() => setHighlight(i)}
                onClick={() => pick(opt)}
                className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm ${
                  i === highlight ? "bg-brand-50 text-brand-700" : "text-ink-700"
                }`}
              >
                <span className="truncate font-medium">{opt.soc_title}</span>
                <span className="flex-none text-[0.625rem] tabular-nums text-ink-400">
                  {opt.soc_code}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* --------------------------------- main --------------------------------- */

export default function H1BSponsorFinder() {
  const [role, setRole] = useState("");
  const [submittedRole, setSubmittedRole] = useState("");
  const [state, setState] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [sponsors, setSponsors] = useState<SponsorRow[]>([]);
  const hydrated = useRef(false);

  // Hydrate from URL once on mount (shareable links).
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const sp = new URLSearchParams(window.location.search);
    const r = sp.get("role");
    const s = sp.get("state");
    if (r) setRole(r);
    if (s && /^[A-Za-z]{2}$/.test(s)) setState(s.toUpperCase());
    if (r && s) runSearch(r, s.toUpperCase());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runSearch(roleText: string, stateCode: string) {
    const r = roleText.trim();
    const s = stateCode.trim().toUpperCase();
    if (!r || !s) return;
    setStatus("loading");
    setSubmittedRole(r);
    try {
      const res = await fetch(
        `/api/sponsors?role=${encodeURIComponent(r)}&state=${encodeURIComponent(s)}`
      );
      if (!res.ok) throw new Error(String(res.status));
      const data: { sponsors: SponsorRow[] } = await res.json();
      setSponsors(data.sponsors ?? []);
      setStatus("ok");
      const qs = new URLSearchParams({ role: r, state: s }).toString();
      window.history.replaceState(null, "", `?${qs}`);
    } catch {
      setStatus("error");
      setSponsors([]);
    }
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(role, state);
  };

  const canSearch = role.trim().length >= 2 && /^[A-Za-z]{2}$/.test(state);
  const stateName = US_STATES.find((x) => x.code === state)?.name ?? state;
  // SEO deep-link for the current result (programmatic route).
  const seoHref =
    status === "ok" && sponsors.length
      ? `/h1b-sponsors/${socSlug(sponsors[0].soc_title)}/${state.toLowerCase()}`
      : null;

  return (
    <div className="space-y-6">
      {/* CONTROLS */}
      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card sm:p-6"
      >
        <div className="grid gap-4 sm:grid-cols-[1fr,auto] sm:items-end">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Job title / role</span>
              <div className="mt-1">
                <RoleAutocomplete
                  value={role}
                  onChange={setRole}
                  onPick={(opt) => setRole(opt.soc_title)}
                />
              </div>
            </label>
            <label className="block">
              <span className={labelClass}>Work state</span>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className={`mt-1 ${fieldClass}`}
              >
                <option value="">Select a state…</option>
                {US_STATES.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button
            type="submit"
            disabled={!canSearch || status === "loading"}
            className="h-[42px] rounded-xl bg-brand-600 px-5 text-sm font-bold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {status === "loading" ? "Searching…" : "Find sponsors"}
          </button>
        </div>
        <p className="mt-3 text-xs text-ink-400">
          Type a role to see matching occupations, pick a state, then search the
          ranked list of employers that filed certified H-1B LCAs there.
        </p>
      </form>

      {/* RESULTS */}
      {status === "loading" && (
        <div className="space-y-3" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl border border-ink-900/5 bg-white shadow-card"
            />
          ))}
        </div>
      )}

      {status === "error" && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-6 text-sm text-ink-700">
          Something went wrong loading sponsor data. Please try again in a
          moment.
        </div>
      )}

      {status === "ok" && sponsors.length === 0 && (
        <div className="rounded-2xl border border-ink-900/5 bg-white p-8 text-center shadow-card">
          <p className="text-sm font-semibold text-ink-900">
            No certified H-1B LCAs found for {submittedRole} in {stateName}.
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-500">
            Try a broader job title (e.g. &ldquo;developer&rdquo; instead of a
            specific stack) or a different state. The dataset only includes
            employers with certified filings in the last 12 months.
          </p>
        </div>
      )}

      {status === "ok" && sponsors.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-base font-bold text-ink-900 sm:text-lg">
              Top sponsors · {submittedRole} · {stateName}
            </h2>
            <span className="text-xs text-ink-400">
              {sponsors.length} employer{sponsors.length === 1 ? "" : "s"} ·
              ranked by recent LCA volume
            </span>
          </div>

          <div className="space-y-3">
            {sponsors.map((s, i) => (
              <SponsorCard key={`${s.employer}-${i}`} sponsor={s} rank={i + 1} />
            ))}
          </div>

          <SponsorCaveat />

          {seoHref && (
            <p className="text-center text-xs text-ink-400">
              <Link
                href={seoHref}
                className="font-semibold text-brand-600 underline underline-offset-2"
              >
                View the shareable page for {sponsors[0].soc_title} in {stateName} →
              </Link>
            </p>
          )}
        </div>
      )}

      {status === "idle" && (
        <div className="rounded-2xl border border-dashed border-ink-900/15 bg-slate-50/60 p-8 text-center text-sm text-ink-500">
          Pick a role and a state above to see which employers actually sponsor
          H-1Bs for that job there.
        </div>
      )}

      {/* Cross-sell always available below the tool. */}
      <div className="pt-2">
        <H1bCrossSell />
      </div>
    </div>
  );
}
