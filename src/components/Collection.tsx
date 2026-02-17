import { useSearchParams } from "@solidjs/router";
import {
  Accessor,
  createEffect,
  createSignal,
  For,
  JSXElement,
  onMount,
  Setter,
  Show,
} from "solid-js";
import { Tag } from "~/layout/Cards";
import { CollectionCell } from "./CollectionCell";
import { PortfolioCollection } from "~/types";

function CollectionRow({ children }: { children: JSXElement }) {
  return <div class="gap-x-6 flex justify-start w-full">{children}</div>;
}

export default function CollectionGrid({
  data,
  sortByTags,
  sortByClients,
  enableSearch = false,
  enableFull = false,
}: {
  data: PortfolioCollection[];
  sortByTags?: { get: Accessor<string[]>; set: Setter<string[]> };
  sortByClients?: { get: Accessor<string[]>; set: Setter<string[]> };
  enableSearch?: boolean;
  enableFull?: boolean;
}) {
  let clearFilter!: HTMLButtonElement;
  let tagsFilter!: HTMLButtonElement;
  let tagsMenu!: HTMLDivElement;
  let clientsFilter!: HTMLButtonElement;
  let clientsMenu!: HTMLDivElement;
  const allTags: string[] = [];
  const allClients: string[] = [];
  for (const project of data) {
    for (const tag of project.tags) {
      if (!allTags.includes(tag)) allTags.push(tag);
    }
    if (!allClients.includes(project.clientName))
      allClients.push(project.clientName);
  }

  const [showTagMenu, setShowTagMenu] = createSignal<boolean>(false);
  const [showClientMenu, setShowClientMenu] = createSignal<boolean>(false);
  const [tagSort, setTagSort] = createSignal<string[]>([]);
  const [clientSort, setClientSort] = createSignal<string[]>([]);
  const [sortedData, setSortedData] = createSignal<PortfolioCollection[]>();

  // New effect to sync internal tagSort with prop
  createEffect(() => {
    const incomingTags = sortByTags?.get();
    if (incomingTags) {
      setTagSort(incomingTags);
    } else {
      setTagSort([]); // Clear if no incoming tags
    }
  });

  // New effect to sync internal clientSort with prop
  createEffect(() => {
    const incomingClients = sortByClients?.get();
    if (incomingClients) {
      setClientSort(incomingClients);
    } else {
      setClientSort([]); // Clear if no incoming clients
    }
  });

  // This effect updates sortedData based on tagSort
  createEffect(() => {
    checkSortedData();
  });

  // This effect updates sortedData based on the data prop
  createEffect(() => {
    checkSortedData();
  }, [data]);

  // Moved out of onMount: React to changes in tagSort to update URL search params and parent state
  createEffect(() => {
    // searchParams and setSearchParams must be retrieved reactively inside the effect
    const [searchParams, setSearchParams] = useSearchParams();

    const currentTagsInUrl = searchParams.tags
      ? (searchParams.tags as string).split(",")
      : [];
    const currentTagsInProp = sortByTags?.get() || [];
    const tagsToSet = tagSort(); // The internal state of Collection

    const currentClientsInUrl = searchParams.client
      ? (searchParams.client as string).split(",")
      : [];
    const currentClientsInProp = sortByClients?.get() || [];
    const clientsToSet = clientSort(); // The internal state of Collection

    // Prevent redundant updates to parent's sortByTags
    if (JSON.stringify(currentTagsInProp) !== JSON.stringify(tagsToSet)) {
      sortByTags?.set(tagsToSet);
    }

    // Prevent redundant updates to parent's sortByClients
    if (JSON.stringify(currentClientsInProp) !== JSON.stringify(clientsToSet)) {
      sortByClients?.set(clientsToSet);
    }

    // Prevent redundant updates to URL search params
    const tagsChanged =
      JSON.stringify(currentTagsInUrl) !== JSON.stringify(tagsToSet);
    const clientsChanged =
      JSON.stringify(currentClientsInUrl) !== JSON.stringify(clientsToSet);

    if (tagsChanged || clientsChanged) {
      const newParams: Record<string, string> = {};
      if (tagsToSet.length > 0) {
        newParams.tags = tagsToSet.join();
      } else if (currentTagsInUrl.length > 0) {
        newParams.tags = "";
      }

      if (clientsToSet.length > 0) {
        newParams.client = clientsToSet.join();
      } else if (currentClientsInUrl.length > 0) {
        newParams.client = "";
      }

      setSearchParams(newParams);
    }
  });

  onMount(() => {
    // Initial check for sortByTags from parent might still be needed if it's set async
    document.body.addEventListener("click", (e) => {
      if (showTagMenu() && e.target !== tagsFilter) {
        setShowTagMenu(false);
        tagsMenu.classList.add("hidden");
      }
      if (showClientMenu() && e.target !== clientsFilter) {
        setShowClientMenu(false);
        clientsMenu.classList.add("hidden");
      }
    });
  });

  function checkSortedData() {
    const hasTagFilters = tagSort().length > 0;
    const hasClientFilters = clientSort().length > 0;

    if (hasTagFilters || hasClientFilters) {
      const tempData = filterData(tagSort(), clientSort());
      setSortedData(tempData);
    } else {
      setSortedData(data);
    }
  }

  function filterData(tags: string[], clients: string[]) {
    return data.filter((project) => {
      // Check tag match
      const hasTagMatch =
        tags.length === 0 || tags.some((tag) => project.tags.includes(tag));

      // Check client match
      const hasClientMatch =
        clients.length === 0 || clients.includes(project.clientName);

      // Return true if project matches both tag and client criteria
      return hasTagMatch && hasClientMatch;
    });
  }

  return (
    <section class="z-1 py-18 mx-auto">
      <Show when={enableSearch}>
        <div class="bg-neutral-100 dark:bg-black/90 border-t border-b md:border border-black/10 dark:border-white/10 z-2 mt-2 md:mt-10 p-1 md:rounded-xl flex items-center justify-between fixed not-md:w-full md:inset-x-[5vw] xl:inset-x-[15vw] 2xl:inset-x-[25vw]">
          <div class="flex gap-3 items-center justify-between w-full">
            <div class="flex justify-between w-full gap-3">
              <div class="flex relative pr-3 border-r border-r-black/10 dark:border-r-white/10">
                <button
                  ref={tagsFilter}
                  class="cursor-pointer font-semibold text-xs text-neutral-400 px-2 py-1 rounded-md"
                  onClick={(e) => {
                    setShowTagMenu(!showTagMenu());
                    if (showTagMenu()) tagsMenu.classList.remove("hidden");
                    else tagsMenu.classList.add("hidden");
                  }}
                >
                  Tags
                </button>
                <div
                  ref={tagsMenu}
                  class="z-1 hidden min-w-xs rounded-xl backdrop-blur-xl text-black dark:text-white bg-white/80 dark:bg-black/80 absolute mt-12 border border-black/10 text-sm"
                >
                  <div
                    class="flex flex-col py-3 max-h-60 overflow-x-auto"
                    style="scrollbar-width: none;"
                  >
                    <For each={allTags}>
                      {(tag) => {
                        return (
                          <span
                            class="mx-3 px-3 rounded-lg py-1 hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer"
                            onclick={() => {
                              if (!tagSort().includes(tag)) {
                                setTagSort([...tagSort(), tag]);
                              } else {
                                setTagSort(
                                  tagSort().filter((val) => val !== tag),
                                );
                              }
                            }}
                          >
                            {tagSort().includes(tag) ? `× ${tag}` : tag}
                          </span>
                        );
                      }}
                    </For>
                  </div>
                </div>
                <div class="hidden lg:flex relative">
                  <button
                    ref={clientsFilter}
                    class="cursor-pointer font-semibold text-xs text-neutral-400 px-2 py-1 rounded-md"
                    onClick={(e) => {
                      setShowClientMenu(!showClientMenu());
                      if (showClientMenu())
                        clientsMenu.classList.remove("hidden");
                      else clientsMenu.classList.add("hidden");
                    }}
                  >
                    Clients
                  </button>
                  <div
                    ref={clientsMenu}
                    class="z-1 hidden min-w-xs rounded-xl backdrop-blur-xl text-black dark:text-white bg-white/80 dark:bg-black/80 absolute mt-12 border border-black/10 text-sm"
                  >
                    <div
                      class="flex flex-col py-3 max-h-60 overflow-x-auto"
                      style="scrollbar-width: none;"
                    >
                      <For each={allClients}>
                        {(client) => {
                          return (
                            <span
                              class="mx-3 px-3 rounded-lg py-1 hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer"
                              onclick={() => {
                                if (!clientSort().includes(client)) {
                                  setClientSort([...clientSort(), client]);
                                } else {
                                  setClientSort(
                                    clientSort().filter(
                                      (val) => val !== client,
                                    ),
                                  );
                                }
                              }}
                            >
                              {clientSort().includes(client)
                                ? `× ${client}`
                                : client}
                            </span>
                          );
                        }}
                      </For>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="w-full items-center justify-start flex gap-1 overflow-x-auto"
                style="scrollbar-width: none;"
              >
                <For each={clientSort()}>
                  {(client) => (
                    <Tag
                      onClick={() => {
                        setClientSort(
                          clientSort().filter((val) => val !== client),
                        );
                      }}
                    >
                      {`× ${client}`}
                    </Tag>
                  )}
                </For>
                <For each={tagSort()}>
                  {(tag) => (
                    <Tag
                      onClick={() => {
                        setTagSort(tagSort().filter((val) => val !== tag));
                      }}
                    >
                      {`× ${tag}`}
                    </Tag>
                  )}
                </For>
              </div>
              <Show when={tagSort().length > 0 || clientSort().length > 0}>
                <button
                  ref={clearFilter}
                  class="lg:text-nowrap cursor-pointer font-semibold text-xs text-neutral-400 px-2 py-1 rounded-md"
                  onClick={() => {
                    sortByTags?.set([]);
                    sortByClients?.set([]);
                    setTagSort([]);
                    setClientSort([]);
                  }}
                >
                  Clear Filters
                </button>
              </Show>
            </div>
          </div>
        </div>
      </Show>
      <div class={`flex mx-auto flex-col lg:flex-row py-18`}>
        <Show
          when={!enableFull}
          fallback={
            <div class="flex flex-col gap-3 lg:grid lg:grid-cols-3 lg:gap-3 w-full px-6 pt-6 lg:pt-18">
              <For each={sortedData()}>
                {(item) => (
                  <CollectionCell
                    galleryCover={true}
                    enableFull={true}
                    data={item}
                  />
                )}
              </For>
            </div>
          }
        >
          <div
            class="md:px-12 gap-y-3 w-full grid overflow-x-auto scroll-smooth"
            style="scrollbar-width: none;"
          >
            <CollectionRow>
              <For each={sortedData()}>
                {(item) => <CollectionCell galleryCover={true} data={item} /> }
              </For>
            </CollectionRow>
            {/*
            <CollectionRow>
              <For each={sortedData()}>
                {(item, idx) =>
                  idx() % 2 ? (
                    <CollectionCell galleryCover={true} data={item} />
                  ) : null
                }
              </For>
            </CollectionRow>
            */}
          </div>
        </Show>
      </div>
    </section>
  );
}
