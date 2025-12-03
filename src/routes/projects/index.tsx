import data from "../../db.json";
import Collection, { PortfolioCollection } from "~/components/Collection";
import { useSearchParams } from "@solidjs/router";
import { createEffect, createMemo, createSignal, onMount } from "solid-js";

const collectionData: PortfolioCollection[] = data;

export default function ProjectPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Make tags a memo that directly reads from searchParams.tags
  const tags = createMemo(() => {
    if (searchParams.tags) {
      return (searchParams.tags as string).split(",");
    }
    return [];
  });

  return (
    <main class="max-w-7xl mx-auto">
      <Collection
        sortByTags={{ get: tags, set: (newTags) => setSearchParams({ tags: (newTags as string[]).join() }) }}
        enableFull={true}
        data={collectionData}
        enableSearch={true}
      />
    </main>
  );
}
