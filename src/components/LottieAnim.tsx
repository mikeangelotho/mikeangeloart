import { onMount, onCleanup } from "solid-js";

export const LottieAnim = (props: { url: string }) => {
  let container!: HTMLDivElement;

  onMount(async () => {
    const lottie = (await import("lottie-web")).default;

    const isMobile =
      window.innerWidth < 768 ||
      /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);

    const animation = lottie.loadAnimation({
      container,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: props.url,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    });

    const scrollHandler = () => {
      const scrollY = window.scrollY;

      if (scrollY > 600) {
        animation.pause();
      } else {
        animation.play();
      }
    };

    window.addEventListener("scroll", scrollHandler, { passive: true });

    if (isMobile) {
      animation.setSpeed(0.8);
    }

    onCleanup(() => {
      animation.destroy();
      window.removeEventListener("scroll", scrollHandler);
    });
  });

  return (
    <div
      ref={container}
      class="fixed top-0 left-0 w-full h-full not-dark:invert"
      style="pointer-events: none;"
    />
  );
};

export default LottieAnim;
