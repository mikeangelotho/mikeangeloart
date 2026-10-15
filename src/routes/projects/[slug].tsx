import { createAsync, useParams } from "@solidjs/router";
import {
  createEffect,
  createMemo,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import { H1, H2, SectionHeading } from "~/layout/Headings";
import VideoLib from "~/components/VideoLib";
import VideoPlayer from "~/components/VideoPlayer";
import { Lightbox } from "~/components/Lightbox";
import SEO from "~/components/SEO";
import { RelatedProjects } from "~/components/RelatedProjects";
import { Breadcrumbs } from "~/components/Breadcrumbs";
import { Picture } from "~/components/Picture";
import TagPills from "~/components/TagPills";
import ProjectResponsibilities from "~/components/ProjectResponsibilities";
import { fetchProject } from "~/utils/portfolio";
import { getProjectVideos } from "~/utils/media";
import PageNotFound from "~/components/PageNotFound";
import type { PortfolioKeypoint } from "~/types";

export default function ProjectPage() {
  const params = useParams();

  const projectContent = createAsync(() => fetchProject(params.slug ?? ""), { deferStream: true });
  const project = () => projectContent()?.project;

  const [lightboxImg, setLightboxImg] = createSignal<string>();
  const [lightboxAlt, setLightboxAlt] = createSignal<string>();
  const [lightboxType, setLightboxType] = createSignal<"image" | "video">();

  const videos = createMemo(() => project() ? getProjectVideos(project()!) : []);
  createEffect(() => {
    params.slug;
    setLightboxImg(undefined);
    setLightboxAlt(undefined);
    setLightboxType(undefined);
  });

  return (
    <>
      <Show when={project()} keyed>
        {(p) => (
          <SEO
            title={`${p.title} | Mike Angelo — Art Director & Multidisciplinary Designer`}
            description={`${p.caseStudy?.summary || p.projectObjective} Explore the project, Mike Angelo's contribution and the reported results.`}
            canonical={`https://mikeangelo.art/projects/${p.slug}`}
            ogImage={p.cover}
            ogType="article"
            breadcrumbs={[
              { name: "Home", url: "https://mikeangelo.art" },
              { name: "Projects", url: "https://mikeangelo.art/projects" },
              {
                name: p.title,
                url: `https://mikeangelo.art/projects/${p.slug}`,
              },
            ]}
            localBusiness={true}
            jsonLd={{
              "@context": "https://schema.org",
              "@type": "CreativeWork",
              name: p.title,
              description: p.projectObjective,
              image: p.cover,
              url: `https://mikeangelo.art/projects/${p.slug}`,
              creator: {
                "@type": "Person",
                name: "Mike Angelo",
                jobTitle: "Art Director & Multidisciplinary Designer",
              },
              about: {
                "@type": "Organization",
                name: p.clientName,
              },
              keywords: p.tags?.join(", "),
              datePublished: p.dateAdded,
              dateModified: p.lastModified,
              genre: "Portfolio",
            }}
          />
        )}
      </Show>
      <div class="w-full">
        <Show
          when={project()}
          fallback={
            <Show when={projectContent()} fallback={<div class="h-screen flex items-center justify-center" role="status">Loading…</div>}>
              <PageNotFound />
            </Show>
          }
        >
          <main class="w-full">
          <Show when={lightboxImg()}>
            <Lightbox
              src={{ get: lightboxImg, set: setLightboxImg }}
              altText={lightboxAlt}
              mediaType={lightboxType}
            />
          </Show>
          <section class="bg-white dark:bg-black px-6 pt-28 pb-8 md:pb-12">
            <article class="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-10 w-full max-w-7xl mx-auto">
              <header class="flex flex-col items-start gap-5 max-w-lg">
                <div class="def__animate w-fit">
                  <img
                    src={project()?.clientLogo}
                    class="aspect-auto max-w-20 brightness-0 dark:brightness-200 saturate-0 contrast-0 max-h-10"
                    loading="eager"
                    alt={`${project()?.clientName} logo`}
                  />
                </div>
                <H1>{project()?.title as string}</H1>
              </header>
              <button
                type="button"
                class="block w-full overflow-hidden bg-black/3 dark:bg-white/3 cursor-zoom-in"
                aria-label={`Enlarge: ${project()?.coverAlt || project()?.title}`}
                onClick={() => {
                  setLightboxImg(project()?.cover);
                  setLightboxAlt(project()?.coverAlt || project()?.title);
                  setLightboxType("image");
                }}
              >
                <Picture
                  src={project()?.cover as string}
                  alt={project()?.coverAlt || `${project()?.title} cover image`}
                  width={project()?.coverWidth}
                  height={project()?.coverHeight}
                  class="w-full h-auto object-cover max-h-[50svh]"
                  loading="eager"
                />
              </button>
            </article>
          </section>
          <section class="bg-white dark:bg-black border-t border-b border-black/10 dark:border-white/10">
            <div class="flex flex-col lg:flex-row gap-3 justify-between items-start lg:items-center px-6 py-5 max-w-7xl mx-auto">
              <div class="w-fit">
                <Breadcrumbs
                  items={[
                    {
                      name: project()?.clientName as string,
                      url: `/projects?client=${encodeURIComponent(project()?.clientName || "")}`,
                    },
                    {
                      name: project()?.title || "",
                      url: `/projects/${project()?.slug}`,
                    },
                  ]}
                />
              </div>
              <div
                class="flex flex-wrap justify-end gap-2 w-full max-w-3xl"
              >
                <TagPills tags={project()?.tags} />
              </div>
            </div>
            
            <Show when={videos().length > 0}>
              <section class="bg-black/3 dark:bg-white/3 w-full">
                <SectionHeading>Featured Films</SectionHeading>
              </section>
              <section class="px-6">
                <VideoLib videos={videos()} />
              </section>
            </Show>
            <section class="bg-black/3 dark:bg-white/3 w-full">
              <SectionHeading>Design & Delivery</SectionHeading>
            </section>
            <section class="px-6">
              <KeypointSection
                projectKeypoints={project()?.projectKeypoints}
                setLightboxImg={setLightboxImg}
                setLightboxAlt={setLightboxAlt}
                setLightboxType={setLightboxType}
              />
            </section>
            <div class="w-full max-w-7xl mx-auto px-6 py-8 md:py-10 flex gap-9">
              <Show when={project()?.caseStudy} keyed>
                {(profile) => <ProjectResponsibilities profile={profile} />}
              </Show>
                <section aria-labelledby="challenge-heading" class="w-full">
                  <h2 id="challenge-heading" class="type-heading font-bold text-black dark:text-white">
                    The challenge
                  </h2>
                  <p class="type-body mt-3 max-w-prose text-black/80 dark:text-white/80">
                    {project()?.projectObjective}
                  </p>
                </section>
                <section aria-labelledby="approach-heading" class="w-full">
                  <h2 id="approach-heading" class="type-heading font-bold text-black dark:text-white">
                    My approach
                  </h2>
                  <For each={project()?.introParagraphs}>
                    {(paragraph) => <p class="type-body mt-3 max-w-prose text-black/80 dark:text-white/80">{paragraph}</p>}
                  </For>
                </section>
            </div>
            <Show when={project()?.results.length}>
              <div class="w-full max-w-7xl mx-auto px-6 pb-8 md:pb-12">
                <section aria-labelledby="results-heading" class="border border-black/10 dark:border-white/10 bg-black/3 dark:bg-white/3 p-5 md:p-6">
                  <h2 id="results-heading" class="type-section-label text-black/60 dark:text-white/60">
                    Project results
                  </h2>
                  <ul class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
                    <For each={project()?.results}>
                      {(result) => (
                        <li class="text-black dark:text-white">
                          <span class="type-heading font-bold">{result.value}</span>
                          <Show when={result.context}><p class="mt-2 text-sm font-normal leading-relaxed text-black/70 dark:text-white/70">{result.context}</p></Show>
                          <Show when={result.source}><p class="mt-2 text-xs font-normal text-black/60 dark:text-white/60">Source: {result.source}</p></Show>
                        </li>
                      )}
                    </For>
                  </ul>
                </section>
              </div>
            </Show>
            <section class="bg-black/3 dark:bg-white/3 w-full">
              <SectionHeading>Related Projects</SectionHeading>
            </section>
            <RelatedProjects
              currentProject={project()!}
              allProjects={projectContent()?.related || []}
              maxItems={3}
            />
          </section>
          </main>
        </Show>
      </div>
    </>
  );
}

function KeypointSection(props: {
  projectKeypoints?: PortfolioKeypoint[];
  setLightboxImg: (url: string) => void;
  setLightboxAlt: (alt: string) => void;
  setLightboxType: (type: "image" | "video") => void;
}) {
  let containerRef: HTMLDivElement | undefined;

  onMount(() => {
    if (!containerRef || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        const target = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          target.classList.remove("scrolled", "translate-y-9");
          observer.unobserve(target);
        } else {
          target.classList.add("scrolled", "translate-y-9");
        }
      });
    }, observerOptions);

    const keypointBoxes = containerRef.querySelectorAll(".keypoint-box");
    keypointBoxes.forEach((box) => observer.observe(box));

    const mediaElements = containerRef.querySelectorAll(".keypoint-media");
    mediaElements.forEach((media) => observer.observe(media));

    onCleanup(() => observer.disconnect());
  });

  return (
    <section ref={containerRef} class="flex flex-col gap-12 lg:gap-16 py-8 md:py-12 max-w-7xl mx-auto">
      <For each={props.projectKeypoints}>
        {(keypoint) => (
          <div class={`w-full grid gap-5 lg:gap-10 items-start ${keypoint.media.length ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]" : "max-w-prose"}`}>
            <div class="w-full min-w-0 h-fit lg:sticky lg:top-24">
              <div class="keypoint-box fade__animate flex flex-col gap-3 max-w-prose">
                <H2 compact>{keypoint.title}</H2>
                <For each={keypoint.paragraphs}>{(paragraph) => <p class="type-body text-black/80 dark:text-white/80">{paragraph}</p>}</For>
              </div>
            </div>
            <Show when={keypoint.media.length}>
            <div class="w-full min-w-0 flex flex-col gap-6 md:gap-8">
              <For each={keypoint.media}>
                {(mediaObj) => {
                  const isVideo = mediaObj.type === "video";

                  const open = (url = mediaObj.url) => {
                    props.setLightboxImg(url);
                    props.setLightboxAlt(mediaObj.altText);
                    props.setLightboxType(mediaObj.type);
                  };
                  return (
                    <figure class="keypoint-media w-full">
                      <Show when={isVideo} fallback={
                        <button type="button" class="block w-full cursor-zoom-in" aria-label={`Enlarge: ${mediaObj.altText}`} onClick={() => open()}>
                          <Picture src={mediaObj.url} loading="lazy" alt={mediaObj.altText} width={mediaObj.width} height={mediaObj.height} class="w-full h-auto object-contain max-h-180" />
                        </button>
                      }>
                        <VideoPlayer video={{url:mediaObj.url, type:mediaObj.type, title:mediaObj.caption ?? mediaObj.altText, altText:mediaObj.altText, thumbnail:mediaObj.poster ?? "", client:"", description:mediaObj.caption ?? ""}} class="w-full max-h-180 " />
                      </Show>
                      <figcaption class="mt-3 px-2 text-sm text-black/70 dark:text-white/70">{mediaObj.caption ?? mediaObj.altText}</figcaption>
                      <Show when={isVideo}>
                        <button type="button" class="mt-2 inline-flex min-h-11 items-center px-3 py-2 text-sm font-normal underline underline-offset-4 text-black dark:text-white" onClick={() => open()}>Open video in full view</button>
                      </Show>
                    </figure>
                  );
                }}
              </For>
            </div>
            </Show>
          </div>
        )}
      </For>
    </section>
  );
}
