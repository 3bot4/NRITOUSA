import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Newsletter from "@/components/Newsletter";
import PriorityDateChecker from "@/components/tools/PriorityDateChecker";
import {
  pageMetadata,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  absoluteUrl,
  type FaqItem,
} from "@/lib/seo";
import { site } from "@/lib/site";
import { visaBulletinChildPages } from "@/lib/visaBulletinCluster";
import { CURRENT_VISA_BULLETIN } from "@/lib/visaBulletinDates";
import { currentBulletinNote } from "@/lib/visa-bulletin";
import VisaBulletinAlert from "@/components/VisaBulletinAlert";

const PAGE_PATH = "/visa-bulletin";
const UPDATED = "2026-06-16";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "Visa Bulletin Explained for Indians: EB1, EB2, EB3 Priority Dates, Final Action & Filing Dates",
    description:
      "Simple guide to the visa bulletin for Indians. Understand EB1, EB2, EB3 India, priority dates, final action dates, dates for filing, retrogression and green card waiting.",
    path: PAGE_PATH,
    type: "article",
    openGraph: { publishedTime: UPDATED, modifiedTime: UPDATED },
  });
}

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Visa Bulletin Guide", url: PAGE_PATH },
];

const faqs: FaqItem[] = [
  {
    question: "What is the visa bulletin?",
    answer:
      "The visa bulletin is a monthly publication from the US Department of State that shows priority date cutoffs for each employment-based (EB) and family-based immigration category by country. For Indian H1B workers pursuing green cards, it determines when their priority date is current — which triggers eligibility to file or receive approval of Form I-485 (adjustment of status).",
  },
  {
    question: "What is a priority date and where do I find it?",
    answer:
      "Your priority date is the date your PERM labor certification was filed with the Department of Labor (for EB-2 and EB-3). For EB-1 and EB-2 NIW, it is the I-140 filing date. It is found on your PERM filing receipt or I-140 approval notice. Your priority date establishes your place in the visa queue — earlier is better.",
  },
  {
    question: "What is the Final Action Date?",
    answer:
      "The Final Action Date (Table A in the visa bulletin) is the cutoff date for green card approval. Your priority date must be earlier than this date for USCIS to approve your I-485. This is the most important date to monitor.",
  },
  {
    question: "What is the Dates for Filing chart?",
    answer:
      "The Dates for Filing (Table B) is an earlier cutoff that sometimes allows you to file I-485 before your Final Action Date is current. Filing under Table B lets you get an EAD and Advance Parole while waiting for your Final Action Date to advance. Table B is only usable when USCIS specifically authorizes it each month — check uscis.gov/visabulletininfo.",
  },
  {
    question: "Why is EB-2 India so far behind?",
    answer:
      "US immigration law limits each country to 7% of annual employment-based green cards. India accounts for a much larger share of EB-2 and EB-3 applicants than 7%, creating a massive backlog. As of the July 2026 Visa Bulletin, EB-2 India is Unavailable — no EB-2 India immigrant visa numbers are authorized for the remainder of FY 2026, so EB-2 India applicants cannot receive final green card approval regardless of priority date. The category is expected to reset in FY 2027, but future movement depends on demand and annual limits.",
  },
  {
    question: "What is retrogression?",
    answer:
      "Retrogression means the visa bulletin moved a cutoff date backward — to an earlier date than the previous month. If your priority date was current last month but is not current this month due to retrogression, your I-485 (if pending) stays open but cannot be approved until your date is current again. If I-485 was not yet filed, you must wait for the date to advance again.",
  },
  {
    question: "Should I file under EB-2 or EB-3 for India?",
    answer:
      "Both EB-2 and EB-3 India have significant backlogs, and neither is consistently faster. In some months EB-3 India is more current; in others EB-2 is ahead. Many Indian applicants pursue both categories simultaneously — filing PERM in EB-2 for their primary path and EB-3 for potential downgrade flexibility. Consult your attorney on the current relative cutoff movement.",
  },
  {
    question: "What does 'C' (Current) mean for India EB-1?",
    answer:
      "If the visa bulletin shows 'C' (Current) for EB-1 India, it means all priority dates in EB-1 qualify for that month — there is no backlog for that category. This is much better than EB-2 or EB-3 India, and is one reason why qualifying for EB-1 (extraordinary ability, outstanding researcher, or multinational executive) is strategically valuable for Indians.",
  },
  {
    question: "Can I file I-485 before my priority date is current?",
    answer:
      "Only if USCIS has authorized the Dates for Filing (Table B) chart for that month AND your priority date qualifies under Table B. Check uscis.gov/visabulletininfo each month for the USCIS Adjustment of Status Filing Chart announcement. Filing under Table B gives you EAD and AP but your case won't be approved until your Final Action Date is also current.",
  },
  {
    question: "My priority date just became current. What do I do?",
    answer:
      "Act promptly. Contact your employer's immigration attorney immediately. Begin assembling the I-485 package: Form I-485, Supplement J, I-131 (Advance Parole), I-765 (EAD), I-864 (Affidavit of Support), and I-693 medical exam from a USCIS civil surgeon. File as quickly as possible — dates can retrogress the following month.",
  },
];

