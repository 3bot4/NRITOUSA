"use client";

import Link from "next/link";
import Container from "@/components/Container";
import OrganizerNav from "./OrganizerNav";
import PrivacyNotice from "./PrivacyNotice";
import OrganizerDisclaimer from "./OrganizerDisclaimer";
import { NumberField, SelectField, TextField } from "./FieldKit";
import { useOrganizer } from "@/lib/nri-tax/storage";
import { useScrollTopOnMount } from "@/lib/nri-tax/useScrollTopOnMount";
import {
  FILING_STATUS_OPTIONS,
  INDIA_TAX_STATUS_OPTIONS,
  LIVING_LOCATION_OPTIONS,
  US_STATUS_OPTIONS,
} from "@/lib/nri-tax/types";

export default function OrganizerProfile() {
  useScrollTopOnMount();
  const org = useOrganizer();
  if (!org.ready) {
    return (
      <Container className="py-10">
        <p className="text-ink-500">Loading…</p>
      </Container>
    );
  }
  const p = org.profile;

  return (
    <Container className="py-8">
      <OrganizerNav
        taxYear={org.taxYear}
        availableYears={org.availableYears}
        onYearChange={org.setTaxYear}
      />
      <h1 className="text-2xl font-bold tracking-tight text-ink-900">Your profile ({org.taxYear})</h1>
      <p className="mt-1 text-sm text-ink-500">
        These answers drive the educational FBAR, Form 8938, and India-tax screening. &ldquo;Not
        sure&rdquo; is a valid answer — the report will tell you what to confirm.
      </p>

      <PrivacyNotice className="mt-5" />

      <div className="mt-6 grid gap-5 rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card sm:grid-cols-2">
        <SelectField
          label="U.S. tax status"
          value={p.usStatus}
          onChange={(v) => org.saveProfile({ usStatus: v })}
          options={US_STATUS_OPTIONS}
        />
        <SelectField
          label="Filing status"
          value={p.filingStatus}
          onChange={(v) => org.saveProfile({ filingStatus: v })}
          options={FILING_STATUS_OPTIONS}
          hint="Drives the Form 8938 threshold estimate"
        />
        <SelectField
          label="Form 8938 threshold category"
          value={p.livingLocationForTax}
          onChange={(v) => org.saveProfile({ livingLocationForTax: v })}
          options={LIVING_LOCATION_OPTIONS}
          hint="The higher abroad thresholds generally require meeting IRS living-abroad / presence-abroad rules. If unsure, use the U.S. threshold and confirm with a CPA."
        />
        <TextField
          label="State"
          value={p.state}
          onChange={(v) => org.saveProfile({ state: v })}
          placeholder="e.g. NJ"
        />
        <SelectField
          label="India tax status"
          value={p.indiaTaxStatus}
          onChange={(v) => org.saveProfile({ indiaTaxStatus: v })}
          options={INDIA_TAX_STATUS_OPTIONS}
        />
        <NumberField
          label="Days in India (this year)"
          value={p.daysInIndia}
          onChange={(v) => org.saveProfile({ daysInIndia: v })}
          placeholder="e.g. 35"
          hint="Helps flag residency / RNOR review"
        />
        <SelectField
          label="Do you have a spouse?"
          value={p.hasSpouse ? "yes" : "no"}
          onChange={(v) => org.saveProfile({ hasSpouse: v === "yes" })}
          options={[
            { value: "no", label: "No" },
            { value: "yes", label: "Yes" },
          ]}
        />
        {p.hasSpouse && (
          <SelectField
            label="Spouse U.S. person status"
            value={p.spouseUsPersonStatus}
            onChange={(v) => org.saveProfile({ spouseUsPersonStatus: v })}
            options={[...US_STATUS_OPTIONS, { value: "na" as const, label: "Not applicable" }]}
          />
        )}
      </div>

      <OrganizerDisclaimer className="mt-6" />

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/nri-wealth-checkup/assets"
          className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700"
        >
          Next: add assets →
        </Link>
        <Link
          href="/nri-wealth-checkup/dashboard"
          className="rounded-xl border border-ink-900/15 bg-white px-5 py-3 text-sm font-semibold text-ink-700 hover:bg-ink-900/5"
        >
          Back to dashboard
        </Link>
      </div>
    </Container>
  );
}
