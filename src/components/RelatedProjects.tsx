import { For, Show } from "solid-js";
import { PortfolioCollection } from "./Collection";
import { Tag } from "~/layout/Cards";
import { H2, H3 } from "~/layout/Headings";

interface RelatedProjectsProps {
  currentProject: PortfolioCollection;
  allProjects: PortfolioCollection[];
  maxItems?: number;
}

export function RelatedProjects(props: RelatedProjectsProps) {
  const { currentProject, allProjects, maxItems = 3 } = props;

  // Find related projects based on shared tags
  const relatedProjects = () => {
    const currentTags = currentProject.tags || [];

    // Calculate similarity score based on shared tags
    const scored = allProjects
      .filter(project => project.id !== currentProject.id)
      .map(project => {
        const projectTags = project.tags || [];
        const sharedTags = currentTags.filter(tag => projectTags.includes(tag));
        const similarity = sharedTags.length / Math.max(currentTags.length, projectTags.length);

        return {
          ...project,
          similarity,
          sharedTags
        };
      })
      .filter(project => project.similarity > 0) // Only include projects with shared tags
      .sort((a, b) => b.similarity - a.similarity) // Sort by similarity
      .slice(0, maxItems);

    return scored;
  };

  return (
    <section class="w-full bg-white dark:bg-neutral-950 border-t border-black/10 dark:border-white/10">
      <div class="max-w-7xl mx-auto px-6 py-18 lg:py-36">
        <div class="flex flex-col gap-12">
          <div class="text-center lg:text-left">
            <H2>
              Related Projects
            </H2>
          </div>

          <Show when={relatedProjects().length > 0}>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <For each={relatedProjects()}>
                {(project) => (
                  <div class="group relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 transition-all duration-300">
                    <a
                      href={`/projects/${project.slug}`}
                      class="block w-full h-full"
                    >
                      <div class="aspect-video overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                        <img
                          src={project.cover}
                          alt={project.title}
                          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>

                      <div class="p-6">
                        <div class="flex items-start justify-between gap-4 mb-3">
                          <img
                            src={project.clientLogo}
                            alt={project.clientName}
                            class="w-8 h-8 object-contain brightness-0 dark:brightness-200 saturate-0 contrast-0"
                            loading="lazy"
                          />
                        </div>

                        <H3>
                          {project.title}
                        </H3>

                        <p class="text-sm text-black/60 dark:text-white/60 mb-4 line-clamp-2">
                          {project.projectObjective}
                        </p>

                        <div class="flex flex-wrap gap-1">
                          <For each={project.sharedTags.slice(0, 3)}>
                            {(tag) => (
                              <Tag>{tag}</Tag>
                            )}
                          </For>
                          {project.sharedTags.length > 3 && (
                            <span class="text-xs text-black/40 dark:text-white/40 px-2 py-1">
                              +{project.sharedTags.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </a>
                  </div>
                )}
              </For>
            </div>
          </Show>

          <Show when={relatedProjects().length === 0}>
            <div class="text-center py-12">
              <p class="text-black/60 dark:text-white/60">
                No related projects found.
                <a href="/projects" class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline ml-1">
                  View all projects
                </a>
              </p>
            </div>
          </Show>
        </div>
      </div>
    </section>
  );
}