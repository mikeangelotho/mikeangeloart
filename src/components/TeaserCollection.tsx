import { For, onCleanup, onMount } from "solid-js";
import { PortfolioCollection } from "~/types";
import { TeaserCard } from "./TeaserCard";

export default function TeaserCollection(props: { data: PortfolioCollection[]; limit?: number }) {
  let containerRef!: HTMLDivElement;

  const displayData = () => {
    return props.data.slice(3, 7);
  };

  if (displayData().length === 0) return null;

  onMount(() => {
    const cards = containerRef.querySelectorAll('.teaser-card');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target as HTMLElement;
            const index = Array.from(cards).indexOf(card);
            setTimeout(() => {
              card.classList.remove('opacity-0', 'translate-y-9', 'scrolled');
            }, index * 100);
            observer.unobserve(card);
          }
        });
      },
      { threshold: 0.1 }
    );

    cards.forEach(card => {
      card.classList.add('opacity-0', 'translate-y-9', 'scrolled');
      observer.observe(card);
    });

    onCleanup(() => observer.disconnect());
  });

  return (
    <div ref={containerRef} class="fade__animate mx-auto flex flex-col lg:flex-row gap-3 w-full justify-center items-center px-6">
      <For each={displayData()}>
        {(item) => <TeaserCard data={item} />}
      </For>
    </div>
  );
}
