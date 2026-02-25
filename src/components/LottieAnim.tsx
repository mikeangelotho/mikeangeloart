import { onMount, onCleanup } from "solid-js";

export const LottieAnim = (props: { url: string }) => {
  let container!: HTMLDivElement;
  let animation: any;

  onMount(async () => {
    const scrollYLimit = 200;
    let rafPending = false;

    const handleScroll = () => {
      if (rafPending || !animation) return;
      rafPending = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        if (scrollY > scrollYLimit) {
          animation.pause();
          container.classList.add("blur");
        } else {
          animation.play();
          container.classList.remove("blur");
        }
        rafPending = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    const initLottie = async () => {
      const lottie = (await import("lottie-web")).default;

      const isMobile =
        window.innerWidth < 768 ||
        /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);

      animation = lottie.loadAnimation({
        container,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: props.url,
      });

      animation.setSubframe(false);

      if (isMobile) {
        animation.setSpeed(0.8);
      }

      handleScroll();

      onCleanup(() => {
        animation.destroy();
        window.removeEventListener("scroll", handleScroll);
      });
    };

    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => initLottie(), { timeout: 2000 });
    } else {
      setTimeout(initLottie, 2000);
    }
  });

  return (
    <div
      ref={container}
      class="scale-350 md:scale-200 lg:scale-150 xl:scale-100 fade__animate fixed top-0 left-0 lg:left-1/6 w-full h-full not-dark:invert"
      style="pointer-events: none; will-change: transform;"
    />
  );
};

export default LottieAnim;
