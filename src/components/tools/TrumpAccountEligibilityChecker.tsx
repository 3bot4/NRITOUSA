"use client";

import { useState } from "react";
import { trumpAccountConfig as CFG, trumpAccountSources as SRC } from "@/data/trumpAccountData";

/* ------------------------------------------------------------------ *
 * Inputs
 * ------------------------------------------------------------------ */
type ParentStatus = "h1b" | "l1" | "h4" | "green-card" | "us-citizen" | "f1-opt" | "other" | "";
type BirthCountry = "usa" | "india" | "other" | "";
type YesNoNS = "yes" | "no" | "not-sure" | "";
type ContribIntent = "1000-only" | "under-5000" | "max-5000" | "not-sure" | "";

interface Inputs {
  parentStatus: ParentStatus;
  childBirthCountry: BirthCountry;
  childBirthDate: string; // yyyy-mm (month input) or empty
  childHasSSN: YesNoNS;
  childIsUSCitizen: YesNoNS;
  childUnder18: YesNoNS;
  parentAuthorized: YesNoNS;
  movingBackToIndia: YesNoNS;
  yearlyContributionIntent: ContribIntent;
}

const EMPTY: Inputs = {
  parentStatus: "",
  childBirthCountry: "",
  childBirthDate: "",
  childHasSSN: "",
  childIsUSCitizen: "",
  childUnder18: "",
  parentAuthorized: "",
  movingBackToIndia: "",
  yearlyContributionIntent: "",
};

/* ------------------------------------------------------------------ *
 * Result model
 * ------------------------------------------------------------------ */
type Verdict =
  | "eligible-1000" // account + $1,000 pilot
  | "eligible-account" // account yes, $1,000 no
  | "not-eligible"
  | "needs-review";

interface Result {
  verdict: Verdict;
  headline: string;
  summary: string;
  accountStatus: "likely" | "unlikely" | "review";
  pilotStatus: "likely" | "unlikely" | "review";
  documents: string[];
  taxNotes: string[];
  indiaNotes: string[];
  nextPage: { label: string; href: string };
}

/** Parse a yyyy-mm month string and return {under18, inWindow} against a
 * fixed reference date. We use the birth month; the 2025–2028 window only
 * needs the year, and under-18 is approximated from the month. */
function analyzeBirthDate(raw: string): { known: boolean; under18: boolean | null; inWindow: boolean | null } {
  if (!raw) return { known: false, under18: null, inWindow: null };
  const m = /^(\d{4})-(\d{2})$/.exec(raw);
  if (!m) return { known: false, under18: null, inWindow: null };
  const year = Number(m[1]);
  const month = Number(m[2]);
  const now = new Date();
  const ageYears = now.getFullYear() - year - (now.getMonth() + 1 < month ? 1 : 0);
  const under18 = ageYears < 18;
  const inWindow = year >= 2025 && year <= 2028;
  return { known: true, under18, inWindow };
}

