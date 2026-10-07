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
          <div aria-hidden="true" class="-z-1 fixed top-0 left-0 w-full">
                <Show when={project()?.cover}>
              {(coverSrc) => (
                <Picture
                  src={coverSrc()}
                  alt={`${project()?.title} cover image`}
                  width={project()?.coverWidth}
                  height={project()?.coverHeight}
                  class="w-full object-cover scale-120 h-screen blur-xl"
                  loading="eager"
                />
              )}
            </Show>
            <div class="w-full h-screen dark:backdrop-brightness-125 backdrop-saturate-150"></div>
          </div>
          <section class="h-full flex items-center bg-white/25 dark:bg-black/75">
            <article class="flex flex-col items-center w-full px-6">
              <div class="flex flex-col gap-6 items-center w-full py-36 max-w-5xl">
                <div class="flex flex-col def__animate w-fit justify-center">
                  <img
                    src={project()?.clientLogo}
                    class="aspect-auto max-w-24 brightness-0 dark:brightness-200 saturate-0 contrast-0 max-h-12"
                    loading="eager"
                    alt={`${project()?.clientName} logo`}
                  />
                </div>
                <span class="text-center">
                  <H1>{project()?.title as string}</H1>
                </span>
              </div>
            </article>
          </section>
          <section class="bg-white dark:bg-black border-t border-b border-black/10 dark:border-white/10">
            <div class="flex flex-col lg:flex-row gap-3 justify-between items-center px-6 py-9 max-w-7xl mx-auto">
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
                class="flex flex-wrap gap-2 w-full max-w-lg"
              >
                <TagPills tags={project()?.tags} />
              </div>
            </div>
            <div class="w-full max-w-5xl mx-auto px-6 py-12 flex flex-col gap-12">
              <Show when={project()?.caseStudy} keyed>
                {(profile) => <ProjectResponsibilities profile={profile} />}
              </Show>
              <Show
                when={project()?.results.length}
              >
                <section aria-labelledby="results-heading" class="rounded-3xl border border-black/10 dark:border-white/10 bg-neutral-100 dark:bg-neutral-950 p-6 md:p-8">
                  <h2 id="results-heading" class="text-xs font-semibold uppercase tracking-widest text-black/60 dark:text-white/60">
                    Reported project results
                  </h2>
                  <ul class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <For each={project()?.results}>
                      {(result) => (
                        <li class="text-xl md:text-2xl font-semibold text-black dark:text-white">
                          {result.value}
                          <Show when={result.label}><span class="block mt-2 text-sm font-medium">{result.label}</span></Show>
                          <Show when={result.context}><p class="mt-2 text-sm font-normal leading-relaxed text-black/70 dark:text-white/70">{result.context}</p></Show>
                          <Show when={result.source}><p class="mt-2 text-xs font-normal text-black/60 dark:text-white/60">Source: {result.source}</p></Show>
                        </li>
                      )}
                    </For>
                  </ul>
                </section>
              </Show>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <section aria-labelledby="challenge-heading">
                  <h2 id="challenge-heading" class="text-2xl font-semibold text-black dark:text-white">
                    The challenge
                  </h2>
                  <p class="mt-4 leading-relaxed text-black/80 dark:text-white/80">
                    {project()?.projectObjective}
                  </p>
                </section>
                <section aria-labelledby="approach-heading">
                  <h2 id="approach-heading" class="text-2xl font-semibold text-black dark:text-white">
                    My approach
                  </h2>
                  <For each={project()?.introParagraphs}>
                    {(paragraph) => <p class="mt-4 leading-relaxed text-black/80 dark:text-white/80">{paragraph}</p>}
                  </For>
                </section>
              </div>
            </div>
            <Show when={videos().length > 0}>
              <section class="bg-neutral-100 dark:bg-neutral-950 w-full">
                <SectionHeading>Featured Films</SectionHeading>
              </section>
              <section class="px-6">
                <VideoLib videos={videos()} />
              </section>
            </Show>
            <section class="bg-neutral-100 dark:bg-neutral-950 w-full">
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
            <section class="bg-neutral-100 dark:bg-neutral-950 w-full">
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
    <section ref={containerRef} class="flex flex-col gap-6 lg:gap-18 py-18">
      <For each={props.projectKeypoints}>
        {(keypoint) => (
          <div class="w-full flex flex-col lg:flex-row gap-6 justify-between max-w-360 mx-auto">
            <div class="w-full flex items-start justify-center lg:justify-start h-fit lg:sticky lg:top-18">
              <div class="keypoint-box fade__animate max-w-3xl lg:max-w-xl shadow-[0px_9px_18px_0px_rgb(0,0,0,0.1)] dark:shadow-[0px_9px_18px_0px_rgb(0,0,0,0.25)] rounded-3xl p-6 my-18 flex flex-col gap-4 bg-neutral-100 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-900 dark:border-t dark:border-t-white">
                <H2>{keypoint.title}</H2>
                <For each={keypoint.paragraphs}>{(paragraph) => <p class="dark:text-white">{paragraph}</p>}</For>
              </div>
            </div>
            <div class="w-full flex flex-col gap-6 lg:gap-18 items-center xl:items-end">
              <For each={keypoint.media}>
                {(mediaObj) => {
                  const isVideo = mediaObj.type === "video";

                  const open = (url = mediaObj.url) => {
                    props.setLightboxImg(url);
                    props.setLightboxAlt(mediaObj.altText);
                    props.setLightboxType(mediaObj.type);
                  };
                  return (
                    <figure class="keypoint-media w-full lg:max-w-xl xl:max-w-3xl">
                      <Show when={isVideo} fallback={
                        <button type="button" class="block w-full rounded-3xl cursor-zoom-in" aria-label={`Enlarge: ${mediaObj.altText}`} onClick={() => open()}>
                          <Picture src={mediaObj.url} loading="lazy" alt={mediaObj.altText} width={mediaObj.width} height={mediaObj.height} class="border-6 border-neutral-200 dark:border-white/5 w-full h-auto object-contain rounded-3xl max-h-180" />
                        </button>
                      }>
                        <VideoPlayer video={{url:mediaObj.url, type:mediaObj.type, title:mediaObj.caption ?? mediaObj.altText, altText:mediaObj.altText, thumbnail:mediaObj.poster ?? "", client:"", description:mediaObj.caption ?? ""}} class="w-full max-h-180 border-6 border-neutral-200 dark:border-white/5 rounded-3xl" />
                      </Show>
                      <figcaption class="mt-3 px-2 text-sm text-black/70 dark:text-white/70">{mediaObj.caption ?? mediaObj.altText}</figcaption>
                      <Show when={isVideo}>
                        <button type="button" class="mt-2 px-3 py-2 text-sm font-semibold underline underline-offset-4 text-black dark:text-white" onClick={() => open()}>Open video in full view</button>
                      </Show>
                    </figure>
                  );
                }}
              </For>
            </div>
          </div>
        )}
      </For>
    </section>
  );
}
