import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ReviewedByline from "@/components/ReviewedByline";
import AuthorBioBox from "@/components/AuthorBioBox";
import Newsletter from "@/components/Newsletter";
import NotLegalAdvice from "@/components/tools/NotLegalAdvice";
import OfficialSourceBox from "@/components/tools/OfficialSourceBox";
import ToolFaq from "@/components/tools/ToolFaq";
import Eb1RouteFinder from "@/components/tools/Eb1RouteFinder";
import {
  ComparisonMatrix,
  IndiaEb1VsEb2Chart,
} from "@/components/tools/eb1/Eb1Visuals";
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
  ROUTES,
  ROUTE_BY_ID,
  COMPARISON_TABLE,
  EB1A_CRITERIA,
  EB1B_CRITERIA,
  EB1B_EXTRA_REQUIREMENTS,
  DHANASAR_PRONGS,
  EB1_NIW_SOURCES as SRC,
  EB1_NIW_UPDATED as UPDATED,
} from "@/data/eb1NiwData";
import { bulletin, formatCutoff, getCutoffs } from "@/lib/visa-bulletin";
import { monthLabel } from "@/lib/visaBulletinMonths";

const PAGE_PATH = "/green-card/eb1a-vs-eb1b-vs-eb1c-vs-niw";

const eb1India = getCutoffs("eb1", "india");
const eb2India = getCutoffs("eb2", "india");

export const metadata: Metadata = pageMetadata({
  title: "EB-1A vs EB-1B vs EB-1C vs NIW: Which Route Fits You?",
  description:
    "All four skip PERM. What separates them is whether you can self-petition, whether an employer must offer you a job, and what record you can evidence — plus what the choice costs an India-born applicant in years of waiting.",
  path: PAGE_PATH,
  type: "article",
  openGraph: { publishedTime: UPDATED, modifiedTime: UPDATED },
});

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Green Card Guide", url: "/green-card" },
  { name: "EB-1A vs EB-1B vs EB-1C vs NIW", url: PAGE_PATH },
];

