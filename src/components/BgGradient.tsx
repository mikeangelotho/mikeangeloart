import { onMount, onCleanup, createSignal, Show, createEffect } from "solid-js";

export default function BgGradient() {
  let animationFrameId: number;
  let time = 0;

  let canvas!: HTMLCanvasElement;

  const [bgReady, setBgReady] = createSignal(false);
  const [isPaused, setIsPaused] = createSignal(false);

  // Mouse position for gradient influence
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  onMount(() => {
    const ctx = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true, // Better performance for animations
    })!;
    let width: number, height: number;

    const drawGradient = () => {
      // Smooth interpolation for mouse position (easing)
      mouseX += (targetMouseX - mouseX) * 0.5;
      mouseY += (targetMouseY - mouseY) * 0.5;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Animated parameters for smooth movement (Vercel-style)
      const moveSpeed = 0.015;
      const scaleSpeed = 0.0005;
      const timeMoveSpeed = time * moveSpeed;

      // Mouse influence on first gradient (subtle offset)
      const mouseInfluenceX = (mouseX - width / 2) * 0.15;
      const mouseInfluenceY = (mouseY - height / 2) * 0.15;

      // Multiple moving focal points for more dynamic effect
      const focal1X =
        width + Math.sin(timeMoveSpeed) * width * -0.25 + mouseInfluenceX;
      const focal1Y =
        height * 1.5 +
        Math.cos(timeMoveSpeed) * height * 0.15 +
        mouseInfluenceY;

      const focal2X = width * 0.1 + Math.sin(timeMoveSpeed) * width * 0.25;
      const focal2Y = height * 1.5 + Math.cos(timeMoveSpeed) * height * 0.15;

      const radiusScale =
        height * 0.75 * (3 + Math.sin(time * scaleSpeed) * 0.1);

      // First gradient - main blue glow
      const gradient1 = ctx.createRadialGradient(
        focal1X,
        focal1Y,
        0,
        focal1X,
        focal1Y,
        radiusScale,
      );

      gradient1.addColorStop(0, "rgba(100, 125, 200, 0.8)"); // Bright blue
      gradient1.addColorStop(0.3, "rgba(150, 100, 200, 0.4)");
      gradient1.addColorStop(0.5, "rgba(150, 60, 150, 0.2)");
      gradient1.addColorStop(0.9, "rgba(0, 40, 100, 0.05)");
      gradient1.addColorStop(1, "rgba(0, 20, 50, 0)"); // Fade to transparent

      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, width, height);

      // Second gradient for depth
      const gradient2 = ctx.createRadialGradient(
        focal2X,
        focal2Y,
        0,
        focal2X,
        focal2Y,
        radiusScale,
      );

      gradient2.addColorStop(0, "rgba(255, 220, 255, 0.6)");
      gradient2.addColorStop(0.4, "rgba(0, 100, 200, 0.3)");
      gradient2.addColorStop(0.9, "rgba(0, 70, 150, 0.1)");
      gradient2.addColorStop(1, "rgba(0, 40, 100, 0)");

      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";

      // Top black gradient overlay
      const topGradient = ctx.createLinearGradient(0, 0, 0, height * 0.6);
      topGradient.addColorStop(0, "rgba(30, 30, 30, 1)"); // Pure black at top
      topGradient.addColorStop(0.5, "rgba(30, 30, 30, 0.8)");
      topGradient.addColorStop(1, "rgba(30, 30, 30, 0)"); // Fade out

      ctx.fillStyle = topGradient;
      ctx.fillRect(0, 0, width, height);
    };

    let lastFrameTime = 0;
    const targetFPS = 30;
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - lastFrameTime;

      if (elapsed >= frameInterval) {
        lastFrameTime = currentTime - (elapsed % frameInterval);
        if (!isPaused()) time++;
        drawGradient();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;

      // Initialize mouse position to center if not set
      if (mouseX === 0 && mouseY === 0) {
        mouseX = targetMouseX = width / 2;
        mouseY = targetMouseY = height / 2;
      }
    };

    let scrollTimeout: number;
    const handleScroll = () => {
      if (scrollTimeout) return;
      scrollTimeout = window.setTimeout(() => {
        const { scrollY } = window;
        setIsPaused(scrollY >= 1000);
        scrollTimeout = 0;
      }, 100);
    };

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

    // Initialize
    resize();

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", resize, { passive: true });

    animationFrameId = requestAnimationFrame(animate);
    setBgReady(true);

    createEffect(() => {
      if (bgReady()) {
        setTimeout(() => {
          canvas.classList.add("opacity-100");
        }, 150);
      }
    });

    // Cleanup
    onCleanup(() => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("scroll", handleScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    });
  });

  return (
    <div class="fixed top-0 left-0 inset-0 w-full h-full bg-linear-to-t from-blue-800 not-dark:from-cyan-400 to-transparent">
      <canvas
        ref={canvas}
        class="w-full h-full def__animate not-dark:invert not-dark:hue-rotate-145 contrast-125 brightness-125 saturate-200 opacity-0"
        style="will-change: transform;image-rendering: auto;transform-origin: center;"
      ></canvas>
    </div>
  );
}