export default function VisaBulletinPage() {
  const url = absoluteUrl(PAGE_PATH);
  const bulletin = CURRENT_VISA_BULLETIN;

  const articleJsonLd = {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: "Visa Bulletin Explained for Indians: EB1, EB2, EB3 Priority Dates",
    description:
      "Complete visa bulletin guide for Indian H1B workers — EB-1, EB-2, EB-3 India priority dates, final action dates, dates for filing, retrogression, and what to do when your date becomes current.",
    datePublished: UPDATED,
    dateModified: UPDATED,
    author: { "@type": "Organization", name: site.publisher },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    keywords:
      "visa bulletin India, EB2 India priority date, EB3 India priority date, EB1 India priority date, final action date vs date of filing, priority date checker India, green card priority date India, retrogression meaning",
  };

  const jsonLd = jsonLdGraph(
    articleJsonLd,
    breadcrumbJsonLd(crumbs),
    faqJsonLd(faqs)
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-[720px] px-4 sm:px-6 lg:px-8">

        {/* breadcrumb */}
        <nav aria-label="Breadcrumb" className="pt-8 mb-5 flex flex-wrap items-center gap-2 text-xs text-ink-400">
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

        {/* hero */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-ink-400">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-700 to-indigo-600 px-3 py-1 text-xs font-semibold text-white">
              📅 Visa Bulletin Guide
            </span>
            <span>Updated {bulletin.month} {bulletin.year}</span>
          </div>
          <h1 className="mt-3 text-[2rem] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[2.5rem]">
            Visa Bulletin Explained for Indians:<br className="hidden sm:block" /> EB-1, EB-2, EB-3 Priority Dates
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-ink-500">
            The visa bulletin is the monthly publication that controls when Indian H1B workers can file or receive approval of their green card. This guide explains every part — priority date, Final Action Date, Dates for Filing, retrogression, and what to do when your date becomes current.
          </p>
        </div>

        {/* July 2026 standing alert */}
        <VisaBulletinAlert className="mb-8" />

        {/* July 2026 bulletin note */}
        <div className="mb-8 rounded-2xl border border-amber-100 bg-amber-50/60 p-5 text-sm leading-relaxed text-amber-900">
          {currentBulletinNote}
        </div>

        {/* ── SECTION 1: Quick answer ─────────────────────────────────────────── */}
        <div className="mb-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">Quick answer</p>
          <p className="text-sm leading-relaxed text-ink-800">
            The visa bulletin sets monthly cutoff dates for green card approval by category (EB-1/EB-2/EB-3) and country. Your <strong>priority date</strong> (PERM filing date) must be <strong>earlier than</strong> the published cutoff to file or receive I-485 approval. For July 2026, EB-2 India is <strong>Unavailable</strong> (no numbers for the remainder of FY 2026) and EB-3 India advanced to January 1, 2014 — Indian backlogs remain measured in years to decades.
          </p>
        </div>

        {/* ── SECTION 2: What is the visa bulletin? ──────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-3">What is the visa bulletin?</h2>
          <p className="text-sm leading-relaxed text-ink-600 mb-4">
            The US Department of State publishes the visa bulletin around the 8th–10th of each month. It sets the priority date cutoffs for employment-based and family-based immigration for each country.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: "📋", title: "Published by", desc: "US Department of State (travel.state.gov)" },
              { icon: "📅", title: "Published when", desc: "Around the 8th–10th of each month, effective the following month" },
              { icon: "🎯", title: "What it controls", desc: "Whether your priority date is current for I-485 filing or approval" },
              { icon: "🌍", title: "Country-specific", desc: "India has different (usually slower) dates than the Rest of World due to per-country caps" },
            ].map((c) => (
              <div key={c.title} className="flex items-start gap-3 rounded-xl border border-ink-900/5 bg-white p-4">
                <span className="text-xl">{c.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-ink-900">{c.title}</p>
                  <p className="text-xs text-ink-500">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 3: Why Indians should care ─────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-3">Why Indians should care about the visa bulletin</h2>
          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
            <p className="font-semibold text-amber-900 mb-2">The per-country 7% cap creates massive India backlogs</p>
            <ul className="space-y-1.5 text-sm text-amber-800">
              <li>• US immigration law limits each country to 7% of annual employment-based green cards</li>
              <li>• India accounts for far more than 7% of EB-2 and EB-3 applicants — creating a severe backlog</li>
              <li>• India EB-2 is Unavailable in the July 2026 bulletin (no numbers for the rest of FY 2026); new applicants face multi-decade waits when numbers return</li>
              <li>• The visa bulletin determines whether you can file I-485 this month — or must wait years longer</li>
              <li>• Retrogression (dates moving backward) can delay green card approval even after I-485 is filed</li>
            </ul>
          </div>
        </section>

        {/* ── SECTION 4: Priority date ────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-3">Priority date explained</h2>
          <div className="overflow-x-auto rounded-2xl border border-ink-900/5">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ink-50/70 text-left">
                  <th className="px-4 py-3 font-semibold text-ink-700">Category</th>
                  <th className="px-4 py-3 font-semibold text-ink-700">Priority date = ?</th>
                  <th className="px-4 py-3 font-semibold text-ink-700">Where to find it</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-900/5 bg-white">
                <tr>
                  <td className="px-4 py-3 font-medium text-ink-800">EB-2 / EB-3</td>
                  <td className="px-4 py-3 text-ink-700">Date PERM was filed with DOL</td>
                  <td className="px-4 py-3 text-ink-500">PERM receipt or I-140 approval notice (I-797)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-ink-800">EB-1 / EB-2 NIW</td>
                  <td className="px-4 py-3 text-ink-700">Date I-140 was filed with USCIS</td>
                  <td className="px-4 py-3 text-ink-500">I-140 receipt notice or approval notice</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-ink-500">
            <Link href="/visa-bulletin/priority-date" className="text-brand-600 underline">Read the full priority date guide →</Link>
          </p>
        </section>

        {/* ── SECTION 5: Final Action Date ────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-3">Final Action Date (Table A) explained</h2>
          <p className="text-sm text-ink-600 mb-4">
            The Final Action Date is the most important cutoff. Your priority date must be <strong>earlier than</strong> this date for USCIS to approve your green card. This date is always published — it is never optional. When a category shows <strong>&ldquo;U&rdquo; (Unavailable)</strong>, no visa numbers are authorized that month and no case can be approved regardless of priority date.
          </p>
          <div className="rounded-2xl border border-ink-900/5 bg-white p-5">
            <p className="text-sm font-semibold text-ink-900 mb-2">Current Final Action Dates ({bulletin.month} {bulletin.year})</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left bg-ink-50/50">
                    <th className="px-3 py-2 font-semibold text-ink-700">Category</th>
                    <th className="px-3 py-2 font-semibold text-ink-700">India</th>
                    <th className="px-3 py-2 font-semibold text-ink-700">Other countries</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-900/5">
                  {(["EB1", "EB2", "EB3"] as const).map((cat) => (
                    <tr key={cat}>
                      <td className="px-3 py-2 font-medium text-ink-800">{cat}</td>
                      <td className="px-3 py-2 text-ink-700">
                        {bulletin.finalActionDates[cat].india === "C" ? "Current (C)" :
                         bulletin.finalActionDates[cat].india === "U" ? "Unavailable" :
                         bulletin.finalActionDates[cat].india}
                      </td>
                      <td className="px-3 py-2 text-ink-500">
                        {bulletin.finalActionDates[cat].other === "C" ? "Current (C)" :
                         bulletin.finalActionDates[cat].other === "U" ? "Unavailable" :
                         bulletin.finalActionDates[cat].other}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-ink-400">
              Data from {bulletin.month} {bulletin.year} bulletin. Always verify at{" "}
              <a href="https://travel.state.gov" target="_blank" rel="noopener noreferrer" className="underline">travel.state.gov</a>.
            </p>
          </div>
        </section>

        {/* ── SECTION 6: Dates for Filing ─────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-3">Dates for Filing (Table B) explained</h2>
          <p className="text-sm text-ink-600 mb-4">
            Table B shows earlier cutoff dates that sometimes allow you to file I-485 before Final Action Date is current — but only when USCIS authorizes it each month.
          </p>
          {bulletin.datesForFiling && (
            <div className="rounded-2xl border border-ink-900/5 bg-white p-5 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-semibold text-ink-900">Dates for Filing ({bulletin.month} {bulletin.year})</p>
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${bulletin.usingDatesForFiling ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                  {bulletin.usingDatesForFiling ? "USCIS authorized this month" : "USCIS not authorized this month"}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left bg-ink-50/50">
                      <th className="px-3 py-2 font-semibold text-ink-700">Category</th>
                      <th className="px-3 py-2 font-semibold text-ink-700">India</th>
                      <th className="px-3 py-2 font-semibold text-ink-700">Other countries</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-900/5">
                    {(["EB1", "EB2", "EB3"] as const).map((cat) => (
                      <tr key={cat}>
                        <td className="px-3 py-2 font-medium text-ink-800">{cat}</td>
                        <td className="px-3 py-2 text-ink-700">
                          {bulletin.datesForFiling![cat].india === "C" ? "Current (C)" :
                           bulletin.datesForFiling![cat].india === "U" ? "Unavailable" :
                           bulletin.datesForFiling![cat].india}
                        </td>
                        <td className="px-3 py-2 text-ink-500">
                          {bulletin.datesForFiling![cat].other === "C" ? "Current (C)" :
                           bulletin.datesForFiling![cat].other === "U" ? "Unavailable" :
                           bulletin.datesForFiling![cat].other}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <p className="text-xs text-ink-500">
            <Link href="/visa-bulletin/final-action-date-vs-date-of-filing" className="text-brand-600 underline">Full guide: Final Action Date vs Dates for Filing →</Link>
          </p>
        </section>

        {/* ── SECTION 7: Which chart for I-485 ───────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-3">Which chart matters for filing I-485?</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
              <p className="font-semibold text-emerald-900 mb-1">Table A (Final Action Date)</p>
              <ul className="space-y-1 text-sm text-emerald-800">
                <li>• Always controls I-485 approval</li>
                <li>• Required every month — no exception</li>
                <li>• If current: USCIS can file AND approve</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
              <p className="font-semibold text-blue-900 mb-1">Table B (Dates for Filing)</p>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Only valid when USCIS authorizes it monthly</li>
                <li>• If authorized + current: can file I-485, get EAD/AP</li>
                <li>• Green card approval still waits for Table A</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── SECTION 8: EB-1 India ───────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-3">EB-1 India: the fastest employment green card path</h2>
          <p className="text-sm text-ink-600 mb-3">
            EB-1 skips PERM entirely and has a much shorter India backlog than EB-2 or EB-3. Three sub-categories:
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              { cat: "EB-1A", who: "Extraordinary ability", perm: "No — self-petition" },
              { cat: "EB-1B", who: "Outstanding researcher/professor", perm: "No — employer petition" },
              { cat: "EB-1C", who: "Multinational manager/exec", perm: "No — employer petition" },
            ].map((c) => (
              <div key={c.cat} className="rounded-xl border border-ink-900/5 bg-white p-3.5">
                <p className="font-semibold text-ink-900 text-sm">{c.cat}</p>
                <p className="text-xs text-ink-600 mt-0.5">{c.who}</p>
                <p className="text-xs text-emerald-700 mt-1 font-medium">{c.perm}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-ink-500">
            <Link href="/visa-bulletin/eb1-india" className="text-brand-600 underline">Full EB-1 India guide →</Link>
          </p>
        </section>

        {/* ── SECTION 9: EB-2 India ───────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-3">EB-2 India: advanced degree workers and NIW</h2>
          <p className="text-sm text-ink-600 mb-3">
            EB-2 requires a master's degree (or bachelor's + 5 years progressive experience). EB-2 NIW allows self-petition if work benefits the US national interest — no PERM needed. For July 2026, EB-2 India is <strong>Unavailable</strong> — no immigrant visa numbers are authorized for the remainder of FY 2026, so no EB-2 India case can receive final approval this month regardless of priority date.
          </p>
          <div className="rounded-xl border border-amber-100 bg-amber-50/50 px-4 py-3 text-xs text-amber-900">
            <strong className="font-semibold">India EB-2 current Final Action Date ({bulletin.month} {bulletin.year}):</strong>{" "}
            {bulletin.finalActionDates.EB2.india === "C" ? "Current (C)" :
             bulletin.finalActionDates.EB2.india === "U" ? "Unavailable" :
             bulletin.finalActionDates.EB2.india}
            {" "}— verify at travel.state.gov
          </div>
          <p className="mt-3 text-xs text-ink-500">
            <Link href="/visa-bulletin/eb2-india" className="text-brand-600 underline">Full EB-2 India guide →</Link>
          </p>
        </section>

        {/* ── SECTION 10: EB-3 India ──────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-3">EB-3 India: bachelor&apos;s degree holders and skilled workers</h2>
          <p className="text-sm text-ink-600 mb-3">
            EB-3 covers professionals (bachelor&apos;s degree) and skilled workers (2+ years experience). Like EB-2 India, the wait is long — but EB-2 and EB-3 India move independently, creating the EB-2/EB-3 downgrade strategy.
          </p>
          <div className="rounded-xl border border-amber-100 bg-amber-50/50 px-4 py-3 text-xs text-amber-900">
            <strong className="font-semibold">India EB-3 current Final Action Date ({bulletin.month} {bulletin.year}):</strong>{" "}
            {bulletin.finalActionDates.EB3.india === "C" ? "Current (C)" :
             bulletin.finalActionDates.EB3.india === "U" ? "Unavailable" :
             bulletin.finalActionDates.EB3.india}
            {" "}— verify at travel.state.gov
          </div>
          <p className="mt-3 text-xs text-ink-500">
            <Link href="/visa-bulletin/eb3-india" className="text-brand-600 underline">Full EB-3 India guide + downgrade strategy →</Link>
          </p>
        </section>

        {/* ── SECTION 11: Retrogression ───────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-3">Retrogression: when dates move backward</h2>
          <p className="text-sm text-ink-600 mb-4">
            Retrogression means the bulletin moved a cutoff date to an earlier date than the prior month — reducing the number of qualifying priority dates. It happens when visa demand is high and the per-country cap is consumed.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
              <p className="font-semibold text-emerald-900 mb-1">If I-485 is already filed</p>
              <p className="text-sm text-emerald-800">Retrogression does NOT cause denial or abandonment. USCIS holds the case until your date is current again. EAD and AP remain renewable.</p>
            </div>
            <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4">
              <p className="font-semibold text-rose-900 mb-1">If I-485 is not yet filed</p>
              <p className="text-sm text-rose-800">You cannot file I-485 during retrogression (unless Table B is still authorized). Wait for your date to become current again.</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-ink-500">
            <Link href="/visa-bulletin/retrogression" className="text-brand-600 underline">Full retrogression guide →</Link>
          </p>
        </section>

        {/* ── SECTION 12: What happens when current ──────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-3">What happens when your priority date becomes current?</h2>
          <div className="space-y-2">
            {[
              { n: "1", text: "Check Table A and USCIS Table B authorization immediately" },
              { n: "2", text: "Contact your employer's immigration attorney the same day" },
              { n: "3", text: "Schedule a USCIS civil surgeon for I-693 medical exam (books up fast)" },
              { n: "4", text: "Prepare I-485 package: I-485 + Supp J + I-131 + I-765 + I-864 + I-693" },
              { n: "5", text: "File I-485 as fast as possible — do not wait until end of month" },
              { n: "6", text: "Do NOT travel internationally after filing until Advance Parole is approved" },
            ].map((s) => (
              <div key={s.n} className="flex items-start gap-3 rounded-xl border border-ink-900/5 bg-white p-3">
                <span className="flex-none flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-800">{s.n}</span>
                <p className="text-sm text-ink-700">{s.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-ink-500">
            <Link href="/visa-bulletin/priority-date-current-what-next" className="text-brand-600 underline">Full guide: priority date current — what to do next →</Link>
          </p>
        </section>

        {/* ── SECTION 13: Common mistakes ─────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-3">Common mistakes Indians make with the visa bulletin</h2>
          <div className="space-y-2">
            {[
              { bad: "Assuming Table B is always available", fix: "USCIS must authorize Table B each month — check uscis.gov/visabulletininfo every month" },
              { bad: "Confusing PERM certification date with PERM filing date", fix: "Your priority date is the PERM filing date (when ETA-9089 was submitted to DOL), not when DOL certified it" },
              { bad: "Waiting until the last week of the month to file I-485", fix: "File in the first 2 weeks of the month — dates can retrogress and windows close fast" },
              { bad: "Traveling internationally after filing I-485 without AP", fix: "Never travel without an approved Advance Parole — it can cause your I-485 to be considered abandoned" },
              { bad: "Not tracking the bulletin monthly", fix: "Set a recurring calendar reminder for the 9th of each month to check the new bulletin" },
              { bad: "Assuming EB-3 is always faster than EB-2 for India", fix: "EB-2 and EB-3 India move independently — check the actual current bulletin, not assumptions" },
            ].map((m, i) => (
              <div key={i} className="rounded-xl border border-ink-900/5 bg-white p-4">
                <p className="text-sm font-semibold text-rose-700">✗ {m.bad}</p>
                <p className="mt-1 text-sm text-emerald-700">✓ {m.fix}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 14: Priority Date Checker tool ──────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-3">Check your priority date against the {bulletin.month} {bulletin.year} bulletin</h2>
          <PriorityDateChecker />
        </section>

        {/* ── SECTION 15: Monthly update placeholder ──────────────────────────── */}
        <section className="mb-10">
          <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">Monthly bulletin update</p>
            <p className="font-semibold text-ink-900">{bulletin.month} {bulletin.year} Visa Bulletin Summary for India</p>
            <p className="mt-2 text-sm text-ink-600">
              Bulletin data in this tool is updated monthly. For the official current bulletin, check{" "}
              <a href={bulletin.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-brand-600 underline font-semibold">
                travel.state.gov
              </a>.
            </p>
            <p className="mt-2 text-sm text-ink-600">
              For USCIS filing authorization (Table B), check{" "}
              <a href="https://www.uscis.gov/green-card/green-card-processes-and-procedures/visa-availability-priority-dates/visa-bulletin-information-for-adjustment-of-status-filing-chart" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline font-semibold">
                uscis.gov/visabulletininfo
              </a>.
            </p>
            <Link href="/visa-bulletin/monthly-update"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700">
              How to track the monthly bulletin →
            </Link>
          </div>
        </section>

        {/* ── Child pages grid ────────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-4">Explore this visa bulletin guide</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {visaBulletinChildPages.map((p) => (
              <Link key={p.slug} href={`/visa-bulletin/${p.slug}`}
                className="group rounded-2xl border border-ink-900/10 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 mb-0.5">Visa bulletin</p>
                <h3 className="font-semibold text-ink-900 group-hover:text-blue-700">{p.navLabel}</h3>
                <p className="mt-1.5 text-sm text-ink-500 line-clamp-2">{p.excerpt}</p>
                <p className="mt-2 text-xs text-ink-400">{p.readingTime} min read</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── SECTION 16: FAQ ─────────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-4">Frequently asked questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-ink-900/5 bg-white p-5">
                <p className="font-semibold text-ink-900">{faq.question}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* related links */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-ink-900 mb-3">Related guides and tools</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { href: "/green-card", label: "Green Card Guide", desc: "PERM, I-140, priority date, I-485, EAD — full process" },
              { href: "/tools/priority-date-checker", label: "Priority Date Checker", desc: "Compare your date to the current bulletin" },
              { href: "/tools/green-card-stage-finder", label: "Green Card Stage Finder", desc: "Find your current stage and what to do next" },
              { href: "/uscis/case-status", label: "USCIS Case Status Guide", desc: "What your USCIS case status means" },
            ].map((l) => (
              <Link key={l.href} href={l.href}
                className="group rounded-xl border border-ink-900/10 bg-white p-4 transition hover:border-blue-400 hover:shadow-sm">
                <p className="text-sm font-semibold text-ink-900 group-hover:text-blue-700">{l.label}</p>
                <p className="mt-0.5 text-xs text-ink-500">{l.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* disclaimer */}
        <div className="mb-10 rounded-2xl border border-ink-900/5 bg-ink-50/50 p-5 text-xs leading-relaxed text-ink-500">
          <strong className="font-semibold text-ink-700">Disclaimer: </strong>
          This guide is for general educational purposes only and is not legal or immigration advice. Visa bulletin cutoff dates change monthly and the data shown in this guide may not reflect the current month. Always verify the latest data at{" "}
          <a href="https://travel.state.gov" target="_blank" rel="noopener noreferrer nofollow" className="text-brand-600 underline">travel.state.gov</a>{" "}
          and{" "}
          <a href="https://www.uscis.gov" target="_blank" rel="noopener noreferrer nofollow" className="text-brand-600 underline">uscis.gov</a>.{" "}
          Consult a licensed immigration attorney for advice specific to your situation.
        </div>

      </div>

      <Newsletter />
    </>
  );
}
