import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ReturnToIndiaLeadMagnetCard from "@/components/ReturnToIndiaLeadMagnetCard";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
} from "@/lib/seo";
import { site } from "@/lib/site";

const PATH = "/return-to-india-checklist";

export const metadata: Metadata = pageMetadata({
  title: "Free 2026 Return-to-India Checklist PDF for NRIs | NRItoUSA",
  description:
    "Download the free 2026 Return-to-India Playbook: a personal, financial, tax, 401(k), RNOR, property, repatriation, immigration, and first-90-days checklist for NRIs moving back to India.",
  path: PATH,
});

const FAQS = [
  {
    question: "What is the Return-to-India Playbook?",
    answer:
      "It's a free 2026-edition PDF checklist for NRIs planning to move back to India. Across 20 chapters and 60+ decision points it walks through the personal, financial, tax, banking, 401(k), RNOR, property, repatriation, immigration, and first-90-days steps — with 25+ linked calculators to run your own numbers.",
  },
  {
    question: "Who should download this checklist?",
    answer:
      "H-1B, L-1, green card, and U.S.-citizen families who are planning a move back to India — whether that's this year or several years out. It's built for people who want a single sequenced plan instead of piecing the move together from scattered forum threads.",
  },
  {
    question: "Does the checklist cover 401(k), IRA, and HSA?",
    answer:
      "Yes. It covers what happens to your 401(k), IRA (Roth and traditional), HSA, brokerage, and U.S. bank accounts when you leave the U.S., along with the trade-offs of cashing out, rolling over, or leaving accounts in place.",
  },
  {
    question: "Does it explain RNOR and Indian tax residency?",
    answer:
      "Yes. It explains Resident but Not Ordinarily Resident (RNOR) status, how long it typically lasts, and why timing your move around it can protect your U.S. income and gains from Indian tax for a window after you return.",
  },
  {
    question: "Does it cover FBAR, FATCA, and U.S. tax filing after moving?",
    answer:
      "Yes. It includes an FBAR/FATCA and DTAA checklist, NRE/NRO account handling, India property sale and remittance/TCS considerations, and the U.S. filing obligations that continue after you move.",
  },
  {
    question: "Is this tax or legal advice?",
    answer:
      "No. It is educational information only and should be verified with official sources and qualified professionals.",
  },
];

const INTERNAL_LINKS = [
  { label: "Return to India hub", href: "/return-to-india" },
  { label: "401(k) return-to-India calculator", href: "/calculators/401k-return-to-india" },
  { label: "RNOR tax residency calculator", href: "/calculators/rnor-tax-residency" },
  { label: "FBAR / FATCA risk checker", href: "/tools/fbar-fatca-checker" },
  { label: "Remittance & TCS cost calculator", href: "/calculators/remittance-tcs-cost" },
  { label: "India property sale & capital gains", href: "/india-property" },
  { label: "NRI Wealth Checkup", href: "/nri-wealth-checkup" },
];

const WHATS_INSIDE = [
  {
    title: "12-month countdown timeline",
    body: "What to do 12 months, 6 months, 3 months, and 30 days before you fly — sequenced so nothing gets missed.",
  },
  {
    title: "U.S. accounts playbook",
    body: "401(k), IRA, HSA, brokerage, and U.S. bank accounts: keep, roll over, or close — and the tax cost of each.",
  },
  {
    title: "Cross-border tax checklist",
    body: "RNOR, FBAR/FATCA, DTAA, U.S. filing after you move, and how to avoid double taxation.",
  },
  {
    title: "India banking & money movement",
    body: "NRE/NRO accounts, India property sale, repatriation limits, and remittance/TCS on transfers.",
  },
  {
    title: "Immigration & status",
    body: "OCI, re-entry, and what your visa or green-card status means once you're living in India.",
  },
  {
    title: "First 90 days in India",
    body: "A setup list for banking, documents, tax registration, and settling in once you land.",
  },
];

const WHO_ITS_FOR = [
  "H-1B and L-1 workers weighing a move back",
  "Green-card holders planning to relinquish or keep status",
  "U.S. citizens of Indian origin relocating to India",
  "Anyone with a 401(k)/IRA and U.S. accounts to unwind",
];

