"use client";

import { useState, useId, useRef, useEffect } from "react";
import Link from "next/link";
import { visitorInsuranceGlossary } from "@/data/visitorInsuranceGlossary";

/**
 * Interactive, hover/click term explainer — not a dictionary definition.
 * Shows the glossary entry's numeric example inline. Works on hover
 * (desktop) and tap (mobile/keyboard), closes on Escape or outside click.
 */
export default function TermInfoPopover({ termId, children }: { termId: string; children: React.ReactNode }) {
  const entry = visitorInsuranceGlossary.find((g) => g.id === termId);
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open]);

  if (!entry) return <>{children}</>;

  return (
    <span ref={wrapRef} className="relative inline-block" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-expanded={open}
        aria-describedby={open ? panelId : undefined}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-0.5 border-b border-dotted border-brand-400 font-semibold text-brand-700 underline-offset-2 hover:text-brand-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
      >
        {children}
        <span aria-hidden className="text-[0.65rem] text-brand-400">ⓘ</span>
      </button>
      {open && (
        <span
          id={panelId}
          role="tooltip"
          className="absolute left-1/2 top-full z-30 mt-2 w-64 -translate-x-1/2 rounded-2xl border border-ink-900/10 bg-white p-4 text-left text-xs leading-relaxed text-ink-600 shadow-card-hover"
        >
          <span className="mb-1 block text-sm font-bold text-ink-900">{entry.term}</span>
          <span className="block">{entry.definition}</span>
          {entry.example && (
            <span className="mt-2 block rounded-lg bg-slate-50 px-2.5 py-2 text-[0.7rem] text-ink-700">{entry.example}</span>
          )}
          <Link href="/visitor-insurance/glossary" className="mt-2 inline-block text-[0.7rem] font-semibold text-brand-600 underline">
            Full glossary →
          </Link>
        </span>
      )}
    </span>
  );
}
