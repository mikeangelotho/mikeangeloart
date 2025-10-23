import { A } from "@solidjs/router";
import { For, onMount } from "solid-js";

let links = [
  {
    label: "Work",
    url: "/projects",
  },
  {
    label: "About",
    url: "/about",
  },
];

export default function Navbar() {
  onMount(() => {
    const { pathname } = window.location;

    const nav = document.querySelector("nav") as HTMLElement;

    const classNamesOnScroll = [
      "backdrop-blur-xl",
      "backdrop-brightness-10",
      "md:backdrop-brightness-150",
      "shadow-[0px_6px_6px_-3px_rgba(0,0,0,5%)]",
      "lg:shadow-[0px_-6px_6px_-4px_rgba(0,0,0,5%)]",
      "lg:mt-3",
      "lg:px-6",
      "lg:hover:translate-y-2",
      "lg:border-t",
      "lg:border-t-white/10"
    ];
    window.addEventListener("scroll", () => {
      const { scrollY } = window;
      if (scrollY > 0) {
        nav.classList.add(...classNamesOnScroll);
      } else {
        nav.classList.remove(...classNamesOnScroll);
      }
    });
  });
  return (
    <nav class="mix-blend-difference lg:rounded-3xl z-10 top-0 max-w-7xl inset-x-0 lg:mx-6 xl:mx-auto fixed nav__animate">
      <div class="flex justify-between items-center px-6 lg:px-0 py-6 w-full">
        <A
          href=""
          class="flex items-center gap-3 hover:brightness-50 def__animate"
        >
          <img src="/MA_26Logo.svg" loading="eager" width="36" height="auto" />
          <span class="leading-4 text-xs tracking-[3px] text-white uppercase">
            Mike
            <br />
            Angelo
          </span>
        </A>
        {/*<div class="flex gap-12 items-center">
          <ul class="hidden sm:flex gap-6 items-center">
            <For each={links}>
              {(link) => {
                return (
                  <li class="hover:brightness-50 text-white text-sm def__animate">
                    <A href={link.url}>{link.label}</A>
                  </li>
                );
              }}
            </For>
          </ul>
        </div>*/}
      </div>
    </nav>
  );
}
