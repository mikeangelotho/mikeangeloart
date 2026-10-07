import { A } from "@solidjs/router";
import { PortfolioCollection } from "~/types";
import { createSignal, onMount, Show, createMemo, createEffect, onCleanup } from "solid-js";
import { isVideoUrl } from "~/utils/media";
import { Picture } from "./Picture";

function SlideshowCover(props: { data: PortfolioCollection; isPaused: boolean }) {
  const images = createMemo(() => {
    const candidates = [props.data.cover, ...props.data.featuredMedia
      .filter((media) => media.type === "image").map((media) => media.url)];
    return [...new Set(candidates.filter((url) => url && !isVideoUrl(url)))];
  });
  const [showA, setShowA] = createSignal(true);
  const [aIdx, setAIdx] = createSignal(0);
  const [bIdx, setBIdx] = createSignal(1);
  const [isPlaying, setIsPlaying] = createSignal(false);

  const nextIdx = (i: number) => (i + 1) % images().length;
  const prevIdx = (i: number) => (i - 1 + images().length) % images().length;

  const goNext = () => {
    if (showA()) {
      setBIdx(nextIdx(aIdx()));
    } else {
      setAIdx(nextIdx(bIdx()));
    }
    setShowA((v) => !v);
  };

  const goPrev = () => {
    if (showA()) {
      setBIdx(prevIdx(aIdx()));
    } else {
      setAIdx(prevIdx(bIdx()));
    }
    setShowA((v) => !v);
  };

  const baseDelay = 9000;
  const offset = ((props.data.slug?.length ?? 0) * 137) % 2000;

  onMount(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setIsPlaying(!motionQuery.matches);
    updateMotion();
    motionQuery.addEventListener("change", updateMotion);
    onCleanup(() => motionQuery.removeEventListener("change", updateMotion));
  });

  createEffect(() => {
    if (!props.isPaused && isPlaying() && images().length > 1) {
      const interval = setInterval(goNext, baseDelay + offset);
      onCleanup(() => clearInterval(interval));
    }
  });

  const next = (e: MouseEvent) => {
    e.stopPropagation();
    goNext();
  };

  const prev = (e: MouseEvent) => {
    e.stopPropagation();
    goPrev();
  };

  return (
    <>
      <Show when={images().length > 1}>
      <div class="group-hover/card:opacity-100 group-focus-within/card:opacity-100 xl:opacity-0 absolute inset-0 flex justify-between items-center px-6 pointer-events-none z-10 def__animate">
        <button
          type="button"
          aria-label={`Previous image for ${props.data.title}`}
          class="h-18 flex items-center pointer-events-auto cursor-pointer px-3 py-1 text-sm bg-white/90 dark:bg-black/90 dark:text-white rounded-lg hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2"
          onClick={prev}
        >
          ❮
        </button>
        <button
          type="button"
          aria-label={`Next image for ${props.data.title}`}
          class="h-18 flex items-center pointer-events-auto cursor-pointer px-3 py-1 text-sm bg-white/90 dark:bg-black/90 dark:text-white rounded-lg hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2"
          onClick={next}
        >
          ❯
        </button>
      </div>
      </Show>

      <A href={`/projects/${props.data.slug}`} aria-label={`View ${props.data.title} case study`} class="absolute inset-0">
        <div class="relative h-full w-full overflow-hidden">
          <Picture
            src={images()[aIdx()] || images()[0] || props.data.cover}
            class={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 will-change-[opacity]
            ${showA() ? "opacity-100" : "opacity-0"}`}
            loading="lazy"
            alt=""
          />
          <Picture
            src={images()[bIdx()] || images()[0] || props.data.cover}
            class={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 will-change-[opacity]
            ${showA() ? "opacity-0" : "opacity-100"}`}
            loading="lazy"
            alt=""
          />
        </div>
      </A>
    </>
  );
}

export function CollectionCell(props: {
  data: PortfolioCollection;
  enableFull?: boolean;
  galleryCover?: boolean;
}) {
  let cell!: HTMLDivElement;
  const [isPaused, setIsPaused] = createSignal(true);

  onMount(() => {
    const sliderObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsPaused(!entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );

    sliderObserver.observe(cell);
    onCleanup(() => sliderObserver.disconnect());
  });

  return (
    <article
      ref={cell}
      onMouseEnter={(event) => {
        const cells = document.querySelectorAll(".cell-container");
        const target = event.currentTarget;
        cells.forEach((c) => {
          if (target !== c) {
            c.classList.add("saturate-0");
          }
          c.classList.add("brightness-103");
        });
      }}
      onMouseLeave={() => {
        const cells = document.querySelectorAll(".cell-container");
        cells.forEach((c) => c.classList.remove("saturate-0", "brightness-103"));
      }}
      class={`not-dark:border not-dark:border-black/10 group/card cell-container relative overflow-hidden hover:brightness-115 hover:saturate-125 rounded-xl transition-all duration-500 ease-in-out ${!props.enableFull ? `w-72 h-96 xl:h-108 md:w-100 xl:w-xl` : `h-120 w-full`
        }`}
    >
      <Show
        when={props.galleryCover}
        fallback={
          <Picture
            src={props.data.cover}
            class="h-full w-full object-cover"
            loading="lazy"
            alt={props.data.coverAlt}
            width={props.data.coverWidth}
            height={props.data.coverHeight}
          />
        }
      >
        <SlideshowCover data={props.data} isPaused={isPaused()} />
      </Show>

      <A
        href={`/projects?client=${encodeURIComponent(props.data.clientName)}`}
        aria-label={`View ${props.data.clientName} projects`}
        class="hover:scale-105 group-hover/card:opacity-100 group-focus-within/card:opacity-100 opacity-0 z-20 p-1 top-0 rounded-xl duration-500 ease-in-out w-12 h-12 flex justify-center items-center m-6 absolute backdrop-blur bg-white/80 dark:bg-black/30 backdrop-brightness-150 dark:backdrop-brightness-25"
      >
        <img
          src={props.data.clientLogo}
          class="brightness-0 dark:brightness-200 saturate-0 contrast-0 aspect-auto max-h-6"
          alt={props.data.clientLogoAlt}
        />
      </A>

      <div class="min-h-18 lg:min-h-12 justify-center lg:rounded-3xl w-full lg:w-auto lg:inset-x-3 flex flex-col gap-2 p-6 absolute bottom-0 lg:bottom-3 bg-white/50 dark:bg-black/30 mx-auto backdrop-blur-xl backdrop-brightness-140 dark:backdrop-brightness-25">
        <header class="flex flex-col">
          <A
            href={`/projects?client=${encodeURIComponent(props.data.clientName)}`}
            class="w-fit text-xs text-black/50 dark:text-white/50 hover:underline"
          >
            {props.data.clientName}
          </A>
          <A
            href={`/projects/${props.data.slug}`}
            class="w-fit font-bold text-xl text-black dark:text-white hover:underline"
          >
            {props.data.title}
          </A>
          <Show when={props.data.caseStudy?.role}>
            <p class="text-sm font-medium text-black dark:text-white mt-1">
              {props.data.caseStudy?.role}
            </p>
          </Show>
        </header>
      </div>
    </article>
  );
}
