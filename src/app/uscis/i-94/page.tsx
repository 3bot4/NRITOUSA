import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ReviewedByline from "@/components/ReviewedByline";
import AuthorBioBox from "@/components/AuthorBioBox";
import Newsletter from "@/components/Newsletter";
import NotLegalAdvice from "@/components/tools/NotLegalAdvice";
import OfficialSourceBox from "@/components/tools/OfficialSourceBox";
import ToolFaq from "@/components/tools/ToolFaq";
import I94DayCounter from "@/components/tools/I94DayCounter";
import {
  DaysByYearChart,
  AbsenceTimelineChart,
  ThreeDocumentsDiagram,
  DsVsDateDiagram,
  HistoryLimitsChart,
} from "@/components/tools/i94/I94Visuals";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";
import { site } from "@/lib/site";
import { formatDate } from "@/lib/format";
import {
  COMMON_MISMATCH,
  DS_NOTATION,
  GET_MOST_RECENT_I94,
  GET_TRAVEL_HISTORY,
  HISTORY_LIMITS,
  I102_FEES,
  I94_BASICS,
  I94_ERRORS,
  I94_PUBLISHED,
  I94_SOURCES as SRC,
  I94_UPDATED,
  I94_VERIFIED,
  LAND_DEPARTURE_NOTE,
  N400_TRIP_RULES,
  RECAPTURE_NOTE,
  SPT_FORMULA,
  THREE_DOCUMENTS,
} from "@/data/i94Data";

/**
 * /uscis/i-94 — the I-94 pillar.
 *
 * Owns: what an I-94 is, retrieval step by step, the travel history and its
 * four limits, D/S, the three-document comparison, and Form I-102.
 *
 * Does NOT own, and only summarises with a link:
 *   Passport-truncated admit-until dates → /h1b-denied-entry-airport
 *   Deferred inspection corrections      → /h1b-denied-entry-airport
 *   The 240-day rule                     → /h1b/extension
 *   The 60-day grace period              → /h1b/layoff-60-day-grace-period
 *   I-797A tear-off I-94s                → /uscis/i-797-notice, /uscis/approval-notice
 *   Automatic visa revalidation          → /automatic-visa-revalidation
 *   The substantial presence test itself → /articles/substantial-presence-test-explained
 *   N-400 continuous residence rules     → /green-card/travel-rules
 * See docs/seo/oct-2026-cluster/overlap-report.md §3.4, which records why this
 * page was written despite 47% of its planned subtopics being owned elsewhere.
 */

const PAGE_PATH = "/uscis/i-94";

export const metadata: Metadata = pageMetadata({
  title: "I-94 Travel History: How to Get It, and the Four Things It Leaves Out",
  description:
    "Your I-94 governs how long you may stay — not your visa and not your I-797. How to download the record and the travel history, what D/S means, and the four limits CBP puts on the history: ten years only, most land crossings missing, not an official record, and green card holders locked out entirely.",
  path: PAGE_PATH,
  type: "article",
  openGraph: { publishedTime: I94_PUBLISHED, modifiedTime: I94_UPDATED },
});

const crumbs = [
  { name: "Home", url: "/" },
  { name: "USCIS Guide", url: "/uscis" },
  { name: "Form I-94", url: PAGE_PATH },
];

