/**
 * Regression guard for SEO remediation Batch 2: the keyword-cannibalization
 * fixes that assign a single, distinct search intent to every surviving page
 * in four overlapping clusters.
 *
 *   A. Priority date
 *      /visa-bulletin/priority-date  → owns "what is a priority date" + bulletin
 *      /green-card/priority-date     → owns the PERM→I-140→I-485 journey
 *   B. AC21 / job change
 *      /green-card/ac21                     → AC21 concept & eligibility
 *      /green-card/change-jobs-after-i140   → decisions after I-140 approval
 *      /uscis/change-job-during-green-card  → stage-by-stage risk guide
 *   C. EB-2/EB-3 India
 *      /green-card/eb2-vs-eb3-india    → permanent comparison / decision owner
 *      /visa-bulletin/eb2-india        → EB-2 India live bulletin dates
 *      /visa-bulletin/eb3-india        → EB-3 India live bulletin dates
 *      /eb2-eb3-priority-date-india    → wait-time scenarios (estimates)
 *      /green-card/green-card-backlog-india → causes, scale, strategies
 *   D. RFE
 *      /uscis/request-for-evidence-rfe → general RFE meaning & process
 *      /uscis/rfe-notice               → decode-the-notice + response checklist
 *      /h1b/rfe                        → H-1B-specific RFE types
 *
 * Batch 2 was a differentiation pass, not a consolidation: NO pages were merged
 * and NO redirects were added. These tests therefore assert (a) every page is
 * self-canonical and still live, (b) titles/SEO-titles are unique across the
 * whole set (the anti-cannibalization invariant), (c) each page keeps the
 * distinctive content that marks its assigned intent, and (d) FAQ schema is
 * derived from — and matches — the visible FAQ. They are asserted here rather
 * than trusted to review because the overlap is easy to silently reintroduce.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { pageMetadata, extractFaq } from "./seo";
import { getGreenCardChildPage } from "./greenCardCluster";
import { getVisaBulletinChildPage } from "./visaBulletinCluster";
import { getUscisChildPage } from "./uscisCluster";
import { getMyuscisChildPage } from "./myuscisCluster";
import { getLifePlanningChildPage } from "./uscisLifePlanningCluster";
import { getH1bChildPage } from "./h1bCluster";

const ROOT = join(__dirname, "..", "..");

/** A page under test: how to load it and what path it lives at. */
interface Subject {
  path: string;
  title: string;
  seoTitle?: string;
  content: string;
}

const gc = (slug: string): Subject => {
  const p = getGreenCardChildPage(slug)!;
  return { path: `/green-card/${slug}`, title: p.title, seoTitle: p.seoTitle, content: p.content };
};
const vb = (slug: string): Subject => {
  const p = getVisaBulletinChildPage(slug)!;
  return { path: `/visa-bulletin/${slug}`, title: p.title, seoTitle: p.seoTitle, content: p.content };
};
const uscis = (slug: string): Subject => {
  const p = getUscisChildPage(slug)!;
  return { path: `/uscis/${slug}`, title: p.title, seoTitle: p.seoTitle, content: p.content };
};
const myuscis = (slug: string): Subject => {
  const p = getMyuscisChildPage(slug)!;
  return { path: `/uscis/${slug}`, title: p.title, seoTitle: p.seoTitle, content: p.content };
};
const life = (slug: string): Subject => {
  const p = getLifePlanningChildPage(slug)!;
  return { path: `/uscis/${slug}`, title: p.title, seoTitle: p.seoTitle, content: p.content };
};
const h1b = (slug: string): Subject => {
  const p = getH1bChildPage(slug)!;
  return { path: `/h1b/${slug}`, title: p.title, seoTitle: p.seoTitle, content: p.content };
};

// The top-level scenarios page is a hand-authored .tsx, so read its source.
const scenariosSrc = readFileSync(
  join(ROOT, "src/app/eb2-eb3-priority-date-india/page.tsx"),
  "utf8",
);

const SUBJECTS: Subject[] = [
  gc("priority-date"),
  vb("priority-date"),
  gc("ac21"),
  gc("change-jobs-after-i140"),
  life("change-job-during-green-card"),
  gc("eb2-vs-eb3-india"),
  vb("eb2-india"),
  vb("eb3-india"),
  gc("green-card-backlog-india"),
  uscis("request-for-evidence-rfe"),
  myuscis("rfe-notice"),
  h1b("rfe"),
];

