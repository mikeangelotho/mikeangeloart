import BackToTop from "~/components/BackToTop";
import ThemeToggle from "~/components/ThemeToggle";

export default function Footer() {
  return (
    <footer class="w-full border-t border-t-black/10 bg-white px-4 py-4 text-xs text-black/65 sm:px-6 sm:py-6 dark:border-t-white/10 dark:bg-black dark:text-white/65">
      <div class="mx-auto grid w-full max-w-7xl grid-cols-[auto_auto_1fr] items-center gap-x-3">
        <span class="justify-self-start text-xl">
          <ThemeToggle />
        </span>
        <div class="justify-self-start">
          <BackToTop />
        </div>
        <div class="whitespace-nowrap text-right leading-relaxed">Copyright 2026 Mike Angelo</div>
      </div>
    </footer>
  );
}
