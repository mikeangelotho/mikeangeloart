import { onMount, onCleanup, createContext, useContext, createSignal, createEffect } from "solid-js";
import { useLocation } from "@solidjs/router";
import Lenis from "lenis";

type RafCallback = (time: number, delta: number) => void;

interface LenisContextValue {
    lenis: () => Lenis | null;
    registerCallback: (cb: RafCallback) => () => void;
}

const LenisContext = createContext<LenisContextValue>();

export function useLenis() {
    return useContext(LenisContext);
}

export default function LenisProvider(props: { children: any }) {
    const [lenisInstance, setLenisInstance] = createSignal<Lenis | null>(null);
    const location = useLocation();
    const callbacks: Set<RafCallback> = new Set();
    let rafId: number;
    let lastTime = 0;

    onMount(() => {
        const lenis = new Lenis({
            duration: 1.25,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            autoRaf: true,
            prevent: (node) => {
                return node.hasAttribute('data-lenis-prevent');
            }
        });

        setLenisInstance(lenis);

        const raf = (time: number) => {
            const delta = lastTime ? Math.max(time - lastTime, 4) : 16;
            lastTime = time;
            callbacks.forEach(cb => cb(time, delta));
            rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);

        createEffect(() => {
            const currentPath = location.pathname;
            lenis.scrollTo(0, { immediate: true });
        });
    });

    const registerCallback = (cb: RafCallback) => {
        callbacks.add(cb);
        return () => callbacks.delete(cb);
    };

    onCleanup(() => {
        if (rafId) cancelAnimationFrame(rafId);
        lenisInstance()?.destroy();
    });

    const contextValue: LenisContextValue = {
        lenis: lenisInstance,
        registerCallback
    };

    return (
        <LenisContext.Provider value={contextValue}>
            {props.children}
        </LenisContext.Provider>
    );
}