import Link from "next/link";
import Sparkline from "@/components/tools/Sparkline";
import Icon from "@/components/Icon";
import {
  usdInrCard,
  nreFd,
  nextBulletin,
  eb2IndiaFad,
  currentBulletinLabel,
} from "@/lib/market";

/**
 * Right-rail data cards for the homepage. Each card links to an existing tool or
 * guide. All values come from lib/market (static JSON + visa-bulletin data) — no
 * client-side fetches. On mobile these stack below the main column (handled by
 * the page grid).
 */

function CardShell({
  href,
  eyebrow,
  children,
  cta,
}: {
  href: string;
  eyebrow: string;
  children: React.ReactNode;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div className="text-[11px] font-bold uppercase tracking-wide text-ink-400">
        {eyebrow}
      </div>
      {children}
      <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-brand-600 group-hover:text-brand-700">
        {cta}
        <Icon name="arrow-right" className="h-3.5 w-3.5" />
      </div>
    </Link>
  );
}

function Eb2Card() {
  const { display, fad } = eb2IndiaFad();
  // Backlog age: how far behind today's filings the cutoff sits.
  const backlogYrs =
    fad === "C"
      ? 0
      : (Date.now() - Date.parse(`${fad}T00:00:00Z`)) /
        (365.25 * 86_400_000);
  return (
    <CardShell
      href="/tools/green-card-tracker"
      eyebrow="EB-2 India · estimated wait"
      cta="Estimate your wait"
    >
      <div className="mt-1 text-2xl font-extrabold tracking-tight text-ink-900">
        {display}
      </div>
      <p className="mt-0.5 text-xs text-ink-500">
        Final Action Date
        {backlogYrs > 0 && ` · ~${backlogYrs.toFixed(1)} yr backlog`}
      </p>
    </CardShell>
  );
}

function UsdInrSidebarCard() {
  const c = usdInrCard();
  const up = c.direction === "up";
  const down = c.direction === "down";
  const stroke = down ? "#e11d48" : "#10b981";
  const sign = c.changePct > 0 ? "+" : "";
  return (
    <CardShell
      href="/articles/cheapest-way-send-money-usa-india"
      eyebrow="USD/INR · RBI rate"
      cta="Cheapest way to send money home"
    >
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-2xl font-extrabold tracking-tight text-ink-900">
          ₹{c.rate.toFixed(2)}
        </span>
        <span
          className={`text-sm font-semibold ${
            up ? "text-emerald-600" : down ? "text-rose-600" : "text-ink-400"
          }`}
        >
          {up ? "▲" : down ? "▼" : "·"} {sign}
          {c.changePct.toFixed(2)}%
        </span>
        {c.stale && (
          <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-amber-700">
            stale
          </span>
        )}
      </div>
      <div className="mt-2">
        <Sparkline
          points={c.spark}
          width={240}
          height={40}
          stroke={stroke}
          className="w-full"
          label="USD/INR over the last 30 days"
        />
      </div>
      <p className="mt-1 text-xs text-ink-500">
        {c.rangeLabel}: ₹{c.low.toFixed(2)} – ₹{c.high.toFixed(2)}
      </p>
    </CardShell>
  );
}

function NreFdCard() {
  return (
    <CardShell
      href="/articles/best-bank-account-nri-usa"
      eyebrow="Top NRE FD rate"
      cta="Compare NRI bank accounts"
    >
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-2xl font-extrabold tracking-tight text-ink-900">
          {nreFd.rate.toFixed(2)}%
        </span>
        <span className="text-xs font-medium text-ink-500">{nreFd.tenor}</span>
      </div>
      <p className="mt-0.5 text-xs text-ink-500">
        {nreFd.bank} · as of{" "}
        {new Date(`${nreFd.updated}T00:00:00Z`).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
          timeZone: "UTC",
        })}
      </p>
    </CardShell>
  );
}

function NextBulletinCard() {
  const next = nextBulletin();
  return (
    <CardShell
      href="/#newsletter"
      eyebrow="Next visa bulletin"
      cta="Get an alert when it drops"
    >
      {next ? (
        <>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold tracking-tight text-ink-900">
              {next.days === 0 ? "Today" : `${next.days} days`}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-ink-500">
            Expected ~{next.label} · current bulletin {currentBulletinLabel()}
          </p>
        </>
      ) : (
        <>
          <div className="mt-1 text-xl font-extrabold tracking-tight text-ink-900">
            Coming soon
          </div>
          <p className="mt-0.5 text-xs text-ink-500">
            Current bulletin {currentBulletinLabel()}
          </p>
        </>
      )}
    </CardShell>
  );
}

export default function HomeDataSidebar() {
  return (
    <aside aria-label="Live data" className="flex flex-col gap-4">
      <Eb2Card />
      <UsdInrSidebarCard />
      <NreFdCard />
      <NextBulletinCard />
    </aside>
  );
}
