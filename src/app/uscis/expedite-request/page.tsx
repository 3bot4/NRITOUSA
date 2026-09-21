import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ReviewedByline from "@/components/ReviewedByline";
import AuthorBioBox from "@/components/AuthorBioBox";
import Newsletter from "@/components/Newsletter";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";
import NotLegalAdvice from "@/components/tools/NotLegalAdvice";
import OfficialSourceBox from "@/components/tools/OfficialSourceBox";
import ToolFaq from "@/components/tools/ToolFaq";
import ExpediteEligibilityChecker from "@/components/tools/ExpediteEligibilityChecker";
import ExpediteDecisionTree from "@/components/tools/expedite/ExpediteDecisionTree";
import {
  EscalationLadderDiagram,
  PremiumCostSpeedChart,
} from "@/components/tools/expedite/EscalationLadder";
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
  EXPEDITE_CRITERIA,
  EXPEDITE_CHANNELS,
  EXPEDITE_FACTS,
  EXPEDITE_SOURCES as SRC,
  EXPEDITE_UPDATED as UPDATED,
  PREMIUM_AVAILABILITY,
  ESCALATION_RUNGS,
  ESCALATION_SOURCES,
  ESCALATION_FACTS,
} from "@/data/expediteData";

const PAGE_PATH = "/uscis/expedite-request";

export const metadata: Metadata = pageMetadata({
  title: "USCIS Expedite Request: The 5 Criteria, and When to Use Premium Instead",
  description:
    "How to expedite a USCIS case: the five official criteria, the rule that blocks an expedite wherever premium processing exists, how to submit, and a free eligibility checker for your form.",
  path: PAGE_PATH,
  type: "article",
  openGraph: { publishedTime: UPDATED, modifiedTime: UPDATED },
});

const crumbs = [
  { name: "Home", url: "/" },
  { name: "USCIS Hub", url: "/uscis" },
  { name: "Expedite Request", url: PAGE_PATH },
];

