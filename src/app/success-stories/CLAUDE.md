# Success Stories — permanent editorial & SEO standard (project rule)

**Every NRItoUSA Success Story must follow the approved Success Stories editorial
and SEO framework. Do not publish a new story using an ad hoc layout, incorrect
authorship, unverified quotations, unsupported claims, missing source
disclosure, missing contributor review, inconsistent metadata, or incomplete
structured data.**

This rule governs everything under `/success-stories` and the model in
`src/lib/successStories.ts`. Full workflow: `docs/success-stories/README-editorial.md`.

## Non-negotiables
- **Data-driven only.** A story is a `SuccessStory` object + a `Contributor`. No
  bespoke one-off page layouts. Reuse the components in
  `src/components/success-stories/`.
- **Publication gate.** Only `publicationStatus: "published"` stories are routed,
  indexed, sitemapped, or shown in the hub. `assertPublishableStory` throws at
  build if a required field is missing — do not weaken it.
- **Required fields** (enforced): storyType, person name/slug, H1 (`title`),
  `seoTitle`, `metaDescription`, `subtitle`, author (`byline.writtenBy`),
  featured person (`subjectSlug` → a real `Contributor`), `byline.reviewedBy` +
  `reviewStatus`, `editorialNote`, `disclosure`, `journeyAtAGlance`, `keyLessons`,
  `sources`, `pullQuote`. Internal profile URL = the contributor's `authorPageUrl`.
- **Authorship follows `storyType`** via `STORY_TYPE_META` / `resolveAttribution`
  — never make the featured person the author automatically. First-person &
  expert-commentary → person is author; interview / editorial-profile /
  founder-journey / career-case-study → Editorial Team is author, person is the
  subject via schema `about`.
- **Classification is visible.** Show one of: Interview, First-Person Contribution,
  Editorial Profile, Founder Journey, Expert Commentary, Career Case Study. Only
  use "Interview" for a genuinely conducted interview (populate `interviewMeta`).
- **Facts trace to approved sources.** No invented facts. Every published story
  has a visible Sources & verification panel. Don't claim independent
  verification of self-reported facts — say information was "provided by the
  contributor and reviewed against available professional sources."
- **Financial language.** Separate personal experience / general principle /
  advice-requiring-individual-evaluation. Debt used to buy an income-producing
  asset remains a liability (productive leverage depends on cash flow, costs,
  liquidity, risk). Note vesting wherever an employer match is mentioned. Never
  present personal outcomes as guaranteed results. Reframe "invest before the
  green card" as "don't automatically freeze all planning; use what fits your
  status, liquidity, horizon, and risk."
- **Banned phrasing** unless objectively supported: guaranteed success, secret
  formula, anyone can achieve this, risk-free, best investment, proven path,
  highest-paid, most successful.
- **Images.** Approved image only, stored in `/public` (never hotlink LinkedIn),
  explicit width/height, no layout shift, factual alt text, 1200×630 OG image in
  Article schema. No approved photo → initials monogram (never synthesize a face).
- **Schema.** Article/BlogPosting + BreadcrumbList; Person subject via `about`
  with a stable `#person` @id; publisher = Organization. NO FAQPage/QAPage/Review/
  AggregateRating. All schema content must be visible on the page.
- **Links & CTAs.** Contextual internal links with natural anchors where a topic
  first appears. Limit lead-generation (email-gated guide) to ONE contextual
  in-story link + ONE final CTA. Keep everything else educational.
- **Page order.** Breadcrumbs → classification → H1 → summary → featured image →
  authorship/review → editorial disclosure → journey-at-a-glance → key lessons →
  TOC (long) → journey body → timeline → practical takeaways → sources &
  verification → featured-person profile → related guides → related stories →
  final CTA → disclaimer → corrections link. Skip a section only when truly N/A.
- **URLs are permanent.** Do not change `/success-stories` or any existing
  `/success-stories/[slug]`.

## To add a story
1. Complete the consent/verification checklist (README-editorial §2).
2. Add/upgrade the `Contributor`; add a `SuccessStory` (`draft` while in review).
3. Fill every required field; map each claim to a source.
4. Subject review + editorial review, then flip to `published`.
5. `tsc`, build, validate schema, confirm sitemap + mobile. Then deploy.
