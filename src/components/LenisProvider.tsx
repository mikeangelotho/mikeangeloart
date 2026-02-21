import { onMount, onCleanup, createEffect } from "solid-js";
import Lenis from "lenis";
import { useLocation } from "@solidjs/router";

export default function LenisProvider(props: { children: any }) {
    let lenis: Lenis | undefined;
    const location = useLocation();

    createEffect(() => {
        location.pathname;
        lenis?.scrollTo(0, { immediate: true });
    });

    onMount(() => {
        lenis = new Lenis({
            smoothWheel: true,
            duration: 1.5,
            autoRaf: true
        });

        const raf = (time: number) => {
            lenis?.raf(time);
            requestAnimationFrame(raf);
        };

        requestAnimationFrame(raf);
    });

    onCleanup(() => {
        lenis?.destroy();
    });

    return props.children;
}