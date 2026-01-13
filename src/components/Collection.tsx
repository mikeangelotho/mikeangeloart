import { A, useSearchParams } from "@solidjs/router";
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

interface Collection {
  uuid: string;
  id: number;
  author: string;
  slug: string;
  title: string;
  cover: string;
  tags: string[];
  dateAdded: string;
  lastModified: string;
}

export interface PortfolioCollection extends Collection {
  clientName: string;
  clientLogo: string;
  clientLogoAlt: string;
  coverAlt: string;
  projectObjective: string;
  mainKeypointMedia: Media;
  mainKeypointMetricOne: string;
  mainKeypointMetricTwo: string;
  mainKeypointDescription: string;
  projectKeypoints: PortfolioKeypoint[];
  projectVideos: Media[]
}

interface PortfolioKeypoint {
  title: string;
  description: string;
  media: {
    url: string;
    altText: string;
  }[];
}

export interface Media {
  title: string;
  client: string;
  url: string;
  thumbnail: string;
  altText: string;
  description: string;
}

function CollectionRow({ children }: { children: JSXElement }) {
  return <div class="gap-x-1 flex justify-start w-full">{children}</div>;
}

function CollectionCell({
  data,
  enableFull,
}: {
  data: PortfolioCollection;
  enableFull?: boolean;
}) {
  return (
    <article
      onMouseOver={(event) => {
        const cells = document.querySelectorAll(".cell-container");
        for (const cell of cells) {
          const target = event.currentTarget as Element;
          if (target !== cell) {
            cells.forEach((cell) => {
              cell.classList.add("saturate-0");
            });
          }
          cell.classList.add("brightness-103");
          event.preventDefault();
        }
      }}
      onMouseOut={(event) => {
        event.currentTarget.classList.remove("brightness-103");
        const cells = document.querySelectorAll(".cell-container");
        for (const cell of cells) {
          cell.classList.remove("saturate-0");
        }
      }}
      class={`group/card cell-container relative overflow-hidden hover:brightness-115 hover:saturate-125 def__animate ${!enableFull ? `w-72 h-96 xl:h-108 md:w-100 xl:w-xl` : `h-96 w-full`
        }`}
    >
      <A href={`/projects/${data.slug}`} class="h-full w-full">
        <img
          src={data.cover}
          class="h-full w-full object-cover"
          loading="lazy"
          alt={data.coverAlt}
        />
      </A>
      <div
        class="group-hover/card:opacity-100 opacity-0 z-1 p-1 top-0 rounded-xl def__animate w-12 h-12 flex justify-center items-center m-6 absolute backdrop-blur bg-white/30 dark:bg-black/30 backdrop-brightness-150 dark:backdrop-brightness-25 pointer-events-none"
      >
        <img
          src={data.clientLogo}
          class="brightness-0 dark:brightness-200 saturate-0 contrast-0 aspect-auto max-h-6"
          alt={data.clientLogoAlt}
        />
      </div>
      <div class="min-h-18 lg:min-h-12 justify-center lg:rounded-3xl w-full lg:w-auto lg:inset-x-3 flex flex-col gap-2 def__animate group/tag group-hover/card:opacity-100 p-6 lg:opacity-0 absolute bottom-0 lg:bottom-3 z-1 bg-white/50 dark:bg-black/30 mx-auto backdrop-blur-xl backdrop-brightness-140 dark:backdrop-brightness-25">
        <header class="flex flex-col">
          <A
            href={`/projects?client=${data.clientName}`}
            class="w-fit text-xs text-black/50 dark:text-white/50 hover:underline"
          >
            {data.clientName}
          </A>
          <A
            href={data.slug}
            class="w-fit font-bold text-black dark:text-white hover:underline"
          >
            {data.title}
          </A>
        </header>
        <div
          class="-mt-9 group-hover/tag:mt-0 flex gap-1 justify-start items-center group-hover/tag:opacity-100 opacity-0 w-full overflow-x-auto scroll-smooth def__animate"
          style="scrollbar-width: none;"
        >
          <For each={data.tags}>
            {(tag) => {
              return (
                <Tag href={`/projects?tags=${tag.replace(" ", "+")}`}>
                  {tag}
                </Tag>
              );
            }}
          </For>
        </div>
      </div>
    </article>
  );
}

