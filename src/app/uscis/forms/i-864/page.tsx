import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ReviewedByline from "@/components/ReviewedByline";
import AuthorBioBox from "@/components/AuthorBioBox";
import Newsletter from "@/components/Newsletter";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";
import NotLegalAdvice from "@/components/tools/NotLegalAdvice";
import OfficialSourceBox from "@/components/tools/OfficialSourceBox";
import ToolFaq from "@/components/tools/ToolFaq";
import I864SponsorIncomeChecker from "@/components/tools/I864SponsorIncomeChecker";
import { SponsorDecisionDiagram } from "@/components/tools/i864/charts";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";
import { site } from "@/lib/site";
import { formatDate } from "@/lib/format";
import {
  I864_SOURCES,
  I864P,
  I864_FACTS,
  I864_TABLES,
  ASSET_RULE_LIST,
} from "@/data/affidavitOfSupportData";
import { requiredIncome } from "@/lib/calc/i864Income";

const PAGE_PATH = "/uscis/forms/i-864";
const PUBLISHED = "2026-09-16";
const UPDATED = "2026-09-16";

/* Every figure in the copy below is derived, never typed inline. */
const MIN_2 = requiredIncome(2, "contiguous", false);
const MIN_3 = requiredIncome(3, "contiguous", false);
const MIN_4 = requiredIncome(4, "contiguous", false);
const MIN_2_MIL = requiredIncome(2, "contiguous", true);
const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

export const metadata: Metadata = pageMetadata({
  title: `Form I-864P Poverty Guidelines ${I864P.guidelineYear}: Sponsor Income Requirements`,
  description: `The I-864P minimum income to sponsor an immigrant is ${usd(
    MIN_2
  )} for a household of two in the 48 contiguous states, effective ${formatDate(
    I864P.effective
  )}. Free sponsor income checker, the full threshold table, and the three ways to fix a shortfall.`,
  path: PAGE_PATH,
  type: "article",
  openGraph: { publishedTime: PUBLISHED, modifiedTime: UPDATED },
});

const crumbs = [
  { name: "Home", url: "/" },
  { name: "USCIS Hub", url: "/uscis" },
  { name: "USCIS Forms", url: "/uscis/forms" },
  { name: "Form I-864 & I-864P", url: PAGE_PATH },
];

