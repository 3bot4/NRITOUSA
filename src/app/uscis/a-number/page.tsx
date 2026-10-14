import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ReviewedByline from "@/components/ReviewedByline";
import AuthorBioBox from "@/components/AuthorBioBox";
import Newsletter from "@/components/Newsletter";
import NotLegalAdvice from "@/components/tools/NotLegalAdvice";
import OfficialSourceBox from "@/components/tools/OfficialSourceBox";
import ToolFaq from "@/components/tools/ToolFaq";
import WhichNumberIsThis from "@/components/tools/WhichNumberIsThis";
import {
  CardLocationDiagram,
  NumberMapDiagram,
  RegistrationTimelineChart,
} from "@/components/tools/a-number/ANumberVisuals";
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
  A_NUMBER_BASICS,
  A_NUMBER_LOCATIONS,
  A_NUMBER_PUBLISHED,
  A_NUMBER_SOURCES as SRC,
  A_NUMBER_UPDATED,
  A_NUMBER_VERIFIED,
  INDIA_NOTES,
  NUMBER_TYPES,
  NUMBER_TYPES_NOTE,
  RECOVERY_ROUTES,
  REGISTRATION,
} from "@/data/aNumberData";

/**
 * /uscis/a-number — the A-Number pillar.
 *
 * Owns: what the A-number is, its format, where it is printed, the six
 * identifiers it gets confused with, the federal alien-registration
 * requirement, and what to do when you cannot find it.
 *
 * Does NOT own, and only summarises with a link:
 *   Receipt numbers and prefixes     → /uscis/receipt-number
 *   USCIS online account number      → /uscis/online-account-number
 *   The I-797 notice itself          → /uscis/i-797-notice
 *   I-94 numbers and travel history  → /uscis/i-94
 *   SEVIS records                    → /education/sevis-termination-guide
 * See docs/seo/oct-2026-cluster/overlap-report.md §3.3.
 *
 * EDITORIAL NOTE. The keyword intent here is "where is my number", and the
 * second intent, created by the 2025-26 registration rule, is "do I have to
 * register?" For most NRI readers the answer to the second is NO — the I-94
 * they already hold is both a registration form and evidence of registration
 * under 8 CFR 264.1. Saying that plainly is the main value of this page. Do not
 * let an edit turn it into a page that implies everyone must file something.
 */

const PAGE_PATH = "/uscis/a-number";

export const metadata: Metadata = pageMetadata({
  title: "A-Number (Alien Registration Number): Where It Is, and the 6 Numbers It Is Not",
  description:
    "Your A-number is on the front of a green card or EAD under 'USCIS #', and on an immigrant visa as the Registration Number. It is not your receipt number, account number, I-94 number, SEVIS ID or visa control number. Plus: whether the 2026 registration rule applies to you — for most visa holders it does not.",
  path: PAGE_PATH,
  type: "article",
  openGraph: { publishedTime: A_NUMBER_PUBLISHED, modifiedTime: A_NUMBER_UPDATED },
});

const crumbs = [
  { name: "Home", url: "/" },
  { name: "USCIS Guide", url: "/uscis" },
  { name: "A-Number", url: PAGE_PATH },
];

