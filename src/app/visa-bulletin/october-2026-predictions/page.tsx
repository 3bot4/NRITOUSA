import type { Metadata } from "next";
import Link from "next/link";
import Eb2OctoberOutlook from "@/components/Eb2OctoberOutlook";
import {
  pageMetadata,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  absoluteUrl,
  type FaqItem,
} from "@/lib/seo";
import { site } from "@/lib/site";

/**
 * /visa-bulletin/october-2026-predictions — a standalone analysis page, not a
 * cluster child. It deliberately does NOT use the shared visa-bulletin article
 * template (hero, ArticleBody fences, status card, movement table): this is a
 * press/citation-oriented document with its own layout — kicker, TL;DR, stat
 * tiles, dense tables, quotable glossary, citation box and methodology footer.
 *
 * Styling is scoped to `.vboct` and inlined here rather than pulled into
 * Tailwind, so the document keeps its own typographic scale (820px measure,
 * 17px/1.65 body) without leaking into the rest of the site. The site CSP
 * allows style-src 'unsafe-inline'.
 *
 * The dark-mode block from the source document is intentionally omitted: the
 * surrounding site chrome (nav, footer) is light-only, so honouring
 * prefers-color-scheme here would render a dark article inside a light shell.
 *
 * Figures carry the corrections verified against DOS and Cato sources — most
 * importantly that DOS called the October advance "likely" and conditioned it,
 * rather than committing to it.
 */

const PATH = "/visa-bulletin/october-2026-predictions";
const PUBLISHED = "2026-08-19";
const TITLE =
  "October 2026 Visa Bulletin Predictions: EB-2 India Set for Its Largest October Jump in Four Years";
const SEO_TITLE =
  "October 2026 Visa Bulletin Predictions: EB-2 India FY2027 Reset Analysis";
const DESCRIPTION =
  "EB-2 India is Unavailable until Sept 30, 2026. Our FY2027 reset analysis: DOS says a return to at least July 15, 2014 is likely — the largest October advancement in four years. Statutory math, verified historical data, and what it means for your priority date.";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: SEO_TITLE,
    description: DESCRIPTION,
    path: PATH,
    type: "article",
    openGraph: {
      publishedTime: PUBLISHED,
      modifiedTime: PUBLISHED,
    },
  });
}

const FAQS: FaqItem[] = [
  {
    question: "Will EB-2 India jump back to July 2014 in October 2026?",
    answer:
      "Most likely, but it is not guaranteed. The State Department said it is “likely” that in October the final action date will advance to at least the final action date announced in the May 2026 Visa Bulletin, which was July 15, 2014. DOS attached an explicit condition: the date depends on demand for EB-2 numbers by Indian applicants and on the FY2027 annual limit for employment-based visas. No specific date has been promised.",
  },
  {
    question: "Why did EB-2 India become Unavailable in July 2026?",
    answer:
      "Arithmetic, not policy. India’s pro-rated EB-2 limit for FY2026 was reached, making the category unavailable for the remainder of the fiscal year. India received an estimated 9,300 EB-2 numbers in FY2026 — roughly three times its statutory 7% floor, thanks to unused numbers falling over from other countries — and demand still exhausted it two months before year end. Visa numbers reset on October 1.",
  },
  {
    question: "When will the October 2026 Visa Bulletin be released?",
    answer:
      "The Department of State typically publishes each month’s bulletin in the second week of the preceding month, so expect the October 2026 bulletin around the second week of September 2026. Release has occasionally slipped into the third week. USCIS then announces within a few days whether it will accept Dates for Filing or Final Action Dates for adjustment of status filings.",
  },
  {
    question: "Does the October reset mean I get my green card sooner?",
    answer:
      "The reset restores visa availability; it does not shrink the queue. If USCIS adopts the Dates for Filing chart, applicants with earlier priority dates can file I-485 and receive interim benefits (EAD, Advance Parole) — but the green card itself is only issued when the Final Action Date passes their priority date. This is the Filing vs. Issuance Gap.",
  },
  {
    question: "Can EB-2 India retrogress again after October 2026?",
    answer:
      "Yes, and it historically does. The pattern has been a strong October reset, gradual advancement through winter and spring, then retrogression or unavailability the following summer once India’s annual share is consumed. An October date is a starting position for the fiscal year, not a floor that holds all year.",
  },
  {
    question: "Does “Unavailable” affect my pending I-485, EAD or Advance Parole?",
    answer:
      "No. Unavailability stops final action — issuance and approval — not the rest of the process. A pending I-485 stays pending, biometrics and interviews continue to be scheduled, and EAD and Advance Parole applications and renewals are adjudicated on their own timelines regardless of visa number availability.",
  },
];

