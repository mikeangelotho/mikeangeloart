import { A } from "@solidjs/router";

const tagClass =
  "inline-flex w-fit shrink-0 items-center whitespace-nowrap px-2 py-px text-sm font-medium text-black/65 dark:text-white/65 cursor-pointer hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black";

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
      <A href={href} onClick={onClick} aria-label={label} class={tagClass}>
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
  return <span class={tagClass}>{children}</span>;
};

export const ContainerLabel = ({ children }: { children: string }) => {
  return <span class="type-label flex items-center">{children}</span>;
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
      class="inline-flex min-h-11 w-fit items-center justify-center text-sm text-center cursor-pointer def__button font-normal border border-black/10 dark:border-white/10 def__animate bg-black text-white dark:bg-white dark:text-black hover:opacity-80 px-6 py-3"
    >
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
      class="w-full lg:w-fit min-h-11 cursor-pointer text-sm font-normal border border-black/10 dark:border-white/10 def__animate bg-black text-white dark:bg-white dark:text-black hover:opacity-80 px-6 py-3"
    >
      {children}
    </button>
  );
};
