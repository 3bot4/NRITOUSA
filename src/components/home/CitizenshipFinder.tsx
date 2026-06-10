import Link from "next/link";
import Container from "@/components/Container";

/**
 * Question-led homepage entry point for the citizenship readiness tool.
 * Uses the "Visa & Green Card" emerald→teal accent to match the tool.
 */
export default function CitizenshipFinder() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-500 to-teal-600 p-8 shadow-card sm:p-12">
          <div className="absolute inset-0 bg-ink-900/15" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div className="max-w-xl text-white">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                🦅 New tool · Updated for the 2025 civics test
              </span>
              <h2 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Green card holder — when can you apply for US citizenship?
              </h2>
              <p className="mt-3 text-base leading-relaxed text-white/90">
                Answer a few questions to get your earliest N-400 filing date,
                find out whether the new 128-question test applies to you, see
                your personal risk areas, and track every step to the oath.
              </p>
              <Link
                href="/tools/citizenship-checklist"
                className="mt-6 inline-block rounded-xl bg-white px-6 py-3 text-sm font-bold text-emerald-700 transition-transform hover:-translate-y-0.5"
              >
                Check my citizenship readiness →
              </Link>
            </div>
            <ul className="relative space-y-2.5 rounded-2xl bg-white/10 p-5 text-sm font-medium text-white backdrop-blur">
              {[
                "Earliest filing date + countdown",
                "Which civics test applies to you",
                "Documents & good-moral-character audit",
                "NRI tax & long-trip risk flags",
                "Save and share your progress",
              ].map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <span aria-hidden className="mt-0.5 text-white">
                    ✓
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
