import type { Metadata } from "next";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import I485ProcessingCalculator from "@/components/tools/I485ProcessingCalculator";
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
  i485ClusterLinks,
  i485RelatedLinks,
  i485WebAppJsonLd,
  i485ArticleJsonLd,
  I485_PUBLISHED,
  I485_UPDATED,
  I485_UPDATED_HUMAN,
} from "@/lib/i485Cluster";
import { I485_DATA_NOTE } from "@/data/i485ProcessingData";

const PATH = "/i485-processing-time";
const TITLE = "I-485 Processing Time 2026: Adjustment of Status Timeline";
const DESC =
  "Check if you can file I-485 yet and estimate the adjustment-of-status processing time, interview timing, and EAD/AP.";

export const metadata: Metadata = pageMetadata({
  title: "I-485 Processing Time 2026",
  description: DESC,
  path: PATH,
});

const faq: FaqItem[] = [
  { question: "How long does I-485 take?", answer: "After filing, I-485 (adjustment of status) commonly takes several months to about two years, and longer if a field-office interview is required. Times vary a lot by office — check the current USCIS I-485 processing times for your service center." },
  { question: "When can I file I-485?", answer: "You can file I-485 only when your priority date is current under the chart USCIS is honoring that month (Final Action Date, or Dates for Filing if authorized). For India EB-2/EB-3, this usually means a multi-year wait after I-140 approval." },
  { question: "Can I file EAD and Advance Parole with I-485?", answer: "Yes. Applicants usually file Form I-765 (EAD) and Form I-131 (Advance Parole) concurrently with I-485. These typically arrive months before the green card and let you work and travel while the I-485 is pending." },
  { question: "Do I need an interview for I-485?", answer: "Many employment-based I-485 cases are waived from interview, but USCIS can require a field-office interview. If required, plan for additional processing time. Your attorney can gauge the likelihood for your office." },
  { question: "What is the difference between I-485 and consular processing?", answer: "I-485 (adjustment of status) is for applicants already in the U.S. and lets you stay while it processes. Consular processing is done at a U.S. consulate abroad. Which one applies depends on where you are and your situation." },
  { question: "What happens after I file I-485?", answer: "USCIS issues a receipt, takes biometrics, may issue EAD/AP, may request evidence (RFE) or an interview, and then decides. When approved, your green card is produced and mailed. Keep every notice." },
  { question: "Does premium processing exist for I-485?", answer: "No. There is no premium processing for I-485. The timeline depends on your field office, whether an interview is required, and visa number availability." },
  { question: "Can my priority date retrogress after I file I-485?", answer: "Yes. Even after filing, a Final Action Date can retrogress, which can delay final approval until a visa number is again available. Your filed I-485 (and EAD/AP) generally remains pending in the meantime." },
  { question: "Is this calculator legal advice?", answer: "No. This calculator is for educational planning only and is not legal advice. Filing eligibility and timelines are case-specific — confirm with your immigration attorney and the official Visa Bulletin." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    i485WebAppJsonLd({ path: PATH, name: TITLE, description: DESC }),
    i485ArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: I485_PUBLISHED, dateModified: I485_UPDATED }),
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "I-485 Processing Time", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="i485-processing-time"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "I-485 Processing Time" },
        ]}
        icon="🟢"
        category="Visa & Green Card"
        title="I-485 Processing Time 2026"
        hook="Check if you can file I-485 yet and estimate the adjustment-of-status timeline, interview timing, and EAD/AP."
        accent="from-emerald-600 to-teal-600"
        headerExtra={
          <a href="#calculator" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700">
            Check My I-485 Timeline →
          </a>
        }
        sourceNote={<>{I485_DATA_NOTE}</>}
        disclaimerExtra={<p>This calculator is for educational planning only and is not legal advice. Always confirm your case with your immigration attorney.</p>}
      >
        <section className="pb-12 pt-6 sm:pb-16">
          <Container>
            <div className="mx-auto max-w-3xl">
              <I485ProcessingCalculator />
            </div>
          </Container>
        </section>

        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">The two waits, for India applicants</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5 shadow-card">
                  <p className="text-sm font-bold text-ink-900">1. The wait to file (the big one)</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-600">For India EB-2/EB-3, the dominant wait is the Visa Bulletin priority-date backlog before you can even file I-485 — often years after I-140 approval.</p>
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-card">
                  <p className="text-sm font-bold text-ink-900">2. The wait to adjudicate</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-600">Once filed, USCIS adjudication is a general planning range of months to ~2 years, longer if an interview is required. This is the smaller of the two waits.</p>
                </div>
              </div>
              <p className="mt-4 text-xs text-ink-500">{I485_DATA_NOTE}</p>
            </div>
          </Container>
        </section>

        <section className="py-10 sm:py-12">
          <Container>
            <PermClusterLinks title="Related green card tools" links={[...i485ClusterLinks.filter((l) => l.href !== PATH), ...i485RelatedLinks]} />
          </Container>
        </section>

        <section className="border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <ToolFaq items={faq} />
          </Container>
        </section>

        <section className="pb-12">
          <Container>
            <AuthorReviewLine lastUpdated={I485_UPDATED_HUMAN} />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
