import { useNavigate, useParams } from "@solidjs/router";
import {
  createEffect,
  createResource,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import { ContainerLabel, Tag } from "~/layout/Cards";
import { H1, H2 } from "~/layout/Headings";
import data from "../../db.json";
import Collection, { PortfolioCollection } from "~/components/Collection";
import VideoLib from "~/components/VideoLib";
import { MainKeypoint } from "~/components/MainKeypoint";
import { Lightbox } from "~/components/Lightbox";
import SEO from "~/components/SEO";
import { RelatedProjects } from "~/components/RelatedProjects";
import { Breadcrumbs } from "~/components/Breadcrumbs";

const collectionData: PortfolioCollection[] = data;

export default function ProjectPage() {
  const params = useParams();
  const navigate = useNavigate();

  async function findCollection(slug: string) {
    for (const collection of collectionData) {
      if (collection.slug === slug) return collection;
    }
  }

  const [project] = createResource(() => params.slug, findCollection);

  const [lightboxImg, setLighboxImg] = createSignal<string>();
  const [lightboxAlt, setLightboxAlt] = createSignal<string>();

  createEffect(() => {
    if (project.state === "ready" && !project()) {
      navigate("/projects", { replace: true });
    }
  });

  const [coverWebP, setCoverWebP] = createSignal<string>();

  createEffect(() => {
    const p = project();
    if (!p) return;

    if (p.cover.endsWith(".jpg") || p.cover.endsWith(".jpeg")) {
      const base = p.cover.replace(/\.(jpg|jpeg)$/i, "");
      setCoverWebP(`${base}.webp`);
    } else {
      setCoverWebP("");
    }
  });

  createEffect(() => {
    document.body.classList.toggle("overflow-hidden", lightboxImg() ? true : false)
  })

  const Image = (props: { jpeg: string; webp?: string }) => {
    return (
      <picture>
        <Show when={props.webp}>
          <source srcset={props.webp} type="image/webp" />
        </Show>
        <img
          src={props.jpeg}
          class="-z-1 w-full object-cover scale-120 h-full fixed top-0 blur-xl"
          loading="eager"
        />
      </picture>
    );
  };

  return (
    <>
      <Show when={project()} fallback={<div>Loading</div>} keyed>
        {(p) => (
          <SEO
            title={`${p.title} - Portfolio Project by Mike Angelo`}
            description={`${p.projectObjective?.substring(0, 160)}... Explore this ${p.tags?.join(', ')} project by Mike Angelo, art director and web designer.`}
            canonical={`https://mikeangeloart.com/projects/${p.slug}`}
            ogImage={p.cover}
            ogType="article"
            breadcrumbs={[
              { name: "Home", url: "https://mikeangeloart.com" },
              { name: "Projects", url: "https://mikeangeloart.com/projects" },
              { name: p.title, url: `https://mikeangeloart.com/projects/${p.slug}` }
            ]}
            localBusiness={true}
            jsonLd={{
              "@context": "https://schema.org",
              "@type": "CreativeWork",
              "name": p.title,
              "description": p.projectObjective,
              "image": p.cover,
              "url": `https://mikeangeloart.com/projects/${p.slug}`,
              "creator": {
                "@type": "Person",
                "name": "Mike Angelo",
                "jobTitle": "Art Director & Web Designer"
              },
              "client": {
                "@type": "Organization",
                "name": p.clientName
              },
              "keywords": p.tags?.join(", "),
              "about": p.tags,
              "dateCreated": p.dateAdded,
              "dateModified": p.lastModified,
              "genre": "Portfolio",
              "learningResourceType": "Portfolio Project"
            }}
          />
        )}
      </Show>
      <main class="w-full">
        <Show when={project()} fallback={<div>Loading</div>} keyed>
          <Show when={lightboxImg()}>
            <Lightbox 
              src={{ get: lightboxImg, set: setLighboxImg }} 
              altText={{ get: lightboxAlt, set: setLightboxAlt }} 
            />
          </Show>
          
          {/* Breadcrumb Navigation */}
          <div class="px-6 py-4 bg-white/80 dark:bg-neutral-950/80 backdrop-blur border-b border-black/10 dark:border-white/10">
            <div class="max-w-7xl mx-auto">
              <Breadcrumbs
                items={[
                  { name: "Home", url: "/" },
                  { name: "Projects", url: "/projects" },
                  { name: project()?.title || "", url: `/projects/${project()?.slug}` }
                ]}
              />
            </div>
          </div>
          <Show when={project()?.cover} keyed>
            {p => (
              <Image
                jpeg={p}
                webp={coverWebP() || undefined}
              />
            )}
          </Show>
          <div class="-z-1 w-full fixed h-screen dark:backdrop-brightness-150 backdrop-saturate-200 bg-white mix-blend-soft-light"></div>
          <section class="h-full flex items-center bg-white/50 dark:bg-neutral-950/90">
            <article class="flex flex-col items-center w-full px-6">
              <div class="flex flex-col gap-6 items-center w-full py-36 max-w-3xl">
                <div
                  class="flex flex-col def__animate w-fit justify-center"
                >
                  <img
                    src={project()?.clientLogo}
                    class="aspect-auto max-w-24 brightness-0 dark:brightness-200 saturate-0 contrast-0 max-h-12"
                    loading="eager"
                  />
                </div>
                <span class="text-center"><H1>{project()?.title as string}</H1></span>
                <div class="hidden lg:flex justify-center gap-1 w-full flex-wrap pt-18">
                  <For each={project()?.tags}>
                    {(tag) => (
                      <Tag href={`/projects?tags=${tag.replace(" ", "+")}`}>
                        {tag}
                      </Tag>
                    )}
                  </For>
                </div>
              </div>
            </article>
          </section>
          <section class="bg-white dark:bg-neutral-950 lg:pt-18 border-t border-b border-black/10 dark:border-white/10 px-6">
            <div class="flex flex-col lg:flex-row gap-3 max-w-3xl mx-auto my-18 p-6 border border-neutral-100 dark:border-neutral-900 rounded-3xl">
              <div class="text-black/10 dark:text-white/10 not-lg:border-b lg:border-r border-black/10 dark:border-white/10 w-fit pr-2 py-1 h-fit">
                <ContainerLabel>Objective</ContainerLabel>
              </div>
              <p class="text-black dark:text-white">
                {project()?.projectObjective}
              </p>
            </div>
            <section class="pb-18 lg:pt-18 lg:pb-36">
              <Show when={project()} keyed>
                {(p) => <MainKeypoint data={p} />}
              </Show>
            </section>
            <section class="flex flex-col gap-6 lg:gap-18 border-t border-black/10 dark:border-white/10 py-18 lg:py-36">
              <For each={project()?.projectKeypoints}>
                {(keypoint) => {
                  let boxRef!: HTMLDivElement;

                  onMount(() => {
                    if (!boxRef) return;

                    const observer = new IntersectionObserver(
                      ([entry], observer) => {
                        boxRef.classList.toggle("scrolled", !entry.isIntersecting);
                        if (entry.isIntersecting) observer.disconnect();
                      },
                      {
                        root: null,
                        rootMargin: "0px",
                        threshold: 0.5
                      }
                    );

                    observer.observe(boxRef);

                    onCleanup(() => observer.disconnect());
                  });
                  return (
                    <div class="w-full flex flex-col lg:flex-row gap-6 justify-between max-w-[1440px] mx-auto">
                      <div class="w-full flex items-start justify-center md:justify-start">
                        <div ref={boxRef} class="transition duration-500 max-w-lg dark:shadow-[0px_9px_18px_0px_rgb(0,0,0,0.25)] rounded-3xl p-6 flex flex-col gap-6 bg-neutral-100 dark:bg-neutral-900 border border-black/10 dark:border-white/5 dark:border-t dark:border-t-white">
                          <H2>{keypoint.title}</H2>
                          <p class="dark:text-white">{keypoint.description}</p>
                        </div>
                      </div>
                      <div class="w-full flex flex-col gap-6 lg:gap-18 items-end">
                        <For each={keypoint.media}>
                          {(mediaObj) => {
                            const filename = () => {
                              const media = mediaObj.url;
                              if (media.includes(".jpeg")) {
                                return media.split(".jpeg")[0];
                              } else if (media.includes(".jpg")) {
                                return media.split(".jpg")[0]
                              } else if (media.includes(".png")) {
                                return media.split(".png")[0]
                              }
                            }
                            let keypointMedia!: HTMLElement;

                            onMount(() => {
                              if (!keypointMedia) return;

                              const observer = new IntersectionObserver(
                                ([entry], observer) => {
                                  keypointMedia.classList.toggle("scrolled", !entry.isIntersecting);
                                  if (entry.isIntersecting) observer.disconnect();
                                },
                                {
                                  root: null,
                                  rootMargin: "0px",
                                  threshold: 0.5
                                }
                              );

                              observer.observe(keypointMedia);

                              onCleanup(() => observer.disconnect());
                            });

                            if (mediaObj.url.includes("mp4")) {
                              return (
                                <>
                                  <video ref={keypointMedia as HTMLVideoElement} src={mediaObj.url} autoplay muted loop playsinline class="border border-neutral-100 dark:border-neutral-900 rounded-xl aspect-auto cursor-pointer" 
                                    title={mediaObj.altText}
                                    aria-label={mediaObj.altText}
                                    onClick={() => {
                                      setLighboxImg(mediaObj.url);
                                      setLightboxAlt(mediaObj.altText);
                                  }} />
                                </>
                              )
                            } else {
                              return (
                                <picture ref={keypointMedia}>
                                  <source srcset={`${filename()}.webp`} type="image/webp" onClick={() => {
                                    setLighboxImg(`${filename()}.webp`);
                                    setLightboxAlt(mediaObj.altText);
                                  }} />
                                  <img
                                    class="border border-neutral-100 dark:border-neutral-900 w-full h-auto aspect-auto rounded-xl max-w-xl hover:brightness-105 hover:saturate-125 def__animate cursor-pointer"
                                    onClick={() => {
                                      setLighboxImg(mediaObj.url);
                                      setLightboxAlt(mediaObj.altText);
                                    }}
                                    src={mediaObj.url}
                                    alt={mediaObj.altText}
                                  />
                                </picture>
                              )
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
            allProjects={collectionData}
            maxItems={3}
          />
        </Show>
        
        <section class="bg-white dark:bg-black">
          <Collection data={collectionData} />
        </section>
      </main>
    </>
  );
}