const faqs: FaqItem[] = [
  {
    question: `What is the I-864P poverty guideline income requirement for ${I864P.guidelineYear}?`,
    answer: `For a sponsor in the 48 contiguous states, DC, Puerto Rico, the US Virgin Islands, Guam or the Northern Mariana Islands, the minimum is ${usd(
      MIN_2
    )} for a household of two, ${usd(MIN_3)} for three and ${usd(
      MIN_4
    )} for four. That is 125% of the Federal Poverty Guidelines. Alaska and Hawaii have their own, higher tables. This edition of Form I-864P took effect on ${formatDate(
      I864P.effective
    )} — the previous edition applied to cases filed before then, so check which one your filing date falls under.`,
  },
  {
    question: "What is Form I-864P, and how is it different from Form I-864?",
    answer:
      "Form I-864 is the affidavit of support itself — the contract a sponsor signs promising to support the immigrant. Form I-864P is not something you file at all: it is the one-page table of poverty guidelines USCIS publishes so you can look up the income figure that applies to your household size. People searching for 'I-864P' are almost always looking for that table, not a form to complete.",
  },
  {
    question: "Who counts in my household size for the I-864?",
    answer:
      "Yourself, your spouse, your unmarried children under 21, anyone else you claimed as a dependent on your most recent federal tax return, everyone you are sponsoring on this affidavit, and anyone still covered by an I-864 you signed in the past. The last two are where most people go wrong — the immigrants you are sponsoring count in your household even though they are not living with you yet, so sponsoring a married couple raises your household by two, not one.",
  },
  {
    question: "What are the income requirements for immigration sponsorship if my income is too low?",
    answer: `You have three routes, and they are not interchangeable. A household member who already counts in your household size can add their income by signing Form I-864A. You can use assets, but the net value has to be a multiple of the shortfall — ${ASSET_RULE_LIST.map(
      (r) => `${r.multiple}× ${r.label.toLowerCase()}`
    ).join(", ")}. Or you can bring in a joint sponsor, who files a complete I-864 of their own and must meet the full requirement for their own household on their own income — not just cover your gap.`,
  },
  {
    question: "Do the poverty guidelines for the I-864 change every year?",
    answer: `Yes. HHS publishes new Federal Poverty Guidelines each January, and USCIS then issues a new edition of Form I-864P that takes effect around the start of March. Between those two dates the old table is still the operative one, which is why a figure taken from a January news article can be wrong for a February filing. The current edition took effect ${formatDate(
      I864P.effective
    )}.`,
  },
  {
    question: "Can I sponsor from India, or do I have to live in the US?",
    answer:
      "You must be domiciled in the United States, which is not the same as being physically present every day. A US citizen posted to India temporarily can still show US domicile with evidence that they never gave it up and intend to return by the time the immigrant enters — a US home or lease kept on, US tax returns filed as a resident, US bank accounts, a driver's licence, voter registration. If you genuinely relocated to India and gave all of that up, you have to re-establish domicile before the affidavit can be accepted, or the case needs a joint sponsor.",
  },
  {
    question: "Does my income in India count toward the requirement?",
    answer:
      "Income earned abroad generally only helps if it will continue from the same source after you move to the United States, which rules out most salaried jobs in India. What is more likely to count is income you already report on your US federal tax return — and that is the number the I-864 asks for. If your Indian salary is the bulk of your income and it ends when you move, plan on a joint sponsor rather than hoping it will be accepted.",
  },
  {
    question: "What exactly is a joint sponsor agreeing to?",
    answer: `A joint sponsor signs the same enforceable contract you do. The immigrant can sue them directly for support at 125% of the poverty line, and a federal or state agency that provides a means-tested benefit to the immigrant can sue them to recover it. The obligation is not cancelled by divorce, by falling out with the family, or by the immigrant moving away. It ends only when the immigrant naturalises, is credited with ${I864_FACTS.quartersToEnd} qualifying quarters of work, permanently leaves the United States, or dies.`,
  },
  {
    question: "Which tax years do I have to submit with the I-864?",
    answer:
      "A copy or an IRS transcript of your complete federal income tax return for the most recent tax year is required, with the W-2s or 1099s. You may add the two years before that if it helps your case — for example when last year was unusually low. If you were not required to file, you have to say so and explain why, rather than simply leaving it out.",
  },
  {
    question: "Is there a filing fee for Form I-864?",
    answer: `${I864_FACTS.uscisFilingFeeNote} That Department of State review fee is ${I864_FACTS.nvcReviewFee} and is paid through CEAC when the case is at the National Visa Center. If the immigrant is adjusting status inside the US on Form I-485, the I-864 goes in with that package and there is no separate affidavit fee at all.`,
  },
  {
    question: "Does the military exception apply to me?",
    answer: `Only if you are on active duty in the US armed forces and you are sponsoring your own spouse or child. In that case the threshold drops to 100% of the poverty guidelines — ${usd(
      MIN_2_MIL
    )} rather than ${usd(
      MIN_2
    )} for a household of two in the contiguous states. It does not apply to a veteran, to a reservist not on active duty, to sponsoring a parent or sibling, or to a joint sponsor who happens to serve.`,
  },
  {
    question: "I am sponsoring my parents from India. Anything different?",
    answer:
      "The income rules are identical, but two things bite harder. First, both parents usually immigrate, so your household size goes up by two at once — that is often the step that pushes a comfortable income under the line. Second, the 3× asset concession does not apply: parents fall in the 'every other case' bucket, so assets have to be worth five times the shortfall. Many families end up using an adult sibling as a joint sponsor for exactly this reason.",
  },
];

