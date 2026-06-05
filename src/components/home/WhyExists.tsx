import Container from "@/components/Container";

const scattered = [
  "Random WhatsApp groups",
  "Endless YouTube videos",
  "Conflicting Reddit threads",
  "Advice from friends",
  "Outdated blog posts",
];

const clear = [
  "One organized library",
  "Step-by-step playbooks",
  "Written for NRIs",
  "Updated & trustworthy",
  "Plain-English explanations",
];

export default function WhyExists() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              Why this website exists
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              Stop piecing it together from a dozen tabs
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-500">
              Most immigrants learn through scattered WhatsApp groups, YouTube
              videos, Reddit threads, friends, and random blogs. The information
              is out there — but it&apos;s contradictory, outdated, and
              exhausting to chase down.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-ink-500">
              <span className="font-semibold text-ink-800">NRI to USA</span>{" "}
              organizes the practical stuff in one clean place, so you can make
              confident decisions without the noise.
            </p>
          </div>

          {/* Visual: scattered vs clear */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-ink-900/5 bg-[#fafafa] p-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-base">
                  😵
                </span>
                <p className="text-sm font-bold text-ink-700">Scattered info</p>
              </div>
              <ul className="space-y-2.5">
                {scattered.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-ink-500"
                  >
                    <span className="text-rose-400">✕</span>
                    <span className="line-through decoration-ink-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-brand-200 bg-gradient-to-br from-brand-50 to-emerald-50 p-6 shadow-card">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-base">
                  ✅
                </span>
                <p className="text-sm font-bold text-ink-900">Clear guides</p>
              </div>
              <ul className="space-y-2.5">
                {clear.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm font-medium text-ink-700"
                  >
                    <span className="text-emerald-500">✓</span>
                    {item}
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
