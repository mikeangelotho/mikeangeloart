import { Picture } from "./Picture";
import { createEffect, createSignal, onCleanup, onMount, Show, Switch, Match } from "solid-js";
import { getMediaKind, getVideoPoster } from "~/utils/media";

interface MediaClusterProps {
  class?: string;
  src: string;
  alt?: string;
  autoplay?: boolean;
  respectReducedMotion?: boolean;
  mediaType?: "image" | "video";
  width?: number;
  height?: number;
  poster?: string;
}

function LoopingPreview(props: MediaClusterProps) {
  let video!: HTMLVideoElement;
  const [loaded, setLoaded] = createSignal(false);
  const [visible, setVisible] = createSignal(false);
  const [reducedMotion, setReducedMotion] = createSignal(true);
  const shouldPlay = () => visible() && (!reducedMotion() || props.respectReducedMotion === false) && props.autoplay !== false;

  onMount(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(motionQuery.matches);
    updateMotion();
    motionQuery.addEventListener("change", updateMotion);
    const observer = "IntersectionObserver" in window
      ? new IntersectionObserver((entries) => {
          const inView = entries.some((entry) => entry.isIntersecting);
          setVisible(inView);
          if (inView) setLoaded(true);
        }, { threshold: 0.05 })
      : undefined;
    if (observer) observer.observe(video);
    else {
      setLoaded(true);
      setVisible(true);
    }
    onCleanup(() => {
      observer?.disconnect();
      motionQuery.removeEventListener("change", updateMotion);
      video.pause();
    });
  });

  createEffect(() => {
    if (!video) return;
    if (shouldPlay()) void video.play().catch(() => {});
    else video.pause();
  });

  return (
    <video
      ref={video}
      class={props.class}
      autoplay={shouldPlay()}
      muted
      loop
      playsinline
      preload="metadata"
      src={loaded() ? props.src : undefined}
      poster={props.poster}
      width={props.width}
      height={props.height}
      aria-label={props.alt || undefined}
      onCanPlay={() => {
        if (shouldPlay()) void video.play().catch(() => {});
      }}
    />
  );
}

export const MediaCluster = (props: MediaClusterProps) => {
  const kind = () => getMediaKind(props.src, props.mediaType);
  return (
    <Switch>
      <Match when={kind() === "video"}>
        <LoopingPreview {...props} />
      </Match>
      <Match when={kind() === "hls" || kind() === "vimeo"}>
        <Show
          when={getVideoPoster({ url: props.src, thumbnail: props.poster || "" })}
          fallback={<span class={props.class} role="img" aria-label={props.alt || "Video preview"}>Video</span>}
        >
          {(poster) => <Picture alt={props.alt || ""} class={props.class} loading="lazy" src={poster()} />}
        </Show>
      </Match>
      <Match when={kind() === "image"}>
        <Picture alt={props.alt || ""} class={props.class} loading="lazy" src={props.src} width={props.width} height={props.height} />
      </Match>
    </Switch>
  );
};

export default MediaCluster;
