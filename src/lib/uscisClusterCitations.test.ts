import { describe, it, expect } from "vitest";
import { uscisChildPages } from "@/lib/uscisCluster";
import { myuscisChildPages } from "@/lib/myuscisCluster";
import { lifePlanningChildPages } from "@/lib/uscisLifePlanningCluster";

/**
 * Batch 4 (SEO remediation) added at least one hyperlinked primary/official
 * source to every case-status, myUSCIS, and life-planning cluster page that
 * previously cited an agency (USCIS, DOL, DOS, CBP) or a regulation only as
 * unlinked plain text. This guards against that regressing back to
 * plain-text-only citations.
 */
const OFFICIAL_HOST_PATTERN =
  /https:\/\/(www\.)?(uscis\.gov|egov\.uscis\.gov|my\.uscis\.gov|i94\.cbp\.dhs\.gov|ecfr\.gov|www\.ecfr\.gov|uscode\.house\.gov|dol\.gov|travel\.state\.gov)/;

function outboundLinks(content: string): string[] {
  const matches = [...content.matchAll(/\]\((https?:\/\/[^)]+)\)/g)];
  return matches.map((m) => m[1]);
}

describe("USCIS cluster pages cite at least one hyperlinked official source", () => {
  const allClusters: { label: string; pages: { slug: string; content: string }[] }[] = [
    { label: "case-status", pages: uscisChildPages },
    { label: "myUSCIS", pages: myuscisChildPages },
    { label: "life-planning", pages: lifePlanningChildPages },
  ];

  for (const cluster of allClusters) {
    it(`every ${cluster.label} page has ≥1 hyperlinked official source`, () => {
      for (const page of cluster.pages) {
        const links = outboundLinks(page.content);
        const hasOfficialLink = links.some((href) => OFFICIAL_HOST_PATTERN.test(href));
        expect(hasOfficialLink, `${cluster.label}/${page.slug} should link to an official source`).toBe(true);
      }
    });
  }
});

describe("Buy-a-house life-planning page reflects the May 2025 FHA rule change", () => {
  const page = lifePlanningChildPages.find((p) => p.slug === "buy-house-while-waiting-for-green-card")!;

  it("exists", () => {
    expect(page).toBeDefined();
  });

  it("states FHA is no longer available to non-permanent residents", () => {
    expect(page.content).toMatch(/May 25, 2025/);
    expect(page.content).toMatch(/2025-09/);
    expect(page.content.toLowerCase()).toContain("no longer available to non-permanent residents");
  });

  it("does not claim H-1B holders get 3.5% FHA financing without the correction context", () => {
    // The literal "3.5%" figure must not appear detached from the FHA-ended context.
    const fhaClaims = page.content.match(/3\.5%[^.]*FHA|FHA[^.]*3\.5%/gi) ?? [];
    for (const claim of fhaClaims) {
      expect(claim.toLowerCase()).not.toMatch(/yes|available|qualify/);
    }
  });

  it("links directly to the HUD mortgagee letter", () => {
    expect(page.content).toContain("https://www.hud.gov/sites/dfiles/OCHCO/documents/2025-09hsgml.pdf");
  });
});
