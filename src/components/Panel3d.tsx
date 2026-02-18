import { onCleanup, onMount } from "solid-js";

export default function Panel3d(props: { model: string }) {
  let wrapper!: HTMLDivElement;

  onMount(() => {
    let sceneManager: any;
    let resizeHandler: () => void;

    const observer = new IntersectionObserver(
      async (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle("scrolled", !entry.isIntersecting);

          if (entry.isIntersecting) {
            // ⬇️ lazy load only when visible
            if (!sceneManager) {
              const mod = await import("~/three/SceneManager");
              const SceneManager = mod.default;

              sceneManager = new SceneManager(8);

              resizeHandler = () => {
                if (wrapper) {
                  sceneManager.handleResize(wrapper);
                }
              };

              sceneManager.init(wrapper, props.model);
              window.addEventListener("resize", resizeHandler);
            }

            sceneManager.startAnimation();
          } else {
            sceneManager?.stopAnimation();
          }
        }
      },
      { threshold: 0.5 }
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
      class="absolute top-0 left-0 h-full mx-auto w-full def__animate -z-1 opacity-15 dark:opacity-15 blur not-dark:invert not-dark:hue-rotate-145 brightness-200"
    />
  );
}
