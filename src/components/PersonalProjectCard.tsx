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
        class={`relative grid w-full min-w-0 cursor-zoom-in place-items-center overflow-hidden border border-black/5 bg-black/3 transition-colors enabled:hover:border-black/30 focus-visible:outline-2 focus-visible:outline-offset-4 disabled:cursor-default dark:border-white/10 dark:bg-white/3 dark:enabled:hover:border-white/40 [&>picture]:absolute [&>picture]:inset-0 [&>picture]:block [&>picture]:h-full [&>picture]:w-full ${frameAspect()}`}
      >
        <Show when={canEnlarge()} fallback={<span class="p-3 text-xs text-center text-black/65 dark:text-white/65">{props.screenshot.src ? "Preview unavailable" : "Preview coming soon"}</span>}>
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
      <figcaption class="mt-2 flex flex-col gap-1 text-xs leading-relaxed">
        <span>{props.screenshot.title}</span>
        <Show when={props.screenshot.caption}>
          <span class="text-black/65 dark:text-white/65">{props.screenshot.caption}</span>
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
      class={`grid min-w-0 scroll-mt-28 content-start gap-y-4 border border-black/15 bg-white p-5 [grid-template-areas:'header'_'media'_'summary'] dark:border-white/15 dark:bg-black sm:p-6 ${!compact() && screenshots().length > 0 ? "lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.7fr)] lg:grid-rows-[auto_1fr] lg:gap-x-8 lg:[grid-template-areas:'header_media'_'summary_media']" : ""}`}
    >
      <header class="min-w-0 [grid-area:header]">
        <p class="type-label mb-2 text-black/65 dark:text-white/65">
          {props.project.category}
          <Show when={props.project.status}>
            <span aria-hidden="true"> · </span>{props.project.status}
          </Show>
        </p>
        <h3 id={headingId()} class="type-card-title text-black dark:text-white">
          {props.project.title}
        </h3>
      </header>

      <Show
        when={screenshots().length > 0}
        fallback={
          <p class="border-t border-black/15 pt-4 text-sm [grid-area:media] text-black/65 dark:border-white/15 dark:text-white/65">
            Screenshots coming soon.
          </p>
        }
      >
        <div class={`grid min-w-0 content-start gap-x-3 gap-y-4 [grid-area:media] ${!compact() && screenshots().length > 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2"}`}>
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

      <div class="min-w-0 [grid-area:summary]">
        <p class="type-body max-w-prose text-black/65 dark:text-white/65">
          {props.project.summary}
        </p>
        <Show when={props.project.link}>
          {(link) => (
            <a
              href={link().href}
              target="_blank"
              rel="noopener noreferrer"
              class="mt-4 inline-flex min-h-11 items-center gap-2 bg-black px-4 py-2.5 text-sm font-normal text-white transition-colors hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-offset-4 dark:bg-white dark:text-black dark:hover:bg-white/10"
            >
              {link().label}
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </Show>
      </div>

      <Show when={lightboxSrc()}>
        <Lightbox
          src={{ get: lightboxSrc, set: setLightboxSrc }}
          altText={lightboxAlt}
        />
      </Show>
    </article>
  );
}