describe("Batch 2 — every differentiated page loads and is self-canonical", () => {
  it("resolves all subject pages", () => {
    expect(SUBJECTS).toHaveLength(12);
    for (const s of SUBJECTS) expect(s.content.length).toBeGreaterThan(400);
  });

  it.each(SUBJECTS)("$path is self-canonical with no noindex", ({ path, title }) => {
    const meta = pageMetadata({ title, description: "x", path, type: "article" });
    expect(meta.alternates?.canonical).toBe(path);
    expect(meta.robots).toBeUndefined();
  });
});

describe("Batch 2 — titles and SEO titles are unique (anti-cannibalization)", () => {
  it("no two pages share a title (H1)", () => {
    const titles = SUBJECTS.map((s) => s.title.trim().toLowerCase());
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("no two pages share a SEO title", () => {
    const seo = SUBJECTS.map((s) => (s.seoTitle ?? s.title).trim().toLowerCase());
    expect(new Set(seo).size).toBe(seo.length);
  });

  it("the two priority-date pages no longer share the same title", () => {
    expect(gc("priority-date").title).not.toBe(vb("priority-date").title);
    expect(gc("priority-date").seoTitle).not.toBe(vb("priority-date").seoTitle);
  });
});

describe("Batch 2A — priority-date intent ownership", () => {
  it("visa-bulletin/priority-date owns the bulletin mechanics", () => {
    const c = vb("priority-date").content;
    expect(c).toMatch(/Final Action Date/i);
    expect(c).toMatch(/Dates for Filing/i);
  });

  it("green-card/priority-date owns the PERM→I-140→I-485 journey, not bulletin mechanics", () => {
    const c = gc("priority-date").content;
    // Owns the journey vocabulary.
    expect(c).toMatch(/retention/i);
    expect(c).toMatch(/each stage/i);
    // Points bulletin interpretation at the visa-bulletin page instead of re-teaching it.
    expect(c).toContain("/visa-bulletin/priority-date");
    // No deep FAD-vs-DFF comparison table re-explaining the two charts here.
    expect(c).not.toMatch(/Final Action Date \(Part A\)/);
  });

  it("visa-bulletin/priority-date links back to the green-card journey (reciprocal)", () => {
    expect(vb("priority-date").content).toContain("/green-card/priority-date");
  });
});

describe("Batch 2B — the three job-change guides carry the cross-link block", () => {
  // Each page links to the OTHER two guides and marks itself "You are here"
  // (no self-link), so the block routes the reader without a redundant loop.
  const jobGuides = [
    { path: "/green-card/ac21", content: gc("ac21").content, others: ["/green-card/change-jobs-after-i140", "/uscis/change-job-during-green-card"] },
    { path: "/green-card/change-jobs-after-i140", content: gc("change-jobs-after-i140").content, others: ["/green-card/ac21", "/uscis/change-job-during-green-card"] },
    { path: "/uscis/change-job-during-green-card", content: life("change-job-during-green-card").content, others: ["/green-card/ac21", "/green-card/change-jobs-after-i140"] },
  ];

  it.each(jobGuides)("$path links the other two guides and marks itself", ({ content, others }) => {
    expect(content).toMatch(/Which job-change guide do I need\?/i);
    for (const o of others) expect(content).toContain(o);
    expect(content).toContain("You are here");
  });

  it("ac21 owns the concept: both §214(n) and §204(j)", () => {
    const c = gc("ac21").content;
    expect(c).toMatch(/§214\(n\)/);
    expect(c).toMatch(/§204\(j\)/);
  });

  it("change-jobs-after-i140 owns the post-approval decision table", () => {
    const c = gc("change-jobs-after-i140").content;
    expect(c).toMatch(/Decision table/i);
    expect(c).toMatch(/withdraw/i);
  });

  it("change-job-during-green-card owns the stage-by-stage table (all five stages)", () => {
    const c = life("change-job-during-green-card").content;
    expect(c).toMatch(/PERM pending/i);
    expect(c).toMatch(/I-140 pending/i);
    expect(c).toMatch(/I-485 pending/i);
    expect(c).toMatch(/Find your stage/i);
    // Converted from the legacy :::faq block to real ### questions for schema.
    expect(c).not.toContain(":::faq");
  });
});

describe("Batch 2C — EB-2/EB-3 India ownership", () => {
  it("eb2-vs-eb3-india is the decision owner and points live dates elsewhere", () => {
    const c = gc("eb2-vs-eb3-india").content;
    expect(c).toContain("/visa-bulletin/eb2-india");
    expect(c).toContain("/visa-bulletin/eb3-india");
    expect(c).toContain("/eb2-eb3-priority-date-india");
    expect(c).toContain("/green-card/green-card-backlog-india");
  });

  it("the scenarios page is prominently labeled as estimates, not predictions", () => {
    expect(scenariosSrc).toMatch(/estimates, not predictions/i);
    expect(scenariosSrc).toMatch(/illustrative/i);
    // Self-canonical at its own path.
    expect(scenariosSrc).toContain('path: PATH');
    expect(scenariosSrc).toContain('/eb2-eb3-priority-date-india');
    // JSON-LD headline matches the on-page H1 (the pre-Batch-2 mismatch is fixed).
    expect(scenariosSrc).toContain('const TITLE = "EB-2 & EB-3 India: How Long Is the Wait?"');
    expect(scenariosSrc).toContain('title="EB-2 & EB-3 India: How Long Is the Wait?"');
  });

  it("the bulletin pages cross-link to the scenarios page", () => {
    expect(vb("eb2-india").content).toContain("/eb2-eb3-priority-date-india");
    expect(vb("eb3-india").content).toContain("/eb2-eb3-priority-date-india");
  });
});

describe("Batch 2D — the three RFE guides are differentiated and cross-linked", () => {
  const rfeGuides = [
    { path: "/uscis/request-for-evidence-rfe", content: uscis("request-for-evidence-rfe").content, others: ["/uscis/rfe-notice", "/h1b/rfe"] },
    { path: "/uscis/rfe-notice", content: myuscis("rfe-notice").content, others: ["/uscis/request-for-evidence-rfe", "/h1b/rfe"] },
    { path: "/h1b/rfe", content: h1b("rfe").content, others: ["/uscis/request-for-evidence-rfe", "/uscis/rfe-notice"] },
  ];

  it.each(rfeGuides)("$path links the other two RFE guides and marks itself", ({ content, others }) => {
    expect(content).toMatch(/Which RFE guide do I need\?/i);
    for (const o of others) expect(content).toContain(o);
    expect(content).toContain("You are here");
  });

  it("request-for-evidence-rfe owns 'meaning & process' and defers notice-decoding", () => {
    const c = uscis("request-for-evidence-rfe").content;
    expect(uscis("request-for-evidence-rfe").title).toMatch(/meaning/i);
    // Defers the field-by-field decode to the notice guide.
    expect(c).toContain("/uscis/rfe-notice");
  });

  it("rfe-notice owns 'decode the notice + checklist' and defers the general meaning", () => {
    const s = myuscis("rfe-notice");
    expect(s.title).toMatch(/decode/i);
    expect(s.content).toContain("/uscis/request-for-evidence-rfe");
  });

  it("h1b/rfe stays H-1B-specific and links to the general guides", () => {
    const c = h1b("rfe").content;
    expect(c).toMatch(/specialty occupation/i);
    expect(c).toContain("/uscis/request-for-evidence-rfe");
  });
});

describe("Batch 2 — FAQ schema is derived from visible content", () => {
  // Pages that were rebuilt to the ### FAQ convention in this batch.
  const withFaq = [
    gc("priority-date"),
    gc("ac21"),
    gc("change-jobs-after-i140"),
    life("change-job-during-green-card"),
    uscis("request-for-evidence-rfe"),
    myuscis("rfe-notice"),
    h1b("rfe"),
  ];

  it.each(withFaq)("$path FAQ schema matches its visible ### questions", ({ content }) => {
    const faqs = extractFaq(content);
    expect(faqs.length).toBeGreaterThan(0);
    for (const f of faqs) {
      expect(content).toContain(f.question);
      expect(f.answer.trim()).not.toBe("");
    }
  });
});
