/**
 * Accessible, dependency-free "what changes after becoming an NRI" flow diagram.
 *
 * Pure server component: semantic HTML + CSS only (no JS, no image, no chart lib).
 * Meaning is carried by text + a labelled arrow, never by colour alone. Stacks
 * cleanly on mobile; each row is a From → To mapping with a short note.
 */
interface Flow {
  icon: string;
  from: string;
  to: string;
  note: string;
}

const FLOWS: Flow[] = [
  {
    icon: "🏦",
    from: "Resident savings / current account",
    to: "Re-designate to an NRO account",
    note: "Keeping an ordinary resident account after you become an NRI is non-compliant under FEMA.",
  },
  {
    icon: "🏠",
    from: "India-sourced income — rent, dividends, pension",
    to: "Collect in an NRO account",
    note: "NRO is the correct home for money earned in India; interest is taxable there.",
  },
  {
    icon: "💵",
    from: "Foreign earnings remitted to India",
    to: "Hold in an NRE account",
    note: "Rupee account for money brought from abroad; interest is India-tax-free and repatriable.",
  },
  {
    icon: "💱",
    from: "Foreign-currency savings",
    to: "Hold in an FCNR deposit (where appropriate)",
    note: "Keeps the balance in foreign currency, avoiding rupee-conversion risk.",
  },
  {
    icon: "📈",
    from: "Resident demat / broker records",
    to: "Update to NRI status and the right account structure",
    note: "A stale resident demat can be frozen; investing moves to the repatriable / non-repatriable framework.",
  },
  {
    icon: "🧮",
    from: "Existing Indian mutual funds / pooled products",
    to: "Flag for PFIC review (US persons)",
    note: "For US persons these are usually PFICs and generally need Form 8621 — review before adding more.",
  },
];

export default function AccountTransitionDiagram() {
  return (
    <figure className="mt-5 rounded-2xl border border-ink-900/10 bg-slate-50/60 p-4 sm:p-5">
      <figcaption className="mb-3 text-sm font-bold text-ink-900">
        How Indian financial accounts usually change after becoming an NRI
      </figcaption>
      <ol className="space-y-2.5">
        {FLOWS.map((f) => (
          <li
            key={f.from}
            className="grid grid-cols-1 items-stretch gap-2 rounded-xl border border-ink-900/10 bg-white p-3 sm:grid-cols-[1fr_auto_1fr]"
          >
            <div className="flex items-start gap-2.5">
              <span aria-hidden className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-slate-100 text-lg">
                {f.icon}
              </span>
              <div>
                <p className="text-[0.6875rem] font-bold uppercase tracking-wide text-ink-400">Before</p>
                <p className="text-sm font-medium text-ink-800">{f.from}</p>
              </div>
            </div>

            <div className="flex items-center justify-center px-1 text-ink-400" aria-hidden>
              {/* Down arrow on mobile, right arrow on wider screens */}
              <span className="sm:hidden">↓</span>
              <span className="hidden sm:inline text-lg">→</span>
            </div>

            <div className="rounded-lg bg-brand-50/60 p-2.5">
              <p className="text-[0.6875rem] font-bold uppercase tracking-wide text-brand-600">
                <span className="sr-only">changes to: </span>After
              </p>
              <p className="text-sm font-semibold text-ink-900">{f.to}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-500">{f.note}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs leading-relaxed text-ink-500">
        Conceptual overview only — exact bank and broker procedures vary by institution and by your
        situation, and this is not legal or individualized advice.
      </p>
    </figure>
  );
}
