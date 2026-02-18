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
        progressiveLoad: true,
        preserveAspectRatio: "xMidYMid slice",
      },
    });

    if (isMobile) {
      animation.setSpeed(0.7);
    }

    onCleanup(() => {
      animation.destroy();
    });
  });

  return (
    <div
      ref={container}
      class="fixed top-0 left-0 w-full h-full"
      style="pointer-events: none;"
    />
  );
};

export default LottieAnim;
