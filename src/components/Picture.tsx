import { createSignal, Show } from 'solid-js';
import { createImageSources, getWebPUrl, isWebPUrl } from '~/utils/image';

interface PictureProps {
  src: string;
  alt: string;
  class?: string;
  loading?: 'lazy' | 'eager';
  onClick?: (event: MouseEvent, displayedUrl: string) => void;
  onError?: (event: Event) => void;
  onLoad?: (event: Event) => void;
  // For lightbox integration
  onDisplayUrlChange?: (displayedUrl: string) => void;
  ref?: HTMLElement;
}

export function Picture(props: PictureProps) {
  const [hasError, setHasError] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(true);

  const imageSources = () => createImageSources(props.src);

  // Determine which URL will be displayed (WebP if available and supported)
  const getDisplayedUrl = (): string => {
    if (hasError()) return props.src;
    const sources = imageSources();
    return sources.webp?.srcset || sources.fallback.srcset;
  };

  const handleClick = (event: MouseEvent) => {
    const displayedUrl = getDisplayedUrl();
    props.onClick?.(event, displayedUrl);
  };

  const handleError = (event: Event) => {
    setHasError(true);
    setIsLoading(false);
    props.onError?.(event);
  };

  const handleLoad = (event: Event) => {
    setIsLoading(false);
    props.onDisplayUrlChange?.(getDisplayedUrl());
    props.onLoad?.(event);
  };

  return (
    <picture ref={props.ref}>
      <Show when={imageSources().webp && !hasError()}>
        <source
          srcset={imageSources().webp!.srcset}
          type="image/webp"
        />
      </Show>
      <img
        src={imageSources().fallback.srcset}
        alt={props.alt}
        class={props.class}
        loading={props.loading || 'lazy'}
        onClick={handleClick}
        onError={handleError}
        onLoad={handleLoad}
      />
    </picture>
  );
}

interface ResponsivePictureProps extends Omit<PictureProps, 'src'> {
  src: string;
  sizes?: string;
  srcset?: {
    [breakpoint: string]: string; // e.g., { '640w': 'small.jpg', '1280w': 'large.jpg' }
  };
}

export function ResponsivePicture(props: ResponsivePictureProps) {
  const [hasError, setHasError] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(true);

  const imageSources = () => createImageSources(props.src);

  const getDisplayedUrl = (): string => {
    if (hasError()) return props.src;
    const sources = imageSources();
    return sources.webp?.srcset || sources.fallback.srcset;
  };

  const handleClick = (event: MouseEvent) => {
    const displayedUrl = getDisplayedUrl();
    props.onClick?.(event, displayedUrl);
  };

  const handleError = (event: Event) => {
    setHasError(true);
    setIsLoading(false);
    props.onError?.(event);
  };

  const handleLoad = (event: Event) => {
    setIsLoading(false);
    props.onDisplayUrlChange?.(getDisplayedUrl());
    props.onLoad?.(event);
  };

  return (
    <picture>
      <Show when={imageSources().webp && !hasError()}>
        <source
          srcset={imageSources().webp!.srcset}
          type="image/webp"
          sizes={props.sizes}
        />
      </Show>
      <img
        src={imageSources().fallback.srcset}
        alt={props.alt}
        class={props.class}
        loading={props.loading || 'lazy'}
        sizes={props.sizes}
        onClick={handleClick}
        onError={handleError}
        onLoad={handleLoad}
      />
    </picture>
  );
}

/**
 * Hook to get the currently displayed URL for an image (considering WebP fallback)
 */
export function useDisplayedUrl(src: string): string {
  return isWebPUrl(src) ? src : getWebPUrl(src) || src;
}