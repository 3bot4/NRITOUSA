import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Newsletter from "@/components/Newsletter";
import VisaBulletinAlert from "@/components/VisaBulletinAlert";
import HubLinkGroups from "@/components/HubLinkGroups";
import {
  pageMetadata,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  absoluteUrl,
} from "@/lib/seo";
import { formatDate } from "@/lib/format";
import { site } from "@/lib/site";

const PAGE_PATH = "/immigration";
const UPDATED = "2026-06-24";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title:
      "Immigration Hub for Indians in the USA: H1B, Green Card, USCIS & Visa Bulletin",
    description:
      "The immigration hub for Indians in the USA. Start by situation, then use free tools for priority dates, green card stages, USCIS case status, H1B transfers, and more.",
    path: PAGE_PATH,
    type: "article",
    openGraph: { publishedTime: "2026-06-24", modifiedTime: UPDATED },
  });
}

/** "Start by situation" entry cards. */
const situationCards = [
  {
    title: "I am on H1B",
    desc: "H1B status, cap, lottery, transfers, extensions, and life on H1B while you wait.",
    href: "/h1b",
    icon: "💼",
  },
  {
    title: "I am waiting for a green card",
    desc: "EB-2 / EB-3, I-140, I-485, the Indian backlog, and where you are in the queue.",
    href: "/green-card",
    icon: "🟢",
  },
  {
    title: "I received a USCIS notice",
    desc: "Decode an RFE, NOID, NOA1/NOA2, or transfer notice and know what to do next.",
    href: "/tools/uscis-notice-decoder",
    icon: "📬",
  },
  {
    title: "I want to check my priority date",
    desc: "See whether your priority date is current and how the visa bulletin is moving.",
    href: "/tools/priority-date-checker",
    icon: "📅",
  },
  {
    title: "I am changing jobs",
    desc: "Weigh the risks of an H1B transfer with a pending or approved green card.",
    href: "/tools/h1b-transfer-risk-checklist",
    icon: "🔁",
  },
  {
    title: "I was laid off on H-1B",
    desc: "Organize your 60-day planning questions, documents, H-1B transfer options, I-140/priority date concerns, H-4 family impact, and money checklist.",
    href: "/h1b-layoff",
    icon: "⚡",
  },
  {
    title: "I need passport / travel help",
    desc: "Renew your Indian passport in the USA and plan travel while your case is pending.",
    href: "/indian-passport-renewal-usa",
    icon: "🛄",
  },
  {
    title: "I am planning I-485 / EAD / AP",
    desc: "Find your green card stage and understand EAD and Advance Parole timing.",
    href: "/tools/green-card-stage-finder",
    icon: "🟩",
  },
  {
    title: "My petition went to NVC",
    desc: "Check your NVC case status after USCIS approval — case number, fees, DS-260, documents, and interview wait.",
    href: "/nvc-case-status",
    icon: "🗂️",
  },
  {
    title: "I want to track my case",
    desc: "Follow case status, processing delays, and how many applicants are ahead of you.",
    href: "/immigration-tracker",
    icon: "📈",
  },
];

const faqs = [
  {
    question: "Where should I start with US immigration as an Indian?",
    answer:
      "Start with your current situation. If you're on H1B, begin with the H1B guide. If you're waiting on a green card, start with the green card process and your priority date. If you just received a USCIS letter, use the notice decoder. Each path above links to the right tool or guide.",
  },
  {
    question: "What is the difference between this hub and the USCIS hub?",
    answer:
      "This immigration hub organizes everything by your situation — H1B, green card, job change, travel — and points to the right tool. The USCIS hub at /uscis goes deeper on USCIS itself: case status messages, receipt numbers, forms, and processing times.",
  },
  {
    question: "Are these immigration tools free?",
    answer:
      "Yes. Every tool linked here is free and runs in your browser. We don't ask for personal case details — the tools work from the form type, status, or dates you choose. NRItoUSA is not USCIS and does not provide legal advice.",
  },
];

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Immigration Hub", url: PAGE_PATH },
];

