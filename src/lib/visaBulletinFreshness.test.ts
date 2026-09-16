/**
 * Freshness guards for the monthly Visa Bulletin refresh.
 *
 * docs/DATA-UPDATE-PLAYBOOK.md §1 step 4 calls the hard-coded-copy sweep "the
 * step most likely to get missed, because none of it is caught by
 * `npm run audit:monthly-numbers`". These tests close that hole: they read the
 * bulletin month straight out of data/visa-bulletin/current.json and fail when
 * a page still narrates the PREVIOUS bulletin.
 *
 * The design rule that keeps this useful rather than noisy: every assertion is
 * "the guarded file must name the CURRENT bulletin month", never "no other
 * month may appear". Several pages quote earlier bulletins on purpose (the
 * Retrogression worked example, the monthly-update tracking table, the DOS
 * statement quoted on the predictions page) and a blanket month-scan would
 * turn those into permanent false positives.
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  bulletin,
  fiscalYear,
  fiscalYearLabel,
  dosBulletinUrl,
  formatBulletinMonth,
} from "@/lib/visa-bulletin";

const SRC = join(__dirname, "..");
const read = (rel: string) => readFileSync(join(SRC, rel), "utf8");

/** e.g. "September 2026" for the bulletin currently in the data files. */
const CURRENT_LABEL = formatBulletinMonth(bulletin.month);

/* ------------------------------------------------------------------ *
 * Fiscal year + source URL — the two FY-rollover traps, encoded.
 * ------------------------------------------------------------------ */

describe("fiscal year derivation", () => {
  it("rolls over at October, not January", () => {
    expect(fiscalYear("2026-09")).toBe(2026);
    expect(fiscalYear("2026-10")).toBe(2027);
    expect(fiscalYear("2026-12")).toBe(2027);
    expect(fiscalYear("2027-09")).toBe(2027);
  });

  it("labels the year the way the bulletin copy spells it", () => {
    expect(fiscalYearLabel("2026-10")).toBe("FY 2027");
  });
});

describe("official DOS bulletin URL", () => {
  it("files October under the NEXT fiscal year's folder", () => {
    // Verified against data/visa-bulletin/_verified-backfill: the October 2025
    // bulletin really does live under /2026/.
    expect(dosBulletinUrl("2025-10")).toBe(
      "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin/2026/visa-bulletin-for-october-2025.html",
    );
    expect(dosBulletinUrl("2026-10")).toBe(
      "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin/2027/visa-bulletin-for-october-2026.html",
    );
  });

  it("keeps pre-October months in their calendar-year folder", () => {
    expect(dosBulletinUrl("2026-09")).toBe(
      "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin/2026/visa-bulletin-for-september-2026.html",
    );
  });

  it("reproduces the source URL current.json actually carries", () => {
    // If these diverge, one of them was hand-typed wrong.
    const current = JSON.parse(
      readFileSync(join(SRC, "..", "data", "visa-bulletin", "current.json"), "utf8"),
    );
    expect(current.source).toBe(dosBulletinUrl(current.bulletinMonth));
  });
});

/* ------------------------------------------------------------------ *
 * Hard-coded prose must follow the data.
 * ------------------------------------------------------------------ */

/**
 * Files that narrate the current bulletin in prose. Each is listed in the
 * playbook's step-4 sweep; the point of this test is that forgetting one is a
 * red build rather than a silently stale page.
 */
const NARRATES_CURRENT_BULLETIN = [
  "lib/visa-bulletin.ts",
  "lib/visaBulletinCluster.ts",
  "lib/greenCardCluster.ts",
  "lib/toolHubContent.ts",
  "data/immigration-tracker-data.ts",
  "app/visa-bulletin/page.tsx",
  "app/uscis/page.tsx",
  "app/tools/visa-green-card/page.tsx",
  "app/green-card/page.tsx",
];

describe("hard-coded bulletin prose tracks the data files", () => {
  it.each(NARRATES_CURRENT_BULLETIN)("%s names the current bulletin month", (rel) => {
    expect(
      read(rel),
      `${rel} does not mention "${CURRENT_LABEL}" — it is probably still narrating the previous bulletin. See docs/DATA-UPDATE-PLAYBOOK.md §1 step 4.`,
    ).toContain(CURRENT_LABEL);
  });
});

/**
 * The "contains" check above is a backstop and can be satisfied by an
 * incidental mention (a link to /visa-bulletin/october-2026-predictions, a doc
 * comment naming a month). What actually goes stale is a PRESENT-TENSE claim
 * about which bulletin is in force, so match those framings specifically and
 * require every one of them to name the current month.
 *
 * Each alternative below is a phrasing that really appears in the codebase —
 * keep this list in sync with the copy rather than trying to be exhaustive.
 */
