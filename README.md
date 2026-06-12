# NRITOUSA.com

A premium, SEO-focused content platform for NRIs and new immigrants in the USA — guides on finance, taxes, credit, housing, cars, investing, 401(k)/Roth IRA, India–US money transfers, buying property, community, and immigrant stories.

Built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | Description                       |
| --------------- | --------------------------------- |
| `npm run dev`   | Start the dev server              |
| `npm run build` | Production build                  |
| `npm run start` | Serve the production build        |
| `npm run lint`  | Lint with Next's ESLint config    |

## Project structure

```
src/
├── app/                      # App Router pages & routing
│   ├── layout.tsx            # Root layout (Navbar + Footer + global SEO)
│   ├── page.tsx              # Homepage
│   ├── globals.css           # Tailwind + base styles
│   ├── not-found.tsx         # 404
│   ├── robots.ts             # robots.txt (generated)
│   ├── sitemap.ts            # sitemap.xml (generated)
│   ├── about/page.tsx
│   ├── topics/
│   │   ├── page.tsx          # All topics
│   │   └── [slug]/page.tsx   # Topic detail
│   └── articles/
│       └── [slug]/page.tsx   # Article detail (+ JSON-LD)
├── components/               # Reusable UI
│   ├── Navbar.tsx            # Responsive navbar (client)
│   ├── MobileMenu.tsx        # Mobile slide-down menu
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── ArticleCard.tsx
│   ├── ArticleBody.tsx       # Light-markdown renderer
│   ├── TopicCard.tsx
│   ├── SectionHeading.tsx
│   ├── Container.tsx
│   └── Newsletter.tsx
├── lib/                      # Data + helpers
│   ├── topics.ts             # Topic definitions
│   ├── articles.ts           # Article content + queries
│   ├── site.ts               # Site-wide config (name, URLs, social)
│   └── format.ts             # Date / initials helpers
└── types/                    # Shared TypeScript types
    └── index.ts
```

## Content model

Topics and articles live in `src/lib/topics.ts` and `src/lib/articles.ts`. Articles use a tiny markdown subset (`## headings`, `- lists`, paragraphs) rendered by `ArticleBody`.

### Adding an article

Append an object to the `articles` array in `src/lib/articles.ts` with a unique `slug` and a `topic` that matches a topic slug. It automatically appears on the homepage, its topic page, related sections, and the sitemap.

### Scaling up

When content outgrows TypeScript files, swap `lib/articles.ts` for an MDX loader or a headless CMS — the components and pages read through the helper functions (`getArticle`, `getArticlesByTopic`, etc.), so the UI won't need to change.

## SEO features

- Per-page `metadata` (titles, descriptions, canonical URLs, Open Graph, Twitter cards)
- Clean, semantic URLs (`/topics/taxes`, `/articles/...`)
- `Article` JSON-LD structured data on every article
- Auto-generated `sitemap.xml` and `robots.txt`
- Statically generated topic & article pages (`generateStaticParams`)

> Update your production domain in `src/lib/site.ts`.

## Homepage market data & daily pipeline

The homepage leads with a market ticker (USD/INR, NIFTY 50, S&P 500, Gold, and a
highlighted **EB-2 India Final Action Date**) and a USD/INR sidebar card with a
30-day sparkline. **The frontend reads only static JSON** — there are no
client-side or server-side calls to external APIs. A scheduled job refreshes that
JSON once a day.

### Files

| File | Purpose |
| ---- | ------- |
| `data/market.json` | Current snapshot the UI reads. Overwritten daily. |
| `data/history/YYYY-MM-DD.json` | Append-only daily archive (one per day). |
| `data/homepage-config.json` | **Manual** values not in the pipeline: top NRE FD rate + Visa Bulletin release schedule. |
| `src/lib/market.ts` | Typed access used by the homepage components. |
| `scripts/pipeline/` | The pipeline (orchestrator + per-source modules). |
| `.github/workflows/daily-market.yml` | The daily cron job. |

### How it runs

