"use client";

import { useMemo, useState } from "react";
import InputCard, { Field, fieldClass } from "@/components/tools/InputCard";
import ResultCard from "@/components/tools/ResultCard";
import {
  PREP_EMPTY,
  assessEntryPreparedness,
  type FindingKind,
  type PrepInputs,
  type YesNo,
} from "@/lib/portOfEntry";

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

const KIND_STYLE: Record<
  FindingKind,
  { border: string; chip: string; label: string }
> = {
  "hard-stop": {
    border: "border-rose-300 bg-rose-50/70",
    chip: "bg-rose-600 text-white",
    label: "Hard stop",
  },
  "attorney-review": {
    border: "border-amber-300 bg-amber-50/60",
    chip: "bg-amber-600 text-white",
    label: "Attorney review",
  },
  "document-gap": {
    border: "border-sky-200 bg-sky-50/60",
    chip: "bg-sky-600 text-white",
    label: "Document gap",
  },
};

export default function PortOfEntryPreparednessChecklist() {
  const [inp, setInp] = useState<PrepInputs>(PREP_EMPTY);
  const set = <K extends keyof PrepInputs>(k: K, v: PrepInputs[K]) =>
    setInp((p) => ({ ...p, [k]: v }));

  const r = useMemo(() => assessEntryPreparedness(inp), [inp]);

  const ordered = [...r.hardStops, ...r.attorneyReview, ...r.documentGaps];

  return (
    <div id="tool" className="grid gap-5 lg:grid-cols-2">
      {/* ── Inputs ─────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <InputCard eyebrow="Step 1" title="Travel documents">
          <Field
            label="Your visa position for this trip"
            help="Where a visa is required, this is the item that decides whether you can travel at all."
          >
            <select
              className={fieldClass}
              value={inp.visaPosture}
              onChange={(e) =>
                set("visaPosture", e.target.value as PrepInputs["visaPosture"])
              }
            >
              <option value="">Select…</option>
              <option value="valid">
                I hold a valid, unexpired visa in the right classification
              </option>
              <option value="expired-avr">
                Expired — but I meet the automatic revalidation conditions
              </option>
              <option value="expired-none">
                Expired, and no exception applies
              </option>
              <option value="visa-exempt">
                I am visa-exempt for this travel
              </option>
            </select>
          </Field>
          <YesNoField
            label="Is your passport valid well beyond your intended stay?"
            value={inp.passportValid}
            onChange={(v) => set("passportValid", v)}
          />
        </InputCard>

        <InputCard eyebrow="Step 2" title="Worksite and petition">
          <Field
            label="Has your worksite moved since the LCA was certified?"
            help="What matters is whether the move was outside the area of intended employment on the certified LCA — not simply that your desk moved."
          >
            <select
              className={fieldClass}
              value={inp.worksiteMove}
              onChange={(e) =>
                set("worksiteMove", e.target.value as PrepInputs["worksiteMove"])
              }
            >
              <option value="">Select…</option>
              <option value="none">No move</option>
              <option value="same-area">
                Moved, but within the same area of intended employment
              </option>
              <option value="outside-area">
                Moved outside the area of intended employment
              </option>
              <option value="unsure">I am not sure</option>
            </select>
          </Field>
          {inp.worksiteMove === "outside-area" && (
            <YesNoField
              label="Was an amended petition filed for that move?"
              value={inp.amendmentFiled}
              onChange={(v) => set("amendmentFiled", v)}
            />
          )}
          <YesNoField
            label="Do your day-to-day duties match the job described on the I-129?"
            value={inp.dutiesMatchPetition}
            onChange={(v) => set("dutiesMatchPetition", v)}
          />
          <YesNoField
            label="Did you change employers in the last 90 days?"
            value={inp.employerChanged90Days}
            onChange={(v) => set("employerChanged90Days", v)}
          />
          <YesNoField
            label="Have you had a gap in employment or a recent layoff?"
            value={inp.employmentGap}
            onChange={(v) => set("employmentGap", v)}
          />
        </InputCard>

        <InputCard eyebrow="Step 3" title="What you are carrying">
          <YesNoField
            label="Current I-797 approval notice, on paper?"
            value={inp.haveApprovalNotice}
            onChange={(v) => set("haveApprovalNotice", v)}
          />
          <YesNoField
            label="Certified LCA covering your actual worksite?"
            value={inp.haveLca}
            onChange={(v) => set("haveLca", v)}
          />
          <YesNoField
            label="Recent pay stubs?"
            value={inp.havePayStubs}
            onChange={(v) => set("havePayStubs", v)}
          />
          <YesNoField
            label="Is your public resume and profile factually accurate and current?"
            help="The goal is accuracy. Correct what is wrong or stale — never conceal or alter information to create a misleading impression."
            value={inp.profileAccurate}
            onChange={(v) => set("profileAccurate", v)}
          />
        </InputCard>

        <InputCard eyebrow="Step 4" title="History and family">
          <YesNoField
            label="Any prior visa refusal, refused admission or removal?"
            value={inp.priorRefusalOrRemoval}
            onChange={(v) => set("priorRefusalOrRemoval", v)}
          />
          <YesNoField
            label="Any arrest or criminal history, anywhere?"
            value={inp.priorCriminalHistory}
            onChange={(v) => set("priorCriminalHistory", v)}
          />
          <YesNoField
            label="Do you have a pending I-485?"
            value={inp.pendingI485}
            onChange={(v) => set("pendingI485", v)}
          />
          <YesNoField
            label="Is an H-4 spouse or child travelling with you?"
            value={inp.h4Travelling}
            onChange={(v) => set("h4Travelling", v)}
          />
        </InputCard>

        <button
          type="button"
          onClick={() => setInp(PREP_EMPTY)}
          className="text-xs font-semibold text-ink-500 underline"
        >
          Reset
        </button>
      </div>

      {/* ── Result ─────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <ResultCard
          tone={r.tone}
          eyebrow="Preparedness checklist"
          title={r.headline}
          badge={r.complete ? `${r.findings.length} to address` : `${r.answered} of ${r.total}`}
        >
          <p>{r.summary}</p>
          <p className="rounded-xl bg-ink-50 p-3 text-xs text-ink-500">
            This is a preparation checklist, not a risk score. It does not — and
            cannot — estimate the probability that you will be admitted or
            refused. No such figure is published by CBP, and any tool that shows
            you one has invented it. Every arrival is a fresh inspection decided
            by the officer in front of you.
          </p>
        </ResultCard>

        {r.complete && ordered.length > 0 && (
          <div className="space-y-3">
            {ordered.map((f) => {
              const st = KIND_STYLE[f.kind];
              return (
                <div key={f.id} className={`rounded-2xl border p-4 ${st.border}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-bold text-ink-900">{f.title}</p>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${st.chip}`}
                    >
                      {st.label}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm text-ink-600">{f.detail}</p>
                  <p className="mt-1.5 text-sm text-ink-700">
                    <span className="font-semibold">What to do:</span> {f.action}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {r.i485Note && (
          <div className="rounded-2xl border border-violet-200 bg-violet-50/60 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-violet-800">
              You have a pending I-485
            </p>
            <p className="mt-2 text-sm text-violet-900">{r.i485Note}</p>
          </div>
        )}

        {r.h4Note && (
          <div className="rounded-2xl border border-violet-200 bg-violet-50/60 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-violet-800">
              Travelling with an H-4 spouse or children
            </p>
            <p className="mt-2 text-sm text-violet-900">{r.h4Note}</p>
          </div>
        )}

        <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-card">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Carry these — on paper, in hand luggage
          </p>
          <p className="mt-1 text-xs text-ink-500">
            Devices are frequently taken. A document you can only reach through
            email is a document you do not have at secondary inspection.
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-ink-600">
            {r.documents.map((d) => (
              <li key={d} className="flex gap-2">
                <span aria-hidden className="text-emerald-600">
                  &#10003;
                </span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
