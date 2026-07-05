"use client";

import Link from "next/link";
import { useState } from "react";
import { decisionOutputs } from "@/data/indiaVisaData";

/**
 * Lightweight "Which India Visa Do You Need?" decision guide for the hub page.
 * Purely educational: it maps a few plain-language answers to the visa/OCI
 * options that MAY fit, and always links onward + reminds the user this is a
 * guide, not legal or consular advice. No personal data leaves the browser.
 */

type Purpose = "tourism" | "business" | "medical" | "family" | "study" | "work" | "emergency" | "";

export default function IndiaVisaDecisionGuide() {
  const [usCitizen, setUsCitizen] = useState<boolean | null>(null);
  const [indianOrigin, setIndianOrigin] = useState<boolean | null>(null);
  const [hasOci, setHasOci] = useState<boolean | null>(null);
  const [purpose, setPurpose] = useState<Purpose>("");
  const [longStay, setLongStay] = useState<boolean | null>(null);

  // Which output keys to surface, in priority order.
  const keys: string[] = [];
  if (hasOci) {
    keys.push("oci");
  } else if (purpose === "emergency") {
    keys.push("consulate");
  } else if (purpose === "work") {
    keys.push("consulate");
  } else if (purpose === "study") {
    keys.push("consulate");
  } else if (purpose === "medical") {
    keys.push("emedical");
  } else if (purpose === "business") {
    keys.push(longStay ? "consulate" : "ebusiness");
  } else if (purpose === "family") {
    if (indianOrigin) keys.push("oci", "entry");
    else keys.push("entry", "tourist");
  } else if (purpose === "tourism") {
    if (indianOrigin && longStay) keys.push("oci", "entry");
    else if (longStay) keys.push("tourist");
    else keys.push("etourist");
  }
  if (indianOrigin && !hasOci && !keys.includes("oci")) keys.push("oci");
  if (!keys.length && purpose) keys.push("consulate");

  const results = decisionOutputs.filter((o) => keys.includes(o.key));
  const answered = usCitizen !== null && purpose !== "";

  const Toggle = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: boolean | null;
    onChange: (v: boolean) => void;
  }) => (
    <div>
      <p className="text-sm font-semibold text-ink-900">{label}</p>
      <div className="mt-1.5 flex gap-2">
        {[
          { t: "Yes", v: true },
          { t: "No", v: false },
        ].map((o) => (
          <button
            key={o.t}
            type="button"
            onClick={() => onChange(o.v)}
            className={`rounded-lg border px-4 py-1.5 text-sm font-semibold transition ${
              value === o.v
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-ink-900/10 bg-white text-ink-600 hover:border-brand-300"
            }`}
          >
            {o.t}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div id="which-india-visa" className="scroll-mt-24 rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card sm:p-6">
      <h2 className="text-xl font-bold text-ink-900">Which India Visa Do You Need?</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
        Answer a few questions to see which options may fit. This tool is only a guide, not legal or consular advice — always confirm your category with VFS Global or the Indian Consulate.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Toggle label="Are you a U.S. citizen?" value={usCitizen} onChange={setUsCitizen} />
        <Toggle label="Are you of Indian origin (or a former Indian citizen)?" value={indianOrigin} onChange={setIndianOrigin} />
        <Toggle label="Do you already have OCI?" value={hasOci} onChange={setHasOci} />
        <Toggle label="Will you stay long-term or need multiple entries?" value={longStay} onChange={setLongStay} />

        <div className="sm:col-span-2">
          <p className="text-sm font-semibold text-ink-900">What is the trip for?</p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {([
              ["tourism", "Tourism"],
              ["business", "Business"],
              ["medical", "Medical"],
              ["family", "Family visit"],
              ["study", "Study"],
              ["work", "Work"],
              ["emergency", "Emergency"],
            ] as [Purpose, string][]).map(([v, t]) => (
              <button
                key={v}
                type="button"
                onClick={() => setPurpose(v)}
                className={`rounded-lg border px-3.5 py-1.5 text-sm font-semibold transition ${
                  purpose === v
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-ink-900/10 bg-white text-ink-600 hover:border-brand-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {answered && (
        <div className="mt-6 rounded-xl border border-brand-100 bg-brand-50/50 p-4">
          <p className="text-sm font-bold text-ink-900">Options that may fit:</p>
          <div className="mt-3 space-y-2.5">
            {results.map((r) =>
              r.href.startsWith("http") ? (
                <a
                  key={r.key}
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg border border-ink-900/10 bg-white p-3.5 transition hover:border-brand-400"
                >
                  <p className="text-sm font-semibold text-brand-700">{r.label} ↗</p>
                  <p className="mt-0.5 text-xs text-ink-500">{r.blurb}</p>
                </a>
              ) : (
                <Link
                  key={r.key}
                  href={r.href}
                  className="block rounded-lg border border-ink-900/10 bg-white p-3.5 transition hover:border-brand-400"
                >
                  <p className="text-sm font-semibold text-brand-700">{r.label} →</p>
                  <p className="mt-0.5 text-xs text-ink-500">{r.blurb}</p>
                </Link>
              ),
            )}
          </div>
          <p className="mt-3 text-xs text-ink-400">
            Special cases (name changes, old Indian passport surrender, minors, dual purposes) should always be confirmed with the consulate or VFS.
          </p>
        </div>
      )}
    </div>
  );
}