const CSS = `
.vboct{--vb-bg:#fff;--vb-surface:#f6f8fa;--vb-ink:#1f2328;--vb-ink2:#57606a;--vb-line:#d0d7de;--vb-accent:#0a5adb;--vb-accent-bg:#eef4ff;
  max-width:820px;margin:0 auto;padding:40px 16px 60px;color:var(--vb-ink);
  font:17px/1.65 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif}
.vboct h1{font-size:32px;line-height:1.25;margin:0 0 8px;font-weight:800;letter-spacing:-.01em}
.vboct h2{font-size:23px;margin:44px 0 12px;font-weight:750;letter-spacing:-.01em}
.vboct h3{font-size:18px;margin:28px 0 8px;font-weight:700}
.vboct p{margin:0 0 14px}
.vboct .kicker{color:var(--vb-accent);font-weight:600;font-size:14px;text-transform:uppercase;letter-spacing:.05em}
.vboct .byline{color:var(--vb-ink2);font-size:15px;margin:6px 0 24px}
.vboct .tldr{background:var(--vb-accent-bg);border-left:4px solid var(--vb-accent);border-radius:0 8px 8px 0;padding:14px 18px;font-size:16.5px}
.vboct .tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin:26px 0}
.vboct .tile{background:var(--vb-surface);border:1px solid var(--vb-line);border-radius:10px;padding:16px 18px}
.vboct .tile .n{font-size:30px;font-weight:750;line-height:1.1;letter-spacing:-.01em}
.vboct .tile .l{color:var(--vb-ink2);font-size:13.5px;margin-top:4px;line-height:1.4}
.vboct .tw{margin:14px 0;overflow-x:auto;-webkit-overflow-scrolling:touch}
.vboct table{width:100%;min-width:640px;border-collapse:collapse;font-size:15.5px;background:var(--vb-surface);border:1px solid var(--vb-line);border-radius:8px;overflow:hidden}
.vboct th{text-align:left;font-size:12.5px;text-transform:uppercase;letter-spacing:.03em;color:var(--vb-ink2);font-weight:600}
.vboct th,.vboct td{padding:10px 12px;border-bottom:1px solid var(--vb-line);vertical-align:top;
  /* The site sets a global overflow-wrap:anywhere for mobile overflow safety,
     which breaks words mid-word in narrow cells ("CONFI/DENC/E"). Tables here
     scroll inside .tw instead of hyphenating themselves apart. */
  overflow-wrap:normal;word-break:normal;hyphens:none}
.vboct tr:last-child td{border-bottom:none}
.vboct .hl td{background:var(--vb-accent-bg);font-weight:600}
.vboct .term{background:var(--vb-surface);border:1px solid var(--vb-line);border-radius:10px;padding:14px 18px;margin:12px 0}
.vboct .term b{color:var(--vb-accent)}
.vboct .note{display:block;border:1px dashed var(--vb-line);border-radius:8px;padding:12px 16px;color:var(--vb-ink2);font-size:15px;margin:16px 0}
.vboct .cite{background:var(--vb-surface);border:1px solid var(--vb-line);border-radius:10px;padding:16px 18px;margin:24px 0;font-size:15px}
.vboct .cite code{display:block;background:var(--vb-bg);border:1px solid var(--vb-line);border-radius:6px;padding:10px 12px;margin-top:8px;font-size:13.5px;line-height:1.5;white-space:normal}
.vboct a{color:var(--vb-accent)}
.vboct .muted{color:var(--vb-ink2)}
.vboct .small{font-size:14px}
.vboct .faq h3{margin:22px 0 6px}
.vboct footer{border-top:1px solid var(--vb-line);margin-top:48px;padding-top:16px;color:var(--vb-ink2);font-size:14px;line-height:1.6}
@media(max-width:640px){
  .vboct{font-size:16px;padding:28px 16px 48px}
  .vboct h1{font-size:26px}
  .vboct h2{font-size:21px}
  .vboct th,.vboct td{padding:8px 8px;font-size:14px}
  .vboct table{min-width:520px}
}
`;

