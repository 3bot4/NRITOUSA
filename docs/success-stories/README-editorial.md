# NRI Success Stories — Editorial Production System (private)

This directory is the editorial back-office for the `/success-stories` section.
It is **not** in `/public` and is not shipped to the browser. Never place signed
consent forms, transcripts, or personal contact details in `/public`.

The runtime source of truth is [`src/lib/successStories.ts`](../../src/lib/successStories.ts).
Every story is a `SuccessStory` object + a matching `Contributor`. Only stories
with `publicationStatus: "published"` are routed, indexed, added to the sitemap,
or shown in the hub. Everything below governs how a story earns that status.

**The binding project rule lives in [`src/app/success-stories/CLAUDE.md`](../../src/app/success-stories/CLAUDE.md)** —
read it first. `assertPublishableStory` (in successStories.ts) throws at build if
a required field is missing, so an incomplete/ad-hoc story can never ship.

## Story types (visible classification — drives schema authorship)

| Type | Badge | Author (schema) | Featured person |
|------|-------|-----------------|-----------------|
| `interview` | Interview | Editorial Team / named interviewer | subject (`about`), reviewer; set `interviewMeta` |
| `first-person` | First-Person Contribution | the contributor (Person) | author; link internal profile |
| `editorial-profile` | Editorial Profile | Editorial Team | subject (`about`) |
| `founder-journey` | Founder Journey | Editorial Team | subject (`about`) — used for Deepak |
| `expert-commentary` | Expert Commentary | the expert (Person) | author |
| `career-case-study` | Career Case Study | Editorial Team | subject (`about`) |

Never auto-make the featured person the author. Attribution is derived in
`resolveAttribution` / `STORY_TYPE_META`.

## Standard page order (skip a section only when truly N/A)
Breadcrumbs → classification → H1 → summary → featured image → authorship/review
→ editorial disclosure → journey-at-a-glance → key lessons → TOC (long stories)
→ journey body → career timeline → practical takeaways → sources & verification →
featured-person profile → related guides → related stories → final CTA →
disclaimer → corrections link.

## Financial-language rules (YMYL)
- Separate **personal experience / general principle / advice requiring individual evaluation**.
- Debt to buy an income-producing asset **remains a liability**; productive
  leverage depends on cash flow, financing costs, liquidity, market conditions, risk.
- Saving is the foundation; long-term wealth usually needs savings moved into
  productive assets — not "you can't save your way to wealth."
- Immigration uncertainty shouldn't freeze **all** planning; use what fits the
  reader's status, liquidity, horizon, risk — not "invest before the green card."
- Note the **vesting schedule** wherever an employer match appears.
- Never present personal outcomes as guaranteed results. Avoid: guaranteed
  success, secret formula, anyone can achieve this, risk-free, best investment,
  proven path, highest-paid, most successful.

---

## 1. How to add a new story (reusable template)

1. Collect the full source package (see the consent checklist in §2).
2. Add a `Contributor` to `contributors[]` in `src/lib/successStories.ts`
   (or move one out of `pipelineSubjects`). Set `approvedPhoto` only when a real
   approved headshot exists in `/public`; otherwise leave it `null` (initials).
3. Add a `SuccessStory` with `publicationStatus: "draft"` while it's in review.
4. Fill every field. Each biographical claim must trace to an approved source —
   record the mapping in §5 for that subject.
5. Get subject sign-off, then flip `publicationStatus` to `"published"`.
   The hub, `[slug]` route, OG image, schema, and sitemap update automatically.

### Story field checklist
`storyTitle · seoTitle · metaDescription · slug · subjectName · subjectProfileUrl
· subjectPersonId · linkedinUrl · approvedPhoto · photoAlt · currentRole ·
organization · industries · countries · publicationDate · modifiedDate ·
verificationDate · interviewer · writer · editor · reviewer · disclosure ·
timeline · openingScene · questionsAndAnswers · keyTakeaways · approvedQuotes ·
internalLinks · leadMagnet · relatedStories · consentStatus · publicationStatus`

---

