import { createMemo, For, Show } from "solid-js";
import { PortfolioCollection } from "~/types";
import { Tag } from "~/layout/Cards";
import { H3 } from "~/layout/Headings";
import { A } from "@solidjs/router";

interface RelatedProjectsProps {
  currentProject: PortfolioCollection;
  allProjects: PortfolioCollection[];
  maxItems?: number;
}

export function RelatedProjects(props: RelatedProjectsProps) {
  // Find related projects based on shared tags
  const relatedProjects = createMemo(() => {
    const currentTags = props.currentProject.tags || [];

    // Calculate similarity score based on shared tags
    const scored = props.allProjects
      .filter((project) => project.id !== props.currentProject.id)
      .map((project) => {
        const projectTags = project.tags || [];
        const sharedTags = currentTags.filter((tag) =>
          projectTags.includes(tag),
        );
        const similarity =
          sharedTags.length / Math.max(1, currentTags.length, projectTags.length);

        return {
          ...project,
          similarity,
          sharedTags,
        };
      })
      .filter((project) => project.similarity > 0) // Only include projects with shared tags
      .sort((a, b) => b.similarity - a.similarity) // Sort by similarity
      .slice(0, props.maxItems ?? 3);

    return scored;
  });

  return (
    <section class="w-full bg-white dark:bg-black border-black/10 dark:border-white/10">
      <div class="max-w-7xl mx-auto px-6 py-8 md:py-12">
        <div class="flex flex-col gap-8">
          <Show when={relatedProjects().length > 0}>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <For each={relatedProjects()}>
                {(project) => {
                  return (
                    <div
                      class="group relative overflow-hidden bg-black/3 dark:bg-white/3 border border-black/15 dark:border-white/15"
                    >
                      <A
                        href={`/projects/${project.slug}`}
                        class="block w-full h-full"
                      >
                        <div class="aspect-[4/3] overflow-hidden bg-black/3 dark:bg-white/3">
                          <img
                            src={project.cover}
                            alt={project.coverAlt || project.title}
                            width={project.coverWidth}
                            height={project.coverHeight}
                            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>

                        <div class="p-4 md:p-5">
                          <div class="flex items-start justify-between gap-4 mb-2">
                            <img
                              src={project.clientLogo}
                              alt={project.clientName}
                              class="w-8 h-8 object-contain brightness-0 dark:brightness-200 saturate-0 contrast-0"
                              loading="lazy"
                            />
                          </div>

                          <H3>{project.title}</H3>

                          <p class="text-sm text-black/70 dark:text-white/70 mb-3 line-clamp-2">
                            {project.projectObjective}
                          </p>

                          <div class="flex flex-wrap gap-1">
                            <For each={project.sharedTags.slice(0, 3)}>
                              {(tag) => <Tag>{tag}</Tag>}
                            </For>
                            {project.sharedTags.length > 3 && (
                              <span class="text-xs text-black/65 dark:text-white/65 px-2 py-1">
                                +{project.sharedTags.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </A>
                    </div>
                  );
                }}
              </For>
            </div>
          </Show>

          <Show when={relatedProjects().length === 0}>
            <div class="text-center py-12">
              <p class="text-black/60 dark:text-white/60">
                No related projects found.
                <A
                  href="/projects"
                  class="text-black hover:text-black dark:text-white dark:hover:text-white underline ml-1"
                >
                  View all projects
                </A>
              </p>
            </div>
          </Show>
        </div>
      </div>
    </section>
  );
}
