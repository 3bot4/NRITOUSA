import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ReviewedByline from "@/components/ReviewedByline";
import AuthorBioBox from "@/components/AuthorBioBox";
import Newsletter from "@/components/Newsletter";
import NotLegalAdvice from "@/components/tools/NotLegalAdvice";
import OfficialSourceBox from "@/components/tools/OfficialSourceBox";
import ToolFaq from "@/components/tools/ToolFaq";
import PrintButton from "@/components/PrintButton";
import CouplePracticeMode, {
  PrintableQuestionList,
} from "@/components/tools/CouplePracticeMode";
import InterviewDayDiagram from "@/components/tools/marriage/InterviewDayDiagram";
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
  QUESTION_CATEGORIES,
  TOTAL_QUESTIONS,
  DOCUMENT_ROWS,
  MARRIAGE_INTERVIEW_SOURCES as SRC,
  MARRIAGE_INTERVIEW_UPDATED as UPDATED,
  SCRUTINY_FACTORS,
  NOT_RED_FLAGS,
  STOKES,
} from "@/data/marriageInterviewData";

const PAGE_PATH = "/green-card/marriage-interview-questions";

export const metadata: Metadata = pageMetadata({
  title: "Marriage Green Card Interview Questions: Practise as a Couple",
  description: `${TOTAL_QUESTIONS} example questions across the five areas an officer actually probes, plus a couple practice mode that shows only where your answers differ. What to bring, what happens on the day, and the India-specific evidence that matters.`,
  path: PAGE_PATH,
  type: "article",
  openGraph: { publishedTime: UPDATED, modifiedTime: UPDATED },
});

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Green Card Guide", url: "/green-card" },
  { name: "Marriage Interview Questions", url: PAGE_PATH },
];

