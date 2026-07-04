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
  eadClusterLinks,
  eadRelatedLinks,
  eadArticleJsonLd,
  EAD_PUBLISHED,
  EAD_UPDATED,
  EAD_UPDATED_HUMAN,
} from "@/lib/eadCluster";
import { eadProcessingData as D, EAD_DATA_NOTE } from "@/data/eadProcessingData";

const PATH = "/ead-renewal-gap";
const TITLE = "EAD Renewal Gap 2026: Avoid Losing Work Authorization";
const DESC =
  "How to avoid a gap in work authorization when renewing your EAD — filing windows, the automatic extension, and what employers need.";

export const metadata: Metadata = pageMetadata({
  title: "EAD Renewal Gap: How to Avoid It",
  description: DESC,
  path: PATH,
});

const faq: FaqItem[] = [
  { question: "What is an EAD renewal gap?", answer: "A gap is any period where your prior EAD has expired and your renewal is not yet approved (and no automatic extension applies), so you are not authorized to work. Employers must stop employment until authorization is restored — which is why avoiding the gap matters." },
  { question: "How early can I file my EAD renewal?", answer: "USCIS generally allows filing a renewal up to 180 days before your current EAD expires. Filing as early as allowed is the single best way to avoid a gap." },
  { question: "How does the automatic extension prevent a gap?", answer: "For eligible categories, a timely-filed renewal automatically extends your work authorization — currently up to 540 days past the card's expiry — while USCIS processes it. You keep working using your receipt notice plus the expired card. Always verify the current length and your category on USCIS." },
  { question: "Which categories do NOT get the automatic extension?", answer: "Some categories, notably F-1 OPT and STEM OPT, do not receive the automatic extension. For those, an approval delay can create a real gap, so file early and track the case closely." },
  { question: "What documents does my employer need during the extension?", answer: "For Form I-9 reverification, employers generally accept your expired EAD together with the Form I-797C receipt notice showing a timely-filed renewal in an eligible category (and, for some categories, proof of status). Confirm specifics with your attorney/HR." },
  { question: "What if my EAD already expired and I have no auto-extension?", answer: "Stop and confirm your work authorization with your employer and immigration attorney immediately. Working without authorization has serious consequences. Depending on your category, you may need to pause work until the renewal is approved." },
  { question: "Can premium processing help avoid a gap?", answer: "For F-1 OPT and STEM OPT categories, premium processing (about 30 business days) can speed the decision and reduce gap risk. It is not available for most other categories. Verify eligibility on the USCIS Form I-907 page." },
  { question: "Is this page legal advice?", answer: "No. This page is educational only and not legal advice. Work-authorization timing is high-stakes and case-specific — confirm your filing window and status with your immigration attorney." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    eadArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: EAD_PUBLISHED, dateModified: EAD_UPDATED }),
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "EAD Renewal Gap", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="ead-renewal-gap"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "EAD Renewal Gap" },
        ]}
        icon="⚠️"
        category="Visa & Green Card"
        title="EAD Renewal Gap: How to Avoid It"
        hook="Filing windows, the automatic extension, and what employers need — so your work authorization never lapses."
        accent="from-amber-500 to-orange-600"
        badges={["File 180 days early", "Auto-extension", "I-9 reverification"]}
        headerExtra={
          <Link href="/ead-processing-time" className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-cyan-700">
            Estimate your EAD timeline →
          </Link>
        }
      >
        <section className="pb-10 pt-6 sm:pb-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-ink-900">Two ways to avoid a gap</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                    <p className="text-sm font-bold text-ink-900">1. File early</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-600">File your renewal as early as USCIS allows — often up to 180 days before your current EAD expires. This is the most reliable protection regardless of category.</p>
                  </div>
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-card">
                    <p className="text-sm font-bold text-ink-900">2. Automatic extension</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-600">Eligible categories get up to {D.autoExtensionDays} days of automatic extension on a timely-filed renewal — you keep working on your receipt notice plus the expired card. Verify the current rule on USCIS.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
                <h3 className="text-base font-bold text-ink-900">Categories without the automatic extension</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  Not every category is covered — F-1 OPT and STEM OPT, for example, do not get the automatic extension, so a processing delay can create a genuine work-authorization gap. If that is you, file early, track the case, and ask about premium processing (available for OPT/STEM).
                </p>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                <h3 className="text-base font-bold text-ink-900">What your employer needs (Form I-9)</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  During an automatic extension, employers generally reverify using your expired EAD plus the Form I-797C receipt notice for the timely-filed renewal in an eligible category. Keep both handy and give HR a heads-up before your card&rsquo;s printed expiry date.
                </p>
              </div>

              <p className="text-xs text-ink-500">{EAD_DATA_NOTE}</p>
            </div>
          </Container>
        </section>

        {/* internal links */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <PermClusterLinks title="Related EAD tools" links={[...eadClusterLinks.filter((l) => l.href !== PATH), ...eadRelatedLinks]} />
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
            <AuthorReviewLine lastUpdated={EAD_UPDATED_HUMAN} />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
