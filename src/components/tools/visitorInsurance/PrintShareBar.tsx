"use client";

import { useState } from "react";
import Link from "next/link";
import { trackToolShareClick } from "@/lib/analytics";

/** Print / copy / reset / compare-another-plan bar shown under a calculator result. */
export default function PrintShareBar({
  toolSlug,
  summaryText,
  onReset,
  comparePlanHref,
}: {
  toolSlug: string;
  summaryText: string;
  onReset?: () => void;
  comparePlanHref?: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2 print:hidden">
      <button
        type="button"
        onClick={() => {
          trackToolShareClick({ tool_slug: toolSlug, channel: "print" });
          window.print();
        }}
        className="inline-flex items-center gap-1.5 rounded-lg border border-ink-900/15 bg-white px-3.5 py-2 text-xs font-bold text-ink-700 transition hover:bg-ink-50"
      >
        Print result
      </button>
      <button
        type="button"
        onClick={async () => {
          trackToolShareClick({ tool_slug: toolSlug, channel: "copy" });
          try {
            await navigator.clipboard.writeText(summaryText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {
            // Clipboard API unavailable — no-op, the print/summary text is still visible on screen.
          }
        }}
        className="inline-flex items-center gap-1.5 rounded-lg border border-ink-900/15 bg-white px-3.5 py-2 text-xs font-bold text-ink-700 transition hover:bg-ink-50"
      >
        {copied ? "Copied" : "Copy summary"}
      </button>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-ink-900/15 bg-white px-3.5 py-2 text-xs font-bold text-ink-700 transition hover:bg-ink-50"
        >
          Reset
        </button>
      )}
      {comparePlanHref && (
        <Link
          href={comparePlanHref}
          onClick={() => trackToolShareClick({ tool_slug: toolSlug, channel: "compare_another_plan" })}
          className="inline-flex items-center gap-1.5 rounded-lg border border-brand-200 bg-brand-50 px-3.5 py-2 text-xs font-bold text-brand-700 transition hover:bg-brand-100"
        >
          Compare another plan
        </Link>
      )}
      <p className="w-full text-[0.6875rem] text-ink-400 sm:w-auto">
        Your entries are stored only in this browser (nothing is sent to a server).
      </p>
    </div>
  );
}
