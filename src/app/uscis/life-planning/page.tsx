import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Newsletter from "@/components/Newsletter";
import {
  pageMetadata,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  absoluteUrl,
  type FaqItem,
} from "@/lib/seo";
import { site } from "@/lib/site";
import { lifePlanningChildPages } from "@/lib/uscisLifePlanningCluster";

const PAGE_PATH = "/uscis/life-planning";
const UPDATED = "2026-06-16";

export const metadata: Metadata = pageMetadata({
  title: "USCIS Life Planning for Indians | H1B, Green Card, Travel, Job Change",
  description:
    "Practical life planning guide for Indians dealing with USCIS delays, H1B, green card backlog, I-485, travel to India, job changes, buying a house, EAD and family decisions.",
  path: PAGE_PATH,
  type: "article",
  openGraph: { publishedTime: UPDATED, modifiedTime: UPDATED },
});

const crumbs = [
  { name: "Home", url: "/" },
  { name: "USCIS Hub", url: "/uscis" },
  { name: "Life Planning", url: PAGE_PATH },
];

const faqs: FaqItem[] = [
  {
    question: "Can I buy a house while waiting for a green card?",
    answer:
      "Yes. Non-citizens — including H-1B holders and I-485 applicants — can legally purchase property in the US. Most major lenders offer mortgages to H-1B holders with at least 1–2 years remaining on their visa. The real question is risk planning: what happens if your I-485 is delayed, your employer changes, or you need to leave temporarily? Plan for these scenarios before signing.",
  },
  {
    question: "Can I change jobs during the green card process?",
    answer:
      "Yes — but timing matters. If your I-485 has been pending for at least 180 days and your I-140 is approved, AC21 portability allows you to change to a same-or-similar job without restarting your green card. Before 180 days, a job change is much riskier and may jeopardize your I-485. Never change jobs without consulting your immigration attorney first.",
  },
  {
    question: "Can I travel to India while I-485 is pending?",
    answer:
      "Yes — but only with an approved, physically received Advance Parole card (I-131). Never leave the US while I-485 is pending without the physical AP card. Departing without it is generally treated as I-485 abandonment, costing you your place in the India EB queue. Book travel only after the card is in your hand, not when USCIS tracking says 'card is being produced.'",
  },
  {
    question: "Should I renew my H-1B even if I have EAD?",
    answer:
      "Many immigration attorneys recommend yes. EAD lets you work for any employer — but H-1B gives you two things EAD doesn't: (1) the ability to travel internationally without Advance Parole if you have a valid H-1B visa stamp, and (2) a safety net if I-485 is denied — you remain in valid H-1B status rather than being out of status.",
  },
  {
    question: "Can I start a business on H-1B?",
    answer:
      "You can own a business and earn passive income (dividends, rent, distributions) on H-1B. What you cannot do is actively work in that business — writing code, serving clients, managing operations — without a separate work authorization. H-4 EAD spouses can actively run a business their H-1B spouse owns. Once you have EAD from I-485, you can work in your own business freely.",
  },
  {
    question: "What happens to my green card process if I get laid off?",
    answer:
      "You have a 60-day grace period from your last day of employment to take action. If your I-485 has been pending 180+ days and I-140 is approved, AC21 lets you continue I-485 with a new employer in a same-or-similar job. Your priority date survives if I-140 was approved for 180+ days. Move in the first 72 hours after a layoff: call your attorney, secure your documents, evaluate your options.",
  },
  {
    question: "My child is approaching 21 — will they age out of my green card?",
    answer:
      "Possibly. The Child Status Protection Act (CSPA) provides a formula that may protect some children — CSPA Age = actual age at visa availability date minus days I-140 was pending. Children protected under CSPA must 'seek to acquire' the green card within one year. For India EB with 15–50 year waits, many children will age out. Help older children establish independent paths (F-1, OPT, H-1B) as a parallel plan.",
  },
  {
    question: "Does moving to another state affect my H-1B or I-485?",
    answer:
      "Yes — more than most people realize. Moving your work location to a new MSA (Metropolitan Statistical Area) requires a new LCA and often an H-1B amendment (new I-129 filing). Remote work from a new state also triggers this. For I-485: file AR-11 within 10 days of moving, and your I-485 interview will be transferred to the local field office in your new state.",
  },
];

