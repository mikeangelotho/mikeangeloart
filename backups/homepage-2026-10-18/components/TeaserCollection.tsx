import { For, onCleanup, onMount } from "solid-js";
import { PortfolioCollection } from "~/types";
import { TeaserCard } from "./TeaserCard";

export default function TeaserCollection(props: { data: PortfolioCollection[]; limit?: number }) {
  let containerRef!: HTMLDivElement;
  const displayData = () => props.data.slice(3, 3 + (props.limit ?? 4));

  onMount(() => {
    const cards = Array.from(containerRef.querySelectorAll<HTMLElement>(".teaser-card"));
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timers = new Set<number>();
    const reveal = (card: HTMLElement) => card.classList.remove("opacity-0", "translate-y-9", "scrolled");
    const handleFocus = (event: FocusEvent) => {
      const card = (event.target as HTMLElement).closest<HTMLElement>(".teaser-card");
      if (card && containerRef.contains(card)) reveal(card);
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const card = entry.target as HTMLElement;
        const timer = window.setTimeout(() => {
          timers.delete(timer);
          reveal(card);
        }, cards.indexOf(card) * 100);
        timers.add(timer);
        observer.unobserve(card);
      });
    }, { threshold: 0.1 });

    const revealAll = () => {
      if (!motion.matches) return;
      observer.disconnect();
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
      cards.forEach(reveal);
    };
    if (motion.matches) {
      cards.forEach(reveal);
    } else {
      cards.forEach((card) => {
        card.classList.add("opacity-0", "translate-y-9", "scrolled");
        observer.observe(card);
      });
    }
    motion.addEventListener("change", revealAll);
    containerRef.addEventListener("focusin", handleFocus);
    onCleanup(() => {
      observer.disconnect();
      motion.removeEventListener("change", revealAll);
      containerRef.removeEventListener("focusin", handleFocus);
      timers.forEach((timer) => clearTimeout(timer));
    });
  });

  return (
    <div ref={containerRef} class="fade__animate mx-auto flex flex-col lg:flex-row gap-3 w-full justify-center items-center px-6">
      <For each={displayData()}>{(item) => <TeaserCard data={item} />}</For>
    </div>
  );
}
