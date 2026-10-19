import { For, Show, createMemo } from "solid-js";
import { A, createAsync } from "@solidjs/router";
import { Breadcrumbs } from "~/components/Breadcrumbs";
import CreativeMosaic from "~/components/CreativeMosaic";
import { PersonalProjectCard } from "~/components/PersonalProjectCard";
import SEO from "~/components/SEO";
import ActionIcon from "~/components/ActionIcon";
import { siteContent } from "~/content/site-content";
import { H1 } from "~/layout/Headings";
import { fetchPersonalContent } from "~/utils/content-database";

export default function PersonalProjects() {
  const personalContent = createAsync(() => fetchPersonalContent(), {
    deferStream: true,
  });

  return (
    <Show
      when={personalContent()}
      fallback={
        <main
          class="w-full px-5 pt-28 pb-12 text-black dark:text-white sm:px-6 sm:pt-32"
          aria-busy="true"
        >
          <p class="max-w-7xl mx-auto" role="status">Loading projects…</p>
        </main>
      }
    >
      {(content) => {
        const site = () => siteContent;
        const copy = () => site().personalPage;
        const siteUrl = () => site().url || "https://mikeangelo.art";
        const pageUrl = () => new URL("/personal", siteUrl()).href;
        const featuredProjects = createMemo(() => content().personalProjects
          .filter((project) => project.presentation !== "compact"));
        const supportingProjects = createMemo(() => content().personalProjects
          .filter((project) => project.presentation === "compact"));

        return (
          <>
            <SEO
              title={`${copy().title} | ${site().name} — ${site().role}`}
              description={copy().description}
              canonical={pageUrl()}
              ogImage={site().ogImage}
              breadcrumbs={[
                { name: "Home", url: siteUrl() },
                { name: copy().title, url: pageUrl() },
              ]}
              jsonLd={{
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                name: copy().title,
                description: copy().description,
                url: pageUrl(),
                author: {
                  "@type": "Person",
                  name: site().name,
                  url: siteUrl(),
                },
                mainEntity: {
                  "@type": "ItemList",
                  itemListElement: [...featuredProjects(), ...supportingProjects()].map((project, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    item: {
                      "@type": "CreativeWork",
                      name: project.title,
                      description: project.summary,
                      url: `${pageUrl()}#${project.id}`,
                    },
                  })),
                },
              }}
            />
            <main class="w-full text-black dark:text-white">
              <section class="px-5 pt-28 pb-9 border-b border-black/10 dark:border-white/10 sm:px-6 sm:pt-32 sm:pb-10">
                <div class="max-w-7xl mx-auto">
                  <Breadcrumbs
                    items={[
                      { name: "Home", url: "/" },
                      { name: copy().title, url: "/personal" },
                    ]}
                  />
                  <div class="max-w-2xl mt-6 flex flex-col gap-4">
                    <H1>{copy().title}</H1>
                    <p class="type-intro text-black/65 dark:text-white/65">
                      Tools, AI experiments, and hobby projects that I'm working on.
                    </p>
                    <nav aria-label="Explore projects" class="mt-1 flex flex-wrap gap-3">
                      <A
                        href="#cruio"
                        class="inline-flex min-h-11 items-center justify-center gap-3 bg-black px-5 py-3 text-sm font-normal text-white transition-colors hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-offset-4 dark:bg-white dark:text-black dark:hover:bg-white/80"
                      >
                        Passion projects <ActionIcon name="arrow-down" />
                      </A>
                      <A
                        href="#creative-work"
                        class="inline-flex min-h-11 items-center justify-center gap-3 border border-black/20 px-5 py-3 text-sm font-normal transition-colors hover:bg-black/3 focus-visible:outline-2 focus-visible:outline-offset-4 dark:border-white/20 dark:hover:bg-white/3"
                      >
                        Visual experiments <ActionIcon name="arrow-down" />
                      </A>
                    </nav>
                  </div>
                </div>
              </section>

              <section
                id="passion-projects"
                aria-labelledby="passion-projects-heading"
                class="scroll-mt-28 px-5 py-10 bg-black/3 dark:bg-white/3 sm:px-6 sm:py-12"
              >
                <div class="max-w-7xl mx-auto">
                  <h2
                    id="passion-projects-heading"
                    class="type-heading mb-5"
                  >
                    {copy().projectsHeading}
                  </h2>
                  <div class="grid gap-6">
                    <For each={featuredProjects()}>
                      {(project) => <PersonalProjectCard project={project} />}
                    </For>
                  </div>
                </div>
              </section>

              <Show when={supportingProjects().length > 0}>
                <section
                  aria-labelledby="supporting-projects-heading"
                  class="px-5 pb-10 bg-black/3 dark:bg-white/3 sm:px-6 sm:pb-12"
                >
                  <div class="max-w-7xl mx-auto">
                    <div class="mb-5 flex flex-col gap-2">
                      <h2 id="supporting-projects-heading" class="type-heading">
                        {copy().supportingHeading}
                      </h2>
                      <Show when={copy().supportingDescription}>
                        <p class="type-body max-w-2xl text-black/65 dark:text-white/65">
                          {copy().supportingDescription}
                        </p>
                      </Show>
                    </div>
                    <div class="grid gap-6 items-stretch md:grid-cols-2">
                      <For each={supportingProjects()}>
                        {(project) => <PersonalProjectCard project={project} />}
                      </For>
                    </div>
                  </div>
                </section>
              </Show>

              <section
                id="creative-work"
                aria-labelledby="creative-pieces-heading"
                class="scroll-mt-28 py-10 border-t border-black/10 dark:border-white/10 sm:py-12"
              >
                <div class="px-5 mb-5 sm:px-6">
                  <div class="max-w-7xl mx-auto flex flex-col gap-2">
                    <h2 id="creative-pieces-heading" class="type-heading">
                      Visual Experiments
                    </h2>
                    <p class="type-body max-w-2xl text-black/65 dark:text-white/65">
                      An assortment of random artwork I create.
                    </p>
                  </div>
                </div>
                <Show
                  when={content().creativePieces.length > 0}
                  fallback={
                    <div class="px-5 sm:px-6">
                      <p class="type-body max-w-7xl mx-auto border-t border-black/10 dark:border-white/10 pt-5 text-black/65 dark:text-white/65">
                        Currently in progress of updating!
                      </p>
                    </div>
                  }
                >
                  <CreativeMosaic items={content().creativePieces} />
                </Show>
              </section>
            </main>
          </>
        );
      }}
    </Show>
  );
}
