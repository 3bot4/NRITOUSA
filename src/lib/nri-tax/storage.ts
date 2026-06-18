"use client";

/**
 * Storage layer for the NRI Global Wealth & Tax Organizer.
 *
 * The default adapter persists everything in the browser's localStorage, so the
 * tool works with NO account, NO server, and NO database — consistent with the
 * rest of the site ("all tools are 100% client-side; no database is involved")
 * and with the privacy promise: sensitive financial data never leaves the
 * user's device.
 *
 * `StorageAdapter` is intentionally a small async interface so a server-backed
 * implementation (Supabase/Postgres + magic-link auth) can be dropped in later
 * without touching the UI. See docs/NRI-WEALTH-ORGANIZER.md for the Supabase
 * schema + env vars upgrade path.
 */

import { useCallback, useEffect, useState } from "react";
import type {
  AnnualReport,
  AssetItem,
  ComputedSummary,
  IncomeItem,
  UserProfile,
} from "./types";
import { buildSummary } from "./rules";

const STORAGE_KEY = "nritousa.wealth-organizer.v1";
const LOCAL_USER_ID = "local-user";

export interface OrganizerData {
  userId: string;
  profiles: UserProfile[]; // one per tax year
  assets: AssetItem[];
  income: IncomeItem[];
  reports: AnnualReport[];
}

function emptyData(): OrganizerData {
  return { userId: LOCAL_USER_ID, profiles: [], assets: [], income: [], reports: [] };
}

export interface StorageAdapter {
  load(): Promise<OrganizerData>;
  save(data: OrganizerData): Promise<void>;
  clear(): Promise<void>;
}

/** Browser localStorage adapter (default). */
export const localStorageAdapter: StorageAdapter = {
  async load() {
    if (typeof window === "undefined") return emptyData();
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return emptyData();
      const parsed = JSON.parse(raw) as Partial<OrganizerData>;
      return {
        userId: parsed.userId ?? LOCAL_USER_ID,
        profiles: parsed.profiles ?? [],
        assets: parsed.assets ?? [],
        income: parsed.income ?? [],
        reports: parsed.reports ?? [],
      };
    } catch {
      return emptyData();
    }
  },
  async save(data) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },
  async clear() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEY);
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const now = () => new Date().toISOString();

export const currentTaxYear = (): number => {
  // Default to the prior calendar year (the year people are organizing/filing for).
  const y = new Date().getFullYear();
  return new Date().getMonth() <= 3 ? y - 1 : y - 1;
};

export function makeDefaultProfile(taxYear: number): UserProfile {
  return {
    userId: LOCAL_USER_ID,
    taxYear,
    usStatus: "not_sure",
    filingStatus: "not_sure",
    livingLocationForTax: "us",
    state: "",
    indiaTaxStatus: "not_sure",
    daysInIndia: null,
    hasSpouse: false,
    spouseUsPersonStatus: "na",
    createdAt: now(),
    updatedAt: now(),
  };
}

// ---------------------------------------------------------------------------
// React hook — the single entry point the UI uses.
// ---------------------------------------------------------------------------

export interface UseOrganizer {
  ready: boolean;
  taxYear: number;
  setTaxYear: (y: number) => void;
  availableYears: number[];
  profile: UserProfile;
  assets: AssetItem[];
  income: IncomeItem[];
  summary: ComputedSummary;
  saveProfile: (patch: Partial<UserProfile>) => void;
  addAsset: (item: Omit<AssetItem, "id" | "userId" | "taxYear" | "createdAt" | "updatedAt">) => void;
  updateAsset: (id: string, patch: Partial<AssetItem>) => void;
  deleteAsset: (id: string) => void;
  addIncome: (item: Omit<IncomeItem, "id" | "userId" | "taxYear" | "createdAt" | "updatedAt">) => void;
  updateIncome: (id: string, patch: Partial<IncomeItem>) => void;
  deleteIncome: (id: string) => void;
  saveReport: () => AnnualReport;
  duplicateYear: (fromYear: number, toYear: number) => void;
  resetAll: () => void;
  importData: (data: OrganizerData) => void;
}

