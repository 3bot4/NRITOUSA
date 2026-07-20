import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ReviewedByline from "@/components/ReviewedByline";
import AuthorBioBox from "@/components/AuthorBioBox";
import UscisReceiptDecoder from "@/components/tools/UscisReceiptDecoder";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";
import { site } from "@/lib/site";

const PAGE_PATH = "/uscis/receipt-number";
const UPDATED = "2026-06-16";

export const metadata: Metadata = pageMetadata({
  title: "USCIS Receipt Number: Format & Prefix Meanings 2026",
  description:
    "A USCIS receipt number is 13 characters on your I-797, like LIN2412345678. What IOE, LIN, SRC, EAC, WAC and MSC mean, and where to find yours.",
  path: PAGE_PATH,
});

const faq: FaqItem[] = [
  {
    question: "What is a USCIS receipt number?",
    answer:
      "A USCIS receipt number is a unique 13-character identifier assigned to every immigration application or petition when USCIS accepts it. It looks like LIN2412345678 or IOE0123456789. You use it to track your case status at egov.uscis.gov. It is printed on your Form I-797 Notice of Action.",
  },
  {
    question: "What does the 3-letter prefix on my receipt number mean?",
    answer:
      "The first three letters often indicate the initial USCIS system, service center, or intake location associated with the receipt number — IOE = filed online, LIN = Nebraska, SRC = Texas, EAC = Vermont, WAC = California, MSC/NBC = National Benefits Center. However, the prefix does not always prove where your case is currently being processed, because USCIS may transfer or route cases internally. The prefix does NOT tell you how long your case will take or whether it will be approved.",
  },
  {
    question: "Where do I find my receipt number?",
    answer:
      "Your receipt number is on your Form I-797 Notice of Action — the document USCIS mails after accepting your application. It is labeled 'Receipt Number' in the upper-right area of the form. It is also available in your myUSCIS online account if you filed electronically.",
  },
  {
    question: "What is the difference between a receipt number and an A-number?",
    answer:
      "A receipt number (e.g., LIN2412345678) is case-specific — each application gets its own. An Alien Registration Number (A-number, e.g., A123456789) is person-specific and stays with you for life. You get an A-number when USCIS issues a green card, Employment Authorization Document, or certain other documents. Many applicants don't have an A-number until later in the green card process.",
  },
  {
    question: "Can I check my case status with just the receipt number?",
    answer:
      "Yes — go to egov.uscis.gov/casestatus and enter your receipt number exactly as it appears on your I-797 (no spaces or dashes). This is the only official way to check USCIS case status. Never enter your receipt number on third-party websites.",
  },
  {
    question: "My I-485 receipt prefix changed from LIN to MSC — is that normal?",
    answer:
      "Yes, this is standard. USCIS transfers I-485 adjustment of status cases from service centers (LIN, SRC, etc.) to the National Benefits Center (MSC or NBC) when they are ready for interview scheduling. The transfer does not reset your filing date or priority date.",
  },
  {
    question: "Is IOE receipt number the same as other receipt numbers?",
    answer:
      "Functionally yes — you check an IOE receipt number the same way at egov.uscis.gov. IOE simply means you filed your application online through the USCIS website rather than by paper mail. The IOE prefix has been expanding since 2020 as USCIS expands online filing.",
  },
  {
    question: "What should I NOT share my receipt number with?",
    answer:
      "Never post your full receipt number on Reddit, Facebook, WhatsApp, forums, or any public platform. Your receipt number is linked to your immigration record. Only share it with your employer, immigration attorney, or USCIS directly. There is no benefit to sharing it publicly — only privacy and identity risk.",
  },
];

