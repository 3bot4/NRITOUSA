"use client";

import { useMemo, useState } from "react";
import InputCard, { Field, fieldClass } from "@/components/tools/InputCard";
import ResultCard from "@/components/tools/ResultCard";
import {
  DELAY_EMPTY,
  assessDelay,
  type DelayInputs,
} from "@/lib/uscisDelay";
import { uscisLinks, uscisMethodology } from "@/data/uscisProcessingData";

/**
 * Forms and their subtypes. The subtype matters because USCIS publishes a
 * separate processing time and inquiry date per subtype — an I-140 NIW and an
 * I-140 E11 are different rows on the official tool.
 */
const FORMS: { form: string; label: string; subtypes: string[] }[] = [
  {
    form: "I-129",
    label: "I-129 — Petition for a Nonimmigrant Worker",
    subtypes: [
      "H-1B specialty occupation",
      "H-1B extension of stay",
      "H-1B change of employer",
      "H-1B amendment",
      "L-1A / L-1B",
      "O-1",
      "TN",
      "E-1 / E-2 / E-3",
      "Other I-129 classification",
    ],
  },
  {
    form: "I-140",
    label: "I-140 — Immigrant Petition for Alien Workers",
    subtypes: [
      "E11 extraordinary ability",
      "E12 outstanding professor or researcher",
      "E13 multinational executive or manager",
      "E21 advanced degree (no national interest waiver)",
      "E21 national interest waiver",
      "E31 skilled worker",
      "E32 professional",
      "EW3 other worker",
    ],
  },
  {
    form: "I-485",
    label: "I-485 — Adjustment of Status",
    subtypes: [
      "Employment-based",
      "Family-based (immediate relative)",
      "Family-based (preference)",
      "Other basis",
    ],
  },
  {
    form: "I-765",
    label: "I-765 — Employment Authorization",
    subtypes: [
      "Based on a pending I-485 (c)(9)",
      "F-1 OPT (c)(3)(B)",
      "F-1 STEM OPT (c)(3)(C)",
      "H-4 spouse (c)(26)",
      "L-2 spouse",
      "Other category",
    ],
  },
  {
    form: "I-131",
    label: "I-131 — Travel Document / Advance Parole",
    subtypes: ["Advance parole", "Re-entry permit", "Other"],
  },
  {
    form: "I-130",
    label: "I-130 — Petition for Alien Relative",
    subtypes: [
      "Immediate relative of a U.S. citizen",
      "F2A spouse/child of an LPR",
      "Other preference category",
    ],
  },
  {
    form: "I-539",
    label: "I-539 — Extend/Change Nonimmigrant Status",
    subtypes: ["H-4", "F-1 / F-2", "B-1 / B-2", "Other"],
  },
  {
    form: "N-400",
    label: "N-400 — Application for Naturalization",
    subtypes: ["Standard", "Military", "Other"],
  },
  {
    form: "I-90",
    label: "I-90 — Replace Permanent Resident Card",
    subtypes: ["Renewal", "Replacement", "Other"],
  },
];

/**
 * Offices. Deliberately a user selection rather than an inference from the
 * receipt-number prefix: an IOE prefix means the case was filed electronically
 * and says nothing reliable about which office holds it, and transferred cases
 * are handled somewhere other than the prefix suggests.
 */
const OFFICES = [
  "California Service Center",
  "Nebraska Service Center",
  "Texas Service Center",
  "Vermont Service Center",
  "Potomac Service Center",
  "National Benefits Center",
  "A local USCIS field office",
  "I am not sure",
];

