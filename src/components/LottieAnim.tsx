import { DotLottie } from "@lottiefiles/dotlottie-web";
import { createEffect, createSignal, onCleanup, onMount } from "solid-js";

export const LottieAnim = (props: { data: string }) => {
  let canvasContainer!: HTMLDivElement;
  const [isPaused, setIsPaused] = createSignal(false);

  onMount(() => {
    let lottieCanvas = document.createElement("canvas");
    lottieCanvas.className = "absolute top-1/2 left-1/2 mix-blend-overlay";
    lottieCanvas.style.willChange = "transform"; // More specific
    lottieCanvas.style.imageRendering = "auto";
    lottieCanvas.style.transformOrigin = "center";

    // Throttled scroll handler
    let scrollTimeout: number;
    const handleScroll = () => {
      if (scrollTimeout) return;
      scrollTimeout = window.setTimeout(() => {
        const scrollY = window.scrollY;
        setIsPaused(scrollY >= 800);
        scrollTimeout = 0;
      }, 100);
    };

    document.addEventListener("scroll", handleScroll, { passive: true });

    createEffect(() => {
      if (isPaused()) {
        dotLottie.pause();
      } else {
        dotLottie.play();
      }
    });

    const isMobile = window.innerWidth < 768 || 
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const deviceMemory = (navigator as any).deviceMemory || 4;
    const isLowEndDevice = deviceMemory <= 4 || isMobile;

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
        devicePixelRatio: isLowEndDevice ? .75 : 1,
      },
    });

    dotLottie.setSpeed(isLowEndDevice ? 0.5 : 1);

    const updateCanvasScale = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const scaleX = viewportWidth / DESKTOP_WIDTH;
      const scaleY = viewportHeight / DESKTOP_HEIGHT;
      const scale = Math.max(scaleX, scaleY);
      lottieCanvas.style.transform = `translate(-50%, -50%) scale(${scale})`;
    };

    // Set canvas size once
    const dpr = isLowEndDevice ? .1 : 2;
    lottieCanvas.width = DESKTOP_WIDTH * dpr;
    lottieCanvas.height = DESKTOP_HEIGHT * dpr;
    lottieCanvas.style.width = `${DESKTOP_WIDTH}px`;
    lottieCanvas.style.height = `${DESKTOP_HEIGHT}px`;

    updateCanvasScale();

    // Throttled resize
    let resizeTimeout: number;
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(updateCanvasScale, 150);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        dotLottie.pause();
      } else if (!isPaused()) {
        dotLottie.play();
      }
    };

    window.addEventListener("resize", handleResize, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && !document.hidden) {
            dotLottie.pause();
          } else if (entry.isIntersecting && !document.hidden && !isPaused()) {
            dotLottie.play();
          }
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(lottieCanvas);
    canvasContainer.appendChild(lottieCanvas);

    onCleanup(() => {
      observer.disconnect();
      dotLottie.destroy();
      if (scrollTimeout) clearTimeout(scrollTimeout);
      if (resizeTimeout) clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("scroll", handleScroll);
    });
  });

  return (
    <div ref={canvasContainer} class="scale-125 fixed inset-0 overflow-hidden -z-10 not-dark:invert" />
  );
};

export default LottieAnim