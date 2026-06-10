import Link from "next/link";

/**
 * Prominent tool-specific disclaimer. Unlike ToolDisclaimer (the generic
 * footer block), this takes custom copy so each tool can state exactly what
 * it does and doesn't do, and is styled to be noticed without alarming.
 */
export default function DisclaimerBox({
  title = "Important",
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-amber-900 ${className}`}
    >
      <strong className="font-semibold">{title}:</strong> {children}{" "}
      <Link href="/disclaimer" className="font-medium underline">
        Full disclaimer
      </Link>
      .
    </div>
  );
}
