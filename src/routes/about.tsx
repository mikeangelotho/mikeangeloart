import { createEffect, createSignal, For, onCleanup, Show } from "solid-js";
import { A, createAsync } from "@solidjs/router";
import { H2 } from "~/layout/Headings";
import SEO from "~/components/SEO";
import AboutWindow, { aboutWindowId } from "~/components/AboutWindow";
import { useLenis } from "~/components/LenisProvider";
import { fetchSiteContent } from "~/utils/content-database";
import type { ContentDatabase } from "~/content/content-model";

const creativeTools = [
  {
    name: "Photoshop",
    icon: "https://cdn.mikeangelo.art/MA_WebIcons_Ps.svg",
  },
  {
    name: "Illustrator",
    icon: "https://cdn.mikeangelo.art/MA_WebIcons_Ai.svg",
  },
  {
    name: "InDesign",
    icon: "https://cdn.mikeangelo.art/MA_WebIcons_Id.svg",
  },
  {
    name: "Premiere Pro",
    icon: "https://cdn.mikeangelo.art/MA_WebIcons_Pr.svg",
  },
  {
    name: "After Effects",
    icon: "https://cdn.mikeangelo.art/MA_WebIcons_Ae.svg",
  },
  {
    name: "Figma",
    icon: "https://cdn.mikeangelo.art/MA_WebIcons_Figma.svg",
  },
  {
    name: "VS Code",
    icon: "https://cdn.mikeangelo.art/MA_WebIcons_VSCode.svg",
  },
  {
    name: "Blender",
    icon: "https://cdn.mikeangelo.art/MA_WebIcons_Blender.svg",
  },
];

const toolDescriptions: Record<string, string> = {
  Photoshop: "Image editing, compositing, and promotional layouts.",
  Illustrator: "Vector artwork, identity applications, and campaign graphics.",
  InDesign: "Print layouts, mailers, and editorial materials.",
  "Premiere Pro": "Video editing for commercials, events, and social campaigns.",
  "After Effects": "Motion graphics and animated campaign assets.",
  Figma: "Interface layouts and landing page design.",
  Blender: "3D visual exploration.",
};

function ProfileSummary(props: { site: ContentDatabase["site"] }) {
  return (
    <div
      class="flex min-w-0 w-full flex-col gap-6 cursor-auto select-text"
      role="region"
      aria-label={`About ${props.site.name}`}
    >
      <div class="pb-6 gap-6 w-full flex flex-col justify-start items-center">
        <div class="py-6 gap-6 w-full flex flex-col-reverse sm:flex-row items-center">
          <img
            class="w-full max-w-72 ring-2 ring-black/10 dark:ring-white/10 md:max-w-1/3 rounded-lg"
            src="https://cdn.mikeangelo.art/MA_Headshot_FINAL_BLUR.png"
            alt={`${props.site.name} standing in front of a brick wall`}
            width="200"
            height="100"
          />
          <div class="flex flex-col gap-3 min-w-0 w-full">
            <h1 class="text-lg sm:text-2xl font-bold wrap-anywhere">
              {props.site.role}
            </h1>
            <p>{props.site.aboutPage.intro}</p>
          </div>
        </div>
        <For each={props.site.aboutPage.sections}>
          {(section) => (
            <section aria-labelledby={`about-${section.id}`} class="flex flex-col gap-3 min-w-0 w-full">
              <h2 id={`about-${section.id}`} class="text-2xl font-bold">{section.title}</h2>
              <For each={section.paragraphs}>{(paragraph) => <p>{paragraph}</p>}</For>
            </section>
          )}
        </For>
      </div>
    </div>
  );
}

