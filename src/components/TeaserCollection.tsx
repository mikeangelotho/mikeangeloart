import { For } from "solid-js";
import { PortfolioCollection } from "~/types";
import { TeaserCard } from "./TeaserCard";

export default function TeaserCollection(props: { data: PortfolioCollection[]; limit?: number }) {
  const displayData = () => {
    return props.data.slice(3, 7);
  };

  if (displayData().length === 0) return null;

  return (
    <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-3 w-full justify-center items-center px-6 py-8">
      <For each={displayData()}>
        {(item) => <TeaserCard data={item} />}
      </For>
    </div>
  );
}
