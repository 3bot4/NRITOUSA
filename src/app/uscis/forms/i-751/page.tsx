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
import I751WindowCalculator from "@/components/tools/I751WindowCalculator";
import { I751TimelineDiagram } from "@/components/tools/i751/timeline";
import {
  ExtensionCoverageChart,
  WaiverGroundDiagram,
} from "@/components/tools/i751/I751Visuals";
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
  I751_FACTS,
  I751_SOURCES,
  I751_BASES,
  I751_WAIVER_GROUNDS,
  I751_EVIDENCE,
  I751_CHILDREN,
  I751_FEE_EXEMPTIONS,
  I751_TRANSLATION,
} from "@/data/i751Data";

const PAGE_PATH = "/uscis/forms/i-751";
const PUBLISHED = "2026-09-16";
const UPDATED = "2026-09-21";

export const metadata: Metadata = pageMetadata({
  title: "Form I-751: Remove Conditions on a Marriage Green Card — Window, Fee, Timeline",
  description: `Form I-751 removes the conditions from a marriage-based ${I751_FACTS.conditionalYears}-year green card (EB-5 investors file Form I-829). Joint petitions are filed in the ${I751_FACTS.windowDays} days before conditional residence expires; fee ${I751_FACTS.onlineFee} online or ${I751_FACTS.paperFee} paper, and the receipt notice extends status ${I751_FACTS.extensionMonths} months. Free filing-window calculator.`,
  path: PAGE_PATH,
  type: "article",
  openGraph: { publishedTime: PUBLISHED, modifiedTime: UPDATED },
});

const crumbs = [
  { name: "Home", url: "/" },
  { name: "USCIS Hub", url: "/uscis" },
  { name: "USCIS Forms", url: "/uscis/forms" },
  { name: "Form I-751", url: PAGE_PATH },
];