const jsonLd = jsonLdGraph(
  {
    "@type": "Article",
    "@id": `${absoluteUrl(PAGE_PATH)}#article`,
    headline:
      "Immigration Hub for Indians in the USA: H1B, Green Card, USCIS & Visa Bulletin",
    description:
      "The immigration hub for Indians in the USA. Start by situation, then use free tools for priority dates, green card stages, USCIS case status, and H1B.",
    datePublished: "2026-06-24",
    dateModified: UPDATED,
    author: { "@type": "Organization", name: site.publisher },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(PAGE_PATH) },
    url: absoluteUrl(PAGE_PATH),
    inLanguage: "en-US",
    isAccessibleForFree: true,
  },
  breadcrumbJsonLd(crumbs),
  faqJsonLd(faqs),
);

export default function ImmigrationHubPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        {/* ── Header ──────────────────────────────────────────── */}
        <header className="border-b border-ink-900/5 bg-white pt-8 pb-7 sm:pt-10">
          <Container>
            <div className="mx-auto max-w-[720px]">
              <nav
                aria-label="Breadcrumb"
                className="mb-4 flex flex-wrap items-center gap-2 text-xs text-ink-400"
              >
                {crumbs.map((c, i) => (
                  <span key={c.url} className="flex items-center gap-2">
                    {i > 0 && <span aria-hidden>/</span>}
                    {i < crumbs.length - 1 ? (
                      <Link href={c.url} className="hover:text-brand-600">
                        {c.name}
                      </Link>
                    ) : (
                      <span className="text-ink-500">{c.name}</span>
                    )}
                  </span>
                ))}
              </nav>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-ink-400">
                <Link
                  href={PAGE_PATH}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 font-semibold text-white"
                >
                  <span>🛂</span>
                  Immigration
                </Link>
                <span>Updated {formatDate(UPDATED)}</span>
              </div>

              <h1 className="mt-3 text-[1.75rem] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[2rem]">
                Immigration Hub for Indians in the USA
              </h1>
              <p className="mt-2.5 text-base italic leading-[1.6] text-ink-500">
                H1B, green card, USCIS, visa bulletin, and priority dates — start
                with your situation, then jump straight to the free tool or guide
                that helps.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/tools/priority-date-checker"
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
                >
                  Check Priority Date
                </Link>
                <Link
                  href="/uscis"
                  className="inline-flex items-center gap-2 rounded-lg border border-ink-900/10 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 shadow-sm transition hover:border-brand-400 hover:text-brand-700"
                >
                  Go to USCIS Hub
                </Link>
                <Link
                  href="/visa-bulletin"
                  className="inline-flex items-center gap-2 rounded-lg border border-ink-900/10 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 shadow-sm transition hover:border-brand-400 hover:text-brand-700"
                >
                  Visa Bulletin
                </Link>
              </div>
            </div>
          </Container>
        </header>

        <div className="py-8 sm:py-10">
          <Container>
            <div className="mx-auto max-w-[720px] space-y-12">
              {/* ── Visa bulletin alert ───────────────────────────── */}
              <VisaBulletinAlert />

              {/* ── Disclaimer ────────────────────────────────────── */}
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-amber-900">
                <p className="font-semibold text-amber-800">
                  NRItoUSA is not USCIS and does not provide legal advice.
                </p>
                <p className="mt-1.5 text-amber-800/80">
                  This hub is educational only. We are not affiliated with USCIS,
                  DHS, or any US government agency, and nothing here is legal or
                  immigration advice. Always verify on the official{" "}
                  <a
                    href="https://www.uscis.gov"
                    className="font-medium underline"
                    rel="nofollow noopener"
                    target="_blank"
                  >
                    USCIS website
                  </a>{" "}
                  or with a licensed immigration attorney.
                </p>
              </div>

              {/* ── Start by situation ────────────────────────────── */}
              <section>
                <h2 className="mb-2 text-xl font-bold text-ink-900">
                  Start by situation
                </h2>
                <p className="mb-5 text-sm text-ink-500">
                  Pick where you are right now and jump straight to the right tool
                  or guide.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {situationCards.map((card) => (
                    <Link
                      key={card.href + card.title}
                      href={card.href}
                      className="group flex gap-4 rounded-2xl border border-ink-900/10 bg-white p-5 transition hover:border-brand-400 hover:shadow-sm"
                    >
                      <span className="mt-0.5 text-2xl leading-none">
                        {card.icon}
                      </span>
                      <div>
                        <h3 className="font-semibold text-ink-900 group-hover:text-brand-700">
                          {card.title}
                        </h3>
                        <p className="mt-1 text-sm leading-snug text-ink-500">
                          {card.desc}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* ── Main immigration tools ────────────────────────── */}
              <section>
                <h2 className="mb-2 text-xl font-bold text-ink-900">
                  Main immigration tools
                </h2>
                <p className="mb-5 text-sm text-ink-500">
                  Every tool is free, runs in your browser, and never asks for
                  your personal case details.
                </p>
                <HubLinkGroups
                  columns={3}
                  groups={[
                    {
                      title: "Track & decode",
                      links: [
                        {
                          label: "Immigration Tracker",
                          href: "/immigration-tracker",
                        },
                        {
                          label: "USCIS Case Status Meaning",
                          href: "/tools/uscis-case-status-meaning",
                        },
                        {
                          label: "USCIS Notice Decoder",
                          href: "/tools/uscis-notice-decoder",
                        },
                        {
                          label: "Receipt Number Decoder",
                          href: "/tools/uscis-receipt-number-decoder",
                        },
                        {
                          label: "Processing Delay Checker",
                          href: "/tools/uscis-processing-delay-checker",
                        },
                        {
                          label: "USCIS Form Finder",
                          href: "/tools/uscis-form-finder",
                        },
                      ],
                    },
                    {
                      title: "Green card",
                      links: [
                        {
                          label: "Priority Date Checker",
                          href: "/tools/priority-date-checker",
                        },
                        {
                          label: "Green Card Stage Finder",
                          href: "/tools/green-card-stage-finder",
                        },
                        {
                          label: "Green Card Wait Tracker",
                          href: "/tools/green-card-tracker",
                        },
                      ],
                    },
                    {
                      title: "H1B & employment",
                      links: [
                        {
                          label: "H1B Transfer Risk Checklist",
                          href: "/tools/h1b-transfer-risk-checklist",
                        },
                        {
                          label: "H1B Lottery Timeline & Odds",
                          href: "/tools/h1b-lottery-timeline",
                        },
                        {
                          label: "H1B Salaries Explorer",
                          href: "/tools/h1b-salaries",
                        },
                        {
                          label: "H-4 EAD Navigator",
                          href: "/tools/h4-ead-navigator",
                        },
                      ],
                    },
                  ]}
                />
              </section>

              {/* ── Related guides ────────────────────────────────── */}
              <section>
                <h2 className="mb-3 text-base font-semibold text-ink-900">
                  Related guides
                </h2>
                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  {[
                    {
                      label: "Visa Bulletin Explained",
                      href: "/visa-bulletin",
                    },
                    { label: "Green Card Process for Indians", href: "/green-card" },
                    { label: "NVC Case Status After USCIS Approval", href: "/nvc-case-status" },
                    { label: "H1B Guide for Indians", href: "/h1b" },
                    {
                      label: "Indian Passport Renewal in the USA",
                      href: "/indian-passport-renewal-usa",
                    },
                    {
                      label: "Moving to the USA Checklist",
                      href: "/articles/moving-to-usa-from-india-checklist",
                    },
                    { label: "USCIS Hub", href: "/uscis" },
                  ].map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="rounded-xl border border-ink-900/5 bg-white px-4 py-3 font-medium text-brand-600 transition hover:border-brand-300 hover:text-brand-700"
                    >
                      {l.label} →
                    </Link>
                  ))}
                </div>
              </section>

              {/* ── USCIS sub-hub callout ─────────────────────────── */}
              <section className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50/60 to-white p-6">
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-blue-600">
                  Go deeper
                </p>
                <h2 className="mb-1 text-lg font-bold text-ink-900">
                  USCIS Hub: case status, receipt numbers & forms
                </h2>
                <p className="mb-4 text-sm text-ink-600">
                  For everything about USCIS itself — what each case status means,
                  receipt number prefixes, the forms you&apos;ll file, and how to
                  read processing times — head to the dedicated USCIS sub-hub.
                </p>
                <Link
                  href="/uscis"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  Open the USCIS Hub →
                </Link>
              </section>

              {/* ── FAQ ──────────────────────────────────────────── */}
              <section>
                <h2 className="mb-6 text-xl font-bold text-ink-900">
                  Common questions
                </h2>
                <div className="space-y-6">
                  {faqs.map((faq) => (
                    <div key={faq.question}>
                      <h3 className="text-base font-semibold text-ink-900">
                        {faq.question}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </Container>
        </div>
      </article>

      <Newsletter />
    </>
  );
}
