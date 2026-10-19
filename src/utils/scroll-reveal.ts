/** Reveal below-fold content once, without hiding server-rendered or focused content. */
export function observeScrollReveals(elements: Iterable<HTMLElement>): () => void {
  const targets = Array.from(elements);
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (motion.matches || !("IntersectionObserver" in window)) return () => {};

  const reveal = (target: HTMLElement) => {
    target.dataset.scrollReveal = "visible";
    observer.unobserve(target);
  };
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) reveal(entry.target as HTMLElement);
    }
  }, { threshold: 0.01, rootMargin: "0px 0px -24px 0px" });
  const revealFocused = (event: FocusEvent) => reveal(event.currentTarget as HTMLElement);
  const updateMotion = () => {
    if (motion.matches) {
      targets.forEach(reveal);
      observer.disconnect();
    }
  };

  for (const target of targets) {
    const rect = target.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0
      && rect.left < window.innerWidth && rect.right > 0;
    if (inView || target.contains(document.activeElement)) continue;
    target.dataset.scrollReveal = "pending";
    target.addEventListener("focusin", revealFocused);
    observer.observe(target);
  }
  motion.addEventListener("change", updateMotion);

  return () => {
    observer.disconnect();
    motion.removeEventListener("change", updateMotion);
    for (const target of targets) {
      target.removeEventListener("focusin", revealFocused);
      delete target.dataset.scrollReveal;
    }
  };
}
