import { A } from "@solidjs/router";
import { onMount } from "solid-js";
import Panel3d from "~/components/Panel3d";

const githubAvatar = await fetchGithubAvatar();

export default function Home() {
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
        <article class="h-screen md:h-fit w-full lg:max-w-5xl lg:rounded-full p-6 pt-28 md:pt-6 md:border-t-2 md:border-t-white/80 flex flex-col md:flex-row gap-12 dark:shadow-[0px_-16px_18px_-18px_rgba(255,255,255,0.8)] backdrop-blur-3xl backdrop-brightness-200 dark:backdrop-brightness-75">
          <img
            class="rounded-full hover:scale-98 def__animate mx-auto max-w-60 max-h-60"
            src={githubAvatar}
          />
          <div class="flex flex-col gap-2 justify-center text-center md:text-left w-full">
            <h1 class="text-4xl md:text-5xl text-black dark:text-white font-bold tracking-tighter">
              Hey! My name's Mike.
            </h1>
            <h1 class="text-4xl md:text-5xl text-black dark:text-white tracking-tighter">
              I'm a{" "}
              <span
                id="role-changer"
                class="underline transition-opacity duration-200 ease-out"
              >
                designer
              </span>
              .
            </h1>
            <A href="/about" class="def__button">
              More about me
            </A>
          </div>
        </article>
      </section>
      <section class="border-t border-t-white/50 w-full lg:pb-36 backdrop-blur-3xl bg-white/80 dark:bg-transparent backdrop-brightness-200 dark:backdrop-brightness-5">
        <Panel3d
          data="/MA_3DLogo.glb"
          headline="Test"
          paragraph="Test2"
          reverse={false}
        />
      </section>
    </main>
  );
}

async function fetchGithubAvatar() {
  const req = await fetch("https://api.github.com/users/bippolaroid");
  if (req.ok) {
    const json: any = await req.json();
    return json["avatar_url"];
  }
}
