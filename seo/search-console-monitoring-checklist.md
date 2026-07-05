# Google Search Console — Monitoring Checklist

Property: **https://www.nritousa.com** (use the `www` / domain property that
matches the canonical host). All URLs below live in
[priority-url-tracker.md](./priority-url-tracker.md).

These are the manual GSC steps that Claude Code cannot perform — they require a
signed-in Search Console session.

---

## 0. One-time setup

- [ ] Confirm the correct property is verified (domain property preferred so
      `http`, `https`, apex, and `www` all roll up).
- [ ] Confirm `https://www.nritousa.com/robots.ts` output allows crawling and
      references the sitemap.

## 1. Submit the sitemap

- [ ] Sitemaps → add `https://www.nritousa.com/sitemap.xml` (the index).
- [ ] Verify the 5 child sitemaps are discovered: `sitemap-pages.xml`,
      `sitemap-tools.xml`, `sitemap-articles.xml`, `sitemap-tax.xml`,
      `sitemap-immigration.xml`.
- [ ] Confirm status = **Success** and "Discovered URLs" is non-zero for each.

## 2. Inspect priority URLs (Day 0)

Run **URL Inspection** on each cluster hub + top tools:

- [ ] /perm-processing-time-calculator
- [ ] /prevailing-wage-calculator
- [ ] /i140-processing-time
- [ ] /ead-processing-time
- [ ] /i485-processing-time
- [ ] /green-card-renewal
- [ ] /green-card-renewal-fee
- [ ] /nvc-case-status
- [ ] /tools/h1b-sponsor-finder
- [ ] /tools/oci-cost-calculator

For each: confirm **URL is on Google** OR "URL is available to be indexed",
canonical = self, and no coverage/robots errors.

## 3. Request indexing for top URLs (Day 0)

- [ ] For each priority URL above, click **Request Indexing** (once per URL;
      don't spam re-requests).
- [ ] IndexNow: `npm run indexnow` also pings supported engines — run after each
      significant content push.

## 4. Indexing check (Day 7)

- [ ] Pages report → confirm priority URLs moved to **Indexed**.
- [ ] Log any still in **Crawled – currently not indexed** or
      **Discovered – currently not indexed** (see §9).

## 5. Impressions check (Day 14)

- [ ] Performance → Pages: confirm priority URLs are accruing impressions.
- [ ] Note any priority URL with **0 impressions** after 14 days → candidate for
      title/description rework or more internal links.

## 6. Rankings / CTR check (Day 30)

- [ ] Performance → filter each priority query; record average position + CTR.
- [ ] Export a positions snapshot for month-over-month comparison.

## 7. Low-CTR fixes (impressions but low CTR)

For pages with high impressions but CTR below the position benchmark:

- [ ] Rewrite the `TITLE`/`DESC` constants in the page's `page.tsx`
      (drives `pageMetadata`). Front-load the primary keyword + a number/year.
- [ ] Re-inspect + request indexing after deploy.

## 8. Position 8–25 improvement

For pages ranking positions 8–25 (page 1 bottom → page 2–3):

- [ ] Add 3–6 contextual internal links from higher-authority pages in the same
      cluster (see the cluster-nav blocks + `SoftCta`).
- [ ] Expand thin sections; add an FAQ entry targeting the exact query.
- [ ] Ensure the target query appears in H1/H2 and the first 100 words.

## 9. "Crawled/Discovered but not indexed" triage

- [ ] Confirm the URL is in `src/lib/sitemap-data.ts` (canonical, 200, indexable).
- [ ] Confirm it is not a redirect or a deliberately-excluded route (see the
      header comment in `sitemap-data.ts`).
- [ ] Strengthen internal linking to the URL (orphan pages rarely index).
- [ ] If duplicate/thin, consolidate or improve; re-request indexing.

---

### Cadence summary

| When | Action |
|---|---|
| Day 0 | Submit sitemap, inspect + request indexing for priority URLs |
| Day 7 | Indexing check |
| Day 14 | Impressions check |
| Day 30 | Rankings/CTR check, low-CTR + position 8–25 fixes |
| Ongoing | Triage not-indexed URLs; `npm run indexnow` after each push |
