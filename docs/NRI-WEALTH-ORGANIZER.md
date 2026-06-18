# NRI Global Wealth & Tax Organizer

Free, educational tool that lets Indian families in the USA organize their U.S.
and India assets/income and generate an educational tax & reporting checklist
(FBAR, FATCA/Form 8938, PFIC/Form 8621, foreign tax credit/Form 1116, India
ITR/TDS, India property, Form 3520, return-to-India planning).

**Educational only.** It does not prepare taxes, file forms, or determine filing
obligations. Every flag uses "may apply / review needed" language and links to
official IRS sources.

## Routes

| Route | Purpose |
|-------|---------|
| `/nri-wealth-checkup` | Indexable landing page (hero, FAQ + FAQ schema, privacy notice, disclaimer) |
| `/nri-wealth-checkup/profile` | Profile wizard |
| `/nri-wealth-checkup/assets` | Add/edit/delete assets |
| `/nri-wealth-checkup/income` | Add/edit/delete income & TDS |
| `/nri-wealth-checkup/dashboard` | Totals, risk score, missing-info checklist |
| `/nri-wealth-checkup/report` | Educational report + Download PDF (print) |
| `/tools/nri-global-wealth-tax-organizer` | 308 redirect → `/nri-wealth-checkup` |

Sub-pages are `noindex`; only the landing page is indexable.

## Code map

- `src/lib/nri-tax/types.ts` — enums, interfaces, asset/income metadata, **centralized** `FBAR_THRESHOLD_USD` and `FATCA_THRESHOLDS`, official `SOURCES`.
- `src/lib/nri-tax/rules.ts` — pure rules engine: `computeTotals`, `runRules` (rules A–I), `computeRiskScore`, `generateCpaQuestions`, `generateDocumentChecklist`, `buildSummary`.
- `src/lib/nri-tax/storage.ts` — `StorageAdapter` interface, `localStorageAdapter` (default), `useOrganizer` React hook.
- `src/lib/nri-tax/sample.ts` — sample data for "Download Sample Report".
- `src/components/nri-tax/*` — UI (dashboard, profile, assets, income, report, nav, field kit, privacy notice).
- `src/lib/nri-tax/rules.test.ts` — vitest unit tests. Run `npm test`.

## Storage & privacy (current: client-side)

By default the tool persists everything in the browser's `localStorage` — **no
account, no server, no database**, consistent with the rest of the site. This is
also the privacy posture: sensitive financial data never leaves the device. The
tool never collects SSN, PAN, Aadhaar, passport numbers, account numbers, logins,
or exact addresses — only nicknames and approximate USD-equivalent values.

## Upgrade path: Supabase/Postgres + magic-link auth (optional)

`StorageAdapter` (in `storage.ts`) is a 3-method async interface
(`load` / `save` / `clear`). To move to multi-device, authenticated storage,
implement a `supabaseAdapter` and pass it to `useOrganizer(adapter)` once a user
is signed in. No UI changes are required.

### 1. Env vars (add to `.env.local` and Vercel)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Auth: enable Supabase email magic-link (passwordless) — it reuses the existing
Brevo SMTP or Supabase's built-in mailer. No heavy auth framework needed.

### 2. SQL migration

```sql
-- One row per user per tax year
create table user_profile (
  user_id uuid not null references auth.users(id) on delete cascade,
  tax_year int not null,
  us_status text, filing_status text, living_location_for_tax text,
  state text, india_tax_status text, days_in_india int,
  has_spouse boolean default false, spouse_us_person_status text,
  created_at timestamptz default now(), updated_at timestamptz default now(),
  primary key (user_id, tax_year)
);

create table asset_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tax_year int not null,
  asset_type text not null, country text, institution_or_asset_nickname text,
  currency text, year_end_value numeric, maximum_year_value numeric,
  income_generated numeric, tax_paid_or_tds numeric,
  ownership_type text, held_directly_or_entity text, notes text,
  created_at timestamptz default now(), updated_at timestamptz default now()
);

create table income_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tax_year int not null,
  income_type text not null, country_source text, amount numeric,
  currency text, tax_paid_or_tds numeric, related_asset_id uuid, notes text,
  created_at timestamptz default now(), updated_at timestamptz default now()
);

create table annual_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tax_year int not null,
  computed_summary_json jsonb, risk_score text,
  created_at timestamptz default now(), updated_at timestamptz default now()
);

-- Row-level security: each user sees only their own rows.
alter table user_profile  enable row level security;
alter table asset_items   enable row level security;
alter table income_items  enable row level security;
alter table annual_reports enable row level security;

create policy "own profile"  on user_profile   for all using (auth.uid() = user_id);
create policy "own assets"   on asset_items    for all using (auth.uid() = user_id);
create policy "own income"   on income_items   for all using (auth.uid() = user_id);
create policy "own reports"  on annual_reports for all using (auth.uid() = user_id);
```

### 3. Adapter sketch

```ts
export const supabaseAdapter: StorageAdapter = {
  async load() { /* select * from the 4 tables for auth.uid(); map to OrganizerData */ },
  async save(data) { /* upsert profiles/assets/income/reports */ },
  async clear() { /* delete the user's rows */ },
};
```

Because the rules engine is pure and the UI only depends on `useOrganizer`, the
swap is isolated to `storage.ts` and the sign-in gate.

## Thresholds — keep current

`FATCA_THRESHOLDS` and `FBAR_THRESHOLD_USD` in `types.ts` are educational
estimates. Verify them against the latest IRS Form 8938 instructions each tax
season and update in that one place.

## PDF

The report uses the browser's native print-to-PDF (`window.print()`) with print
CSS in `globals.css` that hides site chrome and `.no-print` controls. To produce
a server-rendered/branded PDF later, add `@react-pdf/renderer` or a print
microservice — the report data already comes from `buildSummary()`.
