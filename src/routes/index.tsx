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
import { H1, H2, SectionHeading } from "~/layout/Headings";
import { ContainerLabel } from "~/layout/Cards";
import SEO from "~/components/SEO";
import { Web3Form } from "~/components/Web3Form";
import { A, createAsync, query } from "@solidjs/router";
import PreviewProject from "~/components/PreviewProject";
import MediaCluster from "~/components/MediaCluster";
import TagPills from "~/components/TagPills";
import { useLenis } from "~/components/LenisProvider";

const fetchPortfolio = query(async (): Promise<PortfolioCollection[]> => {
  "use server";
  const res = await fetch("https://cdn.mikeangelo.art/db.json");
  return await res.json() as PortfolioCollection[];
}, "portfolio-home");

const landingHighlightLength = 3;

export default function Home() {
  let introPanel!: HTMLDivElement;
  let blurbDesc!: HTMLDivElement;
  let blurbContainer!: HTMLDivElement;
  let bgAnims!: HTMLDivElement;
  let tagScroller!: HTMLDivElement;
  let tagInner!: HTMLDivElement;
  let moreContainer!: HTMLDivElement;
  let contactContainer!: HTMLDivElement;

  const [isPaused, setIsPaused] = createSignal(false);

  const LottieAnim = lazy(() => import("../components/LottieAnim"));
  const BgGradient = lazy(() => import("../components/BgGradient"));
  const Panel3d = lazy(() => import("../components/Panel3d"));

  const portfolioCollection = createAsync(() => fetchPortfolio());

  onMount(() => {
    const lenis = useLenis();
    let offset = 0;
    const scrollYLimit = 200;
    const scrollSpeed = 0.08;

    if (tagInner) {
      const original = Array.from(tagInner.children) as HTMLElement[];
      original.forEach((child) => {
        const clone = child.cloneNode(true) as HTMLElement;
        clone.setAttribute("aria-hidden", "true");
        tagInner.appendChild(clone);
      });
    }

    function getHalf() {
      return tagInner ? tagInner.scrollWidth / 2 : 0;
    }

    function wrapOffset(val: number) {
      const half = getHalf();
      if (!half) return val;
      return ((val % half) + half) % half;
    }

    let isVisible = true;

    const visibilityHandler = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", visibilityHandler);

    const scrollerObserver = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.1 }
    );
    scrollerObserver.observe(tagScroller);

    function animate(_currentTime: number, delta: number) {
      if (isPaused() || !isVisible) return;

      offset = wrapOffset(offset + scrollSpeed * delta);
      if (tagInner) tagInner.style.transform = `translateX(${-offset}px)`;
    }

    const unregisterLenis = lenis!.registerCallback((time, delta) => {
      animate(time, delta);

      if (lenis?.lenis()) {
        const scroll = lenis.lenis()?.scroll || 0;
        introPanel.classList.toggle("blur-xl", scroll > scrollYLimit);
        introPanel.classList.toggle("opacity-0", scroll > scrollYLimit);
        introPanel.style.setProperty("--scroll-y", `${scroll}px`);
      }
    });

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.25,
    };

    const opacityObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        const target = entry.target as HTMLElement;
        target.classList.add("translate-y-9");
        if (entry.isIntersecting) {
          target.classList.remove("scrolled");
          target.classList.remove("translate-y-9");
          observer.unobserve(target);
        } else {
          target.classList.add("scrolled");
          target.classList.add("translate-y-9");
        }
      });
    }, observerOptions);

    const expandObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        const { target } = entry;
        if (entry.isIntersecting) {
          target.classList.add("lg:gap-3");
          observer.unobserve(target);
        }
      });
    }, observerOptions);

    let hasTrackedBlurb = false;
    const blurbObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasTrackedBlurb) {
          hasTrackedBlurb = true;
          blurbObserver.unobserve(entry.target);

          const target = entry.target as HTMLDivElement;
          const handleScroll = () => {
            const { offsetHeight } = target;
            const { scrollY } = window;

            if (scrollY >= offsetHeight - 96) {
              target.style.position = "sticky";
              target.style.top = "0px";
              target.style.left = "0px";
              //target.style.zIndex = "-2";
            } else {
              target.style.position = "";
              target.style.top = "";
              target.style.left = "";
              target.style.zIndex = "";
            }

            target.classList.toggle("opacity-0", scrollY >= offsetHeight * 1.25);
            target.classList.toggle("invisible", scrollY >= offsetHeight * 2);
          };

          document.addEventListener("scroll", handleScroll, { passive: true });

          onCleanup(() => {
            document.removeEventListener("scroll", handleScroll);
          });
        }
      });
    }, { threshold: 0.1 });

    opacityObserver.observe(blurbDesc);
    opacityObserver.observe(moreContainer);
    opacityObserver.observe(contactContainer);
    expandObserver.observe(blurbDesc);
    blurbObserver.observe(blurbContainer);

    onCleanup(() => {
      unregisterLenis();
      document.removeEventListener("visibilitychange", visibilityHandler);
      scrollerObserver.disconnect();
      opacityObserver.disconnect();
      expandObserver.disconnect();
      blurbObserver.disconnect();
    });
  });

  return (
    <>
      <SEO
        title="Creative Technologist in New Jersey and New York - Mike Angelo | Graphic and Motion Design, Web Development, and Advertising Campaigns"
        description="Mike Angelo is a Creative Technologist serving New Jersey and the greater New York area, specializing in advertising campaigns, web design and development, and comprehensive advertising campaigns."
        canonical="https://mikeangeloart.com"
        ogImage="https://cdn.mikeangelo.art/og-default.png"
        localBusiness={true}
        organization={true}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Mike Angelo",
          jobTitle: "Creative Technologist",
          description:
            "Creative Technologist serving New Jersey and the greater New York area",
          url: "https://mikeangeloart.com",
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
            "Web Development"
          ],
        }}
      />
      <main class="w-full relative flex flex-col justify-center items-center">
        <section
          class="w-full h-screen fixed top-0 left-0 fade__animate -z-10"
          ref={bgAnims}
        >
          <Suspense>
            <BgGradient />
            <LottieAnim url="https://cdn.mikeangelo.art/anim.json" />
          </Suspense>
        </section>
        <section class="w-full h-screen -z-10"></section>
        <section class="px-6 -z-10 fixed top-0 left-0 overflow-hidden perspective-normal mix-blend-difference h-screen w-full flex justify-center items-center">
          <article
            ref={introPanel}
            style={{
              transform: "translateZ(calc(var(--scroll-y, 0px) * -0.5))",
            }}
            class="def__animate w-full flex flex-col justify-center lg:items-center md:flex-row gap-4 md:gap-6 lg:gap-8"
          >
            <div class="text-white/20 h-fit w-fit not-md:border-b md:border-r md:pr-2 lg:pr-4 pb-1 text-sm md:text-base">
              <ContainerLabel>Welcome</ContainerLabel>
            </div>
            <div class="md:whitespace-nowrap not-dark:invert flex flex-col justify-center text-left w-full max-w-3xl lg:max-w-4xl xl:max-w-5xl">
              <H1>My name's Mike.</H1>
              <H2>
                <span class="font-normal italic transition-opacity duration-100 ease-out">
                  I'm a Creative Technologist.
                </span>
              </H2>
            </div>
          </article>
        </section>
        <section ref={blurbContainer} class="fade__animate bg-white/80 dark:bg-black/90 h-screen w-full flex flex-col justify-center items-center border-t border-black/10 dark:border-white/10 backdrop-brightness-125 backdrop-saturate-150">
          <div class="relative flex flex-col justify-center items-center text-black dark:text-white px-6 sm:px-8 md:px-12 lg:px-16 w-full max-w-7xl">
            <div class="w-full flex h-screen flex-col justify-center items-center">
              <div class="fade__animate w-full flex flex-col gap-9">
                <Suspense>
                  <Panel3d model="https://cdn.mikeangelo.art/MA_Logo_3D.glb" />
                </Suspense>
                <div class="w-full max-w-4xl mx-auto flex flex-col gap-9 translate-y-18 lg:translate-y-0">
                  <span class="dark:text-shadow-lg text-shadow-black/10 lg:text-center leading-loose">
                    <H2>
                      I bridge design and technology to turn 'what if' into
                      high-performing digital experiences.
                    </H2>
                  </span>
                  <Show when={portfolioCollection()}>
                    <div
                      ref={tagScroller}
                      onMouseEnter={() => setIsPaused(true)}
                      onMouseLeave={() => setIsPaused(false)}
                      class="w-full mx-auto overflow-hidden fade__animate select-none"
                      style="touch-action: pan-y;"
                    >
                      {/* Inner wrapper is what translateX moves */}
                      <div
                        ref={tagInner}
                        class="flex gap-1 w-max will-change-transform"
                      >
                        <TagPills collections={portfolioCollection()} />
                      </div>
                    </div>
                  </Show>
                  <Show when={portfolioCollection()}>
                    <div
                      ref={blurbDesc}
                      class="fade__animate flex flex-row justify-center lg:items-start gap-1 w-full"
                    >
                      <A href={`/projects/${portfolioCollection()![1].slug}`}>
                        <MediaCluster
                          class="hover:-translate-y-3 fade__animate w-full lg:aspect-square object-cover lg:max-w-54 h-96 lg:max-h-54 rounded-3xl border-6 border-neutral-200 dark:border-white/5 mt-6"
                          src={
                            portfolioCollection()![1].projectKeypoints[1].media[0]
                              .url
                          }
                        />
                      </A>
                      <A href={`/projects/${portfolioCollection()![0].slug}`}>
                        <MediaCluster
                          class="hover:-translate-y-3 fade__animate w-full lg:aspect-video object-cover h-96 lg:max-h-54 rounded-3xl border-6 border-neutral-200 dark:border-white/5"
                          src={
                            portfolioCollection()![0].projectKeypoints[1].media[3]
                              .url
                          }
                        />
                      </A>
                      <A href={`/projects/${portfolioCollection()![2].slug}`}>
                        <MediaCluster
                          class="hover:-translate-y-3 fade__animate w-full lg:aspect-square object-cover lg:max-w-54 h-96 lg:max-h-54 rounded-3xl border-6 border-neutral-200 dark:border-white/5 mt-6"
                          src={
                            portfolioCollection()![2].projectKeypoints[1].media[4]
                              .url
                          }
                        />
                      </A>
                    </div>
                  </Show>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div class="z-2 w-full">
          <section class="bg-neutral-100 dark:bg-neutral-950 w-full">
            <SectionHeading>Project Highlights</SectionHeading>
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
              <SectionHeading>More Projects</SectionHeading>
            </div>
            <div ref={moreContainer} class="fade__animate w-full flex flex-col gap-9 justify-center max-w-7xl mx-auto py-18 px-6">
              <Show when={portfolioCollection()}>
                <TeaserCollection data={portfolioCollection() as PortfolioCollection[]} limit={4} />
              </Show>
              <A
                href="/projects"
                class="text-center lg:mx-auto lg:text-left lg:flex w-full lg:w-fit items-center gap-2 text-xl font-bold px-9 py-6 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:gap-3 transition-all duration-200 group/link"
              >
                View All Projects
              </A>
            </div>
          </section>
          <section class="py-36 border-t border-black/10 dark:border-white/10 w-full bg-white dark:bg-black">
            <div ref={contactContainer} class="fade__animate flex flex-col lg:flex-row gap-12 md:gap-16 lg:gap-18 xl:gap-24 items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto lg:max-w-7xl w-full">
              <div class="flex flex-col gap-4 md:gap-6 lg:max-w-md xl:max-w-lg px-4 sm:px-6">
                <span class="dark:text-shadow-lg text-shadow-black/10">
                  <H2>Drop me a line.</H2>
                </span>
                <p class="text-black dark:text-white">
                  I'm always looking for new opportunities and collaborations.
                  Let's build something great.
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