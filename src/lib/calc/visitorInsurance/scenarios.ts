/**
 * Editable illustrative example claims for calculator preset buttons. These
 * are placeholder scenarios for demonstrating the math, NOT national average
 * medical prices, not location-specific pricing, and NOT a claim about what
 * any named plan pays — see docs/visitor-insurance/source-policy.md
 * ("Illustrative vs. real numbers"). `rangeUsd` is a wide, deliberately
 * round illustrative range to help a first-time user picture the scale of a
 * situation before they have a real bill in hand — it is not sourced from
 * any cost-transparency dataset and must never be presented as researched
 * or location-adjusted. The engine always prefers a user's real entered
 * amount over any preset.
 */
import type { ServiceCategory } from "./types";

export interface IllustrativeScenario {
  key: string;
  label: string;
  icon: string;
  serviceCategory: ServiceCategory;
  billedChargeUsd: number;
  rangeUsd: [number, number];
  note: string;
}

export const ILLUSTRATIVE_SCENARIOS: IllustrativeScenario[] = [
  {
    key: "urgent-care",
    label: "Urgent care visit",
    icon: "⛑️",
    serviceCategory: "urgent-care",
    billedChargeUsd: 350,
    rangeUsd: [150, 750],
    note: "Illustrative range only — not researched pricing data and not adjusted for your location. Enter your real bill when you have one.",
  },
  {
    key: "er-visit",
    label: "Emergency-room visit",
    icon: "🚨",
    serviceCategory: "er",
    billedChargeUsd: 4500,
    rangeUsd: [1500, 12000],
    note: "Illustrative range only — not researched pricing data and not adjusted for your location. Enter your real bill when you have one.",
  },
  {
    key: "chest-pain",
    label: "Chest pain / heart concern",
    icon: "❤️",
    serviceCategory: "er",
    billedChargeUsd: 12000,
    rangeUsd: [4000, 30000],
    note: "Illustrative range only, not a diagnosis or a real bill — a cardiac workup can vary enormously depending on what tests are run.",
  },
  {
    key: "fall-fracture",
    label: "Fall — broken wrist or hip",
    icon: "🦴",
    serviceCategory: "er",
    billedChargeUsd: 8000,
    rangeUsd: [2500, 25000],
    note: "Illustrative range only — a wrist fracture and a hip fracture requiring surgery can be very different bills; this spans both.",
  },
  {
    key: "ambulance",
    label: "Ambulance transport",
    icon: "🚑",
    serviceCategory: "ambulance",
    billedChargeUsd: 1500,
    rangeUsd: [500, 3500],
    note: "Illustrative range only — ground vs. air ambulance differ enormously; this covers typical ground transport.",
  },
  {
    key: "food-poisoning",
    label: "Food poisoning / stomach illness",
    icon: "🤒",
    serviceCategory: "urgent-care",
    billedChargeUsd: 600,
    rangeUsd: [200, 1500],
    note: "Illustrative range only — not researched pricing data and not adjusted for your location.",
  },
  {
    key: "fever",
    label: "Fever / infection",
    icon: "🌡️",
    serviceCategory: "physician",
    billedChargeUsd: 250,
    rangeUsd: [100, 500],
    note: "Illustrative range only — not researched pricing data and not adjusted for your location.",
  },
  {
    key: "mri",
    label: "MRI / diagnostic imaging",
    icon: "🩻",
    serviceCategory: "imaging",
    billedChargeUsd: 2200,
    rangeUsd: [800, 5000],
    note: "Illustrative range only — imaging pricing varies widely by facility type.",
  },
  {
    key: "prescription",
    label: "Prescription medication",
    icon: "💊",
    serviceCategory: "prescription",
    billedChargeUsd: 150,
    rangeUsd: [20, 500],
    note: "Illustrative range only — drug pricing varies enormously by medication.",
  },
  {
    key: "appendix-surgery",
    label: "Appendix surgery",
    icon: "⚕️",
    serviceCategory: "surgery",
    billedChargeUsd: 35000,
    rangeUsd: [15000, 60000],
    note: "Illustrative range only — surgical + hospital-stay bills vary widely by complexity and length of stay.",
  },
  {
    key: "hospitalization",
    label: "Multi-day hospitalization",
    icon: "🛏️",
    serviceCategory: "hospital-admission",
    billedChargeUsd: 65000,
    rangeUsd: [20000, 150000],
    note: "Illustrative range only — a short floor stay and an ICU stay are very different bills; this spans both.",
  },
];

export function getScenario(key: string): IllustrativeScenario | undefined {
  return ILLUSTRATIVE_SCENARIOS.find((s) => s.key === key);
}