const DECISIONS = [
  { emoji: "🏠", title: "Buying a house", risk: "medium", href: "/uscis/buy-house-while-waiting-for-green-card" },
  { emoji: "💼", title: "Changing jobs", risk: "high", href: "/uscis/change-job-during-green-card" },
  { emoji: "✈️", title: "Travel to India", risk: "high", href: "/uscis/travel-to-india-while-i485-pending" },
  { emoji: "📋", title: "H-1B renewal with I-485", risk: "medium", href: "/uscis/h1b-renewal-while-i485-pending" },
  { emoji: "💍", title: "H-4 EAD renewal gap", risk: "medium", href: "/uscis/h4-ead-renewal-delay" },
  { emoji: "🏢", title: "Side business on H-1B", risk: "medium", href: "/uscis/start-side-business-on-h1b" },
  { emoji: "📍", title: "Moving states", risk: "medium", href: "/uscis/moving-states-address-change" },
  { emoji: "👦", title: "Kids aging out (CSPA)", risk: "high", href: "/uscis/kids-aging-out-cspa" },
  { emoji: "👨‍👩‍👧", title: "Parents visiting USA", risk: "low", href: "/uscis/parents-visiting-usa-while-case-pending" },
  { emoji: "⚠️", title: "Layoff during green card", risk: "high", href: "/uscis/layoff-green-card-process" },
];

const RISK_CONFIG = {
  low: "bg-emerald-50 border-emerald-100 text-emerald-700",
  medium: "bg-amber-50 border-amber-100 text-amber-700",
  high: "bg-rose-50 border-rose-100 text-rose-700",
};

const RISK_LABEL = {
  low: "Lower complexity",
  medium: "Plan carefully",
  high: "Attorney advised",
};

const CHECKLIST = [
  { q: "What is my current visa status and when does it expire?", why: "All major decisions change in complexity depending on visa type and remaining validity." },
  { q: "Is my I-140 approved, and for how long has it been approved?", why: "I-140 approval for 180+ days triggers AC21 portability and priority date protection — critical for job changes." },
  { q: "Is my I-485 filed, and how long has it been pending?", why: "180 days of I-485 pendency is the threshold for AC21 job portability." },
  { q: "Do I have a valid EAD and/or Advance Parole?", why: "EAD enables job flexibility; AP is mandatory for travel with pending I-485." },
  { q: "Have I notified USCIS of any address changes (AR-11)?", why: "Missed USCIS notices due to wrong address can cause missed deadlines and denials." },
  { q: "Does my decision involve international travel — and is my AP card in hand?", why: "Physical AP card must be in hand before any departure with pending I-485." },
  { q: "Does this decision involve changing employers?", why: "Employer changes may require H-1B transfer, AC21 analysis, and I-485J notification." },
  { q: "Have I consulted my immigration attorney in the last 6 months?", why: "Immigration rules change. Many life decisions that seem routine have immigration implications." },
];

