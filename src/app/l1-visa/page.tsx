import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ReviewedByline from "@/components/ReviewedByline";
import AuthorBioBox from "@/components/AuthorBioBox";
import Newsletter from "@/components/Newsletter";
import NotLegalAdvice from "@/components/tools/NotLegalAdvice";
import OfficialSourceBox from "@/components/tools/OfficialSourceBox";
import ToolFaq from "@/components/tools/ToolFaq";
import L1EligibilityCalculator from "@/components/tools/L1EligibilityCalculator";
import {
  L1AdmissionsChart,
  L2sTransitionChart,
  L1ByCountryChart,
  CombinedClockDiagram,
  BlanketVsIndividualDiagram,
} from "@/components/tools/l1/L1Visuals";
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
  BLANKET_L,
  EXECUTIVE_CAPACITY,
  FIFTY_FIFTY_FEE,
  L1B_OFFSITE_RULE,
  L1_CLASSES,
  L1_COMPARISON,
  L1_COMPARE_ROUTES,
  L1_DENIAL_DATA_NOTE,
  L1_DUAL_INTENT,
  L1_FEES,
  L1_FEE_SCHEDULE_EDITION,
  L1_INDIA_FY2024 as IN24,
  L1_PERIODS,
  L1_PUBLISHED,
  L1_SOURCES as SRC,
  L1_STAY_CAPS,
  L1_STEPS,
  L1_UPDATED,
  L1_VERIFIED,
  L2_SPOUSE,
  MANAGERIAL_CAPACITY,
  NEW_OFFICE,
  ONE_YEAR_RULE,
  QUALIFYING_RELATIONSHIPS,
  SPECIALIZED_KNOWLEDGE,
} from "@/data/l1VisaData";
import { getPremiumFeeByForm, premiumProcessing } from "@/lib/premiumProcessing";
import { bulletin, formatCutoff, getCutoffs } from "@/lib/visa-bulletin";
import { monthLabel } from "@/lib/visaBulletinMonths";

/**
 * /l1-visa — the L-1 pillar.
 *
 * Owns: the L-1A and L-1B definitions verbatim, the one-year-in-three rule
 * including the half about US time, the qualifying relationship, new-office
 * L-1, blanket L, the combined L-and-H stay cap, the L-1 Visa Reform Act
 * off-site rule, the fee stack including the September 2026 change to the
 * Public Law 114-113 fee, and L-2S work authorisation.
 *
 * Does NOT own, and only summarises with a link:
 *   EB-1C / green card routes     → /green-card/eb1a-vs-eb1b-vs-eb1c-vs-niw
 *   India EB-1 cutoffs            → /visa-bulletin/eb1-india
 *   H-1B lottery odds             → /h1b-lottery-chances
 *   Travel with a pending I-485   → /uscis/travel-to-india-while-i485-pending
 *   The H/L exception at the border → /h1b-denied-entry-airport
 *   H-1B six-year cap and AC21    → /h1b-perm-max-out-calculator, /green-card/ac21
 *   Interview waiver rules        → /visa-interview-waiver
 * See docs/seo/oct-2026-cluster/overlap-report.md §3.2.
 */

const PAGE_PATH = "/l1-visa";

const premium = getPremiumFeeByForm("I-129").filter((i) => i.eligible)[0];
const eb1India = getCutoffs("eb1", "india");

export const metadata: Metadata = pageMetadata({
  title: "L-1 Visa: 1 Year Abroad, 5 or 7 Years Here — and H-1B Time Counts",
  description:
    "The L-1 rule nobody writes down: the five- and seven-year caps count L and H time together, so four years on an H-1B leaves three years of L-1A. Plus blanket L's unappealable consular denial, the $4,500 fee now on renewals, and why L-2 spouses can work when H-4 spouses cannot.",
  path: PAGE_PATH,
  type: "article",
  openGraph: { publishedTime: L1_PUBLISHED, modifiedTime: L1_UPDATED },
});

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Immigration", url: "/immigration" },
  { name: "L-1 Visa", url: PAGE_PATH },
];