const faqs: FaqItem[] = [
  {
    question: "Who files Form I-751 to remove the conditions on a green card?",
    answer: `Form I-751 is used by a conditional permanent resident who obtained status through marriage — you had been married less than ${I751_FACTS.conditionalYears} years on the day you became a permanent resident, so USCIS issued a card valid for ${I751_FACTS.conditionalYears} years rather than ten. If you are still married to the spouse through whom you obtained status, you and that spouse file the petition jointly. If the marriage ended in divorce or annulment, your spouse died, you or your conditional resident child were battered or subjected to extreme cruelty, or termination of status and removal would cause extreme hardship, you may file the same form individually with a request to waive the joint filing requirement. A ${I751_FACTS.conditionalYears}-year card by itself does not mean I-751: a conditional resident who obtained status through EB-5 investment files Form I-829 instead. Source: Form I-751 instructions, edition ${I751_FACTS.instructionsEdition}.`,
  },
  {
    question: "Is Form I-751 the form for every two-year green card?",
    answer: `No — and this is the most common mix-up on the topic. What picks the form is how you obtained conditional residence, not the validity period printed on the card. A conditional resident who obtained status through marriage files Form I-751. A conditional resident who obtained status through EB-5 investment files Form I-829, Petition by Investor to Remove Conditions on Permanent Resident Status, which is a different form with a different fee. Form I-90 is a third thing again: it replaces or renews a ten-year card, and it does not remove conditions.`,
  },
  {
    question: "When do I have to file Form I-751?",
    answer: `It depends on which route you are on, and the two rules are genuinely different. A joint petition must be filed during the ${I751_FACTS.windowDays}-day period immediately before your conditional residence expires — earlier is rejected, later is a late filing. For an eligible individual or waiver petition, the Form I-751 instructions say the petition may be filed at any time after you are granted conditional resident status and before you are removed from the United States, so the ${I751_FACTS.windowDays}-day window is not the governing rule. That is not the same as saying any particular filing is timely or that eligibility is established: if your status has already expired, or you are in removal proceedings, talk to a qualified immigration lawyer about your own facts before filing.`,
  },
  {
    question: "What is the fee to remove conditions on a green card?",
    answer: `${I751_FACTS.onlineFee} filed online, ${I751_FACTS.paperFee} on paper — filing online is $50 cheaper. Form G-1055 lists no separate biometric services fee for Form I-751, so a page still quoting "plus $85 biometrics" is out of date. A conditional permanent resident, spouse or child who files a waiver of the joint filing requirement based on battery or extreme cruelty is in a $0 fee category and does not have to request a fee waiver for it. G-1055 separately notes that certain applicants may be eligible for a fee waiver on Form I-912; eligibility is set by the Form I-912 instructions and the request is decided by USCIS, not granted automatically. Figures from ${I751_FACTS.feeEdition}; check the fee schedule before you pay, because an incorrect fee gets the petition rejected.`,
  },
  {
    question: "What is the timeline for removal of green card conditions?",
    answer: `Conditional residence lasts ${I751_FACTS.conditionalYears} years, and the joint-filing window is the last ${I751_FACTS.windowDays} days of it. Once USCIS accepts the petition, the receipt notice extends your conditional resident status and your employment authorisation for ${I751_FACTS.extensionMonths} months beyond the expiry date printed on the card — that extension exists precisely because adjudication routinely outlasts the card. After that, USCIS may schedule a biometrics appointment, or may instead reuse biometrics it already has on file; either way it sends a notice. USCIS may also request more evidence, or ask you to appear for an interview. Then a decision. USCIS does not publish a fixed sequence of dates, and its processing times move month to month.`,
  },
  {
    question: "How long does the I-751 receipt notice extend my status?",
    answer: `${I751_FACTS.extensionMonths} months beyond the expiration date printed on your conditional card. USCIS moved to ${I751_FACTS.extensionMonths} months on ${formatDate(I751_FACTS.extensionSince)}; before that it was shorter, which is why older guides — and several law-firm pages still online in 2026 — say 24 months. Your Form I-797C receipt notice presented with the expired card is your evidence of status and employment authorisation while that extension is valid.`,
  },
  {
    question: "What happens if I miss the I-751 deadline?",
    answer:
      "Your conditional permanent residence terminates when the conditional period ends, and USCIS may issue a Notice to Appear starting removal proceedings. A late petition can still be filed with a written explanation asking USCIS to excuse the late filing. The standard in the instructions is specific: failure to file before the expiration date may be excused if you demonstrate, when you file, that the delay was due to extraordinary circumstances beyond your control and that the length of the delay was reasonable. Illness, a disaster or a lawyer's failure are not automatically accepted — USCIS decides whether to excuse the delay on the explanation and evidence you actually provide. File as soon as you realise, and get an immigration lawyer involved.",
  },
  {
    question: "Do I have to attend an interview for the I-751?",
    answer:
      "Not necessarily. The instructions say USCIS may request that you appear at a USCIS office for an interview based on your petition, and USCIS may also waive it. There is no threshold of evidence that guarantees a waived interview and no published list of automatic triggers. USCIS decides case by case on the complete record — unresolved questions or inconsistencies, concerns about fraud or misrepresentation, complex facts, criminal history and other relevant factors all feed into it. A waiver filing after a divorce is not automatically an interview case either. If USCIS wants an interview, it mails an appointment notice.",
  },
  {
    question: "Can I file N-400 for citizenship while my I-751 is pending?",
    answer:
      "You may file Form N-400 while the I-751 is pending only if you are independently eligible to naturalise — the pending I-751 does not create eligibility, and reaching a three-year anniversary is not by itself a reason to file. An N-400 may not be approved while a petition to remove conditions is pending: USCIS must approve the I-751 before, or at the same time as, the N-400, and the two are often handled in a combined interview. The marriage-based three-year route under INA 319(a) has its own separate requirements, including the required period as a lawful permanent resident and living in marital union with the same US citizen spouse for the three years immediately before filing, with that spouse remaining a US citizen through the oath — divorce, annulment or legal separation can end eligibility on that route, leaving the general five-year rule. The rule allowing an application to be filed up to 90 calendar days before completing the required period of continuous residence applies only to that residence period; every other requirement must still be met when you file and when you naturalise. Narrow exceptions exist for certain military applicants and certain spouses of US citizens employed abroad. Source: USCIS Policy Manual, Vol. 12, Pt. G.",
  },
  {
    question: "Can I travel to India while my I-751 is pending?",
    answer: `You remain a conditional permanent resident while the petition is pending and may travel, but carry the full set: a valid passport, your expired conditional green card, and the applicable original Form I-797 receipt notice showing the ${I751_FACTS.extensionMonths}-month extension. The expired card together with that notice is your temporary evidence of permanent resident status for as long as the extension is valid. If the extension has already expired, or would expire while you are abroad, ask USCIS for current temporary proof of permanent resident status — an ADIT (I-551) stamp — before you leave; you request it through the USCIS Contact Center. On absences: abandonment of permanent residence is assessed on the overall facts and your intent, not by a single number of days. Separately, for naturalisation, an absence of more than six months but less than a year during the required period is presumed to break continuous residence, and that presumption can be rebutted; an absence of a year or more generally breaks it outright.`,
  },
  {
    question: "Can my children be included on my I-751, or do they file their own?",
    answer: `${I751_CHILDREN.included} ${I751_CHILDREN.separate}`,
  },
  {
    question: "Do I have to translate my Indian marriage certificate and other documents?",
    answer: I751_TRANSLATION,
  },
  {
    question:
      "My conditional green card expired while the I-751 is pending. What do I do?",
    answer: `That is the expected state, and it is what the receipt notice is for. When USCIS accepts the petition it issues a receipt notice extending your conditional permanent resident status and employment authorisation for ${I751_FACTS.extensionMonths} months beyond the expiry date printed on the card, a length in force since ${formatDate(I751_FACTS.extensionSince)}. Carry the receipt notice with the expired card: that pair is your evidence of status for an employer, for the DMV and for re-entry. Keep a scan. If the receipt notice has not arrived before the card expires, check your USCIS online account and contact the USCIS Contact Center rather than waiting — and if the notice is lost, or the extension itself has run out while the case is still pending, you can request an appointment for temporary proof of status (an ADIT/I-551 stamp) at a field office.`,
  },
  {
    question: "What are the most common I-751 mistakes?",
    answer: `Filing a joint petition before the window opens, which gets it rejected; assuming a missed window has shut you out when you are on an individual or waiver basis, where the ${I751_FACTS.windowDays}-day rule is not the governing one; submitting evidence that all dates from one short period rather than covering the relationship over time; filing a foreign-language document without the required certified English translation; throwing away the receipt notice that is now your status document; and not filing AR-11 after a move, so a USCIS notice goes to the old address.`,
  },
];

