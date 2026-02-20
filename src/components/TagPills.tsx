import { For } from "solid-js";
import { Tag } from "~/layout/Cards";
import { PortfolioCollection } from "~/types";

export default function TagPills(props: {
  collections?: PortfolioCollection[];
  tags?: string[];
}) {
  let tags: string[] = [];
  if (props.collections) {
    props.collections.forEach((entry) => {
      entry.tags.forEach((tag) => {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      });
    });
  } else if (props.tags) {
    tags = props.tags;
  }
  return (
    <>
      <For each={tags}>
        {(tag) => (
          <Tag href={`/projects?tags=${tag.replace(" ", "+")}`}>{tag}</Tag>
        )}
      </For>
    </>
  );
}
