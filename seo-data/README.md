# Search Console exports (private — never committed, never deployed)

`seo-data/` and `reports/` are git-ignored and vercel-ignored. Nothing in `src/`
imports them.

## Refresh the data

1. Search Console → Performance → **Export → CSV** → unzip.
2. Drop the CSVs in a dated folder:

       seo-data/gsc/2026-07-16/{Queries,Pages,Countries,Devices,Dates}.csv

3. Run:

       npx next build                 # seo:audit reads the rendered HTML
       npm run seo:gsc-import -- --dir ./seo-data/gsc/2026-07-16 \
                                  [--previous ./seo-data/gsc/2026-04-16]
       npm run seo:opportunities
       npm run seo:audit

`--previous` is optional; supply an older export and every page/query gains
current/previous/change/changePct so declines surface.

## Getting query-level data for ONE page

The default Pages.csv has no query column. To see which queries a specific URL
ranks for (needed before rewriting a title):
Performance → **+ New** → Page → *URL contains* `/indian-passport-renewal-usa`
→ Queries tab → Export. Save it in the same dated folder; the importer keys
query→page pairs off any CSV that has both columns.
