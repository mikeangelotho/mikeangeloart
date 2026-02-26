import { A } from "@solidjs/router";
import { PortfolioCollection } from "~/types";

export function TeaserCard(props: { data: PortfolioCollection }) {
  return (
    <article class="fade__animate teaser-card group relative w-full h-56 rounded-xl cursor-pointer">
      <A href={`/projects/${props.data.slug}`} class="absolute inset-0">
        <img
          src={props.data.cover}
          class="h-full w-full object-cover transition-transform duration-500 rounded-xl"
          loading="lazy"
          alt={props.data.coverAlt}
        />
        <div class="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
        <div class="absolute bottom-0 left-0 right-0 p-3 md:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:transition-all duration-300 bg-linear-to-t from-black/60 to-transparent lg:bg-none">
          <span class="text-xs text-white/70 md:text-white/60 block">
            {props.data.clientName}
          </span>
          <p class="text-sm font-bold text-white line-clamp-2">
            {props.data.title}
          </p>
        </div>
      </A>
    </article>
  );
}
