import type { Metadata } from "next";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import EadProcessingCalculator from "@/components/tools/EadProcessingCalculator";
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
  eadClusterLinks,
  eadRelatedLinks,
  eadWebAppJsonLd,
  eadArticleJsonLd,
  EAD_PUBLISHED,
  EAD_UPDATED,
  EAD_UPDATED_HUMAN,
} from "@/lib/eadCluster";
import { eadProcessingData as D, EAD_DATA_NOTE, eadSnapshotRows, eadSnapshotSources, EAD_ESTIMATE_VERIFIED, EAD_ESTIMATE_DISCLAIMER } from "@/data/eadProcessingData";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";

const PATH = "/ead-processing-time";
const TITLE = "EAD Processing Time 2026: Work Permit Timeline & Auto-Extension";
const DESC =
  "Estimate your EAD (Form I-765) processing time by category, check automatic-extension eligibility, and avoid a work-authorization gap.";

export const metadata: Metadata = pageMetadata({
  title: "EAD Processing Time 2026",
  description: DESC,
  path: PATH,
});

const faq: FaqItem[] = [
  { question: "How long does an EAD take?", answer: "It depends heavily on the category (the eligibility code) and the service center. Many categories currently run several months. Check the official USCIS processing-times dashboard for your exact form category and office, and use this tool for a planning estimate." },
  { question: "What is the automatic EAD extension?", answer: "For certain categories, if you file a renewal on time before your current EAD expires, your work authorization is automatically extended while USCIS processes the renewal. USCIS increased this automatic extension to up to 540 days for eligible categories — always verify the current figure and your category on the official USCIS page." },
  { question: "Which EAD categories get the automatic extension?", answer: "Common eligible renewal categories include pending adjustment of status (c)(9), H-4 (c)(26), L-2 (a)(18), and pending asylum (c)(8). Some categories — like F-1 OPT and STEM OPT — do not get the automatic extension. Confirm your category on USCIS." },
  { question: "How do I prove work authorization during the automatic extension?", answer: "You generally show your expired EAD card together with your Form I-797C receipt notice for the timely-filed renewal (and, for some categories, additional status documents). Your employer uses these for Form I-9 reverification." },
  { question: "Can F-1 OPT or STEM OPT EAD be premium processed?", answer: "Yes — premium processing (about 30 business days) is available for many F-1 OPT and STEM OPT I-765 requests. It is not available for most other EAD categories. Verify current eligibility and fees on the USCIS Form I-907 page." },
  { question: "When can I file my EAD renewal?", answer: "USCIS generally lets you file a renewal up to 180 days before your current EAD expires. Filing as early as allowed reduces the risk of a work-authorization gap, especially in categories without the automatic extension." },
  { question: "What is the difference between EAD and Advance Parole?", answer: "An EAD (Form I-765) authorizes you to work; Advance Parole (Form I-131) lets you travel and return while an application like I-485 is pending. Adjustment applicants often file them together and may receive a combo card." },
  { question: "Is this calculator legal advice?", answer: "No. This calculator is for educational planning only and is not legal advice. Processing times are estimates that change. Always confirm your category, timing, and work authorization with your immigration attorney." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    eadWebAppJsonLd({ path: PATH, name: TITLE, description: DESC }),
    eadArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: EAD_PUBLISHED, dateModified: EAD_UPDATED }),
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "EAD Processing Time", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="ead-processing-time"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "EAD Processing Time" },
        ]}
        icon="🪪"
        category="Visa & Green Card"
        title="EAD Processing Time 2026"
        hook="Estimate your EAD (Form I-765) timeline by category, check automatic-extension eligibility, and avoid a work-authorization gap."
        accent="from-cyan-500 to-teal-600"
        headerExtra={
          <a href="#calculator" className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-cyan-700">
            Estimate My EAD Timeline →
          </a>
        }
        sourceNote={<>{EAD_DATA_NOTE}</>}
        disclaimerExtra={<p>This calculator is for educational planning only and is not legal advice. Always confirm your work authorization with your immigration attorney.</p>}
      >
        {/* Fast Answer: EAD/AP timing */}
        <section className="pt-6">
          <Container>
            <FastAnswerSnapshot
              title="EAD & Advance Parole — how long?"
              accent="emerald"
              rows={eadSnapshotRows}
              badges={["Most EAD 3–8 mo", "AP 4–9 mo"]}
              lastVerified={EAD_ESTIMATE_VERIFIED}
              sources={eadSnapshotSources}
              disclaimer={EAD_ESTIMATE_DISCLAIMER}
              ctaText="Estimate my EAD timeline"
              ctaHref="#ead-tool"
            />
          </Container>
        </section>

        <section id="ead-tool" className="scroll-mt-24 pb-12 pt-10 sm:pb-16">
          <Container>
            <div className="mx-auto max-w-3xl">
              <EadProcessingCalculator />
            </div>
          </Container>
        </section>

        {/* category reference */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">EAD by category</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                General planning ranges and automatic-extension eligibility by common category. Ranges are estimates — verify your exact category on USCIS.
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-ink-900/10 text-xs uppercase tracking-wide text-ink-500">
                      <th className="py-2 pr-3">Category</th>
                      <th className="py-2 pr-3">Code</th>
                      <th className="py-2 pr-3">Planning range</th>
                      <th className="py-2">Auto-extension</th>
                    </tr>
                  </thead>
                  <tbody>
                    {D.categories.filter((c) => c.key !== "other").map((c) => (
                      <tr key={c.key} className="border-b border-ink-900/5">
                        <td className="py-2 pr-3 font-medium text-ink-800">{c.label}</td>
                        <td className="py-2 pr-3 text-ink-500">{c.code}</td>
                        <td className="py-2 pr-3 text-ink-700">~{c.monthsLow}–{c.monthsHigh} mo</td>
                        <td className="py-2">
                          {c.autoExtension
                            ? <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">Up to {D.autoExtensionDays} days</span>
                            : <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">None</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-xs text-ink-500">{EAD_DATA_NOTE}</p>
            </div>
          </Container>
        </section>

        {/* internal links */}
        <section className="py-10 sm:py-12">
          <Container>
            <PermClusterLinks title="Related EAD & green card tools" links={[...eadClusterLinks.filter((l) => l.href !== PATH), ...eadRelatedLinks]} />
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
            <AuthorReviewLine lastUpdated={EAD_UPDATED_HUMAN} />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
