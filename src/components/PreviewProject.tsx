import { Tag } from "~/layout/Cards";
import { PortfolioCollection } from "~/types";
import { For, onCleanup, onMount } from "solid-js";
import { A } from "@solidjs/router";
import { H2 } from "~/layout/Headings";
import MediaCluster from "./MediaCluster";

export function PreviewProject(props: {
  data: PortfolioCollection;
  reverse?: boolean;
}) {
  let containerRef!: HTMLDivElement;

  onMount(() => {
    const fadeObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          const { target } = entry;
          target.classList.toggle("translate-y-9", !entry.isIntersecting);
          target.classList.toggle("scrolled", !entry.isIntersecting);
          if (entry.isIntersecting) observer.unobserve(target);
        });
      },
      { threshold: 0.15 },
    );

    fadeObserver.observe(containerRef);

    onCleanup(() => {
      fadeObserver.disconnect();
    });
  });

  const additionalMedia = () => {
    const urls: string[] = [];
    const keypoints = props.data.projectKeypoints;
    const featured = props.data.mainKeypointFeatured;

    for (let i = 1; i < Math.min(5, featured.length); i++) {
      const [s1, s2] = featured[i];
      if (keypoints[s1]?.media[s2]) {
        urls.push(keypoints[s1].media[s2].url);
      }
    }
    return urls;
  };

  return (
    <section class="w-full mx-auto py-18 px-6 border-neutral-200 dark:border-neutral-900">
      <div
        ref={containerRef}
        class={`fade__animate max-w-6xl mx-auto flex flex-col lg:flex-row items-stretch gap-6 ${props.reverse ? "lg:flex-row-reverse" : ""
          }`}
      >
        <div class="flex-1 lg:flex-[1.5]">
          <A
            href={`/projects/${props.data.slug}`}
            class="block group relative overflow-hidden rounded-2xl lg:rounded-3xl"
          >
            <div class="aspect-[4/3] lg:aspect-[16/10] overflow-hidden">
              <img
                src={props.data.cover}
                alt={props.data.title}
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </A>
        </div>

        <div class="flex-1 flex flex-col justify-center">
          <div class="flex items-center gap-3 mb-4">
            <A href={`/projects?client=${props.data.clientName}`} class="flex items-center gap-3">
              <img
                src={props.data.clientLogo}
                alt={props.data.clientLogoAlt}
                class="w-10 h-10 object-contain brightness-0 dark:brightness-200 saturate-0 contrast-0 rounded-lg"
                loading="lazy"
              />
              <span class="text-sm font-medium text-neutral-300 dark:text-neutral-700 hover:underline">
                {props.data.clientName}
              </span>
            </A>
          </div>

          <A
            href={`/projects/${props.data.slug}`}
            class="group inline-block"
          >
            <H2 class="group-hover:underline decoration-2 underline-offset-4 mb-4">
              {props.data.title}
            </H2>
          </A>

          <p class="text-black/70 dark:text-white/70 mb-4 text-sm leading-relaxed">
            {props.data.projectObjective}
          </p>

          <div class="mb-6">
            <span class="text-xs font-bold uppercase tracking-widest text-black/30 dark:text-white/30">
              Results
            </span>
            <p class="text-sm font-medium text-black dark:text-white mt-1">
              {props.data.mainKeypointMetricOne}
            </p>
            <p class="text-sm font-medium text-black dark:text-white mt-1">
              {props.data.mainKeypointMetricTwo}
            </p>
          </div>

          <div class="flex flex-wrap gap-2 mb-6">
            <For each={props.data.tags.slice(0, 4)}>
              {(tag) => <Tag href={`/projects?tags=${tag}`}>{tag}</Tag>}
            </For>
          </div>

          {additionalMedia().length > 0 && (
            <div class="flex gap-2 mb-6">
              <For each={additionalMedia()}>
                {(src) => (
                  <A
                    href={`/projects/${props.data.slug}`}
                    class="block w-20 h-14 lg:w-24 lg:h-16 overflow-hidden rounded-lg hover:ring-2 hover:ring-black/20 dark:hover:ring-white/20 transition-all"
                  >
                    <MediaCluster
                      class="w-full h-full object-cover"
                      src={src}
                    />
                  </A>
                )}
              </For>
            </div>
          )}

          <A
            href={`/projects/${props.data.slug}`}
            class="inline-flex w-full lg:w-fit items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:gap-3 transition-all duration-200 group/link"
          >
            View Project
            <span class="group-hover/link:translate-x-1 transition-transform">→</span>
          </A>
        </div>
      </div>
    </section>
  );
}

export default PreviewProject;
