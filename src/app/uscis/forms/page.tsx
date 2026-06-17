import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Newsletter from "@/components/Newsletter";
import {
  pageMetadata,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  absoluteUrl,
  type FaqItem,
} from "@/lib/seo";
import { site } from "@/lib/site";
import { formsChildPages } from "@/lib/uscisFormsCluster";

const PAGE_PATH = "/uscis/forms";
const UPDATED = "2026-06-16";

export const metadata: Metadata = pageMetadata({
  title: "USCIS Forms Explained | I-129, I-140, I-485, I-765, I-131, I-130",
  description:
    "Simple USCIS forms guide for Indians in the USA. Understand I-129, I-140, I-485, I-765, I-131, I-130, I-539, I-907, AR-11 and N-400.",
  path: PAGE_PATH,
  type: "article",
  openGraph: { publishedTime: UPDATED, modifiedTime: UPDATED },
});

const crumbs = [
  { name: "Home", url: "/" },
  { name: "USCIS Hub", url: "/uscis" },
  { name: "USCIS Forms Explained", url: PAGE_PATH },
];

const faqs: FaqItem[] = [
  {
    question: "Which USCIS form is used for H-1B?",
    answer:
      "Your employer files Form I-129 (Petition for a Nonimmigrant Worker) for your H-1B. You do not file it yourself. The I-129 is also used for L-1, O-1, and TN petitions. After USCIS approves it, you receive Form I-797A, which includes an I-94 at the bottom — that I-94 is your authorized stay date.",
  },
  {
    question: "What is the difference between I-140 and I-485?",
    answer:
      "I-140 is the immigrant petition — your employer files it to classify you for an employment-based green card category (EB-1, EB-2, EB-3) and establish your priority date. I-485 is the actual green card application you file when a visa number becomes available for your category and country. For Indian EB-2/EB-3 applicants, the gap between I-140 approval and I-485 eligibility can be decades.",
  },
  {
    question: "Do I need to file any forms when I change my address?",
    answer:
      "Yes. Federal law requires all non-citizens to file AR-11 (Alien's Change of Address) within 10 days of moving. You can file it online for free at my.uscis.gov. Not doing this is risky because USCIS mails all critical notices — RFEs, interview notices, approvals — to the address on file.",
  },
  {
    question: "What does my employer file for my green card?",
    answer:
      "For employment-based green cards, the typical employer-filed sequence is: (1) PERM Labor Certification with DOL, (2) Form I-140 (Immigrant Petition for Alien Workers) with USCIS. Once a visa number is available, you personally file Form I-485 (Adjustment of Status) along with I-765 (EAD) and I-131 (Advance Parole).",
  },
  {
    question: "What is premium processing and is it worth it?",
    answer:
      "Premium processing is an optional service paid via Form I-907 that guarantees USCIS will take action (approve, deny, or issue an RFE) within 15 business days on eligible petitions like I-129 and I-140. It is worth it when timing is critical — H-1B extension about to expire, offer letter dependent on approval, or I-140 needed before the 6-year H-1B cap. It does not guarantee approval. Fees and eligible form types can change — always verify the current fee on the official USCIS Form I-907 premium processing page before filing.",
  },
  {
    question: "My H-4 spouse needs to extend her status — what form is that?",
    answer:
      "Your H-4 spouse files Form I-539 (Application to Extend/Change Nonimmigrant Status) to extend H-4 status. If she also needs to renew her H-4 EAD, she files I-765 at the same time. These are typically filed alongside your H-1B I-129 extension but processed separately and take much longer.",
  },
  {
    question: "Can I travel internationally while my I-485 is pending?",
    answer:
      "Not without an approved Advance Parole (Form I-131). Leaving the US while I-485 is pending — without an approved AP document — is generally treated as abandonment of your I-485. File I-131 together with your I-485 and wait for the physical combo card before planning any international trips.",
  },
  {
    question: "How do I know which form USCIS is processing for my case?",
    answer:
      "The form number is on your I-797 Notice of Action receipt — it is shown in the 'Form' field near your receipt number. Your receipt number prefix (IOE, LIN, SRC, EAC, WAC, MSC) tells you which service center has your case. Use the USCIS Form Finder tool on this page for quick guidance.",
  },
];

