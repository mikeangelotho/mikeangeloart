import { onMount, onCleanup, createSignal, createEffect } from "solid-js";

export default function BgGradient() {
  let canvas!: HTMLCanvasElement;

  const [bgReady, setBgReady] = createSignal(false);
  const [isPaused, setIsPaused] = createSignal(false);

  onMount(() => {
    const ctx = canvas.getContext("2d")!;

    let width = 0;
    let height = 0;
    let time = 0;
    let animationFrameId = 0;

    // Mouse tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    // Frame timing
    const TARGET_FPS = 30;
    const FRAME_INTERVAL = 1000 / TARGET_FPS;
    let lastFrameTime = 0;

    const drawGradient = () => {
      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const moveSpeed = 0.015;
      const scaleSpeed = 0.0005;
      const t = time * moveSpeed;

      const mouseInfluenceX = (mouseX - width / 2) * 1;
      const mouseInfluenceY = (mouseY - height / 2) * 1;

      const focal1X = width + Math.sin(t) * width * -0.25 + mouseInfluenceX;
      const focal1Y = height * 1.5 + Math.cos(t) * height * 0.15 + mouseInfluenceY;

      const focal2X = width * 0.1 + Math.sin(t) * width * 0.25;
      const focal2Y = height * 1.5 + Math.cos(t) * height * 0.15;

      const radiusScale = height * 0.75 * (3 + Math.sin(time * scaleSpeed) * 0.1);

      // First gradient — main blue glow
      const gradient1 = ctx.createRadialGradient(focal1X, focal1Y, 0, focal1X, focal1Y, radiusScale);
      gradient1.addColorStop(0, "rgba(100, 125, 200, 0.8)");
      gradient1.addColorStop(0.3, "rgba(150, 100, 200, 0.4)");
      gradient1.addColorStop(0.5, "rgba(150, 60, 150, 0.2)");
      gradient1.addColorStop(0.9, "rgba(0, 40, 100, 0.05)");
      gradient1.addColorStop(1, "rgba(0, 20, 50, 0)");

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, width, height);

      // Second gradient — depth layer
      const gradient2 = ctx.createRadialGradient(focal2X, focal2Y, 0, focal2X, focal2Y, radiusScale);
      gradient2.addColorStop(0, "rgba(255, 220, 255, 0.6)");
      gradient2.addColorStop(0.4, "rgba(0, 100, 200, 0.3)");
      gradient2.addColorStop(0.9, "rgba(0, 70, 150, 0.1)");
      gradient2.addColorStop(1, "rgba(0, 40, 100, 0)");

      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, width, height);

      // Top dark overlay
      ctx.globalCompositeOperation = "source-over";
      const topGradient = ctx.createLinearGradient(0, 0, 0, height * 0.6);
      topGradient.addColorStop(0, "rgba(30, 30, 30, 1)");
      topGradient.addColorStop(0.5, "rgba(30, 30, 30, 0.8)");
      topGradient.addColorStop(1, "rgba(30, 30, 30, 0)");

      ctx.fillStyle = topGradient;
      ctx.fillRect(0, 0, width, height);
    };

    const animate = (currentTime: number) => {
      const elapsed = currentTime - lastFrameTime;

      if (elapsed >= FRAME_INTERVAL) {
        lastFrameTime = currentTime - (elapsed % FRAME_INTERVAL);
        time++;
        drawGradient();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const startLoop = () => {
      if (animationFrameId) return; // already running
      lastFrameTime = performance.now();
      animationFrameId = requestAnimationFrame(animate);
    };

    const stopLoop = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }
    };

    // Start/stop loop in response to pause state
    createEffect(() => {
      if (isPaused()) {
        stopLoop();
      } else {
        startLoop();
      }
    });

    // Resize
    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;

      if (mouseX === 0 && mouseY === 0) {
        mouseX = targetMouseX = width / 2;
        mouseY = targetMouseY = height / 2;
      }
    };

    // Scroll handler — fully stop loop beyond threshold
    let scrollTimeout = 0;
    const handleScroll = () => {
      if (scrollTimeout) return;
      scrollTimeout = window.setTimeout(() => {
        setIsPaused(window.scrollY >= 1000);
        scrollTimeout = 0;
      }, 100);
    };

    // Mouse handler — throttled via rAF
    let mouseUpdateQueued = false;
    const handleMouseMove = (e: MouseEvent) => {
      if (mouseUpdateQueued) return;
      mouseUpdateQueued = true;
      requestAnimationFrame(() => {
        targetMouseX = e.clientX;
        targetMouseY = e.clientY;
        mouseUpdateQueued = false;
      });
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("scroll", handleScroll, { passive: true });

    setBgReady(true);

    createEffect(() => {
      if (bgReady()) {
        setTimeout(() => canvas.classList.add("opacity-100"), 150);
      }
    });

    onCleanup(() => {
      stopLoop();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    });
  });

  return (
    <div class="fixed top-0 left-0 inset-0 w-full h-full bg-linear-to-t from-blue-800 not-dark:from-cyan-400 to-transparent">
      <canvas
        ref={canvas}
        class="w-full h-full def__animate not-dark:invert not-dark:hue-rotate-145 contrast-125 brightness-125 saturate-200 opacity-0"
        style="image-rendering: auto; transform-origin: center;"
      />
    </div>
  );
}