## 2. Consent & verification checklist (every profile)

```
[ ] Written consent received
[ ] Photo-use permission received
[ ] Interview completed
[ ] Transcript or written responses saved (privately, not in /public)
[ ] Current role verified
[ ] Credentials verified
[ ] Employer names verified
[ ] Immigration details approved
[ ] Sensitive details removed or approved
[ ] Quotations approved
[ ] Article reviewed by subject
[ ] Editorial review completed
[ ] YMYL review completed where applicable
[ ] LinkedIn URL checked
[ ] Internal links reviewed
[ ] Schema validated
[ ] Social graphic approved
[ ] Final publication approval received
```

---

## 2b. Weekly publishing workflow (one new story per week)

**Before publication**
1. Confirm written permission (name + story)
2. Confirm image rights (or use the monogram)
3. Confirm the approved LinkedIn URL
4. Confirm name spelling
5. Confirm current and former roles
6. Confirm employer names (label former vs current)
7. Review quotations with the subject
8. Verify dates and timeline
9. Set the correct `storyType` classification
10. Choose one primary search intent → `seoTitle`
11. Select relevant internal links (natural anchors, no over-linking)
12. Prepare unique `title` / `seoTitle` / `metaDescription`
13. Confirm the 1200×630 OG image renders
14. Fill structured-data fields (schema is generated from the model)
15. Subject review
16. Editorial review
17. Check mobile layout (~380px)
18. Validate schema (Rich Results + schema.org)
19. Story auto-adds to the sitemap once `published` (verify)
20. Request indexing in Search Console where appropriate

**After publication**
1. It appears on the hub automatically
2. Linked from the contributor profile (`storyUrls`)
3. Add related-story links as the library grows
4. Share an approved LinkedIn post (draft per subject)
5. Add to the contributor's LinkedIn Featured/Publications where appropriate
6. Monitor Search Console impressions and queries
7. Update professional details when notified
8. Re-review the page at least annually (bump `verificationDate` + `modifiedDate`)

## 3. Future subjects (pipeline — NOT published)

Held in `pipelineSubjects` in `src/lib/successStories.ts`. These are **not**
`Contributor`s: no page, no schema, no sitemap, no hub card. They are invitations
only. Each needs a full, approved source package before it can become a story.

| Name | Proposed slug | Status |
|------|---------------|--------|
| Babu Rao Eladasari | `babu-rao-eladasari` | Awaiting interview / source package |
| Ashish Ranjan | `ashish-ranjan` | Awaiting interview / source package |
| Vipin Bhatia | `vipin-bhatia` | Awaiting interview / source package |
| Sudhir Malhotra | `sudhir-malhotra` | Awaiting interview / source package |
| Manoj Tiwari | `manoj-tiwari` | Awaiting interview / source package |
| Vishal Srivastava | `vishal-srivastava` | Awaiting interview / source package |
| Rohit Tandon | `rohit-tandon` | Awaiting interview / source package |

LinkedIn URLs to be supplied by the site owner and stored here once received.

---

## 4. Analytics events

Defined in [`src/components/success-stories/analytics.ts`](../../src/components/success-stories/analytics.ts),
fired via the site's GA4 `trackEvent`. Non-identifying labels only.

| Event | Fired when | Properties |
|-------|-----------|------------|
| `success_story_card_click` | a hub story card is clicked | `story_slug, subject_name, card_position, category` |
| `success_story_filter_used` | a category filter chip is chosen | `category` |
| `success_story_guide_cta_click` | a lead-magnet CTA is clicked | `story_slug, subject_name, cta_location` |
| `success_story_linkedin_click` | subject's LinkedIn link is clicked | `story_slug, subject_name` |
| `success_story_related_resource_click` | a "keep exploring" / book link is clicked | `story_slug, subject_name, resource_name` |
| `success_story_share_click` | a share action is used (when added) | `story_slug, subject_name` |

Newsletter + guide conversions are tracked by the existing `Newsletter` /
`LeadMagnetForm` components (`lead_magnet_submit`, `lead_magnet_download_click`)
plus the UTM tags on the guide CTA (`utm_source=success-stories`).