const faqs: FaqItem[] = [
  {
    question: "What is the difference between EB-1A and EB-1B?",
    answer:
      "EB-1A is for extraordinary ability and you file it yourself — no employer, no job offer. You need either a one-time major internationally recognised award or at least three of ten listed criteria under 8 CFR 204.5(h). EB-1B is for outstanding professors and researchers, requires an employer to make a formal offer of a tenure-track or permanent research position, and needs two of six criteria plus three years of teaching or research experience under 8 CFR 204.5(i). The practical difference is not difficulty, it is dependence: EB-1A is yours and travels with you, EB-1B belongs to an employer.",
  },
  {
    question: "What is the difference between EB-1C and EB-1A?",
    answer:
      "They have almost nothing in common except the preference category. EB-1C is for multinational managers and executives: at least one year in a managerial or executive capacity in the three years before the petition, with the same employer or a subsidiary or affiliate of the US petitioner. It is about corporate structure and role, not about recognition, and it cannot be self-petitioned. EB-1A is about an individual record of achievement and can be.",
  },
  {
    question: "What is a national interest waiver, and what does NIW mean?",
    answer:
      "The national interest waiver is a route within EB-2. You first qualify for EB-2 — an advanced degree, or a bachelor's plus five years of progressive experience, or exceptional ability — and then ask USCIS to waive the job offer and the labour certification because it is in the national interest to do so. USCIS applies a three-prong framework from Matter of Dhanasar: the proposed endeavour has substantial merit and national importance, you are well positioned to advance it, and on balance it benefits the United States to waive the requirements.",
  },
  {
    question: "Can I self-petition for a green card?",
    answer:
      "On two of these four routes, yes: EB-1A and EB-2 NIW. Both let you file Form I-140 for yourself with no employer and no job offer, which means the petition is yours rather than your company's — it survives a layoff, a change of employer and a change of plan. EB-1B and EB-1C both require an employer to petition for you.",
  },
  {
    question: "Which is easier to get, EB-1A or NIW?",
    answer:
      "Neither is easy, and they are hard in different places. EB-1A asks you to show you are at the very top of your field, and USCIS applies a final merits determination on the record as a whole — meeting three criteria on paper has failed many petitions. NIW asks a lower bar on standing but a specific one on the second prong: whether you are well positioned to advance the endeavour, which means a record of having already advanced it rather than a plan and a strong CV. For an India-born applicant there is also a consideration that has nothing to do with difficulty — see the wait comparison on this page.",
  },
  {
    question: "Does an EB-1 petition need PERM labour certification?",
    answer:
      "No. None of EB-1A, EB-1B or EB-1C requires PERM, and neither does an EB-2 with a national interest waiver — waiving the labour certification is precisely what the waiver does. That is the common ground between all four routes and the reason they are compared against each other rather than against the ordinary EB-2 and EB-3 path, which does require PERM and typically adds a year or more before the I-140 is even filed.",
  },
  {
    question: "Is EB-1 faster than EB-2 for Indian applicants?",
    answer: `It depends on the month, which is the uncomfortable answer. In the ${monthLabel(
      bulletin.month
    )} bulletin, India EB-1 final action is ${formatCutoff(
      eb1India.fad
    )} and India EB-2 is ${formatCutoff(
      eb2India.fad
    )}. For India-born applicants the two queues have crossed and re-crossed over the years, so the right way to read it is the trend across the last three years rather than this month's snapshot — which is what the chart on this page shows.`,
  },
  {
    question: "Can I file more than one of these at the same time?",
    answer:
      "Yes. There is no rule against having concurrent I-140 petitions in different categories, and people with a genuine case for two routes often do file both — an EB-1A alongside an EB-2 NIW, say. Each is adjudicated on its own record, and your priority date is retained from the earlier petition. It costs two filing fees and two evidentiary packages, so it is a decision about time and money rather than about eligibility.",
  },
  {
    question: "What are the ten EB-1A criteria?",
    answer: `8 CFR 204.5(h)(3) lists them: ${EB1A_CRITERIA.map(
      (c) => c.text.charAt(0).toLowerCase() + c.text.slice(1)
    ).join(
      "; "
    )}. You need at least three, unless you hold a one-time major internationally recognised award. Meeting three is necessary but not sufficient — USCIS then applies a final merits determination to the record as a whole.`,
  },
  {
    question: "How many criteria do I need for EB-1B, and what are they?",
    answer: `Two of the six in 8 CFR 204.5(i)(3)(i): ${EB1B_CRITERIA.map(
      (c) => c.text.charAt(0).toLowerCase() + c.text.slice(1)
    ).join(
      "; "
    )}. Three further requirements sit outside that list: at least three years of teaching or research experience, a tenured, tenure-track or permanent research offer, and — if the employer is private — a research department employing at least three full-time researchers with documented accomplishments.`,
  },
  {
    question: "What are the three prongs of a national interest waiver?",
    answer: `${DHANASAR_PRONGS.map(
      (p) => `${p.n}. ${p.prong}`
    ).join(
      ". "
    )}. All three must be satisfied. In practice the second is where petitions fail: it asks for evidence that you have already advanced this specific endeavour, not that you are qualified to attempt it, so a strong CV and a credible plan on their own are not enough.`,
  },
  {
    question: "Why can the same evidence pass EB-1B and fail EB-1A?",
    answer:
      "Because of one phrase in the regulation. The EB-1A research criterion at 8 CFR 204.5(h)(3)(v) asks for contributions 'of major significance'; the EB-1B equivalent at 204.5(i)(3)(i)(E) asks only for 'original scientific or scholarly research contributions to the academic field'. EB-1A also needs three criteria to EB-1B's two, and both then face a final merits determination on the whole record. The trade is that EB-1B requires an employer to file and to offer a permanent or tenure-track position, which is exactly what most industry researchers cannot produce.",
  },
];

