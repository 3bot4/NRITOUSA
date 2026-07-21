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
import { myuscisChildPages } from "@/lib/myuscisCluster";

const PAGE_PATH = "/uscis/myuscis-account";
const UPDATED = "2026-06-16";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title:
      "myUSCIS Account Explained | USCIS Online Account Number & Access Code",
    description:
      "Learn how myUSCIS works for Indian applicants. Understand USCIS online account number, access code, paper-filed cases, notices, case updates and privacy tips.",
    path: PAGE_PATH,
    type: "article",
    openGraph: { publishedTime: UPDATED, modifiedTime: UPDATED },
  });
}

const crumbs = [
  { name: "Home", url: "/" },
  { name: "USCIS Hub", url: "/uscis" },
  { name: "myUSCIS Account", url: PAGE_PATH },
];

const faqs: FaqItem[] = [
  {
    question: "What is myUSCIS and do I need it?",
    answer:
      "myUSCIS (my.uscis.gov) is USCIS's official online account portal where you can track cases, receive status notifications, respond to some RFEs online, update your address, and link paper-filed petitions. A myUSCIS account is not required — your attorney handles official filings — but it is useful for staying informed in real time. Creating one is free.",
  },
  {
    question: "What is the USCIS online account number?",
    answer:
      "The USCIS online account number is a unique identifier assigned to you when you register on my.uscis.gov. It is different from your A-Number (alien registration number) and your I-797 receipt number. If your employer's attorney is filing a paper petition on your behalf, you can provide them this number so USCIS links the case to your myUSCIS dashboard automatically.",
  },
  {
    question: "What is a USCIS online access code?",
    answer:
      "A USCIS online access code is a one-time code that USCIS mails to the address on your paper petition. You enter it on my.uscis.gov to link that case to your account — useful when your attorney did not enter your online account number before filing. The code is printed on a separate notice, not on your I-797C receipt notice.",
  },
  {
    question: "How do I add my H1B petition to my myUSCIS account?",
    answer:
      "Two ways: (1) Before filing — give your attorney your USCIS online account number so they can enter it on the petition. (2) After filing — wait for USCIS to mail you an online access code notice, then go to my.uscis.gov, click 'Add a case,' enter your receipt number and access code. The case appears in your dashboard within 24–48 hours.",
  },
  {
    question: "What is the difference between myUSCIS and the USCIS case status portal?",
    answer:
      "The USCIS case status portal at egov.uscis.gov/casestatus is a quick public lookup by receipt number — no account needed. myUSCIS (my.uscis.gov) is your personal dashboard with linked cases, email notifications, and in some instances online response functionality. Both show the same underlying status data. See /uscis/myuscis-vs-case-status for a full comparison.",
  },
  {
    question: "How do I update my address with USCIS?",
    answer:
      "All non-citizens must file Form AR-11 within 10 days of any address change. The fastest way is online at uscis.gov/ar-11 — free, no attorney needed. You can also update your address through your myUSCIS account profile. For pending I-485 or I-130 cases, ask your attorney to also file a written change of address notice with the service center.",
  },
  {
    question: "What are the different types of USCIS notices (I-797)?",
    answer:
      "The I-797 is USCIS's Notice of Action. I-797A is an approval notice with a new I-94 attached (most H1B approvals). I-797B is an approval notice without I-94 (petitioner outside US). I-797C is an informational notice — receipt, transfer, rejection, biometrics appointment, or access code. I-797D accompanies specific action items like combo card explanations.",
  },
  {
    question: "What should I do if I get a USCIS RFE notice?",
    answer:
      "Contact your immigration attorney immediately. An RFE (Request for Evidence) is not a denial — USCIS needs more documentation. Follow the exact deadline printed on the notice (the standard maximum is generally up to about 84 days, ≈87 with US mailing time; some forms use 30 days); missing it lets USCIS decide the case on the existing record or as abandoned. Do not wait even one week to alert your attorney, as preparing a strong RFE response takes significant time.",
  },
  {
    question: "Can USCIS see what I do in my myUSCIS account?",
    answer:
      "USCIS operates the platform, so yes — they can see account activity at the server level. Routine case status checks have no immigration consequences. Avoid uploading any documents to your account outside of official case responses. Do not share your account login with your employer or attorney — they have their own representative accounts.",
  },
  {
    question: "My myUSCIS account is locked. How do I recover it?",
    answer:
      "Go to my.uscis.gov and use the 'Forgot Password' or 'Unlock Account' option. USCIS accounts typically lock after multiple failed login attempts. If you cannot recover via email reset, contact the USCIS Contact Center at 1-800-375-5283 or submit an online help request through the site. Do not create a second account — this can cause case-linking issues.",
  },
];