GitHub Actions runs `scripts/pipeline/fetch-market.mjs` daily at **09:00
America/New_York**. GitHub cron is UTC-only with no DST, so the workflow fires at
both `13:00` and `14:00` UTC and a guard step runs the fetch only when it is
actually 9 AM in New York (so it's correct year-round). The job commits any
changed data back to the repo, which triggers a Vercel redeploy.

**Manually trigger a refresh:** GitHub → **Actions** → *Daily market data* → **Run
workflow**. Manual runs skip the time gate. Locally:

```bash
node scripts/pipeline/fetch-market.mjs           # fetch + write files
DRY_RUN=1 node scripts/pipeline/fetch-market.mjs # fetch + print, write nothing
```

### Data sources (all free / open, no API keys)

| Item | Primary | Fallbacks | Terms |
| ---- | ------- | -------- | ----- |
| USD/INR | ECB reference rate via [Frankfurter](https://frankfurter.dev) *(RBI/FBIL opt-in via `RBI_REFERENCE_URL`)* | FRED `DEXINUS` | ECB/Frankfurter is open, key-less, and serves CI runners reliably. RBI/FBIL has no stable key-less JSON feed, so it's an env hook (see below). |
| S&P 500 | [FRED](https://fred.stlouisfed.org) `SP500` | [Stooq](https://stooq.com) `^spx` → Yahoo `^GSPC` | FRED is U.S. government public-domain data. |
| Gold (USD/oz) | FRED `GOLDAMGBD228NLBM` (LBMA fixing) | Stooq `xauusd` → Yahoo `GC=F` | FRED public-domain; sources differ by a few dollars (fix vs spot vs future) — the stamped `source` records which supplied the value. |
| NIFTY 50 | Stooq `^nsei` | Yahoo `^NSEI` | No open/public NIFTY feed serves CI runners; this is the least reliable item (see note). |
| EB-2 India FAD | `data/visa-bulletin/current.json` (the **same** data the Green Card estimator uses — no second parser) | — | U.S. Dept of State Visa Bulletin. Updated by the monthly bulletin process, **not** this daily job. |

We deliberately do **not** use Twelve Data, Alpha Vantage, or similar commercial
free tiers whose terms restrict public display.

#### Datacenter-IP reality & the recommended free FRED key

Most free, key-less market sources (Stooq, Yahoo, even FRED's `fredgraph.csv`)
**block or rate-limit datacenter IPs**, which is exactly what GitHub Actions runs
on. From Actions, only ECB/Frankfurter (USD/INR) is reliably reachable key-less;
S&P 500, gold, and NIFTY 50 frequently fall back to their last-good value flagged
`stale`.

**Recommended fix (free, no display terms):** create a **FRED API key** at
<https://fredaccount.stlouisfed.org/apikeys> and add it as a repo **secret named
`FRED_API_KEY`** (Settings → Secrets and variables → Actions → New repository
secret). The key is free, instant, and FRED is public-domain U.S. government data.
With it set, **USD/INR, S&P 500, and gold all fetch reliably** from Actions via the
official FRED API. NIFTY 50 has no FRED series, so it remains best-effort (Stooq/
Yahoo) — it will simply show the last-good value with a "stale" badge when those
sources block the runner. The site renders stale values gracefully, so nothing
breaks either way.

**Optional RBI primary:** set repository variables `RBI_REFERENCE_URL` (a JSON
endpoint returning the rate) and `RBI_REFERENCE_PATH` (dot-path to the number,
default `rate`) under Settings → Secrets and variables → Actions → Variables. When
unset, USD/INR uses the ECB/Frankfurter fallback.

### Resilience

Each source is fetched in its own module with its own error handling. If a fetch
fails, the pipeline **keeps the last good value and sets `"stale": true`** with the
older `fetchedAt`; the UI shows the stale value with a small "stale" badge rather
than a blank. One failed source never blocks the others, and the job never fails
the workflow.

### JSON schemas

`data/market.json`:

```jsonc
{
  "asOf": "2026-06-11T09:00:00-04:00",   // ISO with ET offset (DST-correct)
  "asOfLabel": "Jun 11, 2026, 9:00 AM ET",
  "items": [
    {
      "key": "usdinr",        // stable id
      "label": "USD/INR",
      "value": 95.76,
      "previous": 95.27,      // prior snapshot's value
      "changePct": 0.51,      // (value-previous)/previous * 100
      "unit": "₹",            // prefix; "" for indices, "$" for gold
      "decimals": 2,
      "source": "ECB reference rate via Frankfurter",
      "fetchedAt": "2026-06-11T09:00:00-04:00",
      "stale": false
    }
    // ... nifty50, sp500, gold
  ],
  "usdinrHistory": [ { "date": "2026-06-11", "value": 95.76 } ]  // trailing 30
}
```

`data/history/YYYY-MM-DD.json`: `{ date, asOf, items, eb2IndiaFad }`.

### Adding a ticker item

1. Create `scripts/pipeline/sources/<key>.mjs` exporting `meta = { key, label,
   unit, decimals }` and `async function fetchValue()` returning `{ value, source }`
   (throw on failure — the orchestrator handles stale). Reuse `lib/eod.mjs` for
   Stooq/Yahoo-style sources.
2. Import it and add it to `SOURCES` in `scripts/pipeline/fetch-market.mjs`.
3. Surface it in the UI via `src/lib/market.ts` (`tickerItems()` / a sidebar card).

A **remittance-provider comparison** card/module slots in the same way — add a
source module + a `market.ts` accessor + a sidebar card, no restructuring needed.

## Disclaimer

Content is educational and not financial, tax, or legal advice.
