import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Newsletter from "@/components/Newsletter";
import H1bTransferRiskChecklist from "@/components/tools/H1bTransferRiskChecklist";
import PremiumProcessingFeeTable from "@/components/tools/PremiumProcessingFeeTable";
import {
  pageMetadata,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  absoluteUrl,
  type FaqItem,
} from "@/lib/seo";
import { site } from "@/lib/site";
import { h1bChildPages } from "@/lib/h1bCluster";

const PAGE_PATH = "/h1b";
const UPDATED = "2026-06-16";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "H1B Guide for Indians | Transfer, Extension, RFE, Premium Processing",
    description:
      "Simple H1B guide for Indian workers in the USA. Understand H1B transfer, extension, amendment, RFE, premium processing, USCIS case status, layoff, grace period and travel risks.",
    path: PAGE_PATH,
    type: "article",
    openGraph: { publishedTime: UPDATED, modifiedTime: UPDATED },
  });
}

const crumbs = [
  { name: "Home", url: "/" },
  { name: "H1B Guide", url: PAGE_PATH },
];

const faqs: FaqItem[] = [
  {
    question: "Can I start working for a new employer right after filing an H1B transfer?",
    answer:
      "Under AC21 portability, you may be able to start working once the new employer's H1B petition is filed and a receipt notice is issued — but only if you were in valid H1B status at the time of filing, your I-94 has not expired, and you have not violated your H1B terms. Confirm with your attorney before starting work.",
  },
  {
    question: "How long does H1B transfer take?",
    answer:
      "Regular processing: typically 3–6 months depending on service center and workload. Premium processing: USCIS action within 15 business days of accepting the upgrade. Check current times at uscis.gov/check-processing-times.",
  },
  {
    question: "What is the H1B 60-day grace period?",
    answer:
      "When H1B employment ends — through layoff, termination, or resignation — you have up to 60 days (or until your I-94 expires, whichever is shorter) to pursue a new H1B transfer petition, change of status, or departure. You cannot work during this period without a valid, filed petition.",
  },
  {
    question: "Does H1B premium processing guarantee approval?",
    answer:
      "No. Premium processing guarantees USCIS will take action — approve, issue an RFE, or deny — within 15 business days. It does not guarantee the outcome. An RFE restarts the 15-day clock after your attorney submits the response.",
  },
  {
    question: "When do I need an H1B amendment?",
    answer:
      "An H1B amendment is generally required when a material change occurs — most commonly a new work location outside the area covered by the current Labor Condition Application (LCA), or a significant change in job duties. Consult your employer's immigration attorney before any material change takes effect.",
  },
  {
    question: "I have an approved I-140. Can I still extend my H1B beyond 6 years?",
    answer:
      "Yes. An approved I-140 petition allows H1B extensions in 3-year increments beyond the standard 6-year cap. Even if the I-140 is from a previous employer, it generally continues to support H1B extensions under AC21 portability, provided you are in a same or similar occupation.",
  },
  {
    question: "Is it safe to travel to India for H1B visa stamping?",
    answer:
      "H1B stamping at Indian US consulates carries real risk — particularly administrative processing (221g), which can delay your return to the US by weeks or months. The risk is higher if you recently changed employers, work in consulting, or have any prior visa issues. Consult your attorney before traveling for stamping.",
  },
  {
    question: "I received an H1B RFE. What do I do?",
    answer:
      "Contact your employer's immigration attorney the same day. The RFE has a hard deadline (typically 87 days from the notice date). Missing it results in automatic denial. Do not submit anything without attorney guidance.",
  },
  {
    question: "Can I keep my H1B status if I am laid off?",
    answer:
      "You cannot keep H1B status indefinitely without an employer — H1B requires active sponsorship. However, the 60-day grace period allows you to pursue a new employer's H1B transfer petition within that window. If no petition is filed within 60 days and you have not changed status, you are out of status.",
  },
  {
    question: "Do I need a new H1B visa stamp every time I transfer employers?",
    answer:
      "No — you do not need a new visa stamp to work in the US after a transfer. However, if you travel internationally and your existing stamp has expired or shows a previous employer, you will generally need a new stamp to re-enter. Confirm your specific situation with your attorney before traveling.",
  },
];

