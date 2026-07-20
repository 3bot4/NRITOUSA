"use client";

import { useState } from "react";
import Link from "next/link";

/* ─────────────────────── types ─────────────────────────────────────────── */

type Prefix = "IOE" | "LIN" | "SRC" | "EAC" | "WAC" | "MSC" | "NBC" | "";
type FormType =
  | "I-129"
  | "I-140"
  | "I-485"
  | "I-765"
  | "I-131"
  | "I-130"
  | "N-400"
  | "";

/* ─────────────────────── prefix data ───────────────────────────────────── */

interface PrefixInfo {
  center: string;
  location: string;
  description: string;
  commonForms: string[];
  doesNotTell: string[];
  note?: string;
}

const PREFIX_DATA: Record<Exclude<Prefix, "">, PrefixInfo> = {
  IOE: {
    center: "USCIS ELIS (online filing system)",
    location: "Electronic — no physical service center",
    description:
      "IOE identifies USCIS's electronic immigration system (ELIS) rather than a physical service center. It usually means the application was filed online, but not always — USCIS also assigns IOE numbers to paper filings it processes or digitises electronically, so an IOE prefix is not proof you filed online. Your case is still routed to an appropriate office for adjudication. Note that the digits after IOE are not a fiscal year and computer workday, so the traditional service-center decoding does not apply to them.",
    commonForms: ["I-485", "I-765", "I-131", "I-90", "N-400", "I-539"],
    doesNotTell: [
      "Which physical service center is adjudicating your case",
      "How long your case will take",
      "Whether your case is assigned to an officer yet",
      "Your priority date (check the I-797 notice itself)",
    ],
    note: "IOE cases are tracked the same way at egov.uscis.gov — enter your full receipt number including the IOE prefix.",
  },
  LIN: {
    center: "Nebraska Service Center",
    location: "Lincoln, Nebraska",
    description:
      "LIN receipts are issued by the Nebraska Service Center. It is one of USCIS's busiest centers and handles a large volume of employment-based immigration including H1B petitions, I-140 immigrant worker petitions, I-485 adjustment of status, and EAD/AP applications.",
    commonForms: ["I-129 H1B", "I-140", "I-485", "I-765", "I-131"],
    doesNotTell: [
      "Which specific officer has your file",
      "Where you are in the queue relative to others",
      "Exactly when your case will be adjudicated",
      "Whether an RFE is coming",
    ],
  },
  SRC: {
    center: "Texas Service Center",
    location: "Dallas area, Texas",
    description:
      "SRC receipts are issued by the Texas Service Center in the Dallas area. It handles employment-based immigration forms including H1B petitions, I-140 green card petitions, I-485, EAD, and Advance Parole. USCIS periodically redistributes cases between service centers based on workload.",
    commonForms: ["I-129 H1B", "I-140", "I-485", "I-765", "I-131"],
    doesNotTell: [
      "Which officer has your case",
      "Your processing position in the queue",
      "Estimated completion date",
      "Whether your petition will be approved",
    ],
  },
  EAC: {
    center: "Vermont Service Center",
    location: "St. Albans, Vermont",
    description:
      "EAC receipts are issued by the Vermont Service Center. It handles a variety of immigration forms including employment-based petitions and adjustment of status applications. The Vermont center is also known for processing certain specialty categories.",
    commonForms: ["I-129", "I-140", "I-485", "I-765"],
    doesNotTell: [
      "Which officer is reviewing your case",
      "Your relative position in the workload queue",
      "When a decision will be made",
      "Likelihood of RFE or approval",
    ],
  },
  WAC: {
    center: "California Service Center",
    location: "Laguna Niguel, California",
    description:
      "WAC receipts are issued by the California Service Center. It processes employment-based immigration including H1B petitions, I-140 petitions, I-485, EAD, and Advance Parole. As a high-volume center serving a large tech industry population, it handles many Indian EB applicants.",
    commonForms: ["I-129 H1B", "I-140", "I-485", "I-765", "I-131"],
    doesNotTell: [
      "Which adjudicator has your file",
      "Your position in the center workload",
      "Actual completion date",
      "Whether an RFE will be issued",
    ],
  },
  MSC: {
    center: "National Benefits Center (Missouri)",
    location: "Lee's Summit, Missouri",
    description:
      "MSC receipts are issued by the National Benefits Center (NBC), sometimes called the Missouri Service Center. The NBC primarily handles I-485 adjustment of status cases and I-130 family petitions. Many I-485 cases from other service centers are transferred to the NBC for interview scheduling at local field offices.",
    commonForms: ["I-485 (transferred cases)", "I-130"],
    doesNotTell: [
      "Whether your priority date has become current",
      "When your interview will be scheduled",
      "Which local USCIS field office will handle your case",
      "Estimated final approval date",
    ],
    note: "MSC on an I-485 often means your case was transferred to the National Benefits Center for interview scheduling — this is normal and does not restart your processing.",
  },
  NBC: {
    center: "National Benefits Center",
    location: "Lee's Summit, Missouri",
    description:
      "NBC receipts come from the National Benefits Center. The NBC routes I-485 adjustment of status cases to local USCIS field offices for interviews. If your I-485 was transferred to the NBC, it is typically being prepared for interview scheduling at the field office serving your home address.",
    commonForms: ["I-485", "I-130"],
    doesNotTell: [
      "Whether your priority date is current",
      "When your interview will be booked",
      "Which local field office will see you",
      "When a final decision will be made",
    ],
    note: "An NBC / MSC transfer is standard procedure for most I-485 interview cases. It does not mean something went wrong.",
  },
};

