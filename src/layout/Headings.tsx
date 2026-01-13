import { JSX } from "solid-js";

export const H1 = (props: { children: JSX.Element }) => {
  return (
    <h1 class="leading-tight text-4xl md:text-6xl text-black dark:text-white font-semibold">
      {props.children}
    </h1>
  );
};

export const H2 = (props: { children: JSX.Element }) => {
  return <h2 class="font-semibold text-3xl text-black dark:text-white">{props.children}</h2>;
};

export const H3 = (props: { children: JSX.Element }) => {
  return <h3 class="font-semibold text-black text-xl dark:text-white mb-2 line-clamp-2">{props.children}</h3>;
};