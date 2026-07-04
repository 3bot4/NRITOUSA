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
import { WAGE_DATA_NOTE } from "@/data/prevailingWageData";

const PATH = "/h1b-prevailing-wage";
const TITLE = "H-1B Prevailing Wage 2026: How the Required Wage Works";
const DESC =
  "How the H-1B prevailing wage and required wage work, where the LCA wage comes from, and how wage levels affect your salary.";

export const metadata: Metadata = pageMetadata({
  title: "H-1B Prevailing Wage 2026",
  description: DESC,
  path: PATH,
});

const faq: FaqItem[] = [
  { question: "What is the H-1B prevailing wage?", answer: "It is the minimum wage DOL says an employer must pay for your job in your work location. For H-1B, the employer attests to it on the Labor Condition Application (LCA / ETA-9035) and must actually pay at least the required wage." },
  { question: "What is the difference between prevailing wage and required wage?", answer: "The prevailing wage is the local going rate DOL sets. The required wage — what your employer must actually pay — is the higher of the prevailing wage and the employer's actual wage paid to similar workers. You must be paid at least the required wage." },
  { question: "Where does the H-1B wage come from?", answer: "From your SOC occupation code and area of employment, usually via the OEWS survey, sorted into one of four wage levels. The employer lists the prevailing wage and its source on the LCA." },
  { question: "Do H-1B wage levels matter?", answer: "Yes. The wage level (I–IV) sets which percentile of the local wage distribution applies, which directly changes the minimum salary. A more senior role with more requirements maps to a higher level and a higher wage floor." },
  { question: "Can my employer pay me below the prevailing wage?", answer: "No. Paying below the required wage violates H-1B rules and can lead to penalties and jeopardize the petition. If your pay is below the LCA wage, raise it with your employer and immigration attorney." },
  { question: "Is the H-1B prevailing wage the same as the PERM prevailing wage?", answer: "They use the same four-level framework and the same SOC + area basis, but they are separate steps. PERM uses a formal prevailing wage determination (PWD); H-1B uses the wage attested on the LCA. The figures can differ if filed at different times or levels." },
  { question: "How often does the H-1B prevailing wage change?", answer: "The underlying OEWS wage data refreshes annually, typically each July. Your figure can change with the new vintage, so verify the current number at the official DOL source." },
  { question: "How do I check my H-1B prevailing wage?", answer: "Look it up by SOC code and area at the DOL FLAG wage search, and compare it to your offer with our prevailing wage calculator. Confirm the level and figure with your employer's immigration attorney." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    wageArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: WAGE_PUBLISHED, dateModified: WAGE_UPDATED }),
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "H-1B Prevailing Wage", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="h1b-prevailing-wage"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "H-1B Prevailing Wage" },
        ]}
        icon="💼"
        category="Visa & Green Card"
        title="H-1B Prevailing Wage"
        hook="How the H-1B prevailing wage and required wage work, where the LCA wage comes from, and how wage levels affect your salary."
        accent="from-violet-500 to-purple-600"
        badges={["LCA / ETA-9035", "Wage Level I–IV", "For H-1B workers"]}
        headerExtra={
          <Link href="/prevailing-wage-calculator" className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-700">
            Check your wage level →
          </Link>
        }
      >
        <section className="pb-10 pt-6 sm:pb-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-ink-900">What the H-1B prevailing wage is</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  Every H-1B petition rests on a Labor Condition Application (LCA, Form ETA-9035) in which the employer attests it will pay at least the required wage for your role and location. That floor is built from the <strong>prevailing wage</strong> — the local going rate DOL derives from your SOC occupation and area — combined with a <strong>wage level</strong> (I–IV) reflecting the job&rsquo;s requirements.
                </p>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                <h3 className="text-base font-bold text-ink-900">Prevailing wage vs required wage</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  These are not the same. The <strong>required wage</strong> your employer must actually pay is the <em>higher</em> of the prevailing wage and the employer&rsquo;s actual wage paid to similar workers. So even if the prevailing wage is lower, you must still be paid at least what comparable employees earn.
                </p>
              </div>

              <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                <h3 className="text-base font-bold text-ink-900">How wage levels change your salary floor</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  Level I fits entry roles (~17th percentile); Level IV fits senior roles (~67th percentile). The more experience, education, judgment, and supervision a role requires, the higher the level — and the higher your minimum wage. See{" "}
                  <Link href="/dol-wage-levels-explained" className="text-brand-600 underline">DOL wage levels explained</Link>{" "}
                  for the full breakdown.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5">
                <h3 className="text-base font-bold text-ink-900">If your pay looks low</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  If your salary is below the LCA wage for your SOC and area, that is a compliance problem — raise it with your employer and immigration attorney. Look up your figure at the DOL wage search and compare it with our{" "}
                  <Link href="/prevailing-wage-calculator" className="text-brand-600 underline">prevailing wage calculator</Link>.
                </p>
              </div>

              <p className="text-xs text-ink-500">{WAGE_DATA_NOTE}</p>
            </div>
          </Container>
        </section>

        {/* internal links */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <PermClusterLinks title="Related wage & H-1B tools" links={[...wageClusterLinks.filter((l) => l.href !== PATH), ...wageRelatedLinks]} />
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
