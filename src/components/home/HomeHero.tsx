import Container from "@/components/Container";

/**
 * Compact, centered value-prop hero. Intentionally CTA-free — the global
 * "Search NRI to USA" box sits directly beneath it as the primary entry point,
 * so the homepage reads as a clean gateway that leads straight into search.
 */
export default function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-ink-900/5 bg-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_75%_-10%,rgba(53,99,255,0.08),transparent)]" />
      <Container className="relative py-3.5 sm:py-4">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-3xl">
            Free immigration, wealth, tax, and money tools for{" "}
            <span className="bg-gradient-to-r from-brand-600 to-emerald-500 bg-clip-text text-transparent">
              Indians in the USA
            </span>
          </h1>
          <p className="mt-2 text-sm text-ink-500 sm:text-base">
            Free calculators, checklists, and guides for Indian families
            managing U.S. income, India assets, taxes, retirement, property,
            inheritance, and return-to-India decisions.
          </p>
          {/* Not "Data updated daily": most tools here run on annual or monthly
              figures (IRS limits, DOL wage data, visa bulletin), so a blanket
              daily-refresh claim was false. Every calculator and tool renders
              its own last-checked date, which is the accurate version. */}
          <p className="mt-1.5 text-[13px] text-ink-400">
            20+ free tools · 50+ guides · Official sources shown · Every tool
            displays its last-checked date
          </p>
          <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed text-ink-400">
            Built for Indian immigrants, NRIs, H-1B workers, green card
            applicants, students, and families navigating life between India and
            the USA.
          </p>
        </div>
      </Container>
    </section>
  );
}
