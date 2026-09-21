import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";
import NotLegalAdvice from "@/components/tools/NotLegalAdvice";
import OfficialSourceBox from "@/components/tools/OfficialSourceBox";
import PrintButton from "@/components/PrintButton";
import AuthorBioBox from "@/components/AuthorBioBox";
import CitizenshipTestPractice, {
  CivicsPrintableList,
} from "@/components/tools/CitizenshipTestPractice";
import {
  NaturalisationPathDiagram,
  PoolCompositionChart,
} from "@/components/tools/citizenship/charts";
import {
  AGE_TIME_EXCEPTIONS,
  ENGLISH_PORTION,
  N648,
  NAT_EXCEPTION_SOURCES,
  NAT_EXCEPTIONS_UPDATED,
} from "@/data/naturalisationExceptions";
import { getTool } from "@/lib/tools";
import { CIVICS, QUESTIONS, listCategories } from "@/lib/citizenshipTest";
import { site } from "@/lib/site";
import { formatDate } from "@/lib/format";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";

const tool = getTool("citizenship-test-practice")!;
const PATH = "/tools/citizenship-test-practice";
const UPDATED = "2026-09-16";

const F = CIVICS.format;
const P = CIVICS.priorVersion;
const categories = listCategories();

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: PATH,
  openGraph: { publishedTime: UPDATED, modifiedTime: UPDATED },
});