export default function Eb1VsNiwPage() {
  const url = absoluteUrl(PAGE_PATH);

  const jsonLd = jsonLdGraph(
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: "EB-1A vs EB-1B vs EB-1C vs EB-2 NIW: Which Route Fits You?",
      description:
        "The four green card routes that skip PERM, compared on self-petition, job offer, evidentiary test — and what the choice costs an India-born applicant.",
      datePublished: UPDATED,
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
      name: "EB-1 and NIW Route Finder",
      description:
        "Seven questions that narrow four PERM-free green card routes down to the ones actually open to you.",
      url: `${url}#finder`,
      applicationCategory: "UtilitiesApplication",
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
              EB-1A vs EB-1B vs EB-1C vs NIW: which route actually fits you
            </h1>

            {/* ANSWER FIRST */}
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-700 sm:text-lg">
              All four skip PERM. <strong>EB-1A</strong> and{" "}
              <strong>EB-2 NIW</strong> let you self-petition with no employer;{" "}
              <strong>EB-1B</strong> needs a permanent academic or research offer
              and <strong>EB-1C</strong> needs a year managing abroad for the same
              company group. If you were born in India, the choice is also between
              two very different queues.
            </p>

            <ul className="mt-5 grid max-w-3xl gap-2 sm:grid-cols-2">
              {[
                "None of the four requires PERM — that is the common ground",
                "Self-petition: EB-1A and EB-2 NIW only",
                "EB-1A: a major international award, or 3 of 10 criteria (8 CFR 204.5(h))",
                "EB-1B: 2 of 6 criteria + 3 years' experience + a permanent offer (204.5(i))",
                "EB-1C: 1 year managing abroad in the last 3, same company group (204.5(j))",
                "NIW: qualify for EB-2 first, then the three Dhanasar prongs",
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

        <section id="finder" className="scroll-mt-24 bg-ink-900/[0.02] py-10 sm:py-14">
          <Container>
            <div className="mx-auto mb-6 max-w-3xl">
              <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                Which route fits me?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                Seven questions. The useful output is not a ranking — it is which
                routes your answers close, because a route that requires something
                you do not have is not a weaker option, it is not an option.
              </p>
            </div>
            <Eb1RouteFinder />
          </Container>
        </section>

        <section className="border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <div className="mx-auto max-w-[760px] space-y-10 text-[0.975rem] leading-relaxed text-ink-700">
              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  The four routes side by side
                </h2>
                <ComparisonMatrix />

                <p className="mt-6">
                  The same comparison in full, with the rows the diagram has no
                  room for. Read it top to bottom: the first row is the one that
                  decides the answer for most India-born applicants, and the
                  second-to-last is the one that catches people who assumed
                  ticking boxes was the whole test.
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[720px] border-collapse text-sm">
                    <caption className="sr-only">
                      EB-1A, EB-1B, EB-1C and EB-2 NIW compared across eight
                      dimensions
                    </caption>
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          &nbsp;
                        </th>
                        {ROUTES.map((r) => (
                          <th
                            key={r.id}
                            scope="col"
                            className="py-2 pr-3 font-bold text-ink-900"
                          >
                            {r.short}
                            <span className="block text-[0.7rem] font-normal text-ink-500">
                              {r.label}
                            </span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {COMPARISON_TABLE.map((row) => (
                        <tr key={row.label} className="border-b border-ink-900/5 align-top">
                          <th
                            scope="row"
                            className="py-3 pr-3 text-left font-semibold text-ink-800"
                          >
                            {row.label}
                            {row.note ? (
                              <span className="mt-1 block text-[0.7rem] font-normal text-ink-400">
                                {row.note}
                              </span>
                            ) : null}
                          </th>
                          {ROUTES.map((r) => (
                            <td key={r.id} className="py-3 pr-3">
                              {row.values[r.id]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div id="criteria" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  The criteria themselves, as the regulation writes them
                </h2>
                <p className="mt-3">
                  Almost everything written about &ldquo;EB-1A vs EB-1B&rdquo;
                  describes these lists. Here they are instead. Read the two
                  side by side and the real difference shows up in the wording,
                  not in the count: EB-1A asks for contributions{" "}
                  <em>of major significance</em>, and EB-1B does not. That one
                  phrase is why a solid academic record can clear EB-1B and fail
                  EB-1A on the same evidence.
                </p>

                <h3 className="mt-6 text-base font-bold text-ink-900">
                  EB-1A — meet three of these ten
                </h3>
                <p className="mt-1 text-sm text-ink-500">
                  8 CFR 204.5(h)(3). You can skip the list entirely with a
                  one-time major internationally recognised award — a Nobel, an
                  Olympic medal, an Academy Award. Almost nobody does.
                </p>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full min-w-[640px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          #
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          What 8 CFR 204.5(h)(3) says
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          What it takes in practice
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {EB1A_CRITERIA.map((c) => (
                        <tr key={c.ref} className="border-b border-ink-900/5 align-top">
                          <td className="py-3 pr-3 font-semibold text-ink-800">{c.ref}</td>
                          <td className="py-3 pr-3 italic">{c.text}</td>
                          <td className="py-3">{c.plain}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h3 className="mt-8 text-base font-bold text-ink-900">
                  EB-1B — meet two of these six
                </h3>
                <p className="mt-1 text-sm text-ink-500">
                  8 CFR 204.5(i)(3)(i), plus three requirements that sit outside
                  the list.
                </p>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full min-w-[640px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          #
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          What 8 CFR 204.5(i)(3)(i) says
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          What it takes in practice
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {EB1B_CRITERIA.map((c) => (
                        <tr key={c.ref} className="border-b border-ink-900/5 align-top">
                          <td className="py-3 pr-3 font-semibold text-ink-800">{c.ref}</td>
                          <td className="py-3 pr-3 italic">{c.text}</td>
                          <td className="py-3">{c.plain}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
                  <p className="text-sm font-bold text-ink-900">
                    And three things the six criteria do not cover
                  </p>
                  <dl className="mt-2 space-y-2.5">
                    {EB1B_EXTRA_REQUIREMENTS.map((r) => (
                      <div key={r.cite}>
                        <dt className="text-sm font-semibold text-ink-800">{r.label}</dt>
                        <dd className="text-sm text-ink-600">
                          {r.detail}{" "}
                          <span className="text-xs text-ink-400">{r.cite}</span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-3 text-sm text-ink-600">
                    The offer requirement, not the criteria, is what rules most
                    industry researchers out of EB-1B — which is why so many of
                    them end up choosing between EB-1A and{" "}
                    {ROUTE_BY_ID.niw.short} instead.
                  </p>
                </div>

                <h3 className="mt-8 text-base font-bold text-ink-900">
                  EB-2 NIW — the three Dhanasar prongs
                </h3>
                <p className="mt-1 text-sm text-ink-500">
                  USCIS Policy Manual Vol. 6, Pt. F, Ch. 5, applying Matter of
                  Dhanasar. All three must be satisfied; they are not a
                  three-of-three checklist so much as three separate arguments.
                </p>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full min-w-[680px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Prong
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          What it asks for
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          How petitions fail it
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {DHANASAR_PRONGS.map((p) => (
                        <tr key={p.n} className="border-b border-ink-900/5 align-top">
                          <td className="py-3 pr-3">
                            <span className="font-semibold text-ink-800">{p.n}.</span>{" "}
                            {p.prong}
                          </td>
                          <td className="py-3 pr-3">{p.asks}</td>
                          <td className="py-3 text-ink-500">{p.fails}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  What each one actually asks of you
                </h2>
                <div className="mt-4 space-y-5">
                  {ROUTES.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-2xl border border-ink-900/5 bg-ink-900/[0.02] p-5"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="text-base font-bold text-ink-900">
                          {r.short} — {r.label}
                        </h3>
                        <span className="rounded-full bg-white px-2.5 py-0.5 text-[0.7rem] font-semibold text-ink-600">
                          {r.preference}
                          {r.selfPetition ? " · self-petition" : " · employer files"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm">
                        <strong className="text-ink-900">The test.</strong> {r.test}
                      </p>
                      <p className="mt-2 text-sm">
                        <strong className="text-ink-900">Who it fits.</strong> {r.fits}
                      </p>
                      <p className="mt-2 text-sm">
                        <strong className="text-ink-900">Where it gets hard.</strong>{" "}
                        {r.hard}
                      </p>
                      <p className="mt-2 text-xs text-ink-400">{r.cite}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  The part that matters if you were born in India
                </h2>
                <p className="mt-3">
                  Everywhere else, this is a paperwork decision: which evidentiary
                  test you can meet, whether you need an employer. For an
                  India-born applicant it is also a decision about years of your
                  life, because EB-1 and EB-2 are separate queues with separate
                  per-country limits, and they move at different speeds.
                </p>
                <p className="mt-3">
                  In the {monthLabel(bulletin.month)} bulletin, India EB-1 final
                  action sits at <strong>{formatCutoff(eb1India.fad)}</strong> and
                  India EB-2 at <strong>{formatCutoff(eb2India.fad)}</strong>. But
                  a single month is a poor guide — these two lines have crossed
                  and re-crossed, and a category can go Unavailable entirely when
                  a fiscal year&apos;s numbers run out.
                </p>
                <div className="overflow-x-auto">
                  <div className="min-w-[380px]">
                    <IndiaEb1VsEb2Chart bulletinMonth={bulletin.month} />
                  </div>
                </div>
                <p className="mt-3">
                  What follows from that is a strategy point rather than a legal
                  one. A NIW that is approvable this year and an EB-1A that might
                  be approvable in two years are not simply two routes to the same
                  place — they are two different priority dates, and for India the
                  gap between them can be measured in years rather than months.
                  Filing the achievable one now and the ambitious one later is a
                  legitimate sequence, and the earlier priority date is retained.
                </p>
                <p className="mt-3">
                  For the wider picture,{" "}
                  <Link href="/green-card/green-card-backlog-india" className="text-brand-600 underline">
                    how long the India backlog really is
                  </Link>{" "}
                  and{" "}
                  <Link href="/visa-bulletin/eb1-india" className="text-brand-600 underline">
                    EB-1 India
                  </Link>{" "}
                  go further, and{" "}
                  <Link href="/tools/priority-date-checker" className="text-brand-600 underline">
                    the priority date checker
                  </Link>{" "}
                  will tell you where your own date stands in each.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Self-petitioning: what it really buys
                </h2>
                <p className="mt-3">
                  EB-1A and NIW let you file Form I-140 for yourself. The obvious
                  benefit is that you do not need an employer to agree. The
                  benefit people underrate is that the petition is{" "}
                  <em>yours</em> — it does not evaporate in a layoff, it does not
                  need a new employer&apos;s co-operation when you move, and it is
                  not leverage your company holds over you.
                </p>
                <p className="mt-3">
                  For someone in the India queue, where the wait can outlast
                  several jobs, that durability is worth more than it looks on the
                  day you file.{" "}
                  <Link href="/green-card/change-jobs-after-i140" className="text-brand-600 underline">
                    Changing jobs after an I-140
                  </Link>{" "}
                  covers what happens to an employer-filed petition when you
                  leave, which is the comparison worth making.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Practical notes
                </h2>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>
                    <strong>You can file more than one.</strong> Concurrent I-140s
                    in different categories are allowed, each adjudicated on its
                    own record, and the earlier priority date is retained.
                  </li>
                  <li>
                    <strong>Premium processing is available</strong> for I-140s in
                    these categories, though the period differs by classification
                    —{" "}
                    <Link href="/i140-premium-processing" className="text-brand-600 underline">
                      the I-140 premium processing page
                    </Link>{" "}
                    has the current fees and periods. It speeds the petition, not
                    the visa bulletin.
                  </li>
                  <li>
                    <strong>An approved I-140 is not a green card.</strong> It
                    establishes the category and the priority date. The wait, and
                    then the I-485 or consular stage, still follow —{" "}
                    <Link href="/i140-processing-time" className="text-brand-600 underline">
                      I-140 processing times
                    </Link>{" "}
                    covers the first half and{" "}
                    <Link href="/i485-timeline" className="text-brand-600 underline">
                      the I-485 timeline
                    </Link>{" "}
                    the second.
                  </li>
                  <li>
                    <strong>Nobody assesses these on a checklist.</strong> EB-1A
                    has a final merits determination on the whole record, and NIW
                    turns on a prong that asks what you have already moved. The
                    difference between a strong and a weak petition on identical
                    facts is largely how the record is assembled.
                  </li>
                </ul>
              </div>
            </div>
          </Container>
        </section>

        <section className="bg-ink-900/[0.02] py-12 sm:py-16">
          <Container>
            <ToolFaq items={faqs} />
          </Container>
        </section>

        <section className="py-12">
          <Container>
            <OfficialSourceBox
              title="Sources and last verified"
              intro={`Criteria counts and requirements read from the regulation and the USCIS Policy Manual on ${formatDate(
                UPDATED
              )}. Cutoff dates come from the ${monthLabel(
                bulletin.month
              )} visa bulletin.`}
              links={[
                { label: "8 CFR 204.5 — (h) extraordinary ability, (i) outstanding researchers, (j) multinational managers", href: SRC.cfr2045 },
                { label: "USCIS — employment-based first preference (EB-1)", href: SRC.eb1 },
                { label: "USCIS — employment-based second preference (EB-2)", href: SRC.eb2 },
                { label: "USCIS Policy Manual, Vol. 6, Pt. F, Ch. 5 — NIW", href: SRC.niwPolicyManual },
                { label: "USCIS policy alert — national interest waivers", href: SRC.niwPolicyAlert },
                { label: "Form I-140", href: SRC.i140 },
                { label: "Visa bulletin (Department of State)", href: SRC.visaBulletin },
              ]}
            />

            <div className="mx-auto mt-6 max-w-3xl">
              <NotLegalAdvice />
            </div>

            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card">
              <h2 className="text-base font-bold text-ink-900">Related</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {[
                  { href: "/green-card/eb2-vs-eb3-india", label: "EB-2 vs EB-3 for India" },
                  { href: "/green-card/green-card-backlog-india", label: "How long the India backlog really is" },
                  { href: "/visa-bulletin/eb1-india", label: "EB-1 India cutoffs" },
                  { href: "/i140-processing-time", label: "I-140 processing time" },
                  { href: "/i140-premium-processing", label: "I-140 premium processing" },
                  { href: "/green-card/change-jobs-after-i140", label: "Changing jobs after an I-140" },
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
                  "Employment green card routes",
                  "India EB backlog",
                  "Self-petition strategy",
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
