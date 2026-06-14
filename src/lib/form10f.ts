/**
 * Form 10F generator — pure, client-side logic.
 *
 * Form 10F is the Indian Income-tax form (Rule 21AB of the Income-tax Rules)
 * that a non-resident files to claim India–US DTAA treaty benefits when their
 * Tax Residency Certificate (TRC) does not already contain all of the required
 * particulars. It mirrors the seven self-declaration fields on the official
 * form, plus the assessee's name.
 *
 * Nothing here touches a network, storage, or analytics — it only turns the
 * values the user typed into a structured, printable summary. The tool is
 * educational only; the official form must still be filed on the Income-tax
 * e-filing portal.
 */

export type Status = "individual" | "other";

export interface Form10FInputs {
  name: string;
  status: Status;
  /** India PAN, if one has been allotted (optional on the form). */
  pan: string;
  /** Individuals: nationality. Others: country of incorporation/registration. */
  nationality: string;
  /** Country in which the assessee is resident for tax purposes. */
  countryOfResidence: string;
  /** Tax Identification Number in the country of residence (e.g. US SSN/ITIN). */
  tin: string;
  /** Period for which the TRC residential status applies. */
  periodFrom: string;
  periodTo: string;
  /** Address in the country of residence. */
  address: string;
}

export const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: "individual", label: "Individual" },
  { value: "other", label: "Other (company, firm, HUF, trust, etc.)" },
];

export const EMPTY_INPUTS: Form10FInputs = {
  name: "",
  status: "individual",
  pan: "",
  nationality: "India",
  countryOfResidence: "USA",
  tin: "",
  periodFrom: "",
  periodTo: "",
  address: "",
};

/** A single rendered row of the form summary. */
export interface SummaryRow {
  no: number;
  label: string;
  value: string;
  /** Required for a complete declaration (PAN is the only optional field). */
  required: boolean;
  filled: boolean;
}

const PLACEHOLDER = "—";

/** Format a YYYY-MM-DD date input as a readable DD MMM YYYY, else passthrough. */
export function formatDate(iso: string): string {
  if (!iso) return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const [, y, mo, d] = m;
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const idx = Number(mo) - 1;
  if (idx < 0 || idx > 11) return iso;
  return `${d} ${months[idx]} ${y}`;
}

function periodText(from: string, to: string): string {
  const f = formatDate(from);
  const t = formatDate(to);
  if (f && t) return `${f} to ${t}`;
  if (f) return `From ${f}`;
  if (t) return `Up to ${t}`;
  return "";
}

/** Build the seven-field Form 10F summary rows from the user's inputs. */
export function buildSummaryRows(input: Form10FInputs): SummaryRow[] {
  const isIndividual = input.status === "individual";
  const nationalityLabel = isIndividual
    ? "Nationality"
    : "Country of incorporation or registration";

  const statusLabel =
    STATUS_OPTIONS.find((o) => o.value === input.status)?.label ?? "";

  const period = periodText(input.periodFrom, input.periodTo);

  const raw: Omit<SummaryRow, "no" | "filled">[] = [
    { label: "Name of the assessee", value: input.name.trim(), required: true },
    { label: "Status (individual, company, firm, etc.)", value: statusLabel, required: true },
    { label: "Permanent Account Number (PAN), if allotted", value: input.pan.trim().toUpperCase(), required: false },
    { label: nationalityLabel, value: input.nationality.trim(), required: true },
    {
      label:
        "Tax Identification Number (TIN) in the country of residence — or a unique identification number, if no TIN",
      value: input.tin.trim(),
      required: true,
    },
    {
      label: "Period for which the residential status (as in the TRC) applies",
      value: period,
      required: true,
    },
    { label: "Address in the country of residence", value: input.address.trim(), required: true },
  ];

  return raw.map((r, i) => ({
    no: i + 1,
    ...r,
    filled: r.value.length > 0,
  }));
}

export interface Form10FResult {
  rows: SummaryRow[];
  /** Required rows that are still empty. */
  missingRequired: SummaryRow[];
  isComplete: boolean;
  /** Broad, non-identifying label for analytics. */
  trackedResult: "complete" | "in-progress" | "empty";
}

export function evaluateForm10F(input: Form10FInputs): Form10FResult {
  const rows = buildSummaryRows(input);
  const missingRequired = rows.filter((r) => r.required && !r.filled);
  const filledCount = rows.filter((r) => r.filled).length;
  const isComplete = missingRequired.length === 0;

  return {
    rows,
    missingRequired,
    isComplete,
    trackedResult: isComplete
      ? "complete"
      : filledCount === 0
        ? "empty"
        : "in-progress",
  };
}

/**
 * Plain-text version of the declaration, for copy-to-clipboard / .txt download.
 * Mirrors the language of the official Form 10F so the user can transcribe it
 * onto the real form on the e-filing portal.
 */
