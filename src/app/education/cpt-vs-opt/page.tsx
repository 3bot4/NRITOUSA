import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import CptOptQuiz from "@/components/education/CptOptQuiz";
import ShareWithTagline from "@/components/education/ShareWithTagline";
import { FactTable } from "@/components/education/FactTable";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";
import {
  getStudentPage,
  getShareCopy,
  getRelated,
  STUDENT_LAST_REVIEWED,
} from "@/lib/studentCluster";
import {
  optRules,
  studentSources,
  STUDENT_DATA_VERIFIED,
} from "@/data/studentClusterData";
import { site } from "@/lib/site";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";

const page = getStudentPage("cpt-vs-opt")!;
const share = getShareCopy("cpt-vs-opt");
const related = getRelated("cpt-vs-opt");

export const metadata: Metadata = {
  ...pageMetadata({
    title: page.seoTitle,
    description: page.seoDescription,
    path: page.path,
  }),
  keywords: [
    "day 1 CPT",
    "CPT vs OPT",
    "curricular practical training",
    "day 1 CPT risk",
    "full time CPT 12 months OPT",
    "CPT rules F1",
  ],
};

const faq: FaqItem[] = [
  {
    question: "What is the difference between CPT and OPT?",
    answer: `CPT is work authorisation during your program, tied to a specific employer and to coursework that is an integral part of your curriculum — your DSO authorises it directly on your I-20. OPT is work authorisation for your field of study generally, authorised by USCIS with an EAD card, not tied to any single employer, and usually used after graduation. CPT is faster to obtain and narrower in scope; OPT takes months and is far more flexible.`,
  },
  {
    question: "Does CPT affect my OPT eligibility?",
    answer: `Full-time CPT does. ${optRules.cptFullTimeMonthsThatKillOpt} months or more of full-time CPT eliminates post-completion OPT entirely — a bright-line rule with no discretion and no way back. Part-time CPT (20 hours a week or fewer) does not count toward that threshold at all, however much of it you use. This is the single most consequential rule on this page, and it is why part-time CPT is almost always the safer choice when the role allows it.`,
  },
  {
    question: "Is Day-1 CPT legal?",
    answer:
      "The regulation permits CPT before the usual one-academic-year requirement where immediate participation in practical training is an integral part of an established graduate curriculum. That is a genuine exception. The question in practice is not whether the exception exists but whether a given program actually fits it — and whether a USCIS officer reviewing your file years later will agree it did. Programs that are mostly online, hold occasional weekend residencies, and market work authorisation more prominently than academics are the ones that draw scrutiny.",
  },
  {
    question: "What actually goes wrong with Day-1 CPT?",
    answer:
      "Rarely anything immediate — that is what makes it dangerous. The consequence typically arrives years later at the H-1B or green card stage, when an officer assesses whether F-1 status was properly maintained throughout. A request for evidence asks you to prove the CPT was integral to your curriculum. If you cannot, you can face denial at exactly the point where you have the most to lose: money spent, years invested, and a job offer on the table. Enforcement action has also been taken against schools themselves, which leaves enrolled students stranded.",
  },
  {
    question: "What should I ask a school offering Day-1 CPT?",
    answer:
      "Ask how many of its students have had H-1B petitions approved after using its Day-1 CPT, and treat a vague or anecdotal answer as an answer in itself. Ask which regional accreditor accredits it, then verify that independently rather than trusting the website. Ask what proportion of instruction is in person. Ask to see the curriculum document that makes practical training integral to the program. And ask what happens to your status if the school loses SEVP certification.",
  },
  {
    question: "Can I use CPT and OPT at the same school?",
    answer: `Yes, and most students do — part-time CPT during the program for an internship, then post-completion OPT after graduating. The only thing to track is your cumulative full-time CPT, which must stay under ${optRules.cptFullTimeMonthsThatKillOpt} months for OPT to remain available. Count authorised months, not months you actually worked; students routinely underestimate their total by counting the latter.`,
  },
  {
    question: "When am I eligible for CPT?",
    answer: `Generally after ${optRules.cptAcademicYearMonths} months — one full academic year — of full-time study in lawful F-1 status. Graduate programs where immediate practical training is an integral part of the curriculum are the recognised exception. Your DSO determines eligibility and issues the authorisation on an updated I-20, and you must not begin work before that authorisation is in hand.`,
  },
  {
    question: "Why should I trust this page over the ones ranking around it?",
    answer:
      "Judge it on what we have to gain. Most of the results for Day-1 CPT queries are run by schools selling those programs, agencies placing students into them, or services taking a fee somewhere in the chain. We sell nothing here — no program, no placement, no consultation, no email capture on the quiz above. Check the sources at the bottom of the page and verify the rules yourself with your DSO. That is the correct way to use any page on this topic, including this one.",
  },
];

