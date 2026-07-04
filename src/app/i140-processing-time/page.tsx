import type { Metadata } from "next";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import I140ProcessingCalculator from "@/components/tools/I140ProcessingCalculator";
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
  i140ClusterLinks,
  i140RelatedLinks,
  i140WebAppJsonLd,
  i140ArticleJsonLd,
  I140_PUBLISHED,
  I140_UPDATED,
  I140_UPDATED_HUMAN,
} from "@/lib/i140Cluster";
import { I140_DATA_NOTE, i140SnapshotRows, i140SnapshotSources, I140_ESTIMATE_VERIFIED, I140_ESTIMATE_DISCLAIMER } from "@/data/i140ProcessingData";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";

const PATH = "/i140-processing-time";
const TITLE = "I-140 Processing Time 2026: Standard vs Premium";
const DESC =
  "Estimate your I-140 decision window — standard vs premium processing (15 business days), the fee, and what happens after approval.";

export const metadata: Metadata = pageMetadata({
  title: "I-140 Processing Time 2026",
  description: DESC,
  path: PATH,
});

const faq: FaqItem[] = [
  { question: "How long does I-140 take?", answer: "With premium processing, USCIS acts on most I-140 petitions within about 15 business days (about 45 business days for EB-1C and EB-2 NIW). Without premium processing, standard times commonly run several months and vary by service center — check the current USCIS I-140 processing times." },
  { question: "What is I-140 premium processing?", answer: "Premium processing (Form I-907) is a paid service that guarantees USCIS will act on your petition within a set number of business days. 'Act' means approve, deny, or issue an RFE — not necessarily approve. It speeds USCIS action, not Visa Bulletin movement." },
  { question: "How much does I-140 premium processing cost?", answer: "The current USCIS premium processing fee for I-140 is shown on this page from our maintained fee data; always verify the exact amount on the official USCIS Form I-907 page before filing, as fees change." },
  { question: "Can every I-140 use premium processing?", answer: "Premium processing is available for most EB-1A, EB-1C, EB-2, EB-2 NIW, and EB-3 I-140 petitions. Eligibility and timelines can change, so confirm current availability on the USCIS I-907 page." },
  { question: "Does premium processing improve my chances of approval?", answer: "No. Premium processing only speeds up how fast USCIS acts. It does not increase approval odds or move your priority date. A weak case will be decided faster, not more favorably." },
  { question: "What happens if I get an RFE?", answer: "If USCIS issues a Request for Evidence, the premium processing clock pauses until you respond. Work with your attorney to respond fully and on time; the clock restarts when USCIS receives your response." },
  { question: "Does I-140 approval mean I get a green card?", answer: "No. I-140 approval establishes your eligibility and locks in your priority date, but you still need a current priority date in the Visa Bulletin before filing I-485. For India EB-2/EB-3, that wait is often years." },
  { question: "Can I upgrade a pending I-140 to premium processing?", answer: "Yes, in most cases you can add premium processing to a pending I-140 by filing Form I-907. Confirm eligibility and current timelines with your attorney." },
  { question: "Is this calculator legal advice?", answer: "No. This calculator is for educational planning only and is not legal advice. Estimates use general planning ranges and USCIS premium-processing SLAs. Always confirm your case with your employer's immigration attorney." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    i140WebAppJsonLd({ path: PATH, name: TITLE, description: DESC }),
    i140ArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: I140_PUBLISHED, dateModified: I140_UPDATED }),
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "I-140 Processing Time", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="i140-processing-time"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "I-140 Processing Time" },
        ]}
        icon="📄"
        category="Visa & Green Card"
        title="I-140 Processing Time 2026"
        hook="Estimate your I-140 decision window — standard vs premium processing, the fee, and what happens after approval."
        accent="from-indigo-600 to-violet-600"
        headerExtra={
          <a href="#calculator" className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-700">
            Estimate My I-140 Timeline →
          </a>
        }
        sourceNote={<>{I140_DATA_NOTE}</>}
        disclaimerExtra={<p>This calculator is for educational planning only and is not legal advice. Always confirm your case with your employer&rsquo;s immigration attorney.</p>}
      >
        {/* Fast Answer: I-140 timing & fees */}
        <section className="pt-6">
          <Container>
            <FastAnswerSnapshot
              title="I-140 processing time & fees"
              accent="brand"
              rows={i140SnapshotRows}
              badges={["Premium 15 business days", "Fee $715 + $2,965 premium"]}
              lastVerified={I140_ESTIMATE_VERIFIED}
              sources={i140SnapshotSources}
              disclaimer={I140_ESTIMATE_DISCLAIMER}
              ctaText="Estimate my I-140 timeline"
              ctaHref="#i140-tool"
            />
          </Container>
        </section>

        <section id="i140-tool" className="scroll-mt-24 pb-12 pt-10 sm:pb-16">
          <Container>
            <div className="mx-auto max-w-3xl">
              <I140ProcessingCalculator />
            </div>
          </Container>
        </section>

        {/* Standard vs premium explainer */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Standard vs premium processing</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                  <p className="text-sm font-bold text-ink-900">Standard processing</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-600">No extra fee. Takes several months and varies by service center. Fine when you are not up against an H-1B max-out or an approaching priority date.</p>
                </div>
                <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-5 shadow-card">
                  <p className="text-sm font-bold text-ink-900">Premium processing (Form I-907)</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-600">Paid service. USCIS acts within ~15 business days (~45 for EB-1C / EB-2 NIW). Best when timing matters — but it speeds action, not approval or Visa Bulletin movement.</p>
                </div>
              </div>
              <p className="mt-4 text-xs text-ink-500">{I140_DATA_NOTE}</p>
            </div>
          </Container>
        </section>

        {/* internal links */}
        <section className="py-10 sm:py-12">
          <Container>
            <PermClusterLinks title="Related I-140 & green card tools" links={[...i140ClusterLinks.filter((l) => l.href !== PATH), ...i140RelatedLinks]} />
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
            <AuthorReviewLine lastUpdated={I140_UPDATED_HUMAN} />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
