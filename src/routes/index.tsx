import { For, onCleanup, onMount } from "solid-js";
import { PortfolioCollection } from "~/components/Collection";
import { SceneManager } from "~/components/Panel3d";
import data from "../db.json";
import Collection from "~/components/Collection";
import { H1, H2 } from "~/layout/Headings";
import { Button, ContainerLabel } from "~/layout/Cards";
import { MainKeypoint } from "~/components/MainKeypoint";
import SEO from "~/components/SEO";

const collectionData: PortfolioCollection[] = data;
const landingHighlightLength = 3;

export default function Home() {
  let introPanel!: HTMLDivElement;
  let wrapper3d!: HTMLDivElement;
  let videoPanel!: HTMLVideoElement;

  onMount(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    // Enhanced mobile video autoplay handler
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isMobile = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const attemptAutoplay = async () => {
      if (!videoPanel) return;

      // Ensure required attributes are set
      videoPanel.muted = true;
      videoPanel.loop = true;
      videoPanel.controls = false;
      videoPanel.playsInline = true;
      
      // Mobile optimizations
      if (isMobile) {
        // Reduce video quality on mobile by setting lower resolution if possible
        videoPanel.style.filter = "blur(0.5px)"; // Slight blur can improve performance
        // Set lower playback rate on mobile to save battery
        videoPanel.playbackRate = 0.9;
      }

      try {
        await videoPanel.play();
        console.log('Background video autoplay successful');
      } catch (error) {
        console.log('Autoplay prevented, will retry on user interaction:', error);

        // Set up user interaction listeners
        const enableAutoplay = () => {
          if (videoPanel && videoPanel.paused) {
            videoPanel.play().catch(e => console.log('Play failed even with interaction:', e));
          }
        };

        document.addEventListener('touchstart', enableAutoplay, { once: true });
        document.addEventListener('click', enableAutoplay, { once: true });
      }
    };

    // iOS-specific: handle visibility changes
    const handleVisibilityChange = () => {
      if (!document.hidden && videoPanel && videoPanel.paused) {
        attemptAutoplay();
      }
    };

    if (isIOS) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    // Try immediate autoplay
    attemptAutoplay();

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

const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const target = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          target.style.opacity = "1";
          // Resume playback when visible
          if (videoPanel && videoPanel.paused) {
            videoPanel.play().catch(() => {});
          }
        } else {
          target.style.opacity = isMobile ? "0" : "0.25";
          // Pause video on mobile when not visible to save battery
          if (isMobile && videoPanel && !videoPanel.paused) {
            videoPanel.pause();
          }
        }
      });
    }, observerOptions);

    const sceneManager = new SceneManager(12);
    let resizeHandler: () => void;

    const threeJsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          sceneManager.init(wrapper3d, "/MA_Logo_3D.glb");
          resizeHandler = () => {
            if (sceneManager) {
              sceneManager.handleResize(wrapper3d);
            }
          };
          window.addEventListener("resize", resizeHandler);
          observer.unobserve(wrapper3d);
        }
      });
    }, observerOptions);

    threeJsObserver.observe(wrapper3d);
    opacityObserver.observe(introPanel);
    opacityObserver.observe(wrapper3d);
    opacityObserver.observe(introPanel);
    videoObserver.observe(videoPanel);

    onCleanup(() => {
      sceneManager.dispose();
      threeJsObserver.disconnect();
      opacityObserver.disconnect();
      videoObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (isIOS) {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
      if (resizeHandler) {
        window.removeEventListener("resize", resizeHandler);
      }
    });
  });

  return (
    <>
      <SEO
        title="Mike Angelo - Art Director & Web Designer in New York"
        description="Award-winning art director and web designer serving NYC. Specializing in advertising campaigns, web design, and digital content creation that delivers results."
        canonical="https://mikeangeloart.com"
        ogImage="/og-home.jpg"
        localBusiness={true}
        organization={true}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Mike Angelo",
          "jobTitle": "Art Director & Web Designer",
          "description": "Award-winning art director and web designer serving greater New York area",
          "url": "https://mikeangeloart.com",
          "address": {
            "@type": "PostalAddress",
            "addressRegion": "NY",
            "addressCountry": "US"
          },
          "knowsAbout": ["Art Direction", "Web Design", "Advertising Campaigns", "Content Creation"]
        }}
      />
      <main class="w-full relative flex flex-col justify-center items-center pb-12 mb-12">
<video
          ref={videoPanel}
          src="/Comp_3.mp4"
          class="w-full dark:-hue-rotate-90 not-dark:hue-rotate-45 not-dark:invert not-dark:brightness-200 -z-10 aspect-video object-cover h-screen mx-auto fixed top-0"
          preload="metadata"
          muted
          autoplay
          loop
          controls={false}
          playsinline
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect fill='%23000' width='1920' height='1080'/%3E%3C/svg%3E"
        ></video>
        <section class="mx-auto max-w-7xl overflow-hidden perspective-normal mix-blend-difference h-screen md:pb-12 lg:pb-36 xl:pb-48 w-full flex justify-center items-center md:items-end lg:items-end">
          <article
            ref={introPanel}
            style={{ transform: "translateZ(calc(var(--scroll-y, 0px) * -0.5))" }}
            class="intro-panel px-4 sm:px-6 md:px-8 fixed w-fit max-w-[90vw] flex flex-col justify-center items-center md:flex-row gap-4 md:gap-6 lg:gap-8"
          >
            <div class="text-white/20 h-fit not-md:border-b md:border-r md:pr-2 lg:pr-4 pb-1 text-sm md:text-base">
              <ContainerLabel>Intro</ContainerLabel>
            </div>
            <div class="not-dark:invert flex flex-col gap-4 md:gap-6 py-4 justify-center text-center md:text-left w-full max-w-3xl lg:max-w-4xl xl:max-w-5xl">
              <H1>Hey! My name's Mike.</H1>
              <H2>
                <span class="font-normal font-sans italic transition-opacity duration-100 ease-out">
                  I'm an art director <br class="block md:hidden" />& web
                  developer
                </span>
                .
              </H2>
            </div>
          </article>
        </section>
        <div class="work-panel w-full flex flex-col items-center border-t border-b border-neutral-200 dark:border-neutral-900 backdrop-blur-3xl">
          <section class="flex flex-col justify-center items-center text-black dark:text-white pt-12 md:pt-16 lg:pt-18 xl:pt-24 pb-24 md:pb-32 lg:pb-36 xl:pb-48 px-6 sm:px-8 md:px-12 lg:px-16 max-w-7xl">
            <div class="flex flex-col justify-center items-center">
