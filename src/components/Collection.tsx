import { Accessor, createMemo, createSignal, For, Show } from "solid-js";
import { CollectionCell } from "./CollectionCell";
import ProjectFilters from "./ProjectFilters";
import type { PortfolioCollection } from "~/types";
import { disciplineTags, filterPortfolio } from "~/utils/portfolio-filters";

type FilterState = { get: Accessor<string[]>; set: (values: string[]) => void };

export default function CollectionGrid(props: {
  data: PortfolioCollection[];
  sortByTags?: FilterState;
  sortByClients?: FilterState;
  onResetFilters?: () => void;
  enableSearch?: boolean;
  enableFull?: boolean;
}) {
  const [localTags, setLocalTags] = createSignal<string[]>([]);
  const [localClients, setLocalClients] = createSignal<string[]>([]);
  const tags = createMemo(() => disciplineTags(props.sortByTags?.get() ?? localTags()));
  const clients = createMemo(() => [...new Set(props.sortByClients?.get() ?? localClients())]);
  const allTags = createMemo(() => disciplineTags(props.data.flatMap((project) => project.tags)));
  const allClients = createMemo(() => [...new Set(props.data.map((project) => project.clientName))]);
  const filteredData = createMemo(() => filterPortfolio(props.data, tags(), clients()));
  const updateTags = (values: string[]) => { setLocalTags(values); props.sortByTags?.set(values); };
  const updateClients = (values: string[]) => { setLocalClients(values); props.sortByClients?.set(values); };
  const clear = () => {
    setLocalTags([]);
    setLocalClients([]);
    if (props.onResetFilters) props.onResetFilters();
    else { props.sortByTags?.set([]); props.sortByClients?.set([]); }
  };
  const textButton = "inline-flex min-h-11 items-center gap-2 cursor-pointer text-sm font-medium text-neutral-700 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 dark:text-neutral-300 dark:hover:text-white";

  return (
    <section class="w-full pb-18">
      <Show when={props.enableSearch}>
        <ProjectFilters
          tags={tags()}
          clients={clients()}
          allTags={allTags()}
          allClients={allClients()}
          resultCount={filteredData().length}
          onTagsChange={updateTags}
          onClientsChange={updateClients}
          onReset={clear}
        />
      </Show>
      <Show when={filteredData().length} fallback={<div class="px-6 py-18 text-center text-neutral-700 dark:text-neutral-300"><p>No projects match these filters.</p><button type="button" class={textButton + " underline underline-offset-4 mt-3"} onClick={clear}>Reset filters</button></div>}>
        <div class="pt-8">
          <Show when={props.enableFull} fallback={<div class="md:px-12 w-full overflow-x-auto scroll-smooth" data-lenis-prevent-horizontal><div class="gap-x-6 flex justify-start w-full"><For each={filteredData()}>{(item) => <CollectionCell galleryCover={true} data={item} />}</For></div></div>}>
            <div class="grid grid-cols-1 gap-3 px-6 md:grid-cols-2 xl:grid-cols-3"><For each={filteredData()}>{(item) => <CollectionCell galleryCover={true} enableFull={true} data={item} />}</For></div>
          </Show>
        </div>
      </Show>
    </section>
  );
}
