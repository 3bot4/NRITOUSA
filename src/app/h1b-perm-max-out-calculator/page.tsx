import type { Metadata } from "next";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import H1bPermMaxOutCalculator from "@/components/tools/H1bPermMaxOutCalculator";
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
  clusterLinks,
  relatedImmigrationLinks,
  webAppJsonLd,
  clusterArticleJsonLd,
  CLUSTER_PUBLISHED,
  CLUSTER_UPDATED,
  CLUSTER_UPDATED_HUMAN,
} from "@/lib/permCluster";

const PATH = "/h1b-perm-max-out-calculator";
const TITLE = "H-1B PERM Max-Out Calculator";
const DESC =
  "Estimate H-1B max-out risk based on PERM, I-140, priority date, and time spent outside the U.S.";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESC,
  path: PATH,
});

const faq: FaqItem[] = [
  { question: "What is H-1B max-out?", answer: "H-1B status is generally limited to six years total. 'Maxing out' means reaching that six-year limit. Beyond six years, you can usually only extend H-1B if your employment-based green card case has reached certain milestones under the AC21 law." },
  { question: "How is the H-1B six-year limit calculated?", answer: "The six years count time you were physically in the U.S. in H-1B (and L-1) status. Time spent outside the U.S. does not count against the limit and can generally be 'recaptured' to add days back. Your first H-1B start date plus six years, adjusted for recaptured days, is your approximate max-out date." },
  { question: "Can time outside the U.S. be recaptured?", answer: "Yes. Days you spent physically outside the United States during your H-1B period can generally be added back to your six-year limit, with documentation such as passport stamps and I-94 travel history. Your attorney calculates the exact recapture amount." },
  { question: "Can PERM help extend H-1B?", answer: "Yes, if timed right. Under AC21 §106(a), a PERM (or I-140) that has been pending for 365+ days before your six-year date generally supports one-year H-1B extensions beyond the limit. Filing early is what preserves this option." },
  { question: "Can an approved I-140 help extend H-1B?", answer: "Yes. An approved I-140 generally supports three-year H-1B extensions beyond six years when your priority date is not yet current (AC21 §104(c)/§106(c)). This is the stronger extension track, which is why getting the I-140 approved matters for backlogged applicants." },
  { question: "What if my PERM is filed late?", answer: "If PERM is not filed at least 365 days before your six-year date and you don't have an approved I-140, you may not qualify for an extension beyond six years — a high-risk situation. Recapturing time outside the U.S. can buy some room. Talk to your employer's attorney urgently." },
  { question: "What if my priority date is current?", answer: "If your priority date is current, the three-year extension rule (which depends on the date not being current) may not apply — but you should instead be able to move toward filing or approving I-485. The right path depends on your exact stage; confirm with your attorney." },
  { question: "Is this calculator legal advice?", answer: "No. This calculator is for educational planning only and is not legal advice. AC21 extension rules are highly case-specific. Ask your immigration attorney/employer about whether AC21-style extensions may apply in your case." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    webAppJsonLd({ path: PATH, name: TITLE, description: DESC }),
    clusterArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: CLUSTER_PUBLISHED, dateModified: CLUSTER_UPDATED }),
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "H-1B PERM Max-Out Calculator", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="h1b-perm-max-out-calculator"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "H-1B PERM Max-Out" },
        ]}
        icon="⏰"
        category="Visa & Green Card"
        title={TITLE}
        hook="Estimate your six-year H-1B max-out date and whether your PERM/I-140 milestones can unlock an extension beyond it."
        accent="from-orange-600 to-amber-500"
        disclaimerExtra={
          <p>
            This calculator is for educational planning only and is not legal advice. Ask your immigration attorney/employer about whether AC21-style extensions may apply in your case.
          </p>
        }
      >
        {/* calculator */}
        <section className="pb-12 pt-6 sm:pb-16">
          <Container>
            <div className="mx-auto max-w-3xl">
              <H1bPermMaxOutCalculator />
            </div>
          </Container>
        </section>

        {/* Explainer */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-5">
              <div>
                <h2 className="text-xl font-bold text-ink-900">How the six-year H-1B limit works</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  H-1B status is capped at six years. Only time physically spent in the U.S. in H-1B (and L-1) status counts, so trips abroad can be recaptured to extend the limit. Two AC21 rules let you go beyond six years: a PERM or I-140 <strong>pending 365+ days</strong> supports one-year extensions, and an <strong>approved I-140</strong> with a non-current priority date supports three-year extensions. For India applicants stuck in the Visa Bulletin backlog, the approved I-140 is what keeps H-1B renewable for years.
                </p>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 text-sm leading-relaxed text-amber-900">
                <strong className="font-bold">Important:</strong> Do not treat this as legal advice. Extension eligibility, recapture calculations, and timing are case-specific. Ask your immigration attorney/employer about whether AC21-style extensions may apply in your case.
              </div>
            </div>
          </Container>
        </section>

        {/* Internal links */}
        <section className="py-10 sm:py-12">
          <Container>
            <PermClusterLinks links={[...clusterLinks.filter((l) => l.href !== PATH), ...relatedImmigrationLinks]} />
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
            <AuthorReviewLine lastUpdated={CLUSTER_UPDATED_HUMAN} />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
