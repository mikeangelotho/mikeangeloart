import { For, JSXElement, onCleanup, onMount, Show } from "solid-js";
import { init3dScene } from "~/components/Panel3d";
import { ContainerLabel } from "~/layout/Cards";
import { H1 } from "~/layout/Headings";
import { fetchGithubAvatar } from ".";

const githubAvatar = await fetchGithubAvatar();

const taskbarIcons = [
  {
    name: "Photoshop",
    icon: "/MA_26Logo.svg",
    color: "#bb2b5b",
  },
  {
    name: "Photoshop",
    icon: "/MA_26Logo.svg",
    color: "#8078ce",
  },
  {
    name: "Photoshop",
    icon: "/MA_26Logo.svg",
    color: "#8078ce",
  },
  {
    name: "Photoshop",
    icon: "/MA_26Logo.svg",
    color: "#e67206",
  },
  {
    name: "Photoshop",
    icon: "/MA_26Logo.svg",
    color: "#26a9d1",
  },
];

export default function About() {
  let videoPanel!: HTMLVideoElement;
  let wrapper3D!: HTMLDivElement;

  onMount(() => {
    const [sceneManager, observer] = init3dScene(wrapper3D, "/MA_3DLogo.glb");
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
        <div class="max-h-[88%] h-full pt-24 pb-3 xl:px-72">
          <div class="border-t border-b h-full border-black/10 dark:border-white/10 p-6">
            <Moveable label="About Me">
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
            </Moveable>
            <Moveable label="Logo" mobileOnly={true} options={{ y: 300 }}>
              <div ref={wrapper3D} class="w-72 h-72 pointer-events-none"></div>
            </Moveable>
            <Moveable label="Me" options={{ x: 596, y: 200 }}>
              <img
                src={githubAvatar}
                class="w-72 h-72 rounded-xl pointer-events-none object-cover"
              />
            </Moveable>
          </div>
        </div>
        <div class="h-[10%] px-3">
          <div
            class="p-6 max-w-7xl mx-auto w-full md:w-fit h-fit border border-black/20 dark:border-white/10 rounded-3xl bg-white/80 dark:bg-black/80 flex flex-row justify-start sm:justify-center items-center overflow-x-auto"
            style="scrollbar-width: none;"
          >
            <For each={taskbarIcons}>
              {(icon) => {
                return (
                  <div
                    class={`cursor-pointer def__animate px-1.5 hover:px-3 shrink-0 hover:scale-110 hover:-translate-y-1`}
                  >
                    <img
                      src={icon.icon}
                      alt={icon.name}
                      class={`p-3 h-12 w-12 bg-[${icon.color}] rounded-lg`}
                    />
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

const Moveable = ({
  children,
  label,
  options,
  mobileOnly = false,
}: {
  children: JSXElement;
  label?: string;
  options?: {
    x?: number;
    y?: number;
  };
  mobileOnly?: boolean;
}) => {
  let container!: HTMLDivElement;

  onMount(() => {
    function setTiles() {
      const { x, y } = (
        container.parentElement as Element
      ).getBoundingClientRect();
      container.style.left = `${(options?.x as number) + x}px`;
      container.style.top = `${(options?.y as number) + y}px`;
    }
    setTiles();
    window.addEventListener("resize", () => {
      setTiles();
    });
  });

  return (
    <div
      ref={container}
      class={`hover:scale-102 def__animate md:absolute md:cursor-grab md:select-none
        ${mobileOnly ? ` hidden md:block` : ``}`}
      onMouseDown={(e) => {
        const target = e.target as Element;
        target.classList.add("z-1");
        document.addEventListener("mousemove", moveRect);
      }}
      onMouseUp={(e) => {
        const target = e.target as Element;
        target.classList.remove("z-1");
        document.removeEventListener("mousemove", moveRect);
      }}
      onMouseOut={(e) => {
        const target = e.target as Element;
        target.classList.remove("z-1");
        document.removeEventListener("mousemove", moveRect);
      }}
    >
      <Show when={label}>
        <div class="mb-3 pb-1 w-fit text-black/20 dark:text-white/20 border-b dark:border-b-white/20">
          <ContainerLabel>{label || ""}</ContainerLabel>
        </div>
      </Show>
      {children}
    </div>
  );
};

function moveRect(e: MouseEvent) {
  if (window.innerWidth > 768) {
    const { innerWidth, innerHeight } = window;
    const target = e.target as HTMLDivElement;
    const { x, y, width, height } = target.getBoundingClientRect();
    const { clientX, clientY } = e;
    requestAnimationFrame(() => {
      target.style.left = `clamp(12px, ${clientX - width / 2}px, ${
        innerWidth - width - 12
      }px)`;
      target.style.top = `clamp(96px, ${clientY - height / 2}px, ${
        innerHeight - height - 144
      }px)`;
    });
  }
}

const Box = ({ children }: { children: JSXElement }) => {
  return (
    <div class="backdrop-blur-3xl pointer-events-none gap-6 md:max-w-md border border-black/10 bg-white/80 dark:border-white/10 dark:border-t dark:bg-black/80 dark:border-t-white h-fit w-full md:w-fit p-6 rounded-xl mx-auto md:min-w-md text-black dark:text-white">
      {children}
    </div>
  );
};
