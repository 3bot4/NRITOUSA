# NRI Success Stories — Editorial Production System (private)

This directory is the editorial back-office for the `/success-stories` section.
It is **not** in `/public` and is not shipped to the browser. Never place signed
consent forms, transcripts, or personal contact details in `/public`.

The runtime source of truth is [`src/lib/successStories.ts`](../../src/lib/successStories.ts).
Every story is a `SuccessStory` object + a matching `Contributor`. Only stories
with `publicationStatus: "published"` are routed, indexed, added to the sitemap,
or shown in the hub. Everything below governs how a story earns that status.

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

**Not used / pending:** no approved professional headshot exists → initials
monogram (site-wide convention). Do not synthesize a photo.

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
