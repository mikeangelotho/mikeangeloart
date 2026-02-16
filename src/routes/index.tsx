import {
  createResource,
  For,
  lazy,
  onCleanup,
  onMount,
  Show,
  Suspense,
} from "solid-js";
import { PortfolioCollection } from "~/types";
import Panel3d, { SceneManager } from "~/components/Panel3d";
import Collection from "~/components/Collection";
import { H1, H2 } from "~/layout/Headings";
import { ContainerLabel } from "~/layout/Cards";
import { MainKeypoint } from "~/components/MainKeypoint";
import SEO from "~/components/SEO";
import BgGradient from "~/components/BgGradient";
import { Web3Form } from "~/components/Web3Form";
import { createAsync } from "@solidjs/router";

const landingHighlightLength = 3;

export default function Home() {
  let introPanel!: HTMLDivElement;

  const portfolioCollection = createAsync(async () => {
    const res = await fetch("https://cdn.mikeangelo.art/db.json");
    return (await res.json()) as PortfolioCollection[];
  });

  const animation = createAsync(async () => {
    const res = await fetch("https://cdn.mikeangelo.art/anim.json");
    return (await res.json()) as string;
  });

  const LottieAnim = lazy(() => import("../components/LottieAnim"));

  onMount(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

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

    window.addEventListener("scroll", onScroll);

    const opacityObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const target = entry.target as HTMLElement;
        target.classList.toggle("scrolled", !entry.isIntersecting);
      });
    }, observerOptions);

    opacityObserver.observe(introPanel);

    onCleanup(() => {
      opacityObserver.disconnect();
    });
  });

  return (
    <>
      <SEO
        title="Mike Angelo | Art Director & Web Designer in New Jersey and the greater New York area"
        description="Art director and web designer/developer in New Jersey and NYC. Specializing in advertising campaigns, web design, and digital content creation that delivers results."
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
        <BgGradient />
        <Show when={animation()}>
          <Suspense>
            <LottieAnim data={animation() as string} />
          </Suspense>
        </Show>
        <section class="mx-auto max-w-7xl overflow-hidden perspective-normal mix-blend-difference h-screen  w-full flex justify-center items-center">
          <article
            ref={introPanel}
            style={{
              transform: "translateZ(calc(var(--scroll-y, 0px) * -0.5))",
            }}
            class="intro-panel px-4 sm:px-6 md:px-8 fixed w-fit max-w-[90vw] flex flex-col justify-center items-center md:flex-row gap-4 md:gap-6 lg:gap-8"
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
        <div class="w-full flex flex-col items-center border-t border-black/10 dark:border-white/10 backdrop-blur-3xl backdrop-saturate-200 dark:backdrop-brightness-150">
          <section class="relative flex flex-col justify-center items-center text-black py-36 lg:py-54 dark:text-white px-6 sm:px-8 md:px-12 lg:px-16 max-w-7xl">
            <div class="flex flex-col justify-center items-center">
              <div class="max-w-2xl text-center flex flex-col gap-6 rounded-2xl md:rounded-3xl">
                  <Panel3d model="https://cdn.mikeangelo.art/MA_Logo_3D.glb" />
                <span class="dark:text-shadow-lg text-shadow-black/10">
                  <H2>
                    I like to make things look good, function well, and deliver
                    results.
                  </H2>
                </span>
                <p class="p-6 rounded-xl bg-white/90 dark:bg-black/80 mx-auto border border-black/10 dark:border-white/10 dark:border-t dark:border-t-white">
                  I've worked with businesses and agencies to produce
                  high-quality creative assets, engaging video and motion
                  design, custom websites and web solutions, and comprehensive
                  advertising campaigns.
                </p>
              </div>
            </div>
          </section>
          <div class="flex flex-col px-6 w-full bg-white/90 dark:bg-black/90">
            <Show when={portfolioCollection()}>
              <For each={portfolioCollection()}>
                {(collection, idx) =>
                  idx() < landingHighlightLength && (
                    <MainKeypoint data={collection} standalone={true} />
                  )
                }
              </For>
            </Show>
          </div>
        </div>
        <div class="w-full flex flex-col items-center border-t border-b border-black/10 dark:border-white/10 backdrop-blur-3xl backdrop-saturate-200 dark:backdrop-brightness-150">
          <div class="bg-white dark:bg-black w-full">
            <Show when={portfolioCollection()}>
              <Collection
                data={portfolioCollection() as PortfolioCollection[]}
              />
            </Show>
          </div>
          <div class="py-36 lg:border-t border-t-black/10 dark:border-t-white/10 border-b-black/10 dark:border-b-white/10 w-full">
            <section class="flex flex-col lg:flex-row gap-12 md:gap-16 lg:gap-18 xl:gap-24 items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto lg:max-w-7xl w-full">
              <div class="flex flex-col gap-4 md:gap-6 lg:max-w-md xl:max-w-lg px-4 sm:px-6">
                <H2>Drop a line.</H2>
                <p class="text-black dark:text-white">
                  I'm always looking for new opportunities and collaborations.
                  Whether you're interested in working together or just want to
                  say hi, feel free to send me a message!
                </p>
              </div>
              <Web3Form />
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
