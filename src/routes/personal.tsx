import { For, Show, createMemo } from "solid-js";
import { A, createAsync } from "@solidjs/router";
import { Breadcrumbs } from "~/components/Breadcrumbs";
import CreativeMosaic from "~/components/CreativeMosaic";
import { PersonalProjectCard } from "~/components/PersonalProjectCard";
import SEO from "~/components/SEO";
import type { PersonalPageCopy } from "~/content/content-model";
import { H1 } from "~/layout/Headings";
import { fetchPersonalContent } from "~/utils/content-database";

const fallbackCopy: PersonalPageCopy = {
  title: "Projects",
  description:
    "Personal projects by Mike Angelo: Cruio, RAID, Indigo, and smaller tools and creative experiments.",
  intro:
    "Apps, games, and creative detours. A few ongoing projects, followed by smaller things I make along the way.",
  projectsHeading: "Passion projects",
  supportingHeading: "Smaller projects",
  supportingDescription: "Tools I build around the way I work.",
  mosaicHeading: "Odds & ends",
  mosaicDescription:
    "Blender renders, sketches, GIFs, and whatever else I’m experimenting with.",
  emptyMosaic: "More things are on the way.",
};

export default function PersonalProjects() {
  const personalContent = createAsync(() => fetchPersonalContent(), {
    deferStream: true,
  });

  return (
    <Show
      when={personalContent()}
      fallback={
        <main
          class="w-full px-6 pt-36 pb-18 text-black dark:text-white"
          aria-busy="true"
        >
          <p class="max-w-7xl mx-auto" role="status">Loading projects…</p>
        </main>
      }
    >
      {(content) => {
        const site = () => content().site;
        const copy = () => site().personalPage ?? fallbackCopy;
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
              <section class="px-6 pt-36 pb-18 border-b border-black/10 dark:border-white/10">
                <div class="max-w-7xl mx-auto">
                  <Breadcrumbs
                    items={[
                      { name: "Home", url: "/" },
                      { name: copy().title, url: "/personal" },
                    ]}
                  />
                  <div class="max-w-3xl mt-9 flex flex-col gap-6">
                    <H1>{copy().title}</H1>
                    <p class="text-neutral-600 dark:text-neutral-400">
                      {copy().intro}
                    </p>
                    <nav aria-label="Explore projects" class="flex flex-wrap gap-3">
                      <A
                        href="#cruio"
                        class="inline-flex min-h-11 items-center justify-center gap-3 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-4 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                      >
                        Passion projects <span aria-hidden="true">↓</span>
                      </A>
                      <A
                        href="#creative-work"
                        class="inline-flex min-h-11 items-center justify-center gap-3 rounded-xl border border-black/20 px-5 py-3 text-sm font-semibold transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-4 dark:border-white/20 dark:hover:bg-neutral-900"
                      >
                        Visual experiments <span aria-hidden="true">↓</span>
                      </A>
                    </nav>
                  </div>
                </div>
              </section>

              <section
                id="passion-projects"
                aria-labelledby="passion-projects-heading"
                class="scroll-mt-28 px-6 py-18 bg-neutral-100 dark:bg-neutral-950"
              >
                <div class="max-w-7xl mx-auto">
                  <h2
                    id="passion-projects-heading"
                    class="font-semibold text-3xl mb-9"
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
                  class="px-6 pb-18 bg-neutral-100 dark:bg-neutral-950"
                >
                  <div class="max-w-7xl mx-auto">
                    <div class="mb-9 flex flex-col gap-4">
                      <h2 id="supporting-projects-heading" class="font-semibold text-3xl">
                        {copy().supportingHeading || fallbackCopy.supportingHeading}
                      </h2>
                      <Show when={copy().supportingDescription}>
                        <p class="max-w-2xl text-neutral-600 dark:text-neutral-400">
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
                class="scroll-mt-28 py-18 border-t border-black/10 dark:border-white/10"
              >
                <div class="px-6 mb-9">
                  <div class="max-w-7xl mx-auto flex flex-col gap-4">
                    <h2 id="creative-pieces-heading" class="font-semibold text-3xl">
                      {copy().mosaicHeading}
                    </h2>
                    <p class="max-w-2xl text-neutral-600 dark:text-neutral-400">
                      {copy().mosaicDescription}
                    </p>
                  </div>
                </div>
                <Show
                  when={content().creativePieces.length > 0}
                  fallback={
                    <div class="px-6">
                      <p class="max-w-7xl mx-auto border-t border-black/10 dark:border-white/10 pt-9 text-neutral-600 dark:text-neutral-400">
                        {copy().emptyMosaic}
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
