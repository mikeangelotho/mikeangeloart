import type Lenis from "lenis";

export function decodeAnchor(hash: string) {
  const value = hash.startsWith("#") ? hash.slice(1) : hash;
  try { return decodeURIComponent(value); }
  catch { return value; }
}

export function anchorDestination(href: string, currentHref: string) {
  if (!href.includes("#")) return;
  try {
    const current = new URL(currentHref);
    const destination = new URL(href, current);
    if (destination.origin === current.origin) return destination;
  } catch { /* Leave malformed links to the browser. */ }
}

/** A native jump may leave an old animation alive, even at an identical target. */
export function synchronizeScroll(scrolling: Pick<Lenis, "stop" | "start" | "resize">) {
  scrolling.stop();
  scrolling.start();
  scrolling.resize();
}

export function findAnchor(hash: string): HTMLElement | number | undefined {
  const id = decodeAnchor(hash);
  if (!id) return 0;
  const target = document.getElementById(id) ||
    Array.from(document.getElementsByName(id)).find((element) => element instanceof HTMLAnchorElement);
  if (target instanceof HTMLElement) return target;
  if (id === "top") return 0;
}

export function focusScrollTarget(target: HTMLElement | number) {
  const element = typeof target === "number"
    ? document.querySelector<HTMLElement>("main h1") || document.querySelector<HTMLElement>("main")
    : target.querySelector<HTMLElement>("h1, h2, h3") || target;
  if (!element) return;
  if (!element.hasAttribute("tabindex")) {
    element.setAttribute("tabindex", "-1");
    element.addEventListener("blur", () => element.removeAttribute("tabindex"), { once: true });
  }
  element.focus({ preventScroll: true });
}
