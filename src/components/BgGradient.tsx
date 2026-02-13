import { onMount, onCleanup } from 'solid-js';

export default function BgGradient() {
    let canvasRef!: HTMLCanvasElement;
    let staticRef!: HTMLCanvasElement;
    let animationFrameId: number;
    let time = 0;

    onMount(() => {
        const canvas = canvasRef;
        const staticCanvas = staticRef;
        window.addEventListener("mousemove", (e) => {

            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            canvas.style.translate = `${(mouseX - window.innerWidth / 2) * 0.015}px ${(mouseY - window.innerHeight / 2) * 0.015}px`;
        });
        const ctx = canvas.getContext('2d');
        const staticCtx = staticCanvas.getContext('2d');
        let width: number, height: number;

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        const createNoise = () => {
            if (staticCtx) {
                const imageData = staticCtx?.createImageData(staticCanvas.width, staticCanvas.height);
                const buffer32 = new Uint32Array(imageData.data.buffer);
                const len = buffer32.length;

                for (let i = 0; i < len; i++) {
                    if (Math.random() < 0.9) {
                        buffer32[i] = 0xff000000;
                    } else {
                        buffer32[i] = 0xffffffff;
                    }
                }

                staticCtx.putImageData(imageData, 0, 0);
            }
        }

        const drawGradient = () => {
            // Clear canvas
            if (ctx) {
                ctx.clearRect(0, 0, width, height);

                // Animated parameters for smooth movement (Vercel-style)
                const moveSpeed = 0.0075;
                const scaleSpeed = 0.0005;

                // Multiple moving focal points for more dynamic effect
                const focal1X = width / 1 + Math.sin(time * moveSpeed) * width * 0.25;
                const focal1Y = height * 0.75 + Math.cos(time * moveSpeed * 1) * height * 0.15;

                const focal2X = width / 4 + Math.sin(time * moveSpeed) * width * 0.25;
                const focal2Y = height * 0.75 + Math.cos(time * moveSpeed * 1) * height * 0.15;

                const scale = 2.25 + Math.sin(time * scaleSpeed) * 0.1;

                // First gradient - main blue glow
                const gradient1 = ctx.createRadialGradient(
                    focal1X, focal1Y, 0,
                    focal1X, focal1Y, height * 1 * scale
                );

                gradient1.addColorStop(0, 'rgba(0, 50, 100, 0.8)'); // Bright blue
                gradient1.addColorStop(0.3, 'rgba(0, 90, 200, 0.4)');
                gradient1.addColorStop(0.5, 'rgba(150, 60, 150, 0.2)');
                gradient1.addColorStop(0.7, 'rgba(0, 40, 100, 0.05)');
                gradient1.addColorStop(1, 'rgba(0, 20, 50, 0)'); // Fade to transparent

                ctx.fillStyle = gradient1;
                ctx.fillRect(0, 0, width, height);

                // Second gradient for depth
                const gradient2 = ctx.createRadialGradient(
                    focal2X, focal2Y, 0,
                    focal2X, focal2Y, height * 1 * scale
                );

                gradient2.addColorStop(0, 'rgba(200, 200, 255, 0.6)');
                gradient2.addColorStop(0.4, 'rgba(0, 100, 200, 0.3)');
                gradient2.addColorStop(0.6, 'rgba(0, 70, 150, 0.1)');
                gradient2.addColorStop(1, 'rgba(0, 40, 100, 0)');

                ctx.globalCompositeOperation = 'screen';
                ctx.fillStyle = gradient2;
                ctx.fillRect(0, 0, width, height);
                ctx.globalCompositeOperation = 'source-over';

                // Top black gradient overlay
                const topGradient = ctx.createLinearGradient(0, 0, 0, height * 0.5);
                topGradient.addColorStop(0, 'rgba(30, 30, 30, 1)'); // Pure black at top
                topGradient.addColorStop(0.5, 'rgba(30, 30, 30, 0.8)');
                topGradient.addColorStop(1, 'rgba(30, 30, 30, 0)'); // Fade out

                ctx.fillStyle = topGradient;
                ctx.fillRect(0, 0, width, height);
            }
        };

        const animate = () => {
            time++;
            drawGradient();
            animationFrameId = requestAnimationFrame(animate);
        };

        // Initialize
        resize();
        window.addEventListener('resize', resize);
        animate();

        // Cleanup
        onCleanup(() => {
            window.removeEventListener('resize', resize);
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        });
    });

    return (
        <div class="fixed inset-0 bg-black overflow-hidden not-dark:invert not-dark:hue-rotate-180 contrast-125 brightness-125">
            <canvas
                ref={canvasRef}
                class="transform-gpu perspective-midrange fixed inset-0 w-full h-full blur-3xl"
                style={{ "z-index": "1" }}
            />
            <canvas
                ref={staticRef}
                class="fixed inset-0 w-full h-full mix-blend-overlay opacity-3"
                style={{ "z-index": "1" }}
            />
            <div
                class="fixed inset-0 w-full h-full pointer-events-none"
                style={{ "z-index": "2" }}
            >
                {/* Your Lottie animation or other content goes here */}
            </div>
        </div>
    );
}