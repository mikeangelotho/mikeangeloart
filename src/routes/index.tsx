import { onCleanup, onMount } from "solid-js";
import { PortfolioCollection } from "~/components/Collection";
import Panel3d, { SceneManager } from "~/components/Panel3d";
import data from "../db.json";
import Collection from "~/components/Collection";
import { H1 } from "~/layout/Headings";
import { ContainerLabel } from "~/layout/Cards";
import { MainKeypoint } from "./projects/[slug]";

const collectionData: PortfolioCollection[] = data;
const githubAvatar = await fetchGithubAvatar();

export default function Home() {
  let introPanel!: HTMLDivElement;
  let roleChanger!: HTMLSpanElement;
  let wrapper3d!: HTMLDivElement;
  let videoPanel!: HTMLVideoElement;

  onMount(() => {
    const subheads = [
      "web developer",
      "video editor",
      "web designer",
      "campaign manager",
      "AI enthusiast",
      "skateboarder",
      "guitar player",
      "spaceman",
      "designer",
    ];

    let count = 0;

    setTimeout(() => {
      setInterval(() => {
        roleChanger.style.opacity = "0";
        setTimeout(() => {
          roleChanger.textContent = subheads[count];
          roleChanger.style.opacity = "1";
          count = (count + 1) % subheads.length;
        }, 200);
      }, 3000);
    }, 3000);

    window.addEventListener("scroll", () => {
      const factor = window.scrollY;
      requestAnimationFrame(() => {
        introPanel.style.filter = `blur(${factor / 50}px)`;
        introPanel.style.transform = `translateZ(${factor * -1}px)`;
        introPanel.style.opacity = `clamp(0%, ${100 - factor / 5}%, 100%)`;
      });
    });

    const sceneManager = new SceneManager();
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => {
            sceneManager.init(wrapper3d, "/MA_3DLogo.glb");
            const resizeHandler = () => {
              if (sceneManager) {
                sceneManager.handleResize(wrapper3d);
              }
            };
            window.addEventListener("resize", resizeHandler);
          });
          observer.unobserve(wrapper3d);
        }
      });
    });
    observer.observe(wrapper3d);
    onCleanup(() => {
      sceneManager.dispose();
      observer.disconnect();
    });
  });
  return (
    <main class="w-full">
      <video
        ref={videoPanel}
        src="/Comp 3.mp4"
        class="dark:-hue-rotate-90 not-dark:hue-rotate-45 not-dark:invert not-dark:brightness-200 -z-1 w-full object-cover h-full fixed top-0"
        preload="metadata"
        muted
        autoplay
        loop
        playsinline
      ></video>
      <section class="mx-auto max-w-7xl overflow-hidden perspective-normal mix-blend-difference h-screen relative lg:pb-36 w-full flex justify-start items-center lg:items-end">
        <article
          ref={introPanel}
          class="px-6 fixed w-fit flex flex-col justify-center items-start md:flex-row gap-6"
        >
          <div class="text-white/20 h-fit md:mt-15 not-md:border-b md:border-r md:pr-2 pb-1">
            <ContainerLabel>Intro</ContainerLabel>
          </div>
          <img
            class="border-3 border-white/20 rounded-3xl hover:scale-98 def__animate max-w-36 max-h-60"
            src={githubAvatar}
            loading="eager"
          />
          <div class="flex flex-col gap-2 py-4 justify-center text-white text-left w-full max-w-xl">
            <H1>Hey! My name's Mike.</H1>
            <p class="lg:pb-3 text-4xl md:text-5xl tracking-tighter">
              I'm a{" "}
              <span
                ref={roleChanger}
                class="underline transition-opacity duration-100 ease-out"
              >
                designer
              </span>
              .
            </p>
          </div>
        </article>
      </section>
      <section class="border-t lg:border border-black/10 dark:border-white/10 dark:border-t-white mb-72 backdrop-blur-3xl bg-white dark:bg-black/80 lg:rounded-3xl backdrop-brightness-150 backdrop-saturate-200 w-full pb-6 px-6 lg:px-12 lg:pt-3 lg:max-w-5xl mx-auto flex flex-col-reverse lg:flex-row justify-center items-center">
        <article class="lg:pl-12 pb-12 lg:pb-0 flex flex-col justify-center items-center lg:items-start">
          <div class="text-black/20 w-fit dark:text-white/20 h-fit border-b border-b-black/10 dark:border-b-white/10 pb-1 mb-3">
            <ContainerLabel>Who I Am</ContainerLabel>
          </div>
          <p class="text-2xl dark:text-white text-black max-w-3xl lg:max-w-full">
            I currently take on projects independently, but I'm always
            interested in new opportunities. Whether it's design, development,
            or blending both, I'm looking to team up with people who want to
            create meaningful work.
          </p>
        </article>
        <div
          ref={wrapper3d}
          class="hover:scale-95 mt-6 min-h-72 mx-auto w-full def__animate cursor-grab"
        ></div>
      </section>
      <div class="flex flex-col items-center border-t border-b border-black/10 dark:border-white/10 dark:shadow-[0px_0px_72px_0px_rgba(255,255,255,0.1)] bg-white/80 dark:bg-black/80 backdrop-blur-3xl backdrop-brightness-150 backdrop-saturate-200">
        <div class="flex flex-col gap-3 px-6 max-w-3xl py-36 ">
          <H1>Have a look at some of my work.</H1>
          <p class="pl-0.5 text-black">
            I currently take on projects independently, but I'm always
            interested in new opportunities. Whether it's design, development,
            or blending both, I'm looking to team up with people who want to
            create meaningful work.
          </p>
        </div>
        <div class="w-full py-36 bg-neutral-100">
          <MainKeypoint
            data={collectionData[0]}
            standalone={true}
            reverse={true}
          />
        </div>
        <div class="w-full py-36 bg-neutral-50">
          <MainKeypoint
            data={collectionData[0]}
            standalone={true}
            reverse={true}
          />
        </div>
        <div class="w-full py-36 bg-neutral-100">
          <MainKeypoint
            data={collectionData[0]}
            standalone={true}
            reverse={true}
          />
        </div>
      </div>
      <div class="border-b border-b-black/10 dark:border-b-white/10">
        <Collection data={collectionData} />
      </div>
      <div class="bg-white/80 dark:bg-black/80 backdrop-blur-3xl backdrop-brightness-150 backdrop-saturate-200">
        <Panel3d
          data="/MA_3DLogo.glb"
          headline="Check out some of my work."
          paragraph="I currently take on projects independently, but I'm always interested in new opportunities. Whether it's design, development, or blending both, I'm looking to team up with people who want to create meaningful work."
          reverse={true}
        />
        <section class="flex lg:px-6 lg:pb-24 mx-auto lg:max-w-3xl w-full">
          <form
            class="w-full flex flex-col gap-3 p-12 bg-white dark:bg-neutral-900 lg:rounded-3xl border-t border-t-black/10 dark:lg:border-t-white lg:border lg:border-black/10 dark:border-white/10 dark:shadow-[0px_-18px_18px_-18px_rgba(255,255,255,0.5)]"
            action="https://api.web3forms.com/submit"
            method="post"
          >
            <input
              type="hidden"
              name="access_key"
              value="4ead391c-7d7a-4e29-9e39-9a81fd36f09e"
            />
            <Label>Email</Label>
            <Input type="text" placeholder="Enter your email" />
            <Label>Message</Label>
            <textarea
              class="min-h-36 placeholder-black/25 resize-none dark:placeholder-white/25 bg-white dark:bg-white/5 text-black/25 focus:text-black dark:text-white/25 dark:focus:text-white rounded-md px-3 py-1 outline outline-transparent border border-black/10 dark:border-white/10 focus:outline-black/50 dark:focus:outline-white/50 hover:outline-black/25 dark:hover:outline-white/25 def__animate"
              placeholder="Enter your message"
            ></textarea>
            <button class="def__button" type="submit">
              Send Me a Message
            </button>
          </form>
        </section>
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

async function fetchGithubAvatar() {
  const req = await fetch("https://api.github.com/users/bippolaroid");
  if (req.ok) {
    const json: any = await req.json();
    return json["avatar_url"];
  }
}
