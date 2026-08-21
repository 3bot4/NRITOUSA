import Link from "next/link";
import Container from "@/components/Container";

/**
 * Closing CTA band. Folds the two homepage conversion paths that used to be
 * separate blocks — the NRI Wealth Checkup and the free Immigrant Wealth Guide
 * PDF — into one dark panel so the page ends on a single decision.
 */
export default function WealthCtaBand() {
  return (
    <section aria-labelledby="wealth-cta-h" className="py-14 sm:py-16">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0D2138] via-[#123B63] to-[#0F4A43] p-8 shadow-card-hover sm:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(94,175,255,0.22),transparent_68%)]"
          />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <span className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-[#7FB4FF]">
                NRI Wealth Checkup
              </span>
              <h2
                id="wealth-cta-h"
                className="mt-3 text-2xl font-extrabold tracking-tight text-[#EAF2FA] sm:text-3xl"
              >
                Is your money working in both countries?
              </h2>
              <p className="mt-3 max-w-xl leading-relaxed text-[#B9CCDF]">
                A free, guided checkup across your U.S. accounts, India assets,
                taxes, insurance, and estate planning — see the gaps in about
                ten minutes. No sign-up, no sales call.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="/nri-wealth-checkup"
                className="rounded-xl bg-white px-6 py-3.5 text-center font-semibold text-[#0D2138] transition-transform hover:-translate-y-0.5"
              >
                Start your free checkup
              </Link>
              <Link
                href="/free-immigrant-wealth-guide"
                className="rounded-xl border border-white/30 px-6 py-3.5 text-center font-semibold text-[#EAF2FA] transition-colors hover:bg-white/10"
              >
                Get the free wealth guide (PDF)
              </Link>
              <span className="text-center font-mono text-[11px] text-[#8FA9C2]">
                No sign-up · No spam · Takes ~10 min
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
