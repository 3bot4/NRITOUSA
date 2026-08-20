"use client";

import { useState } from "react";
import { optRules, studentSources } from "@/data/studentClusterData";

/**
 * Situation selector for students in an active status emergency.
 *
 * Written for someone reading this at 2am in a panic, so: short sentences,
 * the most time-sensitive action first, and an explicit "do not do this"
 * block on every branch. It never tells anyone what their outcome will be —
 * it routes them to the right kind of help and stops them making the common
 * unrecoverable mistakes in the meantime.
 */

type SituationId =
  | "sevis-terminated"
  | "visa-revoked"
  | "both"
  | "email-only"
  | "unsure";

interface Situation {
  id: SituationId;
  label: string;
  sub: string;
  whatHappened: string;
  urgency: string;
  first48: string[];
  doNot: string[];
  options: { title: string; body: string }[];
}

const SITUATIONS: Situation[] = [
  {
    id: "sevis-terminated",
    label: "My SEVIS record was terminated",
    sub: "Your DSO or the SEVP Portal says terminated",
    whatHappened:
      "SEVIS termination is a DHS action against your student status record. It ends your F-1 status and any work authorisation attached to it — CPT and OPT stop immediately. Your visa stamp may still be physically valid, which confuses people, but the stamp is only for entry; it is not what gives you status inside the US.",
    urgency:
      "Time-critical. Unlawful presence may begin accruing, and reinstatement generally has to be filed within about five months of the termination date.",
    first48: [
      "Screenshot everything now: your SEVP Portal page, your SEVIS status, your I-20, your EAD, and any email you have received. Records can change and you want dated copies.",
      "Contact your DSO today and ask three specific questions in writing: what termination reason code was used, on what date, and who initiated it.",
      "Stop working immediately if you were working on CPT or OPT. Continuing to work after termination compounds a status problem into a work-authorisation violation.",
      "Retain an immigration attorney before you contact any government agency. Use the AILA lawyer search if you do not have one.",
      "Write down a timeline of the last twelve months — enrolment, employment, travel, any contact with police or campus authorities. Your attorney will need it and memory fades fast.",
    ],
    doNot: [
      "Do not email USCIS, ICE or SEVP to 'explain' before an attorney has reviewed what you plan to say. Anything you write becomes part of the record.",
      "Do not travel. Airlines flag terminated SEVIS records, and CBP can refuse entry — especially once unlawful presence has begun.",
      "Do not keep working, even for a few more days, and even if your employer says it is fine.",
      "Do not assume a valid visa stamp means you still have status. They are different things.",
      "Do not wait to see whether it resolves itself. The five-month reinstatement window is the constraint.",
    ],
    options: [
      {
        title: "Apply for reinstatement",
        body: `Filed with USCIS, generally within ${optRules.reinstatementFilingMonths} months of the termination date. You must show the violation was beyond your control or that not being reinstated would cause extreme hardship, and that you are not deportable on other grounds. You remain in the US while it is pending, but you cannot work.`,
      },
      {
        title: "Depart and re-enter on a new I-20",
        body: "Leave the US, have your school issue a new initial I-20 with a new SEVIS ID, pay the I-901 fee again, and re-enter. Often faster and more predictable than reinstatement, but it means leaving — and if you have accrued unlawful presence, re-entry bars may apply. Get advice before booking anything.",
      },
      {
        title: "Challenge the termination",
        body: "Where a termination appears to have been made in error or without due process, attorneys have successfully challenged them, and courts have ordered records reinstated. This is attorney territory, not something to attempt yourself.",
      },
      {
        title: "Change to another status",
        body: "Depending on your circumstances, a change of status may be available — for example to H-1B with an employer, or to a dependent status. Viability depends heavily on timing and on whether you are still in a period of authorised stay.",
      },
    ],
  },
  {
    id: "visa-revoked",
    label: "My visa was revoked",
    sub: "An email from the consulate or State Department",
    whatHappened:
      "Visa revocation is a State Department action against the stamp in your passport. The stamp is a travel document — it lets you request entry at the border. Revoking it does not, by itself, end your student status inside the US. Your SEVIS record may still be active, which means you may still be in status and still authorised to work.",
    urgency:
      "Urgent but different. The immediate consequence is that you cannot use that visa to re-enter the US. The critical question is whether your SEVIS record is also affected.",
    first48: [
      "Check your SEVIS status with your DSO today. This is the question that determines everything else — a revoked visa with an active SEVIS record is a very different situation from both being gone.",
      "Screenshot the revocation email and save the original with full headers. Do not delete it.",
      "Do not leave the US. Once you depart on a revoked visa, you cannot return on it and will need a new one — with the revocation on your record.",
      "Speak to an immigration attorney about the stated grounds. Revocation notices are often thin on reasoning, and the grounds matter for what comes next.",
      "Keep attending classes and maintaining status normally unless your DSO tells you your SEVIS record has changed.",
    ],
    doNot: [
      "Do not travel internationally, even for an emergency. Departure converts a manageable problem into an inadmissibility problem.",
      "Do not stop attending classes or drop below a full course load — that would create a genuine status violation on top of the visa issue.",
      "Do not respond to the consulate before an attorney reviews your response.",
      "Do not assume revocation means you must leave. If your SEVIS record is intact, you may still be lawfully present.",
    ],
    options: [
      {
        title: "Stay and maintain status",
        body: "If your SEVIS record is active and you are maintaining a full course load, you generally remain in status. The visa matters again only when you next want to enter the US. Many students in this position simply continue their program.",
      },
      {
        title: "Apply for a new visa when you next travel",
        body: "You will need to disclose the revocation and address the stated grounds. Plan for a longer process and possible administrative processing, and do not book non-refundable travel around an appointment date.",
      },
      {
        title: "Contest the grounds",
        body: "Where the stated basis is factually wrong, an attorney can help you build a record correcting it. This matters most for future applications, since the revocation will follow you.",
      },
    ],
  },
  {
    id: "both",
    label: "Both — record terminated and visa revoked",
    sub: "The most serious combination",
    whatHappened:
      "Two separate agencies have acted against two separate things: your status inside the country and your ability to enter it. These need to be addressed together, because the remedy for one can affect the other — most obviously, departing to fix the visa may foreclose reinstatement, and accruing unlawful presence may trigger re-entry bars.",
    urgency:
      "Highest. Get an immigration attorney today, not this week. Do not attempt to sequence these yourself.",
    first48: [
      "Retain an immigration attorney immediately. This combination is not a do-it-yourself situation under any circumstances.",
      "Screenshot and download everything: SEVIS records, the revocation email with headers, I-20s, EAD, pay records, enrolment verification.",
      "Stop working immediately.",
      "Do not depart before getting advice — leaving may end options that are currently open to you.",
      "Write a complete timeline of the past twelve months for your attorney.",
    ],
    doNot: [
      "Do not book a flight. The instinct to leave quickly is understandable and it can permanently close off your best remedies.",
      "Do not contact any government agency directly.",
      "Do not sign anything, including anything an employer or school asks you to sign, without your attorney reading it.",
      "Do not rely on advice from group chats or social media. The details of your case determine the answer, and generic advice here is actively dangerous.",
    ],
    options: [
      {
        title: "Attorney-led strategy — the only route",
        body: "The order in which you address these matters enormously, and the right order depends on facts specific to you: the termination reason code, whether unlawful presence has started, your program status, and the grounds cited for revocation. Free consultations exist. Take one today.",
      },
    ],
  },
  {
    id: "email-only",
    label: "I got a warning email but nothing has changed yet",
    sub: "A notice from the school or a government address",
    whatHappened:
      "Something has been flagged but no action may yet have been taken against your record. This is the best possible moment to act — problems are dramatically easier to resolve before a termination than after one. It is also the moment when phishing is most likely, so verify the sender before you act on anything.",
    urgency:
      "Act this week. The window where a problem is cheap to fix is short.",
    first48: [
      "Verify the email is genuine. Check the sending domain carefully and confirm with your DSO through a channel you already know — never a phone number or link from the email itself.",
      "Ask your DSO to confirm your current SEVIS status directly. Do not infer it from the email.",
      "If the concern is unemployment days on OPT, count your actual total today and report any qualifying employment you have not yet reported in the SEVP Portal.",
      "If the concern is enrolment, fix your course load immediately and get written confirmation from the registrar.",
      "Get a consultation now rather than waiting. Prevention here is a fraction of the cost of reinstatement.",
    ],
    doNot: [
      "Do not click links or call numbers from an unverified email. Impersonation of DHS and university offices is common and targets exactly this moment.",
      "Do not ignore it in the hope that it resolves. It generally does not.",
      "Do not send documents to anyone until you have confirmed independently who they are.",
    ],
    options: [
      {
        title: "Fix the underlying issue now",
        body: "Whatever triggered the flag — enrolment, reporting, unemployment days, an address that was never updated — resolve it and get written confirmation that it is resolved. Keep that confirmation.",
      },
      {
        title: "Get a preventive consultation",
        body: "An hour with an immigration attorney at this stage is far cheaper than a reinstatement filing later, and the range of available options is much wider before an adverse action than after one.",
      },
    ],
  },
  {
    id: "unsure",
    label: "I do not know what happened",
    sub: "Something is wrong but I cannot tell what",
    whatHappened:
      "Before you can act, you need to establish two facts: whether your SEVIS record is active, and whether your visa is still valid. Almost everything else follows from those two answers, and acting without them is how people make things worse.",
    urgency: "Establish the facts today, then come back to this page.",
    first48: [
      "Email your DSO and ask, in these words: 'Is my SEVIS record currently active, and if not, what is the termination reason code and date?'",
      "Check your SEVP Portal account if you are on OPT.",
      "Search your email — including spam and promotions — for anything from your school's international office or a State Department address.",
      "Check your passport for any annotation or notice.",
      "Once you know which of the two things happened, use the correct option above.",
    ],
    doNot: [
      "Do not act on a guess. The remedies for termination and revocation are different and partly incompatible.",
      "Do not travel until you know.",
      "Do not contact government agencies to find out — ask your DSO first.",
    ],
    options: [
      {
        title: "Establish the two facts first",
        body: "SEVIS status and visa validity. Your DSO can confirm the first the same day. Everything else waits on those answers.",
      },
    ],
  },
];

