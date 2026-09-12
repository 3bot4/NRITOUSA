"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import InputCard, { Field, fieldClass } from "@/components/tools/InputCard";
import ResultCard from "@/components/tools/ResultCard";
import {
  AVR_EMPTY,
  checkAvr,
  type AvrInputs,
  type YesNo,
} from "@/lib/portOfEntry";
import {
  AVR_NATIONALITY_EXCLUSION,
  adjacentIslands,
} from "@/data/portOfEntryData";

/** Compact yes/no segmented control — faster than a select on a phone. */
function YesNoField({
  label,
  help,
  value,
  onChange,
  yesLabel = "Yes",
  noLabel = "No",
}: {
  label: string;
  help?: string;
  value: YesNo;
  onChange: (v: YesNo) => void;
  yesLabel?: string;
  noLabel?: string;
}) {
  return (
    <div className="block">
      <span className="text-xs font-semibold text-ink-800">{label}</span>
      <div className="mt-1.5 grid grid-cols-2 gap-2">
        {(
          [
            ["yes", yesLabel],
            ["no", noLabel],
          ] as [YesNo, string][]
        ).map(([v, l]) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(value === v ? "" : v)}
            aria-pressed={value === v}
            className={`min-w-0 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
              value === v
                ? "border-brand-500 bg-brand-50 text-brand-800"
                : "border-ink-900/10 bg-white text-ink-600 hover:border-ink-900/20"
            }`}
          >
            {l}
          </button>
        ))}
      </div>
      {help && <span className="mt-1 block text-xs text-ink-400">{help}</span>}
    </div>
  );
}

