import { A } from "@solidjs/router";
import { PortfolioCollection } from "./Collection";
import { createSignal, For, onMount, Show, createMemo } from "solid-js";
import { Tag } from "~/layout/Cards";

export function CollectionCell({
  data,
  enableFull,
  galleryCover,
}: {
  data: PortfolioCollection;
  enableFull?: boolean;
  galleryCover?: boolean;
}) {
  function SlideshowCover() {
    const keypointMedia = createMemo(() => {
      return data.projectKeypoints
        .flatMap((kp) => kp.media.map((m) => m.url))
        .filter((url) => !url.endsWith(".mp4"));
    });

    const [randIdx, setRandIdx] = createSignal(
      Math.floor(Math.random() * keypointMedia().length),
    );
    let coverRef: HTMLImageElement | undefined;

    onMount(() => {
      if (keypointMedia().length <= 1) return;

      const interval = setInterval(() => {
        coverRef?.classList.add("opacity-0");
        setTimeout(() => {
          setRandIdx((prev) => (prev + 1) % keypointMedia().length);
          coverRef?.classList.remove("opacity-0");
        }, 700);
      }, 10000);

      return () => clearInterval(interval);
    });

    const handleNext = (e: MouseEvent) => {
      e.stopPropagation();
      setRandIdx((prev) => (prev + 1) % keypointMedia().length);
    };

    const handlePrev = (e: MouseEvent) => {
      e.stopPropagation();
      setRandIdx(
        (prev) => (prev - 1 + keypointMedia().length) % keypointMedia().length,
      );
    };

    return (
      <>
        <div class="group-hover/card:opacity-100 def__animate opacity-0 absolute inset-0 flex justify-between items-center px-6 pointer-events-none z-10">
          <div
            class="pointer-events-auto select-none hover:scale-105 cursor-pointer px-3 py-1 text-sm bg-white/80 dark:bg-black/80 backdrop-blur-3xl backdrop-brightness-150 text-black dark:text-white rounded-lg not-dark:border border-neutral-200"
            onClick={handlePrev}
          >
            ❮
          </div>

          <div
            class="pointer-events-auto select-none hover:scale-105 cursor-pointer px-3 py-1 text-sm bg-white/80 dark:bg-black/80 backdrop-blur-3xl backdrop-brightness-150 text-black dark:text-white rounded-lg not-dark:border border-neutral-200"
            onClick={handleNext}
          >
            ❯
          </div>
        </div>

        <A href={`/projects/${data.slug}`}>
          <img
            ref={coverRef}
            src={keypointMedia()[randIdx()]}
            class="h-full w-full object-cover def__animate opacity-100 transition-opacity duration-700"
            loading="lazy"
            alt=""
          />
        </A>
      </>
    );
  }

  return (
    <article
      onMouseOver={(event) => {
        const cells = document.querySelectorAll(".cell-container");
        const target = event.currentTarget;
        cells.forEach((cell) => {
          if (target !== cell) {
            cell.classList.add("saturate-0");
          }
          cell.classList.add("brightness-103");
        });
      }}
      onMouseOut={(event) => {
        event.currentTarget.classList.remove("brightness-103");
        const cells = document.querySelectorAll(".cell-container");
        cells.forEach((cell) => cell.classList.remove("saturate-0"));
      }}
      class={`group/card cell-container relative overflow-hidden hover:brightness-115 hover:saturate-125 def__animate ${
        !enableFull ? `w-72 h-96 xl:h-108 md:w-100 xl:w-xl` : `h-120 w-full`
      }`}
    >
      <Show
        when={galleryCover}
        fallback={
          <img
            src={data.cover}
            class="h-full w-full object-cover"
            loading="lazy"
            alt={data.coverAlt}
          />
        }
      >
        <SlideshowCover />
      </Show>

      <A
        href={`/projects?client=${data.clientName}`}
        class="hover:scale-105 group-hover/card:opacity-100 opacity-0 z-20 p-1 top-0 rounded-xl def__animate w-12 h-12 flex justify-center items-center m-6 absolute backdrop-blur bg-white/80 dark:bg-black/30 backdrop-brightness-150 dark:backdrop-brightness-25"
      >
        <img
          src={data.clientLogo}
          class="brightness-0 dark:brightness-200 saturate-0 contrast-0 aspect-auto max-h-6"
          alt={data.clientLogoAlt}
        />
      </A>

      <div class="min-h-18 lg:min-h-12 justify-center lg:rounded-3xl w-full lg:w-auto lg:inset-x-3 flex flex-col gap-2 def__animate group/tag group-hover/card:opacity-100 p-6 lg:opacity-0 absolute bottom-0 lg:bottom-3 bg-white/50 dark:bg-black/30 mx-auto backdrop-blur-xl backdrop-brightness-140 dark:backdrop-brightness-25">
        <header class="flex flex-col">
          <A
            href={`/projects?client=${data.clientName}`}
            class="w-fit text-xs text-black/50 dark:text-white/50 hover:underline"
          >
            {data.clientName}
          </A>
          <A
            href={`/projects/${data.slug}`}
            class="w-fit font-bold text-xl text-black dark:text-white hover:underline"
          >
            {data.title}
          </A>
        </header>
        <div
          class="-mt-9 group-hover/tag:mt-0 flex gap-1 justify-start items-center group-hover/tag:opacity-100 opacity-0 w-full overflow-x-auto scroll-smooth def__animate"
          style={{ "scrollbar-width": "none" }}
        >
          <For each={data.tags}>
            {(tag) => (
              <Tag href={`/projects?tags=${tag.replace(" ", "+")}`}>{tag}</Tag>
            )}
          </For>
        </div>
      </div>
    </article>
  );
}