/* ─────────────────────── form-specific notes ───────────────────────────── */

const FORM_NOTES: Partial<Record<FormType, string>> = {
  "I-129":
    "For H1B petitions, the service center is assigned based on the employer's location and USCIS workload. The LIN and SRC centers handle most H1B cap and cap-exempt filings.",
  "I-140":
    "I-140 petitions are routed to service centers by employer location and USCIS workload. Your priority date — the most important date for Indian EB applicants — is recorded on the I-797 receipt notice, not encoded in the prefix.",
  "I-485":
    "I-485 cases often start at one service center (LIN, SRC, EAC, WAC) and are later transferred to the National Benefits Center (MSC/NBC) for interview scheduling. A transfer is normal.",
  "I-765":
    "EAD applications are processed at the service center that received them. Processing times vary significantly by center — compare your center's current time at uscis.gov.",
  "I-131":
    "Advance Parole and combo card applications are typically processed at the same center that has your I-485. If your I-485 was transferred, the AP may follow.",
  "I-130":
    "Family petitions are often processed at USCIS lockboxes or the NBC. The prefix may differ from your I-485 service center.",
  "N-400":
    "Naturalization applications are often filed electronically (IOE) or processed at a lockbox, then routed for adjudication. The interview will be at your local USCIS field office regardless of the service center prefix.",
};

/* ─────────────────────── component ─────────────────────────────────────── */

