import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Newsletter from "@/components/Newsletter";
import RelatedHubs from "@/components/RelatedHubs";
import {
  pageMetadata,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  absoluteUrl,
  type FaqItem,
} from "@/lib/seo";
import { site } from "@/lib/site";

const PAGE_PATH = "/h1b-layoff";
const UPDATED = "2026-06-25";

const LAYOFFNEXT_URL = "https://www.layoffnext.com/visa-layoff";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "H-1B Layoff Checklist for Indians in the USA | NRItoUSA",
    description:
      "Laid off on H-1B? Use this educational checklist for Indian workers in the USA: 60-day planning window, I-94, I-797, H-1B transfer, I-140, H-4 dependents, documents, money checklist, and LayoffNext tools.",
    path: PAGE_PATH,
    type: "article",
    openGraph: { publishedTime: UPDATED, modifiedTime: UPDATED },
  });
}

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Immigration", url: "/immigration" },
  { name: "H-1B Layoff Checklist", url: PAGE_PATH },
];

const faqs: FaqItem[] = [
  {
    question: "How long is the grace period after an H-1B layoff?",
    answer:
      "USCIS regulations generally provide a discretionary grace period of up to 60 days, OR until the end of your authorized stay shown on your I-94 / I-797 — whichever is shorter. So if your I-94 expires 20 days after your last day, your effective window may be about 20 days, not 60. This is a one-time grace period per authorized validity period and is not guaranteed. Confirm your exact dates and options with a licensed immigration attorney immediately.",
  },
  {
    question: "Does the 60-day clock start on my last paycheck or my last working day?",
    answer:
      "It generally runs from the end of your employment (your last day of employment / the date your H-1B employment is terminated), not from when severance pay ends. Severance pay does not extend the grace period. Because employers define the termination date differently, ask HR in writing for your official last day of employment and confirm how it is being reported to USCIS, then verify with your attorney.",
  },
  {
    question: "Can I keep working during the H-1B grace period?",
    answer:
      "No. You cannot work for the laid-off employer after termination, and you cannot begin work for a new employer until a new H-1B petition is properly filed (and, under AC21 portability, generally receipted) while you remain in valid status. The grace period lets you stay in the US to arrange next steps — it is not work authorization. Verify your specific situation with an attorney before starting any work.",
  },
  {
    question: "What happens to my I-140 and priority date if I am laid off?",
    answer:
      "An approved I-140 that has been approved for 180+ days generally retains your priority date and can support future H-1B extensions beyond the 6-year cap, even if the sponsoring employer withdraws it after that point — but the rules are fact-specific. Whether your green card process survives a layoff depends on the I-140 status, how long it was approved, and your new employer's willingness to sponsor. This is a critical question for your immigration attorney.",
  },
  {
    question: "How does my layoff affect my spouse on H-4 or H-4 EAD?",
    answer:
      "H-4 and H-4 EAD status are dependent on the primary H-1B holder's valid status. If the H-1B holder falls out of status, the H-4 spouse's status and any H-4 EAD work authorization can be affected. If the primary worker secures a new H-1B (or changes status), the dependents' situation generally needs to be addressed too. Plan dependent filings alongside the primary worker's options with your attorney.",
  },
  {
    question: "Is it safe to travel to India right after an H-1B layoff?",
    answer:
      "Travel during a layoff and transfer window adds real risk. Leaving the US can complicate a pending change of employer petition, and re-entry may require valid visa stamping — which can trigger administrative processing (221g) and long delays, especially after a recent job change. Do not assume you can leave and return easily. Confirm travel implications with your attorney before booking anything.",
  },
  {
    question: "Where can I find layoff calculators and recovery tools?",
    answer:
      "NRItoUSA focuses on the Indian-immigrant, visa, family, and India-money angle of a layoff. For layoff runway math, severance, COBRA, unemployment, WARN notices, job-search templates, and H-1B countdown tools, use LayoffNext at layoffnext.com/visa-layoff.",
  },
];

