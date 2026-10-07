import { createSignal, onMount, onCleanup, Show } from "solid-js";
import type videojs from "video.js";
import "video.js/dist/video-js.css";
import type { Media } from "~/types";
import { getVideoMimeType, getVideoPoster } from "~/utils/media";

export default function VideoJSPlayer(props: { video: Media }) {
  let playerRef!: HTMLDivElement;
  let player: ReturnType<typeof videojs> | undefined;
  let disposed = false;
  const [failed, setFailed] = createSignal(false);

  onMount(async () => {
    try {
      // HLS support is only downloaded in the browser when a player is needed.
      const { default: createPlayer } = await import("video.js");
      if (disposed) return;
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");
      videoElement.setAttribute("playsinline", "");
      videoElement.setAttribute("aria-label", props.video.altText || props.video.title || "Project video");
      playerRef.appendChild(videoElement);
      player = createPlayer(videoElement, {
        autoplay: false,
        controls: true,
        responsive: true,
        fluid: true,
        preload: "metadata",
        playsinline: true,
        poster: getVideoPoster(props.video),
        sources: [{ src: props.video.url, type: getVideoMimeType(props.video.url) }],
      });
      player.on("error", () => setFailed(true));
    } catch {
      if (!disposed) setFailed(true);
    }
  });

  onCleanup(() => {
    disposed = true;
    player?.dispose();
    player = undefined;
  });

  return (
    <div class="w-full overflow-hidden">
      <div class="w-full min-h-24 bg-black" data-vjs-player ref={playerRef} />
      <Show when={failed()}>
        <p role="status" class="p-4 text-sm text-white bg-black">
          This video could not load. <a class="underline" href={props.video.url} target="_blank" rel="noopener noreferrer">Open the video</a>.
        </p>
      </Show>
    </div>
  );
}
