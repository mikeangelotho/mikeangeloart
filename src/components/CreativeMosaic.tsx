import { createSignal, For, onCleanup, onMount, Show } from "solid-js";
import { Lightbox } from "~/components/Lightbox";
import { MediaCluster } from "~/components/MediaCluster";
import { Picture } from "~/components/Picture";
import type { CreativePiece } from "~/content/content-model";

export type MosaicItem = CreativePiece;

function MosaicArtwork(props: { item: MosaicItem; onOpen: (item: MosaicItem) => void }) {
  let button!: HTMLButtonElement;
  const [failed, setFailed] = createSignal(false);
  const spanClasses = () => {
    switch (props.item.size) {
      case "wide": return "col-span-2";
      case "tall": return "row-span-2";
      case "large": return "col-span-2 row-span-2";
      default: return "col-span-1 row-span-1";
    }
  };

  onMount(() => {
    // Media errors do not bubble, so capture video errors on the preview button.
    const handleError = (event: Event) => {
      if (event.target instanceof HTMLVideoElement) setFailed(true);
    };
    button.addEventListener("error", handleError, true);
    onCleanup(() => button.removeEventListener("error", handleError, true));

    // SSR media can finish loading before Solid attaches its error handlers.
    // A failed optional Picture source still needs its original-image fallback.
    const image = button.querySelector("img");
    if (image?.complete && image.naturalWidth === 0) {
      const hasAlternativeSource = !!image.closest("picture")?.querySelector("source[srcset]");
      const displayedSource = image.currentSrc || image.src;
      const originalSource = new URL(props.item.src, document.baseURI).href;
      if (!hasAlternativeSource || displayedSource === originalSource) setFailed(true);
    }
    if (button.querySelector("video")?.error) setFailed(true);
  });

  return (
    <figure class={`flex min-h-0 min-w-0 flex-col ${spanClasses()}`}>
      <button
        ref={button}
        type="button"
        class="block min-h-0 w-full flex-1 cursor-zoom-in bg-black/4 dark:bg-white/4 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current disabled:cursor-default [&>picture]:block [&>picture]:h-full [&>picture]:w-full"
        aria-label={failed() ? `${props.item.title}: preview unavailable` : `Enlarge ${props.item.title}`}
        aria-haspopup={failed() ? undefined : "dialog"}
        disabled={failed()}
        onClick={() => props.onOpen(props.item)}
      >
        <Show
          when={!failed()}
          fallback={
            <span class="flex h-full min-h-28 w-full items-center justify-center px-4 py-6 text-sm text-black/60 dark:text-white/60">
              Preview unavailable
            </span>
          }
        >
          <Show
            when={props.item.type === "image"}
            fallback={
              <MediaCluster
                src={props.item.src}
                mediaType={props.item.type}
                width={props.item.width}
                height={props.item.height}
                alt={props.item.alt}
                class="block h-full w-full object-contain"
              />
            }
          >
            <Picture
              src={props.item.src}
              alt={props.item.alt}
              class="block h-full w-full object-contain"
              loading="lazy"
              width={props.item.width}
              height={props.item.height}
              onError={() => setFailed(true)}
            />
          </Show>
        </Show>
      </button>
      <figcaption class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 px-3 py-2 text-xs font-normal leading-relaxed">
        <span class="min-w-0 break-words">{props.item.title}</span>
        <span class="text-black/55 dark:text-white/55">{props.item.medium}</span>
      </figcaption>
    </figure>
  );
}

export default function CreativeMosaic(props: { items: readonly MosaicItem[] }) {
  const [selectedSource, setSelectedSource] = createSignal<string>();
  const [selectedAlt, setSelectedAlt] = createSignal<string>();
  const [selectedType, setSelectedType] = createSignal<"image" | "video">();
  const open = (item: MosaicItem) => {
    setSelectedAlt(item.alt);
    setSelectedType(item.type);
    setSelectedSource(item.src);
  };

  return (
    <>
      <div class="grid w-full grid-cols-2 auto-rows-[clamp(10rem,18vw,20rem)] gap-3 md:grid-cols-4 xl:grid-cols-6">
        <For each={props.items}>
          {(item) => <MosaicArtwork item={item} onOpen={open} />}
        </For>
      </div>
      <Show when={selectedSource()}>
        <Lightbox
          src={{ get: selectedSource, set: setSelectedSource }}
          altText={selectedAlt}
          mediaType={selectedType}
        />
      </Show>
    </>
  );
}
