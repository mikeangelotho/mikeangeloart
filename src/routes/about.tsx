import {
  createSignal,
  For,
  JSXElement,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import { Button, ContainerLabel, Tag } from "~/layout/Cards";
import { H2 } from "~/layout/Headings";
import { fetchGithubInfo, GitHubUser } from "~/hooks";
import SEO from "~/components/SEO";
import BgGradient from "~/components/BgGradient";

const taskbarIcons = [
  {
    name: "Photoshop",
    icon: "https://cdn.mikeangelo.art/MA_WebIcons_Ps.svg",
    color: "#002341ff",
  },
  {
    name: "Illustrator",
    icon: "https://cdn.mikeangelo.art/MA_WebIcons_Ai.svg",
    color: "#532100ff",
  },
  {
    name: "InDesign",
    icon: "https://cdn.mikeangelo.art/MA_WebIcons_Id.svg",
    color: "#7c0029ff",
  },
  {
    name: "Premiere Pro",
    icon: "https://cdn.mikeangelo.art/MA_WebIcons_Pr.svg",
    color: "#000e55ff",
  },
  {
    name: "After Effects",
    icon: "https://cdn.mikeangelo.art/MA_WebIcons_Ae.svg",
    color: "#000e55ff",
  },
  {
    name: "Figma",
    icon: "https://cdn.mikeangelo.art/MA_WebIcons_Figma.svg",
    color: "#1d0319",
  },
  {
    name: "VS Code",
    icon: "https://cdn.mikeangelo.art/MA_WebIcons_VSCode.svg",
    color: "#0065A9",
  },
  {
    name: "Blender",
    icon: "https://cdn.mikeangelo.art/MA_WebIcons_Blender.svg",
    color: "#ca6500ff",
  },
];

export default function About() {
  let videoPanel!: HTMLVideoElement;
  let wrapper3D!: HTMLDivElement;
  let desktop!: HTMLDivElement;

  const [windows, setWindows] = createSignal<
    { label?: string; window: JSXElement }[]
  >([]);
  //
  // track via Accessor instead
  //
  const [windowMap, setWindowMap] = createSignal<string[]>([]);
  const Moveable = ({
    children,
    label,
    options = {
      x: 0,
      y: 0,
      z: 0,
    },
    noMobile = false,
  }: {
    children: JSXElement;
    label?: string;
    options?: {
      x: number;
      y: number;
      z: number;
    };
    noMobile?: boolean;
  }) => {
    let container!: HTMLDivElement;

    onMount(() => {
      function handleResize() {
        const { innerWidth, innerHeight } = window;
        if (container) {
          container.style.zIndex = `${options?.z || 0}`;
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
    });

    const clickHandler = (e: MouseEvent) => {
      container.classList.add("z-1");
      const onMove = (e: MouseEvent) => moveRect(e, container);

      window.addEventListener("mousemove", onMove);
      const stop = () => {
        container.classList.remove("z-1");
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", stop);
      };

      window.addEventListener("mouseup", stop);
    };

    const touchHandler = (e: TouchEvent) => {
      container.classList.add("z-1");
      const onMove = (e: TouchEvent) => moveRectTouch(e, container);
      window.addEventListener("touchmove", onMove);
      const stop = () => {
        container.classList.remove("z-1");
        window.removeEventListener("touchmove", onMove);
        window.removeEventListener("touchend", stop);
      };

      window.addEventListener("touchend", stop);
    };

    return (
      <div
        ref={container}
        class={`w-full lg:w-fit lg:max-w-2xl h-fit relative mx-auto flex flex-col justify-center md:items-start items-center def__animate md:hover:scale-101 md:absolute md:cursor-grab md:select-none
          ${noMobile ? ` hidden md:block` : ``}`}
        onMouseDown={(e) => clickHandler(e)}
        onTouchStart={(e) => touchHandler(e)}
      >
        <div class="opacity-10 def__animate hover:opacity-80">
          <div
            class="p-12 -translate-y-12.5 translate-x-24 absolute top-0 right-0 w-fit cursor-pointer def__animate text-black dark:text-white"
            onClick={() => {
              container.remove();
              setWindowMap((prev) => prev.filter((item) => item !== label));
              setWindows((prev) => prev.filter((item) => item.label !== label));
            }}
          >
            <div
              class="px-2 py-1 border text-xs rounded-md"
              aria-label="Close window"
            >
              Χ
            </div>
          </div>{" "}
          <Show when={label}>
            <div class="mb-3 pb-1 w-fit text-black/ dark:text-white border-b dark:border-b-white/10">
              <ContainerLabel>
                {label !== "VS Code" ? label || "" : "Github"}
              </ContainerLabel>
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
      const { width, height } = element.getBoundingClientRect();
      const { clientX, clientY } = e;
      requestAnimationFrame(() => {
        element.style.left = `clamp(12px, ${clientX - width / 2}px, ${
          innerWidth - width - 12
        }px)`;
        element.style.top = `clamp(96px, ${clientY - height / 2}px, ${
          innerHeight - height - 144
        }px)`;
      });
    }
  }

  function moveRectTouch(e: TouchEvent, element: HTMLDivElement) {
    if (window.innerWidth > 768) {
      const { innerWidth, innerHeight } = window;
      const { width, height } = element.getBoundingClientRect();
      const { clientX, clientY } = e.touches[0];
      requestAnimationFrame(() => {
        element.style.left = `clamp(12px, ${clientX - width / 2}px, ${
          innerWidth - width - 12
        }px)`;
        element.style.top = `clamp(96px, ${clientY - height / 2}px, ${
          innerHeight - height - 144
        }px)`;
      });
    }
  }

  const Box = ({ children }: { children: JSXElement }) => {
    return (
      <div class="p-6 rounded-xl gap-6 w-full border border-black/10 bg-white/95 dark:border-white/10 dark:border-t dark:bg-black/95 dark:border-t-white text-black dark:text-white">
        {children}
      </div>
    );
  };

  const newWindow = async (label: string) => {
    let data: GitHubUser | any;
    let newWindow: JSXElement;
    async function getGithubLanguages(data: GitHubUser) {
      let languages: string[] = [];
      const res: any[] = await fetch(data.repos_url).then((res) => res.json());
      res.forEach((repo) => {
        if (!languages.includes(repo.language) && repo.language != null) {
          languages.push(repo.language);
        }
      });
      return languages;
    }
    switch (label) {
      case "VS Code":
        data = await fetchGithubInfo();
        const languages = await getGithubLanguages(data);
        newWindow = (
          <Moveable options={{ x: 3, y: 3, z: 5 }} label={"VS Code"}>
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
                      <For each={languages}>{(lang) => <Tag>{lang}</Tag>}</For>
                    </div>
                  </div>
                </div>
              </div>
            </Box>
          </Moveable>
        );
        break;
      default:
        newWindow = (
          <Moveable options={{ x: 3, y: 3, z: 0 }} label={label}>
            <Box>
              <div class="flex flex-col gap-6 w-fit">
                <H2>Down for Maintenance</H2>
                <p class="text-sm">
                  <strong>Updating {label}</strong>... please check back
                  later...{" "}
                </p>
              </div>
            </Box>
          </Moveable>
        );
        break;
    }
    return newWindow;
  };

  onMount(() => {
    setWindows((prev) => [
      ...prev,
      {
        label: "Profile Summary",
        window: (
          <Moveable label="Profile Summary" options={{ x: 6.5, y: 8, z: 0 }}>
            <Box>
              <div class="flex flex-col gap-8 max-w-3xl">
                <div class="flex flex-col gap-6 border-t border-b border-black/10 dark:border-white/10 max-h-[40vh] lg:max-h-[60vh] overflow-y-auto pr-6">
                  <div class="pb-6 gap-6 w-full flex flex-col justify-start items-center">
                    <div class="py-6 gap-6 w-full flex flex-col-reverse sm:flex-row items-center">
                      <img
                        class="w-full max-w-72 ring-2 ring-black/10 dark:ring-white/10 md:max-w-1/3 rounded-lg"
                        src="https://cdn.mikeangelo.art/MA_Headshot_FINAL_BLUR.png"
                        alt="Me doin my thing: standing in front of a brick wall"
                        width="200"
                        height="100"
                      />
                      <div class="flex flex-col gap-3">
                        <p>
                          <strong class="text-2xl">What I Do</strong>
                        </p>
                        <p>
                          I help breathe fresh air into brands and products.
                          Whether I'm developing an advertising campaign,
                          implementing code, or designing a landing page, my
                          passion lies in translating ideas into powerful
                          digital experiences.
                        </p>
                      </div>
                    </div>
                    <div class="flex flex-col gap-3">
                      <p>
                        <strong class="text-2xl">Why I Do It</strong>
                      </p>
                      <p>
                        Creativity and storytelling. My mission in life is to
                        use my love for technology and my design skills to make
                        an impact in the people, both emotionally and tangibly.
                      </p>
                      <p>
                        Aside from my daily screen activities, I like to hike
                        and get lost in nature, write electric guitar songs that
                        I immediately forget, attempt to skateboard, and stay
                        endlessly curious about engineering, philosophy, and the
                        universe.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Box>
          </Moveable>
        ),
      },
    ]);

    setWindows((prev) => [
      ...prev,
      {
        label: "Alert",
        window: (
          <Moveable label="Alert" options={{ x: 1.45, y: 4, z: 0 }}>
            <Box>
              <div class="flex flex-col items-center gap-6">
                <p class="text-sm">A resume has been detected.</p>
                <Button
                  type="button"
                  onClick={() => {
                    window.open(
                      "https://drive.google.com/file/d/19YC8e7dQdSdLOgxJTxqWJAuy_Z8jGFNK/view?usp=drive_link",
                      "_blank",
                    ); // Placeholder URL, please update!
                  }}
                >
                  View Resume
                </Button>{" "}
              </div>
            </Box>
          </Moveable>
        ),
      },
    ]);
  });

  return (
    <>
      <SEO
        title="About Mike Angelo | Creative Technologist in New Jersey and New York | Graphic and Motion Design, Web Development, and Advertising Campaigns"
        description="Learn more about Mike Angelo, a Creative Technologist in New Jersey specializing in creative design, comprehensive marketing campaigns, and web design and development."
        canonical="https://mikeangeloart.com/about"
        ogImage="https://cdn.mikeangelo.art/og-default.png"
        breadcrumbs={[
          { name: "Home", url: "https://mikeangeloart.com" },
          { name: "About", url: "https://mikeangeloart.com/about" },
        ]}
        localBusiness={true}
        organization={true}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Mike Angelo",
          jobTitle: "Art Director & Web Designer",
          description:
            "Art director and web designer with a passion for turning ideas into tangible, functional, and beautiful digital experiences.",
          url: "https://mikeangeloart.com/about",
          knowsAbout: [
            "Art Direction",
            "Web Design",
            "Digital Experiences",
            "Adobe Creative Suite",
            "Figma",
            "Web Development",
          ],
          worksFor: {
            "@type": "Organization",
            name: "Freelance",
          },
        }}
      />
      <main class="w-full relative">
        <BgGradient />
        <div class="h-screen w-full fixed">
          <div class="h-[89vh] pt-22 xl:px-72">
            <div
              ref={desktop}
              class="border-t border-b h-full overflow-x-hidden flex flex-col gap-6 border-black/10 dark:border-white/10 p-6"
            >
              <For each={windows()}>{(item) => item.window}</For>
            </div>
          </div>
          <div class="h-[10vh] pt-3 flex items-center px-4">
            <div
              class="p-3 max-w-7xl mx-auto w-fit h-fit border border-black/20 dark:border-white/10 rounded-3xl bg-white/80 dark:bg-black/80 flex flex-row justify-center items-center overflow-x-auto"
              style="scrollbar-width: none;"
            >
              <For each={taskbarIcons}>
                {(icon) => {
                  return (
                    <div
                      class={`cursor-pointer def__animate px-0.5 hover:px-1.5 shrink-0 hover:scale-110 hover:-translate-y-1`}
                      onClick={async () => {
                        if (windowMap().includes(icon.name)) return;
                        const newWin = await newWindow(icon.name);
                        setWindows((prev) => [
                          ...prev,
                          { label: icon.name, window: newWin },
                        ]);
                        setWindowMap((prev) => [...prev, icon.name]);
                      }}
                    >
                      <div
                        class="border border-white/10 rounded-xl"
                        style={`background-color: ${icon.color}`}
                      >
                        <img
                          src={icon.icon}
                          alt={icon.name}
                          class={`p-1 h-9 w-9 md:h-12 md:w-12 mix-blend-soft-light`}
                          width="48"
                          height="48"
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
    </>
  );
}
