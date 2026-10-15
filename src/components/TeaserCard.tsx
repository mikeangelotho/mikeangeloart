import { A } from "@solidjs/router";
import { PortfolioCollection } from "~/types";

export function TeaserCard(props: { data: PortfolioCollection }) {
  return (
    <article class="fade__animate teaser-card group relative w-full h-56 cursor-pointer">
      <A href={`/projects/${props.data.slug}`} class="absolute inset-0">
        <img
          src={props.data.cover}
          class="h-full w-full object-cover transition-transform duration-500"
          loading="lazy"
          alt={props.data.coverAlt}
        />
        <div class="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
        <div class="flex flex-col absolute bottom-0 left-0 right-0 p-3 bg-linear-to-t from-black/60 to-transparent">
          <span class="text-sm text-white/70 md:text-white/60 block">
            {props.data.clientName}
          </span>
          <p class="font-bold text-white line-clamp-2">
            {props.data.title}
          </p>
          <p class="text-sm text-white/80">
            {props.data.caseStudy?.role}
          </p>
        </div>
      </A>
    </article>
  );
}
