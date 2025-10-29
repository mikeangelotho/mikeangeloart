import { A } from "@solidjs/router";
import { For, JSXElement, onCleanup, onMount, Show } from "solid-js";
import { Tag } from "~/layout/Cards";
import { H1, H2 } from "~/layout/Headings";
import { SceneManager } from "./Panel3d";

interface Collection {
  uuid: string;
  id: number;
  author: string;
  slug: string;
  title: string;
  cover: string;
  tags: string[];
  dateAdded: string;
  lastModified: string;
}

export interface PortfolioCollection extends Collection {
  clientName: string;
  clientLogo: string;
  projectObjective: string;
  mainKeypointMedia: string;
  mainKeypointMetricOne: string;
  mainKeypointMetricTwo: string;
  mainKeypointDescription: string;
}

function CollectionRow({ children }: { children: JSXElement }) {
  return <div class="gap-x-1 flex justify-start w-full">{children}</div>;
}

function CollectionCell({ data }: { data: PortfolioCollection }) {
  return (
    <article
      onwheel={(event) => {
        const wrapper = event.currentTarget.parentElement
          ?.parentElement as HTMLElement;
        const { deltaY, deltaX } = event;
        const { clientWidth, scrollWidth, scrollLeft } = wrapper;
        const threshold = scrollWidth - clientWidth;
        const delta = (deltaX ? deltaX : deltaY) * 2;
        if (delta > 0) {
          if (scrollLeft < threshold) {
            wrapper.scrollBy({
              left: delta,
              behavior: "smooth",
            });
            event.preventDefault();
          }
        } else {
          if (scrollLeft > 0) {
            wrapper.scrollBy({
              left: delta,
              behavior: "smooth",
            });
            event.preventDefault();
          }
        }
      }}
      onmouseover={(event) => {
        const cells = document.querySelectorAll(".cell-container");
        for (const cell of cells) {
          const target = event.currentTarget as Element;
          if (target !== cell) {
            cells.forEach((cell) => {
              cell.classList.add("saturate-0");
            });
          }
          cell.classList.add("brightness-103");
          event.preventDefault();
        }
      }}
      onmouseout={(event) => {
        event.currentTarget.classList.remove("brightness-103");
        const cells = document.querySelectorAll(".cell-container");
        for (const cell of cells) {
          cell.classList.remove("saturate-0");
        }
      }}
      class="group/card cell-container w-72 h-96 xl:h-108 md:w-100 xl:w-xl relative overflow-hidden hover:brightness-115 hover:saturate-125 def__animate"
    >
      <A href={`/projects/${data.slug}`} class="h-full w-full">
        <img
          src={data.cover}
          class="h-full w-full object-cover"
          loading="lazy"
        />
      </A>
      <A
        href={data.slug}
        class="group-hover/card:opacity-100 opacity-0 z-1 p-1 top-0 rounded-xl def__animate w-12 h-12 flex justify-center items-center m-6 absolute backdrop-blur backdrop-brightness-150 dark:backdrop-brightness-25 hover:opacity-50"
      >
        <img
          src={data.clientLogo}
          class="invert dark:invert-0 aspect-auto max-h-6"
        />
      </A>
      <div class="lg:rounded-3xl w-full lg:w-auto lg:inset-x-3 flex flex-col gap-2 def__animate group/tag group-hover/card:opacity-100 p-6 lg:opacity-0 absolute bottom-0 lg:bottom-3 z-1 mx-auto backdrop-blur-xl backdrop-brightness-140 dark:backdrop-brightness-25">
        <header class="flex flex-col">
          <A
            href={`/projects?client=${data.clientName}`}
            class="w-fit text-xs text-black/50 dark:text-white/50 hover:underline"
          >
            {data.clientName}
          </A>
          <A href={data.slug} class="w-fit text-lg font-bold hover:underline">
            {data.title}
          </A>
        </header>
        <div
          class="-mt-9 group-hover/tag:mt-0 flex gap-1 justify-start items-center group-hover/tag:opacity-100 opacity-0 w-full overflow-x-auto scroll-smooth def__animate"
          style="scrollbar-width: none;"
          onWheel={(event) => {
            const wrapper = event.currentTarget as HTMLElement;
            const { deltaY, deltaX } = event;
            const { clientWidth, scrollWidth, scrollLeft } = wrapper;
            const threshold = scrollWidth - clientWidth;
            const delta = (deltaX ? deltaX : deltaY) * 2;
            if (delta > 0) {
              if (scrollLeft < threshold) {
                wrapper.scrollBy({
                  left: delta,
                  behavior: "smooth",
                });
                event.preventDefault();
                event.stopPropagation();
              }
            } else {
              if (scrollLeft > 0) {
                wrapper.scrollBy({
                  left: delta,
                  behavior: "smooth",
                });
                event.preventDefault();
                event.stopPropagation();
              }
            }
          }}
        >
          <For each={data.tags}>
            {(tag) => {
              return <Tag href="">{tag}</Tag>;
            }}
          </For>
        </div>
      </div>
    </article>
  );
}

