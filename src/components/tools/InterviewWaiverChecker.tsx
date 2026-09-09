"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import InputCard, { Field, fieldClass } from "@/components/tools/InputCard";
import ResultCard from "@/components/tools/ResultCard";
import {
  WAIVER_CLASSES,
  WAIVER_CLASS_ORDER,
  WAIVER_EMPTY,
  checkInterviewWaiver,
  type WaiverClass,
  type WaiverInputs,
} from "@/lib/interviewWaiver";
import { IW_CURRENT_RULE } from "@/data/interviewWaiverData";

const COUNTRIES = [
  "India",
  "United States",
  "Canada",
  "Mexico",
  "United Kingdom",
  "United Arab Emirates",
  "Singapore",
  "Australia",
  "Other",
];

export default function InterviewWaiverChecker() {
  const [inp, setInp] = useState<WaiverInputs>(WAIVER_EMPTY);
  const set = <K extends keyof WaiverInputs>(k: K, v: WaiverInputs[K]) =>
    setInp((p) => ({ ...p, [k]: v }));

  const r = useMemo(() => checkInterviewWaiver(inp), [inp]);

  const meta = inp.applyingFor
    ? WAIVER_CLASSES[inp.applyingFor as Exclude<WaiverClass, "">]
    : null;
  // Excluded classes are settled by category alone — asking for dates and
  // refusal history would imply the answer might change. It cannot.
  const showRenewalFields = Boolean(meta && meta.renewalRoute);

  return (
    <div id="tool" className="grid gap-5 lg:grid-cols-2">
      <div className="space-y-4">
        <InputCard eyebrow="Step 1" title="What are you applying for?">
          <Field
            label="Visa classification you are applying for now"
            help="Under the current rule, the category alone decides most cases."
          >
            <select
              className={fieldClass}
              value={inp.applyingFor}
              onChange={(e) => {
                const v = e.target.value as WaiverClass;
                setInp({ ...WAIVER_EMPTY, applyingFor: v });
              }}
            >
              <option value="">Select…</option>
              {WAIVER_CLASS_ORDER.map((c) => (
                <option key={c} value={c}>
                  {WAIVER_CLASSES[c].label}
                </option>
              ))}
            </select>
          </Field>
        </InputCard>

        {showRenewalFields && (
          <>
            <InputCard eyebrow="Step 2" title="Your prior visa">
              <Field label="Classification of the prior visa">
                <select
                  className={fieldClass}
                  value={inp.priorClass}
                  onChange={(e) =>
                    set("priorClass", e.target.value as WaiverClass)
                  }
                >
                  <option value="">Select…</option>
                  {WAIVER_CLASS_ORDER.map((c) => (
                    <option key={c} value={c}>
                      {WAIVER_CLASSES[c].label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="Date the prior visa expired (or will expire)"
                help="The 12-month window runs from expiration, not from issuance."
              >
                <input
                  type="date"
                  className={fieldClass}
                  value={inp.priorExpiry}
                  onChange={(e) => set("priorExpiry", e.target.value)}
                />
              </Field>

              <Field
                label="Was the prior visa issued for its full validity?"
                help="An express condition of the rule that almost nobody checks. Compare the printed issue and expiry dates against the standard validity for your nationality."
              >
                <select
                  className={fieldClass}
                  value={inp.fullValidity}
                  onChange={(e) =>
                    set("fullValidity", e.target.value as WaiverInputs["fullValidity"])
                  }
                >
                  <option value="">Select…</option>
                  <option value="yes">Yes — full validity</option>
                  <option value="no">No — shortened validity</option>
                  <option value="unsure">I am not sure</option>
                </select>
              </Field>

              <Field label="Were you at least 18 when the prior visa was issued?">
                <select
                  className={fieldClass}
                  value={inp.age18AtIssuance}
                  onChange={(e) =>
                    set(
                      "age18AtIssuance",
                      e.target.value as WaiverInputs["age18AtIssuance"],
                    )
                  }
                >
                  <option value="">Select…</option>
                  <option value="yes">Yes, 18 or older</option>
                  <option value="no">No, under 18</option>
                  <option value="unsure">I am not sure</option>
                </select>
              </Field>

              <Field
                label="Has your name or date of birth changed since then?"
                help="Not a rule condition, but it complicates the identity match in practice."
              >
                <select
                  className={fieldClass}
                  value={inp.identityChanged}
                  onChange={(e) =>
                    set(
                      "identityChanged",
                      e.target.value as WaiverInputs["identityChanged"],
                    )
                  }
                >
                  <option value="">Select…</option>
                  <option value="no">No change</option>
                  <option value="yes">Yes, it changed</option>
                </select>
              </Field>
            </InputCard>

            <InputCard eyebrow="Step 3" title="Refusal history">
              <Field
                label="Have you ever been refused a US visa?"
                help="A refusal that was later overcome does not automatically disqualify you — this is the most misread clause in the rule."
              >
                <select
                  className={fieldClass}
                  value={inp.refusalType}
                  onChange={(e) => {
                    const v = e.target.value as WaiverInputs["refusalType"];
                    set("refusalType", v);
                    if (v === "none") set("refusalOvercome", "");
                  }}
                >
                  <option value="">Select…</option>
                  <option value="none">Never refused</option>
                  <option value="214b">
                    Yes — 214(b), failure to establish eligibility
                  </option>
                  <option value="221g">
                    Yes — 221(g), administrative processing
                  </option>
                  <option value="other">Yes — another ground</option>
                </select>
              </Field>

              {inp.refusalType && inp.refusalType !== "none" && (
                <Field
                  label="Was that refusal overcome or waived?"
                  help="Overcome means a visa was actually issued to you afterwards. A 221(g) that ended in issuance has been overcome."
                >
                  <select
                    className={fieldClass}
                    value={inp.refusalOvercome}
                    onChange={(e) =>
                      set(
                        "refusalOvercome",
                        e.target.value as WaiverInputs["refusalOvercome"],
                      )
                    }
                  >
                    <option value="">Select…</option>
                    <option value="yes">
                      Yes — a visa was issued to me afterwards, or it was waived
                    </option>
                    <option value="no">No — still unresolved</option>
                    <option value="unsure">I am not sure</option>
                  </select>
                </Field>
              )}
            </InputCard>

            <InputCard eyebrow="Step 4" title="Where you are applying">
              {(
                [
                  ["nationality", "Country of nationality"],
                  ["residence", "Country of usual residence"],
                  ["applyingIn", "Country where you will apply"],
                ] as [keyof WaiverInputs, string][]
              ).map(([k, label]) => (
                <Field key={k} label={label}>
                  <select
                    className={fieldClass}
                    value={inp[k] as string}
                    onChange={(e) =>
                      set(k, e.target.value as WaiverInputs[typeof k])
                    }
                  >
                    <option value="">Select…</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
              ))}
            </InputCard>
          </>
        )}

        {inp.applyingFor && (
          <button
            type="button"
            onClick={() => setInp(WAIVER_EMPTY)}
            className="text-xs font-semibold text-ink-500 underline"
          >
            Reset
          </button>
        )}
      </div>

      {/* ── Result ─────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <ResultCard
          tone={r.tone}
          eyebrow={`Rules effective ${r.ruleEffective}`}
          title={r.headline}
          badge={r.badge}
        >
          <p>{r.summary}</p>
          <p className="text-xs text-ink-400">
            Rules verified {r.rulesVerified} against the Department of
            State&rsquo;s {IW_CURRENT_RULE.announced} Interview Waiver Update.
            This is a self-check, not a determination — the consular section
            decides.
          </p>
        </ResultCard>

        {/* The 12-month countdown — the most shareable output on the page. */}
        {r.windowDaysRemaining !== null && (
          <div
            className={`rounded-2xl border p-5 shadow-card ${
              r.windowDaysRemaining < 0
                ? "border-rose-200 bg-rose-50/60"
                : r.windowDaysRemaining < 60
                  ? "border-amber-200 bg-amber-50/60"
                  : "border-emerald-200 bg-emerald-50/60"
            }`}
          >
            <p className="text-xs font-bold uppercase tracking-wider text-ink-500">
              12-month renewal window
            </p>
            <p className="mt-1 text-3xl font-black tracking-tight text-ink-900">
              {r.windowDaysRemaining < 0
                ? "Closed"
                : `${r.windowDaysRemaining} days`}
            </p>
            <p className="mt-1 text-sm text-ink-600">{r.windowLabel}</p>
            <p className="mt-2 text-xs text-ink-500">
              The window runs from the prior visa&rsquo;s expiration date. Book
              early — an appointment date inside the window is what counts, and
              wait times move.
            </p>
          </div>
        )}

        {r.failures.length > 0 && (
          <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
            <p className="text-xs font-bold uppercase tracking-wider text-rose-700">
              {r.failures.length === 1
                ? "The condition that fails"
                : "The conditions that fail"}
            </p>
            <ul className="mt-3 space-y-3">
              {r.failures.map((f) => (
                <li
                  key={f.condition}
                  className={`rounded-xl border p-3 ${
                    f.curable
                      ? "border-amber-200 bg-amber-50/50"
                      : "border-rose-100 bg-rose-50/50"
                  }`}
                >
                  <p className="text-sm font-bold text-ink-900">{f.condition}</p>
                  <p className="mt-1 text-sm text-ink-600">{f.why}</p>
                  {f.curable ? (
                    <p className="mt-1.5 text-sm text-amber-900">
                      <span className="font-semibold">How to resolve it:</span>{" "}
                      {f.curable}
                    </p>
                  ) : (
                    <p className="mt-1.5 text-xs font-semibold uppercase tracking-wide text-rose-700">
                      Not curable — an interview is required
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {r.thirdCountryWarning && (
          <div className="rounded-2xl border-2 border-rose-300 bg-rose-50/70 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-rose-700">
              Third-country application warning
            </p>
            <p className="mt-2 text-sm text-ink-700">{r.thirdCountryWarning}</p>
            <p className="mt-2 text-sm text-ink-700">
              If you hold an expired stamp and were considering a quick trip to
              Canada or Mexico, read{" "}
              <Link href="/automatic-visa-revalidation" className="underline">
                automatic visa revalidation
              </Link>{" "}
              first — applying for a visa there destroys it.
            </p>
          </div>
        )}

        {r.met.length > 0 && (
          <div className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
              Conditions you do meet
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-ink-600">
              {r.met.map((m) => (
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
      </div>
    </div>
  );
}
