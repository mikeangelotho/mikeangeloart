import { createEffect, createSignal, For, JSXElement, onCleanup, onMount, Show } from "solid-js";
import { init3dScene } from "~/components/Panel3d";
import { ContainerLabel } from "~/layout/Cards";
import { H1 } from "~/layout/Headings";
import { fetchGithubAvatar } from ".";
import { fetchGithubInfo, GitHubUser } from "~/hooks";

const githubAvatar = await fetchGithubAvatar();

const taskbarIcons = [
  {
    name: "Photoshop",
    icon: "/MA_WebIcons_Ps.svg",
    color: "#002341ff",
  },
  {
    name: "Illustrator",
    icon: "/MA_WebIcons_Ai.svg",
    color: "#532100ff",
  },
  {
    name: "InDesign",
    icon: "/MA_WebIcons_Id.svg",
    color: "#7c0029ff",
  },
  {
    name: "Premiere Pro",
    icon: "/MA_WebIcons_Pr.svg",
    color: "#000e55ff",
  },
  {
    name: "After Effects",
    icon: "/MA_WebIcons_Ae.svg",
    color: "#000e55ff",
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
        class={`w-fit h-fit relative mx-auto flex flex-col justify-center lg:items-start items-center def__animate lg:hover:scale-101 md:absolute lg:cursor-grab lg:select-none
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
      >
        <div class="p-12 -translate-y-12.5 translate-x-24 absolute top-0 right-0 w-fit cursor-pointer opacity-10 hover:opacity-80 def__animate text-black dark:text-white" onClick={() => {
          container.remove();
        }}><div class="px-1.5 border text-sm" onClick={() => { windowMap = windowMap.filter(item => item !== label); }}>Χ</div></div>
        <Show when={label}>
          <div class="mb-3 pb-1 w-fit text-black/20 dark:text-white/10 border-b dark:border-b-white/10">
            <ContainerLabel>{label !== "VS Code" ? label || "" : "Github"}</ContainerLabel>
          </div>
        </Show>
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
      <div class="backdrop-blur-3xl gap-6 lg:max-w-2xl border border-black/10 bg-white dark:border-white/10 dark:border-t dark:bg-black dark:border-t-white h-fit w-full lg:w-fit p-6 rounded-xl mx-auto text-black dark:text-white">
        {children}
      </div>
    );
  };

  const newWindow = async (label: string) => {
    let data: GitHubUser | any;
    let newWindow: JSXElement;
    switch (label) {
      case "VS Code":
        data = await fetchGithubInfo();
        newWindow = (<Moveable options={{ x: 3, y: 3 }} label={"VS Code"}>
          <Box>
            <div class="flex flex-col gap-3 w-fit">
              <H1>{data.name}</H1>
              <div>
                <span class="text-xs opacity-30">Bio</span>
                <p>{data.bio}</p>
              </div>
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

    setWindows([...windows(), <Moveable label="Logo" noMobile={true} options={{ x: 1.5, y: 1.8 }}>
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
        <div class="flex flex-col gap-3 pointer-events-none">
          <H1>Test</H1>
          <p>
            I currently take on projects independently, but I'm always
            interested in new opportunities. Whether it's design,
            development, or blending both, I'm looking to team up with
            people who want to create meaningful work.
          </p>
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
        class="w-full dark:-hue-rotate-90 not-dark:hue-rotate-45 not-dark:invert not-dark:brightness-200 -z-1 aspect-video object-cover h-screen mx-auto fixed top-0"
        preload="metadata"
        muted
        autoplay
        loop
        playsinline
      ></video>
      <div class="h-screen relative dark:backdrop-brightness-50 backdrop-blur">
        <div class="max-h-[86vh] h-full pt-22 pb-3 xl:px-72">
          <div ref={desktop} class="border-t border-b h-full overflow-x-hidden flex flex-col gap-3 border-black/10 dark:border-white/10 p-6">
            <For each={windows()}>{(window) => window}</For>
          </div>
        </div>
        <div class="h-[10vh] px-3">
          <div
            class="p-6 max-w-7xl mx-auto w-full md:w-fit h-fit border border-black/20 dark:border-white/10 rounded-3xl bg-white/80 dark:bg-black/80 flex flex-row justify-center items-center overflow-x-auto"
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
                        class={`p-1 h-10 w-10 md:h-12 md:w-12 mix-blend-soft-light`}
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