const faqs: FaqItem[] = [
  {
    question: "What is the L-1 visa?",
    answer:
      "The L-1 is for an intracompany transferee: someone who has worked abroad for one continuous year in the last three for a company, and is moving to a parent, branch, affiliate or subsidiary of that company in the United States in a managerial or executive capacity (L-1A) or a role requiring specialized knowledge (L-1B). It comes from INA 101(a)(15)(L), with the rules at 8 CFR 214.2(l). There is no numerical cap, no lottery, no labour condition application and no regulatory minimum salary.",
  },
  {
    question: "What is the difference between L-1A and L-1B?",
    answer:
      "L-1A is for managers and executives and is capped at seven years. L-1B is for specialized knowledge and is capped at five. The definitions matter more than the labels: managerial capacity has a four-part test that includes managing an essential function rather than only supervising people, which is how a function owner with no direct reports can be L-1A. Specialized knowledge means special knowledge of the organisation's own products, services or methods and how they apply in international markets, or an advanced level of knowledge of the organisation's processes — not simply being good at a widely-held skill.",
  },
  {
    question: "How long can you stay on an L-1 visa?",
    answer: `Five years in a specialized knowledge capacity, seven in a managerial or executive one. The part most guides leave out: 8 CFR 214.2(l)(12)(i) counts time spent in the United States "under section 101(a)(15)(L) and/or (H)" — together. Four years on an H-1B leaves three years of L-1A, not seven, and one year of L-1B, not five. Nothing about changing employer, company group or classification resets it. The only reset is residence and physical presence outside the United States, apart from brief visits for business or pleasure, for the immediate prior year.`,
  },
  {
    question: "Does H-1B time count against the L-1 limit?",
    answer:
      "Yes. This is the single most expensive misunderstanding on this route. The caps in 8 CFR 214.2(l)(12)(i) apply to time in the United States under the L classification and/or the H classification, as one combined total. Six years on an H-1B leaves one year of L-1A and no L-1B time at all. The calculator on this page models the combined clock.",
  },
  {
    question: "What is the 1 year in 3 rule for L-1?",
    answer:
      "You must have been employed abroad continuously for one year by a qualifying organisation within the three years before you apply for admission. Two things trip people up. The year has to be continuous — twelve months split across two separate postings is not one continuous year. And time you spent in the United States for the same company group does not break that continuous year, but 8 CFR 214.2(l)(1)(ii)(A) says in terms that it does not count toward it either. Five of the last thirty-six months on a US client site leaves thirty-one countable months, not thirty-six.",
  },
  {
    question: "How much does an L-1 visa cost?",
    answer: `From Form G-1055 edition ${L1_FEE_SCHEDULE_EDITION}: the Form I-129 L petition fee is $1,385 on paper or $1,335 online, halved to $695 for a small employer or a nonprofit. Add the Asylum Program Fee of $600, or $300 small employer and $0 nonprofit, and the $500 Fraud Prevention and Detection fee where it applies. Then the big one: a petitioner with 50 or more US employees of whom more than half are in H-1B, L-1A or L-1B status pays an additional $4,500 under Public Law 114-113. Premium processing is optional at ${premium.feeDisplay}. All of these are the employer's fees.`,
  },
  {
    question: "Can an L-2 spouse work in the US?",
    answer:
      "Yes, without an EAD. Since 12 November 2021 USCIS has treated certain L-2 dependent spouses as employment authorised incident to status, and since 30 January 2022 they receive a Form I-94 annotated L-2S. An unexpired I-94 annotated L-2S is acceptable as List C evidence on Form I-9. The trap is the annotation: an I-94 reading plain L-2 is not sufficient on its own, and an older one needs the USCIS notice issued to pre-2022 holders alongside it. Note that the regulation at 8 CFR 214.2(l)(7)(ii) still says a spouse may not work without authorisation — the policy has overtaken the text, which is why employers sometimes get this wrong.",
  },
  {
    question: "What is a blanket L petition?",
    answer: `An approved blanket petition lets a large multinational certify individual transferees on Form I-129S and have the consulate adjudicate them, with no new USCIS filing. The employer needs three or more domestic and foreign branches, subsidiaries or affiliates, a US office doing business for a year or more, and one of: ten or more L approvals in the previous twelve months, US subsidiaries or affiliates with combined annual sales of at least $25 million, or a US workforce of at least 1,000 employees. Two limits matter to you rather than to your employer: a blanket covers managers, executives and specialized knowledge PROFESSIONALS only, so an L-1B without a degree cannot use it — and a consular denial under a blanket is final and unappealable.`,
  },
  {
    question: "Is the L-1 better than the H-1B?",
    answer:
      "It is better in four places and worse in one that often decides it. Better: no lottery, no cap, no labour condition application, and an L-2 spouse can work from day one where an H-4 spouse generally cannot. L-1A also feeds EB-1C, which skips PERM entirely. Worse: an L-1 is not portable. It belongs to the company group, so there is no transfer to an unrelated employer the way there is on an H-1B. If you might want to leave, that single difference can outweigh the other four.",
  },
  {
    question: "Can I apply for a green card on an L-1 visa?",
    answer: `Yes, and 8 CFR 214.2(l)(16) protects it specifically: filing or approving a labour certification, an immigrant visa preference petition or an adjustment application cannot be the basis for denying an L-1 petition, an extension, your admission, or an L-2's admission or extension. L-1A is the useful one here, because it maps onto EB-1C, which needs no PERM. In the ${monthLabel(
      bulletin.month,
    )} bulletin, India EB-1 final action is ${formatCutoff(
      eb1India.fad,
    )}. Watch the interaction with the stay cap, though — seven years of L-1A can run out before an India EB queue clears, and the L-1 has no AC21 equivalent.`,
  },
  {
    question: "Is L-1 eligible for dropbox or interview waiver in India?",
    answer:
      "No. Under the interview-waiver rules effective 1 October 2025, L-1 and L-2 are both outside the eligible categories, so expect in-person interviews at Delhi, Mumbai, Chennai, Hyderabad or Kolkata, including for dependants. Our visa interview waiver page has the complete list and an eligibility checker.",
  },
  {
    question: "Can an L-1B work at a client site?",
    answer: `Only within a specific rule. The L-1 Visa Reform Act of 2004, at INA 214(c)(2)(F), applies to petitions filed on or after 6 June 2005 and is aimed at L-1B employees stationed primarily at the worksite of an unaffiliated employer. The petition has to show that you will not be principally controlled or supervised by that employer, and that your work is not labor for hire by them. This is the provision that governs client-site placement across the IT services industry, and it makes an off-site L-1B the most request-for-evidence-prone filing on the route.`,
  },
];