const FORM_ROWS = [
  {
    form: "I-129",
    use: "Work visa petition (H-1B, L-1, O-1)",
    filer: "Employer",
    indian: "H-1B cap petition, extension, or amendment",
    slug: "i-129",
  },
  {
    form: "I-140",
    use: "Employment-based immigrant petition",
    filer: "Employer (or self for EB-1A/NIW)",
    indian: "EB-2/EB-3 green card petition, sets priority date",
    slug: "i-140",
  },
  {
    form: "I-485",
    use: "Adjustment of status to green card",
    filer: "Self",
    indian: "Filed when India EB priority date becomes current",
    slug: "i-485",
  },
  {
    form: "I-765",
    use: "Employment Authorization Document (EAD)",
    filer: "Self",
    indian: "H-4 EAD, I-485-based EAD, F-1 OPT",
    slug: "i-765",
  },
  {
    form: "I-131",
    use: "Advance Parole / travel document",
    filer: "Self",
    indian: "Travel permission while I-485 is pending",
    slug: "i-131",
  },
  {
    form: "I-130",
    use: "Family-based immigrant petition",
    filer: "US citizen or PR (petitioner)",
    indian: "Sponsoring spouse, parent, child, or sibling",
    slug: "i-130",
  },
  {
    form: "I-539",
    use: "Extend or change nonimmigrant status",
    filer: "Self",
    indian: "H-4 extension, B-2 extension",
    slug: "i-539",
  },
  {
    form: "I-907",
    use: "Premium processing (15 business days)",
    filer: "Employer or self",
    indian: "Expedite H-1B, I-140, I-765",
    slug: "i-907-premium-processing",
  },
  {
    form: "AR-11",
    use: "Change of address notification",
    filer: "Self",
    indian: "Required within 10 days of any move",
    slug: "ar-11-change-address",
  },
  {
    form: "N-400",
    use: "Naturalization (citizenship) application",
    filer: "Self",
    indian: "After 5 years as permanent resident",
    slug: "n-400",
  },
];

const EMPLOYER_FORMS = [
  { form: "I-129", note: "Employer files for H-1B, L-1, O-1 — employee never signs it" },
  { form: "I-140", note: "Employer files for EB-1B, EB-2, EB-3 — or self if EB-1A/NIW" },
  { form: "I-907", note: "Usually paid by employer; employee pays when expediting for personal benefit" },
];

const SELF_FORMS = [
  { form: "I-485", note: "You file your own green card application" },
  { form: "I-765", note: "You file your own EAD/work permit application" },
  { form: "I-131", note: "You file your own Advance Parole application" },
  { form: "I-539", note: "You (or H-4 dependent) file extension/change of status" },
  { form: "AR-11", note: "You file address change — free, online, takes 5 minutes" },
  { form: "N-400", note: "You file your own naturalization application" },
];

const MISTAKES = [
  {
    title: "Traveling while I-485 is pending without Advance Parole",
    detail: "Leaving the US without an approved I-131 Advance Parole can result in I-485 abandonment — restarting years of waiting.",
  },
  {
    title: "Not filing AR-11 when you move",
    detail: "USCIS mails RFEs, interview notices, and approval notices to the address on file. A missed notice = a potentially missed deadline.",
  },
  {
    title: "Confusing the I-94 end date with the visa stamp expiration",
    detail: "Your authorized stay is the I-94 date on your I-797A approval — not when your visa stamp expires. The stamp is just for entry; I-94 controls your status.",
  },
  {
    title: "Not verifying the priority date on I-140 approval",
    detail: "An incorrect priority date on your I-140 can cost you years. Verify it matches your PERM filing date immediately after receiving the approval notice.",
  },
  {
    title: "Starting work before the physical EAD card arrives",
    detail: "The I-765 approval notice is not work authorization. You must physically hold the EAD card before starting work under it.",
  },
  {
    title: "Waiting until status expires to file I-539",
    detail: "I-539 for H-4 or B-2 status must be filed before the current status expires. File early — processing can take 12–24 months.",
  },
];

