import { A, useNavigate, useParams } from "@solidjs/router";
import { createResource, For, onMount, Show } from "solid-js";
import { ContainerLabel, Tag } from "~/layout/Cards";
import { H1, H2 } from "~/layout/Headings";
import data from "../../db.json";
import { PortfolioCollection } from "~/components/Collection";

const collectionData: PortfolioCollection[] = data;

const Metric = ({ children, icon }: { children: string; icon: string }) => {
  return (
    <article class="flex items-center gap-3">
      <div class="border border-black/50 dark:border-white/50 p-2 rounded-lg opacity-20">
        <img src={icon} loading="eager" class="w-6 h-6" />
      </div>
      <H2>{children}</H2>
    </article>
  );
};

export function MainKeypoint({
  data,
  standalone,
  reverse = false,
}: {
  data: PortfolioCollection;
  standalone?: boolean;
  reverse?: boolean;
}) {
  return (
    <section class="w-full flex flex-col gap-12 px-12">
      <header class="flex flex-col gap-3">
        <div class="text-black/20 w-fit dark:text-white/20 h-fit border-b border-b-black/10 dark:border-b-white/10 pb-1 mb-3">
          <ContainerLabel>Project Highlight</ContainerLabel>
        </div>
        <Show when={standalone}>
          <img
            src={data.clientLogo}
            class="not-dark:invert opacity-20 max-h-24 max-w-24"
          />
          <H1>{data.title}</H1>
        </Show>
      </header>
      <div
        class={`w-full mx-auto flex flex-col ${
          !reverse ? "lg:flex-row" : "lg:flex-row-reverse"
        } gap-12 justify-center items-center`}
      >
        <div class="w-full max-w-5xl">
          <iframe
            src={data.mainKeypointMedia}
            class="aspect-video w-full rounded-3xl"
            allow="fullscreen"
          ></iframe>
        </div>
        <article class="w-full lg:max-w-1/3 flex flex-col items-start justify-center gap-12">
          <div class="w-full dark:shadow-[0px_-18px_18px_-18px_rgba(255,255,255,0.5)] mx-auto rounded-3xl p-6 flex flex-col gap-3 bg-white/80 dark:bg-neutral-950 border border-black/10 dark:border-white/5 dark:border-t dark:border-t-white">
            <p class="text-left text-black dark:text-white/50">
              {data.mainKeypointDescription}
            </p>
            <Metric icon="/MA_26Logo.svg">{data.mainKeypointMetricOne}</Metric>
            <Metric icon="/MA_26Logo.svg">{data.mainKeypointMetricTwo}</Metric>
          </div>
          <Show when={standalone}>
            <A href={data.slug} class="def__button">
              button
            </A>
          </Show>
        </article>
      </div>
    </section>
  );
}

async function findCollection(slug: string) {
  for(const collection of collectionData) {
    if(collection.slug === slug) return collection;
  }
}

export default function ProjectPage() {
  const params = useParams();
  const navigate = useNavigate();
  const {slug} = params;

  const [project] = createResource(() => slug, findCollection);

  onMount(() => {

  })

  return (
    <main class="w-full">
      <Show when={project()} fallback={<div>Loading</div>}>
      <img
        src={project()?.cover}
        class="-z-1 w-full brightness-150 saturation-125 blur-3xl object-cover h-full fixed top-0"
      />
      <section class="h-144 flex items-center">
        <article class="flex flex-col items-center gap-6 w-full px-6 max-w-3xl mx-auto">
          <A
            href=""
            class="flex flex-col cursor-pointer def__animate hover:opacity-50 w-fit justify-center"
          >
            <img
              src={project()?.clientLogo}
              class="aspect-auto my-6 max-h-9 max-w-24 not-dark:invert opacity-20"
              loading="eager"
            />
          </A>
          <H1>{project()?.title as string}</H1>
          <div class="flex justify-center gap-1 w-full dark:invert">
            <For each={project()?.tags}>
              {(tag) => <Tag href="">{tag}</Tag>}
            </For>
          </div>
          <div class="flex gap-3">
            <div class="text-black/20 border-r border-r-black/10 w-fit pr-2 py-1 h-fit mt-1">
              <ContainerLabel>Objective</ContainerLabel>
            </div>
            <p class="text-black">
              {project()?.projectObjective}
            </p>
          </div>
        </article>
      </section>
      <div class="bg-white/80 dark:bg-black/80 py-12 border-t border-black/10">
        <MainKeypoint data={collectionData[0]} />
      </div>
      </Show>
    </main>
  );
}
