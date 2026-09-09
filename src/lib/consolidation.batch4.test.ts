/**
 * Regression guard for the Sep 2026 cannibalisation pass (Batch 4).
 *
 * Three pages were merged after GSC + Bing data showed every page in the set
 * sitting at Google positions 39–72 with ZERO Google clicks:
 *
 *   /uscis/processing-times  → /tools/processing-times
 *   /renew-green-card-online → /green-card-renewal
 *   /expired-green-card      → /green-card-renewal
 *
 * The rule the pass ran on was "no content is deleted" — every unique block on a
 * retired page moved to its destination BEFORE the 301 fired. These tests lock
 * in both halves of that:
 *
 *   1. NEGATIVE — nothing links to the three retired URLs any more (a link to a
 *      redirect source costs a hop and leaks equity), and the two I-485 pages
 *      no longer duplicate each other's job.
 *   2. POSITIVE — the moved blocks are actually present on the destinations. A
 *      later edit that quietly drops one would otherwise lose content that no
 *      longer has a source page to go back to.
 *
 * sitemap.redirects.test.ts already parses next.config.mjs and proves none of
 * these URLs is still in a sitemap, so that is not repeated here.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, sep } from "node:path";
import { describe, expect, it } from "vitest";
import { greenCardRenewalFaqs } from "@/data/greenCardRenewalData";
import { gcRenewalClusterLinks } from "@/lib/greenCardRenewalCluster";

const ROOT = join(__dirname, "..", "..");
const SRC_DIR = join(ROOT, "src");
const APP_DIR = join(SRC_DIR, "app");
const THIS_FILE = "consolidation.batch4.test.ts";

/** The three URLs retired by this pass. Internal links must never point here. */
const RETIRED = [
  "/uscis/processing-times",
  "/renew-green-card-online",
  "/expired-green-card",
] as const;

function sourceFiles(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) sourceFiles(full, out);
    else if (
      (full.endsWith(".ts") || full.endsWith(".tsx")) &&
      !full.endsWith(".test.ts") &&
      !full.endsWith(".test.tsx")
    ) {
      out.push(full);
    }
  }
  return out;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Matches a retired path used as a real LINK — a JSX `href`, an `href:` object
 * property, or a markdown `](/path)` — terminated so that
 * "/expired-green-card" never matches "/expired-green-card-foo" and the
 * "#renew-online" style hub anchors are not mistaken for the old page.
 */
function linkUsageRegex(path: string): RegExp {
  const p = escapeRe(path);
  return new RegExp(
    `href\\s*[:=]\\s*\\{?\\s*["'\`]${p}["'\`]` + `|\\]\\(${p}[)#?]`,
  );
}

const allSourceFiles = sourceFiles(SRC_DIR);

function pageText(relFromApp: string): string {
  return readFileSync(join(APP_DIR, relFromApp), "utf8");
}

describe("Batch 4 — nothing links to a retired URL", () => {
  it("scans a non-empty set of source files", () => {
    expect(allSourceFiles.length).toBeGreaterThan(100);
  });

  it.each(RETIRED)("no internal link points at %s", (path) => {
    const re = linkUsageRegex(path);
    const offenders = allSourceFiles
      .filter((f) => !f.endsWith(THIS_FILE))
      .filter((f) => re.test(readFileSync(f, "utf8")))
      .map((f) => f.split(sep).slice(-3).join("/"));
    expect(offenders).toEqual([]);
  });

  it.each(RETIRED)("%s no longer has a route directory", (path) => {
    const dir = join(APP_DIR, ...path.split("/").filter(Boolean));
    let exists = true;
    try {
      statSync(dir);
    } catch {
      exists = false;
    }
    expect(exists).toBe(false);
  });

  it("drops both retired pages from the green-card-renewal cluster links", () => {
    const hrefs = gcRenewalClusterLinks.map((l) => l.href);
    expect(hrefs).not.toContain("/renew-green-card-online");
    expect(hrefs).not.toContain("/expired-green-card");
    // the survivors are untouched
    expect(hrefs).toContain("/green-card-renewal");
    expect(hrefs).toContain("/green-card-renewal-fee");
    expect(hrefs).toContain("/i90-vs-i751");
  });
});

