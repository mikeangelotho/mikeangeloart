import { createEffect, createSignal, For, JSXElement, onCleanup, onMount, Show } from "solid-js";
import { init3dScene } from "~/components/Panel3d";
import { Button, ContainerLabel, Tag } from "~/layout/Cards";
import { H1, H2 } from "~/layout/Headings";
import { fetchGithubAvatar } from ".";
import { fetchGithubInfo, GitHubUser } from "~/hooks";

const githubAvatar = await fetchGithubAvatar();

const taskbarIcons = [
  {
    name: "Photoshop",
    icon: "/MA_WebIcons_Ps.svg",
    color: "#002341ff",
    url: "https://www.behance.net/mikeangelotho"
  },
  {
    name: "Illustrator",
    icon: "/MA_WebIcons_Ai.svg",
    color: "#532100ff",
    url: "https://www.behance.net/mikeangelotho"
  },
  {
    name: "InDesign",
    icon: "/MA_WebIcons_Id.svg",
    color: "#7c0029ff",
    url: "https://www.behance.net/mikeangelotho"
  },
  {
    name: "Premiere Pro",
    icon: "/MA_WebIcons_Pr.svg",
    color: "#000e55ff",
    url: "https://www.behance.net/mikeangelotho"
  },
  {
    name: "After Effects",
    icon: "/MA_WebIcons_Ae.svg",
    color: "#000e55ff",
    url: "https://www.behance.net/mikeangelotho"
  },
  {
    name: "Figma",
    icon: "/MA_WebIcons_Figma.svg",
    color: "#1d0319",
    url: "https://www.figma.com/@mangelo"
  },
  {
    name: "VS Code",
    icon: "/MA_WebIcons_VSCode.svg",
    color: "#0065A9",
  },
  {
    name: "Blender",
    icon: "/MA_WebIcons_Blender.svg",
    color: "#ca6500ff",
  },
  {
    name: "Steam",
    icon: "/MA_WebIcons_Steam.svg",
    color: "#153677ff",
  }
];