const faqs: FaqItem[] = [
  {
    question: "What questions are asked at a marriage-based green card interview?",
    answer:
      "There is no fixed list — USCIS does not publish one, and anyone who says they have it has made it up. What officers consistently probe is five areas: how you met and how it became a marriage, the ordinary mechanics of daily life in your home, each other's family and friends, how your money actually works, and the history and plans that make a marriage more than a filing date. The questions on this page are examples we wrote to cover those five areas so you can find the gaps in what you know about each other.",
  },
  {
    question: "What is the officer actually testing?",
    answer:
      "Whether the marriage was entered into in good faith rather than to obtain an immigration benefit. That is a narrower question than 'is this a happy marriage', and it is not answered by romance. It is answered by whether two lives are genuinely entangled — one address, one set of bills, one insurance policy, families that know each other — and by whether the two of you describe the same life when asked separately.",
  },
  {
    question: "Will we be interviewed separately?",
    answer:
      "Usually not. Most marriage interviews are conducted with both of you in the room. Separate questioning — sometimes called a second-stage or Stokes interview — happens when the officer has specific doubts after the joint interview, and it means being asked the same questions apart so the answers can be compared. It is a signal that something needs explaining, not an automatic refusal.",
  },
  {
    question: "What should we bring to the interview?",
    answer:
      "The appointment notice, passports and identity documents for both of you, the original marriage certificate, originals of any divorce decrees or death certificates ending earlier marriages, and the evidence that two lives are actually shared — the lease or deed, joint accounts covering the whole marriage, joint tax transcripts, insurance listing each other, and photographs spread across the relationship rather than clustered at the wedding. Bring originals; the officer checks them against the copies already in the file.",
  },
  {
    question: "We had an arranged marriage and a short courtship. Is that a problem?",
    answer:
      "No, and it is not unusual — officers see arranged marriages routinely. What matters is that the story is coherent and documented: how the introduction happened, who made it, when the families met, what the two of you knew about each other before the wedding and how you communicated between the engagement and the marriage. A short courtship with a thorough paper trail reads far better than a long one with nothing to show for it. Do not manufacture a Western-style dating history you did not have — inconsistency is the thing that causes damage, not the custom.",
  },
  {
    question: "We lived apart before moving to the US. How do we show a real marriage?",
    answer:
      "With the evidence that period actually generated. Call and message logs, money sent to the spouse or the household, flight and hotel records from visits, photographs across those visits, and correspondence with each other's families. Long-distance periods are common in Indian immigrant families and are not held against you; what is held against you is an unexplained gap. Be ready to say plainly why you lived apart — a job, a visa, a parent needing care — and to show the relationship continued through it.",
  },
  {
    question: "Is there an official PDF of marriage interview questions and answers?",
    answer:
      "No. USCIS publishes the interview process, not a question bank, so any PDF claiming to be the official list is somebody's compilation. This page has a printable version of our example questions, which is useful for practising together away from a screen — just do not treat memorised answers as preparation. The officer can ask anything about your life, and a couple who genuinely shares one does not need a script.",
  },
  {
    question: "What happens after the interview?",
    answer:
      "One of four things: approval on the day, a request for evidence if something specific is missing, the case continued while the officer reviews or verifies something, or a denial. If the marriage was less than two years old when the green card is approved, you receive a two-year conditional card and the same good-faith question comes back around on Form I-751 before it expires.",
  },
  {
    question: "What is a Stokes interview?",
    answer: `${STOKES.whatItIs} ${STOKES.whatHappens} ${STOKES.whatItIsNot} Preparation is the same as for the first interview, which is to say barely any: know your own life, re-read your own forms, and do not agree on a version of anything — rehearsed couples diverge more under pressure, not less, because they improvise off a script instead of remembering.`,
  },
  {
    question: "What are the red flags in a marriage green card interview?",
    answer:
      "The honest answer is that most lists circulating on this are wrong. What genuinely draws a closer look is thin documentary overlap — no joint account, lease, insurance or anything with both names — a couple who have not lived together, answers that diverge on ordinary daily facts rather than memorable ones, a marriage filed very soon after a status problem, a prior marriage-based petition by the same petitioner, and inconsistencies between the interview answers and the forms already filed. What is not a red flag on its own: an arranged marriage, a short courtship, a large age gap, living apart for part of the marriage, being nervous, or not remembering a date. Saying you do not remember is a better answer than guessing.",
  },
  {
    question: "Is an arranged marriage a problem at the green card interview?",
    answer:
      "No. Officers see arranged marriages constantly and the legal test does not change: was the marriage entered into in good faith. How you met is simply not the question being asked. What an arranged marriage often does mean in practice is a shorter courtship and therefore a thinner pre-wedding record — which is a documentation problem with a documentation answer. Lead with what you do have: the families' involvement, the engagement and wedding documentation, the registration certificate, photographs across both families, and the financial and residential record you have built since.",
  },
  {
    question: "What happens if my spouse and I give different answers?",
    answer:
      "A difference is not a finding. Officers expect some divergence — two people genuinely do remember the same evening differently — and what they are looking for is a pattern of divergence on ordinary daily facts, not a single mismatch. Differences are normally put to you for explanation rather than held back, so you get to answer. The worst thing you can do is guess confidently at something you do not know: that creates a discrepancy where 'I don't remember' would have created nothing.",
  },
];

