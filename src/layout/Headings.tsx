import { JSX } from "solid-js";

export const SectionHeading = (props: { children: string }) => {
  return (
    <h3 class="border-t border-b border-neutral-300 dark:border-neutral-900 py-6 flex justify-center items-center uppercase text-black/10 dark:text-white/10">
      {props.children}
    </h3>
  );
};

export const H1 = (props: { children: JSX.Element }) => {
  return (
    <h1 class="leading-tight text-4xl md:text-6xl text-black dark:text-white font-semibold">
      {props.children}
    </h1>
  );
};

export const H2 = (props: { class?: string, children: JSX.Element }) => {
  return (
    <h2 class={`font-semibold text-3xl text-black dark:text-white ${props.class}`}>
      {props.children}
    </h2>
  );
};

export const H3 = (props: { children: JSX.Element }) => {
  return (
    <h3 class="font-semibold text-black text-xl dark:text-white mb-2 line-clamp-2">
      {props.children}
    </h3>
  );
};
