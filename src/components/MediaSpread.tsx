import { PortfolioCollection } from "~/types";
import MediaCluster from "./MediaCluster";
import { A } from "@solidjs/router";
import { JSXElement, onCleanup, onMount } from "solid-js";

export const MediaSpread = (props: {
  data: PortfolioCollection;
  children: JSXElement;
}) => {
  const { data } = props;
  const { projectKeypoints, mainKeypointFeatured } = data;
  const urls = [];
  for (const set of mainKeypointFeatured) {
    const [s1, s2] = set;
    urls.push(projectKeypoints[s1].media[s2].url);
  }

  let msGroups!: HTMLDivElement,
    msGroup1!: HTMLDivElement,
    msGroup2!: HTMLDivElement;

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

    fadeObserver.observe(msGroup1);
    fadeObserver.observe(msGroup2);

    onCleanup(() => {
      fadeObserver.disconnect();
    });
  });

  return (
    <div class="fade__animate w-full flex gap-6 flex-col">
      <A href={`/projects/${props.data.slug}`}>
        <MediaCluster
          class="hover:-translate-y-3 def__animate aspect-video object-cover w-full max-w-5xl mx-auto rounded-3xl border-6 border-neutral-200 dark:border-white/5"
          src={urls[0]}
        />
      </A>
      <div
        ref={msGroup1}
        class="fade__animate lg:pr-96 flex flex-col lg:flex-row justify-center lg:items-end gap-18 w-full"
      >
        <A href={`/projects/${props.data.slug}`}>
          <MediaCluster
            class="hover:-translate-y-3 def__animate w-full aspect-square object-cover max-h-96 lg:max-h-54 rounded-3xl border-6 border-neutral-200 dark:border-white/5 -mb-12"
            src={urls[1]}
          />
        </A>
        <A href={`/projects/${props.data.slug}`}>
          <MediaCluster
            class="hover:-translate-y-3 def__animate w-full aspect-video object-cover max-h-96 lg:max-h-54 rounded-3xl border-6 border-neutral-200 dark:border-white/5"
            src={urls[2]}
          />
        </A>
      </div>
      <div class="w-full flex justify-center py-18">{props.children}</div>
      <div
        ref={msGroup2}
        class="fade__animate lg:pl-96 flex flex-col lg:flex-row justify-center lg:items-start gap-18 w-full"
      >
        <A href={`/projects/${props.data.slug}`}>
          <MediaCluster
            class="hover:-translate-y-3 def__animate w-full aspect-video object-cover max-h-96 lg:max-h-54 rounded-3xl border-6 border-neutral-200 dark:border-white/5"
            src={urls[3]}
          />
        </A>
        <A href={`/projects/${props.data.slug}`}>
          <MediaCluster
            class="hover:-translate-y-3 def__animate w-full aspect-square object-cover max-h-96 lg:max-h-54 rounded-3xl border-6 border-neutral-200 dark:border-white/5 -mt-12"
            src={urls[4]}
          />
        </A>
      </div>
    </div>
  );
};