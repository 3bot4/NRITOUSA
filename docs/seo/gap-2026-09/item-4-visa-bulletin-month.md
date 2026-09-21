# Item 4 gap — monthly visa bulletin pages

**Competitor:** https://abogadolozano.com/april-2026-visa-bulletin-breakdown/
**Pattern evidence:** "visa bulletin [month] [year]" 18,100/mo KD 23 (competitor #19); the April 2026 cluster alone was ≈28,300/mo. The pattern repeats every month.

| Dimension | Competitor | Other top results | nritousa.com today | What we will do better |
|---|---|---|---|---|
| H2 sections | Month breakdown per category | travel.state.gov is the raw bulletin; law-firm posts are one-off prose | `/visa-bulletin` hub + category pages, no month pages | A repeatable month **template** driven by one data file, so each month ships in minutes and is internally consistent |
| Questions answered | This month's movement | Raw tables | Category-level | Movement in weeks per category, which chart USCIS accepts, what it means for a specific priority date |
| Tools | **None** | None | `/tools/priority-date-checker` exists | **Embed the existing checker** pre-set to the month. No second checker built. |
| Diagrams / charts | Tables | Raw tables | `VisaBulletinMovementHistory`, `CutoffChart` | 24-bulletin India EB-1/2/3 movement chart from `data/visa-bulletin/history.json` + a month-over-month change table + a "which chart applies to you" SVG |
| Freshness | One month, then abandoned | Monthly | Hub is current | Month page + hub index, newest first, with a **published runbook** so it never silently goes stale |
| Official sources | Generic | Is the source | Cites the bulletin | Direct link to the specific month's bulletin on travel.state.gov |
| India angle | Generic | Generic | Strong already | Month pages link into `/visa-bulletin/eb1-india`, `/eb2-india`, `/eb3-india` — the pages already ranking #55 and #88 — to concentrate rather than scatter equity |

**Publishing constraint:** the October 2026 bulletin was **not released** as of 2026-09-16 (checked; the latest published is September 2026, and October is the first FY-2027 bulletin). The template ships with **September 2026** — the bulletin actually in force — and October follows `docs/seo/visa-bulletin-monthly-runbook.md` on release day.
