import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import F1TaxCalc from "@/components/education/F1TaxCalc";
import ShareWithTagline from "@/components/education/ShareWithTagline";
import { FactTable, MythRealityTable } from "@/components/education/FactTable";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";
import {
  getStudentPage,
  getShareCopy,
  getRelated,
  STUDENT_LAST_REVIEWED,
} from "@/lib/studentCluster";
import {
  indiaTreaty,
  mythVsRealityFacts,
  studentSources,
  taxConstants,
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

const page = getStudentPage("f1-tax-calculator")!;
const share = getShareCopy("f1-tax-calculator");
const related = getRelated("f1-tax-calculator");

export const metadata: Metadata = {
  ...pageMetadata({
    title: page.seoTitle,
    description: page.seoDescription,
    path: page.path,
  }),
  keywords: [
    "1040NR",
    "international student tax return",
    "OPT tax calculator",
    "FICA refund F1 student",
    "F1 student tax treaty India",
    "substantial presence test calculator",
    "international student tax refund",
  ],
};

const faq: FaqItem[] = [
  {
    question: "Do F-1 students file 1040 or 1040-NR?",
    answer:
      "Almost always Form 1040-NR. F-1 students are 'exempt individuals' for their first five calendar years, meaning their days in the US do not count toward the substantial presence test — so they stay nonresident aliens regardless of how long they have actually been here. From the sixth calendar year onward your days start counting, and if you meet the test you become a resident for tax purposes and file Form 1040 instead. The calculator above works out which year you are in.",
  },
  {
    question: "How many years is an F-1 student exempt from the substantial presence test?",
    answer: `Five calendar years — and the emphasis is on calendar. A student who arrived in August 2021 has already used a full exempt year on five months of presence, so 2021 through 2025 are exempt and 2026 is the first year their days count. J-1 students get the same five years; J-1 scholars and researchers get only two.`,
  },
  {
    question: "Can international students claim the standard deduction?",
    answer: `Generally no — nonresident aliens cannot claim it. There is one significant exception: ${indiaTreaty.article} of the ${indiaTreaty.name} lets students and business apprentices from India claim the standard deduction on Form 1040-NR. For tax year 2026 that is $${taxConstants.standardDeductionSingle[2026].toLocaleString("en-US")} for a single filer, and $${taxConstants.standardDeductionSingle[2025].toLocaleString("en-US")} for tax year 2025. ${indiaTreaty.claimMechanic}`,
  },
  {
    question: "My employer took Social Security and Medicare tax. Can I get it back?",
    answer: `Yes, if you were a nonresident alien at the time. F-1 students are exempt from FICA on wages authorised by their status, so ${taxConstants.ficaPct}% (${taxConstants.socialSecurityPct}% Social Security plus ${taxConstants.medicarePct}% Medicare) should not have been withheld. Ask your employer for a refund and a corrected W-2 first — the IRS will not process your claim unless you have tried. If the employer will not or cannot help, file Form 843 together with Form 8316. It is a paper process and takes months.`,
  },
  {
    question: "Do I have to file anything if I earned no income?",
    answer:
      "Yes. Every exempt individual files Form 8843 for each year they are in that status, even with zero income. It is not a tax return — it is the form that documents why your days in the US do not count toward the substantial presence test. Skipping it is one of the most common mistakes international students make, and it can complicate later filings.",
  },
  {
    question: "Does the tax treaty help with state taxes too?",
    answer:
      "Usually not. States are not parties to federal tax treaties, and most do not follow them. It is entirely normal to get a federal refund because of the treaty and still owe your state — California in particular does not recognise treaty benefits. Always run the state return separately and never assume the federal result carries over.",
  },
  {
    question: "What changes in the year I become a resident for tax purposes?",
    answer:
      "A lot. You file Form 1040 and report worldwide income — Indian salary, bank interest, mutual fund gains, rental income, all of it. You pick up FBAR and FATCA reporting if your foreign accounts cross the thresholds. You start paying FICA. You lose the nonresident treaty position, though you gain the ordinary standard deduction. If it is a split year you may file a dual-status return, which is genuinely complicated and worth paying a professional for.",
  },
  {
    question: "Is this calculator a substitute for filing software or an accountant?",
    answer:
      "No. It estimates a single, common situation: a student with wage income filing as a single nonresident. It does not handle scholarship or fellowship income, 1099 or self-employment income, capital gains, dual-status years, dependants, or state returns. Use it to understand what you are looking at and roughly what to expect, then file through proper nonresident software or a professional.",
  },
];

export default function F1TaxCalculatorPage() {
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
        toolSlug="f1-tax-calculator"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Education", href: "/education" },
          { label: page.label },
        ]}
        icon={page.icon}
        category="Education"
        title={page.title}
        hook={page.hook}
        badges={["3 steps", "No signup", "Nothing stored", "Treaty-aware"]}
        accent={page.accent}
        sourceNote={
          <>
            Rates and thresholds verified{" "}
            <time dateTime={STUDENT_DATA_VERIFIED}>{STUDENT_DATA_VERIFIED}</time>{" "}
            against{" "}
            <a
              href={studentSources.irsPub519.href}
              className="text-brand-600 underline"
              rel="nofollow noopener"
              target="_blank"
            >
              IRS Publication 519
            </a>
            .
          </>
        }
        disclaimerExtra={
          <p>
            This is an educational estimate, not tax advice, and it does not
            create a client relationship. It models a single nonresident filer
            with wage income only. Scholarship income, 1099 income, capital
            gains, dual-status years and state returns are out of scope. File
            through proper nonresident software or a qualified preparer.
          </p>
        }
      >
        <section className="pt-6">
          <Container>
            <FastAnswerSnapshot
              title="F-1 student tax — the four numbers that matter"
              answerLabel="Form most F-1 students file"
              answer="1040-NR"
              accent="emerald"
              rows={[
                {
                  label: "Exempt from the presence test for",
                  value: `${taxConstants.f1ExemptCalendarYears} calendar years`,
                  note: "Not five 12-month periods — an August arrival burns a whole year.",
                },
                {
                  label: "FICA that should not be withheld",
                  value: `${taxConstants.ficaPct}%`,
                  note: "Recoverable via the employer, then Form 843 + 8316.",
                },
                {
                  label: "India treaty standard deduction (TY2026)",
                  value: `$${taxConstants.standardDeductionSingle[2026].toLocaleString("en-US")}`,
                  note: "Article 21(2) — almost unique to Indian students.",
                  highlight: true,
                },
                {
                  label: "Form 8843",
                  value: "Every year",
                  note: "Required even with zero income.",
                },
              ]}
              badges={["1040-NR", "7.65% FICA", "Treaty deduction"]}
              lastVerified={STUDENT_DATA_VERIFIED}
              sources={[studentSources.irsPub519, studentSources.irsTreaty]}
              disclaimer="Educational estimate only — not tax advice. Verify against IRS guidance before filing."
            />
          </Container>
        </section>

        <section className="py-10">
          <Container>
            <F1TaxCalc />
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

        {/* ───────────────── Substance below the tool ───────────────── */}
        <section className="pb-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                What most international-student tax pages get wrong
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">
                Every one of these is checkable against the IRS source linked
                below. They come up constantly in student groups, and the wrong
                version costs real money.
              </p>
              <MythRealityTable facts={mythVsRealityFacts.slice(4, 7)} />

              <h2 className="mt-10 text-2xl font-bold tracking-tight text-ink-900">
                The exempt-year rule, in one table
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">
                This is the part that surprises people. Exemption is counted in
                calendar years, so the month you arrived decides how much of
                your first year you spend.
              </p>
              <FactTable
                caption="A student who first arrives in 2022"
                headers={["Calendar year", "Status", "Do your days count?", "Form"]}
                nowrapCol={0}
                rows={[
                  ["2022", "Exempt individual (year 1)", "No", "8843 + 1040-NR if income"],
                  ["2023", "Exempt individual (year 2)", "No", "8843 + 1040-NR if income"],
                  ["2024", "Exempt individual (year 3)", "No", "8843 + 1040-NR if income"],
                  ["2025", "Exempt individual (year 4)", "No", "8843 + 1040-NR if income"],
                  ["2026", "Exempt individual (year 5)", "No", "8843 + 1040-NR if income"],
                  [
                    "2027",
                    "Days begin counting",
                    "Yes — run the test",
                    "1040-NR or 1040",
                  ],
                ]}
                highlightRows={[5]}
                note="Arriving in August 2022 still consumes the whole of 2022. The exemption is not five years of presence — it is five calendar years."
              />

              <h2 className="mt-10 text-2xl font-bold tracking-tight text-ink-900">
                The India treaty benefit, quantified
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">
                {indiaTreaty.benefit} {indiaTreaty.eligibility}
              </p>
              <FactTable
                caption="Same W-2, different nationality — tax year 2026"
                headers={[
                  "Wages",
                  "Indian student (treaty)",
                  "Other nationality",
                  "Difference",
                ]}
                nowrapCol={0}
                rows={[
                  ["$20,000", "$3,900 taxable", "$20,000 taxable", "≈$1,610 less tax"],
                  ["$35,000", "$18,900 taxable", "$35,000 taxable", "≈$1,932 less tax"],
                  ["$50,000", "$33,900 taxable", "$50,000 taxable", "≈$2,246 less tax"],
                ]}
                note={`Illustrative, using the tax year 2026 single standard deduction of $${taxConstants.standardDeductionSingle[2026].toLocaleString("en-US")} and ordinary single rates. ${indiaTreaty.caution}`}
              />

              <div className="mt-10 rounded-2xl border border-sky-200 bg-sky-50/50 p-5 sm:p-6">
                <h2 className="text-lg font-bold tracking-tight text-ink-900">
                  For university international offices
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  ISSS and international student offices cannot legally give tax
                  advice, which leaves a gap every February. This calculator is
                  free, has no signup, collects nothing, and is safe to link from
                  a student resources page — it explains the rules and the
                  process rather than preparing anyone&apos;s return.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  If something here is wrong or unclear for your student
                  population, tell us and we will fix it —{" "}
                  <a
                    href="mailto:team@nritousa.com"
                    className="font-semibold text-brand-600 underline"
                  >
                    team@nritousa.com
                  </a>
                  .
                </p>
              </div>

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
                Official sources
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                {[
                  studentSources.irsPub519,
                  studentSources.irsAliens,
                  studentSources.irsExempt,
                  studentSources.irsFica,
                  studentSources.irsForm843,
                  studentSources.irsTreaty,
                  studentSources.irsInflation2026,
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
