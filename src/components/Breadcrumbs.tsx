import { For } from "solid-js";
import { A } from "@solidjs/router";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs(props: BreadcrumbsProps) {
  return (
    <nav 
      aria-label="Breadcrumb"
      class={`flex items-center space-x-2 text-sm text-black/60 dark:text-white/60 ${props.className || ""}`}
    >
      <For each={props.items}>
        {(item, index) => (
          <>
            {index() > 0 && (
              <span class="text-black/40 dark:text-white/40" aria-hidden="true">
                /
              </span>
            )}
            
            {index() === props.items.length - 1 ? (
              <span class="text-black dark:text-white font-medium" aria-current="page">
                {item.name}
              </span>
            ) : (
              <A
                href={item.url}
                class="hover:text-black dark:hover:text-white transition-colors duration-200 underline decoration-transparent hover:decoration-current"
              >
                {item.name}
              </A>
            )}
          </>
        )}
      </For>
    </nav>
  );
}