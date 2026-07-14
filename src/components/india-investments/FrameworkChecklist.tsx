"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";

/**
 * Six-step decision framework as an optional interactive checklist.
 *
 * Progressive enhancement: the step content (titles, text, links) is rendered
 * server-side and is fully readable without JavaScript. JS only adds checkbox
 * persistence to localStorage + a reset. Checking a box never asserts compliance.
 */
const STORAGE_KEY = "ii-framework-checklist-v1";

interface Step {
  id: string;
  title: string;
  body: ReactNode;
}

const STEPS: Step[] = [
  {
    id: "status",
    title: "Update residency status, bank accounts, demat, and KYC",
    body: (
      <>
        Re-designate resident accounts to NRO, open NRE/FCNR where useful, and update your broker and
        KYC. See{" "}
        <Link href="/articles/convert-resident-account-to-nre-nro" className="font-semibold text-brand-700 underline underline-offset-2">
          converting your Indian bank accounts
        </Link>{" "}
        and{" "}
        <Link href="/articles/nre-nro-accounts-explained" className="font-semibold text-brand-700 underline underline-offset-2">
          NRE vs NRO
        </Link>
        .
      </>
    ),
  },
  {
    id: "inventory",
    title: "Inventory every India asset",
    body: (
      <>
        List each holding with amounts, purchase dates, and account types, converted to US dollars. The{" "}
        <Link href="/nri-wealth-checkup" className="font-semibold text-brand-700 underline underline-offset-2">
          NRI Wealth &amp; Tax Organizer
        </Link>{" "}
        gives you one place to do this.
      </>
    ),
  },
  {
    id: "exposure",
    title: "Identify PFIC, FBAR, and FATCA exposure",
    body: (
      <>
        Flag PFICs (Indian mutual funds, most pooled products) and check your reporting with the{" "}
        <Link href="/tools/fbar-fatca-checker" className="font-semibold text-brand-700 underline underline-offset-2">
          FBAR / FATCA checker
        </Link>{" "}
        and the{" "}
        <Link href="/articles/pfic-indian-mutual-funds-trap" className="font-semibold text-brand-700 underline underline-offset-2">
          PFIC guide
        </Link>
        .
      </>
    ),
  },
  {
    id: "model",
    title: "Model the after-tax and after-currency result",
    body: (
      <>
        Estimate the India tax, the US tax after a foreign tax credit, and the USD/INR effect over your
        horizon. The{" "}
        <Link href="/calculators/dtaa-foreign-tax-credit" className="font-semibold text-brand-700 underline underline-offset-2">
          DTAA / foreign tax credit
        </Link>{" "}
        and{" "}
        <Link href="/calculators/fcnr-vs-hysa" className="font-semibold text-brand-700 underline underline-offset-2">
          FCNR vs US savings
        </Link>{" "}
        calculators help.
      </>
    ),
  },
  {
    id: "return",
    title: "Consider return-to-India and RNOR plans",
    body: (
      <>
        If you may move back, map the{" "}
        <Link href="/calculators/rnor-tax-residency" className="font-semibold text-brand-700 underline underline-offset-2">
          RNOR window
        </Link>{" "}
        and work through the{" "}
        <Link href="/return-to-india-checklist" className="font-semibold text-brand-700 underline underline-offset-2">
          return-to-India checklist
        </Link>{" "}
        before acting.
      </>
    ),
  },
  {
    id: "sequence",
    title: "Sequence changes and obtain cross-border advice where needed",
    body: (
      <>
        Time sales across tax years and residency changes, keep documentation, and use the{" "}
        <Link href="/india-tax-compliance" className="font-semibold text-brand-700 underline underline-offset-2">
          India Tax Compliance Hub
        </Link>{" "}
        — and a qualified cross-border professional for anything large or uncertain.
      </>
    ),
  },
];

export default function FrameworkChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  // Load persisted state after mount (avoids SSR/client hydration mismatch).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setChecked(JSON.parse(raw) as Record<string, boolean>);
    } catch {
      /* ignore malformed/unavailable storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
    } catch {
      /* storage may be unavailable (private mode) — non-fatal */
    }
  }, [checked, hydrated]);

  const toggle = (id: string) => setChecked((p) => ({ ...p, [id]: !p[id] }));
  const reset = () => setChecked({});
  const doneCount = STEPS.filter((s) => checked[s.id]).length;

  return (
    <div className="mt-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-ink-600">
          <span className="tabular-nums">{hydrated ? doneCount : 0}</span> of {STEPS.length} steps marked done
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-9 items-center rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-ink-600 transition hover:bg-ink-50 print:hidden"
        >
          Reset checklist
        </button>
      </div>

      <ol className="mt-3 space-y-2.5">
        {STEPS.map((s, i) => {
          const isDone = Boolean(checked[s.id]);
          return (
            <li
              key={s.id}
              className={`rounded-2xl border p-4 shadow-card transition ${
                isDone ? "border-emerald-300 bg-emerald-50/40" : "border-ink-900/10 bg-white"
              }`}
            >
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={() => toggle(s.id)}
                  className="mt-1 h-5 w-5 flex-none accent-emerald-600"
                />
                <span className="min-w-0">
                  <span className="flex items-baseline gap-2">
                    <span className="text-xs font-bold text-ink-400" aria-hidden>
                      Step {i + 1}
                    </span>
                    <span className={`text-sm font-bold ${isDone ? "text-emerald-800" : "text-ink-900"}`}>
                      {s.title}
                    </span>
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-ink-600">{s.body}</span>
                </span>
              </label>
            </li>
          );
        })}
      </ol>

      <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
        <strong>Checking these boxes does not determine your compliance</strong> or replace professional
        review. It is a personal progress tracker saved only in your browser.
      </p>
    </div>
  );
}
