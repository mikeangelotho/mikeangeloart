import { onCleanup, onMount } from "solid-js";
import { PortfolioCollection } from "~/components/Collection";
import { SceneManager } from "~/components/Panel3d";
import data from "../db.json";
import Collection from "~/components/Collection";
import { H1 } from "~/layout/Headings";
import { Button, ContainerLabel } from "~/layout/Cards";
import { MainKeypoint } from "./projects/[slug]";

const collectionData: PortfolioCollection[] = data;

export default function Home() {
  let introPanel!: HTMLDivElement;
  let roleChanger!: HTMLSpanElement;
  let wrapper3d!: HTMLDivElement;
  let videoPanel!: HTMLVideoElement;
  let whoIAm!: HTMLDivElement;

  onMount(() => {
    const subheads = [
      "an AI enthusiast",
      "a skateboarder",
      "a computer nerd",
      "a guitar player",
      "a stargazer",
      "a design technologist",
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

    let flag = false;
    window.addEventListener("scroll", () => {
      const factor = window.scrollY;
      const factorTwo = factor - 900;

      requestAnimationFrame(() => {
        introPanel.style.filter = `blur(${factor / 50}px)`;
        introPanel.style.transform = `translateZ(${factor * -1}px)`;
        introPanel.style.opacity = `clamp(0%, ${100 - factor / 5}%, 100%)`;
        videoPanel.style.opacity = `clamp(25%, ${100 - factor / 20}%, 100%)`;

        if (factor > 900 || flag) {
          flag = true;
          whoIAm.style.filter = `blur(${factorTwo / 50}px)`;
          whoIAm.style.opacity = `clamp(0%, ${100 - factorTwo / 5}%, 100%)`;
        }
      });
    });

    const sceneManager = new SceneManager();
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => {
            sceneManager.init(wrapper3d, "/MA_Logo_3D.glb");
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
    <main class="w-full relative flex flex-col justify-center items-center px-3 lg:px-6 pb-12 mb-12">
      <video
        ref={videoPanel}
        src="/Comp_3.mp4"
        class="w-full dark:-hue-rotate-90 not-dark:hue-rotate-45 not-dark:invert not-dark:brightness-200 -z-1 aspect-video object-cover h-screen mx-auto fixed top-0"
        preload="metadata"
        muted
        autoplay
        loop
        playsinline
      ></video>
      <section class="mx-auto max-w-7xl overflow-hidden perspective-normal mix-blend-difference h-screen relative lg:pb-36 w-full flex justify-center items-center lg:items-end">
        <article
          ref={introPanel}
          class="px-6 fixed w-fit flex flex-col justify-center items-center md:flex-row gap-6"
        >
          <div class="text-white/20 h-fit not-md:border-b md:border-r md:pr-2 pb-1">
            <ContainerLabel>Intro</ContainerLabel>
          </div>
          <div class="flex flex-col gap-2 py-4 justify-center text-left w-full max-w-xl">
            <span class="not-dark:invert">
              <H1>Hey! My name's Mike.</H1>
            </span>
            <p class="opacity-30 lg:pb-3 invert text-4xl md:text-5xl tracking-tighter">
              I'm{" "}
              <span
                ref={roleChanger}
                class="italic transition-opacity duration-100 ease-out"
              >
                a design technologist
              </span>
              .
            </p>
          </div>
        </article>
      </section>
      <section
        ref={whoIAm}
        class="mb-[50vh] border border-t border-black/10 dark:border-white/5 dark:border-t-white lg:mb-72 rounded-3xl bg-white/75 dark:bg-black/75 w-fit lg:w-full lg:max-w-3xl mx-auto flex flex-col-reverse lg:flex-row justify-center items-center"
      >
        <figure
          ref={wrapper3d}
          class="hover:scale-95 mt-6 min-h-72 mx-auto w-full def__animate cursor-grab"
        ></figure>
        <article class="bg-white dark:bg-black/80 flex flex-col justify-center items-center lg:items-start max-w-md p-6 m-6 rounded-xl border border-black/5 dark:border-white/5">
          <div class="text-black/20 w-fit dark:text-white/20 h-fit border-b border-b-black/10 dark:border-b-white/10 pb-1 mb-3">
            <ContainerLabel>What I Do</ContainerLabel>
          </div>
          <h3 class="text-2xl dark:text-white/80 text-black max-w-3xl lg:max-w-full">
            <strong>I like to make things look great, work well, and deliver results.</strong>
          </h3>
          <br />
          <p class="text-lg dark:text-white/50 text-black/50 max-w-3xl lg:max-w-full">
            Currently, I work with clients to create high-quality creative assets, engaging videos and social media content, and captivating website experiences.
          </p>
        </article>

      </section>
      <div class="rounded-tl-3xl rounded-tr-3xl w-full flex flex-col border border-black/10 dark:border-white/5 dark:border-t-white bg-white/80 dark:bg-black/50">
        <section class="max-w-3xl mx-auto flex items-start text-black dark:text-white flex-col gap-3 pt-36 lg:pt-72 px-12">
          <H1>Check out some of my work.</H1>
          <p class="text-lg text-black/50 dark:text-white/50">
            I've worked on a variety of projects and campaigns that include digital display banners, paid social media advertising, social media content, editing and motion graphics work, and web design and development.
          </p>
        </section>
        <div class="flex flex-col py-36 lg:py-72 gap-36 lg:gap-72">
          <div class="w-full max-w-7xl mx-auto px-6">
            <MainKeypoint
              data={collectionData[0]}
              standalone={true}
              reverse={true}
            />
          </div>
          <div class="w-full max-w-7xl mx-auto px-6">
            <MainKeypoint
              data={collectionData[1]}
              standalone={true}
              reverse={true}
            />
          </div>
          <div class="w-full max-w-7xl mx-auto px-6">
            <MainKeypoint
              data={collectionData[2]}
              standalone={true}
              reverse={true}
            />
          </div>
        </div>
      </div>
      <div class="bg-white/80 dark:bg-black/50 w-full">
        <div class="w-full border-l border-r border-black/5 dark:border-white/5">
          <Collection data={collectionData} />
        </div>
        <div class="border py-24 lg:border border-black/5 dark:border-white/5 w-full rounded-bl-3xl rounded-br-3xl">
          <section class="flex flex-col lg:flex-row gap-36 lg:gap-12 items-center px-3 md:px-12 lg:py-24 mx-auto lg:max-w-5xl w-full">
            <div class="flex flex-col gap-6 lg:max-w-md px-9 md:px-6">
              <H1>Drop a line.</H1>
              <p class="text-black/50 dark:text-white/50">
                I'm always looking for new opportunities and collaborations. Whether you're interested in working together or just want to say hi, feel free to send me a message!
              </p>
            </div>
            <form
              class="w-full flex flex-col gap-6 p-6 bg-neutral-50 dark:bg-neutral-950 rounded-3xl border dark:border-t-white border-black/10 dark:border-white/10 dark:shadow-[0px_-18px_18px_-18px_rgba(255,255,255,0.5)]"
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
