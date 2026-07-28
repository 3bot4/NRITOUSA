"use client";

/**
 * Live "days until the next Visa Bulletin" countdown, sourced from the same
 * manually-maintained release schedule (data/homepage-config.json) and
 * shared date math (visaBulletinState) as the homepage ticker and immigration
 * tracker — one source of truth, no second parser.
 */

import config from "../../../data/homepage-config.json";
import { visaBulletinState, monthLabel } from "@/lib/visaBulletinState";

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  if (isNaN(target.getTime())) return 0;
  const now = new Date();
  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / 86400000));
}

export default function NextBulletinCountdown() {
  const state = visaBulletinState(new Date(), (config.bulletinReleases as string[]) ?? []);
  if (!state.nextExpectedMonth || !state.nextPublicationDate) return null;

  const days = daysUntil(state.nextPublicationDate);

  return (
    <div className="mb-4 flex items-center gap-3 rounded-xl border border-brand-100 bg-brand-50/60 px-4 py-3">
      <span className="text-2xl" aria-hidden>
        📆
      </span>
      <p className="text-sm text-ink-700">
        <strong className="font-bold text-brand-700">~{days} days</strong> until
        the {monthLabel(state.nextExpectedMonth)} Visa Bulletin (estimated{" "}
        {state.nextPublicationDate}) — publication dates are DOS estimates, not
        official.
      </p>
    </div>
  );
}
