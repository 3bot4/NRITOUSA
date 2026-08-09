/**
 * Pure math for the /shipping-household-goods-to-india calculator: volume →
 * per-mode shipping cost ranges, and declared value → Transfer-of-Residence-
 * aware customs duty for the bundled household-goods category. Every
 * constant comes from shippingIndiaRatesData.ts — nothing is hardcoded here.
 *
 * Two different "unverified" behaviors, deliberately:
 *  - A shipping-mode's rateLow/rateHigh being unverified blocks the whole
 *    cost number (never show a fabricated $ figure).
 *  - A shipping-mode's minCharge being unverified defaults to $0 — this can
 *    only understate a very small shipment's floor, never fabricate a
 *    specific wrong number, so it doesn't block the result.
 *  - A duty category's TR tiers being unverified blocks the TR-covered/
 *    dutiable split. The duty RATE being unverified additionally blocks the
 *    final $ duty amount even when the tiers are known — these are tracked
 *    separately (tierVerified vs rateVerified) so the UI can show "up to $X
 *    is covered by TR relief" as a known fact even while the applicable rate
 *    on the excess is still marked not verified.
 */
import {
  approxInrPerUsd,
  bhkPresets,
  boxSizePresets,
  cbfPerTwentyFootContainer,
  dutyCategoryConfig,
  householdGoodsDensity,
  shippingModeConfig,
  type ComputedDutyCategory,
  type ShippingMode,
} from "@/data/shippingIndiaRatesData";

const round2 = (n: number) => Math.round(n * 100) / 100;
const clampNonNegative = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);
const isVerified = (entry: { confidence: string; value: number | null }) =>
  entry.confidence !== "todo" && entry.value !== null;

/* ───────────────────────────── Volume / weight ─────────────────────────── */

export type VolumeBasis = "boxes" | "bhk";

export interface BoxCounts {
  small: number;
  medium: number;
  large: number;
}

export interface VolumeInput {
  basis: VolumeBasis;
  boxCounts: BoxCounts;
  bhkValue: string;
}

export interface VolumeResult {
  cbf: number;
  /** null when the density/BHK figures needed to derive weight aren't verified yet. */
  weightKg: number | null;
  verified: boolean;
  warnings: string[];
}

export function computeVolume(input: VolumeInput): VolumeResult {
  const warnings: string[] = [];

  if (input.basis === "bhk") {
    const preset = bhkPresets.find((p) => p.value === input.bhkValue);
    if (!preset) {
      return { cbf: 0, weightKg: null, verified: false, warnings: ["Select a BHK size."] };
    }
    const cbfVerified = isVerified(preset.cbf);
    const weightVerified = isVerified(preset.weightKg);
    if (!cbfVerified) warnings.push(preset.cbf.note);
    if (!weightVerified) warnings.push(preset.weightKg.note);
    return {
      cbf: cbfVerified ? (preset.cbf.value as number) : 0,
      weightKg: weightVerified ? (preset.weightKg.value as number) : null,
      verified: cbfVerified,
      warnings,
    };
  }

  // basis === "boxes"
  const counts = input.boxCounts;
  let cbf = 0;
  for (const preset of boxSizePresets) {
    const n = clampNonNegative(counts[preset.value as keyof BoxCounts] ?? 0);
    cbf += n * preset.cbf;
  }
  cbf = round2(cbf);

  const densityVerified = isVerified(householdGoodsDensity);
  if (!densityVerified) warnings.push(householdGoodsDensity.note);

  return {
    cbf,
    weightKg: densityVerified ? round2(cbf * (householdGoodsDensity.value as number)) : null,
    verified: cbf > 0,
    warnings,
  };
}

/* ─────────────────────────── Shipping cost per mode ─────────────────────── */

export interface ModeEstimate {
  mode: ShippingMode;
  label: string;
  shortLabel: string;
  verified: boolean;
  costLowUsd: number | null;
  costHighUsd: number | null;
  transitDaysLow: number | null;
  transitDaysHigh: number | null;
  note: string;
  /** Set when volume is far below a full 20ft container (sea FCL only). */
  underfilledContainerWarning?: string;
}

/** Computes cost/transit ranges for all four modes from a shared volume/weight. */
export function estimateShippingCosts(volume: VolumeResult): ModeEstimate[] {
  return (Object.keys(shippingModeConfig) as ShippingMode[]).map((mode) => {
    const cfg = shippingModeConfig[mode];
    const rateLowOk = isVerified(cfg.rateLow);
    const rateHighOk = isVerified(cfg.rateHigh);
    // An unverified minimum charge defaults to $0 rather than blocking the
    // result — see module doc comment.
    const minCharge = isVerified(cfg.minCharge) ? (cfg.minCharge.value as number) : 0;
    const transitLowOk = cfg.transitDaysLow.value !== null;
    const transitHighOk = cfg.transitDaysHigh.value !== null;

    const verified = rateLowOk && rateHighOk;

    let costLowUsd: number | null = null;
    let costHighUsd: number | null = null;

    if (verified) {
      const basis =
        cfg.unit === "per_kg"
          ? volume.weightKg
          : cfg.unit === "per_cbf"
            ? volume.cbf
            : 1; // flat

      if (basis !== null) {
        costLowUsd = round2(Math.max((cfg.rateLow.value as number) * basis, minCharge));
        costHighUsd = round2(Math.max((cfg.rateHigh.value as number) * basis, minCharge));
      }
    }

    const note = verified
      ? cfg.unit === "per_kg"
        ? "Billed by chargeable weight — the greater of actual and volumetric weight."
        : cfg.unit === "per_cbf"
          ? "Billed by the volume you actually ship."
          : "Flat rate for the container regardless of how full it is."
      : `Rate not yet verified — ${cfg.rateLow.note}`;

    const result: ModeEstimate = {
      mode,
      label: cfg.label,
      shortLabel: cfg.shortLabel,
      verified: verified && costLowUsd !== null,
      costLowUsd,
      costHighUsd,
      transitDaysLow: transitLowOk ? (cfg.transitDaysLow.value as number) : null,
      transitDaysHigh: transitHighOk ? (cfg.transitDaysHigh.value as number) : null,
      note,
    };

    if (mode === "seaFcl" && volume.cbf > 0 && volume.cbf < cbfPerTwentyFootContainer * 0.5) {
      result.underfilledContainerWarning = `Your ${volume.cbf} CBF is well under a 20ft container's ~${cbfPerTwentyFootContainer} CBF capacity — FCL is rarely cost-effective at this volume; LCL is the usual choice.`;
    }

    return result;
  });
}