export default function Collection({
  data,
  sortByTags,
  enableSearch = false,
  enableFull = false,
}: {
  data: PortfolioCollection[];
  sortByTags?: { get: Accessor<string[]>; set: Setter<string[]> };
  enableSearch?: boolean;
  enableFull?: boolean;
}) {
  let clearFilter!: HTMLButtonElement;
  let tagsFilter!: HTMLButtonElement;
  let tagsMenu!: HTMLDivElement;
  const allTags: string[] = [];
  for (const project of data) {
    for (const tag of project.tags) {
      if (!allTags.includes(tag)) allTags.push(tag);
    }
  }

  const [showTagMenu, setShowTagMenu] = createSignal<boolean>(false);
  const [tagSort, setTagSort] = createSignal<string[]>([]);
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

    const currentTagsInUrl = searchParams.tags ? (searchParams.tags as string).split(',') : [];
    const currentTagsInProp = sortByTags?.get() || [];
    const tagsToSet = tagSort(); // The internal state of Collection

    // Prevent redundant updates to parent's sortByTags
    if (JSON.stringify(currentTagsInProp) !== JSON.stringify(tagsToSet)) {
      sortByTags?.set(tagsToSet);
    }

    // Prevent redundant updates to URL search params
    if (JSON.stringify(currentTagsInUrl) !== JSON.stringify(tagsToSet)) {
      if (tagsToSet.length > 0) {
        setSearchParams({ tags: tagsToSet.join() });
      } else {
        setSearchParams({ tags: "" });
      }
    }
  });


  onMount(() => {
    // Initial check for sortByTags from parent might still be needed if it's set async
    document.body.addEventListener("click", (e) => {
      if (showTagMenu() && e.target !== tagsFilter) {
        setShowTagMenu(false);
        tagsMenu.classList.add("hidden");
      }
    });
  });

  function checkSortedData() {
    if (tagSort().length > 0) {
      const tempData = sortDataByTag(tagSort());
      setSortedData(tempData);
    } else {
      setSortedData(data);
    }
  }

  function sortDataByTag(tags: string[]) {
    const array: PortfolioCollection[] = [];
    for (const project of data) {
      for (const tag of project.tags) {
        if (tags.includes(tag)) {
          if (!array.includes(project)) array.push(project);
        }
      }
    }
    return array;
  }

  return (
    <section class="z-1 py-18 mx-auto">
      <Show when={enableSearch}>
        <div class="bg-neutral-100 dark:bg-neutral-900 border-t border-b md:border border-neutral-200 dark:border-neutral-950 z-2 mt-6 lg:mt-9 p-1 md:rounded-xl flex items-center justify-between fixed not-md:w-full md:inset-x-[5vw] xl:inset-x-[15vw] 2xl:inset-x-[25vw]">
          <div class="flex gap-3 items-center justify-between w-full">
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
                <div class="flex flex-col py-3 max-h-60 overflow-x-auto" style="scrollbar-width: none;">
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
                                tagSort().filter((val) => val !== tag)
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
            </div>
            <div class="w-full items-center justify-start flex gap-1 overflow-x-auto" style="scrollbar-width: none;">
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
            <Show when={tagSort().length > 0}>
              <button
                ref={clearFilter}
                class="text-nowrap cursor-pointer font-semibold text-xs text-neutral-400 px-2 py-1 rounded-md"
                onClick={() => {
                  sortByTags?.set([]);
                  setTagSort([]);
                }}
              >
                Clear Filters
              </button>
            </Show>
          </div>
        </div>
      </Show>
      <div
        class={`flex mx-auto flex-col lg:flex-row py-18`}
      >
        <Show
          when={!enableFull}
          fallback={
            <div class="flex flex-col gap-3 lg:grid lg:grid-cols-2 lg:gap-1 w-full px-6 pt-6 lg:pt-18">
              <For each={sortedData()}>
                {(item) => <CollectionCell enableFull={true} data={item} />}
              </For>
            </div>
          }
        >
          <div
            class="md:px-12 gap-y-1 w-full grid overflow-x-auto scroll-smooth"
            style="scrollbar-width: none;"
          >
            <CollectionRow>
              <For each={sortedData()}>
                {(item, idx) =>
                  idx() % 2 === 0 ? <CollectionCell data={item} /> : null
                }
              </For>
            </CollectionRow>
            <CollectionRow>
              <For each={sortedData()}>
                {(item, idx) =>
                  idx() % 2 ? <CollectionCell data={item} /> : null
                }
              </For>
            </CollectionRow>
          </div>
        </Show>
      </div>
    </section>
  );
}
