import { A } from "@solidjs/router";
import { For } from "solid-js";
import { Tag } from "~/layout/Cards";
import { H1 } from "~/layout/Headings";
import data from "../../db.json";
import { PortfolioCollection } from "~/components/Collection";

const collectionData: PortfolioCollection[] = data;

export default function ProjectIndex() {
  return (
    <main class="w-full">
      <img
        src="/favicon.ico"
        class="-z-1 w-full object-cover h-full fixed top-0"
      />
      <section class="h-144 flex items-center justify-center border">
        <article class="flex flex-col items-center gap-6">
          <A
            href=""
            class="flex flex-col cursor-pointer def__animate hover:opacity-50 w-fit justify-center"
          >
            <img
              src="/favicon.ico"
              class="aspect-auto my-6 max-h-9 max-w-24 invert-light"
              loading="eager"
            />
          </A>
            <H1>Test</H1>
            <div class="flex gap-1">
              <For each={["test", "test", "test", "test", "test"]}>
                {(tag) => <Tag href="">{tag}</Tag>}
              </For>
            </div>
          <p><strong class="pb-1.5 bg-white/10 border-t border-t-white/20 px-3 py-1 mr-3 rounded">Objective:</strong>blahblahb blah</p>
        </article>
      </section>
    </main>
  );
}
