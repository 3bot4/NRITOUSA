"use client";

import { useRouter } from "next/navigation";
import { localStorageAdapter, currentTaxYear } from "@/lib/nri-tax/storage";
import { sampleAssets, sampleIncome, sampleProfile } from "@/lib/nri-tax/sample";

/**
 * Landing-page CTAs. "Start Free Checkup" goes straight to the profile step.
 * "Download Sample Report" seeds the fictional NRI family into localStorage and
 * opens the report so visitors can see the output before entering anything.
 */
export default function LandingActions() {
  const router = useRouter();

  const loadSampleAndView = async () => {
    const year = currentTaxYear();
    const data = await localStorageAdapter.load();
    await localStorageAdapter.save({
      ...data,
      userId: "local-user",
      profiles: [
        ...data.profiles.filter((p) => p.taxYear !== year),
        { ...sampleProfile(year), userId: "local-user" },
      ],
      assets: [
        ...data.assets.filter((a) => a.taxYear !== year),
        ...sampleAssets(year).map((a) => ({ ...a, userId: "local-user" })),
      ],
      income: [
        ...data.income.filter((i) => i.taxYear !== year),
        ...sampleIncome(year).map((i) => ({ ...i, userId: "local-user" })),
      ],
    });
    router.push("/nri-wealth-checkup/report");
  };

  return (
    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
      <button
        onClick={() => router.push("/nri-wealth-checkup/profile")}
        className="rounded-xl bg-white px-6 py-3.5 text-base font-bold text-ink-900 shadow-sm transition-transform hover:-translate-y-0.5"
      >
        Start Free Checkup →
      </button>
      <button
        onClick={loadSampleAndView}
        className="rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-base font-bold text-white backdrop-blur transition-colors hover:bg-white/20"
      >
        Download Sample Report
      </button>
    </div>
  );
}
