import { createAsync, useNavigate, useParams, query } from "@solidjs/router";
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
import { Lightbox } from "~/components/Lightbox";
import SEO from "~/components/SEO";
import { RelatedProjects } from "~/components/RelatedProjects";
import { Breadcrumbs } from "~/components/Breadcrumbs";
import { Picture } from "~/components/Picture";
import { PortfolioCollection } from "~/types";
import TagPills from "~/components/TagPills";

const fetchPortfolio = query(async (): Promise<PortfolioCollection[]> => {
  "use server";
  const res = await fetch("https://cdn.mikeangelo.art/db.json");
  return await res.json() as PortfolioCollection[];
}, "portfolio");

export default function ProjectPage() {
  const params = useParams();
  const navigate = useNavigate();

  const portfolioCollection = createAsync(() => fetchPortfolio());

  const project = createMemo(() => {
    const collection = portfolioCollection();
    if (collection) {
      for (const p of collection) {
        if (p.slug === params.slug) {
          return p;
        }
      }
    }
    return undefined;
  });

  const [lightboxImg, setLightboxImg] = createSignal<string>();
  const [lightboxAlt, setLightboxAlt] = createSignal<string>();
  const [activeTab, setActiveTab] = createSignal<'objective' | 'strategy'>('objective');

  createEffect(() => {
    const collection = portfolioCollection();
    if (collection && !project()) {
      navigate("/projects", { replace: true });
    }
  });

  createEffect(() => {
    document.body.classList.toggle(
      "overflow-hidden",
      lightboxImg() ? true : false,
    );
  });

  return (
    <>
      <Show when={project()} keyed>
        {(p) => (
          <SEO
            title={`${p.title} | Creative Technologist Portfolio Project by Mike Angelo | Creative Design, Advertising Campaigns, and Web Design and Development`}
            description={`${p.projectObjective?.substring(0, 160)}... Explore this ${p.tags?.join(", ")} project by Mike Angelo, a Creative Technologist in New Jersey and New York.`}
            canonical={`https://mikeangeloart.com/projects/${p.slug}`}
            ogImage={p.cover}
            ogType="article"
            breadcrumbs={[
              { name: "Home", url: "https://mikeangeloart.com" },
              { name: "Projects", url: "https://mikeangeloart.com/projects" },
              {
                name: p.title,
                url: `https://mikeangeloart.com/projects/${p.slug}`,
              },
            ]}
            localBusiness={true}
            jsonLd={{
              "@context": "https://schema.org",
              "@type": "CreativeWork",
              name: p.title,
              description: p.projectObjective,
              image: p.cover,
              url: `https://mikeangeloart.com/projects/${p.slug}`,
              creator: {
                "@type": "Person",
                name: "Mike Angelo",
                jobTitle: "Creative Technologist",
              },
              client: {
                "@type": "Organization",
                name: p.clientName,
              },
              keywords: p.tags?.join(", "),
              about: p.tags,
              dateCreated: p.dateAdded,
              dateModified: p.lastModified,
              genre: "Portfolio",
              learningResourceType: "Portfolio Project",
            }}
          />
        )}
      </Show>
      <main class="w-full">
        <Show when={project()} fallback={<div class="h-screen flex items-center justify-center">Loading...</div>}>
            <Show when={lightboxImg()}>
              <Lightbox
                src={{ get: lightboxImg, set: setLightboxImg }}
                altText={lightboxAlt}
              />
            </Show>
          <div class="-z-1 fixed top-0 left-0 w-full">
            <Show when={project()?.cover}>
              {(coverSrc) => (
                <Picture
                  src={coverSrc()}
                  alt={`${project()?.title} cover image`}
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
                      url: `/projects?client=${project()?.clientName}`,
                    },
                    {
                      name: project()?.title || "",
                      url: `/projects/${project()?.slug}`,
                    },
                  ]}
                />
              </div>
              <div
                class="hidden md:flex gap-1 w-full max-w-lg overflow-auto scroll-smooth" data-lenis-prevent
                style="scrollbar-width: none;"
              >
                <TagPills tags={project()?.tags} />
              </div>
            </div>
            <div class="w-full flex flex-col gap-18 items-center justify-center max-w-7xl mx-auto px-6">
              <div class="w-full max-w-4xl mx-auto">
                <div class="flex border-b border-black/10 dark:border-white/10 mb-6">
                  <button
                    class={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all relative ${activeTab() === 'objective'
                      ? "text-black dark:text-white"
                      : "text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60"
                      }`}
                    onClick={() => setActiveTab('objective')}
                  >
                    Objective
                    {activeTab() === 'objective' && (
                      <span class="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white" />
                    )}
                  </button>
                  <button
                    class={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all relative ${activeTab() === 'strategy'
                      ? "text-black dark:text-white"
                      : "text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60"
                      }`}
                    onClick={() => setActiveTab('strategy')}
                  >
                    Strategy
                    {activeTab() === 'strategy' && (
                      <span class="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white" />
                    )}
                  </button>
                </div>

                <div class="min-h-30">
                  <Show when={activeTab() === 'objective'}>
                    <div class="animate-in">
                      <p class="text-black dark:text-white">
                        {project()?.projectObjective}
                      </p>
                    </div>
                  </Show>
                  <Show when={activeTab() === 'strategy'}>
                    <div class="animate-in">
                      <p class="text-black dark:text-white">
                        {project()?.mainKeypointDescription}
                      </p>
                    </div>
                  </Show>
                </div>
              </div>
            </div>
            <section class="bg-neutral-100 dark:bg-neutral-950 w-full mt-16">
              <SectionHeading>Project Key Points</SectionHeading>
            </section>
            <section class="px-6">
              <KeypointSection
                projectKeypoints={project()?.projectKeypoints}
                setLightboxImg={setLightboxImg}
                setLightboxAlt={setLightboxAlt}
              />
            </section>
            <Show when={project()?.projectVideos && project()!.projectVideos.length > 0}>
              <section class="bg-neutral-100 dark:bg-neutral-950 w-full">
                <SectionHeading>Video Gallery</SectionHeading>
              </section>
              <section class="px-6">
                <VideoLib videos={project()!.projectVideos} />
              </section>
            </Show>
            <section class="bg-neutral-100 dark:bg-neutral-950 w-full">
              <SectionHeading>Related Projects</SectionHeading>
            </section>
            <RelatedProjects
              currentProject={project()!}
              allProjects={portfolioCollection() || []}
              maxItems={3}
            />
          </section>
        </Show>
      </main>
    </>
  );
}