export default function About() {
  let videoPanel!: HTMLVideoElement;
  let wrapper3D!: HTMLDivElement;
  let desktop!: HTMLDivElement;

  const [windows, setWindows] = createSignal<JSXElement[]>([]);
  //
  // track via Accessor instead
  //
  let windowMap: string[] = [];

  const Moveable = ({
    children,
    label,
    options = {
      x: 0,
      y: 0
    },
    noMobile = false,
  }: {
    children: JSXElement;
    label?: string;
    options?: {
      x: number;
      y: number;
    };
    noMobile?: boolean;
  }) => {
    let container!: HTMLDivElement;

    onMount(() => {
      function handleResize() {
        const { innerWidth, innerHeight } = window;
        if (container) {
          if (options && innerWidth > 768) {
            requestAnimationFrame(() => {
              container.style.left = `${innerWidth / options.x || 0}px`;
              container.style.top = `${innerHeight / options.y || 0}px`;
            });
          } else {
            if (!noMobile) {
              container.style.left = ``;
              container.style.top = ``;
            }
          }
        }
      }
      handleResize();
      window.addEventListener("resize", handleResize);
      onCleanup(() => {
        window.removeEventListener("resize", handleResize);
      });
    })

    return (
      <div
        ref={container}
        class={`w-fit max-w-2xl h-fit relative mx-auto flex flex-col justify-center md:items-start items-center def__animate md:hover:scale-101 md:absolute md:cursor-grab md:select-none
        ${noMobile ? ` hidden md:block` : ``}`}
        onMouseDown={(e) => {
          container.classList.add("z-1");
          const onMove = (e: MouseEvent) => moveRect(e, container);

          window.addEventListener("mousemove", onMove);
          const stop = () => {
            container.classList.remove("z-1");
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", stop);
          };

          window.addEventListener("mouseup", stop);
        }}
      ><div class="opacity-10 def__animate hover:opacity-80">
          <div class="p-12 -translate-y-12.5 translate-x-24 absolute top-0 right-0 w-fit cursor-pointer def__animate text-black dark:text-white" onClick={() => {
            container.remove();
          }}><div class="px-2 py-1 border text-xs rounded-md" onClick={() => { windowMap = windowMap.filter(item => item !== label); }}>Χ</div></div>
          <Show when={label}>
            <div class="mb-3 pb-1 w-fit text-black/ dark:text-white border-b dark:border-b-white/10">
              <ContainerLabel>{label !== "VS Code" ? label || "" : "Github"}</ContainerLabel>
            </div>
          </Show>
        </div>
        {children}
      </div>
    );
  };

  function moveRect(e: MouseEvent, element: HTMLDivElement) {
    if (window.innerWidth > 768) {
      const { innerWidth, innerHeight } = window;
      const { x, y, width, height } = element.getBoundingClientRect();
      const { clientX, clientY } = e;
      requestAnimationFrame(() => {
        element.style.left = `clamp(12px, ${clientX - width / 2}px, ${innerWidth - width - 12
          }px)`;
        element.style.top = `clamp(96px, ${clientY - height / 2}px, ${innerHeight - height - 144
          }px)`;
      });
    }
  }

  const Box = ({ children }: { children: JSXElement }) => {
    return (
      <div class="p-6 rounded-xl backdrop-blur-3xl gap-6 w-full border border-black/10 bg-white/90 dark:border-white/10 dark:border-t dark:bg-black/90 dark:border-t-white text-black dark:text-white">
        {children}
      </div>
    );
  };

  const newWindow = async (label: string) => {
    let data: GitHubUser | any;
    let newWindow: JSXElement;
    async function getGithubLanguages(data: GitHubUser) {
      let languages: string[] = [];
      const res: any[] = await fetch(data.repos_url).then(res => res.json());
      res.forEach((repo) => {
        if (!languages.includes(repo.language) && repo.language != null) {
          languages.push(repo.language);
        }
      })
      return languages;
    }
    switch (label) {
      case "VS Code":
        data = await fetchGithubInfo();
        const languages = await getGithubLanguages(data);
        newWindow = (<Moveable options={{ x: 3, y: 3 }} label={"VS Code"}>
          <Box>
            <div class="flex flex-col gap-6 w-fit">
              <H2>{data.name}</H2>
              <div class="flex flex-col gap-3">
                <div class="flex flex-col gap-1">
                  <span class="text-xs opacity-30">Bio</span>
                  <p class="text-sm">{data.bio}</p>
                </div>
                <div class="flex flex-col gap-2">
                  <span class="text-xs opacity-30">Languages</span>
                  <div class="flex gap-1">
                    <For each={languages}>{(lang) => (
                      <Tag>{lang}</Tag>
                    )}</For>
                  </div>
                </div>
              </div>
            </div>
          </Box>
        </Moveable>);
        break;
      default:
        newWindow = (<Moveable options={{ x: 3, y: 3 }} label={label}>
          <Box>
            <div class="flex flex-col gap-6 w-fit">
              <H2>Down for Maintenance</H2>
              <p class="text-sm"><strong>Updating {label}</strong>... please check back later...</p>
            </div>
          </Box>
        </Moveable>);
        break;
    }
    return newWindow;
  }

  async function getSteamWindow() {
    const req = await fetch("https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=0071E728918FA8F65C9857A47B55BBED&steamids=76561197982529150");
    const data = await req.json();
    console.log(data);
  }



  onMount(() => {

    setWindows([...windows(), <Moveable label="Logo" noMobile={true} options={{ x: 1.4, y: 1.7 }}>
      <div ref={wrapper3D} class="w-36 h-36 pointer-events-none"></div>
    </Moveable>]);

    setWindows([...windows(), <Moveable label="Identification" options={{ x: 6, y: 8 }}>
      <img
        src={githubAvatar}
        class="w-18 h-18 rounded-3xl pointer-events-none object-cover"
      />
    </Moveable>]);

    setWindows([...windows(), <Moveable label="Profile Summary" options={{ x: 4, y: 6 }}>
      <Box>
        <div class="flex flex-col gap-12 py-6">
          <H1>Introduction</H1>
          <div class="flex flex-col gap-6 border-t border-b border-black/10 dark:border-white/10 pt-6 max-h-[40vh] overflow-y-auto pr-6 mx-6 pb-12">
            <p>I was just a middle school kid making online forum graphics and building competitive gaming websites. I wasn't chasing monetary gain or online status; I was driven by the joy of creation. I was good at it, and I loved it.</p>
            <div class="border-t border-b border-black/10 dark:border-white/10 py-6 w-full flex justify-center"><img class="ring-2 ring-black/10 dark:ring-white/10 md:max-w-1/3 rounded-lg" src="/edited pc guitar me.jpg" /></div>
            <p><strong class="text-2xl">I realized my passion wasn't just a hobby.</strong></p>
            <p>Fast forward to today, and I’m still that kid. The motivation hasn't changed, but the love has deepened. Now, the fun is in the partnership: bringing people’s unique ideas to life.</p>
            <p>I take pride in building and developing brands and campaigns from the ground up, delivering high-quality work that doesn't just look good, but leaves a lasting, measurable mark.</p>
          </div>
        </div>
      </Box>
    </Moveable>]);

    setWindows([...windows(), <Moveable label="Alert" options={{ x: 1.5, y: 5 }}>
      <Box>
        <div class="flex flex-col items-center gap-6">
          <p class="text-sm opacity-20">A resume has been detected.</p>
          <Button type="button" onClick={() => {
            window.open("", "_blank");
          }}>View Resume</Button>
        </div>
      </Box>
    </Moveable>]);

    const [sceneManager, observer] = init3dScene(wrapper3D, "/New A_FINAL.glb");
    onCleanup(() => {
      sceneManager.dispose();
      observer.disconnect();
    });
  });

  return (
    <main class="w-full relative">
      <video
        ref={videoPanel}
        src="/Comp_3.mp4"
        class="h-screen w-full dark:-hue-rotate-90 not-dark:hue-rotate-45 not-dark:invert not-dark:brightness-200 -z-1 aspect-video object-cover mx-auto fixed top-0"
        preload="metadata"
        muted
        autoplay
        loop
        playsinline
      ></video>
      <div class="h-screen w-full fixed dark:backdrop-brightness-50 backdrop-blur">
        <div class="h-[89vh] pt-22 xl:px-72">
          <div ref={desktop} class="border-t border-b h-full overflow-x-hidden flex flex-col gap-6 border-black/10 dark:border-white/10 p-6">
            <For each={windows()}>{(window) => window}</For>
          </div>
        </div>
        <div class="h-[10vh] pt-3 flex items-center px-4">
          <div
            class="p-3 max-w-7xl mx-auto w-full md:w-fit h-fit border border-black/20 dark:border-white/10 rounded-3xl bg-white/80 dark:bg-black/80 flex flex-row justify-center items-center overflow-x-auto"
            style="scrollbar-width: none;"
          >
            <For each={taskbarIcons}>
              {(icon) => {
                return (
                  <div
                    class={`cursor-pointer def__animate px-0.5 hover:px-1.5 shrink-0 hover:scale-110 hover:-translate-y-1`}
                    onClick={async () => {
                      if (windowMap.includes(icon.name)) return;
                      setWindows([...windows(), await newWindow(icon.name)]);
                      windowMap.push(icon.name);
                    }}
                  >
                    <div class="border border-white/10 rounded-xl" style={`background-color: ${icon.color}`}>
                      <img
                        src={icon.icon}
                        alt={icon.name}
                        class={`p-1 h-9 w-9 md:h-12 md:w-12 mix-blend-soft-light`}
                      />
                    </div>
                  </div>
                );
              }}
            </For>
          </div>
        </div>
      </div>
    </main>
  );


}