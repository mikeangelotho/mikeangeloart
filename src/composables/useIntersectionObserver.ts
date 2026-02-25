import { onCleanup, onMount } from "solid-js";

type ObserverCallback = (entry: IntersectionObserverEntry) => void;

interface UseFadeInScrollOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useFadeInScroll(
  ref: () => HTMLElement | undefined,
  options: UseFadeInScrollOptions = {},
) {
  const { threshold = 0.15, rootMargin = "0px" } = options;

  onMount(() => {
    const element = ref();
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          target.classList.toggle("translate-y-9", !entry.isIntersecting);
          target.classList.toggle("scrolled", !entry.isIntersecting);
          if (entry.isIntersecting) observer.unobserve(target);
        });
      },
      { threshold, rootMargin },
    );

    observer.observe(element);

    onCleanup(() => observer.disconnect());
  });
}

interface UseScrollTriggerOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useScrollTrigger(
  callback: ObserverCallback,
  options: UseScrollTriggerOptions = {},
) {
  const { threshold = 0, rootMargin = "0px" } = options;

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(callback);
      },
      { threshold, rootMargin },
    );

    return observer;
  });
}

export function useStickyOnScroll(
  containerRef: () => HTMLElement | undefined,
  triggerRef: () => HTMLElement | undefined,
) {
  let scrollHandler: (() => void) | undefined;

  onMount(() => {
    const container = containerRef();
    const trigger = triggerRef();
    if (!container || !trigger) return;

    const updateSticky = () => {
      const { offsetHeight } = trigger;
      const { scrollY } = window;

      if (scrollY >= offsetHeight - 96) {
        container.style.position = "sticky";
        container.style.top = "0px";
        container.style.left = "0px";
        container.style.zIndex = "-2";
      } else {
        container.style.position = "";
        container.style.top = "";
        container.style.left = "";
        container.style.zIndex = "";
      }

      container.classList.toggle("opacity-0", scrollY >= offsetHeight * 1.25);
      container.classList.toggle("invisible", scrollY >= offsetHeight * 2);
    };

    scrollHandler = updateSticky;
    document.addEventListener("scroll", scrollHandler, { passive: true });

    onCleanup(() => {
      if (scrollHandler) {
        document.removeEventListener("scroll", scrollHandler);
      }
    });
  });
}
