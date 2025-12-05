import { Accessor, createEffect, createResource, createSignal, For, onMount, Show } from "solid-js";
import { Video } from "./Collection";
import { H2 } from "~/layout/Headings";

interface VimeoOEmbedVideo {
    type: 'video';
    version: '1.0';
    provider_name: string;
    provider_url: string;
    title: string;
    author_name: string;
    author_url: string;
    is_plus: '0' | '1';
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

export default function VideoLib({ videos }: { videos: Video[] }) {
    const [videoArray, { refetch }] = createResource(getVideoInfo);
    const [video, setVideo] = createSignal(videos[0].url);

    async function getVideoInfo() {
        const results = await Promise.all(
            videos.map(async (v) => {
                const req = await fetch(`https://vimeo.com/api/oembed.json?url=${v.url}`);
                const data = await req.json();
                return [v.url, data] as [string, VimeoOEmbedVideo];
            })
        );
        return results;
    }

    return (
        <Show when={videoArray()}>
            <section class="justify-center w-full flex flex-col lg:flex-row items-center gap-6">
                <iframe src={video()} class="aspect-video w-full lg:w-2/3 lg:max-w-2xl rounded-xl"></iframe>
                <div class="w-full lg:w-1/3 relative bg-neutral-100 dark:bg-neutral-900 overflow-hidden rounded-3xl border dark:border-t-white dark:shadow-[0px_-18px_18px_-18px_rgba(255,255,255,0.5)] border-black/5 dark:border-white/5 text-black dark:text-white">
                    <div class="p-6 border-b border-black/10 dark:border-white/10">
                        <H2>Videos</H2>
                    </div>
                    <ul class="relative overflow-auto divide-y divide-black/5 dark:divide-white/5 h-full max-h-72 w-full" style="scrollbar-width:none;">
                        <For each={videoArray()}>
                            {(listVideo) => {
                                console.log(listVideo);
                                let selector!: HTMLLIElement;
                                createEffect(() => {

                                    if (video() === listVideo[0]) {
                                        selector.classList.add("bg-black/5", "dark:bg-white/5")
                                    } else {
                                        selector.classList.remove("bg-black/5", "dark:bg-white/5")
                                    }
                                })
                                return (
                                    <li ref={selector} class="cursor-pointer hover:bg-black/2 dark:hover:bg-white/2 p-3 flex items-center gap-3"
                                        onClick={() => {
                                            setVideo(listVideo[0]);
                                        }}><img class="rounded-xl aspect-4/3 w-24" src={`${listVideo[1].thumbnail_url}`} />
                                        <div class="flex flex-col">
                                            <h6>{listVideo[1].title}</h6>
                                            <p class="text-xs text-black/50 dark:text-white/50">{listVideo[1].author_name}</p>
                                        </div>
                                    </li>
                                )
                            }}
                        </For>
                    </ul>
                    <div class="pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-b from-transparent from-50% to-black/10 dark:to-black" />
                </div>
            </section>
        </Show>
    )
}


