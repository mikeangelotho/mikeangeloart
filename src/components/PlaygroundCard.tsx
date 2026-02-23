import { createSignal, onCleanup, onMount, Show } from "solid-js";
import type { PlaygroundItem } from "~/types/playground";

interface Props {
  item: PlaygroundItem;
  index: number;
  onSelect: (item: PlaygroundItem) => void;
}

export default function PlaygroundCard(props: Props) {
  let cardRef!: HTMLDivElement;
  let iframeRef: HTMLIFrameElement | undefined;
  const [isLoaded, setIsLoaded] = createSignal(false);
  const [isInView, setIsInView] = createSignal(false);

  const gridClasses = () => {
    switch (props.item.gridSize) {
      case "2x2":
        return "col-span-2 row-span-2";
      case "2x1":
        return "col-span-2";
      case "1x2":
        return "row-span-2";
      default:
        return "";
    }
  };

  const typeLabel = () => {
    switch (props.item.contentType) {
      case "codepen": return "Code";
      case "image": return "Design";
      case "video": return "Motion";
      case "external": return "External";
      case "github": return "GitHub";
      default: return "";
    }
  };

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "100px" }
    );

    observer.observe(cardRef);
    onCleanup(() => observer.disconnect());
  });

  const handleClick = () => {
    props.onSelect(props.item);
  };

  const handleIframeLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div
      ref={cardRef}
      class={`playground-card group relative overflow-hidden rounded-3xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-white/5 cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20 dark:hover:shadow-white/10 ${gridClasses()}`}
      style={{ "animation-delay": `${props.index * 100}ms` }}
      onClick={handleClick}
    >
      <div class="absolute inset-0 bg-gradient-to-br from-neutral-200/50 via-transparent to-neutral-300/50 dark:from-white/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />

      <Show when={isInView()}>
        <Show when={props.item.contentType === "codepen" && props.item.codepenUrl}>
          <iframe
            ref={iframeRef}
            src={props.item.codepenUrl}
            class="w-full h-full min-h-[200px] opacity-0 transition-opacity duration-700"
            classList={{ "opacity-100": isLoaded() }}
            onLoad={handleIframeLoad}
            loading="lazy"
            title={props.item.title}
            sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
          />
        </Show>

        <Show when={props.item.contentType === "image" && props.item.imageUrl}>
          <img
            src={props.item.imageUrl}
            alt={props.item.imageAlt || props.item.title}
            class="w-full h-full object-cover opacity-0 transition-opacity duration-700"
            classList={{ "opacity-100": isLoaded() }}
            onLoad={() => setIsLoaded(true)}
            loading="lazy"
          />
        </Show>

        <Show when={props.item.contentType === "video" && props.item.videoUrl}>
          <video
            src={props.item.videoUrl}
            class="w-full h-full object-cover opacity-0 transition-opacity duration-700"
            classList={{ "opacity-100": isLoaded() }}
            onLoadedData={() => setIsLoaded(true)}
            muted
            loop
            autoplay
            playsinline
          />
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div class="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <svg class="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </Show>

        <Show when={props.item.contentType === "external" && props.item.externalUrl}>
          <img
            src={props.item.videoThumbnail || "https://cdn.mikeangelo.art/og-default.png"}
            alt={props.item.title}
            class="w-full h-full object-cover opacity-0 transition-opacity duration-700"
            classList={{ "opacity-100": isLoaded() }}
            onLoad={() => setIsLoaded(true)}
            loading="lazy"
          />
        </Show>

        <Show when={props.item.contentType === "github" && props.item.githubOwner && props.item.githubRepo}>
          <div class="w-full h-full bg-neutral-800 dark:bg-neutral-900 flex flex-col items-center justify-center p-6">
            <svg class="w-16 h-16 mb-4" viewBox="0 0 24 24" fill="white">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <div class="text-center">
              <p class="text-white font-medium text-lg">{props.item.githubOwner}/{props.item.githubRepo}</p>
              <p class="text-neutral-400 text-sm mt-1">Click to view</p>
            </div>
          </div>
        </Show>
      </Show>

      <Show when={!isLoaded() && isInView()}>
        <div class="absolute inset-0 flex items-center justify-center bg-neutral-200 dark:bg-neutral-900">
          <div class="w-8 h-8 border-2 border-neutral-400 dark:border-neutral-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </Show>

      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none" />

      <div class="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-30">
        <h3 class="text-white font-bold text-lg mb-1">{props.item.title}</h3>
        <p class="text-white/70 text-sm line-clamp-2">{props.item.description}</p>
        <Show when={props.item.techStack}>
          <div class="flex flex-wrap gap-1.5 mt-2">
            {props.item.techStack?.slice(0, 3).map((tech) => (
              <span class="px-2 py-0.5 text-xs bg-white/20 text-white rounded-full backdrop-blur-sm">
                {tech}
              </span>
            ))}
          </div>
        </Show>
      </div>

      <div class="absolute top-3 left-3 px-2 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
        {typeLabel()}
      </div>
    </div>
  );
}
