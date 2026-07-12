import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import {
  pageMetadata,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  absoluteUrl,
} from "@/lib/seo";
import { site } from "@/lib/site";

/* ------------------------------------------------------------------ *
 * Page constants
 * ------------------------------------------------------------------ */
const PATH = "/immigration-attorney-lawyer-cost";
const H1 =
  "Immigration Attorney Cost in USA: H-1B, Green Card, F-1 & Visa Lawyer Fees";
const META_TITLE =
  "Immigration Lawyer Cost in USA: H-1B, Green Card & Visa Attorney Fees";
const META_DESC =
  "Wondering how much an immigration lawyer costs in the USA? Compare H-1B lawyer fees, green card attorney fees, F-1 visa legal costs, hidden charges, payment plans, and budgeting tips for NRI and immigrant families.";
const PUBLISHED_ISO = "2026-07-07";
const UPDATED_ISO = "2026-07-07";
const UPDATED_HUMAN = "July 7, 2026";

export const metadata: Metadata = pageMetadata({
  title: META_TITLE,
  description: META_DESC,
  path: PATH,
  type: "article",
});

/* ------------------------------------------------------------------ *
 * Table + FAQ data
 * ------------------------------------------------------------------ */
type Row = string[];

const feeRangeCols = [
  "Immigration matter",
  "Typical attorney fee range",
  "Common fee structure",
  "Notes",
];
const feeRangeRows: Row[] = [
  ["Initial consultation", "$100–$400", "Fixed consultation fee", "Some lawyers credit this toward case fees"],
  ["Document review only", "$300–$1,000", "Flat fee or hourly", "Good for DIY filers who want a second review"],
  ["F-1 student visa guidance", "$500–$2,000", "Flat fee or hourly", "Often used for status issues, OPT problems, reinstatement, or denials"],
  ["H-1B petition", "$1,500–$5,000+", "Usually flat fee", "Employer-sponsored; government fees are usually employer responsibility"],
  ["H-1B transfer or extension", "$1,500–$4,500+", "Flat fee", "Complexity depends on job, employer, specialty occupation, and prior status"],
  ["Family-based green card", "$2,500–$7,500+", "Flat fee by stage", "May include I-130, I-485, work permit, travel document, interview prep"],
  ["Marriage green card", "$3,000–$8,000+", "Flat fee", "Higher if prior divorce, overstay, criminal issue, or fraud concern"],
  ["Employment-based green card", "$5,000–$15,000+", "Stage-based flat fee", "PERM, I-140, and I-485 may be billed separately"],
  ["Naturalization / citizenship", "$1,000–$3,500+", "Flat fee", "More if tax, travel, criminal, or good moral character issues"],
  ["RFE response", "$1,000–$5,000+", "Flat fee or hourly", "Depends on complexity and whether the lawyer handled the original filing"],
  ["Waiver or complex case", "$5,000–$15,000+", "Flat fee or hourly", "Hardship waivers, inadmissibility, removal history, fraud concerns"],
];

const h1bCols = ["Cost item", "Usually paid by", "Notes"];
const h1bRows: Row[] = [
  ["Attorney fee for employer H-1B petition", "Employer", "Often handled by employer's immigration law firm"],
  ["USCIS I-129 filing fee", "Employer", "Amount depends on current USCIS rules and employer category"],
  ["ACWIA training fee", "Employer", "Commonly depends on employer size; exemptions may apply"],
  ["Fraud prevention fee", "Employer", "Common in new H-1B or change of employer filings"],
  ["Asylum program fee", "Employer", "Varies by employer type and size"],
  ["Premium processing", "Employer or sometimes requested by employee", "Clarify who pays before filing"],
  ["H-4 dependent application", "Employer or employee depending on policy", "Many employers do not cover dependent costs"],
  ["H-4 EAD", "Usually employee/family", "Ask employer if covered"],
  ["Personal legal consultation", "Employee", "Useful for layoffs, travel, status gaps, stamping risk, or green card planning"],
];

const gcCols = ["Green card type", "Typical attorney fee range", "Why cost changes"];
const gcRows: Row[] = [
  ["Marriage-based green card", "$3,000–$8,000+", "Relationship evidence, interview prep, prior immigration history, overstay issues"],
  ["Parent/child/sibling petition", "$1,500–$5,000+", "Depends on I-130 only vs full adjustment/consular processing"],
  ["EB-1", "$5,000–$15,000+", "Evidence-heavy case with achievements, publications, awards, expert letters"],
  ["EB-2 NIW", "$5,000–$12,000+", "Requires strong national interest argument and documentation"],
  ["EB-2/EB-3 PERM green card", "$6,000–$15,000+", "PERM recruitment, I-140, I-485, employer coordination, audits"],
  ["Adjustment of status only", "$2,000–$6,000+", "May be lower if immigrant petition is already approved"],
];

