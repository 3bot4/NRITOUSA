"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import TrackerCharts from "@/components/tools/TrackerCharts";
import DataStamp from "@/components/tools/DataStamp";
import BottomDisclaimer, {
  FULL_DISCLAIMER_ID,
} from "@/components/tools/BottomDisclaimer";
import DataConfidenceBadge, {
  type ConfidenceType,
} from "@/components/tools/DataConfidenceBadge";
import PremiumProcessingFeeNote, {
  type PremiumFeeType,
} from "@/components/tools/PremiumProcessingFeeNote";
import ShareTrackerBlock from "@/components/tools/ShareTrackerBlock";
import ImmigrationEmailSignup from "@/components/tools/ImmigrationEmailSignup";
import {
  visaBulletinIndia,
  greenCardBacklog,
  i485BacklogIndia,
  h1bLottery,
  processingTimes,
  countdowns,
  dashboardDisclaimers,
} from "@/data/immigration-tracker-data";
import { formatCutoff, bulletin } from "@/lib/visa-bulletin";
import { inventoryMeta } from "@/lib/i485-inventory";
import type { FaqItem } from "@/lib/seo";

const TRACKER_URL = "https://www.nritousa.com/immigration-tracker";

/** Maps a central-data premiumFeeForm string to the fee-note component's type. */
const PREMIUM_FEE_TYPE: Record<string, PremiumFeeType> = {
  "I-129": "h1bI129",
  "I-140": "i140",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  if (isNaN(target.getTime())) return 0;
  const now = new Date();
  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / 86400000));
}

/** Map a verified movement direction to the card's trend-arrow direction. */
function movementToDirection(
  dir: "forward" | "retrogressed" | "unchanged" | "unavailable"
): "up" | "down" | "neutral" {
  if (dir === "forward") return "up";
  if (dir === "retrogressed") return "down";
  return "neutral";
}

function yearGap(cutoffDate: string): string {
  if (cutoffDate === "C") return "No backlog (Current)";
  if (cutoffDate === "U") return "Unavailable this month";
  const cutoff = new Date(cutoffDate);
  if (isNaN(cutoff.getTime())) return "Unavailable";
  const now = new Date();
  const totalMonths =
    (now.getFullYear() - cutoff.getFullYear()) * 12 +
    (now.getMonth() - cutoff.getMonth());
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (months === 0) return `~${years} year${years !== 1 ? "s" : ""} gap`;
  return `~${years} yr ${months} mo gap`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ChangeTag({
  label,
  direction,
}: {
  label: string;
  direction: "up" | "down" | "neutral";
}) {
  const colors =
    direction === "up"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : direction === "down"
      ? "bg-rose-50 text-rose-700 border-rose-100"
      : "bg-ink-50 text-ink-500 border-ink-100";
  const arrow = direction === "up" ? "↑ " : direction === "down" ? "↓ " : "";
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${colors}`}>
      {arrow}{label}
    </span>
  );
}

function StatCard({
  label,
  value,
  subvalue,
  changeLabel,
  changeDirection,
  lastUpdated,
  sourceLabel,
  sourceUrl,
  note,
  learnMoreHref,
  accent,
  icon,
  confidence,
  confidenceNote,
  premiumFeeType,
}: {
  label: string;
  value: string;
  subvalue?: string;
  changeLabel?: string;
  changeDirection?: "up" | "down" | "neutral";
  lastUpdated: string;
  sourceLabel: string;
  sourceUrl: string;
  note?: string;
  learnMoreHref?: string;
  accent?: string;
  icon?: string;
  confidence?: ConfidenceType | ConfidenceType[];
  confidenceNote?: string;
  premiumFeeType?: PremiumFeeType;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {icon && (
            <span
              aria-hidden
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-base ${accent ?? "from-brand-600 to-indigo-600"}`}
            >
              {icon}
            </span>
          )}
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-400">
            {label}
          </span>
        </div>
        {changeLabel && changeDirection && (
          <ChangeTag label={changeLabel} direction={changeDirection} />
        )}
      </div>

      {confidence && (
        <DataConfidenceBadge type={confidence} note={confidenceNote} />
      )}

      <div>
        <p className="text-xl font-extrabold leading-snug tracking-tight text-ink-900 sm:text-2xl">
          {value}
        </p>
        {subvalue && (
          <p className="mt-0.5 text-sm font-medium text-ink-500">{subvalue}</p>
        )}
      </div>

      {note && (
        <p className="text-xs leading-relaxed text-ink-400">{note}</p>
      )}

      {premiumFeeType && <PremiumProcessingFeeNote feeType={premiumFeeType} />}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-ink-900/5 pt-3">
        <DataStamp
          lastUpdated={lastUpdated}
          source={sourceUrl}
          sourceLabel={sourceLabel}
        />
        {learnMoreHref && (
          <Link
            href={learnMoreHref}
            className="text-xs font-medium text-brand-600 hover:text-brand-700"
          >
            Learn more →
          </Link>
        )}
      </div>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">
      {children}
    </h2>
  );
}