---

## 5. Source-to-claim map — Deepak Middha story

**Sources**
- **A** — Deepak's published book *Why Immigrants Failed to Build Wealth* (2024),
  `public/free-immigrant-wealth-guide.pdf`. Self-authored, self-published.
- **B** — Existing live site content the owner published: `/about-deepak`,
  `src/lib/author.ts`, `src/lib/site.ts`.

| Claim on the page | Source |
|-------------------|--------|
| Chartered Accountant; Series 65 (credential, not advisory) | A (p4–5), B |
| More than 17 years in hedge fund / alt-investment industry | A (p4) — "more than seventeen years" |
| Born in India, 1984 | A (p22) |
| Arrived married, with wife & children | A (p14) |
| ~$6k–$8k education loans + $15k marriage loan | A (p12–13) |
| Supported brother's tuition + family in India; relatives funded his CA education | A (p13) |
| ~1.5 years renting first | A (p14, p17) |
| First real estate in India 2009–10; ~$10k→~$80k, two others multiplied | A (p15–16) |
| Self-taught trader, no mentor; traded India @9pm Chicago, EU exchanges pre-dawn; six years to 2 a.m. | A (p14, p44) |
| First US property = 2012 foreclosure → seed capital; 2013–14 bought more, still holds | A (p16–17) |
| Helped 10–15 friends buy property | A (p16, p19) |
| Founder of OptionLeo; two-time published author | A (p5, p56), B |
| Founder of NRI to USA / Wealth Building Academy LLC | B |
| Thesis: "waiting for the green card" is the costliest immigrant money mistake | A (p6, p43) |
| Currency-risk example; employer-match "free money"; good vs bad debt | A (p23, p46, p35) |

**All verbatim quotes on the page** are Deepak's own words from Source A (dedication p3,
pp13–16, p35, p46, p53, p56). No dialogue, dates, or facts were invented.

**Editorial framing:** founder profile, disclosed on-page. Written & edited by the
NRItoUSA Editorial Team from Source A + B; quotations are Deepak's own words.
Interviewee/subject = Deepak. **Remaining gate before production deploy:** Deepak's
final review + approval of this specific page (he is the site owner/reviewer).

**Financial language (reframed 2026-07-13):** exact investment-gain figures
(e.g. "$10k→$80k") were removed from the visible page — they are self-reported,
not independently verified, and could read as expected results. Leverage,
save-your-way, pre-green-card investing, and employer-match wording were reframed
per the YMYL rules above (personal experience vs general principle vs
individual-evaluation). Debt figures remain only as starting-point context.

**Not used / pending:** no approved professional headshot exists → initials
monogram (site-wide convention). Do not synthesize a photo. **Owner action:** add
a real approved headshot at `/public/contributors/deepak-middha.jpg` and set
`approvedPhoto` on the contributor to replace the monogram in the hero, cards,
and OG image.

---

## 6. LinkedIn caption — Deepak founder story (first-person draft)

> Save/approve before posting. First-person, for Deepak's own account.

---

When I landed in the U.S., I wasn't thinking about wealth. I was thinking about
clearing a student loan and a marriage loan, supporting family back home, and
finding a rental that felt safe for my wife and kids.

For years, the only time I had to learn investing was after everyone else went to
sleep. I'd come home from a full day in finance and trade the Indian market at
9 p.m., then the European markets before dawn. No mentor. Friends told me not to
risk it. I kept going — because the education I wanted wasn't going to teach
itself.

The lesson I'd give any new immigrant is the one I learned the hard way: don't put
your financial life on hold waiting for a green card. Those are the very years
your money could be compounding. Start small, start now, and separate your
immigration timeline from your investing one.

I shared the whole story — the loans, the first foreclosure I bought, the mistakes,
and what I'd do differently — with the NRItoUSA editorial team. It's live now.

Read it here: https://www.nritousa.com/success-stories/deepak-middha?utm_source=linkedin&utm_medium=social&utm_campaign=success-stories&utm_content=deepak-founder-story

---
