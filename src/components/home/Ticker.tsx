import {
  tickerItems,
  marketAsOfLabel,
  marketSources,
  type TickerItem,
} from "@/lib/market";

/**
 * Top-of-page market ticker: exactly five items (USD/INR, NIFTY 50, S&P 500,
 * Gold, and our EB-2 India differentiator). Reads purely from /data/market.json
 * via lib/market — no client-side network calls. Scrolls horizontally on mobile.
 */

const dirText: Record<TickerItem["direction"], string> = {
  up: "text-emerald-600",
  down: "text-rose-600",
  flat: "text-ink-400",
};

function Arrow({ direction }: { direction: TickerItem["direction"] }) {
  if (direction === "flat") return <span aria-hidden>·</span>;
  return (
    <span aria-hidden className="text-[0.7em] leading-none">
      {direction === "up" ? "▲" : "▼"}
    </span>
  );
}

function Cell({ item }: { item: TickerItem }) {
  const isDiff = item.kind === "differentiator";
  return (
    <div
      className={[
        "flex shrink-0 items-center gap-2 px-4 py-2.5 text-sm",
        isDiff
          ? "rounded-md bg-cat-visa-soft font-semibold text-cat-visa ring-1 ring-cat-visa/20"
          : "",
      ].join(" ")}
    >
      <span className="font-semibold text-ink-700">{item.label}</span>
      <span className="font-bold text-ink-900">{item.display}</span>
      <span className={`flex items-center gap-1 font-medium ${dirText[item.direction]}`}>
        <Arrow direction={item.direction} />
        {item.change}
      </span>
      {item.stale && (
        <span
          className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700"
          title="Last known value — today's fetch was unavailable"
        >
          stale
        </span>
      )}
    </div>
  );
}

export default function Ticker() {
  const items = tickerItems();

  return (
    <section
      aria-label="Markets and visa bulletin snapshot"
      className="border-b border-ink-900/10 bg-white"
    >
      {/* Strip: horizontal scroll on mobile, full row on desktop */}
      <div className="mx-auto w-full max-w-6xl px-2 sm:px-4">
        <div className="flex items-center gap-1 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-2">
          {items.map((item, i) => (
            <div key={item.key} className="flex shrink-0 items-center">
              {i > 0 && (
                <span
                  aria-hidden
                  className="mx-1 hidden h-4 w-px bg-ink-900/10 sm:block"
                />
              )}
              <Cell item={item} />
            </div>
          ))}
        </div>
      </div>

      {/* Attribution */}
      <div className="mx-auto w-full max-w-6xl px-4 pb-1.5">
        <p className="text-[11px] leading-tight text-ink-400">
          Source: {marketSources.join(", ")}, EB-2 from U.S. State Dept Visa
          Bulletin · as of {marketAsOfLabel}
        </p>
      </div>
    </section>
  );
}
