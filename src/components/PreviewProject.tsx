import { Tag } from "~/layout/Cards";
import { PortfolioCollection } from "~/types";
import {
  For,
  Show,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import { A } from "@solidjs/router";
import { H2 } from "~/layout/Headings";
import MediaCluster from "./MediaCluster";
import { getFeaturedProjectMedia } from "~/utils/media";
import { disciplineTags } from "~/utils/portfolio-filters";

export function PreviewProject(props: {
  data: PortfolioCollection;
  reverse?: boolean;
}) {
  let containerRef!: HTMLDivElement;

  const mediaOptions = createMemo(() => {
    const candidates = [
      ...getFeaturedProjectMedia(props.data),
      {
        url: props.data.cover,
        altText: props.data.coverAlt || props.data.title,
        type: "image" as const,
        width: props.data.coverWidth,
        height: props.data.coverHeight,
      },
    ];
    const seen = new Set<string>();
    return candidates
      .filter((media) => {
        if (!media.url || seen.has(media.url)) return false;
        seen.add(media.url);
        return true;
      })
      .slice(0, 5);
  });
  const [selectedImage, setSelectedImage] = createSignal(
    mediaOptions()[0]?.url || props.data.cover,
  );
  const selectedAlt = () =>
    mediaOptions().find((media) => media.url === selectedImage())?.altText ||
    props.data.title;
  const selectedMedia = () =>
    mediaOptions().find((media) => media.url === selectedImage());

  createEffect(() =>
    setSelectedImage(mediaOptions()[0]?.url || props.data.cover),
  );

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

  return (
    <section class="w-full mx-auto py-18 px-6">
      <div
        ref={containerRef}
        class={`fade__animate max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch gap-6 ${
          props.reverse ? "lg:flex-row-reverse" : ""
        }`}
      >
        <div class="flex-1 lg:flex-[1.5]">
          <A
            href={`/projects/${props.data.slug}`}
            aria-label={`View ${props.data.title} case study`}
            class="block group relative overflow-hidden rounded-2xl lg:rounded-3xl bg-neutral-100 dark:bg-neutral-950"
          >
            <div class="aspect-4/3 lg:aspect-5/4 overflow-hidden">
              <MediaCluster
                class="w-full h-full object-cover"
                src={selectedImage()}
                alt={selectedAlt()}
                mediaType={selectedMedia()?.type}
                width={selectedMedia()?.width}
                height={selectedMedia()?.height}
              />
            </div>
            <div class="absolute inset-0 bg-linear-to-t from-white/60 dark:from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </A>

          <Show when={mediaOptions().length > 1}>
            <div
              class="flex gap-2 mt-3 overflow-x-auto p-1"
              data-lenis-prevent-horizontal
            >
              <For each={mediaOptions()}>
                {(media, index) => (
                  <button
                    type="button"
                    aria-label={`Show preview ${index() + 1} for ${props.data.title}`}
                    aria-pressed={selectedImage() === media.url}
                    onClick={() => setSelectedImage(media.url)}
                    class={`block shrink-0 w-20 h-14 lg:w-24 lg:h-16 overflow-hidden rounded-lg transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 ${
                      selectedImage() === media.url
                        ? "ring-1 ring-black dark:ring-white"
                        : "hover:ring-1 hover:ring-black/20 dark:hover:ring-white/20 opacity-25 hover:opacity-100"
                    }`}
                  >
                    <MediaCluster
                      class="w-full h-full object-cover"
                      src={media.url}
                      mediaType={media.type}
                      alt={media.altText}
                    />
                  </button>
                )}
              </For>
              {/*<A
                href={`/projects/${props.data.slug}`}
                class="flex shrink-0 flex-col lg:flex-row items-center lg:gap-2 justify-center w-20 h-14 lg:w-24 lg:h-16 overflow-hidden rounded-lg bg-black dark:bg-white text-white dark:text-black text-xs font-bold hover:lg:gap-3 transition-all duration-150 ease-in-out"
              >
                View More <span>⋯</span>
              </A>*/}
            </div>
          </Show>
        </div>

        <div class="flex-1 flex flex-col justify-center border border-neutral-300 dark:border-neutral-900 rounded-3xl p-6 bg-neutral-100 dark:bg-neutral-950">
          <div class="flex items-center gap-3 mb-4">
            <A
              href={`/projects?client=${encodeURIComponent(props.data.clientName)}`}
              class="flex items-center gap-3"
            >
              <img
                src={props.data.clientLogo}
                alt={props.data.clientLogoAlt}
                class="w-10 h-10 object-contain brightness-0 dark:brightness-200 saturate-0 contrast-0 rounded-lg"
                loading="lazy"
              />
              <span class="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:underline">
                {props.data.clientName}
              </span>
            </A>
          </div>

          <A href={`/projects/${props.data.slug}`} class="group inline-block">
            <H2 class="group-hover:underline decoration-2 underline-offset-4 mb-4">
              {props.data.title}
            </H2>
          </A>

          <Show when={props.data.caseStudy}>
            {(caseStudy) => (
              <div class="mb-4">
                <span class="block text-xs uppercase tracking-widest text-neutral-600 dark:text-neutral-400 mb-1">
                  My role
                </span>
                <p class="text-sm font-semibold text-black dark:text-white">
                  {caseStudy().role}
                </p>
              </div>
            )}
          </Show>

          <p class="text-black dark:text-white mb-4">
            {props.data.caseStudy?.summary || props.data.projectObjective}
          </p>

          <Show when={props.data.results.length > 0}>
            <div class="mb-6">
              <span class="text-xs font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-400 border-b border-black/10 dark:border-white/10 w-fit pb-1">
                Reported results
              </span>
              <For each={props.data.results.slice(0, 2)}>
                {(result) => (
                  <p class="text-sm tracking-wider text-black dark:text-white mt-3">
                    ⌖ {result.value}
                    <Show when={result.label}>
                      <span class="block text-xs tracking-normal text-black/60 dark:text-white/60">
                        {result.label}
                      </span>
                    </Show>
                  </p>
                )}
              </For>
            </div>
          </Show>

          <div class="flex flex-wrap gap-2">
            <For each={disciplineTags(props.data.tags).slice(0, 3)}>
              {(tag) => (
                <Tag href={`/projects?tags=${encodeURIComponent(tag)}`}>
                  {tag}
                </Tag>
              )}
            </For>
          </div>

          <A
            href={`/projects/${props.data.slug}`}
            class="flex w-full lg:w-fit justify-center items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:gap-3 transition-all duration-50 group/link mt-6"
          >
            Read Case Study
            <span class="font-normal group-hover/link:translate-x-1 transition-transform">
              →
            </span>
          </A>
        </div>
      </div>
    </section>
  );
}

export default PreviewProject;
