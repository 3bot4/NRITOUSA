import Link from "next/link";
import Container from "@/components/Container";
import Icon from "@/components/Icon";

/**
 * Compact value-prop hero + the single primary CTA. The "Check your Green Card
 * date" button is the largest, most prominent action on the page (full-width,
 * bigger padding/font than anything below it). The tools grid renders directly
 * beneath it on the home page.
 */
export default function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-ink-900/5 bg-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_75%_-10%,rgba(53,99,255,0.08),transparent)]" />
      <Container className="relative py-7 sm:py-9">
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

        {/* Primary CTA — largest, full-width, single hero action. */}
        <Link
          href="/tools/green-card-tracker"
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-brand-600 px-8 py-5 text-lg font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg sm:text-xl"
        >
          <Icon name="calendar" className="h-6 w-6" />
          Check your Green Card date
        </Link>
      </Container>
    </section>
  );
}
