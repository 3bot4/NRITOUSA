import StatePopulationPage, { stateMetadata } from "@/components/StatePopulationPage";

export const metadata = stateMetadata("virginia");

export default function Page() {
  return <StatePopulationPage slug="virginia" />;
}
