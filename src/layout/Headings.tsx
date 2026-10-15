import { JSX, JSXElement } from "solid-js";

export const SectionHeading = (props: { children: JSXElement }) => {
  return (
    <h2 class="type-section-label border-t border-b border-black/15 dark:border-white/15 px-6 py-4 text-black/65 dark:text-white/65">
      <div class="opacity-25 max-w-7xl mx-auto flex justify-center items-center">
        {props.children}
      </div>
    </h2>
  );
};

export const H1 = (props: { children: JSX.Element }) => {
  return (
    <h1 class="type-display text-black dark:text-white">{props.children}</h1>
  );
};

export const H2 = (props: {
  class?: string;
  compact?: boolean;
  children: JSX.Element;
}) => {
  return (
    <h2
      class={`${props.compact ? "type-heading" : "type-title"} text-black dark:text-white ${props.class || ""}`}
    >
      {props.children}
    </h2>
  );
};

export const H3 = (props: { children: JSX.Element }) => {
  return (
    <h3 class="type-card-title text-black dark:text-white mb-2 line-clamp-2">
      {props.children}
    </h3>
  );
};
