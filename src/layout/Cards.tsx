import { A } from "@solidjs/router";

export const Tag = ({
  children,
  href,
  onClick,
}: {
  children: string;
  href?: string;
  onClick?: () => void;
}) => {
  if (href) {
    return (
      <A
        href={href}
        onClick={onClick}
        class="def__animate w-fit text-xs px-3 py-1 rounded-full text-nowrap bg-white/50 dark:bg-white/5 border dark:border-white/20 border-black/25 dark:text-white/20 text-black/50 hover:opacity-50 text-center"
      >
        {children}
      </A>
    );
  } else {
    return (
      <span
        onClick={onClick}
        class="cursor-pointer def__animate w-fit text-xs px-3 py-1 rounded-full text-nowrap bg-white/50 dark:bg-white/5 border dark:border-white/20 border-black/25 dark:text-white/20 text-black/50 hover:opacity-50 text-center"
      >
        {children}
      </span>
    );
  }
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
  type,
  onClick,
}: {
  children: string;
  type: "submit" | "reset" | "button" | "menu" | undefined;
  onClick?: () => void;
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      class="w-full lg:w-fit cursor-pointer text-sm font-bold border border-white/10 hover:border-white/5 dark:border-black/10 dark:hover:border-black/5 def__animate text-white hover:text-white/50 dark:text-black dark:hover:text-black/50 px-6 py-3 rounded-lg bg-linear-to-tr from-neutral-900 to-neutral-600 hover:to-neutral-900 dark:from-neutral-300 from-50% dark:to-neutral-50 dark:hover:to-neutral-300"    >
      {children}
    </button>
  );
};
