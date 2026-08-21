import Link from "next/link";
import {
  greenCardLineRows,
  greenCardLineMonth,
  i485BacklogDisplay,
  h1bOddsDisplay,
  type LineTone,
} from "@/lib/home/greenCardLine";

/**
 * "The Green Card Line · India" — the dark rate card in the homepage hero.
 *
 * This replaced the scrolling ticker strip that used to sit above the hero: a
 * marquee forced visitors to wait for the number they wanted, while the same
 * three EB India cutoffs sit still and readable here. Every figure comes from
 * lib/home/greenCardLine, which reads the committed visa-bulletin, I-485
 * inventory and H-1B lottery data — no hand-typed dates.
 */

const TONE: Record<LineTone, string> = {
  up: "bg-emerald-400/15 text-emerald-300",
  down: "bg-rose-400/15 text-rose-300",
  hold: "bg-amber-400/15 text-amber-300",
};

export default function GreenCardLineCard() {
  const rows = greenCardLineRows();

  return (
    <aside
      aria-label={`Green card line for India, ${greenCardLineMonth} visa bulletin`}
      className="overflow-hidden rounded-3xl border border-[#24405F] bg-[#0D2138] shadow-card-hover"
    >
      <div className="flex items-center justify-between gap-3 border-b border-[#24405F] px-5 py-4">
        <h2 className="text-sm font-bold tracking-tight text-[#E9F0F9]">
          The Green Card Line · India
        </h2>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-[#8FA3BC]">
          State Dept · {greenCardLineMonth}
        </span>
      </div>

      <ul>
        {rows.map((row) => (
          <li key={row.category} className="border-b border-[#24405F]">
            <Link
              href={row.href}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 px-5 py-3.5 transition-colors hover:bg-white/[0.04] sm:grid-cols-[minmax(0,1fr)_auto_auto]"
            >
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-[#E9F0F9]">
                  {row.label}
                </span>
                <span className="block font-mono text-[11px] text-[#8FA3BC]">
                  {row.sub}
                </span>
              </span>
              <span className="text-right font-mono text-sm font-semibold tabular-nums text-[#E9F0F9]">
                {row.value}
              </span>
              <span
                className={`col-start-2 justify-self-end rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold sm:col-start-auto ${TONE[row.tone]}`}
              >
                {row.badge}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 bg-white/[0.04] px-5 py-3.5">
        <span className="font-mono text-xs text-[#8FA3BC]">
          I-485 backlog <b className="font-semibold text-[#E9F0F9]">{i485BacklogDisplay}</b>{" "}
          · H-1B odds <b className="font-semibold text-[#E9F0F9]">{h1bOddsDisplay}</b>
        </span>
        <Link
          href="/immigration-tracker"
          className="shrink-0 text-sm font-semibold text-[#7FB4FF] hover:underline"
        >
          Track your case <span aria-hidden>→</span>
        </Link>
      </div>
    </aside>
  );
}
