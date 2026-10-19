import { A } from "@solidjs/router";
import type { JSX } from "solid-js";

const tagClass =
  "inline-flex w-fit shrink-0 items-center whitespace-nowrap px-2 py-px text-sm font-medium text-black/65 dark:text-white/65 cursor-pointer hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black";

export const Tag = ({
  children,
  href,
  onClick,
  label,
}: {
  children: JSX.Element;
  href?: string;
  onClick?: () => void;
  label?: string;
}) => {
  if (href) {
    return (
      <A href={href} onClick={onClick} aria-label={label} class={`${tagClass} min-h-11`}>
        {children}
      </A>
    );
  } else if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        class={`${tagClass} min-h-11`}
      >
        {children}
      </button>
    );
  }
  return <span class={tagClass}>{children}</span>;
};
