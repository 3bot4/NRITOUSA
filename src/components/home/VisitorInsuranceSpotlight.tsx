import Link from "next/link";

/**
 * Premium card spotlight for the Visitor Insurance cluster on the homepage —
 * six cards, not plain text links, per the cluster's design brief.
 */
const cards = [
  { href: "/visitor-insurance", icon: "🩺", title: "Visitor Insurance", blurb: "Start here — the full guide to cost, liability & how it works." },
  { href: "/tools/visitor-insurance-hospital-bill-calculator", icon: "🏥", title: "Hospital Cost", blurb: "Model a full ER or hospital episode as the separate bills it usually is." },
  { href: "/tools/visitor-insurance-plan-comparison", icon: "📊", title: "Plan Comparison", blurb: "Compare two plans on the exact same medical bill, side by side." },
  { href: "/visitor-insurance/parents-visiting-usa", icon: "👨‍👩‍👧", title: "Parents Guide", blurb: "What to check before buying coverage for a parent visiting the USA." },
  { href: "/tools/visitor-insurance-policy-maximum-calculator", icon: "🛡️", title: "Hospital Liability", blurb: "Policy maximum vs out-of-pocket maximum — they are not the same thing." },
  { href: "/visitor-insurance/glossary", icon: "📖", title: "Insurance Glossary", blurb: "Every term, defined with a numeric example, not a dictionary entry." },
] as const;

export default function VisitorInsuranceSpotlight() {
  return (
    <section aria-labelledby="visitor-insurance-spotlight-h" className="py-8 sm:py-10">
      <div className="flex items-end justify-between gap-3">
        <h2 id="visitor-insurance-spotlight-h" className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">
          Visitor insurance, explained with numbers
        </h2>
        <Link href="/visitor-insurance" className="shrink-0 text-sm font-semibold text-brand-600 hover:text-brand-700">
          Open the hub <span aria-hidden>→</span>
        </Link>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group flex items-start gap-3 rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-card-hover"
          >
            <span aria-hidden className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-sky-50 to-blue-50 text-2xl">
              {c.icon}
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-bold tracking-tight text-ink-900 group-hover:text-sky-700">{c.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-ink-500">{c.blurb}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
