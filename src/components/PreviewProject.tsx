import { Tag } from "~/layout/Cards";
import { PortfolioCollection } from "~/types";
import { For, Show, createSignal, onCleanup, onMount } from "solid-js";
import { A } from "@solidjs/router";
import { H2 } from "~/layout/Headings";
import MediaCluster from "./MediaCluster";

export function PreviewProject(props: {
  data: PortfolioCollection;
  reverse?: boolean;
}) {
  let containerRef!: HTMLDivElement;

  const [selectedImage, setSelectedImage] = createSignal(props.data.cover);

  const isVideo = (src: string) => src.endsWith(".mp4");

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
    <section class="w-full mx-auto py-18 px-6">
      <div
        ref={containerRef}
        class={`fade__animate max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch gap-6 ${props.reverse ? "lg:flex-row-reverse" : ""
          }`}
      >
        <div class="flex-1 lg:flex-[1.5]">
          <A
            href={`/projects/${props.data.slug}`}
            class="block group relative overflow-hidden rounded-2xl lg:rounded-3xl"
          >
            <div class="aspect-4/3 lg:aspect-16/10 overflow-hidden">
              <Show
                when={isVideo(selectedImage())}
                fallback={
                  <img
                    src={selectedImage()}
                    alt={props.data.title}
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                }
              >
                <video
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  autoplay
                  muted
                  loop
                  playsinline
                  src={selectedImage()}
                />
              </Show>
            </div>
            <div class="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </A>

          {additionalMedia().length > 0 && (
            <div class="flex gap-2 mt-3">
              <For each={additionalMedia()}>
                {(src, index) => (
                  <button
                    onClick={() => setSelectedImage(src)}
                    class={`block w-20 h-14 lg:w-24 lg:h-16 overflow-hidden rounded-lg transition-all cursor-pointer ${selectedImage() === src
                      ? "ring-2 ring-black dark:ring-white"
                      : "hover:ring-2 hover:ring-black/20 dark:hover:ring-white/20"
                      }`}
                  >
                    <MediaCluster
                      class="w-full h-full object-cover"
                      src={src}
                    />
                  </button>
                )}
              </For>
              <A
                href={`/projects/${props.data.slug}`}
                class="flex flex-col lg:flex-row items-center lg:gap-2 justify-center w-20 h-14 lg:w-24 lg:h-16 overflow-hidden rounded-lg bg-black dark:bg-white text-white dark:text-black text-xs font-bold hover:lg:gap-3 transition-all duration-150 ease-in-out"
              >
                View More <span>⋯</span>
              </A>
            </div>
          )}
        </div>

        <div class="flex-1 flex flex-col justify-center border border-neutral-300 dark:border-neutral-900 rounded-3xl p-6 bg-neutral-100 dark:bg-neutral-950">
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

          <p class="text-black dark:text-white mb-4">
            {props.data.projectObjective}
          </p>

          <div class="mb-6">
            <span class="text-xs font-bold uppercase tracking-widest text-black/30 dark:text-white/30 border-b border-black/10 dark:border-white/10 w-fit pb-1">
              Results
            </span>
            <p class="text-sm tracking-wider text-black dark:text-white mt-3">
              ⌖ {props.data.mainKeypointMetricOne}
            </p>
            <p class="text-sm tracking-wider text-black dark:text-white mt-1">
              ⌖ {props.data.mainKeypointMetricTwo}
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <For each={props.data.tags.slice(0, 4)}>
              {(tag) => <Tag href={`/projects?tags=${tag}`}>{tag}</Tag>}
            </For>
          </div>

          <A
            href={`/projects/${props.data.slug}`}
            class="flex w-full lg:w-fit justify-center items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:gap-3 transition-all duration-50 group/link mt-6"
          >
            View Project
            <span class="font-normal group-hover/link:translate-x-1 transition-transform">→</span>
          </A>
        </div>
      </div>
    </section>
  );
}

export default PreviewProject;
