import { A } from "@solidjs/router";
import { createEffect, createSignal, For, onMount, Show } from "solid-js";
import Icon from "~/components/Icon";
import ThemeToggle from "~/components/ThemeToggle";

let links = [
  {
    label: "Portfolio",
    url: "/projects",
  },
  {
    label: "About",
    url: "/about",
  },
];

export default function Navbar() {
  let nav!: HTMLDivElement;
  let logoEl!: HTMLDivElement;
  let desktopMenu!: HTMLDivElement;
  let mobileMenuIcon!: HTMLButtonElement;

  const [showMobileMenu, setShowMobileMenu] = createSignal(false);

  function toggleMobileMenu() {
    setShowMobileMenu(!showMobileMenu());
  }

  createEffect(() => {
    document.body.classList.toggle("overflow-hidden", showMobileMenu());
  });

  onMount(() => {
    const classNamesOnScroll = [
      "backdrop-blur-xl",
      "backdrop-brightness-120",
      "backdrop-saturate-200",
      "lg:mt-3",
      "lg:px-6",
      "lg:hover:translate-y-2",
      "dark:lg:border-white/10",
      "lg:border-black/5",
      "bg-white/50",
      "dark:bg-black/80",
    ];
    window.addEventListener("scroll", () => {
      const { scrollY } = window;
      if (scrollY > 0) {
        nav.classList.add(...classNamesOnScroll);
        nav.classList.remove("mix-blend-difference");
        logoEl.classList.add("not-dark:invert");
      } else {
        nav.classList.remove(...classNamesOnScroll);
        setTimeout(() => {
          nav.classList.add("mix-blend-difference");
        }, 1000);
        logoEl.classList.remove("not-dark:invert");
      }
    });
  });
  return (
    <>
      <nav
        ref={nav}
        class="mix-blend-difference border border-transparent lg:rounded-3xl z-100 top-0 max-w-7xl inset-x-0 lg:mx-6 xl:mx-auto fixed nav__animate"
      >
        <div
          ref={logoEl}
          class="flex justify-between items-center px-4 sm:px-6 lg:px-0 py-4 sm:py-6 w-full"
        >
          <A
            href="/"
            class="font-sans flex items-center gap-3 hover:brightness-50 def__animate"
          >
            <img
              src="https://cdn.mikeangelo.art/MA_Logo_SharpMA_White.svg"
              loading="eager"
              width="32"
              height="auto"
              class="w-12 h-12 sm:w-12 sm:h-12"
              alt="Mike Angelo Logo"
            />
            <span class="font-sans text-xs tracking-[2px] text-white uppercase">
              Mike Angelo
            </span>
          </A>
          <div ref={desktopMenu} class="hidden lg:flex gap-6 items-center">
            <ul class="flex gap-6 items-center">
              <For each={links}>
                {(link) => {
                  return (
                    <li class="hover:brightness-50 text-white text-sm def__animate">
                      <A href={link.url}>{link.label}</A>
                    </li>
                  );
                }}
              </For>
              <li>
                <Icon name="github" width={20} height={20} />
              </li>
              <li class="dark:invert">
                <ThemeToggle
                  onClick={() => {
                    setShowMobileMenu(false);
                  }}
                />
              </li>
            </ul>
          </div>
          <button
            ref={mobileMenuIcon}
            class="cursor-pointer bg-white rounded-lg hover:scale-105 active:scale-95 min-h-8 min-w-8 md:p-3 def__animate lg:hidden flex items-center justify-center"
            onClick={() => {
              toggleMobileMenu();
            }}
            aria-label="Toggle navigation menu"
            aria-expanded={showMobileMenu()}
          >
            <Icon name="terminal" width={24} height={24} />
          </button>
        </div>
      </nav>
      <Show when={showMobileMenu()}>
        <div class="overflow-none z-20 pt-[20vh] sm:pt-[30vh] fixed w-screen h-screen bg-white/98 dark:bg-black/97">
          <div class="flex flex-col gap-4 sm:gap-6 items-center sm:items-end px-6 sm:px-12 md:px-24">
            <ul class="flex flex-col gap-6 items-center sm:items-end">
              <For each={links}>
                {(link) => {
                  return (
                    <li class="hover:brightness-50 text-3xl sm:text-4xl text-black dark:text-white def__animate py-2">
                      <A
                        href={link.url}
                        onClick={() => {
                          if (showMobileMenu()) {
                            setShowMobileMenu(false);
                          }
                        }}
                      >
                        {link.label}
                      </A>
                    </li>
                  );
                }}
              </For>
              <li class="not-dark:invert">
                <Icon name="github" width={24} height={24} />
              </li>
              <li class="dark:invert">
                <ThemeToggle
                  onClick={() => {
                    setShowMobileMenu(false);
                  }}
                />
              </li>
            </ul>
          </div>
        </div>
      </Show>
    </>
  );
}
