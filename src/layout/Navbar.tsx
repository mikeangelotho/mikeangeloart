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

const links = [
  { label: "Portfolio", slug: "/projects" },
  { label: "Projects", slug: "/personal" },
  { label: "About", slug: "/about" },
];

export default function Navbar() {
  let nav!: HTMLElement;
  let logoEl!: HTMLDivElement;
  let menuButton!: HTMLButtonElement;
  let menuDialog: HTMLDialogElement | undefined;
  let wordmark!: HTMLSpanElement;
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = createSignal(false);

  onMount(() => {
    const scrollClasses = [
      "backdrop-blur-xl",
      "backdrop-brightness-120",
      "backdrop-saturate-200",
      "lg:mt-3",
      "lg:hover:translate-y-1",
      "dark:lg:border-white/10",
      "lg:border-black/5",
      "bg-white/50",
      "dark:bg-black/80",
      "lg:max-w-xl",
    ];
    let scrollFrame = 0;
    const updateNav = () => {
      scrollFrame = 0;
      const scrolled = window.scrollY > 200;
      nav.classList.toggle("mix-blend-difference", !scrolled);
      logoEl.classList.toggle("not-dark:invert", scrolled);
      logoEl.classList.toggle("px-4", scrolled);
      logoEl.classList.toggle("my-4", !scrolled);
      wordmark.classList.toggle("opacity-0", scrolled);
      scrollClasses.forEach((name) => nav.classList.toggle(name, scrolled));
    };
    const handleScroll = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updateNav);
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const handleResize = () => {
      if (desktop.matches) setShowMobileMenu(false);
    };
    updateNav();
    window.addEventListener("scroll", handleScroll, { passive: true });
    desktop.addEventListener("change", handleResize);

    createEffect(() => {
      location.pathname;
      setShowMobileMenu(false);
    });

    createEffect(() => {
      if (!showMobileMenu()) return;
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      queueMicrotask(() => {
        if (!showMobileMenu() || !menuDialog?.isConnected) return;
        menuDialog.showModal();
        menuDialog.querySelector<HTMLAnchorElement>("ul a")?.focus();
      });
      onCleanup(() => {
        menuDialog?.close();
        document.body.style.overflow = previousOverflow;
        if (menuButton?.isConnected && !desktop.matches) menuButton.focus();
      });
    });

    onCleanup(() => {
      cancelAnimationFrame(scrollFrame);
      window.removeEventListener("scroll", handleScroll);
      desktop.removeEventListener("change", handleResize);
    });
  });

  return (
    <>
      <nav
        ref={nav}
        aria-label="Main navigation"
        class="mix-blend-difference border border-transparent z-100 top-0 max-w-7xl inset-x-0 mx-auto fixed transition-all duration-1500 ease-in-out"
      >
        <div
          ref={logoEl}
          class="flex justify-between items-center py-2 w-full transition-all duration-1500 ease-in-out my-4 not-xl:px-4"
        >
          <A
            href="/"
            aria-label="Mike Angelo home"
            class="group font-sans flex items-center min-h-11 gap-3"
          >
            <img
              src="https://cdn.mikeangelo.art/MA_Logo_SharpMA_White.svg"
              loading="eager"
              width="36"
              height="36"
              class="w-9 h-9"
              alt=""
            />
            <span
              ref={wordmark}
              aria-hidden="true"
              class="font-sans text-xs tracking-[2px] group-hover:opacity-100 group-focus-visible:opacity-100 def__animate text-white uppercase"
            >
              Mike Angelo
            </span>
          </A>
          <div class="hidden lg:flex gap-6 items-center">
            <ul class="flex gap-3 items-center text-white">
              <For each={links}>
                {(link) => (
                  <li>
                    <A
                      class={`block px-2 py-1 text-sm transition-colors hover:bg-white hover:text-black ${
                        location.pathname === link.slug
                          ? "border-b border-white/20"
                          : ""
                      }`}
                      aria-current={
                        location.pathname === link.slug ? "page" : undefined
                      }
                      href={link.slug}
                    >
                      {link.label}
                    </A>
                  </li>
                )}
              </For>
              <li>
                <Icon name="github" width={20} height={20} />
              </li>
            </ul>
          </div>
          <button
            ref={menuButton}
            type="button"
            class="cursor-pointer border border-white text-sm font-bold text-white min-h-11 min-w-11 def__animate lg:hidden flex items-center justify-center"
            onClick={() => setShowMobileMenu((open) => !open)}
            aria-label="Toggle navigation menu"
            aria-expanded={showMobileMenu()}
            aria-controls="mobile-navigation"
          >
            <span aria-hidden="true">⩱</span>
          </button>
        </div>
      </nav>
      <Show when={showMobileMenu()}>
        <dialog
          ref={menuDialog}
          id="mobile-navigation"
          aria-label="Navigation menu"
          onCancel={(event) => {
            event.preventDefault();
            setShowMobileMenu(false);
          }}
          class="fixed inset-0 m-0 w-screen h-dvh max-w-none max-h-none border-0 p-0 bg-white dark:bg-black text-black dark:text-white overflow-y-auto"
          data-lenis-prevent
        >
          <button
            type="button"
            class="absolute right-4 sm:right-6 top-4 sm:top-6 min-h-11 min-w-11 border border-current text-xl flex items-center justify-center cursor-pointer"
            aria-label="Close navigation menu"
            onClick={() => setShowMobileMenu(false)}
          >
            <span aria-hidden="true">×</span>
          </button>
          <div class="pt-[20vh] sm:pt-[30vh] pb-12 flex flex-col gap-4 sm:gap-6 items-end px-6 sm:px-12 md:px-24">
            <ul class="flex flex-col gap-6 items-end">
              <For each={links}>
                {(link) => (
                  <li class="type-title text-right">
                    <A
                      class="inline-flex min-h-12 items-center hover:underline"
                      href={link.slug}
                      aria-current={
                        location.pathname === link.slug ? "page" : undefined
                      }
                      onClick={() => setShowMobileMenu(false)}
                    >
                      {link.label}
                    </A>
                  </li>
                )}
              </For>
              <li class="not-dark:invert">
                <Icon name="github" width={24} height={24} />
              </li>
              <li class="dark:invert">
                <ThemeToggle onClick={() => setShowMobileMenu(false)} />
              </li>
            </ul>
          </div>
        </dialog>
      </Show>
    </>
  );
}
