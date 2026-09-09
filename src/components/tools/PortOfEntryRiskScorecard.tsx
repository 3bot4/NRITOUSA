"use client";

import { useMemo, useState } from "react";
import InputCard, { Field, fieldClass } from "@/components/tools/InputCard";
import ResultCard from "@/components/tools/ResultCard";
import {
  SCORECARD_EMPTY,
  scoreEntryRisk,
  type ScorecardInputs,
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

const BAND_STYLE: Record<string, { bar: string; text: string }> = {
  low: { bar: "bg-emerald-500", text: "text-emerald-700" },
  moderate: { bar: "bg-amber-500", text: "text-amber-700" },
  elevated: { bar: "bg-orange-500", text: "text-orange-700" },
  high: { bar: "bg-rose-500", text: "text-rose-700" },
  incomplete: { bar: "bg-ink-300", text: "text-ink-500" },
};

export default function PortOfEntryRiskScorecard() {
  const [inp, setInp] = useState<ScorecardInputs>(SCORECARD_EMPTY);
  const set = <K extends keyof ScorecardInputs>(k: K, v: ScorecardInputs[K]) =>
    setInp((p) => ({ ...p, [k]: v }));

  const r = useMemo(() => scoreEntryRisk(inp), [inp]);
  const style = BAND_STYLE[r.band] ?? BAND_STYLE.incomplete;
  const pct = r.maxScore > 0 ? Math.min(100, (r.score / r.maxScore) * 100) : 0;

  return (
    <div id="tool" className="grid gap-5 lg:grid-cols-2">
      {/* ── Inputs ─────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <InputCard eyebrow="Step 1" title="Your employment">
          <Field
            label="Who do you actually work for day to day?"
            help="Third-party client-site placement is the single most examined arrangement for H-1B travellers."
          >
            <select
              className={fieldClass}
              value={inp.employerType}
              onChange={(e) =>
                set("employerType", e.target.value as ScorecardInputs["employerType"])
              }
            >
              <option value="">Select…</option>
              <option value="direct">
                Direct employee, working at my employer&rsquo;s own site
              </option>
              <option value="staffing">
                Staffing or consulting firm, but working at my employer&rsquo;s site
              </option>
              <option value="third-party">
                Placed at a third-party client site
              </option>
            </select>
          </Field>

          <Field
            label="Days since your most recent pay stub"
            help="A long gap is read as a question about whether the job still exists."
          >
            <input
              type="number"
              min={0}
              inputMode="numeric"
              className={fieldClass}
              value={inp.daysSincePayStub}
              onChange={(e) => set("daysSincePayStub", e.target.value)}
              placeholder="e.g. 14"
            />
          </Field>

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
            help="The 60-day period at 8 CFR 214.1(l)(2) is discretionary, not an entitlement."
            value={inp.employmentGap}
            onChange={(v) => set("employmentGap", v)}
          />
        </InputCard>

        <InputCard eyebrow="Step 2" title="Worksite & LCA">
          <YesNoField
            label="Has your worksite changed since the LCA was certified?"
            value={inp.worksiteChanged}
            onChange={(v) => set("worksiteChanged", v)}
          />
          <YesNoField
            label="Does your current worksite appear on a certified LCA?"
            value={inp.worksiteMatchesLca}
            onChange={(v) => set("worksiteMatchesLca", v)}
          />
          <YesNoField
            label="If the location changed, was an amended petition filed?"
            help="Answer 'Not applicable' as yes if your worksite never changed."
            value={inp.amendmentFiled}
            onChange={(v) => set("amendmentFiled", v)}
            yesLabel="Yes / N/A"
            noLabel="No"
          />
        </InputCard>

        <InputCard eyebrow="Step 3" title="Documents & history">
          <YesNoField
            label="Is your visa stamp expired, with only an approved extension in hand?"
            value={inp.extensionApprovedStampExpired}
            onChange={(v) => set("extensionApprovedStampExpired", v)}
          />
          <YesNoField
            label="Are you carrying an I-797A (with the I-94 tear-off)?"
            help="An I-797B is a consular-notification approval and carries no I-94."
            value={inp.carryingI797A}
            onChange={(v) => set("carryingI797A", v)}
            yesLabel="I-797A"
            noLabel="I-797B / unsure"
          />
          <YesNoField
            label="Does your LinkedIn and public resume match your petition?"
            value={inp.onlineProfileMatches}
            onChange={(v) => set("onlineProfileMatches", v)}
          />
          <YesNoField
            label="Have you ever had a 221(g), a visa refusal or a refused admission?"
            value={inp.priorRefusal}
            onChange={(v) => set("priorRefusal", v)}
          />
          <YesNoField
            label="Do you have any arrest or criminal history, anywhere?"
            value={inp.priorCriminalHistory}
            onChange={(v) => set("priorCriminalHistory", v)}
          />
          <YesNoField
            label="Is an H-4 spouse or child travelling with you?"
            value={inp.h4Travelling}
            onChange={(v) => set("h4Travelling", v)}
          />
        </InputCard>

        <button
          type="button"
          onClick={() => setInp(SCORECARD_EMPTY)}
          className="text-xs font-semibold text-ink-500 underline"
        >
          Reset
        </button>
      </div>

      {/* ── Result ─────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <ResultCard
          tone={r.tone}
          eyebrow="Port-of-entry scorecard"
          title={r.headline}
          badge={r.badge}
        >
          {r.band !== "incomplete" && (
            <div>
              <div className="flex items-baseline justify-between">
                <span className={`text-sm font-bold capitalize ${style.text}`}>
                  {r.band} — {r.flags.length}{" "}
                  {r.flags.length === 1 ? "flag" : "flags"}
                </span>
                <span className="text-xs text-ink-400">
                  {r.score} of {r.maxScore}
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink-100">
                <div
                  className={`h-full rounded-full transition-all ${style.bar}`}
                  style={{ width: `${Math.max(pct, r.score > 0 ? 6 : 0)}%` }}
                />
              </div>
            </div>
          )}
          <p>{r.summary}</p>
          {r.band !== "incomplete" && (
            <p className="text-xs text-ink-400">
              This is an ordinal ranking of how examinable your facts are, not a
              probability. Nobody can quantify the chance of a referral, and a
              number that pretended to would be worse than none.
            </p>
          )}
        </ResultCard>

        {r.flags.length > 0 && (
          <div className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
              What an officer is likely to ask, and what answers it
            </p>
            <ul className="mt-3 space-y-3">
              {r.flags.map((f) => (
                <li
                  key={f.causeId}
                  className="rounded-xl border border-ink-900/5 bg-ink-50/50 p-3"
                >
                  <p className="text-sm font-bold text-ink-900">{f.title}</p>
                  <p className="mt-1.5 text-sm italic text-ink-600">
                    &ldquo;{f.question}&rdquo;
                  </p>
                  <p className="mt-1.5 text-sm text-ink-600">
                    <span className="font-semibold text-emerald-700">
                      Closes it:
                    </span>{" "}
                    {f.closer}
                  </p>
                </li>
              ))}
            </ul>
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

        {r.documents.length > 0 && (
          <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-card">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Carry these — in your hand luggage, on paper
            </p>
            <p className="mt-1 text-xs text-ink-500">
              Phones get taken. A document you can only reach through email is a
              document you do not have at secondary inspection.
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
        )}
      </div>
    </div>
  );
}
