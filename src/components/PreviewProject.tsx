import { ContainerLabel, LinkButton, Tag } from "~/layout/Cards";
import { PortfolioCollection } from "~/types";
import { For,  onCleanup, onMount } from "solid-js";
import { A } from "@solidjs/router";
import { H2 } from "~/layout/Headings";
import { MediaSpread } from "./MediaSpread";

export function PreviewProject(props: {
  data: PortfolioCollection;
  reverse?: boolean;
}) {
  let objectiveContainer!: HTMLDivElement;

  onMount(() => {
    const fadeObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          const { target } = entry;
          target.classList.toggle("translate-y-9", !entry.isIntersecting);
          target.classList.toggle("scrolled", !entry.isIntersecting);
          if (entry.isIntersecting) observer.unobserve(target);
        });
      },
      { threshold: 0.1 },
    );

    fadeObserver.observe(objectiveContainer);

    onCleanup(() => {
      fadeObserver.disconnect();
    });
  });

  return (
    <section class="px-6 z-1 border-b-36 border-neutral-100 dark:border-neutral-950 w-full mx-auto py-36">
      <header class="w-full z-1 text-black dark:text-white max-w-7xl mx-auto">
        <div class="flex flex-col lg:flex-row pb-36 gap-12 justify-center items-center w-full">
          <div class="flex flex-col items-center lg:flex-row gap-3">
            <div class="lg:border-r lg:pr-3 border-black/10 dark:border-white/10">
              <img
                src={props.data.clientLogo}
                class="mx-auto brightness-0 dark:brightness-200 saturate-0 contrast-0 opacity-50 max-h-8 max-w-18"
                loading="lazy"
                alt={props.data.clientLogoAlt}
              />
            </div>
            <A
              href={`/projects/${props.data.slug}`}
              class="w-full hover:underline def__animate lg:text-left text-center"
            >
              <H2>{props.data.title}</H2>
            </A>
          </div>
          <article
            ref={objectiveContainer}
            class="fade__animate group max-w-3xl text-black dark:text-white shadow-[0px_9px_18px_0px_rgb(0,0,0,0.1)] dark:shadow-[0px_9px_18px_0px_rgb(0,0,0,0.25)] rounded-3xl p-6 items-center flex gap-6 flex-col-reverse lg:flex-row bg-neutral-100 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-900 dark:border-t dark:border-t-white"
          >
            <div class="max-w-3xl flex items-center justify-center">
              {/*<div class="border-r border-black/10 dark:border-white/10 pr-6">dsasdsad</div>*/}
              <div class="pl-6 flex flex-col gap-3 justify-center">
                <div class="text-black/20 w-fit dark:text-white/20 h-fit border-b border-b-black/10 dark:border-b-white/10 pb-1 ">
                  <ContainerLabel>Objective</ContainerLabel>
                </div>
                <p class="text-left text-black dark:text-white">
                  {props.data.projectObjective}
                </p>
                <div
                  class="w-full max-w-72 sm:max-w-md lg:max-w-xl opacity-50 group-hover:opacity-100 flex gap-1 justify-start items-center overflow-x-auto scroll-smooth def__animate"
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
          </article>
        </div>
      </header>
      <div class="z-1 w-full flex flex-col gap-36 justify-center items-center max-w-7xl mx-auto">
        <MediaSpread data={props.data}>
          <article class="text-black max-w-3xl dark:text-white shadow-[0px_9px_18px_0px_rgb(0,0,0,0.1)] dark:shadow-[0px_9px_18px_0px_rgb(0,0,0,0.25)] rounded-3xl p-6 items-center flex gap-6 flex-col-reverse lg:flex-row bg-neutral-100 dark:bg-neutral-950 border border-black/10 dark:border-white/5 dark:border-t dark:border-t-white">
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
            <div class="max-w-3xl flex items-center justify-center">
              {/*<div class="border-r border-black/10 dark:border-white/10 pr-6">dsasdsad</div>*/}
              <div class="pl-6 flex flex-col gap-3 justify-center">
                <div class="text-black/20 w-fit dark:text-white/20 h-fit border-b border-b-black/10 dark:border-b-white/10 pb-1 ">
                  <ContainerLabel>Strategy</ContainerLabel>
                </div>
                <p class="text-left text-black dark:text-white">
                  {props.data.mainKeypointDescription}
                </p>
              </div>
            </div>
          </article>
        </MediaSpread>
        <div class="fade__animate">
          <LinkButton href={`/projects/${props.data.slug}`}>
            See Full Project
          </LinkButton>
        </div>
      </div>
    </section>
  );
}

export default PreviewProject;
