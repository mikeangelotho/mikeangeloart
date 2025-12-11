import { A, useNavigate, useParams } from "@solidjs/router";
import {
  Accessor,
  createEffect,
  createResource,
  createSignal,
  For,
  onCleanup,
  onMount,
  Setter,
  Show,
} from "solid-js";
import { Button, ContainerLabel, LinkButton, Tag } from "~/layout/Cards";
import { H1, H2 } from "~/layout/Headings";
import data from "../../db.json";
import Collection, { PortfolioCollection } from "~/components/Collection";
import VideoLib from "~/components/VideoLib";
import VideoPlayer from "~/components/VideoPlayer";

const collectionData: PortfolioCollection[] = data;

export function MainKeypoint(props: {
  data: PortfolioCollection;
  standalone?: boolean;
  reverse?: boolean;
}) {
  return (
    <section class="z-1 w-full max-w-7xl mx-auto">
      <header class="w-full z-1 text-black dark:text-white">
        <div
          class={`text-black/5 w-full dark:text-white/5 h-fit border-b border-b-black/5 dark:border-b-white/5 pb-1${!props.standalone ? " mb-6" : ""
            }`}
        >
          <ContainerLabel>Project Highlight</ContainerLabel>
        </div>
        <Show when={props.standalone}>
          <div class="flex flex-col py-18 gap-18 justify-center items-center w-full max-w-5xl mx-auto">
            <div class="flex flex-col justify-center items-center w-full">
              <div
                class="w-full def__animate"
              >
                <img
                  src={props.data.clientLogo}
                  class="mx-auto not-dark:invert opacity-20 max-h-24 max-w-24"
                  loading="lazy"
                />
              </div>
              <A
                href={`/projects/${props.data.slug}`}
                class="w-full hover:opacity-50 def__animate text-center"
              >
                <H1>{props.data.title}</H1>
              </A>
            </div>
            <div class="group max-w-3xl flex flex-col gap-3 text-black dark:text-white w-full border p-6 rounded-3xl dark:shadow-[0px_9px_18px_0px_rgb(0,0,0,0.25)] bg-neutral-100 dark:bg-neutral-900 border-black/10 dark:border-white/5 dark:border-t dark:border-t-white">
              <div class="text-black/20 w-fit dark:text-white/20 h-fit border-b border-b-black/10 dark:border-b-white/10 pb-1">
                <ContainerLabel>Objective</ContainerLabel>
              </div>
              <p class="text-left text-black dark:text-white">
                {props.data.projectObjective}
              </p>
              <div
                class="opacity-50 group-hover:opacity-100 flex gap-1 justify-start items-center w-full overflow-x-auto scroll-smooth def__animate"
                style="scrollbar-width: none;"
              >
                <For each={props.data.tags}>
                  {(tag) => {
                    return (
                      <Tag href={`/projects?tags=${tag.replace(" ", "+")}`}>
                        {tag}
                      </Tag>
                    );
                  }}
                </For>
              </div>
            </div>
          </div>
        </Show>
      </header>
      <div
        class={`z-1 w-full flex flex-col gap-18 justify-center items-center`}
      >
        <div class="w-full max-w-5xl rounded-xl overflow-hidden ring ring-neutral-200 dark:ring-neutral-900">
          <VideoPlayer url={props.data.mainKeypointMedia} />
        </div>
        <article class="max-w-5xl text-black dark:text-white w-fit dark:shadow-[0px_9px_18px_0px_rgb(0,0,0,0.25)] mx-auto rounded-3xl p-6 items-center flex gap-6 flex-col-reverse lg:flex-row bg-neutral-100 dark:bg-neutral-900 border border-black/10 dark:border-white/5">
          <div class="flex flex-col w-full lg:w-fit min-w-72 justify-center gap-3 border border-neutral-200 bg-neutral-50 dark:bg-neutral-800 dark:border-neutral-700 p-3 rounded-xl dark:shadow-[0px_9px_18px_0px_rgb(0,0,0,0.25)]">
            <Metric icon="/MA_Icons25_Lightbulb.svg">
              {props.data.mainKeypointMetricOne}
            </Metric>
            <Metric icon="/MA_Icons25_Lightbulb.svg">
              {props.data.mainKeypointMetricTwo}
            </Metric>
          </div>
          <div class="flex flex-col gap-3 justify-center">
            <div class="text-black/20 w-fit dark:text-white/20 h-fit border-b border-b-black/10 dark:border-b-white/10 pb-1">
              <ContainerLabel>Strategy</ContainerLabel>
            </div>
            <p class="text-left text-black dark:text-white">
              {props.data.mainKeypointDescription}
            </p>
            <Show when={props.standalone}>
              <div class="w-fit py-3">
                <LinkButton href={`/projects/${props.data.slug}`}>
                  See Project
                </LinkButton>
              </div>
            </Show>
          </div>
        </article>
      </div>
    </section>
  );
}

