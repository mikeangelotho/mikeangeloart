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
import Collection from "~/components/Collection";
import { H1, H2 } from "~/layout/Headings";
import { ContainerLabel } from "~/layout/Cards";
import SEO from "~/components/SEO";
import { Web3Form } from "~/components/Web3Form";
import { A, createAsync } from "@solidjs/router";
import PreviewProject from "~/components/PreviewProject";
import MediaCluster from "~/components/MediaCluster";
import TagPills from "~/components/TagPills";

const landingHighlightLength = 3;

export default function Home() {
  let introPanel!: HTMLDivElement;
  let introDesc!: HTMLDivElement;
  let bgComponents!: HTMLDivElement;
  let tagScroller!: HTMLDivElement;
  let tagInner!: HTMLDivElement;

  const [isPaused, setIsPaused] = createSignal(false);

  const LottieAnim = lazy(() => import("../components/LottieAnim"));
  const BgGradient = lazy(() => import("../components/BgGradient"));
  const Panel3d = lazy(() => import("../components/Panel3d"));

  const portfolioCollection = createAsync(async () => {
    const res = await fetch("https://cdn.mikeangelo.art/db.json");
    return (await res.json()) as PortfolioCollection[];
  });

  onMount(() => {
    let frameId: number;
    let lastTime: number = 0;
    let offset = 0;
    let ticking = false;
    const scrollYLimit = 200;
    const scrollSpeed = 0.05;

    // --- Drag state ---
    // isDragging: pointer is currently held down
    // dragStartX: clientX at pointer down
    // dragStartOffset: value of offset at pointer down
    // velocity: pixels/ms carried from the last drag move, for momentum
    // lastDragX / lastDragTime: used to compute velocity on pointer up
    let isDragging = false;
    let dragStartX = 0;
    let dragStartOffset = 0;
    let velocity = 0;
    let lastDragX = 0;
    let lastDragTime = 0;

    // Duplicate children for seamless infinite loop.
    // translateX on tagInner avoids browser scroll-engine interference on mobile.
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
      // Keep offset in [0, half) so the seam is always invisible
      return ((val % half) + half) % half;
    }

    // --- Pointer handlers (unified mouse + touch via pointer events) ---
    function onPointerDown(e: PointerEvent) {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartOffset = offset;
      velocity = 0;
      lastDragX = e.clientX;
      lastDragTime = performance.now();
      tagScroller.setPointerCapture(e.pointerId);
      tagScroller.style.cursor = "grabbing";
    }

    function onPointerMove(e: PointerEvent) {
      if (!isDragging) return;

      const now = performance.now();
      const dt = now - lastDragTime;
      if (dt > 0) {
        // Instantaneous velocity in px/ms (positive = dragging left = scrolling forward)
        velocity = -(e.clientX - lastDragX) / dt;
      }
      lastDragX = e.clientX;
      lastDragTime = now;

      const dx = e.clientX - dragStartX;
      offset = wrapOffset(dragStartOffset - dx);
      if (tagInner) tagInner.style.transform = `translateX(${-offset}px)`;
    }

    function onPointerUp(e: PointerEvent) {
      if (!isDragging) return;
      isDragging = false;
      tagScroller.releasePointerCapture(e.pointerId);
      tagScroller.style.cursor = "grab";
      // velocity is now handed off to the rAF loop for momentum decay
    }

    tagScroller.addEventListener("pointerdown", onPointerDown);
    tagScroller.addEventListener("pointermove", onPointerMove);
    tagScroller.addEventListener("pointerup", onPointerUp);
    tagScroller.addEventListener("pointercancel", onPointerUp);

    // Single persistent rAF loop.
    // While dragging: momentum is applied and decayed; auto-scroll is suspended.
    // While not dragging: auto-scroll resumes (unless paused by hover on desktop).
    // lastTime is kept in sync even when paused so delta doesn't spike on resume.
    function animate(currentTime: number) {
      frameId = requestAnimationFrame(animate);

      if (!lastTime) lastTime = currentTime;
      const delta = currentTime - lastTime;
      lastTime = currentTime;

      if (isDragging) {
        // Pointer is down — rAF just keeps lastTime current; onPointerMove drives offset.
        return;
      }

      if (Math.abs(velocity) > 0.01) {
        // Momentum phase: carry drag velocity and decay it exponentially
        offset = wrapOffset(offset + velocity * delta);
        velocity *= 0.92; // friction — tune this (lower = stops faster)
        if (tagInner) tagInner.style.transform = `translateX(${-offset}px)`;
        return;
      }

      // Auto-scroll phase
      if (isPaused()) return;

      offset = wrapOffset(offset + scrollSpeed * delta);
      if (tagInner) tagInner.style.transform = `translateX(${-offset}px)`;
    }

    frameId = requestAnimationFrame(animate);

    // Seed initial scroll state in case user has already scrolled on load
    if (window.scrollY > scrollYLimit) {
      window.requestAnimationFrame(() => {
        introPanel.classList.toggle("blur-xl", window.scrollY > scrollYLimit);
        introPanel.classList.toggle("opacity-0", window.scrollY > scrollYLimit);
        introPanel.style.setProperty("--scroll-y", `${window.scrollY}px`);
        ticking = false;
      });
    }

    const onScroll = () => {
      const { scrollY } = window;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          introPanel.classList.toggle("blur-xl", scrollY > scrollYLimit);
          introPanel.classList.toggle("opacity-0", scrollY > scrollYLimit);
          introPanel.style.setProperty("--scroll-y", `${window.scrollY}px`);
          ticking = false;
        });
        ticking = true;
      }
    };

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
          console.log("s");
          observer.unobserve(target);
        }
      });
    }, observerOptions);

    opacityObserver.observe(introDesc);
    expandObserver.observe(introDesc);

    window.addEventListener("scroll", onScroll);

    onCleanup(() => {
      cancelAnimationFrame(frameId);
      tagScroller.removeEventListener("pointerdown", onPointerDown);
      tagScroller.removeEventListener("pointermove", onPointerMove);
      tagScroller.removeEventListener("pointerup", onPointerUp);
      tagScroller.removeEventListener("pointercancel", onPointerUp);
      opacityObserver.disconnect();
      expandObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
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
          jobTitle: "Art Director & Web Designer",
          description:
            "Art director and web designer serving New Jersey and the greater New York area",
          url: "https://mikeangeloart.com",
          address: {
            "@type": "PostalAddress",
            addressRegion: "NY",
            addressCountry: "US",
          },
          knowsAbout: [
            "Art Direction",
            "Web Design",
            "Advertising Campaigns",
            "Content Creation",
          ],
        }}
      />
      <main class="w-full relative flex flex-col justify-center items-center">
        <section
          class="w-full h-screen fixed top-0 left-0 fade__animate -z-10"
          ref={bgComponents}
        >
          <Suspense>
            <BgGradient />
            <LottieAnim url="https://cdn.mikeangelo.art/anim.json" />
          </Suspense>
        </section>
        <section class="w-full h-screen -z-10"></section>
        <section class="-z-10 fixed top-0 left-0 overflow-hidden perspective-normal mix-blend-difference h-screen w-full flex justify-center items-center">
          <article
            ref={introPanel}
            style={{
              transform: "translateZ(calc(var(--scroll-y, 0px) * -0.5))",
            }}
            class="def__animate px-4 sm:px-6 md:px-8 w-fit flex flex-col justify-center items-center md:flex-row gap-4 md:gap-6 lg:gap-8"
          >
            <div class="text-white/20 h-fit not-md:border-b md:border-r md:pr-2 lg:pr-4 pb-1 text-sm md:text-base">
              <ContainerLabel>Welcome</ContainerLabel>
            </div>
            <div class="md:whitespace-nowrap not-dark:invert flex flex-col justify-center text-center md:text-left w-full max-w-3xl lg:max-w-4xl xl:max-w-5xl">
              <H1>My name's Mike.</H1>
              <H2>
                <span class="font-normal italic transition-opacity duration-100 ease-out">
                  I'm a Creative Technologist.
                </span>
              </H2>
            </div>
          </article>
        </section>
        <section class="bg-white/50 dark:bg-black/90 w-full flex flex-col items-center border-t border-black/10 dark:border-white/10 dark:backdrop-brightness-125 backdrop-saturate-150">
          <div class="relative flex flex-col justify-center items-center text-black py-36 lg:py-48 dark:text-white px-6 sm:px-8 md:px-12 lg:px-16 w-full max-w-7xl">
            <div class="w-full flex flex-col justify-center items-center">
              <div class="w-full flex flex-col gap-9">
                <Suspense>
                  <Panel3d model="https://cdn.mikeangelo.art/MA_Logo_3D.glb" />
                </Suspense>
                <div class="w-full max-w-4xl mx-auto flex flex-col gap-9">
                  <span class="dark:text-shadow-lg text-shadow-black/10 text-center">
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
                      style="touch-action: none; cursor: grab;"
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
                </div>
                <Show when={portfolioCollection()}>
                  <div
                    ref={introDesc}
                    class="fade__animate flex flex-row justify-center lg:items-start gap-0 w-full"
                  >
                    <A href={`/projects/${portfolioCollection()![1].slug}`}>
                      <MediaCluster
                        class="hover:-translate-y-3 fade__animate w-full lg:aspect-square object-cover lg:max-w-54 h-96 lg:max-h-54 rounded-3xl border-6 border-neutral-200 dark:border-white/5 lg:mt-6"
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
                        class="hover:-translate-y-3 fade__animate w-full lg:aspect-square object-cover lg:max-w-54 h-96 lg:max-h-54 rounded-3xl border-6 border-neutral-200 dark:border-white/5 lg:mt-6"
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
        </section>
        <div class="bg-neutral-100 dark:bg-neutral-950 w-full">
          <h3 class="border-t border-b border-neutral-300 dark:border-neutral-900 py-6 flex justify-center items-center uppercase text-black/10 dark:text-white/10">
            Project Highlights
          </h3>
        </div>
        <section class="w-full bg-white dark:bg-black">
          <Show when={portfolioCollection()}>
            <For each={portfolioCollection()}>
              {(collection, idx) =>
                idx() < landingHighlightLength && (
                  <PreviewProject data={collection} />
                )
              }
            </For>
          </Show>
        </section>
        <section class="bg-white dark:bg-black/90 overflow-x-auto w-full pl-6">
          <Show when={portfolioCollection()}>
            <Collection data={portfolioCollection() as PortfolioCollection[]} />
          </Show>
        </section>
        <section class="py-36 border-b border-t border-black/10 dark:border-white/10 w-full dark:backdrop-brightness-125 backdrop-saturate-150">
          <div class="flex flex-col lg:flex-row gap-12 md:gap-16 lg:gap-18 xl:gap-24 items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto lg:max-w-7xl w-full">
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
      </main>
    </>
  );
}