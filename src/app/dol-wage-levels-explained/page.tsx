import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import { FactTable } from "@/components/education/FactTable";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import PermClusterLinks from "@/components/tools/PermClusterLinks";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";
import {
  wageClusterLinks,
  wageRelatedLinks,
  wageArticleJsonLd,
  WAGE_PUBLISHED,
  WAGE_UPDATED,
  WAGE_UPDATED_HUMAN,
} from "@/lib/wageCluster";
import { prevailingWageData as W, WAGE_DATA_NOTE } from "@/data/prevailingWageData";

const PATH = "/dol-wage-levels-explained";
const TITLE = "DOL Wage Levels Explained: Level I, II, III, IV (2026)";
const DESC =
  "What DOL wage Level 1, 2, 3, and 4 mean, how the level is decided, and how it sets your prevailing wage for PERM and H-1B.";

export const metadata: Metadata = pageMetadata({
  title: "DOL Wage Levels Explained (I–IV)",
  description: DESC,
  path: PATH,
});

const faq: FaqItem[] = [
  { question: "What are DOL wage levels?", answer: "DOL sorts each job into one of four wage levels based on how demanding it is. Each level corresponds to a percentile of the local wage distribution for that occupation, so a higher level means a higher required prevailing wage." },
  { question: "What is the difference between Level 1 and Level 4?", answer: "Level I (entry) sits around the 17th percentile and fits routine, closely supervised roles. Level IV (fully competent/senior) sits around the 67th percentile and fits senior roles with independent judgment and leadership. Levels II and III are in between." },
  { question: "How is my wage level decided?", answer: "By addition, using DOL's published worksheet. Every determination starts at Level I, and a point is added for each requirement the job imposes above what the occupation itself normally demands — experience beyond the occupation's O*NET SVP baseline, education above its normal requirement, genuine special skills or licences, and supervisory duties that are not customary for the occupation. The total maps to Level I, II, III or IV. Requirements that merely restate the occupational norm add nothing." },
  { question: "Why didn't supervising a team raise my wage level?", answer: "Because supervision only counts when it is not customary for the occupation. DOL's guidance is explicit that wages for supervisory occupations already account for supervising employees, so managing people inside a management SOC code does not automatically add a point. It is the most commonly misapplied of the four factors." },
  { question: "Can my wage level change without my job changing?", answer: "Yes. The level is tied to your SOC occupation code and your area of employment, so a relocation to a different metropolitan area, or a reclassification into a different SOC code, can produce a different level and a different wage floor for identical duties. The underlying survey data also refreshes annually, which moves the dollar figure at every level." },
  { question: "Does a higher wage level mean a higher salary requirement?", answer: "Yes. Each level maps to a higher percentile of the local wage distribution, so moving from Level I to Level IV raises the prevailing wage the employer must meet." },
  { question: "Which wage level is best for my green card?", answer: "There is no universally 'best' level — it must honestly reflect the job's real requirements. A level that is too low for the actual duties can trigger problems; too high raises the wage the employer must pay. Your attorney sets it based on the position." },
  { question: "Do wage levels apply to both PERM and H-1B?", answer: "Yes, the same four-level framework underlies both, though they are separate filings. PERM uses a formal prevailing wage determination; H-1B uses the wage attested on the LCA. Both key off your SOC code and area of employment." },
  { question: "Where does the wage data come from?", answer: "For most cases, from the OEWS (Occupational Employment and Wage Statistics) survey, matched to your SOC occupation and area. It refreshes annually (about each July). Employers may also use an approved alternative (non-OEWS) survey." },
  { question: "How do I find the exact wage for my level?", answer: "Look it up by SOC occupation code and area of employment at the DOL FLAG wage search. Our prevailing wage calculator estimates your likely level and lets you compare an offer." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    wageArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: WAGE_PUBLISHED, dateModified: WAGE_UPDATED }),
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "DOL Wage Levels Explained", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="dol-wage-levels-explained"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "DOL Wage Levels" },
        ]}
        icon="📶"
        category="Visa & Green Card"
        title="DOL Wage Levels Explained"
        hook="Level I, II, III, IV — what each means, how the level is decided, and how it sets your prevailing wage for PERM and H-1B."
        accent="from-emerald-500 to-teal-600"
        badges={["Level I–IV", "OEWS-based", "PERM & H-1B"]}
        headerExtra={
          <Link href="/prevailing-wage-calculator" className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-700">
            Estimate your wage level →
          </Link>
        }
      >
        {/* levels */}
        <section className="pb-10 pt-6 sm:pb-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <p className="text-sm leading-relaxed text-ink-600">
                Every PERM and H-1B case is tied to a prevailing wage — the local going rate for the job. DOL sets it by matching your SOC occupation and area to survey data, then choosing one of four <strong>wage levels</strong> based on how demanding the role is. Here is what each level means.
              </p>

              <ol className="mt-6 space-y-3">
                {W.levels.map((l) => (
                  <li key={l.level} className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-base font-bold text-ink-900">{l.name}</p>
                      <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700">{l.percentile}</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-ink-600">{l.summary}</p>
                    <ul className="mt-2 space-y-1">
                      {l.signals.map((s) => (
                        <li key={s} className="flex items-start gap-2 text-xs text-ink-500">
                          <span className="mt-0.5 flex-none text-teal-500">•</span>{s}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>

              <div className="mt-8">
                <h2 className="text-xl font-bold text-ink-900">How the level is actually decided</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  This is not a judgement call about how senior someone feels. DOL
                  publishes a worksheet, and it works by addition: every determination
                  <strong> starts at Level I</strong>, and a point is added for each
                  requirement the job imposes <em>above what the occupation itself
                  normally demands</em>. The running total is what produces Level I, II,
                  III or IV.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  The phrase doing the work is &ldquo;above the occupational
                  norm&rdquo;. DOL compares the employer&rsquo;s stated requirements
                  against the baseline for that SOC occupation — including its O*NET
                  Specific Vocational Preparation (SVP) range, which expresses how much
                  preparation the occupation ordinarily takes. A requirement that merely
                  restates the norm earns nothing.
                </p>

                <FactTable
                  caption="The four factors, and what makes each one count"
                  headers={["Factor", "When it adds a point"]}
                  rows={[
                    [
                      "Experience",
                      "When the years of experience required exceed what the occupation normally needs at entry, judged against the SVP range for that SOC code. Two years demanded for a job the occupation expects two years of is not an uplift.",
                    ],
                    [
                      "Education",
                      "When the required education sits above the occupation's normal requirement — typically a master's or doctorate where the occupation ordinarily calls for a bachelor's degree.",
                    ],
                    [
                      "Special skills or other requirements",
                      "When the role demands specific skills, licences or capabilities beyond the occupational baseline. Generic tool lists rarely qualify; a genuine licensure or specialisation requirement can.",
                    ],
                    [
                      "Supervisory duties",
                      "Only when supervision is not customary for the occupation. This is the factor most often applied wrongly: DOL's own guidance notes that wages for supervisory occupations already price in supervising people, so a manager in a management SOC code does not automatically earn a point.",
                    ],
                  ]}
                  highlightRows={[3]}
                  note={
                    <>
                      Add the points to the Level I starting position to get the level.
                      Source:{" "}
                      <a
                        href="https://www.dol.gov/sites/dolgov/files/eta/oflc/pdfs/npwhc_guidance_revised_11_2009.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        DOL ETA Prevailing Wage Determination Policy Guidance
                      </a>{" "}
                      ·{" "}
                      <a href={W.oflcSourceUrl} target="_blank" rel="noopener noreferrer" className="underline">
                        OFLC wage search
                      </a>
                    </>
                  }
                />
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-bold text-ink-900">
                  Why the level is contested in both directions
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  There is no level that is simply &ldquo;better&rdquo;, because the level
                  has to describe the job that actually exists. Both errors are real and
                  they fail differently.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
                    <p className="text-sm font-bold text-ink-900">Too low for the duties</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                      A Level I wage attached to a job description full of independent
                      judgement, architecture decisions or people management is internally
                      inconsistent, and adjudicators read the two together. On H-1B it
                      invites a specialty-occupation challenge — a role paid at entry rates
                      is a role that arguably does not need a degree. On PERM it sits badly
                      with requirements that screened out US applicants.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                    <p className="text-sm font-bold text-ink-900">Too high for the budget</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                      Every point added raises the wage floor the employer is legally bound
                      to pay for the life of the LCA, so an inflated level is a real
                      liability rather than a safety margin. That, not stinginess, is why
                      employers argue about single points.
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink-600">
                  Two practical consequences follow. First, the requirements written into
                  the job description drive the level, so the description is where the
                  wage is really set — long before anyone looks up a number. Second,
                  because the level is tied to your SOC code and area, the same role can
                  land on a different level after a relocation or a reclassification.{" "}
                  <Link href="/prevailing-wage-calculator" className="font-semibold text-brand-600 underline">
                    Estimate the level your requirements imply →
                  </Link>
                </p>
              </div>

              <p className="mt-4 text-xs text-ink-500">{WAGE_DATA_NOTE}</p>
            </div>
          </Container>
        </section>

        {/* internal links */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <PermClusterLinks title="Related wage & PERM tools" links={[...wageClusterLinks.filter((l) => l.href !== PATH), ...wageRelatedLinks]} />
          </Container>
        </section>

        {/* FAQ */}
        <section className="bg-white py-12 sm:py-16">
          <Container>
            <ToolFaq items={faq} />
          </Container>
        </section>

        <section className="pb-12">
          <Container>
            <AuthorReviewLine lastUpdated={WAGE_UPDATED_HUMAN} />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
