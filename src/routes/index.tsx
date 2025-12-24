import { For, onCleanup, onMount } from "solid-js";
import { PortfolioCollection } from "~/components/Collection";
import { SceneManager } from "~/components/Panel3d";
import data from "../db.json";
import Collection from "~/components/Collection";
import { H1, H2 } from "~/layout/Headings";
import { Button, ContainerLabel } from "~/layout/Cards";
import { MainKeypoint } from "~/components/MainKeypoint";

const collectionData: PortfolioCollection[] = data;
const landingHighlights = () => {
  const temp = [];
  for (const collection of collectionData) {
    temp.push(collection);
  }
  return temp;
};

const targetListenerMap = new Map<HTMLElement, EventListener>();

function scrollHandler(target: HTMLElement) {
  return () => {
    const scrollY = window.scrollY;
    const zValue = -scrollY * 0.5;
    target.style.transform = `translateZ(${zValue}px)`;
  };
}

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

    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const target = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          if (!targetListenerMap.has(target)) {
            const scrollHandlerListener = scrollHandler(
              target
            ) as EventListener;
            targetListenerMap.set(target, scrollHandlerListener);
            window.addEventListener("scroll", scrollHandlerListener);
          }
        } else {
          const eventL = targetListenerMap.get(target);
          if (eventL) {
            window.removeEventListener("scroll", eventL);
            targetListenerMap.delete(target);
          }
        }
      });
    }, observerOptions);

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
        } else {
          target.style.opacity = "0.25";
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
    scrollObserver.observe(introPanel);
    opacityObserver.observe(wrapper3d);
    opacityObserver.observe(introPanel);
    videoObserver.observe(videoPanel);

    onCleanup(() => {
      sceneManager.dispose();
      threeJsObserver.disconnect();
      opacityObserver.disconnect();
      videoObserver.disconnect();
      scrollObserver.disconnect();
      if (resizeHandler) {
        window.removeEventListener("resize", resizeHandler);
      }
      targetListenerMap.forEach((eventL) => {
        window.removeEventListener("scroll", eventL);
      });
      targetListenerMap.clear();
    });
  });

  return (
    <main class="w-full relative flex flex-col justify-center items-center pb-12 mb-12">
      <video
        ref={videoPanel}
        src="/Comp_3.mp4"
        class="w-full dark:-hue-rotate-90 not-dark:hue-rotate-45 not-dark:invert not-dark:brightness-200 -z-10 aspect-video object-cover h-screen mx-auto fixed top-0"
        preload="metadata"
        muted
        autoplay
        loop
        playsinline
      ></video>
      <section class="mx-auto max-w-7xl overflow-hidden perspective-normal mix-blend-difference h-screen lg:pb-36 w-full flex justify-center items-center lg:items-end">
        <article
          ref={introPanel}
          class="intro-panel px-6 fixed w-fit flex flex-col justify-center items-center md:flex-row gap-6"
        >
          <div class="text-white/20 h-fit not-md:border-b md:border-r md:pr-2 pb-1">
            <ContainerLabel>Intro</ContainerLabel>
          </div>
          <div class="not-dark:invert flex flex-col gap-6 py-4 justify-center text-center md:text-left w-full max-w-3xl">
            <H1>Hey! My name's Mike.</H1>
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
      <div class="work-panel w-full flex flex-col items-center border-t border-b border-neutral-200 dark:border-neutral-900 bg-white/95 dark:bg-black/80 backdrop-blur-3xl">
        <section class="flex flex-col justify-center items-center text-black dark:text-white pt-18 pb-36 px-12 max-w-7xl">
          <div class="flex flex-col justify-center items-center">
            <figure
              ref={wrapper3d}
              class="min-w-72 min-h-72 not-dark:invert"
            ></figure>
            <div class="p-6 max-w-3xl text-center flex flex-col gap-6 rounded-3xl">
              <H2>
                I like to make things look good, function well, and deliver
                results.
              </H2>
              <p class="pt-6 max-w-lg mx-auto border-t border-neutral-200 dark:border-neutral-800">
                I've developed full ad campaigns, commercials, landing pages and
                websites, and countless other digital and physical assets.
              </p>
            </div>
          </div>
        </section>
        <div class="flex flex-col gap-36 py-18 lg:py-36 px-6 w-full bg-white dark:bg-neutral-950 border-t border-t-neutral-200 dark:border-t-neutral-900">
          <For each={landingHighlights()}>
            {(collection) => (
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
          <section class="flex flex-col lg:flex-row gap-18 items-center px-6 md:px-12 pt-18 mx-auto lg:max-w-7xl w-full">
            <div class="flex flex-col gap-6 lg:max-w-md px-6">
              <H1>Drop a line.</H1>
              <p class="text-black dark:text-white">
                I'm always looking for new opportunities and collaborations.
                Whether you're interested in working together or just want to
                say hi, feel free to send me a message!
              </p>
            </div>
            <form
              class="w-full flex flex-col gap-6 p-6 bg-neutral-100 dark:bg-neutral-900 rounded-3xl border dark:border-t-white border-neutral-300 dark:border-neutral-900 dark:shadow-[0px_-18px_18px_-18px_rgba(255,255,255,0.5)]"
              action="https://api.web3forms.com/submit"
              method="post"
            >
              <div class="flex flex-col gap-3">
                <input
                  type="hidden"
                  name="access_key"
                  value="4ead391c-7d7a-4e29-9e39-9a81fd36f09e"
                />
                <div class="flex flex-col gap-1">
                  <Label>Email</Label>
                  <Input type="text" placeholder="Enter your email" />
                </div>
                <div class="flex flex-col gap-1">
                  <Label>Message</Label>
                  <textarea
                    class="min-h-36 placeholder-black/25 resize-none dark:placeholder-white/25 bg-white dark:bg-white/5 text-black/25 focus:text-black dark:text-white/25 dark:focus:text-white rounded-md px-3 py-1 outline outline-transparent border border-black/10 dark:border-white/10 focus:outline-black/50 dark:focus:outline-white/50 hover:outline-black/25 dark:hover:outline-white/25 def__animate"
                    placeholder="Enter your message"
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
      class="placeholder-black/25 dark:placeholder-white/25 bg-white dark:bg-white/5 text-black/25 focus:text-black dark:text-white/25 dark:focus:text-white rounded-md px-3 py-1 outline outline-transparent border border-neutral-300 dark:border-neutral-900 focus:outline-black/50 dark:focus:outline-white/50 hover:outline-black/25 dark:hover:outline-white/25 def__animate"
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
