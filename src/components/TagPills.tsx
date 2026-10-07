import { createMemo, For } from "solid-js";
import { Tag } from "~/layout/Cards";
import { PortfolioCollection } from "~/types";
import { disciplineTags } from "~/utils/portfolio-filters";

export default function TagPills(props: {
  collections?: PortfolioCollection[];
  tags?: string[];
}) {
  const tags = createMemo(() =>
    disciplineTags(props.collections ? props.collections.flatMap((entry) => entry.tags) : props.tags || []),
  );
  return (
    <>
      <For each={tags()}>
        {(tag) => (
          <Tag href={`/projects?tags=${encodeURIComponent(tag)}`}>{tag}</Tag>
        )}
      </For>
    </>
  );
}