function SectionHeading({ id, kicker, children }: { id: string; kicker: string; children: React.ReactNode }) {
  return (
    <div id={id} className="scroll-mt-24">
      <p className="text-xs font-bold uppercase tracking-wide text-orange-600 mb-1">{kicker}</p>
      <h2 className="text-xl font-bold tracking-tight text-ink-900">{children}</h2>
    </div>
  );
}

export default function H1bLayoffPage() {
  const url = absoluteUrl(PAGE_PATH);
  const jsonLd = jsonLdGraph(
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: "H-1B Layoff Checklist for Indians in the USA",
      description:
        "Educational layoff checklist for Indian H-1B workers in the USA: 60-day planning window, I-94/I-797, H-1B transfer, I-140 and priority date, H-4 dependents, documents, money runway, and India-money planning.",
      url,
      datePublished: UPDATED,
      dateModified: UPDATED,
      author: { "@id": `${site.url}/#organization` },
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "en-US",
      about: { "@type": "Thing", name: "H-1B Layoff" },
    },
    faqJsonLd(faqs),
    breadcrumbJsonLd(crumbs)
  );

  const quickNav = [
    { id: "first-24-hours", label: "First 24 hours" },
    { id: "grace-window", label: "60-day window" },
    { id: "documents", label: "Documents" },
    { id: "transfer", label: "H-1B transfer" },
    { id: "i140", label: "I-140 / green card" },
    { id: "dependents", label: "H-4 family" },
    { id: "travel", label: "Travel" },
    { id: "money", label: "Money" },
    { id: "india", label: "India assets" },
    { id: "tools", label: "LayoffNext tools" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* breadcrumb */}
      <nav aria-label="breadcrumb" className="border-b border-ink-900/5 bg-ink-50/60">
        <Container className="py-2.5">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-ink-500">
            <li><Link href="/" className="hover:text-ink-800">Home</Link></li>
            <li aria-hidden>/</li>
            <li><Link href="/immigration" className="hover:text-ink-800">Immigration</Link></li>
            <li aria-hidden>/</li>
            <li className="font-medium text-ink-800">H-1B Layoff Checklist</li>
          </ol>
        </Container>
      </nav>

      {/* disclaimer */}
      <div className="border-b border-amber-200 bg-amber-50">
        <Container className="py-2.5">
          <p className="text-center text-xs text-amber-900">
            <strong className="font-semibold">Educational only.</strong> This page is not legal, immigration, tax, financial, or employment advice. Always verify your situation with a licensed immigration attorney, official{" "}
            <a href="https://www.uscis.gov" target="_blank" rel="noopener noreferrer" className="underline">USCIS</a>{" "}
            guidance, and qualified professionals.
          </p>
        </Container>
      </div>

      {/* hero */}
      <section className="bg-white pb-8 pt-12 sm:pb-10 sm:pt-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 px-3 py-1">
              <span className="text-sm">🛂</span>
              <span className="text-xs font-bold text-white">H-1B Layoff Checklist</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              H-1B Layoff Checklist for Indians in the USA
            </h1>
            <p className="mt-3 text-lg leading-relaxed text-ink-600">
              If you were laid off on H-1B, your next steps may affect your immigration status, family, green card process, health insurance, money runway, and India-related planning. Use this educational checklist to organize what to ask your immigration attorney and what tools to use next.
            </p>
            <p className="mt-2 text-xs text-ink-400">
              Updated {new Date(UPDATED).toLocaleDateString("en-US", { month: "long", year: "numeric", day: "numeric" })} · ~12 min read
            </p>

            {/* CTAs */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={LAYOFFNEXT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-700"
              >
                Use Free H-1B Layoff Tools on LayoffNext →
              </a>
              <Link
                href="/nri-wealth-checkup"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-ink-900/10 bg-white px-5 py-3 text-sm font-semibold text-ink-700 hover:border-orange-400 hover:text-orange-700"
              >
                Start NRI Wealth Checkup
              </Link>
            </div>

            {/* quick nav */}
            <div className="mt-6 flex flex-wrap gap-2">
              {quickNav.map((item) => (
                <a key={item.id} href={`#${item.id}`}
                  className="rounded-full border border-ink-900/10 bg-ink-50 px-3 py-1 text-xs font-medium text-ink-700 hover:border-orange-400 hover:text-orange-700">
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* most important thing */}
      <section className="bg-orange-50/50 py-8">
        <Container>
          <div className="mx-auto max-w-3xl rounded-2xl border border-orange-100 bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-wide text-orange-600 mb-3">The single most important thing to confirm</p>
            <p className="text-sm leading-relaxed text-ink-700">
              After an H-1B layoff, USCIS regulations generally allow a discretionary grace period of <strong>up to 60 days, or until your I-94 / I-797 authorized stay ends — whichever is shorter</strong>. This is not guaranteed and is one-time per validity period. Your real deadline could be far shorter than 60 days if your I-94 expires sooner. Confirm your exact last day of employment and your I-94 end date with a licensed immigration attorney before you do anything else.
            </p>
          </div>
        </Container>
      </section>

      {/* First 24 hours */}
      <section className="bg-white py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5">
            <SectionHeading id="first-24-hours" kicker="Step 1">First 24 hours after an H-1B layoff</SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              The first day is about facts, not panic. You are gathering the information your attorney will need and protecting your access to documents and accounts before they are switched off.
            </p>
            <div className="space-y-2.5">
              {[
                "Ask HR — in writing — for your official last day of employment and the date your H-1B employment termination is being reported to USCIS.",
                "Ask whether the employer will offer to delay the termination date, pay out notice, or keep you on payroll for a short period (this can affect your grace-period start).",
                "Download everything from work systems you are entitled to: pay stubs, W-2s, offer letter, and any immigration paperwork before your access is revoked.",
                "Save personal copies of your I-797 approval notices and I-94 — do not rely on the employer's attorney portal staying open to you.",
                "Get your immigration attorney's contact info; if the company attorney represented the employer, you may need your own independent attorney now.",
                "Do not sign a severance agreement on the spot — ask for time to review, and consider whether it affects your last-day-of-employment date.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border border-ink-900/5 bg-ink-50/40 p-4">
                  <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border border-orange-300 text-[10px] font-bold text-orange-600">✓</span>
                  <p className="text-sm text-ink-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 60-day window */}
      <section className="bg-ink-50/40 py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5">
            <SectionHeading id="grace-window" kicker="Step 2">H-1B 60-day planning window: what to confirm</SectionHeading>
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-5">
              <p className="font-semibold text-amber-900 mb-2">Up to 60 days — or until your I-94 ends, whichever is shorter</p>
              <p className="text-sm text-amber-800">
                The grace period is discretionary, runs from the end of your H-1B employment, and is capped by your I-94 / I-797 validity. Severance pay does not extend it. Treat the shorter of the two dates as your hard planning deadline, and confirm both with your attorney.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { q: "When exactly does my window start?", a: "The official last day of H-1B employment — confirm the date HR is reporting." },
                { q: "When does my I-94 actually expire?", a: "Look up the latest I-94 admission record, not the visa stamp date." },
                { q: "Is 60 days even available to me?", a: "It is discretionary and one-time per validity period — verify it applies to you." },
                { q: "What are my options before day 60?", a: "New H-1B transfer, change of status (e.g. H-4, F-1, B-2), or departure." },
                { q: "Can I file a change of status as a backup?", a: "Ask whether filing before the deadline preserves options if a transfer falls through." },
                { q: "What if I miss the window?", a: "Understand the consequences of falling out of status before it happens." },
              ].map((c) => (
                <div key={c.q} className="rounded-xl border border-ink-900/5 bg-white p-4">
                  <p className="text-sm font-semibold text-ink-900">{c.q}</p>
                  <p className="mt-1 text-xs text-ink-600">{c.a}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-ink-500">
              For the deeper mechanics of the grace period, see the{" "}
              <Link href="/h1b/layoff-60-day-grace-period" className="font-semibold text-orange-600 underline">H-1B 60-day grace period guide</Link>{" "}
              and the{" "}
              <Link href="/h1b" className="font-semibold text-orange-600 underline">full H-1B guide for Indians</Link>.
            </p>
          </div>
        </Container>
      </section>

      {/* Documents */}
      <section className="bg-white py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5">
            <SectionHeading id="documents" kicker="Step 3">Documents to collect immediately</SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              A new employer's attorney will move faster if you already have these in hand. Keep digital and printed copies in a personal folder you control.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { group: "Immigration", items: ["All I-797 approval notices (every H-1B and any I-140)", "Latest I-94 (from the CBP I-94 website)", "Passport (with valid H-1B visa stamp pages)", "Prior LCAs and any RFE/response history if available"] },
                { group: "Employment & money", items: ["Recent pay stubs and last 2 years of W-2s", "Offer letter and any severance agreement", "Health insurance and COBRA election paperwork", "401(k) / HSA / RSU account access and statements"] },
                { group: "Green card (if applicable)", items: ["PERM certification (ETA-9089) if issued", "I-140 receipt and approval notices", "Priority date documentation", "Any pending I-485 / EAD / Advance Parole receipts"] },
                { group: "Family / dependents", items: ["Spouse and children passports and I-94s", "H-4 I-797 approval notices", "H-4 EAD card and approval notice", "Marriage and birth certificates"] },
              ].map((col) => (
                <div key={col.group} className="rounded-xl border border-ink-900/5 bg-ink-50/40 p-4">
                  <p className="text-xs font-bold text-ink-800 mb-2">{col.group}</p>
                  <ul className="space-y-1">
                    {col.items.map((item) => <li key={item} className="text-xs text-ink-600">• {item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* H-1B transfer */}
      <section className="bg-ink-50/40 py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5">
            <SectionHeading id="transfer" kicker="Step 4">H-1B transfer questions to ask</SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              A change-of-employer H-1B petition is cap-exempt — you do not re-enter the lottery. The goal during a layoff is to get a clean petition filed before your grace period ends. These are the questions to put to a prospective employer and their attorney.
            </p>
            <div className="space-y-2.5">
              {[
                "Will you file premium processing? Regular processing takes months — premium is usually essential during a 60-day window.",
                "Can you file before my grace period / I-94 deadline, not just \"soon\"?",
                "Will I be able to work on the receipt under AC21 portability, or should I wait for approval?",
                "Is the role a clean specialty occupation, or is there third-party / consulting placement that invites RFEs?",
                "Does the LCA wage and worksite match the actual job and location?",
                "If I am close to the 6-year cap, can you confirm my approved I-140 supports an extension beyond 6 years?",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border border-ink-900/5 bg-white p-4">
                  <span className="mt-0.5 flex-none text-orange-400">▸</span>
                  <p className="text-sm text-ink-700">{item}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-5">
              <p className="font-semibold text-orange-900">Use the H-1B Transfer Risk Checklist</p>
              <p className="mt-1 text-sm text-orange-800/80">
                Walk through your transfer situation — documents, timing, and red flags to raise with the new employer's attorney.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href="/tools/h1b-transfer-risk-checklist"
                  className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700">
                  Open the checklist →
                </Link>
                <Link href="/h1b/transfer-after-layoff"
                  className="inline-flex items-center gap-2 rounded-lg border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-800 hover:border-orange-400">
                  H-1B transfer after layoff guide →
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* I-140 / green card */}
      <section className="bg-white py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5">
            <SectionHeading id="i140" kicker="Step 5">I-140, priority date, and green card questions</SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              For Indians in the EB-2 / EB-3 backlog, a layoff raises a hard question: does my place in the green card line survive? The answers turn on how long your I-140 was approved and what your new employer is willing to do.
            </p>
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-xs text-blue-900">
              <strong className="font-semibold">The 180-day I-140 rule:</strong> An I-140 approved for 180+ days generally lets you keep your priority date and can support H-1B extensions beyond the 6-year cap even if the old employer later withdraws it. If your I-140 was approved more recently, you have less protection. This is fact-specific — confirm with your attorney.
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Has my I-140 been approved for 180+ days?",
                "Can I retain my priority date and port it to a new employer's green card case?",
                "Will the layoff cause the old employer to withdraw the I-140, and does it still help me if they do?",
                "Am I past the 6-year cap and relying on the I-140 for H-1B extensions?",
                "If I had a pending I-485 for 180+ days, can I port to a same-or-similar job (AC21)?",
                "How should I restart PERM with a new employer, and what does that do to my timeline?",
              ].map((q) => (
                <div key={q} className="rounded-xl border border-ink-900/5 bg-ink-50/40 p-4 text-sm text-ink-700">{q}</div>
              ))}
            </div>
            <p className="text-xs text-ink-500">
              Background reading:{" "}
              <Link href="/green-card" className="font-semibold text-orange-600 underline">Green Card Process for Indians</Link>{" "}
              and the{" "}
              <Link href="/tools/green-card-stage-finder" className="font-semibold text-orange-600 underline">Green Card Stage Finder</Link>.
            </p>
          </div>
        </Container>
      </section>

      {/* Dependents */}
      <section className="bg-ink-50/40 py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5">
            <SectionHeading id="dependents" kicker="Step 6">H-4 spouse / H-4 EAD / dependent questions</SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              H-4 status and H-4 EAD work authorization depend on the primary H-1B holder's valid status. A layoff that puts the primary worker out of status can ripple to the whole family, so dependents must be part of the plan from day one.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { t: "If my spouse has an H-4 EAD", d: "Confirm whether their work authorization is affected if I fall out of status, and whether they should pause employment." },
                { t: "If my spouse could sponsor me", d: "If my spouse holds H-1B, ask whether I (and kids) could change to H-4 as a backup option within the window." },
                { t: "Children aging out", d: "Ask how a layoff and any green card delays affect a child approaching 21 and the Child Status Protection Act math." },
                { t: "Dependent filings", d: "Make sure any new H-1B or change-of-status filing addresses H-4 dependents at the same time." },
              ].map((c) => (
                <div key={c.t} className="rounded-xl border border-ink-900/5 bg-white p-4">
                  <p className="text-sm font-semibold text-ink-900">{c.t}</p>
                  <p className="mt-1 text-xs text-ink-600">{c.d}</p>
                </div>
              ))}
            </div>
            <Link href="/tools/h4-ead-navigator" className="block rounded-xl border border-orange-100 bg-orange-50/50 p-4 text-sm font-semibold text-orange-800 hover:border-orange-300">
              Use the H-4 EAD Navigator →
            </Link>
          </div>
        </Container>
      </section>

      {/* Travel */}
      <section className="bg-white py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5">
            <SectionHeading id="travel" kicker="Step 7">India travel and visa stamping caution checklist</SectionHeading>
            <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-4 text-xs text-rose-900">
              <strong className="font-semibold">Do not assume you can leave and come back.</strong> Travelling to India during a layoff and transfer window can complicate a pending petition and re-entry. If your visa stamp has expired, re-entry needs fresh stamping, which can trigger 221(g) administrative processing and long delays.
            </div>
            <div className="space-y-2.5">
              {[
                "Confirm with your attorney whether leaving the US affects a pending or planned change-of-employer petition.",
                "Check whether your H-1B visa stamp is still valid for re-entry, or whether you would need new stamping in India.",
                "Understand 221(g) risk — higher after a recent employer change, for consulting roles, or with prior visa issues.",
                "Do not book non-refundable travel until your immigration plan and timeline are confirmed.",
                "If a family emergency forces travel, get attorney guidance first on documents to carry and re-entry risk.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border border-ink-900/5 bg-ink-50/40 p-4">
                  <span className="mt-0.5 flex-none text-rose-400">▸</span>
                  <p className="text-sm text-ink-700">{item}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-ink-500">
              Deeper detail:{" "}
              <Link href="/h1b/travel-to-india" className="font-semibold text-orange-600 underline">H-1B travel to India and stamping</Link>{" "}
              and the{" "}
              <Link href="/uscis" className="font-semibold text-orange-600 underline">USCIS hub</Link>.
            </p>
          </div>
        </Container>
      </section>

      {/* Money */}
      <section className="bg-ink-50/40 py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5">
            <SectionHeading id="money" kicker="Step 8">Money checklist after layoff</SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              Immigration is the urgent clock, but money is the runway that lets you make calm decisions. Map your cash, coverage, and obligations on both sides of the ocean.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { t: "Health insurance", d: "Decide on COBRA vs marketplace coverage quickly — a gap is risky for a family. Note COBRA election deadlines." },
                { t: "Cash runway", d: "Calculate how many months your savings cover, including rent/mortgage, dependents, and immigration legal fees." },
                { t: "401(k) / HSA / RSUs", d: "Don't cash out 401(k) in a panic — understand penalties, vesting cliffs, and RSU forfeiture before deciding." },
                { t: "Severance & taxes", d: "Understand how severance is taxed and whether it changes your last-day-of-employment date." },
                { t: "Loans & credit", d: "Note auto, student, and any US loan obligations, plus credit cards you rely on, before income stops." },
                { t: "Unemployment / WARN", d: "Check state unemployment eligibility and any WARN-notice rights — use LayoffNext for the calculators." },
              ].map((c) => (
                <div key={c.t} className="rounded-xl border border-ink-900/5 bg-white p-4">
                  <p className="text-sm font-semibold text-ink-900">{c.t}</p>
                  <p className="mt-1 text-xs text-ink-600">{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* India assets */}
      <section className="bg-white py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5">
            <SectionHeading id="india" kicker="Step 9">India assets, NRE/NRO, taxes, and emergency planning</SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              This is where NRItoUSA can help most. A layoff is a moment to take stock of your India-side money and your US reporting obligations — especially if there is any chance of moving back.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { t: "NRE / NRO accounts", d: "Know your balances and whether your residency status (and thus NRE eligibility) could change if you leave the US." },
                { t: "FBAR / FATCA", d: "Indian accounts, FDs, and mutual funds may still trigger US reporting for the year — don't let a layoff cause a missed FBAR/8938." },
                { t: "India emergency liquidity", d: "Identify what you could draw on in India if your US runway runs short, and the tax cost of repatriating it." },
                { t: "If you may return to India", d: "Start thinking about RNOR status, 401(k) handling, and currency timing before you decide anything." },
              ].map((c) => (
                <div key={c.t} className="rounded-xl border border-ink-900/5 bg-ink-50/40 p-4">
                  <p className="text-sm font-semibold text-ink-900">{c.t}</p>
                  <p className="mt-1 text-xs text-ink-600">{c.d}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/nri-wealth-checkup" className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-semibold text-orange-800 hover:border-orange-400">
                Start NRI Wealth Checkup →
              </Link>
              <Link href="/tools/fbar-fatca-checker" className="rounded-lg border border-ink-900/10 bg-ink-50 px-4 py-2 text-xs font-semibold text-ink-700 hover:border-brand-400">
                FBAR / FATCA Checker →
              </Link>
              <Link href="/tools/nri-tax-filing-roadmap" className="rounded-lg border border-ink-900/10 bg-ink-50 px-4 py-2 text-xs font-semibold text-ink-700 hover:border-brand-400">
                DIY NRI Tax Filing Roadmap →
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* When to use LayoffNext */}
      <section className="bg-ink-50/40 py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5">
            <SectionHeading id="tools" kicker="Step 10">When to use LayoffNext tools</SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              NRItoUSA owns the Indian-immigrant, visa, family, and India-money side of a layoff. For the layoff-mechanics math and recovery workflow, LayoffNext is the deeper toolkit. Use it when you need the numbers and templates.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Layoff runway and severance calculators",
                "COBRA cost vs marketplace comparison",
                "Unemployment eligibility and WARN notice tools",
                "H-1B countdown to track your 60-day window",
                "Job-search templates and outreach tracking",
                "Recovery checklists for the weeks after a layoff",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 rounded-xl border border-ink-900/5 bg-white p-3 text-sm text-ink-700">
                  <span className="mt-0.5 flex-none text-orange-400">▸</span>{item}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Cross-site block */}
      <section className="bg-white py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-6 sm:p-8">
            <h2 className="text-xl font-bold tracking-tight text-ink-900">Need layoff calculators and recovery tools?</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">
              For layoff runway, severance, COBRA, unemployment, WARN notices, job-search templates, and H-1B countdown tools, use LayoffNext.
            </p>
            <a
              href={LAYOFFNEXT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-700"
            >
              Open LayoffNext H-1B Toolkit →
            </a>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-ink-50/40 py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 id="faq" className="scroll-mt-24 text-xl font-bold tracking-tight text-ink-900 mb-6">Frequently asked questions</h2>
            <dl className="space-y-4">
              {faqs.map((item) => (
                <div key={item.question} className="rounded-2xl border border-ink-900/5 bg-white px-5 py-4">
                  <dt className="font-semibold text-ink-900">{item.question}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-ink-600">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      {/* internal links */}
      <section className="bg-white py-10 sm:py-12">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-base font-bold text-ink-900 mb-4">Related guides and tools</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { href: "/immigration", label: "Immigration Hub", desc: "Start by situation and find the right tool or guide" },
                { href: "/tools", label: "All Tools", desc: "Every free calculator and checklist in one place" },
                { href: "/uscis", label: "USCIS Hub", desc: "Case status, receipt numbers, forms, and processing times" },
                { href: "/h1b", label: "H-1B Guide for Indians", desc: "Transfer, extension, RFE, premium processing, and travel" },
                { href: "/tools/h1b-transfer-risk-checklist", label: "H-1B Transfer Risk Checklist", desc: "Assess your transfer situation and documents" },
                { href: "/tools/h4-ead-navigator", label: "H-4 EAD Navigator", desc: "Understand H-4 and H-4 EAD impact for your spouse" },
                { href: "/green-card", label: "Green Card Process for Indians", desc: "EB-2/EB-3, I-140, priority date, and I-485" },
                { href: "/nri-wealth-checkup", label: "NRI Wealth Checkup", desc: "Educational FBAR/FATCA and US-India money checklist" },
                { href: "/tools/nri-tax-filing-roadmap", label: "DIY NRI Tax Filing Roadmap", desc: "Which US and India forms may apply before you file" },
                { href: "/tools/fbar-fatca-checker", label: "FBAR / FATCA Checker", desc: "US reporting for NRE/NRO, FDs, and Indian mutual funds" },
              ].map((g) => (
                <Link key={g.href} href={g.href} className="group rounded-xl border border-ink-900/10 bg-white p-4 transition hover:border-brand-400 hover:shadow-sm">
                  <p className="text-sm font-semibold text-ink-900 group-hover:text-brand-700">{g.label}</p>
                  <p className="mt-0.5 text-xs text-ink-500">{g.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* disclaimer */}
      <section className="border-t border-ink-900/5 bg-white py-8">
        <Container>
          <div className="mx-auto max-w-2xl text-center text-xs leading-relaxed text-ink-500">
            <p>
              <strong className="font-semibold text-ink-700">This page is educational only and is not legal, immigration, tax, financial, or employment advice.</strong>{" "}
              H-1B rules, grace periods, USCIS policies, and tax regulations change frequently and depend on your specific facts. Always verify your situation with a licensed immigration attorney, official{" "}
              <a href="https://www.uscis.gov" target="_blank" rel="noopener noreferrer" className="font-medium underline">USCIS</a>{" "}
              guidance, and qualified financial and tax professionals before acting.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-14">
        <Container>
          <RelatedHubs hubs={["immigration", "uscis", "tax", "wealth"]} />
        </Container>
      </section>

      <Newsletter />
    </>
  );
}