const faqs: FaqItem[] = [
  {
    question: "What are the USCIS expedite criteria?",
    answer: `Five: severe financial loss to a company or person; emergencies and urgent humanitarian situations; a nonprofit organisation designated by the IRS whose request furthers US cultural or social interests; US government interests; and clear USCIS error. There is no sixth. "My case is taking a long time" is not on the list, and a request built on it is declined.`,
  },
  {
    question: "Can I expedite a case that is eligible for premium processing?",
    answer: `No — and this catches more people than any criterion does. ${EXPEDITE_FACTS.premiumBar} So for an H-1B I-129 or an I-140, the answer is not an expedite request, it is Form I-907 and the premium fee. Free is not an option USCIS offers where a paid one exists.`,
  },
  {
    question: "How do I submit an expedite request to USCIS?",
    answer: `Four routes: secure messaging in your USCIS online account with "expedite" selected as the reason; the USCIS Contact Center by phone with your receipt number; Ask Emma on uscis.gov; or a field office appointment, which is required for certain case types including T and U nonimmigrant status. The online account is the cleanest, because the request and the evidence land in the file together.`,
  },
  {
    question: "How long does USCIS take to decide an expedite request?",
    answer: `${EXPEDITE_FACTS.noPublishedTimeframe} That is genuinely all that is known, and any specific number you see quoted elsewhere is someone's impression. Plan on the assumption that the request may not be granted and may not be explained, and keep whatever backup arrangement you have.`,
  },
  {
    question: "Can I expedite an EAD?",
    answer:
      "It depends which EAD. For F-1 OPT and STEM OPT categories premium processing exists, so an expedite request will not be considered — use Form I-907. For most other categories, including an EAD based on a pending I-485 and the common H-4 case, there is no premium option, so an expedite request on the criteria is available. The criterion that usually fits is severe financial loss, evidenced by an employer letter saying what is lost and by when.",
  },
  {
    question: "Can I expedite green card processing?",
    answer:
      "There is no premium processing for Form I-485, so an expedite request is available on the criteria. But an expedite cannot conjure a visa number: if your priority date is not current, no amount of urgency moves the case, because the constraint is the visa bulletin rather than USCIS's queue. Check where your date stands before spending effort on a request that cannot help.",
  },
  {
    question: "What evidence should I send with an expedite request?",
    answer:
      "The document that proves the urgency, not a description of it. A death certificate or a letter from the funeral home. A doctor's letter setting out the diagnosis and why the timing matters. An employer letter on letterhead saying exactly what is lost and by what date. A single strong document does more than three paragraphs of explanation, and an unsupported request is simply declined without a reason being given.",
  },
  {
    question: "My case is just slow. Is an expedite request the right tool?",
    answer:
      "Usually not. Slowness alone is not a criterion. The right first step is to check whether the case is genuinely outside normal processing time for your form and office — if it is, an outside-normal-processing-time inquiry is the appropriate request and a different mechanism entirely. Spending an expedite request on ordinary delay tends to produce nothing except a longer wait for a reply.",
  },
  {
    question: "What can I do if USCIS denies my expedite request or no criterion applies?",
    answer: `Four things, in order. Submit a case inquiry for a case outside normal processing time, if your receipt date is earlier than the case inquiry date USCIS publishes for your form and office — free, and USCIS's stated goal is ${ESCALATION_FACTS.srmtGoal} to resolve a service request. Ask your Representative's or a Senator's casework office to inquire — free, but you must sign a privacy release first. Request case assistance from the CIS Ombudsman on DHS Form 7001 — free, but only after you have contacted USCIS in the last ${ESCALATION_FACTS.ombudsmanContactWindowDays} days and given USCIS ${ESCALATION_FACTS.ombudsmanUscisDays} days to fix it. And, as a last resort, a mandamus action in federal district court. None of the four is an expedite and none reorders the queue.`,
  },
  {
    question: "What is the CIS Ombudsman, and can it help with a delayed USCIS case?",
    answer: `The Office of the Citizenship and Immigration Services Ombudsman is part of DHS but independent of USCIS. You request case assistance on DHS Form 7001, at no cost. Before it will take your request you must have contacted USCIS within the last ${ESCALATION_FACTS.ombudsmanContactWindowDays} days and given USCIS at least ${ESCALATION_FACTS.ombudsmanUscisDays} days to resolve the problem — keep your USCIS service request numbers, because the form asks for them. The Ombudsman can get an independent set of eyes onto a stuck case and is the best route for surfacing an actual USCIS error. It cannot decide your case, overrule USCIS or make a legal determination.`,
  },
  {
    question: "Does a Congressional inquiry speed up a USCIS case?",
    answer:
      "It can produce a clearer answer, not a faster queue position. A Senator's or Representative's casework staff route your question to a USCIS congressional liaison rather than the general Contact Center, and that liaison often sees more than a Contact Center agent can. You must be a constituent, and you will have to sign a privacy release first, because the Privacy Act stops a federal agency from discussing your records with a third party without your written consent. No member of Congress can instruct USCIS to approve, deny or reorder anything.",
  },
  {
    question: "What is a mandamus lawsuit, and what does it cost to file?",
    answer: `It is a suit in federal district court asking a judge to order a federal officer to perform a duty owed to you — jurisdiction comes from 28 U.S.C. § 1361, and in a delay case the duty is the duty to decide. The court filing fee is $${ESCALATION_FACTS.mandamusFilingFee.toLocaleString(
      "en-US"
    )} under 28 U.S.C. § 1914(a) plus a $${ESCALATION_FACTS.mandamusAdminFee} administrative fee, so $${ESCALATION_FACTS.mandamusTotalFee} before any legal representation, and in practice this is federal litigation that needs a lawyer. The important limit: a court can order USCIS to decide, but it cannot order USCIS to approve. The decision that follows may be a denial.`,
  },
  {
    question: "What does 'outside normal processing time' actually mean?",
    answer: `Not 'slower than I expected'. USCIS publishes a case inquiry date for each form, category and field office, and you can only make the inquiry if your receipt date falls earlier than that published date. If your form type is not listed at all, the fallback is six months pending. Once a service request is created, USCIS categorises it by urgency and type, assigns a target completion date by category, and works each category first-in, first-out, with a stated general goal of ${ESCALATION_FACTS.srmtGoal}.`,
  },
  {
    question: "Should I file all four escalation routes at the same time?",
    answer:
      "No, and not because it is rude — because three of them depend on the record the earlier ones create. The CIS Ombudsman will not take a request until you have gone to USCIS first and waited 60 days. A mandamus action rests on documented unreasonable delay, and the documentation is exactly what a service request and an Ombudsman file produce. Firing all four at once does not compress the timeline; it means three arrive without the evidence that makes them work.",
  },
];

