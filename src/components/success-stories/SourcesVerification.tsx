import Link from "next/link";
import type { SourceEntry } from "@/lib/successStories";
import { renderInline } from "./prose";

/**
 * "Sources & verification" panel shown near the bottom of every story. Makes the
 * sourcing and review method visible. We never claim independent verification of
 * self-reported facts — the wording distinguishes what was reviewed against
 * available sources from what was provided by the subject.
 */
export default function SourcesVerification({
  sources,
  verificationNote,
  correctionsHref = "/success-stories/editorial-methodology",
}: {
  sources: SourceEntry[];
  verificationNote: string;
  correctionsHref?: string;
}) {
  return (
    <section
      aria-labelledby="sources-heading"
      className="rounded-2xl border border-ink-900/10 bg-white p-6 shadow-card sm:p-7"
    >
      <h2
        id="sources-heading"
        className="text-lg font-bold tracking-tight text-ink-900"
      >
        Sources &amp; verification
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-500">
        {renderInline(verificationNote, "verif")}
      </p>
      <ul className="mt-4 space-y-3">
        {sources.map((s) => (
          <li key={s.label} className="flex items-start gap-3">
            <span
              aria-hidden
              className="mt-1 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700"
            >
              ✓
            </span>
            <span className="text-sm leading-relaxed text-ink-700">
              {s.href ? (
                <Link
                  href={s.href}
                  className="font-semibold text-brand-600 hover:text-brand-700"
                >
                  {s.label}
                </Link>
              ) : (
                <span className="font-semibold text-ink-900">{s.label}</span>
              )}
              {s.detail ? <span className="text-ink-500"> — {s.detail}</span> : null}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-5 border-t border-ink-900/5 pt-4 text-sm text-ink-500">
        Spotted something that needs correcting?{" "}
        <Link
          href={correctionsHref}
          className="font-semibold text-brand-600 underline"
        >
          See our corrections &amp; editorial policy
        </Link>
        .
      </p>
    </section>
  );
}
