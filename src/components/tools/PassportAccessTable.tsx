"use client";

import { useMemo, useState } from "react";
import DataStamp from "@/components/tools/DataStamp";
import passportData from "../../../data/passport-access.json";

type Access = "visa-free" | "voa" | "evisa" | "visa-required";

interface CountryRow {
  name: string;
  region: string;
  access: string;
  stay: string;
  notes: string;
  usVisaPerk: string | null;
  todo?: boolean;
}

const ACCESS_META: Record<Access, { label: string; badge: string }> = {
  "visa-free": { label: "Visa-Free", badge: "bg-emerald-50 text-emerald-700" },
  voa: { label: "Visa on Arrival", badge: "bg-teal-50 text-teal-700" },
  evisa: { label: "e-Visa", badge: "bg-brand-50 text-brand-700" },
  "visa-required": { label: "Visa Required", badge: "bg-rose-50 text-rose-600" },
};

const inputClass =
  "w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

export default function PassportAccessTable() {
  const countries = passportData.countries as CountryRow[];
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");
  const [access, setAccess] = useState("all");
  const [perksOnly, setPerksOnly] = useState(false);

  const regions = useMemo(
    () => Array.from(new Set(countries.map((c) => c.region))).sort(),
    [countries]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return countries
      .filter(
        (c) =>
          (!q || c.name.toLowerCase().includes(q)) &&
          (region === "all" || c.region === region) &&
          (access === "all" || c.access === access) &&
          (!perksOnly || c.usVisaPerk)
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [countries, search, region, access, perksOnly]);

  return (
    <div className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block">
          <span className="text-xs font-semibold text-ink-800">Country</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="e.g. Thailand"
            className={`mt-1 ${inputClass}`}
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-ink-800">Region</span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className={`mt-1 ${inputClass}`}
          >
            <option value="all">All regions</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-ink-800">
            Access type
          </span>
          <select
            value={access}
            onChange={(e) => setAccess(e.target.value)}
            className={`mt-1 ${inputClass}`}
          >
            <option value="all">All types</option>
            {(Object.keys(ACCESS_META) as Access[]).map((a) => (
              <option key={a} value={a}>
                {ACCESS_META[a].label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-end gap-2.5 pb-2.5">
          <input
            type="checkbox"
            checked={perksOnly}
            onChange={(e) => setPerksOnly(e.target.checked)}
            className="h-4 w-4 rounded border-ink-900/20 text-brand-600 focus:ring-brand-500/30"
          />
          <span className="text-sm font-semibold text-ink-800">
            Easier with a US visa 🇺🇸
          </span>
        </label>
      </div>

      <p className="mt-5 text-xs text-ink-400">
        {filtered.length} of {countries.length} destinations shown
      </p>

      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-ink-900/5 text-left text-xs font-bold uppercase tracking-wider text-ink-400">
              <th className="py-3 pr-4">Country</th>
              <th className="py-3 pr-4">Region</th>
              <th className="py-3 pr-4">Access</th>
              <th className="py-3 pr-4">Stay</th>
              <th className="py-3">Easier with a valid US visa?</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const meta =
                ACCESS_META[(c.access as Access) ?? "visa-required"] ??
                ACCESS_META["visa-required"];
              return (
                <tr
                  key={c.name}
                  className="border-b border-ink-900/5 align-top last:border-0"
                >
                  <td className="py-3.5 pr-4">
                    <p className="font-semibold text-ink-900">{c.name}</p>
                    <p className="mt-0.5 max-w-[28ch] text-xs leading-relaxed text-ink-400">
                      {c.notes}
                    </p>
                  </td>
                  <td className="py-3.5 pr-4 text-ink-600">{c.region}</td>
                  <td className="py-3.5 pr-4">
                    <span
                      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${meta.badge}`}
                    >
                      {meta.label}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 whitespace-nowrap text-ink-600">
                    {c.stay}
                  </td>
                  <td className="py-3.5 text-ink-600">
                    {c.usVisaPerk ? (
                      <span className="block max-w-[40ch] text-xs leading-relaxed">
                        <span className="font-semibold text-emerald-600">
                          ✓ Yes —
                        </span>{" "}
                        {c.usVisaPerk}
                      </span>
                    ) : (
                      <span className="text-xs text-ink-300">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {!filtered.length && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-ink-400">
                  No destinations match those filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DataStamp
        className="mt-5 border-t border-ink-900/5 pt-4"
        lastUpdated={passportData.lastUpdated}
        source={passportData.source}
        sourceLabel={passportData.sourceLabel}
      />
    </div>
  );
}