/* ──────────────────────────────── Duty ──────────────────────────────────── */

export interface DutyCategoryInput {
  category: ComputedDutyCategory;
  declaredValueUsd: number;
}

export interface DutyCategoryResult {
  category: ComputedDutyCategory;
  label: string;
  /** True once the TR value-tier structure is sourced (may be true even when rateVerified is false). */
  tierVerified: boolean;
  /** True once the duty rate applied to value above the tier is sourced. */
  rateVerified: boolean;
  /** Months abroad needed for the tier that matched (0 if none matched). */
  matchedTierMonths: number | null;
  declaredValueUsd: number;
  trCoveredValueUsd: number | null;
  dutiableValueUsd: number | null;
  dutyRatePct: number | null;
  estimatedDutyUsd: number | null;
  note: string;
}

/** Itemized TR-aware duty for the bundled household-goods category. */
export function estimateCategoryDuty(
  input: DutyCategoryInput,
  continuousYearsAbroad: number,
): DutyCategoryResult {
  const cfg = dutyCategoryConfig[input.category];
  const value = clampNonNegative(input.declaredValueUsd);
  const monthsAbroad = clampNonNegative(continuousYearsAbroad) * 12;

  const tiersVerified = cfg.trTiers.length > 0 && cfg.trTiers.every((t) => isVerified(t.capUsd));
  const rateVerified = isVerified(cfg.dutyRatePctBeyondRelief);

  if (!tiersVerified) {
    return {
      category: input.category,
      label: cfg.label,
      tierVerified: false,
      rateVerified,
      matchedTierMonths: null,
      declaredValueUsd: value,
      trCoveredValueUsd: null,
      dutiableValueUsd: null,
      dutyRatePct: null,
      estimatedDutyUsd: null,
      note: cfg.trTiers.find((t) => !isVerified(t.capUsd))?.capUsd.note ?? cfg.note,
    };
  }

  // Highest tier whose threshold the traveler's stay satisfies.
  const matchedTier = [...cfg.trTiers].sort((a, b) => b.minMonthsAbroad - a.minMonthsAbroad).find((t) => monthsAbroad >= t.minMonthsAbroad);

  const trCoveredValueUsd = matchedTier ? Math.min(value, matchedTier.capUsd.value as number) : 0;
  const dutiableValueUsd = round2(value - trCoveredValueUsd);

  if (!rateVerified) {
    return {
      category: input.category,
      label: cfg.label,
      tierVerified: true,
      rateVerified: false,
      matchedTierMonths: matchedTier?.minMonthsAbroad ?? null,
      declaredValueUsd: value,
      trCoveredValueUsd,
      dutiableValueUsd,
      dutyRatePct: null,
      estimatedDutyUsd: null,
      note: cfg.dutyRatePctBeyondRelief.note,
    };
  }

  const dutyRatePct = cfg.dutyRatePctBeyondRelief.value as number;
  const estimatedDutyUsd = round2((dutiableValueUsd * dutyRatePct) / 100);

  return {
    category: input.category,
    label: cfg.label,
    tierVerified: true,
    rateVerified: true,
    matchedTierMonths: matchedTier?.minMonthsAbroad ?? null,
    declaredValueUsd: value,
    trCoveredValueUsd,
    dutiableValueUsd,
    dutyRatePct,
    estimatedDutyUsd,
    note: cfg.note,
  };
}

/* ───────────────────────────── Total landed cost ────────────────────────── */

export interface LandedCostRow extends ModeEstimate {
  dutyTotalUsd: number;
  totalLowUsd: number | null;
  totalHighUsd: number | null;
  totalLowInr: number | null;
  totalHighInr: number | null;
}

/** Combines each mode's shipping-cost range with the (mode-independent) duty
 *  total into a single per-mode landed-cost row, in USD and INR. */
export function combineLandedCost(
  modes: ModeEstimate[],
  dutyTotalUsd: number,
): LandedCostRow[] {
  return modes.map((m) => {
    const totalLowUsd = m.costLowUsd !== null ? round2(m.costLowUsd + dutyTotalUsd) : null;
    const totalHighUsd = m.costHighUsd !== null ? round2(m.costHighUsd + dutyTotalUsd) : null;
    return {
      ...m,
      dutyTotalUsd,
      totalLowUsd,
      totalHighUsd,
      totalLowInr: totalLowUsd !== null ? Math.round(totalLowUsd * approxInrPerUsd) : null,
      totalHighInr: totalHighUsd !== null ? Math.round(totalHighUsd * approxInrPerUsd) : null,
    };
  });
}
