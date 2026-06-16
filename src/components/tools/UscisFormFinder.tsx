"use client";

import { useState } from "react";
import Link from "next/link";

type Situation =
  | "h1b-employer"
  | "gc-petition"
  | "adjust-status"
  | "ead"
  | "travel-doc"
  | "sponsor-family"
  | "change-extend"
  | "premium"
  | "address"
  | "citizenship"
  | "received-notice"
  | "";

type CurrentStatus =
  | "h1b"
  | "h4"
  | "f1-opt"
  | "l1"
  | "gc-pending"
  | "permanent-resident"
  | "other"
  | "";

type WhoFiling =
  | "employer"
  | "self"
  | "family"
  | "not-sure"
  | "";

interface FormResult {
  form: string;
  name: string;
  what: string;
  whoFiles: string;
  slug: string;
  warning: string;
  relatedLinks: { href: string; label: string }[];
}

function buildResult(
  situation: Situation,
  currentStatus: CurrentStatus,
  whoFiling: WhoFiling
): FormResult {
  switch (situation) {
    case "h1b-employer":
      return {
        form: "I-129",
        name: "Petition for a Nonimmigrant Worker",
        what: "Your employer files I-129 to petition for your H-1B work visa, an extension, or an amendment. It is also used for L-1, O-1, and TN petitions. You do not sign or submit I-129 — your employer (or their immigration attorney) does.",
        whoFiles: "Employer — you are the beneficiary, not the filer",
        slug: "i-129",
        warning: "For H-1B cap petitions, I-129 can only be filed April 1–June 30 after lottery selection. Cap-exempt employers (universities, nonprofits) can file any time.",
        relatedLinks: [
          { href: "/uscis/forms/i-129", label: "I-129 full guide" },
          { href: "/tools/h1b-lottery-timeline", label: "H-1B Lottery Timeline" },
          { href: "/h1b", label: "H-1B Guide for Indians" },
        ],
      };

    case "gc-petition":
      return {
        form: "I-140",
        name: "Immigrant Petition for Alien Workers",
        what: "Your employer files I-140 to petition for your employment-based (EB) green card. Approval sets your priority date — the most important date in the India green card queue. For EB-1A (extraordinary ability) and EB-2 NIW (National Interest Waiver), you can self-petition.",
        whoFiles: "Employer (or self for EB-1A / EB-2 NIW)",
        slug: "i-140",
        warning: "I-140 approval alone does not give you a green card. For India EB-2 and EB-3, the wait after I-140 approval is typically 10–50+ years. Monitor the monthly State Department visa bulletin.",
        relatedLinks: [
          { href: "/uscis/forms/i-140", label: "I-140 full guide" },
          { href: "/tools/priority-date-checker", label: "Priority Date Checker" },
          { href: "/tools/green-card-stage-finder", label: "Green Card Stage Finder" },
        ],
      };

    case "adjust-status":
      return {
        form: "I-485",
        name: "Application to Register Permanent Residence or Adjust Status",
        what: "You file I-485 to adjust your immigration status to permanent resident (green card) without leaving the US. You can only file when a visa number is available for your category and country — for India EB-2/EB-3, this requires your priority date to be current in the visa bulletin. File I-765 (EAD) and I-131 (Advance Parole) at the same time.",
        whoFiles: "Self",
        slug: "i-485",
        warning: "Never leave the US while I-485 is pending without an approved Advance Parole (I-131). Doing so is typically treated as I-485 abandonment.",
        relatedLinks: [
          { href: "/uscis/forms/i-485", label: "I-485 full guide" },
          { href: "/uscis/forms/i-765", label: "I-765 EAD guide" },
          { href: "/uscis/forms/i-131", label: "I-131 Advance Parole guide" },
          { href: "/tools/green-card-tracker", label: "Green Card Wait Tracker" },
        ],
      };

    case "ead":
      return {
        form: "I-765",
        name: "Application for Employment Authorization",
        what: currentStatus === "h4"
          ? "H-4 spouses file I-765 for an H-4 EAD. Eligibility requires the H-1B principal to have an approved I-140 (the priority date does not need to be current). File I-539 at the same time to extend your H-4 status if needed."
          : currentStatus === "gc-pending"
          ? "You can file I-765 together with your I-485 to get work authorization while your green card application is pending. USCIS often issues a combo EAD-Advance Parole card."
          : "Form I-765 is the application for an Employment Authorization Document (EAD) — your work permit. Different visa categories have different eligibility rules and fees. File before your current EAD expires.",
        whoFiles: "Self",
        slug: "i-765",
        warning: "Do NOT start work before the physical EAD card arrives. The I-797 approval notice is not work authorization. H-4 EAD has no 180-day automatic extension — if it expires before renewal is approved, you must stop working.",
        relatedLinks: [
          { href: "/uscis/forms/i-765", label: "I-765 full guide" },
          { href: "/tools/h4-ead-navigator", label: "H-4 EAD Navigator" },
          { href: "/tools/processing-times", label: "EAD Processing Times" },
        ],
      };

    case "travel-doc":
      return {
        form: "I-131",
        name: "Application for Travel Document (Advance Parole)",
        what: "If your I-485 is pending, you must have an approved Advance Parole before leaving the US. Form I-131 is the application. File it at the same time as your I-485. USCIS often combines the EAD and Advance Parole into one combo card (with I-765). If you are a permanent resident planning to be abroad for 1+ year, you need a Re-entry Permit — also filed on I-131.",
        whoFiles: "Self",
        slug: "i-131",
        warning: "Do NOT travel internationally while I-485 is pending without a physical Advance Parole card in hand. An approval notice is NOT sufficient. An expired Advance Parole cannot be used.",
        relatedLinks: [
          { href: "/uscis/forms/i-131", label: "I-131 full guide" },
          { href: "/uscis/forms/i-485", label: "I-485 and travel rules" },
        ],
      };

    case "sponsor-family":
      return {
        form: "I-130",
        name: "Petition for Alien Relative",
        what: "US citizens or permanent residents file I-130 to establish a qualifying family relationship and start the process for a family-based green card. US citizens can petition for spouses, parents, children (all ages), and siblings. Permanent residents can petition for spouses and unmarried children only. Approval is step one — there is often a long queue wait before a visa number is available.",
        whoFiles: "US citizen or permanent resident (the petitioner / sponsor)",
        slug: "i-130",
        warning: "India family preference categories (especially F4 — siblings) have very long backlogs, sometimes 20+ years. Check the State Department visa bulletin for India family preference priority dates before making plans.",
        relatedLinks: [
          { href: "/uscis/forms/i-130", label: "I-130 full guide" },
          { href: "/uscis", label: "USCIS Guide for Indians" },
        ],
      };

    case "change-extend":
      return {
        form: "I-539",
        name: "Application to Extend/Change Nonimmigrant Status",
        what: currentStatus === "h4"
          ? "H-4 dependents file I-539 to extend H-4 status when the H-1B principal's employer files an I-129 extension. If you also need to renew your H-4 EAD, file I-765 at the same time. These are separate applications with separate processing timelines."
          : "Form I-539 lets you extend your current nonimmigrant stay or change to a different nonimmigrant category (e.g., B-2 visitor to F-1 student) without leaving the US. It cannot be used by H-1B or L-1 principals — those require employer I-129.",
        whoFiles: "Self (or dependent filing alongside principal)",
        slug: "i-539",
        warning: "File I-539 BEFORE your current status expires. Processing can take 12–24 months. Do not travel internationally while I-539 is pending — it typically abandons the application. You cannot work on a pending I-539 alone.",
        relatedLinks: [
          { href: "/uscis/forms/i-539", label: "I-539 full guide" },
          { href: "/uscis/forms/i-765", label: "I-765 EAD guide" },
          { href: "/tools/h4-ead-navigator", label: "H-4 EAD Navigator" },
        ],
      };

    case "premium":
      return {
        form: "I-907",
        name: "Request for Premium Processing Service",
        what: "Form I-907 is filed alongside an eligible petition (I-129, I-140, I-765, and others) to pay for USCIS to take action within 15 business days. Premium processing costs $2,805 (as of 2026) on top of the petition fee. It guarantees speed — not approval. An RFE within 15 days is still valid USCIS compliance.",
        whoFiles: "Employer or self, depending on which petition it accompanies",
        slug: "i-907-premium-processing",
        warning: "Premium processing is not available for I-485, I-131, or I-539. Note that 15 'business days' is about 3 calendar weeks — and the clock may restart after an RFE response.",
        relatedLinks: [
          { href: "/uscis/forms/i-907-premium-processing", label: "I-907 full guide" },
          { href: "/tools/processing-times", label: "USCIS Processing Times" },
        ],
      };

    case "address":
      return {
        form: "AR-11",
        name: "Alien's Change of Address Card",
        what: "All non-citizens in the US must notify USCIS within 10 days of moving using AR-11. File it online for free at my.uscis.gov — it takes about 5 minutes. USCIS uses your address on file to mail RFEs, interview notices, approval notices, and all other correspondence. Missing a notice because you moved is a serious risk.",
        whoFiles: "Self",
        slug: "ar-11-change-address",
        warning: "AR-11 updates your central USCIS file, but may not automatically update pending petitions at specific service centers. Your attorney should also notify the service center directly for any pending cases.",
        relatedLinks: [
          { href: "/uscis/forms/ar-11-change-address", label: "AR-11 full guide" },
          { href: "/uscis/change-address", label: "USCIS Address Change Guide" },
          { href: "/uscis/myuscis-account", label: "myUSCIS Account Guide" },
        ],
      };

    case "citizenship":
      return {
        form: "N-400",
        name: "Application for Naturalization",
        what: "Permanent residents file N-400 to apply for US citizenship. Standard eligibility requires 5 years as a permanent resident (3 years if married to and living with a US citizen), physical presence in the US for at least 30 of the last 60 months, continuous residence, English language ability, and civics knowledge. You can file up to 90 days before the 5-year anniversary.",
        whoFiles: "Self",
        slug: "n-400",
        warning: "Naturalizing as a US citizen means renouncing Indian citizenship (India does not allow dual citizenship). You can apply for an OCI card after naturalization for visa-free access to India. Consult your attorney if you have any criminal history before filing N-400.",
        relatedLinks: [
          { href: "/uscis/forms/n-400", label: "N-400 full guide" },
          { href: "/tools/citizenship-checklist", label: "Citizenship (N-400) Checklist" },
        ],
      };

    case "received-notice":
      return {
        form: "See notice header",
        name: "Check the top of your USCIS notice for the form type",
        what: "Your I-797 Notice of Action shows the form type in the heading (e.g., 'I-129 - Petition for Nonimmigrant Worker' or 'I-485 - Application to Register Permanent Residence'). The form type tells you which petition or application the notice relates to. Use the USCIS Notice Decoder to understand what the notice itself means.",
        whoFiles: "Depends on the form shown on your notice",
        slug: "",
        warning: "If you received an RFE (Request for Evidence), contact your attorney immediately. RFEs have hard response deadlines — typically 87 days from the notice date.",
        relatedLinks: [
          { href: "/tools/uscis-notice-decoder", label: "USCIS Notice Decoder" },
          { href: "/uscis/i-797-notice", label: "I-797 Notice Types Explained" },
          { href: "/uscis/forms", label: "All USCIS Forms Guide" },
        ],
      };

    default:
      return {
        form: "Select your situation above",
        name: "",
        what: "Choose your immigration situation in the form above to find the right USCIS form.",
        whoFiles: "",
        slug: "",
        warning: "",
        relatedLinks: [
          { href: "/uscis/forms", label: "USCIS Forms Explained" },
          { href: "/tools/uscis-notice-decoder", label: "USCIS Notice Decoder" },
          { href: "/uscis", label: "USCIS Guide for Indians" },
        ],
      };
  }
}

