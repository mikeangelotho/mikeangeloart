import { onMount } from "solid-js";
import { PortfolioCollection } from "~/components/Collection";
import Panel3d from "~/components/Panel3d";
import data from "../db.json";
import Collection from "~/components/Collection";
import { H1 } from "~/layout/Headings";

const collectionData: PortfolioCollection[] = data;
const githubAvatar = await fetchGithubAvatar();

export default function Home() {
  let introPanel!: HTMLDivElement;
  onMount(() => {
    const span = document.querySelector("#role-changer") as HTMLElement;
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

    if (span) {
      setTimeout(() => {
        setInterval(() => {
          span.style.opacity = "0";
          setTimeout(() => {
            span.textContent = subheads[count];
            span.style.opacity = "1";
            count = (count + 1) % subheads.length;
          }, 200);
        }, 3000);
      }, 3000);
    }
  });
  return (
    <main class="w-full">
      <video
        src="/MA_26Site_HomeVideo.mp4"
        class="-z-1 w-full object-cover h-full fixed top-0"
        preload="metadata"
        muted
        autoplay
        loop
        playsinline
      ></video>
      <section class="h-screen lg:pb-36 w-full flex justify-center items-center lg:items-end lg:px-6 max-w-7xl mx-auto">
        <article
          ref={introPanel}
          class="h-screen bg-white/45 lg:h-fit w-full lg:max-w-5xl lg:rounded-full p-6 border-t-2 border-t-white/50 flex flex-col justify-center lg:flex-row gap-12 dark:shadow-[0px_-16px_18px_-18px_rgba(255,255,255,0.8)] backdrop-blur-3xl backdrop-brightness-200"
        >
          <img
            class="rounded-full hover:scale-98 def__animate mx-auto max-w-60 max-h-60"
            src={githubAvatar}
            loading="eager"
          />
          <div class="flex flex-col gap-2 justify-center text-center lg:text-left w-full">
            <H1>Hey! My name's Mike.</H1>
            <p class="pb-6 text-4xl md:text-5xl text-black tracking-tighter">
              I'm a{" "}
              <span
                id="role-changer"
                class="underline transition-opacity duration-200 ease-out"
              >
                designer
              </span>
              .
            </p>
          </div>
        </article>
      </section>
      <div class="backdrop-blur-3xl bg-white/90 dark:bg-transparent backdrop-brightness-200 dark:backdrop-brightness-10">
        <Panel3d
          data="/MA_3DLogo.glb"
          headline="Check out some of my work."
          paragraph="I currently take on projects independently, but I'm always interested in new opportunities. Whether it's design, development, or blending both, I'm looking to team up with people who want to create meaningful work."
        />
        <Collection data={collectionData} enableSearch={true} />
        <Panel3d
          data="/MA_3DLogo.glb"
          headline="Check out some of my work."
          paragraph="I currently take on projects independently, but I'm always interested in new opportunities. Whether it's design, development, or blending both, I'm looking to team up with people who want to create meaningful work."
          reverse={true}
        />
        <section class="flex lg:px-6 lg:pb-24 mx-auto lg:max-w-3xl w-full">
          <form
            class="w-full grid gap-3 p-12 bg-white dark:bg-neutral-900 lg:rounded-3xl border-t border-t-black/20 dark:lg:border-t-white lg:border lg:border-black/10 dark:border-white/10 dark:shadow-[0px_-16px_18px_-18px_rgba(255,255,255,0.8)]"
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
        <footer class="px-6 2xl:px-96 text-xs py-6 w-full bg-white/80 dark:bg-black/50 grid gap-3 items-center justify-center md:justify-end border-t border-black/10 dark:border-white/10 text-black/50 dark:text-white/20">
          (L ╹ڡ╹ )&gt; ~ © 2025 Mike Angelo
        </footer>
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
