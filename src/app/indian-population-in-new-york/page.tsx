import StatePopulationPage, { stateMetadata } from "@/components/StatePopulationPage";

export const metadata = stateMetadata("new-york");

export default function Page() {
  return <StatePopulationPage slug="new-york" />;
}