const f1Cols = ["Situation", "Typical lawyer fee range", "When lawyer may help"];
const f1Rows: Row[] = [
  ["Basic F-1 visa consultation", "$150–$400", "Before visa interview or after prior refusal"],
  ["F-1 change of status", "$1,500–$4,000+", "If changing status inside the U.S."],
  ["OPT/STEM OPT issue review", "$500–$2,000+", "If timing, employer, or unemployment days are a concern"],
  ["F-1 reinstatement", "$2,000–$5,000+", "SEVIS termination, status violation, or missed deadline"],
  ["Visa denial strategy", "$500–$3,000+", "Especially after 214(b) refusal or repeated denials"],
];

const hiddenCols = ["Hidden cost", "Why it matters", "Budget tip"];
const hiddenRows: Row[] = [
  ["USCIS filing fees", "Separate from attorney fee", "Check USCIS Fee Calculator before filing"],
  ["Premium processing", "Optional in some case types", "Use only if timing matters"],
  ["Medical exam", "Required for many green card cases", "Ask local civil surgeons for quotes"],
  ["Translations", "Non-English documents may need certified translation", "Budget per page/document"],
  ["Passport photos", "Small but repeated cost", "Keep updated photos ready"],
  ["Mailing/courier", "Important for paper filings", "Use trackable shipping"],
  ["RFE response", "May not be included in original fee", "Ask before signing agreement"],
  ["Interview preparation", "Sometimes billed separately", "Confirm included hours"],
  ["Dependents", "Each spouse/child may add forms and fees", "Ask for family quote"],
  ["Travel and consular costs", "Visa stamping may involve travel", "Budget for appointment, travel, hotel"],
  ["Appeal or motion", "Not usually included", "Ask what happens if denied"],
];

const budgetCols = [
  "Case example",
  "Attorney fee estimate",
  "Government/other fee estimate",
  "Buffer",
  "Total planning range",
];
const budgetRows: Row[] = [
  ["F-1 OPT issue review", "$500–$2,000", "Filing fees if needed", "$250–$500", "$750–$2,500+"],
  ["H-1B transfer", "$1,500–$4,500", "Employer-side filing fees", "$500–$1,000", "Employer should clarify"],
  ["Marriage green card", "$3,000–$8,000", "USCIS fees, medical, photos", "$1,000–$2,000", "$5,000–$12,000+"],
  ["Employment green card", "$6,000–$15,000", "PERM/I-140/I-485 related costs", "$2,000–$4,000", "$8,000–$20,000+"],
  ["Naturalization", "$1,000–$3,500", "USCIS fee", "$500–$1,000", "$1,500–$4,500+"],
];

const feeStructures = [
  {
    title: "Consultation fee",
    body: "A one-time meeting to review options. Ask whether the fee is credited toward the full case.",
  },
  {
    title: "Flat fee",
    body: "Common for routine immigration filings. Better for budgeting, but confirm what is included.",
  },
  {
    title: "Hourly billing",
    body: "Common for complex cases, RFEs, audits, litigation, or uncertain work.",
  },
  {
    title: "Stage-based billing",
    body: "Common for green card cases where PERM, I-140, and I-485 are charged separately.",
  },
  {
    title: "Monthly payment plan",
    body: "Some firms allow monthly payments, but filing may not begin until a minimum amount is paid.",
  },
  {
    title: "Hybrid fee model",
    body: "A flat fee for the main case plus hourly billing for extra work such as RFE, NOID, appeal, or interview preparation.",
  },
];

const costFactors = [
  "Type of visa or green card",
  "Case complexity",
  "Prior denial, overstay, unlawful presence, or status gap",
  "Criminal record or immigration violation",
  "Need for waiver",
  "Employer size and documentation quality",
  "Number of dependents",
  "Whether RFE/NOID response is included",
  "Attorney location and experience",
  "Speed and premium processing",
  "Consular processing vs adjustment of status",
  "Whether the lawyer must coordinate with employer, HR, school DSO, or foreign documents",
];

const compareChecklist = [
  "Is the lawyer licensed in the U.S.?",
  "Is immigration law a major part of their practice?",
  "Do they handle your exact case type regularly?",
  "Is the fee flat, hourly, or stage-based?",
  "What is included and excluded?",
  "Are USCIS fees included or separate?",
  "Is RFE response included?",
  "Who prepares forms?",
  "Who reviews final filing?",
  "How often will you receive updates?",
  "Will you communicate with attorney, paralegal, or case manager?",
  "Is there a written fee agreement?",
  "What happens if the case is delayed, denied, or transferred?",
  "Are dependents included?",
  "Is interview preparation included?",
  "Are payment plans available?",
];

