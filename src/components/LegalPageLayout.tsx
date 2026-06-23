import type { ReactNode } from "react";
import Link from "next/link";
import Container from "./Container";

/*
 * Shared chrome for the four policy pages (Terms & Conditions, Privacy Policy,
 * Disclaimer, Cookie Policy). Keeps typography, spacing, breadcrumb, table of
 * contents, and the attorney-review footer note identical across all of them.
 *
 * NOTE FOR THE SITE OWNER: the policy copy rendered through this layout is a
 * strong, professional first draft prepared for review — it is NOT legal
 * advice and does not by itself guarantee compliance with any law. Have a
 * qualified attorney licensed in Illinois (and any other relevant
 * jurisdiction) review every policy before relying on it. See
 * docs/legal-policy-review-todos.md for the open items.
 */

export interface LegalSection {
  /** Stable anchor id used by the table of contents (e.g. "limitation-of-liability"). */
  id: string;
  /** Section heading text. */
  heading: string;
  /** Section body — paragraphs, lists, callouts. */
  body: ReactNode;
}

interface LegalPageLayoutProps {
  title: string;
  /** Human-readable "Last updated" date. Optional for pages that don't show one. */
  lastUpdated?: string;
  /** Lead paragraph(s) shown above the table of contents. */
  intro: ReactNode;
  sections: LegalSection[];
}

export default function LegalPageLayout({
  title,
  lastUpdated,
  intro,
  sections,
}: LegalPageLayoutProps) {
  return (
    <>
      <section className="border-b border-ink-900/5 bg-white py-14 sm:py-20">
        <Container>
          <div className="mx-auto max-w-prose">
            <nav
              aria-label="Breadcrumb"
              className="mb-5 flex items-center gap-2 text-sm text-ink-400"
            >
              <Link href="/" className="hover:text-brand-600">
                Home
              </Link>
              <span aria-hidden>/</span>
              <span className="text-ink-700">{title}</span>
            </nav>
            <h1 className="text-4xl font-extrabold tracking-tight text-ink-900">
              {title}
            </h1>
            {lastUpdated && (
              <p className="mt-4 text-ink-400">Last updated: {lastUpdated}</p>
            )}
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <div className="mx-auto max-w-prose space-y-10 leading-8 text-ink-700">
            <div className="space-y-5">{intro}</div>

            {/* Table of contents */}
            <nav
              aria-label="On this page"
              className="rounded-2xl border border-ink-900/5 bg-slate-50 p-5"
            >
              <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-500">
                On this page
              </h2>
              <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[0.95rem] leading-7 marker:text-ink-400">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="text-brand-600 hover:underline">
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            {/* Sections */}
            <div className="space-y-8">
              {sections.map((s, i) => (
                <section key={s.id} id={s.id} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                    <span className="text-ink-300">{i + 1}.</span> {s.heading}
                  </h2>
                  <div className="mt-3 space-y-3">{s.body}</div>
                </section>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ *
 * Small presentational helpers shared by the policy pages.
 * ------------------------------------------------------------------ */

/** Neutral highlighted callout (e.g. an "in plain English" summary). */
export function LegalCallout({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-5 leading-7 text-ink-700">
      {children}
    </div>
  );
}

/** Amber warning callout for the "do not submit sensitive info" notices. */
export function LegalWarning({
  title = "Important",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-amber-900">
      <strong className="font-semibold">{title}:</strong> {children}
    </div>
  );
}

/** Bulleted list with consistent spacing. */
export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
