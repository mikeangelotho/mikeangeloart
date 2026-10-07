import { For, lazy, onCleanup, onMount, Show, Suspense } from "solid-js";
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
import { fetchPersonalProjectTeasers, fetchSiteContent } from "~/utils/content-database";

const landingHighlightLength = 3;

export default function Home() {
  let introPanel!: HTMLDivElement;
  let moreContainer!: HTMLDivElement;
  let contactContainer!: HTMLDivElement;

  const LottieAnim = lazy(() => import("../components/LottieAnim"));
  const BgGradient = lazy(() => import("../components/BgGradient"));
  const Panel3d = lazy(() => import("../components/Panel3d"));

  const portfolioCollection = createAsync(() => fetchPortfolio(), {
    deferStream: true,
  });
  const site = createAsync(() => fetchSiteContent(), { deferStream: true });
  const personalProjectTeasers = createAsync(() => fetchPersonalProjectTeasers(), { deferStream: true });
  const roleParts = () => site()?.role.split(" & ") ?? [];
  const lenis = useLenis();

  onMount(() => {
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const updateIntro = () => {
      const scroll = window.scrollY;
      introPanel.classList.toggle(
        "blur-xl",
        !motionPreference.matches && scroll > 200,
      );
      introPanel.classList.toggle("opacity-0", scroll > 200);
      introPanel.style.setProperty(
        "--scroll-y",
        motionPreference.matches ? "0px" : `${scroll}px`,
      );
    };
    const unregister = lenis?.registerCallback(updateIntro);
    window.addEventListener("scroll", updateIntro, { passive: true });
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
      motionPreference.removeEventListener("change", updateIntro);
      revealObserver.disconnect();
    });
  });

  return (
    <>
      <Show when={site()} keyed>
        {(content) => <SEO
        title={`${content.name} | ${content.role}`}
        description={content.description}
        canonical={content.url}
        ogImage={content.ogImage}
        localBusiness={true}
        organization={true}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: content.name,
          jobTitle: content.role,
          description: content.description,
          url: content.url,
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
      />}
      </Show>
      <main class="w-full relative flex flex-col justify-center items-center">
        <section
          aria-hidden="true"
          class="w-full h-screen fixed top-0 left-0 fade__animate -z-10"
        >
          <Suspense>
            <div class="fade__animate h-screen w-full flex justify-center items-center">
              <Panel3d model="https://cdn.mikeangelo.art/MA_Logo_3D.glb" />
            </div>
            <BgGradient />
            <LottieAnim url="https://cdn.mikeangelo.art/anim.json" />
          </Suspense>
        </section>
        <section class="w-full h-screen -z-10"></section>
        <section class="px-4 lg:px-20 -z-10 fixed top-0 left-0 overflow-hidden perspective-normal mix-blend-difference h-screen w-full flex justify-center items-center">
          <article
            ref={introPanel}
            style={{
              transform: "translateZ(calc(var(--scroll-y, 0px) * -0.5))",
            }}
            class="def__animate w-full flex flex-col justify-start md:ml-36 lg:items-center md:flex-row gap-4 md:gap-6 lg:gap-8"
          >
            <div class="not-dark:invert flex flex-col gap-5 justify-center text-left w-full max-w-xl">
              <h1 class="leading-tight text-[clamp(1.5rem,5vw,3rem)] text-black dark:text-white font-semibold">
                {roleParts()[0]}
                <Show when={roleParts().length > 1}>
                  {" &"}<br />{roleParts().slice(1).join(" & ")}
                </Show>
              </h1>
              <p class="dark:invert transition-opacity duration-100 ease-out max-w-lg">
                {site()?.homePage.intro}
              </p>
            </div>
          </article>
        </section>

        <div class="z-2 w-full">
          <section class="bg-neutral-100 dark:bg-neutral-950 w-full">
            <SectionHeading>Selected Work</SectionHeading>
          </section>
          <section class="w-full bg-white dark:bg-black py-18">
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
            <div class="bg-neutral-100 dark:bg-neutral-950 w-full">
              <SectionHeading>More Portfolio Work</SectionHeading>
            </div>
            <div
              ref={moreContainer}
              class="fade__animate w-full flex flex-col gap-9 justify-center max-w-7xl mx-auto py-18 px-6"
            >
              <Show when={portfolioCollection()}>
                <TeaserCollection
                  data={portfolioCollection() as PortfolioCollection[]}
                  limit={4}
                />
              </Show>
              <A
                href="/projects"
                class="text-center lg:mx-auto lg:text-left lg:flex w-full lg:w-fit items-center gap-2 text-xl font-bold px-9 py-6 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:gap-3 transition-all duration-200 group/link"
              >
                View All Work
              </A>
            </div>
          </section>
          <section class="w-full bg-neutral-100 dark:bg-neutral-950 border-t border-black/10 dark:border-white/10">
            <div class="w-full grid items-center gap-9 max-w-7xl px-6 py-18 mx-auto lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12">
              <div class="flex min-w-0 flex-col items-start gap-6">
                <p class="text-black dark:text-white max-w-xl">
                  {site()?.homePage.projectsIntro}
                </p>
                <A
                  href="/personal"
                  class="shrink-0 text-center font-bold px-6 py-4 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                  Explore Projects →
                </A>
              </div>
              <Show when={personalProjectTeasers()?.length}>
                <div class="grid min-w-0 grid-cols-3 gap-3 sm:gap-4" aria-label="Personal project previews">
                  <For each={personalProjectTeasers()}>
                    {(project) => (
                      <A
                        href={`/personal#${project.id}`}
                        aria-label={`Explore ${project.title}`}
                        class="group min-w-0 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4"
                      >
                        <div class="relative aspect-16/10 overflow-hidden rounded-xl border border-black/10 bg-white transition-colors group-hover:border-black/30 dark:border-white/10 dark:bg-black dark:group-hover:border-white/40 [&>picture]:absolute [&>picture]:inset-0 [&>picture]:block [&>picture]:h-full [&>picture]:w-full">
                          <Picture
                            src={project.screenshot.src || ""}
                            alt={project.screenshot.alt}
                            width={project.screenshot.width}
                            height={project.screenshot.height}
                            class="block h-full w-full object-contain"
                          />
                        </div>
                        <span class="mt-2 flex items-center justify-between gap-1 text-xs font-semibold text-black dark:text-white sm:text-sm">
                          {project.title}<span aria-hidden="true">↗</span>
                        </span>
                      </A>
                    )}
                  </For>
                </div>
              </Show>
            </div>
          </section>
          <section class="py-36 border-t border-black/10 dark:border-white/10 w-full bg-white dark:bg-black">
            <div
              ref={contactContainer}
              class="fade__animate flex flex-col lg:flex-row gap-12 md:gap-16 lg:gap-18 xl:gap-24 items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto lg:max-w-7xl w-full"
            >
              <div class="flex flex-col gap-4 md:gap-6 lg:max-w-md xl:max-w-lg px-4 sm:px-6">
                <span class="dark:text-shadow-lg text-shadow-black/10">
                  <H2>Drop me a line.</H2>
                </span>
                <p class="text-black dark:text-white">
                  {site()?.homePage.contactIntro}
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