export default function About() {
  const site = createAsync(() => fetchSiteContent(), { deferStream: true });
  const lenis = useLenis();
  const [windows, setWindows] = createSignal(["Profile Summary", "Resume"]);
  const [active, setActive] = createSignal("Profile Summary");
  const [toolsOpen, setToolsOpen] = createSignal(false);
  let panel!: HTMLElement;
  let toolsButton!: HTMLButtonElement;
  let profileButton!: HTMLButtonElement;
  let resumeButton!: HTMLButtonElement;

  const focusWindow = (label: string) => queueMicrotask(() => {
    const target = document.getElementById(aboutWindowId(label));
    target?.querySelector<HTMLButtonElement>("[data-window-title]")?.focus({ preventScroll: true });
    if (target && window.innerWidth < 1024) {
      const scrolling = lenis?.lenis();
      if (scrolling) {
        scrolling.resize();
        scrolling.scrollTo(target, { offset: -112, immediate: true });
      }
      else target.scrollIntoView({ block: "start" });
    }
  });
  const open = (label: string) => {
    setWindows((previous) => previous.includes(label) ? previous : [...previous, label]);
    setActive(label);
    setToolsOpen(false);
    focusWindow(label);
  };
  const close = (label: string) => {
    const remaining = windows().filter((item) => item !== label);
    setWindows(remaining);
    if (active() === label) setActive(remaining.at(-1) || "");
    queueMicrotask(() => {
      const launcher = label === "Profile Summary" ? profileButton : label === "Resume" ? resumeButton : toolsButton;
      launcher?.focus({ preventScroll: true });
    });
  };
  createEffect(() => {
    if (!toolsOpen()) return;
    const dismiss = (event: Event) => {
      if (!panel.contains(event.target as Node)) setToolsOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setToolsOpen(false);
      toolsButton.focus();
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("focusin", dismiss);
    document.addEventListener("keydown", escape);
    onCleanup(() => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("focusin", dismiss);
      document.removeEventListener("keydown", escape);
    });
  });
  return (
    <>
      <Show when={site()} keyed>
        {(content) => <SEO
        title={`About ${content.name} | ${content.role}`}
        description={content.aboutPage.description}
        canonical={`${content.url.replace(/\/$/, "")}/about`}
        ogImage={content.ogImage}
        breadcrumbs={[
          { name: "Home", url: content.url },
          { name: "About", url: `${content.url.replace(/\/$/, "")}/about` },
        ]}
        localBusiness={true}
        organization={true}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: content.name,
          jobTitle: content.role,
          description: content.aboutPage.description,
          url: `${content.url.replace(/\/$/, "")}/about`,
          knowsAbout: [
            "Art Direction",
            "Brand Identity",
            "Campaign Design",
            "Motion Design",
            "Video Editing",
            "Web Design",
            "Digital Experiences",
            "Adobe Creative Suite",
            "Figma",
            "Web Development",
          ],
        }}
      />}
      </Show>
      <main class="about-workspace w-full relative min-h-dvh pt-28 pb-32 px-4 sm:px-6">
        <div class="relative mx-auto max-w-7xl min-h-[65dvh] lg:min-h-0 lg:h-[calc(100dvh-15rem)] flex flex-col gap-5">
          <For each={windows()}>
            {(label) => (
              <AboutWindow label={label} active={active() === label} raise={() => setActive(label)} close={() => close(label)} position={label === "Profile Summary" ? { x: 0.02, y: 0.02 } : { x: 0.7, y: 0.2 }}>
                <Show when={label === "Profile Summary"} fallback={
                  <div class="max-w-md flex flex-col gap-5">
                    <H2>{label === "VS Code" ? "Projects" : label}</H2>
                    <Show when={label === "Resume"} fallback={
                      <Show when={label === "VS Code"} fallback={<p>{toolDescriptions[label]}</p>}>
                        <p>Explore my app, game, and creative experiments.</p>
                        <A href="/personal" class="font-semibold underline underline-offset-4 py-2">Explore projects →</A>
                        <a href="https://github.com/mikeangelotho/mikeangeloart" target="_blank" rel="noopener noreferrer" class="font-semibold underline underline-offset-4 py-2">View the source on GitHub ↗</a>
                      </Show>
                    }>
                      <p>View my experience and background.</p>
                      <a href="https://drive.google.com/file/d/19YC8e7dQdSdLOgxJTxqWJAuy_Z8jGFNK/view" target="_blank" rel="noopener noreferrer" class="rounded-lg px-6 py-3 text-center font-semibold bg-black text-white dark:bg-white dark:text-black">View resume ↗</a>
                    </Show>
                  </div>
                }>
                  <Show when={site()} keyed>{(content) => <ProfileSummary site={content} />}</Show>
                </Show>
              </AboutWindow>
            )}
          </For>
          <Show when={windows().length === 0}>
            <p class="my-auto text-center text-sm text-neutral-500 dark:text-neutral-400">Open Profile, Resume, or a tool below.</p>
          </Show>
        </div>
        <nav ref={panel} aria-label="About windows" class="about-panel fixed inset-x-4 z-30 mx-auto w-auto max-w-3xl sm:inset-x-6">
          <Show when={toolsOpen()}>
            <div id="about-tools" role="region" aria-label="Creative tools" class="about-tool-launcher absolute bottom-full right-0 mb-3 w-full max-w-sm overflow-y-auto rounded-xl p-3" data-lenis-prevent>
              <div class="mb-2 flex items-center justify-between px-2">
                <span class="font-mono text-xs text-neutral-500 dark:text-neutral-400">Creative tools</span>
                <button type="button" aria-label="Close creative tools" class="about-window-close min-h-11 min-w-11 rounded-md" onClick={() => { setToolsOpen(false); toolsButton.focus(); }}>×</button>
              </div>
              <div class="grid min-w-0 grid-cols-2 gap-1">
                <For each={creativeTools}>
                  {(tool) => <button type="button" onClick={() => open(tool.name)} aria-label={`Open ${tool.name} window`} class="about-tool-button flex min-h-12 min-w-0 items-center gap-2 rounded-md px-2 py-2 text-left text-sm" classList={{ "is-open": windows().includes(tool.name) }}>
                    <img src={tool.icon} alt="" loading="lazy" class="h-5 w-5 shrink-0 object-contain" width="20" height="20" />
                    <span class="min-w-0 leading-tight">{tool.name}</span>
                    <Show when={windows().includes(tool.name)}><span aria-label="Window open" class="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-700 dark:bg-cyan-300" /></Show>
                  </button>}
                </For>
              </div>
            </div>
          </Show>
          <div class="about-panel-bar flex min-w-0 items-center gap-1 rounded-xl p-1.5 sm:gap-2">
            <button ref={profileButton} type="button" onClick={() => open("Profile Summary")} aria-pressed={active() === "Profile Summary"} class="about-workspace-tab flex min-h-11 min-w-0 items-center gap-2 rounded-md px-3 text-sm" classList={{ "is-active": active() === "Profile Summary", "is-open": windows().includes("Profile Summary") }}>
              <span aria-hidden="true" class="font-mono text-[10px] opacity-60">01</span>Profile
            </button>
            <button ref={resumeButton} type="button" onClick={() => open("Resume")} aria-pressed={active() === "Resume"} class="about-workspace-tab flex min-h-11 min-w-0 items-center gap-2 rounded-md px-3 text-sm" classList={{ "is-active": active() === "Resume", "is-open": windows().includes("Resume") }}>
              <span aria-hidden="true" class="font-mono text-[10px] opacity-60">02</span>Resume
            </button>
            <span class="hidden min-w-0 flex-1 truncate px-3 font-mono text-xs text-neutral-500 dark:text-neutral-400 sm:block">{active() || "No window open"}</span>
            <button ref={toolsButton} type="button" aria-expanded={toolsOpen()} aria-controls="about-tools" onClick={() => setToolsOpen((value) => !value)} class="about-workspace-tab ml-auto flex min-h-11 shrink-0 items-center gap-2 rounded-md px-3 text-sm" classList={{ "is-active": toolsOpen() }}>
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M1 1h3v3H1zm5.5 0h3v3h-3zM12 1h3v3h-3zM1 6.5h3v3H1zm5.5 0h3v3h-3zm5.5 0h3v3h-3zM1 12h3v3H1zm5.5 0h3v3h-3zm5.5 0h3v3h-3z" /></svg>
              Tools
            </button>
          </div>
        </nav>
      </main>
    </>
  );
}