function KeypointSection(props: {
  projectKeypoints?: Array<{
    title: string;
    description: string;
    media: Array<{ url: string; altText: string }>;
  }>;
  setLightboxImg: (url: string) => void;
  setLightboxAlt: (alt: string) => void;
}) {
  let containerRef: HTMLDivElement | undefined;

  onMount(() => {
    if (!containerRef) return;

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            target.classList.remove("scrolled", "translate-y-9");
            observer.unobserve(target);
          } else {
            target.classList.add("scrolled", "translate-y-9");
          }
        });
      },
      observerOptions,
    );

    const keypointBoxes = containerRef.querySelectorAll('.keypoint-box');
    keypointBoxes.forEach(box => observer.observe(box));

    const mediaElements = containerRef.querySelectorAll('.keypoint-media');
    mediaElements.forEach(media => observer.observe(media));

    onCleanup(() => observer.disconnect());
  });

  return (
    <section
      ref={containerRef}
      class="flex flex-col gap-6 lg:gap-18 py-18"
    >
      <For each={props.projectKeypoints}>
        {(keypoint, idx) => (
          <div class="w-full flex flex-col lg:flex-row gap-6 justify-between max-w-360 mx-auto">
            <div class="w-full flex items-start justify-center lg:justify-start">
              <div
                class="keypoint-box fade__animate max-w-3xl lg:max-w-xl shadow-[0px_9px_18px_0px_rgb(0,0,0,0.1)] dark:shadow-[0px_9px_18px_0px_rgb(0,0,0,0.25)] rounded-3xl p-6 my-18 flex flex-col gap-4 bg-neutral-100 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-900 dark:border-t dark:border-t-white"
              >
                <H2>{keypoint.title}</H2>
                <p class="dark:text-white">{keypoint.description}</p>
              </div>
            </div>
            <div class="w-full flex flex-col gap-6 lg:gap-18 items-center xl:items-end">
              <For each={keypoint.media}>
                {(mediaObj) => {
                  const isVideo = mediaObj.url.includes("mp4");

                  if (isVideo) {
                    return (
                      <video
                        src={mediaObj.url}
                        autoplay
                        muted
                        loop
                        playsinline
                        webkit-playsinline="true"
                        preload="metadata"
                        class="keypoint-media lg:max-w-xl xl:max-w-3xl max-h-180 border-6 border-neutral-200 dark:border-white/5 rounded-3xl aspect-auto cursor-pointer hover:-translate-y-3 transition-all duration-500 ease-in-out"
                        title={mediaObj.altText}
                        aria-label={mediaObj.altText}
                        onClick={() => {
                          props.setLightboxImg(mediaObj.url);
                          props.setLightboxAlt(mediaObj.altText);
                        }}
                      />
                    );
                  } else {
                    return (
                      <Picture
                        src={mediaObj.url}
                        loading="lazy"
                        alt={mediaObj.altText}
                        class="keypoint-media border-6 border-neutral-200 dark:border-white/5 w-full h-auto aspect-auto rounded-3xl lg:max-w-3xl max-h-180 hover:brightness-105 hover:-translate-y-3 cursor-pointer transition-all duration-500 ease-in-out"
                        onClick={(_, displayedUrl) => {
                          props.setLightboxImg(displayedUrl);
                          props.setLightboxAlt(mediaObj.altText);
                        }}
                      />
                    );
                  }
                }}
              </For>
            </div>
          </div>
        )}
      </For>
    </section>
  );
}
