import { A } from "@solidjs/router";
import { createEffect, createSignal, For, onMount, Show } from "solid-js";

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
  let mobileMenuIcon!: HTMLDivElement;

  const [darkMode, setDarkMode] = createSignal(false);

  function checkDarkMode() {
    if (document.documentElement.classList.contains("dark")) {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  }

  const ThemeToggle = () => {
    return (
      <span
        class="cursor-pointer select-none invert"
        onClick={(e) => {
          if (darkMode()) {
            e.target.innerHTML = "☀️";
            document.documentElement.classList.remove("dark");
            setDarkMode(false);
          } else {
            e.target.innerHTML = "🌙";
            document.documentElement.classList.add("dark");
            setDarkMode(true);
          }
        }}
      >
        {darkMode() ? "🌙" : "☀️"}
      </span>
    )
  }

  const [showMobileMenu, setShowMobileMenu] = createSignal(false);

  function toggleMobileMenu() {
    setShowMobileMenu(!showMobileMenu());
  }

  createEffect(() => {
    checkDarkMode();
    if (showMobileMenu()) {
      document.body.style.overflow = "hidden";
      document.addEventListener("click", toggleMobileMenu)
    } else {
      document.body.style.overflow = "auto";
      document.removeEventListener("click", toggleMobileMenu)

    }
  })

  onMount(() => {
    checkDarkMode();

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
      "dark:bg-black/80"
    ];
    window.addEventListener("scroll", () => {
      const { scrollY } = window;
      if (scrollY > 0) {
        nav.classList.add(...classNamesOnScroll);
        nav.classList.remove("mix-blend-difference");
        logoEl.classList.add("not-dark:invert");
      } else {
        nav.classList.remove(...classNamesOnScroll);
        nav.classList.add("mix-blend-difference");
        logoEl.classList.remove("not-dark:invert");
      }
    });

    function handleResize() {
      const { innerWidth } = window;

      if (innerWidth < 768) {
        desktopMenu.style.display = "none";
        mobileMenuIcon.style.display = "block";
      } else {
        desktopMenu.style.display = "flex";
        mobileMenuIcon.style.display = "none";
      }
    }
    window.addEventListener("resize", handleResize);
    handleResize();

  });
  return (
    <>
      <nav ref={nav} class="mix-blend-difference border border-transparent lg:rounded-3xl z-100 top-0 max-w-7xl inset-x-0 lg:mx-6 xl:mx-auto fixed nav__animate">
        <div ref={logoEl} class="flex justify-between items-center px-6 lg:px-0 py-6 w-full">
          <A
            href="/"

            class="flex items-center gap-3 hover:brightness-50 def__animate"
          >
            <img src="/MA_26Logo.svg" loading="eager" width="36" height="auto" />
            <span class="leading-4 text-xs tracking-[3px] text-white uppercase">
              Mike
              <br />
              Angelo
            </span>
          </A>
          <div ref={desktopMenu} class="gap-6 items-center">
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
            </ul>
            <ThemeToggle />
          </div>
          <div ref={mobileMenuIcon} class="bg-white cursor-pointer hover:scale-105 def__animate hidden text-3xl text-black pb-2 mb-1 px-3" onClick={() => {
            toggleMobileMenu();
          }}>
            ⩩
          </div>
        </div>
      </nav>
      <Show when={showMobileMenu()}>
        <div class="overflow-none z-5 pt-[30vh] fixed w-screen h-screen bg-white/98 dark:bg-black/95">
          <div class="flex flex-col gap-6 items-end px-24">
            <ul class="flex flex-col gap-6 items-center">
              <For each={links}>
                {(link) => {
                  return (
                    <li class="hover:brightness-50 text-4xl text-black dark:text-white def__animate">
                      <A href={link.url}>{link.label}</A>
                    </li>
                  );
                }}
              </For>
            </ul>
            <ThemeToggle />
          </div></div>
      </Show>
    </>
  );
}

