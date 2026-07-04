import type { Metadata } from "next";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import PrevailingWageCalculator from "@/components/tools/PrevailingWageCalculator";
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
  wageWebAppJsonLd,
  wageArticleJsonLd,
  WAGE_PUBLISHED,
  WAGE_UPDATED,
  WAGE_UPDATED_HUMAN,
} from "@/lib/wageCluster";
import { prevailingWageData as W, WAGE_DATA_NOTE } from "@/data/prevailingWageData";

const PATH = "/prevailing-wage-calculator";
const TITLE = "Prevailing Wage Calculator 2026: DOL Wage Level Estimator";
const DESC =
  "Estimate your DOL wage level (I–IV) and check whether an offered wage meets the prevailing wage for PERM or H-1B.";

export const metadata: Metadata = pageMetadata({
  title: "Prevailing Wage Calculator 2026",
  description: DESC,
  path: PATH,
});

const faq: FaqItem[] = [
  { question: "What is a prevailing wage?", answer: "The prevailing wage is the minimum wage the U.S. Department of Labor says an employer must pay for a specific job in a specific area. It protects U.S. workers by ensuring foreign workers aren't hired below the local going rate. It applies to PERM green card cases and H-1B (and related) petitions." },
  { question: "How is the prevailing wage determined?", answer: "For most cases DOL uses the OEWS (Occupational Employment and Wage Statistics) survey, matched to your SOC occupation code and the area of intended employment, then assigns one of four wage levels based on the job's requirements. Employers can also use an approved alternative survey (non-OEWS)." },
  { question: "What are the four DOL wage levels?", answer: "Level I (entry, ~17th percentile), Level II (qualified, ~34th), Level III (experienced, ~50th/median), and Level IV (fully competent/senior, ~67th). Higher requirements — experience, advanced degrees, supervision, independent judgment — push the level and the required wage up." },
  { question: "How do I find my exact prevailing wage?", answer: "Look it up by SOC occupation code and area of employment at the DOL FLAG wage search (flag.dol.gov/wage-data/wage-search). This tool estimates your likely level and checks an offer, but the official figure comes from that lookup." },
  { question: "Does my employer have to pay the prevailing wage?", answer: "Your employer must pay at least the required wage, which is the higher of the prevailing wage and the employer's actual wage paid to similar workers. Paying below the required wage can jeopardize the PERM or H-1B case." },
  { question: "What happens if my offered wage is below the prevailing wage?", answer: "The case generally cannot proceed at that wage — the employer must raise the offered wage to at least the prevailing wage (or the actual wage, whichever is higher). If you see a shortfall, raise it with your employer's immigration attorney before filing." },
  { question: "Is the wage level the same for PERM and H-1B?", answer: "The four-level framework is the same, but they are separate filings. The PERM prevailing wage comes from a formal prevailing wage determination (PWD); the H-1B uses the prevailing wage attested on the LCA. The SOC code and area drive both." },
  { question: "How often does prevailing wage data change?", answer: "The OEWS wage data DOL uses refreshes annually, typically each July. Your exact figure can change when the new vintage is released, so verify at the official source before relying on a number." },
  { question: "Is this calculator legal advice?", answer: "No. This calculator is for educational planning only and is not legal advice. It does not issue an official wage level or prevailing wage. Always confirm your case with your employer's immigration attorney." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    wageWebAppJsonLd({ path: PATH, name: TITLE, description: DESC }),
    wageArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: WAGE_PUBLISHED, dateModified: WAGE_UPDATED }),
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "Prevailing Wage Calculator", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="prevailing-wage-calculator"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "Prevailing Wage Calculator" },
        ]}
        icon="💵"
        category="Visa & Green Card"
        title="Prevailing Wage Calculator 2026"
        hook="Estimate your DOL wage level (I–IV) and check whether an offered wage meets the prevailing wage for PERM or H-1B."
        accent="from-teal-500 to-emerald-600"
        headerExtra={
          <a href="#calculator" className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-700">
            Estimate My Wage Level →
          </a>
        }
        sourceNote={<>Wage figures come from your SOC + area on DOL FLAG. {WAGE_DATA_NOTE}</>}
        disclaimerExtra={
          <p>This calculator is for educational planning only and is not legal advice. Always confirm your wage level and prevailing wage with your employer&rsquo;s immigration attorney.</p>
        }
      >
        {/* calculator */}
        <section className="pb-12 pt-6 sm:pb-16">
          <Container>
            <div className="mx-auto max-w-3xl">
              <PrevailingWageCalculator />
            </div>
          </Container>
        </section>

        {/* wage levels reference */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">The four DOL wage levels</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                DOL assigns one of four levels based on the job&rsquo;s requirements. Each maps to a percentile of the local wage distribution for your occupation.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {W.levels.map((l) => (
                  <div key={l.level} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <p className="text-sm font-bold text-ink-900">{l.name}</p>
                    <p className="text-xs text-teal-700">{l.percentile}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-600">{l.summary}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-ink-500">{WAGE_DATA_NOTE}</p>
            </div>
          </Container>
        </section>

        {/* internal links */}
        <section className="py-10 sm:py-12">
          <Container>
            <PermClusterLinks title="Related wage & PERM tools" links={[...wageClusterLinks.filter((l) => l.href !== PATH), ...wageRelatedLinks]} />
          </Container>
        </section>

        {/* FAQ */}
        <section className="border-t border-ink-900/5 bg-white py-12 sm:py-16">
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
