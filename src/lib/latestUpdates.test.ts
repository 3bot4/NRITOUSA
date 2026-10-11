import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  getLatestUpdates,
  getLastSiteWideCheck,
  pageDatesCatalog,
  rowFor,
} from "@/lib/latestUpdates";
import { PAGE_CHECKS } from "@/lib/pageChecks";
import { tools } from "@/lib/tools";
import { getToolHubContent } from "@/lib/toolHubContent";

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const src = (p: string) => readFileSync(join(process.cwd(), p), "utf8");
/** Source with comments removed, so docs that NAME the banned calls don't trip the scan. */
const code = (p: string) =>
  src(p).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

describe("latest updates feed — honesty rules", () => {
  it("never derives a page date from the clock, build or deploy", () => {
    for (const f of [
      "src/lib/latestUpdates.ts",
      "src/lib/pageChecks.ts",
      "src/components/NumbersChecked.tsx",
      "src/components/home/GuidesAndUpdates.tsx",
    ]) {
      expect(code(f), f).not.toMatch(/new Date\(\s*\)|Date\.now\(/);
    }
  });

  it("every date in the catalog is a real ISO date", () => {
    for (const p of pageDatesCatalog()) {
      for (const d of [p.published, p.updated, p.lastChecked]) {
        if (d === undefined) continue;
        expect(d, p.path).toMatch(ISO);
        expect(Number.isNaN(Date.parse(d)), p.path).toBe(false);
      }
    }
  });

  it("page-checks.json only names known pages, with valid past dates", () => {
    const known = new Set(pageDatesCatalog().map((p) => p.path));
    const today = new Date().toISOString().slice(0, 10);
    for (const [path, d] of Object.entries(PAGE_CHECKS)) {
      expect(known.has(path), `${path} is not a tracked page`).toBe(true);
      expect(d, path).toMatch(ISO);
      expect(d <= today, `${path} check ${d} is in the future`).toBe(true);
    }
  });

  it("paths are unique", () => {
    const paths = pageDatesCatalog().map((p) => p.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("a tool keeps its updated date in exactly one place", () => {
    for (const t of tools) {
      const both = Boolean(t.updated && getToolHubContent(t.slug)?.updated);
      expect(both, `${t.slug}: set updated in tools.ts OR toolHubContent.ts`).toBe(false);
    }
  });

  it("shows at most 8 rows, newest first", () => {
    const rows = getLatestUpdates(8);
    expect(rows.length).toBeLessThanOrEqual(8);
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i - 1].date >= rows[i].date).toBe(true);
    }
  });

  it("site-wide check is the latest lastChecked on any page", () => {
    const all = pageDatesCatalog()
      .map((p) => p.lastChecked)
      .filter(Boolean)
      .sort();
    expect(getLastSiteWideCheck()).toBe(all[all.length - 1]);
  });
});

describe("rowFor labels", () => {
  const base = { path: "/x", title: "X", kind: "article" as const };
  it("New when only published", () => {
    expect(rowFor({ ...base, published: "2026-09-01" })?.label).toBe("New");
  });
  it("New when updated on the publish day", () => {
    expect(
      rowFor({ ...base, published: "2026-09-01", updated: "2026-09-01" })?.label,
    ).toBe("New");
  });
  it("Updated when updated after publishing", () => {
    expect(
      rowFor({ ...base, published: "2026-09-01", updated: "2026-09-05" }),
    ).toMatchObject({ label: "Updated", date: "2026-09-05" });
  });
  it("Updated wins a tie with a check — an update re-checks the numbers", () => {
    expect(
      rowFor({ ...base, published: "2026-09-01", updated: "2026-09-05", lastChecked: "2026-09-05" })?.label,
    ).toBe("Updated");
  });
  it("Numbers checked only when the check is strictly newer", () => {
    expect(
      rowFor({ ...base, published: "2026-09-01", updated: "2026-09-05", lastChecked: "2026-10-01" }),
    ).toMatchObject({ label: "Numbers checked", date: "2026-10-01" });
  });
  it("undated pages never appear", () => {
    expect(rowFor({ ...base })).toBeUndefined();
  });
});
