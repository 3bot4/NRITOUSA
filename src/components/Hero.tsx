import Link from "next/link";
import Container from "./Container";
import GreenCardEstimator from "@/components/tools/GreenCardEstimator";
import { topics } from "@/lib/topics";
import { articles } from "@/lib/articles";

// Real, data-driven counts — rounded down to a "+" figure so the stat is
// always true as guides are added. No invented "readers" number.
const guideCount = `${Math.floor(articles.length / 10) * 10}+`;

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Soft background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_70%_-5%,rgba(53,99,255,0.10),transparent)]" />
      <div className="pointer-events-none absolute -top-32 -left-20 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />

      <Container className="relative py-16 sm:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: copy */}
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              For NRIs, students, H1B & green card holders
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-ink-900 sm:text-5xl">
              The Complete USA Guide for{" "}
              <span className="bg-gradient-to-r from-brand-600 to-emerald-500 bg-clip-text text-transparent">
                NRIs and Immigrants
              </span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-ink-500">
              Practical guides on money, housing, cars, taxes, investing,
              retirement, India-USA transfers, and real immigrant experiences —
              all in one place.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/tools/green-card-tracker"
                className="rounded-xl bg-brand-600 px-7 py-3.5 text-center font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-md"
              >
                Check your Green Card date
              </Link>
              <Link
                href="/tools"
                className="rounded-xl border border-ink-900/10 bg-white px-7 py-3.5 text-center font-semibold text-ink-700 transition-colors hover:bg-ink-900/[0.03]"
              >
                Browse all tools
              </Link>
            </div>
            <p className="mt-4 text-sm text-ink-400">
              Just want to read?{" "}
              <Link href="/topics" className="font-semibold text-brand-600 hover:text-brand-700">
                Read the guides →
              </Link>
            </p>

            {/* Trust badges */}
            <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-ink-500">
              {[
                "Free",
                "No login",
                "Runs in your browser",
                "Updated monthly",
                "Built for Indians in the USA",
              ].map((badge, i) => (
                <li key={badge} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden className="text-ink-300">·</span>}
                  <span className="flex items-center gap-1.5">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {badge}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-10 grid max-w-md grid-cols-2 gap-6">
              {[
                { value: String(topics.length), label: "Topic areas" },
                { value: guideCount, label: "In-depth guides" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
                    {stat.value}
                  </dt>
                  <dd className="mt-1 text-sm text-ink-400">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right: interactive green card wait estimator */}
          <div className="relative">
            {/* Floating accent cards */}
            <div className="pointer-events-none absolute -right-3 -top-5 hidden rotate-3 rounded-2xl border border-ink-900/5 bg-white px-4 py-3 shadow-card sm:block">
              <p className="text-xs font-semibold text-emerald-600">
                ✓ Live visa bulletin data
              </p>
            </div>
            <div className="pointer-events-none absolute -bottom-5 -left-4 hidden -rotate-2 rounded-2xl border border-ink-900/5 bg-white px-4 py-3 shadow-card sm:block">
              <p className="text-xs font-semibold text-brand-600">
                ★ Free tools for NRIs
              </p>
            </div>

            <GreenCardEstimator variant="mini" />
          </div>
        </div>
      </Container>
    </section>
  );
}
