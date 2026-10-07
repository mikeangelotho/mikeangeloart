import { A } from "@solidjs/router";

const tagClass = "inline-flex min-h-8 w-fit shrink-0 items-center whitespace-nowrap rounded-full border border-black/10 bg-white/60 px-2.5 text-xs font-medium text-neutral-600 transition-colors hover:border-black/25 hover:bg-neutral-100 hover:text-black dark:border-white/15 dark:bg-white/5 dark:text-neutral-300 dark:hover:border-white/30 dark:hover:bg-white/10 dark:hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer";

export const Tag = ({
  children,
  href,
  onClick,
  label,
}: {
  children: string;
  href?: string;
  onClick?: () => void;
  label?: string;
}) => {
  if (href) {
    return (
      <A
        href={href}
        onClick={onClick}
        aria-label={label}
        class={tagClass}
      >
        {children}
      </A>
    );
  } else if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        class={tagClass}
      >
        {children}
      </button>
    );
  }
  return (
    <span class={tagClass}>
      {children}
    </span>
  );
};

export const ContainerLabel = ({ children }: { children: string }) => {
  return (
    <span class="font-bold flex items-center text-xs tracking-widest uppercase">
      {children}
    </span>
  );
};

export const LinkButton = ({
  children,
  href,
}: {
  children: string;
  href: string;
}) => {
  return (
    <A
      href={href}
      class="w-full text-3xl block text-center lg:w-fit cursor-pointer def__button font-bold border border-white/10 hover:border-white/5 dark:border-black/10 dark:hover:border-black/5 def__animate text-white hover:text-white/50 dark:text-black dark:hover:text-black/50 px-18 py-6 lg:px-36 lg:py-9 rounded-lg bg-linear-to-tr from-neutral-900 to-neutral-600 hover:to-neutral-900 dark:from-neutral-300 from-50% dark:to-neutral-50 dark:hover:to-neutral-300">
      {children}
    </A>
  );
};

export const Button = ({
  children,
  type = "button",
  onClick,
}: {
  children: string;
  type?: "submit" | "reset" | "button";
  onClick?: () => void;
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      class="w-full lg:w-fit min-h-11 cursor-pointer text-sm font-bold border border-white/10 dark:border-black/10 def__animate text-white dark:text-black px-6 py-3 rounded-lg bg-linear-to-tr from-neutral-900 to-neutral-600 hover:to-neutral-900 dark:from-neutral-300 from-50% dark:to-neutral-50 dark:hover:to-neutral-300">
      {children}
    </button>
  );
};
