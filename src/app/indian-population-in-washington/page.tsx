import StatePopulationPage, { stateMetadata } from "@/components/StatePopulationPage";

export const metadata = stateMetadata("washington");

export default function Page() {
  return <StatePopulationPage slug="washington" />;
}
