import { createMemo, createSignal, onCleanup, onMount, Show, Switch, Match } from "solid-js";
import type { Media } from "~/types";
import { getMediaKind, getVideoPoster, getVimeoEmbedUrl } from "~/utils/media";
import VideoJSPlayer from "./VideoJSPlayer";

export default function VideoPlayer(props: { video: Media; class?: string }) {
  let container!: HTMLDivElement;
  const [ready, setReady] = createSignal(false);
  const kind = createMemo(() => getMediaKind(props.video.url, props.video.type));
  const title = () => props.video.title || props.video.altText || "Project video";

  onMount(() => {
    if (!("IntersectionObserver" in window)) {
      setReady(true);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setReady(true);
        observer.disconnect();
      }
    }, { rootMargin: "200px" });
    observer.observe(container);
    onCleanup(() => observer.disconnect());
  });

  return (
    <div ref={container} class="w-full">
      <Show
        when={ready()}
        fallback={
          <button
            type="button"
            onClick={() => setReady(true)}
            aria-label={`Load ${title()}`}
            class="relative flex aspect-video w-full items-center justify-center bg-black text-white focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <Show when={getVideoPoster(props.video)}>
              {(poster) => <img src={poster()} alt="" loading="lazy" class="absolute inset-0 h-full w-full object-cover opacity-60" />}
            </Show>
            <span class="relative bg-black/70 px-4 py-2">Load video</span>
          </button>
        }
      >
        <Switch>
          <Match when={kind() === "vimeo"}>
            <iframe
              src={getVimeoEmbedUrl(props.video.url)}
              title={title()}
              class={props.class || "aspect-video w-full"}
              allow="autoplay; fullscreen; picture-in-picture"
              allowfullscreen
              loading="lazy"
            />
          </Match>
          <Match when={kind() === "hls"}>
            <VideoJSPlayer video={props.video} />
          </Match>
          <Match when={kind() !== "vimeo" && kind() !== "hls"}>
            <video
              src={props.video.url}
              poster={getVideoPoster(props.video)}
              controls
              playsinline
              preload="metadata"
              class={props.class || "aspect-video w-full object-contain"}
              title={title()}
              aria-label={props.video.altText || title()}
            >
              <a href={props.video.url}>Open {title()}</a>
            </video>
          </Match>
        </Switch>
      </Show>
    </div>
  );
}