export default function AvrEligibilityChecker() {
  const [inp, setInp] = useState<AvrInputs>(AVR_EMPTY);
  const set = <K extends keyof AvrInputs>(k: K, v: AvrInputs[K]) =>
    setInp((p) => ({ ...p, [k]: v }));

  const result = useMemo(() => checkAvr(inp), [inp]);

  return (
    <div id="tool" className="grid gap-5 lg:grid-cols-2">
      <div className="space-y-4">
        <InputCard eyebrow="22 CFR 41.112(d)" title="Do you have a visa to revalidate?">
          <YesNoField
            label="Do you hold a nonimmigrant visa that has expired (or a visa in a classification DHS has since changed)?"
            help="Automatic revalidation extends an existing visa or converts one after a change of status. It cannot create a visa you never held."
            value={inp.hasRevalidatableVisa}
            onChange={(v) => set("hasRevalidatableVisa", v)}
            yesLabel="Yes, I hold one"
            noLabel="No / never held one"
          />
        </InputCard>

        <InputCard eyebrow="22 CFR 41.112(d)" title="Your trip">
          <Field
            label="Your nonimmigrant classification"
            help="F and J travellers may use adjacent islands; other classifications may not."
          >
            <select
              className={fieldClass}
              value={inp.statusClass}
              onChange={(e) =>
                set("statusClass", e.target.value as AvrInputs["statusClass"])
              }
            >
              <option value="">Select…</option>
              <option value="h1b-h4">H-1B or H-4</option>
              <option value="l">L-1 or L-2</option>
              <option value="f-j">F or J (student / exchange visitor)</option>
              <option value="other">Another nonimmigrant classification</option>
            </select>
          </Field>

          <Field
            label="Where did you travel?"
            help="Contiguous territory means Canada and Mexico only. \u201cAdjacent islands\u201d is a defined statutory term \u2014 see the definition below the result."
          >
            <select
              className={fieldClass}
              value={inp.destination}
              onChange={(e) =>
                set("destination", e.target.value as AvrInputs["destination"])
              }
            >
              <option value="">Select…</option>
              <option value="canada-mexico">Canada or Mexico only</option>
              <option value="adjacent-island">
                An adjacent island as defined at INA 101(b)(5) (not Cuba)
              </option>
              <option value="elsewhere">
                Anywhere else — including India, or a connection elsewhere
              </option>
            </select>
          </Field>

          <YesNoField
            label="Was the whole absence 30 days or less?"
            help="Counted from departure to the day you apply for readmission."
            value={inp.under30Days}
            onChange={(v) => set("under30Days", v)}
            yesLabel="30 days or less"
            noLabel="Longer"
          />
        </InputCard>

        <InputCard eyebrow="Your documents & status" title="The conditions">
          <YesNoField
            label="Do you hold an unexpired I-94 covering your return?"
            help="F students also need a current endorsed I-20; J visitors a current DS-2019."
            value={inp.unexpiredI94}
            onChange={(v) => set("unexpiredI94", v)}
          />
          {inp.statusClass === "f-j" && (
            <YesNoField
              label="Do you hold a current, properly endorsed I-20 (F) or DS-2019 (J)?"
              help="A separate condition at 22 CFR 41.112(d)(2)(i) for F and J travellers and their dependants."
              value={inp.endorsedForm}
              onChange={(v) => set("endorsedForm", v)}
            />
          )}
          <YesNoField
            label="Have you maintained status, and do you intend to resume it?"
            value={inp.maintainedStatus}
            onChange={(v) => set("maintainedStatus", v)}
          />
          <YesNoField
            label="Do you hold a valid passport?"
            value={inp.validPassport}
            onChange={(v) => set("validPassport", v)}
          />
          <YesNoField
            label="Do you require a waiver of inadmissibility under INA 212(d)(3)?"
            value={inp.needsWaiver}
            onChange={(v) => set("needsWaiver", v)}
          />
          <YesNoField
            label="Are you a national of a designated State Sponsor of Terrorism country?"
            help="An absolute exclusion under 22 CFR 41.112(d)(3)."
            value={inp.sstNational}
            onChange={(v) => set("sstNational", v)}
          />
        </InputCard>

        <InputCard eyebrow="The condition people miss" title="Did you apply for a visa?">
          <YesNoField
            label="Did you apply for a new US visa while on this trip?"
            help="Applying is what ends automatic revalidation — not being refused."
            value={inp.appliedForVisa}
            onChange={(v) => {
              set("appliedForVisa", v);
              if (v !== "yes") set("visaRefused", "");
            }}
          />
          {inp.appliedForVisa === "yes" && (
            <YesNoField
              label="Was that application refused?"
              help="Either way automatic revalidation is gone — this only changes what you do next."
              value={inp.visaRefused}
              onChange={(v) => set("visaRefused", v)}
              yesLabel="Refused"
              noLabel="Approved or pending"
            />
          )}
        </InputCard>

        <button
          type="button"
          onClick={() => setInp(AVR_EMPTY)}
          className="text-xs font-semibold text-ink-500 underline"
        >
          Reset
        </button>
      </div>

      <div className="space-y-4">
        <ResultCard
          tone={result.tone}
          eyebrow="Automatic revalidation"
          title={result.headline}
          badge={result.badge}
        >
          <p>{result.summary}</p>

          {result.nextStep && (
            <div className="rounded-xl bg-ink-50 p-3">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
                What to do next
              </p>
              <p className="mt-1 text-sm text-ink-700">{result.nextStep}</p>
            </div>
          )}
        </ResultCard>

        {result.failures.length > 0 && (
          <div className="rounded-2xl border border-rose-200 bg-white p-5 shadow-card">
            <p className="text-xs font-bold uppercase tracking-wider text-rose-700">
              {result.failures.length === 1
                ? "The condition that fails"
                : "The conditions that fail"}
            </p>
            <ul className="mt-3 space-y-3">
              {result.failures.map((f) => (
                <li
                  key={f.cite + f.label}
                  className="rounded-xl border border-rose-100 bg-rose-50/50 p-3"
                >
                  <p className="text-sm font-bold text-ink-900">{f.label}</p>
                  <p className="mt-0.5 font-mono text-[0.7rem] text-rose-700">
                    {f.cite}
                  </p>
                  <p className="mt-1.5 text-sm text-ink-600">{f.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.met.length > 0 && (
          <div className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
              Conditions you do meet
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-ink-600">
              {result.met.map((m) => (
                <li key={m} className="flex gap-2">
                  <span aria-hidden className="text-emerald-600">
                    &#10003;
                  </span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
            What &ldquo;adjacent islands&rdquo; actually means
          </p>
          <p className="mt-2 text-sm italic text-ink-700">
            &ldquo;{adjacentIslands.definition}&rdquo;
          </p>
          <p className="mt-1 font-mono text-[0.7rem] text-ink-500">
            {adjacentIslands.cite}
          </p>
          <p className="mt-2 text-sm text-ink-600">{adjacentIslands.whoCanUseIt}</p>
          <p className="mt-1.5 text-sm text-ink-600">{adjacentIslands.notCovered}</p>
        </div>

        {result.verdict !== "incomplete" && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 text-sm text-amber-900">
            <p className="font-bold">This is not an admission decision</p>
            <p className="mt-1.5">
              Automatic revalidation only extends the validity of an expired
              visa. It does not make you admissible, and the CBP officer at the
              port decides admission every time you arrive. If anything about
              your status or employment is unresolved, see{" "}
              <Link href="/h1b-denied-entry-airport" className="underline">
                what happens at secondary inspection
              </Link>{" "}
              before you travel.
            </p>
            <p className="mt-2 text-xs">
              Nationality exclusion:{" "}
              <a
                href={AVR_NATIONALITY_EXCLUSION.listHref}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                check the current State Sponsors of Terrorism list
              </a>{" "}
              ({AVR_NATIONALITY_EXCLUSION.cite}).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
