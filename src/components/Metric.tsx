export const Metric = ({ children, icon }: { children: string; icon: string }) => {
    return (
        <article class="flex items-center gap-3">
            <div class="border border-black/25 dark:border-white/25 p-1 " aria-hidden="true">
                <img src={icon} alt="" loading="lazy" width="32" height="32" class="w-8 h-8 dark:invert" />
            </div>
            <span class="uppercase text-xs font-bold tracking-widest text-black/65 dark:text-white/65">
                {children}
            </span>
        </article>
    );
};
