#!/usr/bin/env python3
"""
Load the ETL's sponsors.csv rollup into Postgres (Supabase / Neon).
Upsert-on-conflict so quarterly refreshes overwrite cleanly.

Setup:
  pip install psycopg2-binary pandas
  psql "$DATABASE_URL" -f schema.sql        # one-time
  DATABASE_URL=postgres://... python load_to_postgres.py sponsors.csv
"""
import os
import sys
import json
import pandas as pd
import psycopg2
from psycopg2.extras import execute_values

DDL_CHECK = "select to_regclass('public.sponsors')"

UPSERT = """
insert into sponsors
  (employer, soc_code, soc_title, state, lca_count, worker_positions,
   median_wage, wage_levels, prev_year_count, trend, last_filed)
values %s
on conflict (employer, soc_code, state) do update set
  soc_title        = excluded.soc_title,
  lca_count        = excluded.lca_count,
  worker_positions = excluded.worker_positions,
  median_wage      = excluded.median_wage,
  wage_levels      = excluded.wage_levels,
  prev_year_count  = excluded.prev_year_count,
  trend            = excluded.trend,
  last_filed       = excluded.last_filed;
"""


def main(csv_path):
    url = os.environ.get("DATABASE_URL")
    if not url:
        sys.exit("Set DATABASE_URL (postgres connection string).")
    df = pd.read_csv(csv_path)
    df = df.where(pd.notna(df), None)

    rows = [(
        r.employer, r.soc_code, r.soc_title, r.state,
        int(r.lca_count or 0), int(r.worker_positions or 0),
        int(r.median_wage) if r.median_wage is not None else None,
        json.dumps(json.loads(r.wage_levels)) if r.wage_levels else None,
        int(r.prev_year_count or 0), r.trend, r.last_filed,
    ) for r in df.itertuples(index=False)]

    con = psycopg2.connect(url)
    with con, con.cursor() as cur:
        cur.execute(DDL_CHECK)
        if cur.fetchone()[0] is None:
            sys.exit("Table 'sponsors' missing — run: psql $DATABASE_URL -f schema.sql")
        execute_values(cur, UPSERT, rows, page_size=1000)
    con.close()
    print(f"Upserted {len(rows):,} rows into sponsors.")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "sponsors.csv")