const faqs: FaqItem[] = [
  {
    question: "What is Form I-94?",
    answer:
      "Form I-94 is your arrival/departure record — the record of the admission CBP actually gave you. It states the class of admission and the date to which you were admitted, and that date is what governs how long you may stay. Not your visa, which only lets you travel to a port of entry and ask to be admitted, and not your I-797, which sets a petition's validity. For almost everyone the I-94 is now electronic and you retrieve or print it yourself at i94.cbp.dhs.gov.",
  },
  {
    question: "How do I check my I-94 travel history?",
    answer:
      "Go to i94.cbp.dhs.gov and choose View Travel History — a different screen from Get Most Recent I-94, which is where people commonly end up by mistake. Enter your family name, first name, date of birth, passport number and country of issuance exactly as they appear in your passport. The table lists each crossing with the date and the port. Export the PDF before you count anything with it.",
  },
  {
    question: "How far back does I-94 travel history go?",
    answer:
      "Ten years. CBP's own FAQ states the travel-history module provides arrival and departure dates, including the port of entry or exit, for the past ten years only. It used to be five, and plenty of third-party guides still say five — DHS's privacy impact assessment for the I-94 website records the change. Travel on a passport that has since expired is still shown.",
  },
  {
    question: "Why is my travel history missing a trip?",
    answer:
      "Most likely because it was a land crossing. CBP states that certain types of travel may not appear on the website, including most land-border arrivals and departures. There is a sharper version of the problem: if you received an electronic I-94 and departed by land, CBP says the departure may not be recorded accurately unless you re-enter before your passport expires — which can leave your last recorded event as an arrival and make the record read as though you never left. Carry evidence of a land departure.",
  },
  {
    question: "Can green card holders check their travel history on the I-94 website?",
    answer:
      "No. CBP states that US citizens and lawful permanent residents cannot retrieve their travel history using the I-94 website and must submit a Freedom of Information Act request instead. That is the sharpest edge in this whole system, because the person who most needs a long trip log — a permanent resident preparing an N-400, which asks about every trip since you became a resident — is the one person the tool will not serve. FOIA runs in months, so request it well before you file.",
  },
  {
    question: "What does D/S mean on an I-94?",
    answer:
      "Duration of Status. Instead of a date you are admitted for as long as you maintain the terms of your status. F-1 and F-2, J-1 and J-2, M-1 and M-2, the A and G diplomatic classes and the I media class get D/S. H, L, O, E, TN and B classes get a date. D/S is not a longer permission and in one respect it is riskier: there is no date to warn you when the underlying condition stops being met, so you can be out of status with no document having expired.",
  },
  {
    question: "What is the difference between my visa expiry and my I-94 date?",
    answer:
      "Different documents doing different jobs. A visa lets you travel to a port of entry and ask to be admitted; the I-94 records the admission you were given. If your visa expires while you are in the United States, you may stay for the whole I-94 period — the expired visa does not shorten it — but you cannot leave and come back without a new visa, which means a consular appointment. If your I-94 expires while you are here, your authorised stay has ended, whatever your visa says.",
  },
  {
    question: "My I-94 date is earlier than my petition validity. Is that a mistake?",
    answer:
      "Usually not. CBP routinely admits a traveller only to the expiry of their passport, so an admit-until date that matches your passport rather than your I-797 is the normal outcome rather than an error. The fix is a new passport and then a new admission or a corrected record, not an argument at the airport. Our denied-entry guide covers this and the genuine-error cases in full.",
  },
  {
    question: "How do I fix an error on my I-94?",
    answer:
      "Through a CBP deferred inspection site, of which there are more than 70. They exist to review and correct certain errors on admission documents after admission — an improper nonimmigrant classification, an incorrect period of admission, or inaccurate biographical information. Go quickly and take the petition, the approval notice and the visa. A wrong class of admission is the error that matters most, because on paper it strips your work authorisation.",
  },
  {
    question: "How do I replace a lost I-94?",
    answer: `Form I-102, Application for Replacement/Initial Nonimmigrant Arrival-Departure Document. From Form G-1055 the fee is ${I102_FEES.filing}, plus a separate ${I102_FEES.extra} ${I102_FEES.extraLabel} submitted apart from the filing fee. That additional fee is not charged if you are replacing a lost, stolen or mutilated Form I-94W or Form I-95. For an electronic I-94 you usually do not need I-102 at all — just reprint it from the CBP site.`,
  },
  {
    question: "Can I use my I-94 travel history for the substantial presence test?",
    answer: `It is where most people get their days from, and it is also where most people get them slightly wrong. The test needs 31 days in the tax year and 183 weighted days across three years, counting the current year at one, the first preceding year at one third and the second preceding at one sixth. Both the arrival day and the departure day count as days of presence. Then read the limits: ten years of history, most land crossings missing, and expressly not an official record — so reconcile against passport stamps before relying on a number. A day count is also not a residency determination: exempt-individual years, the closer-connection exception and the India-US treaty all change the answer.`,
  },
  {
    question: "Does my travel history matter for N-400 and citizenship?",
    answer: `Yes, in two ways. Form N-400 asks about trips outside the United States, and the thresholds in 8 CFR 316.5(c)(1) are a single absence of more than six months, which disrupts continuous residence unless you rebut it, and one year or more, which breaks it. The day counter on this page flags both. What the thresholds mean, and who the narrow N-470 route is actually open to — it requires qualifying employment under INA 316(b), which an ordinary posting to a foreign company is not — are on our green card travel rules page. The awkward part is that as a permanent resident you cannot get the history from the I-94 site at all.`,
  },
];

const jsonLd = jsonLdGraph(
  {
    "@type": "Article",
    "@id": `${absoluteUrl(PAGE_PATH)}#article`,
    headline:
      "Form I-94 and your travel history: how to get it, how to read it, and the four things it leaves out",
    description:
      "The I-94 governs your authorised stay. Step-by-step retrieval for the record and the travel history, D/S explained, the visa versus I-94 versus I-797 comparison, Form I-102, and a day counter for the substantial presence test and N-400 trip thresholds.",
    datePublished: I94_PUBLISHED,
    dateModified: I94_UPDATED,
    author: { "@id": `${site.url}/#organization` },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(PAGE_PATH) },
    url: absoluteUrl(PAGE_PATH),
    inLanguage: "en-US",
    isAccessibleForFree: true,
  },
  faqJsonLd(faqs),
  breadcrumbJsonLd(crumbs),
);

