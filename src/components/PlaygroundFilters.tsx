import { For } from "solid-js";
import type { PlaygroundCategory } from "~/types/playground";

interface Props {
  activeCategory: PlaygroundCategory | "all";
  onCategoryChange: (category: PlaygroundCategory | "all") => void;
  categories: { id: PlaygroundCategory | "all"; label: string }[];
}

export default function PlaygroundFilters(props: Props) {
  return (
    <div class="flex flex-wrap gap-2 justify-center mb-8">
      <For each={props.categories}>
        {(category) => (
          <button
            class="filter-btn px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
            classList={{
              "bg-black text-white dark:bg-white dark:text-black": props.activeCategory === category.id,
              "bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-700": props.activeCategory !== category.id,
            }}
            onClick={() => props.onCategoryChange(category.id)}
          >
            {category.label}
          </button>
        )}
      </For>
    </div>
  );
}