function compute(inp: Inputs): Result {
  const bd = analyzeBirthDate(inp.childBirthDate);

  // Resolve "under 18": prefer the birth date, fall back to the explicit select.
  const under18: boolean | null =
    bd.known && bd.under18 !== null
      ? bd.under18
      : inp.childUnder18 === "yes"
      ? true
      : inp.childUnder18 === "no"
      ? false
      : null;

  // Resolve U.S. citizenship: a U.S.-born child is a citizen; otherwise use the select.
  const isCitizen: boolean | null =
    inp.childBirthCountry === "usa"
      ? true
      : inp.childIsUSCitizen === "yes"
      ? true
      : inp.childIsUSCitizen === "no"
      ? false
      : null;

  const hasSSN: boolean | null =
    inp.childHasSSN === "yes" ? true : inp.childHasSSN === "no" ? false : null;

  const authorized: boolean | null =
    inp.parentAuthorized === "yes" ? true : inp.parentAuthorized === "no" ? false : null;

  const bornInWindow: boolean | null = bd.known ? bd.inWindow : null;

  /* ---------- Account eligibility (child under 18 + valid SSN + authorized) ---------- */
  let accountStatus: Result["accountStatus"] = "review";
  if (under18 === false) accountStatus = "unlikely";
  else if (hasSSN === false) accountStatus = "unlikely";
  else if (authorized === false) accountStatus = "review";
  else if (under18 === true && hasSSN === true) accountStatus = "likely";
  else accountStatus = "review";

  /* ---------- $1,000 pilot (born 2025–2028 + US citizen + valid SSN) ---------- */
  let pilotStatus: Result["pilotStatus"] = "review";
  if (isCitizen === false || hasSSN === false || bornInWindow === false || under18 === false) {
    pilotStatus = "unlikely";
  } else if (isCitizen === true && hasSSN === true && bornInWindow === true) {
    pilotStatus = "likely";
  } else {
    pilotStatus = "review";
  }

  /* ---------- Verdict ---------- */
  let verdict: Verdict;
  if (accountStatus === "unlikely") verdict = "not-eligible";
  else if (pilotStatus === "likely" && accountStatus === "likely") verdict = "eligible-1000";
  else if (accountStatus === "likely" && pilotStatus === "unlikely") verdict = "eligible-account";
  else verdict = "needs-review";

  const headline = {
    "eligible-1000": "Likely eligible for a Trump Account and the $1,000 federal contribution",
    "eligible-account": "Likely eligible for a Trump Account (but not the $1,000 pilot contribution)",
    "not-eligible": "Likely not eligible right now",
    "needs-review": "Needs review — a few answers are unclear",
  }[verdict];

  const summaryBits: string[] = [];
  if (verdict === "eligible-1000") {
    summaryBits.push(
      `Based on your answers, your child appears to meet the core rules: under 18 with a valid SSN, a U.S. citizen, and born in the ${CFG.bornWindowLabel} window. As the responsible party you can open the account and request the ${CFG.federalContribution} contribution using ${CFG.form}.`,
    );
  } else if (verdict === "eligible-account") {
    summaryBits.push(
      `Your child appears eligible for the account itself (under 18 with a valid SSN), but not the ${CFG.federalContribution} pilot contribution — that piece requires a U.S.-citizen child born in ${CFG.bornWindowLabel}.`,
    );
  } else if (verdict === "not-eligible") {
    if (under18 === false) summaryBits.push("Trump Accounts are for children under 18, so this child appears too old to open one now.");
    if (hasSSN === false) summaryBits.push("The account generally requires the child to have a valid Social Security number — an ITIN does not qualify.");
  } else {
    summaryBits.push("Some answers were left as “not sure,” so this is a provisional read. Confirm the child's SSN and citizenship status, then re-check.");
  }

  /* ---------- Documents needed ---------- */
  const documents: string[] = [];
  documents.push("Child's valid Social Security number (SSN card)");
  documents.push("Child's birth certificate (proves date of birth and, if U.S.-born, citizenship)");
  documents.push(`Responsible party's identification and taxpayer details for ${CFG.form}`);
  if (isCitizen === true || inp.childBirthCountry === "usa") {
    documents.push("Proof of the child's U.S. citizenship (U.S. birth certificate or U.S. passport) for the $1,000 request");
  }
  if (inp.childBirthCountry === "india" || inp.childBirthCountry === "other") {
    documents.push("If born abroad: the child's SSN issuance confirmation, and citizenship documents if a U.S. citizen (e.g., CRBA / U.S. passport)");
  }
  if (inp.childHasSSN === "not-sure") {
    documents.push("Confirmation the SSN has actually been issued (not just applied for)");
  }

  /* ---------- Tax notes ---------- */
  const taxNotes: string[] = [];
  taxNotes.push("Trump Accounts are designed for tax-deferred growth — earnings aren't taxed year by year while they stay in the account. Confirm current IRS distribution rules.");
  if (inp.yearlyContributionIntent === "max-5000" || inp.yearlyContributionIntent === "under-5000") {
    taxNotes.push(`Family contributions can be up to ${CFG.annualLimit} per child per year (subject to current rules). Contributions within the annual limit generally fit the gift-tax safe-harbor concept.`);
  }
  if (inp.yearlyContributionIntent === "1000-only") {
    taxNotes.push(`If you only want the ${CFG.federalContribution} federal contribution, you can request it on ${CFG.form} without committing to ongoing deposits.`);
  }
  if (isCitizen === true || inp.childBirthCountry === "usa") {
    taxNotes.push("A U.S.-citizen child has U.S. tax obligations for life, regardless of where they live later — factor this into long-term planning.");
  }

  /* ---------- India move-back notes ---------- */
  const indiaNotes: string[] = [];
  if (inp.movingBackToIndia === "yes" || inp.movingBackToIndia === "not-sure") {
    indiaNotes.push("The account can generally remain in the child's name after you return to India — but plan access before you leave.");
    indiaNotes.push("Confirm the provider allows a foreign (Indian) address, and set up U.S. bank/app access plus 2-factor methods that work from India.");
    indiaNotes.push("A U.S.-citizen child keeps U.S. filing duties; once you're Indian tax residents, India may also tax the account's income (watch for PFIC-style issues on U.S. ETFs).");
    if (inp.movingBackToIndia === "not-sure") {
      indiaNotes.push("Since a move is uncertain, keep documentation complete and favor flexibility now.");
    }
  }

  /* ---------- Recommended next page ---------- */
  let nextPage: Result["nextPage"];
  if (verdict === "eligible-1000") {
    nextPage = { label: "How to apply using IRS Form 4547", href: "/how-to-apply-for-trump-account-form-4547" };
  } else if (verdict === "not-eligible" && hasSSN === false) {
    nextPage = { label: "SSN vs ITIN rules: can a child without an SSN qualify?", href: "/trump-account-ssn-itin-child" };
  } else if (pilotStatus === "unlikely" || pilotStatus === "review") {
    nextPage = { label: "Trump Account $1,000 eligibility explained", href: "/trump-account-1000-eligibility" };
  } else if (inp.movingBackToIndia === "yes") {
    nextPage = { label: "What happens if you move back to India", href: "/trump-account-moving-back-to-india" };
  } else {
    nextPage = { label: "Can H-1B parents open a Trump Account for their child?", href: "/can-h1b-parents-open-trump-account-for-child" };
  }

  return {
    verdict,
    headline,
    summary: summaryBits.join(" "),
    accountStatus,
    pilotStatus,
    documents,
    taxNotes,
    indiaNotes,
    nextPage,
  };
}

