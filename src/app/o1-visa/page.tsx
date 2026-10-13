import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ReviewedByline from "@/components/ReviewedByline";
import AuthorBioBox from "@/components/AuthorBioBox";
import Newsletter from "@/components/Newsletter";
import NotLegalAdvice from "@/components/tools/NotLegalAdvice";
import OfficialSourceBox from "@/components/tools/OfficialSourceBox";
import ToolFaq from "@/components/tools/ToolFaq";
import O1CriteriaSelfCheck from "@/components/tools/O1CriteriaSelfCheck";
import {
  O1AdmissionsChart,
  O1ByCountryChart,
  O1VsH1bShareChart,
  O1RouteDiagram,
  CriteriaReachChart,
} from "@/components/tools/o1/O1Visuals";
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
  ARTS_DEFINITION,
  CONSULTATION,
  EVENT_DEFINITION,
  O1A_COMPARABLE_EVIDENCE,
  O1A_CRITERIA,
  O1A_MAJOR_AWARD,
  O1B_AWARD_ROUTE,
  O1B_CRITERIA,
  O1_CLASSES,
  O1_COMPARISON,
  O1_COMPARE_ROUTES,
  O1_DUAL_INTENT,
  O1_EMPLOYER_CHANGE,
  O1_FEES,
  O1_FEES_NOT_PAYABLE,
  O1_FEE_SCHEDULE_EDITION,
  O1_PERIODS,
  O1_PUBLISHED,
  O1_SOURCES as SRC,
  O1_STEPS,
  O1_UPDATED,
  O1_VERIFIED,
  O1_VS_H1B_INDIA_FY2024 as SHARE,
  O2_FIELD_LIMIT,
} from "@/data/o1VisaData";
import { getPremiumFeeByForm, premiumProcessing } from "@/lib/premiumProcessing";
import { bulletin, formatCutoff, getCutoffs } from "@/lib/visa-bulletin";
import { monthLabel } from "@/lib/visaBulletinMonths";

/**
 * /o1-visa — the O-1 pillar.
 *
 * Owns: the three evidentiary standards (O-1A, O-1B arts, O-1B motion
 * picture/TV), the eight criteria verbatim, comparable evidence, the advisory
 * opinion, the agent route, periods and extensions, the fee stack, and the
 * admissions data.
 *
 * Does NOT own, and only summarises with a link:
 *   60-day grace period      → /h1b/layoff-60-day-grace-period
 *   EB-1A / NIW comparison   → /green-card/eb1a-vs-eb1b-vs-eb1c-vs-niw
 *   India EB-1 cutoffs       → /visa-bulletin/eb1-india
 *   H-1B lottery odds        → /h1b-lottery-chances
 *   Interview waiver rules   → /visa-interview-waiver
 *   Form I-129 itself        → /uscis/forms/i-129
 * See docs/seo/oct-2026-cluster/overlap-report.md §3.1.
 *
 * Every fee figure comes from src/data/o1VisaData.ts (Form G-1055) except the
 * premium-processing figure, which is read from src/lib/premiumProcessing.ts so
 * one number serves the whole site.
 */

const PAGE_PATH = "/o1-visa";

const premium = getPremiumFeeByForm("I-129").filter((i) => i.eligible)[0];
const eb1India = getCutoffs("eb1", "india");

export const metadata: Metadata = pageMetadata({
  title: "O-1 Visa: The 8 Criteria, Fees and Why Indians Barely Use It",
  description:
    "O-1A, O-1B arts and O-1B motion picture are three different standards, not one. The eight criteria verbatim from 8 CFR 214.2(o)(3)(iii), the real fee stack, and the uncapped extensions that matter more than anything else if you are India-born.",
  path: PAGE_PATH,
  type: "article",
  openGraph: { publishedTime: O1_PUBLISHED, modifiedTime: O1_UPDATED },
});

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Immigration", url: "/immigration" },
  { name: "O-1 Visa", url: PAGE_PATH },
];