const questionsToAsk = [
  "What is the total attorney fee for my case?",
  "What government fees are separate?",
  "Is this a flat fee or hourly fee?",
  "What exactly is included?",
  "What is not included?",
  "Are RFEs, NOIDs, appeals, or motions included?",
  "Are spouse and children included?",
  "Will you provide a written fee agreement?",
  "Who will be my main contact?",
  "How long does your office usually take to prepare this type of filing?",
  "What documents do you need from me?",
  "What risks do you see in my case?",
  "What happens if my case is denied?",
  "Can I pay in installments?",
  "Can you give me a government-fee estimate separately from legal fees?",
];

const budgetTips = [
  "First list the immigration goal: H-1B, green card, F-1 issue, citizenship, waiver, etc.",
  "Separate attorney fee from government fee.",
  "Add 15%–25% buffer for unexpected costs.",
  "Ask whether dependents are included.",
  "Ask if RFE response is included.",
  "Avoid choosing only the cheapest attorney for a high-risk case.",
  "For routine cases, compare 2–3 written quotes.",
  "For employer-sponsored H-1B or green card, ask HR what the company covers.",
  "Keep emergency funds for status deadlines, premium processing, travel, and document costs.",
  "Never pay large cash amounts without a written agreement and receipt.",
];

const worthMore = [
  "Prior visa denial",
  "Status gap",
  "H-1B specialty occupation issue",
  "Complicated employer structure",
  "Green card priority date strategy",
  "EB-1 or NIW evidence strategy",
  "Criminal history",
  "Waiver required",
  "Removal/deportation history",
  "Marriage green card with red flags",
  "RFE, NOID, or denial",
];

const mayNotNeed = [
  "Understanding options before talking to employer",
  "Reviewing a prepared form",
  "Asking about travel risk",
  "Checking green card timeline",
  "Reviewing a simple N-400 issue",
  "Planning H-1B to green card strategy",
];

const nriConsiderations = [
  "H-1B to green card backlog",
  "Employer-sponsored PERM timing",
  "H-4 and H-4 EAD costs",
  "Children aging out",
  "F-1 change of status for children",
  "Green card priority date strategy",
  "Travel to India for visa stamping",
  "Document translations and birth certificates",
  "Whether to invest in premium processing",
  "Return-to-India planning if status changes",
];

const faqs = [
  {
    question: "How much does an immigration lawyer cost in the USA?",
    answer:
      "Many immigration lawyers charge $100–$400 for a consultation and anywhere from a few hundred dollars to several thousand dollars for full representation, depending on case type and complexity.",
  },
  {
    question: "How much does an H-1B lawyer cost?",
    answer:
      "H-1B attorney fees often range from about $1,500 to $5,000 or more. Employer-sponsored H-1B legal and required filing costs are commonly paid by the employer, but dependent filings or personal advice may be separate.",
  },
  {
    question: "Who pays H-1B attorney fees?",
    answer:
      "For employer-sponsored H-1B petitions, required employer-side costs are generally the employer's responsibility. Employees should ask HR what is covered before paying anything personally.",
  },
  {
    question: "How much does a green card lawyer cost?",
    answer:
      "Family-based green card attorney fees may range from about $2,500 to $8,000 or more. Employment-based green card cases may range from about $5,000 to $15,000 or more depending on PERM, I-140, I-485, dependents, and case complexity.",
  },
  {
    question: "Are USCIS filing fees included in attorney fees?",
    answer:
      "Usually no. Attorney fees and USCIS filing fees are usually separate. Always ask for a written estimate showing legal fees, government fees, premium processing, and other costs separately.",
  },
  {
    question: "What is a flat-fee immigration lawyer?",
    answer:
      "A flat-fee lawyer charges one set price for a defined service, such as preparing an H-1B petition, green card filing, or naturalization application. Ask what is included and excluded.",
  },
  {
    question: "What hidden costs should I expect?",
    answer:
      "Hidden costs may include premium processing, translations, medical exams, mailing, passport photos, dependents, RFE responses, interview preparation, appeals, and travel for visa stamping.",
  },
  {
    question: "Is the cheapest immigration lawyer a good choice?",
    answer:
      "Not always. A low fee may be fine for a simple case, but complex immigration matters require experience, careful documentation, and clear communication. Compare value, not just price.",
  },
  {
    question: "Can I negotiate immigration attorney fees?",
    answer:
      "Some attorneys offer payment plans or stage-based billing. Many will not negotiate heavily, but you can ask what is included, whether consultation fees are credited, and whether a limited-scope review is available.",
  },
  {
    question: "Do I need a lawyer for F-1 OPT or STEM OPT?",
    answer:
      "Many students file routine OPT or STEM OPT through school guidance, but a lawyer may help if there are status problems, SEVIS termination, denials, timing mistakes, or complex work authorization issues.",
  },
  {
    question: "What should I ask before hiring an immigration attorney?",
    answer:
      "Ask about total legal fees, government fees, what is included, RFE costs, dependents, timeline, communication process, payment plan, written agreement, and experience with your exact case type.",
  },
  {
    question: "How should Indian H-1B families budget for legal fees?",
    answer:
      "Indian H-1B families should budget separately for employer H-1B costs, H-4/H-4 EAD, green card stages, premium processing, visa stamping travel, children's status planning, and emergency legal consultations.",
  },
  {
    question: "Do lawyers charge separately for RFE responses?",
    answer:
      "Many lawyers charge separately for RFE responses unless the original fee agreement says RFE work is included. Ask this before signing.",
  },
  {
    question: "Is a consultation enough or do I need full representation?",
    answer:
      "A consultation may be enough for general planning or a second opinion. Full representation may be better for filings, complex facts, prior denials, status gaps, waivers, RFEs, or employer-sponsored cases.",
  },
];