const faqs: FaqItem[] = [
  {
    question: "What is an A-number?",
    answer: `An A-number, or Alien Registration Number, is the unique number attached to your alien-registration record. It identifies you as a person, for life, across every case and every agency — which is what makes it different from a receipt number or an account number, both of which identify a transaction. The format is the letter A followed by 8 or 9 digits. ${A_NUMBER_BASICS.whoGetsOne}`,
  },
  {
    question: "Where do I find my A-number?",
    answer:
      "On a green card and on an Employment Authorization Document it is on the front, in the block of text beside your photograph, labelled USCIS #. On a current card design the letter A is not printed — the digits after that label are the number. On an immigrant visa foil in your passport it is the field labelled Registration Number. It also appears on the Immigrant Data Summary that came with a consular visa package, and on many Form I-797 notices in the upper-right area. It does not appear on an I-94.",
  },
  {
    question: "Is the USCIS number on my green card the same as my A-number?",
    answer:
      "Yes. The label on the card reads USCIS #, and the digits under it are your Alien Registration Number. USCIS changed the label on the card; it did not change the number. This is the single commonest question about the A-number and the answer is that they are the same thing with two names.",
  },
  {
    question: "Is an A-number 8 or 9 digits?",
    answer:
      "Both exist. Older records carry 8 digits and more recently issued numbers carry 9. If an online form demands 9 digits and yours has 8, add a leading zero after the A — the digits are what matter, and the A and any hyphens are formatting. Writing it as A012345678, A-012-345-678 or 012345678 describes the same record.",
  },
  {
    question: "What is the difference between an A-number and a receipt number?",
    answer:
      "An A-number identifies you and never changes. A receipt number identifies one specific application or petition, is three letters followed by ten digits, and is new for every filing — so someone with an I-140, an I-485 and an I-765 on file has three receipt numbers and one A-number. Our receipt number guide decodes the prefixes.",
  },
  {
    question: "Do I have an A-number if I am on an H-1B?",
    answer:
      "Often not, and that is normal. An A-number is created when USCIS or the State Department opens an immigration record for you — a green card, an EAD, an immigrant visa, certain other filings. Someone who has been on an H-1B for years, has never applied for an EAD and has not started a green card process usually has no A-number at all. If a form asks for one and you do not have one, that is the answer rather than a problem to solve.",
  },
  {
    question: "Do I need to register with USCIS under the alien registration rule?",
    answer: `Probably not. 8 CFR 264.1 lists the documents that constitute evidence of registration, and the Form I-94 is on that list — as is the Permanent Resident Card. If you were admitted on a visa and issued an I-94, or you hold a green card or an EAD, you are already registered and there is nothing to file. The requirement reaches people 14 or older who were not registered and fingerprinted when they got a visa and who stay 30 days or more, which in practice is chiefly long-staying visitors who crossed a land border without a visa and without an I-94. USCIS publishes a determination tool on its own registration page if you want to check your specific facts.`,
  },
  {
    question: "What is Form G-325R?",
    answer: `Form G-325R, Biographic Information (Registration), is the form someone who is not already registered uses to satisfy the requirement. It is filed online only, through a USCIS online account, and each person needs their own account — including a child under 14, whose account a parent or guardian creates in the child's name and files on their behalf. There is no filing fee. Registration is not an immigration status and does not create work authorisation.`,
  },
  {
    question: "What do I do if I cannot find my A-number?",
    answer:
      "Work down three routes in order. Check your USCIS online account, where the number appears in your profile or on a case page if USCIS has associated one with the account. Check your saved I-797 notices and any old passport with an immigrant visa foil. If neither works, file Form G-639, a Freedom of Information Act request, for your own immigration file — it contains the number, and it is free, though FOIA processing runs in months rather than weeks.",
  },
  {
    question: "What if I have two different A-numbers?",
    answer:
      "Do not pick one. Tell USCIS in writing, through your attorney or on your next filing, that two records exist, giving both numbers and the documents each appears on, so the records can be consolidated. It happens more often than people expect, usually when a second record was opened before the first was found — a childhood case and an adult one, or a name transliterated two different ways. Filing under one number while your history sits under the other is how an approval ends up attached to the wrong record.",
  },
  {
    question: "Is the number on my H-1B visa stamp an A-number?",
    answer:
      "No. A nonimmigrant visa foil carries a visa control number, which identifies the sticker in your passport rather than you, and it is not interchangeable with an A-number. Only an immigrant visa foil carries a Registration Number, and that one is your A-number. Handing over a control number when a form asks for an A-number is the commonest version of this mistake.",
  },
  {
    question: "Should I share my A-number?",
    answer:
      "Treat it like a national ID number, because that is how it functions — it is the key to your immigration file. Share it with your own attorney, your employer's attorney, and the agency asking for it on a form. Do not post it in a forum, do not include it in a screenshot, and do not give it to a service offering to check your case status for a fee. Your own case status is free at egov.uscis.gov and in your myUSCIS account.",
  },
];

