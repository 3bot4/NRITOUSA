"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "@/components/Container";
import OrganizerNav from "./OrganizerNav";
import PrivacyNotice from "./PrivacyNotice";
import OrganizerDisclaimer from "./OrganizerDisclaimer";
import { NumberField, SelectField, TextField } from "./FieldKit";
import { useOrganizer } from "@/lib/nri-tax/storage";
import {
  ASSET_TYPES,
  assetMeta,
  HELD_OPTIONS,
  OWNERSHIP_OPTIONS,
  type AssetItem,
  type AssetType,
} from "@/lib/nri-tax/types";

type Draft = Omit<AssetItem, "id" | "userId" | "taxYear" | "createdAt" | "updatedAt">;

const ASSET_OPTIONS = ASSET_TYPES.map((a) => ({ value: a.value, label: a.label }));

function emptyDraft(): Draft {
  const meta = assetMeta("INDIA_NRO_ACCOUNT");
  return {
    assetType: "INDIA_NRO_ACCOUNT",
    country: meta.defaultCountry,
    institutionOrAssetNickname: "",
    currency: meta.defaultCurrency,
    yearEndValue: null,
    maximumYearValue: null,
    incomeGenerated: null,
    taxPaidOrTds: null,
    ownershipType: "self",
    heldDirectlyOrEntity: "direct",
    notes: "",
  };
}

const usd = (n: number | null) => (n == null ? "—" : `$${Math.round(n).toLocaleString("en-US")}`);

