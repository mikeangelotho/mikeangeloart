import {
  createSignal,
  For,
  lazy,
  onCleanup,
  onMount,
  Show,
  Suspense,
} from "solid-js";
import PortfolioMosaic from "~/components/PortfolioMosaic";
import { H2 } from "~/layout/Headings";
import SEO from "~/components/SEO";
import ActionIcon from "~/components/ActionIcon";
import { Web3Form } from "~/components/Web3Form";
import { A, createAsync } from "@solidjs/router";
import { Picture } from "~/components/Picture";
import { useLenis } from "~/components/LenisProvider";
import { fetchPersonalProjectTeasers, fetchPortfolioMosaic } from "~/utils/content-database";

import { siteContent as site } from "~/content/site-content";

export default function Home() {
  var rawDate = new Date();
  var date = rawDate.toDateString();
  const [time, setTime] = createSignal(new Date().toLocaleTimeString());
  const [motionPlaying, setMotionPlaying] = createSignal(false);
  const [scroll, setScroll] = createSignal<number>(
    Math.round(Math.random() * 10),
  );
  let introPanel!: HTMLDivElement;
  let contactContainer!: HTMLDivElement;

  function getUTCTime() {
    requestAnimationFrame(() => {
      setTime(new Date().toLocaleTimeString());
      requestAnimationFrame(getUTCTime);
    });
  }

  const LottieAnim = lazy(() => import("../components/LottieAnim"));
  const BgGradient = lazy(() => import("../components/BgGradient"));
  const Panel3d = lazy(() => import("../components/Panel3d"));

  const portfolioItems = createAsync(() => fetchPortfolioMosaic(), {
    deferStream: true,
  });
  const personalProjectTeasers = createAsync(
    () => fetchPersonalProjectTeasers(),
    { deferStream: true },
  );
  const lenis = useLenis();

  onMount(() => {
    getUTCTime();
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const updateMotion = () => setMotionPlaying(!motionPreference.matches);
    updateMotion();
    const updateIntro = () => {
      const scroll = Math.max(0, window.scrollY);
      const keyboardFocused = !!introPanel.querySelector("a:focus-visible");
      const progress = keyboardFocused ? 0 : Math.min(1, scroll / 360);
      introPanel.style.setProperty("--intro-progress", `${progress}`);
      introPanel.inert = progress === 1;
      introPanel.style.setProperty(
        "--scroll-y",
        motionPreference.matches || keyboardFocused ? "0px" : `${scroll}px`,
      );
    };
    const unregister = lenis?.registerCallback(updateIntro);
    const updateNum = () => setScroll(Math.round(window.scrollY * 100));
    window.addEventListener("scroll", updateIntro, { passive: true });
    window.addEventListener("scroll", updateNum);
    introPanel.addEventListener("focusin", updateIntro);
    introPanel.addEventListener("focusout", updateIntro);
    motionPreference.addEventListener("change", updateIntro);
    motionPreference.addEventListener("change", updateMotion);
    updateIntro();

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        for (const entry of entries) {
          const element = entry.target as HTMLElement;
          if (entry.isIntersecting || motionPreference.matches) {
            element.classList.remove("scrolled", "translate-y-9");
            observer.unobserve(element);
          } else {
            element.classList.add("scrolled", "translate-y-9");
          }
        }
      },
      { threshold: 0.1 },
    );
    if (!motionPreference.matches) {
      revealObserver.observe(contactContainer);
    }
    onCleanup(() => {
      unregister?.();
      window.removeEventListener("scroll", updateIntro);
      window.removeEventListener("scroll", updateNum);
      introPanel.removeEventListener("focusin", updateIntro);
      introPanel.removeEventListener("focusout", updateIntro);
      motionPreference.removeEventListener("change", updateIntro);
      motionPreference.removeEventListener("change", updateMotion);
      revealObserver.disconnect();
    });
  });

  return (
    <>
      <SEO
        title={`${site.name} | ${site.role}`}
        description={site.description}
        canonical={site.url}
        ogImage={site.ogImage}
        localBusiness={true}
        organization={true}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: site.name,
          jobTitle: site.role,
          description: site.description,
          url: site.url,
          address: {
            "@type": "PostalAddress",
            addressRegion: "NJ",
            addressCountry: "US",
          },
          knowsAbout: [
            "Art Direction",
            "Web Design",
            "Advertising Campaigns",
            "Content Creation",
            "Web Development",
          ],
        }}
      />
      <main class="w-full relative flex flex-col justify-center items-center">
        <section
          aria-hidden="true"
          class="pointer-events-none w-full home-intro-height fixed top-0 left-0 fade__animate -z-10"
        >
          <Suspense>
            <div class="fade__animate home-intro-height w-full flex justify-center items-center">
              <Panel3d model="https://cdn.mikeangelo.art/MA_Logo_3D.glb" />
            </div>
            <BgGradient />
            <LottieAnim url="https://cdn.mikeangelo.art/anim.json" />
          </Suspense>
        </section>
        <div
          aria-hidden="true"
          class="pointer-events-none w-full home-intro-height"
        />
        <section class="pointer-events-none px-6 z-0 fixed top-0 left-0 overflow-hidden perspective-normal mix-blend-difference home-intro-height w-full flex justify-center items-center">
          <article
            ref={introPanel}
            class="home-intro-copy pointer-events-auto select-text w-full max-w-7xl mx-auto"
          >
            <div class="text-white flex flex-col gap-4 justify-center text-left w-full max-w-2xl">
              <h1 class="type-display">Multimedia Designer & Art Director</h1>
              <p class="type-intro transition-opacity duration-100 ease-out max-w-[48ch]">
                I design{" "}
                <A
                  href="/projects?tags=Art+Direction"
                  class="underline underline-offset-4 hover:opacity-70"
                >
                  multi-channel advertising campaigns
                </A>
                ,{" "}
                <A
                  href="/projects?tags=Web+Design"
                  class="underline underline-offset-4 hover:opacity-70"
                >
                  interactive websites
                </A>
                ,{" "}
                <A
                  href="/projects?tags=Motion+Design%2CVideo+Editing"
                  class="underline underline-offset-4 hover:opacity-70"
                >
                  video & motion edits
                </A>
                , and{" "}
                <A
                  href="/personal"
                  class="underline underline-offset-4 hover:opacity-70"
                >
                  other digital projects
                </A>
                .
              </p>
            </div>
          </article>
        </section>

        <div class="z-2 w-full">
          <div class="w-full border-y border-black/15 bg-white/75 px-4 dark:border-white/15 dark:bg-black/75 sm:px-6">
            <div class="mx-auto flex max-w-7xl items-center gap-4 py-2">
              <div class="type-section-label flex min-w-0 flex-1 items-center justify-between gap-4 py-2 text-black/65 dark:text-white/65">
                <div class="flex flex-col opacity-25">
                  <span>{time()}</span>
                  <span>{date}</span>
                </div>
                <span class="opacity-25">{scroll()}</span>
              </div>
              <Show when={portfolioItems()?.some((item) => item.type === "video")}>
                <button
                  type="button"
                  aria-controls="portfolio-mosaic"
                  aria-label={motionPlaying() ? "Pause portfolio videos" : "Play portfolio videos"}
                  title={motionPlaying() ? "Pause portfolio videos" : "Play portfolio videos"}
                  onClick={() => setMotionPlaying((playing) => !playing)}
                  class="inline-flex min-h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center border-l border-black/15 text-black/65 hover:text-black dark:border-white/15 dark:text-white/65 dark:hover:text-white"
                >
                  <ActionIcon name={motionPlaying() ? "pause" : "play"} size={16} />
                </button>
              </Show>
            </div>
          </div>
          <section aria-label="Selected projects" class="w-full bg-white dark:bg-black px-2 pt-2 pb-12 sm:px-4 sm:pt-4 sm:pb-16">
            <Show when={portfolioItems()}>
              {(items) => <PortfolioMosaic items={items()} autoplay={motionPlaying()} />}
            </Show>
            <div class="flex justify-center mt-8">
              <A
                href="/projects"
                class="inline-flex lg:mx-auto min-h-11 w-full lg:w-fit justify-center items-center gap-2 text-sm font-medium px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black hover:gap-3 transition-all duration-50 group/link mt-5"
              >
                View All Work
                <ActionIcon name="arrow-right" class="group-hover/link:translate-x-1 transition-transform" />
              </A>
            </div>
          </section>
          <section aria-labelledby="home-projects-heading" class="w-full bg-black/3 dark:bg-white/3 border-t border-black/10 dark:border-white/10 text-black dark:text-white">
            <div class="mx-auto w-full max-w-7xl px-6 py-12 sm:py-16">
              <header class="mb-5 flex items-center justify-between gap-4 sm:mb-6">
                <h2 id="home-projects-heading" class="type-heading">Side Projects</h2>
                <A
                  href="/personal"
                  class="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm underline decoration-black/25 underline-offset-4 transition-colors hover:decoration-black focus-visible:outline-2 focus-visible:outline-offset-4 dark:decoration-white/25 dark:hover:decoration-white"
                >
                  View projects <ActionIcon name="arrow-right" size={16} />
                </A>
              </header>
              <Show when={personalProjectTeasers()?.length}>
                <ul
                  class="grid min-w-0 border-t border-black/15 dark:border-white/15 md:grid-cols-3 md:gap-6 md:border-t-0"
                  aria-label="Personal project previews"
                >
                  <For each={personalProjectTeasers()}>
                    {(project) => (
                      <li class="min-w-0">
                        <A
                          href={`/personal#${project.id}`}
                          aria-label={`Explore ${project.title}`}
                          aria-describedby={`home-project-summary-${project.id}`}
                          class="group grid min-w-0 grid-cols-[7.5rem_minmax(0,1fr)_auto] items-center gap-4 border-b border-black/15 py-4 transition-colors hover:border-black/50 focus-visible:outline-2 focus-visible:outline-offset-4 dark:border-white/15 dark:hover:border-white/50 sm:grid-cols-[10rem_minmax(0,1fr)_auto] md:grid-cols-[minmax(0,1fr)_auto] md:gap-x-3 md:gap-y-4 md:pt-0 md:pb-5"
                        >
                          <div class="relative aspect-16/10 w-full overflow-hidden border border-black/10 bg-black/3 transition-colors group-hover:border-black/30 dark:border-white/10 dark:bg-white/3 dark:group-hover:border-white/40 md:col-span-2 [&>picture]:absolute [&>picture]:inset-0 [&>picture]:block [&>picture]:h-full [&>picture]:w-full">
                            <Picture
                              src={project.screenshot.src || ""}
                              alt={project.screenshot.alt}
                              width={project.screenshot.width}
                              height={project.screenshot.height}
                              class="block h-full w-full object-cover object-top motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.02]"
                            />
                          </div>
                          <div class="min-w-0">
                            <h3 class="type-card-title break-words">{project.title}</h3>
                            <p id={`home-project-summary-${project.id}`} class="mt-1 line-clamp-3 text-sm leading-snug text-black/65 dark:text-white/65">
                              {project.summary}
                            </p>
                          </div>
                          <ActionIcon name="arrow-up-right" size={20} class="motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5" />
                        </A>
                      </li>
                    )}
                  </For>
                </ul>
              </Show>
            </div>
          </section>
          <section class="py-16 sm:py-24 border-t border-black/10 dark:border-white/10 w-full bg-white dark:bg-black">
            <div
              ref={contactContainer}
              class="fade__animate flex flex-col lg:flex-row gap-8 lg:gap-12 items-center px-6 mx-auto max-w-7xl w-full"
            >
              <div class="flex flex-col gap-3 lg:max-w-md">
                <H2>Let's get to work.</H2>
                <p class="type-body max-w-[45ch] text-black dark:text-white">
                  I'm always looking for new opportunities, collaborations, and potential roles.
                </p>
              </div>
              <Web3Form />
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
