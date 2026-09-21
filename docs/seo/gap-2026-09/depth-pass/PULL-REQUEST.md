# Depth pass on the September 2026 keyword-gap build

Follows PR #50. **No new URLs** — every commit edits a page that already owns
its topic, so the overlap decisions from the original build stand unchanged.

The September build won the things it set out to win: tools, charts, diagrams
and cited sources, against thirteen competitor pages that have none of them.
What it did not win was the long tail — sub-topics the competitor covers and we
did not — and in several places it left our own prose doing work a table should
have been doing.

This pass closes both. Eight commits: a competitor re-analysis, then one per
item group, then QA.

## The five worth reviewing

**`/uscis/expedite-request` was a dead end.** Our copy told most readers no
criterion applied to them — correctly — and stopped. The competitor page is
really a *delay-escalation* page with four rungs we had none of. They are now
on the page as sourced data with a comparison table and a ladder diagram: the
outside-normal-processing-time case inquiry (Policy Manual Vol. 1 Pt. A Ch. 4,
15-business-day goal), a Congressional inquiry and why the Privacy Act release
gates it, the CIS Ombudsman on DHS Form 7001 with its 90/60 prerequisite, and
mandamus under 28 U.S.C. § 1361 at $405 to file. Each rung states what it can
and cannot do. None is an expedite; none reorders a queue.

**The I-864 exemptions were missing from both pages, and the rule moved.** Four
groups need no affidavit at all, and the 40-quarters route is checked far less
than it should be because most people do not know quarters can be credited from
a spouse during the marriage or a parent before you turned 18 — the Indian-parent
case exactly. Since **10 December 2024** the exemption is requested on Form
I-485, not by filing a separate I-864W, which dates a lot of otherwise
correct-sounding instruction still circulating.

**EB-1A vs EB-1B turns on one phrase and no page prints it.** This was the only
gap page with no `<table>` at all, on a page whose primary keyword is literally
"eb1b vs eb1a". The criteria are now quoted from 8 CFR 204.5 rather than
described, and side by side the difference shows: EB-1A asks for contributions
*of major significance*; EB-1B does not. That is why the same record clears one
and fails the other.

**The I-751/N-400 overlap is the normal case.** A conditional resident married
to a citizen reaches N-400 eligibility while the I-751 is usually still
pending. Policy Manual Vol. 12 Pt. G Ch. 5: filing is not blocked, only
approval, and USCIS adjudicates the I-751 first or alongside, often in one
combined interview. Better news than people expect, and nobody states it.

**The red-flag lists on marriage interviews do real harm.** Most of them
frighten genuine couples about an age gap, an arranged marriage or a short
courtship while saying nothing about what decides cases. Ours is two tables —
six factors that genuinely draw a closer look with what answers each, and six
widely-repeated ones that are not problems — and it says plainly that no
published USCIS checklist exists.

## What the numbers did

| Added across the 13 pages | Count |
|---|---|
| Tables | **24** — 21 HTML, 3 markdown on the RFE cluster page |
| Charts and diagrams | **10** new inline-SVG figures, in 4 new modules |
| FAQ entries | **34** — 29 structured, 5 markdown |
| Prose words | **+6,861** on the page modules, before the data and component modules they render from |
| New URLs | **0** |

Counted from `git diff 7791c2f..HEAD`, not estimated. Every one of the 13
pages now carries at least two tables; the EB-1 comparison page had none at
all before this pass.

## Gates

- `npx next build` — exit 0, 934 routes
- `npx vitest run` — 2,107 passed, 0 skipped, 97 files
- Schema — **13/13** against the rendered HTML
- Duplicate title/H1 — 914 pages, **0 duplicate H1s**; one pre-existing 404 title collision, unchanged from September
- `npm run lint` — cannot run non-interactively (CLAUDE.md)
- **360px and Facebook in-app browser: still outstanding**, and the one thing
  worth doing by hand on the preview. Six new inline-SVG figures, four of them
  wide diagrams. Ledger item raised.

One real defect found and fixed during QA: `/visa-bulletin/monthly-update` was
emitting a `FAQPage` with three entries, under this build's own six-FAQ bar,
having been in scope since September. Details in the report.

## Read next

- [`depth-pass/00-gap-analysis.md`](docs/seo/gap-2026-09/depth-pass/00-gap-analysis.md) — the competitor re-analysis
- [`depth-pass/REPORT.md`](docs/seo/gap-2026-09/depth-pass/REPORT.md) — per-page table, newly verified facts with sources and dates, what was left unverified and why, recommendations not actioned, full QA

## Not in this PR

No redirects, no canonical changes, no deletions, no new URLs — hard rule 13.
NVC fee amounts could not be re-verified (`travel.state.gov` 403s every
automated request); the table renders the existing `lastVerified: 2026-07-04`
stamp and links out to confirm. Ledger item raised.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