export default function I751Page() {
  const url = absoluteUrl(PAGE_PATH);

  const jsonLd = jsonLdGraph(
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline:
        "Remove the Conditions on a Marriage-Based Green Card: the Form I-751 Filing Window, Fee and Timeline",
      description:
        "Who Form I-751 is for (marriage-based conditional residents; EB-5 investors file Form I-829), when to file jointly versus individually, what it costs, how long the receipt notice extends your status, and the standard USCIS applies to a late filing.",
      datePublished: PUBLISHED,
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
      name: "I-751 Filing Window Calculator",
      description:
        "For marriage-based conditional permanent residents: work out the 90-day joint-filing window for Form I-751, how long a receipt notice would extend your status, and a calendar reminder. Educational only, not legal advice.",
      url: `${url}#calculator`,
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
              How to remove the conditions on a marriage-based green card: Form
              I-751
            </h1>

            {/* ANSWER FIRST */}
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-700 sm:text-lg">
              Form I-751 is for a conditional permanent resident who obtained
              status <strong>through marriage</strong>. If you and that spouse
              are filing jointly, the petition goes in during the{" "}
              <strong>{I751_FACTS.windowDays} days immediately before your
              conditional residence expires</strong> — {I751_FACTS.onlineFee}{" "}
              online or {I751_FACTS.paperFee} on paper. The receipt notice then
              extends your status and work authorisation by{" "}
              <strong>{I751_FACTS.extensionMonths} months</strong>. A conditional
              resident who obtained status through EB-5 investment files{" "}
              <strong>Form I-829</strong> instead, not this form.
            </p>

            <ul className="mt-5 grid max-w-3xl gap-2 sm:grid-cols-2">
              {[
                `Who: conditional permanent residents who obtained status through marriage. EB-5 investors file Form I-829`,
                `Joint filing: the last ${I751_FACTS.windowDays} days of the ${I751_FACTS.conditionalYears}-year conditional period — earlier is rejected`,
                `Individual/waiver filing: the instructions allow filing any time after conditional residence is granted and before you are removed from the US`,
                `Fee: ${I751_FACTS.onlineFee} online, ${I751_FACTS.paperFee} paper. G-1055 lists no separate biometrics fee`,
                `Receipt notice extends status and work authorisation ${I751_FACTS.extensionMonths} months past the card's expiry`,
                "An interview is not automatic and not guaranteed to be waived — USCIS decides case by case on the whole record",
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
              title="Form I-751 at a glance"
              answerLabel="Joint-filing window"
              answer={`${I751_FACTS.windowDays} days`}
              accent="brand"
              badges={[
                "Marriage-based conditional residents",
                `Fee ${I751_FACTS.onlineFee} online`,
                `${I751_FACTS.extensionMonths}-month extension`,
              ]}
              rows={[
                {
                  label: "Who uses this form",
                  value: "Marriage-based",
                  note: "Conditional residents who obtained status through marriage. EB-5 investors file Form I-829",
                  highlight: true,
                },
                {
                  label: "Filing fee — online",
                  value: I751_FACTS.onlineFee,
                  note: "$50 cheaper than paper",
                },
                { label: "Filing fee — paper", value: I751_FACTS.paperFee },
                {
                  label: "Separate biometrics fee",
                  value: "None listed",
                  note: `G-1055 lists no biometric services fee for Form I-751`,
                },
                {
                  label: "Receipt notice extends status",
                  value: `${I751_FACTS.extensionMonths} months`,
                  note: `In force since ${formatDate(I751_FACTS.extensionSince)}`,
                },
                {
                  label: "Conditional card validity",
                  value: `${I751_FACTS.conditionalYears} years`,
                },
                {
                  label: "Waiver based on battery or extreme cruelty",
                  value: "$0",
                  note: "Automatic fee category — no Form I-912 request needed for it",
                },
              ]}
              lastVerified={I751_FACTS.lastVerified}
              sources={[
                { label: "Form I-751 (USCIS)", href: I751_SOURCES.form },
                { label: `Form I-751 instructions (${I751_FACTS.instructionsEdition})`, href: I751_SOURCES.instructions },
                { label: `Fee schedule (${I751_FACTS.feeEdition})`, href: I751_SOURCES.feeSchedule },
                { label: `${I751_FACTS.extensionMonths}-month extension alert`, href: I751_SOURCES.extensionAlert },
              ]}
              disclaimer="Educational summary, not legal advice. Fees change with each edition of the USCIS fee schedule and the extension length has changed before — verify both before filing, because an incorrect fee gets the petition rejected."
              ctaText="Work out my filing window"
              ctaHref="#calculator"
            />
          </Container>
        </section>

        <section id="calculator" className="scroll-mt-24 py-10 sm:py-14">
          <Container>
            <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
              Filing window calculator
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-500">
              For conditional permanent residents who obtained status through
              marriage. Read one date off the front of your card and pick your
              filing basis: the calculator works out the{" "}
              {I751_FACTS.windowDays}-day joint-filing window, how long a receipt
              notice would carry your status, and a calendar reminder generated
              on your own device. It does not decide eligibility, and it is not
              legal advice.
            </p>
            <div className="mt-6">
              <I751WindowCalculator />
            </div>
          </Container>
        </section>

        <section className="border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <div className="mx-auto max-w-[720px] space-y-10 text-[0.975rem] leading-relaxed text-ink-700">
              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Who this form is for — and who it is not for
                </h2>
                <p className="mt-3">
                  The Form I-751 instructions open with the scope, and it is
                  narrower than most pages on this topic suggest:{" "}
                  <strong>
                    the petition is used by a conditional resident who obtained
                    status through marriage
                  </strong>
                  . If you became a permanent resident through marriage and the
                  marriage was less than {I751_FACTS.conditionalYears} years old
                  on the day you were approved, Congress gives you a card with an
                  expiry date instead of the usual ten-year one. The idea is a
                  checkpoint: {I751_FACTS.conditionalYears} years later, the
                  government looks again and asks whether the marriage was
                  entered into in good faith. Form I-751 is that checkpoint.
                </p>
                <p className="mt-3">
                  What decides your form is the <em>basis</em> of your
                  conditional status, not the validity period printed on the
                  card. Marriage-based conditional residents file I-751. A
                  conditional resident who obtained status through EB-5
                  investment files{" "}
                  <a
                    href={I751_SOURCES.i829}
                    target="_blank"
                    rel="nofollow noopener"
                    className="text-brand-600 underline"
                  >
                    Form I-829
                  </a>
                  , Petition by Investor to Remove Conditions on Permanent
                  Resident Status — a different form, with a different fee. And
                  Form I-90 is a third thing again: it replaces or renews a
                  ten-year card and removes no conditions at all.
                </p>
                <p className="mt-3">
                  The other thing to understand is what a conditional card is
                  not. It is not a probationary green card that upgrades
                  automatically. Nothing happens on its own. If nothing is filed,
                  conditional permanent residence terminates at the end of the{" "}
                  {I751_FACTS.conditionalYears}-year period and you become
                  removable from the United States.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  The whole path, start to finish
                </h2>
                <I751TimelineDiagram />

                <h3 className="mt-8 text-base font-bold text-ink-900">
                  The card expires long before the petition is decided
                </h3>
                <p className="mt-2">
                  This is the part that causes real-world trouble — a driver&apos;s
                  licence renewal refused, an employer asking for an unexpired
                  card, a trip to India booked against a card that ran out.
                  Drawn to scale, the answer is obvious: once USCIS accepts the
                  petition, the expired card together with the receipt notice is
                  your evidence of status — for as long as the extension on that
                  notice is valid.
                </p>
                <ExtensionCoverageChart />

                <h3 className="mt-8 text-base font-bold text-ink-900">
                  If the receipt notice has not arrived before the card expires
                </h3>
                <p className="mt-2">
                  Do not simply wait it out. Check the case status in your USCIS
                  online account first — if you filed online, the notice posts
                  there rather than arriving by post — and confirm USCIS has the
                  address you are actually at, filing Form AR-11 within 10 days of
                  any move. If the notice still has not appeared, or it was lost,
                  contact the{" "}
                  <a
                    href={I751_SOURCES.contactCenter}
                    target="_blank"
                    rel="nofollow noopener"
                    className="text-brand-600 underline"
                  >
                    USCIS Contact Center
                  </a>
                  , which can arrange a replacement notice or an appointment for
                  temporary proof of permanent resident status — an ADIT (I-551)
                  stamp — while the petition is pending. The same route is how you
                  get current proof of status if the{" "}
                  {I751_FACTS.extensionMonths}-month extension itself runs out
                  before a decision. That proof matters in practice for an
                  employer completing Form I-9, for a driving licence renewal and
                  for re-entry to the United States.
                </p>

                <h3 className="mt-8 text-base font-bold text-ink-900">
                  What it costs to file
                </h3>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full min-w-[560px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          How you file
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Fee
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          What is included
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      <tr className="border-b border-ink-900/5 align-top">
                        <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                          Online
                        </th>
                        <td className="py-3 pr-3 font-semibold text-emerald-700">
                          {I751_FACTS.onlineFee}
                        </td>
                        <td className="py-3">
                          No separate biometric services fee is listed. Cheapest
                          route, and the receipt notice posts to your account
                          rather than waiting on the post.
                        </td>
                      </tr>
                      <tr className="border-b border-ink-900/5 align-top">
                        <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                          By mail
                        </th>
                        <td className="py-3 pr-3 font-semibold text-ink-800">
                          {I751_FACTS.paperFee}
                        </td>
                        <td className="py-3">
                          No separate biometric services fee is listed. $50 more
                          than filing online, for the same adjudication.
                        </td>
                      </tr>
                      {I751_FEE_EXEMPTIONS.map((f) => (
                        <tr key={f.label} className="border-b border-ink-900/5 align-top">
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {f.label}
                          </th>
                          <td className="py-3 pr-3 font-semibold text-emerald-700">
                            {f.fee}
                          </td>
                          <td className="py-3">{f.detail}</td>
                        </tr>
                      ))}
                      <tr className="border-b border-ink-900/5 align-top">
                        <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                          A separate biometrics fee
                        </th>
                        <td className="py-3 pr-3 font-semibold text-ink-400">
                          None listed
                        </td>
                        <td className="py-3">
                          G-1055 lists no biometric services fee for Form I-751,
                          so pages still quoting &ldquo;plus $85 biometrics&rdquo;
                          are out of date.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-sm text-ink-500">
                  Source: USCIS fee schedule, {I751_FACTS.feeEdition}. Read{" "}
                  {formatDate(I751_FACTS.lastVerified)}. Fees change with each
                  edition — confirm on the official fee schedule before paying,
                  because an incorrect fee gets the petition rejected.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Joint filing vs filing individually
                </h2>
                <p className="mt-3">
                  These are two routes through the same form, and the timing rule
                  is different on each — which is the single most useful thing on
                  this page for anyone whose marriage has ended.
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {I751_BASES.map((b) => (
                    <div
                      key={b.id}
                      className={`rounded-2xl border p-5 ${
                        b.windowApplies
                          ? "border-brand-200 bg-brand-50/40"
                          : "border-amber-200 bg-amber-50/40"
                      }`}
                    >
                      <p className="text-sm font-bold text-ink-900">{b.label}</p>
                      <p className="mt-2 text-sm text-ink-600">{b.who}</p>
                      <p className="mt-3 text-sm text-ink-700">
                        <strong className="font-semibold">Timing:</strong> {b.timing}
                      </p>
                    </div>
                  ))}
                </div>
                <WaiverGroundDiagram />

                <h3 className="mt-6 text-base font-bold text-ink-900">
                  The grounds for filing without your spouse
                </h3>
                <ul className="mt-3 space-y-2.5">
                  {I751_WAIVER_GROUNDS.map((g) => (
                    <li key={g.title} className="rounded-xl border border-ink-900/5 bg-white px-4 py-3">
                      <p className="text-sm font-semibold text-ink-900">{g.title}</p>
                      <p className="mt-1 text-sm text-ink-600">{g.detail}</p>
                    </li>
                  ))}
                </ul>
                <h3 className="mt-6 text-base font-bold text-ink-900">
                  If a divorce is in progress but not final
                </h3>
                <p className="mt-3">
                  This is the situation on which generic advice does the most
                  damage, so here is what the instructions actually support and
                  what they do not. The waiver ground based on a terminated
                  marriage calls for a copy of the{" "}
                  <strong>final divorce decree</strong> or other document
                  terminating or annulling the marriage, so that ground generally
                  needs a final decree rather than a divorce that is merely under
                  way.
                </p>
                <p className="mt-3">
                  That does not make &ldquo;file jointly first&rdquo; the default
                  strategy, whatever else you may read. A joint petition requires
                  both spouses to sign, and signing it asserts a marriage that is
                  still ongoing — not something to do as a tactic. Where a
                  joint petition <em>is already pending</em> and a final decree
                  issues afterwards, USCIS may in some cases allow that pending
                  petition to be amended to a request to waive the joint filing
                  requirement. Whether that is available, and how to ask for it,
                  depends on the posture of your case.
                </p>
                <p className="mt-3">
                  If your divorce is pending, you are separated, there is abuse in
                  the picture, or you are in removal proceedings, this is the
                  point to get a qualified immigration lawyer rather than to
                  follow a checklist.{" "}
                  <Link href="/divorce-immigration-status" className="text-brand-600 underline">
                    Divorce and your immigration status
                  </Link>{" "}
                  covers what changes at each stage, including the point that a
                  divorce does not by itself cost you a green card, and{" "}
                  <Link href="/immigration-attorney-lawyer-cost" className="text-brand-600 underline">
                    what an immigration attorney costs
                  </Link>{" "}
                  sets expectations before you start calling.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Filing late, and what USCIS actually requires
                </h2>
                <p className="mt-3">
                  If a joint petition is not filed before conditional residence
                  ends, that status terminates and you become removable from the
                  United States; USCIS may issue a Notice to Appear. A late
                  petition can still be filed, with a written explanation asking
                  USCIS to excuse the late filing.
                </p>
                <p className="mt-3">
                  The standard is narrower than most summaries of it. The
                  instructions say failure to file before the expiration date may
                  be excused if you demonstrate, <em>when you file the
                  petition</em>, both that{" "}
                  <strong>
                    the delay was due to extraordinary circumstances beyond your
                    control
                  </strong>{" "}
                  and that{" "}
                  <strong>the length of the delay was reasonable</strong>. Two
                  things follow. First, there is no list of accepted excuses:
                  illness, a natural disaster or a lawyer&rsquo;s failure to file
                  are not automatically accepted, and each still has to be
                  explained and evidenced against both halves of that test.
                  Second, <strong>USCIS decides whether to excuse it</strong> —
                  filing late is a request, not a right, and the evidence goes in
                  with the petition rather than later.
                </p>
                <p className="mt-3">
                  Two practical points. A delay of a few weeks with documents
                  behind it is a different proposition from a delay of years with
                  an explanation written afterwards, which is why filing the
                  moment you realise matters. And if you are on an individual or
                  waiver basis, the {I751_FACTS.windowDays}-day deadline is not
                  the rule that governs you in the first place — check your basis
                  before you conclude you are late. Either way, this is a point at
                  which qualified legal advice stops being optional.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  The evidence that goes in with the petition
                </h2>
                <p className="mt-3">
                  An officer is trying to answer one question: was this marriage
                  entered into in good faith, and not for the purpose of
                  circumventing the immigration laws? Not whether it survived —
                  plenty of genuine marriages end. The instructions ask for copies
                  of as many documents as you can produce showing the
                  circumstances of the relationship from the date of the marriage
                  to the present, and the circumstances of its ending if it has
                  ended.
                </p>
                <p className="mt-3">
                  USCIS publishes no ranking of I-751 evidence, so be wary of
                  any list that gives you one. <strong>No single document proves
                  a good-faith marriage</strong>, and neither does the existence
                  of children — birth certificates are one example in the
                  instructions, not a decisive one, and not having children does
                  not count against you. What you are aiming for is credible,
                  consistent evidence that covers the relationship over time.
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[520px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">Category</th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">What to include</th>
                        <th scope="col" className="py-2 font-bold text-ink-900">Why it helps</th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {I751_EVIDENCE.map((e) => (
                        <tr key={e.category} className="border-b border-ink-900/5 align-top">
                          <th scope="row" className="py-2.5 pr-3 text-left font-semibold text-ink-800">
                            {e.category}
                          </th>
                          <td className="py-2.5 pr-3">{e.examples}</td>
                          <td className="py-2.5">{e.why}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4">
                  Two patterns tend to leave questions unanswered. The first is a
                  burst of documents around the wedding and around the filing
                  date with a hollow middle, which covers the relationship less
                  completely than the instructions ask for. The second is
                  addresses that do not agree across documents with nothing in the
                  file explaining why — an inconsistency an officer may reasonably
                  ask you about. Neither is disqualifying, and both are usually
                  answerable with an explanation and further documents.
                </p>
                <p className="mt-4">
                  <strong>Translations.</strong> {I751_TRANSLATION}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Your children: on your petition, or their own?
                </h2>
                <p className="mt-3">
                  A conditional resident child is not automatically carried along
                  by a parent&rsquo;s petition, and the dividing line is the date
                  the child got conditional status — not whether they live with
                  you.
                </p>
                <ul className="mt-3 space-y-2.5">
                  <li className="rounded-xl border border-ink-900/5 bg-white px-4 py-3">
                    <p className="text-sm font-semibold text-ink-900">
                      Include them on your petition
                    </p>
                    <p className="mt-1 text-sm text-ink-600">{I751_CHILDREN.included}</p>
                  </li>
                  <li className="rounded-xl border border-amber-200 bg-amber-50/40 px-4 py-3">
                    <p className="text-sm font-semibold text-ink-900">
                      They file their own Form I-751
                    </p>
                    <p className="mt-1 text-sm text-ink-600">{I751_CHILDREN.separate}</p>
                  </li>
                </ul>
                <p className="mt-3">
                  Getting this wrong is expensive in a specific way: a child left
                  off a parent&rsquo;s petition who also never filed their own is
                  a conditional resident whose status terminates on its own
                  schedule. Count the days between the child&rsquo;s admission or
                  adjustment and yours before you assume.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Travelling to India while the petition is pending
                </h2>
                <p className="mt-3">
                  Adjudication routinely runs longer than the card, which is
                  exactly why the receipt notice carries a{" "}
                  {I751_FACTS.extensionMonths}-month extension. You remain a
                  conditional permanent resident throughout and you may travel.
                  Carry the full set:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>
                    <strong>A valid passport.</strong> Conditional residents
                    travel on their own national passport, and it needs to be
                    unexpired — an ADIT stamp, if you end up needing one, can only
                    be placed on a Form I-94 or in an unexpired passport.
                  </li>
                  <li>
                    <strong>
                      Your expired conditional green card together with the
                      applicable original Form I-797 extension notice.
                    </strong>{" "}
                    That pair is your temporary evidence of permanent resident
                    status while the {I751_FACTS.extensionMonths}-month extension
                    on the notice remains valid. Neither document does the job on
                    its own, so carry the printed original rather than a photo of
                    it.
                  </li>
                  <li>
                    <strong>
                      Current temporary proof of status, if the extension has
                      expired or will expire while you are away.
                    </strong>{" "}
                    An extension notice that has run out is not evidence of
                    status. Before you leave, ask USCIS for temporary proof of
                    permanent resident status — an ADIT (I-551) stamp — through
                    the{" "}
                    <a
                      href={I751_SOURCES.contactCenter}
                      target="_blank"
                      rel="nofollow noopener"
                      className="text-brand-600 underline"
                    >
                      USCIS Contact Center
                    </a>
                    . USCIS decides whether to issue it and sets the validity
                    period, so leave real time for it rather than booking against
                    it.
                  </li>
                </ul>
                <p className="mt-3">
                  On length of trips: <strong>there is no six-month rule that
                  decides abandonment.</strong> Whether you have abandoned
                  permanent residence is assessed on the overall facts and your
                  intent — the purpose of the trip, your ties to the United
                  States, whether the absence was temporary — not on a single
                  number of days. Separately, and this is a different test
                  entirely, an absence of more than six months but less than a
                  year during the period for which continuous residence is
                  required for <em>naturalisation</em> is presumed to break that
                  continuity, a presumption you can rebut with evidence; an
                  absence of a year or more generally breaks it outright. A
                  pending I-751 does not change either analysis.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Whether there is an interview
                </h2>
                <p className="mt-3">
                  The instructions put it plainly: USCIS <em>may</em> request that
                  you appear at a USCIS office for an interview based on your
                  petition. USCIS may also decide not to. There is no threshold of
                  evidence that guarantees a waived interview, and no published
                  list of automatic triggers — so treat any page promising either
                  with suspicion.
                </p>
                <p className="mt-3">
                  USCIS decides case by case on the complete record. Among the
                  things that can bear on that decision:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>
                    Whether the record as filed leaves questions unresolved, or
                    contains inconsistencies — including inconsistencies with the
                    earlier I-130 and adjustment file.
                  </li>
                  <li>
                    Any concern about fraud or misrepresentation in the marriage
                    or in the petition.
                  </li>
                  <li>Complex or unusual facts that documents alone do not settle.</li>
                  <li>Criminal history or other eligibility issues.</li>
                  <li>
                    Other factors relevant to the case, including how completely
                    the evidence covers the period.
                  </li>
                </ul>
                <p className="mt-3">
                  A waiver filing after a divorce is <em>not</em> automatically an
                  interview case, and a thick file is not automatically a waived
                  one. What you can control is the record: file complete, coherent
                  evidence, and explain anything in it that looks odd before an
                  officer has to ask.
                </p>
                <p className="mt-3">
                  If an interview notice arrives, treat it as a chance to close
                  the gaps rather than a verdict.{" "}
                  <Link href="/uscis/interview-scheduled" className="text-brand-600 underline">
                    What the &ldquo;interview scheduled&rdquo; status means
                  </Link>{" "}
                  covers what the notice itself tells you.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  If the petition is denied
                </h2>
                <p className="mt-3">
                  A denial terminates conditional residence and USCIS generally
                  issues a Notice to Appear in immigration court. That sounds
                  final and is not: an immigration judge reviews the I-751 afresh,
                  and you can present the evidence again there, including evidence
                  that did not exist when you filed. There is no appeal to the
                  Administrative Appeals Office from an I-751 denial — the review
                  happens in the removal proceeding itself.
                </p>
                <p className="mt-3">
                  This is the part of the process where representation genuinely
                  changes outcomes.{" "}
                  <Link href="/immigration-attorney-lawyer-cost" className="text-brand-600 underline">
                    What an immigration attorney costs
                  </Link>{" "}
                  sets expectations before you start calling.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  After approval
                </h2>
                <p className="mt-3">
                  You receive a ten-year card and the conditions are gone for
                  good. From there, the card is renewed on Form I-90 rather than
                  I-751 —{" "}
                  <Link href="/green-card-renewal" className="text-brand-600 underline">
                    the green card renewal guide
                  </Link>{" "}
                  covers that cycle, and{" "}
                  <Link href="/i90-vs-i751" className="text-brand-600 underline">
                    I-90 vs I-751
                  </Link>{" "}
                  exists precisely because people file the wrong one. Time spent
                  as a conditional resident counts toward naturalisation, so the
                  clock for{" "}
                  <Link href="/uscis/forms/n-400" className="text-brand-600 underline">
                    Form N-400
                  </Link>{" "}
                  has been running the whole time.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Applying for citizenship while the I-751 is pending
                </h2>
                <p className="mt-3">
                  Start from the rule that matters:{" "}
                  <strong>
                    filing N-400 while the I-751 is pending makes sense only if
                    you are independently eligible to naturalise
                  </strong>
                  . A pending I-751 creates no naturalisation eligibility of its
                  own, and an approaching three-year anniversary is not by itself
                  a reason to file. Work out whether you meet the requirements of
                  a naturalisation route first; the I-751 question comes after
                  that.
                </p>
                <p className="mt-3">
                  If you are eligible, the sequencing is the part people get
                  wrong. An N-400 may not be approved while a petition to remove
                  conditions is pending — USCIS must approve the I-751 before, or
                  at the same time as, the N-400. You are not made to wait and
                  then start over, though: where an N-400 is pending, USCIS
                  adjudicates the I-751 before or concurrently with it, and the
                  two can be handled in a combined interview.
                </p>
                <p className="mt-3">
                  The marriage-based three-year route has its own separate
                  requirements, and they are not satisfied simply by being married
                  when you file. They include the required period as a lawful
                  permanent resident and living in marital union with the same US
                  citizen spouse for the three years immediately before filing,
                  with that spouse having been a US citizen for that period and
                  remaining one until you take the Oath of Allegiance. A divorce
                  or annulment ends eligibility on that route, and USCIS does not
                  treat spouses as living in marital union during a period of
                  legal separation — which usually leaves the general five-year
                  rule instead. If your marriage has ended or is ending, do not
                  plan around the three-year route without advice.
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[580px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Question
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          What actually happens
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {[
                        [
                          "Can I file the N-400 while the I-751 is pending?",
                          "Only if you are independently eligible to naturalise. A pending I-751 does not itself make you eligible, and filing is not blocked by it — approval is.",
                        ],
                        [
                          "Which one gets decided first?",
                          "The I-751. Where an N-400 is pending, USCIS adjudicates the I-751 before or at the same time as the N-400, and may not approve the N-400 while the petition is pending.",
                        ],
                        [
                          "Will I have two interviews?",
                          "Not necessarily. The two can be combined into a single interview covering both the marriage evidence and the naturalisation requirements. USCIS decides.",
                        ],
                        [
                          "What does the 3-year spousal route require?",
                          "Its own set of requirements, including the required period as an LPR and living in marital union with the same US citizen spouse for the three years immediately before filing, that spouse being a US citizen throughout and remaining one until the oath.",
                        ],
                        [
                          "What if the marriage ended, or we separated?",
                          "Divorce or annulment ends eligibility on the spousal route, and legal separation means you are not living in marital union for that period. The general 5-year rule usually applies instead, and the I-751 becomes an individual or waiver filing.",
                        ],
                        [
                          "Can I file 90 days early?",
                          "That rule lets an application be filed up to 90 calendar days before you complete the required period of continuous residence. It does not waive anything else — every other requirement must be met when you file and when you naturalise.",
                        ],
                        [
                          "Are there exceptions to needing the I-751 approved first?",
                          "Narrow ones, including certain qualifying military service and certain spouses of US citizens employed abroad. Check the Policy Manual against your own facts rather than assuming one fits.",
                        ],
                      ].map(([q, a]) => (
                        <tr key={q} className="border-b border-ink-900/5 align-top">
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {q}
                          </th>
                          <td className="py-3">{a}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-sm text-ink-500">
                  Sources: USCIS Policy Manual,{" "}
                  <a
                    href={I751_SOURCES.policyManualNatz}
                    target="_blank"
                    rel="nofollow noopener"
                    className="text-brand-600 underline"
                  >
                    Vol. 12, Pt. G, Ch. 5
                  </a>{" "}
                  (conditional permanent residents and naturalisation) and{" "}
                  <a
                    href={I751_SOURCES.policyManualSpouse}
                    target="_blank"
                    rel="nofollow noopener"
                    className="text-brand-600 underline"
                  >
                    Vol. 12, Pt. G, Ch. 2
                  </a>{" "}
                  (spouses of US citizens). Read{" "}
                  {formatDate(I751_FACTS.lastVerified)}. If you are getting
                  close to the interview,{" "}
                  <Link href="/tools/citizenship-test-practice" className="text-brand-600 underline">
                    the civics test practice tool
                  </Link>{" "}
                  covers the naturalisation half.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  The mistakes that cost the most time
                </h2>
                <p className="mt-3">
                  The ones that cost real time, and what to do instead.
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[620px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          The mistake
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          What it costs
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          Instead
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {[
                        [
                          "Filing the wrong form entirely",
                          "Months lost and a fee spent on a form that cannot grant what you need.",
                          "Match the form to how you got conditional status: marriage → I-751, EB-5 investment → I-829, renewing a ten-year card → I-90.",
                        ],
                        [
                          "Filing a joint petition before the window opens",
                          "Rejection and the fee returned — and by the time it comes back, weeks of the window are gone.",
                          `Use the calculator above. A joint petition belongs in the ${I751_FACTS.windowDays} days immediately before conditional residence expires.`,
                        ],
                        [
                          "Assuming a missed window has ended it",
                          "Months of doing nothing, on an individual or waiver basis that the 90-day rule never governed.",
                          "Check which basis you are filing on before you check the date, and get advice if your status has already expired.",
                        ],
                        [
                          "Evidence from one short period only",
                          "Leaves most of the relationship undocumented, when the instructions ask you to cover it from the date of the marriage to the present.",
                          "Aim for documents spread across the whole conditional period, not a burst around the wedding and the filing date.",
                        ],
                        [
                          "Foreign-language documents with no certified translation",
                          "An avoidable request for evidence on documents you already had.",
                          "File a full English translation with the signed translator certification for every foreign-language document.",
                        ],
                        [
                          "Throwing away the receipt notice",
                          `It is your evidence of status for ${I751_FACTS.extensionMonths} months. Replacing it means contacting USCIS, and possibly a field office appointment for an ADIT (I-551) stamp.`,
                          "Scan it, keep the original with the expired card, and carry both.",
                        ],
                        [
                          "Not filing AR-11 after moving",
                          "USCIS notices — a biometrics appointment, a request for evidence, an interview — go to the old address, and a missed appointment or deadline can sink the case.",
                          "File the change of address within 10 days, and update it in the online account too.",
                        ],
                        [
                          "Travelling on the expired card alone",
                          "Boarding refused, or delay on arrival.",
                          "Carry a valid passport, the expired card and the applicable original I-797 extension notice — and get an ADIT stamp first if that extension has run out.",
                        ],
                      ].map((row) => (
                        <tr key={row[0]} className="border-b border-ink-900/5 align-top">
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {row[0]}
                          </th>
                          <td className="py-3 pr-3">{row[1]}</td>
                          <td className="py-3 text-ink-500">{row[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  A note on processing times
                </h2>
                <p className="mt-3">
                  You will not find an &ldquo;I-751 takes X months&rdquo; figure on
                  this page, and that is deliberate. USCIS publishes processing
                  times per form, per subtype and per office, and they move every
                  month; a single range copied onto a third-party page is wrong
                  for most readers almost immediately. Check{" "}
                  <a
                    href={I751_SOURCES.processingTimes}
                    target="_blank"
                    rel="nofollow noopener"
                    className="text-brand-600 underline"
                  >
                    the official processing-times tool
                  </a>{" "}
                  for the office handling your case, and use{" "}
                  <Link
                    href="/tools/uscis-processing-delay-checker"
                    className="text-brand-600 underline"
                  >
                    our delay checker
                  </Link>{" "}
                  to see whether you are outside normal processing time and
                  eligible to submit an inquiry.
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
              intro={`Every figure, timing rule and standard on this page was checked against these official USCIS sources on ${formatDate(
                I751_FACTS.lastVerified
              )}. Fees and the extension length have both changed before, and form instructions are reissued — verify against the current edition before filing. This page is educational and is not legal advice.`}
              links={[
                { label: "Form I-751 (USCIS)", href: I751_SOURCES.form },
                { label: `Form I-751 instructions — edition ${I751_FACTS.instructionsEdition} (PDF)`, href: I751_SOURCES.instructions },
                { label: `USCIS fee schedule — ${I751_FACTS.feeEdition}`, href: I751_SOURCES.feeSchedule },
                { label: "Form I-912, Request for Fee Waiver", href: I751_SOURCES.feeWaiver },
                { label: "Form I-829 — conditional residents who invested (EB-5)", href: I751_SOURCES.i829 },
                { label: "Removing conditions based on marriage", href: I751_SOURCES.removingConditions },
                { label: "When to file your petition to remove conditions", href: I751_SOURCES.whenToFile },
                { label: `USCIS alert — ${I751_FACTS.extensionMonths}-month extension`, href: I751_SOURCES.extensionAlert },
                { label: "I-9 Central — the 48-month extension for employers", href: I751_SOURCES.i9Central },
                { label: "Conditional permanent residence", href: I751_SOURCES.conditionalResidence },
                { label: "Policy Manual Vol. 6, Pt. I, Ch. 7 — CPRs in removal proceedings", href: I751_SOURCES.policyManualRemoval },
                { label: "Policy Manual Vol. 12, Pt. G, Ch. 5 — CPRs and naturalisation", href: I751_SOURCES.policyManualNatz },
                { label: "Policy Manual Vol. 12, Pt. G, Ch. 2 — spouses of US citizens", href: I751_SOURCES.policyManualSpouse },
                { label: "Policy Manual Vol. 12, Pt. D, Ch. 3 — absences and continuous residence", href: I751_SOURCES.policyManualContinuousResidence },
                { label: "Policy Manual Vol. 11, Pt. B, Ch. 2 — temporary evidence of LPR status (ADIT)", href: I751_SOURCES.temporaryStatusDocs },
                { label: "USCIS processing times", href: I751_SOURCES.processingTimes },
              ]}
            />

            <div className="mx-auto mt-6 max-w-3xl">
              <NotLegalAdvice />
            </div>

            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card">
              <h2 className="text-base font-bold text-ink-900">Related guides</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {[
                  { href: "/i90-vs-i751", label: "I-90 vs I-751 — which form do you need?" },
                  { href: "/divorce-immigration-status", label: "Divorce and your immigration status" },
                  { href: "/green-card-renewal", label: "Green card renewal (Form I-90)" },
                  { href: "/replace-green-card", label: "Replacing a lost or damaged green card" },
                  { href: "/uscis/forms/n-400", label: "Form N-400 — naturalisation" },
                  { href: "/uscis/forms", label: "All USCIS forms explained" },
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
                  "US permanent residence process",
                  "Conditional residence & I-751",
                  "Travel to India on a pending petition",
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
