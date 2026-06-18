"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import OrganizerNav from "./OrganizerNav";
import PrivacyNotice from "./PrivacyNotice";
import OrganizerDisclaimer from "./OrganizerDisclaimer";
import { useOrganizer } from "@/lib/nri-tax/storage";

const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

const RISK_STYLES: Record<string, string> = {
  Low: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Medium: "bg-amber-50 text-amber-700 ring-amber-600/20",
  High: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-ink-900/5 bg-white p-4 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">{label}</p>
      <p className="mt-1 text-xl font-bold tracking-tight text-ink-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  );
}

export default function OrganizerDashboard() {
  const org = useOrganizer();
  const router = useRouter();

  if (!org.ready) {
    return (
      <Container className="py-10">
        <p className="text-ink-500">Loading your organizer…</p>
      </Container>
    );
  }

  const { totals, riskScore, rules, missingInfo } = org.summary;
  const isEmpty = org.assets.length === 0 && org.income.length === 0;
  const activeFlags = rules.filter((r) => r.status !== "Likely not applicable" && r.status !== "Not enough information");

  return (
    <Container className="py-8">
      <OrganizerNav
        taxYear={org.taxYear}
        availableYears={org.availableYears}
        onYearChange={org.setTaxYear}
      />

      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-900">
            Your {org.taxYear} wealth & tax dashboard
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            An educational snapshot of your cross-border money map and the topics to review.
          </p>
        </div>
        <span
          className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ring-1 ring-inset ${RISK_STYLES[riskScore]}`}
        >
          Review level: {riskScore}
        </span>
      </div>

      {isEmpty && (
        <div className="mb-6 rounded-2xl border border-brand-200 bg-brand-50/60 p-5">
          <h2 className="text-base font-bold text-ink-900">Start your checkup</h2>
          <p className="mt-1 text-sm text-ink-600">
            Add your profile, then your India and U.S. assets and income. Want to see how it works
            first? Load sample data for a fictional NRI family.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/nri-wealth-checkup/profile"
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Set up profile →
            </Link>
            <Link
              href="/nri-wealth-checkup/report?sample=1"
              className="rounded-lg border border-ink-900/15 bg-white px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-900/5"
            >
              View sample report
            </Link>
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total U.S. assets" value={usd(totals.usAssets)} />
        <StatCard label="Total India assets" value={usd(totals.indiaAssets)} />
        <StatCard label="Other foreign assets" value={usd(totals.otherForeignAssets)} />
        <StatCard
          label="Foreign tax / TDS paid"
          value={usd(totals.foreignTaxPaidOrTds)}
          hint="May support a foreign tax credit discussion"
        />
        <StatCard
          label="Foreign financial accounts (FBAR screen)"
          value={usd(totals.foreignFinancialAccountsMax)}
          hint="Max during year · $10,000 line"
        />
        <StatCard
          label="Specified foreign assets (FATCA screen)"
          value={usd(totals.specifiedForeignFinancialAssetsYearEnd)}
          hint="Year-end · vs Form 8938 threshold"
        />
        <StatCard label="India-source income" value={usd(totals.indiaSourceIncome)} />
        <StatCard
          label="Active review flags"
          value={String(activeFlags.length)}
          hint="Topics to discuss with your CPA/CA"
        />
      </div>

      {missingInfo.length > 0 && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="text-base font-bold text-amber-900">Missing info checklist</h2>
          <ul className="mt-2 space-y-1.5 text-sm text-amber-900">
            {missingInfo.map((m) => (
              <li key={m} className="flex items-start gap-2">
                <span aria-hidden className="mt-1.5 h-1 w-1 flex-none rounded-full bg-amber-500" />
                {m}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={() => {
            org.saveReport();
            router.push("/nri-wealth-checkup/report");
          }}
          className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-brand-700"
        >
          Generate Annual Report →
        </button>
        <Link
          href="/nri-wealth-checkup/assets"
          className="rounded-xl border border-ink-900/15 bg-white px-5 py-3 text-sm font-semibold text-ink-700 hover:bg-ink-900/5"
        >
          Add / edit assets
        </Link>
        <Link
          href="/nri-wealth-checkup/income"
          className="rounded-xl border border-ink-900/15 bg-white px-5 py-3 text-sm font-semibold text-ink-700 hover:bg-ink-900/5"
        >
          Add / edit income
        </Link>
      </div>

      <PrivacyNotice className="mt-8" />
      <OrganizerDisclaimer className="mt-4" />
    </Container>
  );
}
