import { createSignal, type JSX, onCleanup, onMount } from "solid-js";

export function aboutWindowId(label: string) {
  return `about-window-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

export default function AboutWindow(props: {
  label: string;
  children: JSX.Element;
  close: () => void;
  active: boolean;
  raise: () => void;
  position: { x: number; y: number };
}) {
  let container!: HTMLElement;
  let stopDrag: (() => void) | undefined;
  let placed = false;
  const [desktop, setDesktop] = createSignal(false);

  const move = (x: number, y: number) => {
    const stage = container.parentElement!;
    container.style.left = `${Math.max(0, Math.min(x, stage.clientWidth - container.offsetWidth))}px`;
    container.style.top = `${Math.max(0, Math.min(y, stage.clientHeight - container.offsetHeight))}px`;
  };
  const resize = () => {
    const wide = window.innerWidth >= 1024;
    setDesktop(wide);
    if (!wide) {
      container.style.left = "";
      container.style.top = "";
      placed = false;
      stopDrag?.();
      return;
    }
    const stage = container.parentElement!;
    move(
      placed ? parseFloat(container.style.left) || 0 : stage.clientWidth * props.position.x,
      placed ? parseFloat(container.style.top) || 0 : stage.clientHeight * props.position.y,
    );
    placed = true;
  };

  onMount(() => {
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    observer.observe(container.parentElement!);
    window.addEventListener("resize", resize);
    onCleanup(() => {
      stopDrag?.();
      observer.disconnect();
      window.removeEventListener("resize", resize);
    });
  });

  const drag = (event: PointerEvent) => {
    props.raise();
    if (!desktop() || event.button !== 0) return;
    stopDrag?.();
    event.preventDefault();
    const pointerId = event.pointerId;
    const startX = event.clientX;
    const startY = event.clientY;
    const left = parseFloat(container.style.left) || 0;
    const top = parseFloat(container.style.top) || 0;
    const pointerMove = (next: PointerEvent) => {
      if (next.pointerId === pointerId) move(left + next.clientX - startX, top + next.clientY - startY);
    };
    const stop = (next?: PointerEvent) => {
      if (next && next.pointerId !== pointerId) return;
      window.removeEventListener("pointermove", pointerMove);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
      window.removeEventListener("blur", blur);
      stopDrag = undefined;
    };
    const blur = () => stop();
    stopDrag = stop;
    window.addEventListener("pointermove", pointerMove);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    window.addEventListener("blur", blur);
  };
  const keyMove = (event: KeyboardEvent) => {
    if (!desktop() || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    event.preventDefault();
    props.raise();
    const distance = event.shiftKey ? 30 : 10;
    const x = event.key === "ArrowLeft" ? -distance : event.key === "ArrowRight" ? distance : 0;
    const y = event.key === "ArrowUp" ? -distance : event.key === "ArrowDown" ? distance : 0;
    move((parseFloat(container.style.left) || 0) + x, (parseFloat(container.style.top) || 0) + y);
  };

  return (
    <section
      ref={container}
      id={aboutWindowId(props.label)}
      aria-label={props.label}
      class={`about-window flex min-w-0 flex-col scroll-mt-28 lg:absolute lg:max-h-full ${props.label === "Profile Summary" ? "lg:w-[min(42rem,100%)]" : "lg:w-[min(24rem,100%)]"}`}
      classList={{ "is-active": props.active }}
      style={{ "z-index": props.active ? 20 : 1 }}
      onFocusIn={props.raise}
      onPointerDown={props.raise}
    >
      <div class="about-window-title flex shrink-0 items-center justify-between gap-2">
        <button
          type="button"
          data-window-title
          class="min-h-11 min-w-0 flex-1 truncate px-4 text-left font-mono text-xs lg:cursor-grab lg:touch-none"
          aria-label={`${desktop() ? "Focus and move" : "Focus"} ${props.label} window`}
          onPointerDown={drag}
          onKeyDown={keyMove}
        >
          <span aria-hidden="true" class="mr-2 inline-block h-1.5 w-1.5 rounded-sm bg-current opacity-50" />
          {props.label}
        </button>
        <button type="button" aria-label={`Close ${props.label} window`} class="about-window-close mr-1 flex min-h-11 min-w-11 items-center justify-center rounded-md text-lg" onClick={props.close}>×</button>
      </div>
      <div
        class="about-window-body min-h-0 min-w-0 p-4 sm:p-6 lg:overflow-y-auto"
        role="region"
        aria-label={`${props.label} content`}
        tabIndex={desktop() ? 0 : undefined}
        data-lenis-prevent={desktop() ? true : undefined}
      >
        {props.children}
      </div>
    </section>
  );
}
