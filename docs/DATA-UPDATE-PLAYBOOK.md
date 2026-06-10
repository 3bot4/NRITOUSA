# Data Update Playbook

Every tool on nritousa.com is 100% client-side and reads versioned JSON from
`/data` (statically imported at build time) or `/public/data` (fetched at
runtime for larger files). There is **no database** for tool data. Updating a
tool = editing a JSON file (or running a build script), committing, and
deploying — Vercel rebuilds and the new data ships.

Every data file carries `lastUpdated` (YYYY-MM-DD), `source` (official URL),
and `sourceLabel`. **Always bump `lastUpdated` when you refresh a file** —
it renders on the page as the "Last updated · Source" stamp.

| File | Tool(s) | Official source | Cadence |
| --- | --- | --- | --- |
| `data/visa-bulletin/current.json` + `history.json` | Homepage estimator, /tools/green-card-tracker | [travel.state.gov Visa Bulletin](https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html) | **Monthly** (bulletin drops ~2nd week for the following month) |
| `public/data/h1b/summary.json` | /tools/h1b-salaries | [DOL OFLC LCA disclosure data](https://www.dol.gov/agencies/eta/foreign-labor/performance) | **Quarterly** (Q1 ~Jan, Q2 ~Apr, Q3 ~Jul, Q4 ~Oct) |
| `data/passport-access.json` | /tools/visa-free-countries | [Henley Passport Index](https://www.henleyglobal.com/passport-index) + each country's official immigration site | **Quarterly** (and ad-hoc when a country changes policy) |
| `data/processing-times.json` | /tools/processing-times | [USCIS processing times](https://egov.uscis.gov/processing-times/), [DOS visa wait times](https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/global-visa-wait-times.html), [VFS Global USA](https://services.vfsglobal.com/usa/en/ind/) | **Monthly** |
| `data/h1b-lottery-timeline.json` | /tools/h1b-lottery-timeline | [USCIS H-1B cap season](https://www.uscis.gov/working-in-the-united-states/temporary-workers/h-1b-specialty-occupations) | **Annual** (Jan–Mar cap season) |
| `data/flight-price-guide.json` | /tools/flight-price-guide (stub) | [BTS DB1B fare data](https://www.transtats.bts.gov/) | **Quarterly** once live |
| `data/fbar-fatca.json` | /tools/fbar-fatca-checker (stub) | [IRS FBAR](https://www.irs.gov/businesses/small-businesses-self-employed/report-of-foreign-bank-and-financial-accounts-fbar) / Form 8938 instructions | **Annual** (thresholds rarely change) |
| `data/citizenship-checklist.json` | /tools/citizenship-checklist | [USCIS N-400](https://www.uscis.gov/n-400) + [2025 civics test](https://www.uscis.gov/citizenship/2025-civics-test) + [Policy Manual Vol. 12](https://www.uscis.gov/policy-manual/volume-12) | **Quarterly** (and ad-hoc when fees, the test rule, or GMC policy change) |

---

## 1. Visa bulletin (monthly)

When the new monthly Visa Bulletin is published on travel.state.gov:

1. Open the bulletin's **Employment-Based** tables: "Final Action Dates" and
   "Dates for Filing".
2. Edit `data/visa-bulletin/current.json`:
   - Set `bulletinMonth` (e.g. `"2026-07"`) and `lastUpdated` (today).
   - Update `fad`/`dff` for every category × country. Use `"C"` for Current.
   - Remove `fadTodo`/`dffTodo` flags once a value is verified.
3. Edit `data/visa-bulletin/history.json`: **append** a `[month, cutoff]`
   point to each series **only where the cutoff changed** (it's a sparse
   change-point series — unchanged months carry forward automatically).
4. Regenerate the monthly snapshots and index:
   ```bash
   node scripts/build-visa-snapshots.mjs
   ```
   This rewrites `data/visa-bulletin/snapshots/YYYY-MM.json` and
   `data/visa-bulletin/index.json`.
5. Commit all of `data/visa-bulletin/` and deploy.

The estimator's velocity math and charts pick the new month up automatically.

## 2. H-1B salaries (quarterly)

1. Download the latest **LCA Disclosure Data** `.xlsx` from
   <https://www.dol.gov/agencies/eta/foreign-labor/performance>
   (Performance Data → Disclosure Data → LCA Programs).
2. Convert to CSV (Excel "Save As → CSV", or any xlsx→csv converter). The
   script needs these columns (present in the standard file): `CASE_STATUS`,
   `JOB_TITLE`, `WORKSITE_CITY`, `WORKSITE_STATE`, `WAGE_RATE_OF_PAY_FROM`,
   `WAGE_UNIT_OF_PAY`, `PW_WAGE_LEVEL`, `FULL_TIME_POSITION`, `DECISION_DATE`.
3. Run the aggregator (multiple quarters can be passed at once):
   ```bash
   npx tsx scripts/build-h1b-data.ts LCA_Disclosure_Data_FY2026_Q2.csv
   ```
   Keep the `FY####_Q#` part of the filename — the script reads it to set
   `reportingPeriod` (e.g. "FY2026 through Q2 (Oct 1 – Mar 31)"), which the UI
   shows as "Source: US DOL OFLC, …".
4. This overwrites `public/data/h1b/summary.json` with real aggregates and
   sets `"sample": false`, which swaps the amber "preview figures" banner for
   the green "real LCA filings" provenance line in the UI.
5. Spot-check a few medians against a known source, commit, deploy.

> **Note on the live download:** `dol.gov` serves the disclosure files from an
> Akamai edge that blocks non-browser/datacenter clients ("Access Denied"), so
> the file generally cannot be fetched from CI or a sandbox — download it once
> in a normal browser, then run the script against the local CSV. Until that's
> done, the page ships honest **preview** numbers (`"sample": true`), never
> placeholder numbers labeled as real.

Raw LCA rows never ship to the browser — only the aggregated summary
(median/p25/p75 by normalized title × metro × wage level × year, cells with
fewer than 10 filings dropped, capped at the 6,000 most-filed cells).

## 3. Passport access (quarterly + ad-hoc)

1. Check the latest Henley Passport Index ranking and count for India; update
   `summary` (`henleyRank`, `henleyRankAsOf`, counts).
2. For any country in the news (new visa-free deal, suspension), verify
   against that country's **official immigration/embassy site** and update its
   row (`access`, `stay`, `notes`, `usVisaPerk`).
3. Remove `"todo": true` from rows once verified; bump `lastUpdated`.

US-visa perks change quietly — re-verify Mexico, UAE, Georgia, Turkey, Saudi
Arabia, and Central America rows each pass; they're the most-used.

## 4. Processing times (monthly)

1. USCIS rows: <https://egov.uscis.gov/processing-times/> — use the form +
   "All offices" median-to-93rd-percentile spread for the `typical` range.
2. Stamping rows: <https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/global-visa-wait-times.html>
   — record each Indian post's H-category interview wait.
3. OCI/passport rows: VFS Global USA published timelines.
4. Update each row's `typical`, its per-row `lastUpdated`, and the top-level
   `lastUpdated`; clear `todo` flags as you verify.

## 5. Stub tools (when going live)

Each stub already has a typed data shape:

- **Flight price guide** (`data/flight-price-guide.json`): fill each route's
  12-element `monthlyAvgUsd` array (Jan→Dec) from BTS DB1B or accumulated OTA
  averages; set `cheapestMonths`/`priciestMonths`.
- **FBAR/FATCA checker** (`data/fbar-fatca.json`): verify thresholds against
  the current year's Form 8938 instructions (they have been stable for years).

Then build the interactive UI, flip the tool's `status` from `"coming-soon"`
to `"live"` in `src/lib/tools.ts`, and the hub card, sitemap priority, and
"Coming soon" badges update automatically.

## 6. Citizenship checklist (quarterly + ad-hoc)

Edit `data/citizenship-checklist.json`. The tool ([/tools/citizenship-checklist](https://www.nritousa.com/tools/citizenship-checklist))
derives eligibility, the civics-test version, and risk flags from it via
`src/lib/citizenship.ts`. Re-verify these against the official sources and clear
the `TODO(owner)` notes in the JSON as you confirm each:

1. **Fees** (`fees.onlineUsd`, `fees.paperUsd`): the current N-400 fee schedule
   at <https://www.uscis.gov/g-1055>. Confirm the I-912 waiver / I-942 reduced-fee
   forms still apply.
2. **Civics test rule** (`civicsTest`): confirm the **October 20, 2025 cutoff**
   and the pool/asked/to-pass numbers for both the 2025 (128/20/12) and 2008
   (100/10/6) tests at <https://www.uscis.gov/citizenship/2025-civics-test>.
   If USCIS revises the test again, update `newTestCutoffDate` and the numbers.
3. **Residency thresholds** (`bases`, `requirements`): physical-presence months
   (30 for the 5-year, 18 for the 3-year-spouse), the 90-day early-filing window,
   the 3-month state-residence rule, and the 6-month/1-year continuous-residence
   break thresholds. Source: USCIS Policy Manual Vol. 12, Parts D–G.
4. **Pain points** (`painPoints[]`): re-read USCIS Policy Manual Vol. 12 Part F
   (Good Moral Character) and recent USCIS/news for vetting, social-media review,
   DUI, and tax-residency guidance. Update each entry's `summary`, `whyNow`,
   per-entry `lastUpdated` (YYYY-MM), and `source`.
5. Bump the top-level `lastUpdated`. The checklist `sections`/`items` and `faq`
   also live in this file — edit them here, not in the component.

**When to do an ad-hoc update:** any USCIS fee rule, a new civics-test revision
or cutoff change, or a major shift in good-moral-character / vetting policy.

## 7. H-1B lottery timeline (annual, Jan–Mar)

Edit `data/h1b-lottery-timeline.json`. The tool
([/tools/h1b-lottery-timeline](https://www.nritousa.com/tools/h1b-lottery-timeline))
renders a personalized timeline from `cycles[]` (the dated milestones per
fiscal year) and `phases[]` (the static "what to do / pitfalls" content).

1. When USCIS announces the next cap season (usually January–February), add a
   new object to the **front** of `cycles[]` for the new fiscal year and set
   `currentFiscalYear` to match. Fill `registrationStart/End`, `selectionBy`,
   `filingStart/End`, `secondRoundStart/End`, and `startDate` (Oct 1).
2. After the season, fill `registrations` and `selected` from the USCIS
   post-season data release (this drives the odds line) and clear `todo`/
   `todoNote` once every value is verified against uscis.gov.
3. Confirm the `registrationFee` (USCIS raised it to $215 per beneficiary
   starting the FY2026 season) and the `caps` (65,000 regular + 20,000
   master's) still hold.
4. Bump the top-level `lastUpdated`. The `phases[]` copy rarely changes — edit
   it here, not in the component.
