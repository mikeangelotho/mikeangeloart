import { ContainerLabel, LinkButton, Tag } from "~/layout/Cards";
import { PortfolioCollection } from "./Collection";
import { For, Show } from "solid-js";
import { A } from "@solidjs/router";
import { H1 } from "~/layout/Headings";
import VideoPlayer from "./VideoPlayer";

export function MainKeypoint(props: {
    data: PortfolioCollection;
    standalone?: boolean;
    reverse?: boolean;
}) {

    return (
        <section class="z-1 w-full max-w-7xl mx-auto">
            <header class="w-full z-1 text-black dark:text-white">
                <div
                    class={`text-black/10 w-full dark:text-white/10 h-fit border-b border-b-black/10 dark:border-b-white/10 pb-1${!props.standalone ? " mb-6" : ""
                        }`}
                >
                    <ContainerLabel>Project Highlight</ContainerLabel>
                </div>
                <Show when={props.standalone}>
                    <div class="flex flex-col py-18 gap-18 justify-center items-center w-full max-w-5xl mx-auto">
                        <div class="flex flex-col gap-9 justify-center items-center w-full">
                            <div
                                class="w-full def__animate"
                            >
                                <img
                                    src={props.data.clientLogo}
                                    class="mx-auto brightness-0 dark:brightness-200 saturate-0 contrast-0 opacity-50 max-h-12 max-w-24"
                                    loading="lazy"
                                    alt={props.data.clientLogoAlt}
                                />
                            </div>
                            <A
                                href={`/projects/${props.data.slug}`}
                                class="w-full hover:opacity-50 def__animate text-center"
                            >
                                <H1>{props.data.title}</H1>
                            </A>
                        </div>
                        <div class="group max-w-3xl flex flex-col gap-3 text-black dark:text-white w-full border p-6 rounded-3xl dark:shadow-[0px_9px_18px_0px_rgb(0,0,0,0.25)] bg-neutral-100 dark:bg-neutral-900 border-black/10 dark:border-white/5 dark:border-t dark:border-t-white">
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
                class="z-1 w-full flex flex-col gap-18 justify-center items-center max-w-5xl mx-auto"
            >
                <div class="w-full rounded-3xl overflow-hidden ring ring-neutral-200 dark:ring-neutral-900">
                    <VideoPlayer video={props.data.mainKeypointMedia} />
                </div>
                <Show when={props.standalone}>
                    <div class="flex items-center p-3 gap-2 w-full border border-neutral-200 dark:border-neutral-900 rounded-3xl cursor-pointer overflow-auto" style="scrollbar-width: none;">
                        <For each={props.data.projectKeypoints}>
                            {(project) => {
                                return (
                                    <For each={project.media}>
                                        {(mediaObj) => {
                                            if (mediaObj.url.includes("mp4")) {
                                                return (
                                                    <A href={`/projects/${props.data.slug}`}>
                                                        <video src={mediaObj.url} autoplay muted loop playsinline class="h-24 min-w-24 object-cover rounded-xl"
                                                            title={mediaObj.altText}
                                                            aria-label={mediaObj.altText} />
                                                    </A>
                                                )
                                            } else {
                                                return (
                                                    <A href={`/projects/${props.data.slug}`}>
                                                        <img
                                                            class="h-24 min-w-24 object-cover rounded-xl"
                                                            src={mediaObj.url}
                                                            alt={mediaObj.altText}
                                                        />
                                                    </A>
                                                );
                                            }
                                        }}
                                    </For>
                                )
                            }}
                        </For>
                    </div>
                </Show>
                <article class="text-black dark:text-white w-fit dark:shadow-[0px_9px_18px_0px_rgb(0,0,0,0.25)] rounded-3xl p-6 items-center flex gap-6 flex-col-reverse lg:flex-row bg-neutral-100 dark:bg-neutral-900 border border-black/10 dark:border-white/5">
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
            </div>
        </section>
    );
}