export default function I864Page() {
  const url = absoluteUrl(PAGE_PATH);

  const jsonLd = jsonLdGraph(
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: `Form I-864P Poverty Guidelines ${I864P.guidelineYear} and the I-864 Affidavit of Support`,
      description: `The current I-864P income thresholds, how household size is counted, and the three ways to fix a shortfall.`,
      datePublished: PUBLISHED,
      dateModified: UPDATED,
      author: { "@id": `${site.url}/#organization` },
      publisher: { "@id": `${site.url}/#organization` },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      url,
      inLanguage: "en-US",
      isAccessibleForFree: true,
    },
    {
      "@type": "WebApplication",
      "@id": `${url}#app`,
      name: "I-864 Sponsor Income Checker",
      description:
        "Work out the minimum income you need to sponsor an immigrant on Form I-864, how big a shortfall you have, and what assets or a joint sponsor would need to cover.",
      url: `${url}#checker`,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      browserRequirements: "Requires JavaScript",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: { "@id": `${site.url}/#organization` },
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "en-US",
    },
    faqJsonLd(faqs),
    breadcrumbJsonLd(crumbs)
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        {/* ── Header ─────────────────────────────────────────────── */}
        <header className="border-b border-ink-900/5 bg-white pt-6 pb-7 sm:pt-9">
          <Container>
            <nav
              aria-label="Breadcrumb"
              className="mb-4 flex flex-wrap items-center gap-2 text-xs text-ink-400"
            >
              {crumbs.map((c, i) => (
                <span key={c.url} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden>/</span>}
                  {i < crumbs.length - 1 ? (
                    <Link href={c.url} className="hover:text-brand-600">
                      {c.name}
                    </Link>
                  ) : (
                    <span className="text-ink-500">{c.name}</span>
                  )}
                </span>
              ))}
            </nav>

            <h1 className="max-w-3xl text-2xl font-black tracking-tight text-ink-900 sm:text-4xl">
              Form I-864P Poverty Guidelines {I864P.guidelineYear}: the income
              you need to sponsor an immigrant
            </h1>

            {/* ANSWER FIRST — 40–60 words, with the specific current fact. */}
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-700 sm:text-lg">
              To sponsor an immigrant on Form I-864 you must show income of at
              least <strong>{usd(MIN_2)}</strong> for a household of two in the
              48 contiguous states — 125% of the Federal Poverty Guidelines on
              the Form I-864P edition effective{" "}
              <strong>{formatDate(I864P.effective)}</strong>. Alaska and Hawaii
              are higher. Active-duty sponsors of a spouse or child need only{" "}
              <strong>{usd(MIN_2_MIL)}</strong>.
            </p>

            {/* KEY FACTS */}
            <ul className="mt-5 grid max-w-3xl gap-2 sm:grid-cols-2">
              {[
                `Household of 2 — ${usd(MIN_2)} · 3 — ${usd(MIN_3)} · 4 — ${usd(MIN_4)} (48 states & DC)`,
                "Your household size includes the people you are sponsoring, not just the people already living with you",
                `USCIS charges ${I864_FACTS.uscisFilingFee} to file the I-864; the Department of State charges ${I864_FACTS.nvcReviewFee} to review it at NVC`,
                "Short of the line? Household-member income (I-864A), assets at 3×/5×/1× the gap, or a joint sponsor",
                "The obligation runs until the immigrant naturalises, works 40 qualifying quarters, permanently leaves, or dies — divorce does not end it",
                "New guidelines land each January but only take effect on the I-864P edition date, around 1 March",
              ].map((f) => (
                <li
                  key={f}
                  className="flex gap-2 rounded-xl border border-ink-900/5 bg-ink-900/[0.02] px-3.5 py-2.5 text-sm leading-relaxed text-ink-700"
                >
                  <span aria-hidden className="text-brand-600">
                    ▸
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <ReviewedByline date={UPDATED} className="mt-5" />
            <NotLegalAdvice className="mt-4 max-w-3xl" />
          </Container>
        </header>

        {/* ── Fast answer snapshot ───────────────────────────────── */}
        <section className="bg-ink-900/[0.02] py-8">
          <Container>
            <FastAnswerSnapshot
              title="Minimum sponsor income — Form I-864P"
              answerLabel="Household of 2, 48 contiguous states"
              answer={usd(MIN_2)}
              accent="emerald"
              badges={[
                `Effective ${formatDate(I864P.effective)}`,
                "125% of poverty guidelines",
              ]}
              rows={[
                { label: "Household of 3", value: usd(MIN_3) },
                { label: "Household of 4", value: usd(MIN_4) },
                {
                  label: "Alaska, household of 2",
                  value: usd(requiredIncome(2, "alaska", false)),
                },
                {
                  label: "Hawaii, household of 2",
                  value: usd(requiredIncome(2, "hawaii", false)),
                },
                {
                  label: "Active duty, spouse or child, household of 2",
                  value: usd(MIN_2_MIL),
                  note: "100% rule",
                  highlight: true,
                },
                {
                  label: "USCIS filing fee for the I-864",
                  value: I864_FACTS.uscisFilingFee,
                  note: `DOS charges ${I864_FACTS.nvcReviewFee} at NVC`,
                },
              ]}
              lastVerified={I864P.lastVerified}
              sources={[
                { label: "Form I-864P (USCIS)", href: I864_SOURCES.i864p },
                { label: "HHS poverty guidelines", href: I864_SOURCES.hhsGuidelines },
              ]}
              disclaimer="Poverty guidelines change annually. Confirm the figure on the current Form I-864P before you file — the edition in force on your filing date is the one that counts."
              ctaText="Check my own numbers"
              ctaHref="#checker"
            />
          </Container>
        </section>

        {/* ── The tool ───────────────────────────────────────────── */}
        <section id="checker" className="scroll-mt-24 py-10 sm:py-14">
          <Container>
            <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
              Sponsor income checker
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-500">
              Build your household size step by step, then enter the total income
              from your most recent federal tax return. Everything runs in your
              browser — nothing is stored and nothing is sent anywhere.
            </p>
            <div className="mt-6">
              <I864SponsorIncomeChecker />
            </div>
          </Container>
        </section>

        {/* ── Body ───────────────────────────────────────────────── */}
        <section className="border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <div className="prose-nri mx-auto max-w-[720px] space-y-10 text-[0.975rem] leading-relaxed text-ink-700">
              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  What the I-864 actually is
                </h2>
                <p className="mt-3">
                  Form I-864, Affidavit of Support Under Section 213A of the INA,
                  is a contract. Not a formality, not a declaration of good
                  intentions — an enforceable contract between the sponsor and
                  the United States government, with the immigrant as a third
                  party who can sue on it. By signing it you promise to maintain
                  the immigrant at 125% of the Federal Poverty Guidelines, and
                  you agree that any federal, state or local agency that gives
                  them a means-tested public benefit can come to you to get the
                  money back.
                </p>
                <p className="mt-3">
                  Nearly every family-based immigrant needs one, and so does a
                  small number of employment-based immigrants — specifically
                  where a relative filed the petition or owns 5% or more of the
                  petitioning business. If you are here for the employment green
                  card path, the affidavit is probably not your problem;{" "}
                  <Link href="/green-card" className="text-brand-600 underline">
                    the employment-based green card guide
                  </Link>{" "}
                  is the right starting point.
                </p>
                <p className="mt-3">
                  Two things end the obligation, and neither is the one people
                  assume. Divorce does not end it. Being estranged does not end
                  it. It ends when the immigrant becomes a US citizen, is
                  credited with {I864_FACTS.quartersToEnd} qualifying quarters of
                  work (roughly ten years, and a spouse&apos;s quarters during
                  the marriage can count), permanently leaves the United States,
                  or dies. That is the whole list.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  I-864 vs I-864EZ vs I-864A vs I-134
                </h2>
                <p className="mt-3">
                  Four forms with confusingly similar numbers, and picking the
                  wrong one costs months.
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[520px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th className="py-2 pr-3 font-bold text-ink-900">Form</th>
                        <th className="py-2 pr-3 font-bold text-ink-900">Who files it</th>
                        <th className="py-2 font-bold text-ink-900">When</th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      <tr className="border-b border-ink-900/5">
                        <td className="py-2.5 pr-3 font-semibold text-ink-800">I-864</td>
                        <td className="py-2.5 pr-3">The petitioning sponsor, and any joint sponsor</td>
                        <td className="py-2.5">The standard case</td>
                      </tr>
                      <tr className="border-b border-ink-900/5">
                        <td className="py-2.5 pr-3 font-semibold text-ink-800">I-864EZ</td>
                        <td className="py-2.5 pr-3">The petitioning sponsor only</td>
                        <td className="py-2.5">
                          One immigrant, no household members adding income, and
                          your income is all from employment shown on your W-2s
                        </td>
                      </tr>
                      <tr className="border-b border-ink-900/5">
                        <td className="py-2.5 pr-3 font-semibold text-ink-800">I-864A</td>
                        <td className="py-2.5 pr-3">A household member adding their income</td>
                        <td className="py-2.5">
                          Alongside your I-864, never on its own
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 pr-3 font-semibold text-ink-800">I-134</td>
                        <td className="py-2.5 pr-3">A supporter of a temporary visitor or parolee</td>
                        <td className="py-2.5">
                          Not an immigrant case at all — different form, far
                          weaker obligation
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-sm text-ink-500">
                  If someone has asked you for an I-134 to support a visitor
                  coming from India, that is a different exercise —{" "}
                  <Link
                    href="/invitation-letter-for-parents-to-visit-usa"
                    className="text-brand-600 underline"
                  >
                    the visitor invitation letter guide
                  </Link>{" "}
                  covers what a B-2 case actually needs.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  How the decision actually runs
                </h2>
                <SponsorDecisionDiagram />
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Household size: the step that fails most affidavits
                </h2>
                <p className="mt-3">
                  The income threshold is not a single number, it is a number per
                  household size, and the household is defined more broadly than
                  most people expect. You count yourself, your spouse, your
                  unmarried children under 21, everyone else you claimed as a
                  dependent on your last federal return, everyone you are
                  sponsoring on this affidavit, and everyone still covered by an
                  affidavit you signed in the past.
                </p>
                <p className="mt-3">
                  Two of those catch people out repeatedly. The first is that the
                  intending immigrants count <em>now</em>, before they arrive — a
                  couple sponsoring two parents is a household of four before
                  anyone has boarded a plane. The second is the old affidavit: if
                  you sponsored a sibling six years ago and they are not yet a
                  citizen and have not worked forty qualifying quarters, that
                  person is still in your household size today.
                </p>
                <p className="mt-3">
                  Getting this wrong in the optimistic direction is expensive.
                  You do not find out at filing; you find out months later when
                  the National Visa Center or the consular officer asks for a
                  joint sponsor, and the case stops until you produce one.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Which income counts
                </h2>
                <p className="mt-3">
                  The figure the form asks for is your <em>total income</em> from
                  your most recent federal income tax return — the total income
                  line, not adjusted gross income, not taxable income, and not
                  what lands in your bank account. If you are self-employed it is
                  the figure after business deductions, which is why a
                  contractor with a healthy gross can still fail: aggressive
                  deductions lower exactly the number the affidavit is measured
                  on.
                </p>
                <p className="mt-3">
                  You must submit a copy or an IRS transcript of that return with
                  the schedules and the W-2s or 1099s. You may submit{" "}
                  {I864_FACTS.taxYearsOptional} if it helps — worth doing when
                  last year was an outlier and the two before it were strong.
                  Current income matters too: if you changed jobs and now earn
                  substantially more than the return shows, recent pay stubs and
                  an employment letter are how you show it.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Three ways to fix a shortfall
                </h2>
                <p className="mt-3">
                  They are not ranked by preference, they are ranked by how often
                  they actually work.
                </p>
                <h3 className="mt-5 text-base font-bold text-ink-900">
                  Household member income — Form I-864A
                </h3>
                <p className="mt-2">
                  Someone already inside your household size signs Form I-864A
                  and their income joins yours. An earning spouse is the common
                  case. The useful property here is that adding them does not
                  increase the household size, because they were already counted
                  — so every dollar they bring closes the gap one for one.
                </p>
                <h3 className="mt-5 text-base font-bold text-ink-900">
                  Assets, at a multiple of the gap
                </h3>
                <p className="mt-2">
                  Assets are allowed, but at a punitive multiple set by
                  8 CFR 213a.2:
                </p>
                <ul className="mt-2 list-disc space-y-1.5 pl-5">
                  {ASSET_RULE_LIST.map((r) => (
                    <li key={r.id}>
                      <strong>{r.multiple}×</strong> the shortfall — {r.label.toLowerCase()}.{" "}
                      {r.detail}
                    </li>
                  ))}
                </ul>
                <p className="mt-3">
                  It has to be <em>net</em> value — the equity, after any loan
                  against it — and it has to be convertible to cash within about
                  a year without hardship to the owner or their family. A house
                  you live in counts only to the extent of its equity, and the
                  practical problem is that selling it to support the immigrant
                  is the very hardship the rule excludes. Retirement accounts,
                  property in India, and listed shares are all capable of
                  counting, but property abroad needs an appraisal and evidence
                  it can actually be sold and the money moved, which for Indian
                  property is a real question, not a formality.
                </p>
                <h3 className="mt-5 text-base font-bold text-ink-900">
                  A joint sponsor
                </h3>
                <p className="mt-2">
                  The route that reliably works. A joint sponsor files their own
                  complete I-864 and must meet the requirement for their own
                  household on their own income — the whole requirement, not your
                  gap. They must be a US citizen or permanent resident, at least
                  18, and domiciled in the US, but they do not have to be related
                  to anyone. There can be at most two joint sponsors on a case,
                  and each must fully qualify for the immigrants they take on.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  For Indian families specifically
                </h2>
                <h3 className="mt-4 text-base font-bold text-ink-900">
                  Sponsoring parents
                </h3>
                <p className="mt-2">
                  Only US citizens can petition for parents, and the parents are
                  immediate relatives, so there is no visa queue — the case moves
                  at the speed of the paperwork. That makes the affidavit the
                  binding constraint rather than an afterthought. Two parents
                  immigrating means your household jumps by two at once, and
                  because parents fall outside the spouse-and-child concession,
                  assets have to cover the shortfall{" "}
                  <strong>five times over</strong>. An adult sibling as joint
                  sponsor is the usual answer. The document set on the Indian
                  side —{" "}
                  <Link
                    href="/nvc-document-checklist-india"
                    className="text-brand-600 underline"
                  >
                    birth certificates, non-availability certificates, police
                    clearances
                  </Link>{" "}
                  — is a separate battle worth starting early.
                </p>
                <h3 className="mt-5 text-base font-bold text-ink-900">
                  If you are living in India right now
                </h3>
                <p className="mt-2">
                  Domicile is about intent plus evidence, not about where you
                  slept last night. A US citizen on an assignment in India who
                  kept a US home, files US returns as a resident, holds US
                  accounts and a valid licence, and can show the posting is
                  temporary, generally still has US domicile. Someone who sold
                  the US house, closed the accounts and moved the family
                  permanently does not — and will need to re-establish domicile
                  before the immigrant enters, or bring in a joint sponsor who
                  clearly has it. The consulate looks at the whole picture, so
                  assemble it deliberately rather than asserting it.
                </p>
                <h3 className="mt-5 text-base font-bold text-ink-900">
                  Indian income and Indian assets
                </h3>
                <p className="mt-2">
                  Foreign income generally counts only if it will continue from
                  the same source once you are in the United States, which a
                  salaried job in India will not. Rental income from Indian
                  property, or dividends that keep arriving, are a better
                  argument — and if you already report them on your US return,
                  they are simply part of the total income figure the form asks
                  for. Indian assets can be used, but expect to prove the
                  valuation, the clear title and the ability to actually
                  repatriate the proceeds. If you are weighing whether to keep
                  that property at all,{" "}
                  <Link
                    href="/india-investments/should-nris-keep-investments-in-india"
                    className="text-brand-600 underline"
                  >
                    the NRI investments analysis
                  </Link>{" "}
                  covers the wider trade-off.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Mistakes that cost months
                </h2>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>
                    <strong>Leaving the immigrants out of the household count.</strong>{" "}
                    The single most common failure, and it is always discovered
                    downstream.
                  </li>
                  <li>
                    <strong>Using the wrong I-864P edition.</strong> A figure from
                    a January news story is the <em>next</em> table, not the one
                    in force until the March effective date.
                  </li>
                  <li>
                    <strong>Submitting adjusted gross income.</strong> The form
                    asks for total income. They are different lines and the
                    difference can be thousands.
                  </li>
                  <li>
                    <strong>Assuming a joint sponsor only needs to cover the gap.</strong>{" "}
                    They must qualify in full, on their own household size.
                  </li>
                  <li>
                    <strong>Forgetting an old affidavit.</strong> A sibling you
                    sponsored years ago may still be in your household size.
                  </li>
                  <li>
                    <strong>Filing without the tax return or transcript.</strong>{" "}
                    This produces a{" "}
                    <Link
                      href="/uscis/request-for-evidence-rfe"
                      className="text-brand-600 underline"
                    >
                      request for evidence
                    </Link>{" "}
                    or an NVC checklist letter, and the clock restarts.
                  </li>
                  <li>
                    <strong>Not filing Form I-865 after a move.</strong> A sponsor
                    must report a change of address within 30 days for as long as
                    the obligation lasts.
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Where the affidavit sits in the process
                </h2>
                <p className="mt-3">
                  For a consular case, the sequence is:{" "}
                  <Link href="/uscis/forms/i-130" className="text-brand-600 underline">
                    Form I-130 approved
                  </Link>{" "}
                  → the case moves to the National Visa Center → fees paid →
                  DS-260 filed → civil documents and the I-864 uploaded →
                  documentarily qualified → interview. The affidavit is a
                  gating item at the NVC stage, so an income problem discovered
                  there is a problem that stops the case.{" "}
                  <Link href="/nvc-processing-time" className="text-brand-600 underline">
                    The NVC timeline page
                  </Link>{" "}
                  has the current published timeframes and an estimator for the
                  stages either side of this one.
                </p>
                <p className="mt-3">
                  For an adjustment of status case, the I-864 goes in with the
                  I-485 package instead, and a shortfall surfaces as an RFE
                  rather than an NVC checklist letter. Same fix, different letter.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* ── FAQ ────────────────────────────────────────────────── */}
        <section className="bg-ink-900/[0.02] py-12 sm:py-16">
          <Container>
            <ToolFaq items={faqs} />
          </Container>
        </section>

        {/* ── Sources ────────────────────────────────────────────── */}
        <section className="py-12">
          <Container>
            <OfficialSourceBox
              title="Sources and last verified"
              intro={`Every figure on this page was checked against these official sources on ${formatDate(
                I864P.lastVerified
              )}. Poverty guidelines change annually — verify before you file.`}
              links={[
                { label: `Form I-864P — poverty guidelines (effective ${formatDate(I864P.effective)})`, href: I864_SOURCES.i864p },
                { label: "Form I-864 — Affidavit of Support", href: I864_SOURCES.i864 },
                { label: "Form I-864A — contract with a household member", href: I864_SOURCES.i864a },
                { label: "USCIS Policy Manual, Vol. 8, Part G, Ch. 6", href: I864_SOURCES.policyManual },
                { label: "8 CFR 213a.2 — asset multiples and domicile", href: I864_SOURCES.cfr213a },
                { label: `HHS ${I864P.guidelineYear} poverty guidelines`, href: I864_SOURCES.hhsGuidelines },
                { label: "Federal Register — annual poverty guideline update", href: I864_SOURCES.federalRegister2026 },
                { label: "USCIS — Affidavit of Support overview", href: I864_SOURCES.affidavitOverview },
              ]}
            />

            <div className="mx-auto mt-6 max-w-3xl">
              <NotLegalAdvice />
            </div>

            {/* Related internal links */}
            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card">
              <h2 className="text-base font-bold text-ink-900">
                Next steps on this path
              </h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {[
                  { href: "/uscis/forms/i-130", label: "Form I-130 — the family petition that comes first" },
                  { href: "/nvc-processing-time", label: "NVC timeline — how long each stage is taking" },
                  { href: "/nvc-document-checklist-india", label: "NVC document checklist for India" },
                  { href: "/uscis/forms", label: "All USCIS forms explained" },
                  { href: "/green-card", label: "Green card guide" },
                  { href: "/usa-government-benefits-immigrants", label: "Benefits, deeming and the public charge rule" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="flex items-center gap-1.5 rounded-xl border border-ink-900/10 px-3.5 py-2.5 text-sm font-semibold text-brand-600 transition hover:border-brand-300"
                    >
                      {l.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mx-auto mt-8 max-w-3xl">
              <AuthorBioBox
                tags={[
                  "US family immigration process",
                  "NRI tax & income documentation",
                  "Sponsoring parents from India",
                ]}
              />
            </div>
          </Container>
        </section>

        <Newsletter />
      </article>
    </>
  );
}
