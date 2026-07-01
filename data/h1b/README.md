# H-1B Sponsor Finder — data pipeline

Turns the DOL OFLC LCA disclosure files into a small, queryable `sponsors`
rollup for the sponsor-finder tool on nritousa.com.

## Files
- `etl.py` — streams the OFLC LCA xlsx, keeps certified H-1B cases, annualizes
  wages, canonicalizes employers, emits the `(employer, soc_code, state)` rollup.
- `schema.sql` — Postgres table + indexes (Supabase/Neon).
- `load_to_postgres.py` — upserts the rollup CSV into Postgres.
- `aliases.json` — editable employer alias map (expand to the top ~500 sponsors).
- `make_sample.py` — generates a synthetic LCA file to test without the download.

## Run it for real
1. Download the latest **LCA (H-1B, H-1B1, E-3)** disclosure xlsx + record layout:
   https://www.dol.gov/agencies/eta/foreign-labor/performance
   Grab the current fiscal year and the prior one (the prior year powers the trend).

2. Install deps:
   ```
   pip install pandas openpyxl
   # optional, ~10x faster reads on the 600 MB files:
   pip install python-calamine
   ```

3. Build the rollup:
   ```
   python etl.py --input LCA_FY2026.xlsx LCA_FY2025.xlsx \
                 --as-of 2026-03-31 --out sponsors.csv --sqlite sponsors.db
   ```

4. Load to Postgres:
   ```
   psql "$DATABASE_URL" -f schema.sql
   DATABASE_URL=postgres://... python load_to_postgres.py sponsors.csv
   ```

5. Quarterly refresh: run steps 1–4 from a GitHub Actions cron (same pattern as
   the nritousa USD/INR and visa-bulletin pipelines).

## Speed tip for the big files
Swap the openpyxl reader in `stream_file()` for the calamine engine if reads are
slow: `pd.read_excel(path, engine="calamine", usecols=[...])` and filter in
chunks. openpyxl `read_only` is the memory-safe default and needs no extra dep.

## Honest caveats (surface these in the UI)
- An LCA is an attestation filed before the USCIS petition. Certification ≠
  petition approval ≠ a hire. Counts are a sponsorship *signal*.
- One LCA can cover multiple workers (`worker_positions`).
- Public files strip FEIN, so employer grouping is approximate — expand
  `aliases.json` to tighten the big sponsors.
- Data lags 1–3 months (DOL releases quarterly).
