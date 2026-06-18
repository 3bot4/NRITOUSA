import type { Metadata } from "next";
import OrganizerIncome from "@/components/nri-tax/OrganizerIncome";

export const metadata: Metadata = {
  title: "Income & TDS — NRI Wealth Checkup",
  robots: { index: false, follow: true },
};

export default function IncomePage() {
  return <OrganizerIncome />;
}
