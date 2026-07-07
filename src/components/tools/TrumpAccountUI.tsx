/**
 * Presentational building blocks shared across the Trump Account cluster.
 *
 * Pure server components (no hooks, no "use client") so they import directly
 * into server page.tsx files. The interactive eligibility checker lives in its
 * own client component.
 *
 * Tables use a SINGLE semantic <table> that reflows to stacked cards on mobile
 * via CSS (each <td> gets a data-label rendered with before:content). That
 * means one crawlable table (no duplicate DOM/text for extractors) that is
 * still readable on phones and exposed to assistive tech.
 */
import Link from "next/link";
import { author } from "@/lib/author";
import {
  EEAT_TITLE,
  EEAT_TEXT,
  EEAT_CREDENTIAL,
  OFFICIAL_SOURCES_REVIEWED,
  whichPagePointers,
  type ComparisonColumn,
  type ComparisonRow,
  type DataCol,
  type DataRow,
} from "@/data/trumpAccountData";
import { trumpAccountClusterLinks } from "@/lib/trumpAccountCluster";

/* ------------------------------------------------------------------ *
 * Quick answer box (top of every page)
 * ------------------------------------------------------------------ */
export function QuickAnswer({
  question,
  answer,
  bullets,
  ctaText,
  ctaHref,
}: {
  question: string;
  answer: React.ReactNode;
  bullets?: React.ReactNode[];
  ctaText?: string;
  ctaHref?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50/60 to-white p-5 shadow-card sm:p-7">
      <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Quick answer</p>
      <h2 className="mt-1 text-lg font-extrabold tracking-tight text-ink-900 sm:text-xl">{question}</h2>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-ink-700 sm:text-base">{answer}</div>
      {bullets && bullets.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
              <span className="mt-0.5 flex-none text-brand-500">•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
      {ctaText && ctaHref && (
        <div className="mt-4">
          <a
            href={ctaHref}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
          >
            {ctaText} →
          </a>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Sticky jump navigation (anchor chips) — shown right after the intro
 * ------------------------------------------------------------------ */
export function JumpNav({ items }: { items: { label: string; href: string }[] }) {
  return (
    <nav
      aria-label="On this page"
      className="sticky top-0 z-20 -mx-4 border-y border-ink-900/5 bg-white/90 px-4 py-2.5 backdrop-blur supports-[backdrop-filter]:bg-white/70"
    >
      <div className="mx-auto flex max-w-3xl flex-nowrap items-center gap-2 overflow-x-auto whitespace-nowrap text-xs [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <span className="flex-none font-semibold uppercase tracking-wide text-ink-400">On this page:</span>
        {items.map((it) => (
          <a
            key={it.href}
            href={it.href}
            className="flex-none rounded-full border border-ink-900/10 bg-slate-50 px-3 py-1 font-semibold text-ink-600 transition hover:border-brand-300 hover:text-brand-700"
          >
            {it.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ *
 * "Which page should you read?" pointer block
 * ------------------------------------------------------------------ */
const APPLY_HREF = "/how-to-apply-for-trump-account-form-4547";

export function WhichPageBlock({ currentHref }: { currentHref: string }) {
  const pointers = whichPagePointers.filter((p) => p.href !== currentHref);
  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-ink-900/10 bg-slate-50/70 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Which page should you read?</p>
      <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
        {pointers.map((p) => (
          <li key={p.href}>
            <Link href={p.href} className="text-sm font-medium text-brand-700 underline underline-offset-2 hover:text-brand-800">
              {p.text}
            </Link>
          </li>
        ))}
      </ul>
      {currentHref !== APPLY_HREF && (
        <p className="mt-3 border-t border-ink-900/10 pt-3 text-sm text-ink-600">
          Ready to file? Read{" "}
          <Link href={APPLY_HREF} className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800">
            how to apply for a Trump Account
          </Link>{" "}
          with IRS Form 4547.
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * E-E-A-T box: "Why this guide is different for immigrant families"
 * ------------------------------------------------------------------ */
export function EEATBox({ lastUpdated = "July 6, 2026" }: { lastUpdated?: string }) {
  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-brand-100 bg-brand-50/40 p-5 shadow-card">
      <h2 className="text-base font-bold text-ink-900">{EEAT_TITLE}</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-700">{EEAT_TEXT}</p>
      <div className="mt-3 border-t border-ink-900/10 pt-3 text-sm text-ink-600">
        <p>
          Written / reviewed by{" "}
          <Link href="/about-deepak" className="font-semibold text-brand-600 underline underline-offset-2 hover:text-brand-700">
            Deepak Middha
          </Link>
          <span className="text-ink-400"> · {author.credentials}</span>
        </p>
        <p className="mt-1 text-xs text-ink-500">{EEAT_CREDENTIAL}</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-400">
          <span>Last updated: {lastUpdated}</span>
          <span>Official sources reviewed: {OFFICIAL_SOURCES_REVIEWED}</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Cluster navigation block (consistent, ordered, current highlighted)
 * ------------------------------------------------------------------ */
const CLUSTER_NAV_LABELS: Record<string, string> = {
  "/trump-account-h1b-immigrant-families": "Main H-1B guide",
  "/can-h1b-parents-open-trump-account-for-child": "Can H-1B parents open one?",
  "/trump-account-1000-eligibility": "$1,000 eligibility",
  "/how-to-apply-for-trump-account-form-4547": "Form 4547 application",
  "/trump-account-tax-rules-immigrants": "Tax rules",
  "/trump-account-moving-back-to-india": "Moving back to India",
  "/trump-account-vs-529-for-h1b-families": "Trump Account vs 529",
  "/trump-account-ssn-itin-child": "SSN vs ITIN",
};

export function TrumpClusterNav({ currentHref }: { currentHref: string }) {
  return (
    <nav aria-label="Trump Account cluster" className="mx-auto max-w-3xl">
      <h2 className="mb-3 text-base font-bold text-ink-900">The complete Trump Account guide for immigrant families</h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {trumpAccountClusterLinks.map((l) => {
          const isCurrent = l.href === currentHref;
          const label = CLUSTER_NAV_LABELS[l.href] ?? l.label;
          return (
            <li key={l.href}>
              {isCurrent ? (
                <span
                  aria-current="page"
                  className="flex items-center gap-2 rounded-xl border border-brand-300 bg-brand-50 px-4 py-2.5 text-sm font-bold text-brand-800"
                >
                  <span aria-hidden>▸</span> {label} <span className="ml-auto text-[0.625rem] font-semibold uppercase text-brand-500">You are here</span>
                </span>
              ) : (
                <Link
                  href={l.href}
                  className="group flex items-center gap-2 rounded-xl border border-ink-900/10 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 transition hover:border-brand-400 hover:text-brand-700"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ------------------------------------------------------------------ *
 * Prose sections (H2 + list of H3/body sections)
 * ------------------------------------------------------------------ */
export interface ProseSection {
  h: string;
  body: React.ReactNode;
  id?: string;
}

export function ProseSections({ heading, sections }: { heading?: string; sections: ProseSection[] }) {
  return (
    <div className="mx-auto max-w-3xl">
      {heading && <h2 className="text-xl font-bold text-ink-900">{heading}</h2>}
      <div className="mt-5 space-y-6">
        {sections.map((s) => (
          <div key={s.h} id={s.id} className={s.id ? "scroll-mt-24" : undefined}>
            <h3 className="text-base font-bold text-ink-900">{s.h}</h3>
            <div className="mt-1.5 space-y-2 text-sm leading-relaxed text-ink-600">{s.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Checklist box (green / brand)
 * ------------------------------------------------------------------ */
export function ChecklistBox({
  title,
  items,
  tone = "emerald",
}: {
  title: string;
  items: React.ReactNode[];
  tone?: "emerald" | "brand";
}) {
  const c =
    tone === "brand"
      ? { border: "border-brand-200", bg: "bg-brand-50/50", label: "text-brand-700", mark: "text-brand-600" }
      : { border: "border-emerald-200", bg: "bg-emerald-50/50", label: "text-emerald-700", mark: "text-emerald-600" };
  return (
    <div className={`rounded-2xl border ${c.border} ${c.bg} p-5`}>
      <p className={`text-xs font-bold uppercase tracking-wide ${c.label}`}>{title}</p>
      <ul className="mt-3 space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
            <span className={`mt-0.5 flex-none ${c.mark}`}>✓</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Warning box (amber)
 * ------------------------------------------------------------------ */
export function WarnBox({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-amber-900">
      {title && <p className="font-bold">{title}</p>}
      <div className={title ? "mt-1.5 space-y-2" : "space-y-2"}>{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Example box (Indian-family scenarios)
 * ------------------------------------------------------------------ */
export function ExampleBox({ title = "Example", children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-sky-200 bg-sky-50/60 p-5 text-sm leading-relaxed text-ink-700">
      <p className="text-xs font-bold uppercase tracking-wide text-sky-700">{title}</p>
      <div className="mt-2 space-y-2">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * "What to do next" CTA
 * ------------------------------------------------------------------ */
export function NextStep({
  heading = "What to do next",
  links,
}: {
  heading?: string;
  links: { label: string; href: string; primary?: boolean }[];
}) {
  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-brand-200 bg-brand-50/50 p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-brand-700">{heading}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {links.map((l) =>
          l.primary ? (
            <a key={l.href} href={l.href} className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-700">
              {l.label} →
            </a>
          ) : (
            <Link key={l.href} href={l.href} className="inline-flex items-center gap-1.5 rounded-lg border border-brand-200 bg-white px-4 py-2 text-sm font-bold text-brand-700 transition hover:bg-brand-50">
              {l.label} →
            </Link>
          ),
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Scenario cards (kept for compact visual scenario groups)
 * ------------------------------------------------------------------ */
export interface Scenario {
  label: string;
  situation: string;
  verdict: string;
  verdictTone: "good" | "bad" | "review";
  detail: string;
}

const verdictStyles: Record<Scenario["verdictTone"], { chip: string; icon: string }> = {
  good: { chip: "border-emerald-200 bg-emerald-50 text-emerald-700", icon: "✓" },
  bad: { chip: "border-rose-200 bg-rose-50 text-rose-700", icon: "✕" },
  review: { chip: "border-amber-200 bg-amber-50 text-amber-800", icon: "?" },
};

export function ScenarioCards({ scenarios }: { scenarios: Scenario[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {scenarios.map((s) => {
        const v = verdictStyles[s.verdictTone];
        return (
          <div key={s.label} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
            <p className="text-sm font-bold text-ink-900">{s.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-600">{s.situation}</p>
            <span className={`mt-2 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[0.6875rem] font-bold ${v.chip}`}>
              <span aria-hidden>{v.icon}</span> {s.verdict}
            </span>
            <p className="mt-2 text-xs leading-relaxed text-ink-500">{s.detail}</p>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Responsive single-table primitives (reflow to cards on mobile via CSS)
 * ------------------------------------------------------------------ */
const TD_BASE =
  "block px-4 py-2 text-sm text-ink-700 before:mb-0.5 before:block before:text-[0.625rem] before:font-bold before:uppercase before:tracking-wide before:text-ink-400 before:content-[attr(data-label)] sm:table-cell sm:px-3 sm:py-3 sm:before:hidden";

/** Generic key/value table: columns describe the header, rows are objects. */
export function DataTable({
  columns,
  rows,
  caption,
}: {
  columns: DataCol[];
  rows: DataRow[];
  caption?: string;
}) {
  return (
    <div>
      {caption && <p className="mb-3 text-sm leading-relaxed text-ink-600">{caption}</p>}
      <div className="overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card sm:overflow-visible">
        <table className="w-full border-collapse text-left align-top sm:min-w-[640px]">
          <thead className="hidden sm:table-header-group">
            <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
              {columns.map((c) => (
                <th key={c.key} className={`p-3 font-semibold ${c.highlight ? "text-brand-700" : ""}`}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-900/10 sm:divide-ink-900/5">
            {rows.map((r, ri) => (
              <tr key={ri} className="block border-b border-ink-900/10 bg-white p-2 last:border-0 sm:table-row sm:p-0 sm:align-top">
                {columns.map((c, ci) => (
                  <td
                    key={c.key}
                    data-label={c.label}
                    className={`${TD_BASE} ${ci === 0 ? "font-semibold text-ink-900" : ""} ${c.highlight ? "sm:bg-brand-50/40 sm:font-medium sm:text-ink-800" : ""}`}
                  >
                    {r[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Feature-by-column comparison (Trump Account vs 529 vs Roth vs brokerage). */
export function ComparisonTable({
  columns,
  rows,
  caption,
}: {
  columns: ComparisonColumn[];
  rows: ComparisonRow[];
  caption?: string;
}) {
  return (
    <div>
      {caption && <p className="mb-3 text-sm leading-relaxed text-ink-600">{caption}</p>}
      <div className="overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card">
        <table className="w-full border-collapse text-left align-top sm:min-w-[820px]">
          <thead className="hidden sm:table-header-group">
            <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
              <th className="p-3 font-semibold">Feature</th>
              {columns.map((c) => (
                <th key={c.key} className={`p-3 font-semibold ${c.highlight ? "text-brand-700" : ""}`}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-900/10 sm:divide-ink-900/5">
            {rows.map((r) => (
              <tr key={r.feature} className="block border-b border-ink-900/10 bg-white p-2 last:border-0 sm:table-row sm:p-0 sm:align-top">
                <td
                  data-label="Feature"
                  className={`${TD_BASE} bg-ink-50/40 font-bold text-ink-900 sm:bg-transparent sm:font-semibold`}
                >
                  {r.feature}
                </td>
                {columns.map((c) => (
                  <td
                    key={c.key}
                    data-label={c.label}
                    className={`${TD_BASE} ${c.highlight ? "sm:bg-brand-50/40 sm:font-medium sm:text-ink-800" : ""}`}
                  >
                    {r.values[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
