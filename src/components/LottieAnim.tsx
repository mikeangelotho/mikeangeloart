import { onMount, onCleanup, createSignal, createEffect } from "solid-js";

export const LottieAnim = (props: { url: string }) => {
  let container!: HTMLDivElement;
  const [isScrolling, setIsScrolling] = createSignal(false);

  onMount(async () => {
    createEffect(() => {
      if (isScrolling()) {
        setTimeout(() => {
          setIsScrolling(false);
        }, 150);
      }
    });

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
          progressiveLoad: true,
          preserveAspectRatio: "xMidYMid slice",
        },
      });

      const scrollHandler = () => {
        if (!isScrolling()) {
          const { scrollY } = window;
          if (scrollY > 600) {
            animation.pause();
          } else {
            animation.play();
          }
          setIsScrolling(true);
        }
      };

      window.addEventListener("scroll", scrollHandler);

      if (isMobile) {
        animation.setSpeed(0.7);
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
