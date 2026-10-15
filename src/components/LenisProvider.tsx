import { onMount, onCleanup, createContext, useContext, createSignal, createEffect } from "solid-js";
import { useIsRouting, useLocation, useNavigate } from "@solidjs/router";
import Lenis from "lenis";
import { anchorDestination, findAnchor, focusScrollTarget, synchronizeScroll } from "~/utils/scroll-navigation";

type RafCallback = (time: number, delta: number) => void;

interface LenisContextValue {
  lenis: () => Lenis | null;
  registerCallback: (cb: RafCallback) => () => void;
  scrollToTop: () => void;
}

const LenisContext = createContext<LenisContextValue>();

export function useLenis() {
  return useContext(LenisContext);
}

export default function LenisProvider(props: { children: any }) {
  const [lenisInstance, setLenisInstance] = createSignal<Lenis | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isRouting = useIsRouting();
  const callbacks = new Set<RafCallback>();
  let rafId = 0;
  let lastTime = 0;
  let lastPath: string | undefined;
  let pendingRouteAnchor: URL | undefined;
  let historyNavigation = false;
  let historyFrame = 0;
  let cancelAnchorWait = () => {};

  const scrollTo = (target: HTMLElement | number, immediate = false, focus = true) => {
    const scrolling = lenisInstance();
    if (!scrolling) return;
    synchronizeScroll(scrolling);
    scrolling.scrollTo(target, {
      immediate,
      duration: 1.1,
      onComplete: focus ? () => focusScrollTarget(target) : undefined,
    });
  };

  const scrollToAnchor = (hash: string, immediate = false) => {
    cancelAnchorWait();
    let frame = 0;
    let timer = 0;
    let observer: MutationObserver | undefined;
    const cleanup = () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      observer?.disconnect();
      cancelAnchorWait = () => {};
    };
    cancelAnchorWait = cleanup;
    const find = () => {
      const target = findAnchor(hash);
      if (target === undefined) return false;
      observer?.disconnect();
      clearTimeout(timer);
      frame = requestAnimationFrame(() => {
        cleanup();
        scrollTo(target, immediate, !immediate);
      });
      return true;
    };
    if (find()) return;
    // A route's server-loaded content can arrive after its URL changes.
    observer = new MutationObserver(find);
    observer.observe(document.body, { childList: true, subtree: true });
    timer = window.setTimeout(cleanup, 2500);
  };

  const publishAnchorUrl = (destination: URL, replace = false) => {
    if (destination.href === window.location.href) return;
    if (replace) window.history.replaceState(window.history.state, "", destination);
    else window.history.pushState(undefined, "", destination);
    // Notify the router without its unconditional native scrollIntoView for hashes.
    window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
  };

  const scrollToTop = () => {
    cancelAnchorWait();
    pendingRouteAnchor = undefined;
    const destination = new URL(window.location.href);
    destination.hash = "";
    publishAnchorUrl(destination, true);
    scrollTo(0);
  };

  onMount(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: !motion.matches,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      autoRaf: false,
    });
    setLenisInstance(lenis);

    const removeScrollHandoff = lenis.on("virtual-scroll", ({ deltaX, deltaY, event }) => {
      if (deltaX || deltaY) cancelAnchorWait();
      if (event.ctrlKey || lenis.isScrolling !== "smooth" || deltaX === 0 || Math.abs(deltaX) < Math.abs(deltaY)) return;
      const isHorizontalScroller = event.composedPath().some((node) =>
        node instanceof HTMLElement && node.hasAttribute("data-lenis-prevent-horizontal"),
      );
      // End vertical inertia before a native horizontal or diagonal gesture takes over.
      if (isHorizontalScroller) lenis.scrollTo(lenis.actualScroll, { immediate: true });
    });

    const handleMotionChange = () => {
      lenis.options.smoothWheel = !motion.matches;
      lenis.scrollTo(window.scrollY, { immediate: true });
    };
    motion.addEventListener("change", handleMotionChange);

    const handleAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.composedPath().find((node): node is HTMLAnchorElement => node instanceof HTMLAnchorElement);
      if (!anchor || anchor.hasAttribute("download") || anchor.hasAttribute("data-native-scroll") ||
        (anchor.target && anchor.target !== "_self") || anchor.rel.split(/\s+/).includes("external")) return;
      const destination = anchorDestination(anchor.getAttribute("href") || "", window.location.href);
      if (!destination) return;
      event.preventDefault();
      cancelAnchorWait();
      synchronizeScroll(lenis);
      if (destination.pathname === window.location.pathname && destination.search === window.location.search) {
        pendingRouteAnchor = undefined;
        publishAnchorUrl(destination, anchor.hasAttribute("replace"));
        scrollToAnchor(destination.hash);
      } else {
        pendingRouteAnchor = destination;
        // Navigate without a hash so the router cannot jump before Lenis takes over.
        navigate(destination.pathname + destination.search, {
          resolve: false,
          scroll: false,
          replace: anchor.hasAttribute("replace"),
        });
      }
    };
    const handleHistory = (event: Event) => {
      if (!event.isTrusted) return;
      historyNavigation = true;
      pendingRouteAnchor = undefined;
      cancelAnchorWait();
      synchronizeScroll(lenis);
      cancelAnimationFrame(historyFrame);
      historyFrame = requestAnimationFrame(() => {
        historyFrame = requestAnimationFrame(() => {
          synchronizeScroll(lenis);
          if (!isRouting()) historyNavigation = false;
        });
      });
    };
    const handleScrollKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey ||
        !["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) return;
      const target = event.target instanceof HTMLElement ? event.target : null;
      if (target?.closest("input, textarea, select, [contenteditable='true']") ||
        (event.key === " " && target?.closest("button, a"))) return;
      cancelAnchorWait();
      if (lenis.isScrolling === "smooth") synchronizeScroll(lenis);
    };
    document.addEventListener("click", handleAnchorClick, true);
    window.addEventListener("popstate", handleHistory, true);
    window.addEventListener("hashchange", handleHistory);
    window.addEventListener("keydown", handleScrollKey);

    const raf = (time: number) => {
      const delta = lastTime ? Math.max(time - lastTime, 4) : 16;
      lastTime = time;
      lenis.raf(time);
      callbacks.forEach((callback) => callback(time, delta));
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    onCleanup(() => {
      removeScrollHandoff();
      cancelAnchorWait();
      cancelAnimationFrame(historyFrame);
      document.removeEventListener("click", handleAnchorClick, true);
      window.removeEventListener("popstate", handleHistory, true);
      window.removeEventListener("hashchange", handleHistory);
      window.removeEventListener("keydown", handleScrollKey);
      motion.removeEventListener("change", handleMotionChange);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      callbacks.clear();
    });
  });

  createEffect(() => {
    const pathname = location.pathname;
    const scrolling = lenisInstance();
    if (!scrolling || isRouting()) return;
    const initial = lastPath === undefined;
    const changed = lastPath !== pathname;
    lastPath = pathname;
    if (historyNavigation) {
      synchronizeScroll(scrolling);
      historyNavigation = false;
    } else if (pendingRouteAnchor?.pathname === pathname && pendingRouteAnchor.search === location.search) {
      const destination = pendingRouteAnchor;
      pendingRouteAnchor = undefined;
      publishAnchorUrl(destination, true);
      scrollToAnchor(destination.hash);
    } else if (changed) {
      cancelAnchorWait();
      pendingRouteAnchor = undefined;
      if (window.location.hash) scrollToAnchor(window.location.hash, initial);
      else if (initial) synchronizeScroll(scrolling);
      else scrollTo(0, true, false);
    }
  });

  return (
    <LenisContext.Provider value={{
      lenis: lenisInstance,
      scrollToTop,
      registerCallback: (callback) => {
        callbacks.add(callback);
        return () => callbacks.delete(callback);
      },
    }}>
      {props.children}
    </LenisContext.Provider>
  );
}