export default function H1bHubPage() {
  const url = absoluteUrl(PAGE_PATH);
  const jsonLd = jsonLdGraph(
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: "H1B Guide for Indians: Transfer, Extension, Amendment, RFE, Premium Processing & USCIS",
      description:
        "Complete H1B guide for Indian workers in the USA covering transfer, extension, amendment, RFE, premium processing, layoff grace period, and travel risks.",
      url,
      datePublished: UPDATED,
      dateModified: UPDATED,
      author: { "@id": `${site.url}/#organization` },
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "en-US",
      about: { "@type": "Thing", name: "H1B Visa" },
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

      {/* breadcrumb */}
      <nav aria-label="breadcrumb" className="border-b border-ink-900/5 bg-ink-50/60">
        <Container className="py-2.5">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-ink-500">
            <li><Link href="/" className="hover:text-ink-800">Home</Link></li>
            <li aria-hidden>/</li>
            <li className="font-medium text-ink-800">H1B Guide</li>
          </ol>
        </Container>
      </nav>

      {/* disclaimer */}
      <div className="border-b border-amber-200 bg-amber-50">
        <Container className="py-2.5">
          <p className="text-center text-xs text-amber-900">
            <strong className="font-semibold">Educational guide only.</strong> NRItoUSA is not USCIS, not a law firm, and not your attorney. Always verify at{" "}
            <a href="https://www.uscis.gov" target="_blank" rel="noopener noreferrer" className="underline">uscis.gov</a>{" "}
            and consult a licensed immigration attorney.
          </p>
        </Container>
      </div>

      {/* hero */}
      <section className="bg-white pb-8 pt-12 sm:pb-10 sm:pt-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 px-3 py-1">
              <span className="text-sm">🛂</span>
              <span className="text-xs font-bold text-white">H1B Guide</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              H1B Guide for Indians
            </h1>
            <p className="mt-3 text-lg leading-relaxed text-ink-600">
              Transfer, extension, amendment, RFE, premium processing, layoff grace period, and travel risks — everything Indian H1B workers need in plain language.
            </p>
            <p className="mt-2 text-xs text-ink-400">
              Updated {new Date(UPDATED).toLocaleDateString("en-US", { month: "long", year: "numeric", day: "numeric" })} · ~15 min read
            </p>
            {/* quick nav */}
            <div className="mt-5 flex flex-wrap gap-2">
              {["Transfer", "Extension", "Amendment", "RFE", "Premium Processing", "Layoff", "Travel"].map((label) => (
                <a key={label} href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
                  className="rounded-full border border-ink-900/10 bg-ink-50 px-3 py-1 text-xs font-medium text-ink-700 hover:border-orange-400 hover:text-orange-700">
                  {label}
                </a>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* quick answer */}
      <section className="bg-orange-50/50 py-8">
        <Container>
          <div className="mx-auto max-w-3xl rounded-2xl border border-orange-100 bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-wide text-orange-600 mb-3">Quick answer</p>
            <ul className="space-y-2 text-sm leading-relaxed text-ink-700">
              {[
                "H1B is a dual-intent nonimmigrant work visa for specialty occupations — the primary work visa for Indian tech, finance, and engineering professionals in the US.",
                "H1B transfers to a new employer are cap-exempt — no new lottery needed. AC21 portability may allow work after the receipt notice.",
                "The standard H1B term is 3 years + 3 years (6-year cap). An approved I-140 unlocks 3-year extensions beyond 6 years — critical for Indian EB green card waiters.",
                "Layoff triggers a 60-day grace period. You cannot work during this period but can pursue a new H1B transfer filing.",
                "Premium processing (I-907) guarantees USCIS action in 15 business days — not approval. Available for I-129 H1B petitions.",
              ].map((pt) => (
                <li key={pt} className="flex items-start gap-2">
                  <span className="mt-0.5 flex-none text-orange-400">▸</span>{pt}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* who this guide is for */}
      <section id="who" className="bg-white py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-xl font-bold tracking-tight text-ink-900 mb-4">Who this guide is for</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: "💼", label: "Changing jobs", desc: "Indian H1B holders planning to transfer to a new employer" },
                { icon: "⏰", label: "Approaching cap", desc: "H1B workers nearing the 6-year cap with an I-140 in progress" },
                { icon: "⚡", label: "Just laid off", desc: "H1B workers navigating the 60-day grace period after layoff" },
                { icon: "📋", label: "Received an RFE", desc: "Workers whose H1B petition received a Request for Evidence" },
                { icon: "✈️", label: "Planning travel", desc: "H1B holders considering travel to India for visa stamping" },
                { icon: "🌱", label: "Green card track", desc: "Indians on H1B pursuing the EB-2 or EB-3 green card process" },
              ].map((card) => (
                <div key={card.label} className="flex items-start gap-3 rounded-xl border border-ink-900/5 bg-ink-50/40 p-4">
                  <span className="text-2xl">{card.icon}</span>
                  <div>
                    <p className="font-semibold text-ink-900 text-sm">{card.label}</p>
                    <p className="text-xs text-ink-500">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* H1B basics */}
      <section id="basics" className="bg-ink-50/40 py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5">
            <h2 className="text-xl font-bold tracking-tight text-ink-900">H1B basics for Indian workers</h2>
            <p className="text-sm leading-relaxed text-ink-700">
              The H1B is a nonimmigrant work visa for specialty occupations — positions that normally require a bachelor's degree or higher in a specific field. It is the primary work visa for Indian tech, finance, healthcare, and engineering professionals working in the US.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-ink-900/5 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-ink-50/60">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-ink-600">Item</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-ink-600">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-900/5">
                  {[
                    ["Initial term", "Up to 3 years"],
                    ["First extension", "Up to 3 more years (6-year total)"],
                    ["Beyond 6 years", "Possible with approved I-140 or 365+ day pending PERM/I-140"],
                    ["Petitioner", "Employer (you cannot self-petition)"],
                    ["Dual intent", "Yes — H1B allows pursuing a green card while on the visa"],
                    ["Annual cap", "65,000 cap-subject + 20,000 advanced degree exemption"],
                    ["Cap-exempt", "Universities, nonprofits, government research — no lottery needed"],
                    ["Transfer", "Cap-exempt — no lottery for existing H1B holders changing employers"],
                    ["Premium processing", "I-907 — verify current fee at uscis.gov/i-907, USCIS action in 15 business days"],
                  ].map(([item, detail]) => (
                    <tr key={item}>
                      <td className="px-4 py-2.5 text-xs font-semibold text-ink-700">{item}</td>
                      <td className="px-4 py-2.5 text-xs text-ink-600">{detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </section>

      {/* H1B transfer */}
      <section id="transfer" className="bg-white py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-xl font-bold tracking-tight text-ink-900">H1B transfer explained</h2>
              <Link href="/h1b/transfer" className="text-xs font-semibold text-orange-600 underline">
                Full transfer guide →
              </Link>
            </div>
            <p className="text-sm leading-relaxed text-ink-700">
              An H1B transfer (Change of Employer petition) is a new Form I-129 filed by your new employer. It is cap-exempt — you do not re-enter the lottery. Under AC21 portability, you may be able to start working for the new employer once the petition is filed and receipted, provided your current H1B status is valid.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                <p className="text-xs font-bold text-emerald-700 mb-1.5">AC21 portability allows work if:</p>
                <ul className="space-y-1 text-xs text-emerald-800">
                  <li>• Valid H1B status at time of new petition filing</li>
                  <li>• I-94 has not expired</li>
                  <li>• No H1B status violations</li>
                  <li>• New petition filed before current status expires</li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-4">
                <p className="text-xs font-bold text-rose-700 mb-1.5">Common transfer RFE triggers:</p>
                <ul className="space-y-1 text-xs text-rose-800">
                  <li>• Specialty occupation challenge</li>
                  <li>• Employer-employee relationship (consulting)</li>
                  <li>• Third-party placement / client site issues</li>
                  <li>• LCA wage or location discrepancy</li>
                </ul>
              </div>
            </div>
            {/* CTA for tool */}
            <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-5">
              <p className="font-semibold text-orange-900">Use the H1B Transfer Risk Checklist</p>
              <p className="mt-1 text-sm text-orange-800/80">
                Assess your transfer situation — documents to collect, what to verify, and whether to ask about premium processing.
              </p>
              <Link href="/tools/h1b-transfer-risk-checklist"
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700">
                Open the checklist →
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* H1B extension */}
      <section id="extension" className="bg-ink-50/40 py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-xl font-bold tracking-tight text-ink-900">H1B extension explained</h2>
              <Link href="/h1b/extension" className="text-xs font-semibold text-orange-600 underline">Full extension guide →</Link>
            </div>
            <p className="text-sm leading-relaxed text-ink-700">
              H1B is granted in 3-year increments. After 6 years, most H1B holders must leave the US for a year — unless they qualify for an extension beyond 6 years. For Indian EB applicants with an approved I-140, this extension is critical and available in 3-year increments.
            </p>
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-xs text-blue-900">
              <strong className="font-semibold">The I-140 exception for Indian workers:</strong> An approved I-140 (employment-based green card petition) unlocks 3-year H1B extensions beyond the 6-year cap. Even if the I-140 was filed by a previous employer, it continues to support extensions under AC21 for same or similar occupations.
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 text-xs text-amber-900">
              <strong className="font-semibold">240-day rule:</strong> If your H1B extension petition is filed before your I-94 expires but USCIS has not yet approved it by expiration date, you may continue working for up to 240 days under the 240-day rule. Travel internationally during this period is generally not advised.
            </div>
          </div>
        </Container>
      </section>

      {/* H1B amendment */}
      <section id="amendment" className="bg-white py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-xl font-bold tracking-tight text-ink-900">H1B amendment explained</h2>
              <Link href="/h1b/amendment" className="text-xs font-semibold text-orange-600 underline">Full amendment guide →</Link>
            </div>
            <p className="text-sm leading-relaxed text-ink-700">
              An H1B amendment is required when material changes occur to your H1B employment — most commonly a new work location outside the area covered by your current Labor Condition Application (LCA). Failing to file when required can cause USCIS to find that you fell out of status from the date of the change.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { title: "Requires amendment", items: ["New city / MSA outside LCA coverage", "Significant change in job duties", "Corporate restructuring (new legal entity)"] },
                { title: "Generally no amendment", items: ["Short travel (<30 days)", "WFH same MSA", "Salary increase", "Minor title change"] },
                { title: "Consult attorney", items: ["Multi-site consulting work", "Remote work policy changes", "Employer acquisition or merger"] },
              ].map((col) => (
                <div key={col.title} className="rounded-xl border border-ink-900/5 bg-ink-50/40 p-4">
                  <p className="text-xs font-bold text-ink-800 mb-2">{col.title}</p>
                  <ul className="space-y-1">
                    {col.items.map((item) => <li key={item} className="text-xs text-ink-600">• {item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* H1B RFE */}
      <section id="rfe" className="bg-ink-50/40 py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-xl font-bold tracking-tight text-ink-900">H1B RFE explained</h2>
              <Link href="/h1b/rfe" className="text-xs font-semibold text-orange-600 underline">Full RFE guide →</Link>
            </div>
            <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 text-xs text-rose-900">
              <strong className="font-semibold">RFE deadline is hard:</strong> The response deadline printed on the RFE notice (typically 87 days from the notice date) is an absolute cut-off. Missing it results in automatic denial with very limited recourse. Contact your employer's attorney the same day you learn of an RFE.
            </div>
            <p className="text-sm leading-relaxed text-ink-700">
              An H1B Request for Evidence (RFE) is not a denial — USCIS needs more documentation before it can adjudicate. Common triggers include specialty occupation challenges, employer-employee relationship questions (common for consulting/staffing), and LCA compliance issues. Many H1B petitions with RFEs are approved with a complete, attorney-prepared response.
            </p>
          </div>
        </Container>
      </section>

      {/* Premium processing */}
      <section id="premium-processing" className="bg-white py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-xl font-bold tracking-tight text-ink-900">H1B premium processing explained</h2>
              <Link href="/h1b/premium-processing" className="text-xs font-semibold text-orange-600 underline">Full premium guide →</Link>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-ink-900/5 bg-white">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-ink-900/5">
                  {[
                    ["What it is", "Optional paid service for expedited USCIS action on I-129 and I-140"],
                    ["USCIS guarantee", "Action within 15 business days of premium acceptance"],
                    ["What 'action' means", "Approval, RFE, Notice of Intent to Deny, or denial"],
                    ["Does it guarantee approval?", "No — it guarantees speed, not outcome"],
                    ["RFE impact", "15-day clock restarts after USCIS receives your RFE response"],
                    ["Who pays", "Employer typically pays; employee can pay in some cases"],
                  ].map(([item, detail]) => (
                    <tr key={item}>
                      <td className="px-4 py-2.5 text-xs font-semibold text-ink-700">{item}</td>
                      <td className="px-4 py-2.5 text-xs text-ink-600">{detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <PremiumProcessingFeeTable />
          </div>
        </Container>
      </section>

      {/* Layoff */}
      <section id="layoff" className="bg-ink-50/40 py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-xl font-bold tracking-tight text-ink-900">H1B after layoff and the 60-day grace period</h2>
              <Link href="/h1b/layoff-60-day-grace-period" className="text-xs font-semibold text-orange-600 underline">Full layoff guide →</Link>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-5">
              <p className="font-semibold text-amber-900 mb-2">The 60-day clock starts from your last day of H1B employment</p>
              <ul className="space-y-1.5 text-sm text-amber-800">
                <li>• You can stay in the US and pursue options — but you cannot work</li>
                <li>• Get a new employer's H1B transfer petition filed as quickly as possible</li>
                <li>• Premium processing is strongly advisable — regular processing takes months</li>
                <li>• If no petition is filed by day 60, options narrow significantly</li>
                <li>• Severance pay does not extend the grace period — it runs from your last day of work</li>
              </ul>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Option 1", title: "New H1B transfer", desc: "New employer files a new I-129. Best outcome if you have a job offer." },
                { label: "Option 2", title: "Change of status", desc: "Switch to H-4 (if spouse is on H1B), F-1, or another eligible category." },
                { label: "Option 3", title: "Departure", desc: "Leave the US and regroup from outside — explore future options without the 60-day pressure." },
              ].map((opt) => (
                <div key={opt.label} className="rounded-xl border border-ink-900/5 bg-white p-4">
                  <p className="text-xs font-bold text-orange-600">{opt.label}</p>
                  <p className="font-semibold text-ink-900 text-sm mt-0.5">{opt.title}</p>
                  <p className="text-xs text-ink-600 mt-1">{opt.desc}</p>
                </div>
              ))}
            </div>
            <Link href="/h1b/transfer-after-layoff" className="block rounded-xl border border-orange-100 bg-orange-50/50 p-4 text-sm font-semibold text-orange-800 hover:border-orange-300">
              Detailed guide: H1B transfer after layoff →
            </Link>
          </div>
        </Container>
      </section>

      {/* Transfer risk checklist */}
      <section className="bg-white py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-xl font-bold tracking-tight text-ink-900 mb-5">H1B Transfer Risk Checklist</h2>
            <H1bTransferRiskChecklist />
          </div>
        </Container>
      </section>

      {/* Travel */}
      <section id="travel" className="bg-ink-50/40 py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-xl font-bold tracking-tight text-ink-900">H1B travel to India and stamping caution</h2>
              <Link href="/h1b/travel-to-india" className="text-xs font-semibold text-orange-600 underline">Full travel guide →</Link>
            </div>
            <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-4 text-xs text-rose-900">
              <strong className="font-semibold">221(g) risk is real:</strong> Administrative processing at Indian US consulates can detain your passport for weeks or months with no guaranteed resolution timeline. This risk is elevated after recent employer changes, for consulting roles, and for third-party placement situations.
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-ink-900/5 bg-white p-4">
                <p className="text-xs font-bold text-ink-800 mb-2">You need a new stamp if:</p>
                <ul className="space-y-1 text-xs text-ink-600">
                  <li>• Your existing stamp has expired</li>
                  <li>• You plan international travel and need re-entry</li>
                  <li>• Stamp shows a previous employer (in most cases)</li>
                </ul>
              </div>
              <div className="rounded-xl border border-ink-900/5 bg-white p-4">
                <p className="text-xs font-bold text-ink-800 mb-2">Higher 221(g) risk:</p>
                <ul className="space-y-1 text-xs text-ink-600">
                  <li>• Consulting, staffing, or third-party placement</li>
                  <li>• Recent employer change (within 6–12 months)</li>
                  <li>• Previous 221(g) history</li>
                  <li>• Complex work authorization history</li>
                </ul>
              </div>
            </div>
            <Link href="/h1b/stamping-india-after-approval" className="block rounded-xl border border-orange-100 bg-orange-50/50 p-4 text-sm font-semibold text-orange-800 hover:border-orange-300">
              Full guide: H1B stamping in India after approval →
            </Link>
          </div>
        </Container>
      </section>

      {/* H1B and green card */}
      <section className="bg-white py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5">
            <h2 className="text-xl font-bold tracking-tight text-ink-900">H1B and the green card process</h2>
            <p className="text-sm leading-relaxed text-ink-700">
              For most Indian H1B workers, the long-term plan involves pursuing an employer-sponsored green card in the EB-2 or EB-3 category. The H1B and green card processes run in parallel — and the interplay between them has important consequences.
            </p>
            <div className="space-y-3">
              {[
                { step: "PERM Labor Certification", desc: "Employer advertises the position to verify no qualified US workers are available. Takes 6–18+ months. Sets the priority date for the green card application." },
                { step: "I-140 Immigrant Petition", desc: "Filed after PERM is certified. Establishes your priority date. Premium processing available (~15 business days). Once approved for 365+ days, enables H1B extensions beyond 6 years." },
                { step: "Wait for priority date", desc: "For Indians in EB-2 or EB-3, the priority date must become current in the monthly visa bulletin. Current wait: many years or decades for some categories." },
                { step: "I-485 Adjustment of Status", desc: "Once priority date is current, file I-485 (along with EAD and Advance Parole). This is the final stage of getting the green card domestically." },
              ].map((item, i) => (
                <div key={item.step} className="flex gap-4 rounded-xl border border-ink-900/5 bg-ink-50/40 p-4">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700">{i + 1}</span>
                  <div>
                    <p className="font-semibold text-ink-900 text-sm">{item.step}</p>
                    <p className="text-xs text-ink-600 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Link href="/green-card" className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-semibold text-orange-800 hover:border-orange-400">
                Green card guide for Indians →
              </Link>
              <Link href="/tools/green-card-stage-finder" className="rounded-lg border border-ink-900/10 bg-ink-50 px-4 py-2 text-xs font-semibold text-ink-700 hover:border-brand-400">
                Green Card Stage Finder tool →
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Child pages grid */}
      <section className="bg-ink-50/40 py-10 sm:py-12">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-wide text-orange-600 mb-1">Also in this H1B guide</p>
            <h2 className="text-xl font-bold text-ink-900 mb-5">Detailed H1B guides</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {h1bChildPages.map((p) => (
                <Link key={p.slug} href={`/h1b/${p.slug}`}
                  className="group rounded-2xl border border-ink-900/10 bg-white p-5 transition hover:border-orange-300 hover:shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-wide text-orange-600">H1B guide</span>
                  <h3 className="mt-1 font-semibold text-ink-900 group-hover:text-orange-700">{p.navLabel}</h3>
                  <p className="mt-1.5 text-sm text-ink-500 line-clamp-2">{p.excerpt}</p>
                  <p className="mt-2 text-xs text-ink-400">{p.readingTime} min read</p>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-white py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-xl font-bold tracking-tight text-ink-900 mb-6">Frequently asked questions</h2>
            <dl className="space-y-4">
              {faqs.map((item) => (
                <div key={item.question} className="rounded-2xl border border-ink-900/5 bg-ink-50/40 px-5 py-4">
                  <dt className="font-semibold text-ink-900">{item.question}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-ink-600">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      {/* internal links */}
      <section className="bg-ink-50/40 py-10 sm:py-12">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-base font-bold text-ink-900 mb-4">Related guides and tools</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { href: "/uscis", label: "USCIS Hub", desc: "Full USCIS overview for Indian applicants" },
                { href: "/uscis/case-status", label: "USCIS Case Status Guide", desc: "What every status message means" },
                { href: "/uscis/processing-times", label: "Processing Times Guide", desc: "H1B and other USCIS processing time estimates" },
                { href: "/tools/uscis-processing-delay-checker", label: "Processing Delay Checker", desc: "Is your H1B case delayed? Educational assessment" },
                { href: "/tools/uscis-case-status-meaning", label: "Case Status Meaning Tool", desc: "What does your current USCIS status mean?" },
                { href: "/tools/h1b-transfer-risk-checklist", label: "H1B Transfer Risk Checklist", desc: "Assess your transfer situation and documents" },
              ].map((g) => (
                <Link key={g.href} href={g.href} className="group rounded-xl border border-ink-900/10 bg-white p-4 transition hover:border-brand-400 hover:shadow-sm">
                  <p className="text-sm font-semibold text-ink-900 group-hover:text-brand-700">{g.label}</p>
                  <p className="mt-0.5 text-xs text-ink-500">{g.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* disclaimer */}
      <section className="border-t border-ink-900/5 bg-white py-8">
        <Container>
          <div className="mx-auto max-w-2xl text-center text-xs leading-relaxed text-ink-500">
            <p>
              <strong className="font-semibold text-ink-700">NRItoUSA is not USCIS, not a law firm, and not your attorney.</strong>{" "}
              This guide is for educational purposes only and does not constitute legal or immigration advice. H1B rules, processing times, USCIS policies, and DOL regulations change frequently. Always verify at{" "}
              <a href="https://www.uscis.gov" target="_blank" rel="noopener noreferrer" className="font-medium underline">uscis.gov</a>{" "}
              and consult a licensed immigration attorney for your specific situation.
            </p>
          </div>
        </Container>
      </section>

      <Newsletter />
    </>
  );
}
