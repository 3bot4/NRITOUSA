/**
 * OCI cost estimation. Pure logic over the centralized fee config so the
 * Cost Calculator never hardcodes a dollar amount.
 */
import {
  GOVERNMENT_FEES,
  VFS_FEES,
  type FeeLine,
  type GovernmentFeeKey,
} from "@/lib/oci/config";

export interface CostInputs {
  serviceType: GovernmentFeeKey;
  /** Optional add-ons toggled on by the user. */
  returnCourier: boolean;
  sms: boolean;
  premiumLounge: boolean;
  /** Number of applicants (e.g. a family applying together). */
  applicants: number;
}

export const DEFAULT_COST_INPUTS: CostInputs = {
  serviceType: "freshAdult",
  returnCourier: true,
  sms: false,
  premiumLounge: false,
  applicants: 1,
};

export interface CostBreakdown {
  /** Per-application line items (before multiplying by applicants). */
  lines: FeeLine[];
  perApplicant: number;
  applicants: number;
  total: number;
}

export function computeCost(input: CostInputs): CostBreakdown {
  const gov = GOVERNMENT_FEES[input.serviceType];
  const lines: FeeLine[] = [gov, VFS_FEES.service, VFS_FEES.icwf];

  if (input.returnCourier) lines.push(VFS_FEES.courierReturn);
  if (input.sms) lines.push(VFS_FEES.sms);
  if (input.premiumLounge) lines.push(VFS_FEES.premiumLounge);

  const perApplicant = lines.reduce((s, l) => s + l.amount, 0);
  const applicants = Math.max(1, Math.floor(input.applicants || 1));

  return {
    lines,
    perApplicant,
    applicants,
    total: perApplicant * applicants,
  };
}

/** Service-type options for the Cost Calculator's dropdown. */
export const SERVICE_TYPE_OPTIONS: { value: GovernmentFeeKey; label: string }[] =
  [
    { value: "freshAdult", label: "Fresh OCI — adult" },
    { value: "freshMinor", label: "Fresh OCI — minor / newborn" },
    { value: "reissue", label: "Re-issue (new passport / 20 / 50 milestone)" },
    { value: "miscNewPassport", label: "Miscellaneous — new passport update" },
    { value: "lostDamaged", label: "Re-issue — lost / damaged card" },
    { value: "pioConversion", label: "PIO-to-OCI conversion" },
  ];
