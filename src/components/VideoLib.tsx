import { createMemo, createSignal, For, Show } from "solid-js";
import type { Media } from "~/types";
import { getVideoPoster } from "~/utils/media";
import VideoPlayer from "./VideoPlayer";

interface VideoLibProps {
  videos: Media[];
}

export default function VideoLib(props: VideoLibProps) {
  const videoArray = createMemo(() => {
    const seen = new Set<string>();
    return (Array.isArray(props.videos) ? props.videos : [])
      .filter((video) => {
        if (!video?.url || seen.has(video.url)) return false;
        seen.add(video.url);
        return true;
      })
      .map((video) => ({ ...video, thumbnail: getVideoPoster(video) || "" }));
  });
  const [selectedUrl, setSelectedUrl] = createSignal(props.videos?.[0]?.url);
  const video = createMemo(() => videoArray().find((item) => item.url === selectedUrl()) || videoArray()[0]);
  const setVideo = (item: Media) => setSelectedUrl(item.url);
  const [isGridView, setIsGridView] = createSignal(true);

  return (
    <Show when={videoArray().length > 0}>
      <section class="w-full py-18 max-w-5xl mx-auto">
        <Show when={video()} keyed>
          {(currentVideo) => (
            <div class="mb-10">
              <div class="rounded-2xl overflow-hidden bg-black dark:bg-neutral-950 shadow-2xl aspect-video">
                <VideoPlayer video={currentVideo} />
              </div>
              <Show when={currentVideo.title || currentVideo.description}>
                <div class="mt-9 flex flex-col gap-1">
                  <Show when={currentVideo.title}>
                    <h3 class="text-xl font-semibold text-black dark:text-white">
                      {currentVideo.title}
                    </h3>
                  </Show>
                  <Show when={currentVideo.client}>
                    <p class="text-sm text-black/60 dark:text-white/60">
                      {currentVideo.client}
                    </p>
                  </Show>
                  <Show when={currentVideo.description}>
                    <p class="text-sm text-black/50 dark:text-white/50 mt-2">
                      {currentVideo.description}
                    </p>
                  </Show>
                </div>
              </Show>
            </div>
          )}
        </Show>
        <div class="flex items-center justify-between mb-8">
          <div>
            <p class="text-sm text-black/50 dark:text-white/50 mt-1">
              {videoArray()?.length} {videoArray()?.length === 1 ? "video" : "videos"}
            </p>
          </div>
          <Show when={(videoArray()?.length || 0) > 1}>
            <div class="flex gap-2">
              <button
                type="button"
                onClick={() => setIsGridView(true)}
                class={`p-2 rounded-lg transition-all flex justify-center items-center ${isGridView()
                  ? "bg-black dark:bg-white text-white dark:text-black"
                  : "bg-neutral-100 dark:bg-neutral-900 text-black/50 dark:text-white/50 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                  }`}
                aria-label="Grid view"
                aria-pressed={isGridView()}
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setIsGridView(false)}
                class={`p-2 rounded-lg transition-all flex justify-center items-center ${!isGridView()
                  ? "bg-black dark:bg-white text-white dark:text-black"
                  : "bg-neutral-100 dark:bg-neutral-900 text-black/50 dark:text-white/50 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                  }`}
                aria-label="List view"
                aria-pressed={!isGridView()}
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </Show>
        </div>
        <Show when={isGridView()}>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <For each={videoArray()}>
              {(currentVideo) => {
                const isSelected = () => video()?.url === currentVideo?.url;
                return (
                  <button
                    type="button"
                    aria-label={`Select ${currentVideo.title || "project video"}`}
                    aria-pressed={isSelected()}
                    class={`group relative rounded-xl overflow-hidden text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white ${isSelected()
                      ? "ring-2 ring-black dark:ring-white ring-offset-2 dark:ring-offset-black"
                      : "hover:ring-2 hover:ring-black/30 dark:hover:ring-white/30 hover:ring-offset-2 dark:hover:ring-offset-black"
                      }`}
                    onClick={() => setVideo(currentVideo)}
                  >
                    <div class="aspect-video relative overflow-hidden">
                      <Show when={currentVideo.thumbnail} fallback={<div class="h-full w-full bg-neutral-800" />}>
                        <img
                          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          src={currentVideo.thumbnail}
                          alt=""
                          loading="lazy"
                        />
                      </Show>
                      <div class="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div class="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                          <svg class="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      <Show when={isSelected()}>
                        <div class="absolute top-3 left-3">
                          <span class="px-2 py-1 text-xs font-medium bg-black/80 dark:bg-white/80 text-white dark:text-black rounded-md">
                            Selected
                          </span>
                        </div>
                      </Show>
                    </div>
                    <div class="absolute bottom-0 left-0 right-0 p-3">
                      <p class="text-sm font-medium text-white truncate drop-shadow-lg">
                        {currentVideo?.title}
                      </p>
                      <p class="text-xs text-white/80 truncate drop-shadow-md">
                        {currentVideo?.client}
                      </p>
                    </div>
                  </button>
                );
              }}
            </For>
          </div>
        </Show>

        <Show when={!isGridView()}>
          <div class="flex flex-col gap-y-1 max-h-96 overflow-y-auto" data-lenis-prevent>
            <For each={videoArray()}>
              {(currentVideo) => {
                const isSelected = () => video()?.url === currentVideo?.url;
                return (
                  <button
                    type="button"
                    aria-label={`Select ${currentVideo.title || "project video"}`}
                    aria-pressed={isSelected()}
                    class={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 w-full text-left focus-visible:outline-2 focus-visible:outline-offset-2 ${isSelected()
                      ? "bg-black/5 dark:bg-white/5 border-l-4 border-black dark:border-white"
                      : "hover:bg-black/3 dark:hover:bg-white/3 border-l-4 border-transparent"
                      }`}
                    onClick={() => setVideo(currentVideo)}
                  >
                    <div class="relative shrink-0 w-32 md:w-40 aspect-video rounded-lg overflow-hidden">
                      <Show when={currentVideo.thumbnail} fallback={<div class="h-full w-full bg-neutral-800" />}>
                        <img
                          class="w-full h-full object-cover"
                          src={currentVideo.thumbnail}
                          alt=""
                          loading="lazy"
                        />
                      </Show>
                      <Show when={isSelected()}>
                        <div class="absolute inset-0 flex items-center justify-center bg-black/40">
                          <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </Show>
                      <Show when={!isSelected()}>
                        <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                          <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </Show>
                    </div>
                    <div class="flex flex-col gap-1 min-w-0 flex-1">
                      <p class={`text-sm font-medium truncate ${isSelected() ? "text-black dark:text-white" : "text-black/80 dark:text-white/80"}`}>
                        {currentVideo?.title}
                      </p>
                      <p class="text-xs text-black/50 dark:text-white/50 truncate">
                        {currentVideo?.client}
                      </p>
                      <Show when={currentVideo?.description}>
                        <p class="text-xs text-black/40 dark:text-white/40 truncate mt-1">
                          {currentVideo?.description}
                        </p>
                      </Show>
                    </div>
                  </button>
                );
              }}
            </For>
          </div>
        </Show>
      </section>
    </Show>
  );
}