export default function MarriageInterviewQuestionsPage() {
  const url = absoluteUrl(PAGE_PATH);

  const jsonLd = jsonLdGraph(
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: "Marriage Green Card Interview Questions, and How to Practise Them",
      description: `${TOTAL_QUESTIONS} example questions across the five areas officers probe, with a couple practice mode and the documents to bring.`,
      datePublished: UPDATED,
      dateModified: UPDATED,
      author: { "@id": `${site.url}/#organization` },
      publisher: { "@id": `${site.url}/#organization` },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      url,
      inLanguage: "en-US",
      isAccessibleForFree: true,
    },
    {
      "@type": "WebApplication",
      "@id": `${url}#app`,
      name: "Marriage Interview Couple Practice Mode",
      description:
        "Both partners answer the same questions on one phone, in turn, and the tool shows only where the answers differ. Nothing is stored.",
      url: `${url}#practice`,
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      browserRequirements: "Requires JavaScript",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: { "@id": `${site.url}/#organization` },
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "en-US",
    },
    faqJsonLd(faqs),
    breadcrumbJsonLd(crumbs)
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        <header className="border-b border-ink-900/5 bg-white pt-6 pb-7 sm:pt-9">
          <Container>
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

            <h1 className="max-w-3xl text-2xl font-black tracking-tight text-ink-900 sm:text-4xl">
              Marriage green card interview questions — and how to practise them
              properly
            </h1>

            {/* ANSWER FIRST */}
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-700 sm:text-lg">
              The officer is testing one thing: whether your marriage was entered
              into in good faith. There is <strong>no published list</strong> of
              questions, but they cluster into five areas — how you met, daily
              life at home, each other&apos;s families, money, and shared history.
              Bring originals of the marriage certificate, the lease, joint
              accounts and tax transcripts.
            </p>

            <ul className="mt-5 grid max-w-3xl gap-2 sm:grid-cols-2">
              {[
                "Good faith at the time of marriage is the test — not whether the marriage is happy now",
                `${TOTAL_QUESTIONS} example questions here, across the five areas officers probe`,
                "Most interviews are joint; separate questioning happens only when the officer has doubts",
                "Bring originals — the officer checks them against the copies in the file",
                "Arranged marriages and short courtships are routine; inconsistency is the problem, not the custom",
                "Married under two years at approval? A conditional card, and the same test again on Form I-751",
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

            <ReviewedByline date={UPDATED} className="mt-5" />
            <NotLegalAdvice className="mt-4 max-w-3xl" />
          </Container>
        </header>

        {/* ── The tool ───────────────────────────────────────────── */}
        <section id="practice" className="scroll-mt-24 bg-ink-900/[0.02] py-10 sm:py-14">
          <Container>
            <div className="mx-auto mb-6 max-w-3xl">
              <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                Couple practice mode
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                One phone, two turns, and the tool shows only where you
                disagreed. It is a deliberately narrow thing to measure, because
                it is the thing the interview measures.
              </p>
            </div>
            <CouplePracticeMode />
          </Container>
        </section>

        {/* ── Body ───────────────────────────────────────────────── */}
        <section className="border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <div className="mx-auto max-w-[720px] space-y-10 text-[0.975rem] leading-relaxed text-ink-700">
              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  What the officer is actually deciding
                </h2>
                <p className="mt-3">
                  Not whether you love each other. Not whether the marriage will
                  last. The question is narrower and more mechanical: was this
                  marriage entered into in good faith, or was it entered into to
                  obtain an immigration benefit? Everything in the room serves
                  that one question.
                </p>
                <p className="mt-3">
                  Which is why romance is not the evidence and paperwork is. Two
                  people who genuinely share a life generate a trail without
                  trying — one address on everything, a joint account with the
                  ordinary rubbish of a shared life running through it, an
                  insurance policy naming a spouse, a tax return filed together.
                  Two people who do not share a life have to construct that
                  trail, and constructed trails have a shape: they cluster around
                  the wedding and the filing date, with a hollow middle.
                </p>
                <p className="mt-3">
                  It also explains why the tool above compares your answers
                  instead of grading them. There is no right answer to which side
                  of the bed you sleep on. There is only whether you and your
                  spouse give the same one.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  What happens on the day
                </h2>
                <InterviewDayDiagram />
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  The five areas, and what each one is for
                </h2>
                <p className="mt-3">
                  Below is every practice question on this page, grouped. Read
                  the &ldquo;what this tests&rdquo; line before the questions —
                  understanding why a group exists is more useful than the
                  individual questions in it, because the officer will ask
                  something you have not seen.
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[600px] border-collapse text-sm">
                    <caption className="sr-only">
                      The five question areas, what each tests, and how many
                      practice questions this page gives for it
                    </caption>
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Area
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          What the officer is testing
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          Questions here
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {QUESTION_CATEGORIES.map((c) => (
                        <tr key={c.id} className="border-b border-ink-900/5 align-top">
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {c.label}
                          </th>
                          <td className="py-3 pr-3">{c.testing}</td>
                          <td className="py-3 whitespace-nowrap font-semibold text-ink-800">
                            {c.questions.length}
                          </td>
                        </tr>
                      ))}
                      <tr className="align-top">
                        <th scope="row" className="py-3 pr-3 text-left font-bold text-ink-900">
                          Total
                        </th>
                        <td className="py-3 pr-3 text-ink-400">
                          Across all five areas
                        </td>
                        <td className="py-3 font-bold text-ink-900">
                          {TOTAL_QUESTIONS}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-5 space-y-6">
                  {QUESTION_CATEGORIES.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-2xl border border-ink-900/5 bg-ink-900/[0.02] p-5"
                    >
                      <h3 className="text-base font-bold text-ink-900">{c.label}</h3>
                      <p className="mt-1 text-sm italic text-ink-500">{c.testing}</p>
                      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm">
                        {c.questions.map((q) => (
                          <li key={q}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <PrintButton label="Print these questions" />
                  <span className="text-xs text-ink-400">
                    Example questions written for this page — not an official
                    USCIS list.
                  </span>
                </div>
              </div>

              <div id="scrutiny" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  What draws a closer look — and what genuinely does not
                </h2>
                <p className="mt-3">
                  Every other page on this subject has a &ldquo;red flags&rdquo;
                  list, and most of them are wrong in a way that does real harm:
                  they frighten couples about an age gap or an arranged marriage
                  while saying nothing about the thing that actually decides
                  cases. So here it is in two halves, and the second half
                  matters more than the first.
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[660px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          What raises scrutiny
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Why
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          What answers it
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {SCRUTINY_FACTORS.map((f) => (
                        <tr key={f.factor} className="border-b border-ink-900/5 align-top">
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {f.factor}
                          </th>
                          <td className="py-3 pr-3">{f.why}</td>
                          <td className="py-3 text-ink-500">{f.answer}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h3 className="mt-7 text-base font-bold text-ink-900">
                  And six things that are not problems, whatever you have read
                </h3>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full min-w-[560px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Widely repeated
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          What is actually true
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {NOT_RED_FLAGS.map((n) => (
                        <tr key={n.thing} className="border-b border-ink-900/5 align-top">
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {n.thing}
                          </th>
                          <td className="py-3">{n.reality}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-sm text-ink-500">
                  These are patterns in how cases are examined, not a published
                  USCIS checklist — no such list exists, and anyone presenting
                  one as official is guessing. The legal test itself is single
                  and unchanged: was the marriage entered into in good faith.
                </p>
              </div>

              <div id="stokes" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  The {STOKES.name}, by the name people search for
                </h2>
                <p className="mt-3">
                  Also called a {STOKES.alsoCalled}. {STOKES.whatItIs}
                </p>
                <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50/50 px-4 py-3 text-sm">
                  <strong className="font-semibold text-ink-900">
                    What it is not:
                  </strong>{" "}
                  {STOKES.whatItIsNot}
                </p>
                <p className="mt-3">
                  <strong className="font-semibold text-ink-900">
                    What happens on the day.
                  </strong>{" "}
                  {STOKES.whatHappens}
                </p>
                <p className="mt-3">
                  <strong className="font-semibold text-ink-900">
                    How to prepare.
                  </strong>{" "}
                  {STOKES.howToPrepare} The couple practice mode at the top of
                  this page is built for exactly this: it shows you where your
                  answers diverge, which is the only preparation that
                  transfers — not so you can agree on an answer, but so you know
                  which parts of your own life you have never actually discussed.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  What to bring
                </h2>
                <p className="mt-3">
                  Originals, organised so you can find something when asked
                  rather than emptying a folder onto the desk.
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[560px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th className="py-2 pr-3 font-bold text-ink-900">Category</th>
                        <th className="py-2 pr-3 font-bold text-ink-900">What to bring</th>
                        <th className="py-2 font-bold text-ink-900">Weight</th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {DOCUMENT_ROWS.map((r) => (
                        <tr key={r.category} className="border-b border-ink-900/5">
                          <td className="py-2.5 pr-3 font-semibold text-ink-800">
                            {r.category}
                          </td>
                          <td className="py-2.5 pr-3">{r.items}</td>
                          <td className="py-2.5 whitespace-nowrap">{r.weight}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-sm text-ink-500">
                  The affidavit of support is the item that most often turns out
                  to be short —{" "}
                  <Link href="/uscis/forms/i-864" className="text-brand-600 underline">
                    check the sponsor income requirement
                  </Link>{" "}
                  before the interview, not at it. The full filing set is on{" "}
                  <Link href="/i485-documents-checklist" className="text-brand-600 underline">
                    the I-485 document checklist
                  </Link>
                  .
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  For Indian couples specifically
                </h2>

                <h3 className="mt-4 text-base font-bold text-ink-900">
                  Arranged marriages and a short courtship
                </h3>
                <p className="mt-2">
                  An arranged marriage is not a red flag and officers see them
                  constantly. What gets tested is whether the account holds
                  together: who made the introduction, when the families first
                  spoke, what each of you knew about the other before the
                  wedding, and how you communicated between the engagement and
                  the marriage. Be specific and ordinary about it. The damaging
                  move is to dress the story up as something it was not —
                  inventing a long dating history produces exactly the
                  inconsistencies that trigger a second interview.
                </p>
                <p className="mt-2">
                  Where a courtship was genuinely short, the answer is volume of
                  evidence after the marriage rather than apology for the speed
                  of it. A couple married four months who have a joint account,
                  a shared lease and both families on a WhatsApp group are in a
                  better position than a couple who dated for three years and
                  can produce nothing.
                </p>

                <h3 className="mt-5 text-base font-bold text-ink-900">
                  Evidence an Indian wedding actually produces
                </h3>
                <p className="mt-2">
                  A wedding in India generates a document set that officers do
                  not see every day, so bring it and explain it. The{" "}
                  <strong>marriage registration certificate</strong> is the one
                  that matters most — a religious ceremony certificate alone is
                  not the marriage record USCIS works from, so if the marriage
                  was never registered, register it. Beyond that: the invitation
                  card with both families named, photographs in which parents and
                  siblings on both sides are identifiable, venue and caterer
                  receipts, and flight records for relatives who travelled. If
                  documents are in Hindi, Gujarati, Telugu, Tamil or any other
                  language, bring certified English translations — an untranslated
                  original is treated as no document at all.
                </p>

                <h3 className="mt-5 text-base font-bold text-ink-900">
                  Couples who lived apart before the move
                </h3>
                <p className="mt-2">
                  Extremely common, and not a problem in itself. One spouse
                  finishes a notice period, or waits out a visa, or stays with a
                  parent who is unwell. What an unexplained gap does is invite a
                  question you have not prepared for, so prepare for it: say
                  plainly why you lived apart, for how long, and show the
                  relationship ran through it. Call and message logs, money sent
                  home, flight and hotel records from visits, and photographs
                  from those visits all do that work.
                </p>
                <p className="mt-2">
                  One practical note on money sent to India: it is good evidence
                  of a shared life, and it is also worth understanding the tax
                  and reporting side of it —{" "}
                  <Link href="/send-money-to-india" className="text-brand-600 underline">
                    sending money to India
                  </Link>{" "}
                  covers that separately.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  How to prepare without over-preparing
                </h2>
                <ol className="mt-3 list-decimal space-y-2 pl-5">
                  <li>
                    Run the practice mode above once, cold, with everything
                    selected. Do not discuss anything first.
                  </li>
                  <li>
                    Talk through only the mismatches. Most will be wording. The
                    ones where you genuinely remember something differently are
                    the real finding.
                  </li>
                  <li>
                    Fix the evidence gaps the questions expose. If neither of you
                    could name whose name is on the electricity account, that is
                    a document problem before it is a memory problem.
                  </li>
                  <li>
                    Assemble the folder a week ahead, in the order of the table
                    above, and check every original is actually an original.
                  </li>
                  <li>
                    Do not script answers. A rehearsed couple sounds rehearsed,
                    and the officer&apos;s next question will be the one you did
                    not rehearse. Knowing your own life is the preparation.
                  </li>
                </ol>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  After the interview
                </h2>
                <p className="mt-3">
                  Approval on the day is common where the file is complete. If
                  something specific is missing you get{" "}
                  <Link href="/uscis/request-for-evidence-rfe" className="text-brand-600 underline">
                    a request for evidence
                  </Link>{" "}
                  with a fixed deadline and no extension available. A case may
                  also be continued while the officer verifies something.
                </p>
                <p className="mt-3">
                  If the marriage was less than two years old on the day the
                  green card is approved, the card is conditional and valid for
                  two years — and the same good-faith question returns on{" "}
                  <Link href="/uscis/forms/i-751" className="text-brand-600 underline">
                    Form I-751
                  </Link>{" "}
                  in the 90 days before it expires. Keep the evidence habit going
                  from the day of the interview; the next round is easier for
                  couples who never stopped generating a paper trail.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* ── Printable list ─────────────────────────────────────── */}
        <section className="bg-ink-900/[0.02] py-12">
          <Container>
            <div className="mx-auto max-w-[720px] rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card sm:p-7">
              <PrintableQuestionList />
            </div>
          </Container>
        </section>

        <section className="py-12 sm:py-16">
          <Container>
            <ToolFaq items={faqs} />
          </Container>
        </section>

        <section className="pb-14">
          <Container>
            <OfficialSourceBox
              title="Sources and last verified"
              intro={`The interview process described here follows USCIS's own published guidance, checked on ${formatDate(
                UPDATED
              )}. The questions are ours, not USCIS's — USCIS publishes no question list.`}
              links={[
                { label: "USCIS Policy Manual — adjustment of status interviews", href: SRC.policyManualAdjustment },
                { label: "USCIS Policy Manual, Vol. 7, Pt. B — family-based adjustment", href: SRC.policyManualMarriage },
                { label: "USCIS — adjustment of status", href: SRC.interviewPage },
                { label: "Form I-485", href: SRC.i485 },
                { label: "Form I-130", href: SRC.i130 },
                { label: "Form I-751 — removing conditions", href: SRC.i751 },
              ]}
            />

            <div className="mx-auto mt-6 max-w-3xl">
              <NotLegalAdvice />
            </div>

            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card">
              <h2 className="text-base font-bold text-ink-900">Related</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {[
                  { href: "/uscis/interview-scheduled", label: "What the 'interview scheduled' status means" },
                  { href: "/i485-documents-checklist", label: "I-485 document checklist" },
                  { href: "/green-card/i-485", label: "Adjustment of status guide" },
                  { href: "/uscis/forms/i-864", label: "Affidavit of support income requirement" },
                  { href: "/uscis/forms/i-751", label: "Removing conditions (I-751)" },
                  { href: "/divorce-immigration-status", label: "If the marriage ends" },
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
                tags={[
                  "Family green card process",
                  "Indian marriage documentation",
                  "USCIS interviews",
                ]}
              />
            </div>
          </Container>
        </section>

        <Newsletter />
      </article>
    </>
  );
}
