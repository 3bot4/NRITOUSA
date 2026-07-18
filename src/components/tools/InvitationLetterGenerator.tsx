"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  buildInvitationLetter,
  buildPrintHtml,
  letterPlainText,
  CONSULAR_POSTS,
  RELATIONSHIP_OPTIONS,
  STATUS_OPTIONS,
  type Accommodation,
  type ConsularPost,
  type PayerChoice,
  type ImmigrationStatus,
  type InvitationLetterInput,
} from "@/lib/invitationLetter";
import { buildLetterPdf } from "@/lib/letterPdf";
import { trackEvent } from "@/lib/analytics";

const TOOL_SLUG = "invitation-letter-for-parents-to-visit-usa";

const inputCls =
  "w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20";

function Field({ label, optional, children }: { label: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-ink-800">
        {label}
        {optional && <span className="ml-1 font-normal text-ink-400">(optional)</span>}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

const todayLong = () =>
  new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

export default function InvitationLetterGenerator() {
  const [f, setF] = useState({
    inviterName: "",
    addressLine1: "",
    addressLine2: "",
    cityStateZip: "",
    inviterEmail: "",
    inviterPhone: "",
    status: "h1b" as ImmigrationStatus,
    statusOther: "",
    employer: "",
    occupation: "",
    parent1Name: "",
    parent1Passport: "",
    parent2Name: "",
    parent2Passport: "",
    relationship: "parents",
    relationshipNote: "",
    purpose: "tourism and spending time with our family",
    arrivalDate: "",
    departureDate: "",
    airfarePayer: "parents" as PayerChoice,
    livingPayer: "inviter" as PayerChoice,
    accommodation: "with-inviter" as Accommodation,
    usContact: "",
    consulate: "New Delhi" as ConsularPost,
  });
  const [downloaded, setDownloaded] = useState(false);
  const started = useRef(false);
  const completedFired = useRef(false);
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((p) => ({ ...p, [k]: v }));

  // PRIVACY: analytics carries only the tool slug and coarse flags — the
  // names, addresses, passports, dates, and contacts entered here are NEVER
  // sent anywhere; the whole letter is built in this browser tab.
  const markStarted = () => {
    if (started.current) return;
    started.current = true;
    trackEvent("invitation_generator_started", { tool_slug: TOOL_SLUG });
  };

  const input: InvitationLetterInput = useMemo(() => ({ ...f, letterDate: todayLong() }), [f]);
  const preview = useMemo(() => letterPlainText(input), [input]);
  const ready = Boolean(f.inviterName.trim() && f.parent1Name.trim() && f.addressLine1.trim());

  useEffect(() => {
    if (ready && !completedFired.current) {
      completedFired.current = true;
      trackEvent("invitation_letter_completed", { tool_slug: TOOL_SLUG });
    }
  }, [ready]);

  const download = () => {
    const bytes = buildLetterPdf(buildInvitationLetter(input));
    const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "invitation-letter-parents-visit-usa.pdf";
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    trackEvent("invitation_pdf_downloaded", { tool_slug: TOOL_SLUG });
  };

  const printLetter = () => {
    const html = buildPrintHtml(buildInvitationLetter(input));
    const frame = document.createElement("iframe");
    frame.style.position = "fixed";
    frame.style.right = "0";
    frame.style.bottom = "0";
    frame.style.width = "0";
    frame.style.height = "0";
    frame.style.border = "0";
    document.body.appendChild(frame);
    const doc = frame.contentWindow?.document;
    if (!doc) return;
    doc.open();
    doc.write(html);
    doc.close();
    frame.contentWindow?.focus();
    frame.contentWindow?.print();
    setTimeout(() => document.body.removeChild(frame), 2000);
    setDownloaded(true);
    trackEvent("invitation_letter_printed", { tool_slug: TOOL_SLUG });
  };

  return (
    <div
      id="letter-generator"
      onChange={markStarted}
      className="scroll-mt-24 rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50/50 to-white p-5 shadow-sm sm:p-8"
    >
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-sky-700">Free Generator</p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">
          Parents visiting USA? Invitation letter generator (free PDF)
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          Fill in the details, watch the letter build itself, download the PDF or print it. No signup.
        </p>
        <p className="mt-2 inline-flex items-start gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
          <span aria-hidden>🔒</span>
          <span>
            100% private: the letter is generated in your browser. Nothing you type is stored or sent to any server —
            it works even offline once the page loads.
          </span>
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <div className="grid content-start gap-3 sm:grid-cols-2">
          <Field label="Your full name">
            <input className={inputCls} value={f.inviterName} placeholder="e.g., Anil Sharma" onChange={(e) => set("inviterName", e.target.value)} />
          </Field>
          <Field label="Your immigration status">
            <select className={inputCls} value={f.status} onChange={(e) => set("status", e.target.value as ImmigrationStatus)}>
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>
          {f.status === "other" && (
            <Field label="Describe your status">
              <input className={inputCls} value={f.statusOther} placeholder="e.g., L-1A visa holder" onChange={(e) => set("statusOther", e.target.value)} />
            </Field>
          )}
          <Field label="Street address">
            <input className={inputCls} value={f.addressLine1} placeholder="1234 Maple Avenue, Apt 5B" onChange={(e) => set("addressLine1", e.target.value)} />
          </Field>
          <Field label="Address line 2" optional>
            <input className={inputCls} value={f.addressLine2} onChange={(e) => set("addressLine2", e.target.value)} />
          </Field>
          <Field label="City, State ZIP">
            <input className={inputCls} value={f.cityStateZip} placeholder="Edison, NJ 08817" onChange={(e) => set("cityStateZip", e.target.value)} />
          </Field>
          <Field label="Your phone" optional>
            <input className={inputCls} type="tel" value={f.inviterPhone} placeholder="+1 (732) 555-0142" onChange={(e) => set("inviterPhone", e.target.value)} />
          </Field>
          <Field label="Your email" optional>
            <input className={inputCls} type="email" value={f.inviterEmail} placeholder="you@example.com" onChange={(e) => set("inviterEmail", e.target.value)} />
          </Field>
          <Field label="Occupation" optional>
            <input className={inputCls} value={f.occupation} placeholder="Senior Software Engineer" onChange={(e) => set("occupation", e.target.value)} />
          </Field>
          <Field label="Employer" optional>
            <input className={inputCls} value={f.employer} placeholder="Acme Software Inc." onChange={(e) => set("employer", e.target.value)} />
          </Field>
          <Field label="Who are you inviting?">
            <select className={inputCls} value={f.relationship} onChange={(e) => set("relationship", e.target.value)}>
              {RELATIONSHIP_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Relationship clarification" optional>
            <input className={inputCls} value={f.relationshipNote} placeholder="e.g., parents of my wife, Priya" onChange={(e) => set("relationshipNote", e.target.value)} />
          </Field>
          <Field label="First parent — full name">
            <input className={inputCls} value={f.parent1Name} placeholder="Ramesh Sharma" onChange={(e) => set("parent1Name", e.target.value)} />
          </Field>
          <Field label="First parent — passport number" optional>
            <input className={inputCls} value={f.parent1Passport} placeholder="Z1234567" onChange={(e) => set("parent1Passport", e.target.value)} />
          </Field>
          <Field label="Second parent — full name" optional>
            <input className={inputCls} value={f.parent2Name} placeholder="Sunita Sharma" onChange={(e) => set("parent2Name", e.target.value)} />
          </Field>
          <Field label="Second parent — passport number" optional>
            <input className={inputCls} value={f.parent2Passport} placeholder="Z7654321" onChange={(e) => set("parent2Passport", e.target.value)} />
          </Field>
          <Field label="Purpose of visit">
            <input className={inputCls} value={f.purpose} onChange={(e) => set("purpose", e.target.value)} />
          </Field>
          <Field label="Where will they stay?">
            <select className={inputCls} value={f.accommodation} onChange={(e) => set("accommodation", e.target.value as Accommodation)}>
              <option value="with-inviter">With me, at my residence</option>
              <option value="hotel">Hotel accommodation</option>
              <option value="mixed">Mixed (partly with me, partly hotel)</option>
            </select>
          </Field>
          <Field label="Arrival date">
            <input className={inputCls} value={f.arrivalDate} placeholder="December 10, 2026" onChange={(e) => set("arrivalDate", e.target.value)} />
          </Field>
          <Field label="Departure date">
            <input className={inputCls} value={f.departureDate} placeholder="March 5, 2027" onChange={(e) => set("departureDate", e.target.value)} />
          </Field>
          <Field label="Who pays for airfare?">
            <select className={inputCls} value={f.airfarePayer} onChange={(e) => set("airfarePayer", e.target.value as PayerChoice)}>
              <option value="parents">They pay their own airfare</option>
              <option value="inviter">I pay their airfare</option>
              <option value="shared">Shared</option>
            </select>
          </Field>
          <Field label="Who pays living expenses?">
            <select className={inputCls} value={f.livingPayer} onChange={(e) => set("livingPayer", e.target.value as PayerChoice)}>
              <option value="inviter">I cover their day-to-day expenses</option>
              <option value="parents">They cover their own expenses</option>
              <option value="shared">Shared</option>
            </select>
          </Field>
          <Field label="US contact during the visit" optional>
            <input className={inputCls} value={f.usContact} placeholder="e.g., my wife Priya, +1 (732) 555-0199" onChange={(e) => set("usContact", e.target.value)} />
          </Field>
          <Field label="Where will they apply? (consular post)">
            <select className={inputCls} value={f.consulate} onChange={(e) => set("consulate", e.target.value as ConsularPost)}>
              {CONSULAR_POSTS.map((p) => (
                <option key={p.value || "generic"} value={p.value}>{p.label}</option>
              ))}
            </select>
          </Field>
        </div>

        {/* Live preview + download — height reserved to avoid layout shift. */}
        <div className="flex min-h-[420px] flex-col">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500" id="letter-preview-label">
            Live preview
          </p>
          <div
            className="mt-1 flex-1 overflow-auto rounded-2xl border border-ink-900/10 bg-white p-4 shadow-inner"
            role="region"
            aria-labelledby="letter-preview-label"
          >
            <pre className="whitespace-pre-wrap font-serif text-[0.8125rem] leading-relaxed text-ink-800">{preview}</pre>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={download}
              disabled={!ready}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white transition enabled:hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ⬇ Download PDF — free
            </button>
            <button
              type="button"
              onClick={printLetter}
              disabled={!ready}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-200 bg-white px-5 py-3 text-sm font-bold text-sky-700 transition enabled:hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              🖨️ Print
            </button>
          </div>
          {!ready && (
            <p className="mt-1.5 text-xs text-ink-400" role="status">
              Enter your name, address, and at least one parent&apos;s name to enable the download.
            </p>
          )}
          <p className="mt-2 text-xs leading-relaxed text-ink-400">
            This letter is a supporting document only — a B-2 visa decision is made by the consular officer based on the
            applicant&apos;s own circumstances and DS-160. No letter format is officially approved or required.
          </p>

          {downloaded && (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
              <p className="text-sm font-bold text-ink-900">✅ Letter ready — print it, sign it, and send it to your parents.</p>
              {/* Monetization adjacency: when the visitor-insurance page exists,
                  point this module at it instead of the wealth guide. */}
              <p className="mt-1.5 text-xs leading-relaxed text-ink-600">
                Next step for most families: line up finances for the visit — start with the{" "}
                <Link href="/free-immigrant-wealth-guide" className="font-semibold text-brand-600 underline underline-offset-2">
                  free immigrant wealth guide
                </Link>{" "}
                and the{" "}
                <Link href="#documents-checklist" className="font-semibold text-brand-600 underline underline-offset-2">
                  supporting documents checklist
                </Link>{" "}
                below.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
