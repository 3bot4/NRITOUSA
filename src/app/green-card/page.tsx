import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Newsletter from "@/components/Newsletter";
import RelatedHubs from "@/components/RelatedHubs";
import GreenCardStageFinder from "@/components/tools/GreenCardStageFinder";
import {
  pageMetadata,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  absoluteUrl,
  type FaqItem,
} from "@/lib/seo";
import { site } from "@/lib/site";
import { greenCardChildPages } from "@/lib/greenCardCluster";
import { currentBulletinNote } from "@/lib/visa-bulletin";

const PAGE_PATH = "/green-card";
const UPDATED = "2026-06-16";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "Green Card for Indians: PERM, I-140 & I-485 Guide",
    description:
      "Complete green-card guide for Indian H-1B workers: PERM, I-140, priority dates, I-485, EAD/AP, the India backlog, EB-2 vs EB-3, and AC21 portability.",
    path: PAGE_PATH,
    type: "article",
    openGraph: { publishedTime: UPDATED, modifiedTime: UPDATED },
  });
}

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Green Card Guide", url: PAGE_PATH },
];

const faqs: FaqItem[] = [
  {
    question: "How long does the green card process take for Indians?",
    answer:
      "For most Indian workers on H1B visas in EB-2 or EB-3, the total process — from PERM filing to green card approval — takes many years. The PERM + I-140 stage takes 1–3 years. The priority date wait for India EB-2 and EB-3 is currently measured in years to decades. I-485 processing after filing takes 1–3+ years. The actual wait depends heavily on your priority date and visa bulletin movement.",
  },
  {
    question: "What is a priority date and when is mine set?",
    answer:
      "Your priority date is the date your PERM labor certification was filed with the Department of Labor (for EB-2/EB-3). For EB-1 (no PERM), it is set at the I-140 filing date. This date determines your place in the visa queue. For Indian-born applicants, the per-country 7% cap means only about 9,800 employment-based visas can go to India-born applicants each year — creating a multi-year backlog.",
  },
  {
    question: "Can I change employers while my green card is in process?",
    answer:
      "Yes, with important caveats. After your I-140 is approved and I-485 has been pending for 180 or more days, you can change to a same-or-similar job under AC21 portability (INA 204(j)) without restarting the process. If I-485 has not been filed yet, you can still change employers — but your new employer will need to file a new PERM and I-140 (your priority date from the old PERM can sometimes be preserved if the I-140 was not revoked). Consult your attorney before any job change.",
  },
  {
    question: "What does I-140 approval mean for my H1B?",
    answer:
      "An approved I-140 unlocks 3-year H1B extensions beyond the standard 6-year cap — allowing you to maintain legal status while waiting for your priority date. The I-140 does not grant permanent residence or work authorization by itself. You still need your priority date to become current and I-485 to be approved.",
  },
  {
    question: "What is the difference between Final Action Date and Dates for Filing?",
    answer:
      "The State Department visa bulletin has two charts. The Final Action Date (Part A) is the cutoff for when USCIS can actually approve your green card. The Dates for Filing (Part B) is an earlier window when USCIS may permit you to file I-485 and get a work permit and travel document while waiting — if USCIS announces it that month. Always check both charts and the USCIS monthly acceptance memo at uscis.gov.",
  },
  {
    question: "What is an EB-3 downgrade and should I consider it?",
    answer:
      "If you have an approved EB-2 I-140 but the EB-3 India cutoff date is more current, you can ask your employer to file a new EB-3 PERM and I-140 to potentially move faster. This requires a separate PERM process and I-140, and carries costs and risks. The priority date from the original EB-2 PERM can sometimes be ported to the new EB-3 I-140. Consult your attorney to model whether a downgrade makes sense given current visa bulletin movement.",
  },
  {
    question: "Can I travel to India while my I-485 is pending?",
    answer:
      "Do not travel internationally while I-485 is pending without an approved Advance Parole (Form I-131) document in hand. Traveling on H1B visa without AP may or may not preserve your status, but if your I-485 was filed while in H1B status and you depart without AP, USCIS may treat the I-485 as abandoned. The safest approach: get AP, travel only after it is approved, carry all documents, and consult your attorney before any travel.",
  },
  {
    question: "My child is approaching 21 — will they age out of my green card case?",
    answer:
      "Potentially. CSPA (Child Status Protection Act) may protect your child by subtracting the time I-140 was pending from their biological age. For Indian applicants, the long backlog makes this a real risk. If your CSPA-adjusted child is still under 21 when a visa becomes available, they must also seek to acquire the visa within 1 year of availability. Discuss CSPA early — ideally years before your child turns 21 — with your immigration attorney.",
  },
  {
    question: "Does I-485 need to be filed at the same time as EAD and Advance Parole?",
    answer:
      "EAD (I-765) and Advance Parole (I-131) are filed concurrently with I-485 as part of the same package. Once your priority date is current and USCIS accepts the I-485, USCIS will adjudicate the EAD and AP as derivative benefits. You should file all three together in one package — your attorney will prepare the full filing with I-864 (Affidavit of Support) and I-693 (Medical Exam) included.",
  },
  {
    question: "What is AC21 portability?",
    answer:
      "AC21 refers to two separate protections. Section 214(n) covers H1B portability — starting work at a new employer after a valid H1B transfer petition is filed. Section 204(j) covers green card portability — after I-485 has been pending 180+ days and I-140 is approved, you can change to a same-or-similar occupation without losing your place in the queue. These are separate rules with different conditions — confirm your situation with your attorney.",
  },
];

