import Link from "next/link";
import type { ReactNode } from "react";
import Container from "@/components/Container";
import Newsletter from "@/components/Newsletter";
import RelatedHubs, { type HubKey } from "@/components/RelatedHubs";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  absoluteUrl,
  type FaqItem,
} from "@/lib/seo";
import { site } from "@/lib/site";

/* ------------------------------------------------------------------ *
 * Shared chrome + UI primitives for the H1B Lottery Results cluster.
 * Keeps the hub and the six supporting pages visually consistent and
 * avoids re-implementing schema / breadcrumb / disclaimer per page.
 * ------------------------------------------------------------------ */

export const FY_LABEL = "FY 2027";
export const LOTTERY_UPDATED = "2026-07-07";

export const lotteryUpdatedLabel = new Date(LOTTERY_UPDATED).toLocaleDateString("en-US", {
  month: "long",
  year: "numeric",
  day: "numeric",
});

export type Crumb = { name: string; url: string };

export function UpdatedBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
      <span aria-hidden>🟢</span> Updated for {FY_LABEL} cap season
    </span>
  );
}

export function SectionHeading({
  id,
  kicker,
  children,
}: {
  id?: string;
  kicker?: string;
  children: ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-24">
      {kicker ? (
        <p className="mb-1 text-xs font-bold uppercase tracking-wide text-orange-600">{kicker}</p>
      ) : null}
      <h2 className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">{children}</h2>
    </div>
  );
}

const CALLOUT_STYLES: Record<string, string> = {
  info: "border-sky-200 bg-sky-50/70 text-sky-900",
  good: "border-emerald-200 bg-emerald-50/70 text-emerald-900",
  warn: "border-amber-200 bg-amber-50/70 text-amber-900",
  bad: "border-rose-200 bg-rose-50/70 text-rose-900",
  tip: "border-orange-200 bg-orange-50/70 text-orange-900",
};