export default function CptVsOptPage() {
  const url = absoluteUrl(page.path);
  const jsonLd = jsonLdGraph(
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: page.title,
      description: page.seoDescription,
      url,
      datePublished: STUDENT_DATA_VERIFIED,
      dateModified: STUDENT_DATA_VERIFIED,
      author: { "@id": `${site.url}/#organization` },
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "en-US",
      isPartOf: { "@id": `${site.url}/#website` },
    },
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Education", url: "/education" },
      { name: page.label, url: page.path },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolFirstLayout
        toolSlug="cpt-vs-opt"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Education", href: "/education" },
          { label: page.label },
        ]}
        icon={page.icon}
        category="Education"
        title={page.title}
        hook={page.hook}
        badges={["5-question quiz", "Nothing to sell you", "No signup", "Sourced"]}
        accent={page.accent}
        sourceNote={
          <>
            Rules verified{" "}
            <time dateTime={STUDENT_DATA_VERIFIED}>{STUDENT_DATA_VERIFIED}</time>{" "}
            against{" "}
            <a
              href={studentSources.stemOpt.href}
              className="text-brand-600 underline"
              rel="nofollow noopener"
              target="_blank"
            >
              DHS Study in the States
            </a>
            .
          </>
        }
        disclaimerExtra={
          <p>
            Educational information, not legal advice. CPT eligibility is
            determined by your DSO and the specific structure of your program.
            For anything involving Day-1 CPT, pay an immigration attorney for an
            opinion before you commit money — it is the cheapest part of that
            decision.
          </p>
        }
      >
        <section className="pt-6">
          <Container>
            <FastAnswerSnapshot
              title="CPT vs OPT — the short version"
              answerLabel="Full-time CPT that eliminates OPT"
              answer={`${optRules.cptFullTimeMonthsThatKillOpt} months`}
              accent="brand"
              rows={[
                {
                  label: "Part-time CPT effect on OPT",
                  value: "None",
                  note: "20 hrs/week or fewer never counts toward the threshold.",
                  highlight: true,
                },
                {
                  label: "CPT eligibility",
                  value: `After ${optRules.cptAcademicYearMonths} months`,
                  note: "One academic year, with a narrow graduate exception.",
                },
                {
                  label: "Post-completion OPT",
                  value: `${optRules.postCompletionMonths} months`,
                  note: `Plus ${optRules.stemMonths} months if STEM-designated.`,
                },
                {
                  label: "Who authorises it",
                  value: "DSO vs USCIS",
                  note: "CPT on the I-20; OPT needs an EAD card.",
                },
              ]}
              badges={["12-month rule", "Part-time is safe", "DSO vs USCIS"]}
              lastVerified={STUDENT_DATA_VERIFIED}
              sources={[studentSources.stemOpt, studentSources.optUnemployment]}
              disclaimer="Educational information only — confirm eligibility with your DSO."
            />
          </Container>
        </section>

        <section className="py-10">
          <Container>
            <CptOptQuiz />
          </Container>
        </section>

        <section className="pb-10">
          <Container>
            <div className="mx-auto max-w-3xl">
              <ShareWithTagline
                shareText={share.text}
                tagline={share.tagline}
                path={page.path}
              />
            </div>
          </Container>
        </section>

        <section className="pb-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                CPT vs OPT, side by side
              </h2>
              <FactTable
                caption="The differences that actually change your decisions"
                headers={["", "CPT", "OPT"]}
                rows={[
                  [
                    "When you can use it",
                    `During your program, after ${optRules.cptAcademicYearMonths} months of study`,
                    `Mainly after completion; ${optRules.postCompletionMonths} months`,
                  ],
                  [
                    "Who authorises it",
                    "Your DSO, on an updated I-20",
                    "USCIS, via an EAD card",
                  ],
                  ["How long it takes", "Days to weeks", "Months — plan around it"],
                  [
                    "Tied to an employer?",
                    "Yes — one specific employer and role",
                    "No — any employer in your field",
                  ],
                  [
                    "Must relate to your studies?",
                    "Yes — integral to your curriculum",
                    "Yes — related to your field of study",
                  ],
                  [
                    "Cost",
                    "No USCIS fee",
                    "I-765 filing fee",
                  ],
                  [
                    "Effect on later OPT",
                    `Full-time: ${optRules.cptFullTimeMonthsThatKillOpt} months kills it. Part-time: none.`,
                    "N/A",
                  ],
                  [
                    "Extension available?",
                    "No",
                    `Yes — ${optRules.stemMonths} months if STEM-designated`,
                  ],
                  [
                    "Unemployment limit",
                    "N/A — you are enrolled",
                    `${optRules.initialUnemploymentDays} days, ${optRules.aggregateUnemploymentDaysWithStem} aggregate with STEM`,
                  ],
                ]}
                highlightRows={[6]}
              />

              <h2 className="mt-10 text-2xl font-bold tracking-tight text-ink-900">
                The 12-month rule, spelled out
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">
                This rule ends more OPT plans than anything else on this page,
                and it is entirely avoidable once you understand it.
              </p>
              <FactTable
                caption="Cumulative full-time CPT and what remains available"
                headers={["Full-time CPT used", "OPT still available?", "What it means"]}
                nowrapCol={0}
                rows={[
                  [
                    "0 months",
                    "Yes — full entitlement",
                    "Nothing has been consumed.",
                  ],
                  [
                    "6 months",
                    "Yes — full entitlement",
                    "Under the threshold. No reduction; it is not pro-rated.",
                  ],
                  [
                    "11 months",
                    "Yes — full entitlement",
                    "Still under. But you are one authorisation away from losing everything.",
                  ],
                  [
                    "12 months or more",
                    "No — eliminated",
                    "Post-completion OPT is gone permanently. There is no appeal and no partial credit.",
                  ],
                  [
                    "Any amount of part-time CPT",
                    "Yes — full entitlement",
                    "Part-time CPT never counts toward the threshold.",
                  ],
                ]}
                highlightRows={[3, 4]}
                note="Count months of authorisation, not months you actually worked. Students routinely underestimate their total by counting the latter, and discover the gap only when they try to file for OPT."
              />

              <h2 className="mt-10 text-2xl font-bold tracking-tight text-ink-900">
                Day-1 CPT: the honest section
              </h2>
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/50 p-5 sm:p-6">
                <p className="text-sm font-bold text-ink-900">
                  Our position, stated plainly so you can discount it
                  appropriately
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">
                  We do not run a Day-1 CPT program, place students into one, or
                  take a referral fee from anyone who does. Most of the pages
                  ranking around this one do at least one of those things. That
                  does not automatically make them wrong — but it does mean you
                  should read this page, read theirs, and then verify the rules
                  yourself with your DSO and an attorney.
                </p>
              </div>

              <p className="mt-5 text-base leading-relaxed text-ink-600">
                The regulation genuinely does allow CPT before the one-academic-year
                mark where immediate practical training is an integral part of an
                established graduate curriculum. The exception is real. The
                problem is that it has become a business model, and the gap
                between &ldquo;a program that fits the exception&rdquo; and
                &ldquo;a program marketed on the exception&rdquo; is where
                students get hurt.
              </p>

              <p className="mt-4 text-base leading-relaxed text-ink-600">
                What makes it hard to evaluate is the delay. Nothing usually goes
                wrong at enrolment, or during the program, or even when you first
                start working. It goes wrong years later, when an officer
                adjudicating your H-1B or green card looks back and asks whether
                you maintained F-1 status the whole time. By then you have spent
                the money, invested the years, and have a job offer riding on the
                answer. That asymmetry — small immediate benefit, large delayed
                risk — is the entire shape of this decision.
              </p>

              <FactTable
                caption="Risk signals, from lowest to highest"
                headers={["Signal", "Risk", "Why it matters"]}
                rows={[
                  [
                    "Regular in-person classes, CPT after one academic year",
                    "Baseline",
                    "This is the ordinary path the regulation contemplates.",
                  ],
                  [
                    "Graduate program with a genuine required co-op from term one",
                    "Low",
                    "Fits the actual exception, provided the curriculum document backs it up.",
                  ],
                  [
                    "Mostly in person, some online components",
                    "Moderate",
                    "Fine in itself; the question is whether coursework is real and assessed.",
                  ],
                  [
                    "Mostly online with occasional weekend residencies",
                    "High",
                    "Hard to defend as an established curriculum where practical training is integral.",
                  ],
                  [
                    "Marketing leads with work authorisation, not academics",
                    "High",
                    "Tells you what the program is actually selling, and how it will read to an adjudicator.",
                  ],
                  [
                    "Back-to-back degrees used to maintain continuous CPT",
                    "Highest",
                    "Reads as using enrolment to hold work authorisation rather than to study.",
                  ],
                ]}
                highlightRows={[4, 5]}
              />

              <div className="mt-6 rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card sm:p-6">
                <h3 className="text-base font-bold text-ink-900">
                  Six questions to ask any school before you pay
                </h3>
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-ink-600 marker:font-bold marker:text-brand-600">
                  <li>
                    How many of your students have had H-1B petitions approved
                    after using your Day-1 CPT? A vague answer is an answer.
                  </li>
                  <li>
                    Which regional accreditor accredits you? Then verify it
                    independently — not from the school&apos;s own website.
                  </li>
                  <li>
                    What proportion of instruction is in person, and how is
                    attendance assessed?
                  </li>
                  <li>
                    Can I see the curriculum document establishing that practical
                    training is integral to the program?
                  </li>
                  <li>
                    What happens to my status if the school loses SEVP
                    certification while I am enrolled?
                  </li>
                  <li>
                    Will you put your answers to these questions in writing?
                  </li>
                </ol>
              </div>

              <h2 className="mt-10 text-2xl font-bold tracking-tight text-ink-900">
                Where to go next
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {related.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="block h-full rounded-2xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
                    >
                      <p className="text-sm font-bold text-ink-900">{l.label}</p>
                      <p className="mt-1 text-xs leading-relaxed text-ink-500">
                        {l.blurb}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="mt-8 text-xs text-ink-400">
                Last reviewed:{" "}
                <time dateTime={STUDENT_LAST_REVIEWED}>
                  {STUDENT_LAST_REVIEWED}
                </time>
              </p>
            </div>
          </Container>
        </section>

        <section className="pb-14">
          <Container>
            <ToolFaq items={faq} />
          </Container>
        </section>

        <section className="pb-16">
          <Container>
            <div className="mx-auto max-w-3xl rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
              <h2 className="text-sm font-bold uppercase tracking-wide text-ink-400">
                Official sources
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                {[
                  studentSources.stemOpt,
                  studentSources.optUnemployment,
                  studentSources.nafsa,
                  studentSources.ailaLawyerSearch,
                ].map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="nofollow noopener"
                      className="text-brand-600 underline"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