export default function October2026PredictionsPage() {
  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Visa Bulletin Guide", url: "/visa-bulletin" },
    { name: "October 2026 Predictions", url: PATH },
  ];

  const articleJsonLd = {
    "@type": "Article",
    "@id": `${absoluteUrl(PATH)}#article`,
    headline: SEO_TITLE,
    description: DESCRIPTION,
    datePublished: PUBLISHED,
    dateModified: PUBLISHED,
    author: { "@type": "Organization", name: site.publisher },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(PATH) },
    url: absoluteUrl(PATH),
    inLanguage: "en-US",
    isAccessibleForFree: true,
  };

  const jsonLd = jsonLdGraph(
    articleJsonLd,
    breadcrumbJsonLd(crumbs),
    faqJsonLd(FAQS)
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <article className="vboct">
        <div className="kicker">Visa Bulletin Analysis · FY2027 Reset</div>
        <h1>{TITLE}</h1>
        <p className="byline">
          By Deepak Middha, NRItoUSA.com · Published August 19, 2026 · Updated
          with each State Department release ·{" "}
          <Link href="/press">Press &amp; data inquiries</Link>
        </p>

        <p className="tldr">
          <strong>TL;DR:</strong> EB-2 India retrogressed 10.5 months in June
          2026, then went <strong>Unavailable in the July 2026 bulletin</strong>{" "}
          — India&rsquo;s annual visa numbers ran out. On October 1, FY2027
          numbers reset, and the State Department has said it is{" "}
          <strong>likely</strong> EB-2 India will advance{" "}
          <strong>to at least July 15, 2014</strong>, while warning the outcome
          &ldquo;is dependent on the demand for EB-2 numbers by Indian applicants
          and the FY 2027 annual limit.&rdquo; Measured against last
          October&rsquo;s date (April 1, 2013), that would be a{" "}
          <strong>
            +15.5-month advancement — the largest October jump for EB-2 India in
            four years
          </strong>
          . The reset restores availability; it does not shrink the queue.
        </p>

        <div className="tiles">
          <div className="tile">
            <div className="n">~2,802</div>
            <div className="l">
              EB-2 green cards India can receive per year at the statutory floor
              (7% of 40,040) — a floor, not what it actually receives
            </div>
          </div>
          <div className="tile">
            <div className="n">+15.5 mo</div>
            <div className="l">
              Predicted October snapback for EB-2 India Final Action — largest
              since FY2024
            </div>
          </div>
          <div className="tile">
            <div className="n">1.1M</div>
            <div className="l">
              Indian nationals (incl. dependents) waiting in the employment-based
              backlog (Cato Institute analysis of USCIS inventory)
            </div>
          </div>
        </div>

        <h2>EB-2 India Final Action Date — the whole story in one chart</h2>
        <Eb2OctoberOutlook className="!max-w-full" />

        <h2>Where things stand now (August–September 2026)</h2>
        <div className="tw">
          <table>
            <thead>
              <tr>
                <th>Category (India)</th>
                <th>Final Action Date</th>
                <th>Dates for Filing</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>EB-1</td>
                <td>October 15, 2022</td>
                <td>December 1, 2023</td>
              </tr>
              <tr className="hl">
                <td>EB-2</td>
                <td>Unavailable</td>
                <td>January 15, 2015</td>
              </tr>
              <tr>
                <td>EB-3</td>
                <td>January 1, 2014</td>
                <td>January 15, 2015</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          EB-2 India went Unavailable in the July 2026 bulletin — in the State
          Department&rsquo;s words, &ldquo;India&rsquo;s pro-rated EB-2 limit was
          reached and the category is unavailable for the remainder of FY
          2026&rdquo; — what we call the <strong>Summer Cap Cliff</strong> (see
          glossary below). This is arithmetic, not a policy change: India&rsquo;s
          EB-2 allotment was exhausted roughly two months before the fiscal year
          ends on September 30.
        </p>

        <h2>Our October 2026 (FY2027) predictions</h2>
        <div className="tw">
          <table>
            <thead>
              <tr>
                <th>Category (India)</th>
                <th>Prediction — Final Action</th>
                <th>Confidence</th>
                <th>Basis</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hl">
                <td>EB-2</td>
                <td>Returns to ≥ July 15, 2014</td>
                <td>High</td>
                <td>
                  DOS said an advance to &ldquo;at least&rdquo; the May 2026 date
                  is likely once FY2027 numbers open Oct 1 — conditioned on India
                  EB-2 demand and the FY2027 limit
                </td>
              </tr>
              <tr>
                <td>EB-1</td>
                <td>Recovers toward April 1, 2023 (April 2026 level)</td>
                <td>Medium</td>
                <td>
                  EB-1 India lost ~5.5 months over the summer to the same cap
                  exhaustion; October resets typically restore pre-summer dates
                </td>
              </tr>
              <tr>
                <td>EB-3</td>
                <td>Modest advancement past January 1, 2014</td>
                <td>Medium</td>
                <td>
                  Fresh-year numbers historically buy weeks-to-months of movement
                </td>
              </tr>
              <tr>
                <td>Dates for Filing (EB-2/EB-3)</td>
                <td>Little to no movement from January 15, 2015</td>
                <td>Medium-high</td>
                <td>
                  DFF barely moved all year; it is the demand-management lever
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="small muted">
          Only the EB-2 row rests on an on-the-record DOS statement. The EB-1 and
          EB-3 rows are inference from how past October resets behaved, which is
          a materially weaker basis — treat them accordingly. DOS guaranteed no
          specific date.
        </p>

        <h2>The October &ldquo;Snapback,&rdquo; verified: four years of data</h2>
        <p>
          Every cell below is taken directly from the official State Department
          bulletin for that month — EB-2 India, October editions (the first
          bulletin of each fiscal year):
        </p>
        <div className="tw">
          <table>
            <thead>
              <tr>
                <th>October bulletin (fiscal year)</th>
                <th>EB-2 India — Final Action</th>
                <th>EB-2 India — Dates for Filing</th>
                <th>FAD movement vs prior October</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Oct 2023 (FY2024)</td>
                <td>January 1, 2012</td>
                <td>May 15, 2012</td>
                <td>−3 months (retrogressed)</td>
              </tr>
              <tr>
                <td>Oct 2024 (FY2025)</td>
                <td>July 15, 2012</td>
                <td>January 1, 2013</td>
                <td>+6.5 months</td>
              </tr>
              <tr>
                <td>Oct 2025 (FY2026)</td>
                <td>April 1, 2013</td>
                <td>December 1, 2013</td>
                <td>+8.5 months</td>
              </tr>
              <tr className="hl">
                <td>Oct 2026 (FY2027) — predicted</td>
                <td>≥ July 15, 2014</td>
                <td>≈ January 15, 2015</td>
                <td>+15.5 months (largest of the series)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="small muted">
          Why the big jump? During FY2026, EB-2 India had already advanced to
          July 15, 2014 — reached in the <strong>April 2026</strong> bulletin and
          held through May — before the June retrogression and July
          unavailability. The October reset restores the high-water mark rather
          than resuming from last October&rsquo;s date — the{" "}
          <strong>Fiscal Year Reset Snapback</strong>.
        </p>

        <h2>
          The statutory math (INA §201–202): why &ldquo;Unavailable&rdquo; keeps
          happening
        </h2>
        <p>
          The worldwide employment-based limit has a statutory floor of{" "}
          <strong>140,000</strong> per fiscal year (INA §201(d)). EB-1, EB-2, and
          EB-3 each receive 28.6% of it — <strong>40,040 visas per category</strong>
          . The per-country ceiling (INA §202) is 7%, so at the floor:
        </p>
        <div className="tw">
          <table>
            <thead>
              <tr>
                <th>Preference category</th>
                <th>Worldwide allocation (at 140,000 floor)</th>
                <th>Per-country ceiling</th>
                <th>Base annual India allotment</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>EB-1</td>
                <td>40,040</td>
                <td>7.0%</td>
                <td>~2,802</td>
              </tr>
              <tr>
                <td>EB-2</td>
                <td>40,040</td>
                <td>7.0%</td>
                <td>~2,802</td>
              </tr>
              <tr>
                <td>EB-3</td>
                <td>40,040</td>
                <td>7.0%</td>
                <td>~2,802</td>
              </tr>
              <tr className="hl">
                <td>Total, EB-1–EB-3</td>
                <td>120,120</td>
                <td>7.0%</td>
                <td>~8,406</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="small muted">
          The 7% figure is a <strong>ceiling applied through pro-rating</strong>,
          not a quota India is guaranteed — and per-country limits yield to the
          &ldquo;otherwise unused&rdquo; rule. India routinely receives well above
          the base: in FY2026 the EB pool was 186,000, putting India&rsquo;s EB-2
          floor near 3,700, and India in fact received an estimated{" "}
          <strong>~9,300 EB-2 numbers</strong> — roughly three times the floor —
          and still exhausted the category two months early. The base math is why
          the queue moves in months per year, not years per year.
        </p>

        <h3>The supply squeeze journalists should watch</h3>
        <p>
          The total EB supply is the floor <em>plus</em> the previous
          year&rsquo;s unused family-based numbers. That spillover swings hard
          year to year — it has not simply shrunk since the pandemic peak:
        </p>
        <div className="tw">
          <table>
            <thead>
              <tr>
                <th>Fiscal year</th>
                <th>Total employment-based limit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>FY2021</td>
                <td>262,288</td>
              </tr>
              <tr>
                <td>FY2022</td>
                <td>281,507 (all-time high)</td>
              </tr>
              <tr>
                <td>FY2023</td>
                <td>197,091</td>
              </tr>
              <tr>
                <td>FY2024</td>
                <td>160,791</td>
              </tr>
              <tr>
                <td>FY2025</td>
                <td>150,000</td>
              </tr>
              <tr className="hl">
                <td>FY2026</td>
                <td>186,000 (140,000 floor + ~46,000 family fall-up) — up 24%</td>
              </tr>
              <tr>
                <td>FY2027</td>
                <td>
                  Announced with the October bulletin — the single biggest
                  variable in this forecast
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>The backlog-to-quota ratio</h3>
        <p>
          The Cato Institute&rsquo;s analysis of USCIS and State Department
          inventory data (David J. Bier) puts the total employment-based green
          card backlog at roughly <strong>1.8 million people</strong>, of whom
          about <strong>1.1 million are Indian nationals</strong> — principal
          applicants plus dependents, most of them in EB-2 and EB-3. Against an
          India allotment measured in single-digit thousands per year, Cato
          estimates a new EB-2 India applicant today faces a wait measured in
          decades, with a widely cited figure of <strong>134 years</strong> at
          then-current rates, and projects that about <strong>424,000</strong>{" "}
          employment-based applicants will die waiting — more than 90% of them
          Indian.
        </p>

        <h2>Three terms that explain everything (quotable glossary)</h2>
        <div className="term">
          <b>The Fiscal Year Reset Snapback</b> — why a category goes from
          &ldquo;Unavailable&rdquo; on September 30 to a real date on October 1
          with zero policy change: the annual quota simply refills, and the date
          returns to the year&rsquo;s high-water mark.
        </div>
        <div className="term">
          <b>The Summer Cap Cliff</b> — the recurring arithmetic event where
          India&rsquo;s 7% allotment runs out 60–90 days before the fiscal year
          ends, forcing retrogression or unavailability in the July–September
          bulletins. It has happened in some form in each of the last four fiscal
          years.
        </div>
        <div className="term">
          <b>The Filing vs. Issuance Gap</b> — when USCIS accepts the Dates for
          Filing chart in October, applicants can file I-485 and receive interim
          benefits (work permit, travel document) — but no green card is issued
          until the Final Action Date passes their priority date. Filing
          eligibility is not issuance.
        </div>

        <h2>What this means for you</h2>
        <p>
          <strong>Priority date before July 15, 2014 (EB-2 India):</strong> your
          case can resume moving in October. If your I-485 is pending, watch for
          USCIS&rsquo;s chart decision (below).
        </p>
        <p>
          <strong>Waiting to file:</strong> whether you can file I-485 in October
          depends on which chart USCIS adopts.
        </p>
        <span className="note">
          USCIS typically announces whether it will accept <em>Dates for Filing</em>{" "}
          or <em>Final Action Dates</em> within about 2–3 days of the State
          Department&rsquo;s bulletin release. In the first months of a fiscal
          year, USCIS has usually adopted Dates for Filing.
        </span>
        <p>
          <strong>Date years away:</strong> the honest math doesn&rsquo;t change.
          See exactly where you stand with our{" "}
          <Link href="/tools/priority-date-checker">Priority Date Checker</Link>,
          model the remaining wait with the{" "}
          <Link href="/tools/green-card-tracker">Green Card Tracker</Link>, and if
          your EB-3 date would be current sooner, read the{" "}
          <Link href="/visa-bulletin/eb2-to-eb3-downgrade">
            EB-2 to EB-3 downgrade analysis
          </Link>
          . Ongoing coverage:{" "}
          <Link href="/visa-bulletin/eb2-india">EB-2 India tracker</Link>,{" "}
          <Link href="/visa-bulletin/retrogression">retrogression explained</Link>,
          and{" "}
          <Link href="/visa-bulletin/final-action-date-vs-date-of-filing">
            Final Action vs Dates for Filing
          </Link>
          . If your <strong>spouse was born outside India</strong>, check{" "}
          <Link href="/visa-bulletin/cross-chargeability">cross-chargeability</Link>{" "}
          before any category strategy.
        </p>
        <p>
          <strong>When does the bulletin drop?</strong> Around September 8–15 at
          travel.state.gov. We publish same-day analysis — bookmark this page or
          the{" "}
          <Link href="/visa-bulletin/monthly-update">monthly update guide</Link>.
        </p>

        <h2 className="faq">Frequently asked questions</h2>
        <div className="faq">
          {FAQS.map((f) => (
            <div key={f.question}>
              <h3>{f.question}</h3>
              <p>{f.answer}</p>
            </div>
          ))}
        </div>

        <div className="cite">
          <strong>For journalists &amp; researchers — cite this analysis:</strong>{" "}
          Data cuts by category, priority date, or scenario available same-day:{" "}
          <Link href="/press">nritousa.com/press</Link> · team@nritousa.com
          <code>
            &ldquo;An EB-2 India applicant filing today competes with a backlog of
            over one million people for a few thousand visas a year — and the
            October 2026 bulletin is expected to deliver the category&rsquo;s
            largest October advancement in four years, to July 15, 2014.&rdquo; —
            NRItoUSA.com analysis of U.S. Department of State Visa Bulletin data
            (Oct 2023–Aug 2026)
          </code>
        </div>

        <footer>
          <strong>Methodology &amp; sources:</strong> Final Action and Dates for
          Filing figures verified against the official U.S. Department of State
          Visa Bulletins for October 2023, October 2024, October 2025, April/May
          2026, and August 2026 (travel.state.gov). The October outlook follows
          the DOS notice &ldquo;India Per-Country Limit Reached in the EB-2
          Category,&rdquo; which states an advance to at least the May 2026 final
          action date is likely, dependent on India EB-2 demand and the FY2027
          annual limit. Statutory allocation math per INA §201(d) and §202 (7%
          per-country ceiling; 28.6% per preference category of the 140,000
          floor). Annual EB limits: DOS annual numerical limits, FY2021–FY2026.
          Backlog estimate: Cato Institute analysis of USCIS Form I-485 inventory
          and DOS data (D. Bier). Predictions are analytical estimates, not
          guarantees. Educational content, not legal advice — consult an
          immigration attorney for case-specific decisions. Last updated August
          19, 2026. ·{" "}
          <Link href="/visa-bulletin">All visa bulletin coverage</Link>
        </footer>
      </article>
    </>
  );
}
