import { createSignal, createUniqueId, For, onCleanup, onMount, Show } from "solid-js";
import { Tag } from "~/layout/Cards";
import ActionIcon from "~/components/ActionIcon";

type Group = "discipline" | "client";

export default function ProjectFilters(props: {
  tags: string[];
  clients: string[];
  allTags: string[];
  allClients: string[];
  resultCount: number;
  onTagsChange: (values: string[]) => void;
  onClientsChange: (values: string[]) => void;
  onReset: () => void;
}) {
  let container!: HTMLDivElement;
  const buttons: Partial<Record<Group, HTMLButtonElement>> = {};
  const id = createUniqueId();
  const [open, setOpen] = createSignal<Group | null>(null);
  const activeCount = () => props.tags.length + props.clients.length;
  const toggle = (values: string[], value: string) => values.includes(value)
    ? values.filter((item) => item !== value) : [...values, value];
  const groups = [
    { key: "discipline" as const, label: "Tags", options: () => props.allTags, selected: () => props.tags, change: (values: string[]) => props.onTagsChange(values) },
    { key: "client" as const, label: "Clients", options: () => props.allClients, selected: () => props.clients, change: (values: string[]) => props.onClientsChange(values) },
  ];
  const controlClass = "inline-flex min-h-11 shrink-0 items-center gap-2 px-1.5 text-xs font-medium cursor-pointer text-black/65 hover:bg-black/5 hover:text-black dark:text-white/65 dark:hover:bg-white/10 dark:hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-2";
  const remove = (group: Group, value: string) => {
    setOpen(null);
    if (group === "discipline") props.onTagsChange(props.tags.filter((tag) => tag !== value));
    else props.onClientsChange(props.clients.filter((client) => client !== value));
    buttons[group]?.focus();
  };
  const reset = () => {
    setOpen(null);
    props.onReset();
    buttons.discipline?.focus();
  };

  onMount(() => {
    const dismissOutside = (event: Event) => {
      if (open() && event.target instanceof Node && !container.contains(event.target)) setOpen(null);
    };
    const escape = (event: KeyboardEvent) => {
      const group = open();
      if (!group || event.key !== "Escape") return;
      event.preventDefault();
      setOpen(null);
      buttons[group]?.focus();
    };
    document.addEventListener("pointerdown", dismissOutside);
    document.addEventListener("focusin", dismissOutside);
    container.addEventListener("keydown", escape);
    onCleanup(() => {
      document.removeEventListener("pointerdown", dismissOutside);
      document.removeEventListener("focusin", dismissOutside);
      container.removeEventListener("keydown", escape);
    });
  });

  return (
    <div class="mx-auto max-w-3xl px-6">
      <div ref={container} class="relative" aria-label="Project filters">
        <div class="flex flex-wrap items-center gap-x-1 gap-y-1 border border-black/10 bg-black/3 p-1.5 dark:border-white/15 dark:bg-white/3">
          <div class="flex shrink-0 items-center gap-1">
            <For each={groups}>{(group) => (
              <button
                ref={(element) => { buttons[group.key] = element; }}
                type="button"
                class={controlClass}
                classList={{ "bg-black/5 dark:bg-white/10": open() === group.key }}
                aria-expanded={open() === group.key}
                aria-controls={`${id}-${group.key}`}
                onClick={() => setOpen(open() === group.key ? null : group.key)}
              >
                {group.label}
                <Show when={group.selected().length}><span class="hidden text-black/55 dark:text-white/65 sm:inline">({group.selected().length})</span></Show>
                <ActionIcon name="chevron-down" size={14} class={open() === group.key ? "rotate-180" : ""} />
              </button>
            )}</For>
          </div>
          <Show when={activeCount()}>
            <div class="order-3 flex w-full min-w-0 items-center gap-1.5 overflow-x-auto px-1 py-1 sm:order-none sm:w-auto sm:flex-1" aria-label="Active filters" data-lenis-prevent-horizontal>
              <For each={props.clients}>{(client) => <Tag label={`Remove client filter: ${client}`} onClick={() => remove("client", client)}>{client}<ActionIcon name="close" size={12} class="ml-1.5" /></Tag>}</For>
              <For each={props.tags}>{(tag) => <Tag label={`Remove discipline filter: ${tag}`} onClick={() => remove("discipline", tag)}>{tag}<ActionIcon name="close" size={12} class="ml-1.5" /></Tag>}</For>
            </div>
          </Show>
          <div class="ml-auto flex shrink-0 items-center gap-1">
            <Show when={activeCount()}><button type="button" class={controlClass} onClick={reset}>Reset</button></Show>
            <p class="text-xs text-black/55 dark:text-white/65 sm:px-1" role="status" aria-live="polite" aria-atomic="true">{props.resultCount} {props.resultCount === 1 ? "project" : "projects"}</p>
          </div>
        </div>
        <For each={groups}>{(group) => (
          <Show when={open() === group.key}>
            <fieldset id={`${id}-${group.key}`} class="absolute left-0 top-full z-30 mt-2 grid max-h-[min(60dvh,18rem)] w-full max-w-sm grid-cols-2 gap-x-1 overflow-y-auto overscroll-contain border border-black/10 bg-white p-2 dark:border-white/15 dark:bg-black" data-lenis-prevent>
              <legend class="sr-only">Filter by {group.key === "discipline" ? "discipline" : "client"}</legend>
              <For each={group.options()}>{(value) => (
                <label class="flex min-h-10 cursor-pointer items-center gap-2 px-2 text-xs text-black/65 hover:bg-black/5 dark:text-white/65 dark:hover:bg-white/10">
                  <input type="checkbox" checked={group.selected().includes(value)} onChange={() => group.change(toggle(group.selected(), value))} class="h-3.5 w-3.5 shrink-0 accent-black dark:accent-white" />
                  <span>{value}</span>
                </label>
              )}</For>
            </fieldset>
          </Show>
        )}</For>
      </div>
    </div>
  );
}
