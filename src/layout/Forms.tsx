import type { JSX } from "solid-js";

export const Label = (props: { children: string; for: string }) => {
  return (
    <label for={props.for} class="mb-2 text-sm text-black/65 dark:text-white/65">
      {props.children}
    </label>
  );
};

export const Input = ({
  type,
  name,
  placeholder,
  id,
  required,
  autocomplete,
}: {
  type: JSX.InputHTMLAttributes<HTMLInputElement>["type"];
  name: string;
  placeholder: string;
  id: string;
  required?: boolean;
  autocomplete?: string;
}) => {
  return (
    <input
      type={type}
      name={name}
      id={id}
      required={required}
      autocomplete={autocomplete}
      class="placeholder-black/55 dark:placeholder-white/65 bg-white dark:bg-white/3 text-black dark:text-white px-3 py-3 border border-black/15 dark:border-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white text-base"
      placeholder={placeholder}
    />
  );
};
