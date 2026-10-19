import { A } from "@solidjs/router";
import { createEffect, For, onCleanup, onMount } from "solid-js";
import ActionIcon from "~/components/ActionIcon";
import { MediaCluster } from "~/components/MediaCluster";
import type { PortfolioMosaicMedia } from "~/utils/portfolio-mosaic";
import { observeScrollReveals } from "~/utils/scroll-reveal";

export default function PortfolioMosaic(props: { items: PortfolioMosaicMedia[]; autoplay: boolean }) {
  let grid!: HTMLDivElement;
  onMount(() => {
    createEffect(() => {
      if (props.items.length) {
        onCleanup(observeScrollReveals(grid.querySelectorAll<HTMLElement>(".mosaic-card")));
      }
    });
  });

  return (
      <div ref={grid} id="portfolio-mosaic" class="portfolio-mosaic columns-2 gap-1 sm:gap-2 xl:columns-3 2xl:columns-4">
        <For each={props.items}>
          {(item) => (
            <A
              href={`/projects/${item.projectSlug}`}
              aria-label={`View ${item.projectTitle}: ${item.alt}`}
              class="mosaic-card group relative mb-1 block break-inside-avoid overflow-hidden bg-black/3 dark:bg-white/3 sm:mb-2 focus-visible:outline-2 focus-visible:outline-offset-4 [&>picture]:block [&>picture]:w-full"
            >
              <MediaCluster
                src={item.src}
                mediaType={item.type}
                alt={item.alt}
                width={item.width}
                height={item.height}
                poster={item.poster}
                autoplay={props.autoplay}
                respectReducedMotion={false}
                class="block h-auto w-full motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.02]"
              />
              <span
                aria-hidden="true"
                class="pointer-events-none absolute right-2 bottom-2 flex h-8 w-8 items-center justify-center bg-black/80 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                <ActionIcon name="arrow-up-right" size={16} />
              </span>
            </A>
          )}
        </For>
      </div>
  );
}
