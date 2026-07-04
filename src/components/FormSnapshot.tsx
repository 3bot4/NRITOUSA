import Link from "next/link";
import { formatDate } from "@/lib/format";
import { siteWideUpdatePolicy } from "@/data/siteWideVerifiedNumbers";
import { USCIS_FEE_CALCULATOR, type FormSnapshot as FormSnapshotData } from "@/lib/uscisFormsCluster";

/**
 * Top-of-page "Form Snapshot" for USCIS form pages — the fast answer a searcher
 * wants first: filing fee, processing-time estimate, premium-processing status,
 * who files, the most common mistake, official source, and a last-verified date.
 * Fees are best-known current figures with a mandatory "verify" link.
 */
export default function FormSnapshot({
  formNumber,
  data,
}: {
  formNumber: string;
  data: FormSnapshotData;
}) {
  const verified = /^\d{4}-\d{2}-\d{2}/.test(data.lastVerified) ? formatDate(data.lastVerified) : data.lastVerified;

  const cards = [
    { label: "Filing fee", value: data.filingFee, note: data.feeNote, big: true },
    { label: "Processing time", value: data.processingTime, big: true },
    { label: "Premium processing", value: data.premiumProcessing },
    { label: "Who files", value: data.whoFiles },
  ];

  return (
    <div className="mx-auto max-w-[720px] rounded-2xl border border-blue-200 bg-blue-50/50 p-5 shadow-card sm:p-6">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-white/70 px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-wide text-ink-500">
          Fast answer
        </span>
        <span className="inline-flex items-center rounded-full bg-blue-600 px-2.5 py-1 text-[0.625rem] font-bold text-white">
          {formNumber}
        </span>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-ink-900/10 bg-white/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">{c.label}</p>
            <p className={`mt-1 font-black text-blue-700 ${c.big ? "text-xl" : "text-base"}`}>{c.value}</p>
            {c.note && <p className="mt-1 text-xs leading-relaxed text-ink-600">{c.note}</p>}
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/60 p-3.5">
        <p className="text-xs leading-relaxed text-ink-700">
          <span className="font-bold text-ink-900">Common mistake:</span> {data.commonMistake}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <span className="font-semibold text-ink-700">Last verified: <span className="text-ink-900">{verified}</span></span>
        <span className="text-ink-500">· Verification cadence: {siteWideUpdatePolicy.updateFrequency}</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <a
          href={data.sourceUrl}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-brand-600 transition hover:border-brand-300"
        >
          Official {formNumber} page ↗
        </a>
        <a
          href={USCIS_FEE_CALCULATOR}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-brand-600 transition hover:border-brand-300"
        >
          Verify fee — USCIS Fee Calculator ↗
        </a>
        <Link
          href="/tools/uscis-form-finder"
          className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-blue-700"
        >
          Find my form →
        </Link>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-ink-500">{siteWideUpdatePolicy.disclaimer}</p>
    </div>
  );
}
