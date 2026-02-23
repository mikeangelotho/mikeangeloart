import {
  createEffect,
  createResource,
  createSignal,
  For,
  Show,
} from "solid-js";
import { Media } from "~/types";
import { H2 } from "~/layout/Headings";
import VideoPlayer from "./VideoPlayer";

export interface VimeoOEmbedVideo {
  type: "video";
  version: "1.0";
  provider_name: string;
  provider_url: string;
  title: string;
  author_name: string;
  author_url: string;
  is_plus: "0" | "1";
  account_type: string;
  html: string;
  width: number;
  height: number;
  duration: number;
  description: string;
  thumbnail_url: string;
  thumbnail_width: number;
  thumbnail_height: number;
  thumbnail_url_with_play_button: string;
  upload_date: string;
  video_id: number;
  uri: string;
}

interface VideoLibProps {
  videos: Media[];
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function VideoLib(props: VideoLibProps) {
  const [videoArray] = createResource(getVideoInfo);
  const [video, setVideo] = createSignal<Media | null>(props.videos[0] || null);
  const [isGridView, setIsGridView] = createSignal(true);

  async function getVideoInfo() {
    const results = await Promise.all(
      props.videos.map(async (v) => {
        if (v.url.includes("gumlet")) {
          const thumbUrl =
            v.url
              .split("/")
              .map((val, idx) => {
                if (idx < 5) {
                  return val;
                }
              })
              .join("/") + "/thumbnail-1-0.png";
          v.thumbnail = thumbUrl;
          return v;
        } else {
          const req = await fetch(
            `https://vimeo.com/api/oembed.json?url=${v.url}`,
          );
          const data: VimeoOEmbedVideo = await req.json();
          v.thumbnail = data.thumbnail_url;
          return v;
        }
      }),
    );
    return results;
  }

  createEffect(() => {
    const videos = videoArray();
    if (videos && videos.length > 0 && !video()) {
      setVideo(videos[0]);
    }
  });

  const handleKeyDown = (e: KeyboardEvent, listVideo: Media) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setVideo(listVideo);
    }
  };

  return (
    <Show when={videoArray() && videoArray()!.length > 0}>
      <section class="w-full pb-18 pt-18 md:pt-0 max-w-6xl mx-auto">
        <div class="flex items-center justify-between mb-8">
          <div>
            <H2>Video Gallery</H2>
            <p class="text-sm text-black/50 dark:text-white/50 mt-1">
              {videoArray()?.length} {videoArray()?.length === 1 ? "video" : "videos"}
            </p>
          </div>
          <Show when={(videoArray()?.length || 0) > 1}>
            <div class="flex gap-2">
              <button
                onClick={() => setIsGridView(true)}
                class={`p-2 rounded-lg transition-all flex justify-center items-center ${isGridView()
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "bg-neutral-100 dark:bg-neutral-900 text-black/50 dark:text-white/50 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                  }`}
                aria-label="Grid view"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setIsGridView(false)}
                class={`p-2 rounded-lg transition-all flex justify-center items-center ${!isGridView()
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "bg-neutral-100 dark:bg-neutral-900 text-black/50 dark:text-white/50 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                  }`}
                aria-label="List view"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </Show>
        </div>

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

        <Show when={isGridView()}>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <For each={videoArray()}>
              {(listVideo) => {
                const isSelected = () => video()?.url === listVideo.url;
                return (
                  <button
                    class={`group relative rounded-xl overflow-hidden text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white ${isSelected()
                        ? "ring-2 ring-black dark:ring-white ring-offset-2 dark:ring-offset-black"
                        : "hover:ring-2 hover:ring-black/30 dark:hover:ring-white/30 hover:ring-offset-2 dark:hover:ring-offset-black"
                      }`}
                    onClick={() => setVideo(listVideo)}
                    onKeyDown={(e) => handleKeyDown(e, listVideo)}
                  >
                    <div class="aspect-video relative overflow-hidden">
                      <img
                        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        src={`${listVideo.thumbnail}`}
                        alt={listVideo.title || "Video thumbnail"}
                        loading="lazy"
                      />
                      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
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
                            Playing
                          </span>
                        </div>
                      </Show>
                    </div>
                    <div class="absolute bottom-0 left-0 right-0 p-3">
                      <h6 class="text-sm font-medium text-white truncate drop-shadow-lg">
                        {listVideo.title}
                      </h6>
                      <p class="text-xs text-white/80 truncate drop-shadow-md">
                        {listVideo.client}
                      </p>
                    </div>
                  </button>
                );
              }}
            </For>
          </div>
        </Show>

        <Show when={!isGridView()}>
          <div class="flex flex-col gap-3">
            <For each={videoArray()}>
              {(listVideo) => {
                const isSelected = () => video()?.url === listVideo.url;
                return (
                  <button
                    class={`group flex items-center gap-4 p-3 rounded-xl transition-all duration-200 w-full text-left focus:outline-none ${isSelected()
                        ? "bg-black/5 dark:bg-white/5 border-l-4 border-black dark:border-white"
                        : "hover:bg-black/3 dark:hover:bg-white/3 border-l-4 border-transparent"
                      }`}
                    onClick={() => setVideo(listVideo)}
                    onKeyDown={(e) => handleKeyDown(e, listVideo)}
                  >
                    <div class="relative flex-shrink-0 w-32 md:w-40 aspect-video rounded-lg overflow-hidden">
                      <img
                        class="w-full h-full object-cover"
                        src={`${listVideo.thumbnail}`}
                        alt={listVideo.title || "Video thumbnail"}
                        loading="lazy"
                      />
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
                      <h6 class={`text-sm font-medium truncate ${isSelected() ? "text-black dark:text-white" : "text-black/80 dark:text-white/80"}`}>
                        {listVideo.title}
                      </h6>
                      <p class="text-xs text-black/50 dark:text-white/50 truncate">
                        {listVideo.client}
                      </p>
                      <Show when={listVideo.description}>
                        <p class="text-xs text-black/40 dark:text-white/40 truncate mt-1">
                          {listVideo.description}
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
