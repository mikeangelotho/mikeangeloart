import { onCleanup, onMount } from "solid-js";
import SceneManager from "~/three/SceneManager";

export default function Panel3d(props: { model: string }) {
  let wrapper!: HTMLDivElement;

  onMount(() => {
    const sceneManager = new SceneManager(8);

    // 1. Define the resize handler outside the observer
    const resizeHandler = () => {
      if (wrapper) {
        sceneManager.handleResize(wrapper);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("scrolled", !entry.isIntersecting);
          if (entry.isIntersecting) {
            if (sceneManager.container === null) {
              sceneManager.init(wrapper, props.model);
              // 2. Attach listener once initialization happens
              window.addEventListener("resize", resizeHandler);
            }
            sceneManager.startAnimation();
          } else {
            sceneManager.stopAnimation();
          }
        });
      },
      { threshold: 0.5 }, // Lowered threshold for better mobile detection
    );

    observer.observe(wrapper);

    onCleanup(() => {
      window.removeEventListener("resize", resizeHandler);
      observer.disconnect();
      sceneManager.dispose();
    });
  });

  return (
    <div
      ref={wrapper}
      class="absolute top-0 left-0 h-full mx-auto w-full def__animate -z-1 opacity-15 dark:opacity-15 blur not-dark:invert not-dark:hue-rotate-145 brightness-200"
    ></div>
  );
}