export function Callout({
  tone = "info",
  title,
  children,
}: {
  tone?: keyof typeof CALLOUT_STYLES;
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className={`rounded-xl border p-4 sm:p-5 ${CALLOUT_STYLES[tone]}`}>
      {title ? <p className="mb-1.5 text-sm font-bold">{title}</p> : null}
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}

export function QuickAnswer({ question, children }: { question: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-5 sm:p-6">
      <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-orange-600">
        Quick answer
      </p>
      <p className="text-base font-bold text-ink-900">{question}</p>
      <div className="mt-2 text-sm leading-relaxed text-ink-700">{children}</div>
    </div>
  );
}

export function ChecklistCard({
  title,
  items,
  tone = "orange",
}: {
  title: string;
  items: string[];
  tone?: "orange" | "emerald" | "sky";
}) {
  const ring =
    tone === "emerald"
      ? "border-emerald-300 text-emerald-600"
      : tone === "sky"
        ? "border-sky-300 text-sky-600"
        : "border-orange-300 text-orange-600";
  return (
    <div className="rounded-2xl border border-ink-900/10 bg-white p-5">
      <p className="mb-3 text-sm font-bold text-ink-900">{title}</p>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <span
              className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border text-[10px] font-bold ${ring}`}
            >
              ✓
            </span>
            <span className="text-sm text-ink-700">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CompareTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: (string | ReactNode)[][];
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-ink-900/10">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <thead>
          <tr className="bg-ink-50">
            {columns.map((c) => (
              <th key={c} className="px-4 py-3 font-bold text-ink-800">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-ink-900/5 align-top">
              {row.map((cell, j) => (
                <td key={j} className={`px-4 py-3 text-ink-700 ${j === 0 ? "font-semibold text-ink-900" : ""}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function FaqList({ faqs }: { faqs: FaqItem[] }) {
  return (
    <dl className="space-y-4">
      {faqs.map((item) => (
        <div key={item.question} className="rounded-2xl border border-ink-900/5 bg-white px-5 py-4">
          <dt className="font-semibold text-ink-900">{item.question}</dt>
          <dd className="mt-2 text-sm leading-relaxed text-ink-600">{item.answer}</dd>
        </div>
      ))}
    </dl>
  );
}

export const LOTTERY_DISCLAIMER =
  "This page is educational and is not legal, immigration, tax, or financial advice. H-1B and immigration rules change often and depend on your specific facts. Always confirm details with USCIS, your employer, or a qualified immigration attorney before acting.";

/**
 * Full page shell: renders Article + FAQ + Breadcrumb schema, breadcrumb nav,
 * top disclaimer, hero, FAQ block, related links, closing disclaimer, hubs,
 * and newsletter. Pass the unique body via `children`.
 */
export function H1bLotteryShell({
  path,
  badge,
  h1,
  intro,
  quickAnswer,
  crumbs,
  crumbLabel,
  faqs,
  articleHeadline,
  articleDescription,
  relatedLinks,
  hubs = ["immigration", "uscis", "wealth", "tax"],
  readingTime,
  children,
}: {
  path: string;
  badge: string;
  h1: string;
  intro: ReactNode;
  quickAnswer?: { question: string; answer: ReactNode };
  crumbs: Crumb[];
  crumbLabel: string;
  faqs: FaqItem[];
  articleHeadline: string;
  articleDescription: string;
  relatedLinks: { href: string; label: string; desc: string }[];
  hubs?: HubKey[];
  readingTime?: string;
  children: ReactNode;
}) {
  const url = absoluteUrl(path);
  const jsonLd = jsonLdGraph(
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: articleHeadline,
      description: articleDescription,
      url,
      datePublished: LOTTERY_UPDATED,
      dateModified: LOTTERY_UPDATED,
      author: { "@id": `${site.url}/#organization` },
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "en-US",
      about: { "@type": "Thing", name: "H-1B Lottery Results" },
    },
    faqJsonLd(faqs),
    breadcrumbJsonLd(crumbs)
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* breadcrumb */}
      <nav aria-label="breadcrumb" className="border-b border-ink-900/5 bg-ink-50/60">
        <Container className="py-2.5">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-ink-500">
            {crumbs.map((c, i) => (
              <li key={c.url} className="flex items-center gap-1.5">
                {i > 0 ? <span aria-hidden>/</span> : null}
                {i < crumbs.length - 1 ? (
                  <Link href={c.url} className="hover:text-ink-800">
                    {c.name}
                  </Link>
                ) : (
                  <span className="font-medium text-ink-800">{c.name}</span>
                )}
              </li>
            ))}
          </ol>
        </Container>
      </nav>

      {/* top disclaimer */}
      <div className="border-b border-amber-200 bg-amber-50">
        <Container className="py-2.5">
          <p className="text-center text-xs text-amber-900">
            <strong className="font-semibold">Educational only.</strong> Not legal, immigration, tax, or
            financial advice. Verify with{" "}
            <a
              href="https://www.uscis.gov/working-in-the-united-states/temporary-workers/h-1b-specialty-occupations"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              USCIS
            </a>{" "}
            and a licensed immigration attorney.
          </p>
        </Container>
      </div>

      {/* hero */}
      <section className="bg-white pb-8 pt-10 sm:pb-10 sm:pt-14">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 px-3 py-1">
                <span className="text-sm">🎯</span>
                <span className="text-xs font-bold text-white">{badge}</span>
              </span>
              <UpdatedBadge />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">{h1}</h1>
            <div className="mt-3 text-lg leading-relaxed text-ink-600">{intro}</div>
            <p className="mt-2 text-xs text-ink-400">
              Updated {lotteryUpdatedLabel}
              {readingTime ? ` · ${readingTime}` : ""} · Reviewed each cap season
            </p>
            {quickAnswer ? (
              <div className="mt-6">
                <QuickAnswer question={quickAnswer.question}>{quickAnswer.answer}</QuickAnswer>
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      {children}

      {/* FAQ */}
      <section className="bg-ink-50/40 py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 id="faq" className="mb-6 scroll-mt-24 text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">
              Frequently asked questions
            </h2>
            <FaqList faqs={faqs} />
          </div>
        </Container>
      </section>

      {/* related links */}
      <section className="bg-white py-10 sm:py-12">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-4 text-base font-bold text-ink-900">Related guides and tools</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {relatedLinks.map((g) => (
                <Link
                  key={g.href}
                  href={g.href}
                  className="group rounded-xl border border-ink-900/10 bg-white p-4 transition hover:border-brand-400 hover:shadow-sm"
                >
                  <p className="text-sm font-semibold text-ink-900 group-hover:text-brand-700">{g.label}</p>
                  <p className="mt-0.5 text-xs text-ink-500">{g.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* closing disclaimer */}
      <section className="border-t border-ink-900/5 bg-white py-8">
        <Container>
          <div className="mx-auto max-w-2xl text-center text-xs leading-relaxed text-ink-500">
            <p>
              <strong className="font-semibold text-ink-700">
                This page is educational only and is not legal, immigration, tax, or financial advice.
              </strong>{" "}
              H-1B lottery rules, USCIS policies, and processing timelines change frequently and depend on your
              specific facts. Always confirm details with official{" "}
              <a
                href="https://www.uscis.gov/working-in-the-united-states/temporary-workers/h-1b-specialty-occupations/h-1b-electronic-registration-process"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline"
              >
                USCIS
              </a>{" "}
              guidance, your employer or its immigration attorney, and qualified professionals before acting.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-14">
        <Container>
          <RelatedHubs hubs={hubs} />
        </Container>
      </section>

      <Newsletter />
    </>
  );
}