export default function UscisFormsPage() {
  const url = absoluteUrl(PAGE_PATH);

  const articleJsonLd = {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: "USCIS Forms Explained for Indians: I-129, I-140, I-485, I-765, I-131, I-130, N-400",
    description:
      "Simple USCIS forms guide for Indians in the USA. Understand I-129, I-140, I-485, I-765, I-131, I-130, I-539, I-907, AR-11 and N-400.",
    datePublished: UPDATED,
    dateModified: UPDATED,
    author: { "@type": "Organization", name: site.publisher },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    inLanguage: "en-US",
    isAccessibleForFree: true,
  };

  const jsonLd = jsonLdGraph(
    articleJsonLd,
    breadcrumbJsonLd(crumbs),
    faqJsonLd(faqs)
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <header className="border-b border-ink-900/5 bg-white pt-8 pb-7 sm:pt-10">
          <Container>
            <div className="mx-auto max-w-[720px]">
              <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-xs text-ink-400">
                {crumbs.map((c, i) => (
                  <span key={c.url} className="flex items-center gap-2">
                    {i > 0 && <span aria-hidden>/</span>}
                    {i < crumbs.length - 1 ? (
                      <Link href={c.url} className="hover:text-brand-600">{c.name}</Link>
                    ) : (
                      <span className="text-ink-500">{c.name}</span>
                    )}
                  </span>
                ))}
              </nav>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-ink-400">
                <Link
                  href="/uscis"
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 font-semibold text-white"
                >
                  <span>🛂</span> USCIS
                </Link>
                <span>10 min read</span>
                <span aria-hidden>·</span>
                <span>Updated June 2026</span>
              </div>
              <h1 className="mt-3 text-[1.75rem] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[2rem]">
                USCIS Forms Explained for Indians: I-129, I-140, I-485, I-765, I-131, I-130 and More
              </h1>
              <p className="mt-2.5 text-base italic leading-[1.6] text-ink-500">
                A plain-English guide to the USCIS forms that matter most for Indian H-1B workers, green card applicants, H-4 spouses, and naturalization seekers.
              </p>
            </div>
          </Container>
        </header>

        <div className="py-8 sm:py-10">
          <Container>
            <div className="mx-auto max-w-[720px] space-y-10">

              {/* Quick answer */}
              <section>
                <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Quick answer</p>
                  <p className="mt-2 text-sm leading-relaxed text-blue-900">
                    <strong>Your employer files I-129</strong> for your H-1B work authorization and <strong>I-140</strong> for your employment-based green card petition.
                    <strong> You file I-485</strong> to adjust status to a green card when your priority date is current, <strong>I-765</strong> for an EAD work permit,
                    <strong> I-131</strong> for travel permission while I-485 is pending, and <strong>AR-11</strong> any time you move.
                    N-400 is your naturalization application after 5 years as a permanent resident.
                  </p>
                  <div className="mt-4">
                    <Link
                      href="/tools/uscis-form-finder"
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Use the Form Finder tool →
                    </Link>
                  </div>
                </div>
              </section>

              {/* Why forms are confusing */}
              <section>
                <h2 className="text-xl font-extrabold text-ink-900">Why USCIS forms are confusing</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-700">
                  USCIS has hundreds of forms, but most Indian immigrants deal with fewer than ten. The confusion comes from three things:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-ink-700">
                  <li className="flex items-start gap-2"><span className="mt-0.5 font-bold text-blue-600">1.</span><span><strong>Some forms are filed by your employer, not you.</strong> Many immigrants assume they are uninvolved in their own H-1B or green card filing — that is partly true. Your employer signs I-129 and I-140. But you still need to understand what was filed and what it says.</span></li>
                  <li className="flex items-start gap-2"><span className="mt-0.5 font-bold text-blue-600">2.</span><span><strong>The form number looks nothing like the visa category.</strong> I-129 is H-1B. I-140 is EB green card. I-485 is adjustment of status. None of these names appear in the form number.</span></li>
                  <li className="flex items-start gap-2"><span className="mt-0.5 font-bold text-blue-600">3.</span><span><strong>You file multiple forms at once.</strong> When you finally file I-485, you typically file I-765 and I-131 at the same time — three separate applications, three separate processing tracks, three separate fees.</span></li>
                </ul>
              </section>

              {/* Forms table */}
              <section>
                <h2 className="text-xl font-extrabold text-ink-900">USCIS forms at a glance</h2>
                <div className="mt-4 overflow-x-auto rounded-2xl border border-ink-900/5">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-ink-900/5 bg-ink-50/60">
                        <th className="px-4 py-3 text-left font-semibold text-ink-800">Form</th>
                        <th className="px-4 py-3 text-left font-semibold text-ink-800">Common use</th>
                        <th className="px-4 py-3 text-left font-semibold text-ink-800 hidden sm:table-cell">Filed by</th>
                        <th className="px-4 py-3 text-left font-semibold text-ink-800 hidden md:table-cell">Indian situation</th>
                        <th className="px-4 py-3 text-left font-semibold text-ink-800">Guide</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-900/5 bg-white">
                      {FORM_ROWS.map((r) => (
                        <tr key={r.form} className="hover:bg-ink-50/30">
                          <td className="px-4 py-3 font-bold text-blue-700">{r.form}</td>
                          <td className="px-4 py-3 text-ink-700">{r.use}</td>
                          <td className="px-4 py-3 text-ink-500 hidden sm:table-cell">{r.filer}</td>
                          <td className="px-4 py-3 text-ink-500 hidden md:table-cell">{r.indian}</td>
                          <td className="px-4 py-3">
                            <Link
                              href={`/uscis/forms/${r.slug}`}
                              className="text-brand-600 font-semibold hover:underline"
                            >
                              Details →
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Individual form cards */}
              <section>
                <h2 className="text-xl font-extrabold text-ink-900">Each form explained</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {formsChildPages.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/uscis/forms/${p.slug}`}
                      className="group rounded-2xl border border-ink-900/10 bg-white p-5 transition hover:border-blue-400 hover:shadow-sm"
                    >
                      <span className="inline-block rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">{p.formNumber}</span>
                      <h3 className="mt-2 font-bold text-ink-900 group-hover:text-blue-700 leading-snug">{p.navLabel}</h3>
                      <p className="mt-1.5 text-sm text-ink-500 line-clamp-2">{p.excerpt}</p>
                      <p className="mt-2 text-xs font-semibold text-blue-600">Read guide →</p>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Employer vs self */}
              <section>
                <h2 className="text-xl font-extrabold text-ink-900">Employer-filed vs. self-filed forms</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-3">Employer files</p>
                    <ul className="space-y-3">
                      {EMPLOYER_FORMS.map((f) => (
                        <li key={f.form}>
                          <span className="font-bold text-ink-900">{f.form}</span>
                          <span className="text-sm text-ink-600"> — {f.note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-green-100 bg-green-50/50 p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-green-700 mb-3">You file (self or family)</p>
                    <ul className="space-y-3">
                      {SELF_FORMS.map((f) => (
                        <li key={f.form}>
                          <span className="font-bold text-ink-900">{f.form}</span>
                          <span className="text-sm text-ink-600"> — {f.note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* Common mistakes */}
              <section>
                <h2 className="text-xl font-extrabold text-ink-900">Common mistakes with USCIS forms</h2>
                <div className="mt-4 space-y-3">
                  {MISTAKES.map((m, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-xl border border-rose-100 bg-rose-50/40 p-4">
                      <span className="mt-0.5 flex-none text-lg text-rose-500">✗</span>
                      <div>
                        <p className="text-sm font-semibold text-ink-900">{m.title}</p>
                        <p className="mt-0.5 text-sm text-ink-600">{m.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* FAQ */}
              <section>
                <h2 className="text-xl font-extrabold text-ink-900">Frequently asked questions</h2>
                <div className="mt-4 space-y-4">
                  {faqs.map((f, i) => (
                    <div key={i} className="rounded-2xl border border-ink-900/5 bg-white p-5">
                      <p className="font-semibold text-ink-900">{f.question}</p>
                      <p className="mt-2 text-sm leading-relaxed text-ink-700">{f.answer}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Related tools */}
              <section>
                <h2 className="text-xl font-extrabold text-ink-900 mb-4">Related tools</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { href: "/tools/uscis-form-finder", label: "USCIS Form Finder", desc: "Which form is this? Find the right USCIS form for your situation" },
                    { href: "/tools/uscis-notice-decoder", label: "USCIS Notice Decoder", desc: "Decode I-797 receipts, RFEs, approval notices, biometrics" },
                    { href: "/tools/uscis-case-status-meaning", label: "Case Status Decoder", desc: "What does your USCIS online status actually mean?" },
                    { href: "/tools/processing-times", label: "Processing Times", desc: "Current USCIS processing times by form" },
                    { href: "/tools/green-card-stage-finder", label: "Green Card Stage Finder", desc: "Where are you in the PERM → I-140 → I-485 process?" },
                    { href: "/tools/priority-date-checker", label: "Priority Date Checker", desc: "Is your EB priority date current in the visa bulletin?" },
                  ].map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      className="group rounded-xl border border-ink-900/10 bg-white p-4 transition hover:border-brand-400 hover:shadow-sm"
                    >
                      <p className="text-sm font-semibold text-ink-900 group-hover:text-brand-700">{t.label}</p>
                      <p className="mt-0.5 text-xs text-ink-500">{t.desc}</p>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Internal links */}
              <section className="flex flex-wrap gap-2 text-sm">
                {[
                  { href: "/uscis", label: "USCIS Hub" },
                  { href: "/uscis/case-status", label: "Case Status Guide" },
                  { href: "/uscis/myuscis-account", label: "myUSCIS Account" },
                  { href: "/h1b", label: "H-1B Guide" },
                  { href: "/green-card", label: "Green Card Guide" },
                ].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="rounded-full border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:border-blue-400 hover:text-blue-700"
                  >
                    {l.label}
                  </Link>
                ))}
              </section>

              {/* Disclaimer */}
              <section className="rounded-2xl border border-ink-900/5 bg-white p-6 text-sm text-ink-500">
                <strong className="font-semibold text-ink-700">Educational guide — not legal advice.</strong>{" "}
                USCIS form numbers, fees, filing procedures, and eligibility requirements change. Always verify with the official{" "}
                <a href="https://www.uscis.gov/forms" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">
                  USCIS forms page
                </a>{" "}
                and consult a licensed immigration attorney for your specific situation.
                NRItoUSA is not affiliated with USCIS or any US government agency.
              </section>

            </div>
          </Container>
        </div>
      </article>

      <Newsletter />
    </>
  );
}
