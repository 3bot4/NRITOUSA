import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Newsletter from "@/components/Newsletter";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";
import { site } from "@/lib/site";

const PAGE_PATH = "/tools/visa-green-card";
const UPDATED = "2026-06-16";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "Visa & Green Card Tools for Indians in USA | H1B, EB2, I-485, USCIS",
    description:
      "Free visa and green card tools for Indians in the USA. Check EB1/EB2/EB3 priority dates, H1B lottery odds, H4 EAD eligibility, USCIS case status, and processing times.",
    path: PAGE_PATH,
  });
}

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Tools", url: "/tools" },
  { name: "Visa & Green Card Tools", url: PAGE_PATH },
];

const toolSections = [
  {
    id: "green-card",
    heading: "Green Card Tools",
    icon: "🟢",
    intro:
      "Track your place in the EB-2 and EB-3 India queue, check your priority date against the current visa bulletin, and find your current stage in the green card process.",
    tools: [
      {
        href: "/tools/green-card-tracker",
        label: "Green Card Wait Time Tracker",
        desc: "See how many applicants are ahead of you using USCIS I-485 inventory and visa bulletin Final Action Dates for EB-2 and EB-3 India.",
        badge: "Live USCIS data",
      },
      {
        href: "/tools/priority-date-checker",
        label: "Priority Date Checker",
        desc: "Compare your EB-1, EB-2, or EB-3 India priority date against the current visa bulletin Final Action Date and Dates for Filing.",
        badge: "Monthly bulletin data",
      },
      {
        href: "/tools/green-card-stage-finder",
        label: "Green Card Stage Finder",
        desc: "Answer a few questions about PERM, I-140, and I-485 to find your exact stage and what to do next.",
        badge: null,
      },
    ],
    guides: [
      { href: "/green-card", label: "Green Card Process for Indians" },
      { href: "/visa-bulletin", label: "Visa Bulletin Explained" },
      { href: "/visa-bulletin/priority-date", label: "Priority Date Explained" },
    ],
  },
  {
    id: "h1b",
    heading: "H-1B Tools",
    icon: "💼",
    intro:
      "Track cap-season timelines, assess transfer risks, explore H-1B salary data from official DOL filings, and understand every step from registration to your start date.",
    tools: [
      {
        href: "/tools/h1b-lottery-timeline",
        label: "H-1B Lottery Timeline & Odds",
        desc: "Personalized cap-season timeline with registration dates, selection window, filing period, lottery odds, and a live countdown to your next milestone.",
        badge: "Live countdown",
      },
      {
        href: "/tools/h1b-transfer-risk-checklist",
        label: "H-1B Transfer Risk Checklist",
        desc: "Changing jobs or laid off? Assess your layoff grace period, AC21 portability, receipt timing, and travel risk before you make any moves.",
        badge: null,
      },
      {
        href: "/tools/h1b-salaries",
        label: "H-1B Salary Explorer",
        desc: "Explore real H-1B base salaries by job title, city, and experience level — built from official DOL LCA filings.",
        badge: "DOL data",
      },
    ],
    guides: [
      { href: "/h1b", label: "H-1B Guide for Indians" },
      { href: "/uscis", label: "USCIS Guide for Indians" },
    ],
  },
  {
    id: "h4-ead",
    heading: "H-4 EAD & Family",
    icon: "💍",
    intro:
      "H-4 spouses can get EAD work authorization once the H-1B holder has an approved I-140. This tool helps navigate eligibility, renewal gaps, and work options.",
    tools: [
      {
        href: "/tools/h4-ead-navigator",
        label: "H-4 EAD Navigator",
        desc: "Pathfinder for H-4 EAD work and business options — eligibility check, myth-vs-reality, EAD renewal gap calculator, and start-earning checklists.",
        badge: null,
      },
    ],
    guides: [
      { href: "/uscis", label: "USCIS Guide" },
    ],
  },
  {
    id: "uscis",
    heading: "USCIS Case Status & Processing",
    icon: "🛂",
    intro:
      "Decode every USCIS status message, find out whether your case is delayed, and understand the service center prefix on your receipt number — no personal info needed.",
    tools: [
      {
        href: "/tools/uscis-case-status-meaning",
        label: "USCIS Case Status Meaning Tool",
        desc: "Select your form type and current status — get plain-English meaning, what happens next, and when to contact your attorney.",
        badge: null,
      },
      {
        href: "/tools/uscis-processing-delay-checker",
        label: "USCIS Processing Delay Checker",
        desc: "Is your H-1B, I-140, I-485, or EAD case delayed? Select your form and receipt date for an educational delay assessment.",
        badge: null,
      },
      {
        href: "/tools/uscis-receipt-number-decoder",
        label: "Receipt Number Prefix Decoder",
        desc: "What does IOE, LIN, SRC, EAC, WAC, or MSC mean on your receipt number? Instant decoder — no full receipt number required.",
        badge: null,
      },
      {
        href: "/tools/processing-times",
        label: "USCIS & Visa Processing Times",
        desc: "H-1B extension, I-140, I-485, EAD, OCI card, Indian passport renewal, and visa stamping times in one table — from official sources.",
        badge: "Official source data",
      },
    ],
    guides: [
      { href: "/uscis", label: "USCIS Guide for Indians" },
      { href: "/uscis/case-status", label: "USCIS Case Status Explained" },
      { href: "/uscis/processing-times", label: "USCIS Processing Times Guide" },
    ],
  },
  {
    id: "citizenship",
    heading: "Citizenship",
    icon: "🦅",
    intro:
      "If you have a green card, naturalization may be available after 5 years (or 3 years if married to a US citizen). This tool walks you through every N-400 readiness step.",
    tools: [
      {
        href: "/tools/citizenship-checklist",
        label: "US Citizenship (N-400) Readiness Checklist",
        desc: "Compute your earliest filing date, find which civics test applies to you (2025 vs 2008 version), and track every step from eligibility to the oath ceremony.",
        badge: null,
      },
    ],
    guides: [],
  },
  {
    id: "visa-bulletin",
    heading: "Visa Bulletin",
    icon: "📅",
    intro:
      "The monthly visa bulletin controls when Indian H-1B workers can file or receive approval of their green card. Understanding it is critical for EB-2 and EB-3 India applicants.",
    tools: [
      {
        href: "/tools/priority-date-checker",
        label: "Priority Date Checker",
        desc: "Compare your priority date to the current visa bulletin Final Action Date and Dates for Filing for your EB category and country.",
        badge: "Monthly data",
      },
    ],
    guides: [
      { href: "/visa-bulletin", label: "Visa Bulletin Explained for Indians" },
      { href: "/visa-bulletin/final-action-date-vs-date-of-filing", label: "Final Action Date vs Dates for Filing" },
      { href: "/visa-bulletin/eb2-india", label: "EB-2 India Explained" },
      { href: "/visa-bulletin/eb3-india", label: "EB-3 India Explained" },
      { href: "/visa-bulletin/retrogression", label: "Retrogression Explained" },
    ],
  },
  {
    id: "travel-documents",
    heading: "Travel & Documents",
    icon: "✈️",
    intro:
      "Check visa-free travel access for your Indian passport (enhanced by a valid US visa), estimate USA–India flight prices, and track OCI and Indian passport renewal timelines.",
    tools: [
      {
        href: "/tools/visa-free-countries",
        label: "Visa-Free Countries for Indians",
        desc: "Filterable list of visa-free, visa-on-arrival, and e-Visa destinations — including countries that get easier with a valid US visa.",
        badge: null,
      },
      {
        href: "/tools/flight-price-guide",
        label: "USA ↔ India Flight Price Guide",
        desc: "Estimate whether USA–India fares for your route and month are low, moderate, or high — with booking-window tips and a money-saving checklist.",
        badge: null,
      },
      {
        href: "/tools/processing-times",
        label: "OCI & Passport Processing Times",
        desc: "OCI card and Indian passport renewal timelines from VFS Global, alongside USCIS and visa stamping times.",
        badge: null,
      },
    ],
    guides: [],
  },
];