export default function UscisReceiptDecoder() {
  const [prefix, setPrefix] = useState<Prefix>("");
  const [form, setForm] = useState<FormType>("");

  const info = prefix ? PREFIX_DATA[prefix] : null;
  const formNote = form ? FORM_NOTES[form] : null;

  return (
    <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/60 to-white p-6 shadow-sm sm:p-8">
      {/* ── header ─────────────────────────────────────────────────────────── */}
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Receipt prefix decoder
        </p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">
          What does my USCIS receipt prefix mean?
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          Select only the first 3 letters of your receipt number — no full number needed.
        </p>
      </div>

      {/* ── privacy warning ────────────────────────────────────────────────── */}
      <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs leading-relaxed text-rose-900">
        <span className="mr-1 font-bold">⚠️ Privacy:</span>
        Never paste your full receipt number into public websites, Reddit threads,
        Discord servers, WhatsApp groups, or forums. Your receipt number is linked to
        your immigration record. Share only with your employer, attorney, or USCIS
        directly.
      </div>

      {/* ── inputs ─────────────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-semibold text-ink-800">
            Receipt prefix (first 3 letters){" "}
            <span className="text-rose-500">*</span>
          </span>
          <select
            value={prefix}
            onChange={(e) => setPrefix(e.target.value as Prefix)}
            className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">Select prefix…</option>
            <option value="IOE">IOE — electronic processing (ELIS)</option>
            <option value="LIN">LIN — Nebraska</option>
            <option value="SRC">SRC — Texas</option>
            <option value="EAC">EAC — Vermont</option>
            <option value="WAC">WAC — California</option>
            <option value="MSC">MSC — National Benefits Center</option>
            <option value="NBC">NBC — National Benefits Center</option>
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-ink-800">
            Form type{" "}
            <span className="font-normal text-ink-400">(optional — adds context)</span>
          </span>
          <select
            value={form}
            onChange={(e) => setForm(e.target.value as FormType)}
            className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">Select form…</option>
            <option value="I-129">I-129 — H1B / L1 petition</option>
            <option value="I-140">I-140 — Employment green card</option>
            <option value="I-485">I-485 — Adjustment of status</option>
            <option value="I-765">I-765 — EAD</option>
            <option value="I-131">I-131 — Advance Parole</option>
            <option value="I-130">I-130 — Family petition</option>
            <option value="N-400">N-400 — Naturalization</option>
          </select>
        </label>
      </div>

      {/* ── result ─────────────────────────────────────────────────────────── */}
      {info && (
        <div className="mt-6 space-y-4">
          {/* Center card */}
          <div className="rounded-2xl border border-ink-900/5 bg-white p-5">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-indigo-100 text-lg font-black text-indigo-700">
                {prefix}
              </span>
              <div>
                <p className="font-bold text-ink-900">{info.center}</p>
                <p className="text-xs text-ink-400">{info.location}</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">
              {info.description}
            </p>
            {info.note && (
              <p className="mt-3 rounded-lg border-l-4 border-indigo-300 bg-indigo-50/50 px-3 py-2 text-xs leading-relaxed text-indigo-900">
                {info.note}
              </p>
            )}
          </div>

          {/* Common forms */}
          <div className="rounded-2xl border border-ink-900/5 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-indigo-600 mb-2">
              Forms commonly handled here
            </p>
            <div className="flex flex-wrap gap-2">
              {info.commonForms.map((f) => (
                <span
                  key={f}
                  className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* What it does NOT tell you */}
          <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-amber-700 mb-2">
              What the prefix does NOT tell you
            </p>
            <ul className="space-y-1.5">
              {info.doesNotTell.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm text-amber-900">
                  <span className="mt-1 flex-none text-amber-500">✗</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>

          {/* Form-specific note */}
          {formNote && (
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-blue-700 mb-2">
                Note for {form}
              </p>
              <p className="text-sm leading-relaxed text-blue-900">{formNote}</p>
            </div>
          )}

          {/* How to check status */}
          <div className="rounded-2xl border border-ink-900/5 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-500 mb-2">
              How to check your case status safely
            </p>
            <ol className="space-y-2 text-sm text-ink-700">
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">1</span>
                <span>
                  Go to{" "}
                  <a
                    href="https://egov.uscis.gov/casestatus/landing.do"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-indigo-600 underline"
                  >
                    egov.uscis.gov/casestatus
                  </a>
                  {" "}— the only official USCIS case status portal.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">2</span>
                Enter your full receipt number exactly as it appears on your I-797 — no spaces or dashes.
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">3</span>
                <span>
                  Once you have your status, use the{" "}
                  <Link
                    href="/tools/uscis-case-status-meaning"
                    className="font-semibold text-indigo-600 underline"
                  >
                    USCIS Case Status Meaning Tool
                  </Link>
                  {" "}to understand what it means.
                </span>
              </li>
            </ol>
          </div>

          {/* Privacy reminder */}
          <div className="rounded-xl border border-rose-100 bg-rose-50/50 px-4 py-3 text-xs leading-relaxed text-rose-800">
            <strong>Reminder:</strong> Only enter your receipt number on the official USCIS
            website or share it with your employer or attorney. Do not post it publicly.
          </div>
        </div>
      )}

      {!info && (
        <p className="mt-5 text-center text-sm text-ink-400">
          Select the first 3 letters of your receipt number above to see the explanation.
        </p>
      )}
    </div>
  );
}
