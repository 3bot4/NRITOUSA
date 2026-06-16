import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import { pageMetadata, breadcrumbJsonLd, jsonLdGraph, absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

const PAGE_PATH = "/community/nri-uscis-decisions";

export const metadata: Metadata = pageMetadata({
  title: "NRI USCIS Life Decisions: Community Insights",
  description:
    "Anonymous aggregated data on what life decisions Indian immigrants in the US are navigating — job changes, house buying, travel, H-4 EAD, kids aging out. Contributed by the NRItoUSA community.",
  path: PAGE_PATH,
});

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Community", url: "/community/nri-uscis-decisions" },
  { name: "NRI USCIS Decisions", url: PAGE_PATH },
];

/* Placeholder data — will be replaced with live aggregated data once backend is wired */
const PLACEHOLDER_DECISIONS = [
  { label: "Changing job", pct: 32, color: "bg-blue-500" },
  { label: "Filing I-485", pct: 22, color: "bg-indigo-500" },
  { label: "Traveling to India", pct: 18, color: "bg-amber-500" },
  { label: "Buying a house", pct: 12, color: "bg-green-500" },
  { label: "H-4 EAD renewal gap", pct: 8, color: "bg-rose-500" },
  { label: "Kids aging out", pct: 5, color: "bg-violet-500" },
  { label: "Starting a business", pct: 3, color: "bg-teal-500" },
];

const PLACEHOLDER_CONCERNS = [
  { label: "Priority date / wait time", pct: 38, color: "bg-indigo-500" },
  { label: "Job security / layoff risk", pct: 26, color: "bg-amber-500" },
  { label: "Family income (H-4 EAD)", pct: 15, color: "bg-rose-500" },
  { label: "Travel restrictions", pct: 11, color: "bg-blue-500" },
  { label: "Children aging out", pct: 7, color: "bg-violet-500" },
  { label: "Housing stability", pct: 3, color: "bg-green-500" },
];

const PLACEHOLDER_BY_STATUS = [
  { status: "H-1B", topDecision: "Changing job", topConcern: "Priority date", count: "~62%" },
  { status: "H-4 EAD", topDecision: "EAD renewal gap", topConcern: "Family income", count: "~18%" },
  { status: "I-485 pending", topDecision: "Travel to India", topConcern: "Processing delay", count: "~14%" },
  { status: "F-1 / OPT", topDecision: "H-1B filing", topConcern: "Lottery selection", count: "~6%" },
];