const faqs: FaqItem[] = [
  {
    question: "What is the O-1 visa?",
    answer:
      "The O-1 is a temporary work visa for someone with extraordinary ability in the sciences, arts, education, business or athletics, or a demonstrated record of extraordinary achievement in the motion picture or television industry. It comes from INA 101(a)(15)(O) and the rules are at 8 CFR 214.2(o). An employer or a US agent files Form I-129 for you — you cannot petition for yourself. There is no numerical cap and no lottery, which is why it comes up in every conversation about H-1B alternatives.",
  },
  {
    question: "What are the 8 criteria for an O-1A visa?",
    answer: `8 CFR 214.2(o)(3)(iii)(B) lists them: ${O1A_CRITERIA.map((c) =>
      c.plain.charAt(0).toLowerCase() + c.plain.slice(1).replace(/\.$/, "").split(".")[0],
    ).join("; ")}. You need at least three, unless you hold a major internationally recognised award such as the Nobel Prize, which replaces the list entirely. If a listed criterion does not readily apply to your occupation, 8 CFR 214.2(o)(3)(iii)(C) allows comparable evidence instead.`,
  },
  {
    question: "What is the difference between O-1A and O-1B?",
    answer:
      "O-1A covers the sciences, education, business and athletics, and its standard is being one of the small percentage who have arisen to the very top of the field — three of eight criteria. O-1B covers the arts, where the standard is distinction, meaning skill and recognition substantially above what is ordinarily encountered — three of six criteria. There is a third standard people miss: for motion picture and television work the regulation requires extraordinary achievement, a higher bar than distinction, with its own list of six. Three standards, not two.",
  },
  {
    question: "How much does an O-1 visa cost?",
    answer: `From Form G-1055, the USCIS fee schedule edition ${O1_FEE_SCHEDULE_EDITION}: the Form I-129 O petition fee is $1,055 on paper or $1,005 online, halved to $530 for a small employer with 25 or fewer full-time equivalent employees or for a nonprofit. On top of that sits the Asylum Program Fee of $600, or $300 for a small employer and $0 for a nonprofit. Premium processing is optional at ${premium.feeDisplay}. An O-1 petition is limited to one beneficiary. There is no ACWIA training fee, no Fraud Prevention and Detection fee and no Public Law 114-113 fee on an O petition — those are H-1B and L-1 fees.`,
  },
  {
    question: "How long can you stay on an O-1 visa?",
    answer:
      "An initial O-1 petition is approved for the period needed to accomplish the event or activity, up to three years. Extensions then run in increments of up to one year, to continue or complete the same event or activity. There is no statutory maximum — the six-year wall that defines H-1B life does not exist on an O-1. You may also be admitted up to ten days before the validity period starts and remain up to ten days after it ends, though you may only work during the validity period itself.",
  },
  {
    question: "Is the O-1 visa easier than the H-1B?",
    answer:
      "They are hard in completely different places, and the comparison is the wrong shape. An H-1B is not an achievement test: the hard part is the lottery, where selection is a matter of chance. An O-1 has no lottery at all, and the hard part is an evidentiary record you either have or have to build over years. For someone with the record, the O-1 is the easier route by a wide margin. For someone without it, no amount of preparation closes the gap in a single filing cycle.",
  },
  {
    question: "Can an O-1 visa holder apply for a green card?",
    answer: `Yes, and the regulation protects it explicitly. 8 CFR 214.2(o)(13) says the approval of a permanent labour certification or the filing of a preference petition is not a basis for denying an O-1 petition, an extension, or your admission. Combined with uncapped one-year extensions, that makes the O-1 unusually well suited to a long green card wait. In the ${monthLabel(
      bulletin.month,
    )} visa bulletin, India EB-1 final action sits at ${formatCutoff(
      eb1India.fad,
    )} — a wait an H-1B holder has to engineer AC21 extensions to survive, and an O-1 holder simply extends through.`,
  },
  {
    question: "Do Indians get O-1 visas?",
    answer: `Rarely, relative to every other route. In FY2024 there were ${SHARE.o1Total.toLocaleString(
      "en-US",
    )} O-1 admissions to the United States, of which ${SHARE.o1India.toLocaleString(
      "en-US",
    )} were Indian nationals — about ${((SHARE.o1India / SHARE.o1Total) * 100).toFixed(
      1,
    )}%. The same population accounted for ${SHARE.h1bIndia.toLocaleString(
      "en-US",
    )} of ${SHARE.h1bTotal.toLocaleString("en-US")} H-1B admissions, or ${(
      (SHARE.h1bIndia / SHARE.h1bTotal) *
      100
    ).toFixed(
      1,
    )}%. Canada alone had four times India's O-1 admissions. Those are DHS figures and they are admissions rather than people, but the gap is too large to be an artefact.`,
  },
  {
    question: "Do I need an advisory opinion for an O-1 visa?",
    answer:
      "Yes, and it is mandatory rather than advisable. 8 CFR 214.2(o)(5)(i)(A) requires consultation with an appropriate US peer group, labour and/or management organisation about the nature of the work and your qualifications before an O-1 petition can be approved. It takes the form of a written advisory opinion, or a letter of no objection. The opinion is advisory and does not bind USCIS, but its absence from the record stops an approval. It is also the one step neither you nor your employer controls, so build lead time in.",
  },
  {
    question: "Can my spouse work on an O-3 visa?",
    answer:
      "No. 8 CFR 214.2(o)(6)(iv) is explicit: neither the spouse nor a child of an O-1 or O-2 beneficiary may accept employment unless separately granted employment authorisation, and O-3 status does not carry it. This is the clearest disadvantage of the O-1 against the H-1B for a two-income family, because an H-4 spouse can at least reach an EAD once the I-140 is approved. There is no O-3 equivalent of that route.",
  },
  {
    question: "Can I change employers on an O-1 visa?",
    answer:
      "Only with a new petition. The O-1 belongs to the petitioner, and a new employer has to file a new Form I-129 before you start work for them. Approval of an unexpired petition is automatically revoked if the petitioner goes out of business, withdraws it, or tells USCIS you no longer work there — and an automatic revocation cannot be appealed. There is one narrow exception and it is for athletes: a traded professional O-1 athlete keeps employment authorisation for 30 days after acquisition by the new organisation.",
  },
  {
    question: "Is O-1 eligible for dropbox or interview waiver in India?",
    answer:
      "No. Under the interview-waiver rules effective 1 October 2025, O-1 is not on the eligible list, so expect an in-person interview at Delhi, Mumbai, Chennai, Hyderabad or Kolkata. H-1B, H-4, L-1, L-2, F and J are also outside the eligible categories. Our visa interview waiver page has the complete current list and an eligibility checker.",
  },
];