/* ------------------------------------------------------------------ *
 * UI
 * ------------------------------------------------------------------ */
const selectCls =
  "w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-ink-800">{label}</span>
      {hint && <span className="mt-0.5 block text-[0.6875rem] text-ink-400">{hint}</span>}
      <div className="mt-1">{children}</div>
    </label>
  );
}

const YesNoNSOptions = (
  <>
    <option value="">Select…</option>
    <option value="yes">Yes</option>
    <option value="no">No</option>
    <option value="not-sure">Not sure</option>
  </>
);

const statusChip = (s: "likely" | "unlikely" | "review") =>
  s === "likely"
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : s === "unlikely"
    ? "border-rose-200 bg-rose-50 text-rose-700"
    : "border-amber-200 bg-amber-50 text-amber-800";

const statusLabel = (s: "likely" | "unlikely" | "review") =>
  s === "likely" ? "Likely" : s === "unlikely" ? "Unlikely" : "Needs review";

const verdictBanner: Record<Verdict, string> = {
  "eligible-1000": "border-emerald-200 bg-emerald-50/60",
  "eligible-account": "border-brand-200 bg-brand-50/60",
  "not-eligible": "border-rose-200 bg-rose-50/60",
  "needs-review": "border-amber-200 bg-amber-50/60",
};

