"use client";

import PrintButton from "@/components/PrintButton";
import { tdsChecklists } from "@/data/nriPropertySaleTdsData";
import { trackEvent } from "@/lib/analytics";

const TOOL_SLUG = "nri-selling-property-in-india-tds";

/**
 * The four printable checklists for the NRI property-sale page. GA4 events
 * carry only the tool slug and checklist id — never any user data.
 */
export default function NriTdsChecklists() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-ink-900">Checklists: Form 13, closing, buyer compliance, repatriation</h2>
        <span
          onClickCapture={() => trackEvent("buyer_checklist_downloaded", { tool_slug: TOOL_SLUG })}
        >
          <PrintButton label="Print checklists" />
        </span>
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
        Four working checklists for the four phases of the deal. Print them, or open each one as you reach that stage.
      </p>
      <div className="mt-4 space-y-3">
        {tdsChecklists.map((c) => (
          <details
            key={c.id}
            id={c.id}
            className="group rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card open:shadow-card-hover print:!block"
            onToggle={(e) => {
              if ((e.target as HTMLDetailsElement).open) {
                trackEvent("form13_checklist_opened", { tool_slug: TOOL_SLUG, checklist_id: c.id });
              }
            }}
          >
            <summary className="cursor-pointer list-none text-base font-semibold text-ink-900 marker:hidden [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-4">
                {c.title}
                <span aria-hidden className="text-ink-400 transition-transform group-open:rotate-45">+</span>
              </span>
            </summary>
            <ul className="mt-3 space-y-1.5">
              {c.items.map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-relaxed text-ink-600">
                  <span aria-hidden className="mt-0.5 text-emerald-600">☐</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </div>
  );
}
