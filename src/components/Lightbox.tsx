import { Accessor, createMemo, onCleanup, onMount, Setter, Show } from "solid-js";
import { Portal } from "solid-js/web";
import { Picture } from "~/components/Picture";
import VideoPlayer from "~/components/VideoPlayer";
import { isVideoUrl } from "~/utils/media";

const Lightbox = (props: {
    src: { get: Accessor<string | undefined>; set: Setter<string | undefined> };
    altText: Accessor<string | undefined>;
    mediaType?: Accessor<"image" | "video" | undefined>;
}) => {
  let dialog!: HTMLDialogElement;
  const close = () => props.src.set(undefined);
  const video = createMemo(() => ({
    url: props.src.get() || "",
    altText: props.altText() || "Project video",
    title: "Project video",
    thumbnail: "",
    client: "",
    description: "",
    type: props.mediaType?.(),
  }));

  onMount(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    onCleanup(() => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    });
  });

  return (
    <Portal>
      <dialog
        ref={dialog}
        aria-labelledby="media-viewer-title"
        class="fixed inset-0 z-100 m-0 h-dvh w-screen max-h-none max-w-none border-0 bg-white/98 dark:bg-black/98 p-6 text-black dark:text-white open:flex items-center justify-center"
        data-lenis-prevent
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <h2 id="media-viewer-title" class="sr-only">Project media viewer</h2>
        <div class="flex w-full max-w-5xl flex-col items-center gap-4">
          <Show
            when={props.mediaType?.() === "video" || isVideoUrl(props.src.get())}
            fallback={
              <Picture
                src={props.src.get() || ""}
                alt={props.altText() || "Project image"}
                class="max-h-[75dvh] max-w-full w-auto object-contain"
                loading="eager"
              />
            }
          >
            <div class="w-full max-h-[75dvh] overflow-y-auto">
              <VideoPlayer video={video()} class="max-h-[75dvh] w-full object-contain" />
            </div>
          </Show>
          <button
            type="button"
            autofocus
            onClick={close}
            class="rounded-lg bg-black dark:bg-white text-white dark:text-black px-6 py-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            Close
          </button>
        </div>
      </dialog>
    </Portal>
  );
};

export { Lightbox }
