import { onMount, onCleanup } from "solid-js";
import type { AnimationItem } from "lottie-web";

export const LottieAnim = (props: { url: string }) => {
  let container!: HTMLDivElement;

  onMount(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animation: AnimationItem | undefined;
    let disposed = false;
    let idleId: number | undefined;
    let timerId: number | undefined;
    let scrollFrame = 0;

    const updatePlayback = () => {
      scrollFrame = 0;
      if (!animation || disposed) return;
      container.classList.toggle("blur", window.scrollY > 200);
      if (motion.matches) {
        animation.goToAndStop(0, true);
      } else if (document.hidden || window.scrollY > 200) {
        animation.pause();
      } else {
        animation.play();
      }
    };
    const handleScroll = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updatePlayback);
    };

    const initLottie = async () => {
      try {
        // The full SVG build retains expressions and SVG effects without canvas/HTML renderers.
        const lottie = (await import("lottie-web/build/player/lottie_svg.js")).default;
        if (disposed) return;
        animation = lottie.loadAnimation({
          container,
          renderer: "svg",
          loop: true,
          autoplay: false,
          path: props.url,
        });
        animation.setSubframe(false);
        if (window.innerWidth < 768) animation.setSpeed(0.8);
        animation.addEventListener("DOMLoaded", updatePlayback);
        updatePlayback();
      } catch {
        // This decorative layer is optional; portfolio content remains usable.
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("visibilitychange", updatePlayback);
    motion.addEventListener("change", updatePlayback);
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(() => { void initLottie(); }, { timeout: 2000 });
    } else {
      timerId = window.setTimeout(() => { void initLottie(); }, 2000);
    }

    onCleanup(() => {
      disposed = true;
      cancelAnimationFrame(scrollFrame);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timerId !== undefined) clearTimeout(timerId);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", updatePlayback);
      motion.removeEventListener("change", updatePlayback);
      animation?.destroy();
    });
  });

  return (
    // The source has generous empty space; a moderate zoom keeps the artwork visible.
    <div
      ref={container}
      aria-hidden="true"
      class="hero-animation scale-220 lg:scale-150 xl:scale-100 translate-y-[10svh] lg:translate-y-0 opacity-40 lg:opacity-100 fade__animate fixed top-0 left-0 lg:left-1/6 w-full h-full not-dark:invert pointer-events-none"
      style="will-change: transform;"
    />
  );
};

export default LottieAnim;