export default function TrumpAccountEligibilityChecker({ id = "eligibility-checker" }: { id?: string }) {
  const [inp, setInp] = useState<Inputs>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const set = <K extends keyof Inputs>(k: K, v: Inputs[K]) => setInp((p) => ({ ...p, [k]: v }));
  const result = submitted ? compute(inp) : null;

  return (
    <div id={id} className="scroll-mt-24 rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50/50 to-white p-5 shadow-sm sm:p-8">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Trump Account eligibility checker</p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">Can your family open a Trump Account?</h2>
        <p className="mt-1 text-sm text-ink-500">
          Answer a few questions about the child. This is an educational estimate — it does not decide your case. Verify with the official IRS guidance before you apply.
        </p>
      </div>

      <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
        <strong className="font-bold">Not legal or tax advice.</strong>{" "}
        Rules are new and can change. Confirm everything on the official Trump
        Accounts and IRS pages — links are in your result and in the sources
        section below.
      </div>

      {!submitted ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Parent / guardian status">
              <select className={selectCls} value={inp.parentStatus} onChange={(e) => set("parentStatus", e.target.value as ParentStatus)} aria-label="Parent status">
                <option value="">Select…</option>
                <option value="h1b">H-1B</option>
                <option value="l1">L-1</option>
                <option value="h4">H-4</option>
                <option value="green-card">Green card holder</option>
                <option value="us-citizen">U.S. citizen</option>
                <option value="f1-opt">F-1 / OPT</option>
                <option value="other">Other</option>
              </select>
            </Field>
            <Field label="Where was the child born?">
              <select className={selectCls} value={inp.childBirthCountry} onChange={(e) => set("childBirthCountry", e.target.value as BirthCountry)} aria-label="Child birth country">
                <option value="">Select…</option>
                <option value="usa">United States</option>
                <option value="india">India</option>
                <option value="other">Another country</option>
              </select>
            </Field>
            <Field label="Child's birth month" hint="Used for the age and 2025–2028 checks.">
              <input type="month" className={selectCls} value={inp.childBirthDate} onChange={(e) => set("childBirthDate", e.target.value)} aria-label="Child birth month" />
            </Field>
            <Field label="Is the child under 18?" hint="Skip if you entered a birth month.">
              <select className={selectCls} value={inp.childUnder18} onChange={(e) => set("childUnder18", e.target.value as YesNoNS)} aria-label="Child under 18">
                {YesNoNSOptions}
              </select>
            </Field>
            <Field label="Does the child have a valid SSN?" hint="An ITIN does not count.">
              <select className={selectCls} value={inp.childHasSSN} onChange={(e) => set("childHasSSN", e.target.value as YesNoNS)} aria-label="Child has SSN">
                {YesNoNSOptions}
              </select>
            </Field>
            <Field label="Is the child a U.S. citizen?" hint="U.S.-born children are citizens.">
              <select className={selectCls} value={inp.childIsUSCitizen} onChange={(e) => set("childIsUSCitizen", e.target.value as YesNoNS)} aria-label="Child is US citizen">
                {YesNoNSOptions}
              </select>
            </Field>
            <Field label="Are you the parent / guardian / authorized party?">
              <select className={selectCls} value={inp.parentAuthorized} onChange={(e) => set("parentAuthorized", e.target.value as YesNoNS)} aria-label="Parent authorized">
                {YesNoNSOptions}
              </select>
            </Field>
            <Field label="Might you move back to India?">
              <select className={selectCls} value={inp.movingBackToIndia} onChange={(e) => set("movingBackToIndia", e.target.value as YesNoNS)} aria-label="Moving back to India">
                {YesNoNSOptions}
              </select>
            </Field>
            <Field label="How much do you plan to contribute yearly?">
              <select className={selectCls} value={inp.yearlyContributionIntent} onChange={(e) => set("yearlyContributionIntent", e.target.value as ContribIntent)} aria-label="Yearly contribution intent">
                <option value="">Select…</option>
                <option value="1000-only">Just the $1,000 federal contribution</option>
                <option value="under-5000">Something under $5,000/year</option>
                <option value="max-5000">Up to the $5,000/year maximum</option>
                <option value="not-sure">Not sure yet</option>
              </select>
            </Field>
          </div>
          <button type="submit" className="w-full rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-700">
            Check eligibility
          </button>
        </form>
      ) : result ? (
        <div className="space-y-5">
          <div className={`rounded-2xl border p-5 ${verdictBanner[result.verdict]}`}>
            <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Your result</p>
            <p className="mt-1 text-lg font-extrabold text-ink-900">{result.headline}</p>
            {result.summary && <p className="mt-2 text-sm leading-relaxed text-ink-700">{result.summary}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[0.6875rem] font-bold ${statusChip(result.accountStatus)}`}>
                Account: {statusLabel(result.accountStatus)}
              </span>
              <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[0.6875rem] font-bold ${statusChip(result.pilotStatus)}`}>
                $1,000 pilot: {statusLabel(result.pilotStatus)}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-ink-900/10 bg-white p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-500">Documents you'll likely need</p>
            <ul className="space-y-2">
              {result.documents.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                  <span className="mt-0.5 flex-none text-brand-500">□</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-blue-700">Tax notes</p>
            <ul className="space-y-2">
              {result.taxNotes.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                  <span className="mt-0.5 flex-none text-blue-500">→</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {result.indiaNotes.length > 0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-amber-800">If you move back to India</p>
              <ul className="space-y-2">
                {result.indiaNotes.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-800">
                    <span className="mt-0.5 flex-none text-amber-600">→</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-brand-700">Recommended next step</p>
            <a href={result.nextPage.href} className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">
              {result.nextPage.label} →
            </a>
          </div>

          <div className="flex flex-wrap gap-2">
            <a href={SRC.trumpAccountsGov} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-brand-600 transition hover:border-brand-300">
              TrumpAccounts.gov ↗
            </a>
            <a href={SRC.irsForms} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-brand-600 transition hover:border-brand-300">
              IRS Form 4547 ↗
            </a>
          </div>

          <p className="text-center text-xs leading-relaxed text-ink-400">Educational estimate only — not tax, legal, or immigration advice.</p>
          <button onClick={() => setSubmitted(false)} className="w-full rounded-xl border border-ink-900/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-50">
            ← Edit my answers
          </button>
        </div>
      ) : null}
    </div>
  );
}