export default function GreenCardPage() {
  const url = absoluteUrl(PAGE_PATH);

  const articleJsonLd = {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: "Green Card Process for Indians: PERM, I-140, Priority Date, I-485",
    description:
      "Complete green card guide for Indian H1B workers — PERM, I-140, priority date, visa bulletin, I-485, EAD, Advance Parole, India backlog, EB-2/EB-3, AC21 portability, CSPA.",
    datePublished: UPDATED,
    dateModified: UPDATED,
    author: { "@type": "Organization", name: site.publisher },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    keywords:
      "green card process for Indians, perm i140 i485, priority date India, green card backlog India, eb2 eb3 India",
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

      <div className="mx-auto max-w-[720px] px-4 sm:px-6 lg:px-8">

        {/* breadcrumb */}
        <nav aria-label="Breadcrumb" className="pt-8 mb-5 flex flex-wrap items-center gap-2 text-xs text-ink-400">
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

        {/* hero */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-ink-400">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-green-700 to-emerald-600 px-3 py-1 text-xs font-semibold text-white">
              🟢 Green Card Guide
            </span>
            <span>Updated July 2026</span>
          </div>
          <h1 className="mt-3 text-[2rem] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[2.5rem]">
            Green Card for Indians:<br className="hidden sm:block" /> PERM, I-140, Priority Date, I-485
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-ink-500">
            A complete guide to employment-based (EB) green card for Indian H1B workers — from PERM filing through I-485 approval, with India-specific guidance on the backlog, EB-2 vs EB-3, AC21 portability, and protecting your children with CSPA.
          </p>
        </div>

        {/* July 2026 bulletin note */}
        <div className="mb-8 rounded-2xl border border-amber-100 bg-amber-50/60 p-5 text-sm leading-relaxed text-amber-900">
          {currentBulletinNote}
        </div>

        {/* quick answer */}
        <div className="mb-8 rounded-2xl border border-green-100 bg-green-50/60 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-green-700 mb-2">Quick answer</p>
          <p className="text-sm leading-relaxed text-ink-800">
            The employment green card process has five major stages: <strong>PERM</strong> (DOL labor certification, 6–18 months), <strong>I-140</strong> (USCIS immigrant petition, 3–12 months), <strong>Priority date wait</strong> (varies — years to decades for India EB-2/EB-3), <strong>I-485 filing</strong> (when priority date is current or Dates for Filing is available), and <strong>I-485 adjudication</strong> (1–3+ years after filing). For Indian workers, the priority date wait dominates the total time.
          </p>
        </div>

        {/* ── SECTION 1: Who this guide is for ────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-4">Who this guide is for</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: "🛂", label: "H1B workers", desc: "On employer-sponsored H1B pursuing EB-2 or EB-3" },
              { icon: "🏢", label: "L1 visa holders", desc: "L1 workers considering EB-1C multinational manager route" },
              { icon: "📄", label: "PERM in progress", desc: "PERM filed or recently certified — what comes next" },
              { icon: "📋", label: "I-140 approved", desc: "I-140 approved but priority date not yet current" },
              { icon: "⏳", label: "Waiting for priority date", desc: "I-140 done, monitoring the monthly visa bulletin" },
              { icon: "📬", label: "I-485 pending", desc: "I-485 filed — EAD, AP, biometrics, interview stage" },
            ].map((c) => (
              <div key={c.label} className="flex items-start gap-3 rounded-xl border border-ink-900/5 bg-white p-4">
                <span className="text-xl">{c.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-ink-900">{c.label}</p>
                  <p className="text-xs text-ink-500">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 2: Five stages overview ────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-4">The five stages of the employment green card</h2>
          <div className="space-y-3">
            {[
              { n: "01", label: "PERM Labor Certification", time: "6–18 months", desc: "Your employer files with the Department of Labor to prove no qualified US worker is available for your position. Your PERM filing date becomes your priority date." },
              { n: "02", label: "I-140 Immigrant Petition", time: "3–12 months (or 15 business days with premium)", desc: "Your employer files Form I-140 with USCIS. Approval locks in your priority date and unlocks 3-year H1B extensions beyond the 6-year cap." },
              { n: "03", label: "Priority Date Wait", time: "Varies — years to decades for India", desc: "Your priority date must become current in the State Department visa bulletin before you can file I-485. For Indian EB-2/EB-3, this is the longest stage." },
              { n: "04", label: "I-485 Filing", time: "1–4 weeks to prepare and file", desc: "When your priority date is current (or USCIS authorizes Dates for Filing chart), you file I-485 (plus I-131 for Advance Parole, I-765 for EAD, I-864, I-693) as a package." },
              { n: "05", label: "I-485 Adjudication", time: "1–3+ years after filing", desc: "USCIS schedules biometrics, then an interview at your local field office. Once approved, you receive permanent resident status and a green card." },
            ].map((s) => (
              <div key={s.n} className="flex gap-4 rounded-2xl border border-ink-900/5 bg-white p-5">
                <div className="flex-none">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-800">{s.n}</span>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-ink-900">{s.label}</p>
                    <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs text-ink-500">{s.time}</span>
                  </div>
                  <p className="mt-1 text-sm text-ink-600">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 3: PERM ─────────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-2">PERM labor certification: setting your priority date</h2>
          <p className="text-sm text-ink-600 mb-4">PERM is a DOL process — not USCIS. Your employer's attorney files it, not you directly.</p>
          <div className="overflow-x-auto rounded-2xl border border-ink-900/5">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ink-50/70 text-left">
                  <th className="px-4 py-3 font-semibold text-ink-700">Step</th>
                  <th className="px-4 py-3 font-semibold text-ink-700">What happens</th>
                  <th className="px-4 py-3 font-semibold text-ink-700">Timing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-900/5 bg-white">
                {[
                  ["1. PWD", "Employer requests a Prevailing Wage Determination from DOL", "3–6 months"],
                  ["2. Recruitment", "Employer advertises the position and documents that no qualified US worker applied", "60–90 days minimum"],
                  ["3. PERM filing", "Employer files ETA-9089 with DOL — this date is your priority date", "Sets your place in queue"],
                  ["4. DOL audit", "~20–30% of PERMs are randomly audited — adds 6–12+ months", "If audited: 6–18 months total"],
                  ["5. PERM certified", "DOL certifies the PERM — valid 180 days to file I-140", "File I-140 within 180 days!"],
                ].map(([step, what, time]) => (
                  <tr key={step as string}>
                    <td className="px-4 py-3 font-medium text-ink-800">{step}</td>
                    <td className="px-4 py-3 text-ink-700">{what}</td>
                    <td className="px-4 py-3 text-ink-500">{time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-ink-500">
            EB-1 applicants skip PERM entirely. EB-2 NIW (National Interest Waiver) also skips PERM.{" "}
            <Link href="/green-card/perm" className="text-brand-600 underline">Read the full PERM guide →</Link>
          </p>
        </section>

        {/* ── SECTION 4: I-140 ─────────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-3">I-140 immigrant petition: what approval unlocks</h2>
          <p className="text-sm text-ink-600 mb-4">I-140 is filed by your employer (or by you for EB-1A/EB-2 NIW self-petition). PERM certification must precede I-140 filing for EB-2/EB-3.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: "✅", title: "What I-140 approval means", items: ["Priority date is formally locked in", "3-year H1B extensions unlocked beyond 6-year cap", "180-day AC21 clock for I-485 portability begins once I-485 is filed", "Approved I-140 survives employer withdrawal in most cases after 180 days"] },
              { icon: "❌", title: "What I-140 approval does NOT mean", items: ["Does not grant work authorization", "Does not grant permanent residence", "Does not mean your priority date is current", "Does not start the I-485 clock — priority date must be current first"] },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl border border-ink-900/5 bg-white p-5">
                <p className="font-semibold text-ink-900 mb-2">{c.icon} {c.title}</p>
                <ul className="space-y-1">
                  {c.items.map((item) => (
                    <li key={item} className="text-sm text-ink-600">• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-ink-500">
            <Link href="/green-card/i-140-approved-what-next" className="text-brand-600 underline">Read the full guide: I-140 approved — what next? →</Link>
          </p>
        </section>

        {/* ── SECTION 5: Priority date ─────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-3">Priority date and the visa bulletin</h2>
          <p className="text-sm text-ink-600 mb-4">The State Department publishes a new visa bulletin each month. Your priority date must be earlier than the cutoff date in the bulletin to move forward. If a category shows &ldquo;U&rdquo; (Unavailable) — as EB-2 India and EB-5 India Unreserved are in the July 2026 bulletin — no numbers are authorized that month and no case can be approved regardless of priority date.</p>
          <div className="overflow-x-auto rounded-2xl border border-ink-900/5">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ink-50/70 text-left">
                  <th className="px-4 py-3 font-semibold text-ink-700">Chart</th>
                  <th className="px-4 py-3 font-semibold text-ink-700">What it means</th>
                  <th className="px-4 py-3 font-semibold text-ink-700">When used</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-900/5 bg-white">
                <tr>
                  <td className="px-4 py-3 font-medium text-ink-800">Part A — Final Action Date</td>
                  <td className="px-4 py-3 text-ink-700">USCIS can approve your green card when your priority date is earlier than this date</td>
                  <td className="px-4 py-3 text-ink-500">Always applies — USCIS will not approve green card until this date is current</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-ink-800">Part B — Dates for Filing</td>
                  <td className="px-4 py-3 text-ink-700">USCIS can accept I-485 filing when priority date is earlier than this date — and this cutoff is later than Part A</td>
                  <td className="px-4 py-3 text-ink-500">Only when USCIS announces Part B can be used that month — check uscis.gov monthly</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-ink-500">
            <Link href="/green-card/priority-date" className="text-brand-600 underline">Read the full priority date and visa bulletin guide →</Link>
          </p>
        </section>

        {/* ── SECTION 6: India backlog ─────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-3">The India green card backlog explained</h2>
          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
            <p className="font-semibold text-amber-900 mb-2">Why India waits so long</p>
            <ul className="space-y-1.5 text-sm text-amber-800">
              <li>• US immigration law limits each country to 7% of employment-based green cards per fiscal year</li>
              <li>• India accounts for a huge proportion of all EB-2 and EB-3 applicants — far more than 7% of the total</li>
              <li>• This creates a queue that is currently measured in years for EB-1, and decades for EB-2 and EB-3</li>
              <li>• Approximately 9,800 employment-based visas are available for India per year across all EB categories</li>
              <li>• USCIS I-485 inventory (pending applicants) for India runs into hundreds of thousands</li>
            </ul>
          </div>
          <p className="mt-3 text-xs text-ink-500">
            <Link href="/green-card/green-card-backlog-india" className="text-brand-600 underline">Read the full India green card backlog guide →</Link>
          </p>
        </section>

        {/* ── SECTION 7: EB-2 vs EB-3 ─────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-3">EB-2 vs EB-3 for Indian applicants</h2>
          <div className="overflow-x-auto rounded-2xl border border-ink-900/5">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ink-50/70 text-left">
                  <th className="px-4 py-3 font-semibold text-ink-700">Category</th>
                  <th className="px-4 py-3 font-semibold text-ink-700">Typical requirement</th>
                  <th className="px-4 py-3 font-semibold text-ink-700">India backlog</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-900/5 bg-white">
                <tr>
                  <td className="px-4 py-3 font-medium text-ink-800">EB-1</td>
                  <td className="px-4 py-3 text-ink-700">Extraordinary ability / outstanding researcher / multinational exec — no PERM</td>
                  <td className="px-4 py-3 text-ink-500">Moderate — much shorter than EB-2/EB-3</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-ink-800">EB-2</td>
                  <td className="px-4 py-3 text-ink-700">Advanced degree (master's+) or exceptional ability; EB-2 NIW skips PERM</td>
                  <td className="px-4 py-3 text-ink-500">Very long — check current visa bulletin</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-ink-800">EB-3</td>
                  <td className="px-4 py-3 text-ink-700">Bachelor's degree or skilled worker (2+ years experience)</td>
                  <td className="px-4 py-3 text-ink-500">Very long — moves differently than EB-2; sometimes faster, sometimes slower</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-ink-500">
            <Link href="/green-card/eb2-vs-eb3-india" className="text-brand-600 underline">Read the full EB-2 vs EB-3 comparison for India →</Link>
          </p>
        </section>

        {/* ── SECTION 8: I-485 ─────────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-3">I-485 adjustment of status: what to file</h2>
          <p className="text-sm text-ink-600 mb-4">When your priority date is current (or USCIS authorizes the Dates for Filing chart), your attorney prepares a complete I-485 package. A typical package includes:</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { form: "I-485", desc: "Application to Register Permanent Residence" },
              { form: "I-485 Supplement J", desc: "Employer job offer confirmation (AC21 portability)" },
              { form: "I-131", desc: "Advance Parole — travel document while I-485 is pending" },
              { form: "I-765", desc: "EAD — work permit based on pending I-485" },
              { form: "I-864", desc: "Affidavit of Support from your employer or sponsor" },
              { form: "I-693", desc: "Medical examination (must be done by USCIS civil surgeon)" },
            ].map((f) => (
              <div key={f.form} className="flex gap-3 rounded-xl border border-ink-900/5 bg-white p-3.5">
                <span className="flex-none rounded-lg bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-800">{f.form}</span>
                <p className="text-sm text-ink-700">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-xl border border-rose-100 bg-rose-50/50 px-4 py-3 text-xs text-rose-800">
            <strong className="font-semibold">Travel rule:</strong> Do not travel internationally while I-485 is pending without an approved Advance Parole document in hand. Traveling without AP risks I-485 abandonment.
          </div>
          <p className="mt-3 text-xs text-ink-500">
            <Link href="/green-card/i-485" className="text-brand-600 underline">Read the full I-485 adjustment of status guide →</Link>
          </p>
        </section>

        {/* ── SECTION 9: EAD and AP ─────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-3">EAD and Advance Parole while I-485 is pending</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
              <p className="font-semibold text-emerald-900 mb-2">EAD (Employment Authorization)</p>
              <ul className="space-y-1 text-sm text-emerald-800">
                <li>• Authorizes work for any employer — not tied to a specific job</li>
                <li>• Usually issued 3–6 months after I-485 filing</li>
                <li>• 540-day automatic extension available if you timely renew</li>
                <li>• Can continue H1B alongside EAD — discuss with attorney</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
              <p className="font-semibold text-blue-900 mb-2">Advance Parole (Travel)</p>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Required for international travel while I-485 is pending</li>
                <li>• Traveling on AP may affect H1B status — consult attorney</li>
                <li>• Combo card (EAD + AP) is common — one card covers both</li>
                <li>• Do not assume AP approval before booking flights</li>
              </ul>
            </div>
          </div>
          <p className="mt-3 text-xs text-ink-500">
            <Link href="/green-card/ead-advance-parole" className="text-brand-600 underline">Read the full EAD and Advance Parole guide →</Link>
          </p>
        </section>

        {/* ── SECTION 10: Stage Finder tool ────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-3">Find your current green card stage</h2>
          <GreenCardStageFinder />
        </section>

        {/* ── SECTION 11: AC21 portability ─────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-3">AC21 portability: changing jobs without losing your place</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-ink-900/5 bg-white p-4">
              <p className="font-semibold text-ink-900 mb-1">H1B portability (214(n))</p>
              <p className="text-sm text-ink-600">Can start work at new employer once H1B transfer petition is filed and a receipt notice is issued — if you were in valid H1B status at filing and I-94 has not expired. This is a separate rule from green card portability.</p>
            </div>
            <div className="rounded-2xl border border-ink-900/5 bg-white p-4">
              <p className="font-semibold text-ink-900 mb-1">Green card portability (204(j))</p>
              <p className="text-sm text-ink-600">Once I-485 has been pending 180+ days with an approved I-140, you can change to a same-or-similar occupation. New employer does not need to file a new PERM. Must document the new role with Supplement J.</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-ink-500">
            <Link href="/green-card/ac21" className="text-brand-600 underline">Read the full AC21 portability guide →</Link>
          </p>
        </section>

        {/* ── SECTION 12: CSPA ─────────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-3">CSPA: protecting your children from aging out</h2>
          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
            <p className="font-semibold text-amber-900 mb-2">Children can lose derivative beneficiary status at age 21</p>
            <p className="text-sm text-amber-800 mb-3">
              If your child turns 21 before your green card is approved, they may no longer qualify as a derivative beneficiary — meaning they could fall off your green card case and need to file separately.
            </p>
            <p className="text-sm font-semibold text-amber-900 mb-1">CSPA may help by:</p>
            <ul className="space-y-1 text-sm text-amber-800">
              <li>• Subtracting the time I-140 was pending from the child's biological age at the time a visa becomes available</li>
              <li>• Requiring a 1-year seek-to-acquire action after visa availability</li>
              <li>• Still not protecting a child with a very early priority date in a very long India backlog</li>
            </ul>
          </div>
          <p className="mt-3 text-xs text-ink-500">
            <Link href="/green-card/cspa-kids-aging-out" className="text-brand-600 underline">Read the full CSPA guide for children aging out →</Link>
          </p>
        </section>

        {/* ── SECTION 13: Child pages grid ─────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-4">Explore this green card guide</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {greenCardChildPages.map((p) => (
              <Link key={p.slug} href={`/green-card/${p.slug}`}
                className="group rounded-2xl border border-ink-900/10 bg-white p-5 transition hover:border-green-300 hover:shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-green-700 mb-0.5">Green card</p>
                <h3 className="font-semibold text-ink-900 group-hover:text-green-700">{p.navLabel}</h3>
                <p className="mt-1.5 text-sm text-ink-500 line-clamp-2">{p.excerpt}</p>
                <p className="mt-2 text-xs text-ink-400">{p.readingTime} min read</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── SECTION 14: FAQ ───────────────────────────────────────────────────── */}
        <section className="mb-10">
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

        {/* related links */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-ink-900 mb-3">Related guides and tools</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { href: "/h1b", label: "H1B Guide", desc: "H1B transfer, extension, RFE, layoff grace period" },
              { href: "/tools/green-card-stage-finder", label: "Green Card Stage Finder", desc: "Find your stage and what to do next" },
              { href: "/nvc-case-status", label: "What happens after USCIS approval", desc: "NVC case status, timeline & next steps" },
              { href: "/uscis/processing-times", label: "USCIS Processing Times", desc: "Current I-140, I-485, EAD processing ranges" },
              { href: "/uscis/case-status", label: "USCIS Case Status Guide", desc: "What your USCIS case status message means" },
            ].map((l) => (
              <Link key={l.href} href={l.href}
                className="group rounded-xl border border-ink-900/10 bg-white p-4 transition hover:border-green-400 hover:shadow-sm">
                <p className="text-sm font-semibold text-ink-900 group-hover:text-green-700">{l.label}</p>
                <p className="mt-0.5 text-xs text-ink-500">{l.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* disclaimer */}
        <div className="mb-10 rounded-2xl border border-ink-900/5 bg-ink-50/50 p-5 text-xs leading-relaxed text-ink-500">
          <strong className="font-semibold text-ink-700">Disclaimer: </strong>
          This guide is for general educational purposes only and is not legal or immigration advice. Immigration law, USCIS processing times, DOL regulations, and visa bulletin cutoff dates change frequently. Always verify current information at{" "}
          <a href="https://www.uscis.gov" target="_blank" rel="noopener noreferrer nofollow" className="text-brand-600 underline">uscis.gov</a>,{" "}
          <a href="https://www.dol.gov" target="_blank" rel="noopener noreferrer nofollow" className="text-brand-600 underline">dol.gov</a>, and{" "}
          <a href="https://travel.state.gov" target="_blank" rel="noopener noreferrer nofollow" className="text-brand-600 underline">travel.state.gov</a>.{" "}
          Consult a licensed immigration attorney for advice specific to your situation.
        </div>

      </div>

      <section className="py-12 sm:py-14">
        <Container>
          <RelatedHubs hubs={["immigration", "uscis", "tax", "wealth"]} />
        </Container>
      </section>

      <Newsletter />
    </>
  );
}