export default function ReceiptNumberPage() {
  const url = absoluteUrl(PAGE_PATH);
  const jsonLd = jsonLdGraph(
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline:
        "USCIS Receipt Number Explained: IOE, LIN, SRC, EAC, WAC, MSC Prefix Meanings",
      description:
        "Complete guide to USCIS receipt numbers — what they are, where to find them, what each prefix means, and why you should never share yours publicly.",
      url,
      datePublished: UPDATED,
      dateModified: UPDATED,
      author: { "@id": `${site.url}/#organization` },
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "en-US",
      about: { "@type": "Thing", name: "USCIS Receipt Number" },
    },
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "USCIS Hub", url: "/uscis" },
      { name: "Receipt Number", url: PAGE_PATH },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Breadcrumb ────────────────────────────────────────────────────── */}
      <nav aria-label="breadcrumb" className="border-b border-ink-900/5 bg-ink-50/60">
        <Container className="py-2.5">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-ink-500">
            <li>
              <Link href="/" className="hover:text-ink-800">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/uscis" className="hover:text-ink-800">
                USCIS Hub
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="font-medium text-ink-800">Receipt Number</li>
          </ol>
        </Container>
      </nav>

      {/* ── Disclaimer strip ─────────────────────────────────────────────── */}
      <div className="border-b border-amber-200 bg-amber-50">
        <Container className="py-2.5">
          <p className="text-center text-xs text-amber-900">
            <strong className="font-semibold">Educational guide only.</strong> NRItoUSA is
            not USCIS, not a law firm, and not your attorney. Always verify at{" "}
            <a
              href="https://www.uscis.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              uscis.gov
            </a>{" "}
            and consult a licensed immigration attorney for your specific situation.
          </p>
        </Container>
      </div>

      {/* ── Hero / Header ────────────────────────────────────────────────── */}
      <section className="bg-white pb-6 pt-10 sm:pb-8 sm:pt-14">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-600">
              USCIS Hub
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              USCIS Receipt Number Explained
            </h1>
            <p className="mt-3 text-lg leading-relaxed text-ink-600">
              What the 13-character code on your I-797 really means — and why the
              first 3 letters (IOE, LIN, SRC, EAC, WAC, MSC) matter for Indian applicants.
            </p>
            <p className="mt-2 text-xs text-ink-400">~8 min read</p>
            <ReviewedByline date={UPDATED} className="mt-3" />
          </div>
        </Container>
      </section>

      {/* ── Quick Answer ─────────────────────────────────────────────────── */}
      <section className="bg-indigo-50/60 py-8">
        <Container>
          <div className="mx-auto max-w-3xl rounded-2xl border border-indigo-100 bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-wide text-indigo-600 mb-3">
              Quick answer
            </p>
            <ul className="space-y-2 text-sm leading-relaxed text-ink-700">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex-none text-indigo-400">▸</span>
                A USCIS receipt number is a <strong>13-character case ID</strong> on your I-797 Notice of Action, formatted like <span className="font-mono font-semibold">LIN2412345678</span>.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex-none text-indigo-400">▸</span>
                The <strong>first three letters</strong> often indicate the initial USCIS system or intake location (IOE = online, LIN = Nebraska, SRC = Texas, EAC = Vermont, WAC = California, MSC/NBC = National Benefits Center) — but USCIS may transfer cases internally, so the prefix does not always reflect where your case is currently being processed.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex-none text-indigo-400">▸</span>
                Use it to check status at <strong>egov.uscis.gov/casestatus</strong> — the only official portal.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex-none text-indigo-400">▸</span>
                <strong className="text-rose-700">Never post your full receipt number, A-number, passport number, date of birth, address, or employer details publicly</strong> — these are sensitive immigration identifiers linked to your record. Only enter your full receipt number on the official USCIS portal at egov.uscis.gov.
              </li>
            </ul>
          </div>

          {/* Key takeaways */}
          <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-ink-900/10 bg-white p-5 shadow-sm">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-500">Key takeaways</p>
            <ul className="space-y-2.5 text-sm leading-relaxed text-ink-700">
              <li>• Look for <strong>13 characters</strong> — 3 letters followed by 10 digits — printed at the top-left of your Form I-797 Notice of Action.</li>
              <li>• Read the prefix as the <strong>intake point</strong>, not the current location: IOE means online filing, LIN Nebraska, SRC Texas, EAC Vermont, WAC California, MSC the National Benefits Center.</li>
              <li>• Decode the next <strong>2 digits</strong> as the fiscal year USCIS received the case, and the following 3 as the computer workday.</li>
              <li>• Enter it only at <strong>egov.uscis.gov/casestatus</strong> — the sole official status portal, and no login is required.</li>
              <li>• Never post the full number publicly; it is a sensitive identifier tied to your immigration record.</li>
            </ul>
          </div>

          {/* Opening keyword paragraph */}
          <div className="mx-auto mt-6 max-w-3xl">
            <p className="text-base leading-relaxed text-ink-700">
              A USCIS receipt number is the 13-character code that identifies your case for its entire life
              — every status check, every service request, and every enquiry runs on it. This page is for
              anyone holding an I-797 Notice of Action who wants to know the USCIS receipt number format,
              what the three-letter prefix actually tells you, and where to find the number if the notice
              went to an employer or attorney. The single most misunderstood point: the prefix records where
              USCIS first took the case in, and cases are routinely transferred afterwards, so a Nebraska
              prefix does not guarantee Nebraska is still adjudicating it. Below: the format broken down
              character by character, a prefix decoder, where the number appears on each notice type, what
              to do when the portal says the number cannot be found, and how the receipt number relates to
              your A-number and online account number.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Decoder Tool ─────────────────────────────────────────────────── */}
      <section className="py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-xl font-bold tracking-tight text-ink-900 mb-5">
              Receipt Prefix Decoder
            </h2>
            <UscisReceiptDecoder />
            <p className="mt-3 text-center text-xs text-ink-400">
              Want the full standalone tool?{" "}
              <Link
                href="/tools/uscis-receipt-number-decoder"
                className="font-medium text-indigo-600 underline"
              >
                Open USCIS Receipt Number Decoder →
              </Link>
            </p>
          </div>
        </Container>
      </section>

      {/* ── What is a receipt number ─────────────────────────────────────── */}
      <section className="bg-ink-50/40 py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-8">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-ink-900 mb-3">
                What is a USCIS receipt number?
              </h2>
              <p className="text-sm leading-relaxed text-ink-700">
                Every time you file an application or petition with USCIS, the agency
                assigns a unique 13-character receipt number when it accepts your filing.
                This number appears on Form I-797 Notice of Action — the document USCIS
                mails to confirm receipt.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-700">
                The receipt number is your primary tracking ID throughout the entire
                adjudication process. You enter it at{" "}
                <a
                  href="https://egov.uscis.gov/casestatus/landing.do"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-indigo-600 underline"
                >
                  egov.uscis.gov/casestatus
                </a>{" "}
                to check case status, and it's referenced in any USCIS correspondence
                about your case.
              </p>
            </div>

            {/* Structure breakdown */}
            <div className="rounded-2xl border border-ink-900/5 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-ink-500 mb-3">
                Receipt number structure
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-ink-900/5">
                      <th className="pb-2 text-left font-semibold text-ink-800">Part</th>
                      <th className="pb-2 text-left font-semibold text-ink-800">Characters</th>
                      <th className="pb-2 text-left font-semibold text-ink-800">Example</th>
                      <th className="pb-2 text-left font-semibold text-ink-800">Meaning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-900/5">
                    <tr>
                      <td className="py-2 font-medium text-ink-800">Prefix</td>
                      <td className="py-2 text-ink-600">3 letters</td>
                      <td className="py-2 font-mono text-indigo-700">LIN</td>
                      <td className="py-2 text-ink-600">Service center</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium text-ink-800">Fiscal year</td>
                      <td className="py-2 text-ink-600">2 digits</td>
                      <td className="py-2 font-mono text-indigo-700">24</td>
                      <td className="py-2 text-ink-600">FY the case was filed (e.g., 24 = FY2024)</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium text-ink-800">Day of year</td>
                      <td className="py-2 text-ink-600">3 digits</td>
                      <td className="py-2 font-mono text-indigo-700">123</td>
                      <td className="py-2 text-ink-600">Day of the fiscal year received</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium text-ink-800">Sequence</td>
                      <td className="py-2 text-ink-600">5 digits</td>
                      <td className="py-2 font-mono text-indigo-700">45678</td>
                      <td className="py-2 text-ink-600">Sequential case number that day</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-ink-400">
                Total: 13 characters — e.g., <span className="font-mono font-semibold">LIN2412345678</span>
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-ink-900 mb-2">
                Where to find your receipt number on the I-797
              </h3>
              <p className="text-sm leading-relaxed text-ink-700">
                The receipt number appears in the upper-right section of your Form I-797
                Notice of Action, labeled{" "}
                <strong className="font-semibold">"Receipt Number."</strong> It is printed
                in the format XXX XXXXXXXXXX (3 letters, then 10 digits, sometimes with a
                space). When entering it online, omit any spaces.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                If you filed online through myUSCIS, your receipt number also appears in
                your online account dashboard under{" "}
                <strong className="font-semibold">My Cases</strong>.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Prefix meanings table ────────────────────────────────────────── */}
      <section className="bg-white py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-xl font-bold tracking-tight text-ink-900 mb-5">
              USCIS receipt number prefix meanings
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-ink-900/5">
              <table className="w-full text-sm">
                <thead className="bg-ink-50/60">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-ink-600">Prefix</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-ink-600">Service Center</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-ink-600">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-ink-600">Common for Indian applicants</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-900/5">
                  {[
                    {
                      prefix: "IOE",
                      center: "Online filing (ELIS)",
                      location: "Electronic",
                      common: "I-485, I-765, I-131, N-400 filed online",
                    },
                    {
                      prefix: "LIN",
                      center: "Nebraska Service Center",
                      location: "Lincoln, NE",
                      common: "H1B, I-140, I-485, EAD",
                    },
                    {
                      prefix: "SRC",
                      center: "Texas Service Center",
                      location: "Dallas area, TX",
                      common: "H1B, I-140, I-485, EAD",
                    },
                    {
                      prefix: "EAC",
                      center: "Vermont Service Center",
                      location: "St. Albans, VT",
                      common: "H1B, I-140, I-485",
                    },
                    {
                      prefix: "WAC",
                      center: "California Service Center",
                      location: "Laguna Niguel, CA",
                      common: "H1B, I-140, I-485 (heavy tech industry)",
                    },
                    {
                      prefix: "MSC",
                      center: "National Benefits Center",
                      location: "Lee's Summit, MO",
                      common: "I-485 transferred cases, I-130",
                    },
                    {
                      prefix: "NBC",
                      center: "National Benefits Center",
                      location: "Lee's Summit, MO",
                      common: "I-485 (interview routing), I-130",
                    },
                  ].map((r) => (
                    <tr key={r.prefix} className="hover:bg-ink-50/40">
                      <td className="px-4 py-3 font-mono font-bold text-indigo-700">{r.prefix}</td>
                      <td className="px-4 py-3 font-medium text-ink-800">{r.center}</td>
                      <td className="px-4 py-3 text-ink-500">{r.location}</td>
                      <td className="px-4 py-3 text-ink-600">{r.common}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Why it matters ───────────────────────────────────────────────── */}
      <section className="bg-ink-50/40 py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-ink-900">
              Why the receipt number matters for Indian applicants
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Track your I-485 transfer",
                  body: "Many Indian EB applicants see their I-485 receipt number prefix change from LIN/SRC/WAC to MSC or NBC. This means USCIS transferred your case to the National Benefits Center for interview scheduling — normal and expected.",
                },
                {
                  title: "H1B cap-exempt routing",
                  body: "Cap-exempt H1B petitions may be routed to different service centers than regular cap cases. Your prefix tells you which center has your petition, which matters when comparing processing times.",
                },
                {
                  title: "I-140 priority date",
                  body: "Your priority date — the single most important date for Indian EB applicants — is NOT encoded in the receipt number. It is printed explicitly on your I-797 receipt notice. Keep that document safe.",
                },
                {
                  title: "Multiple pending petitions",
                  body: "If you have both an I-140 and an I-485 pending, each gets its own receipt number. Track them separately. A status update on one does not automatically update the other.",
                },
              ].map((c) => (
                <div
                  key={c.title}
                  className="rounded-2xl border border-ink-900/5 bg-white p-4"
                >
                  <p className="font-semibold text-ink-900 mb-1">{c.title}</p>
                  <p className="text-sm leading-relaxed text-ink-600">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Common Indian examples ───────────────────────────────────────── */}
      <section className="bg-white py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-xl font-bold tracking-tight text-ink-900 mb-5">
              Receipt number examples for Indian applicants
            </h2>
            <div className="space-y-3">
              {[
                {
                  scenario: "H1B transfer/extension",
                  receipt: "LIN24123XXXXX or SRC24256XXXXX",
                  note: "Employer files I-129 at a service center. LIN and SRC handle most H1B volume.",
                },
                {
                  scenario: "I-140 EB-2/EB-3 petition",
                  receipt: "LIN24089XXXXX or WAC24301XXXXX",
                  note: "Filed by employer. Priority date on the I-797 receipt — watch this date for the visa bulletin.",
                },
                {
                  scenario: "I-485 Adjustment of Status",
                  receipt: "LIN24045XXXXX → later MSC24178XXXXX",
                  note: "Starts at service center, often transferred to NBC/MSC. Both receipts are valid for tracking.",
                },
                {
                  scenario: "I-765 EAD (online filing)",
                  receipt: "IOE0123456789",
                  note: "Filed online via myUSCIS. IOE prefix is common for EAD renewals since 2022.",
                },
                {
                  scenario: "I-131 Advance Parole",
                  receipt: "IOE0987654321 or LIN24301XXXXX",
                  note: "Usually same service center as your I-485, or IOE if filed online.",
                },
                {
                  scenario: "N-400 Naturalization",
                  receipt: "IOE0123459876",
                  note: "Most N-400 applications are now filed online. Interview at your local USCIS field office.",
                },
              ].map((ex) => (
                <div
                  key={ex.scenario}
                  className="flex flex-col gap-1 rounded-xl border border-ink-900/5 bg-ink-50/40 px-4 py-3 sm:flex-row sm:items-start sm:gap-4"
                >
                  <div className="flex-none sm:w-48">
                    <p className="text-xs font-bold text-ink-800">{ex.scenario}</p>
                    <p className="mt-0.5 font-mono text-xs text-indigo-700">{ex.receipt}</p>
                  </div>
                  <p className="text-xs leading-relaxed text-ink-600">{ex.note}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Receipt number vs USCIS account number ───────────────────────── */}
      <section className="bg-ink-50/40 py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5">
            <h2 className="text-xl font-bold tracking-tight text-ink-900">
              Receipt number vs. USCIS online account number
            </h2>
            <p className="text-sm leading-relaxed text-ink-700">
              These are two different things. Your USCIS online account number is the login
              ID for your myUSCIS account — it's not the same as the receipt number
              printed on your I-797. Here is how they differ:
            </p>
            <div className="overflow-x-auto rounded-2xl border border-ink-900/5 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-ink-50/60">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-ink-600"> </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-ink-600">Receipt number</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-ink-600">Online account number</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-900/5">
                  <tr>
                    <td className="px-4 py-2.5 text-xs font-semibold text-ink-700">What it is</td>
                    <td className="px-4 py-2.5 text-xs text-ink-600">Case-specific ID for one application</td>
                    <td className="px-4 py-2.5 text-xs text-ink-600">Your myUSCIS login account ID</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-xs font-semibold text-ink-700">Format</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-indigo-700">LIN2412345678 (13 chars)</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-indigo-700">Varies (numeric, 10–13 digits)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-xs font-semibold text-ink-700">Where to find it</td>
                    <td className="px-4 py-2.5 text-xs text-ink-600">Form I-797 Notice of Action</td>
                    <td className="px-4 py-2.5 text-xs text-ink-600">myUSCIS.gov account profile</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-xs font-semibold text-ink-700">Used to check status</td>
                    <td className="px-4 py-2.5 text-xs text-ink-600">Yes — enter at egov.uscis.gov</td>
                    <td className="px-4 py-2.5 text-xs text-ink-600">No — login only</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-xs font-semibold text-ink-700">Persists across cases</td>
                    <td className="px-4 py-2.5 text-xs text-ink-600">No — each case gets a new number</td>
                    <td className="px-4 py-2.5 text-xs text-ink-600">Yes — stays the same</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </section>

      {/* ── What NOT to share ────────────────────────────────────────────── */}
      <section className="bg-white py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-xl font-bold tracking-tight text-ink-900 mb-5">
              What NOT to share publicly
            </h2>
            <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5 mb-5">
              <p className="text-sm font-semibold text-rose-900 mb-2">
                Never share these in public forums, Reddit, WhatsApp groups, or Discord:
              </p>
              <ul className="space-y-1.5 text-sm text-rose-800">
                {[
                  "Your full receipt number (LIN/IOE/SRC/etc.)",
                  "Your Alien Registration Number (A-number)",
                  "Your passport number",
                  "Your date of birth",
                  "Your home address or employer address",
                  "Photos of your I-797 (it contains all of the above)",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 flex-none text-rose-500">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-sm leading-relaxed text-ink-700">
              Your receipt number is directly linked to your immigration record. Anyone with
              your receipt number can look up your case status and see your application type,
              filing date, and current status. It is not a password, but it is sensitive
              information that should be treated accordingly.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">
              When asking for help on forums, you can share just the <strong>prefix</strong>{" "}
              (e.g., "LIN receipt number") without the full number — that gives enough context
              for others to help you without exposing your case details.
            </p>
          </div>
        </Container>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="bg-ink-50/40 py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-xl font-bold tracking-tight text-ink-900 mb-6">
              Frequently asked questions
            </h2>
            <dl className="space-y-4">
              {faq.map((item) => (
                <div
                  key={item.question}
                  className="rounded-2xl border border-ink-900/5 bg-white px-5 py-4"
                >
                  <dt className="font-semibold text-ink-900">{item.question}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-ink-600">
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      {/* ── How this connects ────────────────────────────────────────────── */}
      <section className="bg-white py-10 sm:py-12">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-xl font-bold tracking-tight text-ink-900">
              How your receipt number connects to the rest of your case
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">
              The receipt number is the key to every other USCIS surface. You use it alone on the{" "}
              <Link href="/uscis/case-status" className="font-semibold text-brand-600 underline">
                case status portal
              </Link>{" "}
              to read the current status message, and you pair it with a mailed{" "}
              <Link href="/uscis/online-access-code" className="font-semibold text-brand-600 underline">
                online access code
              </Link>{" "}
              to link a paper-filed case into your{" "}
              <Link href="/uscis/myuscis-account" className="font-semibold text-brand-600 underline">
                myUSCIS account
              </Link>{" "}
              — the difference between those two tools is covered in{" "}
              <Link href="/uscis/myuscis-vs-case-status" className="font-semibold text-brand-600 underline">
                myUSCIS vs case status
              </Link>
              . The prefix also hints at which service center took the case in, which is worth comparing
              against the posted{" "}
              <Link href="/uscis/processing-times" className="font-semibold text-brand-600 underline">
                USCIS processing times
              </Link>{" "}
              before concluding that your case is delayed.
            </p>
            <AuthorBioBox
              className="mt-8"
              tags={["USCIS notices & receipts", "Case status decoding", "H-1B and green card filings"]}
            />
          </div>
        </Container>
      </section>

      {/* ── Internal links ───────────────────────────────────────────────── */}
      <section className="bg-white py-10 sm:py-12">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-base font-bold text-ink-900 mb-4">
              Related USCIS guides
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  href: "/uscis/case-status",
                  label: "USCIS Case Status Guide",
                  desc: "What every status message means for H1B, I-140, I-485, EAD",
                },
                {
                  href: "/tools/uscis-case-status-meaning",
                  label: "Case Status Meaning Tool",
                  desc: "Interactive tool — select form + status, get plain-English meaning",
                },
                {
                  href: "/tools/uscis-receipt-number-decoder",
                  label: "Receipt Prefix Decoder",
                  desc: "Standalone tool for IOE/LIN/SRC/EAC/WAC/MSC prefix lookup",
                },
                {
                  href: "/uscis",
                  label: "USCIS Hub",
                  desc: "Full overview of USCIS processes for Indian applicants",
                },
              ].map((g) => (
                <Link
                  key={g.href}
                  href={g.href}
                  className="group rounded-xl border border-ink-900/10 bg-ink-50/40 p-4 transition hover:border-brand-400 hover:bg-white hover:shadow-sm"
                >
                  <p className="text-sm font-semibold text-ink-900 group-hover:text-brand-700">
                    {g.label}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-500">{g.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Footer disclaimer ────────────────────────────────────────────── */}
      <section className="border-t border-ink-900/5 bg-ink-50/60 py-8">
        <Container>
          <div className="mx-auto max-w-2xl text-center text-xs leading-relaxed text-ink-500">
            <p>
              <strong className="font-semibold text-ink-700">
                NRItoUSA is not USCIS.
              </strong>{" "}
              This page is for educational purposes only and does not constitute legal or
              immigration advice. USCIS policies, processing times, and form requirements
              change frequently. Always verify information at{" "}
              <a
                href="https://www.uscis.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline"
              >
                uscis.gov
              </a>{" "}
              and consult a licensed immigration attorney for your specific situation.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
