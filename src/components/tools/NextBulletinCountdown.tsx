"use client";

/**
 * Live "days until the next Visa Bulletin" countdown, sourced from the same
 * manually-maintained release schedule (data/homepage-config.json) and
 * shared date math (visaBulletinState) as the homepage ticker and immigration
 * tracker — one source of truth, no second parser.
 */

import config from "../../../data/homepage-config.json";
import currentBulletin from "../../../data/visa-bulletin/current.json";
import { visaBulletinState, monthLabel } from "@/lib/visaBulletinState";

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  if (isNaN(target.getTime())) return 0;
  const now = new Date();
  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / 86400000));
}

export default function NextBulletinCountdown() {
  const state = visaBulletinState(
    new Date(),
    (config.bulletinReleases as string[]) ?? [],
    currentBulletin.bulletinMonth,
  );
  if (!state.nextExpectedMonth || !state.nextPublicationDate) return null;

  const days = daysUntil(state.nextPublicationDate);
  const month = monthLabel(state.nextExpectedMonth);

  /* The schedule holds estimates, and DOS routinely runs late. Counting down
   * to a date that has already passed reads as broken, so say "overdue". */
  if (state.releaseOverdue) {
    return (
      <div className="mb-4 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3">
        <span className="text-2xl" aria-hidden>
          📆
        </span>
        <p className="text-sm text-ink-700">
          The <strong className="font-bold text-amber-800">{month}</strong> Visa
          Bulletin is <strong className="font-bold text-amber-800">overdue</strong> —
          it was estimated for {state.nextPublicationDate} and the Department of
          State has not published it yet. Release dates are DOS estimates, not
          official commitments.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-4 flex items-center gap-3 rounded-xl border border-brand-100 bg-brand-50/60 px-4 py-3">
      <span className="text-2xl" aria-hidden>
        📆
      </span>
      <p className="text-sm text-ink-700">
        <strong className="font-bold text-brand-700">~{days} days</strong> until
        the {month} Visa Bulletin (estimated{" "}
        {state.nextPublicationDate}) — publication dates are DOS estimates, not
        official.
      </p>
    </div>
  );
}
