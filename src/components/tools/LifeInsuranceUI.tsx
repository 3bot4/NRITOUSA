/**
 * Presentational building blocks for the Life Insurance (Indian-family)
 * cluster. Pure server components (no hooks, no "use client") — safe to
 * import in server page.tsx files.
 *
 * The generic blocks (QuickAnswer, JumpNav, tables, boxes) are re-exported
 * from TrumpAccountUI so both clusters render identically; only the
 * cluster-specific pieces live here.
 */
import Link from "next/link";
import { author } from "@/lib/author";
import {
  LIFE_EEAT_TITLE,
  LIFE_EEAT_CREDENTIAL,
  LIFE_SOURCES_REVIEWED,
  lifeEeatByPath,
  lifeWhichPagePointers,
  LIFE_PRO_BOX_TITLE,
  LIFE_PRO_BOX_TEXT,
  LIFE_TRUST_NO_SELL_NOTE,
  LIFE_TOP_DISCLAIMER,
} from "@/data/lifeInsuranceData";
import { lifeInsuranceClusterLinks } from "@/lib/lifeInsuranceCluster";

export {
  QuickAnswer,
  JumpNav,
  ProseSections,
  ChecklistBox,
  WarnBox,
  ExampleBox,
  NextStep,
  ComparisonTable,
  DataTable,
} from "@/components/tools/TrumpAccountUI";

/* ------------------------------------------------------------------ *
 * "Which page should you read?" pointer block
 * ------------------------------------------------------------------ */
