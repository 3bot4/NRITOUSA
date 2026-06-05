import Container from "./Container";

export default function Newsletter() {
  return (
    <section id="newsletter" className="scroll-mt-20 py-16 sm:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-ink-900 px-6 py-12 sm:px-12 sm:py-16">
          {/* Decorative gradient blobs */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-600/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />

          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Get practical immigrant finance guides every week
            </h2>
            <p className="mt-3 text-ink-400">
              Simple, useful guides about money, housing, cars, taxes, and life
              in the USA. No spam, unsubscribe anytime.
            </p>

            <form
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
              // Wire to your email provider; left as a no-op for the starter.
              action="#"
              method="post"
            >
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@email.com"
                className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-brand-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-400"
              >
                Subscribe
              </button>
            </form>
            <p className="mt-3 text-xs text-ink-500">
              Join 12,000+ NRIs already reading.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
