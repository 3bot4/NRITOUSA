/**
 * Privacy notice shown above every data-entry surface. The tool deliberately
 * never asks for account numbers or government IDs; this banner states that
 * promise plainly.
 */
export default function PrivacyNotice({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-relaxed text-emerald-900 ${className}`}
    >
      <strong className="font-semibold">🔒 Your privacy:</strong> Do not enter account
      numbers, SSN, PAN, Aadhaar, passport numbers, or exact property addresses. Use
      nicknames and approximate annual values only (for example &ldquo;HDFC NRO,&rdquo;
      &ldquo;Mumbai apartment,&rdquo; &ldquo;Vanguard brokerage&rdquo;). Your entries are
      saved only in this browser on this device — nothing is sent to a server.
    </div>
  );
}
