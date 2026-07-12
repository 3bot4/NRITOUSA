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
  "/trump-account-generational-wealth-for-kids": "Generational wealth + calculator",
  "/trump-account-tax-planning-immigrant-families": "Tax planning (withdrawals, Roth, India)",
  "/trump-account-age-18-withdrawal-roth-conversion": "Age 18: withdrawals & Roth conversion",
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
 * Expert planning callout — "What I would generally consider…"
 * Framed as an educational planning perspective, never absolute advice.
 * ------------------------------------------------------------------ */
export function ExpertCallout({ scenario, children }: { scenario: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-violet-200 bg-violet-50/50 p-5">
      <div className="flex items-center gap-2">
        <span
          className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white"
          aria-hidden
        >
          DM
        </span>
        <p className="text-xs font-bold uppercase tracking-wide text-violet-700">Planning perspective</p>
      </div>
      <p className="mt-3 text-sm font-semibold text-ink-900">
        What I would generally consider {scenario}:
      </p>
      <div className="mt-1.5 space-y-2 text-sm leading-relaxed text-ink-700">{children}</div>
      <p className="mt-3 text-xs italic text-ink-400">
        Educational planning perspective, not a personalized recommendation — verify against current guidance and your
        own facts.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Decision flow (lightweight vertical flowchart)
 * ------------------------------------------------------------------ */
export interface FlowNode {
  text: string;
  kind?: "start" | "decision" | "action" | "end";
  /** Optional branch annotation shown on the arrow BELOW this node. */
  branch?: string;
}
const flowStyles: Record<NonNullable<FlowNode["kind"]>, string> = {
  start: "border-brand-300 bg-brand-50 text-brand-800 font-bold",
  decision: "border-amber-300 bg-amber-50 text-amber-900 font-semibold",
  action: "border-ink-900/10 bg-white text-ink-700",
  end: "border-emerald-300 bg-emerald-50 text-emerald-800 font-bold",
};
export function DecisionFlow({ title, nodes }: { title?: string; nodes: FlowNode[] }) {
  return (
    <div className="rounded-2xl border border-ink-900/10 bg-slate-50/60 p-4 sm:p-5">
      {title && <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-500">{title}</p>}
      <ol className="flex flex-col items-center gap-0">
        {nodes.map((n, i) => {
          const kind = n.kind ?? "action";
          return (
            <li key={i} className="flex w-full flex-col items-center">
              <div
                className={`w-full max-w-md rounded-xl border px-4 py-2.5 text-center text-sm ${flowStyles[kind]}`}
              >
                {kind === "decision" && <span className="mr-1" aria-hidden>❓</span>}
                {n.text}
              </div>
              {i < nodes.length - 1 && (
                <div className="flex flex-col items-center py-1 text-ink-400" aria-hidden>
                  {n.branch && (
                    <span className="rounded-full bg-white px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-ink-500 shadow-sm">
                      {n.branch}
                    </span>
                  )}
                  <span className="text-lg leading-none">↓</span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * "Updated for 2026" trust box (freshness + reviewer credentials)
 * ------------------------------------------------------------------ */
export function TrustBox({ updated }: { updated: string }) {
  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-card">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-white">
          Updated {updated}
        </span>
        <span className="text-xs font-semibold text-emerald-700">Reviewed against official IRS / Treasury guidance</span>
      </div>
      <p className="mt-2.5 text-sm leading-relaxed text-ink-700">
        This guide reflects the latest publicly available IRS and Treasury guidance on Trump Accounts as of {updated}.
        Because regulations and implementation guidance may still evolve, we update this page whenever a significant
        federal change occurs.
      </p>
      <div className="mt-3 flex items-center gap-3 border-t border-emerald-200/70 pt-3">
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white" aria-hidden>
          DM
        </span>
        <div className="text-sm text-ink-600">
          <p>
            Last reviewed by{" "}
            <Link href="/about-deepak" className="font-semibold text-brand-600 underline underline-offset-2 hover:text-brand-700">
              {author.name}
            </Link>
          </p>
          <p className="text-xs text-ink-400">
            {author.credentials} · Cross-border financial planning for immigrant families
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Quick answers — Q + 40–60 word answer + jump anchor (snippet-friendly)
 * ------------------------------------------------------------------ */
export interface QuickQA {
  q: string;
  a: string;
  href: string;
}
export function QuickAnswers({ items }: { items: QuickQA[] }) {
  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
      <p className="text-xs font-bold uppercase tracking-wide text-brand-600">Quick answers</p>
      <dl className="mt-3 divide-y divide-ink-900/5">
        {items.map((it) => (
          <div key={it.q} className="py-3 first:pt-0 last:pb-0">
            <dt className="text-sm font-bold text-ink-900">{it.q}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-ink-600">
              {it.a}{" "}
              <a href={it.href} className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                Read more →
              </a>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Horizontal life-stage timeline (responsive: row on sm+, stack on mobile)
 * ------------------------------------------------------------------ */
export interface TimelineStop {
  icon: string;
  label: string;
  sub?: string;
}
export function HorizontalTimeline({ stops }: { stops: TimelineStop[] }) {
  return (
    <div className="overflow-x-auto">
      <ol className="flex min-w-max items-stretch gap-2 sm:min-w-0 sm:gap-0">
        {stops.map((s, i) => (
          <li key={s.label} className="flex items-center">
            <div className="flex w-32 flex-col items-center text-center sm:w-auto sm:flex-1 sm:px-1">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-brand-200 bg-brand-50 text-xl" aria-hidden>
                {s.icon}
              </span>
              <p className="mt-1.5 text-xs font-bold text-ink-900">{s.label}</p>
              {s.sub && <p className="mt-0.5 text-[0.6875rem] leading-tight text-ink-500">{s.sub}</p>}
            </div>
            {i < stops.length - 1 && (
              <span className="mx-1 flex-none self-start pt-5 text-lg text-brand-300 sm:mx-0" aria-hidden>
                →
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Color-coded content callouts (Planning Tip / Expert Insight / etc.)
 * ------------------------------------------------------------------ */
export type CalloutKind = "tip" | "insight" | "note" | "mistake" | "crossborder" | "reminder" | "example";
const calloutStyles: Record<CalloutKind, { label: string; icon: string; box: string; label2: string }> = {
  tip: { label: "Planning tip", icon: "💡", box: "border-blue-200 bg-blue-50/60", label2: "text-blue-700" },
  insight: { label: "Expert insight", icon: "🧭", box: "border-violet-200 bg-violet-50/50", label2: "text-violet-700" },
  note: { label: "Important note", icon: "📌", box: "border-brand-200 bg-brand-50/50", label2: "text-brand-700" },
  mistake: { label: "Common mistake", icon: "⚠️", box: "border-amber-200 bg-amber-50", label2: "text-amber-700" },
  crossborder: { label: "Cross-border consideration", icon: "🌐", box: "border-teal-200 bg-teal-50/60", label2: "text-teal-700" },
  reminder: { label: "Tax reminder", icon: "🧾", box: "border-rose-200 bg-rose-50/50", label2: "text-rose-700" },
  example: { label: "Educational example", icon: "🧮", box: "border-sky-200 bg-sky-50/60", label2: "text-sky-700" },
};
export function Callout({ kind, title, children }: { kind: CalloutKind; title?: string; children: React.ReactNode }) {
  const s = calloutStyles[kind];
  return (
    <div className={`rounded-2xl border p-5 text-sm leading-relaxed text-ink-700 ${s.box}`}>
      <p className={`text-xs font-bold uppercase tracking-wide ${s.label2}`}>
        <span className="mr-1" aria-hidden>{s.icon}</span>
        {title ?? s.label}
      </p>
      <div className="mt-2 space-y-2">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Rich author bio (E-E-A-T) — shared across cluster pages
 * ------------------------------------------------------------------ */
export function AuthorBio() {
  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-brand-100 bg-brand-50/40 p-5 shadow-card">
      <p className="text-xs font-bold uppercase tracking-wide text-brand-600">About the author</p>
      <div className="mt-2 flex items-start gap-3">
        <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white" aria-hidden>
          DM
        </span>
        <div>
          <p className="text-base font-bold text-ink-900">
            {author.name} <span className="text-sm font-medium text-ink-400">· {author.credentials}</span>
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
            {author.reviewerBio} His focus is cross-border tax and money decisions for Indian and immigrant families in
            the U.S. — visa status, SSN vs ITIN, retirement accounts, and moving back to India — which is exactly where
            Trump Account planning gets complicated. He reviews this guide against official IRS and Treasury sources and
            keeps every tax figure framed as an illustration, not a promise.
          </p>
          <p className="mt-2 text-xs italic text-ink-400">
            Educational content only — not personalized tax, legal, or investment advice. Verify current guidance and
            consult a qualified professional for your situation.
          </p>
          <Link
            href="/about-deepak"
            className="mt-2 inline-block text-sm font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
          >
            Read more about {author.name} →
          </Link>
        </div>
      </div>
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

/**
 * Small "► Key" marker used to flag the single most decision-relevant row in a
 * table (scannability convention — see keyRows / keyFeatures props below).
 */
function KeyMarker() {
  return (
    <span className="mb-1 mr-2 inline-flex items-center gap-0.5 rounded-full bg-amber-400/90 px-1.5 py-px align-middle text-[0.5625rem] font-bold uppercase tracking-wide text-ink-900">
      ► Key
    </span>
  );
}

/**
 * Generic key/value table: columns describe the header, rows are objects.
 * `keyRows` highlights the single most decision-relevant rows by their FIRST
 * column value (subtle amber tint + left border + "► Key" marker).
 */
export function DataTable({
  columns,
  rows,
  caption,
  keyRows = [],
}: {
  columns: DataCol[];
  rows: DataRow[];
  caption?: string;
  keyRows?: string[];
}) {
  const firstKey = columns[0]?.key;
  const isKey = (r: DataRow) => firstKey != null && keyRows.includes(r[firstKey]);
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
            {rows.map((r, ri) => {
              const key = isKey(r);
              return (
                <tr
                  key={ri}
                  className={`block border-b border-ink-900/10 p-2 last:border-0 sm:table-row sm:p-0 sm:align-top ${
                    key ? "bg-amber-50/70 sm:bg-amber-50/50" : "bg-white"
                  }`}
                >
                  {columns.map((c, ci) => (
                    <td
                      key={c.key}
                      data-label={c.label}
                      className={`${TD_BASE} ${ci === 0 ? "font-semibold text-ink-900" : ""} ${
                        c.highlight ? "sm:bg-brand-50/40 sm:font-medium sm:text-ink-800" : ""
                      } ${key && ci === 0 ? "border-l-4 border-l-amber-400 sm:border-l-4" : ""}`}
                    >
                      {key && ci === 0 && <KeyMarker />}
                      {r[c.key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Feature-by-column comparison (Trump Account vs 529 vs Roth vs brokerage).
 * `keyFeatures` flags the single most decision-relevant row(s) by feature name.
 */
export function ComparisonTable({
  columns,
  rows,
  caption,
  keyFeatures = [],
}: {
  columns: ComparisonColumn[];
  rows: ComparisonRow[];
  caption?: string;
  keyFeatures?: string[];
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
            {rows.map((r) => {
              const key = keyFeatures.includes(r.feature);
              return (
                <tr
                  key={r.feature}
                  className={`block border-b border-ink-900/10 p-2 last:border-0 sm:table-row sm:p-0 sm:align-top ${
                    key ? "bg-amber-50/70 sm:bg-amber-50/50" : "bg-white"
                  }`}
                >
                  <td
                    data-label="Feature"
                    className={`${TD_BASE} bg-ink-50/40 font-bold text-ink-900 sm:bg-transparent sm:font-semibold ${
                      key ? "border-l-4 border-l-amber-400 sm:border-l-4" : ""
                    }`}
                  >
                    {key && <KeyMarker />}
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
