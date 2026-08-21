import Container from "@/components/Container";

/**
 * Four-cell credibility strip directly under the hero. Deliberately not
 * "updated daily" — most figures here are annual or monthly (IRS limits, DOL
 * wage data, the visa bulletin), so each tool carries its own last-checked
 * date instead of a blanket freshness claim the site cannot keep.
 *
 * The divider classes are per-cell rather than a clever nth-child rule: the
 * grid is 1 / 2 / 4 columns, so which edge needs a rule changes per breakpoint
 * AND per cell, and an nth-child variant outranks a later plain one on
 * specificity no matter the source order.
 */
const items: { n: string; accent?: boolean; d: string; rules: string }[] = [
  {
    n: "20+",
    accent: true,
    d: "Free tools & calculators",
    rules: "",
  },
  {
    n: "50+",
    accent: true,
    d: "In-depth guides",
    rules: "border-t sm:border-t-0 sm:border-l",
  },
  {
    n: "Official",
    d: "USCIS & State Dept sources shown",
    rules: "border-t lg:border-t-0 lg:border-l",
  },
  {
    n: "Dated",
    d: "Every tool shows its last-checked date",
    rules: "border-t sm:border-l lg:border-t-0",
  },
];

export default function TrustBar() {
  return (
    <section aria-label="Why trust NRI to USA" className="pt-8 sm:pt-10">
      <Container>
        <div className="grid overflow-hidden rounded-2xl border border-ink-900/10 bg-white shadow-card sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.n}
              className={`border-ink-900/10 px-6 py-5 ${item.rules}`}
            >
              <div
                className={`text-2xl font-extrabold tracking-tight ${
                  item.accent ? "text-brand-600" : "text-ink-900"
                }`}
              >
                {item.n}
              </div>
              <div className="mt-0.5 text-sm text-ink-500">{item.d}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
