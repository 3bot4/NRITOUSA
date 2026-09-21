import Link from "next/link";

/**
 * The standing "informational only" line required on every immigration page
 * added in the September 2026 gap build.
 *
 * The byline on this site is a Chartered Accountant, not an immigration
 * attorney, so the line is not boilerplate — it is the accurate description of
 * what the page is, and it routes anyone who needs actual representation to
 * the cost guide rather than leaving them with nowhere to go.
 */
export default function NotLegalAdvice({
  className = "",
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <p
      className={`rounded-xl border border-ink-900/10 bg-ink-900/[0.02] px-4 py-3 text-xs leading-relaxed text-ink-500 ${className}`}
    >
      <strong className="font-semibold text-ink-700">
        Informational only, not legal advice.
      </strong>{" "}
      {children ?? (
        <>
          This page explains how a government process works and what the
          published rules say. It is not legal advice, and reading it does not
          create an attorney–client relationship. For advice on your own facts,
          speak to a licensed immigration attorney —{" "}
          <Link
            href="/immigration-attorney-lawyer-cost"
            className="font-semibold text-brand-600 underline"
          >
            here is what one typically costs
          </Link>
          .
        </>
      )}
    </p>
  );
}
