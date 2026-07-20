/**
 * Immigration-accuracy content guards for the Visa Bulletin cluster and its two
 * tools. These assert the specific corrections from the 2026-07 accuracy pass so
 * the inaccurate phrasing can't silently return. Content is read from source so
 * both the cluster markdown and the tool result text are covered.
 */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { visaBulletinChildPages } from "./visaBulletinCluster";

const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), "utf8");

const clusterText = visaBulletinChildPages.map((p) => p.content).join("\n");
const checkerPage = read("src/app/tools/priority-date-checker/page.tsx");
const checkerWidget = read("src/components/tools/PriorityDateChecker.tsx");
const estimator = read("src/components/tools/GreenCardEstimator.tsx");
const allText = [clusterText, checkerPage, checkerWidget, estimator].join("\n");

describe("visa bulletin cluster — immigration-accuracy guards", () => {
  it("does not say 'C' typically applies to EB-1 India", () => {
    expect(/typically applies to eb-?1/i.test(allText)).toBe(false);
  });

  it("does not say an approved I-140 alone lets anyone proceed", () => {
    expect(/anyone with an approved i-140/i.test(allText)).toBe(false);
    expect(/proceed immediately/i.test(allText)).toBe(false);
  });

  it("does not say 'no action is possible' for Unavailable", () => {
    expect(/no action is possible/i.test(allText)).toBe(false);
  });

  it("does not tie the 180-day I-485 portability clock to I-140 filing/approval", () => {
    expect(/180-day AC21 clock/i.test(allText)).toBe(false);
    expect(/triggers the 180-day/i.test(allText)).toBe(false);
    expect(/unlocks the 180-day/i.test(allText)).toBe(false);
  });

  it("explains §204(j) portability depends on a pending I-485, not the I-140", () => {
    expect(allText).toMatch(/§204\(j\)/);
    expect(allText).toMatch(/pending (for )?at least 180 days/i);
    expect(allText).toMatch(/does not by itself start the I-485 portability clock/i);
  });

  it("does not state EB-2→EB-3 downgrade always requires a new PERM", () => {
    expect(/requires a new perm process/i.test(allText)).toBe(false);
    // and it explains the existing labor certification may sometimes be used
    expect(allText).toMatch(/rely on the existing labor certification/i);
  });

  it("separates priority-date retention from the §204(j) same-or-similar test", () => {
    expect(allText).toMatch(/retention is[^.]{0,12}separate/i);
    expect(allText).toMatch(/same or similar/i);
  });

  it("does not promise automatic EAD / Advance Parole / green card", () => {
    expect(/gives you EAD and AP/i.test(allText)).toBe(false);
    expect(/get EAD\/AP/i.test(allText)).toBe(false);
    expect(/automatically (current|receive|qualif|get an? ead)/i.test(allText)).toBe(false);
    // and it states EAD/AP are separate applications
    expect(allText).toMatch(/separate applications?/i);
  });

  it("frames Form ETA-9141 as NOT establishing the ordinary PERM priority date", () => {
    const pd = visaBulletinChildPages.find((p) => p.slug === "priority-date")!.content;
    expect(pd).toMatch(/ETA-9089/);
    expect(pd).toMatch(/ETA-9141/);
    expect(pd).toMatch(/not\*?\*? establish the employment-based priority date/i);
  });

  it("wires the three category pages to the centralized live status card", () => {
    for (const slug of ["eb1-india", "eb2-india", "eb3-india"]) {
      const p = visaBulletinChildPages.find((x) => x.slug === slug)!;
      expect(p.category).toBeTruthy();
    }
  });

  it("bumps dateModified on corrected pages without changing datePublished", () => {
    const pd = visaBulletinChildPages.find((p) => p.slug === "priority-date")!;
    expect(pd.date).toBe("2026-06-16"); // datePublished unchanged
    expect(pd.updated).toBe("2026-07-19"); // dateModified bumped (2026-07 rebuild)
    const eb1 = visaBulletinChildPages.find((p) => p.slug === "eb1-india")!;
    expect(eb1.updated).toBe("2026-07-19"); // rebuilt in the 2026-07 answer-first pass
  });
});
