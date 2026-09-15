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
  { question: "How do I check my H-1B prevailing wage?", answer: "Look it up yourself: the DOL FLAG wage search returns all four level figures once you give it your SOC occupation code and the area of intended employment. Take the SOC code and the worksite from your own LCA — your employer must give you a copy — then match the level your employer attested to. Compare the result with your offer using our prevailing wage calculator." },
  { question: "Can my employer use a salary survey instead of the DOL wage?", answer: "Yes, within limits. The OEWS figure DOL publishes is the default, but an employer may instead rely on a collective bargaining agreement rate where one covers the job, an independent authoritative wage survey that meets DOL's criteria, or — for work covered by the Davis-Bacon or Service Contract Acts — the wage set under those statutes. The LCA has to name which source was used, so you can see it." },
  { question: "What happens if I am benched without pay?", answer: "That is a violation, not a grey area. Once you are in H-1B employment your employer owes you the required wage even during non-productive time it causes — no project, no client assignment, a lack of work. The exceptions are narrow and relate to circumstances unrelated to employment at your own request. Unpaid benching is one of the main things the Wage and Hour Division enforces, and back wages are the usual remedy." },
  { question: "Does a new office or a move need a new LCA?", answer: "Usually yes. The prevailing wage is set for a specific area of intended employment, so moving to a worksite outside that area generally requires a new LCA for the new location — and the wage for the same job can be materially different there. A move that looks purely logistical to you is a filing for your employer, so flag relocations early." },
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
            <div className="mx-auto max-w-3xl space-y-8">
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

              {/* ── look it up yourself ─────────────────────────────── */}
              <div>
                <h2 className="text-xl font-bold text-ink-900">
                  How to look up your own prevailing wage
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  You do not have to take anyone&rsquo;s word for the number. DOL publishes
                  the whole wage library, and with two pieces of information from your own
                  LCA you can read off all four level figures for your job and city in a
                  couple of minutes.
                </p>
                <ol className="mt-4 space-y-3">
                  <li className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                    <p className="text-sm font-bold text-ink-900">1. Get your LCA and find two fields</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                      Your employer must make the certified LCA available to you. You need
                      the <strong>SOC/O*NET occupation code</strong> and the{" "}
                      <strong>area of intended employment</strong> — the worksite city and
                      county, which DOL resolves to a metropolitan area. While you are
                      there, note the wage level and the wage source your employer
                      attested to.
                    </p>
                  </li>
                  <li className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                    <p className="text-sm font-bold text-ink-900">2. Run the DOL wage search</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                      Enter the SOC code and the location in the OFLC wage search. It
                      returns the four level wages for that occupation in that area from
                      the current wage vintage — Level I through Level IV, as annual and
                      hourly figures.
                    </p>
                  </li>
                  <li className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                    <p className="text-sm font-bold text-ink-900">3. Compare three numbers, not two</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                      Line up the level figure DOL gives you, the wage on your LCA, and
                      your actual salary. The LCA wage should be at or above the DOL level
                      figure, and your pay should be at or above the LCA wage. A gap at
                      either step is worth a conversation.{" "}
                      <Link href="/prevailing-wage-calculator" className="font-semibold text-brand-600 underline">
                        Do this in the calculator →
                      </Link>
                    </p>
                  </li>
                </ol>
                <div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50/50 p-5">
                  <p className="text-sm font-bold text-ink-900">Mind the wage vintage</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                    The wage library refreshes annually and the new figures take effect for
                    applications filed from around 1 July. A number that was correct when
                    your LCA was certified can therefore sit below the current published
                    figure without anything being wrong — your obligation runs to the wage
                    on the certified LCA, not to whatever the search shows today. Compare
                    like with like before concluding you are underpaid.
                  </p>
                </div>
              </div>

              {/* ── the four wage sources ──────────────────────────── */}
              <div>
                <h2 className="text-xl font-bold text-ink-900">
                  Where the number is allowed to come from
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  Most people assume the prevailing wage is always the DOL survey figure.
                  It usually is, but it is not the only permitted source — and knowing the
                  alternatives explains why two colleagues with the same title in the same
                  city can sit on different floors.
                </p>
                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ink-600">
                  <li>
                    <strong className="text-ink-900">The OEWS survey figure.</strong> The
                    default, and what the DOL wage search returns: your SOC occupation and
                    area, sorted into four levels.
                  </li>
                  <li>
                    <strong className="text-ink-900">A collective bargaining agreement rate.</strong>{" "}
                    Where a union agreement covers the job, its rate is the prevailing wage
                    and the four-level framework does not apply.
                  </li>
                  <li>
                    <strong className="text-ink-900">An independent authoritative survey.</strong>{" "}
                    An employer may use a private wage survey if it meets DOL&rsquo;s
                    methodology criteria. This is where genuine disputes arise, because a
                    narrower survey can produce a materially lower figure than OEWS.
                  </li>
                  <li>
                    <strong className="text-ink-900">A Davis-Bacon or Service Contract Act wage.</strong>{" "}
                    For work covered by those statutes, the wage determined under them
                    governs.
                  </li>
                </ul>
                <p className="mt-4 text-sm leading-relaxed text-ink-600">
                  The LCA names the source used, which makes it checkable. If the figure on
                  your LCA is well below what the DOL search returns for your SOC and city,
                  the likely explanation is a survey or an agreement rather than an
                  error — but it is a fair question to ask.
                </p>
              </div>

              {/* ── underpayment, benching, enforcement ────────────── */}
              <div>
                <h2 className="text-xl font-bold text-ink-900">
                  What underpayment actually means — including benching
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  The required wage is an obligation your employer took on by signing the
                  LCA, and it is enforceable by the Department of Labor&rsquo;s Wage and
                  Hour Division rather than by USCIS. Two situations account for most real
                  problems.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5">
                    <p className="text-sm font-bold text-ink-900">Paid below the LCA wage</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                      Including by deduction — passing the employer&rsquo;s own filing costs
                      on to you can push effective pay below the floor. Back wages are the
                      standard remedy.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5">
                    <p className="text-sm font-bold text-ink-900">Benched without pay</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                      &ldquo;No project at the moment, so no pay&rdquo; is a violation, not a
                      cost-saving. Non-productive time caused by the employer — no
                      assignment, no client, a gap between projects — must still be paid at
                      the required wage.
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink-600">
                  Before escalating anything, get the facts straight: pull the certified
                  LCA, check the wage and level on it, check the current DOL figure for the
                  same SOC and area, and confirm whether your worksite still matches the
                  area on the LCA. Then take it to your employer or an attorney with the
                  documents in hand. If a job change is on the table, the wage floor travels
                  with the new LCA —{" "}
                  <Link href="/tools/h1b-transfer-risk-checklist" className="font-semibold text-brand-600 underline">
                    check a transfer before you commit
                  </Link>
                  .
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
