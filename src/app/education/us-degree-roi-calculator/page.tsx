import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import DegreeRoiCalc from "@/components/education/DegreeRoiCalc";
import ShareWithTagline from "@/components/education/ShareWithTagline";
import {
  FactTable,
  MythRealityTable,
  PolicyCallout,
} from "@/components/education/FactTable";
import {
  getStudentPage,
  getShareCopy,
  getRelated,
  STUDENT_LAST_REVIEWED,
} from "@/lib/studentCluster";
import {
  careerCapitalPoints,
  globalMobilityFacts,
  h1bProclamationFee,
  mythVsRealityFacts,
  optProposedFee,
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

const page = getStudentPage("us-degree-roi-calculator")!;
const share = getShareCopy("us-degree-roi-calculator");
const related = getRelated("us-degree-roi-calculator");

export const metadata: Metadata = {
  ...pageMetadata({
    title: page.seoTitle,
    description: page.seoDescription,
    path: page.path,
  }),
  keywords: [
    "is a masters in usa worth it",
    "us degree roi calculator",
    "ms in usa return on investment",
    "study in usa worth it 2026",
    "h1b sponsorship odds",
    "us degree value india",
  ],
};

const faq: FaqItem[] = [
  {
    question: "Is a US master's degree still worth it in 2026?",
    answer:
      "It depends far more on your own numbers than on the headlines. The two inputs that move the answer most are the total cost including loan interest, and your realistic odds of getting sponsored. A $50,000 programme with strong sponsorship odds and a $110,000 starting salary is a very different proposition from a $180,000 programme with weak odds. The calculator above lets you set both honestly rather than accepting someone else's assumption. What the money model cannot capture is the credential itself, which is why there is a separate career-capital section.",
  },
  {
    question: "Does the $100,000 H-1B fee mean nobody will hire international students?",
    answer: `No, and the premise is out of date. ${h1bProclamationFee.statusLine} It also never applied to students already in the US changing status from F-1 to H-1B, and where it did apply it fell on the employer rather than the worker. Any calculator or article that adds $100,000 to your personal cost of studying in the US is wrong on both counts.`,
  },
  {
    question: "Is there really a $100,000 fee on OPT?",
    answer: `No. ${optProposedFee.statusLine} It is modelled on this page only as a stress-test scenario — a hypothetical in which employer appetite for hiring new international graduates collapses — and it is labelled as not being law everywhere it appears. Under every version of the reporting the fee would fall on employers, not on students.`,
  },
  {
    question: "How do I estimate my sponsorship probability honestly?",
    answer:
      "Look at your specific field and target employers rather than national averages. Large technology and consulting firms with established immigration functions sponsor routinely; small firms and startups often will not, and some sectors effectively never do. Ask alumni from your programme what actually happened to them, look at whether your target employers appear in H-1B disclosure data, and be honest about whether your field is one where employers compete for people. If you genuinely do not know, run the calculator at both 30% and 80% and see how much the answer changes — that spread is the real uncertainty you are carrying.",
  },
  {
    question: "Why does the calculator show me earning in India even when I choose to stay in the US?",
    answer:
      "Because a sponsorship probability below 100% means some fraction of the outcome space is one where you do not get sponsored — and in that outcome you do not earn nothing, you earn in India. Modelling the unsponsored fraction as zero income would badly overstate the downside. It is the same reason the never-go baseline is modelled with real salary growth rather than being flat.",
  },
  {
    question: "Does working in the US help even if I eventually leave?",
    answer:
      "Yes, and this is the part most ROI content ignores entirely. A visa is temporary and revocable; work experience is neither. US work experience is documented, verifiable, and counts as skilled foreign work experience in points-based immigration systems such as Canada's Express Entry. A US degree is also the qualifying criterion for unsponsored routes like the UK's High Potential Individual visa. And returning to India after US experience is a materially different transaction from returning straight after graduation. None of that shows up in a net-worth chart, which is why this page scores it separately.",
  },
  {
    question: "Why is the exchange rate an input instead of a live rate?",
    answer:
      "Because a ten-year projection built on today's spot rate is false precision. The rate you should use is a planning assumption you are comfortable with, and you should check how much your conclusion changes when you move it. If your answer flips between ₹80 and ₹95 per dollar, the honest conclusion is that the two paths are close, not that one wins.",
  },
  {
    question: "What is this calculator not modelling?",
    answer:
      "Quite a lot, deliberately. It does not model scholarships and assistantships (subtract them from tuition yourself), employer tuition support, green card timelines, spouse income, children, healthcare cost shocks, currency depreciation trends, or the possibility of a downturn in your field. It is a structured way to compare four paths under assumptions you can see and change — not a forecast.",
  },
];

export default function DegreeRoiCalculatorPage() {
  const url = absoluteUrl(page.path);
  const jsonLd = jsonLdGraph(
    {
      "@type": "SoftwareApplication",
      "@id": `${url}#app`,
      name: page.title,
      description: page.seoDescription,
      url,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: { "@id": `${site.url}/#organization` },
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "en-US",
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
        toolSlug="us-degree-roi-calculator"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Education", href: "/education" },
          { label: page.label },
        ]}
        icon={page.icon}
        category="Education"
        title={page.title}
        hook={page.hook}
        badges={["4 scenarios", "Every assumption editable", "No signup", "$ / ₹"]}
        accent={page.accent}
        sourceNote={
          <>
            Policy status verified{" "}
            <time dateTime={STUDENT_DATA_VERIFIED}>{STUDENT_DATA_VERIFIED}</time>.
            Salary and cost figures are your inputs, not our estimates.
          </>
        }
        disclaimerExtra={
          <p>
            This is an educational model, not financial advice and not a
            forecast. Every output is a direct consequence of assumptions you
            control. Two people with the same degree can get opposite answers
            here, and both can be right.
          </p>
        }
      >
        {/* The correction that leads the page */}
        <section className="pt-6">
          <Container>
            <div className="mx-auto max-w-3xl">
              <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card sm:p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
                  Before you model anything — two numbers you have probably been
                  told wrong
                </p>
                <PolicyCallout
                  label={h1bProclamationFee.label}
                  value={h1bProclamationFee.value}
                  status={h1bProclamationFee.status}
                  statusLine={h1bProclamationFee.statusLine}
                  sourceLabel={h1bProclamationFee.source.label}
                  sourceHref={h1bProclamationFee.source.href}
                  lastVerified={h1bProclamationFee.lastVerified}
                />
                <PolicyCallout
                  label={optProposedFee.label}
                  value={optProposedFee.value}
                  status={optProposedFee.status}
                  statusLine={optProposedFee.statusLine}
                  sourceLabel={optProposedFee.source.label}
                  sourceHref={optProposedFee.source.href}
                  lastVerified={optProposedFee.lastVerified}
                />
                <p className="text-sm leading-relaxed text-ink-500">
                  Neither figure is a cost you would personally pay. Both are
                  modelled here only as effects on how willing employers are to
                  sponsor — which is the channel through which they would
                  actually reach you.
                </p>
              </div>
            </div>
          </Container>
        </section>

        <section className="py-10">
          <Container>
            <DegreeRoiCalc />
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

        {/* ─────────────── The credential / mobility argument ─────────────── */}
        <section className="pb-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                The return that never shows up in the chart
              </h2>
              <p className="mt-3 text-base leading-relaxed text-ink-600">
                Every ROI calculator on this topic stops at money, and money is
                the part of this decision that is easiest to model and least
                durable. A salary is a flow that stops when the job stops. A
                visa is a permission that can be withdrawn. What survives both is
                the credential and the record of what you did with it — and that
                asset does specific, nameable things for you in labour markets
                and immigration systems that have nothing to do with the US.
              </p>

              <div className="mt-6 space-y-4">
                {careerCapitalPoints.map((p, i) => (
                  <div
                    key={p.title}
                    className="rounded-2xl border border-ink-900/5 bg-white p-4 shadow-card sm:p-5"
                  >
                    <div className="flex gap-3">
                      <span
                        aria-hidden
                        className="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-brand-50 text-xs font-extrabold text-brand-700"
                      >
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-ink-900">
                          {p.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-ink-600">
                          {p.body}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <h2 className="mt-10 text-2xl font-bold tracking-tight text-ink-900">
                Where a US degree plus US experience actually opens doors
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">
                These are structural features of other countries&apos; systems,
                not projections — with the catch stated alongside each, because
                every one of them has a catch.
              </p>

              <div className="mt-6 space-y-4">
                {globalMobilityFacts.map((f) => (
                  <div
                    key={f.id}
                    className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card"
                  >
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <h3 className="text-base font-bold text-ink-900">
                        {f.country}
                      </h3>
                      <span className="text-xs font-semibold text-brand-600">
                        {f.route}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-ink-600">
                      {f.whatItDoes}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-ink-600">
                      <strong className="text-ink-900">
                        Why US experience matters:
                      </strong>{" "}
                      {f.whyUsExperienceMatters}
                    </p>
                    <p className="mt-2 rounded-lg bg-amber-50/70 p-2.5 text-xs leading-relaxed text-amber-900">
                      <strong>The catch:</strong> {f.catch}
                    </p>
                    <p className="mt-2 text-xs">
                      <a
                        href={f.source.href}
                        target="_blank"
                        rel="nofollow noopener"
                        className="font-semibold text-brand-600 underline"
                      >
                        {f.source.label}
                      </a>
                    </p>
                  </div>
                ))}
              </div>

              <FactTable
                caption="What each additional year of US work experience buys you"
                headers={["US experience", "Résumé effect", "Mobility effect"]}
                nowrapCol={0}
                rows={[
                  [
                    "Degree only",
                    "A credential and a claim about potential.",
                    "Qualifies you for graduate routes that key off the university itself.",
                  ],
                  [
                    "1 year",
                    "Proof you can operate in a US professional environment, with callable references.",
                    "Enough to be credible to employers abroad; usually thin for points systems.",
                  ],
                  [
                    "3 years",
                    "A track record. You are hired on what you have delivered, not your degree.",
                    "Squarely counts as skilled work experience in points-based systems.",
                  ],
                  [
                    "5+ years",
                    "Senior positioning and a domestic network that keeps generating options.",
                    "Maximum skills-transferability weight; a materially different level on return to India.",
                  ],
                ]}
                highlightRows={[2, 3]}
                note="Directional, not a promise. The point is the shape of the curve: the value is concentrated in the first three to five years, and cutting a US stint short at twelve months captures much less than half of it."
              />

              <h2 className="mt-10 text-2xl font-bold tracking-tight text-ink-900">
                Ten things students get told that are not true
              </h2>
              <MythRealityTable facts={mythVsRealityFacts} />

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
                Sources
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                {[
                  h1bProclamationFee.source,
                  optProposedFee.source,
                  studentSources.hpiVisa,
                  studentSources.expressEntry,
                  studentSources.eca,
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