const faqs: FaqItem[] = [
  {
    question: "How many questions are on the 2026 citizenship test?",
    answer: `The pool is ${F.poolSize} questions. At the interview the officer asks ${F.questionsAsked} of them, and you need ${F.correctToPass} correct to pass. The officer stops as soon as you have ${F.correctToPass} right or ${F.incorrectToFail} wrong, so a real test is usually shorter than ${F.questionsAsked} questions — you often walk out having answered twelve or thirteen.`,
  },
  {
    question: "Who takes the 2025 version and who takes the old 100-question test?",
    answer: `It is decided by your Form N-400 filing date, not by when your interview happens. File on or after ${formatDate(
      F.appliesToFilingsOnOrAfter
    )} and you take the ${CIVICS.version} version: ${F.poolSize} questions in the pool, ${F.questionsAsked} asked, ${F.correctToPass} to pass. File before that date and you take the ${P.version} version: ${P.poolSize} in the pool, up to ${P.questionsAsked} asked, ${P.correctToPass} to pass. If you filed in 2025 and are interviewing in 2026, check your receipt notice — many people are still on the older test.`,
  },
  {
    question: "Where can I get the 2026 citizenship test questions with answers as a PDF?",
    answer: `USCIS publishes the official list as ${CIVICS.sourceEdition}, and it is linked in the sources at the foot of this page. This page also reproduces all ${F.poolSize} questions and answers below the practice tool, with a print button — use your browser's "Save as PDF" option to keep a copy. The answers here are transcribed from the USCIS publication rather than paraphrased, because applicants are told to answer using the wording USCIS gives.`,
  },
  {
    question: "What is the 65/20 special consideration?",
    answer: `If you are ${F.senior.eligibility}, you only have to study the ${F.senior.poolSize} starred questions. The officer asks ${F.senior.questionsAsked} of those and you need ${F.senior.correctToPass} correct. ${F.senior.note} The practice tool has a mode for exactly this set.`,
  },
  {
    question: "Why is this practice test not multiple choice?",
    answer:
      "Because the real one is not. The civics test is oral: the officer asks a question and you answer out loud, with no options in front of you. Recognising the right answer in a list of four is a different and much easier skill, and practising that way is how people arrive at the interview more confident than they should be. Here you say your answer, reveal the official one, and mark yourself.",
  },
  {
    question: "What happens if I fail the civics test?",
    answer: `You get ${CIVICS.interview.attempts} attempts. If you fail a portion at the first interview you are re-tested only on that portion, between ${CIVICS.interview.retestWindowDays[0]} and ${CIVICS.interview.retestWindowDays[1]} days later. Failing the civics test does not mean re-doing the English test if you passed it, and it does not mean re-filing the N-400.`,
  },
  {
    question: "Some answers change — how do you handle those?",
    answer: `Seven questions ask who currently holds an office — the President, the Vice President, the Speaker, the Chief Justice, your senators, your representative, your governor — and one asks for your state capital. This tool deliberately holds no answer for those. Hard-coding a name would be wrong within a year and nobody would notice. Instead those questions tell you to look the current answer up at ${CIVICS.testUpdatesUrl}, which is exactly what USCIS tells applicants to do.`,
  },
  {
    question: "Can I keep my Indian citizenship after naturalising?",
    answer:
      "No. India does not permit dual citizenship. Once you naturalise as a US citizen you cease to be an Indian citizen by operation of law, and you must surrender your Indian passport and obtain a surrender or renunciation certificate. The route back to visa-free access is an OCI card, which you apply for after naturalising — never before, because OCI is only for foreign nationals.",
  },
  {
    question: "What else is tested besides civics?",
    answer: `English, in three parts. Reading: ${CIVICS.interview.englishReading} Writing: ${CIVICS.interview.englishWriting} Speaking: ${CIVICS.interview.englishSpeaking} For most people who have lived and worked in the United States for five years the English portion is the straightforward part and the civics questions are the ones worth drilling.`,
  },
  {
    question: "Do I have to take the citizenship test in English?",
    answer: `Not always. Three age-and-residence exceptions remove the English requirement: 50/20 (age 50 or older and a permanent resident for 20 or more years), 55/15 (55 or older, 15 or more years) and 65/20 (65 or older, 20 or more years). Eligibility is measured when you file the N-400, not at the interview. Note what the exception does and does not cover: on 50/20 and 55/15 you still take the full civics test, simply in the language of your choice with an interpreter. Only 65/20 also reduces the civics requirement — to ${F.senior.poolSize} questions, ${F.senior.questionsAsked} asked and ${F.senior.correctToPass} to pass.`,
  },
  {
    question: "What is the 65/20 rule for the citizenship test?",
    answer: `If you are ${AGE_TIME_EXCEPTIONS[2].minAge} or older and have been a lawful permanent resident for at least ${AGE_TIME_EXCEPTIONS[2].minYearsLpr} years when you file Form N-400, you are exempt from the English requirement and you get special consideration on civics. USCIS marks a reduced set of ${F.senior.poolSize} questions in its own publication; you are asked ${F.senior.questionsAsked} of them and need ${F.senior.correctToPass} correct, and you may answer in the language of your choice. The practice tool on this page has a 65/20 mode that draws only from that marked set.`,
  },
  {
    question: "What is on the English portion of the naturalisation test?",
    answer:
      "Three parts. Reading: you read one of three sentences aloud correctly. Writing: you write one of three sentences correctly. Both are drawn from vocabulary lists USCIS publishes in advance, and you get up to three attempts at each. Speaking is not a separate exercise at all — the officer assesses it through the eligibility interview itself, from how you answer the questions on your N-400. That last point is worth knowing before you walk in: the interview has already started scoring you before anyone mentions a test.",
  },
  {
    question: "What is Form N-648, and who needs it?",
    answer: `${N648.form} — ${N648.title} — requests an exception to the English requirement, the civics requirement, or both, on the basis of ${N648.condition.toLowerCase()} ${N648.certifier} The impairment cannot be the direct effect of illegal drug use. It is filed with the N-400 where possible, or brought to the interview, and there is no fee for the form. It is a different mechanism from the age-and-residence exceptions and is not limited by age. Separately from all of this, USCIS provides disability accommodations at the interview — a sign-language interpreter, an accessible site, extended time — and requesting one of those does not require ${N648.form}.`,
  },
  {
    question: "Which civics topics should I study first?",
    answer: `Weight your time the way the pool is weighted, because your ${F.questionsAsked} questions are drawn from it. ${listCategories()
      .slice()
      .sort((a, b) => b.count - a.count)
      .slice(0, 4)
      .map((c) => `${c.label} (${c.count} questions)`)
      .join(", ")} — those four alone are most of the bank. American government is more than half of the whole pool, so a study plan giving every topic equal time is spending most of it in the wrong places. The chart on this page shows the full breakdown, and the practice tool has a study-by-topic mode that follows it.`,
  },
];

