import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Newsletter from "@/components/Newsletter";
import { pageMetadata, breadcrumbJsonLd, faqJsonLd, jsonLdGraph, absoluteUrl } from "@/lib/seo";
import { formatDate } from "@/lib/format";
import { site } from "@/lib/site";

const PAGE_PATH = "/uscis";
const UPDATED = "2026-06-16";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "USCIS Guide for Indians: Case Status, Receipt Numbers, H1B & Green Card Tools",
    description:
      "USCIS guide for Indians in the USA. Decode case status, receipt number prefixes, processing times, H1B, EB-2/EB-3 green card, I-485, EAD, and visa bulletin.",
    path: PAGE_PATH,
    type: "article",
    openGraph: {
      publishedTime: "2026-06-16",
      modifiedTime: UPDATED,
    },
  });
}

const quickCards = [
  {
    title: "USCIS Case Status Explained",
    desc: "What every case status message means in plain English — from Received to Card Was Mailed.",
    href: "/uscis/case-status",
    icon: "🔍",
  },
  {
    title: "USCIS Processing Times Explained",
    desc: "How to read the USCIS processing times tool and what your form's timeline really means.",
    href: "/uscis/processing-times",
    icon: "⏱",
  },
  {
    title: "H1B USCIS Guide",
    desc: "H1B cap, lottery, I-129, premium processing, H1B transfer, and extension timelines.",
    href: "/h1b",
    icon: "💼",
  },
  {
    title: "Green Card Process for Indians",
    desc: "EB-2, EB-3, I-140, I-485, priority dates, and the Indian backlog explained step by step.",
    href: "/green-card",
    icon: "🟢",
  },
  {
    title: "Visa Bulletin for Indians",
    desc: "Monthly visa bulletin decoded — final action dates vs. dates for filing, and what current means.",
    href: "/visa-bulletin",
    icon: "📅",
  },
  {
    title: "myUSCIS Account Guide",
    desc: "How to create and use your myUSCIS account to track cases, upload evidence, and respond to RFEs.",
    href: "/uscis/myuscis-account",
    icon: "👤",
  },
  {
    title: "USCIS Forms Explained",
    desc: "I-485, I-140, I-131, I-765, I-539 — what each form is for and when you need it.",
    href: "/uscis/forms",
    icon: "📄",
  },
  {
    title: "USCIS Notice Decoder",
    desc: "RFE, NOID, NOA1, NOA2, NTA — understand every USCIS notice and what to do next.",
    href: "/uscis/notices",
    icon: "📬",
  },
];

