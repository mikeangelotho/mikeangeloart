import { createSignal, Show } from "solid-js";
import { createImageSources } from "~/utils/image";

interface PictureProps {
  src: string;
  webpSrc?: string;
  alt: string;
  class?: string;
  loading?: "lazy" | "eager";
  width?: number | string;
  height?: number | string;
  onClick?: (event: MouseEvent | KeyboardEvent, displayedUrl: string) => void;
  onError?: (event: Event) => void;
  onLoad?: (event: Event) => void;
  onDisplayUrlChange?: (displayedUrl: string) => void;
  ref?: HTMLPictureElement | ((element: HTMLPictureElement) => void);
}

export function Picture(props: PictureProps) {
  return <ResponsivePicture {...props} />;
}

interface ResponsivePictureProps extends PictureProps {
  sizes?: string;
  srcset?: { [descriptor: string]: string };
  webpSrcset?: { [descriptor: string]: string };
}

export function ResponsivePicture(props: ResponsivePictureProps) {
  const [failedSource, setFailedSource] = createSignal<string>();
  const imageSources = () => createImageSources(props.src);
  const originalSrcset = () => props.srcset
    ? Object.entries(props.srcset).map(([descriptor, url]) => `${url} ${descriptor}`).join(", ")
    : undefined;
  const webpSrcset = () => {
    if (failedSource() === props.src) return undefined;
    if (props.webpSrcset) {
      return Object.entries(props.webpSrcset).map(([descriptor, url]) => `${url} ${descriptor}`).join(", ") || undefined;
    }
    // Responsive candidates are supplied explicitly, rather than guessed.
    if (props.srcset && !props.webpSrc) return undefined;
    const candidate = props.webpSrc || imageSources().webp?.srcset;
    return candidate !== props.src ? candidate : undefined;
  };
  const displayedUrl = (event: Event) => {
    const image = event.currentTarget as HTMLImageElement;
    // currentSrc reflects format support, responsive selection and fallback.
    return image.currentSrc || image.src || props.src;
  };
  const handleClick = (event: MouseEvent | KeyboardEvent) => {
    props.onClick?.(event, displayedUrl(event));
  };
  const handleError = (event: Event) => {
    if (webpSrcset()) {
      setFailedSource(props.src);
      return;
    }
    props.onError?.(event);
  };
  const handleLoad = (event: Event) => {
    props.onDisplayUrlChange?.(displayedUrl(event));
    props.onLoad?.(event);
  };

  return (
    <picture ref={props.ref}>
      <Show when={webpSrcset()}>
        <source srcset={webpSrcset()} type="image/webp" sizes={props.sizes} />
      </Show>
      <img
        src={imageSources().fallback.srcset}
        srcset={originalSrcset()}
        alt={props.alt}
        class={props.class}
        loading={props.loading || "lazy"}
        decoding="async"
        sizes={props.sizes}
        width={props.width}
        height={props.height}
        onClick={handleClick}
        role={props.onClick ? "button" : undefined}
        tabIndex={props.onClick ? 0 : undefined}
        onKeyDown={(event) => {
          if (props.onClick && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            handleClick(event);
          }
        }}
        onError={handleError}
        onLoad={handleLoad}
      />
    </picture>
  );
}
