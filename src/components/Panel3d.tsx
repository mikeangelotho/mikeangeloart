import { onCleanup, onMount } from "solid-js";
import type SceneManager from "~/three/SceneManager";

export default function Panel3d(props: { model: string }) {
  let wrapper!: HTMLDivElement;

  onMount(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let sceneManager: SceneManager | undefined;
    let disposed = false;
    let isLoading = false;
    let failed = false;
    let inView = false;

    const updatePlayback = () => {
      if (!sceneManager || disposed) return;
      const allowMotion = !motion.matches && !document.hidden && inView && window.scrollY < window.innerHeight;
      sceneManager.setMotionEnabled(allowMotion);
      if (allowMotion) sceneManager.startAnimation();
      else sceneManager.stopAnimation();
    };
    const resize = () => {
      sceneManager?.handleResize(wrapper);
      updatePlayback();
    };
    const ensureScene = async () => {
      if (sceneManager || isLoading || failed || disposed) return;
      isLoading = true;
      try {
        const mod = await import("~/three/SceneManager");
        if (disposed) return;
        sceneManager = new mod.default(8);
        sceneManager.init(wrapper, props.model);
        updatePlayback();
      } catch {
        failed = true;
        sceneManager?.dispose();
        sceneManager = undefined;
      } finally {
        isLoading = false;
      }
    };

    const observer = new IntersectionObserver((entries) => {
      inView = entries.some((entry) => entry.isIntersecting);
      wrapper.classList.toggle("scrolled", !inView);
      if (inView) void ensureScene();
      updatePlayback();
    }, { threshold: 0.25 });
    observer.observe(wrapper);
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("scroll", updatePlayback, { passive: true });
    document.addEventListener("visibilitychange", updatePlayback);
    motion.addEventListener("change", updatePlayback);

    onCleanup(() => {
      disposed = true;
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", updatePlayback);
      document.removeEventListener("visibilitychange", updatePlayback);
      motion.removeEventListener("change", updatePlayback);
      sceneManager?.dispose();
    });
  });

  return (
    <div
      ref={wrapper}
      aria-hidden="true"
      class="absolute top-0 left-0 h-full mx-auto w-full def__animate -z-1 opacity-15 blur not-dark:invert not-dark:hue-rotate-145 brightness-200 pointer-events-none"
    />
  );
}
