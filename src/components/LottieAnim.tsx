import { DotLottie } from "@lottiefiles/dotlottie-web";
import { onCleanup, onMount } from "solid-js";

export const LottieAnim = (props: { data: string }) => {
  let lottieCanvas!: HTMLCanvasElement;
  let containerDiv!: HTMLDivElement;

  onMount(() => {
    const isMobile =
      window.innerWidth < 768 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );

    const deviceMemory = (navigator as any).deviceMemory || 4;
    const isLowEndDevice = deviceMemory <= 4 || isMobile;

    // Desktop reference dimensions
    const DESKTOP_WIDTH = 1920;
    const DESKTOP_HEIGHT = 1080;

    const dotLottie = new DotLottie({
      canvas: lottieCanvas,
      data: props.data,
      autoplay: true,
      loop: true,
      mode: "forward",
      useFrameInterpolation: true,
      renderConfig: {
        devicePixelRatio: isLowEndDevice ? 0.5 : 1,
      },
    });

    dotLottie.setSpeed(isLowEndDevice ? 0.3 : 0.5);

    let animationFrameId: number;
    let lastFrameTime = 0;
    const targetFPS = isLowEndDevice ? 15 : 24;
    const frameInterval = 1000 / targetFPS;

    const throttledRender = (currentTime: number) => {
      const elapsed = currentTime - lastFrameTime;

      if (elapsed > frameInterval) {
        lastFrameTime = currentTime - (elapsed % frameInterval);
      }

      if (!document.hidden) {
        animationFrameId = requestAnimationFrame(throttledRender);
      }
    };

    const updateCanvasScale = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Calculate scale to cover viewport while maintaining aspect ratio
      const scaleX = viewportWidth / DESKTOP_WIDTH;
      const scaleY = viewportHeight / DESKTOP_HEIGHT;
      const scale = Math.max(scaleX, scaleY);

      // Apply scale via CSS transform
      lottieCanvas.style.transform = `translate(-50%, -50%) scale(${scale})`;
    };

    // Set fixed canvas size once
    const dpr = isLowEndDevice ? 0.5 : 1;
    lottieCanvas.width = DESKTOP_WIDTH * dpr;
    lottieCanvas.height = DESKTOP_HEIGHT * dpr;
    lottieCanvas.style.width = `${DESKTOP_WIDTH}px`;
    lottieCanvas.style.height = `${DESKTOP_HEIGHT}px`;

    // Initial scale
    updateCanvasScale();

    const handleResize = () => {
      updateCanvasScale();
    };

    const handleVisibility = () => {
      if (document.hidden) {
        dotLottie.pause();
        cancelAnimationFrame(animationFrameId);
      } else {
        dotLottie.play();
        animationFrameId = requestAnimationFrame(throttledRender);
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibility);

    animationFrameId = requestAnimationFrame(throttledRender);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && !document.hidden) {
            dotLottie.pause();
          } else if (entry.isIntersecting && !document.hidden) {
            dotLottie.play();
          }
        });
      },
      { threshold: 0.05 },
    );

    observer.observe(lottieCanvas);

    onCleanup(() => {
      observer.disconnect();
      dotLottie.destroy();
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
    });
  });

  return (
    <div ref={containerDiv} class="scale-125 fixed inset-0 overflow-hidden -z-10">
      <canvas
        ref={lottieCanvas}
        class="absolute top-1/2 left-1/2 mix-blend-overlay"
        style="will-change: transform; image-rendering: auto; transform-origin: center;"
      />
    </div>
  );
};