export default function ReturnToIndiaChecklistPage() {
  const url = absoluteUrl(PATH);
  const jsonLd = jsonLdGraph(
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: "Free 2026 Return-to-India Checklist PDF",
      description: metadata.description as string,
      isPartOf: { "@id": `${site.url}/#website` },
      about: "Return to India planning checklist for NRIs",
    },
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Return-to-India Checklist", url: PATH },
    ]),
    faqJsonLd(FAQS.map((f) => ({ question: f.question, answer: f.answer })))
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-900/5 bg-gradient-to-br from-ink-900 via-ink-900 to-brand-900">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-600/30 blur-3xl" />
        <Container className="relative py-14 sm:py-20">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-sm text-white/70"
          >
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span aria-hidden>/</span>
            <span className="text-white">Return-to-India Checklist</span>
          </nav>

          <div className="mt-8 grid items-start gap-10 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-200">
                Free PDF · 2026 Edition
              </span>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
                Free 2026 Return-to-India Checklist PDF
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">
                The complete personal, financial, tax, 401(k), RNOR, property,
                repatriation, immigration, and first-90-days checklist for NRIs
                moving back to India — in one downloadable playbook.
              </p>
              <p className="mt-4 text-sm font-semibold text-white/90">
                Written by Deepak Middha, CA, Series 65 — 2026 Edition
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-white/80">
                <span className="rounded-full bg-white/10 px-3 py-1">
                  20 chapters
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1">
                  60+ decision points
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1">
                  25+ linked calculators
                </span>
              </div>
            </div>

            {/* Email capture */}
            <ReturnToIndiaLeadMagnetCard />
          </div>
        </Container>
      </section>

      {/* What's inside */}
      <section className="bg-white py-14 sm:py-20">
        <Container>
          <h2 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
            What&apos;s inside the playbook
          </h2>
          <p className="mt-2 max-w-2xl text-ink-600">
            Twenty chapters and 60+ decision points, organized as a sequenced
            plan you can work through from a year out to your first weeks in
            India.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WHATS_INSIDE.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl border border-ink-900/5 bg-slate-50/60 p-5"
              >
                <h3 className="text-base font-bold text-ink-900">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Who it's for + author */}
      <section className="bg-slate-50/60 py-14 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
                Who it&apos;s for
              </h2>
              <ul className="mt-6 space-y-3">
                {WHO_ITS_FOR.map((w) => (
                  <li key={w} className="flex gap-3 text-ink-700">
                    <span
                      aria-hidden
                      className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700"
                    >
                      ✓
                    </span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card">
              <h2 className="text-lg font-bold text-ink-900">
                About the author
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                The playbook is written by{" "}
                <strong className="font-semibold text-ink-800">
                  Deepak Middha, CA, Series 65
                </strong>{" "}
                — a chartered accountant and Series 65 investment adviser
                representative who works with NRIs on the cross-border money,
                tax, and retirement decisions that come with moving between the
                U.S. and India.
              </p>
              <p className="mt-3 text-xs leading-relaxed text-ink-400">
                Educational information only. Not tax, legal, immigration, or
                investment advice.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Related tools & hubs */}
      <section className="bg-white py-14 sm:py-20">
        <Container>
          <h2 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
            Keep planning your move
          </h2>
          <p className="mt-2 max-w-2xl text-ink-600">
            Free calculators and guides that pair with the checklist.
          </p>
          <div className="mt-8 grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {INTERNAL_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group flex items-center justify-between gap-3 rounded-xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <span className="text-sm font-bold tracking-tight text-ink-900 group-hover:text-brand-700">
                  {l.label}
                </span>
                <span
                  aria-hidden
                  className="text-brand-600 transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50/60 py-14 sm:py-20">
        <Container className="max-w-3xl">
          <h2 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
            Frequently asked questions
          </h2>
          <div className="mt-8 space-y-4">
            {FAQS.map((f) => (
              <details
                key={f.question}
                className="group rounded-2xl border border-ink-900/5 bg-white p-5"
              >
                <summary className="cursor-pointer list-none text-base font-bold text-ink-900 marker:content-none">
                  {f.question}
                </summary>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-600">
                  {f.answer}
                </p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="bg-white pb-16 pt-4 sm:pb-20">
        <Container>
          <ReturnToIndiaLeadMagnetCard />
          <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-relaxed text-ink-400">
            {site.name} is owned by {site.owner}. Cross-border rules differ
            between the USA and India, vary by individual situation, and change
            over time. This checklist is educational information only — verify
            with official sources and qualified professionals before acting.
          </p>
        </Container>
      </section>
    </>
  );
}
