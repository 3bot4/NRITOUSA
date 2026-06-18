"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "@/components/Container";
import OrganizerNav from "./OrganizerNav";
import PrivacyNotice from "./PrivacyNotice";
import OrganizerDisclaimer from "./OrganizerDisclaimer";
import { NumberField, SelectField, TextField } from "./FieldKit";
import { useOrganizer } from "@/lib/nri-tax/storage";
import { INCOME_TYPES, incomeMeta, type IncomeItem, type IncomeType } from "@/lib/nri-tax/types";

type Draft = Omit<IncomeItem, "id" | "userId" | "taxYear" | "createdAt" | "updatedAt">;

const INCOME_OPTIONS = INCOME_TYPES.map((i) => ({ value: i.value, label: i.label }));

function emptyDraft(): Draft {
  return {
    incomeType: "INDIA_NRO_INTEREST",
    countrySource: "India",
    amount: null,
    currency: "USD",
    taxPaidOrTds: null,
    relatedAssetId: undefined,
    notes: "",
  };
}

const usd = (n: number | null) => (n == null ? "—" : `$${Math.round(n).toLocaleString("en-US")}`);

export default function OrganizerIncome() {
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
  const onTypeChange = (t: IncomeType) => {
    const src = incomeMeta(t).source;
    set({
      incomeType: t,
      countrySource: src === "India" ? "India" : src === "US" ? "USA" : draft.countrySource,
    });
  };
  const reset = () => {
    setDraft(emptyDraft());
    setEditingId(null);
  };
  const submit = () => {
    if (editingId) org.updateIncome(editingId, draft);
    else org.addIncome(draft);
    reset();
  };
  const startEdit = (i: IncomeItem) => {
    setEditingId(i.id);
    setDraft({
      incomeType: i.incomeType,
      countrySource: i.countrySource,
      amount: i.amount,
      currency: i.currency,
      taxPaidOrTds: i.taxPaidOrTds,
      relatedAssetId: i.relatedAssetId,
      notes: i.notes,
    });
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const assetOptions = [
    { value: "", label: "— none —" },
    ...org.assets.map((a) => ({
      value: a.id,
      label: a.institutionOrAssetNickname || a.assetType,
    })),
  ];

  return (
    <Container className="py-8">
      <OrganizerNav
        taxYear={org.taxYear}
        availableYears={org.availableYears}
        onYearChange={org.setTaxYear}
      />
      <h1 className="text-2xl font-bold tracking-tight text-ink-900">Income & TDS ({org.taxYear})</h1>
      <p className="mt-1 text-sm text-ink-500">
        Add U.S. and India income, plus any India TDS/tax paid (used for the foreign tax credit
        discussion). Approximate USD-equivalent amounts only.
      </p>

      <PrivacyNotice className="mt-5" />

      <div className="mt-6 rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card">
        <h2 className="text-base font-bold text-ink-900">
          {editingId ? "Edit income" : "Add income"}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Income type"
            value={draft.incomeType}
            onChange={(v) => onTypeChange(v as IncomeType)}
            options={INCOME_OPTIONS}
          />
          <TextField
            label="Source country"
            value={draft.countrySource}
            onChange={(v) => set({ countrySource: v })}
          />
          <NumberField
            label="Amount (USD equiv.)"
            value={draft.amount}
            onChange={(v) => set({ amount: v })}
            prefix="$"
          />
          <NumberField
            label="India tax / TDS paid (USD equiv.)"
            value={draft.taxPaidOrTds}
            onChange={(v) => set({ taxPaidOrTds: v })}
            prefix="$"
            hint="Supports foreign tax credit / Form 1116 review"
          />
          <SelectField
            label="Related asset (optional)"
            value={draft.relatedAssetId ?? ""}
            onChange={(v) => set({ relatedAssetId: v ? v : undefined })}
            options={assetOptions}
          />
          <TextField
            label="Notes (optional)"
            value={draft.notes}
            onChange={(v) => set({ notes: v })}
          />
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={submit}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            {editingId ? "Save changes" : "Add income"}
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

      <div className="mt-6">
        <h2 className="text-base font-bold text-ink-900">Your income ({org.income.length})</h2>
        {org.income.length === 0 ? (
          <p className="mt-2 rounded-2xl border border-dashed border-ink-900/15 bg-white p-6 text-sm text-ink-400">
            No income yet. Example: NRO interest of $600 with $180 TDS, or India rental income of
            $4,000.
          </p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-2xl border border-ink-900/5 bg-white shadow-card">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-ink-900/10 text-left text-xs uppercase tracking-wider text-ink-400">
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Source</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">TDS</th>
                  <th className="px-4 py-3 font-semibold" />
                </tr>
              </thead>
              <tbody>
                {org.income.map((i) => (
                  <tr key={i.id} className="border-b border-ink-900/5 last:border-0">
                    <td className="px-4 py-3 font-semibold text-ink-900">
                      {incomeMeta(i.incomeType).label}
                    </td>
                    <td className="px-4 py-3 text-ink-500">{i.countrySource}</td>
                    <td className="px-4 py-3 text-ink-700">{usd(i.amount)}</td>
                    <td className="px-4 py-3 text-ink-700">{usd(i.taxPaidOrTds)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => startEdit(i)}
                        className="mr-3 text-xs font-semibold text-brand-600 hover:text-brand-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => org.deleteIncome(i.id)}
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
          href="/nri-wealth-checkup/report"
          className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700"
        >
          Next: generate report →
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