export default function UscisLifePlanningPage() {
  const url = absoluteUrl(PAGE_PATH);

  const jsonLd = jsonLdGraph(
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline:
        "USCIS Life Planning for Indians: H1B, Green Card Delay, Travel, Job Change, House & Family Decisions",
      description:
        "Practical life planning guide for Indians dealing with USCIS delays, H1B, green card backlog, I-485, travel to India, job changes, buying a house, EAD and family decisions.",
      datePublished: UPDATED,
      dateModified: UPDATED,
      author: { "@type": "Organization", name: site.publisher },
      publisher: { "@id": `${site.url}/#organization` },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      url,
      inLanguage: "en-US",
      isAccessibleForFree: true,
    },
    breadcrumbJsonLd(crumbs),
    faqJsonLd(faqs)
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="border-b border-ink-900/5 bg-white pt-8 pb-7 sm:pt-10">
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
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-ink-400">
                <Link
                  href="/uscis"
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 font-semibold text-white"
                >
                  <span>🛂</span> USCIS
                </Link>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 px-3 py-1 font-semibold text-white">
                  🏡 Life Planning
                </span>
                <span>12 min read</span>
                <span aria-hidden>·</span>
                <span>Updated June 2026</span>
              </div>
              <h1 className="mt-3 text-[1.75rem] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[2rem]">
                USCIS Life Planning for Indians: H1B, Green Card Delay, Travel, Job Change, House & Family
              </h1>
              <p className="mt-2.5 text-base italic leading-[1.6] text-ink-500">
                The USCIS system was not designed around life decisions — but you still have to live. This guide connects your immigration status to the decisions that matter most: your career, your home, your travel, your family.
              </p>
            </div>
          </Container>
        </header>

        <div className="py-8 sm:py-10">
          <Container>
            <div className="mx-auto max-w-[720px] space-y-10">

              {/* Quick answer */}
              <section>
                <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Quick answer</p>
                  <p className="mt-2 text-sm leading-relaxed text-blue-900">
                    <strong>You can do most things</strong> — buy a house, change jobs, start a business, travel — but each decision has rules tied to your specific visa status, green card stage, and pending filings. The most dangerous moves are: traveling internationally without Advance Parole while I-485 is pending, changing jobs without AC21 analysis, and missing AR-11 address updates. Always consult your immigration attorney before a major life decision.
                  </p>
                  <div className="mt-4">
                    <Link
                      href="/tools/uscis-life-decision-checklist"
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Use the Life Decision Checklist →
                    </Link>
                  </div>
                </div>
              </section>

              {/* Why USCIS delays affect life */}
              <section>
                <h2 className="text-xl font-extrabold text-ink-900">Why USCIS delays affect every life decision</h2>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-700">
                  <p>
                    The average India EB-2 wait from I-140 approval to green card is currently estimated at 15–50+ years. During that entire period, you are on H-1B — a nonimmigrant visa tied to your employer, your job title, and a specific work location. Every major life decision runs through this constraint.
                  </p>
                  <p>
                    Buying a house means planning for a scenario where you might need to leave or can't refinance easily. Changing jobs means AC21 portability analysis. Having children means planning for kids who might age out of your petition. This is the reality of being Indian in the US green card queue.
                  </p>
                  <p>
                    This guide is not about immigration law — it is about <strong>life decisions</strong>, understood through the lens of your immigration status. Use it alongside your immigration attorney's advice.
                  </p>
                </div>
              </section>

              {/* Decision cards */}
              <section>
                <h2 className="text-xl font-extrabold text-ink-900">Decisions covered in this guide</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {DECISIONS.map((d) => (
                    <Link
                      key={d.href}
                      href={d.href}
                      className="group flex items-start gap-3 rounded-2xl border border-ink-900/10 bg-white p-4 transition hover:border-blue-400 hover:shadow-sm"
                    >
                      <span className="text-2xl">{d.emoji}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-ink-900 group-hover:text-blue-700">{d.title}</p>
                        <span className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-xs font-semibold ${RISK_CONFIG[d.risk as keyof typeof RISK_CONFIG]}`}>
                          {RISK_LABEL[d.risk as keyof typeof RISK_LABEL]}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-blue-600 self-center">→</span>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Checklist */}
              <section>
                <h2 className="text-xl font-extrabold text-ink-900">Before making any big decision: 8 questions to answer</h2>
                <div className="mt-4 space-y-3">
                  {CHECKLIST.map((item, i) => (
                    <div key={i} className="rounded-xl border border-ink-900/5 bg-white p-4">
                      <div className="flex items-start gap-3">
                        <span className="flex-none text-xs font-bold text-blue-600 mt-0.5">{i + 1}.</span>
                        <div>
                          <p className="text-sm font-semibold text-ink-900">{item.q}</p>
                          <p className="mt-1 text-xs text-ink-500">{item.why}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link
                    href="/tools/uscis-life-decision-checklist"
                    className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                  >
                    Get a personalized checklist for your decision →
                  </Link>
                </div>
              </section>

              {/* Supporting article summaries */}
              <section>
                <h2 className="text-xl font-extrabold text-ink-900">In-depth guides</h2>
                <div className="mt-5 space-y-4">
                  {lifePlanningChildPages.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/uscis/${p.slug}`}
                      className="group block rounded-2xl border border-ink-900/10 bg-white p-5 transition hover:border-blue-400 hover:shadow-sm"
                    >
                      <h3 className="font-bold text-ink-900 group-hover:text-blue-700">{p.title}</h3>
                      <p className="mt-1.5 text-sm text-ink-500 line-clamp-2">{p.excerpt}</p>
                      <p className="mt-2 text-xs font-semibold text-blue-600">Read full guide →</p>
                    </Link>
                  ))}
                </div>
              </section>

              {/* FAQ */}
              <section>
                <h2 className="text-xl font-extrabold text-ink-900">Frequently asked questions</h2>
                <div className="mt-4 space-y-4">
                  {faqs.map((f, i) => (
                    <div key={i} className="rounded-2xl border border-ink-900/5 bg-white p-5">
                      <p className="font-semibold text-ink-900">{f.question}</p>
                      <p className="mt-2 text-sm leading-relaxed text-ink-700">{f.answer}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Related tools */}
              <section>
                <h2 className="text-xl font-extrabold text-ink-900 mb-4">Tools for your situation</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { href: "/tools/uscis-life-decision-checklist", label: "Life Decision Checklist", desc: "Personalized risk and action checklist for your decision" },
                    { href: "/tools/h1b-transfer-risk-checklist", label: "H-1B Transfer Risk", desc: "Assess risk for job changes and H-1B transfers" },
                    { href: "/tools/green-card-stage-finder", label: "Green Card Stage Finder", desc: "Where exactly are you in the PERM → I-140 → I-485 process?" },
                    { href: "/tools/priority-date-checker", label: "Priority Date Checker", desc: "Is your EB priority date current in the visa bulletin?" },
                    { href: "/tools/uscis-processing-delay-checker", label: "Processing Delay Checker", desc: "Is your H-1B, I-485, or EAD case taking too long?" },
                    { href: "/tools/h4-ead-navigator", label: "H-4 EAD Navigator", desc: "What H-4 EAD holders can do — and renewal gap planning" },
                  ].map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      className="group rounded-xl border border-ink-900/10 bg-white p-4 transition hover:border-brand-400 hover:shadow-sm"
                    >
                      <p className="text-sm font-semibold text-ink-900 group-hover:text-brand-700">{t.label}</p>
                      <p className="mt-0.5 text-xs text-ink-500">{t.desc}</p>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Internal links */}
              <section className="flex flex-wrap gap-2">
                {[
                  { href: "/uscis", label: "USCIS Hub" },
                  { href: "/h1b", label: "H-1B Guide" },
                  { href: "/green-card", label: "Green Card Guide" },
                  { href: "/visa-bulletin", label: "Visa Bulletin" },
                  { href: "/uscis/forms", label: "USCIS Forms Explained" },
                ].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="rounded-full border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 hover:border-blue-400 hover:text-blue-700"
                  >
                    {l.label}
                  </Link>
                ))}
              </section>

              {/* Disclaimer */}
              <section className="rounded-2xl border border-ink-900/5 bg-white p-6 text-sm text-ink-500">
                <strong className="font-semibold text-ink-700">Educational guide — not legal advice.</strong>{" "}
                Immigration rules, USCIS policies, and case processing times change frequently. Every situation is fact-specific. Always consult a licensed immigration attorney before making any major life decision that affects your immigration status.
                NRItoUSA is not affiliated with USCIS or any US government agency.
              </section>

            </div>
          </Container>
        </div>
      </article>

      <Newsletter />
    </>
  );
}