export default function OrganizerAssets() {
  const org = useOrganizer();
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [editingId, setEditingId] = useState<string | null>(null);

  if (!org.ready) {
    return (
      <Container className="py-10">
        <p className="text-ink-500">Loading…</p>
      </Container>
    );
  }

  const set = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));

  const onTypeChange = (t: AssetType) => {
    const meta = assetMeta(t);
    set({ assetType: t, country: meta.defaultCountry, currency: meta.defaultCurrency });
  };

  const reset = () => {
    setDraft(emptyDraft());
    setEditingId(null);
  };

  const submit = () => {
    if (editingId) {
      org.updateAsset(editingId, draft);
    } else {
      org.addAsset(draft);
    }
    reset();
  };

  const startEdit = (a: AssetItem) => {
    setEditingId(a.id);
    setDraft({
      assetType: a.assetType,
      country: a.country,
      institutionOrAssetNickname: a.institutionOrAssetNickname,
      currency: a.currency,
      yearEndValue: a.yearEndValue,
      maximumYearValue: a.maximumYearValue,
      incomeGenerated: a.incomeGenerated,
      taxPaidOrTds: a.taxPaidOrTds,
      ownershipType: a.ownershipType,
      heldDirectlyOrEntity: a.heldDirectlyOrEntity,
      notes: a.notes,
    });
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const meta = assetMeta(draft.assetType);

  return (
    <Container className="py-8">
      <OrganizerNav
        taxYear={org.taxYear}
        availableYears={org.availableYears}
        onYearChange={org.setTaxYear}
      />
      <h1 className="text-2xl font-bold tracking-tight text-ink-900">Assets ({org.taxYear})</h1>
      <p className="mt-1 text-sm text-ink-500">
        Add India and U.S. accounts, investments, and property. Use approximate USD-equivalent
        values and nicknames only.
      </p>

      <PrivacyNotice className="mt-5" />

      {/* Add / edit form */}
      <div className="mt-6 rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card">
        <h2 className="text-base font-bold text-ink-900">
          {editingId ? "Edit asset" : "Add an asset"}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Asset type"
            value={draft.assetType}
            onChange={(v) => onTypeChange(v as AssetType)}
            options={ASSET_OPTIONS}
          />
          <TextField
            label="Nickname"
            value={draft.institutionOrAssetNickname}
            onChange={(v) => set({ institutionOrAssetNickname: v })}
            placeholder="e.g. HDFC NRO, Mumbai apartment"
          />
          <TextField label="Country" value={draft.country} onChange={(v) => set({ country: v })} />
          <TextField
            label="Currency"
            value={draft.currency}
            onChange={(v) => set({ currency: v })}
            hint="Enter values below as USD equivalent"
          />
          <NumberField
            label="Year-end value (USD equiv.)"
            value={draft.yearEndValue}
            onChange={(v) => set({ yearEndValue: v })}
            prefix="$"
          />
          <NumberField
            label="Maximum value during year (USD equiv.)"
            value={draft.maximumYearValue}
            onChange={(v) => set({ maximumYearValue: v })}
            prefix="$"
            hint="FBAR uses the maximum, not year-end"
          />
          <NumberField
            label="Income generated (USD equiv.)"
            value={draft.incomeGenerated}
            onChange={(v) => set({ incomeGenerated: v })}
            prefix="$"
          />
          <NumberField
            label="India tax / TDS paid (USD equiv.)"
            value={draft.taxPaidOrTds}
            onChange={(v) => set({ taxPaidOrTds: v })}
            prefix="$"
          />
          <SelectField
            label="Ownership"
            value={draft.ownershipType}
            onChange={(v) => set({ ownershipType: v })}
            options={OWNERSHIP_OPTIONS}
          />
          <SelectField
            label="Held directly or through an entity?"
            value={draft.heldDirectlyOrEntity}
            onChange={(v) => set({ heldDirectlyOrEntity: v })}
            options={HELD_OPTIONS}
          />
          <div className="sm:col-span-2">
            <TextField
              label="Notes (optional)"
              value={draft.notes}
              onChange={(v) => set({ notes: v })}
              placeholder="Anything to remember for your CPA/CA"
            />
          </div>
        </div>

        {/* Live screening hints for the selected type */}
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {meta.isForeignFinancialAccount && !meta.isRealEstateOrPhysical && (
            <span className="rounded-full bg-brand-50 px-2 py-0.5 font-semibold text-brand-700">
              Counts for FBAR screen
            </span>
          )}
          {meta.isFatcaSpecifiedAsset && !meta.isRealEstateOrPhysical && (
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-700">
              Counts for FATCA / 8938 screen
            </span>
          )}
          {meta.isPficRisk && (
            <span className="rounded-full bg-rose-50 px-2 py-0.5 font-semibold text-rose-700">
              Possible PFIC / Form 8621
            </span>
          )}
          {meta.isRealEstateOrPhysical && (
            <span className="rounded-full bg-amber-50 px-2 py-0.5 font-semibold text-amber-700">
              Real estate / physical — excluded from FBAR & 8938 financial-asset count
            </span>
          )}
          {meta.isForeignEntity && (
            <span className="rounded-full bg-purple-50 px-2 py-0.5 font-semibold text-purple-700">
              Foreign entity — extra forms may apply
            </span>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={submit}
            disabled={!draft.institutionOrAssetNickname.trim()}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {editingId ? "Save changes" : "Add asset"}
          </button>
          {editingId && (
            <button
              onClick={reset}
              className="rounded-lg border border-ink-900/15 bg-white px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-900/5"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Asset list */}
      <div className="mt-6">
        <h2 className="text-base font-bold text-ink-900">
          Your assets ({org.assets.length})
        </h2>
        {org.assets.length === 0 ? (
          <p className="mt-2 rounded-2xl border border-dashed border-ink-900/15 bg-white p-6 text-sm text-ink-400">
            No assets yet. Add your India accounts (e.g. &ldquo;HDFC NRE&rdquo;), investments, and
            property above. Example: an NRO account with a $12,000 maximum balance.
          </p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-2xl border border-ink-900/5 bg-white shadow-card">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-ink-900/10 text-left text-xs uppercase tracking-wider text-ink-400">
                  <th className="px-4 py-3 font-semibold">Asset</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Year-end</th>
                  <th className="px-4 py-3 font-semibold">Max</th>
                  <th className="px-4 py-3 font-semibold">TDS</th>
                  <th className="px-4 py-3 font-semibold" />
                </tr>
              </thead>
              <tbody>
                {org.assets.map((a) => (
                  <tr key={a.id} className="border-b border-ink-900/5 last:border-0">
                    <td className="px-4 py-3 font-semibold text-ink-900">
                      {a.institutionOrAssetNickname || "—"}
                    </td>
                    <td className="px-4 py-3 text-ink-500">{assetMeta(a.assetType).label}</td>
                    <td className="px-4 py-3 text-ink-700">{usd(a.yearEndValue)}</td>
                    <td className="px-4 py-3 text-ink-700">{usd(a.maximumYearValue)}</td>
                    <td className="px-4 py-3 text-ink-700">{usd(a.taxPaidOrTds)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => startEdit(a)}
                        className="mr-3 text-xs font-semibold text-brand-600 hover:text-brand-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => org.deleteAsset(a.id)}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/nri-wealth-checkup/income"
          className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700"
        >
          Next: add income & TDS →
        </Link>
        <Link
          href="/nri-wealth-checkup/dashboard"
          className="rounded-xl border border-ink-900/15 bg-white px-5 py-3 text-sm font-semibold text-ink-700 hover:bg-ink-900/5"
        >
          Back to dashboard
        </Link>
      </div>

      <OrganizerDisclaimer className="mt-8" />
    </Container>
  );
}
