/**
 * Presentational tables for the student cluster.
 *
 * Mobile rule this repo has been bitten by before: a wide table must scroll
 * inside its OWN `overflow-x: auto` container, never let the page body scroll
 * sideways. Every table here is wrapped accordingly, and the wrapper carries
 * the rounded border so the scroll edge looks intentional.
 *
 * Server components — no client JS. Interactive pieces live elsewhere.
 */

import type { ReactNode } from "react";
import type { PolicyStatus } from "@/data/studentClusterData";
import { STATUS_BADGE } from "@/data/studentClusterData";

/* ─────────────────────────────── status badge ──────────────────────────── */

const TONE: Record<string, string> = {
  good: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warn: "border-amber-200 bg-amber-50 text-amber-800",
  bad: "border-rose-200 bg-rose-50 text-rose-700",
  info: "border-sky-200 bg-sky-50 text-sky-700",
};

export function PolicyStatusBadge({ status }: { status: PolicyStatus }) {
  const badge = STATUS_BADGE[status];
  return (
    <span
      className={`inline-flex flex-none items-center rounded-full border px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide ${TONE[badge.tone]}`}
    >
      {badge.label}
    </span>
  );
}

/* ──────────────────────────────── base table ───────────────────────────── */

export interface FactTableProps {
  caption?: string;
  headers: string[];
  rows: ReactNode[][];
  /** Highlight tint per row index. */
  highlightRows?: number[];
  /** Optional note rendered under the table. */
  note?: ReactNode;
  /** Column index that should not wrap (usually a number column). */
  nowrapCol?: number;
}

export function FactTable({
  caption,
  headers,
  rows,
  highlightRows = [],
  note,
  nowrapCol,
}: FactTableProps) {
  return (
    <figure className="my-6">
      {caption ? (
        <figcaption className="mb-2 text-sm font-semibold text-ink-900">
          {caption}
        </figcaption>
      ) : null}
      <div className="overflow-x-auto rounded-2xl border border-ink-900/10 bg-white shadow-card">
        <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-ink-900/10 bg-ink-50/60">
              {headers.map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-ink-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className={`border-b border-ink-900/5 last:border-0 ${
                  highlightRows.includes(i) ? "bg-emerald-50/40" : ""
                }`}
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={`px-4 py-3 align-top leading-relaxed ${
                      j === 0 ? "font-semibold text-ink-900" : "text-ink-600"
                    } ${j === nowrapCol ? "whitespace-nowrap" : ""}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note ? (
        <figcaption className="mt-2 text-xs leading-relaxed text-ink-400">
          {note}
        </figcaption>
      ) : null}
    </figure>
  );
}

/* ───────────────────────── myth / reality fact table ───────────────────── */

export interface MythRow {
  claim: string;
  reality: string;
  why: string;
}

/**
 * The share-bait table. Rendered as cards on mobile rather than a scrolling
 * table, because three long text columns are unreadable at 390px however you
 * scroll them.
 */
export function MythRealityTable({
  facts,
  caption,
}: {
  facts: MythRow[];
  caption?: string;
}) {
  return (
    <figure className="my-6">
      {caption ? (
        <figcaption className="mb-3 text-sm font-semibold text-ink-900">
          {caption}
        </figcaption>
      ) : null}

      {/* Mobile: stacked cards */}
      <ul className="space-y-3 sm:hidden">
        {facts.map((f) => (
          <li
            key={f.claim}
            className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card"
          >
            <p className="text-sm font-semibold text-ink-400 line-through decoration-rose-400/70 decoration-2">
              {f.claim}
            </p>
            <p className="mt-2 text-sm font-bold text-emerald-700">
              {f.reality}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
              {f.why}
            </p>
          </li>
        ))}
      </ul>

      {/* Desktop: three-column table */}
      <div className="hidden overflow-x-auto rounded-2xl border border-ink-900/10 bg-white shadow-card sm:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-ink-900/10 bg-ink-50/60">
              <th
                scope="col"
                className="w-1/4 px-4 py-3 text-xs font-bold uppercase tracking-wide text-ink-500"
              >
                What people believe
              </th>
              <th
                scope="col"
                className="w-1/5 px-4 py-3 text-xs font-bold uppercase tracking-wide text-ink-500"
              >
                Reality
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-ink-500"
              >
                Why
              </th>
            </tr>
          </thead>
          <tbody>
            {facts.map((f) => (
              <tr key={f.claim} className="border-b border-ink-900/5 last:border-0">
                <td className="px-4 py-3 align-top text-ink-400 line-through decoration-rose-400/70 decoration-2">
                  {f.claim}
                </td>
                <td className="px-4 py-3 align-top font-bold text-emerald-700">
                  {f.reality}
                </td>
                <td className="px-4 py-3 align-top leading-relaxed text-ink-600">
                  {f.why}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

/* ─────────────────────────── policy status callout ─────────────────────── */

export function PolicyCallout({
  label,
  value,
  status,
  statusLine,
  detail,
  sourceLabel,
  sourceHref,
  lastVerified,
}: {
  label: string;
  value: string;
  status: PolicyStatus;
  statusLine: string;
  detail?: string;
  sourceLabel?: string;
  sourceHref?: string;
  lastVerified?: string;
}) {
  const accent =
    status === "in-force"
      ? "border-emerald-200 bg-emerald-50/50"
      : status === "proposed"
        ? "border-amber-200 bg-amber-50/50"
        : "border-sky-200 bg-sky-50/50";

  return (
    <div className={`my-6 rounded-2xl border ${accent} p-5 shadow-card`}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="text-2xl font-extrabold tracking-tight text-ink-900">
          {value}
        </span>
        <PolicyStatusBadge status={status} />
      </div>
      <p className="mt-1 text-sm font-semibold text-ink-900">{label}</p>
      <p className="mt-2 text-sm font-medium leading-relaxed text-ink-700">
        {statusLine}
      </p>
      {detail ? (
        <p className="mt-2 text-sm leading-relaxed text-ink-500">{detail}</p>
      ) : null}
      {sourceHref ? (
        <p className="mt-3 text-xs text-ink-400">
          {lastVerified ? (
            <>
              Verified <time dateTime={lastVerified}>{lastVerified}</time> ·{" "}
            </>
          ) : null}
          <a
            href={sourceHref}
            target="_blank"
            rel="nofollow noopener"
            className="font-semibold text-brand-600 underline"
          >
            {sourceLabel ?? "Official source"}
          </a>
        </p>
      ) : null}
    </div>
  );
}