function ExplainerCard({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-ink-900/5 bg-white shadow-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 p-4 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-ink-900">{question}</span>
        <span
          className={`shrink-0 text-ink-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          ▼
        </span>
      </button>
      {open && (
        <div className="border-t border-ink-900/5 px-4 pb-4 pt-3 text-sm leading-relaxed text-ink-600">
          {answer}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ImmigrationTrackerDashboard({
  faqItems,
}: {
  faqItems: FaqItem[];
}) {
  const eb2Gap = useMemo(
    () => yearGap(visaBulletinIndia.categories.EB2.currentFinalActionDate),
    []
  );
  const bulletinCountdown = useMemo(
    () => daysUntil(countdowns.nextVisaBulletinEstimatedDate),
    []
  );

  const { EB1, EB2, EB3 } = visaBulletinIndia.categories;

  // ── Hero ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-6 py-8 sm:px-8 sm:py-10">
        <div className="flex items-start gap-4">
          <span
            aria-hidden
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-600 text-2xl shadow-sm"
          >
            🛂
          </span>
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
              NRI Immigration Tracker
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-600 sm:text-base">
              Track Visa Bulletin movement, EB-1/EB-2/EB-3 India dates, green card backlog,
              USCIS processing times, H1B lottery odds, and next bulletin countdown in one place.
            </p>
          </div>
        </div>
      </div>

      {/* Compact top disclaimer — full text in the accordion below */}
      <p className="text-xs leading-relaxed text-ink-400">
        Educational only — not legal, tax, or immigration advice. Data may lag
        official releases; every card shows its source and date.{" "}
        <a
          href={`#${FULL_DISCLAIMER_ID}`}
          className="font-medium text-brand-600 underline underline-offset-2"
        >
          Full disclaimer below
        </a>
        .
      </p>

      {/* ── Visa Bulletin Cards ───────────────────────────────────────────── */}
      <section aria-labelledby="vb-heading">
        <div className="mb-4 flex items-center justify-between gap-3">
          <SectionHeading>
            <span id="vb-heading">Visa Bulletin — India (in effect: {bulletin.month})</span>
          </SectionHeading>
          <a
            href={visaBulletinIndia.officialSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-xs font-medium text-brand-600 hover:text-brand-700"
          >
            Official bulletin ↗
          </a>
        </div>

        {/* Distinguish the bulletin CURRENTLY IN EFFECT from the latest one
            already PUBLISHED. The State Department publishes each month's
            bulletin in the middle of the prior month, so a later month is
            typically already out even though this card shows the effective one. */}
        <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-xs text-blue-900">
          These figures are for the bulletin <strong>currently in effect</strong>.
          The State Department usually publishes the next month&apos;s bulletin
          around mid-month, so a later bulletin may already be available — always
          check the{" "}
          <a
            href={visaBulletinIndia.officialSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline"
          >
            official Visa Bulletin
          </a>{" "}
          for the latest published month before acting.
        </div>

        {/* July 2026 retrogression note + source */}
        <div className="mb-4 rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3 text-sm text-amber-900">
          {visaBulletinIndia.retrogressionNote}
          <span className="mt-1 block text-xs text-amber-800/80">
            {visaBulletinIndia.sourceNote} Last verified: {visaBulletinIndia.lastVerified}.
          </span>
        </div>

        <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* EB-1 India */}
          <StatCard
            icon="1️⃣"
            accent="from-emerald-600 to-teal-600"
            label="EB-1 India"
            value={formatCutoff(EB1.currentFinalActionDate)}
            subvalue={`Filing: ${formatCutoff(EB1.currentDatesForFiling)}`}
            changeLabel={EB1.finalActionMovementLabel}
            changeDirection={movementToDirection(EB1.movementDirection)}
            lastUpdated={visaBulletinIndia.lastUpdated}
            sourceLabel={visaBulletinIndia.officialSourceName}
            sourceUrl={visaBulletinIndia.officialSourceUrl}
            note="Final Action Date (approval cutoff) · Dates for Filing shown as subvalue."
            learnMoreHref="/visa-bulletin"
            confidence={["official", "manually-maintained"]}
            confidenceNote="Based on manually maintained Visa Bulletin data. Verify with official Department of State Visa Bulletin."
          />

          {/* EB-2 India */}
          <StatCard
            icon="2️⃣"
            accent="from-blue-600 to-indigo-600"
            label="EB-2 India"
            value={formatCutoff(EB2.currentFinalActionDate)}
            subvalue={`Filing: ${formatCutoff(EB2.currentDatesForFiling)}`}
            changeLabel={EB2.finalActionMovementLabel}
            changeDirection={movementToDirection(EB2.movementDirection)}
            lastUpdated={visaBulletinIndia.lastUpdated}
            sourceLabel={visaBulletinIndia.officialSourceName}
            sourceUrl={visaBulletinIndia.officialSourceUrl}
            note="Final Action Date (approval cutoff) · Dates for Filing shown as subvalue."
            learnMoreHref="/visa-bulletin"
            confidence={["official", "manually-maintained"]}
            confidenceNote="Based on manually maintained Visa Bulletin data. Verify with official Department of State Visa Bulletin."
          />

          {/* EB-3 India */}
          <StatCard
            icon="3️⃣"
            accent="from-violet-600 to-purple-600"
            label="EB-3 India"
            value={formatCutoff(EB3.currentFinalActionDate)}
            subvalue={`Filing: ${formatCutoff(EB3.currentDatesForFiling)}`}
            changeLabel={EB3.finalActionMovementLabel}
            changeDirection={movementToDirection(EB3.movementDirection)}
            lastUpdated={visaBulletinIndia.lastUpdated}
            sourceLabel={visaBulletinIndia.officialSourceName}
            sourceUrl={visaBulletinIndia.officialSourceUrl}
            note="Final Action Date (approval cutoff) · Dates for Filing shown as subvalue."
            learnMoreHref="/visa-bulletin"
            confidence={["official", "manually-maintained"]}
            confidenceNote="Based on manually maintained Visa Bulletin data. Verify with official Department of State Visa Bulletin."
          />

          {/* EB-2 India Gap */}
          <StatCard
            icon="📏"
            accent="from-orange-500 to-amber-500"
            label="EB-2 India Gap"
            value={eb2Gap}
            subvalue="FAD vs. today"
            changeDirection="neutral"
            changeLabel="Calendar gap only"
            lastUpdated={visaBulletinIndia.lastUpdated}
            sourceLabel="Computed from Final Action Date"
            sourceUrl={visaBulletinIndia.officialSourceUrl}
            note="Simple calendar gap, not a wait-time prediction."
            learnMoreHref="/green-card"
            confidence="calculated"
            confidenceNote="Calculated as the simple calendar gap between today and the EB-2 India Final Action Date."
          />

          {/* I-485 Backlog */}
          <StatCard
            icon="📋"
            accent="from-rose-600 to-pink-600"
            label="India I-485 Pending"
            value={greenCardBacklog.valueDisplay}
            subvalue={greenCardBacklog.indiaShareDisplay}
            changeLabel={greenCardBacklog.changeDisplay}
            changeDirection="neutral"
            lastUpdated={greenCardBacklog.lastUpdated}
            sourceLabel={greenCardBacklog.officialSourceName}
            sourceUrl={greenCardBacklog.officialSourceUrl}
            note={`${greenCardBacklog.note} ${i485BacklogIndia.cardLabel}`}
            learnMoreHref="/green-card"
            confidence={["official", "manually-maintained"]}
            confidenceNote="Based on USCIS inventory data when available; manually transcribed and maintained."
          />

          {/* Next Visa Bulletin */}
          <StatCard
            icon="📆"
            accent="from-sky-600 to-blue-600"
            label="Next Visa Bulletin"
            value={`~${bulletinCountdown} days`}
            subvalue={`Est. ${countdowns.nextVisaBulletinEstimatedDate}`}
            lastUpdated={visaBulletinIndia.lastUpdated}
            sourceLabel="Estimated — not official"
            sourceUrl="https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html"
            note={countdowns.note}
            confidence="estimate"
            confidenceNote="Estimated timing only, not an official release date."
          />
        </div>
      </section>

      {/* ── H1B + Processing Time Cards ───────────────────────────────────── */}
      <section aria-labelledby="h1b-proc-heading">
        <div className="mb-4">
          <SectionHeading>
            <span id="h1b-proc-heading">H1B Lottery &amp; USCIS Processing Times</span>
          </SectionHeading>
        </div>

        <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* H1B Lottery */}
          <StatCard
            icon="🎲"
            accent="from-fuchsia-600 to-violet-600"
            label={`H1B Lottery Odds (${h1bLottery.fiscalYear})`}
            value={h1bLottery.oddsDisplay}
            subvalue={`vs. ${h1bLottery.previousYearOddsDisplay}`}
            changeLabel={h1bLottery.changeDisplay}
            changeDirection="up"
            lastUpdated={h1bLottery.lastUpdated}
            sourceLabel={h1bLottery.officialSourceName}
            sourceUrl={h1bLottery.officialSourceUrl}
            note={`Historic rate for ${h1bLottery.fiscalYear}, the last cap season selected by uniform random lottery. From ${h1bLottery.selectionMethodChange.appliesFrom} selection is wage-weighted, so this figure does not describe current individual odds — see the note below.`}
            learnMoreHref="/h1b"
            confidence={["calculated", "estimate"]}
            confidenceNote="Calculated from USCIS registration/selection data for a past cap season. Superseded as a predictor by the weighted selection process."
          />

          {/* Processing time cards */}
          {processingTimes.items.map((item) => {
            const premiumFeeForm =
              "premiumFeeForm" in item
                ? (item as { premiumFeeForm: string }).premiumFeeForm
                : undefined;
            return (
              <StatCard
                key={item.form}
                icon="⏱️"
                accent="from-slate-600 to-gray-600"
                label={item.form}
                value={item.valueDisplay}
                subvalue={item.category}
                changeLabel={item.changeDisplay}
                changeDirection="neutral"
                lastUpdated={item.lastUpdated}
                sourceLabel={item.officialSourceName}
                sourceUrl={item.officialSourceUrl}
                note={item.note}
                learnMoreHref={item.learnMoreHref}
                confidence="uscis-estimate"
                confidenceNote="Estimates only — actual times vary by form, category and the USCIS office/service center handling your case. Not a national USCIS guarantee. Check your own case on the official processing-times tool."
                premiumFeeType={
                  premiumFeeForm ? PREMIUM_FEE_TYPE[premiumFeeForm] : undefined
                }
              />
            );
          })}
        </div>

        <p className="mt-3 text-xs text-ink-400">
          {dashboardDisclaimers.processingTimeDisclaimer}
        </p>
      </section>

      {/* ── Tool CTAs (placed after the dashboard cards, before charts) ────── */}
      <section
        aria-labelledby="cta-heading"
        className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 sm:p-6"
      >
        <h2
          id="cta-heading"
          className="text-base font-bold tracking-tight text-ink-900 sm:text-lg"
        >
          Check your own case against these numbers
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-ink-500">
          Use these free, no-login tools to see where you stand — no receipt
          numbers or personal documents needed.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/tools/priority-date-checker"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
          >
            Check Priority Date →
          </Link>
          <Link
            href="/tools/green-card-stage-finder"
            className="rounded-lg border border-ink-900/10 bg-white px-4 py-2 text-sm font-semibold text-ink-700 shadow-sm transition-colors hover:bg-ink-50"
          >
            Find Green Card Stage →
          </Link>
          <Link
            href="/tools/uscis-case-status-meaning"
            className="rounded-lg border border-ink-900/10 bg-white px-4 py-2 text-sm font-semibold text-ink-700 shadow-sm transition-colors hover:bg-ink-50"
          >
            Decode USCIS Status →
          </Link>
        </div>
      </section>

      {/* ── Visa Bulletin Movement Chart ──────────────────────────────────── */}
      <section aria-labelledby="chart-heading">
        <div className="mb-4">
          <SectionHeading>
            <span id="chart-heading">Visa Bulletin Movement — EB India</span>
          </SectionHeading>
          <p className="mt-1 text-sm text-ink-500">
            Historical Final Action Date and Dates for Filing movement. Select
            category and country with the controls below.
          </p>
        </div>
        <TrackerCharts />
        <p className="mt-3 text-xs text-ink-400">
          {dashboardDisclaimers.visaBulletinDisclaimer}
        </p>
        <div className="mt-2 text-xs text-ink-400">
          Source:{" "}
          <a
            href={visaBulletinIndia.officialSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-600 underline decoration-brand-200 underline-offset-2"
          >
            {visaBulletinIndia.officialSourceName}
          </a>
        </div>
      </section>

      {/* ── H1B Lottery History ───────────────────────────────────────────── */}
      <section aria-labelledby="h1b-history-heading">
        <div className="mb-4">
          <SectionHeading>
            <span id="h1b-history-heading">H1B Lottery Selection Rate History</span>
          </SectionHeading>
          <p className="mt-1 text-sm text-ink-500">
            USCIS-selected registrations vs. total eligible registrations each fiscal year.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-ink-900/5 bg-white shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-900/5 bg-ink-50/60">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-400">
                  Fiscal Year
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-ink-400">
                  Eligible
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-ink-400">
                  Selected
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-ink-400">
                  Odds
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-900/5">
              {[...h1bLottery.historicalData].reverse().map((row) => (
                <tr key={row.year} className="hover:bg-ink-50/40">
                  <td className="px-4 py-3 font-semibold text-ink-900">
                    {row.year}
                  </td>
                  <td className="px-4 py-3 text-right text-ink-600">
                    {row.eligible.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-ink-600">
                    {row.selected.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
                      {row.oddsDisplay}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-t border-ink-900/5 px-4 py-3">
            <DataStamp
              lastUpdated={h1bLottery.lastUpdated}
              source={h1bLottery.officialSourceUrl}
              sourceLabel={h1bLottery.officialSourceName}
            />
          </div>
        </div>

        {/* The selection method itself changed — more consequential than any
            single year's rate, so it sits with the data rather than in a
            footnote. */}
        <div className="mt-3 rounded-xl border-l-4 border-amber-400 bg-amber-50/70 px-4 py-3">
          <p className="text-sm font-bold text-ink-900">
            How selection works changed from{" "}
            {h1bLottery.selectionMethodChange.appliesFrom}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-ink-700">
            {h1bLottery.selectionMethodChange.summary}
          </p>
          <p className="mt-2 text-xs text-ink-500">
            Source:{" "}
            <a
              href={h1bLottery.selectionMethodChange.ruleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline"
            >
              {h1bLottery.selectionMethodChange.ruleTitle}
            </a>{" "}
            — {h1bLottery.selectionMethodChange.citation}, published{" "}
            {h1bLottery.selectionMethodChange.publishedDate}, effective{" "}
            {h1bLottery.selectionMethodChange.effectiveDate}.
          </p>
        </div>

        <p className="mt-2 text-xs text-ink-400">
          {h1bLottery.calculationNote}
        </p>
      </section>

      {/* ── I-485 Backlog Breakdown ───────────────────────────────────────── */}
      <section aria-labelledby="backlog-heading">
        <div className="mb-4">
          <SectionHeading>
            <span id="backlog-heading">India I-485 Pending — by EB Category</span>
          </SectionHeading>
          <p className="mt-1 text-sm text-ink-500">
            USCIS snapshot as of {inventoryMeta.snapshotDate}. Counts only
            Form I-485 (in-US) filers — consular-processing cases not included.
          </p>
          <p className="mt-1 text-xs text-ink-400">
            {i485BacklogIndia.cardLabel} {i485BacklogIndia.note}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {(
            [
              { label: "EB-1 India Pending", count: greenCardBacklog.breakdown.EB1, accent: "from-emerald-600 to-teal-600" },
              { label: "EB-2 India Pending", count: greenCardBacklog.breakdown.EB2, accent: "from-blue-600 to-indigo-600" },
              { label: "EB-3 India Pending", count: greenCardBacklog.breakdown.EB3, accent: "from-violet-600 to-purple-600" },
            ] as const
          ).map((row) => (
            <div
              key={row.label}
              className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card"
            >
              <span
                className={`inline-block rounded-lg bg-gradient-to-br ${row.accent} px-2 py-0.5 text-xs font-bold text-white`}
              >
                {row.label.split(" ")[0]}
              </span>
              <p className="mt-2 text-2xl font-extrabold tracking-tight text-ink-900">
                {row.count.toLocaleString()}
              </p>
              <p className="mt-0.5 text-xs text-ink-400">{row.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-3">
          <DataStamp
            lastUpdated={greenCardBacklog.lastUpdated}
            source={greenCardBacklog.officialSourceUrl}
            sourceLabel={greenCardBacklog.officialSourceName}
          />
        </div>
      </section>

      {/* ── What Changed This Month ───────────────────────────────────────── */}
      <section aria-labelledby="changes-heading">
        <div className="mb-4">
          <SectionHeading>
            <span id="changes-heading">What Changed This Month?</span>
          </SectionHeading>
          <p className="mt-1 text-sm text-ink-500">
            Current {bulletin.month} Visa Bulletin cutoffs for India. Movement is
            only shown when verified against the previous official bulletin.
          </p>
        </div>

        {/* July 2026 retrogression note */}
        <div className="mb-3 rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3 text-sm text-amber-900">
          {visaBulletinIndia.retrogressionNote}
        </div>

        <div className="space-y-3">
          {[
            {
              category: "EB-1 India",
              cat: EB1,
              accent: "bg-emerald-50 border-emerald-100 text-emerald-900",
              dot: "bg-emerald-500",
            },
            {
              category: "EB-2 India",
              cat: EB2,
              accent: "bg-blue-50 border-blue-100 text-blue-900",
              dot: "bg-blue-500",
            },
            {
              category: "EB-3 India",
              cat: EB3,
              accent: "bg-violet-50 border-violet-100 text-violet-900",
              dot: "bg-violet-500",
            },
          ].map(({ category, cat, accent, dot }) => ({
            category,
            accent,
            dot,
            fad: `Final Action Date: ${formatCutoff(cat.currentFinalActionDate)} — ${cat.finalActionMovementLabel}${cat.previousFinalActionDate ? ` (from ${formatCutoff(cat.previousFinalActionDate)} in June 2026)` : ""}`,
            dff: `Dates for Filing: ${formatCutoff(cat.currentDatesForFiling)} — ${cat.datesForFilingMovementLabel}`,
          })).map((item) => (
            <div
              key={item.category}
              className={`rounded-xl border px-4 py-3 ${item.accent}`}
            >
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${item.dot}`} aria-hidden />
                <span className="text-sm font-bold">{item.category}</span>
              </div>
              <ul className="mt-2 space-y-1 pl-4 text-sm">
                <li>• {item.fad}</li>
                <li>• {item.dff}</li>
              </ul>
            </div>
          ))}

          <div className="rounded-xl border border-ink-100 bg-ink-50/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-ink-400" aria-hidden />
              <span className="text-sm font-bold text-ink-700">I-485 Backlog &amp; Processing Times</span>
            </div>
            <p className="mt-2 pl-4 text-sm text-ink-600">
              India I-485 pending: {greenCardBacklog.valueDisplay} (USCIS snapshot {greenCardBacklog.snapshotDate}).{" "}
              Processing times were last updated {processingTimes.lastUpdated} — verify latest at{" "}
              <a
                href={processingTimes.officialSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 underline"
              >
                USCIS processing times tool
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* ── Email capture ─────────────────────────────────────────────────── */}
      <ImmigrationEmailSignup source="immigration-tracker" />

      {/* ── Share (top placement, near email capture) ─────────────────────── */}
      <ShareTrackerBlock url={TRACKER_URL} />

      {/* ── Explainer Section ─────────────────────────────────────────────── */}
      <section aria-labelledby="explainer-heading">
        <div className="mb-4">
          <SectionHeading>
            <span id="explainer-heading">How This Works — Key Concepts</span>
          </SectionHeading>
        </div>

        <div className="space-y-2">
          <ExplainerCard
            question="What is a Final Action Date?"
            answer="The Final Action Date (FAD) is the cutoff date set monthly by the U.S. Department of State in the Visa Bulletin. A green card application (I-485 or immigrant visa) can only be approved once the applicant's priority date is earlier than the FAD for their category and country of birth. If your priority date is behind the FAD, you are still waiting in the queue."
          />
          <ExplainerCard
            question="What is Dates for Filing?"
            answer="Dates for Filing (DFF) is a second, earlier cutoff in the Visa Bulletin that, in months when USCIS activates it (not every month), allows applicants to submit their Form I-485 before their FAD is reached. Filing early unlocks EAD (work permit) and Advance Parole (travel document) benefits while you continue waiting for the FAD to advance to your priority date."
          />
          <ExplainerCard
            question="Why does EB-2 India have such a large backlog?"
            answer="US law limits employment-based green cards to roughly 140,000 per year globally, and no single country of birth may use more than 7% (~9,800) of that annual supply. India's demand far exceeds 9,800 slots every year, so unused demand from the current year carries forward into future years, creating a compounding backlog that now stretches over a decade for EB-2 and EB-3 India applicants."
          />
          <ExplainerCard
            question="What does the I-485 backlog number mean?"
            answer="The I-485 backlog is the count of Form I-485 (Adjustment of Status) applications already filed with USCIS and waiting in queue. USCIS publishes periodic snapshots of this data by country of birth and priority year. The India number (currently ~66,000) is the count of people who have already filed their I-485 and are waiting for their FAD to be reached — it understates true demand because many eligible applicants haven't filed yet."
          />
          <ExplainerCard
            question="Why are USCIS processing times estimates and not guarantees?"
            answer="USCIS processing times reflect recent completions across thousands of cases at multiple service centers. They shift monthly based on staffing, case complexity, RFE (Request for Evidence) rates, and overall filing volumes. Cases outside the published timeframe may not have any problem — times vary widely by case. Always check the official USCIS processing times tool for your specific form and service center."
          />
          <ExplainerCard
            question="Why do H1B lottery odds change every year?"
            answer="The H-1B cap (65,000 regular + 20,000 advanced-degree exemption) is fixed by law. Odds depend on how many employers register. If employers register fewer candidates (e.g., during economic slowdowns), odds improve. If more register (tech hiring booms), odds drop. Each year's odds are based on that year's registration count and USCIS selection methodology, which can change."
          />
        </div>
      </section>

      {/* ── Internal Links ────────────────────────────────────────────────── */}
      <section aria-labelledby="links-heading">
        <div className="mb-4">
          <SectionHeading>
            <span id="links-heading">Go Deeper</span>
          </SectionHeading>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: "/visa-bulletin", icon: "📅", title: "Visa Bulletin Guide", desc: "Understand how the monthly bulletin works and what the dates mean." },
            { href: "/tools/priority-date-checker", icon: "🔍", title: "Priority Date Checker", desc: "Check if your priority date is current for EB-1, EB-2, or EB-3 India." },
            { href: "/green-card", icon: "🟢", title: "Green Card Guide", desc: "Full guide to PERM, I-140, I-485, and the employment-based green card process." },
            { href: "/tools/green-card-stage-finder", icon: "🗺️", title: "Green Card Stage Finder", desc: "Find out exactly where you are in the green card process." },
            { href: "/uscis", icon: "🛂", title: "USCIS Hub", desc: "Case status decoder, receipt decoder, form finder, and more USCIS tools." },
            { href: "/uscis/processing-times", icon: "⏱️", title: "Processing Times Guide", desc: "Understand USCIS processing times and what to do if your case is delayed." },
            { href: "/tools/uscis-processing-delay-checker", icon: "🔔", title: "Delay Checker", desc: "Is your USCIS case outside normal processing time? Check here." },
            { href: "/h1b", icon: "💼", title: "H1B Guide", desc: "H-1B transfer, extension, layoff, and lottery — complete guide for Indians." },
            { href: "/tools/h1b-transfer-risk-checklist", icon: "📋", title: "H1B Transfer Checklist", desc: "Planning an H-1B transfer or between jobs? Review your risks first." },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-start gap-3 rounded-xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <span
                aria-hidden
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink-50 text-lg"
              >
                {link.icon}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold tracking-tight text-ink-900 group-hover:text-brand-700">
                  {link.title}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-ink-500">
                  {link.desc}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section aria-labelledby="faq-heading">
        <div className="mb-4">
          <SectionHeading>
            <span id="faq-heading">Frequently Asked Questions</span>
          </SectionHeading>
        </div>

        <div className="space-y-2">
          {faqItems.map((item) => (
            <ExplainerCard
              key={item.question}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </section>

      {/* ── Source verification note ──────────────────────────────────────── */}
      <div className="rounded-xl border border-ink-100 bg-ink-50/40 px-4 py-4 text-xs leading-relaxed text-ink-500">
        <strong className="font-semibold text-ink-700">Data sources &amp; verification.</strong>{" "}
        {dashboardDisclaimers.sourceVerificationDisclaimer} Official sources used on this page:{" "}
        <a
          href="https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-600 underline"
        >
          U.S. Department of State Visa Bulletin
        </a>
        {" · "}
        <a
          href="https://egov.uscis.gov/processing-times/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-600 underline"
        >
          USCIS Processing Times
        </a>
        {" · "}
        <a
          href="https://www.uscis.gov/tools/reports-and-studies/immigration-and-citizenship-data"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-600 underline"
        >
          USCIS I-485 Inventory Data
        </a>
        {" · "}
        <a
          href="https://www.uscis.gov/working-in-the-united-states/temporary-workers/h-1b-specialty-occupations/h-1b-electronic-registration-process"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-600 underline"
        >
          USCIS H-1B Registration
        </a>
      </div>

      {/* ── Share (bottom placement) ──────────────────────────────────────── */}
      <ShareTrackerBlock url={TRACKER_URL} />

      {/* ── Disclaimer ───────────────────────────────────────────────────── */}
      <BottomDisclaimer>
        <p>
          <strong className="font-semibold">Not legal advice.</strong>{" "}
          {dashboardDisclaimers.standardDisclaimer}
        </p>
        <p>{dashboardDisclaimers.adLandingDisclaimer}</p>
      </BottomDisclaimer>
    </div>
  );
}