const JUMP = [
  { label: "Quick answer", href: "#quick-answer" },
  { label: "Fee ranges", href: "#fee-ranges" },
  { label: "Lawyer vs govt fee", href: "#lawyer-vs-govt" },
  { label: "H-1B: who pays?", href: "#h1b-who-pays" },
  { label: "Green card cost", href: "#green-card-cost" },
  { label: "Student / F-1 cost", href: "#student-cost" },
  { label: "Fee structures", href: "#fee-structures" },
  { label: "Cost factors", href: "#cost-factors" },
  { label: "Hidden costs", href: "#hidden-costs" },
  { label: "Compare attorneys", href: "#compare" },
  { label: "Questions to ask", href: "#questions" },
  { label: "How to budget", href: "#budget" },
  { label: "Worth paying more", href: "#worth-more" },
  { label: "NRI families", href: "#nri" },
  { label: "FAQ", href: "#faq" },
];

const NOT_LEGAL_ADVICE =
  "This guide explains typical attorney fee structures and budgeting considerations. It is not legal advice. Immigration rules, USCIS filing fees, and attorney pricing can change. Always confirm current government fees on USCIS.gov and request a written fee agreement from the attorney.";

/* ------------------------------------------------------------------ *
 * Small presentational helpers
 * ------------------------------------------------------------------ */
function SectionH2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-2xl font-bold tracking-tight text-ink-900">
      {children}
    </h2>
  );
}

