import { describe, it, expect } from "vitest";
import {
  clusterStateCodes,
  stateChild,
  states,
  CENSUS_STATE_SOURCE,
  CENSUS_STATE_DEFINITION,
  CENSUS_STATE_LAST_VERIFIED,
  CENSUS_STATE_METHODOLOGY,
} from "@/data/indianPopulationData";

describe("Indian population state pages — verified Census snapshot", () => {
  it("every cluster state has a census snapshot with required fields", () => {
    for (const code of clusterStateCodes) {
      const child = stateChild[code];
      expect(child, `stateChild[${code}] should exist`).toBeDefined();
      expect(child.census, `${code} should have a census snapshot`).toBeDefined();

      const { count2020, count2010, pctOfState2020, growthLabel, rankLabel, rankNote } = child.census;
      expect(count2020, `${code} count2020`).toBeGreaterThan(0);
      expect(count2010, `${code} count2010`).toBeGreaterThan(0);
      // Every cluster state grew 2010→2020 on this one consistent definition.
      expect(count2020, `${code} should show growth 2010→2020`).toBeGreaterThan(count2010);
      expect(pctOfState2020, `${code} pctOfState2020`).toMatch(/%/);
      expect(growthLabel, `${code} growthLabel`).toMatch(/^\+\d+%$/);
      expect(rankLabel.trim().length, `${code} rankLabel`).toBeGreaterThan(0);
      expect(rankNote.trim().length, `${code} rankNote`).toBeGreaterThan(0);
    }
  });

  it("computed growth label matches the count2010→count2020 change (within 1 point of rounding)", () => {
    for (const code of clusterStateCodes) {
      const { count2020, count2010, growthLabel } = stateChild[code].census;
      const actualPct = Math.round(((count2020 - count2010) / count2010) * 100);
      const labeledPct = Number(growthLabel.replace(/[+%]/g, ""));
      expect(Math.abs(actualPct - labeledPct), `${code} growth label vs computed`).toBeLessThanOrEqual(1);
    }
  });

  it("California is the largest, New Jersey has the highest share — sanity-check against known facts", () => {
    const ca = stateChild.CA.census;
    const nj = stateChild.NJ.census;
    for (const code of clusterStateCodes) {
      if (code === "CA") continue;
      expect(ca.count2020, `CA should be the largest total count`).toBeGreaterThan(stateChild[code].census.count2020);
    }
    const njShare = Number(nj.pctOfState2020.replace("%", ""));
    for (const code of clusterStateCodes) {
      if (code === "NJ") continue;
      const share = Number(stateChild[code].census.pctOfState2020.replace("%", ""));
      expect(njShare, `NJ should have the highest % share (vs ${code})`).toBeGreaterThan(share);
    }
  });

  it("does not mix the census snapshot's single definition into the broader national headline figures", () => {
    // The state snapshot definition must stay distinct from the national ~4.9M
    // Pew "alone or in combination" figure used elsewhere on the page.
    expect(CENSUS_STATE_DEFINITION).toMatch(/Asian Indian alone/);
    expect(CENSUS_STATE_METHODOLOGY).toMatch(/NOT/);
    expect(CENSUS_STATE_METHODOLOGY.toLowerCase()).toContain("pew");
  });

  it("has a dated, linkable primary source and last-verified date", () => {
    expect(CENSUS_STATE_SOURCE.href).toMatch(/^https:\/\/www\.census\.gov\//);
    expect(CENSUS_STATE_SOURCE.label.length).toBeGreaterThan(0);
    expect(CENSUS_STATE_LAST_VERIFIED).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("every cluster state code resolves to a StateInfo entry (no orphaned child pages)", () => {
    for (const code of clusterStateCodes) {
      expect(states.find((s) => s.code === code), `states[] missing entry for ${code}`).toBeDefined();
    }
  });

  it("state meta titles and descriptions are unique across the cluster", () => {
    const titles = clusterStateCodes.map((code) => stateChild[code].metaTitle);
    const descs = clusterStateCodes.map((code) => stateChild[code].metaDesc);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descs).size).toBe(descs.length);
  });
});
