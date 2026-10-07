import BackToTop from "~/components/BackToTop";
import ThemeToggle from "~/components/ThemeToggle";

export default function Footer() {
  return (
    <footer class="w-full border-t border-t-black/10 bg-white px-4 py-6 text-xs text-neutral-600 sm:px-6 dark:border-t-white/10 dark:bg-black dark:text-neutral-400">
      <div class="mx-auto grid w-full max-w-7xl grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 sm:grid-cols-[1fr_auto_1fr]">
        <span class="justify-self-start text-xl not-dark:invert">
          <ThemeToggle />
        </span>
        <div class="justify-self-end sm:justify-self-center">
          <BackToTop />
        </div>
        <div class="col-span-2 text-center leading-relaxed sm:col-span-1 sm:text-right">(L ╹ڡ╹ )&gt; ~ © 2026 Mike Angelo</div>
      </div>
    </footer>
  );
}
