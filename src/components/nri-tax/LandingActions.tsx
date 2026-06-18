"use client";

import { useRouter } from "next/navigation";

/**
 * Landing-page CTAs. "Start Free Checkup" goes to the profile step. "View Sample
 * Report" opens a read-only sample (?sample=1) that is rendered from fixed demo
 * data and never writes to or overwrites the visitor's localStorage entries.
 */
export default function LandingActions() {
  const router = useRouter();

  return (
    <div className="mt-7">
      <div className="flex max-w-xl flex-col gap-3 sm:flex-row">
        <button
          onClick={() => router.push("/nri-wealth-checkup/profile")}
          className="rounded-xl bg-white px-6 py-3.5 text-base font-bold text-ink-900 shadow-sm transition-transform hover:-translate-y-0.5"
        >
          Start Free Checkup →
        </button>
        <button
          onClick={() => router.push("/nri-wealth-checkup/report?sample=1")}
          className="rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-base font-bold text-white backdrop-blur transition-colors hover:bg-white/20"
        >
          View Sample Report
        </button>
      </div>
      <p className="mt-2.5 text-sm text-white/75">
        View a sample report before entering your own information. The sample uses
        demo data and never touches your saved entries.
      </p>
    </div>
  );
}