const faqs: FaqItem[] = [
  {
    question: "What is a priority date and how do I check it against the visa bulletin?",
    answer:
      "Your priority date is set when your PERM labor certification is filed with the Department of Labor (for EB-2 and EB-3), or when your I-140 is filed (for EB-1 and EB-2 NIW). It sets your place in the visa queue. The Priority Date Checker at /tools/priority-date-checker compares your priority date against the current month's Final Action Date and Dates for Filing from the US Department of State visa bulletin.",
  },
  {
    question: "How long is the EB-2 India green card wait time in 2026?",
    answer:
      "The EB-2 India Final Action Date is currently in the early 2010s — meaning only applicants who filed PERM in 2012–2013 are eligible for green card approval today. New EB-2 India applicants filing in 2024–2026 face multi-decade waits under current demand. The Green Card Wait Time Tracker at /tools/green-card-tracker uses USCIS I-485 inventory data to show how many people are ahead of you.",
  },
  {
    question: "What does IOE, LIN, SRC, EAC, WAC, or MSC mean on my USCIS receipt number?",
    answer:
      "These are USCIS service center and filing location codes: LIN = Nebraska, SRC = Texas, EAC = Vermont, WAC = California, IOE = USCIS ELIS electronic system, MSC = National Benefits Center. The Receipt Number Prefix Decoder at /tools/uscis-receipt-number-decoder explains each prefix in detail.",
  },
  {
    question: "What is the difference between Final Action Dates and Dates for Filing?",
    answer:
      "The Final Action Date (Table A) controls when USCIS can approve your green card — your priority date must be on or before this cutoff. Dates for Filing (Table B) is an earlier cutoff that, when USCIS authorizes it monthly, lets you file your I-485 for EAD and Advance Parole before your Final Action Date is current. Only use Table B when USCIS explicitly announces authorization at uscis.gov/visabulletininfo each month.",
  },
  {
    question: "Can I file I-485 before my priority date is current under Final Action Dates?",
    answer:
      "Yes — but only if USCIS has authorized the Dates for Filing chart for that month AND your priority date qualifies under Table B. USCIS announces this authorization monthly. Filing under Table B gives you EAD and Advance Parole, but your green card will not be approved until your Final Action Date is also current.",
  },
  {
    question: "What are the H-1B lottery odds for Indians in 2026?",
    answer:
      "The H-1B lottery is not specific to country of birth — all applicants worldwide compete from the same pool. 85,000 visas are available annually (65,000 general + 20,000 for US master's degree holders). Registration pools have ranged from roughly 350,000 to over 750,000 in recent years, putting single-registration odds at approximately 15%–35%. The H-1B Lottery Timeline tool at /tools/h1b-lottery-timeline tracks your dates and odds.",
  },
  {
    question: "How long does an H-1B extension take in 2026?",
    answer:
      "A regular H-1B extension or transfer (Form I-129) typically takes 2–4 months at USCIS. Premium processing may be available and guarantees USCIS action within 15 business days — action means approval, denial, or RFE, not necessarily final approval. Fees can change; verify the current amount on the official USCIS Form I-907 page. See full current timelines at /tools/processing-times.",
  },
  {
    question: "What can an H-4 EAD spouse do for work?",
    answer:
      "An H-4 EAD holder can work in any occupation for any employer, run their own business, freelance, and take on consulting work. H-4 EAD is available only when the H-1B spouse has an approved I-140 petition (or is in an H-1B extension beyond 6 years based on an approved I-140). The H-4 EAD Navigator at /tools/h4-ead-navigator helps understand eligibility, work options, and renewal gap risks.",
  },
  {
    question: "Are these USCIS processing time estimates accurate?",
    answer:
      "Processing time estimates are typical published ranges sourced from USCIS, the State Department, and VFS Global. Individual cases routinely run faster or slower depending on service center workload, Requests for Evidence, security checks, and USCIS staffing. Use them for planning — not as guarantees. Always check your specific receipt on the official USCIS case tracker for the most current status.",
  },
  {
    question: "Is NRItoUSA affiliated with USCIS, DHS, or the Department of State?",
    answer:
      "No. NRItoUSA is not affiliated with USCIS, the Department of Homeland Security, the Department of State, or any US government agency. All tools on this site are educational only and do not constitute legal or immigration advice. Always verify information on the official USCIS website (uscis.gov), State Department (travel.state.gov), and consult a licensed immigration attorney for advice specific to your situation.",
  },
];