function DataTable({ cols, rows }: { cols: string[]; rows: Row[] }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="bg-ink-50 text-ink-700">
            {cols.map((c) => (
              <th key={c} className="border-b border-ink-900/10 px-4 py-3 font-semibold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={i % 2 ? "bg-ink-50/40" : "bg-white"}>
              {r.map((cell, j) => (
                <td
                  key={j}
                  className={`border-b border-ink-900/5 px-4 py-3 align-top text-ink-600 ${
                    j === 0 ? "font-semibold text-ink-900" : ""
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Callout({
  tone,
  title,
  children,
}: {
  tone: "info" | "warn" | "danger" | "tip";
  title: string;
  children: React.ReactNode;
}) {
  const map = {
    info: "border-brand-200 bg-brand-50 text-brand-900",
    warn: "border-amber-200 bg-amber-50 text-amber-900",
    danger: "border-rose-200 bg-rose-50 text-rose-900",
    tip: "border-emerald-200 bg-emerald-50 text-emerald-900",
  } as const;
  const icon = { info: "💡", warn: "⚠️", danger: "🚫", tip: "✅" }[tone];
  return (
    <div className={`rounded-2xl border p-5 ${map[tone]}`}>
      <p className="flex items-center gap-2 text-sm font-bold">
        <span aria-hidden>{icon}</span>
        {title}
      </p>
      <div className="mt-2 space-y-2 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
      {items.map((it) => (
        <li key={it} className="flex gap-2 rounded-xl border border-ink-900/10 bg-white px-4 py-3 text-sm text-ink-700">
          <span className="mt-0.5 flex-none text-emerald-600">✓</span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ink-600">
      {items.map((it) => (
        <li key={it} className="flex gap-2">
          <span className="mt-0.5 flex-none text-brand-500">•</span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function CtaBox() {
  return (
    <div className="rounded-3xl border border-brand-200 bg-gradient-to-br from-brand-50 to-emerald-50 p-6 sm:p-8">
      <h3 className="text-xl font-bold text-ink-900">
        Planning your immigration and financial life together?
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-600">
        Legal fees are only one part of immigrant family planning. NRItoUSA helps Indian and immigrant
        families understand U.S. money, taxes, visa risk, green card timelines, and return-to-India
        decisions.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href="/nri-wealth-checkup"
          className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Start with NRI Wealth Checkup
        </Link>
        <Link
          href="/free-immigrant-wealth-guide"
          className="rounded-xl border border-brand-300 bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 transition hover:border-brand-400"
        >
          Read the Free Immigrant Wealth Guide
        </Link>
        <Link
          href="/h1b-layoff"
          className="rounded-xl border border-brand-300 bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 transition hover:border-brand-400"
        >
          Explore H-1B Layoff Resources
        </Link>
      </div>
    </div>
  );
}

const proseWrap = "mx-auto max-w-3xl";
const bodyText = "mt-4 space-y-3 text-sm leading-relaxed text-ink-600";

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */
export default function Page() {
  const articleNode = {
    "@type": "Article",
    "@id": `${absoluteUrl(PATH)}#article`,
    headline: H1,
    description: META_DESC,
    datePublished: PUBLISHED_ISO,
    dateModified: UPDATED_ISO,
    author: {
      "@type": "Organization",
      name: site.publisher,
      url: site.url,
    },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(PATH) },
    url: absoluteUrl(PATH),
    inLanguage: "en-US",
    isAccessibleForFree: true,
  };

  const jsonLd = jsonLdGraph(
    articleNode,
    faqJsonLd(faqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "Immigration Attorney Cost", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="border-b border-ink-900/5 bg-gradient-to-b from-ink-50/70 to-white py-12 sm:py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <nav aria-label="Breadcrumb" className="text-xs font-medium text-ink-500">
              <Link href="/" className="hover:text-brand-700">Home</Link>
              <span className="px-1.5">/</span>
              <Link href="/immigration" className="hover:text-brand-700">Immigration</Link>
              <span className="px-1.5">/</span>
              <span className="text-ink-700">Immigration Attorney Cost</span>
            </nav>
            <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              💼 Immigration cost guide
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              {H1}
            </h1>
            <div className={bodyText}>
              <p>
                Many immigrants and NRI families delay speaking with a lawyer because they do not know
                the cost. The problem is that &ldquo;immigration lawyer fee&rdquo; can mean many things:
                a one-time consultation, a flat-fee petition, hourly work, an RFE response, or full
                green card representation.
              </p>
              <p>
                This guide explains typical fee structures, what affects pricing, how to compare
                attorneys, and how to budget for H-1B, green card, student visa, family visa, and
                citizenship-related legal costs.
              </p>
            </div>
            <p className="mt-4 text-xs text-ink-400">Last updated: {UPDATED_HUMAN}</p>
          </div>
        </Container>
      </section>

      {/* Not legal advice — near top */}
      <section className="py-6">
        <Container>
          <div className={proseWrap}>
            <Callout tone="danger" title="This is educational information, not legal advice">
              <p>{NOT_LEGAL_ADVICE}</p>
            </Callout>
          </div>
        </Container>
      </section>

      {/* TOC */}
      <section className="py-2">
        <Container>
          <div className={proseWrap}>
            <div className="rounded-2xl border border-ink-900/10 bg-white p-5">
              <p className="text-sm font-bold text-ink-900">On this page</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {JUMP.map((j) => (
                  <li key={j.href}>
                    <a
                      href={j.href}
                      className="inline-block rounded-lg bg-ink-50 px-3 py-1.5 text-xs font-medium text-ink-700 transition hover:bg-brand-50 hover:text-brand-700"
                    >
                      {j.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Intro copy */}
      <section className="py-6">
        <Container>
          <div className={proseWrap}>
            <p className="text-sm leading-relaxed text-ink-600">
              Immigration legal fees can feel confusing because every case is different. A simple
              consultation may be affordable, while a green card, H-1B, waiver, or RFE response can
              become expensive quickly. The smartest way to budget is to separate attorney fees from
              government filing fees, ask for a written scope of work, and understand what happens if
              your case receives an RFE, delay, or denial.
            </p>
          </div>
        </Container>
      </section>

      {/* Quick answer */}
      <section id="quick-answer" className="scroll-mt-24 py-8">
        <Container>
          <div className={proseWrap}>
            <Callout tone="info" title="Quick answer: How much does an immigration lawyer cost?">
              <p>
                In the U.S., many immigration attorneys charge either a flat fee or an hourly rate. A
                simple consultation may cost around <strong>$100–$400</strong>, while full case
                representation may range from a few hundred dollars for a simple form review to several
                thousand dollars for H-1B, family green card, employment green card, waivers, or complex
                cases. Attorney fees are separate from USCIS filing fees, premium processing fees,
                medical exams, translations, and other expenses.
              </p>
            </Callout>
          </div>
        </Container>
      </section>

      {/* Fee ranges table */}
      <section id="fee-ranges" className="scroll-mt-24 py-8">
        <Container>
          <div className={proseWrap}>
            <SectionH2 id="fee-ranges-h">Typical Immigration Attorney Fee Ranges</SectionH2>
            <DataTable cols={feeRangeCols} rows={feeRangeRows} />
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              These are general market ranges, not guaranteed quotes. A simple case may cost less, while
              a complicated case can cost much more. Always ask what is included in writing.
            </p>
            <p className="mt-2 text-xs italic text-ink-400">
              Fee ranges are estimates and should be verified with the attorney and official government
              sources.
            </p>
          </div>
        </Container>
      </section>

      {/* Lawyer vs govt fee */}
      <section id="lawyer-vs-govt" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10">
        <Container>
          <div className={proseWrap}>
            <SectionH2 id="lawyer-vs-govt-h">
              Immigration lawyer fee vs government filing fee: do not mix them
            </SectionH2>
            <div className={bodyText}>
              <p>
                Attorney fees are what you pay the lawyer or law firm for legal work. Government fees are
                paid to USCIS, Department of State, Department of Labor, or another agency. These are
                separate. For example, an H-1B petition may include attorney fees plus USCIS filing fees,
                fraud prevention fees, ACWIA fees, asylum program fees, and optional premium processing.
                A green card case may include attorney fees plus USCIS filing fees, medical exam costs,
                biometrics where applicable, translation costs, and other document costs.
              </p>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-ink-900/10 bg-white p-4">
                <p className="text-sm font-bold text-ink-900">1. Attorney legal fees</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-600">Paid to the lawyer or firm for preparing and representing your case.</p>
              </div>
              <div className="rounded-2xl border border-ink-900/10 bg-white p-4">
                <p className="text-sm font-bold text-ink-900">2. USCIS / government filing fees</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-600">Paid to USCIS, DOS, or DOL. Set by the government and subject to change.</p>
              </div>
              <div className="rounded-2xl border border-ink-900/10 bg-white p-4">
                <p className="text-sm font-bold text-ink-900">3. Premium processing</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-600">Optional faster government adjudication for eligible case types.</p>
              </div>
              <div className="rounded-2xl border border-ink-900/10 bg-white p-4">
                <p className="text-sm font-bold text-ink-900">4. Translation, mailing, medical, document &amp; RFE costs</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-600">Third-party and incidental costs that are easy to forget when budgeting.</p>
              </div>
            </div>
            <div className="mt-5">
              <Callout tone="warn" title="Government fees are separate">
                <p>
                  Before budgeting, check current USCIS filing fees using the official USCIS Fee Schedule
                  or USCIS Fee Calculator. Do not rely only on old blog posts because filing fees can
                  change.
                </p>
              </Callout>
            </div>
          </div>
        </Container>
      </section>

      {/* H-1B who pays */}
      <section id="h1b-who-pays" className="scroll-mt-24 py-10">
        <Container>
          <div className={proseWrap}>
            <SectionH2 id="h1b-who-pays-h">H-1B lawyer cost: who usually pays?</SectionH2>
            <div className={bodyText}>
              <p>
                For most H-1B employer-sponsored filings, the employer usually pays required
                employer-side costs. The employee should be careful before agreeing to pay fees that are
                legally the employer&apos;s responsibility. Optional costs, dependent filings such as
                H-4, H-4 EAD, or personal immigration advice may be treated differently depending on the
                employer and attorney agreement.
              </p>
            </div>
            <div className="mt-5">
              <Callout tone="warn" title="H-1B employee warning">
                <p>
                  Some H-1B costs are the employer&apos;s legal responsibility. Do not agree to
                  personally reimburse required employer-side fees without first confirming with HR and,
                  if needed, your own attorney.
                </p>
              </Callout>
            </div>
            <h3 className="mt-6 text-lg font-bold text-ink-900">H-1B Cost Breakdown</h3>
            <DataTable cols={h1bCols} rows={h1bRows} />
          </div>
        </Container>
      </section>

      {/* CTA middle */}
      <section className="py-8">
        <Container>
          <div className={proseWrap}>
            <CtaBox />
          </div>
        </Container>
      </section>

      {/* Green card cost */}
      <section id="green-card-cost" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10">
        <Container>
          <div className={proseWrap}>
            <SectionH2 id="green-card-cost-h">
              Green card lawyer cost: family vs employment-based
            </SectionH2>
            <div className={bodyText}>
              <p>
                Green card legal fees vary widely because &ldquo;green card case&rdquo; can mean
                different things. A family case may involve a spouse petition and adjustment of status.
                An employment case may involve PERM labor certification, I-140, adjustment of status,
                consular processing, dependents, audits, RFEs, and priority date strategy.
              </p>
            </div>
            <h3 className="mt-6 text-lg font-bold text-ink-900">Green Card Attorney Fee Comparison</h3>
            <DataTable cols={gcCols} rows={gcRows} />
            <p className="mt-4 text-sm leading-relaxed text-ink-600">
              For Indian applicants, the employment-based route often means years in the backlog — see{" "}
              <Link href="/eb2-eb3-priority-date-india" className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                EB-2/EB-3 priority dates for India
              </Link>{" "}
              and the latest{" "}
              <Link href="/visa-bulletin" className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                Visa Bulletin
              </Link>
              . You can also track{" "}
              <Link href="/i140-processing-time" className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                I-140
              </Link>{" "}
              and{" "}
              <Link href="/i485-processing-time" className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                I-485
              </Link>{" "}
              processing times.
            </p>
          </div>
        </Container>
      </section>

      {/* Student / F-1 cost */}
      <section id="student-cost" className="scroll-mt-24 py-10">
        <Container>
          <div className={proseWrap}>
            <SectionH2 id="student-cost-h">Student visa, OPT, STEM OPT, and F-1 lawyer cost</SectionH2>
            <div className={bodyText}>
              <p>
                Many F-1 students do not need a lawyer for routine school-managed processes, but an
                attorney may be useful for denials, reinstatement, unlawful presence concerns, OPT
                timing mistakes, SEVIS termination, change of status, CPT/OPT complications, or H-1B
                planning.
              </p>
            </div>
            <h3 className="mt-6 text-lg font-bold text-ink-900">Student Visa Legal Fee Examples</h3>
            <DataTable cols={f1Cols} rows={f1Rows} />
          </div>
        </Container>
      </section>

      {/* Fee structures */}
      <section id="fee-structures" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10">
        <Container>
          <div className={proseWrap}>
            <SectionH2 id="fee-structures-h">Common immigration attorney fee structures</SectionH2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {feeStructures.map((f, i) => (
                <div key={f.title} className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                  <p className="text-sm font-bold text-ink-900">
                    <span className="text-brand-600">{i + 1}.</span> {f.title}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-600">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Cost factors */}
      <section id="cost-factors" className="scroll-mt-24 py-10">
        <Container>
          <div className={proseWrap}>
            <SectionH2 id="cost-factors-h">Factors that influence immigration lawyer cost</SectionH2>
            <BulletList items={costFactors} />
          </div>
        </Container>
      </section>

      {/* Hidden costs */}
      <section id="hidden-costs" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10">
        <Container>
          <div className={proseWrap}>
            <SectionH2 id="hidden-costs-h">Hidden immigration legal costs many families forget</SectionH2>
            <DataTable cols={hiddenCols} rows={hiddenRows} />
            <div className="mt-5">
              <Callout tone="tip" title="Budget tip">
                <p>
                  Ask the attorney for a written estimate that lists legal fees, government fees, premium
                  processing, and likely third-party costs (medical, translation, courier) on separate
                  lines. That is the fastest way to avoid a surprise later.
                </p>
              </Callout>
            </div>
          </div>
        </Container>
      </section>

      {/* Compare */}
      <section id="compare" className="scroll-mt-24 py-10">
        <Container>
          <div className={proseWrap}>
            <SectionH2 id="compare-h">How to compare immigration attorneys before hiring</SectionH2>
            <CheckList items={compareChecklist} />
          </div>
        </Container>
      </section>

      {/* Questions */}
      <section id="questions" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10">
        <Container>
          <div className={proseWrap}>
            <SectionH2 id="questions-h">Questions to ask before paying an immigration lawyer</SectionH2>
            <ol className="mt-4 space-y-2 text-sm leading-relaxed text-ink-700">
              {questionsToAsk.map((q, i) => (
                <li key={q} className="flex gap-3 rounded-xl border border-ink-900/10 bg-white px-4 py-3">
                  <span className="flex-none font-bold text-brand-600">{i + 1}.</span>
                  <span>{q}</span>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* Budget */}
      <section id="budget" className="scroll-mt-24 py-10">
        <Container>
          <div className={proseWrap}>
            <SectionH2 id="budget-h">How to budget for immigration lawyer fees</SectionH2>
            <BulletList items={budgetTips} />
            <h3 className="mt-8 text-lg font-bold text-ink-900">Example Immigration Legal Budget</h3>
            <DataTable cols={budgetCols} rows={budgetRows} />
            <p className="mt-2 text-xs italic text-ink-400">
              Illustrative planning ranges only. Confirm exact figures with your attorney and current
              government fee schedules.
            </p>
          </div>
        </Container>
      </section>

      {/* Worth more */}
      <section id="worth-more" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10">
        <Container>
          <div className={proseWrap}>
            <SectionH2 id="worth-more-h">When paying more for an immigration lawyer may be worth it</SectionH2>
            <BulletList items={worthMore} />

            <h3 className="mt-8 text-lg font-bold text-ink-900">When you may not need a full attorney package</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              Some people may only need a consultation or document review, especially for
              straightforward matters. Examples:
            </p>
            <BulletList items={mayNotNeed} />
            <div className="mt-5">
              <Callout tone="warn" title="Be careful with DIY on complex cases">
                <p>
                  Do not DIY complex cases involving denial history, unlawful presence, criminal issues,
                  waivers, or employer-sponsored filings without understanding the risks.
                </p>
              </Callout>
            </div>
          </div>
        </Container>
      </section>

      {/* NRI */}
      <section id="nri" className="scroll-mt-24 py-10">
        <Container>
          <div className={proseWrap}>
            <SectionH2 id="nri-h">NRI and Indian immigrant family considerations</SectionH2>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              Indian families often face additional planning questions:
            </p>
            <BulletList items={nriConsiderations} />
            <p className="mt-5 text-sm leading-relaxed text-ink-600">
              Related NRItoUSA resources that affect your legal and financial budget:
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {[
                { label: "H-1B layoff: your options & timeline", href: "/h1b-layoff" },
                { label: "Visa Bulletin & priority dates", href: "/visa-bulletin" },
                { label: "EB-2/EB-3 priority dates for India", href: "/eb2-eb3-priority-date-india" },
                { label: "FBAR / FATCA risk checker", href: "/tools/fbar-fatca-checker" },
                { label: "Return-to-India planning", href: "/return-to-india" },
                { label: "Long-term NRI wealth", href: "/long-term-nri-wealth" },
                { label: "Free Immigrant Wealth Guide", href: "/free-immigrant-wealth-guide" },
                { label: "Send money to India", href: "/send-money-to-india" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-xl border border-ink-900/10 bg-white px-4 py-3 text-sm font-semibold text-ink-700 transition hover:border-brand-400 hover:text-brand-700"
                >
                  {l.label} →
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-12">
        <Container>
          <div className={proseWrap}>
            <h2 className="text-2xl font-bold tracking-tight text-ink-900">Frequently asked questions</h2>
            <div className="mt-6 divide-y divide-ink-900/10 overflow-hidden rounded-2xl border border-ink-900/10 bg-white">
              {faqs.map((f) => (
                <details key={f.question} className="group px-5 py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-ink-900">
                    {f.question}
                    <span className="flex-none text-brand-500 transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-ink-600">{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Conclusion */}
      <section className="py-10">
        <Container>
          <div className={proseWrap}>
            <SectionH2 id="bottom-line">Bottom line</SectionH2>
            <p className="mt-4 text-sm leading-relaxed text-ink-600">
              The right immigration attorney is not always the cheapest or the most expensive. For
              routine questions, a consultation or document review may be enough. For H-1B, green card,
              RFE, waiver, or complicated family cases, paying for experienced legal help can reduce
              mistakes and stress. Before hiring anyone, compare written quotes, confirm what is
              included, and budget for government fees and hidden costs separately.
            </p>
          </div>
        </Container>
      </section>

      {/* Bottom CTA */}
      <section className="py-6">
        <Container>
          <div className={proseWrap}>
            <CtaBox />
          </div>
        </Container>
      </section>

      {/* Official sources */}
      <section className="border-t border-ink-900/5 py-10">
        <Container>
          <div className={proseWrap}>
            <h2 className="text-lg font-bold text-ink-900">Official government fee sources</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              Attorney fees are separate from government fees. Always confirm current filing fees using
              the official USCIS sources below before you budget:
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                { label: "USCIS Fee Schedule (Form G-1055)", href: "https://www.uscis.gov/g-1055" },
                { label: "USCIS Fee Calculator", href: "https://www.uscis.gov/feecalculator" },
                { label: "USCIS Filing Fees", href: "https://www.uscis.gov/forms/filing-fees" },
              ].map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
                  >
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Legal disclaimer */}
      <section className="border-t border-ink-900/5 py-10">
        <Container>
          <div className={proseWrap}>
            <div className="rounded-2xl border border-ink-900/10 bg-ink-50/60 p-5 text-xs leading-relaxed text-ink-500">
              <p className="font-semibold text-ink-700">Legal disclaimer</p>
              <p className="mt-2">{NOT_LEGAL_ADVICE}</p>
              <p className="mt-2">
                NRItoUSA is not a law firm and does not provide legal representation. Fee ranges on this
                page are general market estimates for educational purposes and may not reflect your
                specific case, location, or attorney. For advice about your situation, consult a
                licensed U.S. immigration attorney and obtain a written fee agreement. Last updated{" "}
                {UPDATED_HUMAN}.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