describe("Batch 4 Step 1 — the USCIS processing-times guide landed on the tool", () => {
  const guide = readFileSync(
    join(SRC_DIR, "components", "tools", "UscisProcessingTimesGuide.tsx"),
    "utf8",
  );
  const page = pageText("tools/processing-times/page.tsx");

  it("the tool page renders the migrated guide", () => {
    expect(page).toContain("UscisProcessingTimesGuide");
  });

  it.each([
    ["the Processing Delay Checker", "UscisProcessingDelayChecker"],
    ["how USCIS calculates published times", "receipt dates of cases USCIS is currently completing"],
    ["the 80th-percentile mechanic", "80% of completed cases"],
    ["the outside-normal inquiry procedure", "outside normal processing time"],
    ["service-centre guidance", "Correct service center"],
    ["the regular-vs-premium comparison", "Regular vs. premium processing"],
  ])("keeps %s", (_label, needle) => {
    expect(guide).toContain(needle);
  });

  it("does not duplicate the premium fee table the tool page already renders", () => {
    // Match the import, not the bare name — the guide's header comment
    // explains why it deliberately leaves the table to the route.
    expect(guide).not.toContain("import PremiumProcessingFeeTable");
    expect(guide).not.toContain("<PremiumProcessingFeeTable />");
    expect(page).toContain("import PremiumProcessingFeeTable");
  });

  it.each([
    "What does USCIS processing time mean?",
    "Where do I check official USCIS processing times?",
    "What is premium processing and does it guarantee approval?",
    "What is the processing time for I-140 for Indian applicants?",
    "How long does an EAD (I-765) take to process?",
    "Does a case transfer reset my processing time?",
    "Can I check processing times for my specific case?",
  ])("carries the migrated FAQ %j", (q) => {
    expect(page).toContain(q);
  });
});

describe("Batch 4 Steps 2 & 3 — I-140 / I-485 form pages de-duplicated", () => {
  const forms = readFileSync(join(SRC_DIR, "lib", "uscisFormsCluster.ts"), "utf8");
  const i140 = pageText("i140-processing-time/page.tsx");

  it("the I-140 form page keeps the fee block and points timing out", () => {
    expect(forms).toContain('filingFee: "$715"');
    expect(forms).toContain("$600 Asylum Program Fee");
    expect(forms).toContain("[I-140 processing time](/i140-processing-time)");
    expect(forms).toContain("[I-140 premium processing](/i140-premium-processing)");
  });

  it("the I-485 form page points timing at the cluster instead of restating it", () => {
    expect(forms).toContain("[I-485 processing time](/i485-processing-time)");
    expect(forms).toContain("[I-485 timeline](/i485-timeline)");
    // the old four-sentence processing block is gone
    expect(forms).not.toContain(
      "USCIS publishes I-485 inventory data that gives a rough sense of the queue size",
    );
  });

  it("the I-140 timing page drops the filing-fee row and links to the fee owner", () => {
    expect(i140).toContain("timingSnapshotRows");
    expect(i140).toContain('r.label !== "Filing fee"');
    expect(i140).toContain("/uscis/forms/i-140");
  });

  it("retitles the I-140 timing page with a real differentiator, from the data file", () => {
    // The number must stay derived — a hardcoded "~4 Months" would silently rot.
    expect(i140).toContain(
      "I-140 Processing Time 2026: ~${i140ProcessingData.standardMedianMonths} Months Regular",
    );
    expect(i140).not.toContain('title: "I-140 Processing Time 2026",');
  });
});

describe("Batch 4 Step 4 — the I-485 pair split, with no redirect", () => {
  const timeline = pageText("i485-timeline/page.tsx");
  const processing = pageText("i485-processing-time/page.tsx");

  it("keeps BOTH pages live — Bing favours the timeline 3:1, so neither 301s", () => {
    for (const p of ["/i485-timeline", "/i485-processing-time"]) {
      expect(RETIRED as readonly string[]).not.toContain(p);
    }
  });

  it("the timeline page owns the ordered sequence", () => {
    expect(timeline).toContain("The Seven Stages of an I-485, In Order");
    // ...and no longer renders the duration table that duplicated the other page
    expect(timeline).not.toContain("EstimatedTimelineTable");
    expect(timeline).not.toContain("I-485 Processing Time Estimate by Stage");
  });

  it("the processing-time page owns durations, not the step sequence", () => {
    expect(processing).toContain("I-485 Processing Time Estimate by Stage");
    expect(processing).not.toContain("Typical I-485 timeline stages");
  });

  it("both pages link to each other and to the documents checklist", () => {
    expect(timeline).toContain("/i485-processing-time");
    expect(timeline).toContain("/i485-documents-checklist");
    expect(processing).toContain("/i485-timeline");
    expect(processing).toContain("/i485-documents-checklist");
  });
});