export default function SevisSituationSelector() {
  const [selected, setSelected] = useState<SituationId | null>(null);
  const s = SITUATIONS.find((x) => x.id === selected);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5 shadow-card sm:p-6">
        <h2 className="text-lg font-bold tracking-tight text-ink-900">
          Which of these happened to you?
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-ink-600">
          Termination and revocation are different actions by different
          agencies, and they have different answers. Start by identifying which
          one you are dealing with.
        </p>
        <div className="mt-4 grid gap-2">
          {SITUATIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelected(opt.id)}
              aria-pressed={selected === opt.id}
              className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                selected === opt.id
                  ? "border-rose-500 bg-white shadow-sm"
                  : "border-ink-900/10 bg-white/70 hover:border-ink-900/25"
              }`}
            >
              <span className="block text-sm font-bold text-ink-900">
                {opt.label}
              </span>
              <span className="mt-0.5 block text-xs text-ink-500">
                {opt.sub}
              </span>
            </button>
          ))}
        </div>
      </div>

      {s && (
        <div className="mt-5 space-y-4">
          <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card sm:p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
              What this actually means
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">
              {s.whatHappened}
            </p>
            <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-sm font-medium leading-relaxed text-amber-900">
              <strong>Urgency:</strong> {s.urgency}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-card sm:p-6">
            <h3 className="text-base font-bold text-ink-900">
              The first 48 hours
            </h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-ink-700 marker:font-bold marker:text-emerald-700">
              {s.first48.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5 shadow-card sm:p-6">
            <h3 className="text-base font-bold text-rose-800">
              Do not do these
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-700">
              {s.doNot.map((d) => (
                <li key={d} className="flex gap-2">
                  <span aria-hidden className="flex-none text-rose-600">
                    ✕
                  </span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card sm:p-6">
            <h3 className="text-base font-bold text-ink-900">
              Your options from here
            </h3>
            <div className="mt-3 space-y-3">
              {s.options.map((o) => (
                <div key={o.title} className="rounded-xl bg-ink-50/70 p-3.5">
                  <p className="text-sm font-bold text-ink-900">{o.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-600">
                    {o.body}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-ink-400">
              This is educational information, not legal advice, and no page can
              substitute for advice on your specific facts. Find an immigration
              attorney through the{" "}
              <a
                href={studentSources.ailaLawyerSearch.href}
                target="_blank"
                rel="nofollow noopener"
                className="font-semibold text-brand-600 underline"
              >
                AILA lawyer search
              </a>
              . Many offer free initial consultations.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
