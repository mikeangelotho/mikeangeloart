import { createAsync, useNavigate, useParams } from "@solidjs/router";
import {
  createEffect,
  createMemo,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import { ContainerLabel, Tag } from "~/layout/Cards";
import { H1, H2 } from "~/layout/Headings";
import VideoLib from "~/components/VideoLib";
import { Lightbox } from "~/components/Lightbox";
import SEO from "~/components/SEO";
import { RelatedProjects } from "~/components/RelatedProjects";
import { Breadcrumbs } from "~/components/Breadcrumbs";
import { Picture } from "~/components/Picture";
import { Media, PortfolioCollection } from "~/types";
import VideoPlayer from "~/components/VideoPlayer";

export default function ProjectPage() {
  const params = useParams();
  const navigate = useNavigate();

  const portfolioCollection = createAsync(async () => {
    const res = await fetch("https://cdn.mikeangelo.art/db.json");
    return (await res.json()) as PortfolioCollection[];
  });

  const project = createMemo(() => {
    const collection = portfolioCollection();
    if (collection) {
      for (const project of collection) {
        if (project.slug === params.slug) {
          return project;
        }
      }
    }
  });

  const [lightboxImg, setLightboxImg] = createSignal<string>();
  const [lightboxAlt, setLightboxAlt] = createSignal<string>();

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  };

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
      <Show when={project()} fallback={<div>Loading</div>} keyed>
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
                jobTitle: "Art Director & Web Designer",
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
        <Show when={project()} fallback={<div>Loading</div>} keyed>
          <Show when={lightboxImg()}>
            <Lightbox
              src={{ get: lightboxImg, set: setLightboxImg }}
              altText={lightboxAlt}
            />
          </Show>
          <Show when={project()?.cover} keyed>
            {(p) => (
              <Picture
                src={p}
                alt={`${project()?.title} cover image`}
                class="-z-1 w-full object-cover scale-120 h-full fixed top-0 blur-xl"
                loading="eager"
              />
            )}
          </Show>
          <div class="-z-1 w-full fixed h-screen dark:backdrop-brightness-125 backdrop-saturate-150"></div>
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
          <section class="bg-white dark:bg-black border-t border-b border-black/10 dark:border-white/10 px-6">
            {/* Breadcrumb Navigation */}
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
                class="hidden md:flex gap-1 w-full max-w-lg overflow-auto scroll-smooth"
                style="scrollbar-width: none;"
              >
                <For each={project()?.tags}>
                  {(tag) => (
                    <Tag href={`/projects?tags=${tag.replace(" ", "+")}`}>
                      {tag}
                    </Tag>
                  )}
                </For>
              </div>
            </div>
            <div class="w-full flex flex-col gap-18 items-center justify-center max-w-7xl mx-auto">
              <div class="text-black dark:text-white w-fit shadow-[0px_9px_18px_0px_rgb(0,0,0,0.1)] dark:shadow-[0px_9px_18px_0px_rgb(0,0,0,0.25)] rounded-3xl p-6 items-center flex gap-6 flex-col-reverse lg:flex-row bg-neutral-100 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-900 dark:border-t dark:border-t-white mx-auto">
                <div class="max-w-3xl flex flex-col gap-3 justify-center">
                  <div class="text-black/20 w-fit dark:text-white/20 h-fit border-b border-b-black/10 dark:border-b-white/10 pb-1">
                    <ContainerLabel>Objective</ContainerLabel>
                  </div>
                  <p class="text-left text-black dark:text-white">
                    {project()?.projectObjective}
                  </p>
                </div>
              </div>
              <VideoPlayer video={project()?.mainKeypointMedia as Media} />
              <article class="text-black dark:text-white w-fit shadow-[0px_9px_18px_0px_rgb(0,0,0,0.1)] dark:shadow-[0px_9px_18px_0px_rgb(0,0,0,0.25)] rounded-3xl p-6 items-center flex gap-6 flex-col-reverse lg:flex-row bg-neutral-100 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-900 dark:border-t dark:border-t-white">
                <div class="max-w-3xl flex flex-col gap-3 justify-center">
                  <div class="text-black/20 w-fit dark:text-white/20 h-fit border-b border-b-black/10 dark:border-b-white/10 pb-1 ">
                    <ContainerLabel>Strategy</ContainerLabel>
                  </div>
                  <p class="text-left text-black dark:text-white">
                    {project()?.mainKeypointDescription}
                  </p>
                </div>
              </article>
            </div>
            <section class="flex flex-col gap-6 lg:gap-18 mt-18 border-t border-black/10 dark:border-white/10 py-18 lg:py-36">
              <For each={project()?.projectKeypoints}>
                {(keypoint) => {
                  let boxRef!: HTMLDivElement;

                  onMount(() => {
                    const opacityObserver = new IntersectionObserver(
                      (entries, observer) => {
                        entries.forEach((entry) => {
                          const target = entry.target as HTMLElement;
                          target.classList.add("translate-y-9");
                          if (entry.isIntersecting) {
                            target.classList.remove("scrolled");
                            target.classList.remove("translate-y-9");
                            observer.unobserve(target);
                          } else {
                            target.classList.add("scrolled");
                            target.classList.add("translate-y-9");
                          }
                        });
                      },
                      observerOptions,
                    );

                    opacityObserver.observe(boxRef);
                    onCleanup(() => {
                      opacityObserver.disconnect();
                    });
                  });
                  return (
                    <div class="w-full flex flex-col lg:flex-row gap-6 justify-between max-w-360 mx-auto">
                      <div class="w-full flex items-start justify-center lg:justify-start">
                        <div
                          ref={boxRef}
                          class="fade__animate max-w-3xl lg:max-w-xl shadow-[0px_9px_18px_0px_rgb(0,0,0,0.1)] dark:shadow-[0px_9px_18px_0px_rgb(0,0,0,0.25)] rounded-3xl p-6 flex flex-col gap-4 bg-neutral-100 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-900 dark:border-t dark:border-t-white"
                        >
                          <H2>{keypoint.title}</H2>
                          <p class="dark:text-white">{keypoint.description}</p>
                        </div>
                      </div>
                      <div class="w-full flex flex-col gap-6 lg:gap-18 items-center xl:items-end">
                        <For each={keypoint.media}>
                          {(mediaObj) => {
                            let keypointMedia!: HTMLElement;

                            onMount(() => {
                              const opacityObserver = new IntersectionObserver(
                                (entries, observer) => {
                                  entries.forEach((entry) => {
                                    const target = entry.target as HTMLElement;
                                    target.classList.add("translate-y-9");
                                    if (entry.isIntersecting) {
                                      target.classList.remove("scrolled");
                                      target.classList.remove("translate-y-9");
                                      observer.unobserve(target);
                                    } else {
                                      target.classList.add("scrolled");
                                      target.classList.add("translate-y-9");
                                    }
                                  });
                                },
                                observerOptions,
                              );

                              opacityObserver.observe(keypointMedia);
                              onCleanup(() => {
                                opacityObserver.disconnect();
                              });
                            });

                            if (mediaObj.url.includes("mp4")) {
                              return (
                                <>
                                  <video
                                    ref={keypointMedia as HTMLVideoElement}
                                    src={mediaObj.url}
                                    autoplay
                                    muted
                                    loop
                                    playsinline
                                    class="fade__animate lg:max-w-3xl max-h-180 border-6 border-neutral-200 dark:border-white/5 rounded-3xl aspect-auto cursor-pointer"
                                    title={mediaObj.altText}
                                    aria-label={mediaObj.altText}
                                    onClick={() => {
                                      setLightboxImg(mediaObj.url);
                                      setLightboxAlt(mediaObj.altText);
                                    }}
                                  />
                                </>
                              );
                            } else {
                              return (
                                <Picture
                                  src={mediaObj.url}
                                  loading="lazy"
                                  alt={mediaObj.altText}
                                  class="border-6 border-neutral-200 dark:border-white/5 w-full h-auto aspect-auto rounded-3xl lg:max-w-3xl max-h-180 hover:brightness-105 hover:-translate-y-3 fade__animate cursor-pointer"
                                  onClick={(event, displayedUrl) => {
                                    setLightboxImg(displayedUrl);
                                    setLightboxAlt(mediaObj.altText);
                                  }}
                                  onDisplayUrlChange={(displayedUrl) => {
                                    // Keep track of the displayed URL for consistency
                                  }}
                                  ref={keypointMedia as HTMLPictureElement}
                                />
                              );
                            }
                          }}
                        </For>
                      </div>
                    </div>
                  );
                }}
              </For>
            </section>
            <Show when={project()!.projectVideos.length > 0}>
              <VideoLib videos={project()!.projectVideos} />
            </Show>
          </section>

          {/* Related Projects */}
          <RelatedProjects
            currentProject={project()!}
            allProjects={portfolioCollection() || []}
            maxItems={3}
          />
        </Show>
      </main>
    </>
  );
}