export default function Collection({
  data,
  enableSearch = false,
  enablePanel = false,
}: {
  data: PortfolioCollection[];
  enableSearch?: boolean;
  enablePanel?: boolean;
}) {
  let wrapper3d!: HTMLDivElement;

  let dataA = [],
    dataB = [];
  for (const item of data) {
    if (item.id % 2) {
      dataA.push(item);
    } else {
      dataB.push(item);
    }
  }
  onMount(() => {
    if (enablePanel) {
      const sceneManager = new SceneManager();
      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            requestAnimationFrame(() => {
              sceneManager.init(wrapper3d, "/MA_3DLogo.glb");
              const resizeHandler = () => {
                if (sceneManager) {
                  sceneManager.handleResize(wrapper3d);
                }
              };
              window.addEventListener("resize", resizeHandler);
            });
            observer.unobserve(wrapper3d);
          }
        });
      });
      observer.observe(wrapper3d);
      onCleanup(() => {
        sceneManager.dispose();
        observer.disconnect();
      });
    }
  });
  return (
    <section class="z-1 py-24 mx-auto relative bg-white dark:bg-neutral-950/80 dark:shadow-[0px_-16px_18px_-18px_rgba(255,255,255,0.8)]">
      <Show when={enableSearch}>
        <div class="max-w-7xl mx-6 mb-12 lg:mx-auto px-3 py-3 rounded-xl border border-black/5 dark:border-white/10 flex items-center justify-between">
          <div class="flex gap-3 items-center justify-start">
            <button class="cursor-pointer font-semibold text-xs text-neutral-400 bg-black/5 hover:bg-black/10 dark:bg-white/15 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 px-2 py-1 rounded-md">
              Clients:
            </button>
            <button class="cursor-pointer font-semibold text-xs text-neutral-400 bg-black/5 hover:bg-black/10 dark:bg-white/15 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 px-2 py-1 rounded-md">
              Tags:
            </button>
          </div>
          <div class="flex gap-3 items-center justify-start"></div>
        </div>
      </Show>
      <div
        class={`flex mx-auto flex-col lg:flex-row ${
          enablePanel ? "lg:max-w-7xl" : "w-full"
        }`}
      >
        <Show when={enablePanel}>
          <article class="p-12 lg:max-w-md flex flex-col justify-start">
            <div
              ref={wrapper3d}
              class="hover:scale-95 mb-12 min-h-72 mx-auto w-full def__animate cursor-grab"
            ></div>
            <H2>Check out my work.</H2>
            <p class="mt-2">
              I currently take on projects independently, but I'm always
              interested in new opportunities. Whether it's design, development,
              or blending both, I'm looking to team up with people who want to
              create meaningful work.
            </p>
          </article>
        </Show>
        <div
          id="collection-wrapper"
          class="px-6 lg:px-12 gap-y-1 w-full grid overflow-x-auto scroll-smooth"
          style="scrollbar-width: none;"
        >
          <CollectionRow>
            <For each={dataA}>{(itemA) => <CollectionCell data={itemA} />}</For>
          </CollectionRow>
          <CollectionRow>
            <For each={dataB}>{(itemB) => <CollectionCell data={itemB} />}</For>
          </CollectionRow>
        </div>
      </div>
    </section>
  );
}
