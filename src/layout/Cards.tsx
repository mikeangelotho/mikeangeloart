import { A } from "@solidjs/router";

export const Tag = (props: { children: string, href: string }) => {
  return (
    <A
      href={props.href}
      class="def__animate w-fit text-xs px-3 py-1 rounded-full text-nowrap bg-white/50 dark:bg-white/5 border dark:border-white/20 border-black/25 dark:text-white/20 text-black/50 hover:opacity-50 text-center"
    >
      {props.children}
    </A>
  );
};