describe("Batch 4 Steps 5 & 6 — the green-card-renewal hub absorbed both pages", () => {
  const hub = pageText("green-card-renewal/page.tsx");

  it.each([
    ["the online filing steps", "Online Green Card Renewal Steps"],
    ["the paper-filing counter-case", "When online filing may not be best"],
    ["the explicit speed answer", "Does Filing Online Make It Faster?"],
    ["the benefits list", "Benefits of online filing"],
    ["the online upload list", "Documents to prepare"],
    ["the online-specific mistakes", "Common mistakes"],
    ["the post-filing sequence", "What happens after online filing"],
    ["the Form I-912 fee-waiver reference", "Form I-912"],
  ])("carries %s from /renew-green-card-online", (_label, needle) => {
    expect(hub).toContain(needle);
  });

  it("ports the readiness tool as its OWN module, not merged into the hub checker", () => {
    // Merging the two would have lost the account / payment / fee-waiver
    // branches that only the online checklist asks about.
    expect(hub).toContain("RenewOnlineChecklist");
    expect(hub).toContain("GreenCardRenewalChecker");
  });

  it.each([
    ["I-9 work proof", "Work proof with an expired card"],
    ["DMV and ID renewal", "DMV and ID issues"],
    ["the 36-month extension on an already-expired card", "Receipt notice extension for an already-expired card"],
    ["the ADIT / I-551 stamp procedure", "Temporary proof / ADIT stamp"],
    ["the wrong-form warning", "When Form I-90 may be wrong"],
    ["the concerns table", "Expired Green Card: Common Concerns"],
    ["the next-steps timeline", "Expired Green Card Timeline and Next Steps"],
  ])("carries %s from /expired-green-card", (_label, needle) => {
    expect(hub).toContain(needle);
  });

  it("gives both merged blocks a stable anchor for inbound links", () => {
    expect(hub).toContain('id="renew-online"');
    expect(hub).toContain('id="expired-green-card"');
  });

  const questions = greenCardRenewalFaqs.map((f) => f.question);

  it.each([
    "Do I need a USCIS online account?",
    "What documents do I upload?",
    "Can I pay the green card renewal fee online?",
    "Can I request a fee waiver online?",
    "Can I file I-90 by mail instead?",
    "Does an expired green card mean I lost my status?",
    "Does the receipt notice extend my expired card?",
    "What should I do first if my green card expired?",
  ])("the hub FAQ absorbed %j", (q) => {
    expect(questions).toContain(q);
  });

  it("has no duplicate FAQ questions after the merge", () => {
    const dupes = questions.filter((q, i) => questions.indexOf(q) !== i);
    expect(dupes).toEqual([]);
  });
});

describe("Batch 4 Step 7 — the hub thinned where a spoke owns the intent", () => {
  const hub = pageText("green-card-renewal/page.tsx");
  const byQuestion = new Map(greenCardRenewalFaqs.map((f) => [f.question, f.answer]));

  it("cuts renew-vs-replace down and links to /replace-green-card", () => {
    expect(hub).toContain("/replace-green-card");
    expect(hub).not.toContain(
      "Renewal usually refers to getting a new card when a 10-year card expires.",
    );
  });

  it.each([
    "What is the difference between Form I-90 and Form I-751?",
    "Can a conditional green card be renewed with Form I-90?",
  ])("cuts the FAQ %j to one line pointing at /i90-vs-i751", (q) => {
    const answer = byQuestion.get(q);
    expect(answer).toBeDefined();
    expect(answer).toContain("/i90-vs-i751");
  });
});
