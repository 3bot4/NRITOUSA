import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
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
  { question: "How is my wage level decided?", answer: "The employer/attorney uses DOL's worksheet, starting at Level I and adding points for requirements above the occupational baseline — extra experience, an advanced degree requirement, special skills, and supervisory duties. The total maps to Level I, II, III, or IV." },
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

              <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                <h2 className="text-base font-bold text-ink-900">How the level is decided</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  The employer&rsquo;s attorney starts at Level I and adds points for requirements above the occupation&rsquo;s normal baseline — extra experience, an advanced-degree requirement, special skills, and supervisory duties. The total maps to Level I–IV. The level must honestly reflect the real job; setting it too low for the actual duties can cause problems, while a higher level raises the wage the employer must pay.
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
