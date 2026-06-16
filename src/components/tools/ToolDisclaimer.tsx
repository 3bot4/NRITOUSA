import Link from "next/link";

/** Reused educational-only disclaimer block shown on every tool page. */
export default function ToolDisclaimer() {
  return (
    <div className="rounded-2xl border border-ink-900/5 bg-white p-6 text-sm text-ink-500 shadow-card">
      <strong className="font-semibold text-ink-700">Educational only — not legal advice.</strong>{" "}
      NRItoUSA is not USCIS, not a law firm, and does not provide legal, immigration, tax, or
      financial advice. Immigration outcomes depend on your exact facts, case history, and current
      law. Always verify against official USCIS and U.S. Department of State sources, and consult
      your employer&apos;s immigration attorney or a licensed immigration lawyer before acting. See our{" "}
      <Link href="/disclaimer" className="text-brand-600 underline">
        full disclaimer
      </Link>
      .
    </div>
  );
}
