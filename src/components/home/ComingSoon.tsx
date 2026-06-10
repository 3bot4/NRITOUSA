import Container from "@/components/Container";
import { tools } from "@/lib/tools";

/**
 * Surfaces genuinely upcoming tools (status === "coming-soon" in lib/tools)
 * with a notify-me capture. The form mirrors the site's existing newsletter
 * placeholder (no-op action) so it can be wired to the same provider later.
 */
export default function ComingSoon() {
  const upcoming = tools.filter((t) => t.status === "coming-soon");
  if (upcoming.length === 0) return null;

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="rounded-3xl border border-ink-900/5 bg-[#fafafa] p-6 sm:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                Coming soon
              </span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink-900">
                More tools on the way
              </h2>
              <ul className="mt-4 space-y-3">
                {upcoming.map((t) => (
                  <li key={t.slug} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
                      {t.icon}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-ink-900">{t.label}</p>
                      <p className="text-xs leading-relaxed text-ink-500">
                        {t.description.replace(/\s*Launching soon\.?$/, "")}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card">
              <p className="text-sm font-bold text-ink-900">Get notified at launch</p>
              <p className="mt-1 text-xs text-ink-500">
                One email when these go live. No spam, unsubscribe anytime.
              </p>
              {/* Wire to your email provider; mirrors the newsletter placeholder. */}
              <form className="mt-4 flex flex-col gap-2 sm:flex-row" action="#" method="post">
                <label htmlFor="notify-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="notify-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@email.com"
                  className="w-full rounded-xl border border-ink-900/10 bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                >
                  Notify me
                </button>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
