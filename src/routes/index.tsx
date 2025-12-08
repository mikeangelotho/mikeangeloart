import { onCleanup, onMount } from "solid-js";
import { PortfolioCollection } from "~/components/Collection";
import { SceneManager } from "~/components/Panel3d";
import data from "../db.json";
import Collection from "~/components/Collection";
import { H1 } from "~/layout/Headings";
import { Button, ContainerLabel } from "~/layout/Cards";
import { MainKeypoint } from "./projects/[slug]";

const collectionData: PortfolioCollection[] = data;

const targetListenerMap = new Map<HTMLElement, EventListener>();

function createIntroScrollHandler(target: HTMLElement) {
  return () => {
    const scrollY = window.scrollY;
    const zValue = -scrollY * 0.5;
    target.style.transform = `translateZ(${zValue}px)`;
  };
}

export default function Home() {
  let introPanel!: HTMLDivElement;
  let roleChanger!: HTMLSpanElement;
  let wrapper3d!: HTMLDivElement;
  let videoPanel!: HTMLVideoElement;
  let main!: HTMLDivElement;

  onMount(() => {
    /*
    const subheads = [
      "an AI enthusiast",
      "a skateboarder",
      "a guitar player",
      "a stargazer",
      "a designer & web developer",
    ];

    let count = 0;

    setTimeout(() => {
      const intervalId = setInterval(() => {
        roleChanger.style.opacity = "0";
        setTimeout(() => {
          roleChanger.textContent = subheads[count];
          roleChanger.style.opacity = "1";
          count = (count + 1) % subheads.length;
        }, 200);
      }, 3000);
      onCleanup(() => clearInterval(intervalId));
    }, 1000);
    */

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const introObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const target = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          if (!targetListenerMap.has(target)) {
            const eventL = createIntroScrollHandler(target) as EventListener;
            targetListenerMap.set(target, eventL);
            window.addEventListener("scroll", eventL);
          }
        } else {
          const eventL = targetListenerMap.get(target);
          if (eventL) {
            window.removeEventListener("scroll", eventL);
            targetListenerMap.delete(target);
          }
        }
      });
    }, {
      rootMargin: "0px",
      threshold: 0.5,
    });

    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const target = entry.target as HTMLElement;
        target.classList.toggle("scrolled", !entry.isIntersecting);
      });

    }, observerOptions);

    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoPanel.style.opacity = "1";
          } else {
            videoPanel.style.opacity = "0.25";
          }
        });
      },
      { threshold: 0.5 }
    );

    const sceneManager = new SceneManager(10);
    let resizeHandler: () => void;

    const observer = new IntersectionObserver((entries, observer) => {
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
    }, { threshold: 0.5 });

    observer.observe(wrapper3d);
    introObserver.observe(introPanel);
    scrollObserver.observe(wrapper3d);
    videoObserver.observe(introPanel);

    onCleanup(() => {
      sceneManager.dispose();
      observer.disconnect();
      scrollObserver.disconnect();
      videoObserver.disconnect();
      introObserver.disconnect();
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
          <div class="flex flex-col gap-2 py-4 justify-center text-left w-full max-w-3xl">
            <span class="not-dark:invert">
              <H1>Hey! My name's Mike.</H1>
            </span>
            <p class="lg:pb-3 invert text-4xl md:text-5xl tracking-tighter">
              I'm{" "}
              <span
                ref={roleChanger}
                class="italic transition-opacity duration-100 ease-out"
              >
                a designer & web developer
              </span>
              .
            </p>
          </div>
        </article>
      </section>
      <figure
        ref={wrapper3d}
        class="w-full h-full min-w-96 min-h-96 mb-72"
      ></figure>
      <div ref={main} class="work-panel w-full flex flex-col items-center border border-black/10 dark:border-white/5 bg-white dark:bg-neutral-950">
        <section class="flex flex-col lg:flex-row justify-center items-center text-black dark:text-white gap-18 py-18 lg:py-36 px-18">
          <H1><span class="font-normal leading-relaxed">I like to make things <span class="look-good font-semibold select-none px-3 whitespace-nowrap">look good.</span></span></H1>
          <p class="text-black dark:text-white max-w-xl mr-auto">
            I've worked on a variety of projects and campaigns that include digital display banners, paid social media advertising, social media content, editing and motion graphics work, and web design and development.
          </p>
        </section>
        <div class="flex flex-col gap-36 pb-18 lg:pb-36 px-6 w-full">
          <MainKeypoint
            data={collectionData[0]}
            standalone={true}
          />
          <MainKeypoint
            data={collectionData[1]}
            standalone={true}
          />
          <MainKeypoint
            data={collectionData[2]}
            standalone={true}
          />
        </div>
      </div>
      <div class="bg-white dark:bg-black/90 w-full">
        <div class="w-full border-l border-r border-black/5 dark:border-white/5">
          <Collection data={collectionData} />
        </div>
        <div class="border pb-18 lg:border border-black/5 dark:border-white/5 w-full dark:bg-neutral-950">
          <section class="flex flex-col lg:flex-row gap-36 lg:gap-12 items-center px-3 md:px-12 lg:pt-18 mx-auto lg:max-w-7xl w-full">
            <div class="flex flex-col gap-6 lg:max-w-md px-9 md:px-6">
              <H1>Drop a line.</H1>
              <p class="text-black dark:text-white">
                I'm always looking for new opportunities and collaborations. Whether you're interested in working together or just want to say hi, feel free to send me a message!
              </p>
            </div>
            <form
              class="w-full flex flex-col gap-6 p-6 bg-neutral-100 dark:bg-neutral-900 rounded-3xl border dark:border-t-white border-black/10 dark:border-white/10 dark:shadow-[0px_-18px_18px_-18px_rgba(255,255,255,0.5)]"
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
              </div><div>
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
      class="placeholder-black/25 dark:placeholder-white/25 bg-white dark:bg-white/5 text-black/25 focus:text-black dark:text-white/25 dark:focus:text-white rounded-md px-3 py-1 outline outline-transparent border border-black/10 dark:border-white/10 focus:outline-black/50 dark:focus:outline-white/50 hover:outline-black/25 dark:hover:outline-white/25 def__animate"
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