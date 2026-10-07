import { For, Show, createMemo, createSignal, onMount } from "solid-js";
import type { PersonalProject, ProjectScreenshot } from "~/content/content-model";
import { Lightbox } from "~/components/Lightbox";
import { Picture } from "~/components/Picture";

function ScreenshotPreview(props: {
  screenshot: ProjectScreenshot;
  primary: boolean;
  compact: boolean;
  open: (src: string, alt: string) => void;
}) {
  let button!: HTMLButtonElement;
  let displayedUrl = props.screenshot.src || "";
  const [failed, setFailed] = createSignal(false);
  const canEnlarge = () => !!props.screenshot.src && !failed();
  const frameAspect = () => !props.screenshot.src
    ? (props.primary ? "aspect-[3/1]" : "aspect-video")
    : (props.primary ? "aspect-16/10" : "aspect-4/3");

  onMount(() => {
    const image = button.querySelector("img");
    if (image?.complete && image.naturalWidth === 0) {
      const hasAlternativeSource = !!image.closest("picture")?.querySelector("source[srcset]");
      const displayedSource = image.currentSrc || image.src;
      const originalSource = new URL(props.screenshot.src || "", document.baseURI).href;
      if (!hasAlternativeSource || displayedSource === originalSource) setFailed(true);
    }
  });

  return (
    <figure class={props.primary ? "col-span-full min-w-0" : "min-w-0"}>
      <button
        ref={button}
        type="button"
        disabled={!canEnlarge()}
        aria-label={!props.screenshot.src ? `${props.screenshot.title}: screenshot coming soon` : failed() ? `${props.screenshot.title}: preview unavailable` : `Enlarge ${props.screenshot.title}`}
        aria-haspopup={canEnlarge() ? "dialog" : undefined}
        onClick={() => props.open(displayedUrl, props.screenshot.alt)}
        style={!props.compact && props.screenshot.width && props.screenshot.height ? { "aspect-ratio": `${props.screenshot.width} / ${props.screenshot.height}` } : undefined}
        class={`relative grid w-full min-w-0 cursor-zoom-in place-items-center overflow-hidden rounded-xl border border-black/5 bg-neutral-100 transition-colors enabled:hover:border-black/30 focus-visible:outline-2 focus-visible:outline-offset-4 disabled:cursor-default dark:border-white/10 dark:bg-neutral-900 dark:enabled:hover:border-white/40 [&>picture]:absolute [&>picture]:inset-0 [&>picture]:block [&>picture]:h-full [&>picture]:w-full ${frameAspect()}`}
      >
        <Show when={canEnlarge()} fallback={<span class="p-3 text-xs text-center text-neutral-600 dark:text-neutral-400">{props.screenshot.src ? "Preview unavailable" : "Preview coming soon"}</span>}>
          <Picture
            src={props.screenshot.src || ""}
            alt={props.screenshot.alt}
            width={props.screenshot.width}
            height={props.screenshot.height}
            class="block h-full w-full object-contain"
            onDisplayUrlChange={(url) => { displayedUrl = url; }}
            onError={() => setFailed(true)}
          />
        </Show>
      </button>
      <figcaption class="mt-2 flex flex-col gap-1 text-xs leading-snug">
        <span class="font-semibold">{props.screenshot.title}</span>
        <Show when={props.screenshot.caption}>
          <span class="text-neutral-600 dark:text-neutral-400">{props.screenshot.caption}</span>
        </Show>
      </figcaption>
    </figure>
  );
}

export function PersonalProjectCard(props: { project: PersonalProject }) {
  const [lightboxSrc, setLightboxSrc] = createSignal<string>();
  const [lightboxAlt, setLightboxAlt] = createSignal<string>();
  const headingId = () => `personal-project-${props.project.id}`;
  const compact = () => props.project.presentation === "compact";
  const screenshots = createMemo(() => props.project.screenshots
    .filter((screenshot) => !!screenshot.src || props.project.showScreenshotPlaceholders)
    .slice(0, compact() ? 2 : 4));

  return (
    <article
      id={props.project.id}
      aria-labelledby={headingId()}
      class={`min-w-0 scroll-mt-32 rounded-3xl border border-neutral-300 bg-white p-5 dark:border-neutral-900 dark:bg-black sm:p-6 ${compact() ? "flex flex-col" : "grid gap-6 sm:p-8 lg:gap-9"} ${!compact() && screenshots().length > 0 ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]" : ""}`}
    >
      <div class={`min-w-0 flex flex-col items-start ${compact() ? "mb-5" : "lg:py-2"}`}>
        <p class="mb-2 text-xs font-medium uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
          {props.project.category}
          <Show when={props.project.status}>
            <span aria-hidden="true"> · </span>{props.project.status}
          </Show>
        </p>
        <h3 id={headingId()} class={`mb-3 font-bold tracking-tight text-black dark:text-white ${compact() ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"}`}>
          {props.project.title}
        </h3>
        <p class="max-w-prose text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 sm:text-base">
          {props.project.summary}
        </p>

        <Show when={props.project.link}>
          {(link) => (
            <a
              href={link().href}
              target="_blank"
              rel="noopener noreferrer"
              class="mt-5 inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-4 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
            >
              {link().label}
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </Show>
      </div>

      <Show
        when={screenshots().length > 0}
        fallback={
          <p class="border-t border-neutral-300 pt-4 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
            Screenshots coming soon.
          </p>
        }
      >
        <div class={`min-w-0 grid gap-x-3 gap-y-5 ${compact() ? "mt-auto grid-cols-2" : screenshots().length > 3 ? "grid-cols-3" : "grid-cols-2"}`}>
          <For each={screenshots()}>
            {(screenshot, index) => (
              <ScreenshotPreview
                screenshot={screenshot}
                compact={compact()}
                primary={index() === 0 && (screenshots().length === 1 || (!compact() && screenshots().length > 2))}
                open={(src, alt) => {
                  setLightboxAlt(alt);
                  setLightboxSrc(src);
                }}
              />
            )}
          </For>
        </div>
      </Show>

      <Show when={lightboxSrc()}>
        <Lightbox
          src={{ get: lightboxSrc, set: setLightboxSrc }}
          altText={lightboxAlt}
        />
      </Show>
    </article>
  );
}
