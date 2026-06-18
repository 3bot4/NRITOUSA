import { permanentRedirect } from "next/navigation";

/**
 * Alternate/tool route for the NRI Global Wealth & Tax Organizer. The canonical
 * home is /nri-wealth-checkup, so this route issues a permanent (308) redirect
 * there to avoid duplicate content while still resolving the tool-style URL.
 */
export default function NriGlobalWealthTaxOrganizerAlias(): never {
  permanentRedirect("/nri-wealth-checkup");
}
