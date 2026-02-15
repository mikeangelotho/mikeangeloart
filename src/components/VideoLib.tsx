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

export default function VideoLib(props: VideoLibProps) {
  const [videoArray, { refetch }] = createResource(getVideoInfo);
  const [video, setVideo] = createSignal(props.videos[0]);

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

  return (
    <Show when={videoArray()}>
      <section class="justify-center w-full flex flex-col-reverse lg:flex-row-reverse items-center gap-6 pb-36 pt-18 md:pt-0">
        <div class="w-full relative bg-neutral-100 dark:bg-neutral-900 overflow-hidden rounded-3xl border dark:border-t-white dark:shadow-[0px_-18px_18px_-18px_rgba(255,255,255,0.5)] border-black/5 dark:border-white/5 text-black dark:text-white">
          <div class="p-6 border-b border-black/10 dark:border-white/10">
            <H2>Videos</H2>
          </div>
          <ul class="relative overflow-auto divide-y divide-black/5 dark:divide-white/5 h-full max-h-96 w-full">
            <For each={videoArray()}>
              {(listVideo) => {
                const [showDesc, setShowDesc] = createSignal(false);
                let selector!: HTMLLIElement;
                createEffect(() => {
                  if (video().url === listVideo.url) {
                    setShowDesc(true);
                    selector.classList.add("bg-black/5", "dark:bg-white/5");
                  } else {
                    setShowDesc(false);
                    selector.classList.remove("bg-black/5", "dark:bg-white/5");
                  }
                });
                return (
                  <li
                    ref={selector}
                    class="cursor-pointer hover:bg-black/2 dark:hover:bg-white/2 p-3 flex items-center gap-3"
                    onClick={() => {
                      setVideo(listVideo as Media);
                    }}
                  >
                    <img
                      class="rounded-xl aspect-square max-w-24 object-cover"
                      src={`${listVideo.thumbnail}`}
                    />
                    <div class="flex flex-col gap-1">
                      <h6>{listVideo.title}</h6>
                      <p class="text-xs text-black/50 dark:text-white/50">
                        {listVideo.client}
                      </p>
                      <Show when={showDesc()}>
                        <p class="text-sm">{listVideo.description}</p>
                      </Show>
                    </div>
                  </li>
                );
              }}
            </For>
          </ul>
        </div>
        <div class="w-full rounded-3xl overflow-hidden">
          <Show when={video()} keyed>
            <VideoPlayer video={video()} />
          </Show>
        </div>
      </section>
    </Show>
  );
}
