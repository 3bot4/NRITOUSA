import Link from "next/link";
import Container from "@/components/Container";
import Icon from "@/components/Icon";

/**
 * Compact, single-line value-prop hero. Replaces the old full-height Hero so the
 * primary CTA ("Check your Green Card date") sits above the fold on desktop and
 * mobile, with the data-dense main/sidebar grid visible right below.
 */
export default function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-ink-900/5 bg-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_75%_-10%,rgba(53,99,255,0.08),transparent)]" />
      <Container className="relative py-7 sm:py-9">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-3xl">
              Data-driven money &amp; immigration tools for{" "}
              <span className="bg-gradient-to-r from-brand-600 to-emerald-500 bg-clip-text text-transparent">
                Indians in the USA
              </span>
            </h1>
            <p className="mt-2 text-sm text-ink-500 sm:text-base">
              Live USD/INR, markets, and Visa Bulletin movement — plus free tools
              to estimate your green-card wait and true cost of sending money home.
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
            <Link
              href="/tools/green-card-tracker"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-md"
            >
              <Icon name="calendar" className="h-5 w-5" />
              Check your Green Card date
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center justify-center rounded-xl border border-ink-900/10 bg-white px-6 py-3 font-semibold text-ink-700 transition-colors hover:bg-ink-900/[0.03]"
            >
              Browse all tools
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