<figure
                ref={wrapper3d}
                class="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 not-dark:invert"
              ></figure>
              <div class="p-4 sm:p-6 md:p-8 max-w-3xl text-center flex flex-col gap-4 md:gap-6 rounded-2xl md:rounded-3xl">
                <H2>
                  I like to make things look good, function well, and deliver
                  results.
                </H2>
                <p class="pt-4 md:pt-6 max-w-md lg:max-w-lg mx-auto border-t border-neutral-200 dark:border-neutral-800 text-sm md:text-base">
                  I've developed full ad campaigns, commercials, landing pages and
                  websites, and countless other digital and physical assets.
                </p>
              </div>
            </div>
          </section>
          <div class="flex flex-col gap-24 md:gap-32 lg:gap-36 xl:gap-48 py-12 md:py-16 lg:py-18 xl:py-24 px-4 sm:px-6 md:px-8 w-full bg-white dark:bg-neutral-950 border-t border-t-neutral-200 dark:border-t-neutral-900">
            <For each={collectionData}>
              {(collection, idx) => idx() < landingHighlightLength && (
                <MainKeypoint data={collection} standalone={true} />
              )}
            </For>
          </div>
        </div>
        <div class="bg-white dark:bg-black/90 w-full">
          <div class="w-full">
            <Collection
              data={collectionData}
              enableFull={collectionData.length < 3 ? true : false}
            />
          </div>
          <div class="pt-18 pb-36 lg:border-t lg:border-b border-t-neutral-200 dark:border-t-neutral-900 border-b-neutral-200 dark:border-b-neutral-900 w-full dark:bg-neutral-950">
            <section class="flex flex-col lg:flex-row gap-12 md:gap-16 lg:gap-18 xl:gap-24 items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-12 md:pt-16 lg:pt-18 xl:pt-24 mx-auto lg:max-w-7xl w-full">
              <div class="flex flex-col gap-4 md:gap-6 lg:max-w-md xl:max-w-lg px-4 sm:px-6">
                <H2>Drop a line.</H2>
                <p class="text-black dark:text-white">
                  I'm always looking for new opportunities and collaborations.
                  Whether you're interested in working together or just want to
                  say hi, feel free to send me a message!
                </p>
              </div>
              <form
                class="w-full flex flex-col gap-4 md:gap-6 p-4 sm:p-6 bg-neutral-100 dark:bg-neutral-900 rounded-2xl md:rounded-3xl border dark:border-t-white border-neutral-300 dark:border-neutral-900 dark:shadow-[0px_-18px_18px_-18px_rgba(255,255,255,0.5)]"
                action="https://api.web3forms.com/submit"
                method="post"
              >
                <div class="flex flex-col gap-3">
                  <input
                    type="hidden"
                    name="access_key"
                    value="4ead391c-7d7a-4e29-9e39-9a81fd36f09e"
                  />
<div class="flex flex-col gap-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="Enter your email" />
                  </div>
                  <div class="flex flex-col gap-2">
                    <Label>Message</Label>
                    <textarea
                      class="min-h-24 sm:min-h-32 md:min-h-36 placeholder-black/25 resize-none dark:placeholder-white/25 bg-white dark:bg-white/5 text-black/25 focus:text-black dark:text-white/25 dark:focus:text-white rounded-md px-3 py-2 sm:py-3 outline outline-transparent border border-black/10 dark:border-white/10 focus:outline-black/50 dark:focus:outline-white/50 hover:outline-black/25 dark:hover:outline-white/25 def__animate text-base touch-resize"
                      placeholder="Enter your message"
                      rows="4"
                    ></textarea>
                  </div>
                </div>
                <div>
                  <Button type="submit">Send Me a Message</Button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

const Label = (props: { children: string }) => {
  return (
    <label class="text-sm text-black/25 dark:text-white/25">
      {props.children}
    </label>
  );
};

const Input = ({
  type,
  placeholder,
}: {
  type: string;
  placeholder: string;
}) => {
  return (
    <input
      type={type}
      class="placeholder-black/25 dark:placeholder-white/25 bg-white dark:bg-white/5 text-black/25 focus:text-black dark:text-white/25 dark:focus:text-white rounded-md px-3 py-2 sm:py-3 outline outline-transparent border border-neutral-300 dark:border-neutral-900 focus:outline-black/50 dark:focus:outline-white/50 hover:outline-black/25 dark:hover:outline-white/25 def__animate text-base"
      placeholder={placeholder}
    />
  );
};

export async function fetchGithubAvatar() {
  const req = await fetch("https://api.github.com/users/bippolaroid");
  if (req.ok) {
    const json: any = await req.json();
    return json["avatar_url"];
  }
}
