import { onCleanup, onMount } from "solid-js";

export default function Panel3d(props: { model: string }) {
  let wrapper!: HTMLDivElement;
  let sceneManager: any = null;
  let isLoading = false; // Prevents double-imports

  onMount(() => {
    let resizeHandler: () => void;

    const observer = new IntersectionObserver(
      async (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle("scrolled", !entry.isIntersecting);

          if (entry.isIntersecting) {
            // Lazy load check
            if (!sceneManager && !isLoading) {
              isLoading = true;
              const mod = await import("~/three/SceneManager");
              sceneManager = new mod.default(8);
              
              resizeHandler = () => sceneManager.handleResize(wrapper);
              window.addEventListener("resize", resizeHandler);
              
              sceneManager.init(wrapper, props.model);
              isLoading = false;
            }

            // Only call if successfully loaded
            sceneManager?.startAnimation();
          } else {
            sceneManager?.stopAnimation();
          }
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(wrapper);

    onCleanup(() => {
      window.removeEventListener("resize", resizeHandler);
      observer.disconnect();
      sceneManager?.dispose();
    });
  });

  return (
    <div
      ref={wrapper}
      class="absolute top-0 left-0 h-full mx-auto w-full def__animate -z-1 opacity-15 blur not-dark:invert not-dark:hue-rotate-145 brightness-200 pointer-events-none"
    />
  );
}