const whoCanUse = [
  {
    icon: "💼",
    who: "H1B worker",
    use: "Link your employer's paper I-129 petition, receive status updates, track I-140 approval, monitor your green card queue position.",
    links: [{ label: "H1B Guide", href: "/h1b" }, { label: "I-797 Notice Types", href: "/uscis/i-797-notice" }],
  },
  {
    icon: "👩‍👦",
    who: "H4 / H4 EAD",
    use: "Track your H4 extension and H4 EAD (I-765) renewal. Receive notifications when your EAD card is approved and being produced.",
    links: [{ label: "H4 EAD Navigator", href: "/tools/h4-ead-navigator" }],
  },
  {
    icon: "🎓",
    who: "F1 / OPT",
    use: "Monitor OPT (I-765) application status and STEM OPT extension. Not typically needed during active status, but useful for tracking EAD production.",
    links: [],
  },
  {
    icon: "🟩",
    who: "I-485 applicant",
    use: "Track adjustment of status stages (biometrics, interview, approval). Critical for monitoring once I-485 is filed — especially for RFE notices.",
    links: [{ label: "Green Card Stage Finder", href: "/tools/green-card-stage-finder" }],
  },
  {
    icon: "🦅",
    who: "N-400 (citizenship)",
    use: "N-400 naturalization applications can be filed directly through myUSCIS. Track interview scheduling and oath ceremony notice.",
    links: [{ label: "Citizenship Checklist", href: "/tools/citizenship-checklist" }],
  },
  {
    icon: "👨‍👩‍👧",
    who: "Family green card (I-130)",
    use: "Track I-130 petition status for spouse or family members. Receive notifications at each stage of the family-based immigration process.",
    links: [{ label: "USCIS Hub", href: "/uscis" }],
  },
];

const commonNotices = [
  {
    notice: "I-797C — Receipt Notice",
    desc: "Confirms USCIS received your filing. Contains your receipt number. Does not mean anything about the outcome.",
    urgency: "No action needed",
    slug: "i-797-notice",
  },
  {
    notice: "I-797C — Biometrics Notice",
    desc: "Appointment scheduled at an Application Support Center (ASC) for fingerprints and photo.",
    urgency: "Attend appointment",
    slug: "biometrics-notice",
  },
  {
    notice: "I-797E — RFE Notice",
    desc: "USCIS requesting additional evidence. Hard deadline on the notice — standard max ~84 days (≈87 with US mail).",
    urgency: "Contact attorney immediately",
    slug: "rfe-notice",
  },
  {
    notice: "I-797A / I-797B — Approval Notice",
    desc: "Your petition was approved. I-797A includes new I-94 at the bottom for H1B approvals.",
    urgency: "Verify details carefully",
    slug: "approval-notice",
  },
  {
    notice: "I-797C — Transfer Notice",
    desc: "Case moved to a different USCIS service center. Receipt number unchanged. Reset processing time expectations.",
    urgency: "No action needed",
    slug: "case-transferred",
  },
  {
    notice: "Online Access Code Notice",
    desc: "One-time code mailed to your address to link a paper-filed case to your myUSCIS account.",
    urgency: "Enter on my.uscis.gov",
    slug: "online-access-code",
  },
];

