import Container from "@/components/Container";
import HeroSearch from "@/components/home/HeroSearch";
import GreenCardLineCard from "@/components/home/GreenCardLineCard";

/**
 * Homepage hero — two columns on desktop: the value proposition plus the site
 * search on the left, the live "Green Card Line · India" rate card on the
 * right. The rate card is the reason the old scrolling ticker is gone: the
 * numbers people came for now sit still, above the fold, on the first screen.
 */
export default function HomeHeroPanel() {
  return (
    <section className="relative overflow-hidden border-b border-ink-900/5 bg-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(720px_420px_at_12%_-10%,rgba(53,99,255,0.10),transparent_70%),radial-gradient(560px_380px_at_95%_15%,rgba(16,185,129,0.08),transparent_70%)]"
      />
      <Container className="relative py-10 sm:py-14 lg:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
          <div className="min-w-0">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-600/20 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">
              ✦ 20+ free tools · No sign-up required
            </span>

            <h1 className="text-[2.1rem] font-extrabold leading-[1.06] tracking-tight text-ink-900 sm:text-5xl">
              Every tool for your life{" "}
              <span className="text-brand-600">between India</span>{" "}
              <span className="text-emerald-600">and the USA</span>
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-500 sm:text-lg">
              Free immigration, tax, wealth, and money calculators, checklists,
              and guides — built for H-1B workers, green card applicants,
              students, and NRI families managing U.S. income and India assets.
            </p>

            <HeroSearch />
          </div>

          <GreenCardLineCard />
        </div>
      </Container>
    </section>
  );
}
