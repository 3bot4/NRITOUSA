import Link from "next/link";
import { TOOL_DISCLAIMER } from "@/lib/nri-tax/types";

/**
 * The exact required educational disclaimer, reused on the landing, profile,
 * assets, income, and report screens (and printed into the PDF via the report).
 */
export default function OrganizerDisclaimer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-ink-900/10 bg-slate-50 p-4 text-xs leading-relaxed text-ink-500 ${className}`}
    >
      <strong className="font-semibold text-ink-700">Disclaimer:</strong> {TOOL_DISCLAIMER}{" "}
      <Link href="/disclaimer" className="text-brand-600 underline">
        Full disclaimer
      </Link>
      .
    </div>
  );
}
