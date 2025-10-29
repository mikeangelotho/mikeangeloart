import data from "../../db.json";
import Collection, { PortfolioCollection } from "~/components/Collection";
import Panel3d from "~/components/Panel3d";

const collectionData: PortfolioCollection[] = data;

export default function ProjectPage() {
  return (
    <main>
      <Panel3d data="/MA_3DLogo.glb" headline="Testing" paragraph="Testing" />
      <Collection data={collectionData} enableSearch={true} />
    </main>
  );
}