export default function VisaGreenCardToolsPage() {
  const url = absoluteUrl(PAGE_PATH);

  const collectionPageSchema = {
    "@type": "CollectionPage",
    "@id": `${url}#page`,
    name: "Visa & Green Card Tools for Indians in the USA",
    description:
      "Free visa and green card tools for Indians in the USA. Check EB1/EB2/EB3 priority dates, H1B lottery odds, H4 EAD eligibility, USCIS case status, and processing times.",
    url,
    dateModified: UPDATED,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    publisher: { "@id": `${site.url}/#organization` },
    hasPart: toolSections
      .flatMap((s) => s.tools)
      .map((t) => ({
        "@type": "WebApplication",
        name: t.label,
        url: absoluteUrl(t.href),
        applicationCategory: "UtilityApplication",
        isAccessibleForFree: true,
      })),
  };

  const jsonLd = jsonLdGraph(
    collectionPageSchema,
    faqJsonLd(faqs),
    breadcrumbJsonLd(crumbs)
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="border-b border-ink-900/5 bg-white py-14 sm:py-18">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-xs text-ink-400">
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

          <div className="flex flex-wrap items-center gap-2 text-xs text-ink-400 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-700 to-indigo-600 px-3 py-1 text-xs font-semibold text-white">
              🛂 Visa &amp; Green Card
            </span>
            <span>Updated June 2026</span>
          </div>

          <h1 className="text-[2rem] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[2.5rem]">
            Visa &amp; Green Card Tools for Indians in the USA
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-500">
            Free, data-backed tools for every stage of the US immigration journey — from H-1B lottery odds and priority date tracking to USCIS case status, processing times, and citizenship readiness. All tools run in your browser with no personal information collected.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/tools/green-card-tracker"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800">
              🟢 Green Card Tracker
            </Link>
            <Link href="/tools/priority-date-checker"
              className="inline-flex items-center gap-2 rounded-lg border border-ink-900/10 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 shadow-sm transition hover:border-blue-400 hover:text-blue-700">
              📅 Priority Date Checker
            </Link>
            <Link href="/tools/uscis-case-status-meaning"
              className="inline-flex items-center gap-2 rounded-lg border border-ink-900/10 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 shadow-sm transition hover:border-blue-400 hover:text-blue-700">
              🛂 USCIS Status Decoder
            </Link>
          </div>
        </Container>
      </section>

      {/* ── Disclaimer ───────────────────────────────────────────── */}
      <div className="border-b border-amber-200 bg-amber-50">
        <Container>
          <div className="py-3 text-xs leading-relaxed text-amber-900">
            <strong className="font-semibold">Educational tools only — not legal advice.</strong>{" "}
            NRItoUSA is not affiliated with USCIS, DHS, or the Department of State. Always verify
            with{" "}
            <a href="https://www.uscis.gov" target="_blank" rel="noopener noreferrer nofollow" className="font-medium underline">uscis.gov</a>
            {" "}and consult a licensed immigration attorney.
          </div>
        </Container>
      </div>

      {/* ── Tool Sections ─────────────────────────────────────────── */}
      <div className="py-12 sm:py-16">
        <Container>
          <div className="space-y-14">
            {toolSections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{section.icon}</span>
                  <h2 className="text-xl font-bold tracking-tight text-ink-900">{section.heading}</h2>
                </div>
                <p className="mb-5 text-sm leading-relaxed text-ink-500 max-w-2xl">{section.intro}</p>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {section.tools.map((tool) => (
                    <Link key={tool.href} href={tool.href}
                      className="group relative flex flex-col gap-2 rounded-2xl border border-ink-900/10 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-ink-900 group-hover:text-blue-700 text-sm leading-snug">
                          {tool.label}
                        </h3>
                        {tool.badge && (
                          <span className="flex-none rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs leading-relaxed text-ink-500">{tool.desc}</p>
                      <span className="mt-auto text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                        Open tool →
                      </span>
                    </Link>
                  ))}
                </div>

                {section.guides.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    <span className="text-xs text-ink-400 self-center">Related guides:</span>
                    {section.guides.map((g) => (
                      <Link key={g.href} href={g.href}
                        className="text-xs font-medium text-brand-600 hover:text-brand-700 hover:underline">
                        {g.label} →
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        </Container>
      </div>

      {/* ── Quick links bar ───────────────────────────────────────── */}
      <section className="border-y border-ink-900/5 bg-ink-50/60 py-8">
        <Container>
          <p className="text-xs font-bold uppercase tracking-wider text-ink-500 mb-4">All immigration guides</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            {[
              { href: "/uscis", label: "USCIS Guide" },
              { href: "/h1b", label: "H-1B Guide" },
              { href: "/green-card", label: "Green Card Process" },
              { href: "/visa-bulletin", label: "Visa Bulletin Guide" },
              { href: "/uscis/case-status", label: "Case Status Explained" },
              { href: "/uscis/processing-times", label: "Processing Times Guide" },
              { href: "/visa-bulletin/eb2-india", label: "EB-2 India" },
              { href: "/visa-bulletin/eb3-india", label: "EB-3 India" },
              { href: "/visa-bulletin/retrogression", label: "Retrogression" },
              { href: "/visa-bulletin/priority-date-current-what-next", label: "Priority Date Current — What Next?" },
              { href: "/uscis/case-status", label: "USCIS Notices Decoded" },
              { href: "/tools", label: "All Tools" },
            ].map((l) => (
              <Link key={l.href} href={l.href}
                className="text-brand-600 hover:text-brand-700 font-medium">
                {l.label} →
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="mx-auto max-w-[720px]">
            <h2 className="text-xl font-bold text-ink-900 mb-6">Frequently asked questions</h2>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div key={faq.question} className="rounded-2xl border border-ink-900/5 bg-white p-5">
                  <h3 className="font-semibold text-ink-900">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{faq.answer}</p>
                </div>
              ))}
            </div>

            {/* Disclaimer footer */}
            <div className="mt-10 rounded-2xl border border-ink-900/5 bg-ink-50/50 p-5 text-xs leading-relaxed text-ink-500">
              <strong className="font-semibold text-ink-700">Disclaimer: </strong>
              All tools on this page are for general educational purposes only and are not legal or immigration advice.
              NRItoUSA is not affiliated with USCIS, the Department of Homeland Security, or the Department of State.
              Data in these tools (visa bulletin dates, processing times, I-485 inventory) is updated periodically from
              official government sources but may not reflect the very latest figures. Always verify on{" "}
              <a href="https://www.uscis.gov" target="_blank" rel="noopener noreferrer nofollow" className="text-brand-600 underline">uscis.gov</a>
              {" "}and{" "}
              <a href="https://travel.state.gov" target="_blank" rel="noopener noreferrer nofollow" className="text-brand-600 underline">travel.state.gov</a>
              {" "}and consult a licensed immigration attorney for advice specific to your situation.
            </div>
          </div>
        </Container>
      </section>

      <Newsletter />
    </>
  );
}