export default function UscisFormFinder() {
  const [situation, setSituation] = useState<Situation>("");
  const [currentStatus, setCurrentStatus] = useState<CurrentStatus>("");
  const [whoFiling, setWhoFiling] = useState<WhoFiling>("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  function handleReset() {
    setSituation(""); setCurrentStatus(""); setWhoFiling(""); setSubmitted(false);
  }

  const result = submitted ? buildResult(situation, currentStatus, whoFiling) : null;

  return (
    <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50/50 to-white p-6 shadow-sm sm:p-8">
      {/* header */}
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-700">USCIS Form Finder</p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">
          Which USCIS form is this?
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          Select your situation, current status, and who is filing to find the right form — plain-English explanation included.
        </p>
      </div>

      {/* disclaimer */}
      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
        <strong className="font-bold">Educational only — not legal advice.</strong>{" "}
        USCIS forms, fees, and rules change. No personal information collected.
        Always verify at uscis.gov and consult your immigration attorney.
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Situation */}
            <label className="block sm:col-span-3 md:col-span-1">
              <span className="text-xs font-semibold text-ink-800">Your situation</span>
              <select
                value={situation}
                onChange={(e) => setSituation(e.target.value as Situation)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Select situation…</option>
                <option value="h1b-employer">My employer filed H-1B for me</option>
                <option value="gc-petition">My employer is filing employment green card petition</option>
                <option value="adjust-status">I want to adjust status to green card (I-485)</option>
                <option value="ead">I want a work permit / EAD</option>
                <option value="travel-doc">I want a travel document / Advance Parole</option>
                <option value="sponsor-family">I want to sponsor a family member</option>
                <option value="change-extend">I want to extend or change my status</option>
                <option value="premium">I want premium processing (faster USCIS action)</option>
                <option value="address">I changed my address and need to notify USCIS</option>
                <option value="citizenship">I want to apply for US citizenship</option>
                <option value="received-notice">I received a notice but don&apos;t know the form</option>
              </select>
            </label>

            {/* Current status */}
            <label className="block">
              <span className="text-xs font-semibold text-ink-800">Current status</span>
              <select
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value as CurrentStatus)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Select status…</option>
                <option value="h1b">H-1B worker</option>
                <option value="h4">H-4 dependent</option>
                <option value="f1-opt">F-1 / OPT</option>
                <option value="l1">L-1</option>
                <option value="gc-pending">Green card pending (I-485)</option>
                <option value="permanent-resident">Permanent resident</option>
                <option value="other">Other</option>
              </select>
            </label>

            {/* Who is filing */}
            <label className="block">
              <span className="text-xs font-semibold text-ink-800">Who is filing?</span>
              <select
                value={whoFiling}
                onChange={(e) => setWhoFiling(e.target.value as WhoFiling)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Select…</option>
                <option value="employer">Employer</option>
                <option value="self">Self</option>
                <option value="family">Family member</option>
                <option value="not-sure">Not sure</option>
              </select>
            </label>
          </div>

          <button
            type="submit"
            disabled={!situation}
            className="w-full rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800 disabled:opacity-40"
          >
            Find my form
          </button>
        </form>
      ) : result ? (
        <div className="space-y-4">
          {/* Result header */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5">
            {result.form !== "Select your situation above" && result.form !== "See notice header" && (
              <span className="inline-block rounded-full bg-blue-600 px-3 py-1 text-sm font-bold text-white">
                {result.form}
              </span>
            )}
            {result.name && (
              <h3 className="mt-2 font-bold text-ink-900">{result.name}</h3>
            )}
            <p className="mt-2 text-sm leading-relaxed text-ink-700">{result.what}</p>
            {result.whoFiles && (
              <p className="mt-3 text-xs text-ink-500">
                <strong className="text-ink-700">Filed by: </strong>{result.whoFiles}
              </p>
            )}
          </div>

          {/* Warning */}
          {result.warning && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
              <strong className="font-bold">⚠️ Note: </strong>{result.warning}
            </div>
          )}

          {/* Not legal advice */}
          <div className="rounded-xl border border-ink-900/5 bg-ink-50/60 px-4 py-3 text-xs text-ink-500">
            This is educational guidance only — not legal or immigration advice. USCIS forms, fees, and eligibility requirements change frequently.
            Always verify with the official{" "}
            <a href="https://www.uscis.gov/forms" target="_blank" rel="noopener noreferrer" className="underline">
              USCIS forms page
            </a>{" "}
            and consult a licensed immigration attorney before filing anything.
          </div>

          {/* Related links */}
          <div className="grid gap-2 sm:grid-cols-2">
            {result.relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 rounded-xl border border-ink-900/10 bg-white p-3.5 text-sm font-semibold text-ink-900 transition hover:border-blue-400 hover:shadow-sm"
              >
                <span className="text-base">📋</span>
                {link.label}
              </Link>
            ))}
          </div>

          <button
            onClick={handleReset}
            className="w-full rounded-xl border border-ink-900/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-50"
          >
            ← Find another form
          </button>
        </div>
      ) : null}
    </div>
  );
}
