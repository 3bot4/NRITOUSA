import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFaq from "@/components/tools/ToolFaq";
import DisclaimerBox from "@/components/tools/DisclaimerBox";
import PrivacyNotice from "@/components/nri-tax/PrivacyNotice";
import LandingActions from "@/components/nri-tax/LandingActions";
import { SOURCES, TOOL_DISCLAIMER } from "@/lib/nri-tax/types";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";

const PATH = "/nri-wealth-checkup";

export const metadata: Metadata = pageMetadata({
  title: "NRI Wealth Checkup: FBAR, FATCA, India Assets & U.S. Tax Organizer",
  description:
    "Free educational tool for Indians in the USA to organize U.S. income, India assets, FBAR, FATCA, NRE/NRO, property, PFIC, foreign tax credit, and return-to-India planning questions.",
  path: PATH,
});

const faq: FaqItem[] = [
  {
    question: "Is this a tax filing service?",
    answer:
      "No. The NRI Global Wealth & Tax Organizer is an educational organizer only. It does not prepare tax returns, file forms, or determine your filing obligations. It helps you map your cross-border money and generates a list of topics and questions to review with a qualified U.S. CPA, Enrolled Agent, or Indian CA.",
  },
  {
    question: "Do I need to enter account numbers?",
    answer:
      "No — and you shouldn't. Never enter account numbers, SSN, PAN, Aadhaar, passport numbers, or exact property addresses. Use nicknames (like 'HDFC NRO' or 'Mumbai apartment') and approximate annual values only. Your entries are saved only in your browser on your device.",
  },
  {
    question: "Does NRE interest count for U.S. tax?",
    answer:
      "NRE interest is generally tax-free in India for NRIs, but that does not automatically make it tax-free in the United States. India's treatment and the U.S. treatment are separate questions. The tool flags this so you can confirm the U.S. taxability of your NRE interest with your CPA.",
  },
  {
    question: "Do NRE/NRO accounts count for FBAR?",
    answer:
      "Generally yes — NRE and NRO accounts are financial accounts at institutions outside the U.S., so they typically count toward the FBAR (FinCEN Form 114) $10,000 aggregate screening line, which is based on the maximum balance during the year, not the income earned. The tool screens your entered accounts and tells you when an FBAR review may be required.",
  },
  {
    question: "Does India real estate count for Form 8938?",
    answer:
      "Directly-held foreign real estate is generally not reported directly on Form 8938. However, rental income, a sale, or holding property through a foreign entity can still create U.S. tax and reporting. The tool excludes directly-held property from the financial-asset count but keeps it in your planning and tax notes.",
  },
  {
    question: "Do Indian mutual funds create PFIC issues?",
    answer:
      "Foreign mutual funds and ETFs are commonly Passive Foreign Investment Companies (PFICs), which can require Form 8621 review. PFIC classification is complex, so the tool raises a 'possible PFIC / Form 8621 review' flag rather than making a final determination — review it with a qualified U.S. tax professional.",
  },
  {
    question: "Can I download a report for my CPA?",
    answer:
      "Yes. The report page generates an educational summary — your profile, asset map, income, reporting checklist, forms that may need review, questions to ask your CPA/CA, and documents to collect — that you can download as a PDF and share with your advisors.",
  },
  {
    question: "Is this free?",
    answer:
      "Yes, it's completely free and requires no account. Like every tool on NRItoUSA, it runs entirely in your browser.",
  },
];

const STEPS = [
  { n: 1, t: "Add your profile", d: "U.S. status, filing status, where you live for tax, and India tax status." },
  { n: 2, t: "Add India accounts & investments", d: "NRE/NRO/FCNR, FDs, brokerage, mutual funds — nicknames and approximate values only." },
  { n: 3, t: "Add property & U.S. assets", d: "India property, plus your U.S. accounts for the full wealth map." },
  { n: 4, t: "Add income & TDS", d: "U.S. and India income, and any India tax/TDS paid." },
  { n: 5, t: "Get your educational report", d: "FBAR, FATCA, PFIC, foreign tax credit, India ITR, property, and planning checklist — plus CPA/CA questions." },
];

const COVERS: { label: string; href: string }[] = [
  { label: "FBAR (FinCEN Form 114)", href: SOURCES.fbar },
  { label: "FATCA / Form 8938", href: SOURCES.form8938About },
  { label: "PFIC / Form 8621", href: SOURCES.form8621 },
  { label: "Foreign tax credit / Form 1116", href: SOURCES.form1116 },
  { label: "Form 3520 (gifts & inheritance)", href: SOURCES.form3520 },
];

export default function NriWealthCheckupLanding() {
  const jsonLd = jsonLdGraph(
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "NRI Wealth Checkup", url: PATH },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-900/5 bg-gradient-to-br from-brand-700 to-indigo-800">
        <div className="absolute inset-0 bg-ink-900/30" />
        <Container className="relative py-14 sm:py-20">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-sm text-white/80"
          >
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span aria-hidden>/</span>
            <span className="text-white">NRI Wealth Checkup</span>
          </nav>
          <div className="mt-5 flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-4xl backdrop-blur">
              📊
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
              NRI Global Wealth &amp; Tax Organizer
            </h1>
          </div>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/90">
            Add your U.S. and India assets once. Update annual values each year. Get an educational
            tax, FBAR, FATCA, PFIC, foreign tax credit, and India-income checklist.
          </p>
          <p className="mt-3 max-w-2xl text-sm text-white/75">
            Built for Indian families in the USA managing money across two countries. Use this as an
            organizer before speaking with your CPA, CA, attorney, or advisor.
          </p>
          <LandingActions />
        </Container>
      </section>

      <Container className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl space-y-6">
          <PrivacyNotice />
          <DisclaimerBox title="Educational only">{TOOL_DISCLAIMER}</DisclaimerBox>
        </div>

        {/* What it screens */}
        <div className="mx-auto mt-12 max-w-4xl">
          <h2 className="text-2xl font-bold tracking-tight text-ink-900">What it screens</h2>
          <p className="mt-2 text-ink-500">
            Educational screening with links to official IRS sources — never a final determination.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {COVERS.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-ink-900/10 bg-white px-3.5 py-1.5 text-sm font-semibold text-ink-700 shadow-card hover:border-brand-300 hover:text-brand-700"
              >
                {c.label} ↗
              </a>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="mx-auto mt-12 max-w-4xl">
          <h2 className="text-2xl font-bold tracking-tight text-ink-900">How it works</h2>
          <ol className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n} className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {s.n}
                </span>
                <h3 className="mt-3 text-base font-bold text-ink-900">{s.t}</h3>
                <p className="mt-1 text-sm text-ink-500">{s.d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-6">
            <Link
              href="/nri-wealth-checkup/profile"
              className="inline-block rounded-xl bg-brand-600 px-6 py-3.5 text-base font-bold text-white shadow-sm hover:bg-brand-700"
            >
              Start Free Checkup →
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-14">
          <ToolFaq items={faq} />
        </div>
      </Container>
    </>
  );
}