export default function I94Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        <header className="border-b border-ink-900/5 bg-white pt-6 pb-7 sm:pt-9">
          <Container>
            <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-xs text-ink-400">
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

            <h1 className="max-w-3xl text-2xl font-black tracking-tight text-ink-900 sm:text-4xl">
              Your I-94, and the four things the travel history leaves out
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-700 sm:text-lg">
              Your authorised stay is set by your current I-94 &mdash; including
              an updated I-94 attached to the bottom of a Form I-797A &mdash; not
              by the visa expiry date and not by an approval notice with no I-94
              on it. Get it at{" "}
              <strong>i94.cbp.dhs.gov</strong>. The travel history goes back{" "}
              <strong>ten years</strong>, omits <strong>most land
              crossings</strong>, is <strong>not an official record</strong>, and
              is <strong>closed to green card holders and citizens</strong> — who
              have to file a FOIA request instead.
            </p>

            <p className="mt-3 max-w-3xl text-sm text-ink-500">
              Last verified {formatDate(I94_VERIFIED)} against CBP&rsquo;s I-94
              page and FAQ, DHS/CBP/PIA-016(a), and Form G-1055.
            </p>

            <ul className="mt-5 grid max-w-3xl gap-2 sm:grid-cols-2">
              {[
                "Download it after every single entry — free, and the only cheap moment to catch an error",
                "D/S means no date at all, which is riskier rather than safer",
                "A valid I-94 with an expired visa: you may stay, you cannot re-enter",
                "Most land-border departures may not be recorded at all",
                "An admit-until date matching your passport is normal, not an error",
                "Form I-102 replaces a lost paper I-94 — $560 plus $24",
              ].map((f) => (
                <li
                  key={f}
                  className="flex gap-2 rounded-xl border border-ink-900/5 bg-ink-900/[0.02] px-3.5 py-2.5 text-sm leading-relaxed text-ink-700"
                >
                  <span aria-hidden className="text-brand-600">
                    ▸
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <ReviewedByline date={I94_UPDATED} path={PAGE_PATH} className="mt-5" />
            <NotLegalAdvice className="mt-4 max-w-3xl" />
          </Container>
        </header>

        {/* ══════════ The tool ══════════ */}
        <section id="day-counter" className="scroll-mt-24 bg-ink-900/[0.02] py-10 sm:py-14">
          <Container>
            <div className="mx-auto mb-6 max-w-3xl">
              <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                Count your days
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                Paste your travel history or enter the trips. You get days
                present per calendar year, a substantial presence estimate on the
                statutory one, one-third, one-sixth weighting, and a flag on any
                single absence that crosses the six-month or one-year
                continuous-residence thresholds. Nothing is stored or sent.
              </p>
            </div>
            <I94DayCounter />
          </Container>
        </section>

        <section className="border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <div className="mx-auto max-w-[760px] space-y-10 text-[0.975rem] leading-relaxed text-ink-700">
              {/* ── 1. What it is ── */}
              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  What the I-94 is, and why it outranks your visa
                </h2>
                <div className="mt-3 rounded-2xl border border-sky-200 bg-sky-50/50 p-5">
                  <p className="text-sm font-bold text-ink-900">
                    One precision worth getting right
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">
                    &ldquo;The I-94 governs, not the I-797&rdquo; is a useful
                    shorthand and slightly wrong. When USCIS approves a change or
                    extension of status it issues{" "}
                    <strong>Form I-797A with a new I-94 attached</strong> at the
                    bottom, and that attached I-94 becomes your current record —
                    no border crossing involved. What is always true is narrower:
                    your authorised stay is set by your{" "}
                    <strong>most recent I-94</strong>, whether CBP created it at a
                    port of entry or USCIS issued it on an I-797A. An approval
                    notice with no I-94 on it does not extend your stay.
                  </p>
                </div>
                <p className="mt-3">{I94_BASICS.what}</p>
                <p className="mt-3">
                  <strong>Electronic by default. </strong>
                  {I94_BASICS.electronic}
                </p>
                <p className="mt-3">
                  <strong>Paper, still possible. </strong>
                  {I94_BASICS.paper}
                </p>
                <p className="mt-3">
                  <strong>It is also your registration record. </strong>
                  {I94_BASICS.registration}{" "}
                  <span className="text-xs text-ink-400">{I94_BASICS.registrationCite}</span>{" "}
                  That is worth knowing if the federal registration requirement
                  reached you &mdash;{" "}
                  <Link href="/uscis/a-number" className="text-brand-600 underline">
                    the A-number page
                  </Link>{" "}
                  works through who it actually applies to.
                </p>
                <div className="mt-4 rounded-2xl border border-brand-200 bg-brand-50/50 p-5">
                  <p className="text-sm font-bold text-ink-900">
                    The one habit worth building
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">
                    {I94_BASICS.checkEveryEntry}
                  </p>
                </div>
              </div>

              {/* ── 2. Three documents ── */}
              <div id="three-documents" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Visa, I-94, I-797: three documents, three jobs
                </h2>
                <div className="overflow-x-auto">
                  <div className="min-w-[560px]">
                    <ThreeDocumentsDiagram />
                  </div>
                </div>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[720px] border-collapse text-sm">
                    <caption className="sr-only">
                      The visa, the I-94 and the I-797 compared on six questions
                    </caption>
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Question
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Visa foil
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Form I-94
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          Form I-797
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {THREE_DOCUMENTS.map((r) => (
                        <tr key={r.question} className="border-b border-ink-900/5 align-top">
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {r.question}
                          </th>
                          <td className="py-3 pr-3">{r.visa}</td>
                          <td className="py-3 pr-3 bg-brand-50/30 font-medium text-ink-800">
                            {r.i94}
                          </td>
                          <td className="py-3">{r.i797}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
                  <p className="text-sm font-bold text-ink-900">
                    The combination NRI travellers hit constantly
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">{COMMON_MISMATCH}</p>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-700">
                    One narrow exception to the re-entry half of that, and it is
                    narrower than it reads: automatic visa revalidation lets some
                    travellers re-enter on an expired visa after a trip of 30
                    days or less solely to Canada or Mexico, under seven
                    conditions in 22 CFR 41.112(d).{" "}
                    <Link href="/automatic-visa-revalidation" className="text-brand-600 underline">
                      The automatic revalidation page
                    </Link>{" "}
                    owns that rule, including the condition almost everyone gets
                    wrong and an eligibility checker.
                  </p>
                </div>
                <p className="mt-4">
                  For the I-797 side of the table, and the tear-off I-94 that
                  comes attached to an I-797A on an approved change or extension
                  of status, see{" "}
                  <Link href="/uscis/i-797-notice" className="text-brand-600 underline">
                    reading a Form I-797 notice
                  </Link>{" "}
                  and{" "}
                  <Link href="/uscis/approval-notice" className="text-brand-600 underline">
                    what an approval notice does and does not mean
                  </Link>
                  .
                </p>
              </div>

              {/* ── 3. Retrieval ── */}
              <div id="how-to-get" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  How to get it, step by step
                </h2>
                <p className="mt-3">
                  Two different lookups on the same site, and people conflate
                  them constantly. One gives you the current admission record.
                  The other gives you the list of crossings.
                </p>
                <div className="mt-4 grid gap-5 sm:grid-cols-2">
                  <div className="rounded-2xl border border-ink-900/5 bg-ink-900/[0.02] p-5">
                    <p className="text-sm font-bold text-ink-900">
                      Get Most Recent I-94
                    </p>
                    <p className="mt-0.5 text-xs text-ink-400">
                      Your current admission record
                    </p>
                    <ol className="mt-3 space-y-2.5">
                      {GET_MOST_RECENT_I94.map((s) => (
                        <li key={s.n} className="flex gap-2.5">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-[0.65rem] font-bold text-white">
                            {s.n}
                          </span>
                          <span className="text-sm leading-relaxed">
                            <strong className="text-ink-900">{s.title}. </strong>
                            <span className="text-ink-600">{s.detail}</span>
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="rounded-2xl border border-ink-900/5 bg-ink-900/[0.02] p-5">
                    <p className="text-sm font-bold text-ink-900">View Travel History</p>
                    <p className="mt-0.5 text-xs text-ink-400">Your list of crossings</p>
                    <ol className="mt-3 space-y-2.5">
                      {GET_TRAVEL_HISTORY.map((s) => (
                        <li key={s.n} className="flex gap-2.5">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink-700 text-[0.65rem] font-bold text-white">
                            {s.n}
                          </span>
                          <span className="text-sm leading-relaxed">
                            <strong className="text-ink-900">{s.title}. </strong>
                            <span className="text-ink-600">{s.detail}</span>
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[600px] border-collapse text-sm">
                    <caption className="sr-only">
                      What the I-94 lookup asks for, and how the matching works
                    </caption>
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Field
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          What to enter, and where it goes wrong
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {[
                        {
                          f: "Family name",
                          d: "Exactly as the passport prints it. An Indian passport that puts the surname first, or carries a single-field name, is the usual cause of a lookup that returns nothing — try the fields swapped, and try the whole name in the first-name field, before concluding the record is wrong.",
                        },
                        {
                          f: "First (given) name",
                          d: "Include a middle name here if the passport prints it as part of the given name.",
                        },
                        { f: "Date of birth", d: "As printed. Check the day/month order against the passport rather than habit." },
                        {
                          f: "Passport number",
                          d: "The passport you actually travelled on, which may be an expired one. Travel on an expired passport is still shown in the history.",
                        },
                        { f: "Country of issuance", d: "The issuing country, not your country of residence." },
                      ].map((r) => (
                        <tr key={r.f} className="border-b border-ink-900/5 align-top">
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {r.f}
                          </th>
                          <td className="py-3">{r.d}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[560px] border-collapse text-sm">
                    <caption className="sr-only">
                      The four fields on an I-94 record and what each one means
                    </caption>
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          On the record
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          What it tells you
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {[
                        {
                          f: "Admit Until Date",
                          d: "The date your authorised stay ends. A date, or D/S. This is the single most important field on the document.",
                        },
                        {
                          f: "Class of Admission",
                          d: "The status you were admitted in — H1B, L2S, F1, B2. Check it against the status you were actually granted. A wrong value here strips your work authorisation on paper.",
                        },
                        {
                          f: "Admission (record) Number",
                          d: "Eleven characters, new for every admission, and not your A-number. Records issued before May 2019 are all digits; from May 2019 CBP issues nine digits, then a letter, then a digit — 012345678A1 is the shape. A form that rejects a letter here is a form with a stale validation rule, not a wrong I-94.",
                        },
                        {
                          f: "Most Recent Date of Entry",
                          d: "The arrival this record covers. In the travel history, each row is one crossing with its port.",
                        },
                      ].map((r) => (
                        <tr key={r.f} className="border-b border-ink-900/5 align-top">
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {r.f}
                          </th>
                          <td className="py-3">{r.d}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── 4. The limits ── */}
              <div id="limits" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Four limits on the travel history
                </h2>
                <p className="mt-3">
                  This is the part of the topic that matters most and gets
                  written about least. Guides tell you to download the history;
                  almost none tell you what it does not contain. All four of
                  these come from CBP&rsquo;s own material.
                </p>
                <div className="overflow-x-auto">
                  <div className="min-w-[520px]">
                    <HistoryLimitsChart />
                  </div>
                </div>
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[700px] border-collapse text-sm">
                    <caption className="sr-only">
                      The four limits on a CBP travel history, with the
                      consequence of each
                    </caption>
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          The limit
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          What CBP says
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          What it costs you
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {HISTORY_LIMITS.map((l, i) => (
                        <tr
                          key={l.limit}
                          className={`border-b border-ink-900/5 align-top ${
                            i === 3 ? "bg-rose-50/40" : ""
                          }`}
                        >
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {l.limit}
                          </th>
                          <td className="py-3 pr-3">{l.detail}</td>
                          <td className="py-3 text-ink-500">{l.consequence}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
                  <p className="text-sm font-bold text-ink-900">
                    Land departures are the specific trap
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">
                    {LAND_DEPARTURE_NOTE}
                  </p>
                </div>
                <p className="mt-4">
                  The practical consequence of all four together: treat the
                  history as a <strong>starting document</strong>. For anything
                  consequential &mdash; an N-400, a recapture claim, a tax
                  residency position &mdash; reconcile it against passport
                  stamps, boarding passes and your own records, and keep that
                  reconciliation with the PDF.
                </p>
              </div>

              {/* ── 5. D/S ── */}
              <div id="ds" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  D/S: no date, and why that is not good news
                </h2>
                <p className="mt-3">
                  <strong>D/S stands for {DS_NOTATION.stands}. </strong>
                  {DS_NOTATION.what}
                </p>
                <div className="overflow-x-auto">
                  <div className="min-w-[520px]">
                    <DsVsDateDiagram />
                  </div>
                </div>
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[600px] border-collapse text-sm">
                    <caption className="sr-only">
                      Which nonimmigrant classes are admitted D/S and which get a
                      date
                    </caption>
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Class
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          Admitted for
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {DS_NOTATION.whoGets.map((g) => (
                        <tr key={g.cls} className="border-b border-ink-900/5 align-top">
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {g.cls}
                          </th>
                          <td className="py-3">
                            <strong className="text-amber-700">D/S</strong> &mdash; {g.why}
                          </td>
                        </tr>
                      ))}
                      <tr className="align-top">
                        <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                          {DS_NOTATION.whoDoesNot.join(", ")}
                        </th>
                        <td className="py-3">
                          <strong className="text-brand-700">A date</strong> &mdash;{" "}
                          {DS_NOTATION.whoDoesNotNote}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 rounded-2xl border border-ink-900/5 bg-ink-900/[0.02] p-5">
                  <p className="text-sm font-bold text-ink-900">
                    D/S is not a longer permission
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">
                    {DS_NOTATION.notSafer}
                  </p>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-700">
                    <strong>The counterweight. </strong>
                    {DS_NOTATION.unlawfulPresence}
                  </p>
                </div>
                <p className="mt-4">
                  <strong>On the rule&rsquo;s status: </strong>
                  {DS_NOTATION.policyNote} For students, the current position and
                  what the proposal would have changed are in{" "}
                  <Link href="/education/opt-calculator" className="text-brand-600 underline">
                    the OPT calculator
                  </Link>{" "}
                  and{" "}
                  <Link href="/education/sevis-termination-guide" className="text-brand-600 underline">
                    the SEVIS termination guide
                  </Link>
                  .
                </p>
              </div>

              {/* ── 6. Errors ── */}
              <div id="errors" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  When something is wrong
                </h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[740px] border-collapse text-sm">
                    <caption className="sr-only">
                      Common I-94 problems, their likely cause and the route to a
                      fix
                    </caption>
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          What you are seeing
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Most likely cause
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          The route
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {I94_ERRORS.map((e) => (
                        <tr key={e.symptom} className="border-b border-ink-900/5 align-top">
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {e.symptom}
                          </th>
                          <td className="py-3 pr-3">{e.likely}</td>
                          <td className="py-3">
                            {e.route}
                            {e.ownerPath && (
                              <Link
                                href={e.ownerPath}
                                className="mt-1 block text-[0.7rem] font-semibold text-brand-600 underline"
                              >
                                full guide →
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4">
                  Two things about deferred inspection are worth getting
                  straight, and{" "}
                  <Link href="/h1b-denied-entry-airport" className="text-brand-600 underline">
                    the denied-entry guide
                  </Link>{" "}
                  owns both. An inspection <em>deferred at the port of entry</em>{" "}
                  means your inspection was not finished and you were paroled in
                  so it could be completed. Walking into a Deferred Inspection
                  Site <em>after</em> you have been admitted is a
                  records-correction visit, not an unfinished inspection. They
                  are different things with similar names, and only the second
                  one is what you want when your class of admission is wrong.
                </p>

                <h3 className="mt-7 text-base font-bold text-ink-900">
                  Replacing an I-94: Form I-102
                </h3>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full min-w-[520px] border-collapse text-sm">
                    <caption className="sr-only">Form I-102 fees</caption>
                    <tbody className="text-ink-600">
                      {[
                        { k: "Filing fee", v: I102_FEES.filing, n: "" },
                        { k: I102_FEES.extraLabel, v: I102_FEES.extra, n: I102_FEES.extraNote },
                        { k: "Fee exemptions", v: "$0", n: I102_FEES.exemptions },
                      ].map((r) => (
                        <tr key={r.k} className="border-b border-ink-900/5 align-top">
                          <th scope="row" className="w-[34%] py-2.5 pr-3 text-left font-semibold text-ink-800">
                            {r.k}
                          </th>
                          <td className="w-[14%] py-2.5 pr-3 font-bold text-ink-900">{r.v}</td>
                          <td className="py-2.5 text-ink-500">{r.n}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-xs text-ink-400">
                  Form G-1055, USCIS fee schedule, edition {I102_FEES.edition}.
                </p>
                <p className="mt-3">
                  Note that I-102 requests an <em>initial</em> I-94 as well as a
                  replacement, which is the route if the electronic record never
                  generated. For an electronic I-94 you have simply mislaid, you
                  do not need it &mdash; reprint from the CBP site.
                </p>
              </div>

              {/* ── 7. What the history is for ── */}
              <div id="uses" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Three things the travel history is actually used for
                </h2>

                <h3 className="mt-5 text-base font-bold text-ink-900">
                  1. The substantial presence test
                </h3>
                <p className="mt-2">{SPT_FORMULA.test}</p>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full min-w-[480px] border-collapse text-sm">
                    <caption className="sr-only">
                      The substantial presence test weighting
                    </caption>
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Year
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          Weight
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {SPT_FORMULA.weights.map((w) => (
                        <tr key={w.year} className="border-b border-ink-900/5">
                          <th scope="row" className="py-2.5 pr-3 text-left font-semibold text-ink-800">
                            {w.year}
                          </th>
                          <td className="py-2.5">{w.weight}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-xs text-ink-400">{SPT_FORMULA.statute}</p>
                <p className="mt-3">
                  Here is what that arithmetic looks like on an{" "}
                  <strong>invented</strong> travel history &mdash; one with a near-full
                  year, a year interrupted by a long trip to India, and a partial
                  current year, which is the shape that puts a weighted total
                  close to the line:
                </p>
                <div className="overflow-x-auto">
                  <div className="min-w-[420px]">
                    <DaysByYearChart />
                  </div>
                </div>
                <p className="mt-3">
                  <strong>{SPT_FORMULA.notModelled}</strong> The mechanics are on{" "}
                  <Link href="/articles/substantial-presence-test-explained" className="text-brand-600 underline">
                    the substantial presence test guide
                  </Link>
                  , the exempt-individual years for F and J holders are modelled
                  in{" "}
                  <Link href="/education/f1-tax-calculator" className="text-brand-600 underline">
                    the F-1 tax calculator
                  </Link>
                  , and the first resident return is covered in{" "}
                  <Link href="/articles/h1b-first-tax-return-guide" className="text-brand-600 underline">
                    the H-1B first tax return guide
                  </Link>
                  .
                </p>

                <h3 className="mt-7 text-base font-bold text-ink-900">
                  2. N-400 and continuous residence
                </h3>
                <p className="mt-2">
                  Form N-400 asks about your trips outside the United States, and
                  two thresholds in 8 CFR 316.5(c)(1) do the work:{" "}
                  <strong>{N400_TRIP_RULES.rebuttableDays} days or more</strong>{" "}
                  in a single absence, and{" "}
                  <strong>{N400_TRIP_RULES.breaksDays} days or more</strong>.
                </p>
                <p className="mt-2">{N400_TRIP_RULES.rebuttable}</p>
                <p className="mt-2">{N400_TRIP_RULES.breaks}</p>
                <p className="mt-3">
                  Here is the same invented history drawn the other way round, as
                  time abroad rather than time present &mdash; because that is
                  the measurement these thresholds use, and the two get conflated
                  constantly:
                </p>
                <div className="overflow-x-auto">
                  <div className="min-w-[480px]">
                    <AbsenceTimelineChart />
                  </div>
                </div>
                <p className="mt-3">{N400_TRIP_RULES.note}</p>
                <p className="mt-3">
                  Work through the whole eligibility picture with{" "}
                  <Link href="/tools/citizenship-checklist" className="text-brand-600 underline">
                    the citizenship checklist
                  </Link>
                  , and read the thresholds themselves on{" "}
                  <Link href="/green-card/travel-rules" className="text-brand-600 underline">
                    green card travel rules
                  </Link>
                  , which also covers who the narrow N-470 route is open to and
                  its one-year filing cliff.
                </p>

                <h3 className="mt-7 text-base font-bold text-ink-900">
                  3. Recapturing days against a status cap
                </h3>
                <p className="mt-2">{RECAPTURE_NOTE}</p>
                <p className="mt-3">
                  Run the H-1B version in{" "}
                  <Link href="/h1b-perm-max-out-calculator" className="text-brand-600 underline">
                    the max-out and recapture calculator
                  </Link>
                  , and the L-1 version &mdash; where the five- and seven-year
                  caps count H time too &mdash; in{" "}
                  <Link href="/l1-visa" className="text-brand-600 underline">
                    the L-1 guide
                  </Link>
                  .
                </p>
              </div>

              {/* ── 8. India notes ── */}
              <div id="india" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Four things that bite NRI travellers specifically
                </h2>
                <ul className="mt-4 space-y-4">
                  {[
                    {
                      t: "The name lookup",
                      b: "An Indian passport that prints the surname first, or carries a single-field name, is the commonest reason the I-94 lookup returns nothing at all. Try the name fields swapped and the full name in the given-name field before you conclude the record is missing.",
                    },
                    {
                      t: "An unrecorded Canada or Mexico departure",
                      b: "If your actual pattern is long trips to India and short ones to Toronto, an unrecorded land departure leaves an apparent continuous presence that your Indian trips then look like an overstay against. Carry CBSA or INM stamps and keep them with the history PDF.",
                    },
                    {
                      t: "Stamping trips are not the risk the I-94 covers",
                      b: "When you travel to India for visa stamping, the I-94 you left behind was closed out on departure. What governs your return is a valid visa — or a documented exception — and a valid petition. Our H-1B stamping guide covers the appointment, and the travel-to-India guide covers the planning.",
                    },
                    {
                      t: "The history is your evidence, so keep it",
                      b: "For a recapture claim, a tax residency position or an N-400, a decade of trips reconstructed under deadline is a weak document. Ten minutes after each landing produces a strong one, and the window closes at ten years.",
                    },
                  ].map((n) => (
                    <li
                      key={n.t}
                      className="rounded-2xl border border-ink-900/5 bg-ink-900/[0.02] p-5"
                    >
                      <p className="text-sm font-bold text-ink-900">{n.t}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{n.b}</p>
                    </li>
                  ))}
                </ul>
                <p className="mt-4">
                  For the travel questions themselves rather than the record,{" "}
                  <Link href="/h1b/travel-to-india" className="text-brand-600 underline">
                    H-1B travel to India
                  </Link>{" "}
                  and{" "}
                  <Link href="/h1b/stamping-india-after-approval" className="text-brand-600 underline">
                    stamping in India after approval
                  </Link>{" "}
                  are the owner pages, and{" "}
                  <Link href="/h1b-denied-entry-airport" className="text-brand-600 underline">
                    denied entry at the airport
                  </Link>{" "}
                  covers what happens if the inspection goes badly.
                </p>
              </div>

              {/* ── 9. Status expiry ── */}
              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  When the I-94 date is the deadline
                </h2>
                <p className="mt-3">
                  Several rules on this site are written against the I-94 date
                  rather than against a petition or a visa, which is why the
                  habit of checking it matters more than it sounds:
                </p>
                <ul className="mt-3 list-disc space-y-2.5 pl-5">
                  <li>
                    <strong>The 240-day rule.</strong> If an extension petition
                    was filed before your I-94 expired and is still pending, you
                    may continue working for up to 240 days past the expiry.
                    Filed <em>after</em> the expiry, it does not apply.{" "}
                    <Link href="/h1b/extension" className="text-brand-600 underline">
                      The H-1B extension guide
                    </Link>{" "}
                    owns this.
                  </li>
                  <li>
                    <strong>The 60-day grace period.</strong> After employment
                    ends you have up to 60 consecutive days,{" "}
                    <em>or until your I-94 expires, whichever is shorter</em>. An
                    I-94 ending in 30 days gives you 30 days, not 60.{" "}
                    <Link href="/h1b/layoff-60-day-grace-period" className="text-brand-600 underline">
                      The grace period guide
                    </Link>{" "}
                    owns the counting.
                  </li>
                  <li>
                    <strong>The 10-day windows.</strong> E, H, L, O and TN
                    holders and their dependants may be admitted up to 10 days
                    before a petition&rsquo;s validity begins and remain up to 10
                    days after it ends, and may not work in either window.
                  </li>
                  <li>
                    <strong>AC21 and recapture.</strong> Both are arguments built
                    from dates, and the I-94 history is where the dates come
                    from.
                  </li>
                </ul>
              </div>
            </div>
          </Container>
        </section>

        <section className="bg-ink-900/[0.02] py-12 sm:py-16">
          <Container>
            <ToolFaq items={faqs} />
          </Container>
        </section>

        <section className="py-12">
          <Container>
            <OfficialSourceBox
              title="Sources and last verified"
              intro={`Retrieval steps, the travel-history limits and the land-departure note read from CBP's I-94 page and the i94.cbp.dhs.gov FAQ on ${formatDate(
                I94_VERIFIED,
              )}. The ten-year window is confirmed by DHS/CBP/PIA-016(a). Fees from Form G-1055, edition ${I102_FEES.edition}. The sample travel history on this page is invented.`}
              links={[
                { label: "CBP — official I-94 website", href: SRC.i94Site },
                { label: "CBP — I-94 and I-95 frequently asked questions", href: SRC.i94Faq },
                { label: "CBP — Arrival/Departure Forms: I-94", href: SRC.cbpI94 },
                { label: "CBP — deferred inspection sites", href: SRC.deferredInspection },
                { label: "DHS/CBP/PIA-016(a) — I-94 website application", href: SRC.pia },
                { label: "USCIS — Form I-102", href: SRC.i102 },
                { label: "Form G-1055 — USCIS fee schedule", href: SRC.feeSchedule },
                { label: "8 CFR 264.1 — registration and evidence of registration", href: SRC.cfr2641 },
                { label: "8 CFR 235.2 — deferred inspection", href: SRC.cfr2352 },
                { label: "IRS — substantial presence test", href: SRC.irsSpt },
                { label: "DHS — Freedom of Information Act requests", href: SRC.foia },
              ]}
            />

            <div className="mx-auto mt-6 max-w-3xl">
              <NotLegalAdvice />
            </div>

            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card">
              <h2 className="text-base font-bold text-ink-900">Related</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {[
                  { href: "/uscis/a-number", label: "Your A-number, and the numbers it is not" },
                  { href: "/uscis/i-797-notice", label: "Reading a Form I-797 notice" },
                  { href: "/h1b-denied-entry-airport", label: "Denied entry at the airport" },
                  { href: "/automatic-visa-revalidation", label: "Automatic visa revalidation" },
                  { href: "/green-card/travel-rules", label: "Green card travel rules" },
                  { href: "/tools/citizenship-checklist", label: "Citizenship eligibility checklist" },
                  { href: "/articles/substantial-presence-test-explained", label: "The substantial presence test" },
                  { href: "/h1b-perm-max-out-calculator", label: "H-1B max-out and recapture" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="flex items-center gap-1.5 rounded-xl border border-ink-900/10 px-3.5 py-2.5 text-sm font-semibold text-brand-600 transition hover:border-brand-300"
                    >
                      {l.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mx-auto mt-8 max-w-3xl">
              <AuthorBioBox
                tags={["USCIS paperwork", "Travel and port of entry", "NRI tax residency"]}
              />
            </div>
          </Container>
        </section>

        <Newsletter />
      </article>
    </>
  );
}
