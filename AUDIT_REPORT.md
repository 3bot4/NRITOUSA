# Technical Audit — https://www.nritousa.com

**Audit date:** 2026-06-09 · **Method:** full crawl seeded from `sitemap.xml` (105 URLs), every internal page fetched (0.5 s polite delay, custom User-Agent), every internal + external link and image checked, fragment anchors validated, per-page SEO extraction, social-profile verification with both bot and browser User-Agents.

---

## Executive summary

| Metric | Result |
|---|---|
| Pages crawled | **105** (sitemap and crawl are perfectly in sync — 0 orphans, 0 missing) |
| Internal pages returning 200 | **105 / 105** ✅ |
| Internal broken links / redirect chains | **0** ✅ |
| Broken images | **0** (site uses no `<img>` tags; visuals are CSS/emoji) ✅ |
| Broken fragment anchors | **0** ✅ |
| Placeholder links (`#`, `javascript:void`) | **0** ✅ |
| Broken external links | **3 hard** (Twitter, YouTube, LinkedIn profiles don't exist) + 1 likely (Instagram) |
| Mislinked elements (soft errors) | **13** — all on the homepage |
| Email deliverability | 🔴 **`nritousa.com` has no MX records** — `hello@nritousa.com` cannot receive mail |
| SEO basics | Titles, descriptions, canonicals, single H1: **perfect on all 105 pages**; `og:image` missing on 29 non-article pages |

The site's link hygiene is fundamentally healthy — every internal URL resolves, with no redirect chains and no 404s. The real problems are **(1) social links to accounts that don't exist, rendered in the footer of all 105 pages, (2) a dead contact email domain, and (3) a cluster of misleading/mislinked cards on the homepage**, including fake community reply counts and story teasers for articles that were never written.

---

## 1. Broken external links (hard 4xx)

| Status | URL | Anchor text | Where it appears |
|---|---|---|---|
| **404** | `https://twitter.com/nritousa` | "Twitter" / "Twitter / X" | Footer of **all 105 pages** + /contact |
| **301 → 404** | `https://youtube.com/@nritousa` | "YouTube" | Footer of **all 105 pages** + /contact |
| **301 → 404** | `https://linkedin.com/company/nritousa` | "LinkedIn" | /contact |
| **301 → 200** ⚠️ | `https://instagram.com/nritousa` | "Instagram" | Footer of **all 105 pages** + /contact |

- **YouTube and LinkedIn are confirmed dead** — they 404 even with a real browser User-Agent.
- **Twitter** returns 404 to direct requests; `x.com/nritousa` serves only a JS shell, so it can't be conclusively verified by a crawler — but given the other three, the account almost certainly doesn't exist.
- **Instagram** returns 200, but that's a login-wall JS shell with **no profile metadata** (a real profile embeds `og:title "… (@nritousa)"`). Likely doesn't exist either.

All four URLs come from a single source: [src/lib/site.ts:18-23](src/lib/site.ts#L18-L23) (`site.social`), rendered by [Footer.tsx:72-78](src/components/Footer.tsx#L72-L78) and [contact/page.tsx:111-120](src/app/contact/page.tsx#L111-L120). Note `twitterHandle: "@nritousa"` at [site.ts:25](src/lib/site.ts#L25) is also emitted in `twitter:site` meta cards sitewide.

**Fix:** either create these profiles, or remove the social block from `site.ts` until they exist. Linking every page of the site to four dead profiles hurts trust and E-E-A-T signals.

### External warnings (not broken, worth knowing)

| Status | URL | Where | Note |
|---|---|---|---|
| 403 | `https://www.annualcreditreport.com/` | /articles/ssn-financial-next-steps | Blocks bots; works for real users. No action needed. |
| 8 redirect hops → "not supported" page | `https://www.google.com/settings/ads` | /privacy-policy | Legacy URL bounces through 8 redirects and lands on `myaccount.google.com/not-supported`. Replace with `https://adssettings.google.com`. |

All other external links (IRS, Google policy pages) return 200 cleanly. The only `mailto:` on the site is `hello@nritousa.com` — see §3.

---

## 2. Mislinked elements (soft errors) — all on the homepage `/`

### 2a. Wrong destinations (confirmed)

| # | Element / anchor text | Current href | Correct href | Fix location |
|---|---|---|---|---|
| 1 | Featured-topics card **"🛬 New to USA — Your first-week checklist: SSN, bank account, phone plan…"** | `/topics/finance` | `/topics/new-to-usa` | [FeaturedTopics.tsx:11](src/components/home/FeaturedTopics.tsx#L11) |
| 2 | Popular-guides card **"Getting Started — First 30 Days in the USA: Banking, Phone, Credit Card, Apartment"** | `/topics/finance` | `/articles/first-30-days-in-usa` (article exists and returns 200) | [PopularGuides.tsx:13](src/components/home/PopularGuides.tsx#L13) |
| 3 | Finance-hub chip **"🛡️ Insurance"** | `/topics/cars` | `/topics/insurance` (topic exists; the footer's own Insurance link points there correctly) | [FinanceHub.tsx:13](src/components/home/FinanceHub.tsx#L13) |
| 4 | Finance-hub chip **"🩺 HSA"** | `/topics/finance` | `/articles/hsa-vs-fsa-explained` or `/topics/insurance` — the HSA article is categorized under Insurance, not Finance | [FinanceHub.tsx:11](src/components/home/FinanceHub.tsx#L11) |

All three user-reported suspects are confirmed: the *First 30 Days* card and *New to USA* card both dump users on `/topics/finance`, and the *Insurance* chip goes to `/topics/cars`.

### 2b. Community Q&A cards — misleading destination + fabricated counts

Five homepage cards styled as forum threads, each showing a reply count, all linking to `/topics/community` — which is a **plain 2-article topic page with no forum, no threads, and no replies**:

| Card text | Shown count | Links to |
|---|---|---|
| "Is it better to rent for 2 years before buying?" (Housing) | 34 replies | `/topics/community` |
| "Best credit card for new immigrants?" (Credit) | 58 replies | `/topics/community` |
| "Should I invest in India after moving to USA?" (Investing) | 41 replies | `/topics/community` |
| "How much emergency fund should an immigrant family keep?" (Finance) | 27 replies | `/topics/community` |
| "Should I buy a used car or lease a new car?" (Cars) | 49 replies | `/topics/community` |

Source: [CommunityPreview.tsx](src/components/home/CommunityPreview.tsx) (hard-coded `replies:` values at lines 9–29; both links at lines 47 and 80, plus a "Join the Community" CTA).

**Fix options:** (a) remove the reply counts and link each question to the matching article (`/articles/rent-vs-buy-house-immigrants`, `/articles/best-secured-credit-cards-immigrants`, `/articles/invest-indian-stock-market-nri`, `/articles/emergency-fund-for-families-usa`, `/articles/buy-vs-lease-car-no-credit`); or (b) hold this section until the real community feature ships (the repo has an uncommitted `/community` forum in development — live `/community` currently 404s). Fabricated engagement numbers are a genuine trust/credibility liability.

### 2c. Story cards — teasers for articles that don't exist

Four homepage story cards each link generically to `/topics/stories`, but **none of the four stories exists as an article** (the Stories topic contains only `things-i-wish-i-knew-before-moving-usa` and `from-h1b-to-green-card-my-story`):

- "My First Year in America" — [StoriesPreview.tsx:7-12](src/components/home/StoriesPreview.tsx#L7-L12)
- "Mistakes I Made Buying My First Car" — [StoriesPreview.tsx:15-20](src/components/home/StoriesPreview.tsx#L15-L20)
- "What I Wish I Knew Before Renting" — [StoriesPreview.tsx:23-28](src/components/home/StoriesPreview.tsx#L23-L28)
- "Learning About 401k Too Late" — [StoriesPreview.tsx:31-36](src/components/home/StoriesPreview.tsx#L31-L36)

**Fix:** write the four stories, or replace the cards with the two real story articles + relevant first-person pieces.

### 2d. Duplicate destinations (minor)

Finance-hub chips "📊 401k" and "🌱 Roth IRA" both → `/topics/retirement`; "🏦 Banking", "🩺 HSA", "🛟 Emergency Fund" all → `/topics/finance`; "📈 US Investing" and "🇮🇳 India Investing" both → `/topics/investing`. Ten chips resolve to only six destinations. Consider pointing chips at the most relevant *article* instead (e.g. Emergency Fund → `/articles/emergency-fund-first-year-usa`, Roth IRA → `/articles/roth-ira-vs-traditional-nri`). Nav/footer repetition of topic links is normal and was excluded.

No placeholder links (`#`, `javascript:void`) and no broken in-page anchors exist anywhere on the site (the homepage's `#topics` anchor resolves correctly).

---

## 3. Email: `hello@nritousa.com` is undeliverable 🔴

`nritousa.com` has **no MX records** (verified against 8.8.8.8). The domain resolves (A → 76.76.21.21, Vercel) and has a Google site-verification TXT record, but any email sent to `hello@nritousa.com` — the address on /contact, /about, and the footer `mailto:` — will bounce. **Set up email routing** (Google Workspace, Zoho, or free Cloudflare Email Routing / ImprovMX forwarding) or remove the address.

---

## 4. Redirect issues

| URL | Behavior | Action |
|---|---|---|
| `https://www.nritousa.com/privacy` | **HTTP 308 with no `Location` header** and a Next.js error-page body — browsers cannot follow it; it's a dead end. Not linked internally, but if it was ever indexed/shared it's broken. | Make [src/app/privacy/page.tsx](src/app/privacy/page.tsx) a proper `permanentRedirect("/privacy-policy")` and verify the deployed response carries `Location`, or delete the route. |
| `instagram.com/nritousa`, `youtube.com/@nritousa`, `linkedin.com/company/nritousa` | 301 to `www.` variants before resolving | Cosmetic; use the canonical `www.`/full URLs in `site.ts` when fixing §1. |
| `google.com/settings/ads` (on /privacy-policy) | 301 + 7 more hops → "not supported" page | Replace with `https://adssettings.google.com`. |

**Zero internal redirect chains** — every internal link resolves directly with 200. ✅

---

## 5. SEO audit

**Strong baseline.** All 105 pages have: unique `<title>`, unique meta description, correct self-referencing canonical, and exactly one `<h1>`. No duplicates anywhere. robots.txt is valid and references the sitemap; sitemap contains exactly the 105 live URLs with no orphans in either direction.

**Findings:**

1. **`og:image` missing on 29 non-article pages.** All 75 articles serve a dynamic `opengraph-image` (every one verified 200 ✅) and the homepage has one, but these lack it: `/about`, `/contact`, `/resources`, `/topics`, all 16 `/topics/*` pages, `/calculators`, all 6 `/calculators/*` pages, `/privacy-policy`, `/terms-of-use`, `/disclaimer`. Topic and calculator pages are exactly the ones people share — add a default `opengraph-image.tsx` at the app root or per-segment.
2. **`twitter:site` / `twitter:creator` point to `@nritousa`**, which appears not to exist (§1).
3. robots.txt disallows `/api/`, `/admin/`, `/private/` — appropriate; none are linked from public pages.

---

## 6. Prioritized fix list

| P | Issue | Effort |
|---|---|---|
| **P0** | Set up MX/email for `hello@nritousa.com` — the site's only contact channel currently bounces | Config, ~30 min |
| **P0** | Fix 3 wrong hrefs: [FeaturedTopics.tsx:11](src/components/home/FeaturedTopics.tsx#L11) → `/topics/new-to-usa`, [PopularGuides.tsx:13](src/components/home/PopularGuides.tsx#L13) → `/articles/first-30-days-in-usa`, [FinanceHub.tsx:13](src/components/home/FinanceHub.tsx#L13) → `/topics/insurance` | 3-line diff |
| **P0** | Remove or fix dead social links in [site.ts:18-25](src/lib/site.ts#L18-L25) (Twitter, YouTube, LinkedIn confirmed dead; Instagram likely) — rendered on every page | Small |
| **P1** | CommunityPreview: drop fabricated reply counts; link cards to the 5 matching articles (or ship the real `/community` forum that's in the repo and point there) | Small–medium |
| **P1** | StoriesPreview: 4 teaser cards for stories that don't exist — write them or swap in the 2 real story articles | Content |
| **P1** | Add default `og:image` for the 29 non-article pages (root `opengraph-image.tsx`) | Small |
| **P2** | [FinanceHub.tsx:11](src/components/home/FinanceHub.tsx#L11) HSA chip → `/articles/hsa-vs-fsa-explained`; de-duplicate chip destinations | Small |
| **P2** | Fix `/privacy` 308-without-Location dead end | Small |
| **P2** | Replace `google.com/settings/ads` with `adssettings.google.com` on /privacy-policy | 1 line |

Machine-readable issue list: [broken_links.csv](broken_links.csv).

---

## Appendix A — All 105 URLs: status + SEO checklist

Every URL below returned **HTTP 200** directly (no redirect hops). H1 = number of `<h1>` elements. og:image "—" = missing (see §5).

| # | URL | Status | Title present | Meta desc | Canonical | H1 | og:image |
|---|---|---|---|---|---|---|---|
| 1 | / | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 2 | /about | 200 | ✅ | ✅ | ✅ | 1 | — |
| 3 | /articles/401k-match-explained-nri | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 4 | /articles/72t-sepp-401k-early-withdrawal | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 5 | /articles/auto-insurance-basics-new-drivers | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 6 | /articles/backdoor-roth-ira-nri | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 7 | /articles/best-bank-account-nri-usa | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 8 | /articles/best-secured-credit-cards-immigrants | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 9 | /articles/best-worst-tax-states-h1b | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 10 | /articles/brokerage-account-basics-usa | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 11 | /articles/build-us-credit-score-from-zero | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 12 | /articles/building-community-as-new-immigrant | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 13 | /articles/buy-car-without-cosigner | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 14 | /articles/buy-vs-lease-car-no-credit | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 15 | /articles/buying-first-home-on-visa | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 16 | /articles/car-lease-buyout-visa-timeline | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 17 | /articles/catch-up-missed-fbar-streamlined | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 18 | /articles/cheap-car-insurance-foreign-license | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 19 | /articles/cheapest-way-send-money-usa-india | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 20 | /articles/choosing-city-state-usa | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 21 | /articles/common-mistakes-new-immigrants | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 22 | /articles/convert-resident-account-to-nre-nro | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 23 | /articles/cosign-mortgage-visa-holder | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 24 | /articles/cost-of-moving-india-to-usa | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 25 | /articles/credit-card-basics-international-students | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 26 | /articles/credit-utilization-explained | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 27 | /articles/cultural-adjustment-money-decisions | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 28 | /articles/documents-to-keep-safe-usa | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 29 | /articles/double-taxation-dtaa-india-usa | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 30 | /articles/emergency-fund-first-year-usa | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 31 | /articles/emergency-fund-for-families-usa | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 32 | /articles/fbar-fatca-nri-guide | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 33 | /articles/fcnr-deposit-usd-yield | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 34 | /articles/fha-loan-non-citizen-visa | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 35 | /articles/first-30-days-in-usa | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 36 | /articles/first-7-days-in-usa | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 37 | /articles/first-apartment-lease-guide | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 38 | /articles/from-h1b-to-green-card-my-story | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 39 | /articles/gifting-money-india-tax-implications | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 40 | /articles/h1b-first-tax-return-guide | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 41 | /articles/h4-l2-dependent-health-insurance | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 42 | /articles/health-insurance-basics-immigrants | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 43 | /articles/healthcare-planning-immigrant-families | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 44 | /articles/how-much-rent-can-you-afford | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 45 | /articles/hsa-after-leaving-usa | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 46 | /articles/hsa-vs-fsa-explained | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 47 | /articles/index-funds-for-beginners-nri | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 48 | /articles/indian-income-us-tax-return | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 49 | /articles/indian-ppf-taxable-usa | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 50 | /articles/inheriting-indian-assets-us-tax | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 51 | /articles/invest-indian-stock-market-nri | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 52 | /articles/moving-to-usa-with-family-checklist | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 53 | /articles/nre-nro-accounts-explained | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 54 | /articles/open-us-bank-account-before-arriving | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 55 | /articles/opt-h1b-financial-planning-students | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 56 | /articles/pfic-indian-mutual-funds-trap | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 57 | /articles/phone-plan-utilities-immigrants | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 58 | /articles/rent-apartment-no-credit-history | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 59 | /articles/rent-vs-buy-house-immigrants | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 60 | /articles/renters-insurance-explained | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 61 | /articles/repatriate-india-property-sale-usa | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 62 | /articles/roth-ira-vs-traditional-nri | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 63 | /articles/school-district-basics-immigrant-parents | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 64 | /articles/selling-indian-shares-us-resident-tax | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 65 | /articles/selling-us-home-nri-firpta | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 66 | /articles/social-security-benefits-leaving-us | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 67 | /articles/ssn-financial-next-steps | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 68 | /articles/substantial-presence-test-explained | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 69 | /articles/tcs-education-remittance-tuition | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 70 | /articles/tcs-india-remittance-tax | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 71 | /articles/term-life-insurance-immigrant-families | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 72 | /articles/things-i-wish-i-knew-before-moving-usa | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 73 | /articles/transfer-401k-to-india-nps-ppf | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 74 | /articles/transfer-money-india-us-home-downpayment | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 75 | /articles/us-1-percent-remittance-fee | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 76 | /articles/usa-money-guide-indian-students | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 77 | /articles/what-happens-to-401k-leaving-usa | 200 | ✅ | ✅ | ✅ | 1 | ✅ |
| 78 | /calculators | 200 | ✅ | ✅ | ✅ | 1 | — |
| 79 | /calculators/401k-return-to-india | 200 | ✅ | ✅ | ✅ | 1 | — |
| 80 | /calculators/backdoor-roth-eligibility | 200 | ✅ | ✅ | ✅ | 1 | — |
| 81 | /calculators/india-property-capital-gains | 200 | ✅ | ✅ | ✅ | 1 | — |
| 82 | /calculators/remittance-tcs-cost | 200 | ✅ | ✅ | ✅ | 1 | — |
| 83 | /calculators/rent-vs-buy-visa | 200 | ✅ | ✅ | ✅ | 1 | — |
| 84 | /calculators/rnor-tax-residency | 200 | ✅ | ✅ | ✅ | 1 | — |
| 85 | /contact | 200 | ✅ | ✅ | ✅ | 1 | — |
| 86 | /disclaimer | 200 | ✅ | ✅ | ✅ | 1 | — |
| 87 | /privacy-policy | 200 | ✅ | ✅ | ✅ | 1 | — |
| 88 | /resources | 200 | ✅ | ✅ | ✅ | 1 | — |
| 89 | /terms-of-use | 200 | ✅ | ✅ | ✅ | 1 | — |
| 90 | /topics | 200 | ✅ | ✅ | ✅ | 1 | — |
| 91 | /topics/cars | 200 | ✅ | ✅ | ✅ | 1 | — |
| 92 | /topics/community | 200 | ✅ | ✅ | ✅ | 1 | — |
| 93 | /topics/credit | 200 | ✅ | ✅ | ✅ | 1 | — |
| 94 | /topics/families | 200 | ✅ | ✅ | ✅ | 1 | — |
| 95 | /topics/finance | 200 | ✅ | ✅ | ✅ | 1 | — |
| 96 | /topics/housing | 200 | ✅ | ✅ | ✅ | 1 | — |
| 97 | /topics/insurance | 200 | ✅ | ✅ | ✅ | 1 | — |
| 98 | /topics/investing | 200 | ✅ | ✅ | ✅ | 1 | — |
| 99 | /topics/money-transfer | 200 | ✅ | ✅ | ✅ | 1 | — |
| 100 | /topics/new-to-usa | 200 | ✅ | ✅ | ✅ | 1 | — |
| 101 | /topics/property | 200 | ✅ | ✅ | ✅ | 1 | — |
| 102 | /topics/retirement | 200 | ✅ | ✅ | ✅ | 1 | — |
| 103 | /topics/stories | 200 | ✅ | ✅ | ✅ | 1 | — |
| 104 | /topics/students | 200 | ✅ | ✅ | ✅ | 1 | — |
| 105 | /topics/taxes | 200 | ✅ | ✅ | ✅ | 1 | — |