export default function MyuscisAccountPage() {
  const url = absoluteUrl(PAGE_PATH);

  const articleJsonLd = {
    "@type": "Article",
    "@id": `${url}#article`,
    headline:
      "myUSCIS Account Explained for Indians: Online Account Number, Access Code, Notices & Case Updates",
    description:
      "Learn how myUSCIS works for Indian applicants. Understand USCIS online account number, access code, paper-filed cases, notices, case updates and privacy tips.",
    datePublished: UPDATED,
    dateModified: UPDATED,
    author: { "@type": "Organization", name: site.publisher },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    keywords:
      "my uscis, uscis account, uscis online account number, uscis online access code, add paper case to uscis account, uscis notice explained, i797 notice, myUSCIS login",
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
                <Link href="/uscis"
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 font-semibold text-white">
                  <span>🛂</span> USCIS
                </Link>
                <span>Updated June 16, 2026</span>
              </div>

              <h1 className="mt-3 text-[1.75rem] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[2rem]">
                myUSCIS Account Explained for Indians: Online Account Number, Access Code, Notices &amp; Case Updates
              </h1>
              <p className="mt-2.5 text-base italic leading-[1.6] text-ink-500">
                A complete guide to my.uscis.gov for Indian H1B workers, green card applicants, H4 EAD holders, and citizenship applicants — what myUSCIS does, how to add paper cases, and what every USCIS notice means.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/uscis/online-account-number"
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700">
                  Online Account Number →
                </Link>
                <Link href="/uscis/add-paper-case-to-account"
                  className="inline-flex items-center gap-2 rounded-lg border border-ink-900/10 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 shadow-sm transition hover:border-brand-400">
                  Add Paper Case →
                </Link>
                <Link href="/tools/uscis-notice-decoder"
                  className="inline-flex items-center gap-2 rounded-lg border border-ink-900/10 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 shadow-sm transition hover:border-brand-400">
                  Notice Decoder Tool →
                </Link>
              </div>
            </div>
          </Container>
        </header>

        <div className="py-8 sm:py-10">
          <Container>
            <div className="mx-auto max-w-[720px] space-y-10">

              {/* ── Disclaimer ──────────────────────────────────────────── */}
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-amber-900">
                <p className="font-semibold text-amber-800">
                  NRItoUSA is not affiliated with USCIS, DHS, or my.uscis.gov.
                </p>
                <p className="mt-1 text-amber-800/80">
                  This guide is educational only. Always verify details on the official{" "}
                  <a href="https://my.uscis.gov" className="font-medium underline" rel="nofollow noopener" target="_blank">my.uscis.gov</a>
                  {" "}and{" "}
                  <a href="https://www.uscis.gov" className="font-medium underline" rel="nofollow noopener" target="_blank">uscis.gov</a>
                  . Consult your immigration attorney for advice specific to your case.
                </p>
              </div>

              {/* ── SECTION 1: Quick answer ──────────────────────────────── */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">Quick answer</p>
                <p className="text-sm leading-relaxed text-ink-800">
                  <strong>myUSCIS (my.uscis.gov)</strong> is the official USCIS online account portal. It lets you track cases, receive notifications, link paper-filed petitions, and update your address. A myUSCIS account is not required — your attorney handles filings — but it gives you real-time visibility into your case. To link a paper-filed H1B or I-140, you need either your <strong>USCIS online account number</strong> (given to your attorney before filing) or an <strong>online access code</strong> (mailed by USCIS after filing).
                </p>
              </div>

              {/* ── SECTION 2: What is myUSCIS ───────────────────────────── */}
              <section>
                <h2 className="text-xl font-bold text-ink-900 mb-3">What is myUSCIS?</h2>
                <p className="text-sm leading-relaxed text-ink-600 mb-4">
                  myUSCIS is USCIS&apos;s official online account system at <strong>my.uscis.gov</strong>. It launched as a modernization effort to give applicants direct online access to their immigration cases, replacing some paper-based workflows.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { icon: "📋", title: "Track linked cases", desc: "See case status for every petition or application linked to your account" },
                    { icon: "🔔", title: "Status notifications", desc: "Email or text alerts when your case status changes — no manual checking needed" },
                    { icon: "📄", title: "Respond to RFEs online", desc: "Some form types allow electronic evidence submission instead of mailing" },
                    { icon: "🏠", title: "Update address", desc: "File AR-11 change-of-address directly through your account" },
                    { icon: "🗓️", title: "Schedule appointments", desc: "Some interview and InfoPass scheduling available for certain case types" },
                    { icon: "📝", title: "File new applications", desc: "N-400 naturalization and some renewals can be filed online through myUSCIS" },
                  ].map((f) => (
                    <div key={f.title} className="flex items-start gap-3 rounded-xl border border-ink-900/5 bg-white p-4">
                      <span className="text-xl">{f.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-ink-900">{f.title}</p>
                        <p className="text-xs text-ink-500">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── SECTION 3: myUSCIS vs case status ───────────────────── */}
              <section>
                <h2 className="text-xl font-bold text-ink-900 mb-3">myUSCIS vs USCIS case status portal</h2>
                <div className="overflow-x-auto rounded-2xl border border-ink-900/5">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-ink-50/70 text-left">
                        <th className="px-4 py-3 font-semibold text-ink-700">Feature</th>
                        <th className="px-4 py-3 font-semibold text-ink-700">myUSCIS</th>
                        <th className="px-4 py-3 font-semibold text-ink-700">Status Portal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-900/5 bg-white">
                      {[
                        ["Login required", "Yes", "No"],
                        ["See all cases at once", "Yes", "No — one at a time"],
                        ["Email/text notifications", "Yes", "No"],
                        ["Respond to RFEs online", "Some forms", "No"],
                        ["Link paper cases", "Yes", "No"],
                        ["Underlying status data", "Same", "Same"],
                      ].map(([f, a, b]) => (
                        <tr key={f}>
                          <td className="px-4 py-3 font-medium text-ink-800">{f}</td>
                          <td className="px-4 py-3 text-ink-700">{a}</td>
                          <td className="px-4 py-3 text-ink-500">{b}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs text-ink-500">
                  <Link href="/uscis/myuscis-vs-case-status" className="text-brand-600 underline">Full comparison: myUSCIS vs USCIS case status portal →</Link>
                </p>
              </section>

              {/* ── SECTION 4: Online account number ────────────────────── */}
              <section>
                <h2 className="text-xl font-bold text-ink-900 mb-3">USCIS online account number explained</h2>
                <p className="text-sm leading-relaxed text-ink-600 mb-3">
                  Your <strong>USCIS online account number</strong> is assigned when you create a myUSCIS account. It is separate from your A-Number and receipt number.
                </p>
                <div className="rounded-xl border border-ink-900/5 bg-white p-4 text-sm">
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      { label: "A-Number", desc: "Your permanent immigration ID. Starts with 'A' + digits. On all immigration documents." },
                      { label: "Receipt number", desc: "13-character case tracking number from I-797 notice. One per petition." },
                      { label: "Online account number", desc: "Assigned by myUSCIS at registration. Used to link paper cases to your dashboard." },
                    ].map((n) => (
                      <div key={n.label} className="rounded-lg bg-ink-50/50 p-3">
                        <p className="font-semibold text-ink-900 text-xs uppercase tracking-wide">{n.label}</p>
                        <p className="mt-1 text-xs text-ink-600">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-xs text-ink-500">
                  <Link href="/uscis/online-account-number" className="text-brand-600 underline">Full guide: USCIS online account number →</Link>
                </p>
              </section>

              {/* ── SECTION 5: Online access code ───────────────────────── */}
              <section>
                <h2 className="text-xl font-bold text-ink-900 mb-3">USCIS online access code explained</h2>
                <p className="text-sm leading-relaxed text-ink-600 mb-3">
                  If your attorney did not enter your online account number before filing, USCIS may mail a <strong>one-time access code</strong> to the address on your petition. Enter it on my.uscis.gov to link the case.
                </p>
                <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 text-xs text-amber-900">
                  <strong className="font-semibold">Important: </strong>The access code is mailed to the address on your petition — not necessarily your current address. If you have moved since filing, the code may go to your old address. Check with your attorney about the petition address.
                </div>
                <p className="mt-2 text-xs text-ink-500">
                  <Link href="/uscis/online-access-code" className="text-brand-600 underline">Full guide: USCIS online access code →</Link>
                </p>
              </section>

              {/* ── SECTION 6: Adding a paper case ──────────────────────── */}
              <section>
                <h2 className="text-xl font-bold text-ink-900 mb-3">Adding a paper-filed case to your account</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                    <p className="font-semibold text-blue-900 text-sm mb-1">Method 1 — Before filing</p>
                    <ol className="space-y-1 text-xs text-blue-800 list-decimal list-inside">
                      <li>Create myUSCIS account at my.uscis.gov</li>
                      <li>Find your online account number in your profile</li>
                      <li>Give the number to your attorney</li>
                      <li>Attorney enters it on the paper petition</li>
                      <li>Case links automatically after USCIS processes receipt</li>
                    </ol>
                  </div>
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                    <p className="font-semibold text-emerald-900 text-sm mb-1">Method 2 — After filing</p>
                    <ol className="space-y-1 text-xs text-emerald-800 list-decimal list-inside">
                      <li>Wait for USCIS to mail your online access code notice</li>
                      <li>Log in to my.uscis.gov</li>
                      <li>Click &quot;Add a case&quot; or &quot;Link a paper case&quot;</li>
                      <li>Enter your receipt number (from I-797C)</li>
                      <li>Enter the access code — case appears within 24–48 hrs</li>
                    </ol>
                  </div>
                </div>
                <p className="mt-2 text-xs text-ink-500">
                  <Link href="/uscis/add-paper-case-to-account" className="text-brand-600 underline">Full step-by-step guide: adding a paper case →</Link>
                </p>
              </section>

              {/* ── SECTION 7: Who may use myUSCIS ──────────────────────── */}
              <section>
                <h2 className="text-xl font-bold text-ink-900 mb-3">Who uses myUSCIS and what for</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {whoCanUse.map((w) => (
                    <div key={w.who} className="rounded-2xl border border-ink-900/5 bg-white p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{w.icon}</span>
                        <p className="font-semibold text-ink-900">{w.who}</p>
                      </div>
                      <p className="text-sm text-ink-600 leading-relaxed">{w.use}</p>
                      {w.links.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {w.links.map((l) => (
                            <Link key={l.href} href={l.href}
                              className="text-xs font-medium text-brand-600 hover:text-brand-700 hover:underline">
                              {l.label} →
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* ── SECTION 8: Common notices ────────────────────────────── */}
              <section>
                <h2 className="text-xl font-bold text-ink-900 mb-3">Common USCIS notices in myUSCIS</h2>
                <div className="space-y-3">
                  {commonNotices.map((n) => (
                    <div key={n.notice} className="flex items-start gap-4 rounded-xl border border-ink-900/5 bg-white p-4">
                      <div className="flex-1">
                        <p className="font-semibold text-ink-900 text-sm">{n.notice}</p>
                        <p className="text-xs text-ink-500 mt-0.5">{n.desc}</p>
                      </div>
                      <div className="flex-none text-right">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          n.urgency === "Contact attorney immediately"
                            ? "bg-rose-100 text-rose-700"
                            : n.urgency === "Attend appointment" || n.urgency === "Verify details carefully"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-ink-100 text-ink-600"
                        }`}>
                          {n.urgency}
                        </span>
                        <div className="mt-1">
                          <Link href={`/uscis/${n.slug}`}
                            className="text-[10px] font-medium text-brand-600 hover:text-brand-700">
                            Guide →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-ink-500">
                  <Link href="/tools/uscis-notice-decoder" className="text-brand-600 underline font-semibold">
                    Use the USCIS Notice Decoder for your specific notice type →
                  </Link>
                </p>
              </section>

              {/* ── SECTION 9: Privacy tips ──────────────────────────────── */}
              <section>
                <h2 className="text-xl font-bold text-ink-900 mb-3">Privacy and security tips</h2>
                <div className="space-y-2">
                  {[
                    { tip: "Use your personal email — not your work email", why: "Your employer should not control your USCIS account login" },
                    { tip: "Do not share your myUSCIS login", why: "Your attorney has their own USCIS representative account — they do not need yours" },
                    { tip: "Use a strong, unique password", why: "Your USCIS account is linked to your immigration record" },
                    { tip: "Access only on personal devices", why: "Employer-managed devices may have IT visibility into your activity" },
                    { tip: "Do not upload documents outside of official case responses", why: "Documents uploaded to active cases become part of your official immigration record" },
                  ].map((t) => (
                    <div key={t.tip} className="rounded-xl border border-ink-900/5 bg-white p-4">
                      <p className="text-sm font-semibold text-ink-900">✓ {t.tip}</p>
                      <p className="text-xs text-ink-500 mt-0.5">{t.why}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-ink-500">
                  <Link href="/uscis/account-privacy" className="text-brand-600 underline">Full privacy guide: what USCIS can see in your account →</Link>
                </p>
              </section>

              {/* ── SECTION 10: Login problems ───────────────────────────── */}
              <section>
                <h2 className="text-xl font-bold text-ink-900 mb-3">Account locked or login problems</h2>
                <div className="rounded-2xl border border-ink-900/5 bg-white p-5 space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-ink-900">Account locked after failed attempts</p>
                    <p className="text-ink-600 mt-0.5">Use the &quot;Forgot Password&quot; or &quot;Unlock Account&quot; link on the login page. A reset link is sent to your registered email.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-ink-900">Forgot email address used to register</p>
                    <p className="text-ink-600 mt-0.5">Contact USCIS Contact Center at 1-800-375-5283. Do not create a second account — duplicate accounts cause case-linking issues.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-ink-900">Case not showing after linking</p>
                    <p className="text-ink-600 mt-0.5">Allow 24–48 hours. Verify your receipt number is correct (no spaces, all uppercase letters). If still missing, contact USCIS.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-ink-900">Cannot access myUSCIS from certain locations</p>
                    <p className="text-ink-600 mt-0.5">If using a VPN, try disabling it — USCIS blocks some VPN IP ranges. Access the site from a US IP address when possible.</p>
                  </div>
                </div>
              </section>

              {/* ── Child pages grid ─────────────────────────────────────── */}
              <section>
                <h2 className="text-xl font-bold text-ink-900 mb-4">Explore this myUSCIS guide</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {myuscisChildPages.map((p) => (
                    <Link key={p.slug} href={`/uscis/${p.slug}`}
                      className="group rounded-2xl border border-ink-900/10 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 mb-0.5">
                        {p.kind === "reference" ? "Reference" : "Guide"}
                      </p>
                      <h3 className="font-semibold text-ink-900 group-hover:text-blue-700">{p.navLabel}</h3>
                      <p className="mt-1.5 text-sm text-ink-500 line-clamp-2">{p.excerpt}</p>
                      <p className="mt-2 text-xs text-ink-400">{p.readingTime} min read</p>
                    </Link>
                  ))}
                </div>
              </section>

              {/* ── FAQ ──────────────────────────────────────────────────── */}
              <section>
                <h2 className="text-xl font-bold text-ink-900 mb-4">Frequently asked questions</h2>
                <div className="space-y-4">
                  {faqs.map((faq) => (
                    <div key={faq.question} className="rounded-2xl border border-ink-900/5 bg-white p-5">
                      <p className="font-semibold text-ink-900">{faq.question}</p>
                      <p className="mt-2 text-sm leading-relaxed text-ink-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── Related tools ────────────────────────────────────────── */}
              <section>
                <h2 className="text-lg font-bold text-ink-900 mb-3">Related tools and guides</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { href: "/tools/uscis-notice-decoder", label: "USCIS Notice Decoder", desc: "Decode any USCIS notice — receipt, RFE, biometrics, approval" },
                    { href: "/tools/uscis-case-status-meaning", label: "USCIS Case Status Meaning", desc: "Plain-English meaning for every status message" },
                    { href: "/tools/uscis-processing-delay-checker", label: "Processing Delay Checker", desc: "Is your H1B, I-140, I-485, or EAD case delayed?" },
                    { href: "/uscis/receipt-number", label: "Receipt Number Guide", desc: "IOE, LIN, SRC, EAC, WAC, MSC — what each means" },
                    { href: "/uscis/case-status", label: "USCIS Case Status Explained", desc: "Every status message from Received to Card Was Mailed" },
                    { href: "/uscis", label: "USCIS Hub", desc: "The complete USCIS hub — H1B, green card, EAD, notices" },
                  ].map((l) => (
                    <Link key={l.href} href={l.href}
                      className="group rounded-xl border border-ink-900/10 bg-white p-4 transition hover:border-blue-400 hover:shadow-sm">
                      <p className="text-sm font-semibold text-ink-900 group-hover:text-blue-700">{l.label}</p>
                      <p className="mt-0.5 text-xs text-ink-500">{l.desc}</p>
                    </Link>
                  ))}
                </div>
              </section>

              {/* ── Disclaimer ───────────────────────────────────────────── */}
              <div className="rounded-2xl border border-ink-900/5 bg-ink-50/50 p-5 text-xs leading-relaxed text-ink-500">
                <strong className="font-semibold text-ink-700">Disclaimer: </strong>
                This guide is for general educational purposes only and is not legal or immigration advice. NRItoUSA is not affiliated with USCIS, the Department of Homeland Security, my.uscis.gov, or any US government agency. USCIS rules, account features, and notice procedures change. Always verify on the official{" "}
                <a href="https://my.uscis.gov" target="_blank" rel="noopener noreferrer nofollow" className="text-brand-600 underline">my.uscis.gov</a>
                {" "}and{" "}
                <a href="https://www.uscis.gov" target="_blank" rel="noopener noreferrer nofollow" className="text-brand-600 underline">uscis.gov</a>
                {" "}and consult a licensed immigration attorney for advice specific to your situation.
              </div>

            </div>
          </Container>
        </div>
      </article>

      <Newsletter />
    </>
  );
}
