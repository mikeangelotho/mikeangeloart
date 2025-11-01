import { A } from "@solidjs/router";

export const Tag = ({
  children,
  href,
  onClick,
}: {
  children: string;
  href: string;
  onClick?: () => void;
}) => {
  return (
    <A
      href={href}
      onClick={onClick}
      class="def__animate w-fit text-xs px-3 py-1 rounded-full text-nowrap bg-white/50 dark:bg-white/5 border dark:border-white/20 border-black/25 dark:text-white/20 text-black/50 hover:opacity-50 text-center"
    >
      {children}
    </A>
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
      class="text-xs uppercase font-bold tracking-wider border border-black/10 hover:border-black/5 dark:border-white/10 dark:hover:border-white/5 def__animate text-black hover:text-black/50 dark:text-white dark:hover:text-white/50 px-6 py-3 rounded-lg bg-linear-to-tr from-neutral-100 to-white hover:to-neutral-50 dark:from-neutral-950 from-50% dark:to-neutral-800 dark:hover:to-neutral-900"
    >
      {children}
    </A>
  );
};

export const Button = ({
  children,
  type,
}: {
  children: string;
  type: "submit" | "reset" | "button" | "menu" | undefined;
}) => {
  return (
    <button
      type={type}
      class="w-fit cursor-pointer text-xs uppercase tracking-wider font-bold border border-black/10 hover:border-black/5 dark:border-white/10 dark:hover:border-white/5 def__animate text-black hover:text-black/50 dark:text-white dark:hover:text-white/50 px-6 py-3 rounded-lg bg-linear-to-tr from-neutral-100 to-white hover:to-neutral-50 dark:from-neutral-950 from-50% dark:to-neutral-800 dark:hover:to-neutral-900"
    >
      {children}
    </button>
  );
};