const faqs = [
  {
    question: "What does my USCIS case status mean?",
    answer:
      "USCIS case statuses like \"Case Was Received,\" \"Case Is Being Actively Reviewed,\" or \"Card Was Mailed\" correspond to stages in your application's adjudication. Each status has a specific meaning and expected next step. The exact wording matters — a guide to every status message is at /uscis/case-status.",
  },
  {
    question: "What is a USCIS receipt number?",
    answer:
      "A receipt number (also called a case number) is a 13-character identifier on your Notice of Action (I-797). The first three letters often indicate the initial USCIS intake location — but USCIS may transfer cases internally, so the prefix does not always reflect where your case is currently being processed. Use your receipt number only on the official USCIS portal at egov.uscis.gov — do not share it publicly. See /uscis/receipt-number for a full explanation.",
  },
  {
    question: "What do IOE, LIN, SRC, EAC, WAC, MSC mean?",
    answer:
      "These are USCIS system or intake location codes in your receipt number: LIN = Nebraska Service Center, SRC = Texas Service Center, EAC = Vermont Service Center, WAC = California Service Center, IOE = USCIS online filing system, MSC = National Benefits Center. However, USCIS may transfer or re-route cases internally, so the prefix does not always prove where your case is currently being processed. See /tools/uscis-receipt-number-decoder for a plain-English breakdown of what each prefix may indicate.",
  },
  {
    question: "How do USCIS processing times work?",
    answer:
      "USCIS publishes processing time estimates for each form at each service center. The estimate shows the range within which 80% of cases are completed. If your case is outside the published time range, you may be eligible to submit a case inquiry. Processing times fluctuate month to month and vary by service center.",
  },
  {
    question: "What is premium processing?",
    answer:
      "Premium processing is an optional USCIS service for certain forms (I-129, I-140) that guarantees USCIS will take action within 15 or 30 business days for an additional government fee. \"Action\" means an approval, denial, or Request for Evidence (RFE) — not necessarily a final approval. Not all forms or categories are eligible.",
  },
  {
    question: "What happens after I-140 approval?",
    answer:
      "After your I-140 (Immigrant Petition for Alien Workers) is approved, your priority date is established. For Indians in EB-2 or EB-3, you then wait for your priority date to become current in the visa bulletin before filing I-485 (if filing concurrently isn't possible). Your I-140 approval can also support H1B extensions beyond 6 years under AC21.",
  },
  {
    question: "What happens when priority date becomes current?",
    answer:
      "When your priority date is on or before the cutoff date in the monthly visa bulletin's Final Action Dates chart for your category and country, you can file or USCIS can approve your I-485. Check both the Final Action Dates and Dates for Filing charts monthly — USCIS announces which chart applies each month.",
  },
  {
    question: "Do H1B workers need a myUSCIS account?",
    answer:
      "It's not mandatory, but a myUSCIS account lets you track case status online, receive notifications, and in some situations submit responses electronically. If your employer or attorney filed on your behalf, you can still create an account and link your receipt number to follow updates. See /uscis/myuscis-account.",
  },
  {
    question: "Can I travel while I-485 is pending?",
    answer:
      "Departing the US while your I-485 is pending without Advance Parole (Form I-131) will typically be treated as abandonment of your adjustment application. Once you have an approved Advance Parole (part of the combo card or a standalone I-131 approval), you can generally travel and re-enter. Always consult your immigration attorney before traveling with a pending I-485.",
  },
  {
    question: "What should I do if USCIS sends an RFE?",
    answer:
      "An RFE (Request for Evidence) is not a denial — it means USCIS needs additional documentation or clarification. You must respond by the deadline stated in the notice (usually 87 days). Work with your immigration attorney immediately to prepare a complete response. Submitting a strong, timely response is critical; a missed deadline typically results in denial.",
  },
  {
    question: "How long is the EB-2 India green card wait time?",
    answer:
      "The EB-2 India Final Action Date is currently in the early 2010s, meaning applicants who filed PERM in 2012–2013 are only now becoming eligible for green card approval. New EB-2 India applicants face wait times measured in decades under current demand. The Green Card Wait Time Tracker at /tools/green-card-tracker uses USCIS I-485 inventory data to show how many applicants are ahead of you.",
  },
  {
    question: "Can I file I-485 while my priority date is not yet current?",
    answer:
      "Only if USCIS has authorized the Dates for Filing (Table B) chart for that month AND your priority date qualifies under Table B. USCIS announces this each month — check uscis.gov/visabulletininfo. Filing under Table B gives you EAD and Advance Parole but your green card will not be approved until the Final Action Date is also current.",
  },
  {
    question: "How long does H-4 EAD renewal take and what happens if there is a gap?",
    answer:
      "H-4 EAD renewal typically takes 2–6 months through USCIS. Premium processing is not available for H-4 EAD. If your EAD expires before the renewal is approved, you cannot legally work until the new card arrives. Filing at least 6 months before expiration is strongly recommended. Use the H-4 EAD Navigator at /tools/h4-ead-navigator for a renewal gap assessment.",
  },
];

const situationCards = [
  {
    title: "I am on H1B",
    desc: "H1B status, cap, lottery, transfers, extensions, and what happens while your green card is pending.",
    href: "/h1b",
    icon: "💼",
  },
  {
    title: "I am on H4 / H4 EAD",
    desc: "H4 status rules, H4 EAD eligibility, filing, and what changes when your H1B holder's status changes.",
    href: "/tools/h4-ead-navigator",
    icon: "👩‍👦",
  },
  {
    title: "I am an F1 student / OPT",
    desc: "OPT, STEM OPT, CPT, the gap between OPT and H1B, and how to transition to work status.",
    href: "/topics",
    icon: "🎓",
  },
  {
    title: "I am waiting for I-140",
    desc: "I-140 processing times, premium processing, what approval means for your H1B, and next steps.",
    href: "/green-card",
    icon: "📋",
  },
  {
    title: "I am waiting for I-485",
    desc: "I-485 stages, travel rules, EAD/AP combo card, what USCIS notices you'll receive, and interview.",
    href: "/tools/green-card-tracker",
    icon: "🟩",
  },
  {
    title: "I have EAD / AP",
    desc: "How to use your EAD to work, Advance Parole for travel, renewal timelines, and combo card tips.",
    href: "/tools/h4-ead-navigator",
    icon: "💳",
  },
  {
    title: "I am checking visa bulletin",
    desc: "Read the monthly visa bulletin, understand priority dates, and know when to file I-485.",
    href: "/visa-bulletin",
    icon: "📅",
  },
  {
    title: "I received a USCIS notice",
    desc: "Decode your NOA1, NOA2, RFE, NOID, or transfer notice and know what to do next.",
    href: "/uscis/notices",
    icon: "📬",
  },
];