export default function UscisProcessingDelayChecker() {
  const [inp, setInp] = useState<DelayInputs>(DELAY_EMPTY);
  const set = <K extends keyof DelayInputs>(k: K, v: DelayInputs[K]) =>
    setInp((p) => ({ ...p, [k]: v }));

  const r = useMemo(() => assessDelay(inp), [inp]);
  const subtypes = FORMS.filter((f) => f.form === inp.form)[0]?.subtypes ?? [];

  return (
    <div id="checker" className="grid gap-5 lg:grid-cols-2">
      <div className="space-y-4">
        <InputCard eyebrow="Step 1" title="Your case">
          <Field
            label="Exact form"
            help="From your I-797C receipt notice."
          >
            <select
              className={fieldClass}
              value={inp.form}
              onChange={(e) => {
                set("form", e.target.value);
                set("subtype", "");
              }}
            >
              <option value="">Select…</option>
              {FORMS.map((f) => (
                <option key={f.form} value={f.form}>
                  {f.label}
                </option>
              ))}
            </select>
          </Field>

          {subtypes.length > 0 && (
            <Field
              label="Subtype or classification"
              help="USCIS publishes a separate processing time and inquiry date for each subtype, so this must match."
            >
              <select
                className={fieldClass}
                value={inp.subtype}
                onChange={(e) => set("subtype", e.target.value)}
              >
                <option value="">Select…</option>
                {subtypes.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </Field>
          )}

          <Field
            label="Office or service center handling the case"
            help="Take this from your most recent notice. Do not infer it from the receipt-number prefix — an IOE prefix means electronic filing and does not identify the office, and transferred cases sit elsewhere."
          >
            <select
              className={fieldClass}
              value={inp.office}
              onChange={(e) => set("office", e.target.value)}
            >
              <option value="">Select…</option>
              {OFFICES.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Exact receipt date"
            help="The full date printed on your I-797C receipt notice. A transfer does not change it."
          >
            <input
              type="date"
              className={fieldClass}
              value={inp.receiptDate}
              onChange={(e) => set("receiptDate", e.target.value)}
            />
          </Field>

          <Field label="Has the case been transferred to another office?">
            <select
              className={fieldClass}
              value={inp.transferred}
              onChange={(e) =>
                set("transferred", e.target.value as DelayInputs["transferred"])
              }
            >
              <option value="">Select…</option>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </Field>
        </InputCard>

        <InputCard eyebrow="Step 2" title="Your official case inquiry date">
          <p className="-mt-1 text-xs text-ink-500">
            This is the only thing that determines whether your case is outside
            normal processing time. Read it off the official USCIS tool for your
            exact form, subtype and office — this page does not hold those dates
            and will not guess one.
          </p>
          <a
            href={uscisLinks.processingTimes}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-700"
          >
            Open the official USCIS processing-times tool ↗
          </a>
          <Field
            label="Case inquiry date returned by USCIS"
            help="USCIS shows this alongside the processing time. If your receipt date is earlier than this date, you may submit an inquiry."
          >
            <input
              type="date"
              className={fieldClass}
              value={inp.inquiryDate}
              onChange={(e) => set("inquiryDate", e.target.value)}
            />
          </Field>
        </InputCard>

        <button
          type="button"
          onClick={() => setInp(DELAY_EMPTY)}
          className="text-xs font-semibold text-ink-500 underline"
        >
          Reset
        </button>
      </div>

      <div className="space-y-4">
        <ResultCard
          tone={r.tone}
          eyebrow="Outside normal processing time?"
          title={r.headline}
          badge={r.badge}
        >
          <p>{r.summary}</p>

          {r.elapsedLabel && (
            <div className="rounded-xl bg-ink-50 p-3">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
                Time since receipt
              </p>
              <p className="mt-0.5 text-lg font-bold text-ink-900">
                {r.elapsedLabel}
              </p>
              <p className="mt-1 text-xs text-ink-500">
                Elapsed time is not a verdict. It is reported here only because
                you supplied a real receipt date.
              </p>
            </div>
          )}

          {r.nextSteps.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
                Next steps
              </p>
              <ul className="mt-1.5 space-y-1.5 text-sm text-ink-700">
                {r.nextSteps.map((s) => (
                  <li key={s} className="flex gap-2">
                    <span aria-hidden className="text-ink-400">
                      &middot;
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ResultCard>

        {r.notes.length > 0 && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
              About your transfer
            </p>
            <ul className="mt-2 space-y-2 text-sm text-amber-900">
              {r.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
            How USCIS&rsquo;s own figures work
          </p>
          <p className="mt-2 text-sm text-ink-600">
            {uscisMethodology.displayedTime}
          </p>
          <p className="mt-2 text-sm text-ink-600">
            {uscisMethodology.inquiryDate}
          </p>
          <p className="mt-2 text-xs text-ink-500">
            {uscisMethodology.whyNoNumbersHere}
          </p>
        </div>
      </div>
    </div>
  );
}
