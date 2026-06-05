import Link from "next/link";
import Container from "./Container";

const dashboardItems = [
  { icon: "🏦", title: "Banking & Credit", meta: "Start in week 1" },
  { icon: "🏠", title: "Rent vs Buy", meta: "Decide smart" },
  { icon: "📈", title: "401k & Roth IRA", meta: "Free employer match" },
  { icon: "🚗", title: "Cars & Insurance", meta: "Loan + coverage" },
  { icon: "🔁", title: "India-USA Money", meta: "NRE / NRO transfers" },
];

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
                href="/topics"
                className="rounded-xl bg-brand-600 px-7 py-3.5 text-center font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-md"
              >
                Start Reading
              </Link>
              <Link
                href="#topics"
                className="rounded-xl border border-ink-900/10 bg-white px-7 py-3.5 text-center font-semibold text-ink-700 transition-colors hover:bg-ink-900/[0.03]"
              >
                Explore Topics
              </Link>
            </div>

            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6">
              {[
                { value: "11", label: "Topic areas" },
                { value: "50+", label: "In-depth guides" },
                { value: "12k+", label: "Readers" },
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

          {/* Right: dashboard card */}
          <div className="relative">
            {/* Floating accent cards */}
            <div className="pointer-events-none absolute -right-3 -top-5 hidden rotate-3 rounded-2xl border border-ink-900/5 bg-white px-4 py-3 shadow-card sm:block">
              <p className="text-xs font-semibold text-emerald-600">
                ✓ Tax-smart transfers
              </p>
            </div>
            <div className="pointer-events-none absolute -bottom-5 -left-4 hidden -rotate-2 rounded-2xl border border-ink-900/5 bg-white px-4 py-3 shadow-card sm:block">
              <p className="text-xs font-semibold text-brand-600">
                ★ 750+ credit score
              </p>
            </div>

            <div className="relative rounded-3xl border border-ink-900/5 bg-white p-5 shadow-card-hover sm:p-6">
              <div className="flex items-center justify-between border-b border-ink-900/5 pb-4">
                <div>
                  <p className="text-sm font-bold text-ink-900">
                    Your USA starter kit
                  </p>
                  <p className="text-xs text-ink-400">Guides for your first year</p>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-emerald-500 text-sm font-extrabold text-white">
                  N
                </span>
              </div>

              <ul className="mt-4 space-y-2.5">
                {dashboardItems.map((item) => (
                  <li
                    key={item.title}
                    className="flex items-center gap-3 rounded-2xl border border-ink-900/5 bg-[#fafafa] p-3 transition-colors hover:bg-brand-50/60"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
                      {item.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink-800">
                        {item.title}
                      </p>
                      <p className="text-xs text-ink-400">{item.meta}</p>
                    </div>
                    <span className="ml-auto text-ink-300" aria-hidden>
                      →
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
