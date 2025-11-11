import { Accessor, createEffect, createSignal, For } from "solid-js";
import { Video } from "./Collection";
import { H2 } from "~/layout/Headings";

export default function VideoLib({ videos }: { videos: Video[] }) {
    const [video, setVideo] = createSignal(videos[0].url)

    return (
        <section class="justify-between w-full flex flex-col lg:flex-row-reverse items-center gap-36 lg:gap-3 border-t border-b border-black/10 dark:border-white/10 px-6 lg:px-12 py-36">
            <iframe src={video()} class="aspect-video w-full lg:w-2/3 lg:max-w-2xl"></iframe>
            <div class="w-full lg:w-1/3 relative bg-black/2 dark:bg-white/5 overflow-hidden rounded-3xl border dark:border-t-white dark:shadow-[0px_-18px_18px_-18px_rgba(255,255,255,0.5)] border-black/5 dark:border-white/5 text-black dark:text-white">
                <div class="p-6 border-b border-black/10 dark:border-white/10">
                    <H2>Videos</H2>
                </div>
                <ul class="pb-36 relative overflow-auto divide-y divide-black/5 dark:divide-white/5 h-full max-h-72 w-full" style="scrollbar-width:none;">
                    <For each={videos}>
                        {(listVideo) => {
                            let selector!: HTMLLIElement;
                            createEffect(() => {
                                if (video() === listVideo.url) {
                                    selector.classList.add("bg-black/5", "dark:bg-white/5")
                                } else {
                                    selector.classList.remove("bg-black/5", "dark:bg-white/5")
                                }
                            })
                            return (
                                <li ref={selector} class="cursor-pointer hover:bg-black/2 dark:hover:bg-white/2 p-3 flex items-center gap-3"
                                    onClick={() => {
                                        setVideo(listVideo.url);
                                    }}><img class="rounded-xl aspect-4/3 w-24" src="/edited pc guitar me.jpg" />
                                    <div class="flex flex-col">
                                        <h6>{listVideo.title}</h6>
                                        <p class="text-xs text-black/50 dark:text-white/50">{listVideo.client}</p>
                                    </div>
                                </li>
                            )
                        }}
                    </For>
                </ul>

                <div class="pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-b from-transparent from-50% to-black/10 dark:to-black" />
            </div>
        </section>
    )
}