export function useOrganizer(adapter: StorageAdapter = localStorageAdapter): UseOrganizer {
  const [data, setData] = useState<OrganizerData>(emptyData());
  const [ready, setReady] = useState(false);
  const [taxYear, setTaxYear] = useState<number>(currentTaxYear());

  // Initial load.
  useEffect(() => {
    let active = true;
    adapter.load().then((d) => {
      if (!active) return;
      // Ensure a profile exists for the active year.
      let next = d;
      if (!d.profiles.some((p) => p.taxYear === taxYear)) {
        next = { ...d, profiles: [...d.profiles, makeDefaultProfile(taxYear)] };
      }
      setData(next);
      setReady(true);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist whenever data changes (after ready).
  const persist = useCallback(
    (next: OrganizerData) => {
      setData(next);
      void adapter.save(next);
    },
    [adapter]
  );

  // Ensure a profile row exists when switching to a new year.
  useEffect(() => {
    if (!ready) return;
    if (!data.profiles.some((p) => p.taxYear === taxYear)) {
      persist({ ...data, profiles: [...data.profiles, makeDefaultProfile(taxYear)] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taxYear, ready]);

  const profile =
    data.profiles.find((p) => p.taxYear === taxYear) ?? makeDefaultProfile(taxYear);
  const assets = data.assets.filter((a) => a.taxYear === taxYear);
  const income = data.income.filter((i) => i.taxYear === taxYear);
  const summary = buildSummary(profile, assets, income);

  const availableYears = Array.from(
    new Set([
      taxYear,
      ...data.profiles.map((p) => p.taxYear),
      currentTaxYear(),
      currentTaxYear() - 1,
    ])
  ).sort((a, b) => b - a);

  const saveProfile = (patch: Partial<UserProfile>) => {
    const others = data.profiles.filter((p) => p.taxYear !== taxYear);
    const updated: UserProfile = { ...profile, ...patch, taxYear, updatedAt: now() };
    persist({ ...data, profiles: [...others, updated] });
  };

  const addAsset: UseOrganizer["addAsset"] = (item) => {
    const full: AssetItem = {
      ...item,
      id: newId(),
      userId: data.userId,
      taxYear,
      createdAt: now(),
      updatedAt: now(),
    };
    persist({ ...data, assets: [...data.assets, full] });
  };
  const updateAsset: UseOrganizer["updateAsset"] = (id, patch) => {
    persist({
      ...data,
      assets: data.assets.map((a) => (a.id === id ? { ...a, ...patch, updatedAt: now() } : a)),
    });
  };
  const deleteAsset = (id: string) =>
    persist({ ...data, assets: data.assets.filter((a) => a.id !== id) });

  const addIncome: UseOrganizer["addIncome"] = (item) => {
    const full: IncomeItem = {
      ...item,
      id: newId(),
      userId: data.userId,
      taxYear,
      createdAt: now(),
      updatedAt: now(),
    };
    persist({ ...data, income: [...data.income, full] });
  };
  const updateIncome: UseOrganizer["updateIncome"] = (id, patch) => {
    persist({
      ...data,
      income: data.income.map((i) => (i.id === id ? { ...i, ...patch, updatedAt: now() } : i)),
    });
  };
  const deleteIncome = (id: string) =>
    persist({ ...data, income: data.income.filter((i) => i.id !== id) });

  const saveReport = (): AnnualReport => {
    const report: AnnualReport = {
      id: newId(),
      userId: data.userId,
      taxYear,
      computedSummaryJson: summary,
      riskScore: summary.riskScore,
      createdAt: now(),
      updatedAt: now(),
    };
    const others = data.reports.filter((r) => r.taxYear !== taxYear);
    persist({ ...data, reports: [...others, report] });
    return report;
  };

  const duplicateYear = (fromYear: number, toYear: number) => {
    const fromProfile = data.profiles.find((p) => p.taxYear === fromYear);
    const newProfile: UserProfile = fromProfile
      ? { ...fromProfile, taxYear: toYear, createdAt: now(), updatedAt: now() }
      : makeDefaultProfile(toYear);
    const copiedAssets = data.assets
      .filter((a) => a.taxYear === fromYear)
      .map((a) => ({ ...a, id: newId(), taxYear: toYear, createdAt: now(), updatedAt: now() }));
    const copiedIncome = data.income
      .filter((i) => i.taxYear === fromYear)
      .map((i) => ({ ...i, id: newId(), taxYear: toYear, createdAt: now(), updatedAt: now() }));
    persist({
      ...data,
      profiles: [...data.profiles.filter((p) => p.taxYear !== toYear), newProfile],
      assets: [...data.assets.filter((a) => a.taxYear !== toYear), ...copiedAssets],
      income: [...data.income.filter((i) => i.taxYear !== toYear), ...copiedIncome],
    });
    setTaxYear(toYear);
  };

  const resetAll = () => {
    void adapter.clear();
    const fresh = { ...emptyData(), profiles: [makeDefaultProfile(taxYear)] };
    setData(fresh);
  };

  const importData = (incoming: OrganizerData) => persist(incoming);

  return {
    ready,
    taxYear,
    setTaxYear,
    availableYears,
    profile,
    assets,
    income,
    summary,
    saveProfile,
    addAsset,
    updateAsset,
    deleteAsset,
    addIncome,
    updateIncome,
    deleteIncome,
    saveReport,
    duplicateYear,
    resetAll,
    importData,
  };
}