export default function ProjectPage() {
  const params = useParams();
  const navigate = useNavigate();

  async function findCollection(slug: string) {
    for (const collection of collectionData) {
      if (collection.slug === slug) return collection;
    }
  }

  const [project, { refetch }] = createResource(() => params.slug, findCollection);

  const [lightboxImg, setLighboxImg] = createSignal<string>();

  createEffect(() => {
    if (project.state === "ready" && !project()) {
      navigate("/projects", { replace: true });
    }
  });

  return (
    <>
      <main class="w-full">
        <Show when={project()} fallback={<div>Loading</div>}>
          <Show when={lightboxImg()}>
            <Lightbox src={{ get: lightboxImg, set: setLighboxImg }} />
          </Show>
          <img
            src={project()?.cover}
            class="-z-1 w-full object-cover scale-120 h-full fixed top-0 blur-xl"
            loading="eager"
          />
          <div class="-z-1 w-full fixed h-screen dark:backdrop-saturate-100 backdrop-saturate-200 dark:bg-neutral-950 mix-blend-overlay"></div>
          <section class="h-full flex items-center bg-white/50 dark:bg-neutral-950/90">
            <article class="flex flex-col items-center w-full px-6">
              <div class="flex flex-col gap-6 items-center w-full py-36 max-w-3xl">
                <div
                  class="flex flex-col def__animate w-fit justify-center"
                >
                  <img
                    src={project()?.clientLogo}
                    class="aspect-auto max-h-9 max-w-24 not-dark:invert opacity-20"
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
              <MainKeypoint data={project()!} />
            </section>
            <section class="flex flex-col gap-6 lg:gap-18 border-t border-black/10 dark:border-white/10 py-18 lg:py-36">
              <For each={project()?.projectKeypoints}>
                {(keypoint) => {
                  return (
                    <div class="w-full flex flex-col lg:flex-row gap-6 justify-between max-w-[1440px] mx-auto">
                      <div class="w-full flex items-start justify-center md:justify-start">
                        <div class="max-w-lg dark:shadow-[0px_9px_18px_0px_rgb(0,0,0,0.25)] rounded-3xl p-6 flex flex-col gap-6 bg-neutral-100 dark:bg-neutral-900 border border-black/10 dark:border-white/5 dark:border-t dark:border-t-white">
                          <H2>{keypoint.title}</H2>
                          <p class="dark:text-white">{keypoint.description}</p>
                        </div>
                      </div>
                      <div class="w-full flex flex-col gap-6 lg:gap-18 items-end">
                        <For each={keypoint.media}>
                          {(media) => {
                            const filename = () => {
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

                            if (media.includes("mp4")) {
                              return (
                                <>
                                  <video ref={keypointMedia as HTMLVideoElement} src={media} autoplay muted loop class="border border-neutral-100 dark:border-neutral-900 rounded-xl aspect-auto" />
                                </>
                              )
                            } else {
                              return (
                                <picture ref={keypointMedia}>
                                  <source srcset={`${filename()}.webp`} type="image/webp" onClick={() => {
                                    setLighboxImg(`${filename()}.webp`);
                                  }} />
                                  <img
                                    class="w-full h-auto aspect-auto rounded-xl max-w-xl hover:brightness-105 hover:saturate-125 def__animate cursor-pointer"
                                    onClick={() => {
                                      setLighboxImg(media);
                                    }}
                                    src={media}
                                  />
                                </picture>
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
        </Show>
        <section class="bg-white dark:bg-black">
          <Collection data={collectionData} />
        </section>
      </main>
    </>
  );
}

const Metric = ({ children, icon }: { children: string; icon: string }) => {
  return (
    <article class="flex items-center gap-3">
      <div class="border border-black/50 dark:border-white/50 p-1 rounded-lg opacity-20">
        <img src={icon} loading="eager" class="w-8 h-8 dark:invert" />
      </div>
      <span class="uppercase text-xs font-bold tracking-widest text-black/20 dark:text-white/20">
        {children}
      </span>
    </article>
  );
};

const Lightbox = ({
  src,
}: {
  src: { get: Accessor<string | undefined>; set: Setter<string | undefined> };
}) => {
  let imgRef!: HTMLImageElement;

  return (
    <div class="z-10 fixed w-screen h-screen flex justify-center items-center dark:bg-black/98">
      <div class="w-full max-w-3xl mx-auto pt-[5vh] flex flex-col items-center gap-3">
        <img ref={imgRef} class="w-full" src={src.get()} />
        <Button
          type="button"
          onClick={() => {
            src.set();
          }}
        >
          Close
        </Button>
      </div>
    </div>
  );
};