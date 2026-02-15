import data from "../../db.json";
import { PortfolioCollection } from "~/types";
import { useSearchParams } from "@solidjs/router";
import { createMemo } from "solid-js";
import SEO from "~/components/SEO";
import CollectionGrid from "~/components/Collection";

const collectionData: PortfolioCollection[] = data;

export default function ProjectPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Make tags a memo that directly reads from searchParams.tags
  const tags = createMemo(() => {
    if (searchParams.tags) {
      return (searchParams.tags as string).split(",");
    }
    return [];
  });

  // Make clients a memo that directly reads from searchParams.client
  const clients = createMemo(() => {
    if (searchParams.client) {
      return (searchParams.client as string).split(",");
    }
    return [];
  });

  return (
    <>
      <SEO
        title="Projects | Portfolio of Mike Angelo, Art Director & Web Designer in New Jersey"
        description="Explore Mike Angelo's portfolio of art direction, web design and development, and advertising campaigns for clients in New Jersey and New York."
        canonical="https://mikeangeloart.com/projects"
        ogImage="https://cdn.mikeangelo.art/og-default.png"
        breadcrumbs={[
          { name: "Home", url: "https://mikeangeloart.com" },
          { name: "Projects", url: "https://mikeangeloart.com/projects" },
        ]}
        localBusiness={true}
        organization={true}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Portfolio Projects",
          description:
            "A collection of art direction, web design, and advertising campaign projects by Mike Angelo.",
          url: "https://mikeangeloart.com/projects",
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: collectionData.length,
            itemListElement: collectionData.map((project, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: project.title,
              description: project.projectObjective,
              url: `https://mikeangeloart.com/projects/${project.slug}`,
            })),
          },
        }}
      />
      <main>
        <CollectionGrid
          sortByTags={{
            get: tags,
            set: (newTags) =>
              setSearchParams({ tags: (newTags as string[]).join() }),
          }}
          sortByClients={{
            get: clients,
            set: (newClients) =>
              setSearchParams({ client: (newClients as string[]).join() }),
          }}
          enableFull={true}
          data={collectionData}
          enableSearch={true}
        />
      </main>
    </>
  );
}
