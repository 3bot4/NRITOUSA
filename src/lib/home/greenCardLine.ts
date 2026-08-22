/**
 * Data projection for the homepage hero's "Green Card Line · India" card.
 *
 * The card replaces the old scrolling ticker strip: instead of a marquee the
 * homepage now shows a static, readable rate card of the three India
 * employment categories plus the two headline queue numbers.
 *
 * Every value here is derived from the SAME committed data the rest of the
 * site reads — lib/visa-bulletin for the cutoffs and their month-over-month
 * movement (never a hand-written "+1 mo" note), data/i485-inventory for the
 * pending-case backlog, and data/h1b-lottery-timeline for the lottery odds.
 * Nothing in this module calls a network API.
 */

import i485Inventory from "../../../data/i485-inventory/current.json";
import h1bTimeline from "../../../data/h1b-lottery-timeline.json";
import {
  getCutoffs,
  getMovement,
  formatCutoff,
  formatBulletinMonth,
  bulletin,
  type EbCategory,
} from "@/lib/visa-bulletin";

/** Colour tone for a movement badge. */
export type LineTone = "up" | "down" | "hold";

export interface GreenCardLineRow {
  category: EbCategory;
  /** "EB-1 India" */
  label: string;
  /** "Priority workers" */
  sub: string;
  /** Final Action Date, formatted ("Oct 15, 2022" / "Unavailable" / "Current"). */
  value: string;
  /** Movement badge text ("+1 mo", "−2 mo", "no change", "no numbers"). */
  badge: string;
  tone: LineTone;
  href: string;
}

const ROW_META: Record<EbCategory, { label: string; sub: string; href: string }> = {
  eb1: {
    label: "EB-1 India",
    sub: "Priority workers",
    href: "/visa-bulletin/eb1-india",
  },
  eb2: {
    label: "EB-2 India",
    sub: "Advanced degrees",
    href: "/visa-bulletin/eb2-india",
  },
  eb3: {
    label: "EB-3 India",
    sub: "Skilled workers",
    href: "/visa-bulletin/eb3-india",
  },
  eb5: {
    label: "EB-5 India",
    sub: "Investors",
    href: "/visa-bulletin",
  },
};

/** Turn a computed movement into the badge text + tone shown on the card. */
function badgeFor(category: EbCategory): { badge: string; tone: LineTone } {
  const movement = getMovement(category, "india");
  switch (movement.status) {
    case "current":
      return { badge: "current", tone: "up" };
    case "unavailable":
      return { badge: "no numbers", tone: "hold" };
    case "advanced": {
      const n = movement.monthsMoved;
      return {
        badge: n === null ? "advanced" : `+${Math.round(n)} mo`,
        tone: "up",
      };
    }
    case "retrogressed": {
      const n = movement.monthsMoved;
      return {
        badge: n === null ? "retrogressed" : `−${Math.abs(Math.round(n))} mo`,
        tone: "down",
      };
    }
    case "no-movement":
      return { badge: "no change", tone: "hold" };
    default:
      return { badge: "final action", tone: "hold" };
  }
}

/** The three India employment categories, in bulletin order. */
export function greenCardLineRows(): GreenCardLineRow[] {
  return (["eb1", "eb2", "eb3"] as const).map((category) => {
    const meta = ROW_META[category];
    const { fad } = getCutoffs(category, "india");
    const { badge, tone } = badgeFor(category);
    return {
      category,
      label: meta.label,
      sub: meta.sub,
      value: formatCutoff(fad),
      badge,
      tone,
      href: meta.href,
    };
  });
}

/** Employment-based I-485 pending cases, abbreviated (e.g. "164K"). */
export const i485BacklogDisplay: string = (() => {
  const total = (i485Inventory as { overallTotal: number }).overallTotal;
  return total >= 1_000_000
    ? `${(total / 1_000_000).toFixed(1)}M`
    : `${Math.round(total / 1000)}K`;
})();

/** H-1B lottery selection odds from the most recent cycle with real counts. */
export const h1bOddsDisplay: string = (() => {
  type Cycle = {
    fiscalYear: number;
    registrations: number | null;
    selected: number | null;
  };
  const cycles = (h1bTimeline as { cycles: Cycle[] }).cycles;
  const latest = cycles.find((c) => c.registrations && c.selected);
  if (!latest?.registrations || !latest?.selected) return "~85K cap";
  return `~${Math.round((latest.selected / latest.registrations) * 100)}%`;
})();

/** "September 2026" — the bulletin month the card's cutoffs come from. */
export const greenCardLineMonth: string = formatBulletinMonth(bulletin.month);
