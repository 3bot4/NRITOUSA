"use client";

import Link from "next/link";
import { trackVisitorInsuranceEvent } from "@/lib/analytics";

export interface IntentOption {
  key: string;
  icon: string;
  label: string;
  href: string;
}

const DEFAULT_INTENTS: IntentOption[] = [
  { key: "before-travel", icon: "🧳", label: "I'm buying insurance before travel", href: "/visitor-insurance/how-much-coverage" },
  { key: "parents", icon: "👨‍👩‍👧", label: "Buying insurance for my parents", href: "/visitor-insurance/parents-visiting-usa" },
  { key: "hospital-bill", icon: "🏥", label: "I received a hospital bill", href: "/tools/visitor-insurance-hospital-bill-calculator" },
  { key: "compare", icon: "📊", label: "Compare two insurance plans", href: "/tools/visitor-insurance-plan-comparison" },
  { key: "how-much", icon: "💰", label: "How much could I pay?", href: "/tools/visitor-insurance-cost-calculator" },
  { key: "terms", icon: "❓", label: "I don't understand insurance terms", href: "/visitor-insurance/glossary" },
];

/**
 * "What brings you here today?" intent router — the primary entry point
 * into the cluster. Every destination is an existing route (no new URLs),
 * so this is purely a navigation/IA improvement, not a new page.
 */
export default function IntentRouterGrid({ intents = DEFAULT_INTENTS }: { intents?: IntentOption[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {intents.map((it) => (
        <Link
          key={it.key}
          href={it.href}
          onClick={() => trackVisitorInsuranceEvent("related_page_click", { tool_slug: "hub-intent-router", destination_path: it.href })}
          className="group flex items-center gap-3 rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card-hover"
        >
          <span aria-hidden className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-sky-50 text-2xl">
            {it.icon}
          </span>
          <span className="text-sm font-bold leading-snug text-ink-900 group-hover:text-brand-700">{it.label}</span>
          <span aria-hidden className="ml-auto flex-none text-ink-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-500">→</span>
        </Link>
      ))}
    </div>
  );
}
