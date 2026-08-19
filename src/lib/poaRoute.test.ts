import { describe, expect, it } from "vitest";
import {
  EMPTY_POA_ROUTE,
  PASSPORT_OPTIONS,
  PURPOSE_OPTIONS,
  evaluatePoaRoute,
  type PoaRouteInputs,
} from "./poaRoute";

const base: PoaRouteInputs = {
  ...EMPTY_POA_ROUTE,
  passport: "indian",
  purpose: "sell",
  attorneyIsCloseRelative: "yes",
  canVisitConsulate: "yes",
};

describe("evaluatePoaRoute", () => {
  it("returns nothing until passport and purpose are both chosen", () => {
    expect(evaluatePoaRoute(EMPTY_POA_ROUTE).ready).toBe(false);
    expect(evaluatePoaRoute({ ...EMPTY_POA_ROUTE, passport: "indian" }).ready).toBe(false);
    expect(evaluatePoaRoute({ ...EMPTY_POA_ROUTE, purpose: "sell" }).ready).toBe(false);
    expect(evaluatePoaRoute({ ...EMPTY_POA_ROUTE, passport: "indian", purpose: "sell" }).ready).toBe(
      true,
    );
  });

  it("forces the apostille route for a US passport holder without OCI", () => {
    const r = evaluatePoaRoute({ ...base, passport: "us-no-oci" });
    expect(r.route).toMatch(/apostille/i);
    expect(r.route).not.toMatch(/either/i);
    expect(r.documents.some((d) => /apostilled by the Secretary of State/i.test(d))).toBe(true);
  });

  it("falls back to apostille when the consulate is out of reach", () => {
    const r = evaluatePoaRoute({ ...base, canVisitConsulate: "no" });
    expect(r.route).toMatch(/apostille/i);
    expect(r.routeWhy).toMatch(/Hague Apostille Convention/i);
  });

  it("offers both routes when the consulate is reachable", () => {
    expect(evaluatePoaRoute(base).route).toMatch(/either/i);
  });

  it("treats sale and purchase POAs as compulsorily registrable", () => {
    expect(evaluatePoaRoute({ ...base, purpose: "sell" }).mustRegister).toBe(true);
    expect(evaluatePoaRoute({ ...base, purpose: "buy" }).mustRegister).toBe(true);
  });

  it("does not force registration for management, banking or litigation POAs", () => {
    for (const purpose of ["manage", "banking", "litigation"] as const) {
      expect(evaluatePoaRoute({ ...base, purpose }).mustRegister).toBe(false);
    }
  });

  it("flags conveyance-rate stamp duty only for a non-relative property POA", () => {
    const relative = evaluatePoaRoute({ ...base, attorneyIsCloseRelative: "yes" });
    const stranger = evaluatePoaRoute({ ...base, attorneyIsCloseRelative: "no" });
    expect(relative.stampExposure).toMatch(/nominal/i);
    expect(relative.stampExposure).not.toMatch(/conveyance-rate/i);
    expect(stranger.stampExposure).toMatch(/CONVEYANCE-RATE/);
  });

  it("keeps banking and litigation POAs on nominal duty regardless of relationship", () => {
    const r = evaluatePoaRoute({ ...base, purpose: "banking", attorneyIsCloseRelative: "no" });
    expect(r.stampExposure).toMatch(/Nominal/i);
  });

  it("always warns about the three-month stamping window", () => {
    for (const opt of PURPOSE_OPTIONS) {
      const r = evaluatePoaRoute({ ...base, purpose: opt.value });
      expect(r.notes.some((n) => /three months/i.test(n.text))).toBe(true);
    }
  });

  it("warns that a POA never conveys title on sale and purchase", () => {
    for (const purpose of ["sell", "buy"] as const) {
      const r = evaluatePoaRoute({ ...base, purpose });
      expect(r.notes.some((n) => /Suraj Lamp/i.test(n.text))).toBe(true);
    }
    const manage = evaluatePoaRoute({ ...base, purpose: "manage" });
    expect(manage.notes.some((n) => /Suraj Lamp/i.test(n.text))).toBe(false);
  });

  it("surfaces the FEMA limits only on a banking POA", () => {
    const banking = evaluatePoaRoute({ ...base, purpose: "banking" });
    expect(banking.notes.some((n) => /FEMA/i.test(n.text))).toBe(true);
    expect(evaluatePoaRoute(base).notes.some((n) => /FEMA/i.test(n.text))).toBe(false);
  });

  it("adds the OCI card copy for OCI holders and not for Indian passport holders", () => {
    const oci = evaluatePoaRoute({ ...base, passport: "us-oci" });
    expect(oci.documents.some((d) => /OCI card \(front and back\)/i.test(d))).toBe(true);
    const indian = evaluatePoaRoute({ ...base, passport: "indian" });
    expect(indian.documents.some((d) => /OCI card \(front and back\)/i.test(d))).toBe(false);
  });

  it("names an instrument and a non-empty checklist for every passport/purpose pair", () => {
    for (const p of PASSPORT_OPTIONS) {
      for (const u of PURPOSE_OPTIONS) {
        const r = evaluatePoaRoute({ ...base, passport: p.value, purpose: u.value });
        expect(r.ready).toBe(true);
        expect(r.instrument.length).toBeGreaterThan(0);
        expect(r.route.length).toBeGreaterThan(0);
        expect(r.stampExposure.length).toBeGreaterThan(0);
        expect(r.documents.length).toBeGreaterThan(5);
        expect(r.notes.length).toBeGreaterThan(0);
      }
    }
  });

  it("never leaks a user-entered value into the analytics label", () => {
    const r = evaluatePoaRoute(base);
    expect(r.resultType).toBe("sell:indian");
  });
});
