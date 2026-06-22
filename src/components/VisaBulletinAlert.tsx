import { bulletinAlert } from "@/lib/visa-bulletin";

/**
 * Standing visa-bulletin alert box. Reused across the visa bulletin hub,
 * category guides, retrogression page, priority date checker, green card
 * tracker, and the USCIS hub so the current-month headline is consistent
 * everywhere. The wording lives in one place — `bulletinAlert` in
 * src/lib/visa-bulletin.ts — and updates automatically each bulletin.
 */
export default function VisaBulletinAlert({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      role="note"
      className={`rounded-2xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5 ${className}`}
    >
      <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
        Visa Bulletin alert
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-amber-900">
        {bulletinAlert}
      </p>
    </div>
  );
}