export default function ExpediteRequestPage() {
  const url = absoluteUrl(PAGE_PATH);

  const jsonLd = jsonLdGraph(
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: "USCIS Expedite Requests: the Criteria, the Premium Bar, and How to Ask",
      description:
        "The five official expedite criteria, the rule that blocks an expedite wherever premium processing is available, and how to submit one.",
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
      name: "USCIS Expedite Eligibility Checker",
      description:
        "Check whether an expedite request is even available for your form, which of the five criteria may apply, and what evidence to gather.",
      url: `${url}#checker`,
      applicationCategory: "UtilitiesApplication",
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
              How to expedite a USCIS case — and when you simply cannot
            </h1>

            {/* ANSWER FIRST */}
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-700 sm:text-lg">
              USCIS will expedite a case only on <strong>five criteria</strong>:
              severe financial loss, an emergency or urgent humanitarian
              situation, an IRS-designated nonprofit furthering US interests, US
              government interests, or clear USCIS error. You request it through
              your online account or the Contact Center — but{" "}
              <strong>not at all</strong> where premium processing exists for
              that form.
            </p>

            <ul className="mt-5 grid max-w-3xl gap-2 sm:grid-cols-2">
              {[
                "Five criteria, and no sixth — slowness alone is not one of them",
                "Premium processing available for your form? An expedite will not be considered",
                "The only exception to that bar is an IRS-designated nonprofit petitioner",
                "Submit via your USCIS online account, the Contact Center, Ask Emma, or a field office",
                "Evidence decides it — a death certificate or an employer letter, not a description",
                "USCIS publishes no decision timeframe and generally does not explain the outcome",
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

        <section className="bg-ink-900/[0.02] py-8">
          <Container>
            <FastAnswerSnapshot
              title="Expedite vs premium processing"
              answerLabel="Expedite request cost"
              answer="$0"
              accent="sky"
              badges={["Five criteria", "Blocked where premium exists"]}
              rows={[
                {
                  label: "Expedite request",
                  value: "Free",
                  note: "Criteria-based. No guaranteed timeframe.",
                  highlight: true,
                },
                {
                  label: "Premium processing — I-129, I-140",
                  value: "$2,965",
                  note: "Guaranteed USCIS action, not approval",
                },
                {
                  label: "Premium — I-765 (OPT, STEM OPT)",
                  value: "$1,780",
                },
                {
                  label: "Premium — I-539 (F, J, M)",
                  value: "$2,075",
                },
                {
                  label: "Forms with no premium option",
                  value: "I-485, I-131, I-90, N-400, I-751",
                  note: "Expedite is available on the criteria",
                },
                {
                  label: "Published decision timeframe",
                  value: "None",
                  note: "USCIS does not publish one",
                },
              ]}
              lastVerified={EXPEDITE_FACTS.lastVerified}
              sources={[
                { label: "USCIS — Expedite Requests", href: SRC.expeditePage },
                { label: "USCIS Policy Manual, Vol. 1, Pt. A, Ch. 5", href: SRC.policyManual },
                { label: "USCIS fee schedule (G-1055)", href: SRC.feeSchedule },
              ]}
              disclaimer="Premium processing fees change and USCIS suspends categories from time to time. Confirm on the official Form I-907 page before paying."
              ctaText="Check my own case"
              ctaHref="#checker"
            />
          </Container>
        </section>

        <section id="checker" className="scroll-mt-24 py-10 sm:py-14">
          <Container>
            <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
              Expedite eligibility checker
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-500">
              It asks about your form first, on purpose — for several common
              filings the premium-processing rule settles the question before any
              criterion is reached. Nothing is stored and we never ask for a
              receipt number.
            </p>
            <div className="mt-6">
              <ExpediteEligibilityChecker />
            </div>
          </Container>
        </section>

        <section className="border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <div className="mx-auto max-w-[720px] space-y-10 text-[0.975rem] leading-relaxed text-ink-700">
              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  The decision, in one picture
                </h2>
                <ExpediteDecisionTree />
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  The rule that decides most cases
                </h2>
                <p className="mt-3">
                  Before any criterion matters, there is a gate.{" "}
                  {EXPEDITE_FACTS.premiumBar} It is worth sitting with that,
                  because it is counter-intuitive: the fact that a fast route
                  exists is precisely what closes the free one. If your employer
                  will not pay the premium fee, that is a conversation with your
                  employer, not a case for USCIS.
                </p>
                <p className="mt-3">
                  Which forms this affects is not obvious either, because premium
                  availability is per form <em>and per category</em> — an I-765
                  for F-1 OPT has a premium option while an I-765 based on a
                  pending I-485 does not, and both are &ldquo;an EAD&rdquo; to
                  the person waiting.
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[560px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th className="py-2 pr-3 font-bold text-ink-900">Form</th>
                        <th className="py-2 pr-3 font-bold text-ink-900">Category</th>
                        <th className="py-2 pr-3 font-bold text-ink-900">Premium?</th>
                        <th className="py-2 font-bold text-ink-900">So what</th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {PREMIUM_AVAILABILITY.map((f, i) => (
                        <tr key={`${f.form}-${i}`} className="border-b border-ink-900/5">
                          <td className="py-2.5 pr-3 font-semibold text-ink-800">{f.form}</td>
                          <td className="py-2.5 pr-3">{f.label}</td>
                          <td className="py-2.5 pr-3 whitespace-nowrap font-semibold">
                            {f.premiumAvailable ? (
                              <span className="text-amber-700">Yes{f.fee ? ` — ${f.fee}` : ""}</span>
                            ) : (
                              <span className="text-emerald-700">No</span>
                            )}
                          </td>
                          <td className="py-2.5">{f.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-sm text-ink-500">
                  Fees are from the USCIS fee schedule and match{" "}
                  <Link href="/uscis/forms/i-907-premium-processing" className="text-brand-600 underline">
                    our premium processing page
                  </Link>
                  . USCIS suspends premium categories from time to time —{" "}
                  <a
                    href={SRC.premiumProcessing}
                    target="_blank"
                    rel="nofollow noopener"
                    className="text-brand-600 underline"
                  >
                    check the official I-907 page
                  </a>{" "}
                  before you rely on it.
                </p>
                <PremiumCostSpeedChart />
                <p className="mt-3 text-sm text-ink-500">
                  The dashed rows are the ones that matter for this page. An
                  I-485, an I-131 advance parole, an I-90 or an N-400 has no
                  premium option at any price, which is precisely why the
                  criteria below — and the{" "}
                  <a href="#ladder" className="text-brand-600 underline">
                    escalation ladder
                  </a>{" "}
                  after them — exist.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  The five criteria, honestly assessed
                </h2>
                <p className="mt-3">
                  Two of these are genuinely available to an ordinary applicant,
                  one is available to nonprofits, one is raised by the government
                  rather than by you, and one applies only when USCIS has made a
                  mistake. Knowing which is which saves a lot of wasted effort.
                </p>
                <div className="mt-4 space-y-4">
                  {EXPEDITE_CRITERIA.map((c) => (
                    <div
                      key={c.id}
                      className={`rounded-2xl border p-5 ${
                        c.realistic
                          ? "border-emerald-200 bg-emerald-50/30"
                          : "border-ink-900/10 bg-ink-900/[0.02]"
                      }`}
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="text-base font-bold text-ink-900">{c.label}</h3>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold ${
                            c.realistic
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-ink-900/5 text-ink-500"
                          }`}
                        >
                          {c.realistic ? "Usable by an individual" : "Rarely available to an individual"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm">{c.meaning}</p>
                      <p className="mt-2 text-xs font-semibold text-ink-700">Evidence:</p>
                      <ul className="mt-1 list-disc space-y-0.5 pl-5 text-xs text-ink-600">
                        {c.evidence.map((e) => (
                          <li key={e}>{e}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  How to submit one
                </h2>
                <ol className="mt-3 space-y-2.5">
                  {EXPEDITE_CHANNELS.map((c, i) => (
                    <li key={c.channel} className="rounded-xl border border-ink-900/5 bg-white px-4 py-3">
                      <p className="text-sm font-semibold text-ink-900">
                        {i + 1}. {c.channel}
                      </p>
                      <p className="mt-0.5 text-sm text-ink-600">{c.detail}</p>
                    </li>
                  ))}
                </ol>
                <p className="mt-4">
                  Keep the request short and attach the proof. USCIS decides on
                  the evidence, publishes no timeframe for deciding, and{" "}
                  generally does not explain the outcome — so a request that
                  merely asserts urgency has nothing to act on.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  The cases Indian families actually bring
                </h2>
                <p className="mt-3">
                  Three situations come up again and again, and they have
                  different answers.
                </p>

                <h3 className="mt-4 text-base font-bold text-ink-900">
                  A parent is seriously ill in India and you need advance parole
                </h3>
                <p className="mt-2">
                  This is the strongest individual case there is: an urgent
                  humanitarian situation, evidenced by a doctor&apos;s letter
                  setting out the diagnosis and the timing. There is no premium
                  option for Form I-131, so the criteria route is open. For a
                  genuine emergency, also ask the Contact Center about an{" "}
                  <strong>emergency advance parole appointment</strong> at a field
                  office — that is a separate and faster mechanism than an
                  expedite request on a pending I-131, and people miss it.{" "}
                  <Link href="/advance-parole-processing-time" className="text-brand-600 underline">
                    Advance parole processing
                  </Link>{" "}
                  covers the ordinary route.
                </p>

                <h3 className="mt-5 text-base font-bold text-ink-900">
                  An EAD gap that is about to stop you working
                </h3>
                <p className="mt-2">
                  Since the automatic extension was removed for renewals filed on
                  or after 30 October 2025, a renewal that runs past the card&apos;s
                  expiry means an actual stop in employment. For an EAD with no
                  premium option — the adjustment-based and H-4 cases — severe
                  financial loss is the criterion, and the evidence that carries
                  it is an employer letter on letterhead stating that employment
                  will be suspended on a specific date.{" "}
                  <Link href="/ead-renewal-gap" className="text-brand-600 underline">
                    The EAD renewal gap page
                  </Link>{" "}
                  covers the arithmetic and how to avoid needing this at all.
                </p>

                <h3 className="mt-5 text-base font-bold text-ink-900">
                  A death in the family and travel documents in the wrong place
                </h3>
                <p className="mt-2">
                  An urgent humanitarian situation, evidenced by the death
                  certificate or a letter from the funeral home plus proof of the
                  relationship. Gather both before you call — the request is
                  decided on what you can produce, and a bereavement is exactly
                  the moment when nobody wants to be told to send more documents.
                </p>

                <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 text-sm">
                  <strong className="font-semibold text-ink-900">
                    One thing an expedite cannot do:
                  </strong>{" "}
                  create a visa number. If your I-485 is waiting on a priority
                  date, the constraint is the visa bulletin and not USCIS&apos;s
                  queue, so no expedite will move it.{" "}
                  <Link href="/tools/priority-date-checker" className="text-brand-600 underline">
                    Check where your date stands
                  </Link>{" "}
                  before spending a request on it.
                </p>
              </div>

              <div id="ladder" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  If no criterion applies: the escalation ladder
                </h2>
                <p className="mt-3">
                  Most people arriving at this page are not in an emergency —
                  they are simply waiting, and the waiting has become
                  intolerable. That is real, and an expedite request is not the
                  tool for it. It is also not the end of the road, which is
                  where most write-ups on this subject stop.
                </p>
                <p className="mt-3">
                  There are four further mechanisms, and they are genuinely
                  different from one another: different prerequisites, different
                  people deciding, different powers. Three of the four cost
                  nothing. None of them is an expedite, and none of them moves
                  you up the queue — what they do is force a human being to look
                  at a file that has stopped moving.
                </p>

                <EscalationLadderDiagram />

                <h3 className="mt-8 text-base font-bold text-ink-900">
                  The four rungs side by side
                </h3>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full min-w-[760px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th className="py-2 pr-3 font-bold text-ink-900">Rung</th>
                        <th className="py-2 pr-3 font-bold text-ink-900">
                          What has to be true first
                        </th>
                        <th className="py-2 pr-3 font-bold text-ink-900">Cost</th>
                        <th className="py-2 pr-3 font-bold text-ink-900">
                          What it can do
                        </th>
                        <th className="py-2 font-bold text-ink-900">
                          What it cannot
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {ESCALATION_RUNGS.map((r) => (
                        <tr key={r.id} className="border-b border-ink-900/5 align-top">
                          <td className="py-3 pr-3">
                            <span className="font-semibold text-ink-900">
                              {r.step}. {r.name}
                            </span>
                            <span className="mt-1 block text-xs text-ink-500">
                              {r.decider}
                            </span>
                          </td>
                          <td className="py-3 pr-3">{r.prerequisite}</td>
                          <td className="py-3 pr-3 whitespace-nowrap font-semibold text-ink-800">
                            {r.cost.startsWith("$") ? (
                              <span className="text-amber-700">{r.cost.split(" plus")[0]}</span>
                            ) : (
                              <span className="text-emerald-700">{r.cost}</span>
                            )}
                          </td>
                          <td className="py-3 pr-3">{r.canDo}</td>
                          <td className="py-3 text-ink-500">{r.cannotDo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h3 className="mt-8 text-base font-bold text-ink-900">
                  Rung 1: are you actually outside normal processing time?
                </h3>
                <p className="mt-2">
                  This is the rung nearly everybody needs and most people skip,
                  usually because they assume &ldquo;slow&rdquo; and
                  &ldquo;outside normal processing time&rdquo; mean the same
                  thing. They do not. USCIS publishes a case inquiry date for
                  each form, category and office, and the test is whether your
                  receipt date is earlier than that published date — not whether
                  your wait feels long. If your form is not on the list at all,
                  six months pending is the fallback threshold.
                </p>
                <p className="mt-3">
                  When a service request is created, USCIS categorises it by
                  urgency and type, assigns a target completion date by category
                  and works within each category first-in, first-out. Its stated
                  general goal is {ESCALATION_FACTS.srmtGoal} to resolve one.{" "}
                  <Link
                    href="/tools/uscis-processing-delay-checker"
                    className="text-brand-600 underline"
                  >
                    Our delay checker
                  </Link>{" "}
                  works out whether you are past that point, and{" "}
                  <Link href="/tools/processing-times" className="text-brand-600 underline">
                    the processing times explorer
                  </Link>{" "}
                  explains what USCIS&apos;s published figure actually measures —
                  it is a descriptive statistic about cases already decided, not
                  a promise about yours.
                </p>

                <h3 className="mt-6 text-base font-bold text-ink-900">
                  Rung 2: what a Congressional inquiry really is
                </h3>
                <p className="mt-2">
                  Every Senator and Representative runs a constituent casework
                  office, and immigration is usually its largest category of
                  work. The staffer does not argue your case. They route it to a
                  USCIS congressional liaison — a different channel from the
                  Contact Center — and relay the answer back. That is the whole
                  of it, and it is often enough, because the liaison can see
                  things the Contact Center script cannot.
                </p>
                <p className="mt-3">
                  Two practical points. You must be a constituent: your
                  Representative is set by your address, and either of your two
                  Senators will take a state resident. And you will be asked to
                  sign a privacy release before anything happens, because the
                  Privacy Act bars a federal agency from disclosing your records
                  to a third party without your written consent — the
                  congressional office is a third party. Skipping that form is
                  the single most common reason an inquiry stalls before it
                  starts.
                </p>

                <h3 className="mt-6 text-base font-bold text-ink-900">
                  Rung 3: the CIS Ombudsman, and the 90/60 rule
                </h3>
                <p className="mt-2">
                  The Office of the Citizenship and Immigration Services
                  Ombudsman sits inside DHS but outside USCIS, which is the
                  point of it. You request case assistance on DHS Form 7001, and
                  it is free.
                </p>
                <p className="mt-3">
                  It has a hard prerequisite that catches people out: you must
                  have contacted USCIS within the last{" "}
                  {ESCALATION_FACTS.ombudsmanContactWindowDays} days{" "}
                  <em>and</em> have given USCIS at least{" "}
                  {ESCALATION_FACTS.ombudsmanUscisDays} days to fix the problem.
                  Rung 1 is how most people satisfy that — which is the practical
                  reason to do rung 1 even when you suspect it will not help.
                  Keep your service request numbers; the form asks for them.
                </p>
                <p className="mt-3">
                  What it is not: an appeal. The Ombudsman cannot decide your
                  case, overrule USCIS or make a legal determination. Where it is
                  genuinely strong is a case where USCIS appears to have made an
                  error and nobody at USCIS will look at it again.
                </p>

                <h3 className="mt-6 text-base font-bold text-ink-900">
                  Rung 4: mandamus, and what it actually buys
                </h3>
                <p className="mt-2">
                  A mandamus action asks a federal district court to order a
                  federal officer to perform a duty owed to you. Federal courts
                  have original jurisdiction over such actions under 28 U.S.C.
                  § 1361, and the duty in a delay case is the duty to{" "}
                  <em>decide</em> — which is exactly as narrow as it sounds.
                </p>
                <p className="mt-3">
                  The filing fee is $
                  {ESCALATION_FACTS.mandamusFilingFee.toLocaleString("en-US")}{" "}
                  under 28 U.S.C. § 1914(a) plus a $
                  {ESCALATION_FACTS.mandamusAdminFee} administrative fee, so $
                  {ESCALATION_FACTS.mandamusTotalFee} before any representation
                  — and in practice this is litigation against the federal
                  government, which is not something to attempt on the strength
                  of a web page. What it can achieve is a decision on a case that
                  has been unreasonably delayed. What it cannot achieve is a
                  favourable one: a court can order USCIS to decide, and the
                  decision may be a denial.{" "}
                  <Link
                    href="/immigration-attorney-lawyer-cost"
                    className="text-brand-600 underline"
                  >
                    What immigration lawyers charge
                  </Link>{" "}
                  is the honest starting point if you are weighing this.
                </p>

                <p className="mt-5 rounded-xl border border-sky-200 bg-sky-50/60 px-4 py-3 text-sm">
                  <strong className="font-semibold text-ink-900">
                    The sequence matters more than the effort.
                  </strong>{" "}
                  Rung 3 is gated on having done rung 1. Rung 4 is gated on
                  documented delay, which rungs 1 to 3 are what produce. Firing
                  all four at once does not go faster — it just means three of
                  them arrive without the record that makes them work.
                </p>
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
              intro={`Criteria, channels and the premium-processing bar read from these USCIS sources on ${formatDate(
                UPDATED
              )}. Expedite guidance and premium availability both change — verify before relying on either.`}
              links={[
                { label: "USCIS — Expedite Requests", href: SRC.expeditePage },
                { label: "USCIS Policy Manual, Vol. 1, Pt. A, Ch. 5", href: SRC.policyManual },
                { label: "USCIS — how to request premium processing", href: SRC.premiumProcessing },
                { label: "Form I-907", href: SRC.formI907 },
                { label: "USCIS fee schedule (G-1055)", href: SRC.feeSchedule },
                { label: "USCIS processing times", href: SRC.processingTimes },
                { label: "Outside normal processing time inquiry", href: SRC.eRequest },
                { label: "USCIS Contact Center", href: SRC.contactCenter },
                {
                  label: "USCIS Policy Manual, Vol. 1, Pt. A, Ch. 4 — service requests",
                  href: ESCALATION_SOURCES.srmtPolicy,
                },
                {
                  label: "DHS CIS Ombudsman — how to submit a case assistance request",
                  href: ESCALATION_SOURCES.ombudsmanHow,
                },
                {
                  label: "DHS Form 7001 with instructions",
                  href: ESCALATION_SOURCES.ombudsmanForm,
                },
                {
                  label: "Find your Representative (house.gov)",
                  href: ESCALATION_SOURCES.findRepresentative,
                },
                {
                  label: "Contact your Senators (senate.gov)",
                  href: ESCALATION_SOURCES.findSenator,
                },
                { label: "Privacy Act — 5 U.S.C. § 552a", href: ESCALATION_SOURCES.privacyAct },
                { label: "Mandamus — 28 U.S.C. § 1361", href: ESCALATION_SOURCES.mandamusStatute },
                { label: "Filing fee — 28 U.S.C. § 1914", href: ESCALATION_SOURCES.filingFeeStatute },
                {
                  label: "US district court fee schedule",
                  href: ESCALATION_SOURCES.courtFees,
                },
              ]}
            />

            <div className="mx-auto mt-6 max-w-3xl">
              <NotLegalAdvice />
            </div>

            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card">
              <h2 className="text-base font-bold text-ink-900">Related</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {[
                  { href: "/tools/uscis-processing-delay-checker", label: "Am I outside normal processing time?" },
                  { href: "/uscis/forms/i-907-premium-processing", label: "Premium processing (Form I-907)" },
                  { href: "/i140-premium-processing", label: "I-140 premium processing" },
                  { href: "/h1b/premium-processing", label: "H-1B premium processing" },
                  { href: "/advance-parole-processing-time", label: "Advance parole processing time" },
                  { href: "/ead-renewal-gap", label: "EAD renewal gap" },
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
                  "USCIS case handling",
                  "Premium vs expedite",
                  "Emergency travel from the US to India",
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
