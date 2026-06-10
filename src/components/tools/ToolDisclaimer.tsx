import Link from "next/link";

/** Reused educational-only disclaimer block shown on every tool page. */
export default function ToolDisclaimer() {
  return (
    <div className="rounded-2xl border border-ink-900/5 bg-white p-6 text-sm text-ink-500 shadow-card">
      <strong className="font-semibold text-ink-700">Educational only.</strong>{" "}
      This tool provides general estimates from public data and is not legal,
      tax, financial, or immigration advice. Government data changes monthly
      and individual cases vary — always verify against the official source
      linked above and consult a qualified professional before acting. See our{" "}
      <Link href="/disclaimer" className="text-brand-600 underline">
        full disclaimer
      </Link>
      .
    </div>
  );
}
