import { For } from "solid-js";
import { A } from "@solidjs/router";

interface BreadcrumbItem { name: string; url: string; }
interface BreadcrumbsProps { items: BreadcrumbItem[]; className?: string; }

export function Breadcrumbs(props: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" class={`text-sm text-black/65 dark:text-white/65 ${props.className || ""}`}>
      <ol class="flex flex-wrap items-center gap-x-2 gap-y-1">
        <For each={props.items}>
          {(item, index) => (
            <li class="inline-flex min-w-0 items-center gap-2">
              {index() > 0 && <span aria-hidden="true">/</span>}
              {index() === props.items.length - 1 ? (
                <span class="text-black dark:text-white font-medium" aria-current="page">{item.name}</span>
              ) : (
                <A href={item.url} class="inline-flex min-h-11 items-center hover:text-black dark:hover:text-white underline decoration-transparent hover:decoration-current">{item.name}</A>
              )}
            </li>
          )}
        </For>
      </ol>
    </nav>
  );
}
