import { createSignal, For, onMount, Show, Suspense } from "solid-js";
import { A, createAsync } from "@solidjs/router";
import type { PlaygroundCategory, PlaygroundItem, PlaygroundDB } from "~/types/playground";
import PlaygroundCard from "~/components/PlaygroundCard";
import PlaygroundFilters from "~/components/PlaygroundFilters";
import PlaygroundModal from "~/components/PlaygroundModal";
import SEO from "~/components/SEO";
import { H1 } from "~/layout/Headings";
import localData from "../../public/playground_db.json";

const PLAYGROUND_DB_CDN = "https://cdn.mikeangelo.art/playground_db.json";

const defaultCategories = [
  { id: "all" as const, label: "All Work" },
  { id: "spec-work" as const, label: "Spec Work" },
  { id: "motion" as const, label: "Motion" },
  { id: "code" as const, label: "Code" },
  { id: "github" as const, label: "GitHub" },
  { id: "photography" as const, label: "Photography" },
];

async function fetchPlaygroundData(): Promise<PlaygroundDB> {
  try {
    const res = await fetch(PLAYGROUND_DB_CDN);
    if (res.ok) {
      return res.json();
    }
  } catch (e) {
    console.warn("Failed to fetch from CDN, using local data:", e);
  }
  
  return localData as PlaygroundDB;
}

export default function Playground() {
  const [activeCategory, setActiveCategory] = createSignal<PlaygroundCategory | "all">("all");
  const [selectedItem, setSelectedItem] = createSignal<PlaygroundItem | null>(null);
  const [isVisible, setIsVisible] = createSignal(false);

  const playgroundData = createAsync<PlaygroundDB>(fetchPlaygroundData);

  const filteredItems = () => {
    const items = playgroundData()?.playgroundItems || [];
    if (activeCategory() === "all") return items;
    return items.filter((item) => item.category === activeCategory());
  };

  const categories = () => playgroundData()?.categories || defaultCategories;

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const hero = document.getElementById("playground-hero");
    if (hero) observer.observe(hero);

    return () => observer.disconnect();
  });

  return (
    <>
      <SEO
        title="Playground - Creative Work by Mike Angelo"
        description="Explore my creative playground: code experiments, spec work, motion graphics, and photography. A collection of creative projects and explorations."
        canonical="https://mikeangeloart.com/playground"
        ogImage="https://cdn.mikeangelo.art/og-default.png"
      />
      <main class="w-full min-h-screen bg-neutral-50 dark:bg-black pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <section
          id="playground-hero"
          class="max-w-7xl mx-auto mb-12 text-center"
        >
          <div
            class="space-y-4"
            style={{
              opacity: isVisible() ? 1 : 0,
              transform: isVisible() ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.8s ease-out",
            }}
          >
            <H1>Playground</H1>
            <p class="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              A collection of my creative work — from code experiments and spec designs to motion graphics and photography.
              Click any card to see the details.
            </p>
          </div>
        </section>

        <section class="max-w-7xl mx-auto">
          <Suspense fallback={<div class="flex justify-center py-8"><div class="w-8 h-8 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin" /></div>}>
            <PlaygroundFilters
              activeCategory={activeCategory()}
              onCategoryChange={setActiveCategory}
              categories={categories()}
            />
          </Suspense>

          <Suspense fallback={
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[200px]">
              <For each={Array(6).fill(null)}>
                {() => (
                  <div class="rounded-3xl bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
                )}
              </For>
            </div>
          }>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[200px]">
              <For each={filteredItems()}>
                {(item, index) => (
                  <PlaygroundCard
                    item={item}
                    index={index()}
                    onSelect={setSelectedItem}
                  />
                )}
              </For>
            </div>
          </Suspense>

          <Show when={filteredItems()?.length === 0}>
            <div class="text-center py-16">
              <p class="text-neutral-500">No work in this category yet.</p>
              <A href="/playground" class="text-black dark:text-white underline mt-2 inline-block">
                View all work
              </A>
            </div>
          </Show>
        </section>

        <section class="max-w-7xl mx-auto mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <div class="text-center">
            <p class="text-neutral-500 mb-4">Want to see more of my creative work?</p>
            <div class="flex flex-wrap justify-center gap-4">
              <a
                href="https://codepen.io/mikeangelo"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium hover:opacity-80 transition-opacity"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L1.5 6v12L12 24l10.5-6V6L12 0zm0 2.3l8.2 4.7v9.9L12 21.7l-8.2-4.8V7l8.2-4.7z"/>
                  <path d="M12 5.3l-6.5 3.8v7.7L12 20.3l6.5-3.5v-7.7L12 5.3z"/>
                </svg>
                CodePen
              </a>
              <a
                href="https://behance.net/mikeangelo"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium hover:opacity-80 transition-opacity"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/>
                </svg>
                Behance
              </a>
            </div>
          </div>
        </section>
      </main>

      <PlaygroundModal
        item={selectedItem()}
        onClose={() => setSelectedItem(null)}
      />
    </>
  );
}
