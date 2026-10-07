import { PortfolioCollection } from "~/types";
import { createAsync, useSearchParams } from "@solidjs/router";
import { createMemo, Show } from "solid-js";
import SEO from "~/components/SEO";
import CollectionGrid from "~/components/Collection";
import { fetchPortfolio } from "~/utils/portfolio";
import { H1 } from "~/layout/Headings";

export default function ProjectPage() {
  const portfolioCollection = createAsync(() => fetchPortfolio(), {
    deferStream: true,
  });
  const [searchParams, setSearchParams] = useSearchParams();

  const tags = createMemo(() => {
    if (searchParams.tags) {
      return (
        Array.isArray(searchParams.tags)
          ? searchParams.tags.join(",")
          : searchParams.tags
      )
        .split(",")
        .filter(Boolean);
    }
    return [];
  });

  const clients = createMemo(() => {
    if (searchParams.client) {
      return (
        Array.isArray(searchParams.client)
          ? searchParams.client.join(",")
          : searchParams.client
      )
        .split(",")
        .filter(Boolean);
    }
    return [];
  });

  return (
    <>
      <SEO
        title="Selected Work | Mike Angelo, Art Director & Multidisciplinary Designer"
        description="Explore Mike Angelo's brand identities, integrated campaigns, motion, and digital experiences for Loopwell, Bahlsen, Benzel-Busch, and more."
        canonical="https://mikeangelo.art/projects"
        ogImage="https://cdn.mikeangelo.art/og-default.png"
        breadcrumbs={[
          { name: "Home", url: "https://mikeangelo.art" },
          { name: "Projects", url: "https://mikeangelo.art/projects" },
        ]}
        localBusiness={true}
        organization={true}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Portfolio Projects",
          description:
            "A collection of art direction, web design, and advertising campaign projects by Mike Angelo.",
          url: "https://mikeangelo.art/projects",
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: portfolioCollection()?.length,
            itemListElement: portfolioCollection()?.map((project, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: project.title,
              description: project.projectObjective,
              url: `https://mikeangelo.art/projects/${project.slug}`,
            })),
          },
        }}
      />
      <main class="w-full pt-36 text-black dark:text-white">
        <header class="max-w-7xl mx-auto px-6 pb-9"><H1>Work</H1></header>
        <Show when={portfolioCollection()}>
          <CollectionGrid
            onResetFilters={() => setSearchParams({ tags: undefined, client: undefined }, { scroll: false })}
            sortByTags={{
              get: tags,
              set: (newTags) =>
                setSearchParams({
                  tags: newTags.length ? newTags.join(",") : undefined,
                }, { scroll: false }),
            }}
            sortByClients={{
              get: clients,
              set: (newClients) =>
                setSearchParams({
                  client: newClients.length ? newClients.join(",") : undefined,
                }, { scroll: false }),
            }}
            enableFull={true}
            data={portfolioCollection() as PortfolioCollection[]}
            enableSearch={true}
          />
        </Show>
      </main>
    </>
  );
}