const jsonLd = jsonLdGraph(
  {
    "@type": "Article",
    "@id": `${absoluteUrl(PAGE_PATH)}#article`,
    headline:
      "The A-Number: where it is printed, the six numbers it is not, and whether the registration rule applies to you",
    description:
      "The Alien Registration Number explained: format and zero-padding, labelled diagrams of where it sits on each document, a comparison of all six identifiers people confuse it with, and the federal registration requirement read from 8 CFR 264.1.",
    datePublished: A_NUMBER_PUBLISHED,
    dateModified: A_NUMBER_UPDATED,
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

export default function ANumberPage() {
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
              Your A-number: where it is, and the six numbers it is not
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-700 sm:text-lg">
              On a green card or an EAD it is the number under{" "}
              <strong>USCIS #</strong> on the front. On an immigrant visa it is
              the <strong>Registration Number</strong>. It is{" "}
              <strong>A plus 8 or 9 digits</strong>, it identifies{" "}
              <em>you</em> rather than a case, and plenty of people in lawful
              status for years have never had one. It is not your receipt
              number, your account number, your I-94 number, your SEVIS ID or
              the control number on a visa foil.
            </p>

            <p className="mt-3 max-w-3xl text-sm text-ink-500">
              Last verified {formatDate(A_NUMBER_VERIFIED)} against 8 CFR 264.1,
              the USCIS Alien Registration Requirement page and Form G-1055.
            </p>

            <ul className="mt-5 grid max-w-3xl gap-2 sm:grid-cols-2">
              {[
                "The USCIS # on your green card IS your A-number",
                "A + 8 or 9 digits — add a leading zero if a form wants 9",
                "It identifies you for life, not one application",
                "An I-94 does not show it; a nonimmigrant visa does not either",
                "Already hold an I-94 or a green card? You are already registered",
                "Treat it like a national ID number",
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

            <ReviewedByline date={A_NUMBER_UPDATED} path={PAGE_PATH} className="mt-5" />
            <NotLegalAdvice className="mt-4 max-w-3xl" />
          </Container>
        </header>

        {/* ══════════ The tool ══════════ */}
        <section id="identify" className="scroll-mt-24 bg-ink-900/[0.02] py-10 sm:py-14">
          <Container>
            <div className="mx-auto mb-6 max-w-3xl">
              <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                Which number is this?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                Type a number and the check tells you which of the six
                identifiers it is, what it identifies and where it is used. It
                reads only the <strong>shape</strong> &mdash; the length and the
                prefix &mdash; and nothing you type is stored or sent anywhere.
                What comes back to you is masked.
              </p>
            </div>
            <WhichNumberIsThis />
          </Container>
        </section>

        <section className="border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <div className="mx-auto max-w-[760px] space-y-10 text-[0.975rem] leading-relaxed text-ink-700">
              {/* ── 1. What it is ── */}
              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  What it actually is
                </h2>
                <p className="mt-3">{A_NUMBER_BASICS.what}</p>
                <p className="mt-3">
                  The name it goes by depends on the document you are holding.
                  USCIS calls it the Alien Registration Number in its glossary,
                  prints <strong>USCIS #</strong> on cards, prints{" "}
                  <strong>A#</strong> on many notices, and the State Department
                  prints <strong>Registration Number</strong> on an immigrant
                  visa. All four labels mean the same number, which is most of
                  why this question has the search volume it does.
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[520px] border-collapse text-sm">
                    <caption className="sr-only">
                      The A-number at a glance
                    </caption>
                    <tbody className="text-ink-600">
                      {[
                        { k: "Full name", v: A_NUMBER_BASICS.fullName },
                        { k: "Also printed as", v: A_NUMBER_BASICS.alsoCalled.join(", ") },
                        { k: "Format", v: A_NUMBER_BASICS.format },
                        { k: "Example (invented)", v: A_NUMBER_BASICS.examples.join(" or ") },
                        { k: "Identifies", v: "You, as a person, for life" },
                        { k: "Changes when", v: "Never. One number per person, however many cases you file" },
                        { k: "Appears on an I-94?", v: "No. An I-94 carries its own 11-character admission record number, which may be alphanumeric" },
                        { k: "Sensitivity", v: "High. It is the key to your immigration file" },
                      ].map((r) => (
                        <tr key={r.k} className="border-b border-ink-900/5 align-top">
                          <th scope="row" className="w-[34%] py-2.5 pr-3 text-left font-semibold text-ink-800">
                            {r.k}
                          </th>
                          <td className="py-2.5">{r.v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4">
                  <strong>Not everyone has one. </strong>
                  {A_NUMBER_BASICS.whoGetsOne}
                </p>
                <p className="mt-3">
                  <strong>Zero-padding. </strong>
                  {A_NUMBER_BASICS.zeroPadding}
                </p>
              </div>

              {/* ── 2. Where it is ── */}
              <div id="where" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Where it is printed, drawn rather than described
                </h2>
                <p className="mt-3">
                  Prose directions to a spot on a card are oddly hard to follow,
                  so here are schematic drawings instead. The dashed boxes mark
                  where to look. These are not reproductions &mdash; not to
                  scale, no security features, and every number on them is
                  invented.
                </p>
                <div className="overflow-x-auto">
                  <div className="min-w-[560px]">
                    <CardLocationDiagram />
                  </div>
                </div>
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[700px] border-collapse text-sm">
                    <caption className="sr-only">
                      Every document that carries an A-number, and where on it
                    </caption>
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Document
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Printed label
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Where to look
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          Always there?
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {A_NUMBER_LOCATIONS.map((d) => (
                        <tr key={d.doc} className="border-b border-ink-900/5 align-top">
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {d.doc}
                          </th>
                          <td className="py-3 pr-3 font-mono text-xs">{d.label}</td>
                          <td className="py-3 pr-3">
                            {d.where}
                            {d.note && (
                              <span className="mt-1 block text-[0.7rem] text-ink-400">{d.note}</span>
                            )}
                          </td>
                          <td className="py-3 whitespace-nowrap">
                            {d.always ? (
                              <span className="font-semibold text-emerald-700">Yes</span>
                            ) : (
                              <span className="text-ink-500">Not always</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── 3. The six numbers ── */}
              <div id="six-numbers" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Six numbers, and what each one is for
                </h2>
                <p className="mt-3">
                  People do not confuse these numbers because they look alike.
                  They confuse them because nothing explains that one of the six
                  identifies a human being and the other five identify
                  transactions and pieces of paper.
                </p>
                <div className="overflow-x-auto">
                  <div className="min-w-[560px]">
                    <NumberMapDiagram />
                  </div>
                </div>
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[840px] border-collapse text-sm">
                    <caption className="sr-only">
                      The six identifiers compared on shape, what they identify,
                      who issues them and how long they last
                    </caption>
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Number
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Shape
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Identifies
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Where you find it
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Lasts
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          Sensitive?
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {NUMBER_TYPES.map((t) => (
                        <tr
                          key={t.id}
                          className={`border-b border-ink-900/5 align-top ${
                            t.id === "a-number" ? "bg-brand-50/40" : ""
                          }`}
                        >
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {t.name}
                            {t.ownerPath && (
                              <Link
                                href={t.ownerPath}
                                className="mt-0.5 block text-[0.7rem] font-normal text-brand-600 underline"
                              >
                                full guide →
                              </Link>
                            )}
                          </th>
                          <td className="py-3 pr-3 whitespace-nowrap font-mono text-xs">
                            {t.shape}
                          </td>
                          <td className="py-3 pr-3">{t.identifies}</td>
                          <td className="py-3 pr-3 text-ink-500">{t.whereFound}</td>
                          <td className="py-3 pr-3 text-ink-500">{t.lifetime}</td>
                          <td className="py-3 whitespace-nowrap">
                            {t.sensitive === "high" ? (
                              <span className="font-semibold text-rose-700">High</span>
                            ) : (
                              <span className="text-ink-500">Medium</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-xs text-ink-400">{NUMBER_TYPES_NOTE}</p>
                <p className="mt-4">
                  Two of these have guides of their own on this site, because
                  they come with their own sets of questions.{" "}
                  <Link href="/uscis/receipt-number" className="text-brand-600 underline">
                    The receipt number guide
                  </Link>{" "}
                  decodes the three-letter prefixes and explains why an I-485
                  receipt can change from LIN to MSC mid-case.{" "}
                  <Link href="/uscis/online-account-number" className="text-brand-600 underline">
                    The online account number guide
                  </Link>{" "}
                  covers what it is for and how to give it to an attorney filing
                  a paper petition. The I-94 number, and the travel history
                  behind it, are on{" "}
                  <Link href="/uscis/i-94" className="text-brand-600 underline">
                    the I-94 guide
                  </Link>
                  .
                </p>
                <p className="mt-3">
                  The sixth one deserves its own sentence, because it is the one
                  missing from every other guide to this question. A{" "}
                  <strong>visa control number</strong> is the number printed on
                  a visa foil &mdash; often in red, usually at the lower right.
                  It identifies the sticker. Every new visa gets a new one. It is
                  what a consulate or VFS will ask you for, and it has nothing to
                  do with your A-number.
                </p>
              </div>

              {/* ── 4. Registration ── */}
              <div id="registration" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  The registration rule: does it apply to you?
                </h2>
                <p className="mt-3">
                  Since 2025 there has been a lot of alarm about a federal
                  requirement to register with the government, and a form,{" "}
                  <strong>G-325R</strong>, to do it on. If that reached you and
                  you hold a visa and an I-94, it was almost certainly not about
                  you. Here is why, from the regulation.
                </p>
                <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
                  <p className="text-sm font-bold text-ink-900">
                    Start here: are you already registered?
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">
                    {REGISTRATION.alreadyRegisteredPlain}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-ink-800">
                    You are already registered if any of these is true:
                  </p>
                  <ul className="mt-1.5 space-y-1.5 text-sm text-ink-700">
                    {REGISTRATION.alreadyRegistered.map((r) => (
                      <li key={r.slice(0, 30)} className="flex gap-2">
                        <span aria-hidden className="text-emerald-600">
                          ✓
                        </span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-xs text-ink-400">
                    {REGISTRATION.alreadyRegisteredCite}
                  </p>
                </div>

                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[640px] border-collapse text-sm">
                    <caption className="sr-only">
                      Who must register, who is exempt, and who is already
                      registered
                    </caption>
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Your situation
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          What you need to do
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {[
                        {
                          s: "Admitted on an H-1B, H-4, L-1, L-2, F-1, B-1/B-2 or any other visa, with an I-94",
                          a: "Nothing. The I-94 is both a prescribed registration form and evidence of registration under 8 CFR 264.1. Carry it.",
                        },
                        {
                          s: "Hold a green card (Form I-551)",
                          a: "Nothing. The I-551 is evidence of registration. Carry it — INA 264(e) requires it.",
                        },
                        {
                          s: "Hold an Employment Authorization Document",
                          a: "Nothing. The EAD is on the evidence list.",
                        },
                        {
                          s: "Have an I-485 on file",
                          a: "Nothing. Form I-485 is itself a prescribed registration form.",
                        },
                        {
                          s: "In the United States for fewer than 30 days",
                          a: "Nothing. The requirement attaches to a stay of 30 days or more.",
                        },
                        {
                          s: "A Canadian who crossed by land, was not issued an I-94, and is staying 30 days or more",
                          a: "This is the group the requirement is actually aimed at. File Form G-325R before the 30 days run out.",
                        },
                        {
                          s: "A child who has just turned 14",
                          a: "Apply for re-registration and fingerprinting within 30 days of the 14th birthday — even if already registered. 8 CFR 264.1(g).",
                        },
                        {
                          s: "A parent of a child under 14 who must register",
                          a: "You register them, through an account created in the child's own name.",
                        },
                        {
                          s: "A US citizen or national",
                          a: "Exempt.",
                        },
                      ].map((r) => (
                        <tr key={r.s} className="border-b border-ink-900/5 align-top">
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {r.s}
                          </th>
                          <td className="py-3">{r.a}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="mt-4">
                  <strong>Who is actually left. </strong>
                  {REGISTRATION.whoIsLeft}
                </p>

                <h3 className="mt-7 text-base font-bold text-ink-900">
                  Where the rule stands
                </h3>
                <div className="overflow-x-auto">
                  <div className="min-w-[520px]">
                    <RegistrationTimelineChart />
                  </div>
                </div>

                <h3 className="mt-7 text-base font-bold text-ink-900">
                  If you do have to file it
                </h3>
                <ol className="mt-2 list-decimal space-y-2 pl-5">
                  {REGISTRATION.howToFile.map((s) => (
                    <li key={s.slice(0, 30)}>{s}</li>
                  ))}
                </ol>
                <p className="mt-3">
                  The current form edition is {REGISTRATION.formEdition} and the
                  fee is {REGISTRATION.fee} &mdash; {REGISTRATION.feeNote} The
                  deadline is {REGISTRATION.deadline.toLowerCase()}{" "}
                  {REGISTRATION.perTrip}
                </p>

                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
                  <p className="text-sm font-bold text-ink-900">
                    Three things registration is not
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">
                    {REGISTRATION.notStatus}
                  </p>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-700">
                    <strong>It does carry a duty to carry. </strong>
                    {REGISTRATION.carryDuty}{" "}
                    <span className="text-xs text-ink-400">{REGISTRATION.carryDutyCite}</span>
                  </p>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-700">
                    <strong>And it carries penalties. </strong>
                    {REGISTRATION.penalties}
                  </p>
                </div>
              </div>

              {/* ── 5. Can't find it ── */}
              <div id="cant-find" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  When you cannot find it
                </h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[720px] border-collapse text-sm">
                    <caption className="sr-only">
                      Routes to recovering an A-number, with cost and timing
                    </caption>
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Situation
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          What to do
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Cost
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          How long
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {RECOVERY_ROUTES.map((r) => (
                        <tr key={r.situation} className="border-b border-ink-900/5 align-top">
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {r.situation}
                          </th>
                          <td className="py-3 pr-3">
                            {r.action}
                            {r.note && (
                              <span className="mt-1 block text-[0.7rem] text-ink-400">{r.note}</span>
                            )}
                          </td>
                          <td className="py-3 pr-3 whitespace-nowrap font-semibold text-ink-900">
                            {r.cost}
                          </td>
                          <td className="py-3 text-ink-500">{r.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-xs text-ink-400">
                  Fee figures from Form G-1055, the USCIS fee schedule.
                </p>
              </div>

              {/* ── 6. India notes ── */}
              <div id="india" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Four confusions specific to Indian applicants
                </h2>
                <div className="mt-4 space-y-4">
                  {INDIA_NOTES.map((n) => (
                    <div
                      key={n.title}
                      className="rounded-2xl border border-ink-900/5 bg-ink-900/[0.02] p-5"
                    >
                      <p className="text-sm font-bold text-ink-900">{n.title}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{n.body}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── 7. Privacy ── */}
              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  How to handle it
                </h2>
                <p className="mt-3">{A_NUMBER_BASICS.sensitivity}</p>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>
                    <strong>Check your own case status for free.</strong> USCIS
                    publishes it at egov.uscis.gov and in your myUSCIS account.
                    A service that charges to tell you the same thing is
                    charging for access to your own record.
                  </li>
                  <li>
                    <strong>Redact before you share a document.</strong> If you
                    are posting an I-797 or a card to ask a question, the
                    A-number, the receipt number, your date of birth and your
                    address all come out first.
                  </li>
                  <li>
                    <strong>Give it to your employer&rsquo;s attorney, not your
                    employer&rsquo;s HR inbox.</strong> The attorney needs it for
                    the filing. A shared mailbox does not.
                  </li>
                  <li>
                    <strong>Keep one copy of each notice.</strong> A saved PDF of
                    every I-797 is the cheapest insurance there is against
                    needing a FOIA request years later. The same goes for every
                    I-94 &mdash;{" "}
                    <Link href="/uscis/i-94" className="text-brand-600 underline">
                      download it after every entry
                    </Link>
                    .
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
              intro={`Registration rules read from 8 CFR 264.1 and the USCIS Alien Registration Requirement page on ${formatDate(
                A_NUMBER_VERIFIED,
              )}. Fee figures from Form G-1055. Every example number on this page is invented.`}
              links={[
                { label: "8 CFR part 264 — registration and fingerprinting", href: SRC.cfr264 },
                { label: "USCIS — Alien Registration Requirement", href: SRC.uscisRegistration },
                { label: "USCIS — Form G-325R, Biographic Information (Registration)", href: SRC.g325r },
                { label: "Federal Register — Alien Registration Form and Evidence of Registration", href: SRC.registrationRule },
                { label: "INA 262 — 8 U.S.C. 1302, registration of aliens", href: SRC.ina262 },
                { label: "INA 264 — 8 U.S.C. 1304, forms and carrying evidence", href: SRC.ina264 },
                { label: "Form G-639, Freedom of Information Act request", href: SRC.g639 },
                { label: "Form G-1055 — USCIS fee schedule", href: SRC.feeSchedule },
                { label: "myUSCIS", href: SRC.myUscis },
                { label: "USCIS glossary", href: SRC.glossary },
              ]}
            />

            <div className="mx-auto mt-6 max-w-3xl">
              <NotLegalAdvice />
            </div>

            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card">
              <h2 className="text-base font-bold text-ink-900">Related</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {[
                  { href: "/uscis/receipt-number", label: "USCIS receipt number and prefixes" },
                  { href: "/uscis/online-account-number", label: "USCIS online account number" },
                  { href: "/uscis/i-94", label: "Your I-94 and travel history" },
                  { href: "/uscis/i-797-notice", label: "Reading a Form I-797 notice" },
                  { href: "/uscis/case-status", label: "Every USCIS case status message decoded" },
                  { href: "/green-card-renewal", label: "Green card renewal (Form I-90)" },
                  { href: "/replace-green-card", label: "Replacing a lost green card" },
                  { href: "/uscis/forms", label: "Every USCIS form explained" },
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
                tags={["USCIS paperwork", "Immigration identifiers", "NRI immigration planning"]}
              />
            </div>
          </Container>
        </section>

        <Newsletter />
      </article>
    </>
  );
}