const faqSchema = faqJsonLd(faqs);
const crumbs = [
  { name: "Home", url: "/" },
  { name: "USCIS Hub", url: PAGE_PATH },
];
const breadcrumb = breadcrumbJsonLd(crumbs);
const articleSchema = {
  "@type": "Article",
  "@id": `${absoluteUrl(PAGE_PATH)}#article`,
  headline:
    "USCIS Guide for Indians in the USA: Case Status, Processing Times, H1B, Green Card & More",
  description:
    "Simple USCIS guide for Indians in the USA. Understand case status, receipt numbers, processing times, H1B, green card, visa bulletin, myUSCIS, EAD, I-485, I-140 and more.",
  datePublished: "2026-06-16",
  dateModified: UPDATED,
  author: { "@type": "Organization", name: site.publisher },
  publisher: { "@id": `${site.url}/#organization` },
  mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(PAGE_PATH) },
  url: absoluteUrl(PAGE_PATH),
  inLanguage: "en-US",
  isAccessibleForFree: true,
};
const jsonLd = jsonLdGraph(articleSchema, breadcrumb, faqSchema);

export default function UscisHubPage() {
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
              {/* Breadcrumb */}
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

              {/* Category chip + meta */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-ink-400">
                <Link
                  href={PAGE_PATH}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 font-semibold text-white"
                >
                  <span>🛂</span>
                  USCIS
                </Link>
                <span>Updated {formatDate(UPDATED)}</span>
              </div>

              <h1 className="mt-3 text-[1.75rem] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[2rem]">
                USCIS Made Simple for Indians in the USA
              </h1>
              <p className="mt-2.5 text-base italic leading-[1.6] text-ink-500">
                Understand USCIS case status, processing times, H1B, green card,
                EAD, priority dates, and common immigration notices in plain
                English.
              </p>

              {/* CTA buttons */}
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/uscis/case-status"
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
                >
                  Check Case Status Meaning
                </Link>
                <Link
                  href="/tools/green-card-tracker"
                  className="inline-flex items-center gap-2 rounded-lg border border-ink-900/10 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 shadow-sm transition hover:border-brand-400 hover:text-brand-700"
                >
                  Green Card Stage Finder
                </Link>
                <Link
                  href="/visa-bulletin"
                  className="inline-flex items-center gap-2 rounded-lg border border-ink-900/10 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 shadow-sm transition hover:border-brand-400 hover:text-brand-700"
                >
                  Understand Visa Bulletin
                </Link>
              </div>
            </div>
          </Container>
        </header>

        <div className="py-8 sm:py-10">
          <Container>
            <div className="mx-auto max-w-[720px] space-y-12">

              {/* ── Disclaimer ────────────────────────────────────── */}
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-amber-900">
                <p className="font-semibold text-amber-800">
                  Important: NRItoUSA is not USCIS and does not provide legal advice.
                </p>
                <p className="mt-1.5 text-amber-800/80">
                  This guide is educational only. NRItoUSA is not affiliated with
                  USCIS, the Department of Homeland Security, or any US government
                  agency. We are not a law firm and nothing here is legal or
                  immigration advice. Always verify details on the official{" "}
                  <a
                    href="https://www.uscis.gov"
                    className="font-medium underline"
                    rel="nofollow noopener"
                    target="_blank"
                  >
                    USCIS website
                  </a>
                  ,{" "}
                  <a
                    href="https://travel.state.gov"
                    className="font-medium underline"
                    rel="nofollow noopener"
                    target="_blank"
                  >
                    Department of State
                  </a>
                  , your employer&apos;s attorney, or a licensed immigration
                  lawyer.
                </p>
              </div>

              {/* ── Quick Cards ───────────────────────────────────── */}
              <section>
                <h2 className="text-xl font-bold text-ink-900 mb-5">
                  Explore the USCIS guide
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {quickCards.map((card) => (
                    <Link
                      key={card.href}
                      href={card.href}
                      className="group flex gap-4 rounded-2xl border border-ink-900/10 bg-white p-5 transition hover:border-brand-400 hover:shadow-sm"
                    >
                      <span className="mt-0.5 text-2xl leading-none">{card.icon}</span>
                      <div>
                        <h3 className="font-semibold text-ink-900 group-hover:text-brand-700">
                          {card.title}
                        </h3>
                        <p className="mt-1 text-sm text-ink-500 leading-snug">
                          {card.desc}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* ── FAQ ──────────────────────────────────────────── */}
              <section>
                <h2 className="text-xl font-bold text-ink-900 mb-6">
                  Most common USCIS questions for Indians
                </h2>
                <div className="space-y-6">
                  {faqs.map((faq) => (
                    <div key={faq.question}>
                      <h3 className="font-semibold text-ink-900 text-base">
                        {faq.question}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── Start Here by Situation ───────────────────────── */}
              <section>
                <h2 className="text-xl font-bold text-ink-900 mb-2">
                  Start here by situation
                </h2>
                <p className="text-sm text-ink-500 mb-5">
                  Jump to the guide most relevant to where you are right now.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {situationCards.map((card) => (
                    <Link
                      key={card.href + card.title}
                      href={card.href}
                      className="group flex gap-4 rounded-2xl border border-ink-900/10 bg-white p-5 transition hover:border-brand-400 hover:shadow-sm"
                    >
                      <span className="mt-0.5 text-2xl leading-none">{card.icon}</span>
                      <div>
                        <h3 className="font-semibold text-ink-900 group-hover:text-brand-700">
                          {card.title}
                        </h3>
                        <p className="mt-1 text-sm text-ink-500 leading-snug">
                          {card.desc}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* ── Popular USCIS Tools ───────────────────────────── */}
              <section className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50/60 to-white p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                  Popular USCIS tools
                </p>
                <h2 className="text-lg font-bold text-ink-900 mb-1">
                  USCIS Case Status Meaning Tool
                </h2>
                <p className="text-sm text-ink-600 mb-4">
                  Select your form type and current status — get a plain-English
                  explanation, what happens next, and when to contact your attorney.
                  No receipt number or personal details needed.
                </p>
                <Link
                  href="/tools/uscis-case-status-meaning"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  🛂 Try the USCIS Status Decoder →
                </Link>
              </section>

              {/* ── Tools strip ───────────────────────────────────── */}
              <section className="rounded-2xl border border-ink-900/5 bg-ink-50 p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
                  <h2 className="text-base font-semibold text-ink-900">
                    USCIS tools for Indians
                  </h2>
                  <Link href="/tools/visa-green-card" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                    See all visa &amp; green card tools →
                  </Link>
                </div>
                <ul className="grid gap-y-2.5 gap-x-6 text-sm sm:grid-cols-2">
                  {[
                    { label: "USCIS Case Status Meaning", href: "/tools/uscis-case-status-meaning" },
                    { label: "USCIS Processing Delay Checker", href: "/tools/uscis-processing-delay-checker" },
                    { label: "Receipt Number Prefix Decoder", href: "/tools/uscis-receipt-number-decoder" },
                    { label: "Green Card Stage Finder", href: "/tools/green-card-stage-finder" },
                    { label: "Green Card Wait Tracker", href: "/tools/green-card-tracker" },
                    { label: "Priority Date Checker", href: "/tools/priority-date-checker" },
                    { label: "H-1B Lottery Timeline & Odds", href: "/tools/h1b-lottery-timeline" },
                    { label: "H-1B Transfer Risk Checklist", href: "/tools/h1b-transfer-risk-checklist" },
                    { label: "H1B Salaries Explorer", href: "/tools/h1b-salaries" },
                    { label: "Processing Times Table", href: "/tools/processing-times" },
                    { label: "H-4 EAD Navigator", href: "/tools/h4-ead-navigator" },
                    { label: "Citizenship Checklist", href: "/tools/citizenship-checklist" },
                  ].map((t) => (
                    <li key={t.href}>
                      <Link
                        href={t.href}
                        className="text-brand-600 hover:text-brand-700 font-medium"
                      >
                        {t.label} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>

              {/* ── Related guides ────────────────────────────────── */}
              <section>
                <h2 className="text-base font-semibold text-ink-900 mb-3">
                  Related USCIS guides
                </h2>
                <div className="grid gap-2 sm:grid-cols-2 text-sm">
                  {[
                    { label: "USCIS Case Status Explained", href: "/uscis/case-status" },
                    { label: "USCIS Processing Times Guide", href: "/uscis/processing-times" },
                    { label: "H-1B Guide for Indians", href: "/h1b" },
                    { label: "Green Card Process for Indians", href: "/green-card" },
                    { label: "Visa Bulletin Explained", href: "/visa-bulletin" },
                    { label: "Visa & Green Card Tools Hub", href: "/tools/visa-green-card" },
                  ].map((l) => (
                    <Link key={l.href} href={l.href}
                      className="rounded-xl border border-ink-900/5 bg-white px-4 py-3 font-medium text-brand-600 hover:border-brand-300 hover:text-brand-700 transition">
                      {l.label} →
                    </Link>
                  ))}
                </div>
              </section>

              {/* ── Disclaimer footer ──────────────────────────────── */}
              <div className="rounded-2xl border border-ink-900/5 bg-white p-6 text-sm text-ink-500">
                <strong className="font-semibold text-ink-700">A quick note: </strong>
                This guide is educational and reflects general information, not
                personalized legal or immigration advice. USCIS rules, fees, and
                processing times change frequently — always confirm on the official{" "}
                <a
                  href="https://www.uscis.gov"
                  className="text-brand-600 underline"
                  rel="nofollow noopener"
                  target="_blank"
                >
                  USCIS website
                </a>{" "}
                and consult a licensed immigration attorney for your specific
                situation.
              </div>

            </div>
          </Container>
        </div>
      </article>

      <Newsletter />
    </>
  );
}
