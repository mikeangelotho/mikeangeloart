import { Accessor, onCleanup, onMount, Setter } from "solid-js";
import { Button } from "~/layout/Cards";
import { Picture } from "~/components/Picture";

const Lightbox = ({
    src,
    altText,
}: {
    src: { get: Accessor<string | undefined>; set: Setter<string | undefined> };
    altText: Accessor<string | undefined>;
}) => {
    let mediaRef!: Element;

    function clickHandler(e: PointerEvent) {
        const target = e.target;
        if (target !== mediaRef) {
            src.set();
        }
    }

    onMount(() => {
        document.addEventListener("click", clickHandler)
        onCleanup(() => {
            document.removeEventListener("click", clickHandler)
        })
    }
    )

const MediaLB = () => {
        if (src.get()?.includes("mp4")) {
            return <video ref={mediaRef as HTMLVideoElement} src={src.get()} autoplay muted loop playsinline class="max-h-[75dvh] aspect-auto" 
                title={altText()} aria-label={altText()} />
        } else {
            return (
                <div ref={mediaRef as HTMLDivElement}>
                    <Picture
                        src={src.get() || ''}
                        alt={altText() || ''}
                        class="max-h-[75dvh] w-auto"
                        loading="eager"
                    />
                </div>
            )
        }
    }

    return (
        <div class="z-10 fixed w-screen h-screen flex justify-center items-center bg-white/98 dark:bg-black/98">
            <div class="w-full pt-[10vh] flex flex-col items-center gap-3">
                <MediaLB />
                <Button
                    type="button"
                    onClick={() => {
                        src.set();
                    }}
                >
                    Close
                </Button>
            </div>
        </div>
    );
};

export { Lightbox }