export function buildPlainText(input: Form10FInputs): string {
  const rows = buildSummaryRows(input);
  const today = formatDate(new Date().toISOString().slice(0, 10));

  const lines: string[] = [
    "FORM No. 10F",
    "Information to be provided under sub-section (5) of section 90 or",
    "sub-section (5) of section 90A of the Income-tax Act, 1961",
    "(See rule 21AB)",
    "",
    "I, " + (input.name.trim() || PLACEHOLDER) +
      ", do provide the following information, relevant to the previous",
    "year ____________ in my case, for the purpose of claiming relief under the",
    "Double Taxation Avoidance Agreement between India and " +
      (input.countryOfResidence.trim() || PLACEHOLDER) + ":",
    "",
  ];

  for (const r of rows) {
    lines.push(`${r.no}. ${r.label}:`);
    lines.push(`   ${r.value || PLACEHOLDER}`);
    lines.push("");
  }

  lines.push(
    "Verification",
    "",
    "I, " + (input.name.trim() || PLACEHOLDER) +
      ", do hereby declare that to the best of my knowledge and belief the",
    "information given above is correct and complete.",
    "",
    `Place: ${input.countryOfResidence.trim() || PLACEHOLDER}`,
    `Date:  ${today}`,
    "Signature: ____________________",
    "",
    "—",
    "Generated as an educational draft at nritousa.com/tools/form-10f-generator.",
    "This is NOT the official form and is not tax or legal advice. File Form 10F",
    "electronically on the Income-tax e-filing portal (incometax.gov.in) and",
    "consult a qualified tax professional.",
  );

  return lines.join("\n");
}

/** HTML-escape a user-supplied string for safe insertion into the print doc. */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * A standalone, print-optimized HTML document of the Form 10F declaration —
 * just the form, with its own inline styles, so printing it (via a hidden
 * iframe) produces a clean one-page PDF instead of the whole website.
 */
export function buildPrintHtml(input: Form10FInputs): string {
  const rows = buildSummaryRows(input);
  const today = formatDate(new Date().toISOString().slice(0, 10));
  const name = esc(input.name.trim()) || "____________";
  const country = esc(input.countryOfResidence.trim()) || "____";

  const rowsHtml = rows
    .map(
      (r) => `
      <div class="row">
        <div class="label">${r.no}. ${esc(r.label)}${
          r.required ? "" : ' <span class="opt">(optional)</span>'
        }</div>
        <div class="value${r.filled ? "" : " empty"}">${
          r.filled ? esc(r.value) : "—"
        }</div>
      </div>`
    )
    .join("");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Form 10F</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color: #1a1f2e; margin: 0; padding: 40px; line-height: 1.5; }
  .sheet { max-width: 680px; margin: 0 auto; }
  h1 { font-size: 16px; text-align: center; letter-spacing: .08em; text-transform: uppercase; margin: 0; }
  .sub { text-align: center; font-size: 11px; color: #5b6472; margin: 6px 0 24px; }
  .intro { font-size: 13px; margin-bottom: 20px; }
  .row { margin-bottom: 14px; }
  .label { font-size: 10px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; color: #5b6472; }
  .opt { font-weight: 400; text-transform: none; color: #9aa3b2; }
  .value { font-size: 14px; margin-top: 2px; }
  .value.empty { color: #c2c8d2; font-style: italic; }
  .verify { margin-top: 24px; border-top: 1px solid #d7dbe2; padding-top: 16px; font-size: 13px; }
  .verify b { display: block; margin-bottom: 4px; }
  .sign { margin-top: 28px; font-size: 13px; color: #5b6472; }
  .foot { margin-top: 28px; border-top: 1px solid #d7dbe2; padding-top: 12px; font-size: 10px; color: #9aa3b2; }
  @page { margin: 18mm; }
</style></head>
<body><div class="sheet">
  <h1>Form No. 10F</h1>
  <div class="sub">Information under sub-section (5) of section 90 / 90A of the Income-tax Act, 1961 (see rule 21AB)</div>
  <div class="intro">I, <strong>${name}</strong>, provide the following information for the purpose of claiming relief under the India–${country} Double Taxation Avoidance Agreement:</div>
  ${rowsHtml}
  <div class="verify"><b>Verification</b>I, ${name}, declare that to the best of my knowledge and belief the information given above is correct and complete.</div>
  <div class="sign">Place: ${country} &nbsp;·&nbsp; Date: ${today} &nbsp;·&nbsp; Signature: ____________________</div>
  <div class="foot">Generated as an educational draft at nritousa.com/tools/form-10f-generator. This is NOT the official form and is not tax or legal advice. File Form 10F electronically on the Income-tax e-filing portal (incometax.gov.in).</div>
</div></body></html>`;
}

export const DATA_STAMP = {
  lastUpdated: "2026-06-14",
  source: "https://incometaxindia.gov.in/Pages/rules/income-tax-rules-1962.aspx",
  sourceLabel: "Income-tax Rules, 1962 — Rule 21AB & Form 10F",
};
