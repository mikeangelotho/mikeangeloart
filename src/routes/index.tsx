import {
  createSignal,
  For,
  lazy,
  onCleanup,
  onMount,
  Show,
  Suspense,
} from "solid-js";
import { PortfolioCollection } from "~/types";
import TeaserCollection from "~/components/TeaserCollection";
import { H2, SectionHeading } from "~/layout/Headings";
import SEO from "~/components/SEO";
import { Web3Form } from "~/components/Web3Form";
import { A, createAsync } from "@solidjs/router";
import PreviewProject from "~/components/PreviewProject";
import { Picture } from "~/components/Picture";
import { useLenis } from "~/components/LenisProvider";
import { fetchPortfolio } from "~/utils/portfolio";
import { fetchPersonalProjectTeasers } from "~/utils/content-database";

import { siteContent as site } from "~/content/site-content";

const landingHighlightLength = 3;

export default function Home() {
  var rawDate = new Date();
  var date = rawDate.toDateString();
  const [time, setTime] = createSignal(new Date().toLocaleTimeString());
  const [scroll, setScroll] = createSignal<number>(
    Math.round(Math.random() * 10),
  );
  let introPanel!: HTMLDivElement;
  let moreContainer!: HTMLDivElement;
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

  const portfolioCollection = createAsync(() => fetchPortfolio(), {
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
      revealObserver.observe(moreContainer);
      revealObserver.observe(contactContainer);
    }
    onCleanup(() => {
      unregister?.();
      window.removeEventListener("scroll", updateIntro);
      window.removeEventListener("scroll", updateNum);
      introPanel.removeEventListener("focusin", updateIntro);
      introPanel.removeEventListener("focusout", updateIntro);
      motionPreference.removeEventListener("change", updateIntro);
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
          <section class="bg-white/75 dark:bg-black/75 w-full">
            <SectionHeading>
              <div class="w-full flex flex-col">
                <div>{time()}</div>
                <div>{date}</div>
              </div>
              <div class="w-full text-right">{scroll()}</div>
            </SectionHeading>
          </section>
          <section class="w-full bg-white dark:bg-black py-4 sm:py-6">
            <Show when={portfolioCollection()}>
              <For each={portfolioCollection()}>
                {(collection, idx) =>
                  idx() < landingHighlightLength && (
                    <PreviewProject
                      data={collection}
                      reverse={idx() % 2 === 1}
                    />
                  )
                }
              </For>
            </Show>
          </section>
          <section class="w-full flex flex-col bg-white dark:bg-black">
            <div class="bg-black/3 dark:bg-white/3 w-full">
              <SectionHeading>More Portfolio Work</SectionHeading>
            </div>
            <div
              ref={moreContainer}
              class="fade__animate w-full flex flex-col gap-6 justify-center max-w-7xl mx-auto py-12 sm:py-16 px-6"
            >
              <Show when={portfolioCollection()}>
                <TeaserCollection
                  data={portfolioCollection() as PortfolioCollection[]}
                  limit={4}
                />
              </Show>
              <A
                href="/projects"
                class="inline-flex lg:mx-auto min-h-11 w-full lg:w-fit justify-center items-center gap-2 text-sm font-medium px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black hover:gap-3 transition-all duration-50 group/link mt-5"
              >
                View All Work
                <span class="font-normal group-hover/link:translate-x-1 transition-transform">
                  ⇢
                </span>
              </A>
            </div>
          </section>
          <section class="w-full bg-black/3 dark:bg-white/3 border-t border-black/10 dark:border-white/10">
            <div class="w-full grid items-center gap-6 max-w-7xl px-6 py-12 sm:py-16 mx-auto lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.5fr)] lg:gap-10">
              <div class="flex min-w-0 flex-col items-start gap-4">
                <p class="type-body text-black dark:text-white max-w-[40ch]">
                  I'm also working on a DAM app, a multiplayer game, and AI inference experiments.
                </p>
                <A
                  href="/personal"
                  class="inline-flex min-h-11 items-center shrink-0 text-center text-sm font-medium px-5 py-3 bg-black dark:bg-white text-white dark:text-black hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                  Explore Projects →
                </A>
              </div>
              <Show when={personalProjectTeasers()?.length}>
                <div
                  class="grid min-w-0 grid-cols-3 gap-3 sm:gap-4"
                  aria-label="Personal project previews"
                >
                  <For each={personalProjectTeasers()}>
                    {(project) => (
                      <A
                        href={`/personal#${project.id}`}
                        aria-label={`Explore ${project.title}`}
                        class="group min-w-0 focus-visible:outline-2 focus-visible:outline-offset-4"
                      >
                        <div class="relative aspect-16/10 overflow-hidden border border-black/10 bg-white transition-colors group-hover:border-black/30 dark:border-white/10 dark:bg-black dark:group-hover:border-white/40 [&>picture]:absolute [&>picture]:inset-0 [&>picture]:block [&>picture]:h-full [&>picture]:w-full">
                          <Picture
                            src={project.screenshot.src || ""}
                            alt={project.screenshot.alt}
                            width={project.screenshot.width}
                            height={project.screenshot.height}
                            class="block h-full w-full object-cover"
                          />
                        </div>
                        <span class="mt-2 flex items-center justify-between gap-1 text-xs font-semibold text-black dark:text-white sm:text-sm">
                          {project.title}
                          <span aria-hidden="true">↗</span>
                        </span>
                      </A>
                    )}
                  </For>
                </div>
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
