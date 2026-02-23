import { Show, onCleanup, onMount } from "solid-js";
import type { PlaygroundItem } from "~/types/playground";
import Icon from "~/components/Icon";

interface Props {
  item: PlaygroundItem | null;
  onClose: () => void;
}

export default function PlaygroundModal(props: Props) {
  let modalRef: HTMLDivElement;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      props.onClose();
    }
  };

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === modalRef) {
      props.onClose();
    }
  };

  onMount(() => {
    if (typeof document !== "undefined") {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
  });

  onCleanup(() => {
    if (typeof document !== "undefined") {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    }
  });

  const getExternalLink = () => {
    if (!props.item) return "#";
    switch (props.item.contentType) {
      case "codepen":
        return `https://codepen.io/mikeangelo/pen/${props.item.codepenId}`;
      case "external":
        return props.item.externalUrl || "#";
      case "github":
        return `https://github.com/${props.item.githubOwner}/${props.item.githubRepo}`;
      default:
        return "#";
    }
  };

  const getExternalLabel = () => {
    if (!props.item) return "";
    switch (props.item.contentType) {
      case "codepen":
        return "View on CodePen";
      case "github":
        return "View on GitHub";
      case "external":
        switch (props.item.externalPlatform) {
          case "behance": return "View on Behance";
          case "dribbble": return "View on Dribbble";
          case "vimeo": return "View on Vimeo";
          case "youtube": return "View on YouTube";
          case "instagram": return "View on Instagram";
          default: return "View External";
        }
      default:
        return "";
    }
  };

  return (
    <Show when={props.item}>
      <div
        ref={modalRef}
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={handleBackdropClick}
      >
        <div class="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
          <button
            class="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            onClick={props.onClose}
            aria-label="Close modal"
          >
            <Icon name="close" width={20} height={20} />
          </button>

          <div class="h-[50vh] min-h-[300px] bg-neutral-100 dark:bg-neutral-800">
            <Show when={props.item!.contentType === "codepen" && props.item!.codepenUrl}>
              <iframe
                src={props.item!.codepenUrl}
                class="w-full h-full"
                title={props.item!.title}
                sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
              />
            </Show>

            <Show when={props.item!.contentType === "image" && props.item!.imageUrl}>
              <img
                src={props.item!.imageUrl}
                alt={props.item!.imageAlt || props.item!.title}
                class="w-full h-full object-contain"
              />
            </Show>

            <Show when={props.item!.contentType === "video" && props.item!.videoUrl}>
              <video
                src={props.item!.videoUrl}
                class="w-full h-full object-contain"
                controls
                autoplay
              />
            </Show>

            <Show when={props.item!.contentType === "external" && props.item!.externalUrl}>
              <div class="w-full h-full flex items-center justify-center bg-neutral-800">
                <a
                  href={props.item!.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-3 px-6 py-3 bg-white text-black rounded-full font-medium hover:opacity-80 transition-opacity"
                >
                  <Icon name="external" width={20} height={20} />
                  {getExternalLabel()}
                </a>
              </div>
            </Show>

            <Show when={props.item!.contentType === "github" && props.item!.githubOwner && props.item!.githubRepo}>
              <div class="w-full h-full flex flex-col items-center justify-center bg-neutral-900 p-8">
                <svg class="w-20 h-20 mb-4" viewBox="0 0 24 24" fill="white">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                <p class="text-white font-medium text-xl">{props.item!.githubOwner}/{props.item!.githubRepo}</p>
                <p class="text-neutral-400 mt-2">Click below to view on GitHub</p>
              </div>
            </Show>
          </div>

          <div class="p-6 overflow-y-auto max-h-[40vh]">
            <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
              <div>
                <h2 class="text-2xl font-bold mb-2">{props.item!.title}</h2>
                <p class="text-neutral-600 dark:text-neutral-400">{props.item!.description}</p>
              </div>
              <Show when={props.item!.contentType === "codepen" || props.item!.contentType === "external" || props.item!.contentType === "github"}>
                <a
                  href={getExternalLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
                >
                  <Icon name="external" width={16} height={16} />
                  {getExternalLabel()}
                </a>
              </Show>
            </div>

            <Show when={props.item!.techStack && props.item!.techStack.length > 0}>
              <div class="space-y-6">
                <div>
                  <h3 class="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                    Tools & Tech
                  </h3>
                  <div class="flex flex-wrap gap-2">
                    {props.item!.techStack?.map((tech) => (
                      <span class="px-3 py-1 bg-neutral-200 dark:bg-neutral-800 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Show>

            <div class="space-y-6">
              <div>
                <h3 class="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                  Details
                </h3>
                <p class="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {props.item!.details}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
}
