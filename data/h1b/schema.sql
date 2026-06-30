-- H-1B Sponsor Finder — Postgres schema (Supabase / Neon compatible)
-- Loaded from the ETL's sponsors.csv rollup. Re-run is idempotent.

create extension if not exists pg_trgm;

create table if not exists sponsors (
  id               bigint generated always as identity primary key,
  employer         text not null,          -- canonical company name
  soc_code         text not null,          -- e.g. 15-1252
  soc_title        text,                   -- e.g. Software Developers
  state            text not null,          -- 2-letter worksite state
  lca_count        int  not null default 0,-- certified H-1B LCAs, last 12 mo
  worker_positions int  not null default 0,-- sum of TOTAL_WORKER_POSITIONS, last 12 mo
  median_wage      int,                    -- annualized offered wage (USD)
  wage_levels      jsonb,                  -- {"I":n,"II":n,"III":n,"IV":n}
  prev_year_count  int  not null default 0,-- certified LCAs, prior 12 mo (for trend)
  trend            text,                   -- up | down | flat
  last_filed       date,
  unique (employer, soc_code, state)
);

-- Primary lookup path: sponsors for a role in a state.
create index if not exists idx_sponsors_soc_state on sponsors (soc_code, state);

-- Fuzzy search so the API can resolve "software engineer" -> SOC titles,
-- and let users search an employer by partial name.
create index if not exists idx_sponsors_soctitle_trgm on sponsors using gin (soc_title gin_trgm_ops);
create index if not exists idx_sponsors_employer_trgm on sponsors using gin (employer gin_trgm_ops);

-- ── The query the /api/sponsors endpoint runs ──────────────────────────────
-- Ranked sponsor list for a (role, state). Recent volume first, then worker
-- positions as a tiebreak.
--
--   select employer, lca_count, prev_year_count, trend,
--          median_wage, wage_levels, last_filed
--   from sponsors
--   where soc_code = $1 and state = $2
--   order by lca_count desc, worker_positions desc
--   limit 25;
--
-- Role autocomplete (typed text -> distinct SOC codes/titles):
--
--   select distinct soc_code, soc_title
--   from sponsors
--   where soc_title ilike '%' || $1 || '%'
--   order by soc_title
--   limit 10;