const LIVE_CLAIM = new RegExp(
  [
    // "As of the September 2026 Visa Bulletin", "in the September 2026 bulletin"
    /(?:[Aa]s of the|[Ii]n the)\s+([A-Z][a-z]+ \d{4})\s+(?:Visa Bulletin|bulletin)/
      .source,
    // "September 2026 Visa Bulletin:", "September 2026 update:"
    /([A-Z][a-z]+ \d{4})\s+(?:Visa Bulletin:|USCIS filing chart:|update:)/.source,
    // Sentence-initial "For September 2026, EB-2 India is …". Anchored to a
    // sentence boundary so it cannot swallow "…determination is for August
    // 2026, which required…", which is a deliberate reference to a PRIOR month.
    /(?:^|[.>]\s|\*\*)For\s+([A-Z][a-z]+ \d{4}),/.source,
  ].join("|"),
  "gm",
);

/**
 * Some month references are deliberately historical and must survive the
 * refresh — the Retrogression page's "One recent example: in the July 2026
 * bulletin…" worked example is called out by name in the playbook as something
 * never to rename. Those read as past-tense narration, so skip a match when the
 * text immediately before it flags one.
 */
const HISTORICAL_CUE = /example|previously|historically|back in|earlier this|at the time/i;

describe("present-tense bulletin claims name the current month", () => {
  it.each(NARRATES_CURRENT_BULLETIN)("%s makes no stale live claim", (rel) => {
    const src = read(rel);
    for (const match of src.matchAll(LIVE_CLAIM)) {
      const lead = src.slice(Math.max(0, match.index! - 80), match.index!);
      if (HISTORICAL_CUE.test(lead)) continue;
      const month = match[1] ?? match[2] ?? match[3];
      expect(
        month,
        `${rel} claims "${match[0].trim()}" but the current bulletin is ${CURRENT_LABEL}.`,
      ).toBe(CURRENT_LABEL);
    }
  });
});

/**
 * "…no numbers for the remainder of FY 2026" is true in a September bulletin
 * and false in an October one. Any live claim about the fiscal year has to name
 * the fiscal year the CURRENT bulletin belongs to.
 *
 * The predictions page is deliberately excluded: it quotes the Department of
 * State's own FY2026 statement verbatim, which stays historically true.
 */
const FY_CLAIM = /(?:remainder|rest|balance) of FY ?(\d{4})/g;

describe("fiscal-year claims match the current bulletin's fiscal year", () => {
  it.each(NARRATES_CURRENT_BULLETIN)("%s makes no stale FY claim", (rel) => {
    const expected = fiscalYear(bulletin.month);
    for (const [phrase, year] of read(rel).matchAll(FY_CLAIM)) {
      expect(
        Number(year),
        `${rel} says "${phrase}" but the ${CURRENT_LABEL} bulletin is in FY ${expected}.`,
      ).toBe(expected);
    }
  });
});

/**
 * Visible freshness badges. The playbook records one of these being stale by a
 * full month because a search looked for the previous month's name only — so
 * this matches the PATTERN and checks the month it found.
 */
const BADGE_PAGES = ["app/green-card/page.tsx", "app/tools/visa-green-card/page.tsx"];

describe('"Updated <Month> <Year>" badges', () => {
  it.each(BADGE_PAGES)("%s badge shows the current bulletin month", (rel) => {
    const badges = [...read(rel).matchAll(/Updated ([A-Z][a-z]+ \d{4})/g)].map((m) => m[1]);
    expect(badges.length, `${rel} has no "Updated <Month> <Year>" badge`).toBeGreaterThan(0);
    for (const badge of badges) {
      expect(badge, `${rel} badge is stale`).toBe(CURRENT_LABEL);
    }
  });
});

/**
 * The sitemap's bulletin routes carry an explicit lastModified. It must belong
 * to the current bulletin's release cycle — a bulletin published mid-September
 * cannot be stamped with an August date.
 */
describe("sitemap bulletinRefresh stamp", () => {
  it("falls inside the current bulletin's release cycle", () => {
    const src = read("lib/sitemap-data.ts");
    const m = src.match(/const bulletinRefresh = new Date\("(\d{4}-\d{2}-\d{2})"\)/);
    expect(m, "bulletinRefresh constant not found in sitemap-data.ts").toBeTruthy();

    // A bulletin for month M publishes during M-1, so the stamp must be no
    // older than the first day of M-1.
    const [y, mo] = bulletin.month.split("-").map(Number);
    const earliest = new Date(Date.UTC(y, mo - 2, 1));
    expect(
      new Date(m![1]).getTime(),
      `bulletinRefresh is ${m![1]}, which predates the ${CURRENT_LABEL} bulletin cycle.`,
    ).toBeGreaterThanOrEqual(earliest.getTime());
  });
});
