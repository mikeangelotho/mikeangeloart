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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const fadeObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          const { target } = entry;
          target.classList.toggle("translate-y-9", !entry.isIntersecting);
          target.classList.toggle("scrolled", !entry.isIntersecting);
          if (entry.isIntersecting) observer.unobserve(target);
        });
      },
      { threshold: 0.05 },
    );

    fadeObserver.observe(containerRef);

    onCleanup(() => {
      fadeObserver.disconnect();
    });
  });

  return (
    <section class="w-full mx-auto py-8 sm:py-10 px-6">
      <div
        ref={containerRef}
        class={`fade__animate max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch gap-6 ${
          props.reverse ? "lg:flex-row-reverse" : ""
        }`}
      >
        <div class="min-w-0 flex-1 lg:flex-[1.9]">
          <A
            href={`/projects/${props.data.slug}`}
            aria-label={`View ${props.data.title} case study`}
            class="block group relative border dark:border-white/15 bg-black/3 dark:bg-white/3"
          >
            <div class="aspect-4/3 lg:aspect-16/10 overflow-hidden">
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
                    class={`block shrink-0 w-20 h-14 lg:w-24 lg:h-16 overflow-hidden transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 ${
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
            </div>
          </Show>
        </div>

        <div class="min-w-0 flex-1 lg:flex-[0.8] flex gap-3 lg:flex-col justify-center border-t border-black/15 dark:border-white/15 pt-18 lg:pt-0 lg:border-t-0 lg:border-l lg:pl-7">
          <div>
          <div class="flex items-center gap-3 mb-3">
            <A
              href={`/projects?client=${encodeURIComponent(props.data.clientName)}`}
              class="flex items-center gap-3"
            >
              <img
                src={props.data.clientLogo}
                alt={props.data.clientLogoAlt}
                class="w-10 h-10 object-contain brightness-0 dark:brightness-200 saturate-0 contrast-0 "
                loading="lazy"
              />
              <span class="text-sm font-medium text-black/65 dark:text-white/65 hover:underline">
                {props.data.clientName}
              </span>
            </A>
          </div>

          <A href={`/projects/${props.data.slug}`} class="group inline-block">
            <H2 class="group-hover:underline decoration-2 underline-offset-4 mb-3">
              {props.data.title}
            </H2>
          </A>
          {/*
          <Show when={props.data.caseStudy}>
            {(caseStudy) => (
              <div class="mb-4 bg-white/5 border border-white/10 w-fit py-1 px-3">
                <p class="font-normal text-black dark:text-white">
                  {caseStudy().role}
                </p>
              </div>
            )}
          </Show>
          */}
          <p class="type-body max-w-[42ch] text-black dark:text-white mb-4">
            {props.data.caseStudy?.summary || props.data.projectObjective}
          </p>
          </div>
          <div>
          <Show when={props.data.results.length > 0}>
            <div class="mb-4 gap-1 flex flex-col border bg-white/5 border-white/10 py-3 px-3">
              <span class="type-label text-black/65 dark:text-white/65">
                Results
              </span>
              <For each={props.data.results.slice(0, 2)}>
                {(result) => (
                  <p class="leading-5 text-black dark:text-white">
                    ⌖ {result.value}
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
            class="flex min-h-11 w-full lg:w-fit justify-center items-center gap-2 text-sm font-medium px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black hover:gap-3 transition-all duration-50 group/link mt-5"
          >
            Read Case Study
            <span class="font-normal group-hover/link:translate-x-1 transition-transform">
              →
            </span>
          </A>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PreviewProject;
