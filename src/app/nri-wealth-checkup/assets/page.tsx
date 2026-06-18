import type { Metadata } from "next";
import OrganizerAssets from "@/components/nri-tax/OrganizerAssets";

export const metadata: Metadata = {
  title: "Assets — NRI Wealth Checkup",
  robots: { index: false, follow: false },
};

export default function AssetsPage() {
  return <OrganizerAssets />;
}
