import { For, lazy, onCleanup, onMount, Show, Suspense } from "solid-js";
import { PortfolioCollection } from "~/types";
import Collection from "~/components/Collection";
import { H1, H2 } from "~/layout/Headings";
import { ContainerLabel } from "~/layout/Cards";
import SEO from "~/components/SEO";
import { Web3Form } from "~/components/Web3Form";
import { createAsync } from "@solidjs/router";
import PreviewProject from "~/components/PreviewProject";

const landingHighlightLength = 3;

export default function Home() {
  let introPanel!: HTMLDivElement;
  let introDesc!: HTMLDivElement;
  let bgComponents!: HTMLDivElement;

  const LottieAnim = lazy(() => import("../components/LottieAnim"));
  const BgGradient = lazy(() => import("../components/BgGradient"));
  const Panel3d = lazy(() => import("../components/Panel3d"));

  const portfolioCollection = createAsync(async () => {
    const res = await fetch("https://cdn.mikeangelo.art/db.json");
    return (await res.json()) as PortfolioCollection[];
  });

  onMount(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (introPanel) {
            introPanel.style.setProperty("--scroll-y", `${window.scrollY}px`);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
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

    const blurObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) bgComponents.classList.add("blur-lg");
        else bgComponents.classList.remove("blur-lg");
      });
    }, observerOptions);

    opacityObserver.observe(introDesc);
    blurObserver.observe(introPanel);

    window.addEventListener("scroll", onScroll);

    onCleanup(() => {
      opacityObserver.disconnect();
      blurObserver.disconnect();
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
        <section class="mx-auto max-w-7xl overflow-hidden perspective-normal mix-blend-difference h-screen  w-full flex justify-center items-center">
          <article
            ref={introPanel}
            style={{
              transform: "translateZ(calc(var(--scroll-y, 0px) * -0.5))",
            }}
            class="def__animate px-4 sm:px-6 md:px-8 fixed w-fit max-w-[90vw] flex flex-col justify-center items-center md:flex-row gap-4 md:gap-6 lg:gap-8"
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
          <div class="relative flex flex-col justify-center items-center text-black py-36 lg:py-96 dark:text-white px-6 sm:px-8 md:px-12 lg:px-16 max-w-7xl">
            <div class="flex flex-col justify-center items-center">
              <div class="max-w-3xl flex flex-col gap-18 lg:gap-9">
                <Suspense>
                  <Panel3d model="https://cdn.mikeangelo.art/MA_Logo_3D.glb" />
                </Suspense>
                <span class="dark:text-shadow-lg text-shadow-black/10 text-center">
                  <H2>
                    I bridge design and technology to turn<br /><em>'what if'</em> into high-performing experiences.
                  </H2>
                </span>
                <div
                  ref={introDesc}
                  class="fade__animate flex justify-center items-center p-6 rounded-xl bg-neutral-100 dark:bg-neutral-950 mx-auto border border-neutral-300 dark:border-neutral-900 dark:border-t dark:border-t-white shadow-[0px_9px_18px_0px_rgb(0,0,0,0.1)] dark:shadow-[0px_9px_18px_0px_rgb(0,0,0,0.25)]"
                >
                  {/*<div class="border-r border-black/10 dark:border-white/10 pr-6">dsadsad</div>*/}
                  <p class="pl-6">
                    I've worked with businesses and agencies to produce
                    high-quality creative assets, engaging video and motion
                    design, custom websites and web solutions, and comprehensive
                    advertising campaigns.
                  </p>
                </div>
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
                <H2>Drop a line.</H2>
              </span>
              <p class="text-black dark:text-white">
                I'm always looking for new opportunities and collaborations.
                Whether you're interested in working together or just want to
                say hi, feel free to send me a message!
              </p>
            </div>
            <Web3Form />
          </div>
        </section>
      </main>
    </>
  );
}