export default function NriDecisionsCommunityPage() {
  const url = absoluteUrl(PAGE_PATH);
  const jsonLd = jsonLdGraph(
    {
      "@type": "WebPage",
      "@id": url,
      name: "NRI USCIS Life Decisions: Community Insights",
      description:
        "Anonymous aggregated data on what life decisions Indian immigrants in the US are navigating.",
      url,
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "en-US",
      isAccessibleForFree: true,
    },
    breadcrumbJsonLd(crumbs)
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main>
        {/* Header */}
        <header className="border-b border-ink-900/5 bg-white pt-8 pb-7">
          <Container>
            <div className="mx-auto max-w-[720px]">
              <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-xs text-ink-400">
                {crumbs.map((c, i) => (
                  <span key={c.url} className="flex items-center gap-2">
                    {i > 0 && <span aria-hidden>/</span>}
                    {i < crumbs.length - 1 ? (
                      <Link href={c.url} className="hover:text-brand-600">{c.name}</Link>
                    ) : (
                      <span className="text-ink-500">{c.name}</span>
                    )}
                  </span>
                ))}
              </nav>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 mb-3">
                🔜 Coming soon — collecting community data now
              </div>
              <h1 className="text-[1.75rem] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[2rem]">
                NRI USCIS Life Decisions: Community Insights
              </h1>
              <p className="mt-2.5 text-base italic leading-[1.6] text-ink-500">
                Anonymous, aggregated data from Indian immigrants navigating USCIS delays alongside real life — jobs, houses, travel, family. No personal information collected or displayed.
              </p>
            </div>
          </Container>
        </header>

        <div className="py-8 sm:py-10">
          <Container>
            <div className="mx-auto max-w-[720px] space-y-10">

              {/* Data notice */}
              <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5 text-sm">
                <p className="font-semibold text-blue-900">This page shows preview/placeholder data</p>
                <p className="mt-1.5 text-blue-800/80 leading-relaxed">
                  We are actively collecting anonymous responses through the{" "}
                  <Link href="/tools/uscis-life-decision-checklist" className="font-semibold underline">
                    USCIS Life Decision Checklist
                  </Link>
                  . Once we have enough responses to display meaningful aggregated patterns, this page will update with real community data. All data is anonymous — no names, no personal immigration identifiers.
                </p>
                <p className="mt-2 text-xs text-blue-700">
                  Want to contribute? Use the checklist and optionally share your anonymous response.
                </p>
                <Link
                  href="/tools/uscis-life-decision-checklist"
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Add my anonymous response →
                </Link>
              </section>

              {/* Placeholder: Top decisions */}
              <section>
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-xl font-extrabold text-ink-900">Most common decisions</h2>
                  <span className="text-xs rounded-full bg-ink-100 px-2.5 py-1 text-ink-500 font-semibold">Preview data</span>
                </div>
                <p className="text-sm text-ink-500 mb-4">What life decisions are NRIs navigating right now?</p>
                <div className="space-y-3">
                  {PLACEHOLDER_DECISIONS.map((d) => (
                    <div key={d.label} className="flex items-center gap-3">
                      <div className="w-36 flex-none text-sm font-medium text-ink-700">{d.label}</div>
                      <div className="flex-1 h-2 rounded-full bg-ink-100">
                        <div className={`h-2 rounded-full ${d.color}`} style={{ width: `${d.pct}%` }} />
                      </div>
                      <div className="w-10 text-right text-xs font-bold text-ink-500">{d.pct}%</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Placeholder: Top concerns */}
              <section>
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-xl font-extrabold text-ink-900">Biggest concerns</h2>
                  <span className="text-xs rounded-full bg-ink-100 px-2.5 py-1 text-ink-500 font-semibold">Preview data</span>
                </div>
                <p className="text-sm text-ink-500 mb-4">What worries Indians navigating USCIS delays most?</p>
                <div className="space-y-3">
                  {PLACEHOLDER_CONCERNS.map((c) => (
                    <div key={c.label} className="flex items-center gap-3">
                      <div className="w-48 flex-none text-sm font-medium text-ink-700">{c.label}</div>
                      <div className="flex-1 h-2 rounded-full bg-ink-100">
                        <div className={`h-2 rounded-full ${c.color}`} style={{ width: `${c.pct}%` }} />
                      </div>
                      <div className="w-10 text-right text-xs font-bold text-ink-500">{c.pct}%</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Placeholder: By visa status */}
              <section>
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-xl font-extrabold text-ink-900">Top concerns by visa status</h2>
                  <span className="text-xs rounded-full bg-ink-100 px-2.5 py-1 text-ink-500 font-semibold">Preview data</span>
                </div>
                <p className="text-sm text-ink-500 mb-4">Different statuses, different priorities.</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {PLACEHOLDER_BY_STATUS.map((s) => (
                    <div key={s.status} className="rounded-2xl border border-ink-900/5 bg-white p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-ink-900">{s.status}</span>
                        <span className="text-xs text-ink-400">{s.count} of respondents</span>
                      </div>
                      <p className="text-xs text-ink-600">Top decision: <span className="font-semibold text-ink-800">{s.topDecision}</span></p>
                      <p className="text-xs text-ink-600 mt-1">Top concern: <span className="font-semibold text-ink-800">{s.topConcern}</span></p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Privacy note */}
              <section className="rounded-2xl border border-ink-900/5 bg-white p-5 text-sm text-ink-500">
                <p className="font-semibold text-ink-700 mb-2">Privacy commitment</p>
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2"><span className="text-green-600 font-bold">✓</span> Only anonymous, voluntary responses collected</li>
                  <li className="flex items-start gap-2"><span className="text-green-600 font-bold">✓</span> No receipt numbers, A-numbers, passport, DOB, or employer name ever collected</li>
                  <li className="flex items-start gap-2"><span className="text-green-600 font-bold">✓</span> City/state is optional and displayed only in aggregate (no individual records shown)</li>
                  <li className="flex items-start gap-2"><span className="text-green-600 font-bold">✓</span> Email is optional and used only for update notifications, never sold or shared</li>
                  <li className="flex items-start gap-2"><span className="text-green-600 font-bold">✓</span> This page shows aggregated patterns only — never individual responses</li>
                </ul>
              </section>

              {/* CTA to tool */}
              <section className="rounded-2xl border border-green-100 bg-green-50/60 p-5">
                <p className="text-sm font-semibold text-green-900">Add your anonymous response</p>
                <p className="mt-1 text-sm text-green-800/80">
                  Use the USCIS Life Decision Checklist to get your personalized checklist, then optionally share your anonymous situation to help others.
                </p>
                <Link
                  href="/tools/uscis-life-decision-checklist"
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
                >
                  Use the Life Decision Checklist →
                </Link>
              </section>

              {/* Related links */}
              <section className="flex flex-wrap gap-2">
                {[
                  { href: "/uscis/life-planning", label: "USCIS Life Planning Guide" },
                  { href: "/uscis", label: "USCIS Guide" },
                  { href: "/h1b", label: "H-1B Guide" },
                  { href: "/green-card", label: "Green Card Guide" },
                ].map((l) => (
                  <Link key={l.href} href={l.href}
                    className="rounded-full border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 hover:border-green-400 hover:text-green-700">
                    {l.label}
                  </Link>
                ))}
              </section>

            </div>
          </Container>
        </div>
      </main>
    </>
  );
}