const jsonLd = jsonLdGraph(
  {
    "@type": "Article",
    "@id": `${absoluteUrl(PAGE_PATH)}#article`,
    headline:
      "O-1 Visa: the three standards, the eight criteria, and why Indian nationals barely use it",
    description:
      "The O-1 regulation read verbatim: three separate evidentiary standards, the eight O-1A criteria, comparable evidence, the mandatory advisory opinion, the fee stack from the current USCIS fee schedule, and the admissions data showing how little India uses this route.",
    datePublished: O1_PUBLISHED,
    dateModified: O1_UPDATED,
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

export default function O1VisaPage() {
  const indiaO1Share = ((SHARE.o1India / SHARE.o1Total) * 100).toFixed(1);
  const indiaH1bShare = ((SHARE.h1bIndia / SHARE.h1bTotal) * 100).toFixed(1);

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
              The O-1 visa: three standards, eight criteria, and no lottery
            </h1>

            {/* ANSWER FIRST */}
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-700 sm:text-lg">
              The O-1 needs <strong>three of eight criteria</strong> under 8 CFR
              214.2(o)(3)(iii), or a single major internationally recognised
              award. It has <strong>no cap and no lottery</strong>, and{" "}
              <strong>no six-year wall</strong> — extensions run in one-year
              increments indefinitely. An employer or a US agent has to file it,
              your spouse cannot work on O-3, and in FY2024 Indian nationals were{" "}
              {indiaO1Share}% of O-1 admissions against {indiaH1bShare}% of H-1B
              admissions.
            </p>

            <p className="mt-3 max-w-3xl text-sm text-ink-500">
              Last verified {formatDate(O1_VERIFIED)} against 8 CFR 214.2(o),
              the USCIS O-1 page, and Form G-1055 edition{" "}
              {O1_FEE_SCHEDULE_EDITION}.
            </p>

            <ul className="mt-5 grid max-w-3xl gap-2 sm:grid-cols-2">
              {[
                "Three standards, not two — O-1A, O-1B arts and O-1B motion picture/TV are each defined separately",
                "3 of 8 for O-1A; 3 of 6 for each O-1B list",
                "No numerical cap, no registration, no lottery",
                "Initial validity up to 3 years, then 1-year extensions with no statutory ceiling",
                "A mandatory advisory opinion from a peer group, labour or management organisation",
                "O-3 dependants cannot work — the clearest disadvantage against H-1B",
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

            <ReviewedByline date={O1_UPDATED} path={PAGE_PATH} className="mt-5" />
            <NotLegalAdvice className="mt-4 max-w-3xl" />
          </Container>
        </header>

        {/* ══════════ The tool ══════════ */}
        <section id="self-check" className="scroll-mt-24 bg-ink-900/[0.02] py-10 sm:py-14">
          <Container>
            <div className="mx-auto mb-6 max-w-3xl">
              <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                Which criteria can you actually evidence?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                The regulation asks for three of eight. Most people reading about
                the O-1 for the first time overestimate two of them and have no
                idea they already qualify for a third. Answer on documents rather
                than on self-description — a criterion you can describe but not
                evidence is worth nothing in a petition, which is why
                &ldquo;partly&rdquo; here counts toward none of the three.
              </p>
            </div>
            <O1CriteriaSelfCheck />
          </Container>
        </section>

        {/* ══════════ Body ══════════ */}
        <section className="border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <div className="mx-auto max-w-[760px] space-y-10 text-[0.975rem] leading-relaxed text-ink-700">
              {/* ── 1. The thesis ── */}
              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  The thing about the O-1 that the data makes obvious
                </h2>
                <p className="mt-3">
                  Start with a number that should be strange. In fiscal year
                  2024 the United States recorded{" "}
                  {SHARE.o1Total.toLocaleString("en-US")} O-1 admissions. Indian
                  nationals accounted for {SHARE.o1India.toLocaleString("en-US")}{" "}
                  of them &mdash; {indiaO1Share}%. In the same year, Indian
                  nationals accounted for{" "}
                  {SHARE.h1bIndia.toLocaleString("en-US")} of{" "}
                  {SHARE.h1bTotal.toLocaleString("en-US")} H-1B admissions, or{" "}
                  {indiaH1bShare}%. Canada, with a population roughly a
                  thirty-fifth the size of India&rsquo;s, had four times as many
                  O-1 admissions.
                </p>
                <O1VsH1bShareChart />
                <p className="mt-3">
                  There is no quota making this happen. The O-1 has no cap, no
                  per-country limit and no lottery, so nothing in the statute
                  produces that gap. It is a behavioural gap: the Indian
                  immigration conversation is organised around the H-1B, the
                  employers that sponsor Indian engineers at scale have H-1B
                  processes rather than O-1 processes, and the people who would
                  qualify mostly never look.
                </p>
                <p className="mt-3">
                  That does not mean most H-1B applicants would qualify for an
                  O-1. Most would not, and anyone selling the O-1 as a
                  straightforward H-1B substitute is misdescribing it. But the
                  population that produces{" "}
                  {SHARE.h1bIndia.toLocaleString("en-US")} H-1B admissions a year
                  contains more than{" "}
                  {SHARE.o1India.toLocaleString("en-US")} people with
                  nationally-recognised prizes, granted patents that others
                  build on, senior roles at distinguished organisations and
                  salaries well above the occupational data. The gap between
                  those two numbers is the only reason this page exists.
                </p>
                <div className="overflow-x-auto">
                  <div className="min-w-[380px]">
                    <O1ByCountryChart />
                  </div>
                </div>
              </div>

              {/* ── 2. Three standards ── */}
              <div id="standards" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Three standards, not two
                </h2>
                <p className="mt-3">
                  Nearly every O-1 guide describes two things: O-1A for science
                  and business, O-1B for the arts. The regulation defines{" "}
                  <strong>three</strong> evidentiary standards, and the third one
                  is the hardest. 8 CFR 214.2(o)(3)(ii) gives each of them its
                  own definition, and the wording is what separates them.
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[720px] border-collapse text-sm">
                    <caption className="sr-only">
                      The O nonimmigrant classifications, their standards and
                      their criteria rules
                    </caption>
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Class
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          The standard, in the regulation&rsquo;s words
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Criteria rule
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          Citation
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {O1_CLASSES.map((c) => (
                        <tr key={c.id} className="border-b border-ink-900/5 align-top">
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {c.code}
                            <span className="mt-0.5 block text-[0.7rem] font-normal text-ink-400">
                              {c.label}
                            </span>
                          </th>
                          <td className="py-3 pr-3 italic">{c.standard}</td>
                          <td className="py-3 pr-3">{c.criteriaRule}</td>
                          <td className="py-3 text-[0.7rem] text-ink-400">{c.cite}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4">
                  Read the three definitions next to each other and the
                  hierarchy is in the adverbs. O-1A asks for{" "}
                  <em>the very top of the field</em>. O-1B arts asks for skill
                  and recognition <em>substantially above</em> the ordinary.
                  O-1B motion picture and television asks for accomplishment{" "}
                  <em>significantly above</em> the ordinary, and calls the
                  result <em>extraordinary achievement</em> rather than
                  distinction. Two of those three sound similar and are not: a
                  record that satisfies the arts standard does not automatically
                  satisfy the motion-picture one, and the consultation
                  requirement is different too &mdash; motion picture and
                  television work needs an opinion from{" "}
                  <strong>both</strong> a union and a management organisation.
                </p>
                <div className="mt-4 rounded-2xl border border-ink-900/5 bg-ink-900/[0.02] p-5">
                  <p className="text-sm font-bold text-ink-900">
                    &ldquo;Arts&rdquo; is much broader than it sounds
                  </p>
                  <p className="mt-2 text-sm italic leading-relaxed text-ink-600">
                    &ldquo;{ARTS_DEFINITION.text}&rdquo;
                  </p>
                  <p className="mt-2 text-xs text-ink-400">{ARTS_DEFINITION.cite}</p>
                  <p className="mt-2 text-sm text-ink-600">
                    Culinary arts are in the list. So are set designers, sound
                    designers, make-up artists and stage technicians. A chef
                    building a reputation in a major city, or a designer with a
                    body of credited work, is in a category the regulation was
                    written for &mdash; and under a lower standard than O-1A.
                  </p>
                </div>
              </div>

              {/* ── 3. The eight criteria ── */}
              <div id="criteria" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  The eight O-1A criteria, as the regulation writes them
                </h2>
                <p className="mt-3">
                  Here they are verbatim, with what each one takes in practice
                  and what it looks like in an Indian technology, research or
                  founder career. You need <strong>three</strong>. The
                  regulation does not rank them and neither does USCIS, which
                  weighs the record as a whole.
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[760px] border-collapse text-sm">
                    <caption className="sr-only">
                      The eight evidentiary criteria in 8 CFR
                      214.2(o)(3)(iii)(B), with practical notes
                    </caption>
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          #
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          What the regulation says
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          What it takes
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          In an Indian career
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {O1A_CRITERIA.map((c) => (
                        <tr key={c.id} className="border-b border-ink-900/5 align-top">
                          <td className="py-3 pr-3 font-semibold text-ink-800">{c.ref}</td>
                          <td className="py-3 pr-3 italic">{c.text}</td>
                          <td className="py-3 pr-3">{c.plain}</td>
                          <td className="py-3 text-ink-500">{c.indiaExample}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
                  <p className="text-sm font-bold text-ink-900">
                    The one-step route almost nobody takes
                  </p>
                  <p className="mt-2 text-sm italic text-ink-600">
                    &ldquo;{O1A_MAJOR_AWARD.text}&rdquo;
                  </p>
                  <p className="mt-1 text-xs text-ink-400">{O1A_MAJOR_AWARD.cite}</p>
                  <p className="mt-2 text-sm text-ink-600">{O1A_MAJOR_AWARD.note}</p>
                </div>

                <h3 className="mt-8 text-base font-bold text-ink-900">
                  Which of the eight a career produces, and which you have to build
                </h3>
                <p className="mt-2">
                  This is the practically useful split, and it is not in the
                  regulation. Some criteria either exist in your history or do
                  not &mdash; a high salary, a granted patent, authored papers.
                  Others are reachable inside a year or two of deliberate
                  effort by someone already senior, and are routinely left
                  unclaimed by people who would qualify for them today.
                </p>
                <div className="overflow-x-auto">
                  <div className="min-w-[420px]">
                    <CriteriaReachChart />
                  </div>
                </div>
                <p className="mt-3">
                  Two of them are worth naming. Criterion (4), judging the work
                  of others, is satisfied by peer review for a journal or
                  conference, by sitting on a hackathon or grant panel, or by
                  judging a startup competition &mdash; things senior engineers
                  do and never document. Keep the invitation email and the
                  completion record and it becomes evidence. Criterion (2),
                  membership in an association requiring outstanding
                  achievements judged by recognised experts, is not satisfied by
                  paying an IEEE or ACM subscription; it is satisfied by the
                  elevated grades those bodies award on an achievement-based
                  review, such as IEEE Senior Member or ACM Distinguished
                  Member. The application is open, the criteria are published,
                  and it is a deliberate project rather than a stroke of luck.
                </p>

                <div className="mt-5 rounded-2xl border border-sky-200 bg-sky-50/50 p-5">
                  <p className="text-sm font-bold text-ink-900">
                    When the eight criteria do not fit your work at all
                  </p>
                  <p className="mt-2 text-sm italic text-ink-600">
                    &ldquo;{O1A_COMPARABLE_EVIDENCE.text}&rdquo;
                  </p>
                  <p className="mt-1 text-xs text-ink-400">{O1A_COMPARABLE_EVIDENCE.cite}</p>
                  <p className="mt-2 text-sm text-ink-600">
                    {O1A_COMPARABLE_EVIDENCE.plain}
                  </p>
                  <ul className="mt-3 space-y-1.5 text-sm text-ink-600">
                    {O1A_COMPARABLE_EVIDENCE.examples.map((e) => (
                      <li key={e} className="flex gap-2">
                        <span aria-hidden className="text-sky-600">
                          ▸
                        </span>
                        <span>{e}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* ── 4. O-1B lists ── */}
              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  The O-1B lists &mdash; six criteria, two standards
                </h2>
                <p className="mt-3">
                  The arts list at 8 CFR 214.2(o)(3)(iv)(B) and the motion
                  picture and television list at (o)(3)(v)(B) are worded almost
                  identically. Three of six is the rule on each. What differs is
                  the standard they are measured against, and the award route is
                  more generous than O-1A&rsquo;s: a <em>nomination</em> is
                  enough, where O-1A requires receipt.
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[680px] border-collapse text-sm">
                    <caption className="sr-only">
                      The six O-1B criteria, with what each one requires in
                      practice
                    </caption>
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          #
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          What the regulation says
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          What it means
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {O1B_CRITERIA.map((c) => (
                        <tr key={c.ref} className="border-b border-ink-900/5 align-top">
                          <td className="py-3 pr-3 font-semibold text-ink-800">{c.ref}</td>
                          <td className="py-3 pr-3 italic">{c.text}</td>
                          <td className="py-3">{c.plain}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 rounded-2xl border border-ink-900/5 bg-ink-900/[0.02] p-5">
                  <p className="text-sm font-bold text-ink-900">
                    The award route on O-1B: a nomination is enough
                  </p>
                  <p className="mt-2 text-sm italic text-ink-600">
                    &ldquo;{O1B_AWARD_ROUTE.text}&rdquo;
                  </p>
                  <p className="mt-1 text-xs text-ink-400">{O1B_AWARD_ROUTE.cite}</p>
                  <p className="mt-2 text-sm text-ink-600">{O1B_AWARD_ROUTE.note}</p>
                </div>
              </div>

              {/* ── 5. The advisory opinion ── */}
              <div id="advisory" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  The advisory opinion is mandatory, and it is not yours to control
                </h2>
                <p className="mt-3 italic text-ink-600">
                  &ldquo;{CONSULTATION.mandatory}&rdquo;{" "}
                  <span className="not-italic text-xs text-ink-400">
                    {CONSULTATION.cite}
                  </span>
                </p>
                <p className="mt-3">
                  Two things about that sentence do work. It says{" "}
                  <strong>mandatory</strong>, and it says{" "}
                  <strong>before a petition can be approved</strong>. There is no
                  version of an O-1 filing that skips it. The opinion comes from
                  a peer group &mdash; which the regulation defines as a group or
                  organisation comprised of practitioners of your occupation
                  &mdash; or a labour or management organisation with expertise in
                  the field, and it can be a person or persons with expertise
                  rather than a body.
                </p>
                <p className="mt-3">
                  At the same time, 8 CFR 214.2(o)(5)(i)(D) says consultations
                  are advisory and are not binding on USCIS. An unfavourable
                  opinion is not fatal: the regulation requires it to set out a
                  specific statement of facts supporting its conclusion, which
                  gives the petition something to answer. A consulting
                  organisation that simply has no objection may submit a letter
                  of no objection instead, which is the commonest outcome in
                  practice.
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[640px] border-collapse text-sm">
                    <caption className="sr-only">
                      Consultation requirements by O classification
                    </caption>
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Classification
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Who must be consulted
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          Citation
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      <tr className="border-b border-ink-900/5 align-top">
                        <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                          O-1A, and O-1B arts
                        </th>
                        <td className="py-3 pr-3">
                          A peer group in the area of your ability, which may
                          include a labour organisation, or a person or persons
                          with expertise in that area.
                        </td>
                        <td className="py-3 text-[0.7rem] text-ink-400">
                          8 CFR 214.2(o)(5)(ii)(A)
                        </td>
                      </tr>
                      <tr className="border-b border-ink-900/5 align-top">
                        <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                          O-1B motion picture or TV
                        </th>
                        <td className="py-3 pr-3">
                          Both the appropriate union representing your
                          occupational peers and a management organisation in
                          the area of your ability. Two opinions, not one.
                        </td>
                        <td className="py-3 text-[0.7rem] text-ink-400">
                          8 CFR 214.2(o)(5)(iii)
                        </td>
                      </tr>
                      <tr className="border-b border-ink-900/5 align-top">
                        <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                          O-2 support personnel
                        </th>
                        <td className="py-3 pr-3">
                          A labour organisation with expertise in the skill area
                          involved; for motion picture and TV, a labour
                          organisation and a management organisation.
                        </td>
                        <td className="py-3 text-[0.7rem] text-ink-400">
                          8 CFR 214.2(o)(5)(iv)
                        </td>
                      </tr>
                      <tr className="align-top">
                        <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                          Waiver &mdash; arts only
                        </th>
                        <td className="py-3 pr-3">
                          Waived where you seek readmission to perform similar
                          services within two years of a previous consultation.
                          Submit a copy of the prior consultation and ask.
                        </td>
                        <td className="py-3 text-[0.7rem] text-ink-400">
                          {CONSULTATION.artsWaiverCite}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── 6. Route diagram ── */}
              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  The route, start to finish
                </h2>
                <p className="mt-3">
                  One thing on this diagram sits outside both your control and
                  your employer&rsquo;s, and it is the reason O-1 timelines slip.
                </p>
                <div className="overflow-x-auto">
                  <div className="min-w-[520px]">
                    <O1RouteDiagram />
                  </div>
                </div>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[680px] border-collapse text-sm">
                    <caption className="sr-only">
                      The O-1 filing sequence, step by step
                    </caption>
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Step
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Who does it
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          What happens
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {O1_STEPS.map((s) => (
                        <tr key={s.n} className="border-b border-ink-900/5 align-top">
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {s.n}. {s.title}
                          </th>
                          <td className="py-3 pr-3 whitespace-nowrap text-ink-500">{s.who}</td>
                          <td className="py-3">
                            {s.detail}
                            {s.cite && (
                              <span className="mt-1 block text-[0.7rem] text-ink-400">
                                {s.cite}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4">
                  One definition makes this route work for ordinary employment
                  rather than only for a tour or a tournament. An{" "}
                  <strong>event</strong>, in the regulation&rsquo;s own words:
                </p>
                <p className="mt-2 italic text-ink-600">
                  &ldquo;{EVENT_DEFINITION.text}&rdquo;{" "}
                  <span className="not-italic text-xs text-ink-400">
                    {EVENT_DEFINITION.cite}
                  </span>
                </p>
                <p className="mt-3">{EVENT_DEFINITION.plain}</p>
              </div>

              {/* ── 7. Periods ── */}
              <div id="stay" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  How long you can stay, and the row that matters most
                </h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[660px] border-collapse text-sm">
                    <caption className="sr-only">
                      O-1 admission periods, extensions and limits
                    </caption>
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          What
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          How long
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Detail
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          Citation
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {O1_PERIODS.map((p) => (
                        <tr
                          key={p.label}
                          className={`border-b border-ink-900/5 align-top ${
                            "highlight" in p && p.highlight ? "bg-brand-50/40" : ""
                          }`}
                        >
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {p.label}
                          </th>
                          <td className="py-3 pr-3 whitespace-nowrap font-bold text-ink-900">
                            {p.value}
                          </td>
                          <td className="py-3 pr-3">{p.note}</td>
                          <td className="py-3 text-[0.7rem] text-ink-400">{p.cite}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4">
                  The highlighted row is the whole argument for an O-1 if you
                  were born in India. H-1B status is capped at six years, and
                  getting past that takes AC21: a PERM or I-140 pending 365 days
                  or more supports one-year extensions, and an approved I-140
                  with a non-current priority date supports three-year ones. It
                  works, and it makes your continued status depend on a petition
                  your employer owns. On an O-1 there is no six-year wall to
                  engineer around. Extensions continue in one-year increments
                  for as long as the same event or activity continues, and the
                  regulation says in terms that a green card filing cannot be
                  used against you:
                </p>
                <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
                  <p className="text-sm italic leading-relaxed text-ink-700">
                    &ldquo;{O1_DUAL_INTENT.text}&rdquo;
                  </p>
                  <p className="mt-2 text-xs text-ink-400">{O1_DUAL_INTENT.cite}</p>
                </div>
                <p className="mt-3">
                  In the {monthLabel(bulletin.month)} visa bulletin, India EB-1
                  final action sits at{" "}
                  <strong>{formatCutoff(eb1India.fad)}</strong>. For context on
                  what that queue looks like and how it has moved, see{" "}
                  <Link href="/visa-bulletin/eb1-india" className="text-brand-600 underline">
                    EB-1 India
                  </Link>{" "}
                  and{" "}
                  <Link href="/green-card/green-card-backlog-india" className="text-brand-600 underline">
                    how long the India backlog really is
                  </Link>
                  . The route an O-1 record usually supports is EB-1A, which can
                  be self-petitioned &mdash;{" "}
                  <Link href="/green-card/eb1a-vs-eb1b-vs-eb1c-vs-niw" className="text-brand-600 underline">
                    EB-1A vs EB-1B vs EB-1C vs NIW
                  </Link>{" "}
                  owns that comparison, including the criteria differences, which
                  are real: EB-1A needs three of ten under 8 CFR 204.5(h) and
                  then a final merits determination, not three of eight.
                </p>
              </div>

              {/* ── 8. Fees ── */}
              <div id="fees" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  What it costs
                </h2>
                <p className="mt-3">
                  From Form G-1055, the USCIS fee schedule, edition{" "}
                  {O1_FEE_SCHEDULE_EDITION}. These are the petitioner&rsquo;s
                  fees, not yours.
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[700px] border-collapse text-sm">
                    <caption className="sr-only">
                      The O-1 fee stack from the current USCIS fee schedule
                    </caption>
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Fee
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Regular
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Small employer / nonprofit
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {O1_FEES.map((f) => (
                        <tr key={f.label} className="border-b border-ink-900/5 align-top">
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {f.label}
                            <span className="mt-0.5 block text-[0.7rem] font-normal text-ink-400">
                              {f.who}
                            </span>
                          </th>
                          <td className="py-3 pr-3 whitespace-nowrap font-bold text-ink-900">
                            {f.label.indexOf("premium") !== -1
                              ? premium.feeDisplay
                              : f.regular}
                          </td>
                          <td className="py-3 pr-3 whitespace-nowrap">
                            {f.reduced ?? "—"}
                          </td>
                          <td className="py-3 text-ink-500">{f.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-xs text-ink-400">
                  Premium processing figure from the site&rsquo;s central record,
                  last verified {premiumProcessing.lastVerified}, effective{" "}
                  {premiumProcessing.effectiveDate}. {premiumProcessing.warning}
                </p>
                <p className="mt-4">
                  Two notes on the numbers. The small-employer rate halves the
                  base fee at 25 or fewer full-time equivalent employees, which
                  matters because the founder audience for this page{" "}
                  <em>is</em> a small employer. And an O-1 petition is limited to
                  one beneficiary &mdash; there is no batching, which is one
                  reason the per-head cost does not fall the way an H-2B
                  employer&rsquo;s does.
                </p>
                <h3 className="mt-6 text-base font-bold text-ink-900">
                  Four fees an O petition does not pay
                </h3>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full min-w-[600px] border-collapse text-sm">
                    <caption className="sr-only">
                      Fees that apply to H-1B or L-1 petitions and not to O
                      petitions
                    </caption>
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Fee
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          Why it does not apply
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {O1_FEES_NOT_PAYABLE.map((f) => (
                        <tr key={f.fee} className="border-b border-ink-900/5 align-top">
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {f.fee}
                          </th>
                          <td className="py-3">{f.why}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── 9. Comparison ── */}
              <div id="compare" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  O-1A against the three routes people compare it to
                </h2>
                <p className="mt-3">
                  Two of these are green cards and two are temporary statuses, so
                  read the first row before the rest.
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[760px] border-collapse text-sm">
                    <caption className="sr-only">
                      O-1A, H-1B, EB-1A and EB-2 NIW compared across nine
                      dimensions
                    </caption>
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          &nbsp;
                        </th>
                        {O1_COMPARE_ROUTES.map((r) => (
                          <th key={r.id} scope="col" className="py-2 pr-3 font-bold text-ink-900">
                            {r.short}
                            <span className="block text-[0.7rem] font-normal text-ink-500">
                              {r.label}
                            </span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {O1_COMPARISON.map((row) => (
                        <tr key={row.label} className="border-b border-ink-900/5 align-top">
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {row.label}
                            {row.note && (
                              <span className="mt-1 block text-[0.7rem] font-normal text-ink-400">
                                {row.note}
                              </span>
                            )}
                          </th>
                          {O1_COMPARE_ROUTES.map((r) => (
                            <td key={r.id} className="py-3 pr-3">
                              {row.values[r.id]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4">
                  On the H-1B column, the honest framing is that the two visas
                  are hard in different places. An H-1B is not an achievement
                  test &mdash; the hard part is a lottery, and selection is
                  chance. For current odds and how weighted selection changed
                  them, see{" "}
                  <Link href="/h1b-lottery-chances" className="text-brand-600 underline">
                    H-1B lottery chances
                  </Link>
                  , and{" "}
                  <Link href="/h1b-lottery-not-selected-options" className="text-brand-600 underline">
                    options if you were not selected
                  </Link>{" "}
                  covers the full set of alternatives rather than this one.
                </p>
              </div>

              {/* ── 10. O-2 and O-3 ── */}
              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  O-2 and O-3: the two parts that catch families
                </h2>
                <p className="mt-3">
                  <strong>O-2</strong> is for essential support personnel, and it
                  is narrower than it sounds. {O2_FIELD_LIMIT.rule} A scientist
                  or an executive cannot bring a team on O-2 &mdash; the
                  classification exists for the people who make a performance or
                  a production work, and the test is critical skills and
                  experience with that specific O-1 holder which are not of a
                  general nature and are not possessed by a US worker.{" "}
                  {O2_FIELD_LIMIT.multiple}
                </p>
                <p className="mt-3">
                  <strong>O-3</strong> is the part that changes family
                  arithmetic. Your spouse and unmarried minor children get O-3
                  status for the same period as you, and the regulation is
                  explicit that neither the spouse nor a child may accept
                  employment unless separately granted employment authorisation
                  &mdash; which O-3 status does not carry. There is no O-3
                  equivalent of the H-4 EAD, and there is no point at which O-3
                  status itself becomes work-authorised.
                </p>
                <p className="mt-3">
                  For a two-income family this is often the deciding factor, and
                  it points in the opposite direction from everything else on
                  this page. An H-4 spouse can reach an EAD once the I-140 is
                  approved. An L-2 spouse is employment-authorised the day they
                  are admitted, with no application at all &mdash; see{" "}
                  <Link href="/l1-visa" className="text-brand-600 underline">
                    the L-1 guide
                  </Link>
                  . An O-3 spouse who wants to work needs their own status, which
                  in practice means their own H-1B, their own O-1, or an
                  employer willing to sponsor one.
                </p>
              </div>

              {/* ── 11. Employers, revocation ── */}
              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Changing employers, and what happens if the job ends
                </h2>
                <p className="mt-3">{O1_EMPLOYER_CHANGE.rule}</p>
                <p className="mt-3">
                  <strong>Automatic revocation. </strong>
                  {O1_EMPLOYER_CHANGE.automaticRevocation}{" "}
                  <span className="text-xs text-ink-400">
                    {O1_EMPLOYER_CHANGE.automaticRevocationCite}
                  </span>
                </p>
                <p className="mt-3">
                  <strong>The athlete exception. </strong>
                  {O1_EMPLOYER_CHANGE.athleteException}{" "}
                  <span className="text-xs text-ink-400">
                    {O1_EMPLOYER_CHANGE.athleteExceptionCite}
                  </span>
                </p>
                <p className="mt-3">
                  <strong>Return transportation. </strong>
                  {O1_EMPLOYER_CHANGE.returnTransport}
                </p>
                <p className="mt-3">
                  If employment ends, O-1 holders are among the classifications
                  covered by the 60-day grace period at 8 CFR 214.1(l)(2): up to
                  60 consecutive days, or the end of the authorised validity
                  period, whichever is shorter, once per authorised validity
                  period &mdash; and you may not work during it. That rule, how
                  to count the deadline and what the three real options are, are
                  owned by{" "}
                  <Link href="/h1b/layoff-60-day-grace-period" className="text-brand-600 underline">
                    the 60-day grace period guide
                  </Link>
                  , which covers it for every affected classification.
                </p>
              </div>

              {/* ── 12. India angle ── */}
              <div id="india" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Getting the visa in India
                </h2>
                <p className="mt-3">
                  Once the I-129 is approved you either apply for the visa at a
                  consulate or, if you are already in the United States in
                  another status, the petition can request a change of status and
                  no consular step is needed. Applying from India means a DS-160,
                  the fee, and an appointment at Delhi, Mumbai, Chennai,
                  Hyderabad or Kolkata.
                </p>
                <p className="mt-3">
                  <strong>
                    O-1 is not interview-waiver eligible.
                  </strong>{" "}
                  Under the rules effective 1 October 2025, O-1 sits outside the
                  eligible categories alongside H-1B, H-4, L-1, L-2, F and J, so
                  expect an in-person interview including for O-3 dependants.{" "}
                  <Link href="/visa-interview-waiver" className="text-brand-600 underline">
                    The visa interview waiver page
                  </Link>{" "}
                  carries the complete eligible list with citations and an
                  eligibility checker, and{" "}
                  <Link href="/h1b/stamping-india-after-approval" className="text-brand-600 underline">
                    stamping in India after approval
                  </Link>{" "}
                  covers the practical mechanics of the appointment, which are the
                  same whatever the classification.
                </p>
                <p className="mt-3">
                  One thing worth planning for: the petition approval and the
                  visa are separate, and the gap between them is a consular wait
                  you do not control. If your O-1 start date is tied to a funding
                  round, a term, a production schedule or a contract, build the
                  appointment wait into the plan rather than the approval date.
                </p>
                <h3 className="mt-6 text-base font-bold text-ink-900">
                  Admissions over time
                </h3>
                <p className="mt-2">
                  For a sense of the route&rsquo;s overall scale and how
                  completely the pandemic interrupted it:
                </p>
                <div className="overflow-x-auto">
                  <div className="min-w-[420px]">
                    <O1AdmissionsChart />
                  </div>
                </div>
              </div>

              {/* ── 13. Practical notes ── */}
              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Practical notes
                </h2>
                <ul className="mt-3 list-disc space-y-2.5 pl-5">
                  <li>
                    <strong>An agent can be the petitioner.</strong> Where you
                    will work for multiple employers, or are traditionally
                    self-employed, a US agent may file. Note what comes with it:
                    a foreign employer filing through a US agent is responsible
                    for complying with the employer sanctions provisions of INA
                    274A, and an agent filing for multiple employers has to
                    supply the complete itinerary.
                  </li>
                  <li>
                    <strong>Label every exhibit with its criterion.</strong> The
                    commonest avoidable weakness in an O-1 package is evidence
                    that is strong in aggregate and unassigned &mdash; an officer
                    should not have to work out which of the eight a document is
                    offered under.
                  </li>
                  <li>
                    <strong>Published material has formal requirements.</strong>{" "}
                    Criterion (3) requires the title, date and author of each
                    piece, plus any necessary translation. Hindi or
                    regional-language coverage needs a certified translation, and
                    a screenshot without a byline is not evidence.
                  </li>
                  <li>
                    <strong>Premium processing buys speed, not approval.</strong>{" "}
                    It commits USCIS to act inside the stated period, which can
                    mean a request for evidence rather than a decision.{" "}
                    <Link href="/uscis/forms/i-129" className="text-brand-600 underline">
                      Form I-129 explained
                    </Link>{" "}
                    covers the petition itself.
                  </li>
                  <li>
                    <strong>
                      Check your I-94 after every entry.
                    </strong>{" "}
                    The ten-day windows either side of the validity period are
                    real, and the I-94 is where an error in your class of
                    admission or admit-until date shows up &mdash;{" "}
                    <Link href="/uscis/i-94" className="text-brand-600 underline">
                      the I-94 guide
                    </Link>{" "}
                    has the retrieval steps and what to do about an error.
                  </li>
                  <li>
                    <strong>
                      Nobody adjudicates this on a checklist.
                    </strong>{" "}
                    Three criteria is the threshold, not the test. Petitions that
                    meet three on paper are refused on the strength of the
                    underlying evidence, and the difference between a strong and
                    a weak filing on identical facts is largely how the record is
                    assembled.
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
              intro={`Criteria, definitions, consultation rules and admission periods read from 8 CFR 214.2(o) on ${formatDate(
                O1_VERIFIED,
              )}. Fees from Form G-1055, edition ${O1_FEE_SCHEDULE_EDITION}. Admissions counts from the DHS Yearbook of Immigration Statistics FY2024. Cutoff dates from the ${monthLabel(
                bulletin.month,
              )} visa bulletin.`}
              links={[
                { label: "8 CFR 214.2(o) — aliens of extraordinary ability or achievement", href: SRC.cfr },
                { label: "USCIS — O-1 visa: individuals with extraordinary ability or achievement", href: SRC.uscisO1 },
                { label: "USCIS Policy Manual, Volume 2, Part M — O nonimmigrants", href: SRC.policyManualO1 },
                { label: "Form G-1055 — USCIS fee schedule", href: SRC.feeSchedule },
                { label: "Form I-129, Petition for a Nonimmigrant Worker", href: SRC.i129 },
                { label: "Form I-907, Request for Premium Processing Service", href: SRC.i907 },
                { label: "INA 101(a)(15)(O) — 8 U.S.C. 1101", href: SRC.ina101 },
                { label: "DHS Yearbook of Immigration Statistics", href: SRC.yearbook },
                { label: "USCIS processing times", href: SRC.processingTimes },
              ]}
            />

            <div className="mx-auto mt-6 max-w-3xl">
              <NotLegalAdvice />
            </div>

            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card">
              <h2 className="text-base font-bold text-ink-900">Related</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {[
                  { href: "/l1-visa", label: "L-1 visa — the other cap-free work route" },
                  { href: "/green-card/eb1a-vs-eb1b-vs-eb1c-vs-niw", label: "EB-1A vs EB-1B vs EB-1C vs NIW" },
                  { href: "/visa-bulletin/eb1-india", label: "EB-1 India cutoffs and outlook" },
                  { href: "/h1b-lottery-chances", label: "H-1B lottery chances" },
                  { href: "/h1b-lottery-not-selected-options", label: "If you were not selected" },
                  { href: "/uscis/forms/i-129", label: "Form I-129 explained" },
                  { href: "/visa-interview-waiver", label: "Visa interview waiver (dropbox)" },
                  { href: "/uscis/i-94", label: "Your I-94 and travel history" },
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
                  "Employment visa routes",
                  "H-1B alternatives",
                  "NRI immigration planning",
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
