import { createSignal, For, onCleanup, onMount, Show } from "solid-js";
import { PortfolioCollection } from "~/components/Collection";
import { SceneManager } from "~/components/Panel3d";
import data from "../db.json";
import Collection from "~/components/Collection";
import { H1, H2 } from "~/layout/Headings";
import { Button, ContainerLabel } from "~/layout/Cards";
import { MainKeypoint } from "~/components/MainKeypoint";
import SEO from "~/components/SEO";
import { Input, Label } from "~/layout/Forms";
import BgGradient from "~/components/BgGradient";
import { DotLottie } from '@lottiefiles/dotlottie-web';
import anim from "../anim.json"


const collectionData: PortfolioCollection[] = data;
const landingHighlightLength = 3;

export default function Home() {
  let introPanel!: HTMLDivElement;
  let wrapper3d!: HTMLDivElement;
  let lottieCanvas!: HTMLCanvasElement;

  onMount(() => {
    // Detect device capabilities
    const isMobile = window.innerWidth < 768 || 
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Check available memory (if supported)
    const deviceMemory = (navigator as any).deviceMemory || 4; // Default to 4GB if unavailable
    const isLowEndDevice = deviceMemory <= 4 || isMobile;

    const dotLottie = new DotLottie({
      canvas: lottieCanvas,
      data: anim,
      autoplay: true,
      loop: true,
      renderConfig: {
        // Aggressive DPI reduction on mobile/low-end devices
        devicePixelRatio: isLowEndDevice ? 0.5 : 1,
      },
      mode: 'forward',
      useFrameInterpolation: false,
    });

    // Much slower on mobile
    dotLottie.setSpeed(isLowEndDevice ? 0.3 : 0.5);

    let animationFrameId: number;
    let lastFrameTime = 0;
    const targetFPS = isLowEndDevice ? 15 : 24; // Even lower FPS on mobile
    const frameInterval = 1000 / targetFPS;

    const throttledRender = (currentTime: number) => {
      const elapsed = currentTime - lastFrameTime;
      
      if (elapsed > frameInterval) {
        lastFrameTime = currentTime - (elapsed % frameInterval);
      }
      
      if (!document.hidden) {
        animationFrameId = requestAnimationFrame(throttledRender);
      }
    };

    const handleVisibility = () => {
      if (document.hidden) {
        dotLottie.pause();
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      } else {
        dotLottie.play();
        animationFrameId = requestAnimationFrame(throttledRender);
      }
    };

    {/*}
    const handleResize = () => {
      // AGGRESSIVE canvas size reduction
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      let scale: number;
      if (width < 640) {
        scale = 0.4; // Extra small mobile
      } else if (width < 768) {
        scale = 0.5; // Mobile
      } else if (width < 1024) {
        scale = 0.7; // Tablet
      } else {
        scale = 0.85; // Desktop (still reduced)
      }
      

      
      // Canvas display size (what user sees - upscaled via CSS)
      lottieCanvas.style.width = `${width}px`;
      lottieCanvas.style.height = `${height}px`;
      
      // Apply slight blur to hide upscaling artifacts
      lottieCanvas.style.filter = isLowEndDevice ? 'blur(0.5px)' : 'none';
    };

    handleResize();

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("resize", handleResize);
    */}

    animationFrameId = requestAnimationFrame(throttledRender);

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    // Aggressive pause when scrolled away
    const lottieObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting && !document.hidden) {
          dotLottie.pause();
          // Free up memory by clearing canvas when not visible
          const ctx = lottieCanvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, lottieCanvas.width, lottieCanvas.height);
          }
        } else if (entry.isIntersecting && !document.hidden) {
          dotLottie.play();
        }
      });
    }, { threshold: 0.05 }); // Very aggressive threshold

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

    const sceneManager = new SceneManager(12);
    let resizeHandler: () => void;

    const threeJsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          sceneManager.init(
            wrapper3d,
            "https://cdn.mikeangelo.art/MA_Logo_3D.glb",
          );
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
    //lottieObserver.observe(lottieCanvas);

    onCleanup(() => {
      sceneManager.dispose();
      threeJsObserver.disconnect();
      opacityObserver.disconnect();
      lottieObserver.disconnect();
      dotLottie.destroy();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      document.removeEventListener("visibilitychange", handleVisibility);
      //window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", onScroll);
      if (resizeHandler) {
        window.removeEventListener("resize", resizeHandler);
      }
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
        {/*<canvas 
          class="border border-red-500 fixed top-0 left-0 w-full h-screen object-cover aspect-video" 
          ref={lottieCanvas}
          style="will-change: auto; image-rendering: auto;"
        ></canvas>*/}
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
            <div class="md:whitespace-nowrap not-dark:invert flex flex-col gap-4 md:gap-6 py-4 justify-center text-center md:text-left w-full max-w-3xl lg:max-w-4xl xl:max-w-5xl">
              <H1>My name's Mike.</H1>
              <H2>
                <span class="font-normal italic transition-opacity duration-100 ease-out">
                  I'm an art director <br class="block md:hidden" />& web
                  developer
                </span>
                .
              </H2>
            </div>
          </article>
        </section>
        <div class="w-full flex flex-col items-center border-t border-b border-black/10 dark:border-white/10 backdrop-blur-3xl backdrop-saturate-200">
          <section class="flex flex-col justify-center items-center text-black dark:text-white pt-12 md:pt-16 lg:pt-18 xl:pt-24 pb-24 md:pb-32 lg:pb-36 xl:pb-48 px-6 sm:px-8 md:px-12 lg:px-16 max-w-7xl">
            <div class="flex flex-col justify-center items-center">
              <figure
                ref={wrapper3d}
                class="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 dark:invert dark:hue-rotate-180"
              ></figure>
              <div class="p-4 sm:p-6 md:p-8 max-w-3xl text-center flex flex-col gap-4 md:gap-6 rounded-2xl md:rounded-3xl">
                <H2>
                  I like to make things look good, function well, and deliver
                  results.
                </H2>
                <p class="pt-4 md:pt-6 max-w-md lg:max-w-lg mx-auto border-t border-black/10 dark:border-white/10">
                  I've worked with small businesses, local artists, and
                  marketing agencies to produce high-quality creative assets,
                  engaging video and motion design, comprehensive custom
                  websites, and full-scope advertising campaigns.
                </p>
              </div>
            </div>
          </section>
          <div class="flex flex-col px-6 w-full bg-white/90 dark:bg-black/90">
            <For each={collectionData}>
              {(collection, idx) =>
                idx() < landingHighlightLength && (
                  <MainKeypoint data={collection} standalone={true} />
                )
              }
            </For>
          </div>
        </div>
        <div class="w-full flex flex-col items-center border-t border-b border-neutral-200 dark:border-neutral-900 backdrop-blur-3xl backdrop-saturate-200 dark:backdrop-brightness-150">
          <div class="bg-white dark:bg-black w-full">
            <Collection data={collectionData} />
          </div>
          <div class="py-36 lg:border-t border-t-neutral-200 dark:border-t-neutral-900 border-b-neutral-200 dark:border-b-neutral-900 w-full">
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

const Web3Form = () => {
  const [result, setResult] = createSignal("");

  const onSubmit = async (event: any) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);
    formData.append("access_key", "33167a9e-992e-4a3e-af3b-96ab4976a6b3");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data: any = await response.json();
    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      setResult("Error");
    }
  };

  return (
    <form onSubmit={onSubmit} class="w-full">
      <div class="flex flex-col gap-3 w-full">
        <div class="flex flex-col">
          <Label>Name</Label>
          <Input name="name" type="text" placeholder="Enter your name" />
        </div>
        <div class="flex flex-col">
          <Label>Email</Label>
          <Input name="email" type="email" placeholder="Enter your email" />
        </div>
        <div class="flex flex-col">
          <Label>Message</Label>
          <textarea
            class="min-h-24 sm:min-h-32 md:min-h-36 placeholder-black/25 resize-none dark:placeholder-white/50 bg-white dark:bg-white/25 text-black focus:text-black dark:text-white dark:focus:text-white rounded-md px-3 py-2 sm:py-3 outline outline-transparent border border-black/10 dark:border-white/10 focus:outline-black/50 dark:focus:outline-white/50 hover:outline-black/25 dark:hover:outline-white/25 def__animate text-base touch-resize"
            placeholder="Enter your message"
            name="message"
            required
          ></textarea>
        </div>
        <Button type="submit">Send Message</Button>
        <Show when={result().length > 0}>
          <span class="text-black/10 dark:text-white/50">{result()}</span>
        </Show>
      </div>
    </form>
  );
};