export function WhichLifePageBlock({ currentHref }: { currentHref: string }) {
  const pointers = lifeWhichPagePointers.filter((p) => p.href !== currentHref);
  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-ink-900/10 bg-slate-50/70 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Which page should you read?</p>
      <ul className="mt-2 grid gap-1.5 sm:grid-cols-1">
        {pointers.map((p) => (
          <li key={p.href}>
            <Link href={p.href} className="text-sm font-medium text-brand-700 underline underline-offset-2 hover:text-brand-800">
              {p.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * E-E-A-T box — the "why this guide is different" paragraph is unique per
 * page (keyed by currentHref); falls back to the pillar copy.
 * ------------------------------------------------------------------ */
export function LifeEEATBox({ lastUpdated, currentHref }: { lastUpdated: string; currentHref: string }) {
  const eeatText = lifeEeatByPath[currentHref] ?? lifeEeatByPath["/life-insurance-for-indian-families-usa"];
  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-brand-100 bg-brand-50/40 p-5 shadow-card">
      <h2 className="text-base font-bold text-ink-900">{LIFE_EEAT_TITLE}</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-700">{eeatText}</p>
      <div className="mt-3 border-t border-ink-900/10 pt-3 text-sm text-ink-600">
        <p>
          Written / reviewed by{" "}
          <Link href="/about-deepak" className="font-semibold text-brand-600 underline underline-offset-2 hover:text-brand-700">
            Deepak Middha
          </Link>
          <span className="text-ink-400"> · {author.credentials}</span>
        </p>
        <p className="mt-1 text-xs text-ink-500">{LIFE_EEAT_CREDENTIAL}</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-400">
          <span>Last updated: {lastUpdated}</span>
          <span>Sources reviewed: {LIFE_SOURCES_REVIEWED}</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Cluster navigation block (ordered, current highlighted)
 * ------------------------------------------------------------------ */
const CLUSTER_NAV_LABELS: Record<string, string> = {
  "/life-insurance-for-indian-families-usa": "Main guide: life insurance basics",
  "/term-life-insurance-for-indian-families-usa": "Term life: how much coverage?",
  "/indexed-universal-life-iul-for-indian-families-usa": "IUL: benefits, risks, taxes",
  "/term-vs-iul-for-indian-families-usa": "Term vs IUL comparison",
  "/term-life-insurance-needs-calculator-indian-families": "Needs calculator (coverage gap)",
};

export function LifeClusterNav({ currentHref }: { currentHref: string }) {
  return (
    <nav aria-label="Life insurance cluster" className="mx-auto max-w-3xl">
      <h2 className="mb-3 text-base font-bold text-ink-900">The complete life insurance guide for Indian families</h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {lifeInsuranceClusterLinks.map((l) => {
          const isCurrent = l.href === currentHref;
          const label = CLUSTER_NAV_LABELS[l.href] ?? l.label;
          return (
            <li key={l.href}>
              {isCurrent ? (
                <span
                  aria-current="page"
                  className="flex items-center gap-2 rounded-xl border border-brand-300 bg-brand-50 px-4 py-2.5 text-sm font-bold text-brand-800"
                >
                  <span aria-hidden>▸</span> {label}{" "}
                  <span className="ml-auto text-[0.625rem] font-semibold uppercase text-brand-500">You are here</span>
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
 * "Estimate Your Term Life Insurance Need" CTA — links to the
 * educational needs calculator (internal link only).
 *
 * variant="soft" is used on the IUL page, where the message is to size the
 * basic protection gap FIRST, before reviewing cash-value products.
 * ------------------------------------------------------------------ */
const CALC_HREF = "/term-life-insurance-needs-calculator-indian-families";

export function CalculatorCTA({ variant = "default" }: { variant?: "default" | "soft" }) {
  if (variant === "soft") {
    return (
      <div className="mx-auto max-w-3xl rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 text-center shadow-card sm:p-8">
        <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-emerald-600">Protection first</span>
        <h2 className="mt-1 text-lg font-bold tracking-tight text-ink-900 sm:text-xl">
          Estimate Your Term Life Insurance Need
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-ink-600">
          Before reviewing IUL, estimate your basic protection gap first. Many families need to separate low-cost
          protection needs from long-term cash-value planning.
        </p>
        <div className="mt-4">
          <Link
            href={CALC_HREF}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
          >
            Estimate coverage need →
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 text-center shadow-card sm:p-8">
      <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-emerald-600">Free calculator</span>
      <h2 className="mt-1 text-lg font-bold tracking-tight text-ink-900 sm:text-xl">
        Estimate Your Term Life Insurance Need
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-ink-600">
        Use the Term Life Insurance Needs Calculator for Indian Families to estimate income replacement, mortgage,
        children&rsquo;s education, U.S. debts, and India/home-country obligations before speaking with a licensed
        insurance professional.
      </p>
      <div className="mt-4">
        <Link
          href={CALC_HREF}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
        >
          Estimate coverage need →
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * "For insurance professionals" trust box (P5) + no-sell trust note (P7).
 * ------------------------------------------------------------------ */
export function InsuranceProfessionalsBox() {
  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-ink-500">{LIFE_PRO_BOX_TITLE}</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-600">{LIFE_PRO_BOX_TEXT}</p>
    </div>
  );
}

export function TrustNoSellNote() {
  return <p className="mx-auto max-w-3xl text-center text-xs leading-relaxed text-ink-400">{LIFE_TRUST_NO_SELL_NOTE}</p>;
}

/** One short, prominent disclaimer shown near the top of every cluster page. */
export function LifeTopDisclaimer() {
  return (
    <p className="mx-auto max-w-3xl rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-xs leading-relaxed text-amber-900">
      {LIFE_TOP_DISCLAIMER}
    </p>
  );
}

/* ------------------------------------------------------------------ *
 * "Speak With a Licensed Insurance Professional" CTA (every page).
 * The button links to an ON-PAGE checklist anchor — never an external
 * or affiliate link.
 * ------------------------------------------------------------------ */
export function AgentCTA({ checklistHref }: { checklistHref: string }) {
  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-6 text-center shadow-card sm:p-8">
      <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-brand-500">Next step</span>
      <h2 className="mt-1 text-lg font-bold tracking-tight text-ink-900 sm:text-xl">
        Speak With a Licensed Insurance Professional
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-ink-600">
        Life insurance needs depend on state, age, health, income, family goals, immigration status, and long-term
        plans. Use this guide as education, then review options with a licensed insurance professional.
      </p>
      <div className="mt-4">
        <a
          href={checklistHref}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
        >
          Find the right insurance discussion checklist →
        </a>
      </div>
    </div>
  );
}
