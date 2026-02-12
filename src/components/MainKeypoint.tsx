import { ContainerLabel, LinkButton, Tag } from "~/layout/Cards";
import { PortfolioCollection } from "./Collection";
import { For, JSX, onMount, Show } from "solid-js";
import { A } from "@solidjs/router";
import { H1, H2 } from "~/layout/Headings";
import VideoPlayer from "./VideoPlayer";

export function MainKeypoint(props: {
    data: PortfolioCollection;
    standalone?: boolean;
    reverse?: boolean;
}) {

    return (
        <section class={`z-1 border-black/10 dark:border-white/10 w-full mx-auto ${props.standalone ? "border-t py-36" : ""}`}>
            <header class="w-full z-1 text-black dark:text-white max-w-7xl mx-auto">
                <Show when={props.standalone}>
                    <div class="flex flex-col lg:flex-row pb-36 gap-12 justify-center items-center w-full">
                        <div class="flex flex-col lg:flex-row gap-6">
                            <div class="lg:border-r lg:pr-6 border-black/10 dark:border-white/10">
                                <img
                                    src={props.data.clientLogo}
                                    class="mx-auto brightness-0 dark:brightness-200 saturate-0 contrast-0 opacity-50 max-h-10 max-w-22"
                                    loading="lazy"
                                    alt={props.data.clientLogoAlt}
                                />
                            </div>
                            <A
                                href={`/projects/${props.data.slug}`}
                                class="w-full max-w-md lg:max-w-5xl hover:underline def__animate lg:text-left text-center"
                            >
                                <H2>{props.data.title}</H2>
                            </A>
                        </div>
                        <div class="group lg:max-w-md flex flex-col gap-3 text-black dark:text-white w-full border p-6 rounded-3xl shadow-[0px_9px_18px_0px_rgb(0,0,0,0.1)] dark:shadow-[0px_9px_18px_0px_rgb(0,0,0,0.25)] bg-white dark:bg-black/50 border-black/10 dark:border-white/5 dark:border-t-white">
                            <div class="text-black/20 w-fit dark:text-white/20 h-fit border-b border-b-black/10 dark:border-b-white/10 pb-1">
                                <ContainerLabel>Objective</ContainerLabel>
                            </div>
                            <p class="text-left text-black dark:text-white">
                                {props.data.projectObjective}
                            </p>
                            <div
                                class="opacity-50 group-hover:opacity-100 flex gap-1 justify-start items-center w-full overflow-x-auto scroll-smooth def__animate"
                                style="scrollbar-width: none;"
                            >
                                <For each={props.data.tags}>
                                    {(tag) => {
                                        return (
                                            <Tag href={`/projects?tags=${tag.replace(" ", "+")}`}>
                                                {tag}
                                            </Tag>
                                        );
                                    }}
                                </For>
                            </div>
                        </div>
                    </div>
                </Show>
            </header>
            <div
                class="z-1 w-full flex flex-col gap-18 justify-center items-center max-w-7xl mx-auto"
            >
                <Show when={props.standalone} fallback={<VideoPlayer video={props.data.mainKeypointMedia} />}>
                    <MediaScroller data={props.data}>
                        <article class="text-black dark:text-white w-fit dark:shadow-[0px_9px_18px_0px_rgb(0,0,0,0.25)] rounded-3xl p-6 items-center flex gap-6 flex-col-reverse lg:flex-row bg-neutral-100 dark:bg-black/50 border border-black/10 dark:border-white/5">
                            {/*
                    <div class="flex flex-col w-full lg:w-fit min-w-72 justify-center gap-3 border border-neutral-200 bg-neutral-50 dark:bg-neutral-800 dark:border-neutral-700 p-3 rounded-xl dark:shadow-[0px_9px_18px_0px_rgb(0,0,0,0.25)]">
                        <Metric icon="/MA_Icons25_Lightbulb.svg">
                            {props.data.mainKeypointMetricOne}
                        </Metric>
                        <Metric icon="/MA_Icons25_Lightbulb.svg">
                            {props.data.mainKeypointMetricTwo}
                        </Metric>
                    </div>
                    */}
                            <div class="max-w-3xl flex flex-col gap-3 justify-center">
                                <div class="text-black/20 w-fit dark:text-white/20 h-fit border-b border-b-black/10 dark:border-b-white/10 pb-1">
                                    <ContainerLabel>Strategy</ContainerLabel>
                                </div>
                                <p class="text-left text-black dark:text-white">
                                    {props.data.mainKeypointDescription}
                                </p>
                                <Show when={props.standalone}>
                                    <div class="w-full py-3">
                                        <LinkButton href={`/projects/${props.data.slug}`}>
                                            See Project
                                        </LinkButton>
                                    </div>
                                </Show>
                            </div>
                        </article>
                    </MediaScroller>
                </Show>

            </div>
        </section>
    );
}

const MediaScroller = (props: { data: PortfolioCollection, children: JSX.Element }) => {
    const { data } = props;
    const { projectKeypoints, mainKeypointFeatured } = data;
    const urls = [];
    for (const set of mainKeypointFeatured) {
        const [s1, s2] = set;
        urls.push(projectKeypoints[s1].media[s2].url);
    }

    let msGroup1!: HTMLDivElement, msGroup2!: HTMLDivElement;

    const MsMedia = (props: { class: string, src: string }) => {
        if (props.src.endsWith(".mp4")) {
            return (
                <video class={props.class} autoplay muted loop playsinline src={props.src}></video>
            );
        } else {
            return (
                <img class={props.class} src={props.src} />
            )
        }
    }

    onMount(() => {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                const { target } = entry;
                target.classList.toggle("scrolled", !entry.isIntersecting);
            })
        });

        observer.observe(msGroup1);
        observer.observe(msGroup2);
    })

    return (
        <div class="w-full flex gap-18 flex-col">
            <MsMedia class="aspect-video object-cover w-full max-w-5xl mx-auto rounded-lg" src={urls[0]} />
            <div ref={msGroup1} class="def__animate lg:pr-96 flex flex-col lg:flex-row justify-center lg:items-end gap-18 w-full">
                <MsMedia class="aspect-square object-cover max-h-54 rounded-lg -mb-12" src={urls[1]} />
                <MsMedia class="aspect-video object-cover max-h-72 rounded-lg" src={urls[2]} />
            </div>
            <div class="w-full flex justify-center">
                {props.children}
            </div>
            <div ref={msGroup2} class="def__animate lg:pl-96 flex flex-col lg:flex-row justify-center lg:items-start gap-18 w-full">
                <MsMedia class="aspect-video object-cover max-h-72 rounded-lg" src={urls[3]} />
                <MsMedia class="aspect-square object-cover max-h-54 rounded-lg -mt-12" src={urls[4]} />
            </div>
        </div>
    );
}