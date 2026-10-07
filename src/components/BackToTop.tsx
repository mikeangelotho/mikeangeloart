import { useLenis } from "~/components/LenisProvider";

export default function BackToTop() {
  const scrolling = useLenis();

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => scrolling?.scrollToTop()}
      class="group inline-flex min-h-11 cursor-pointer items-center gap-3 rounded-full border border-neutral-300 px-4 text-xs text-neutral-600 hover:border-cyan-700/50 hover:text-cyan-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-700 motion-safe:transition-colors dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-cyan-400/50 dark:hover:text-cyan-200 dark:focus-visible:outline-cyan-300"
    >
      <span aria-hidden="true" class="font-mono text-[0.7rem] opacity-60">cd ~</span>
      <span>To top</span>
      <span aria-hidden="true" class="relative h-5 w-4 overflow-hidden">
        <svg
          viewBox="0 0 16 20"
          fill="none"
          class="h-5 w-4 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:-translate-y-1 motion-safe:group-focus-visible:-translate-y-1"
        >
          <path d="M8 15V5M4 9l4-4 4 4" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span class="absolute bottom-0 left-[7px] h-0.5 w-0.5 bg-current opacity-0 motion-safe:transition-opacity motion-safe:duration-300 motion-safe:group-hover:opacity-40 motion-safe:group-focus-visible:opacity-40" />
        <span class="absolute bottom-1 left-[7px] h-0.5 w-0.5 bg-current opacity-0 motion-safe:transition-opacity motion-safe:duration-300 motion-safe:group-hover:opacity-60 motion-safe:group-focus-visible:opacity-60" />
      </span>
    </button>
  );
}
