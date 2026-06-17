import Link from "next/link";

/**
 * Homepage promo card for the free Immigrant Wealth Guide lead magnet.
 * Sits near the Tax & Money / wealth section. Navy/gold styling echoes the
 * guide's book cover so it reads as a premium download, not another tool.
 */
export default function LeadMagnetSpotlight() {
  return (
    <section aria-labelledby="lead-magnet-h" className="mt-10">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ink-900 via-[#101a3a] to-ink-800 p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accent-500/20 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span
              aria-hidden
              className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 text-2xl shadow-sm"
            >
              📘
            </span>
            <div>
              <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-accent-400">
                Free PDF
              </span>
              <h2
                id="lead-magnet-h"
                className="mt-1 text-lg font-bold tracking-tight text-white"
              >
                Free Immigrant Wealth Guide
              </h2>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-white/70">
                Download Deepak Middha&apos;s practical PDF guide on the money
                traps that hold immigrants back — and how to start building
                wealth in the U.S.
              </p>
            </div>
          </div>
          <Link
            href="/free-immigrant-wealth-guide"
            className="shrink-0 rounded-lg bg-white px-5 py-2.5 text-center text-sm font-semibold text-ink-900 shadow-sm transition-colors hover:bg-white/90"
          >
            Download the free guide →
          </Link>
        </div>
      </div>
    </section>
  );
}