const jsonLd = jsonLdGraph(
  {
    "@type": "Article",
    "@id": `${absoluteUrl(PAGE_PATH)}#article`,
    headline:
      "The L-1 visa: one year abroad, five or seven years here, and the clock H-1B time already started",
    description:
      "8 CFR 214.2(l) read verbatim: the managerial and specialized-knowledge definitions, the one-year-in-three rule and the US time that does not count toward it, blanket L and its unappealable consular denial, the combined L and H stay cap, and the fee that now lands on every renewal.",
    datePublished: L1_PUBLISHED,
    dateModified: L1_UPDATED,
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

export default function L1VisaPage() {
  const indiaL1Share = ((IN24.l1India / IN24.l1Total) * 100).toFixed(1);
  const indiaH1bShare = ((IN24.h1bIndia / IN24.h1bTotal) * 100).toFixed(1);

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
              The L-1 visa: one year abroad, and a clock your H-1B already started
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-700 sm:text-lg">
              <strong>One continuous year</strong> with the company group abroad
              inside the last three. Then{" "}
              <strong>seven years of L-1A or five of L-1B</strong> &mdash; and 8
              CFR 214.2(l)(12)(i) counts your L <em>and H</em> time in the United
              States together, so four years on an H-1B leaves three of L-1A, not
              seven. No cap, no lottery, no labour condition application. Your
              spouse can work without an EAD once admitted in L-2S status with an
              I-94 that says so. You cannot take the approval to an unrelated
              employer.
            </p>

            <p className="mt-3 max-w-3xl text-sm text-ink-500">
              Last verified {formatDate(L1_VERIFIED)} against 8 CFR 214.2(l), the
              USCIS L-1A and L-1B pages, and Form G-1055 edition{" "}
              {L1_FEE_SCHEDULE_EDITION}.
            </p>

            <ul className="mt-5 grid max-w-3xl gap-2 sm:grid-cols-2">
              {[
                "The 5- and 7-year caps count L and H time in the US together",
                "US time for the same group does not count toward the qualifying year",
                "L-2 spouses work with no EAD once admitted L-2S — unlike H-4",
                "A consular denial under a blanket L is final and unappealable",
                "A 50/50 employer now pays $4,500 on renewals too, from 9 Sep 2026",
                "No portability to an unrelated employer; moves inside the group need a filing",
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

            <ReviewedByline date={L1_UPDATED} path={PAGE_PATH} className="mt-5" />
            <NotLegalAdvice className="mt-4 max-w-3xl" />
          </Container>
        </header>

        {/* ══════════ The tool ══════════ */}
        <section id="calculator" className="scroll-mt-24 bg-ink-900/[0.02] py-10 sm:py-14">
          <Container>
            <div className="mx-auto mb-6 max-w-3xl">
              <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                Do you qualify, and how long could you stay?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                Two separate questions with two separate regulations, which is
                why the answers come back separately. The field that changes most
                people&rsquo;s answer is the one asking how many months you have
                already spent in H status &mdash; because that time comes off the
                same cap.
              </p>
            </div>
            <L1EligibilityCalculator />
          </Container>
        </section>

        <section className="border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <div className="mx-auto max-w-[760px] space-y-10 text-[0.975rem] leading-relaxed text-ink-700">
              {/* ── 1. The combined clock ── */}
              <div id="clock" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Start with the rule that costs people years
                </h2>
                <p className="mt-3">
                  Almost every L-1 guide tells you L-1A is good for seven years
                  and L-1B for five. Both numbers are right and the sentence is
                  misleading, because of five words in the middle of 8 CFR
                  214.2(l)(12)(i):
                </p>
                <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50/50 p-5">
                  <p className="text-sm italic leading-relaxed text-ink-700">
                    &ldquo;An alien who has spent five years in the United States
                    in a specialized knowledge capacity or seven years in the
                    United States in a managerial or executive capacity{" "}
                    <strong className="not-italic">
                      under section 101(a)(15)(L) and/or (H) of the Act
                    </strong>{" "}
                    may not be readmitted to the United States under section
                    101(a)(15)(L) or (H) of the Act unless the alien has resided
                    and been physically present outside the United States, except
                    for brief visits for business or pleasure, for the immediate
                    prior year.&rdquo;
                  </p>
                  <p className="mt-2 text-xs text-ink-400">{L1_STAY_CAPS.cite}</p>
                </div>
                <p className="mt-3">{L1_STAY_CAPS.combined}</p>
                <div className="overflow-x-auto">
                  <div className="min-w-[520px]">
                    <CombinedClockDiagram />
                  </div>
                </div>
                <p className="mt-3">
                  This matters most to the exact career path that makes L-1
                  attractive in the first place. An engineer who spends four
                  years on an H-1B, goes back to India for a promotion, and
                  returns as an L-1A manager has three years of L-1A, not seven
                  &mdash; and no AC21 to extend past it, because AC21 is an H-1B
                  mechanism and has no L-1 equivalent. The practical consequence
                  is that the green card timeline stops being a background
                  project: for an India-born applicant, three years is not a
                  realistic window for the whole PERM-to-I-485 sequence, which is
                  why L-1A holders who intend to stay generally need the EB-1C
                  route started early.
                </p>
                <p className="mt-3">
                  <strong>The reset. </strong>
                  {L1_STAY_CAPS.reset} {L1_STAY_CAPS.evidence}{" "}
                  {L1_STAY_CAPS.blanketToo}
                </p>
                <p className="mt-3">
                  <strong>Recapture. </strong>
                  {L1_STAY_CAPS.notCountedNote} See{" "}
                  <Link href="/uscis/i-94" className="text-brand-600 underline">
                    your I-94 and travel history
                  </Link>{" "}
                  for how to pull it and what the record leaves out, and{" "}
                  <Link href="/h1b-perm-max-out-calculator" className="text-brand-600 underline">
                    the H-1B max-out calculator
                  </Link>{" "}
                  for the same mechanic on the H side.
                </p>
              </div>

              {/* ── 2. The two classifications ── */}
              <div id="classes" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  L-1A or L-1B, and why the definitions beat the labels
                </h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[720px] border-collapse text-sm">
                    <caption className="sr-only">
                      L-1A and L-1B compared on test, cap and blanket eligibility
                    </caption>
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Class
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          The test
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Max stay
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          Blanket L?
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {L1_CLASSES.map((c) => (
                        <tr key={c.id} className="border-b border-ink-900/5 align-top">
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {c.code}
                            <span className="mt-0.5 block text-[0.7rem] font-normal text-ink-400">
                              {c.label}
                            </span>
                          </th>
                          <td className="py-3 pr-3">
                            {c.test}
                            <span className="mt-1 block text-[0.7rem] text-ink-400">{c.cite}</span>
                          </td>
                          <td className="py-3 pr-3 whitespace-nowrap font-bold text-ink-900">
                            {c.maxYears} years
                          </td>
                          <td className="py-3 text-ink-500">{c.blanketEligible}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h3 className="mt-7 text-base font-bold text-ink-900">
                  Managerial capacity &mdash; all four parts
                </h3>
                <p className="mt-1 text-sm text-ink-500">{MANAGERIAL_CAPACITY.cite}</p>
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm italic text-ink-600">
                  {MANAGERIAL_CAPACITY.parts.map((p) => (
                    <li key={p.slice(0, 30)}>{p}</li>
                  ))}
                </ol>
                <p className="mt-3">{MANAGERIAL_CAPACITY.functionManager}</p>

                <h3 className="mt-7 text-base font-bold text-ink-900">
                  Executive capacity
                </h3>
                <p className="mt-1 text-sm text-ink-500">{EXECUTIVE_CAPACITY.cite}</p>
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm italic text-ink-600">
                  {EXECUTIVE_CAPACITY.parts.map((p) => (
                    <li key={p.slice(0, 30)}>{p}</li>
                  ))}
                </ol>

                <h3 className="mt-7 text-base font-bold text-ink-900">
                  Specialized knowledge
                </h3>
                <p className="mt-2 italic text-ink-600">
                  &ldquo;{SPECIALIZED_KNOWLEDGE.text}&rdquo;{" "}
                  <span className="not-italic text-xs text-ink-400">
                    {SPECIALIZED_KNOWLEDGE.cite}
                  </span>
                </p>
                <p className="mt-3">{SPECIALIZED_KNOWLEDGE.plain}</p>
                <p className="mt-3">
                  There is a second definition stacked on top of it, and it is
                  the one that decides whether you can use your employer&rsquo;s
                  blanket:
                </p>
                <p className="mt-2 italic text-ink-600">
                  &ldquo;{SPECIALIZED_KNOWLEDGE.professionalText}&rdquo;{" "}
                  <span className="not-italic text-xs text-ink-400">
                    {SPECIALIZED_KNOWLEDGE.professionalCite}
                  </span>
                </p>
                <p className="mt-3">
                  A specialized knowledge <em>professional</em> is a member of
                  the professions under INA 101(a)(32), which in practice means a
                  degree. A blanket L covers professionals; an L-1B without one
                  needs an individual petition. That is a distinction most
                  employees never hear about until the consulate raises it.
                </p>
              </div>

              {/* ── 3. The year ── */}
              <div id="qualifying-year" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  The one-year-in-three rule, and the half of it that gets missed
                </h2>
                <p className="mt-3 italic text-ink-600">
                  &ldquo;{ONE_YEAR_RULE.text}&rdquo;{" "}
                  <span className="not-italic text-xs text-ink-400">{ONE_YEAR_RULE.cite}</span>
                </p>
                <p className="mt-4">
                  Read the next sentence of the same subparagraph, which is where
                  the filings go wrong:
                </p>
                <p className="mt-2 italic text-ink-600">
                  &ldquo;{ONE_YEAR_RULE.usTimeText}&rdquo;
                </p>
                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
                  <p className="text-sm font-bold text-ink-900">
                    Not interruptive, and not countable
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">{ONE_YEAR_RULE.trap}</p>
                </div>
                <p className="mt-3">{ONE_YEAR_RULE.continuous}</p>
                <p className="mt-3">
                  This is worth checking before anybody starts a petition, and
                  checking against your actual travel record rather than memory.
                  The calculator above does the arithmetic; your I-94 travel
                  history is where the dates come from.
                </p>
              </div>

              {/* ── 4. The relationship ── */}
              <div id="relationship" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  The qualifying relationship, defined
                </h2>
                <p className="mt-3">
                  Your employer has to be one of four specific things to the US
                  entity, and &mdash; the part that fails petitions &mdash; both
                  entities have to keep doing business for the whole of your stay.
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[740px] border-collapse text-sm">
                    <caption className="sr-only">
                      The qualifying-relationship definitions in 8 CFR 214.2(l)(1)(ii)
                    </caption>
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Term
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          What the regulation says
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          In practice
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {QUALIFYING_RELATIONSHIPS.map((r) => (
                        <tr key={r.term} className="border-b border-ink-900/5 align-top">
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {r.term}
                            <span className="mt-0.5 block text-[0.7rem] font-normal text-ink-400">
                              {r.cite}
                            </span>
                          </th>
                          <td className="py-3 pr-3 italic">{r.text}</td>
                          <td className="py-3 text-ink-500">{r.plain ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4">
                  Two things to take from that table. A subsidiary can qualify on{" "}
                  <em>de facto control</em> with less than half the shareholding,
                  which is the route a minority-held Indian entity uses. And
                  &ldquo;exactly one&rdquo; in the qualifying-organisation
                  definition means the petition has to name which relationship it
                  relies on, not assert a general corporate association.
                </p>
              </div>

              {/* ── 5. New office ── */}
              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  New office L-1: one year, then prove it
                </h2>
                <p className="mt-3 italic text-ink-600">
                  &ldquo;{NEW_OFFICE.definition}&rdquo;{" "}
                  <span className="not-italic text-xs text-ink-400">
                    {NEW_OFFICE.definitionCite}
                  </span>
                </p>
                <p className="mt-3">
                  A new-office petition is approved for <strong>one year</strong>,
                  not three. What has to be shown up front differs by
                  classification.
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-ink-900/5 bg-ink-900/[0.02] p-4">
                    <p className="text-sm font-bold text-ink-900">
                      Manager or executive &mdash; {NEW_OFFICE.managerEvidenceCite}
                    </p>
                    <ul className="mt-2 space-y-1.5 text-sm text-ink-600">
                      {NEW_OFFICE.managerEvidence.map((e) => (
                        <li key={e.slice(0, 30)} className="flex gap-2">
                          <span aria-hidden className="text-brand-600">
                            ▸
                          </span>
                          <span>{e}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-ink-900/5 bg-ink-900/[0.02] p-4">
                    <p className="text-sm font-bold text-ink-900">
                      Specialized knowledge &mdash; {NEW_OFFICE.skEvidenceCite}
                    </p>
                    <ul className="mt-2 space-y-1.5 text-sm text-ink-600">
                      {NEW_OFFICE.skEvidence.map((e) => (
                        <li key={e.slice(0, 30)} className="flex gap-2">
                          <span aria-hidden className="text-brand-600">
                            ▸
                          </span>
                          <span>{e}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
                  <p className="text-sm font-bold text-ink-900">
                    Where new-office L-1s actually die
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">
                    {NEW_OFFICE.extensionTrap}
                  </p>
                  <p className="mt-2 text-xs text-ink-400">{NEW_OFFICE.extensionCite}</p>
                </div>
              </div>

              {/* ── 6. Blanket L ── */}
              <div id="blanket" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Blanket L: faster, and riskier in one specific way
                </h2>
                <p className="mt-3">
                  An approved blanket petition means your employer does not file
                  a fresh I-129 for you at all. It completes Form I-129S and the
                  consulate decides. For a large Indian IT services firm moving
                  people continuously, that is the difference between weeks and
                  months.
                </p>
                <div className="overflow-x-auto">
                  <div className="min-w-[520px]">
                    <BlanketVsIndividualDiagram />
                  </div>
                </div>
                <h3 className="mt-6 text-base font-bold text-ink-900">
                  What the employer has to be
                </h3>
                <p className="mt-1 text-sm text-ink-500">{BLANKET_L.cite}</p>
                <p className="mt-3 text-sm font-semibold text-ink-800">All three of:</p>
                <ul className="mt-1.5 space-y-1.5 text-sm text-ink-600">
                  {BLANKET_L.gate.map((g) => (
                    <li key={g.slice(0, 30)} className="flex gap-2">
                      <span aria-hidden className="text-brand-600">
                        ▸
                      </span>
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm font-semibold text-ink-800">And any one of:</p>
                <ul className="mt-1.5 space-y-1.5 text-sm text-ink-600">
                  {BLANKET_L.oneOfThree.map((g) => (
                    <li key={g.slice(0, 30)} className="flex gap-2">
                      <span aria-hidden className="text-brand-600">
                        ▸
                      </span>
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50/50 p-5">
                  <p className="text-sm font-bold text-ink-900">
                    A consular denial under a blanket is final
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">
                    {BLANKET_L.finality}
                  </p>
                  <p className="mt-2 text-xs text-ink-400">{BLANKET_L.finalityCite}</p>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-700">
                    {BLANKET_L.clearlyApprovable}
                  </p>
                </div>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[640px] border-collapse text-sm">
                    <caption className="sr-only">
                      Blanket L mechanics and limits
                    </caption>
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Point
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Rule
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          Citation
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {[
                        { p: "Who is covered", r: BLANKET_L.whoIsCovered, c: BLANKET_L.whoIsCoveredCite },
                        { p: "How long the blanket lasts", r: BLANKET_L.validity, c: BLANKET_L.validityCite },
                        { p: "The paperwork", r: BLANKET_L.mechanics, c: BLANKET_L.mechanicsCite },
                        { p: "Your admission period", r: BLANKET_L.admissionPeriod, c: BLANKET_L.admissionPeriodCite },
                        { p: "Being reassigned", r: BLANKET_L.reassignment, c: BLANKET_L.reassignmentCite },
                        { p: "No two-track filing", r: BLANKET_L.noDoubleTrack, c: BLANKET_L.noDoubleTrackCite },
                      ].map((row) => (
                        <tr key={row.p} className="border-b border-ink-900/5 align-top">
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {row.p}
                          </th>
                          <td className="py-3 pr-3">{row.r}</td>
                          <td className="py-3 text-[0.7rem] text-ink-400">{row.c}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── 7. Off-site rule ── */}
              <div id="offsite" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  If you will sit at a client&rsquo;s office
                </h2>
                <p className="mt-3">
                  This is the rule that governs how a large part of the Indian IT
                  services industry actually deploys people, and it is almost
                  never written for the worker.
                </p>
                <div className="mt-3 rounded-2xl border border-ink-900/5 bg-ink-900/[0.02] p-5">
                  <p className="text-sm font-bold text-ink-900">
                    {L1B_OFFSITE_RULE.act} &mdash; {L1B_OFFSITE_RULE.cite}
                  </p>
                  <p className="mt-1 text-xs text-ink-400">
                    {L1B_OFFSITE_RULE.appliesFrom}
                  </p>
                  <p className="mt-2 text-sm text-ink-600">{L1B_OFFSITE_RULE.aimedAt}</p>
                  <p className="mt-3 text-sm font-semibold text-ink-800">
                    The petitioner must show both:
                  </p>
                  <ol className="mt-1.5 list-decimal space-y-1.5 pl-5 text-sm italic text-ink-600">
                    {L1B_OFFSITE_RULE.tests.map((t) => (
                      <li key={t.slice(0, 30)}>{t}</li>
                    ))}
                  </ol>
                </div>
                <p className="mt-3">{L1B_OFFSITE_RULE.whyItMatters}</p>
                <p className="mt-3">
                  Two practical implications. First, if your assignment letter
                  says you report to a manager at the client, the petition has a
                  problem it has to answer with evidence rather than assertion.
                  Second, this is your employer&rsquo;s burden and not yours, but
                  it is your status that is at stake, so it is worth asking how
                  the petition describes the supervision arrangement before it is
                  filed rather than after an RFE arrives.
                </p>
                <p className="mt-3 text-sm text-ink-500">{L1_DENIAL_DATA_NOTE}</p>
              </div>

              {/* ── 8. Fees ── */}
              <div id="fees" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  The fee stack, and the part that changed in September 2026
                </h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[720px] border-collapse text-sm">
                    <caption className="sr-only">
                      The L-1 fee stack from the current USCIS fee schedule
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
                      {L1_FEES.map((f) => (
                        <tr
                          key={f.label}
                          className={`border-b border-ink-900/5 align-top ${
                            f.highlight ? "bg-rose-50/40" : ""
                          }`}
                        >
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {f.label}
                            <span className="mt-0.5 block text-[0.7rem] font-normal text-ink-400">
                              {f.who}
                            </span>
                          </th>
                          <td className="py-3 pr-3 whitespace-nowrap font-bold text-ink-900">
                            {f.label.indexOf("premium") !== -1 ? premium.feeDisplay : f.regular}
                          </td>
                          <td className="py-3 pr-3 whitespace-nowrap">{f.reduced ?? "—"}</td>
                          <td className="py-3 text-ink-500">{f.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-xs text-ink-400">
                  Base fees from Form G-1055 edition {L1_FEE_SCHEDULE_EDITION}.
                  Premium processing from the site&rsquo;s central record, last
                  verified {premiumProcessing.lastVerified}, effective{" "}
                  {premiumProcessing.effectiveDate}.
                </p>

                <h3 className="mt-7 text-base font-bold text-ink-900">
                  The {FIFTY_FIFTY_FEE.amount} fee, and who pays it
                </h3>
                <p className="mt-2 text-sm font-semibold text-ink-800">
                  All three conditions have to hold:
                </p>
                <ol className="mt-1.5 list-decimal space-y-1.5 pl-5 text-sm italic text-ink-600">
                  {FIFTY_FIFTY_FEE.conditions.map((c) => (
                    <li key={c.slice(0, 30)}>{c}</li>
                  ))}
                </ol>
                <p className="mt-3">
                  {FIFTY_FIFTY_FEE.exception} {FIFTY_FIFTY_FEE.nonWaivable}
                </p>
                <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50/50 p-5">
                  <p className="text-sm font-bold text-ink-900">
                    New from {formatDate(FIFTY_FIFTY_FEE.extensionChange.effective)}:
                    it now lands on extensions too
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">
                    {FIFTY_FIFTY_FEE.extensionChange.what}
                  </p>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-700">
                    {FIFTY_FIFTY_FEE.extensionChange.whoItHits}
                  </p>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-700">
                    <strong>{FIFTY_FIFTY_FEE.extensionChange.yourMoney}</strong>
                  </p>
                  <p className="mt-2 text-xs text-ink-400">
                    DHS final rule &ldquo;{FIFTY_FIFTY_FEE.extensionChange.rule}
                    &rdquo;, published{" "}
                    {formatDate(FIFTY_FIFTY_FEE.extensionChange.published)},
                    effective{" "}
                    {formatDate(FIFTY_FIFTY_FEE.extensionChange.effective)}.
                  </p>
                </div>
              </div>

              {/* ── 9. Periods ── */}
              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Validity, admission and extensions
                </h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[660px] border-collapse text-sm">
                    <caption className="sr-only">
                      L-1 petition validity, admission periods and the stay caps
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
                      {L1_PERIODS.map((p) => (
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
              </div>

              {/* ── 10. L-2 ── */}
              <div id="l2" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Your spouse can work, and the regulation still says otherwise
                </h2>
                <p className="mt-3">
                  This is the L-1&rsquo;s best feature for a family, and it is
                  also a place where the regulation as written and the rule as
                  applied have come apart. The text at{" "}
                  {L2_SPOUSE.regulationCite} still reads:
                </p>
                <p className="mt-2 italic text-ink-600">
                  &ldquo;{L2_SPOUSE.regulationText}&rdquo;
                </p>
                <p className="mt-3">
                  <strong>
                    That last sentence has been overtaken by policy.
                  </strong>{" "}
                  {L2_SPOUSE.policy}
                </p>
                <p className="mt-3">{L2_SPOUSE.annotation}</p>
                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
                  <p className="text-sm font-bold text-ink-900">
                    The annotation is the whole thing
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">{L2_SPOUSE.i9}</p>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-700">
                    {L2_SPOUSE.children}
                  </p>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-700">
                    Check the I-94 after every admission and after every approved
                    extension or change of status, because the annotation is
                    what an employer&rsquo;s I-9 process will look for. Our{" "}
                    <Link href="/uscis/i-94" className="text-brand-600 underline">
                      I-94 guide
                    </Link>{" "}
                    has the retrieval steps.
                  </p>
                </div>
                <p className="mt-4">{L2_SPOUSE.whyItMatters}</p>
                <p className="mt-3">
                  The change is visible in the admissions data, which is a neat
                  way to confirm the policy rather than take anyone&rsquo;s word
                  for it: the plain L-2 code collapses from FY2022 as spouses
                  move to L-2S and children to L-2Y.
                </p>
                <div className="overflow-x-auto">
                  <div className="min-w-[480px]">
                    <L2sTransitionChart />
                  </div>
                </div>
              </div>

              {/* ── 11. vs H-1B ── */}
              <div id="vs-h1b" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  L-1 against the H-1B
                </h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[720px] border-collapse text-sm">
                    <caption className="sr-only">
                      L-1A, L-1B and H-1B compared across ten dimensions
                    </caption>
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          &nbsp;
                        </th>
                        {L1_COMPARE_ROUTES.map((r) => (
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
                      {L1_COMPARISON.map((row) => (
                        <tr key={row.label} className="border-b border-ink-900/5 align-top">
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {row.label}
                            {row.note && (
                              <span className="mt-1 block text-[0.7rem] font-normal text-ink-400">
                                {row.note}
                              </span>
                            )}
                          </th>
                          {L1_COMPARE_ROUTES.map((r) => (
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
                  The row that decides it for most people is portability, and it
                  is worth stating precisely rather than as a slogan. An H-1B
                  moves with you to any employer: a new one files a transfer and
                  your status continues. An L-1 approval cannot be used to work
                  for an <strong>unrelated</strong> employer at all. Inside the
                  qualifying corporate group you can move &mdash; an amended or
                  new petition, or a fresh Form I-129S under a blanket, and a
                  reassignment to materially different duties needs one even
                  between listed entities. What has no route is leaving the group:
                  if it restructures, if the Indian entity is sold, or if you
                  simply want out, the way forward is a change of status to
                  something else, which means a cap-subject H-1B and its lottery,
                  or an O-1 if your record supports one. See{" "}
                  <Link href="/h1b-lottery-chances" className="text-brand-600 underline">
                    H-1B lottery chances
                  </Link>{" "}
                  for what that gamble currently looks like and{" "}
                  <Link href="/o1-visa" className="text-brand-600 underline">
                    the O-1 guide
                  </Link>{" "}
                  for the other cap-free route.
                </p>
              </div>

              {/* ── 12. Green card ── */}
              <div id="green-card" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  The green card, and the deadline the cap creates
                </h2>
                <p className="mt-3 italic text-ink-600">
                  &ldquo;{L1_DUAL_INTENT.lead}&rdquo;{" "}
                  <span className="not-italic text-xs text-ink-400">{L1_DUAL_INTENT.cite}</span>
                </p>
                <p className="mt-3">
                  The subsection then lists six specific things a PERM, an I-140
                  or an I-485 cannot be used to deny:
                </p>
                <ul className="mt-2 space-y-1.5 text-sm text-ink-600">
                  {L1_DUAL_INTENT.cannotDeny.map((d) => (
                    <li key={d.slice(0, 30)} className="flex gap-2">
                      <span aria-hidden className="text-emerald-600">
                        ✓
                      </span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4">
                  The useful route is EB-1C, multinational manager or executive,
                  which needs no PERM &mdash; and which maps onto the L-1A role
                  almost exactly, because the regulatory test is a year in a
                  managerial or executive capacity with the same company group.{" "}
                  <Link href="/green-card/eb1a-vs-eb1b-vs-eb1c-vs-niw" className="text-brand-600 underline">
                    EB-1A vs EB-1B vs EB-1C vs NIW
                  </Link>{" "}
                  owns that comparison. In the {monthLabel(bulletin.month)}{" "}
                  bulletin, India EB-1 final action is{" "}
                  <strong>{formatCutoff(eb1India.fad)}</strong> &mdash; see{" "}
                  <Link href="/visa-bulletin/eb1-india" className="text-brand-600 underline">
                    EB-1 India
                  </Link>
                  .
                </p>
                <p className="mt-3">
                  An L-1B pointed at EB-2 or EB-3 has a harder arithmetic
                  problem: PERM plus I-140 plus an India EB-2 or EB-3 queue
                  measured in years, against a five-year cap with H-1B time
                  already taken out of it and no AC21 to extend past it.{" "}
                  <Link href="/green-card/eb2-vs-eb3-india" className="text-brand-600 underline">
                    EB-2 vs EB-3 for India
                  </Link>{" "}
                  and{" "}
                  <Link href="/green-card/green-card-backlog-india" className="text-brand-600 underline">
                    how long the India backlog really is
                  </Link>{" "}
                  are the pages for that calculation. If the cap will bind before
                  the queue clears, the realistic options are a move to an L-1A
                  role on the evidence, a cap-subject H-1B to buy AC21 extensions,
                  or a year abroad to reset the clock.
                </p>
                <p className="mt-3">
                  <strong>Travelling with a pending I-485. </strong>
                  L-1 is a dual-intent status, and 8 CFR 245.2(a)(4)(ii)(C)
                  contains a narrow exception under which travel by an applicant
                  in lawful L-1 status is not an abandonment of the I-485 where
                  every listed condition holds.{" "}
                  <Link href="/h1b-denied-entry-airport" className="text-brand-600 underline">
                    The denied-entry guide
                  </Link>{" "}
                  sets out those conditions verbatim, and{" "}
                  <Link href="/uscis/travel-to-india-while-i485-pending" className="text-brand-600 underline">
                    travel to India while I-485 is pending
                  </Link>{" "}
                  covers the practical advice. The exception is narrower than it
                  reads and depends on every condition holding at the moment you
                  return.
                </p>
              </div>

              {/* ── 13. India angle ── */}
              <div id="india" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  The India picture
                </h2>
                <p className="mt-3">
                  India is the second-largest source of L-1 admissions after
                  Canada: {IN24.l1India.toLocaleString("en-US")} of{" "}
                  {IN24.l1Total.toLocaleString("en-US")} in FY2024, or{" "}
                  {indiaL1Share}%. Set that against {indiaH1bShare}% of H-1B
                  admissions and the shape of the Indian work-visa landscape is
                  clear: L-1 is the real second route, and it is an order of
                  magnitude smaller than the first.
                </p>
                <div className="overflow-x-auto">
                  <div className="min-w-[380px]">
                    <L1ByCountryChart />
                  </div>
                </div>
                <p className="mt-3">
                  Alongside the principals, FY2024 recorded{" "}
                  {IN24.l2sIndia.toLocaleString("en-US")} Indian L-2S admissions
                  and {IN24.l2yIndia.toLocaleString("en-US")} L-2Y &mdash; which
                  is to say roughly {IN24.l2sIndia.toLocaleString("en-US")}{" "}
                  work-authorised spouses arriving without an EAD application
                  between them.
                </p>
                <div className="overflow-x-auto">
                  <div className="min-w-[420px]">
                    <L1AdmissionsChart />
                  </div>
                </div>
                <h3 className="mt-7 text-base font-bold text-ink-900">
                  The interview in India
                </h3>
                <p className="mt-2">
                  L-1 and L-2 are both outside the interview-waiver categories
                  under the rules effective 1 October 2025, so plan for in-person
                  appointments at Delhi, Mumbai, Chennai, Hyderabad or Kolkata
                  &mdash; including for children, since the automatic waiver for
                  applicants under 14 was removed at the same time.{" "}
                  <Link href="/visa-interview-waiver" className="text-brand-600 underline">
                    The interview waiver page
                  </Link>{" "}
                  has the complete eligible list with citations.
                </p>
                <p className="mt-3">
                  If you are travelling under a blanket, take the whole package:
                  the original and one copy of the I-129S endorsed by your
                  employer, a copy of the approved Form I-797 attached to each,
                  and the evidence of the qualifying year. A blanket interview is
                  the one appointment where the decision is both immediate and
                  final.
                </p>
              </div>

              {/* ── 14. Steps ── */}
              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  The sequence
                </h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[680px] border-collapse text-sm">
                    <caption className="sr-only">
                      The L-1 filing sequence, step by step
                    </caption>
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Step
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Who
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          What happens
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {L1_STEPS.map((s) => (
                        <tr key={String(s.n)} className="border-b border-ink-900/5 align-top">
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {s.n}. {s.title}
                          </th>
                          <td className="py-3 pr-3 whitespace-nowrap text-ink-500">{s.who}</td>
                          <td className="py-3">
                            {s.detail}
                            {s.cite && (
                              <span className="mt-1 block text-[0.7rem] text-ink-400">{s.cite}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
              intro={`Definitions, relationship rules, blanket requirements and the stay caps read from 8 CFR 214.2(l) on ${formatDate(
                L1_VERIFIED,
              )}. Fees from Form G-1055, edition ${L1_FEE_SCHEDULE_EDITION}. The extension change from the DHS final rule effective ${formatDate(
                FIFTY_FIFTY_FEE.extensionChange.effective,
              )}. Admissions counts from the DHS Yearbook of Immigration Statistics FY2024.`}
              links={[
                { label: "8 CFR 214.2(l) — intracompany transferees", href: SRC.cfr },
                { label: "USCIS — L-1A intracompany transferee executive or manager", href: SRC.uscisL1a },
                { label: "USCIS — L-1B intracompany transferee specialized knowledge", href: SRC.uscisL1b },
                { label: "Form G-1055 — USCIS fee schedule", href: SRC.feeSchedule },
                { label: "Federal Register — 9-11 Response and Biometric Entry-Exit Fee for H-1B and L-1 visas", href: SRC.biometricFeeRule },
                { label: "USCIS Policy Manual Vol. 10 Pt. B Ch. 2 — E and L dependent spouses", href: SRC.spousePolicyManual },
                { label: "USCIS Handbook for Employers M-274 §7.9.2 — L nonimmigrant status", href: SRC.i9Handbook },
                { label: "Form I-129, Petition for a Nonimmigrant Worker", href: SRC.i129 },
                { label: "Form I-129S, Certificate of Eligibility under a Blanket Petition", href: SRC.i129s },
                { label: "DHS Yearbook of Immigration Statistics", href: SRC.yearbook },
                { label: "USCIS immigration and citizenship data", href: SRC.uscisData },
              ]}
            />

            <div className="mx-auto mt-6 max-w-3xl">
              <NotLegalAdvice />
            </div>

            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card">
              <h2 className="text-base font-bold text-ink-900">Related</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {[
                  { href: "/o1-visa", label: "O-1 visa — the other cap-free route" },
                  { href: "/green-card/eb1a-vs-eb1b-vs-eb1c-vs-niw", label: "EB-1A vs EB-1B vs EB-1C vs NIW" },
                  { href: "/visa-bulletin/eb1-india", label: "EB-1 India cutoffs and outlook" },
                  { href: "/h1b-lottery-chances", label: "H-1B lottery chances" },
                  { href: "/h1b-perm-max-out-calculator", label: "H-1B max-out and recapture calculator" },
                  { href: "/uscis/i-94", label: "Your I-94 and travel history" },
                  { href: "/visa-interview-waiver", label: "Visa interview waiver (dropbox)" },
                  { href: "/uscis/travel-to-india-while-i485-pending", label: "Travel to India with a pending I-485" },
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
                  "Intracompany transfers",
                  "Employment visa routes",
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
