import Link from "next/link";
import {
  tickerItems,
  currentBulletinLabel,
  type TickerItem,
} from "@/lib/market";

/**
 * Continuously scrolling market ticker. Items are rendered twice so the loop
 * is seamless — when the first set exits left, the duplicate fills from right.
 * The CSS `ticker-track` animation and `ticker-wrap` hover-pause are defined
 * in globals.css. Pauses on hover so users can click links.
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
    <Link
      href={item.href}
      style={{ color: "inherit", textDecoration: "none" }}
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
    </Link>
  );
}

function Divider() {
  return (
    <span aria-hidden className="mx-1 h-4 w-px shrink-0 bg-ink-900/10" />
  );
}

export default function Ticker() {
  const items = tickerItems();

  const cells = items.map((item, i) => (
    <span key={item.key} className="flex shrink-0 items-center">
      {i > 0 && <Divider />}
      <Cell item={item} />
    </span>
  ));

  return (
    <section
      aria-label="Markets and visa bulletin snapshot"
      className="border-b border-ink-900/10 bg-white"
    >
      {/* Scrolling strip — ticker-wrap + ticker-track + ticker-copy defined in globals.css */}
      <div className="ticker-wrap">
        <div className="ticker-track">
          {/* first copy — read by screen readers */}
          <span className="ticker-copy">
            {cells}
            <Divider />
          </span>
          {/* duplicate — visually seamless loop, hidden from assistive tech */}
          <span className="ticker-copy" aria-hidden>
            {cells}
            <Divider />
          </span>
        </div>
      </div>

      {/* Attribution */}
      <div className="px-4 pb-1.5">
        <p className="text-[11px] leading-tight text-ink-400">
          Source: U.S. State Dept Visa Bulletin, USCIS · {currentBulletinLabel()} bulletin
        </p>
      </div>
    </section>
  );
}
