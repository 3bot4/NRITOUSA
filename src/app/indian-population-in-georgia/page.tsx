import StatePopulationPage, { stateMetadata } from "@/components/StatePopulationPage";

export const metadata = stateMetadata("georgia");

export default function Page() {
  return <StatePopulationPage slug="georgia" />;
}