export default function CitizenshipTestPracticePage() {
  const url = absoluteUrl(PATH);

  const jsonLd = jsonLdGraph(
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: `The 2026 US Citizenship Test: All ${F.poolSize} Questions and a Free Practice Test`,
      description: tool.seoDescription,
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
      name: tool.title,
      description: tool.description,
      url,
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
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Tools", url: "/tools" },
      { name: tool.label, url: PATH },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolFirstLayout
        toolSlug="citizenship-test-practice"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: tool.label },
        ]}
        icon={tool.icon}
        category="Citizenship"
        title={`2026 citizenship test: all ${F.poolSize} questions, and a practice run`}
        hook={`${F.questionsAsked} asked, ${F.correctToPass} to pass. Drill the official question bank the way the officer will actually ask it — out loud.`}
        badges={[
          `${F.poolSize} official questions`,
          `${F.questionsAsked} asked`,
          `${F.correctToPass} to pass`,
          "No signup",
        ]}
        accent={tool.accent}
        sourceNote={
          <>
            Questions transcribed from USCIS {CIVICS.sourceEdition}. Answers that
            depend on who currently holds an office are not stored here —{" "}
            <a
              href={CIVICS.testUpdatesUrl}
              className="text-brand-600 underline"
              rel="nofollow noopener"
              target="_blank"
            >
              check test updates
            </a>
            .
          </>
        }
        disclaimerExtra={
          <p>
            This is practice material, not a USCIS product and not legal advice.
            Passing here does not predict the outcome of a real interview. Always
            study from the official USCIS materials as well.
          </p>
        }
      >
        {/* ── Answer first ─────────────────────────────────────── */}
        <section className="pt-6">
          <Container>
            <div className="mx-auto max-w-3xl">
              <p className="text-base leading-relaxed text-ink-700 sm:text-lg">
                The {CIVICS.version} civics test draws from a pool of{" "}
                <strong>{F.poolSize} questions</strong>. The officer asks{" "}
                <strong>{F.questionsAsked}</strong> of them out loud and you need{" "}
                <strong>{F.correctToPass} correct</strong> to pass — and stops
                early once you reach {F.correctToPass} right or{" "}
                {F.incorrectToFail} wrong. You take this version if you filed
                Form N-400 on or after{" "}
                <strong>{formatDate(F.appliesToFilingsOnOrAfter)}</strong>.
              </p>

              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {[
                  `Pool ${F.poolSize} · asked ${F.questionsAsked} · pass at ${F.correctToPass} · fail at ${F.incorrectToFail}`,
                  `Filed N-400 before ${formatDate(F.appliesToFilingsOnOrAfter)}? You take the older ${P.version} test — ${P.poolSize} pool, ${P.questionsAsked} asked, ${P.correctToPass} to pass`,
                  `65/20: ${F.senior.eligibility} — study just ${F.senior.poolSize} questions, ${F.senior.questionsAsked} asked, ${F.senior.correctToPass} to pass`,
                  `${CIVICS.interview.attempts} attempts; re-tested only on the portion you failed, ${CIVICS.interview.retestWindowDays[0]}–${CIVICS.interview.retestWindowDays[1]} days later`,
                  "The test is spoken, not multiple choice — practise saying the answer",
                  "Eight questions have answers that change; those are look-ups, not memorised",
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

              <div className="mt-5">
                <FastAnswerSnapshot
                  title={`The ${CIVICS.version} civics test in numbers`}
                  answerLabel="Correct answers needed"
                  answer={`${F.correctToPass} of ${F.questionsAsked}`}
                  accent="sky"
                  badges={[`${F.poolSize}-question pool`, "Oral test"]}
                  rows={[
                    { label: "Questions in the pool", value: String(F.poolSize) },
                    { label: "Asked at the interview", value: `Up to ${F.questionsAsked}` },
                    {
                      label: "Correct to pass",
                      value: String(F.correctToPass),
                      highlight: true,
                    },
                    {
                      label: "Wrong answers that end it",
                      value: String(F.incorrectToFail),
                    },
                    {
                      label: "65/20 set",
                      value: `${F.senior.correctToPass} of ${F.senior.questionsAsked}`,
                      note: `From ${F.senior.poolSize} starred questions`,
                    },
                    {
                      label: "Applies to N-400s filed",
                      value: `On or after ${formatDate(F.appliesToFilingsOnOrAfter)}`,
                    },
                  ]}
                  lastVerified={CIVICS.lastVerified}
                  sources={[
                    { label: `USCIS ${CIVICS.sourceEdition} question list`, href: CIVICS.sourceUrl },
                    { label: "USCIS 2025 civics test page", href: CIVICS.studyPageUrl },
                  ]}
                  disclaimer="USCIS can revise the test and the answers to eight of the questions change with elections and appointments. Check test updates before your interview."
                  ctaText="Start practising"
                  ctaHref="#practice"
                />
              </div>

              <NotLegalAdvice className="mt-5" />
            </div>
          </Container>
        </section>

        {/* ── The tool ─────────────────────────────────────────── */}
        <section id="practice" className="scroll-mt-24 py-10 sm:py-14">
          <Container>
            <CitizenshipTestPractice />
          </Container>
        </section>

        {/* ── Body ─────────────────────────────────────────────── */}
        <section className="border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <div className="mx-auto max-w-[720px] space-y-10 text-[0.975rem] leading-relaxed text-ink-700">
              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  What actually changed
                </h2>
                <p className="mt-3">
                  The test got harder in three ways at once, and the third is the
                  one people underestimate. The pool grew from {P.poolSize} to{" "}
                  {F.poolSize} questions. The number asked went from{" "}
                  {P.questionsAsked} to {F.questionsAsked}. And the pass mark
                  went from {P.correctToPass} to {F.correctToPass} — so where you
                  once needed to know 60% of what you were asked, you still need
                  60%, but across twice as many questions, which leaves far less
                  room for a lucky draw.
                </p>
                <p className="mt-3">
                  The version you take is fixed by your N-400 <em>filing</em>{" "}
                  date, not your interview date. If you filed before{" "}
                  {formatDate(F.appliesToFilingsOnOrAfter)} you are on the{" "}
                  {P.version} test even if your interview is in 2027. Check the
                  receipt notice before you spend weeks studying the wrong list —
                  our{" "}
                  <Link
                    href="/tools/citizenship-checklist"
                    className="text-brand-600 underline"
                  >
                    N-400 readiness checker
                  </Link>{" "}
                  works out which version applies from your filing date.
                </p>
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[520px] border-collapse text-sm">
                    <caption className="sr-only">
                      The {P.version} civics test compared with the {CIVICS.version} version
                    </caption>
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          &nbsp;
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          {P.version} version
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          {CIVICS.version} version
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {[
                        ["Questions in the pool", `${P.poolSize}`, `${F.poolSize}`],
                        ["Questions asked", `${P.questionsAsked}`, `${F.questionsAsked}`],
                        ["Correct answers to pass", `${P.correctToPass}`, `${F.correctToPass}`],
                        [
                          "Wrong answers that end it",
                          "5",
                          `${F.incorrectToFail}`,
                        ],
                        [
                          "Who takes it",
                          `N-400 filed before ${formatDate(F.appliesToFilingsOnOrAfter)}`,
                          `N-400 filed on or after ${formatDate(F.appliesToFilingsOnOrAfter)}`,
                        ],
                        [
                          "65/20 reduced set",
                          "20 questions, 10 asked, 6 to pass",
                          `${F.senior.poolSize} questions, ${F.senior.questionsAsked} asked, ${F.senior.correctToPass} to pass`,
                        ],
                      ].map((row) => (
                        <tr key={row[0]} className="border-b border-ink-900/5">
                          <th scope="row" className="py-2.5 pr-3 text-left font-semibold text-ink-800">
                            {row[0]}
                          </th>
                          <td className="py-2.5 pr-3">{row[1]}</td>
                          <td className="py-2.5 font-semibold text-ink-900">{row[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-sm text-ink-500">
                  Source: USCIS {CIVICS.sourceEdition} and the 2025 civics test
                  pages, read {formatDate(CIVICS.lastVerified)}.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  How the interview actually runs
                </h2>
                <NaturalisationPathDiagram />
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  The stop rule, and why it matters for how you study
                </h2>
                <p className="mt-3">
                  USCIS says the officer stops asking once you have{" "}
                  {F.correctToPass} correct or {F.incorrectToFail} incorrect. Two
                  consequences follow, and both change how you should prepare.
                </p>
                <p className="mt-3">
                  First, a strong start ends the test early. Get your first
                  twelve right and you are done — you never see the other eight.
                  Second, and less comfortably, a weak start ends it early too.
                  Nine wrong answers and the officer stops, whatever you might
                  have known about the remaining questions. There is no recovering
                  in the back half, so there is no value in a strategy that leans
                  on some topics and writes off others.
                </p>
                <p className="mt-3">
                  That is why the practice tool here mirrors the stop rule rather
                  than always running to {F.questionsAsked}. A mock test that
                  always asks all twenty flatters you: it lets a bad first half be
                  rescued by a good second half, which the real test will not do.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  What the {F.poolSize} questions cover
                </h2>
                <p className="mt-3">
                  Knowing the shape of the pool tells you where your study time
                  goes. More than half of it is American government.
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[420px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th className="py-2 pr-3 font-bold text-ink-900">Section</th>
                        <th className="py-2 pr-3 font-bold text-ink-900">Topic</th>
                        <th className="py-2 font-bold text-ink-900">Questions</th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {categories.map((c) => (
                        <tr key={c.id} className="border-b border-ink-900/5">
                          <td className="py-2.5 pr-3">{c.section}</td>
                          <td className="py-2.5 pr-3 font-semibold text-ink-800">
                            {c.label}
                          </td>
                          <td className="py-2.5">{c.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <PoolCompositionChart />
                <p className="mt-3 text-sm text-ink-500">
                  Use &ldquo;study by topic&rdquo; in the tool above to work
                  through one row at a time, then take a mixed mock test.
                </p>
              </div>

              <div id="english" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  The English half, and who does not have to take it
                </h2>
                <p className="mt-3">
                  Almost everything written about the naturalisation test is
                  about civics, which is odd, because the English requirement is
                  the one that worries people more — and it is the one with real
                  exceptions attached. Start with what it actually is: three
                  parts, and one of them is not a separate exercise at all.
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[560px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Part
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          What you do
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          How it is judged
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {ENGLISH_PORTION.map((e) => (
                        <tr key={e.part} className="border-b border-ink-900/5 align-top">
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {e.part}
                          </th>
                          <td className="py-3 pr-3">{e.what}</td>
                          <td className="py-3 text-ink-500">{e.howJudged}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h3 className="mt-7 text-base font-bold text-ink-900">
                  The age-and-residence exceptions
                </h3>
                <p className="mt-2">
                  Three of them, and they are usually written as a pair of
                  numbers: your age, and your years as a permanent resident.
                  Eligibility is measured at the time you <em>file</em> the
                  N-400, not at the interview — so a few weeks either side of a
                  birthday can genuinely change which rule you file under.
                </p>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full min-w-[640px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Rule
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          You must be
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          English test
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          Civics test
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {AGE_TIME_EXCEPTIONS.map((e) => (
                        <tr key={e.id} className="border-b border-ink-900/5 align-top">
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {e.name}
                          </th>
                          <td className="py-3 pr-3">
                            {e.minAge} or older, and a permanent resident for{" "}
                            {e.minYearsLpr}+ years
                          </td>
                          <td className="py-3 pr-3 font-semibold text-emerald-700">
                            {e.englishRequired ? "Required" : "Exempt"}
                          </td>
                          <td className="py-3">
                            {e.civics}
                            <span className="mt-1 block text-xs text-ink-400">
                              {e.note}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4">
                  Read the civics column carefully, because this is where people
                  get it wrong in both directions. An English exception is not a
                  civics exception: on 50/20 and 55/15 you still take the full
                  civics test, you simply take it in your own language with an
                  interpreter. Only 65/20 reduces what you have to learn — to{" "}
                  {F.senior.poolSize} questions, {F.senior.questionsAsked} asked,{" "}
                  {F.senior.correctToPass} to pass. The practice tool above has a
                  65/20 mode that uses exactly that set.
                </p>

                <h3 className="mt-7 text-base font-bold text-ink-900">
                  The medical exception, Form {N648.form}
                </h3>
                <p className="mt-2">
                  A different mechanism, and not age-based. Form {N648.form},{" "}
                  {N648.title}, requests an exception to {N648.covers.toLowerCase()}{" "}
                  It rests on {N648.condition.toLowerCase()} {N648.certifier}{" "}
                  {N648.excludes} {N648.filedWith}
                </p>
                <p className="mt-3 text-sm text-ink-500">
                  Sources:{" "}
                  <a
                    href={NAT_EXCEPTION_SOURCES.exceptions}
                    target="_blank"
                    rel="nofollow noopener"
                    className="text-brand-600 underline"
                  >
                    USCIS exceptions and accommodations
                  </a>
                  , Policy Manual Vol. 12, Pt. E, Ch. 2 and Ch. 3. Read{" "}
                  {formatDate(NAT_EXCEPTIONS_UPDATED)}. USCIS also provides
                  disability accommodations — a sign-language interpreter, an
                  accessible site, extended time — separately from any of these
                  exceptions, and requesting one does not require {N648.form}.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  The eight questions nobody should memorise
                </h2>
                <p className="mt-3">
                  Seven questions ask who currently holds an office and one asks
                  for your state capital. Those answers change with elections,
                  appointments and where you live, so this tool stores no answer
                  for them at all — it tells you to look them up.
                </p>
                <p className="mt-3">
                  This is not a limitation, it is the correct behaviour. Practice
                  material that hard-codes an officeholder&apos;s name goes stale
                  the moment an election or a resignation happens, and the person
                  studying from it has no way of knowing. USCIS maintains a page
                  for exactly this purpose —{" "}
                  <a
                    href={CIVICS.testUpdatesUrl}
                    target="_blank"
                    rel="nofollow noopener"
                    className="text-brand-600 underline"
                  >
                    test updates
                  </a>{" "}
                  — and for your own senators, representative and governor you
                  need the answer for <em>your</em> state on the day of your
                  interview. Check them the week before, not months ahead.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  For Indian applicants: what naturalising costs you
                </h2>
                <p className="mt-3">
                  This is the part that has nothing to do with civics and
                  everything to do with the decision. India does not allow dual
                  citizenship. The day you take the Oath of Allegiance you cease
                  to be an Indian citizen — not by choice, by operation of Indian
                  law — and you are required to surrender your Indian passport
                  and obtain a surrender or renunciation certificate.
                </p>
                <p className="mt-3">
                  The route back to visa-free travel and residence in India is an{" "}
                  <Link href="/oci" className="text-brand-600 underline">
                    OCI card
                  </Link>
                  , which is available only to foreign nationals — so the sequence
                  is naturalise, surrender the passport, then apply for OCI, in
                  that order.{" "}
                  <Link href="/oci/how-to-apply" className="text-brand-600 underline">
                    How to apply for OCI
                  </Link>{" "}
                  covers the documents, and the surrender certificate is one of
                  them.
                </p>
                <p className="mt-3">
                  Worth knowing before you file, because the practical differences
                  are real: OCI is not citizenship. An OCI holder cannot vote in
                  India, cannot hold a constitutional office or most government
                  jobs, and cannot buy agricultural or plantation land or a farm
                  house. Other property is generally fine. If you are weighing
                  what to do with assets you hold in India either way,{" "}
                  <Link
                    href="/india-investments/should-nris-keep-investments-in-india"
                    className="text-brand-600 underline"
                  >
                    the NRI investments analysis
                  </Link>{" "}
                  goes through it, and{" "}
                  <Link href="/oci-vs-india-visa" className="text-brand-600 underline">
                    OCI vs an Indian visa
                  </Link>{" "}
                  compares the two routes for someone who travels back often.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  How to study this in a few weeks
                </h2>
                <ol className="mt-3 list-decimal space-y-2 pl-5">
                  <li>
                    Take one mock test cold, before studying anything. It is
                    unpleasant and it is the most useful twenty minutes you will
                    spend, because it tells you which of the eight topics you are
                    actually weak in rather than which ones you feel weak in.
                  </li>
                  <li>
                    Work the two weakest topics in &ldquo;study by topic&rdquo;
                    mode. Say every answer aloud. Reading an answer and knowing
                    you could have said it is not the same as saying it.
                  </li>
                  <li>
                    Use &ldquo;review my wrong answers&rdquo; every session. The
                    questions you miss are not random — they cluster, and drilling
                    the cluster is what moves a score.
                  </li>
                  <li>
                    A week before the interview, look up your current
                    officeholders and your state capital, and check the USCIS test
                    updates page.
                  </li>
                  <li>
                    Take a final mock in the format, without the timer off. If you
                    clear {F.correctToPass} comfortably twice in a row, you are
                    ready for this part.
                  </li>
                </ol>
              </div>
            </div>
          </Container>
        </section>

        {/* ── Printable question list ──────────────────────────── */}
        <section className="bg-ink-900/[0.02] py-12 sm:py-16">
          <Container>
            <div className="mx-auto max-w-[720px]">
              <div className="no-print flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                    All {F.poolSize} questions and answers
                  </h2>
                  <p className="mt-1 text-sm text-ink-500">
                    The full official list, from the same data the practice tool
                    uses. Print it, or use your browser&apos;s &ldquo;Save as
                    PDF&rdquo; to keep a copy.
                  </p>
                </div>
                <PrintButton label="Print / save as PDF" />
              </div>
              <div className="mt-6 rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card sm:p-7">
                <CivicsPrintableList />
              </div>
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
              intro={`All ${QUESTIONS.length} questions and the test format were checked against these USCIS sources on ${formatDate(
                CIVICS.lastVerified
              )}. USCIS can revise the test — check before your interview.`}
              links={[
                { label: `${CIVICS.sourceEdition} — the official ${F.poolSize} questions`, href: CIVICS.sourceUrl },
                { label: `USCIS — the ${CIVICS.version} civics test`, href: CIVICS.studyPageUrl },
                { label: "USCIS — test updates (answers that change)", href: CIVICS.testUpdatesUrl },
                { label: "USCIS — the naturalisation interview and test", href: CIVICS.interview.sourceUrl },
                { label: "USCIS — study for the test", href: "https://www.uscis.gov/citizenship/find-study-materials-and-resources/study-for-the-test" },
                { label: "USCIS — Form N-400", href: "https://www.uscis.gov/n-400" },
              ]}
            />

            <div className="mx-auto mt-6 max-w-3xl">
              <NotLegalAdvice />
            </div>

            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card">
              <h2 className="text-base font-bold text-ink-900">Related</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {[
                  { href: "/tools/citizenship-checklist", label: "N-400 readiness checker" },
                  { href: "/uscis/forms/n-400", label: "Form N-400 explained" },
                  { href: "/oci", label: "OCI card after naturalising" },
                  { href: "/oci/how-to-apply", label: "How to apply for OCI" },
                  { href: "/indian-passport-renewal-usa", label: "Indian passport & surrender" },
                  { href: "/uscis/forms/i-751", label: "Removing conditions first (I-751)" },
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
                  "US naturalisation process",
                  "OCI after US citizenship",
                  "Indian passport surrender",
                ]}
              />
            </div>
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
