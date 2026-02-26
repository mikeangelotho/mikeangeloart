import { A, useLocation } from "@solidjs/router";
import {
  createEffect,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import Icon from "~/components/Icon";
import ThemeToggle from "~/components/ThemeToggle";
import { useLenis } from "~/components/LenisProvider";

let links = [
  {
    label: "Portfolio",
    slug: "/projects",
  },
  {
    label: "About",
    slug: "/about",
  },
];

export default function Navbar() {
  let nav!: HTMLDivElement;
  let logoEl!: HTMLDivElement;
  let desktopMenu!: HTMLDivElement;
  let mobileMenuIcon!: HTMLButtonElement;
  const location = useLocation();

  const [showMobileMenu, setShowMobileMenu] = createSignal(false);

  function toggleMobileMenu() {
    setShowMobileMenu(!showMobileMenu());
  }

  createEffect(() => {
    document.body.classList.toggle("overflow-hidden", showMobileMenu());
  });

  let scrollHandler: ({ scroll }: { scroll: number }) => void;

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

    scrollHandler = ({ scroll }: { scroll: number }) => {
      if (scroll > 0) {
        nav.classList.remove("mix-blend-difference");
        nav.classList.add(...classNamesOnScroll);
        logoEl.classList.add("not-dark:invert");
      } else {
        nav.classList.remove(...classNamesOnScroll);
        logoEl.classList.remove("not-dark:invert");
        requestAnimationFrame(() => {
          nav.classList.add("mix-blend-difference");
        });
      }
    };

    const lenis = useLenis();
    createEffect(() => {
      const instance = lenis?.lenis();
      if (instance) {
        instance.on('scroll', scrollHandler);
        onCleanup(() => {
          instance.off('scroll', scrollHandler);
        });
      }
    });
  });
  return (
    <>
      <nav
        ref={nav}
        class="mix-blend-difference border border-transparent lg:rounded-3xl z-100 top-0 max-w-7xl inset-x-0 lg:mx-6 xl:mx-auto fixed transition-all duration-1500 ease-in-out"
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
              class="w-9 h-9"
              alt="Mike Angelo Logo"
            />
            <span class="font-sans text-xs tracking-[2px] text-white uppercase">
              Mike Angelo
            </span>
          </A>
          <div ref={desktopMenu} class="hidden lg:flex gap-6 items-center">
            <ul class="flex gap-6 items-center text-white">
              <For each={links}>
                {(link) => {
                  let listItem!: HTMLLIElement;

                  return (
                    <li ref={listItem}>
                      <A
                        class={`text-sm${location.pathname === link.slug ? " text-neutral-500 cursor-default" : " hover:underline"} `}
                        href={link.slug}
                      >
                        {link.label}
                      </A>
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
            class="cursor-pointer bg-white rounded-lg hover:scale-105 active:scale-95 min-h-12 min-w-12 md:p-3 def__animate lg:hidden flex items-center justify-center"
            onClick={() => {
              toggleMobileMenu(); 1
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
          <div class="flex flex-col gap-4 sm:gap-6 items-end px-6 sm:px-12 md:px-24">
            <ul class="flex flex-col gap-6 items-end">
              <For each={links}>
                {(link) => {
                  return (
                    <li class="hover:brightness-50 text-3xl sm:text-4xl text-black dark:text-white def__animate min-h-12 flex items-center">
                      <A
                        href={link.slug}
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
              <li class="not-dark:invert min-h-12 flex items-center">
                <Icon name="github" width={24} height={24} />
              </li>
              <li class="dark:invert max-w-24 min-h-12 flex items-center">
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
